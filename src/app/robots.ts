export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/public/"],
      disallow: ["/api/", "/dashboard"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}
