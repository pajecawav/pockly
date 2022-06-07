import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const useSupabase = supabaseUrl && supabaseKey;

if (!useSupabase) {
	console.warn("WARNING: Not using Supabase");
}

export const supabase = useSupabase
	? createClient(supabaseUrl, supabaseKey)
	: null;
