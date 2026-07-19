import type { MetadataRoute } from "next";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#061012",
    theme_color: "#7dcea0",
    lang: "en",
    icons: [
      {
        src: "/icon.png",
        sizes: "128x128",
        type: "image/png",
      },
    ],
  };
}
