"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Camera,
  DollarSign,
  Minus,
  Pencil,
  Receipt,
  RefreshCw,
  RotateCcw,
  Settings,
  Smartphone,
} from "lucide-react";

type SpendingCategory = "Food" | "Gas" | "Miscellaneous";
type FinancifyTab = "budget" | "analysis";

interface Payment {
  id: string;
  amount: number;
  date: string;
  category: SpendingCategory;
  description: string;
}

const CATEGORIES: SpendingCategory[] = ["Food", "Gas", "Miscellaneous"];
const STORAGE_KEY = "birky-financify-sandbox-v1";

const DEFAULT_BUDGET = 2500;
const DEFAULT_PAYMENTS: Payment[] = [
  {
    id: "pay-1",
    amount: 420,
    date: "2026-11-20 12:18:04",
    category: "Food",
    description: "Fresh fish & market lunch",
  },
  {
    id: "pay-2",
    amount: 350,
    date: "2026-11-21 08:42:19",
    category: "Gas",
    description: "Unleaded petrol full tank",
  },
  {
    id: "pay-3",
    amount: 650,
    date: "2026-11-22 15:10:52",
    category: "Miscellaneous",
    description: "USB-C lapel microphone",
  },
];

function formatNow(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export function FinancifySandbox() {
  const [initialBudget, setInitialBudget] = useState<number | null>(
    DEFAULT_BUDGET
  );
  const [payments, setPayments] = useState<Payment[]>(DEFAULT_PAYMENTS);
  const [activeTab, setActiveTab] = useState<FinancifyTab>("budget");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // BudgetScreen form state
  const [budgetInput, setBudgetInput] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<SpendingCategory>("Food");
  const [amountInput, setAmountInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editBudgetInput, setEditBudgetInput] = useState("");

  // SettingsScreen state
  const [userName, setUserName] = useState("Birky Andrie");
  const [nameInput, setNameInput] = useState("Birky Andrie");
  const [avatarUrl, setAvatarUrl] = useState("/portrait-avatar.jpg");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Flutter SnackBar & refresh feedback
  const [snackBar, setSnackBar] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const showSnack = (message: string) => {
    setSnackBar(message);
  };

  useEffect(() => {
    if (!snackBar) return;
    const timer = setTimeout(() => setSnackBar(null), 2400);
    return () => clearTimeout(timer);
  }, [snackBar]);

  // Persist to localStorage (mirroring SharedPreferences in lib/main.dart)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (typeof parsed.initialBudget === "number" || parsed.initialBudget === null) {
        setInitialBudget(parsed.initialBudget);
      }
      if (Array.isArray(parsed.payments)) {
        setPayments(parsed.payments);
      }
      if (typeof parsed.userName === "string") {
        setUserName(parsed.userName);
        setNameInput(parsed.userName);
      }
    } catch {
      // ignore malformed local storage
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ initialBudget, payments, userName })
      );
    } catch {
      // ignore storage quota errors
    }
  }, [initialBudget, payments, userName]);

  const totalSpent = useMemo(
    () => payments.reduce((sum, item) => sum + item.amount, 0),
    [payments]
  );

  const remainingBudget = useMemo(() => {
    if (initialBudget === null) return 0;
    const rem = initialBudget - totalSpent;
    return rem < 0 ? 0 : rem;
  }, [initialBudget, totalSpent]);

  const spendPercent = useMemo(() => {
    if (!initialBudget || initialBudget <= 0) return 0;
    return Math.min(100, Math.round((totalSpent / initialBudget) * 100));
  }, [initialBudget, totalSpent]);

  // Exact AnalysisScreen delta comparison from lib/main.dart lines 446-465
  const analysis = useMemo(() => {
    if (payments.length < 2) {
      return {
        text: "Not enough data for analysis.",
        direction: "none" as const,
        colorClass: "text-slate-400",
        badgeBg: "bg-slate-100",
      };
    }
    const last = payments[payments.length - 1];
    const prev = payments[payments.length - 2];
    const diff = last.amount - prev.amount;

    if (diff > 0) {
      return {
        text: `Your spending increased by ₱${diff.toFixed(
          2
        )} compared to the previous entry.`,
        direction: "up" as const,
        colorClass: "text-red-600",
        badgeBg: "bg-red-50",
      };
    }
    if (diff < 0) {
      return {
        text: `Your spending decreased by ₱${Math.abs(diff).toFixed(
          2
        )} compared to the previous entry.`,
        direction: "down" as const,
        colorClass: "text-emerald-600",
        badgeBg: "bg-emerald-50",
      };
    }
    return {
      text: "Your spending remained the same as the previous entry.",
      direction: "same" as const,
      colorClass: "text-blue-600",
      badgeBg: "bg-blue-50",
    };
  }, [payments]);

  const handleSetInitialBudget = () => {
    const val = parseFloat(budgetInput);
    if (isNaN(val) || val <= 0) return;
    setInitialBudget(val);
    setBudgetInput("");
    showSnack(`Weekly budget set to ₱${val.toFixed(2)}`);
  };

  const handleAddSpending = (override?: {
    amount: number;
    category: SpendingCategory;
    description: string;
  }) => {
    const amount = override ? override.amount : parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) return;

    const category = override ? override.category : selectedCategory;
    const description = override ? override.description : descInput.trim();

    if (initialBudget === null) {
      setInitialBudget(DEFAULT_BUDGET);
    }

    const entry: Payment = {
      id: `pay-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      amount,
      date: formatNow(),
      category,
      description,
    };

    setPayments((prev) => [...prev, entry]);
    if (!override) {
      setAmountInput("");
      setDescInput("");
    }
    setSettingsOpen(false);
    showSnack(`Logged ₱${amount.toFixed(2)} (${category})`);
  };

  const handleResetWeek = () => {
    setPayments([]);
    showSnack("Weekly budget reset.");
  };

  const handleOpenEditDialog = () => {
    setEditBudgetInput(initialBudget !== null ? String(initialBudget) : "");
    setEditDialogOpen(true);
  };

  const handleSaveEditedBudget = () => {
    const val = parseFloat(editBudgetInput);
    if (isNaN(val) || val <= 0) return;
    setInitialBudget(val);
    setEditDialogOpen(false);
    showSnack(`Weekly budget updated to ₱${val.toFixed(2)}`);
  };

  const handleSaveProfile = () => {
    const cleaned = nameInput.trim() || "Your Name";
    setUserName(cleaned);
    setNameInput(cleaned);
    showSnack("Profile updated!");
  };

  const handleProfileImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    showSnack("Gallery photo selected");
  };

  const handlePullRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showSnack("Synced SharedPreferences entries");
    }, 380);
  };

  const handleRestoreDefaults = () => {
    setInitialBudget(DEFAULT_BUDGET);
    setPayments(DEFAULT_PAYMENTS);
    setUserName("Birky Andrie");
    setNameInput("Birky Andrie");
    setAvatarUrl("/portrait-avatar.jpg");
    setActiveTab("budget");
    setSettingsOpen(false);
    showSnack("Demo dataset restored");
  };

  const prefsSnapshot = useMemo(
    () =>
      JSON.stringify(
        {
          initial_budget: initialBudget,
          user_name: userName,
          payments_count: payments.length,
          latest_payment:
            payments.length > 0
              ? {
                  amount: payments[payments.length - 1].amount,
                  category: payments[payments.length - 1].category,
                  description: payments[payments.length - 1].description,
                }
              : null,
        },
        null,
        2
      ),
    [initialBudget, payments, userName]
  );

  return (
    <div className="mt-8 border border-[var(--color-cinema-border)] bg-[var(--color-cinema-alt)]">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-cinema-border)] px-5 py-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-signal)]">
            STAGE 04 // FLUTTER CROSS-PLATFORM LIVE TEST RUN
          </span>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold">
            Financify — Weekly Budget &amp; Spending Analysis App
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="inline-flex items-center gap-1.5 border border-[var(--color-cinema-border)] bg-[var(--color-cinema)] px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-[var(--color-cinema-muted)] hover:border-[var(--color-cinema-text)] hover:text-[var(--color-cinema-text)] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Demo
          </button>
          <a
            href="https://github.com/Birky-andrie/Financify"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 border border-[var(--color-cinema-text)] bg-[var(--color-cinema-text)] px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-[var(--color-cinema)] hover:bg-[var(--color-signal)] hover:border-[var(--color-signal)] hover:text-[var(--color-cinema-text)] transition-colors"
          >
            lib/main.dart (625 LOC)
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Main Split Stage: Interactive Flutter Phone Emulator (Left) + Live Scenarios & Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT 5 COLS: Interactive Flutter Mobile Viewport */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[var(--color-cinema-border)] bg-[#0E1014] p-6 sm:p-8 flex flex-col items-center justify-center">
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-cinema-muted)]">
            <Smartphone className="h-3.5 w-3.5 text-[var(--color-signal)]" />
            <span>INTERACTIVE RUNNER // MIRRORS LIB/MAIN.DART</span>
          </div>

          {/* Hardware Device Bezel */}
          <div
            id="financify-phone-frame"
            className="relative w-full max-w-[348px] rounded-[34px] border-[6px] border-[#2C2F36] bg-white text-[#1C1D20] shadow-[0_24px_60px_rgba(0,0,0,0.65)] overflow-hidden"
          >
            {/* Status Bar */}
            <div className="flex items-center justify-between bg-[#1976D2] px-5 pt-2.5 pb-1 text-[10px] font-mono text-white/90">
              <span>9:41</span>
              <span className="h-3.5 w-16 rounded-full bg-black/35" />
              <span>5G · 98%</span>
            </div>

            {/* Flutter Material AppBar */}
            <div className="flex items-center justify-between bg-[#2196F3] px-4 py-3 text-white shadow-sm">
              <div className="flex items-center gap-2.5">
                {settingsOpen && (
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    aria-label="Back from Settings"
                    className="rounded-full p-1 hover:bg-white/15 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <span className="text-[15px] font-medium tracking-tight">
                  {settingsOpen ? "Settings" : "Budget & Analysis App"}
                </span>
              </div>
              {!settingsOpen && (
                <span className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[9px] uppercase">
                  PHP ₱
                </span>
              )}
            </div>

            {/* Scrollable Screen Body */}
            <div className="relative h-[476px] overflow-y-auto bg-[#FAFAFA] px-4 py-4 text-left">
              {settingsOpen ? (
                /* SettingsScreen (lib/main.dart lines 522-625) */
                <div className="space-y-5 pt-2">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={avatarUrl}
                        alt={userName}
                        className="h-28 w-28 rounded-full object-cover border-2 border-[#2196F3]/30 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Pick profile image"
                        className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2196F3] shadow-md border border-slate-200 hover:bg-blue-50 cursor-pointer"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImagePick}
                        className="hidden"
                      />
                    </div>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                      image_picker · gallery sync
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="financify-name-input"
                      className="block text-[11px] font-medium text-slate-500 mb-1"
                    >
                      Name / Nickname
                    </label>
                    <input
                      id="financify-name-input"
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#2196F3] focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="w-full rounded bg-[#2196F3] py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#1976D2] transition-colors cursor-pointer"
                  >
                    Save Profile
                  </button>
                </div>
              ) : activeTab === "budget" ? (
                /* BudgetScreen (lib/main.dart lines 123-405) */
                initialBudget === null ? (
                  <div className="space-y-3 pt-4">
                    <h4 className="text-base font-bold text-slate-900">
                      Set Your Weekly Budget
                    </h4>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      placeholder="Enter weekly budget (e.g., 2000)"
                      className="w-full border-b-2 border-slate-300 bg-transparent py-2 text-sm text-slate-900 focus:border-[#2196F3] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSetInitialBudget}
                      className="rounded bg-[#2196F3] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#1976D2] cursor-pointer"
                    >
                      Set Budget
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5 pb-10">
                    {/* Budget Summary Card */}
                    <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 tabular-nums">
                          Weekly Budget:{" "}
                          <strong className="font-semibold text-slate-900">
                            ₱{initialBudget.toFixed(2)}
                          </strong>
                        </span>
                        <button
                          type="button"
                          onClick={handleOpenEditDialog}
                          aria-label="Edit weekly budget"
                          className="rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-[#2196F3] cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-sm text-slate-700 tabular-nums">
                        Total Spent: ₱{totalSpent.toFixed(2)}
                      </div>
                      <div
                        className={`text-sm font-bold tabular-nums ${
                          remainingBudget <= 0
                            ? "text-red-600"
                            : "text-slate-900"
                        }`}
                      >
                        Remaining: ₱{remainingBudget.toFixed(2)}
                      </div>
                      <div className="pt-1">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full transition-all duration-300 ${
                              remainingBudget <= 0
                                ? "bg-red-500"
                                : "bg-[#2196F3]"
                            }`}
                            style={{ width: `${spendPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Add Spending Entry Form */}
                    <div className="space-y-2.5 border-t border-slate-200 pt-3">
                      <h4 className="text-sm font-bold text-slate-900">
                        Add Spending Entry
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <span>Category:</span>
                        <select
                          aria-label="Spending category"
                          value={selectedCategory}
                          onChange={(e) =>
                            setSelectedCategory(
                              e.target.value as SpendingCategory
                            )
                          }
                          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-900 focus:border-[#2196F3] focus:outline-none"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        placeholder="Enter spending amount"
                        className="w-full border-b border-slate-300 bg-transparent py-1.5 text-xs text-slate-900 focus:border-[#2196F3] focus:outline-none"
                      />

                      <input
                        type="text"
                        value={descInput}
                        onChange={(e) => setDescInput(e.target.value)}
                        placeholder="Description (e.g., fish, petrol, microphone)"
                        className="w-full border-b border-slate-300 bg-transparent py-1.5 text-xs text-slate-900 focus:border-[#2196F3] focus:outline-none"
                      />

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAddSpending()}
                          className="rounded bg-[#2196F3] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1976D2] transition-colors cursor-pointer"
                        >
                          Add Spending
                        </button>

                        {remainingBudget <= 0 && payments.length > 0 && (
                          <button
                            type="button"
                            onClick={handleResetWeek}
                            className="rounded bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-red-700 transition-colors cursor-pointer"
                          >
                            Reset Week
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Spending History */}
                    <div className="border-t border-slate-200 pt-3 space-y-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        Spending History:
                      </h4>
                      {payments.length === 0 ? (
                        <p className="text-xs text-slate-400 py-2">
                          No spending recorded yet.
                        </p>
                      ) : (
                        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
                          {[...payments].reverse().map((p) => (
                            <li
                              key={p.id}
                              className="flex items-start gap-2.5 px-3 py-2"
                            >
                              <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-slate-900 tabular-nums">
                                  ₱{p.amount.toFixed(2)} - {p.category}
                                </div>
                                <div className="truncate text-[11px] text-slate-500">
                                  {p.description ? `${p.description} - ` : ""}
                                  {p.date}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )
              ) : (
                /* AnalysisScreen (lib/main.dart lines 408-519) */
                <div className="space-y-4 pb-10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900">
                      Weekly Spending Analysis
                    </h4>
                    <button
                      type="button"
                      onClick={handlePullRefresh}
                      aria-label="Refresh spending analysis"
                      className="rounded-full p-1.5 text-slate-500 hover:bg-slate-200/70 cursor-pointer"
                    >
                      <RefreshCw
                        className={`h-3.5 w-3.5 ${
                          refreshing ? "animate-spin text-[#2196F3]" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div
                    className={`rounded-xl border border-slate-200 ${analysis.badgeBg} p-4 text-center space-y-2`}
                  >
                    <div className="flex justify-center">
                      {analysis.direction === "up" && (
                        <ArrowUp
                          className={`h-11 w-11 ${analysis.colorClass}`}
                        />
                      )}
                      {analysis.direction === "down" && (
                        <ArrowDown
                          className={`h-11 w-11 ${analysis.colorClass}`}
                        />
                      )}
                      {(analysis.direction === "same" ||
                        analysis.direction === "none") && (
                        <Minus className={`h-11 w-11 ${analysis.colorClass}`} />
                      )}
                    </div>
                    <p className="text-xs font-medium leading-relaxed text-slate-800">
                      {analysis.text}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-bold text-slate-900">
                      Spending History
                    </h5>
                    {payments.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">
                        No spending recorded yet.
                      </p>
                    ) : (
                      <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
                        {payments.map((p) => (
                          <li
                            key={p.id}
                            className="flex items-start gap-2.5 px-3 py-2"
                          >
                            <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-slate-900 tabular-nums">
                                ₱{p.amount.toFixed(2)} - {p.category}
                              </div>
                              <div className="truncate text-[11px] text-slate-500">
                                {p.description ? `${p.description} - ` : ""}
                                {p.date}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Edit Weekly Budget AlertDialog (lib/main.dart lines 225-258) */}
              {editDialogOpen && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 p-5">
                  <div className="w-full rounded-lg bg-white p-4 shadow-xl space-y-3">
                    <div className="text-sm font-bold text-slate-900">
                      Edit Weekly Budget
                    </div>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={editBudgetInput}
                      onChange={(e) => setEditBudgetInput(e.target.value)}
                      placeholder="Enter new weekly budget"
                      className="w-full border-b-2 border-[#2196F3] py-1.5 text-sm text-slate-900 focus:outline-none"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditDialogOpen(false)}
                        className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveEditedBudget}
                        className="rounded bg-[#2196F3] px-3.5 py-1 text-xs font-semibold text-white hover:bg-[#1976D2] cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Material SnackBar */}
              {snackBar && (
                <div className="sticky bottom-2 left-0 right-0 z-20 mx-auto rounded bg-[#323232] px-3 py-2 text-[11px] font-medium text-white shadow-lg">
                  {snackBar}
                </div>
              )}
            </div>

            {/* Bottom Navigation Bar + Start-Docked Settings FAB */}
            {!settingsOpen && (
              <div className="relative border-t border-slate-200 bg-white">
                {/* FloatingActionButtonLocation.startDocked */}
                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  aria-label="Open Settings"
                  title="Settings (Profile & Nickname)"
                  className="absolute -top-6 left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#2196F3] text-white shadow-lg hover:bg-[#1976D2] transition-transform hover:scale-105 cursor-pointer"
                >
                  <Settings className="h-5 w-5" />
                </button>

                <div className="grid grid-cols-2 pl-12">
                  <button
                    type="button"
                    onClick={() => setActiveTab("budget")}
                    className={`flex flex-col items-center justify-center py-2.5 text-[11px] font-medium transition-colors cursor-pointer ${
                      activeTab === "budget"
                        ? "text-[#2196F3]"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <DollarSign className="h-4 w-4 mb-0.5" />
                    Budget
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("analysis")}
                    className={`flex flex-col items-center justify-center py-2.5 text-[11px] font-medium transition-colors cursor-pointer ${
                      activeTab === "analysis"
                        ? "text-[#2196F3]"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 mb-0.5" />
                    Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 7 COLS: One-Click Scenarios, Live SharedPreferences Inspector & Architecture */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-6">
            {/* Interactive Test Scenarios */}
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-cinema-muted)] mb-2">
                01 // ONE-CLICK TEST RUN SCENARIOS (LIVE STATE MUTATION)
              </div>
              <p className="text-sm text-[var(--color-cinema-muted)] mb-4">
                Interact directly inside the phone frame on the left, or trigger
                exact code paths from{" "}
                <code className="font-mono text-xs text-[var(--color-cinema-text)]">
                  Birky-andrie/Financify/lib/main.dart
                </code>{" "}
                below:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("budget");
                    handleAddSpending({
                      amount: 280,
                      category: "Food",
                      description: "Coffee & rice bowl",
                    });
                  }}
                  className="border border-[var(--color-cinema-border)] bg-[var(--color-cinema)] px-3.5 py-2.5 text-left font-mono text-xs text-[var(--color-cinema-text)] hover:border-[var(--color-signal)] transition-colors cursor-pointer"
                >
                  <span className="text-[var(--color-signal)]">+ </span>
                  Log Food Expense (₱280)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("budget");
                    handleAddSpending({
                      amount: Math.max(remainingBudget, 1100),
                      category: "Miscellaneous",
                      description: "Weekly hardware purchase",
                    });
                  }}
                  className="border border-[var(--color-cinema-border)] bg-[var(--color-cinema)] px-3.5 py-2.5 text-left font-mono text-xs text-[var(--color-cinema-text)] hover:border-red-400 transition-colors cursor-pointer"
                >
                  <span className="text-red-400">! </span>
                  Exhaust Budget → Show Reset Week
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSettingsOpen(false);
                    setActiveTab("analysis");
                  }}
                  className="border border-[var(--color-cinema-border)] bg-[var(--color-cinema)] px-3.5 py-2.5 text-left font-mono text-xs text-[var(--color-cinema-text)] hover:border-[var(--color-signal)] transition-colors cursor-pointer"
                >
                  <span className="text-[var(--color-signal)]">→ </span>
                  Switch to Analysis Delta View
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className="border border-[var(--color-cinema-border)] bg-[var(--color-cinema)] px-3.5 py-2.5 text-left font-mono text-xs text-[var(--color-cinema-text)] hover:border-[var(--color-signal)] transition-colors cursor-pointer"
                >
                  <span className="text-[var(--color-signal)]">⚙ </span>
                  Push Settings Route (FAB)
                </button>
              </div>
            </div>

            {/* Live SharedPreferences JSON Persistence Inspector */}
            <div className="border border-[var(--color-cinema-border)] bg-[var(--color-cinema)] p-4">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--color-cinema-muted)] mb-2">
                <span>02 // LIVE SHAREDPREFERENCES JSON PAYLOAD</span>
                <span className="text-emerald-400">PERSISTED</span>
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-[var(--color-cinema-text)] tabular-nums">
                {prefsSnapshot}
              </pre>
            </div>
          </div>

          {/* Architecture Telemetry Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[var(--color-cinema-border)]">
            {[
              { label: "TARGETS", value: "6 OS Builds" },
              { label: "CODEBASE", value: "Flutter / Dart" },
              { label: "STORAGE", value: "SharedPrefs JSON" },
              { label: "MEDIA", value: "ImagePicker API" },
            ].map((spec) => (
              <div
                key={spec.label}
                className="border border-[var(--color-cinema-border)] bg-[var(--color-cinema)] p-3"
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-cinema-muted)]">
                  {spec.label}
                </div>
                <div className="mt-1 font-mono text-xs font-semibold text-[var(--color-cinema-text)]">
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
