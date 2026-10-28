import { useState } from "react";

const API_URL = "http://localhost:3001";

export default function ExcelFormulaPage() {
  const [request, setRequest] = useState("");
  const [formula, setFormula] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateFormula = async () => {
    if (!request.trim()) {
      setError("Please describe what you want to calculate.");
      return;
    }

    setLoading(true);
    setError("");
    setFormula("");
    setExplanation("");

    try {
      const response = await fetch(
        `${API_URL}/api/excel-formula`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: request,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Formula generation failed."
        );
      }

      setFormula(data.formula || "");
      setExplanation(data.explanation || "");
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyFormula = async () => {
    if (!formula) return;

    try {
      await navigator.clipboard.writeText(formula);
    } catch {
      setError("Formula could not be copied.");
    }
  };

  return (
    <div className="min-h-screen bg-surface px-4 py-8 text-white md:px-8">

      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            CryvixAI
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Excel Formula Generator
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 md:text-base">
            Describe what you want to calculate in simple language
            and CryvixAI will generate the Excel formula for you.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 md:p-7">

          <label className="mb-3 block text-sm font-semibold text-white/80">
            What do you want to calculate?
          </label>

          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="Example: Add all sales from B2 to B20"
            rows={6}
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/50"
          />

          <div className="mt-4 flex flex-wrap gap-3">

            <button
              onClick={() =>
                setRequest(
                  "Add all sales from B2 to B20"
                )
              }
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition hover:bg-white/10"
            >
              SUM Example
            </button>

            <button
              onClick={() =>
                setRequest(
                  "Calculate the average of C2 to C20"
                )
              }
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition hover:bg-white/10"
            >
              AVERAGE Example
            </button>

            <button
              onClick={() =>
                setRequest(
                  "Find the highest value from D2 to D50"
                )
              }
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition hover:bg-white/10"
            >
              MAX Example
            </button>

          </div>

          <button
            onClick={generateFormula}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3.5 font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Generating Formula..."
              : "Generate Excel Formula"}
          </button>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

        </div>

        {formula && (
          <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-500/5 p-5 md:p-7">

            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">
                Generated Formula
              </h2>

              <button
                onClick={copyFormula}
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/15"
              >
                Copy
              </button>
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl bg-black/30 p-5">
              <code className="whitespace-pre-wrap break-words text-lg text-cyan-300">
                {formula}
              </code>
            </div>

            {explanation && (
              <div className="mt-5">
                <h3 className="mb-2 text-sm font-semibold text-white/80">
                  Explanation
                </h3>

                <p className="text-sm leading-6 text-white/60">
                  {explanation}
                </p>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}