import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Lock, Eye, EyeOff, GraduationCap, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Masuk — SantriPay" },
      { name: "description", content: "Aplikasi keuangan digital untuk wali santri dan siswa." },
    ],
  }),
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex justify-center bg-background">
      <div className="relative w-full max-w-md min-h-screen flex flex-col">
        {/* Hero header */}
        <div
          className="relative pt-12 pb-24 px-6 rounded-b-[2.5rem] overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          {/* Density: glow blobs + grid pattern + sparkles */}
          <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-primary-glow/30 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute top-10 right-8 w-24 h-24 rounded-full border border-white/15" />
          <div className="absolute top-20 right-16 w-16 h-16 rounded-full border border-white/10" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage: "radial-gradient(ellipse at top right, black 30%, transparent 70%)",
            }}
          />

          <div className="relative">
            {/* Brand row — one line, prominent */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shrink-0 shadow-lg">
                <GraduationCap className="text-white" size={22} />
              </div>
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="text-base font-extrabold text-white tracking-tight whitespace-nowrap">
                  PPTQ
                </span>
                <span className="text-base font-extrabold text-white tracking-[0.05em] whitespace-nowrap">
                  CAHAYA&nbsp;TASBIH
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-5 h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent" />

            {/* Badge */}
            <div className="mt-5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[10px] font-semibold text-white tracking-wider uppercase">
                Portal Wali Santri
              </span>
            </div>

            <h1 className="mt-3 text-[28px] leading-tight font-bold text-white tracking-tight">
              Assalamualaikum 👋<br />
              <span className="text-white/90">Selamat Datang</span>
            </h1>
            <p className="text-white/75 mt-2 text-[13px] leading-relaxed max-w-[18rem]">
              Kelola saldo, tagihan, dan limit santri Anda dalam satu aplikasi.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="px-6 -mt-12 relative z-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/dashboard" });
            }}
            className="bg-card rounded-3xl p-6 shadow-[var(--shadow-card)] border border-border space-y-4"
          >
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                No. Handphone
              </label>
              <div className="mt-2 flex items-center gap-3 bg-secondary rounded-2xl px-4 py-3.5 border border-transparent focus-within:border-primary transition">
                <Phone size={18} className="text-primary" />
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  className="bg-transparent flex-1 outline-none text-foreground text-sm font-medium placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <div className="mt-2 flex items-center gap-3 bg-secondary rounded-2xl px-4 py-3.5 border border-transparent focus-within:border-primary transition">
                <Lock size={18} className="text-primary" />
                <input
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-transparent flex-1 outline-none text-foreground text-sm font-medium placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="text-muted-foreground"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs font-semibold text-primary">
                Lupa Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl text-primary-foreground font-semibold text-sm shadow-[var(--shadow-glow)] flex items-center justify-center gap-2 transition active:scale-[0.98]"
              style={{ background: "var(--gradient-card)" }}
            >
              Masuk Sekarang
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-5 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Demo Akun Wali Siswa
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">No. HP</p>
                <p className="font-semibold text-foreground tracking-wide">081234567890</p>
              </div>
              <div>
                <p className="text-muted-foreground">Password</p>
                <p className="font-semibold text-foreground tracking-wide">wali123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
