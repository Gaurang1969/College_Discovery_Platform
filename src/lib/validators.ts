import { z } from "zod";

export const CollegeQuerySchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  minFees: z.coerce.number().optional(),
  maxFees: z.coerce.number().optional(),
  minRating: z.coerce.number().optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
});

export const CompareQuerySchema = z.object({
  ids: z.string().min(1, "ids are required"),
});

export const SaveCollegeSchema = z.object({
  collegeId: z.string().min(1),
});