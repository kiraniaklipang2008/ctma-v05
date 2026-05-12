import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, CheckCircle2 } from "lucide-react";
import { BILLS, fmtIDR as fmt, type Bill } from "@/data/bills";
import { useSantri } from "@/contexts/SantriContext";
import { SantriSwitcherTrigger } from "@/components/SantriSwitcher";
import { createPendingTx } from "@/data/pendingTx";

export const Route = createFileRoute("/tagihan_/$billId")({
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

        {/* Bill summary card */}
        <div className="px-4 pt-4">
          <div className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1 h-5 rounded-full bg-primary shrink-0" />
                <h2 className="text-sm font-semibold text-foreground tracking-tight uppercase truncate">
                  {bill.name}
                </h2>
              </div>
              <span
                className={`shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold text-white ${
                  isFullyPaid
                    ? "bg-success"
                    : isPartial
                    ? "bg-[oklch(0.78_0.16_75)]"
                    : "bg-[oklch(0.62_0.22_25)]"
                }`}
              >
                {isFullyPaid && <CheckCircle2 size={12} />}
                {isFullyPaid ? "Lunas" : isPartial ? "Proses Bayar" : "Belum Bayar"}
              </span>
            </div>

            <div className="mt-3">
              <p className="text-[11px] text-muted-foreground">Total {bill.shortName}</p>
              <p className="text-2xl font-bold text-foreground tabular-nums">{fmt(bill.total)}</p>
            </div>

            <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-muted-foreground">Sudah Bayar</p>
                <p className="text-sm font-semibold text-foreground tabular-nums">{fmt(bill.paid)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Belum Bayar</p>
                <p
                  className={`text-sm font-semibold tabular-nums ${
                    isFullyPaid ? "text-success" : "text-[oklch(0.62_0.22_25)]"
                  }`}
                >
                  {fmt(remaining)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pt-2">

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
                    onClick={() => !it.paid && togglePick(it.id)}
                    role={it.paid ? undefined : "button"}
                    className={`relative flex items-center gap-3 pl-4 pr-3 py-3 rounded-2xl bg-secondary/70 border transition ${
                      !it.paid && checked
                        ? "border-primary ring-1 ring-primary/40"
                        : "border-border"
                    } ${it.paid ? "" : "cursor-pointer active:scale-[0.99]"}`}
                  >
                    <span
                      className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${
                        it.paid ? "bg-success" : "bg-primary"
                      }`}
                    />

                    <span className="shrink-0">
                      <CheckBox checked={it.paid || checked} disabled={it.paid} />
                    </span>

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
                        onClick={(e) => {
                          e.stopPropagation();
                          const tx = createPendingTx({
                            billId: bill.id,
                            billName: `${bill.shortName} — ${it.label}`,
                            baseAmount: it.amount,
                            bankName: "BCA",
                            bankAccount: "1234567890",
                            bankHolder: "Yayasan SantriPay",
                            items: [{ id: it.id, label: it.label, amount: it.amount }],
                          });
                          navigate({ to: "/pembayaran/$payId", params: { payId: tx.id } });
                        }}
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

        {/* Sticky pay bar — compact */}
        {unpaid.length > 0 && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-3 pb-3 pt-2 bg-gradient-to-t from-background via-background to-background/0 z-40">
            <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] px-3 py-2 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider leading-none">
                  Total · {picked.size}/{unpaid.length}
                </p>
                <p className="text-base font-extrabold text-foreground leading-tight mt-0.5">
                  {fmt(pickedTotal)}
                </p>
              </div>
              <button
                onClick={() => {
                  const items = bill.installments.filter((i) => picked.has(i.id));
                  if (items.length === 0) return;
                  const tx = createPendingTx({
                    billId: bill.id,
                    billName:
                      items.length === 1
                        ? `${bill.shortName} — ${items[0].label}`
                        : `${bill.shortName} (${items.length} item)`,
                    baseAmount: pickedTotal,
                    bankName: "BCA",
                    bankAccount: "1234567890",
                    bankHolder: "Yayasan SantriPay",
                    items: items.map((i) => ({ id: i.id, label: i.label, amount: i.amount })),
                  });
                  navigate({ to: "/pembayaran/$payId", params: { payId: tx.id } });
                }}
                disabled={picked.size === 0}
                className="shrink-0 px-5 py-2.5 rounded-xl text-primary-foreground font-bold text-sm shadow-[var(--shadow-glow)] disabled:opacity-50 transition active:scale-[0.98]"
                style={{ background: "var(--gradient-card)" }}
              >
                Lanjutkan
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
    <div
      className="relative overflow-hidden rounded-3xl p-4 text-primary-foreground shadow-[var(--shadow-glow)]"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute -top-12 -right-8 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/5 blur-2xl" />

      <div className="relative flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 backdrop-blur text-primary-foreground flex items-center justify-center shrink-0 font-bold shadow-[var(--shadow-soft)]">
          {active.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-widest text-white/70 font-semibold">
            Nama Siswa / Santri
          </p>
          <p className="text-sm font-extrabold text-white truncate leading-tight mt-0.5">
            {active.name.toUpperCase()}
          </p>
          <p className="text-[11px] text-white/70 mt-0.5">
            {active.jenjang} · Kelas {active.className} · ••{active.cardSuffix}
          </p>
        </div>
        <SantriSwitcherTrigger>
          <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] font-semibold backdrop-blur flex items-center gap-1 shrink-0">
            Ganti
          </span>
        </SantriSwitcherTrigger>
      </div>
    </div>
  );
}
