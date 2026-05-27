"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { College } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { useCompare } from "@/hooks/useCompare";
import SearchBar from "@/components/college/SearchBar";
import CollegeFilters, { Filters } from "@/components/college/CollegeFilters";
import CollegeCard from "@/components/college/CollegeCard";
import ComparePanel from "@/components/college/ComparePanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

export default function CollegesPage() {
  const { data: session } = useSession();
  const [colleges, setColleges] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    location: "",
    minFees: "",
    maxFees: "",
    minRating: "",
  });

  const debouncedSearch = useDebounce(search, 300);
  const { compareIds, addCollege, removeCollege, clearCompare, isInCompare } = useCompare();
  const pageSize = 9;

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.location && { location: filters.location }),
        ...(filters.minFees && { minFees: filters.minFees }),
        ...(filters.maxFees && { maxFees: filters.maxFees }),
        ...(filters.minRating && { minRating: filters.minRating }),
      });

      const res = await fetch(`/api/colleges?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch colleges");
      
      const data = await res.json();
      setColleges(data.data);
      setTotal(data.total);
    } catch (err) {
      setError("Failed to load colleges. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters, page]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  useEffect(() => {
    if (session) {
      fetch("/api/saved")
        .then((res) => res.json())
        .then((data) => setSavedIds(data.map((s: { collegeId: string }) => s.collegeId)))
        .catch(() => {});
    }
  }, [session]);

  const handleSave = async (id: string) => {
    if (!session) return;
    const isSaved = savedIds.includes(id);
    const method = isSaved ? "DELETE" : "POST";
    
    try {
      const res = await fetch("/api/saved", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: id }),
      });
      if (res.ok) {
        setSavedIds((prev) => isSaved ? prev.filter((s) => s !== id) : [...prev, id]);
      }
    } catch {}
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Discover Colleges</h1>
        <p className="text-gray-500">Search and filter from top institutions</p>
      </header>

      <SearchBar value={search} onChange={(val) => { setSearch(val); setPage(1); }} />
      <CollegeFilters filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />

      {error && <div className="p-4 bg-red-50 text-red-500 rounded-lg">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No colleges found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              onCompare={() => isInCompare(college.id) ? removeCollege(college.id) : addCollege(college.id)}
              onSave={handleSave}
              isComparing={isInCompare(college.id)}
              isSaved={savedIds.includes(college.id)}
              compareDisabled={compareIds.length >= 3 && !isInCompare(college.id)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button variant="secondary" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Previous</Button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <Button variant="secondary" size="sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</Button>
        </div>
      )}

      <ComparePanel compareIds={compareIds} onClear={clearCompare} />
    </div>
  );
}