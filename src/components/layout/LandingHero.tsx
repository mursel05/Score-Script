"use client";

import { signIn } from "next-auth/react";
import { PenLine, BarChart2, Zap, Shield } from "lucide-react";
import ContactForm from "../contact/ContactForm";

export function LandingHero() {
  return (
    <div className="min-h-screen bg-stone-50 paper-bg overflow-hidden">
      <nav className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <PenLine className="w-5 h-5 text-orange-700" strokeWidth={1.5} />
          <span className="font-serif text-xl text-stone-800">ScoreScript</span>
        </div>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="text-sm text-stone-600 cursor-pointer hover:text-stone-900 px-4 py-2 rounded-lg border border-stone-300 hover:border-stone-400 transition-colors"
        >
          Giriş edin
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="max-w-2xl fade-up">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-stone-900 mb-6">
            Essenizin
            <br />
            balını
            <br />
            <span className="text-orange-700">dərhal</span> bilin.
          </h1>

          <p className="text-lg text-stone-500 mb-10 leading-relaxed max-w-lg">
            Essenizinizi yapışdırın, bir neçə saniyə ərzində balı alın. ScoreScript
            yazınızı peşəkar meyarlarla qiymətləndirir — imtahan edənlərin etdiyi kimi.
          </p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="group inline-flex items-center cursor-pointer gap-3 bg-stone-900 text-stone-50 px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google ilə davam edin
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 fade-up-delay-1 fade-up">
          {[
            {
              icon: PenLine,
              title: "Yapışdırın və Qiymətləndirin",
              desc: "500 sözə qədər göndərmək imkanı və peşəkar qiymətləndirmə meyarları ilə bal alın.",
            },
            {
              icon: BarChart2,
              title: "İrəliləməni İzləyin",
              desc: "Şəxsi paneldə irəliləməni izləyin.",
            },
            {
              icon: Shield,
              title: "Meyarlara Əsaslanan",
              desc: "Peşəkar qiymətləndirmə meyarlarına əsasən qiymətləndirilin.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-stone-200 rounded-2xl p-6 hover:border-stone-300 transition-colors"
            >
              <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-4.5 h-4.5 text-orange-700" strokeWidth={1.5} />
              </div>
              <h3 className="font-medium text-stone-900 mb-2">{title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-20">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.05] text-stone-900 mb-6 fade-up">
            Əlaqə
          </h2>
          <p className="text-lg text-stone-500 mb-10 leading-relaxed fade-up-delay-1 fade-up">
            Hər hansı sualınız, təklifiniz və ya rəyiniz varsa, aşağıdakı formdan istifadə
            edərək bizimlə əlaqə saxlaya bilərsiniz. Biz tezliklə sizə cavab verəcəyik.
          </p>
          <ContactForm />
        </div>
      </main>
    </div>
  );
}
