"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { countWords, MAX_WORD_COUNT } from "@/lib/validations";

export function EssayForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCount = countWords(content);
  const isOverLimit = wordCount > MAX_WORD_COUNT;
  const progress = Math.min((wordCount / MAX_WORD_COUNT) * 100, 100);

  const progressColor =
    progress > 90
      ? "bg-red-500"
      : progress > 75
      ? "bg-orange-500"
      : "bg-emerald-500";

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isOverLimit) return;
      if (!title.trim() || !content.trim()) {
        setError("Please fill in both title and essay content.");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      const toastId = toast.loading("Evaluating your essay…");

      try {
        const res = await fetch("/api/essays", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Submission failed");
        }

        toast.success("Essay evaluated!", { id: toastId });
        router.push(`/essays/${data.essay.id}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        toast.error(message, { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, content, isOverLimit, router]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-2 uppercase tracking-wide">
          Essay Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. The impact of social media on society"
          maxLength={200}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 disabled:opacity-60"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-2 uppercase tracking-wide">
          Essay Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste or type your essay here…"
          disabled={isSubmitting}
          className="essay-textarea w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 disabled:opacity-60 font-sans leading-relaxed"
        />

        {/* Word count bar */}
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="h-1 flex-1 bg-stone-100 rounded-full overflow-hidden mr-4">
              <div
                className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span
              className={`text-xs font-medium tabular-nums ${
                isOverLimit ? "text-red-600" : "text-stone-400"
              }`}
            >
              {wordCount} / {MAX_WORD_COUNT}
            </span>
          </div>
          {isOverLimit && (
            <p className="text-xs text-red-500">
              Please reduce by {wordCount - MAX_WORD_COUNT} word
              {wordCount - MAX_WORD_COUNT !== 1 ? "s" : ""}.
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || isOverLimit || !title.trim() || !content.trim()}
        className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-3.5 px-6 rounded-xl text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Evaluating…
          </>
        ) : (
          "Evaluate Essay"
        )}
      </button>
    </form>
  );
}
