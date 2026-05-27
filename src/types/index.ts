import type { College, User, SavedCollege } from "@/generated/prisma";

export type { College, User, SavedCollege };

export interface CollegeListResponse {
  data: College[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  error: string;
}