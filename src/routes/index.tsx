import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
          className="relative pt-14 pb-20 px-6 rounded-b-[2.5rem] overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
                <GraduationCap className="text-white" size={24} />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-white/70">PPTQ</p>
                <p className="text-sm font-bold text-white tracking-wide">CAHAYA TASBIH</p>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Selamat Datang 👋
            </h1>
            <p className="text-white/80 mt-2 text-sm leading-relaxed">
              Masuk untuk mengelola saldo & tagihan santri Anda.
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

          <p className="text-center text-xs text-muted-foreground mt-6">
            Belum punya akun?{" "}
            <Link to="/" className="text-primary font-semibold">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
