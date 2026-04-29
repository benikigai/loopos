import { Component, StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { RebootClientProvider } from "@reboot-dev/reboot-react";
import { LoopOsApp } from "./App";
import "../../index.css";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: unknown) {
    // eslint-disable-next-line no-console
    console.error("[LoopOS] Render error:", error, info);
  }
  render() {
    if (this.state.error) {
      const e = this.state.error as Error;
      return (
        <div
          style={{
            fontFamily: "monospace",
            color: "#f87171",
            background: "#0f0f12",
            padding: 20,
            minHeight: "100vh",
            whiteSpace: "pre-wrap",
            fontSize: 12,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
            LoopOS UI render error
          </div>
          <div style={{ marginBottom: 8 }}>{e?.name}: {e?.message}</div>
          <div style={{ color: "#8a8a92" }}>{e?.stack}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <RebootClientProvider>
        <ErrorBoundary>
          <LoopOsApp />
        </ErrorBoundary>
      </RebootClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
