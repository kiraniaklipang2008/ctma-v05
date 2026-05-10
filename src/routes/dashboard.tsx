import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Plus,
  Sliders,
  History,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Utensils,
  BookOpen,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [{ title: "Beranda — SantriPay" }],
  }),
});

const actions = [
  { label: "Topup Saldo", icon: Plus, accent: "from-primary to-primary-glow", to: "/topup" as const },
  { label: "Atur Limit", icon: Sliders, accent: "from-primary-deep to-primary", to: "/limit" as const },
  { label: "Riwayat", icon: History, accent: "from-primary-glow to-primary", to: "/dashboard" as const },
];

const txs = [
  { name: "Top Up Saldo", time: "Hari ini, 09:24", amount: 500000, type: "in", icon: Wallet },
  { name: "Kantin Pondok", time: "Hari ini, 12:10", amount: -18000, type: "out", icon: Utensils },
  { name: "Bayar SPP April", time: "Kemarin, 08:00", amount: -750000, type: "out", icon: BookOpen },
  { name: "Top Up Saldo", time: "12 Mei, 19:42", amount: 250000, type: "in", icon: Wallet },
];

function Dashboard() {
  const navigate = useNavigate();
  const [hide, setHide] = useState(false);
  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <MobileShell>
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--gradient-card)] flex items-center justify-center text-primary-foreground font-bold shadow-[var(--shadow-soft)]">
            AH
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Assalamualaikum,</p>
            <p className="text-sm font-bold text-foreground">Ahmad Hidayat</p>
          </div>
        </div>
        <button className="relative w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center">
          <Bell size={20} className="text-foreground" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary" />
        </button>
      </header>

      {/* Hero balance card */}
      <section className="px-6 mt-2">
        <div
          className="relative overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-[var(--shadow-glow)]"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 blur-2xl" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/70 font-semibold">
                  Saldo Santri
                </p>
                <p className="text-[11px] text-white/60 mt-0.5">Fatimah Az-Zahra · Kelas 9A</p>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] font-semibold backdrop-blur">
                AKTIF
              </div>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <h2 className="text-3xl font-bold tracking-tight">
                {hide ? "Rp ••••••" : fmt(2840000)}
              </h2>
              <button onClick={() => setHide((h) => !h)} className="mb-1.5 text-white/80">
                {hide ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs">
              <div>
                <p className="text-white/60">Limit Harian</p>
                <p className="font-semibold">Rp 100.000</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <p className="text-white/60">Pengeluaran</p>
                <p className="font-semibold">Rp 38.000</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <p className="text-white/60">No. Kartu</p>
                <p className="font-semibold tracking-wider">••42</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-6 mt-6">
        <div className="grid grid-cols-3 gap-3">
          {actions.map(({ label, icon: Icon, accent, to }) => (
            <button
              key={label}
              onClick={() => navigate({ to })}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] active:scale-95 transition"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-[var(--shadow-soft)]`}>
                <Icon size={22} className="text-primary-foreground" />
              </div>
              <span className="text-[11px] font-semibold text-foreground text-center leading-tight">
                {label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Promo / info banner */}
      <section className="px-6 mt-6">
        <div className="rounded-2xl p-4 flex items-center gap-3 border border-border bg-accent">
          <div className="w-10 h-10 rounded-xl bg-[var(--gradient-card)] flex items-center justify-center">
            <Sliders size={18} className="text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Atur limit harian santri</p>
            <p className="text-xs text-muted-foreground">Kontrol pengeluaran setiap hari.</p>
          </div>
          <ArrowUpRight size={18} className="text-primary" />
        </div>
      </section>

      {/* Recent transactions */}
      <section className="px-6 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-foreground">Transaksi Terbaru</h3>
          <button className="text-xs font-semibold text-primary">Lihat Semua</button>
        </div>

        <div className="bg-card rounded-3xl border border-border divide-y divide-border overflow-hidden shadow-[var(--shadow-soft)]">
          {txs.map((t, i) => {
            const Icon = t.icon;
            const isIn = t.type === "in";
            return (
              <div key={i} className="flex items-center gap-3 p-4">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    isIn ? "bg-success/15 text-success" : "bg-secondary text-primary"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.time}</p>
                </div>
                <div className="flex items-center gap-1">
                  {isIn ? (
                    <ArrowDownLeft size={14} className="text-success" />
                  ) : (
                    <ArrowUpRight size={14} className="text-foreground/60" />
                  )}
                  <span
                    className={`text-sm font-bold ${
                      isIn ? "text-success" : "text-foreground"
                    }`}
                  >
                    {isIn ? "+" : ""}
                    {fmt(t.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </MobileShell>
  );
}
