import { z } from "zod";

export const bookmarkTitleSchema = z.string().trim().min(1).max(100);
export const bookmarkUrlSchema = z.string().url();
export const bookmarkNoteSchema = z.string().trim().max(5000);

export const tagNameSchema = z.string().trim().max(50);
