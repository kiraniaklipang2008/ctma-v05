import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Bus, Utensils, Home, CheckCircle2 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/tagihan")({
  component: Tagihan,
  head: () => ({ meta: [{ title: "Tagihan — SantriPay" }] }),
});

const bills = [
  { name: "SPP Mei 2026", due: "Jatuh tempo 15 Mei", amount: 750000, icon: BookOpen, status: "due" },
  { name: "Asrama & Konsumsi", due: "Jatuh tempo 20 Mei", amount: 1200000, icon: Home, status: "due" },
  { name: "Antar Jemput", due: "Jatuh tempo 25 Mei", amount: 350000, icon: Bus, status: "due" },
  { name: "Uang Makan April", due: "Lunas · 02 Mei", amount: 600000, icon: Utensils, status: "paid" },
];

function Tagihan() {
  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
  const total = bills.filter((b) => b.status === "due").reduce((a, b) => a + b.amount, 0);

  return (
    <MobileShell>
      <header className="px-6 pt-12 pb-4">
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Tagihan</p>
        <h1 className="text-2xl font-bold text-foreground mt-1">Pembayaran Pondok</h1>
      </header>

      <section className="px-6">
        <div
          className="rounded-3xl p-5 text-primary-foreground shadow-[var(--shadow-glow)]"
          style={{ background: "var(--gradient-hero)" }}
        >
          <p className="text-xs text-white/70 uppercase tracking-widest font-semibold">Total Tagihan</p>
          <h2 className="text-3xl font-bold mt-1">{fmt(total)}</h2>
          <button
            className="mt-4 w-full py-3 rounded-2xl bg-white text-primary font-bold text-sm active:scale-[0.98] transition"
          >
            Bayar Semua
          </button>
        </div>
      </section>

      <section className="px-6 mt-6 space-y-3">
        {bills.map((b, i) => {
          const Icon = b.icon;
          const paid = b.status === "paid";
          return (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{b.name}</p>
                <p className={`text-[11px] mt-0.5 flex items-center gap-1 ${paid ? "text-success" : "text-muted-foreground"}`}>
                  {paid && <CheckCircle2 size={12} />}
                  {b.due}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{fmt(b.amount)}</p>
                {!paid && (
                  <button className="text-[11px] font-semibold text-primary mt-0.5">Bayar →</button>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </MobileShell>
  );
}
