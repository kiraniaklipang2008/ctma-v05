import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Wallet,
  Plus,
  CheckCircle2,
  Building2,
  Smartphone,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/topup")({
  component: TopupPage,
  head: () => ({ meta: [{ title: "Topup Saldo — SantriPay" }] }),
});

const NOMINALS = [50_000, 100_000, 200_000, 500_000, 1_000_000, 2_000_000];

const METHODS = [
  { id: "bca", label: "BCA Virtual Account", desc: "Transfer otomatis", icon: Building2, fee: 0 },
  { id: "mandiri", label: "Mandiri VA", desc: "Transfer otomatis", icon: Building2, fee: 0 },
  { id: "gopay", label: "GoPay", desc: "Saldo e-wallet", icon: Smartphone, fee: 1500 },
  { id: "ovo", label: "OVO", desc: "Saldo e-wallet", icon: Smartphone, fee: 1500 },
  { id: "card", label: "Kartu Debit / Kredit", desc: "Visa, Mastercard, JCB", icon: CreditCard, fee: 2500 },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

function TopupPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(100_000);
  const [custom, setCustom] = useState<string>("");
  const [method, setMethod] = useState<string>("bca");
  const [done, setDone] = useState(false);

  const selected = METHODS.find((m) => m.id === method)!;
  const total = amount + selected.fee;

  if (done) {
    return (
      <div className="min-h-screen w-full flex justify-center bg-secondary">
        <div className="w-full max-w-md min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mb-5">
            <CheckCircle2 className="text-success" size={42} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Topup Berhasil!</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Saldo {fmt(amount)} telah ditambahkan ke akun santri Anda.
          </p>
          <div className="w-full mt-6 p-4 rounded-2xl bg-card border border-border text-left text-sm">
            <Row k="Nominal" v={fmt(amount)} />
            <Row k="Biaya admin" v={fmt(selected.fee)} />
            <div className="h-px bg-border my-2" />
            <Row k="Total dibayar" v={fmt(total)} bold />
            <Row k="Metode" v={selected.label} />
          </div>
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="mt-6 w-full py-4 rounded-2xl text-primary-foreground font-semibold text-sm shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-card)" }}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-secondary">
      <div className="relative w-full max-w-md min-h-screen bg-background pb-32">
        {/* Hero */}
        <div
          className="relative px-6 pt-12 pb-20 rounded-b-[2rem] overflow-hidden"
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
          <div className="relative flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">Topup</p>
              <p className="text-base font-bold text-white">Tambah Saldo Santri</p>
            </div>
          </div>

          <div className="relative mt-5 flex items-center gap-3 text-white/90">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[11px] text-white/70">Saldo Saat Ini</p>
              <p className="text-xl font-bold tracking-tight">{fmt(2_840_000)}</p>
            </div>
          </div>
        </div>

        {/* Amount card */}
        <div className="px-6 -mt-12 relative z-10">
          <div className="bg-card rounded-3xl border border-border shadow-[var(--shadow-card)] p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pilih Nominal
            </p>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {NOMINALS.map((n) => {
                const active = amount === n && !custom;
                return (
                  <button
                    key={n}
                    onClick={() => {
                      setAmount(n);
                      setCustom("");
                    }}
                    className={`py-3 rounded-2xl text-xs font-bold border transition active:scale-95 ${
                      active
                        ? "bg-[var(--gradient-card)] text-primary-foreground border-transparent shadow-[var(--shadow-soft)]"
                        : "bg-secondary text-foreground border-transparent"
                    }`}
                  >
                    {n >= 1_000_000 ? `${n / 1_000_000}jt` : `${n / 1000}rb`}
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Atau nominal lain
              </label>
              <div className="mt-2 flex items-center gap-2 bg-secondary rounded-2xl px-4 py-3.5 border border-transparent focus-within:border-primary transition">
                <span className="text-sm font-bold text-primary">Rp</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value);
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v)) setAmount(v);
                  }}
                  placeholder="0"
                  className="bg-transparent flex-1 outline-none text-foreground text-sm font-semibold placeholder:text-muted-foreground"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">Minimal Rp 10.000</p>
            </div>
          </div>
        </div>

        {/* Methods */}
        <section className="px-6 mt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Metode Pembayaran
          </p>
          <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden shadow-[var(--shadow-soft)]">
            {METHODS.map((m) => {
              const Icon = m.icon;
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className="w-full flex items-center gap-3 p-4 active:bg-secondary transition text-left"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      active ? "bg-[var(--gradient-card)] text-primary-foreground" : "bg-secondary text-primary"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{m.label}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {m.desc} · {m.fee === 0 ? "Gratis" : `Biaya ${fmt(m.fee)}`}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      active ? "border-primary bg-primary" : "border-border"
                    }`}
                  >
                    {active && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground px-1">
            <ShieldCheck size={14} className="text-success" />
            Transaksi dijamin aman & terenkripsi.
          </div>
        </section>

        {/* Footer summary */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-4 pt-3 bg-gradient-to-t from-background via-background to-background/0 z-40">
          <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                  Total Bayar
                </p>
                <p className="text-lg font-bold text-foreground">{fmt(total)}</p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                via <span className="font-semibold text-foreground">{selected.label}</span>
              </p>
            </div>
            <button
              onClick={() => amount >= 10_000 && setDone(true)}
              disabled={amount < 10_000}
              className="w-full py-3.5 rounded-2xl text-primary-foreground font-semibold text-sm shadow-[var(--shadow-glow)] flex items-center justify-center gap-2 disabled:opacity-50 transition active:scale-[0.98]"
              style={{ background: "var(--gradient-card)" }}
            >
              <Plus size={18} /> Lanjutkan Pembayaran
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-muted-foreground">{k}</span>
      <span className={bold ? "font-bold text-foreground" : "text-foreground font-semibold"}>{v}</span>
    </div>
  );
}
