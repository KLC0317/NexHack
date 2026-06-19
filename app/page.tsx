"use client";

import { motion } from "framer-motion";
import { FileText, CheckCircle2, AlertCircle, Cpu, ArrowRight, Sparkles, ShieldCheck, QrCode, Upload, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Workspace() {
  const router = useRouter();

  return (
    <div className="font-sans animate-in fade-in zoom-in-95 duration-500">

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[calc(100vh-76px)] flex items-center justify-center pt-8 pb-[96px] overflow-hidden">
        {/* Background Image with Parallax & Scaling Animation */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <motion.div
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.85 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/hero_background.png')` }}
          />
          {/* Overlay gradient mask to blend with theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50/30 via-[#F0F4F8]/80 to-[#F0F4F8] dark:from-slate-950/60 dark:via-slate-950/85 dark:to-slate-950 pointer-events-none" />

          {/* Neon Glow spots */}
          <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-sky-600/10 dark:bg-sky-500/20 rounded-full blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[450px] bg-teal-600/10 dark:bg-teal-500/20 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-[1152px] mx-auto px-6 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left side content (Title, description, actions) */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">

              {/* Premium Sub-heading */}
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-xs font-bold uppercase tracking-[0.25em] text-teal-600 dark:text-teal-400 select-none"
              >
                Autonomous Compliance Engine
              </motion.p>

              {/* Staggered text block */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15,
                      delayChildren: 0.2
                    }
                  }
                }}
                className="space-y-6"
              >
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                  }}
                  className="text-[44px] md:text-[68px] font-[800] tracking-[-2px] leading-[1.05] uppercase select-none text-slate-900 dark:text-white"
                >
                  Robust System For <br className="hidden md:inline" />
                  <span className="text-transparent bg-clip-text bg-user-gradient drop-shadow-[0_0_30px_rgba(20,184,166,0.2)] animate-text-gradient">
                    Automating Invoices
                  </span>
                </motion.h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  className="text-[18px] md:text-[22px] text-slate-600 dark:text-slate-300 max-w-[620px] leading-[1.6] font-normal"
                >
                  Instantly reconcile receipts, check strict compliance policies in real-time, and transmit directly to the LHDN MyInvois Portal.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4"
                >
                  <Link
                    href="/lhdn"
                    className="btn-premium-primary text-white px-10 py-[16px] rounded-[12px] font-semibold text-[16px] active:scale-95 group flex items-center"
                  >
                    <span className="text-candy-shadow">Connect to LHDN</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/demo"
                    className="btn-premium-secondary px-10 py-[16px] rounded-[12px] font-semibold text-[16px] active:scale-95"
                  >
                    Try Live Demo
                  </Link>
                </motion.div>
              </motion.div>

            </div>

            {/* Right side interactive pipeline visualization */}
            {/* Right side interactive pipeline visualization (n8n Style) */}
            <div className="lg:col-span-5 flex justify-center items-center relative w-full h-[400px] md:h-[450px]">

              {/* SVG Connector Lines with n8n Animated Particles */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
                {/* Gradients Definition */}
                <defs>
                  <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                  <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#D946EF" />
                  </linearGradient>
                  <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Path 1: Trigger to Agent */}
                <path d="M 20 30 C 35 30, 35 50, 50 50" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="0.4" />
                <motion.path
                  d="M 20 30 C 35 30, 35 50, 50 50"
                  stroke="url(#gradient-blue)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  strokeDasharray="4, 40"
                  animate={{ strokeDashoffset: [44, 0] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 1.5 }}
                />

                {/* Path 2: Agent to Eval */}
                <path d="M 50 50 C 65 50, 65 20, 80 20" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="0.4" />
                <motion.path
                  d="M 50 50 C 65 50, 65 20, 80 20"
                  stroke="url(#gradient-purple)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  strokeDasharray="4, 40"
                  animate={{ strokeDashoffset: [44, 0] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 1.5, delay: 0.5 }}
                />

                {/* Path 3: Agent to LHDN */}
                <path d="M 50 50 C 65 50, 65 80, 80 80" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="0.4" />
                <motion.path
                  d="M 50 50 C 65 50, 65 80, 80 80"
                  stroke="url(#gradient-green)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  strokeDasharray="4, 40"
                  animate={{ strokeDashoffset: [44, 0] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 1.5, delay: 1.0 }}
                />
              </svg>

              {/* Central Core Agent Node */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-20 w-32 h-32 flex items-center justify-center"
              >
                {/* Outer pulsing ring */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border border-sky-400/50 bg-sky-500/10"
                />

                {/* Rotating dashed ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
                  className="absolute inset-2 rounded-full border-2 border-dashed border-teal-500/40"
                />

                {/* Counter-rotating ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                  className="absolute inset-4 rounded-full border border-transparent border-t-blue-500/80 border-b-sky-500/80 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                />

                {/* Glowing Core Sphere */}
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-sky-500 to-teal-400 dark:from-blue-500 dark:via-sky-400 dark:to-teal-300 shadow-[0_0_30px_rgba(14,165,233,0.6)] border border-white/30 backdrop-blur-md overflow-hidden">

                  {/* Inner dynamic highlight */}
                  <motion.div
                    animate={{ x: [-15, 15, -15], y: [-15, 15, -15] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute w-12 h-12 bg-white/40 rounded-full blur-[8px]"
                  />

                  {/* Central Icon */}
                  <Sparkles className="w-7 h-7 text-white drop-shadow-md relative z-10 animate-pulse" />
                </div>
              </motion.div>

              {/* Node 1: Trigger (Top Left) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute left-[20%] top-[30%] -translate-x-1/2 -translate-y-1/2 z-10 w-40"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/90 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 backdrop-blur-md rounded-[12px] shadow-xl flex flex-col overflow-hidden hover:border-sky-500/50 transition-colors cursor-default"
                >
                  <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-blue-500"></div>
                  <div className="p-3 flex items-center space-x-3">
                    <div className="bg-sky-50 dark:bg-slate-800 p-2 rounded-[8px] text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-slate-700">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[12px] font-bold text-slate-800 dark:text-slate-100 leading-tight">Document</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block mt-0.5">Trigger</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Node 2: Evaluation Tool (Top Right) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute left-[80%] top-[20%] -translate-x-1/2 -translate-y-1/2 z-10 w-40"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/90 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 backdrop-blur-md rounded-[12px] shadow-xl flex flex-col overflow-hidden hover:border-purple-500/50 transition-colors cursor-default"
                >
                  <div className="h-1 w-full bg-gradient-to-r from-purple-400 to-fuchsia-500"></div>
                  <div className="p-3 flex items-center space-x-3">
                    <div className="bg-purple-50 dark:bg-slate-800 p-2 rounded-[8px] text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-slate-700">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[12px] font-bold text-slate-800 dark:text-slate-100 leading-tight">Validator</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block mt-0.5">Agent Tool</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Node 3: LHDN Action (Bottom Right) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute left-[80%] top-[80%] -translate-x-1/2 -translate-y-1/2 z-10 w-40"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/90 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 backdrop-blur-md rounded-[12px] shadow-xl flex flex-col overflow-hidden hover:border-green-500/50 transition-colors cursor-default"
                >
                  <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-green-500"></div>
                  <div className="p-3 flex items-center space-x-3">
                    <div className="bg-green-50 dark:bg-slate-800 p-2 rounded-[8px] text-green-600 dark:text-green-400 border border-green-100 dark:border-slate-700">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[12px] font-bold text-slate-800 dark:text-slate-100 leading-tight">LHDN API</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block mt-0.5">Action</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* --- AUTOMATIC REPORT SECTION --- */}
      <section className="py-[96px] relative z-10 border-t border-[#E5EDF4]/60 dark:border-white/5 bg-[#E5EDF4]/40 dark:bg-transparent overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="max-w-[1152px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-[48px] items-center"
        >

          <motion.div
            variants={{
              hidden: { opacity: 0, x: -60, rotateY: -10 },
              visible: { opacity: 1, x: 0, rotateY: 0, transition: { type: "spring", stiffness: 60, damping: 14 } }
            }}
            style={{ perspective: 1000 }}
            className="relative group w-full"
          >
            {/* The beautiful glow behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-teal-500 rounded-[24px] blur-xl opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>

            {/* The main card container */}
            <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60 shadow-[0_20px_50px_rgba(8,112,184,0.07)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] aspect-square md:aspect-[4/3] rounded-[24px] overflow-hidden p-6 md:p-8 flex flex-col justify-between">

              {/* Subtle animated inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-teal-500/5 dark:from-sky-400/5 dark:to-teal-400/5 animate-pulse duration-[8000ms] pointer-events-none"></div>

              {/* Top part: The Mock Invoice being "scanned" */}
              <div className="bg-white dark:bg-slate-950 rounded-[16px] p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group-hover:border-sky-500/30 transition-colors z-10">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-sky-500" />
                    <span className="text-[12px] font-mono text-slate-500 dark:text-slate-400">INV-2026-9908.pdf</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/50">
                    <Activity className="w-3 h-3 text-blue-500" />
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Extracting</span>
                  </div>
                </div>

                <div className="space-y-2.5 relative scanner-effect pb-2">
                  <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-[4px]"></div>
                  <div className="h-2 w-1/2 bg-slate-100 dark:bg-slate-800/50 rounded-[4px]"></div>
                  <div className="flex justify-between pt-2">
                    <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-[4px]"></div>
                    <div className="h-4 w-1/5 bg-teal-100 dark:bg-teal-900/50 rounded-[4px]"></div>
                  </div>
                </div>
              </div>

              {/* Bottom part: The validation checks & gauge */}
              <div className="mt-6 flex flex-col md:flex-row gap-6 z-10">

                {/* Checklist */}
                <div className="flex-1 space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Compliance Checks</h4>

                  {[
                    { label: "UBL 2.1 Schema Valid", delay: 0 },
                    { label: "SST Tax Alignment", delay: 0.15 },
                    { label: "Buyer BRN Verified", delay: 0.3 }
                  ].map((check, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: check.delay + 0.3, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-2"
                    >
                      <div className="bg-green-100 dark:bg-green-900/40 p-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-[13px] font-[500] text-slate-700 dark:text-slate-200">{check.label}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Circular Score Gauge */}
                <div className="w-[100px] h-[100px] shrink-0 relative flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-100 dark:text-slate-800" />
                    {/* Progress circle */}
                    <motion.circle
                      cx="50" cy="50" r="40"
                      stroke="url(#teal-gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "251.2", strokeDashoffset: "251.2" }}
                      whileInView={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      viewport={{ once: true }}
                    />
                    <defs>
                      <linearGradient id="teal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#14b8a6" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      viewport={{ once: true }}
                      className="text-[22px] font-[800] text-slate-900 dark:text-white leading-none"
                    >
                      98<span className="text-[12px]">%</span>
                    </motion.span>
                    <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mt-0.5">Score</span>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

          {/* Right Column Text */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 60 },
              visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 60, damping: 14 } }
            }}
            className="space-y-5"
          >
            <div className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800/50 rounded-full mb-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold uppercase text-[12px] tracking-wider">Find Your</span>
            </div>
            <h2 className="text-[38px] md:text-[48px] leading-[1.1] font-[800] text-slate-900 dark:text-white tracking-tight uppercase">
              Automatic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">Report</span>
            </h2>
            <p className="text-[16px] md:text-[18px] text-slate-600 dark:text-slate-300 leading-[1.6] font-normal pt-2">
              MyInvoisAI's extraction technology provides its users with a robust system for managing their documents,
              testing it against specific LHDN validation rules and then measuring compliance.
            </p>
            <p className="text-[16px] md:text-[18px] text-slate-600 dark:text-slate-300 leading-[1.6] font-normal">
              Our system ensures every receipt and invoice uploaded is mapped to Universal Business Language (UBL)
              standards and seamlessly transmitted to the government portal.
            </p>
            <div className="pt-4">
              <button onClick={() => router.push('/integrations')} className="btn-candy-blue btn-glint text-white px-8 py-[14px] rounded-[12px] font-[600] text-[15px] transition-all shadow-md flex items-center group">
                <span className="text-candy-shadow mr-2">Explore Features</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* --- INCREASE EFFICIENCY SECTION --- */}
      <section className="py-[96px] relative z-10 overflow-hidden bg-white dark:bg-slate-950/50">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-[1152px] mx-auto px-6 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, type: "spring", stiffness: 60, damping: 15 }}
            className="mb-[64px] text-center max-w-3xl mx-auto"
          >
            <div className="inline-block px-3 py-1 bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800/50 rounded-full mb-4">
              <span className="text-sky-600 dark:text-sky-400 font-bold uppercase text-[12px] tracking-wider">Increase</span>
            </div>
            <h2 className="text-[38px] md:text-[52px] leading-[1.1] font-[800] text-slate-900 dark:text-white tracking-tight uppercase">
              Operational <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-500">Efficiency</span>
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-[18px]">Transform raw documents into validated digital assets in four autonomous steps.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
          >

            {/* SVG Connector Line (Desktop Only) */}
            <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-[2px] z-0">
              <svg width="100%" height="100%" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="100%" y2="0" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="2" strokeDasharray="6 6" />
              </svg>
            </div>

            {[
              {
                step: "01",
                icon: Upload,
                title: "Upload",
                desc: "Securely drag & drop receipts or forward via WhatsApp integration.",
                color: "from-sky-400 to-blue-500",
                iconColor: "text-blue-500",
                bgLight: "bg-blue-50 dark:bg-blue-900/20"
              },
              {
                step: "02",
                icon: Cpu,
                title: "Extract",
                desc: "Intelligent agent structures unformatted data into standard JSON.",
                color: "from-teal-400 to-emerald-500",
                iconColor: "text-teal-500",
                bgLight: "bg-teal-50 dark:bg-teal-900/20"
              },
              {
                step: "03",
                icon: ShieldCheck,
                title: "Validate",
                desc: "Real-time compliance checks against LHDN UBL 2.1 policies.",
                color: "from-purple-400 to-fuchsia-500",
                iconColor: "text-purple-500",
                bgLight: "bg-purple-50 dark:bg-purple-900/20"
              },
              {
                step: "04",
                icon: CheckCircle2,
                title: "Transmit",
                desc: "Instant portal submission generating the official validation QR code.",
                color: "from-rose-400 to-orange-500",
                iconColor: "text-rose-500",
                bgLight: "bg-rose-50 dark:bg-rose-900/20"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } }
                }}
                className="relative z-10 group"
              >
                <div className="h-full bg-white/70 dark:bg-slate-900/80 backdrop-blur-md rounded-[20px] p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 relative overflow-hidden flex flex-col items-center text-center">

                  {/* Huge background number */}
                  <div className="absolute -top-4 -right-2 text-[100px] font-black text-slate-100 dark:text-slate-800/40 leading-none select-none transition-transform group-hover:scale-110 duration-500">
                    {item.step}
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-[16px] ${item.bgLight} flex items-center justify-center mb-6 shadow-sm border border-white dark:border-slate-800 transition-transform duration-300 group-hover:scale-110`}>
                      <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                    </div>

                    <h3 className="text-[20px] font-bold text-slate-900 dark:text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-[14px] leading-[1.6]">
                      {item.desc}
                    </p>
                  </div>

                  {/* Bottom gradient bar that expands on hover */}
                  <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${item.color} transition-all duration-500`}></div>
                </div>
              </motion.div>
            ))}

          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-[64px] flex justify-center"
          >
            <Link href="/demo" className="btn-premium-secondary px-8 py-[14px] rounded-[12px] font-[600] text-[15px] transition-all flex items-center group shadow-sm">
              Try Agent Simulator
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </section>


      {/* --- THE AI DEMO ZONE --- */}
      <section id="demo-zone" className="py-[96px] border-t border-[#E5EDF4]/60 dark:border-white/5 bg-[#E5EDF4]/60 dark:bg-black/10 backdrop-blur-sm overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-[1152px] mx-auto px-6"
        >
          <div className="text-center mb-[64px]">
            <h2 className="text-[36px] font-[700] text-slate-900 dark:text-white tracking-tight uppercase mb-4 font-ubuntu">
              Live Extraction Demo
            </h2>
            <p className="text-[16px] text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-[1.7]">
              Drop your receipt or paste your WhatsApp order. The AI extracts, validates, and reports securely.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[32px] items-stretch">

            {/* Redesigned interactive visual panel */}
            <div className="lg:col-span-2 relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60 p-8 rounded-[24px] flex flex-col justify-between overflow-hidden min-h-[400px] hover:shadow-[0_20px_50px_rgba(8,112,184,0.05)] transition-all group">
              {/* Decorative glows */}
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none transition-all group-hover:bg-teal-500/20"></div>
              <div className="absolute -left-10 -top-10 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none transition-all group-hover:bg-sky-500/20"></div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center space-x-2.5">
                  <div className="bg-sky-500/10 p-2 rounded-xl text-sky-500">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">Interactive Simulator</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-ubuntu">
                  Experience LHDN Agent Compliance Extraction Flow
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl">
                  Try out the live e-Invoicing compliance simulation. Test the agent by uploading real invoices (or selecting presets) and watch the step-by-step telemetry as UBL checks, MSIC codes, and QR codes are validated and signed in real-time.
                </p>

                {/* Workflow mockup preview */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] text-slate-500 font-semibold max-w-lg">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col items-center">
                    <FileText className="w-4 h-4 text-sky-500 mb-1" />
                    <span>1. Input PDF</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col items-center">
                    <Cpu className="w-4 h-4 text-purple-500 mb-1" />
                    <span>2. AI Extract</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col items-center">
                    <ShieldCheck className="w-4 h-4 text-teal-500 mb-1" />
                    <span>3. LHDN Check</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col items-center">
                    <QrCode className="w-4 h-4 text-emerald-500 mb-1" />
                    <span>4. Portal Submit</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 relative z-10 flex flex-col sm:flex-row items-center gap-4">
                <Link href="/demo" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto btn-premium-primary text-white px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 group">
                    <span>Launch Live Agent Simulator</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                <Link href="/lhdn" className="w-full sm:w-auto text-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-colors">
                  Go directly to LHDN Mock Portal →
                </Link>
              </div>
            </div>

            {/* Feature highlights replacing fake metrics */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60 p-7 rounded-[24px] flex flex-col gap-5 justify-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">What the agent does</p>
                {[
                  { icon: FileText, label: "Reads PDF invoices & WhatsApp orders", color: "text-sky-500 bg-sky-50 dark:bg-sky-900/30" },
                  { icon: Cpu, label: "Extracts UBL-compliant structured data", color: "text-violet-500 bg-violet-50 dark:bg-violet-900/30" },
                  { icon: ShieldCheck, label: "Validates SST, TIN & LHDN rules", color: "text-teal-500 bg-teal-50 dark:bg-teal-900/30" },
                  { icon: QrCode, label: "Generates signed LHDN QR code", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30" },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-snug">{label}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0" />
                  </div>
                ))}
              </div>
              <Link href="/demo" className="btn-premium-primary text-white py-3 rounded-xl font-semibold text-sm text-center">
                Launch Simulator →
              </Link>
            </div>

          </div>
        </motion.div>
      </section>

    </div>
  );
}
