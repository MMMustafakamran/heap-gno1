"use client"; // HARNESS: the page never shows where CustomChat is rendered; minimal page mounting it.
import { CustomChat } from "./custom-chat";

export default function HeadlessUiPage() {
  return (
    <div style={{ height: "100vh" }}>
      <CustomChat />
    </div>
  );
}
