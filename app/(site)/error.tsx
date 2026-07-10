"use client";
export default function SiteError({ error }: { error: Error }) {
  return (
    <div style={{ padding: 40, fontFamily: "monospace" }}>
      <h1>Runtime error</h1>
      <pre style={{ whiteSpace: "pre-wrap", color: "red" }}>{error.message}</pre>
      <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, opacity: 0.7 }}>{error.stack}</pre>
    </div>
  );
}
