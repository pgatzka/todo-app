import { useEffect, useState } from "react";

type Health =
  | { ok: true; db: "connected" }
  | { ok: false; db: "error"; message: string };

export default function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then(async (res) => {
        const body = (await res.json()) as Health;
        setHealth(body);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Todo App</h1>
        <p className="text-sm text-slate-500">
          Scaffolding sanity check — Tailwind classes are applied and the API
          health endpoint is being queried.
        </p>
        <section className="rounded border border-slate-200 p-4">
          <h2 className="font-medium text-slate-700 mb-2">API health</h2>
          {error && <p className="text-red-600 text-sm">Error: {error}</p>}
          {!error && !health && (
            <p className="text-slate-500 text-sm">Checking…</p>
          )}
          {health && (
            <pre className="text-xs bg-slate-100 rounded p-3 overflow-x-auto">
              {JSON.stringify(health, null, 2)}
            </pre>
          )}
        </section>
      </div>
    </main>
  );
}
