"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface ComparePanelProps {
  compareIds: string[];
  onClear: () => void;
}

export default function ComparePanel({ compareIds, onClear }: ComparePanelProps) {
  const router = useRouter();

  if (compareIds.length === 0) return null;

  const handleCompare = () => {
    router.push(`/compare?ids=${compareIds.join(",")}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className="text-gray-900 font-semibold">
          {compareIds.length} {compareIds.length === 1 ? "College" : "Colleges"} Selected
        </p>
        
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear All
          </Button>
          <Button variant="primary" size="sm" onClick={handleCompare}>
            Compare Now
          </Button>
        </div>
      </div>
    </div>
  );
}