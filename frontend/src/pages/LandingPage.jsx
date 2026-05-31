import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, TrendingUp, PieChart, Target, Check } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { LogoIcon } from '../components/ui/Logo';

const demoData = [
  { name: 'Jan', income: 45000, expense: 28000 },
  { name: 'Feb', income: 52000, expense: 31000 },
  { name: 'Mar', income: 48000, expense: 26000 },
  { name: 'Apr', income: 61000, expense: 35000 },
  { name: 'May', income: 59000, expense: 32000 },
  { name: 'Jun', income: 65000, expense: 29000 },
];

export const PrimaryButton = ({ label = 'Launch FinScope', onClick, full = false }) => (
  <button 
    onClick={onClick}
    className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-6 py-3.5 transition-all hover:bg-white/90 active:scale-[0.98] shadow-lg ${full ? 'w-full' : ''}`}
  >
    <span>{label}</span>
    <ChevronRight className="w-4 h-4 text-black transition-transform group-hover:translate-x-1 duration-200" />
  </button>
);

const gradientStyle = {
  backgroundImage: 'linear-gradient(to right, #6366f1 0%, #3b82f6 35%, #00d2ff 70%, #10b981 100%)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent'
};

export default function LandingPage({ onLaunchApp }) {
  const { user } = useAuth();
  
  const handleCtaClick = () => {
    onLaunchApp();
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050812] text-white selection:bg-brand/30">
      
      {/* MINIMAL AMBIENT GLOW */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen opacity-50 pointer-events-none"></div>
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 w-full border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleCtaClick}>
            <LogoIcon className="w-8 h-8" />
            <span className="font-bold tracking-tight text-lg">FinScope</span>
          </div>

          <div className="flex items-center gap-4">
            <PrimaryButton label={user ? "Go to Dashboard" : "Sign In"} onClick={handleCtaClick} />
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 text-center flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          Your expenses.<br />
          <span style={gradientStyle}>Revitalized.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-8 text-white/60 max-w-2xl text-base md:text-lg leading-[1.6]"
        >
          FinScope is a beautifully minimal personal finance tracker. Log your income, monitor daily expenses, set budget ceilings, and visualize your financial health with zero clutter.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-10"
        >
          <PrimaryButton label="Get Started Now" onClick={handleCtaClick} />
        </motion.div>
      </section>

      {/* FEATURES SECTION (3-COLUMN MINIMAL) */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
              <TrendingUp className="text-blue-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Track Cash Flow</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Log your income and expenses instantly. Categorize transactions to see exactly where your money goes every month.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
              <Target className="text-emerald-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Set Budget Limits</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Define maximum spending ceilings for specific categories. FinScope tracks your percentage used so you never overspend.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
              <PieChart className="text-purple-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Visual Analytics</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Beautiful, interactive charts give you a bird's-eye view of your wealth. Understand your spending habits at a glance.
            </p>
          </motion.div>

        </div>
      </section>

      {/* PRICING / SUBSCRIPTION SECTION */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto">
            Choose the plan that best fits your financial tracking needs. No hidden fees or surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2">Free</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold tracking-tight">₹0</span>
              <span className="text-white/50 text-sm">/month</span>
            </div>
            <p className="text-sm text-white/50 mb-8 border-b border-white/5 pb-8">
              Perfect for getting started with basic expense tracking.
            </p>
            <ul className="space-y-4 mb-8 flex-1">
              {['Up to 50 transactions/mo', 'Basic budgeting', 'Standard analytics', 'Community support'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={handleCtaClick} className="w-full py-3 rounded-full bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors">
              Get Started
            </button>
          </div>

          {/* Pro Tier (Highlighted) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/30 hover:border-indigo-500/50 transition-all flex flex-col relative md:scale-105 shadow-[0_0_40px_rgba(99,102,241,0.1)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
              Most Popular
            </div>
            <h3 className="text-lg font-bold text-indigo-400 mb-2">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold tracking-tight">₹199</span>
              <span className="text-white/50 text-sm">/month</span>
            </div>
            <p className="text-sm text-white/50 mb-8 border-b border-white/5 pb-8">
              For power users who need deep financial insights.
            </p>
            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited transactions', 'Unlimited budget limits', 'Advanced visual analytics', 'Priority email support', 'Custom tags & export'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/90">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <PrimaryButton label="Upgrade to Pro" onClick={handleCtaClick} full={true} />
          </div>

          {/* Ultimate Tier */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2">Ultimate</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold tracking-tight">₹499</span>
              <span className="text-white/50 text-sm">/month</span>
            </div>
            <p className="text-sm text-white/50 mb-8 border-b border-white/5 pb-8">
              For families and businesses requiring collaboration.
            </p>
            <ul className="space-y-4 mb-8 flex-1">
              {['Everything in Pro', 'Up to 5 team members', 'AI Wealth Advisor insights', 'API access', 'Dedicated account manager'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={handleCtaClick} className="w-full py-3 rounded-full bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* DEMO CHARTS SECTION */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Visualize your wealth.<br/>
              <span className="text-white/50">In real time.</span>
            </h2>
            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-md">
              Gain deep insights into your financial health with our interactive, beautiful charts. FinScope automatically categorizes your transactions and plots your income vs. expenses so you can easily spot trends, cut unnecessary spending, and grow your net worth.
            </p>
            <ul className="space-y-3 pt-4">
              <li className="flex items-center gap-3 text-sm font-medium text-white/80">
                <div className="w-2 h-2 rounded-full bg-emerald-400" /> Track monthly income streams
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-white/80">
                <div className="w-2 h-2 rounded-full bg-red-400" /> Monitor daily expense spikes
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-white/80">
                <div className="w-2 h-2 rounded-full bg-indigo-400" /> AI-driven category breakdowns
              </li>
            </ul>
            <div className="pt-6">
              <PrimaryButton label="Explore Analytics" onClick={handleCtaClick} />
            </div>
          </div>

          <div className="p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
            <div className="p-6 rounded-[22px] bg-[#0c101c] shadow-2xl h-[400px] flex flex-col border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white">Cash Flow Overview</h3>
                <div className="flex gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-400"><div className="w-2 h-2 rounded-full bg-emerald-400"/> Income</span>
                  <span className="flex items-center gap-1.5 text-red-400"><div className="w-2 h-2 rounded-full bg-red-400"/> Expense</span>
                </div>
              </div>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={demoData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0c101c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      formatter={(val) => `₹${val.toLocaleString()}`}
                    />
                    <Area type="monotone" dataKey="income" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-[#050812] py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <LogoIcon className="w-6 h-6" />
            <span className="font-bold tracking-tight text-lg text-white">FinScope</span>
          </div>
          <p className="text-white/50 text-sm max-w-sm mb-8">
            Track expenses, manage budgets, and gain financial insights.
          </p>
          <div className="w-full flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-8 text-xs text-white/40 font-medium gap-4">
            <span>© {new Date().getFullYear()} FinScope. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white/70 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
