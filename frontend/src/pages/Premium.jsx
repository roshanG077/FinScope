import React from 'react';
import { motion } from 'motion/react';
import { FiAward, FiBarChart2, FiCpu, FiFileText, FiBell, FiDownload, FiLock, FiStar } from 'react-icons/fi';
import Card from '../components/ui/Card';

export default function Premium() {
  const roadmapItems = [
    { icon: <FiCpu className="text-indigo-400" size={24} />, title: "AI-Powered Financial Assistant", desc: "Get personalized insights, tax planning, and investment recommendations from our advanced AI engine.", status: "Under Development" },
    { icon: <FiBarChart2 className="text-sky-400" size={24} />, title: "Advanced Analytics", desc: "Deep dive into your cash flow with custom date ranges, predictive modeling, and granular category insights.", status: "Coming Soon" },
    { icon: <FiFileText className="text-emerald-400" size={24} />, title: "Automated Reports", desc: "Receive weekly and monthly PDF/Excel summary reports directly in your inbox.", status: "Coming Soon" },
    { icon: <FiBell className="text-amber-400" size={24} />, title: "Smart Budget Alerts", desc: "Real-time push notifications when you're approaching budget limits or identifying unusual spending.", status: "Coming Soon" },
    { icon: <FiDownload className="text-rose-400" size={24} />, title: "Data Export Capabilities", desc: "Export your entire financial history to CSV, JSON, and PDF for accounting and tax filing.", status: "Coming Soon" },
    { icon: <FiStar className="text-purple-400" size={24} />, title: "Additional Enhancements", desc: "Team collaboration, shared household budgets, API access, and custom tags.", status: "Future Release" }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 mb-10 mt-4"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
          <FiAward size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">FinScope Premium</h1>
        <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
          Unlock advanced financial insights and enhanced productivity features.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadmapItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="h-full"
          >
            <Card glow="primary" className="h-full flex flex-col relative overflow-hidden group hover:border-[var(--primary)] transition-all duration-300 p-8 pt-10">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-4 right-4 z-10">
                <span className="text-[9px] bg-[rgba(99,102,241,0.1)] text-[var(--primary)] px-2.5 py-1 rounded-full uppercase font-bold tracking-widest flex items-center gap-1.5 shadow-sm">
                  <FiLock size={10} /> {item.status}
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-transparent border border-[var(--border)] flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="font-extrabold text-[var(--text-primary)] text-xl mb-3 tracking-tight">{item.title}</h3>
              <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed flex-1">
                {item.desc}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 text-center"
      >
        <h4 className="font-bold text-amber-500 mb-2">Roadmap Notice</h4>
        <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          All features currently marked with a lock icon across the application will be unlocked as part of the FinScope Premium roadmap. Currently, this platform serves as a technical portfolio demonstration and these premium features are planned for future development phases.
        </p>
      </motion.div>
    </div>
  );
}
