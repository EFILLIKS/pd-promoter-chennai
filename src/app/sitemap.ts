import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pdconstruction.in";

  // Base pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // Fetch dynamic projects from Supabase to add to sitemap
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: projects } = await supabase
        .from("projects")
        .select("title");

      if (projects && projects.length > 0) {
        const projectRoutes = projects.map((p) => {
          const slug = p.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

          return {
            url: `${baseUrl}/project/${slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          };
        });

        return [...routes, ...projectRoutes];
      }
    }
  } catch (error) {
    console.error("Error generating dynamic sitemap routes:", error);
  }

  return routes;
}
