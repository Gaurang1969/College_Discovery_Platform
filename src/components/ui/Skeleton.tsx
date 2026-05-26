import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

export default function Skeleton({
  className = "",
  width = "w-full",
  height = "h-4",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`
        animate-pulse bg-gray-200 rounded-md
        ${width} ${height} ${className}
      `}
      {...props}
    />
  );
}

export function CollegeCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 animate-in fade-in duration-500">
      <Skeleton height="h-6" width="w-3/4" className="mb-3" />
      <Skeleton height="h-4" width="w-1/2" className="mb-2" />
      <Skeleton height="h-4" width="w-1/3" className="mb-4" />
      <Skeleton height="h-4" width="w-full" className="mb-2" />
      <Skeleton height="h-4" width="w-full" className="mb-4" />
      <div className="flex gap-2">
        <Skeleton height="h-9" width="w-24" />
        <Skeleton height="h-9" width="w-24" />
      </div>
    </div>
  );
}