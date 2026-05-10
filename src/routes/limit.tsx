import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Sliders,
  Coffee,
  Utensils,
  BookOpen,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/limit")({
  component: LimitPage,
  head: () => ({ meta: [{ title: "Atur Limit — SantriPay" }] }),
});

const PRESETS = [50_000, 100_000, 150_000, 250_000];

const CATEGORIES = [
  { id: "kantin", label: "Kantin", icon: Utensils, def: 30_000 },
  { id: "minuman", label: "Minuman", icon: Coffee, def: 15_000 },
  { id: "alat", label: "Alat Tulis", icon: BookOpen, def: 25_000 },
  { id: "lain", label: "Lainnya", icon: ShoppingBag, def: 30_000 },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

function LimitPage() {
  const navigate = useNavigate();
  const [daily, setDaily] = useState(100_000);
  const [enabled, setEnabled] = useState(true);
  const [cats, setCats] = useState<Record<string, number>>(
    Object.fromEntries(CATEGORIES.map((c) => [c.id, c.def])),
  );
  const [saved, setSaved] = useState(false);

  const totalCats = Object.values(cats).reduce((a, b) => a + b, 0);
  const overBudget = totalCats > daily;

  return (
    <div className="min-h-screen w-full flex justify-center bg-secondary">
      <div className="relative w-full max-w-md min-h-screen bg-background pb-32">
        {/* Hero */}
        <div
          className="relative px-6 pt-12 pb-24 rounded-b-[2rem] overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute -top-20 -right-10 w-56 h-56 rounded-full bg-primary-glow/30 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
              maskImage: "radial-gradient(ellipse at top right, black 30%, transparent 70%)",
            }}
          />
          <div className="relative flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">Limit</p>
              <p className="text-base font-bold text-white">Atur Pengeluaran Harian</p>
            </div>
          </div>

          <div className="relative mt-6 text-white">
            <p className="text-xs text-white/70 uppercase tracking-widest font-semibold">Limit Harian</p>
            <p className="text-3xl font-bold mt-1 tracking-tight">{fmt(daily)}</p>
            <p className="text-[11px] text-white/70 mt-1">
              Santri tidak dapat menghabiskan lebih dari ini per hari.
            </p>
          </div>
        </div>

        {/* Toggle card */}
        <div className="px-6 -mt-14 relative z-10">
          <div className="bg-card rounded-3xl border border-border shadow-[var(--shadow-card)] p-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[var(--gradient-card)] flex items-center justify-center text-primary-foreground">
              <Sliders size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Aktifkan Limit Harian</p>
              <p className="text-[11px] text-muted-foreground">
                Transaksi ditolak otomatis jika melewati limit.
              </p>
            </div>
            <button
              onClick={() => setEnabled((e) => !e)}
              className={`relative w-12 h-7 rounded-full transition ${
                enabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  enabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Slider */}
        <section className="px-6 mt-5">
          <div className="bg-card rounded-3xl border border-border shadow-[var(--shadow-soft)] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Slider Limit
              </p>
              <span className="text-sm font-bold text-primary">{fmt(daily)}</span>
            </div>

            <input
              type="range"
              min={20_000}
              max={500_000}
              step={10_000}
              value={daily}
              onChange={(e) => setDaily(parseInt(e.target.value, 10))}
              disabled={!enabled}
              className="w-full mt-4 accent-[oklch(0.48_0.22_295)] disabled:opacity-40"
            />

            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Rp 20rb</span>
              <span>Rp 500rb</span>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4">
              {PRESETS.map((p) => {
                const active = daily === p;
                return (
                  <button
                    key={p}
                    onClick={() => setDaily(p)}
                    disabled={!enabled}
                    className={`py-2.5 rounded-xl text-[11px] font-bold border transition disabled:opacity-40 ${
                      active
                        ? "bg-[var(--gradient-card)] text-primary-foreground border-transparent"
                        : "bg-secondary text-foreground border-transparent"
                    }`}
                  >
                    {p / 1000}rb
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Category limits */}
        <section className="px-6 mt-6">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Limit per Kategori
            </p>
            <span
              className={`text-[10px] font-bold ${
                overBudget ? "text-destructive" : "text-success"
              }`}
            >
              {fmt(totalCats)} / {fmt(daily)}
            </span>
          </div>

          <div className="bg-card rounded-3xl border border-border shadow-[var(--shadow-soft)] divide-y divide-border overflow-hidden">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const v = cats[c.id];
              const pct = Math.min(100, (v / daily) * 100);
              return (
                <div key={c.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">{c.label}</p>
                      <p className="text-[10px] text-muted-foreground">{Math.round(pct)}% dari limit harian</p>
                    </div>
                    <span className="text-sm font-bold text-foreground">{fmt(v)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100_000}
                    step={5_000}
                    value={v}
                    onChange={(e) =>
                      setCats((s) => ({ ...s, [c.id]: parseInt(e.target.value, 10) }))
                    }
                    disabled={!enabled}
                    className="w-full mt-3 accent-[oklch(0.48_0.22_295)] disabled:opacity-40"
                  />
                </div>
              );
            })}
          </div>

          {overBudget && (
            <p className="text-[11px] text-destructive font-semibold mt-2 px-1">
              Total kategori melebihi limit harian. Sesuaikan agar tidak konflik.
            </p>
          )}
        </section>

        {/* Smart tip */}
        <section className="px-6 mt-5">
          <div className="rounded-2xl p-4 flex items-center gap-3 border border-border bg-accent">
            <Sparkles size={18} className="text-primary shrink-0" />
            <p className="text-[11px] text-foreground leading-relaxed">
              Rata-rata pengeluaran santri Anda <b>Rp 38.000/hari</b>. Limit Rp 100.000 cukup aman.
            </p>
          </div>
        </section>

        {/* Save bar */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-4 pt-3 bg-gradient-to-t from-background via-background to-background/0 z-40">
          <button
            onClick={() => {
              setSaved(true);
              setTimeout(() => navigate({ to: "/dashboard" }), 800);
            }}
            disabled={overBudget}
            className="w-full py-4 rounded-2xl text-primary-foreground font-semibold text-sm shadow-[var(--shadow-glow)] flex items-center justify-center gap-2 disabled:opacity-50 transition active:scale-[0.98]"
            style={{ background: "var(--gradient-card)" }}
          >
            {saved ? (
              <>
                <CheckCircle2 size={18} /> Tersimpan
              </>
            ) : (
              "Simpan Pengaturan Limit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
