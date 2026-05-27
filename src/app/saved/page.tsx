"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { College } from "@/types"; // Ensure this path exists
import CollegeCard from "@/components/college/CollegeCard";
import { CollegeCardSkeleton } from "@/components/ui/Skeleton";
import { useCompare } from "@/hooks/useCompare";
import ComparePanel from "@/components/college/ComparePanel";
import { Button } from "@/components/ui/Button";

interface SavedItem {
  collegeId: string;
  college: College;
}

export default function SavedPage() {
  const { data: session, status } = useSession();
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    compareIds,
    addCollege,
    removeCollege,
    clearCompare,
    isInCompare,
  } = useCompare();

  useEffect(() => {
    if (status === "authenticated") fetchSaved();
    else if (status === "unauthenticated") setLoading(false);
  }, [status]);

  const fetchSaved = async () => {
    try {
      const res = await fetch("/api/saved");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSaved(data);
    } catch {
      setSaved([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (id: string) => {
    try {
      await fetch("/api/saved", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: id }),
      });
      setSaved((prev) => prev.filter((s) => s.collegeId !== id));
    } catch {
      // silent fail
    }
  };

  const handleCompare = (id: string) => {
    isInCompare(id) ? removeCollege(id) : addCollege(id);
  };

  if (status === "loading") return null;

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-xl text-gray-500 mb-4">
          Please login to view saved colleges
        </p>
        <Link href="/login">
          <Button variant="primary">Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Saved Colleges</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <CollegeCardSkeleton key={i} />
          ))}
        </div>
      ) : saved.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl mb-4">No saved colleges yet</p>
          <Link href="/colleges">
            <Button variant="primary">Browse Colleges</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map((item) => (
            <CollegeCard
              key={item.collegeId}
              college={item.college}
              onCompare={handleCompare}
              onSave={() => handleUnsave(item.collegeId)}
              isComparing={isInCompare(item.collegeId)}
              isSaved={true}
              compareDisabled={compareIds.length >= 3 && !isInCompare(item.collegeId)}
            />
          ))}
        </div>
      )}

      <ComparePanel compareIds={compareIds} onClear={clearCompare} />
    </div>
  );
}