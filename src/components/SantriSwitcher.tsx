import { useEffect, useState, type ReactNode } from "react";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import { useSantri, type Santri } from "@/contexts/SantriContext";

const fmt = (n: number) =>
  "Rp" + new Intl.NumberFormat("id-ID").format(n);

/** Compact pill that opens the switcher sheet on click. */
export function SantriSwitcherTrigger({
  variant = "ghost",
  children,
}: {
  variant?: "ghost" | "subtle";
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          variant === "subtle"
            ? "text-[11px] text-white/90 font-semibold underline-offset-2 hover:underline shrink-0"
            : "inline-flex items-center gap-1 text-white/90"
        }
      >
        {children ?? (
          <>
            <span>Ganti</span>
            <ChevronDown size={14} />
          </>
        )}
      </button>
      <SantriSwitcherSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function SantriSwitcherSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { santri, active, setActiveId } = useSantri();

  // Lock background scroll while sheet is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <button
        onClick={onClose}
        aria-label="Tutup"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-background rounded-t-[2rem] pb-6 pt-3 shadow-[var(--shadow-card)] animate-in slide-in-from-bottom duration-200">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-border" />

        <div className="px-5 mt-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Pilih Santri</h3>
            <p className="text-[11px] text-muted-foreground">
              Akun wali Anda terhubung ke {santri.length} santri.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-4 mt-4 space-y-2 max-h-[55vh] overflow-y-auto">
          {santri.map((s) => (
            <SantriRow
              key={s.id}
              santri={s}
              active={s.id === active.id}
              onPick={() => {
                setActiveId(s.id);
                onClose();
              }}
            />
          ))}

          <button className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-border text-primary text-sm font-bold active:scale-[0.99] transition">
            <Plus size={16} /> Tambah Santri
          </button>
        </div>
      </div>
    </div>
  );
}

function SantriRow({
  santri,
  active,
  onPick,
}: {
  santri: Santri;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      onClick={onPick}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition text-left ${
        active
          ? "border-primary bg-accent/60"
          : "border-border bg-card active:bg-secondary"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${santri.color} text-primary-foreground font-bold flex items-center justify-center shadow-[var(--shadow-soft)] shrink-0`}
      >
        {santri.initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-foreground truncate">
            {santri.name}
          </p>
          {active && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              Aktif
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          {santri.jenjang} · Kelas {santri.className} · Kartu ••{santri.cardSuffix}
        </p>
        <div className="mt-1 flex items-center gap-3 text-[10px] font-semibold">
          <span className="text-success">Saldo {fmt(santri.saldo)}</span>
          <span className="text-muted-foreground">
            Tagihan {fmt(santri.totalDue)}
          </span>
        </div>
      </div>

      <span
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
          active ? "bg-primary border-primary" : "border-border"
        }`}
      >
        {active && <Check size={14} className="text-primary-foreground" strokeWidth={3} />}
      </span>
    </button>
  );
}
