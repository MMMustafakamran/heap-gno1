"use client";
// HARNESS: BarChart and barChartPropsSchema are used by the page but never shown (it only says it uses Recharts).
// Schema follows the agent tool: title, data[{label, value}].
import { z } from "zod";
import { Bar, BarChart as RBarChart, Tooltip, XAxis, YAxis } from "recharts";

export const barChartPropsSchema = z.object({
  title: z.string(),
  data: z.array(z.object({ label: z.string(), value: z.number() })),
});

export function BarChart(props: Partial<z.infer<typeof barChartPropsSchema>>) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h3>{props.title}</h3>
      <RBarChart width={420} height={240} data={props.data ?? []}>
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#6366f1" />
      </RBarChart>
    </div>
  );
}
