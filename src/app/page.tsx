"use client";

import { useState, useMemo, useEffect } from "react";

interface ExpenseItem {
  id: string;
  name: string;
  default: number;
  highlight?: boolean;
  category?: "essential" | "housing" | "lifestyle";
}

const expenseItems: ExpenseItem[] = [
  { id: "mortgage", name: "房贷/房租", default: 4000, highlight: true, category: "housing" },
  { id: "car_loan", name: "车贷", default: 3000, highlight: true, category: "housing" },
  { id: "living", name: "普通生活支出", default: 3000, category: "essential" },
  { id: "car_expense", name: "车费(油费/保险/养护)", default: 1000, category: "essential" },
  { id: "dining", name: "外出就餐", default: 800, category: "lifestyle" },
  { id: "insurance", name: "商业保险", default: 500, category: "essential" },
  { id: "travel", name: "旅行", default: 500, category: "lifestyle" },
  { id: "subscription", name: "会员订阅", default: 50, category: "lifestyle" },
  { id: "social", name: "人情往来", default: 500, category: "lifestyle" },
  { id: "education", name: "教育/培训", default: 0, category: "lifestyle" },
  { id: "other", name: "其他支出", default: 500, category: "lifestyle" },
];

interface PassiveIncomeItem {
  id: string;
  name: string;
  default: number;
  icon: string;
}

const passiveIncomeItems: PassiveIncomeItem[] = [
  { id: "rent", name: "房租收入", default: 0, icon: "home" },
  { id: "interest", name: "存款利息", default: 0, icon: "bank" },
  { id: "dividend", name: "股息/基金收益", default: 0, icon: "chart" },
  { id: "pension", name: "失业金/补贴", default: 0, icon: "shield" },
  { id: "other", name: "其他被动收入", default: 0, icon: "plus" },
];

const childAgeGroups = [
  { id: "0-3", name: "0-3岁", desc: "婴幼儿", default: 3000 },
  { id: "3-6", name: "3-6岁", desc: "幼儿园", default: 2000 },
  { id: "6-12", name: "6-12岁", desc: "小学", default: 1500 },
  { id: "12-18", name: "12-18岁", desc: "中学", default: 2000 },
  { id: "18+", name: "18岁+", desc: "大学/成人", default: 2500 },
];

interface ChildCount {
  ageGroup: string;
  count: number;
}

// SVG Icons
const Icons = {
  Wallet: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Trend: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  Home: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  Bank: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  ),
  Chart: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
    </svg>
  ),
  ShieldSmall: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  ),
  Sun: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  ),
};

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [familyStatus, setFamilyStatus] = useState({
    married: false,
    spouseIncome: 0,
    spousePassiveIncome: 0,
    hasChildren: false,
  });
  const [childCounts, setChildCounts] = useState<Record<string, number>>({});
  const [unemploymentMode, setUnemploymentMode] = useState<"self" | "both">("self");
  const [savings, setSavings] = useState({
    cash: 0,
    bank: 50000,
    liquidity: 0,
  });
  const [expenses, setExpenses] = useState<Record<string, number>>({});
  const [passiveIncome, setPassiveIncome] = useState<Record<string, number>>({});
  const [expandedSections, setExpandedSections] = useState({
    family: true,
    savings: true,
    expenses: true,
    income: true,
  });

  // Handle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const spouseTotalIncome = useMemo(() => {
    if (!familyStatus.married || unemploymentMode === "both") return 0;
    return familyStatus.spouseIncome + familyStatus.spousePassiveIncome;
  }, [familyStatus, unemploymentMode]);

  const childrenExpenses = useMemo(() => {
    if (!familyStatus.hasChildren) return 0;
    let total = 0;
    childAgeGroups.forEach((group) => {
      const count = childCounts[group.id] || 0;
      total += group.default * count;
    });
    return total;
  }, [familyStatus.hasChildren, childCounts]);

  const monthlyExpenses = useMemo(() => {
    let total = 0;
    expenseItems.forEach((item) => {
      total += expenses[item.id] || item.default;
    });
    return total;
  }, [expenses]);

  const monthlyPassiveIncome = useMemo(() => {
    let total = 0;
    passiveIncomeItems.forEach((item) => {
      total += passiveIncome[item.id] || item.default;
    });
    return total;
  }, [passiveIncome]);

  const totalSavings = savings.cash + savings.bank + savings.liquidity;
  const netMonthlyExpense = monthlyExpenses + childrenExpenses - monthlyPassiveIncome - spouseTotalIncome;
  const survivalMonths = netMonthlyExpense > 0 ? Math.floor(totalSavings / netMonthlyExpense) : Infinity;
  const survivalYears = Math.floor(survivalMonths / 12);
  const remainingMonths = survivalMonths % 12;

  const riskLevel = useMemo(() => {
    if (survivalMonths >= 24) return { level: "安全", color: "emerald", bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", icon: <Icons.Check /> };
    if (survivalMonths >= 12) return { level: "良好", color: "amber", bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", icon: <Icons.Trend /> };
    if (survivalMonths >= 6) return { level: "预警", color: "orange", bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400", icon: <Icons.Alert /> };
    return { level: "危险", color: "red", bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", icon: <Icons.Alert /> };
  }, [survivalMonths]);

  const totalChildren = useMemo(() => {
    let total = 0;
    Object.values(childCounts).forEach((count) => { total += count; });
    return total;
  }, [childCounts]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`;

  const SurvivalRing = ({ months, color }: { months: number; color: string }) => {
    const percentage = months === Infinity ? 100 : Math.min((months / 24) * 100, 100);
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 150 150">
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-zinc-800"
          />
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`text-${color}-500 transition-all duration-700 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold text-${color}-400`}>
            {months === Infinity ? "∞" : months}
          </span>
          <span className="text-sm text-zinc-400 mt-1">个月</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Icons.Wallet />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-zinc-900 dark:text-white">LifeLine</h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">失业生存计算器</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Icons.Sun /> : <Icons.Moon />}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Input Sections */}
            <div className="lg:col-span-2 space-y-4">
              {/* Family Settings */}
              <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                <button
                  onClick={() => toggleSection("family")}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center text-sm font-semibold">1</span>
                    <h2 className="font-semibold text-zinc-900 dark:text-white">家庭状况</h2>
                  </div>
                  <span className={`transform transition-transform ${expandedSections.family ? "rotate-180" : ""}`}>
                    <Icons.ChevronDown />
                  </span>
                </button>

                {expandedSections.family && (
                  <div className="px-6 pb-6 space-y-4">
                    {/* Marital Status */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={familyStatus.married}
                            onChange={(e) => setFamilyStatus({ ...familyStatus, married: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500" />
                        </label>
                        <span className="font-medium text-zinc-900 dark:text-white">已婚</span>
                      </div>
                      {familyStatus.married && (
                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                          <Icons.Check />
                          <span>已启用配偶信息</span>
                        </div>
                      )}
                    </div>

                    {familyStatus.married && (
                      <div className="grid sm:grid-cols-2 gap-3 p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">配偶月薪</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">¥</span>
                            <input
                              type="number"
                              value={familyStatus.spouseIncome}
                              onChange={(e) => setFamilyStatus({ ...familyStatus, spouseIncome: Number(e.target.value) })}
                              className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">配偶被动收入</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">¥</span>
                            <input
                              type="number"
                              value={familyStatus.spousePassiveIncome}
                              onChange={(e) => setFamilyStatus({ ...familyStatus, spousePassiveIncome: Number(e.target.value) })}
                              className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Children Status */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={familyStatus.hasChildren}
                            onChange={(e) => setFamilyStatus({ ...familyStatus, hasChildren: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500" />
                        </label>
                        <span className="font-medium text-zinc-900 dark:text-white">有孩子</span>
                      </div>
                      {familyStatus.hasChildren && (
                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                          <span>{totalChildren} 个孩子</span>
                        </div>
                      )}
                    </div>

                    {familyStatus.hasChildren && (
                      <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
                        <div className="grid sm:grid-cols-2 gap-3">
                          {childAgeGroups.map((group) => (
                            <div key={group.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-900">
                              <div>
                                <span className="block text-sm font-medium text-zinc-900 dark:text-white">{group.name}</span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">{group.desc}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const current = childCounts[group.id] || 0;
                                    if (current > 0) {
                                      setChildCounts({ ...childCounts, [group.id]: current - 1 });
                                    }
                                  }}
                                  className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center font-semibold text-zinc-900 dark:text-white">
                                  {childCounts[group.id] || 0}
                                </span>
                                <button
                                  onClick={() => {
                                    setChildCounts({ ...childCounts, [group.id]: (childCounts[group.id] || 0) + 1 });
                                  }}
                                  className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Unemployment Mode */}
                    {familyStatus.married && (
                      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                        <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">失业模式</span>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="unemploymentMode"
                              checked={unemploymentMode === "self"}
                              onChange={() => setUnemploymentMode("self")}
                              className="w-4 h-4 text-violet-500 border-zinc-300 focus:ring-violet-500"
                            />
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">仅本人失业</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="unemploymentMode"
                              checked={unemploymentMode === "both"}
                              onChange={() => setUnemploymentMode("both")}
                              className="w-4 h-4 text-violet-500 border-zinc-300 focus:ring-violet-500"
                            />
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">双方失业</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Savings */}
              <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                <button
                  onClick={() => toggleSection("savings")}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm font-semibold">2</span>
                    <h2 className="font-semibold text-zinc-900 dark:text-white">流动资产积蓄</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-blue-500">{formatCurrency(totalSavings)}</span>
                    <span className={`transform transition-transform ${expandedSections.savings ? "rotate-180" : ""}`}>
                      <Icons.ChevronDown />
                    </span>
                  </div>
                </button>

                {expandedSections.savings && (
                  <div className="px-6 pb-6">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">现金</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">¥</span>
                          <input
                            type="number"
                            value={savings.cash}
                            onChange={(e) => setSavings({ ...savings, cash: Number(e.target.value) })}
                            className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">银行存款</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">¥</span>
                          <input
                            type="number"
                            value={savings.bank}
                            onChange={(e) => setSavings({ ...savings, bank: Number(e.target.value) })}
                            className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">活期理财</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">¥</span>
                          <input
                            type="number"
                            value={savings.liquidity}
                            onChange={(e) => setSavings({ ...savings, liquidity: Number(e.target.value) })}
                            className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Monthly Expenses */}
              <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                <button
                  onClick={() => toggleSection("expenses")}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-sm font-semibold">3</span>
                    <h2 className="font-semibold text-zinc-900 dark:text-white">每月支出</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-red-500">{formatCurrency(monthlyExpenses)}</span>
                    <span className={`transform transition-transform ${expandedSections.expenses ? "rotate-180" : ""}`}>
                      <Icons.ChevronDown />
                    </span>
                  </div>
                </button>

                {expandedSections.expenses && (
                  <div className="px-6 pb-6">
                    <div className="space-y-3">
                      {/* Housing */}
                      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                        <h3 className="text-xs font-semibold text-red-600 dark:text-red-400 mb-3 uppercase tracking-wider">居住支出</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {expenseItems.filter(e => e.category === "housing").map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-28">{item.name}</span>
                              <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">¥</span>
                                <input
                                  type="number"
                                  defaultValue={item.default}
                                  onChange={(e) => setExpenses({ ...expenses, [item.id]: Number(e.target.value) })}
                                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Essential */}
                      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                        <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">必需支出</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {expenseItems.filter(e => e.category === "essential").map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <span className="text-sm text-zinc-600 dark:text-zinc-400 w-28">{item.name}</span>
                              <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">¥</span>
                                <input
                                  type="number"
                                  defaultValue={item.default}
                                  onChange={(e) => setExpenses({ ...expenses, [item.id]: Number(e.target.value) })}
                                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-400 focus:border-transparent outline-none transition-all"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Lifestyle */}
                      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                        <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">生活支出</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {expenseItems.filter(e => e.category === "lifestyle").map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <span className="text-sm text-zinc-600 dark:text-zinc-400 w-28">{item.name}</span>
                              <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">¥</span>
                                <input
                                  type="number"
                                  defaultValue={item.default}
                                  onChange={(e) => setExpenses({ ...expenses, [item.id]: Number(e.target.value) })}
                                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-400 focus:border-transparent outline-none transition-all"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Passive Income */}
              <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                <button
                  onClick={() => toggleSection("income")}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm font-semibold">4</span>
                    <h2 className="font-semibold text-zinc-900 dark:text-white">每月被动收入</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-emerald-500">{formatCurrency(monthlyPassiveIncome)}</span>
                    <span className={`transform transition-transform ${expandedSections.income ? "rotate-180" : ""}`}>
                      <Icons.ChevronDown />
                    </span>
                  </div>
                </button>

                {expandedSections.income && (
                  <div className="px-6 pb-6">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {passiveIncomeItems.map((item) => {
                        const IconComponent = {
                          home: Icons.Home,
                          bank: Icons.Bank,
                          chart: Icons.Chart,
                          shield: Icons.ShieldSmall,
                          plus: Icons.Plus,
                        }[item.icon] || Icons.Plus;

                        return (
                          <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                              <IconComponent />
                            </div>
                            <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">{item.name}</span>
                            <div className="relative w-28">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">¥</span>
                              <input
                                type="number"
                                defaultValue={item.default}
                                onChange={(e) => setPassiveIncome({ ...passiveIncome, [item.id]: Number(e.target.value) })}
                                className="w-full pl-8 pr-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/50 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Main Result Card */}
                <div className={`bg-gradient-to-br from-${riskLevel.color}-500/10 to-${riskLevel.color}-500/5 backdrop-blur-xl rounded-2xl border ${riskLevel.border} shadow-xl overflow-hidden`}>
                  <div className="p-6 text-center">
                    <SurvivalRing months={survivalMonths === Infinity ? 999 : survivalMonths} color={riskLevel.color} />

                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${riskLevel.bg} ${riskLevel.border} border mt-4`}>
                      <span className={`w-2 h-2 rounded-full bg-${riskLevel.color}-500 animate-pulse`} />
                      <span className={`font-semibold ${riskLevel.text}`}>
                        风险等级: {riskLevel.level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-6">
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <Icons.Trend />
                    详细分析
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">总积蓄</span>
                      <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(totalSavings)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">月支出</span>
                      <span className="font-semibold text-red-500">-{formatCurrency(monthlyExpenses)}</span>
                    </div>
                    {familyStatus.hasChildren && (
                      <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">孩子支出</span>
                        <span className="font-semibold text-red-500">-{formatCurrency(childrenExpenses)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">月被动收入</span>
                      <span className="font-semibold text-emerald-500">+{formatCurrency(monthlyPassiveIncome)}</span>
                    </div>
                    {familyStatus.married && unemploymentMode === "self" && (
                      <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">配偶收入</span>
                        <span className="font-semibold text-emerald-500">+{formatCurrency(spouseTotalIncome)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3 bg-zinc-50 dark:bg-zinc-800/50 -mx-2 px-4 rounded-xl">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">净月支出</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{formatCurrency(netMonthlyExpense > 0 ? netMonthlyExpense : 0)}</span>
                    </div>
                    {survivalMonths !== Infinity && (
                      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">可生存</span>
                          <span className="font-bold text-zinc-900 dark:text-white">
                            {survivalYears > 0 && `${survivalYears}年 `}
                            {remainingMonths > 0 && `${remainingMonths}个月`}
                            {survivalYears === 0 && remainingMonths === 0 && "不足1个月"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                {survivalMonths < 12 && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 backdrop-blur-xl rounded-2xl border border-amber-200 dark:border-amber-900/50 p-6">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-4 flex items-center gap-2">
                      <Icons.Alert />
                      建议
                    </h3>
                    <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>建立至少6个月的紧急备用金</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>考虑降低非必要支出</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>增加被动收入来源</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>提升职业技能竞争力</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center text-xs text-zinc-400 dark:text-zinc-500 py-4">
                  <p>数据来源: 国家统计局、CHFS</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
