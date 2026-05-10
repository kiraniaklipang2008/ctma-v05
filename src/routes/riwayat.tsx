import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { listPendingTx, subscribePendingTx, type PendingTx } from "@/data/pendingTx";
import {
  ArrowLeft,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Utensils,
  BookOpen,
  Coffee,
  ShoppingBag,
  ChevronDown,
  Calendar as CalendarIcon,
  X,
  Receipt,
  Store,
  Clock,
  CreditCard,
  Hash,
} from "lucide-react";

export const Route = createFileRoute("/riwayat")({
  component: RiwayatPage,
  head: () => ({ meta: [{ title: "Riwayat Transaksi — SantriPay" }] }),
});

type TxType = "in" | "out";
type Category = "topup" | "kantin" | "minuman" | "alat" | "spp" | "mart";

type LineItem = { name: string; qty: number; price: number };

type Tx = {
  id: string;
  name: string;
  category: Category;
  type: TxType;
  amount: number;
  date: string; // ISO
  merchant?: string;
  cashier?: string;
  method?: string;
  ref?: string;
  items?: LineItem[];
  note?: string;
  status?: "pending" | "approved" | "rejected";
  payId?: string;
};

const CAT_META: Record<Category, { label: string; icon: typeof Wallet; tone: string }> = {
  topup: { label: "Top Up", icon: Wallet, tone: "bg-success/15 text-success" },
  kantin: { label: "Kantin", icon: Utensils, tone: "bg-secondary text-primary" },
  minuman: { label: "Minuman", icon: Coffee, tone: "bg-secondary text-primary" },
  alat: { label: "Alat Tulis", icon: BookOpen, tone: "bg-secondary text-primary" },
  spp: { label: "SPP", icon: Receipt, tone: "bg-secondary text-primary" },
  mart: { label: "Pondok Mart", icon: Store, tone: "bg-secondary text-primary" },
};

const TXS: Tx[] = [
  {
    id: "TRX-2026-0510-021",
    name: "Pondok Mart",
    category: "mart",
    type: "out",
    amount: -47500,
    date: "2026-05-10T13:42:00",
    merchant: "Pondok Mart — Gerbang Utara",
    cashier: "Ust. Rahmat",
    method: "Kartu Santri",
    ref: "PM-559281",
    items: [
      { name: "Roti Coklat", qty: 2, price: 8000 },
      { name: "Susu UHT 250ml", qty: 1, price: 9500 },
      { name: "Sabun Mandi", qty: 1, price: 12000 },
      { name: "Buku Tulis 38lbr", qty: 2, price: 5000 },
    ],
  },
  {
    id: "TRX-2026-0510-014",
    name: "Top Up Saldo",
    category: "topup",
    type: "in",
    amount: 500000,
    date: "2026-05-10T09:24:00",
    method: "BCA Virtual Account",
    ref: "TRX-83920491-742",
    note: "Top up oleh wali (Ahmad Hidayat)",
  },
  {
    id: "TRX-2026-0510-008",
    name: "Kantin Pondok",
    category: "kantin",
    type: "out",
    amount: -18000,
    date: "2026-05-10T12:10:00",
    merchant: "Kantin Putri",
    cashier: "Bu Yanti",
    method: "Kartu Santri",
    ref: "KP-118392",
    items: [
      { name: "Nasi + Ayam Goreng", qty: 1, price: 15000 },
      { name: "Es Teh", qty: 1, price: 3000 },
    ],
  },
  {
    id: "TRX-2026-0509-091",
    name: "Bayar SPP April",
    category: "spp",
    type: "out",
    amount: -750000,
    date: "2026-05-09T08:00:00",
    method: "Saldo Santri",
    ref: "SPP-APR-2026-9A-014",
    note: "Tagihan SPP bulan April 2026",
  },
  {
    id: "TRX-2026-0508-077",
    name: "Pondok Mart",
    category: "mart",
    type: "out",
    amount: -23000,
    date: "2026-05-08T16:21:00",
    merchant: "Pondok Mart — Asrama Putri",
    cashier: "Ust. Bilal",
    method: "Kartu Santri",
    ref: "PM-559102",
    items: [
      { name: "Pasta Gigi", qty: 1, price: 13000 },
      { name: "Pulpen Standard", qty: 2, price: 5000 },
    ],
  },
  {
    id: "TRX-2026-0507-053",
    name: "Minuman Dingin",
    category: "minuman",
    type: "out",
    amount: -7000,
    date: "2026-05-07T15:02:00",
    merchant: "Kantin Putri",
    method: "Kartu Santri",
    ref: "KP-117880",
    items: [{ name: "Es Jeruk", qty: 1, price: 7000 }],
  },
  {
    id: "TRX-2026-0512-001",
    name: "Top Up Saldo",
    category: "topup",
    type: "in",
    amount: 250000,
    date: "2026-05-12T19:42:00",
    method: "GoPay",
    ref: "TRX-83920102-501",
  },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

type DateRange = "all" | "today" | "7d" | "30d";

const TYPE_TABS: { id: "all" | TxType; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "in", label: "Masuk" },
  { id: "out", label: "Keluar" },
];

const CAT_FILTERS: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "mart", label: "Pondok Mart" },
  { id: "kantin", label: "Kantin" },
  { id: "minuman", label: "Minuman" },
  { id: "alat", label: "Alat Tulis" },
  { id: "spp", label: "SPP" },
  { id: "topup", label: "Top Up" },
];

const DATE_FILTERS: { id: DateRange; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "today", label: "Hari Ini" },
  { id: "7d", label: "7 Hari" },
  { id: "30d", label: "30 Hari" },
];

function RiwayatPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<"all" | TxType>("all");
  const [cat, setCat] = useState<"all" | Category>("all");
  const [range, setRange] = useState<DateRange>("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingTx[]>([]);

  useEffect(() => {
    const refresh = () => setPending(listPendingTx());
    refresh();
    return subscribePendingTx(refresh);
  }, []);

  const allTxs: Tx[] = useMemo(() => {
    const mapped: Tx[] = pending.map((p) => ({
      id: p.id,
      name: p.billName,
      category: "spp",
      type: "out",
      amount: -p.amount,
      date: p.createdAt,
      method: `${p.bankName} ${p.bankAccount}`,
      ref: p.id,
      note: `Kode unik +${p.uniqueCode}`,
      status: p.status,
      payId: p.id,
    }));
    return [...mapped, ...TXS];
  }, [pending]);

  const filtered = useMemo(() => {
    const now = Date.now();
    return allTxs.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (cat !== "all" && t.category !== cat) return false;
      if (range !== "all") {
        const days = range === "today" ? 1 : range === "7d" ? 7 : 30;
        const diff = (now - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24);
        if (diff > days) return false;
      }
      if (q.trim()) {
        const s = q.toLowerCase();
        const hay = `${t.name} ${t.merchant ?? ""} ${t.ref ?? ""} ${t.id} ${(t.items ?? [])
          .map((i) => i.name)
          .join(" ")}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allTxs, type, cat, range, q]);

  const totalIn = filtered.filter((t) => t.type === "in").reduce((a, b) => a + b.amount, 0);
  const totalOut = filtered.filter((t) => t.type === "out").reduce((a, b) => a + b.amount, 0);

  // Group by date label
  const groups = useMemo(() => {
    const m = new Map<string, Tx[]>();
    for (const t of filtered) {
      const k = fmtDate(t.date);
      m.set(k, [...(m.get(k) ?? []), t]);
    }
    return Array.from(m.entries());
  }, [filtered]);

  const activeFilters =
    (type !== "all" ? 1 : 0) + (cat !== "all" ? 1 : 0) + (range !== "all" ? 1 : 0) + (q ? 1 : 0);

  return (
    <div className="min-h-screen w-full flex justify-center bg-secondary">
      <div className="relative w-full max-w-md min-h-screen bg-background pb-24">
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
              <p className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">Riwayat</p>
              <p className="text-base font-bold text-white">Transaksi Santri</p>
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-2 gap-3 text-white">
            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-3">
              <div className="flex items-center gap-1.5 text-white/70 text-[10px] font-semibold uppercase tracking-wider">
                <ArrowDownLeft size={12} /> Pemasukan
              </div>
              <p className="text-base font-bold mt-1">{fmt(totalIn)}</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-3">
              <div className="flex items-center gap-1.5 text-white/70 text-[10px] font-semibold uppercase tracking-wider">
                <ArrowUpRight size={12} /> Pengeluaran
              </div>
              <p className="text-base font-bold mt-1">{fmt(Math.abs(totalOut))}</p>
            </div>
          </div>
        </div>

        {/* Search + filters */}
        <div className="px-6 -mt-12 relative z-10">
          <div className="bg-card rounded-3xl border border-border shadow-[var(--shadow-card)] p-4">
            <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-3 border border-transparent focus-within:border-primary transition">
              <Search size={16} className="text-primary" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari transaksi, item, atau ID…"
                className="bg-transparent flex-1 outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground"
              />
              {q && (
                <button onClick={() => setQ("")} className="text-muted-foreground">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Type tabs */}
            <div className="mt-3 flex bg-secondary rounded-2xl p-1">
              {TYPE_TABS.map((t) => {
                const active = type === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                      active
                        ? "bg-card text-primary shadow-[var(--shadow-soft)]"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Category chips */}
            <div className="mt-3 flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none">
              {CAT_FILTERS.map((c) => {
                const active = cat === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCat(c.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition ${
                      active
                        ? "bg-[var(--gradient-card)] text-primary-foreground border-transparent"
                        : "bg-secondary text-foreground border-transparent"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* Date range */}
            <div className="mt-3 flex items-center gap-2">
              <CalendarIcon size={14} className="text-muted-foreground shrink-0" />
              <div className="flex gap-1.5 flex-1 overflow-x-auto scrollbar-none">
                {DATE_FILTERS.map((d) => {
                  const active = range === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setRange(d.id)}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition ${
                        active
                          ? "bg-primary text-primary-foreground border-transparent"
                          : "bg-secondary text-muted-foreground border-transparent"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeFilters > 0 && (
              <button
                onClick={() => {
                  setType("all");
                  setCat("all");
                  setRange("all");
                  setQ("");
                }}
                className="mt-3 w-full py-2 rounded-xl bg-accent text-primary text-[11px] font-bold flex items-center justify-center gap-1.5"
              >
                <X size={12} /> Hapus {activeFilters} filter
              </button>
            )}
          </div>
        </div>

        {/* Transaction list */}
        <section className="px-6 mt-6 space-y-5">
          {groups.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-muted-foreground">
                <Receipt size={28} />
              </div>
              <p className="mt-3 text-sm font-bold text-foreground">Tidak ada transaksi</p>
              <p className="text-xs text-muted-foreground">Coba ubah filter atau kata kunci pencarian.</p>
            </div>
          )}

          {groups.map(([day, items]) => (
            <div key={day}>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">
                {day}
              </p>
              <div className="bg-card rounded-3xl border border-border shadow-[var(--shadow-soft)] overflow-hidden divide-y divide-border">
                {items.map((t) => (
                  <TxRow
                    key={t.id}
                    tx={t}
                    open={openId === t.id}
                    onToggle={() => setOpenId(openId === t.id ? null : t.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function TxRow({ tx, open, onToggle }: { tx: Tx; open: boolean; onToggle: () => void }) {
  const meta = CAT_META[tx.category];
  const Icon = meta.icon;
  const isIn = tx.type === "in";
  const itemTotal = tx.items?.reduce((a, b) => a + b.qty * b.price, 0) ?? 0;

  return (
    <div>
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-4 active:bg-secondary transition text-left">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${meta.tone}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{tx.name}</p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-bold uppercase tracking-wider">
              {meta.label}
            </span>
            {fmtTime(tx.date)}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="text-right">
            <p className={`text-sm font-bold ${isIn ? "text-success" : "text-foreground"}`}>
              {isIn ? "+" : ""}
              {fmt(tx.amount)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {tx.items ? `${tx.items.length} item` : tx.method ?? ""}
            </p>
          </div>
          <ChevronDown
            size={16}
            className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 bg-secondary/40 border-t border-border">
          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3 mt-3 mb-3">
            {tx.merchant && <Mini icon={Store} k="Merchant" v={tx.merchant} />}
            {tx.cashier && <Mini icon={Receipt} k="Kasir" v={tx.cashier} />}
            {tx.method && <Mini icon={CreditCard} k="Metode" v={tx.method} />}
            <Mini icon={Clock} k="Waktu" v={`${fmtDate(tx.date)} · ${fmtTime(tx.date)}`} />
            {tx.ref && <Mini icon={Hash} k="Ref" v={tx.ref} />}
          </div>

          {tx.items && tx.items.length > 0 && (
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="px-3 py-2 border-b border-border flex items-center gap-2">
                <ShoppingBag size={13} className="text-primary" />
                <p className="text-[11px] font-bold text-foreground">Detail Belanja</p>
              </div>
              <div className="divide-y divide-border">
                {tx.items.map((it, i) => (
                  <div key={i} className="px-3 py-2.5 flex items-start gap-2 text-xs">
                    <span className="w-6 h-6 rounded-md bg-secondary text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                      {it.qty}×
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{it.name}</p>
                      <p className="text-[10px] text-muted-foreground">{fmt(it.price)} / pcs</p>
                    </div>
                    <span className="font-bold text-foreground">{fmt(it.qty * it.price)}</span>
                  </div>
                ))}
              </div>
              <div className="px-3 py-2.5 bg-secondary/60 flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total</span>
                <span className="text-sm font-bold text-foreground">{fmt(itemTotal)}</span>
              </div>
            </div>
          )}

          {tx.note && (
            <p className="mt-3 text-[11px] text-muted-foreground italic px-1">"{tx.note}"</p>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="py-2.5 rounded-xl bg-card border border-border text-[11px] font-bold text-foreground">
              Unduh Struk
            </button>
            <button className="py-2.5 rounded-xl bg-[var(--gradient-card)] text-primary-foreground text-[11px] font-bold">
              Laporkan Masalah
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Mini({ icon: Icon, k, v }: { icon: typeof Store; k: string; v: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center text-primary shrink-0 mt-0.5">
        <Icon size={12} />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{k}</p>
        <p className="text-[11px] font-semibold text-foreground truncate">{v}</p>
      </div>
    </div>
  );
}
