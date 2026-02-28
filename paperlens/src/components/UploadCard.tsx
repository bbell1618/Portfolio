"use client";

import { useState, useRef, useCallback, type DragEvent, type FormEvent } from "react";

type Tab = "pdf" | "doi" | "text";

export default function UploadCard() {
  const [activeTab, setActiveTab] = useState<Tab>("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: { key: Tab; label: string }[] = [
    { key: "pdf", label: "Upload PDF" },
    { key: "doi", label: "DOI / URL" },
    { key: "text", label: "Paste Text" },
  ];

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const canSubmit =
    (activeTab === "pdf" && file) ||
    (activeTab === "doi" && url.trim()) ||
    (activeTab === "text" && text.trim());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setResult("");
    setError("");

    try {
      let res: Response;

      if (activeTab === "pdf" && file) {
        const formData = new FormData();
        formData.append("file", file);
        res = await fetch("/api/analyze", { method: "POST", body: formData });
      } else {
        const body =
          activeTab === "doi" ? { url: url.trim() } : { text: text.trim() };
        res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Request failed (${res.status})`);
      }

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setResult(accumulated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUrl("");
    setText("");
    setResult("");
    setError("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-navy-light rounded-2xl border border-navy-lighter p-6 md:p-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-navy rounded-lg p-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setError(""); }}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-accent text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-navy-lighter"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* PDF Upload */}
          {activeTab === "pdf" && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                isDragOver
                  ? "border-accent bg-accent/10 scale-[1.02]"
                  : file
                    ? "border-green-500 bg-green-500/5"
                    : "border-navy-lighter hover:border-accent/50 hover:bg-navy/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {file ? (
                <div>
                  <div className="text-3xl mb-2">&#128196;</div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-slate-400 text-sm mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="text-red-400 text-sm mt-2 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-3 text-slate-500">&#128228;</div>
                  <p className="text-white font-medium">
                    Drop your PDF here, or click to browse
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    .pdf files only, max 20 MB
                  </p>
                </div>
              )}
            </div>
          )}

          {/* DOI / URL */}
          {activeTab === "doi" && (
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Enter a DOI or paper URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. 10.1038/s41586-023-06600-9 or https://arxiv.org/abs/..."
                className="w-full bg-navy border border-navy-lighter rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
              />
            </div>
          )}

          {/* Raw Text */}
          {activeTab === "text" && (
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Paste the paper text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the abstract, full text, or relevant sections here..."
                rows={8}
                className="w-full bg-navy border border-navy-lighter rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition resize-y"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit || isLoading}
            className="w-full mt-6 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              "Analyze Paper"
            )}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 bg-navy-light rounded-2xl border border-navy-lighter p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Analysis Report</h3>
            <button
              onClick={handleReset}
              className="text-sm text-accent hover:text-accent-hover transition"
            >
              Analyze another
            </button>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap break-words [&_h2]:text-white [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_strong]:text-white">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
