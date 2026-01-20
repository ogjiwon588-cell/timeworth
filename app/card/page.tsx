"use client";

import { useSearchParams } from "next/navigation";

function formatKRW(n: number) {
  if (!isFinite(n) || n <= 0) return "—";
  return "₩" + Math.round(n).toLocaleString("ko-KR");
}

function toNum(v: string | null) {
  const n = Number(v ?? "0");
  return Number.isFinite(n) ? n : 0;
}

export default function CardPage() {
  const sp = useSearchParams();

  // ✅ 메모 쓰지 말고, 그냥 매 렌더마다 읽기
  const pay = toNum(sp.get("pay"));
  const wage = toNum(sp.get("wage"));
  const h = toNum(sp.get("h"));
  const m = toNum(sp.get("m"));

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-md px-5 py-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">결과 카드</h1>
          <p className="text-neutral-400 text-sm">
            이 화면을 스크린샷 해서 스토리에 올리면 끝.
          </p>
        </header>

        <div className="mt-6 rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6">
          <div className="text-xs text-neutral-400">TIMEWORTH</div>

          <div className="mt-3 text-5xl font-semibold tracking-tight">
            {formatKRW(pay)}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-3">
              <div className="text-xs text-neutral-400">시급</div>
              <div className="mt-1 font-semibold">
                {wage > 0 ? `₩${Math.round(wage).toLocaleString("ko-KR")}` : "—"}
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-3">
              <div className="text-xs text-neutral-400">시간</div>
              <div className="mt-1 font-semibold">{h >= 0 ? `${Math.floor(h)}h` : "—"}</div>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-3">
              <div className="text-xs text-neutral-400">분</div>
              <div className="mt-1 font-semibold">{m >= 0 ? `${Math.floor(m)}m` : "—"}</div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-xs text-neutral-500">
            <span>Your time is not free.</span>
            <span>timeworth</span>
          </div>
        </div>

        <a
          href="/"
          className="mt-6 block rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-center text-sm font-medium text-neutral-100 hover:border-neutral-600"
        >
          계산 화면으로 돌아가기
        </a>
      </div>
    </main>
  );
}