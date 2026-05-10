import { createContext, useContext, useState, type ReactNode } from "react";

export type Santri = {
  id: string;
  name: string;
  initials: string;
  className: string;
  jenjang: "SMP" | "SMA";
  cardSuffix: string;
  saldo: number;
  dailyLimit: number;
  spentToday: number;
  totalDue: number;
  color: string; // tailwind gradient classes
};

export const SANTRI: Santri[] = [
  {
    id: "s1",
    name: "Fatimah Az-Zahra",
    initials: "FA",
    className: "9A",
    jenjang: "SMP",
    cardSuffix: "42",
    saldo: 2_840_000,
    dailyLimit: 100_000,
    spentToday: 38_000,
    totalDue: 1_510_000,
    color: "from-primary to-primary-glow",
  },
  {
    id: "s2",
    name: "Muhammad Fakhri Hamizan",
    initials: "MF",
    className: "8A",
    jenjang: "SMP",
    cardSuffix: "18",
    saldo: 1_245_000,
    dailyLimit: 75_000,
    spentToday: 22_500,
    totalDue: 8_410_000,
    color: "from-primary-deep to-primary",
  },
  {
    id: "s3",
    name: "Aisyah Khairunnisa",
    initials: "AK",
    className: "11 IPA",
    jenjang: "SMA",
    cardSuffix: "07",
    saldo: 530_000,
    dailyLimit: 120_000,
    spentToday: 0,
    totalDue: 2_250_000,
    color: "from-primary-glow to-primary-deep",
  },
];

type Ctx = {
  santri: Santri[];
  active: Santri;
  setActiveId: (id: string) => void;
};

const SantriContext = createContext<Ctx | null>(null);

export function SantriProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string>(SANTRI[0].id);
  const active = SANTRI.find((s) => s.id === activeId) ?? SANTRI[0];

  return (
    <SantriContext.Provider value={{ santri: SANTRI, active, setActiveId }}>
      {children}
    </SantriContext.Provider>
  );
}

export function useSantri() {
  const ctx = useContext(SantriContext);
  if (!ctx) throw new Error("useSantri must be used within SantriProvider");
  return ctx;
}
