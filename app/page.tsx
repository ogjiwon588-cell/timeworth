"use client";

import { useMemo, useState } from "react";

function digitsOnly(s: string) {
  return s.replace(/[^\d]/g, "");
}

function formatNumberKR(digits: string) {
  const d = digitsOnly(digits);
  if (!d) return "";
  return Number(d).toLocaleString("ko-KR");
}

function formatKRWFromNumber(n: number) {
  if (!isFinite(n) || n <= 0) return "—";
  return "₩" + Math.round(n).toLocaleString("ko-KR");
}

export default function Home() {
  // store raw digits only (no commas) in state
  const [wageDigits, setWageDigits] = useState<string>("");
  const [hoursDigits, setHoursDigits] = useState<string>("");
  const [minutesDigits, setMinutesDigits] = useState<string>("");

  const { pay, safeMinutes } = useMemo(() => {
    const wage = Number(wageDigits);
    const hours = Number(hoursDigits);
    const minutes = Number(minutesDigits);

    if (!isFinite(wage) || !isFinite(hours) || !isFinite(minutes)) {
      return { pay: 0, safeMinutes: 0 };
    }

    if (wage <= 0 || hours < 0 || minutes < 0) {
      return { pay: 0, safeMinutes: 0 };
    }

    const safeH = Math.floor(hours);
    const safeM = Math.min(59, Math.floor(minutes));
    const totalMinutes = safeH * 60 + safeM;

    return { pay: (wage * totalMinutes) / 60, safeMinutes: safeM };
  }, [wageDigits, hoursDigits, minutesDigits]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-md px-5 py-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">내 시간은 얼마일까?</h1>
          <p className="text-neutral-400">시급과 시간을 입력하면 바로 금액이 계산돼요.</p>
        </header>

        <section className="mt-8 space-y-5 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5">
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">시급 (원)</label>
            <input
              inputMode="numeric"
              placeholder="예: 15,000"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-lg outline-none focus:border-neutral-600"
              value={formatNumberKR(wageDigits)}
              onChange={(e) => setWageDigits(digitsOnly(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">시간</label>
              <input
                inputMode="numeric"
                placeholder="예: 2"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-lg outline-none focus:border-neutral-600"
                value={digitsOnly(hoursDigits)}
                onChange={(e) => setHoursDigits(digitsOnly(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-neutral-300">분 (0–59)</label>
              <input
                inputMode="numeric"
                placeholder="예: 30"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-lg outline-none focus:border-neutral-600"
                value={digitsOnly(minutesDigits)}
                onChange={(e) => setMinutesDigits(digitsOnly(e.target.value))}
              />
              <div className="text-xs text-neutral-500">
                * 59분 초과 입력 시 자동으로 59분 처리돼요 (현재: {safeMinutes}분).
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-5">
            <div className="text-sm text-neutral-400">결과</div>
            <div className="mt-1 text-4xl font-semibold tracking-tight">
              {formatKRWFromNumber(pay)}
            </div>
            <div className="mt-2 text-sm text-neutral-400">Your time is not free.</div>
          </div>
        </section>

        <footer className="mt-6 text-xs text-neutral-500">
          * 이 앱은 로컬 계산만 사용해요. 로그인/서버/추적 없음.
        </footer>
      </div>
    </main>
  );
}