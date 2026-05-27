"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { College } from "@/types";
import { Card } from "@/components/ui/Card";

interface Placements {
  avgSalary: number;
  placementRate: number;
  topRecruiters: string[];
}

const getP = (c: College) => c.placements as unknown as Placements;

function CompareContent() {
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = searchParams.get("ids");
    if (!ids) {
      setLoading(false);
      return;
    }
    fetch(`/api/compare?ids=${ids}`)
      .then((res) => res.json())
      .then((data) => setColleges(data))
      .catch(() => setColleges([]))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      Loading comparison...
    </div>
  );

  if (colleges.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No colleges selected</h1>
        <Link href="/colleges" className="text-blue-600 hover:underline">
          Browse Colleges
        </Link>
      </div>
    );
  }

  const bestFees = Math.min(...colleges.map((c) => c.fees));
  const bestRating = Math.max(...colleges.map((c) => c.rating));
  const bestSalary = Math.max(...colleges.map((c) => getP(c).avgSalary));
  const bestRate = Math.max(...colleges.map((c) => getP(c).placementRate));

  const rows = [
    {
      label: "Location",
      render: (c: College) => c.location,
    },
    {
      label: "Fees / Year",
      render: (c: College) => formatCurrency(c.fees),
      isBest: (c: College) => c.fees === bestFees,
    },
    {
      label: "Rating",
      render: (c: College) => `⭐ ${c.rating}`,
      isBest: (c: College) => c.rating === bestRating,
    },
    {
      label: "Placement Rate",
      render: (c: College) => `${getP(c).placementRate}%`,
      isBest: (c: College) => getP(c).placementRate === bestRate,
    },
    {
      label: "Avg Salary",
      render: (c: College) => formatCurrency(getP(c).avgSalary),
      isBest: (c: College) => getP(c).avgSalary === bestSalary,
    },
    {
      label: "Top Recruiters",
      render: (c: College) =>
        getP(c).topRecruiters.slice(0, 3).join(", "),
    },
    {
      label: "Courses",
      render: (c: College) => c.courses.join(", "),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Compare Colleges</h1>
        <Link href="/colleges" className="text-blue-600 hover:underline">
          ← Back
        </Link>
      </div>

      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="p-4 font-semibold text-gray-500 w-40">
                Feature
              </th>
              {colleges.map((c) => (
                <th key={c.id} className="p-4 font-bold">
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b">
                <td className="p-4 text-sm font-medium text-gray-500">
                  {row.label}
                </td>
                {colleges.map((c) => (
                  <td
                    key={c.id}
                    className={`p-4 text-sm ${
                      row.isBest?.(c)
                        ? "text-green-600 font-bold"
                        : "text-gray-900"
                    }`}
                  >
                    {row.render(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          Loading comparison...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}