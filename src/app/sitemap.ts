import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const pages: Array<{
    path: string;
    changeFrequency:
      | "daily"
      | "monthly"
      | "always"
      | "hourly"
      | "weekly"
      | "yearly"
      | "never";
    priority: number;
    lastModified: Date;
  }> = [
    {
      path: "",
      changeFrequency: "daily",
      priority: 1.0,
      lastModified: new Date(),
    },
    {
      path: "/login",
      changeFrequency: "monthly",
      priority: 0.5,
      lastModified: new Date(),
    },
  ];

  return pages.flatMap((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
