import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, CheckCircle2 } from "lucide-react";
import { BILLS, fmtIDR as fmt, type Bill } from "@/data/bills";
import { useSantri } from "@/contexts/SantriContext";
import { SantriSwitcherTrigger } from "@/components/SantriSwitcher";

export const Route = createFileRoute("/tagihan/$billId")({
  component: BillDetail,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
      Tagihan tidak ditemukan.
    </div>
  ),
  loader: ({ params }): Bill => {
    const bill = BILLS.find((b) => b.id === params.billId);
    if (!bill) throw notFound();
    return bill;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Detail ${loaderData?.shortName ?? "Tagihan"} — SantriPay` }],
  }),
});

function BillDetail() {
  const bill = Route.useLoaderData() as Bill;
  const navigate = useNavigate();
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const unpaid = bill.installments.filter((i) => !i.paid);
  const allUnpaidPicked = unpaid.length > 0 && unpaid.every((i) => picked.has(i.id));

  const togglePick = (id: string) =>
    setPicked((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const togglePickAll = () =>
    setPicked(allUnpaidPicked ? new Set() : new Set(unpaid.map((i) => i.id)));

  const pickedTotal = useMemo(
    () => bill.installments.filter((i) => picked.has(i.id)).reduce((a, b) => a + b.amount, 0),
    [picked, bill.installments],
  );

  const remaining = Math.max(0, bill.total - bill.paid);
  const isFullyPaid = remaining === 0;
  const isPartial = bill.paid > 0 && !isFullyPaid;

  return (
    <div className="min-h-screen w-full flex justify-center bg-secondary">
      <div className="relative w-full max-w-md min-h-screen bg-background pb-32">
        {/* Header — legacy style */}
        <div className="px-6 pt-12 pb-3 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/tagihan" })}
            className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground active:scale-95 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
              Tagihan
            </p>
            <p className="text-base font-bold text-foreground truncate">
              Detail {bill.shortName}
            </p>
          </div>
        </div>

        {/* Active santri pill */}
        <div className="px-4 mt-1">
          <ActiveSantriPill />
        </div>

        {/* Bill summary */}
        <div className="px-5 pt-6">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-primary" />
            <h2 className="text-base font-extrabold text-foreground tracking-tight uppercase">
              {bill.name}
            </h2>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">Total {bill.shortName}</p>
          <p className="text-2xl font-extrabold text-foreground">{fmt(bill.total)}</p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Sudah Bayar</p>
              <p className="text-sm font-bold text-foreground">{fmt(bill.paid)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Belum Bayar</p>
              <p
                className={`text-sm font-bold ${
                  isFullyPaid ? "text-success" : "text-[oklch(0.62_0.22_25)]"
                }`}
              >
                {fmt(remaining)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-1.5">Status</p>
            <span
              className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold text-white ${
                isFullyPaid
                  ? "bg-success"
                  : isPartial
                  ? "bg-[oklch(0.78_0.16_75)]"
                  : "bg-[oklch(0.62_0.22_25)]"
              }`}
            >
              {isFullyPaid && <CheckCircle2 size={14} />}
              {isFullyPaid ? "Lunas" : isPartial ? "Proses Bayar" : "Belum Bayar"}
            </span>
          </div>

          <div className="mt-5 h-px bg-border" />

          {/* Installments */}
          <div className="mt-5">
            <h3 className="text-base font-bold text-foreground">
              Detail {bill.shortName}
            </h3>

            {unpaid.length > 0 && (
              <button
                onClick={togglePickAll}
                className="mt-4 flex items-center gap-3 px-1"
              >
                <CheckBox checked={allUnpaidPicked} />
                <span className="text-sm font-semibold text-foreground">Bayar Semua</span>
              </button>
            )}

            <div className="mt-4 space-y-3">
              {bill.installments.map((it) => {
                const checked = picked.has(it.id);
                return (
                  <div
                    key={it.id}
                    className="relative flex items-center gap-3 pl-4 pr-3 py-3 rounded-2xl bg-secondary/70 border border-border"
                  >
                    <span
                      className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${
                        it.paid ? "bg-success" : "bg-primary"
                      }`}
                    />

                    <button
                      onClick={() => !it.paid && togglePick(it.id)}
                      disabled={it.paid}
                      className="shrink-0 disabled:opacity-50"
                    >
                      <CheckBox checked={it.paid || checked} disabled={it.paid} />
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{fmt(it.amount)}</p>
                      <p className="text-sm font-bold text-primary leading-tight mt-0.5">
                        {it.label}
                      </p>
                    </div>

                    {it.paid ? (
                      <span className="shrink-0 px-5 py-2.5 rounded-xl bg-success text-white text-xs font-bold">
                        Lunas
                      </span>
                    ) : (
                      <button
                        onClick={() => navigate({ to: "/topup" })}
                        className="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold text-primary-foreground shadow-[var(--shadow-soft)] active:scale-95 transition"
                        style={{ background: "var(--gradient-card)" }}
                      >
                        Bayar Sekarang
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky pay bar */}
        {unpaid.length > 0 && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-4 pt-3 bg-gradient-to-t from-background via-background to-background/0 z-40">
            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    Total Bayar
                  </p>
                  <p className="text-lg font-bold text-foreground">{fmt(pickedTotal)}</p>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">{picked.size}</span> dari{" "}
                  {unpaid.length} cicilan
                </p>
              </div>
              <button
                onClick={() => navigate({ to: "/topup" })}
                disabled={picked.size === 0}
                className="w-full py-3.5 rounded-2xl text-primary-foreground font-semibold text-sm shadow-[var(--shadow-glow)] disabled:opacity-50 transition active:scale-[0.98]"
                style={{ background: "var(--gradient-card)" }}
              >
                Lanjutkan Pembayaran
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckBox({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  return (
    <span
      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${
        checked
          ? disabled
            ? "bg-success border-success"
            : "bg-primary border-primary"
          : "bg-transparent border-muted-foreground/40"
      }`}
    >
      {checked && <Check size={14} className="text-white" strokeWidth={3} />}
    </span>
  );
}

function ActiveSantriPill() {
  const { active } = useSantri();
  return (
    <div className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] p-3 flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-[var(--gradient-card)] text-primary-foreground flex items-center justify-center shrink-0 font-bold">
        {active.initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground">Nama Siswa / Santri</p>
        <p className="text-sm font-bold text-foreground truncate">
          {active.name.toUpperCase()}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {active.jenjang} · Kelas {active.className}
        </p>
      </div>
      <SantriSwitcherTrigger variant="subtle">Ganti</SantriSwitcherTrigger>
    </div>
  );
}
