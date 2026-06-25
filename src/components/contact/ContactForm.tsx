"use client";

import { useState, useCallback, SyntheticEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { fetcher } from "@/src/lib/api";
import { useSession } from "next-auth/react";

const ContactForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, { errors: string[] }>>({});

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      if (!subject.trim() || !message.trim() || !email.trim()) {
        return;
      }
      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      setErrors({});

      try {
        const data = await fetcher("/contact", {
          method: "POST",
          body: JSON.stringify({ subject, message, email }),
        });
        if (data.success) {
          toast.success("Mesajınız uğurla göndərildi!");
          setSubject("");
          setMessage("");
          setEmail("");
          return;
        }
        if (data.errors && data.errors.properties) {
          setErrors(data.errors.properties);
        }
      } catch (err) {
        toast.error("Nəsə yanlış getdi");
      } finally {
        setIsSubmitting(false);
      }
    },
    [subject, message, email, router]
  );

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-2 uppercase tracking-wide">
            Mövzu
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Mövzunu daxil edin"
            maxLength={1000}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-400 disabled:opacity-60"
          />
          {errors.subject?.errors && (
            <span className="text-red-500">{errors.subject.errors[0]}</span>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-2 uppercase tracking-wide">
            E-poçt
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-poçt adresinizi daxil edin"
            maxLength={1000}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-400 disabled:opacity-60"
          />
          {errors.email?.errors && (
            <span className="text-red-500">{errors.email.errors[0]}</span>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-2 uppercase tracking-wide">
            Mesaj
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mesajınızı daxil edin…"
            maxLength={5000}
            disabled={isSubmitting}
            className="contact-textarea w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-400 disabled:opacity-60 font-sans leading-relaxed"
          />
          {errors.message?.errors && (
            <span className="text-red-500">{errors.message.errors[0]}</span>
          )}
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tabular-nums text-stone-400">
                {message.length} / {5000}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !subject.trim() || !message.trim() || !email.trim()}
          className="w-full flex cursor-pointer items-center justify-center gap-2 bg-stone-900 text-white py-3.5 px-6 rounded-xl text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Göndərilir…
            </>
          ) : (
            "Göndərin"
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
