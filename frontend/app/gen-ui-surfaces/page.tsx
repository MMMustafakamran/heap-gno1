"use client";
import { CopilotChat } from "@copilotkit/react-core/v2";
import { FeaturedProducts } from "./featured";

// HARNESS: sample products for the fallback row (the doc passes products but never shows any)
const PRODUCTS = [
  { name: "Trail Runner", price: 89, imageUrl: "https://picsum.photos/seed/a/200" },
  { name: "Road Racer", price: 129, imageUrl: "https://picsum.photos/seed/b/200" },
];

export default function Page() {
  return (
    <>
      <h2>Featured Products</h2>
      <div data-g2-featured>{/* HARNESS: wrapper so the recorder can find the target */}<FeaturedProducts products={PRODUCTS} /></div>
      <CopilotChat agentId="my_agent" />{/* HARNESS: agentId -> the quickstart Agno agent */}
    </>
  );
}
