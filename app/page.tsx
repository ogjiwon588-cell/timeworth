"use client";

import { useMemo, useState } from "react";

function formatKRW(n: number) {
  if (!isFinite(n) || n <= 0) return "";
  return "₩" + Math.round(n).toLocaleString("ko-KR");
}

export default function Home() {
  const [wage, setWage] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");

  const pay = useMemo(() => {
    const w = Number(wage);
    const h = Number(hours);
    const m = Number(minutes);

    if (!isFinite(w) || !isFinite(h) || !isFinite(m)) return 0;
    if (w <= 0 || h < 0 || m < 0) return 0;

    const mm = Math.min(59, Math.floor(m));
    const totalMinutes = Math.floor(h) * 60 + mm;

    return (w * totalMinutes) / 60;
  }, [wage, hours, minutes]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-md px-5 py-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            내 시간은 얼마일까?
          </h1>
          <p className="text-neutral-400">
            시급과 시간을 넣으면 바로 금액이 나와요.
          </p>
        </div>

        <div className="mt-8 space-y-5 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5">
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">시급 (원)</label>
            <input
              inputMode="numeric"
              placeholder="예: 15000"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-lg outline-none focus:border-neutral-600"
              value={wage}
              onChange={(e) => setWage(e.target.value.replace(/[^\d]/g, ""))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">시간</label>
              <input
                inputMode="numeric"
                placeholder="예: 2"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-lg outline-none focus:border-neutral-600"
                value={hours}
                onChange={(e) => setHours(e.target.value.replace(/[^\d]/g, ""))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">분 (0–59)</label>
              <input
                inputMode="numeric"
                placeholder="예: 30"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-lg outline-none focus:border-neutral-600"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value.replace(/[^\d]/g, ""))}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-5">
            <div className="text-sm text-neutral-400">결과</div>
            <div className="mt-1 text-4xl font-semibold tracking-tight">
              {formatKRW(pay) || "—"}
            </div>
            <div className="mt-2 text-sm text-neutral-400">
              Your time is not free.
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-neutral-500">
          * 분은 0–59로 자동 처리돼요.
        </div>
      </div>
    </main>
  );
}