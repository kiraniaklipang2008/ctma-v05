import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  CheckCircle2,
  GraduationCap,
  ChevronRight,
  Receipt,
} from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { BILLS, CATEGORY_ORDER, fmtIDR as fmt, type Bill } from "@/data/bills";
import { useSantri } from "@/contexts/SantriContext";
import { SantriSwitcherTrigger } from "@/components/SantriSwitcher";

export const Route = createFileRoute("/tagihan")({
  component: Tagihan,
  head: () => ({ meta: [{ title: "Tagihan — SantriPay" }] }),
});

function Tagihan() {
  const [tab, setTab] = useState<"due" | "paid">("due");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return BILLS.filter((b) => {
      const isPaid = b.paid >= b.total;
      if (tab === "due" && isPaid) return false;
      if (tab === "paid" && !isPaid) return false;
      if (q && !b.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [tab, q]);

  const grouped = useMemo(() => {
    const map = new Map<string, Bill[]>();
    for (const b of filtered) {
      map.set(b.category, [...(map.get(b.category) ?? []), b]);
    }
    return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => [c, map.get(c)!] as const);
  }, [filtered]);

  const totalDue = BILLS.reduce((a, b) => a + Math.max(0, b.total - b.paid), 0);

  return (
    <MobileShell>
      {/* Hero */}
      <div
        className="relative px-6 pt-12 pb-24 text-primary-foreground overflow-hidden"
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
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
          <p className="text-base font-extrabold tracking-tight">PPTQ Cahaya Tasbih</p>
        </div>
      </div>

      {/* Floating profile card */}
      <div className="px-4 -mt-16 relative z-10">
        <div
          className="rounded-2xl p-5 text-primary-foreground shadow-[var(--shadow-glow)]"
          style={{ background: "var(--gradient-card)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-white/70">Nama Siswa / Santri</p>
              <p className="text-base font-bold tracking-tight mt-0.5 truncate">
                {active.name.toUpperCase()}
              </p>
              <p className="text-[11px] text-white/70 mt-0.5">
                {active.jenjang} · Kelas {active.className}
              </p>
            </div>
            <SantriSwitcherTrigger variant="subtle">Ganti Santri</SantriSwitcherTrigger>
          </div>

          <div className="mt-5">
            <p className="text-[11px] text-white/70">Tagihan Saat ini</p>
            <p className="text-2xl font-extrabold tracking-tight mt-0.5">{fmt(totalDue)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-5">
        <div className="flex border-b border-border">
          {([
            { id: "due", label: "Tagihan" },
            { id: "paid", label: "Lunas" },
          ] as const).map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 pb-3 pt-2 text-sm font-bold relative transition ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mt-4">
        <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-3 border border-transparent focus-within:border-primary transition">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari Data"
            className="bg-transparent flex-1 outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Bills grouped by category */}
      <div className="px-4 mt-5 space-y-6">
        {grouped.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-muted-foreground">
              <Receipt size={26} />
            </div>
            <p className="mt-3 text-sm font-bold text-foreground">
              {tab === "paid" ? "Belum ada tagihan lunas" : "Tidak ada tagihan"}
            </p>
            <p className="text-xs text-muted-foreground">
              Coba ubah kata kunci pencarian.
            </p>
          </div>
        )}

        {grouped.map(([cat, items]) => (
          <section key={cat}>
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                {cat}
              </h3>
              <span className="text-[10px] font-semibold text-muted-foreground">
                {items.length} item
              </span>
            </div>

            <div className="space-y-3">
              {items.map((b) => (
                <BillCard key={b.id} bill={b} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </MobileShell>
  );
}

function BillCard({ bill }: { bill: Bill }) {
  const remaining = Math.max(0, bill.total - bill.paid);
  const isPaid = remaining === 0;
  const pct = Math.min(100, Math.round((bill.paid / bill.total) * 100));

  return (
    <div className="relative rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] overflow-hidden">
      {/* Left accent bar */}
      <span
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${
          isPaid ? "bg-success" : "bg-primary"
        }`}
      />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-foreground leading-snug">
              {bill.name}
            </p>
            <p className="text-base font-extrabold text-foreground tracking-tight mt-1">
              {fmt(bill.total)}
            </p>
            {!isPaid && bill.due && (
              <p className="text-[10px] text-muted-foreground mt-0.5">{bill.due}</p>
            )}
          </div>

          {isPaid ? (
            <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-success/15 text-success text-[11px] font-bold">
              <CheckCircle2 size={13} /> Lunas
            </span>
          ) : (
            <Link
              to="/tagihan/$billId"
              params={{ billId: bill.id }}
              className="shrink-0 px-4 py-2.5 rounded-xl text-primary-foreground text-xs font-bold shadow-[var(--shadow-soft)] active:scale-95 transition flex items-center gap-1"
              style={{ background: "var(--gradient-card)" }}
            >
              Bayar <ChevronRight size={14} />
            </Link>
          )}
        </div>

        {/* Progress */}
        {!isPaid && (
          <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--gradient-card)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        {/* Pills */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">Sudah Dibayarkan :</p>
            <div className="rounded-full bg-success text-white text-xs font-bold px-3 py-2 text-center truncate">
              {fmt(bill.paid)}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-1 text-right">
              {isPaid ? "Status :" : "Kekurangan :"}
            </p>
            <div
              className={`rounded-full text-white text-xs font-bold px-3 py-2 text-center truncate ${
                isPaid ? "bg-success" : "bg-[oklch(0.78_0.16_75)]"
              }`}
            >
              {isPaid ? "Lunas" : fmt(remaining)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
