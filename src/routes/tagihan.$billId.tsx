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
        {/* Hero */}
        <div
          className="relative px-5 pt-12 pb-20 overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute -top-16 -right-12 w-56 h-56 rounded-full bg-primary-glow/30 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
              maskImage: "radial-gradient(ellipse at top right, black 30%, transparent 70%)",
            }}
          />

          <div className="relative flex items-center gap-3 text-white">
            <button
              onClick={() => navigate({ to: "/tagihan" })}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
            >
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-xl font-extrabold tracking-tight">
              Detail {bill.shortName}
            </h1>
          </div>

          <ActiveSantriPill />
        </div>

        {/* Summary card overlap */}
        <div className="bg-background rounded-t-[2rem] -mt-8 relative z-10 px-5 pt-6 pb-5">
          <h2 className="text-base font-extrabold text-foreground tracking-tight">
            {bill.name}
          </h2>

          <p className="mt-4 text-xs text-muted-foreground">Total {bill.shortName}</p>
          <p className="text-xl font-extrabold text-foreground">{fmt(bill.total)}</p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Sudah Bayar</p>
              <p className="text-base font-bold text-foreground">{fmt(bill.paid)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Belum Bayar</p>
              <p
                className={`text-base font-bold ${
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
                    className={`relative flex items-center gap-3 pl-4 pr-3 py-3 rounded-2xl border ${
                      it.paid
                        ? "bg-secondary/60 border-border"
                        : "bg-secondary border-border"
                    }`}
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
                      <p className="text-sm text-foreground">{fmt(it.amount)}</p>
                      <p className="text-sm font-bold text-primary leading-tight">
                        {it.label}
                      </p>
                    </div>

                    {it.paid ? (
                      <span className="shrink-0 px-5 py-2.5 rounded-xl bg-success text-white text-xs font-bold">
                        Lunas
                      </span>
                    ) : (
                      <button
                        onClick={() => togglePick(it.id)}
                        className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                          checked
                            ? "bg-[var(--gradient-card)] text-primary-foreground"
                            : "bg-card text-primary border border-primary/30"
                        }`}
                      >
                        {checked ? "Dipilih" : "Pilih"}
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
    <div className="relative mt-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 p-3 flex items-center gap-3 text-white">
      <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0 font-bold">
        {active.initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-white/75">Nama Siswa / Santri</p>
        <p className="text-sm font-bold truncate">{active.name.toUpperCase()}</p>
        <p className="text-[11px] text-white/75">
          {active.jenjang} · Kelas {active.className}
        </p>
      </div>
      <SantriSwitcherTrigger variant="subtle">Ganti</SantriSwitcherTrigger>
    </div>
  );
}
