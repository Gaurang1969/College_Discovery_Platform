import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { College } from "@/types";

interface Placements {
  avgSalary: number;
  placementRate: number;
  topRecruiters: string[];
}

interface Props {
  params: { id: string };
}

async function getCollege(id: string): Promise<College | null> {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/colleges/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function CollegeDetailPage({ params }: Props) {
  const college = await getCollege(params.id);
  if (!college) return notFound();

  const placements = college.placements as unknown as Placements;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link
        href="/colleges"
        className="text-blue-600 hover:underline text-sm mb-6 inline-block"
      >
        ← Back to Colleges
      </Link>

      <Card className="p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {college.name}
          </h1>
          <Badge
            variant={
              college.rating >= 4.5
                ? "success"
                : college.rating >= 4.0
                ? "warning"
                : "danger"
            }
          >
            ⭐ {college.rating}
          </Badge>
        </div>
        <p className="text-gray-500 mb-2">📍 {college.location}</p>
        <p className="text-blue-600 font-semibold text-lg mb-6">
          {formatCurrency(college.fees)} / year
        </p>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Overview
        </h2>
        <p className="text-gray-700 leading-relaxed">{college.overview}</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Courses Offered
          </h2>
          <div className="flex flex-wrap gap-2">
            {college.courses.map((course) => (
              <Badge key={course} variant="default">
                {course}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Placements
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Avg Salary</span>
              <span className="font-semibold">
                {formatCurrency(placements.avgSalary)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Placement Rate</span>
              <span className="font-semibold">
                {placements.placementRate}%
              </span>
            </div>
            <div>
              <p className="text-gray-500 mb-2">Top Recruiters</p>
              <div className="flex flex-wrap gap-2">
                {placements.topRecruiters.map((r) => (
                  <Badge key={r} variant="success">
                    {r}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}