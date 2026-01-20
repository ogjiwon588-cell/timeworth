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
  const [wageDigits, setWageDigits] = useState<string>("");
  const [hoursDigits, setHoursDigits] = useState<string>("");
  const [minutesDigits, setMinutesDigits] = useState<string>("");

  // ✅ 이번 방문에서 사용자가 직접 입력을 건드렸을 때만 CTA 노출
  const [interacted, setInteracted] = useState(false);

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

  const hasResult = interacted && pay > 0;

  const shareText = useMemo(() => {
    const wage = wageDigits ? `${formatNumberKR(wageDigits)}원` : "시급";
    const h = hoursDigits ? `${digitsOnly(hoursDigits)}시간` : "시간";
    const m = minutesDigits ? `${safeMinutes}분` : "분";
    const result = formatKRWFromNumber(pay);
    return `오늘 알바/작업으로 ${result} 벌었음. (시급 ${wage}, ${h} ${m})\nTimeWorth로 3초 계산:`;
  }, [wageDigits, hoursDigits, minutesDigits, pay, safeMinutes]);

  async function onShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: "TimeWorth", text: shareText, url });
        return;
      }
    } catch {
      // ignore cancellation
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
      alert("공유 문구 + 링크를 복사했어! 친구한테 붙여넣기 하면 돼.");
    } catch {
      alert("복사에 실패했어. 링크를 수동으로 복사해줘: " + url);
    }
  }

  const cardHref = `/card?pay=${encodeURIComponent(
    Math.round(pay)
  )}&wage=${encodeURIComponent(
    Number(wageDigits)
  )}&h=${encodeURIComponent(
    Number(hoursDigits)
  )}&m=${encodeURIComponent(
    safeMinutes
  )}`;

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
              autoComplete="off"
              placeholder="예: 15,000"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-lg outline-none focus:border-neutral-600"
              value={formatNumberKR(wageDigits)}
              onChange={(e) => {
                setInteracted(true);
                setWageDigits(digitsOnly(e.target.value));
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">시간</label>
              <input
                inputMode="numeric"
                autoComplete="off"
                placeholder="예: 2"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-lg outline-none focus:border-neutral-600"
                value={digitsOnly(hoursDigits)}
                onChange={(e) => {
                  setInteracted(true);
                  setHoursDigits(digitsOnly(e.target.value));
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-neutral-300">분 (0–59)</label>
              <input
                inputMode="numeric"
                autoComplete="off"
                placeholder="예: 30"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-lg outline-none focus:border-neutral-600"
                value={digitsOnly(minutesDigits)}
                onChange={(e) => {
                  setInteracted(true);
                  setMinutesDigits(digitsOnly(e.target.value));
                }}
              />
              <div className="text-xs text-neutral-500">
                * 59분 초과 입력 시 자동으로 59분 처리돼요 (현재: {safeMinutes}분)
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-5">
            <div className="text-sm text-neutral-400">결과</div>
            <div className="mt-1 text-4xl font-semibold tracking-tight">
              {formatKRWFromNumber(pay)}
            </div>
            <div className="mt-2 text-sm text-neutral-400">Your time is not free.</div>

            {hasResult ? (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onShare}
                    className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-100 hover:border-neutral-600"
                  >
                    결과 공유
                  </button>

                  <a
                    href="/donate"
                    className="rounded-xl bg-neutral-100 px-4 py-3 text-center text-sm font-semibold text-neutral-950 hover:opacity-90"
                  >
                    커피 한 잔 후원 ☕
                  </a>
                </div>

                <a
                  href={cardHref}
                  className="block rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-center text-sm font-medium text-neutral-100 hover:border-neutral-600"
                >
                  결과 카드 만들기 (스토리용)
                </a>

                <p className="text-xs text-neutral-500">
                  스토리에 올리면 친구들도 바로 계산할 수 있어.
                </p>
              </div>
            ) : (
              <p className="mt-4 text-xs text-neutral-500">
                숫자를 입력하면 공유/후원/카드 옵션이 뜹니다.
              </p>
            )}
          </div>
        </section>

        <footer className="mt-6 text-xs text-neutral-500">
          * 이 앱은 로컬 계산만 사용해요. 로그인/서버/추적 없음.
        </footer>
      </div>
    </main>
  );
}