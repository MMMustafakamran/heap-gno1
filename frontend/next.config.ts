import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false, // HARNESS: owner exception (QA-RULES §1), hides the Next.js "N Issues" badge
  // HARNESS: three doc pages import files the doc never shows (Module not found). One such route makes a
  // Turbopack dev server answer 500 (with that route's error) on every route, so their page files are named
  // page.broken-<name>.tsx and each is served only by its own dev server (HARNESS_BROKEN=<name>: subagents 3071,
  // readonly 3072, dynamic 3073; own build dir). The pages' code is unchanged.
  ...(process.env.HARNESS_BROKEN
    ? { pageExtensions: [`broken-${process.env.HARNESS_BROKEN}.tsx`, "tsx", "ts", "jsx", "js"], distDir: `.next-broken-${process.env.HARNESS_BROKEN}` }
    : { pageExtensions: ["tsx", "ts", "jsx", "js"] }),
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
