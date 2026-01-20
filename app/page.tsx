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

  const [interacted, setInteracted] = useState(false);

  // ✅ 주휴 옵션 (MVP: 주 15시간 이상 + 주5일 기준 "하루치" 추가 가정)
  const [includeWeeklyHolidayPay, setIncludeWeeklyHolidayPay] = useState(false);

  const { pay, safeMinutes, workedHoursFloat, wage } = useMemo(() => {
    const wageN = Number(wageDigits);
    const hours = Number(hoursDigits);
    const minutes = Number(minutesDigits);

    if (!isFinite(wageN) || !isFinite(hours) || !isFinite(minutes)) {
      return { pay: 0, safeMinutes: 0, workedHoursFloat: 0, wage: 0 };
    }
    if (wageN <= 0 || hours < 0 || minutes < 0) {
      return { pay: 0, safeMinutes: 0, workedHoursFloat: 0, wage: 0 };
    }

    const safeH = Math.floor(hours);
    const safeM = Math.min(59, Math.floor(minutes));
    const totalMinutes = safeH * 60 + safeM;

    return {
      wage: wageN,
      pay: (wageN * totalMinutes) / 60,
      safeMinutes: safeM,
      workedHoursFloat: totalMinutes / 60,
    };
  }, [wageDigits, hoursDigits, minutesDigits]);

  const hasResult = interacted && pay > 0;

  // ✅ 주휴 포함 예상(하루치 추가 가정)
  const weeklyHolidayPay = includeWeeklyHolidayPay ? wage * workedHoursFloat : 0;
  const payWithWeeklyHoliday = pay + weeklyHolidayPay;

  const shareText = useMemo(() => {
    const wageText = wageDigits ? `${formatNumberKR(wageDigits)}원` : "시급";
    const h = hoursDigits ? `${digitsOnly(hoursDigits)}시간` : "시간";
    const m = minutesDigits ? `${safeMinutes}분` : "분";
    const result = formatKRWFromNumber(pay);
    return `오늘 알바/작업으로 ${result} 벌었음. (시급 ${wageText}, ${h} ${m})\nTimeWorth로 3초 계산:`;
  }, [wageDigits, hoursDigits, minutesDigits, pay, safeMinutes]);

  async function onShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "TimeWorth", text: shareText, url });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
      alert("공유 문구 + 링크를 복사했어! 친구한테 붙여넣기 하면 돼.");
    } catch {
      alert("복사에 실패했어. 링크를 수동으로 복사해줘: " + url);
    }
  }

  const cardHref = useMemo(() => {
    const w = Number(wageDigits || "0");
    const h = Number(hoursDigits || "0");
    const m = Number(safeMinutes || 0);
    const p = Math.round(pay || 0);
    return `/card?pay=${p}&wage=${w}&h=${h}&m=${m}`;
  }, [pay, wageDigits, hoursDigits, safeMinutes]);

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

          {/* ✅ 주휴 옵션 */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={includeWeeklyHolidayPay}
                onChange={(e) => {
                  setInteracted(true);
                  setIncludeWeeklyHolidayPay(e.target.checked);
                }}
              />
              <div>
                <div className="text-sm font-semibold text-neutral-100">
                  주휴수당 포함(주 15시간↑ 가정)
                </div>
                <div className="mt-1 text-xs text-neutral-400">
                  MVP 계산: 주5일 기준 “하루 평균 근로시간(오늘 입력한 시간)”만큼 추가 지급을 가정해요.
                  (정확 계산은 주 근무일/주 총시간이 필요)
                </div>
              </div>
            </label>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-5">
            <div className="text-sm text-neutral-400">결과</div>

            <div className="mt-2 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-neutral-400">기본 급여</span>
                <span className="text-2xl font-semibold">{formatKRWFromNumber(pay)}</span>
              </div>

              {includeWeeklyHolidayPay ? (
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-neutral-400">주휴 포함 예상</span>
                  <span className="text-2xl font-semibold">{formatKRWFromNumber(payWithWeeklyHoliday)}</span>
                </div>
              ) : null}
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
          * 이 앱은 로컬 계산만 사용해요. 주휴수당은 “주 15시간 이상 + 주5일” 가정의 간편 추정치입니다.
        </footer>
      </div>
    </main>
  );
}