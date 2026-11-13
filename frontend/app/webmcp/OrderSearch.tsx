"use client";

import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";

export function OrderSearch() {
  useFrontendTool({
    name: "searchOrders",
    description: "Search the signed-in user's orders by status",
    parameters: z.object({
      status: z.enum(["open", "shipped", "delivered"]),
    }),
    handler: async ({ status }) => {
      const orders = await searchOrders(status);
      return JSON.stringify(orders);
    },
    webmcp: {
      annotations: {
        readOnlyHint: true,
      },
    },
  });

  return null;
}

// HARNESS: `searchOrders()` is called by the doc's handler but never defined or imported on the page.
// Minimal mock so the tool can return something; without it the call throws "searchOrders is not defined".
async function searchOrders(status: "open" | "shipped" | "delivered") {
  return [
    { id: "A-1001", status, item: "Wireless headphones" },
    { id: "A-1002", status, item: "USB-C charger" },
  ];
}
