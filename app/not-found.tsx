"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center relative overflow-hidden bg-white dark:bg-[#020817] font-sans">
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-[800px] w-full px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 60 }}
          className="space-y-4"
        >
          <h1 className="text-[120px] md:text-[180px] font-[800] leading-none tracking-tighter text-transparent bg-clip-text bg-user-gradient drop-shadow-sm select-none">
            404
          </h1>
          <h2 className="text-[28px] md:text-[36px] font-bold text-slate-900 dark:text-white tracking-tight">
            Under Development
          </h2>
          <p className="text-[16px] md:text-[18px] text-slate-600 dark:text-slate-400 max-w-[500px] mx-auto leading-[1.6]">
            This feature or page is currently under development. We are building something amazing for your compliance workspace.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 60 }}
          className="mt-12"
        >
          <Link 
            href="/"
            className="btn-candy-blue btn-glint inline-flex items-center text-white px-8 py-[16px] rounded-[12px] font-[600] text-[16px] transition-all hover:-translate-y-1 active:scale-95 shadow-lg group"
          >
            <Home className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-candy-shadow">Return to Dashboard</span>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
