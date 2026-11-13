"use client"; // HARNESS: the page never shows where CustomChat is rendered; minimal page mounting it.
import { CustomChat } from "./custom-chat";

export default function HeadlessUiPage() {
  return (
    // HARNESS: bottom padding keeps the input above the recorder's simulated taskbar (review 2026-11-13).
    <div style={{ height: "100vh", paddingBottom: 72, boxSizing: "border-box" }}>
      <CustomChat />
    </div>
  );
}
