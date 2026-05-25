import type { College, User, SavedCollege } from "@prisma/client";

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