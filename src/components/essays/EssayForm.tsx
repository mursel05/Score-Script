"use client";

import { useState, useCallback, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { countWords, MAX_WORD_COUNT, MIN_WORD_COUNT } from "@/src/lib/validations";

export function EssayForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, { errors: string[] }>>({});

  const wordCount = countWords(content);
  const isOverLimit = wordCount > MAX_WORD_COUNT;
  const progress = Math.min((wordCount / MIN_WORD_COUNT) * 100, 100);

  const progressColor =
    wordCount < MIN_WORD_COUNT
      ? "bg-orange-500"
      : wordCount > MAX_WORD_COUNT
        ? "bg-red-500"
        : "bg-emerald-500";

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      if (!title.trim() || !content.trim()) {
        return;
      }

      setIsSubmitting(true);
      setErrors({});

      const toastId = toast.loading("Evaluating your essay…");

      try {
        const res = await fetch("/api/essays", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success("Essay evaluated!", { id: toastId });
          router.push(`/essays/${data.essay.id}`);
          return;
        }
        if (data.details && data.details.properties) {
          setErrors(data.details.properties);
        }
      } catch (err) {
        toast.error("Something went wrong", { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, content, router]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-400 disabled:opacity-60"
        />
        {errors.title?.errors && (
          <span style={{ color: "red" }}>{errors.title.errors[0]}</span>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-500 mb-2 uppercase tracking-wide">
          Essay Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste or type your essay here…"
          disabled={isSubmitting}
          className="essay-textarea w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-400 disabled:opacity-60 font-sans leading-relaxed"
        />
        {errors.content?.errors && (
          <span style={{ color: "red" }}>{errors.content.errors[0]}</span>
        )}
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
              {wordCount} / {MIN_WORD_COUNT}
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isOverLimit || !title.trim() || !content.trim()}
        className="w-full flex cursor-pointer items-center justify-center gap-2 bg-stone-900 text-white py-3.5 px-6 rounded-xl text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
