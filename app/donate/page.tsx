"use client";

import { useMemo, useState } from "react";

const BANK_NAME = "toss"; // TODO
const ACCOUNT_HOLDER = "예금주주"; // TODO
const ACCOUNT_NUMBER = "1908-3630-1248"; // TODO

const SUGGESTED = [1000, 3000, 5000];

function formatKRW(n: number) {
  return "₩" + Math.round(n).toLocaleString("ko-KR");
}

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(SUGGESTED[1]);
  const [toast, setToast] = useState<string>("");

  const accountLine = useMemo(
    () => `(${BANK_NAME}) ${ACCOUNT_NUMBER} (${ACCOUNT_HOLDER})`,
    []
  );

  async function copyText(text: string, ok: string, fail: string) {
    try {
      await navigator.clipboard.writeText(text);
      setToast(오케이);
      window.setTimeout(() => setToast(""), 2200);
    } catch {
      setToast(fail);
      window.setTimeout(() => setToast(""), 2200);
    }
  }

  const donationMemo = useMemo(() => {
    return `TimeWorth 후원 ${formatKRW(selectedAmount)} / 메모: TimeWorth`;
  }, [selectedAmount]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-md px-5 py-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">후원하기 ☕</h1>
          <p className="text-neutral-400">
            광고 없이 유지하고 기능을 더 만들 수 있게 도와줘. (선택)
          </p>
        </header>

        <section className="mt-8 space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5">
          <div className="rounded-2xl bg-neutral-900 p-5">
            <div className="text-sm text-neutral-400">추천 금액</div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {SUGGESTED.map((amt) => {
                const active = selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={[
                      "rounded-xl px-3 py-3 text-sm font-semibold",
                      active
                        ? "bg-neutral-100 text-neutral-950"
                        : "border border-neutral-800 bg-neutral-950 text-neutral-100 hover:border-neutral-600",
                    ].join(" ")}
                  >
                    {formatKRW(amt)}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                copyText(
                  donationMemo,
                  "후원 문구 복사됨 ✅ 송금 메모에 붙여넣으면 끝!",
                  "복사 실패 😭 메모에 'TimeWorth'만 적어줘도 돼."
                )
              }
              className="mt-3 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-100 hover:border-neutral-600"
            >
              송금 메모 문구 복사
            </button>

            <p className="mt-2 text-xs text-neutral-500">
              메모/받는 분에 <span className="text-neutral-200">TimeWorth</span> 라고 적어주면
              누가 후원했는지 확인하기 쉬워.
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-5">
            <div className="text-sm text-neutral-400">계좌</div>
            <div className="mt-2 text-base font-semibold">{accountLine}</div>

            <button
              onClick={() =>
                copyText(
                  ACCOUNT_NUMBER,
                  "계좌번호 복사됨 ✅ 은행앱에 붙여넣기만 하면 돼!",
                  "복사 실패 😭 계좌번호를 길게 눌러서 직접 복사해줘."
                )
              }
              className="mt-3 w-full rounded-xl bg-neutral-100 px-4 py-3 text-sm font-semibold text-neutral-950 hover:opacity-90"
            >
              계좌번호 복사
            </button>

            <p className="mt-2 text-xs text-neutral-500">
              복사 후 은행앱에서 붙여넣기 → {formatKRW(selectedAmount)} 송금하면 끝.
            </p>
          </div>

          <a
            href="/"
            className="block rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-center text-sm font-medium text-neutral-100 hover:border-neutral-600"
          >
            계산하러 돌아가기
          </a>
        </section>

        {toast ? (
          <div className="fixed left-1/2 top-6 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-neutral-800 bg-neutral-950/95 px-4 py-3 text-sm text-neutral-100 shadow-lg">
            {toast}
          </div>
        ) : null}

        <footer className="mt-6 text-xs text-neutral-500">
          * 이 페이지는 안내용이고 결제 정보를 저장하지 않아.
        </footer>
      </div>
    </main>
  );
}