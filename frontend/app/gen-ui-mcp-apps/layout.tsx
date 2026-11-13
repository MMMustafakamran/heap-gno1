// HARNESS: the doc's app/layout.tsx wraps {children} in <Providers>; the root layout here is shared by every
// doc-page route, so the wrap sits in this route's layout (styles.css is already imported by the root layout).
import { Providers } from "./providers";

export default function McpAppsLayout({ children }: {children: React.ReactNode}) {
  return <Providers>{children}</Providers>;
}
