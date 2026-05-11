import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Wallet,
  Plus,
  CheckCircle2,
  Building2,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Copy,
  Check,
  Upload,
  Clock,
  ImageIcon,
  X,
  Camera,
  ImagePlus,
  AlertCircle,
  ZoomIn,
  RefreshCw,
  FileImage,
} from "lucide-react";

export const Route = createFileRoute("/topup")({
  component: TopupPage,
  head: () => ({ meta: [{ title: "Topup Saldo — SantriPay" }] }),
});

const NOMINALS = [50_000, 100_000, 200_000, 500_000, 1_000_000, 2_000_000];

type Method = {
  id: string;
  label: string;
  desc: string;
  icon: typeof Building2;
  fee: number;
  account: string;
  holder: string;
};

const METHODS: Method[] = [
  { id: "bca", label: "Bank BCA", desc: "Transfer manual antar bank", icon: Building2, fee: 0, account: "1840558992", holder: "Yayasan PPTQ Cahaya Tasbih" },
  { id: "mandiri", label: "Bank Mandiri", desc: "Transfer manual antar bank", icon: Building2, fee: 0, account: "1370009988421", holder: "Yayasan PPTQ Cahaya Tasbih" },
  { id: "bsi", label: "Bank Syariah Indonesia", desc: "Transfer manual antar bank", icon: Building2, fee: 0, account: "7211884502", holder: "Yayasan PPTQ Cahaya Tasbih" },
  { id: "bri", label: "Bank BRI", desc: "Transfer manual antar bank", icon: Building2, fee: 0, account: "002901024458503", holder: "Yayasan PPTQ Cahaya Tasbih" },
  { id: "gopay", label: "GoPay", desc: "Transfer manual e-wallet", icon: Smartphone, fee: 0, account: "081288995521", holder: "Ust. Hasanuddin (Bendahara)" },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

type Step = "form" | "confirm" | "pending";

function TopupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("form");
  const [amount, setAmount] = useState<number>(100_000);
  const [custom, setCustom] = useState<string>("");
  const [method, setMethod] = useState<string>("bca");
  const [proof, setProof] = useState<File | null>(null);
  const [proofUrl, setProofUrl] = useState<string>("");

  const selected = useMemo(() => METHODS.find((m) => m.id === method)!, [method]);

  // Unique 3-digit suffix to distinguish concurrent transfers
  const uniqueCode = useMemo(
    () => Math.floor(100 + Math.random() * 900),
    // regenerate when stepping into confirm
    [step === "confirm" ? amount + method : null],
  );
  const uniqueAmount = amount + uniqueCode;
  const total = uniqueAmount + selected.fee;
  const refId = useMemo(
    () => "TRX-" + Date.now().toString().slice(-8) + "-" + uniqueCode,
    [uniqueCode],
  );

  if (step === "confirm") {
    return (
      <ConfirmScreen
        amount={amount}
        uniqueCode={uniqueCode}
        uniqueAmount={uniqueAmount}
        method={selected}
        total={total}
        refId={refId}
        proof={proof}
        proofUrl={proofUrl}
        onBack={() => setStep("form")}
        onSelectFile={(f) => {
          setProof(f);
          setProofUrl(f ? URL.createObjectURL(f) : "");
        }}
        onSubmit={() => setStep("pending")}
      />
    );
  }

  if (step === "pending") {
    return (
      <PendingScreen
        refId={refId}
        total={total}
        method={selected}
        onHome={() => navigate({ to: "/dashboard" })}
      />
    );
  }

  // STEP: form
  return (
    <div className="min-h-screen w-full flex justify-center bg-secondary">
      <div className="relative w-full max-w-md min-h-screen bg-background pb-32">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setProof(f);
              setProofUrl(URL.createObjectURL(f));
            }
          }}
        />

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
                        ? "text-white border-transparent shadow-[var(--shadow-glow)] ring-2 ring-primary/40 scale-[1.03]"
                        : "bg-secondary text-foreground border-transparent hover:border-primary/30"
                    }`}
                    style={
                      active ? { background: "var(--gradient-card)" } : undefined
                    }
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
                  className={`w-full flex items-center gap-3 p-4 transition text-left ${
                    active ? "bg-primary/5" : "active:bg-secondary"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                      active
                        ? "text-white shadow-[var(--shadow-glow)] ring-2 ring-primary/30"
                        : "bg-secondary text-primary"
                    }`}
                    style={active ? { background: "var(--gradient-card)" } : undefined}
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
                  Estimasi Bayar
                </p>
                <p className="text-lg font-bold text-foreground">{fmt(amount + selected.fee)}</p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                via <span className="font-semibold text-foreground">{selected.label}</span>
              </p>
            </div>
            <button
              onClick={() => amount >= 10_000 && setStep("confirm")}
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

/* ───────────── Confirmation Screen ───────────── */

function ConfirmScreen({
  amount,
  uniqueCode,
  uniqueAmount,
  method,
  total,
  refId,
  proof,
  proofUrl,
  onBack,
  onPickFile,
  onRemoveFile,
  onSubmit,
}: {
  amount: number;
  uniqueCode: number;
  uniqueAmount: number;
  method: Method;
  total: number;
  refId: string;
  proof: File | null;
  proofUrl: string;
  onBack: () => void;
  onPickFile: () => void;
  onRemoveFile: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-secondary">
      <div className="relative w-full max-w-md min-h-screen bg-background pb-36">
        {/* Hero */}
        <div
          className="relative px-6 pt-12 pb-20 rounded-b-[2rem] overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute -top-16 -right-12 w-56 h-56 rounded-full bg-primary-glow/30 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">
                Konfirmasi
              </p>
              <p className="text-base font-bold text-white">Detail Pembayaran</p>
            </div>
          </div>

          <p className="relative mt-6 text-[11px] text-white/70 uppercase tracking-widest font-semibold">
            Total Transfer
          </p>
          <CopyAmount value={uniqueAmount} />
          <p className="relative mt-2 text-[11px] text-white/70">
            Termasuk kode unik{" "}
            <span className="font-bold text-white">{uniqueCode}</span> agar
            transaksi mudah diverifikasi.
          </p>
        </div>

        {/* Account info */}
        <div className="px-6 -mt-12 relative z-10">
          <div className="bg-card rounded-3xl border border-border shadow-[var(--shadow-card)] p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[var(--gradient-card)] flex items-center justify-center text-primary-foreground">
                <method.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{method.label}</p>
                <p className="text-[11px] text-muted-foreground">a.n. {method.holder}</p>
              </div>
            </div>

            <CopyRow label="No. Rekening / VA" value={method.account.replace(/\s/g, "")} display={method.account} />

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
              <Mini k="Nominal" v={fmt(amount)} />
              <Mini k="Kode Unik" v={`+${uniqueCode}`} />
              <Mini k="Biaya Admin" v={fmt(method.fee)} />
              <Mini k="ID Transaksi" v={refId} />
            </div>
          </div>
        </div>

        {/* Upload proof */}
        <section className="px-6 mt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Upload Bukti Bayar
          </p>

          {!proof ? (
            <button
              onClick={onPickFile}
              className="w-full rounded-3xl border-2 border-dashed border-border bg-card p-6 flex flex-col items-center gap-2 active:bg-secondary transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                <Upload size={20} />
              </div>
              <p className="text-sm font-bold text-foreground">Tap untuk upload</p>
              <p className="text-[11px] text-muted-foreground text-center">
                Format JPG / PNG, maksimal 5 MB
              </p>
            </button>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-3">
              <div className="relative rounded-2xl overflow-hidden bg-secondary">
                {proofUrl ? (
                  <img src={proofUrl} alt="bukti" className="w-full h-48 object-cover" />
                ) : (
                  <div className="h-48 flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={32} />
                  </div>
                )}
                <button
                  onClick={onRemoveFile}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="mt-3 px-1 flex items-center gap-2 text-[11px]">
                <CheckCircle2 size={14} className="text-success" />
                <span className="font-semibold text-foreground truncate flex-1">{proof.name}</span>
                <span className="text-muted-foreground">
                  {(proof.size / 1024).toFixed(0)} KB
                </span>
              </div>
            </div>
          )}

          <div className="mt-3 rounded-2xl bg-accent border border-border p-3 flex items-start gap-2">
            <ShieldCheck size={14} className="text-primary mt-0.5 shrink-0" />
            <p className="text-[11px] text-foreground leading-relaxed">
              Pastikan nominal transfer <b>persis {fmt(uniqueAmount)}</b> agar
              petugas dapat memverifikasi pembayaran Anda dengan cepat.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-4 pt-3 bg-gradient-to-t from-background via-background to-background/0 z-40">
          <button
            onClick={onSubmit}
            disabled={!proof}
            className="w-full py-4 rounded-2xl text-primary-foreground font-semibold text-sm shadow-[var(--shadow-glow)] flex items-center justify-center gap-2 disabled:opacity-50 transition active:scale-[0.98]"
            style={{ background: "var(--gradient-card)" }}
          >
            <Upload size={18} /> Kirim Bukti & Konfirmasi
          </button>
          {!proof && (
            <p className="text-[11px] text-muted-foreground text-center mt-2">
              Upload bukti bayar terlebih dahulu untuk melanjutkan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────── Pending Screen ───────────── */

function PendingScreen({
  refId,
  total,
  method,
  onHome,
}: {
  refId: string;
  total: number;
  method: Method;
  onHome: () => void;
}) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-secondary">
      <div className="w-full max-w-md min-h-screen bg-background flex flex-col px-6 pt-16 pb-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-warning/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-warning/15 flex items-center justify-center">
              <Clock className="text-warning" size={40} />
            </div>
          </div>
          <span className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/15 text-warning text-[11px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
            Pending
          </span>
          <h2 className="text-2xl font-bold text-foreground mt-4">
            Menunggu Konfirmasi
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            Bukti bayar Anda sudah terkirim. Petugas akan memverifikasi
            pembayaran dalam <b>1×24 jam</b>.
          </p>
        </div>

        <div className="mt-8 rounded-3xl bg-card border border-border shadow-[var(--shadow-soft)] p-5 space-y-3">
          <Row k="ID Transaksi" v={refId} />
          <Row k="Total Bayar" v={fmt(total)} bold />
          <Row k="Metode" v={method.label} />
          <Row k="Status" v="Menunggu approval petugas" />
        </div>

        {/* Timeline */}
        <div className="mt-6 rounded-3xl bg-card border border-border p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Status Transaksi
          </p>
          <ol className="relative border-l-2 border-border ml-2 space-y-5">
            <Step done label="Bukti bayar dikirim" sub="Baru saja" />
            <Step active label="Menunggu approval petugas" sub="Sedang diverifikasi" />
            <Step label="Saldo masuk ke akun santri" sub="Setelah disetujui" />
          </ol>
        </div>

        <div className="mt-auto pt-6 space-y-2">
          <button
            onClick={onHome}
            className="w-full py-4 rounded-2xl text-primary-foreground font-semibold text-sm shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-card)" }}
          >
            Kembali ke Beranda
          </button>
          <button className="w-full py-3 rounded-2xl text-primary font-semibold text-sm bg-secondary">
            Hubungi Petugas
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Helpers ───────────── */

function CopyAmount({ value }: { value: number }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <div className="relative mt-2 flex items-end gap-3 text-white">
      <h2 className="text-3xl font-bold tracking-tight">{fmt(value)}</h2>
      <button
        onClick={copy}
        className="mb-1.5 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/15 backdrop-blur border border-white/20 text-[11px] font-semibold"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? "Tersalin" : "Salin"}
      </button>
    </div>
  );
}

function CopyRow({ label, value, display }: { label: string; value: string; display: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <div className="rounded-2xl bg-secondary p-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="text-base font-bold text-foreground tracking-wider truncate">
          {display}
        </p>
      </div>
      <button
        onClick={copy}
        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-card border border-border text-[11px] font-semibold text-primary active:scale-95 transition"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "OK" : "Salin"}
      </button>
    </div>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{k}</p>
      <p className="text-sm font-bold text-foreground truncate">{v}</p>
    </div>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="text-sm text-muted-foreground">{k}</span>
      <span className={`text-sm text-right ${bold ? "font-bold text-foreground" : "text-foreground font-semibold"}`}>
        {v}
      </span>
    </div>
  );
}

function Step({ label, sub, done, active }: { label: string; sub: string; done?: boolean; active?: boolean }) {
  return (
    <li className="ml-4">
      <span
        className={`absolute -left-[9px] w-4 h-4 rounded-full border-2 ${
          done
            ? "bg-success border-success"
            : active
            ? "bg-warning border-warning animate-pulse"
            : "bg-background border-border"
        }`}
      />
      <p className={`text-sm font-bold ${active ? "text-warning" : done ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </li>
  );
}
