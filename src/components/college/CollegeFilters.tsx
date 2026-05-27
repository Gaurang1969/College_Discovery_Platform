"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export interface Filters {
  location: string;
  minFees: string;
  maxFees: string;
  minRating: string;
}

interface CollegeFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function CollegeFilters({ filters, onChange }: CollegeFiltersProps) {
  const handleClear = () => {
    onChange({ location: "", minFees: "", maxFees: "", minRating: "" });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="Location"
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
          placeholder="e.g. Delhi"
        />
        <Input
          label="Min Fees (INR)"
          type="number"
          value={filters.minFees}
          onChange={(e) => onChange({ ...filters, minFees: e.target.value })}
          placeholder="e.g. 50000"
        />
        <Input
          label="Max Fees (INR)"
          type="number"
          value={filters.maxFees}
          onChange={(e) => onChange({ ...filters, maxFees: e.target.value })}
          placeholder="e.g. 500000"
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Min Rating</label>
          <select
            value={filters.minRating}
            onChange={(e) => onChange({ ...filters, minRating: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Any</option>
            <option value="3.0">3.0+</option>
            <option value="3.5">3.5+</option>
            <option value="4.0">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
}