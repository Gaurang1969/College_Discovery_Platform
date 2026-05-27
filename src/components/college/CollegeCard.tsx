"use client";

import { useRouter } from "next/navigation";
import { College } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface CollegeCardProps {
  college: College;
  onCompare: (id: string) => void;
  onSave: (id: string) => void;
  isComparing: boolean;
  isSaved: boolean;
  compareDisabled: boolean;
}

export default function CollegeCard({
  college,
  onCompare,
  onSave,
  isComparing,
  isSaved,
  compareDisabled,
}: CollegeCardProps) {
  const router = useRouter();

  const formatFees = (fees: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(fees);

  const getRatingVariant = (rating: number): "success" | "warning" | "danger" => {
    if (rating >= 4.5) return "success";
    if (rating >= 4.0) return "warning";
    return "danger";
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation(); // Prevents navigation when clicking buttons
    action();
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full">
      <div className="flex-1" onClick={() => router.push(`/colleges/${college.id}`)}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
            {college.name}
          </h3>
          <Badge variant={getRatingVariant(college.rating)}>
            ⭐ {college.rating}
          </Badge>
        </div>
        <p className="text-gray-500 text-sm mb-1">📍 {college.location}</p>
        <p className="text-blue-600 font-medium text-sm mb-3">
          {formatFees(college.fees)} / year
        </p>
        <div className="flex flex-wrap gap-1 mb-4">
          {college.courses.slice(0, 2).map((course) => (
            <Badge key={course} variant="default">
              {course}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-auto pt-2">
        <Button
          variant={isComparing ? "danger" : "secondary"}
          size="sm"
          onClick={(e) => handleAction(e, () => onCompare(college.id))}
          disabled={compareDisabled && !isComparing}
          className="flex-1"
        >
          {isComparing ? "Remove" : "Compare"}
        </Button>
        <Button
          variant={isSaved ? "danger" : "ghost"}
          size="sm"
          onClick={(e) => handleAction(e, () => onSave(college.id))}
          className="flex-1"
        >
          {isSaved ? "Unsave" : "Save"}
        </Button>
      </div>
    </Card>
  );
}