"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Cpu, ShieldCheck, CheckCircle2, ArrowRight,
  Sparkles, ArrowLeft, Code, ChevronDown, ChevronUp,
  FileText, MessageSquare, Globe, Activity, Database,
  QrCode, Terminal, HelpCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Types & Data for the Steps ---
interface PipelineStep {
  number: string;
  title: string;
  shortDesc: string;
  color: string;
  icon: any;
  accentBg: string;
  accentText: string;
  techDetails: {
    overview: string;
    payloadType: string;
    payloadCode: string;
    checklist: string[];
  };
}

const pipelineSteps: PipelineStep[] = [
  {
    number: "01",
    title: "Ingest & Upload",
    shortDesc: "Upload PDFs, scan physical receipts, or auto-forward supplier invoices directly via WhatsApp.",
    color: "from-blue-500 to-sky-400",
    icon: Upload,
    accentBg: "bg-blue-50 dark:bg-blue-950/30",
    accentText: "text-blue-500",
    techDetails: {
      overview: "Multi-channel entry point with automated antivirus scans and OCR image preprocessing.",
      payloadType: "Ingestion Payload",
      payloadCode: `{
  "source": "whatsapp_bot",
  "sender": "+6012-3456789",
  "document": "INV-9908.pdf",
  "size": "1.04 MB"
}`,
      checklist: [
        "Antivirus scanning",
        "OCR image deskew",
        "ERP Webhook ingestion"
      ]
    }
  },
  {
    number: "02",
    title: "Extract & Structure",
    shortDesc: "Gemini Vision autonomously parses raw receipts and maps descriptions to 5-digit MSIC codes.",
    color: "from-teal-500 to-emerald-400",
    icon: Cpu,
    accentBg: "bg-teal-50 dark:bg-teal-900/20",
    accentText: "text-teal-500",
    techDetails: {
      overview: "Our Gemini-powered engine isolates buyer details, maps tax totals to SST codes, and correctly infers official LHDN 5-digit MSIC codes.",
      payloadType: "Structured JSON output",
      payloadCode: `{
  "invoice": "INV-2026-9908",
  "supplier": { "tin": "SG123456789" },
  "items": [
    { "desc": "Garnier Serum", "msic": "47721", "price": 126.60 }
  ]
}`,
      checklist: [
        "5-digit MSIC code auto-mapping",
        "SST tax category inference",
        "Line item structurization"
      ]
    }
  },
  {
    number: "03",
    title: "Validate & Verify",
    shortDesc: "Enforce strict LHDN Phase 4 rules natively, verifying RM10,000 threshold compliance and UBL 2.1 schema validity.",
    color: "from-purple-500 to-fuchsia-400",
    icon: ShieldCheck,
    accentBg: "bg-purple-50 dark:bg-purple-900/20",
    accentText: "text-purple-500",
    techDetails: {
      overview: "A bulletproof local compliance gateway that evaluates invoice data against strict Phase 4 B2C consolidated invoice limits (RM10,000 max), State Code 17 constraints, and mathematically verifies all SST formulations.",
      payloadType: "Validation Verdict",
      payloadCode: `{
  "compliance_score": 100,
  "status": "ReadyForSubmission",
  "verifications": {
    "phase_4_threshold": "PASSED",
    "state_code_17": "PASSED",
    "sst_math_integrity": "PASSED",
    "zero_tax_exemption": "PASSED"
  }
}`,
      checklist: [
        "Phase 4 RM10k Consolidation Limits",
        "State Code 17 Geographical Rules",
        "Zero-Tax Exemption Integrity",
        "Precision SST Math Verification"
      ]
    }
  },
  {
    number: "04",
    title: "Sign & Transmit",
    shortDesc: "Submits to the LHDN MyInvois portal, returning cryptographic signature stamps and verification QR codes.",
    color: "from-rose-500 to-orange-400",
    icon: QrCode,
    accentBg: "bg-rose-50 dark:bg-rose-900/20",
    accentText: "text-rose-500",
    techDetails: {
      overview: "Cryptographically signs document payloads and fetches the validated UUID directly from LHDN.",
      payloadType: "LHDN Submission Receipt",
      payloadCode: `{
  "lhdn_status": "Valid",
  "uuid": "7a3b8d-29a1-4328-86d1",
  "stamp": "MIIFvQYJKoZIhvcNAQc...",
  "qr_url": "https://preprod.hasil.gov.my"
}`,
      checklist: [
        "SHA-256 XML hashing & signing",
        "Secure LHDN OAuth handshake",
        "Compliance QR code hook"
      ]
    }
  }
];

function highlightJSON(jsonStr: string) {
  return jsonStr.split("\n").map((line, idx) => {
    if (line.trim() === "{" || line.trim() === "}" || line.trim() === "}," || line.trim() === "]" || line.trim() === "],") {
      return (
        <div key={idx} className="text-slate-400 dark:text-slate-500 font-semibold whitespace-pre">
          {line}
        </div>
      );
    }

    const colonIndex = line.indexOf(":");
    if (colonIndex !== -1) {
      const keyPart = line.substring(0, colonIndex + 1);
      const valPart = line.substring(colonIndex + 1);

      const isString = valPart.includes('"');
      const valColor = isString 
        ? "text-emerald-600 dark:text-amber-400" 
        : "text-purple-600 dark:text-teal-400";

      return (
        <div key={idx} className="whitespace-pre flex">
          <span className="text-blue-600 dark:text-sky-400 font-semibold">{keyPart}</span>
          <span className={valColor}>{valPart}</span>
        </div>
      );
    }

    return (
      <div key={idx} className="text-slate-800 dark:text-slate-300 whitespace-pre">
        {line}
      </div>
    );
  });
}

export default function HowItWorksPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<string>("01");
  const [activeChannelTab, setActiveChannelTab] = useState<"whatsapp" | "portal" | "erp">("portal");
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const currentStepData = pipelineSteps.find(s => s.number === activeStep) || pipelineSteps[0];

  // Stagger variants for the step cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -50 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-slate-950/60 pb-20">

      {/* --- HERO SECTION --- */}
      <div className="max-w-[1152px] mx-auto px-6 pt-12 pb-16 relative">
        {/* Glow Spots */}
        <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-sky-500/10 dark:bg-sky-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-5 right-10 w-[300px] h-[300px] bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-850 rounded-full text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5" /> Technical Guide
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[40px] md:text-[56px] font-[800] leading-[1.1] text-slate-900 dark:text-white uppercase tracking-tight font-ubuntu"
          >
            Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">Compliance Flow</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-350 text-[18px] leading-[1.6] max-w-2xl mx-auto"
          >
            Discover how MyInvoisAI acts as your primary e-invoicing link, parsing receipts in real-time, verifying compliance codes, and submitting to the LHDN MyInvois platform.
          </motion.p>
        </div>
      </div>

      {/* --- CHANNELS & INGESTION TABS --- */}
      <div className="max-w-[1152px] mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, type: "spring", stiffness: 50, damping: 14 }}
          className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60 rounded-[24px] p-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Multi-Channel Document Ingestion</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Get receipts and invoices into the pipeline through your preferred method.</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl self-start">
              {(["portal", "whatsapp", "erp"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveChannelTab(tab)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                    activeChannelTab === tab
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {tab === "portal" ? "Web Portal" : tab === "whatsapp" ? "WhatsApp Bot" : "ERP Integration"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            <div className="lg:col-span-6 space-y-4">
              <AnimatePresence mode="wait">
                {activeChannelTab === "portal" && (
                  <motion.div
                    key="portal"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center border border-blue-100 dark:border-slate-800">
                      <Globe className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Accountant Portal (Portal Akauntan)</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      A dedicated export portal providing auditors and tax agents with month-end consolidated JSON grids, CSV dumps, and instant UBL 2.1 XML retrieval of all validated receipts.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> One-click UBL 2.1 payload exports</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> LHDN UUID reference tracking</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Grid-view filtering by compliance status</li>
                    </ul>
                  </motion.div>
                )}

                {activeChannelTab === "whatsapp" && (
                  <motion.div
                    key="whatsapp"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/40 text-green-500 flex items-center justify-center border border-green-100 dark:border-slate-800">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">WhatsApp Compliance Bot</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Send your raw checkout text, screenshots, or receipts straight to our dedicated WhatsApp channel. The compliance agent automatically parses the conversation history and formats compliance data on the fly.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Snapshot parsing: Snap photos of physical receipts</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Natural Language processing of raw orders</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Real-time status reply with validation link</li>
                    </ul>
                  </motion.div>
                )}

                {activeChannelTab === "erp" && (
                  <motion.div
                    key="erp"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center border border-purple-100 dark:border-slate-800">
                      <Database className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">REST API & ERP Middleware</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Connect your existing accounting software, ERP, or web store to the validation pipeline. Submit invoices programmatically through a lightweight endpoint, bypassing the need to manage complex UBL structures directly.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> OAuth 2.0 secured REST endpoints</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Auto-retry compliance queue with status webhooks</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Synchronous validate-only endpoints</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-slate-950 rounded-[18px] border border-slate-800 p-5 shadow-inner relative overflow-hidden group">
                <div className="absolute top-2 right-3 flex items-center space-x-1.5 z-10">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center space-x-2 text-slate-500 text-xs font-mono mb-4 border-b border-slate-900 pb-3">
                  <Terminal className="w-4 h-4" />
                  <span>ingestion_channel_logs.log</span>
                </div>
                <div className="font-mono text-xs text-slate-450 leading-relaxed space-y-2.5 h-[160px] overflow-y-auto">
                  {activeChannelTab === "portal" && (
                    <>
                      <p className="text-slate-500">[11:50:01] <span className="text-sky-400">HTTP POST</span> /api/upload - File received</p>
                      <p className="text-slate-550">File: "vendor_receipt_001.pdf" (340kb)</p>
                      <p className="text-slate-500">[11:50:02] <span className="text-teal-400">DISPATCH</span> Ingestion event registered successfully</p>
                      <p className="text-emerald-400">[11:50:02] Routing document to Gemini OCR Model...</p>
                    </>
                  )}
                  {activeChannelTab === "whatsapp" && (
                    <>
                      <p className="text-slate-500">[11:51:12] <span className="text-green-400">WHATSAPP</span> Message received from +6019-XXXX789</p>
                      <p className="text-slate-550">Payload: "B2B Invoice details: Buyer TIN..."</p>
                      <p className="text-slate-500">[11:51:13] <span className="text-teal-400">AGENT</span> NLP parser matched 4 items</p>
                      <p className="text-emerald-400">[11:51:13] Constructing XML structure...</p>
                    </>
                  )}
                  {activeChannelTab === "erp" && (
                    <>
                      <p className="text-slate-500">[11:52:00] <span className="text-purple-400">OAUTH2</span> Access Token verified for client_id: ERP_0392</p>
                      <p className="text-slate-500">[11:52:01] <span className="text-sky-400">HTTP POST</span> /api/agent/extract - Payload OK</p>
                      <p className="text-slate-550">Target: Synchronous validation & submit queue</p>
                      <p className="text-emerald-400">[11:52:01] Initializing compliance check...</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- PIPELINE CHRONOLOGY SECTION --- */}
      <div className="max-w-[1152px] mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-ubuntu"
          >
            Compliance Pipeline Details
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-500 dark:text-slate-450 text-sm mt-2 max-w-xl mx-auto"
          >
            Click on each phase to slide down and reveal full technical walkthroughs, checklists, and code outputs.
          </motion.p>
        </div>

        {/* Interactive Series Process Graph */}
        <div className="relative mb-10 max-w-4xl mx-auto">
          {/* Animated Connecting SVG Line (desktop only) */}
          <div className="absolute inset-x-12 top-[44px] h-1 z-0 hidden md:block">
            <svg className="w-full h-full overflow-visible" fill="none">
              {/* Static background connection */}
              <line x1="0" y1="2" x2="100%" y2="2" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="2" strokeDasharray="6 6" />
              {/* Glowing active path */}
              <motion.line
                x1="0" y1="2" x2="100%" y2="2"
                stroke="url(#graph-gradient)"
                strokeWidth="2.5"
                strokeDasharray="10 30"
                animate={{ strokeDashoffset: [-80, 0] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 2 }}
              />
              <defs>
                <linearGradient id="graph-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="33%" stopColor="#14b8a6" />
                  <stop offset="66%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Nodes Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            {pipelineSteps.map((step) => {
              const isActive = activeStep === step.number;
              const StepIcon = step.icon;

              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(step.number)}
                  className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all duration-300 select-none group relative ${
                    isActive
                      ? "bg-white dark:bg-slate-900/90 border-sky-500/50 dark:border-sky-500/40 shadow-[0_10px_25px_rgba(56,189,248,0.12)] scale-105"
                      : "bg-white/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/40 hover:bg-white dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  {/* Step Number Tag at top-right of node */}
                  <span className={`absolute top-2 right-2 text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-md ${
                    isActive ? "bg-sky-500 text-white" : "bg-slate-105 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}>
                    STEP {step.number}
                  </span>

                  {/* Icon Circle */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 mb-3 ${
                    isActive
                      ? `${step.accentBg} border-sky-500/30 scale-110 shadow-inner`
                      : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 text-slate-400 group-hover:scale-105"
                  }`}>
                    <StepIcon className={`w-6 h-6 ${isActive ? step.accentText : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"}`} />
                  </div>

                  {/* Step Title */}
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-450 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                  }`}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Details Card (Always visible, slides/fades details on step change) */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 100, damping: 15 }}
              className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[28px] p-6 md:p-8 shadow-[0_20px_50px_rgba(8,112,184,0.04)] overflow-hidden relative"
            >
              {/* Accent corner light glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/10 rounded-full blur-[80px]" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left side details */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-850 px-2.5 py-0.5 rounded-full">
                        Phase {currentStepData.number} Details
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight font-ubuntu">
                      {currentStepData.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-405 text-xs md:text-sm leading-relaxed">
                      {currentStepData.techDetails.overview}
                    </p>
                  </div>

                  {/* Subprocesses tags */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Core Actions Verified</span>
                    <div className="flex flex-wrap gap-2">
                      {currentStepData.techDetails.checklist.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-850 text-xs text-slate-700 dark:text-slate-200 font-semibold shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side code preview */}
                <div className="lg:col-span-6 flex flex-col justify-between h-full min-h-[180px]">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-2xl text-[11px] font-mono text-slate-600 dark:text-slate-400 border-b-0">
                    <div className="flex items-center space-x-2">
                      {/* macOS window control dots */}
                      <div className="flex space-x-1.5 mr-2">
                        <span className="w-2 h-2 rounded-full bg-red-400 dark:bg-red-500/80" />
                        <span className="w-2 h-2 rounded-full bg-yellow-400 dark:bg-yellow-500/80" />
                        <span className="w-2 h-2 rounded-full bg-green-400 dark:bg-green-500/80" />
                      </div>
                      <Terminal className="w-3.5 h-3.5 text-sky-500" />
                      <span className="font-bold">{currentStepData.techDetails.payloadType}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(currentStepData.techDetails.payloadCode)}
                      className="text-[10px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all font-bold"
                    >
                      {copiedCode ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 border-t-0 rounded-b-2xl text-[11px] font-mono leading-relaxed overflow-x-auto select-all max-h-[220px] flex-grow shadow-inner">
                    {highlightJSON(currentStepData.techDetails.payloadCode)}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* --- FAQs & EXTRA CLARIFICATIONS --- */}
      <div className="max-w-[1152px] mx-auto px-6 mt-20">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, type: "spring", stiffness: 50, damping: 14 }}
          className="border-t border-slate-200 dark:border-slate-800/80 pt-16 grid grid-cols-1 md:grid-cols-12 gap-8"
        >
          <div className="md:col-span-4 space-y-3">
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">Compliance FAQ</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-ubuntu">Frequently Asked Questions</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Have questions about how LHDN compliance impacts your billing ecosystem? Here are the facts.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 p-5 bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/60 rounded-[18px]">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span>What is Malaysia&apos;s e-Invoicing format?</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Malaysia mandate standardizes billing around the UBL 2.1 XML structure, requiring specific taxpayer identifiers, merchant codes (MSIC), and specific item metadata before portals authorize submission.
              </p>
            </div>

            <div className="space-y-2 p-5 bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/60 rounded-[18px]">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span>How fast does validation complete?</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                MyInvoisAI validates receipts synchronously in under 2 seconds. The AI OCR scans the sheet, calculates validation codes, and submissions verify instantly.
              </p>
            </div>

            <div className="space-y-2 p-5 bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/60 rounded-[18px]">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span>Is internet required?</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Yes. Since pre-validation checks are made against live buyer registration logs and final signatures are returned by the LHDN preprod server, active internet is required to register bills.
              </p>
            </div>

            <div className="space-y-2 p-5 bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/60 rounded-[18px]">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span>Is sandbox testing free?</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Absolutely. LHDN preprod endpoints are free to use. You can generate sandbox ERP client keys directly from your taxpayer portal dashboard and test submissions risk-free.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- FINAL CALL TO ACTIONS --- */}
      <div className="max-w-[1152px] mx-auto px-6 mt-20">
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, type: "spring", stiffness: 50, damping: 14 }}
          className="bg-gradient-to-r from-blue-600 via-sky-600 to-teal-500 p-8 md:p-12 rounded-[24px] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl"
        >
          {/* Neon blur circles */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white/10 rounded-full blur-[80px]" />

          <div className="space-y-3 relative z-10">
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase font-ubuntu tracking-tight">Ready to Automate Compliance?</h2>
            <p className="text-white/80 text-sm max-w-md leading-relaxed">
              Launch the simulator to watch tool calls interact in real-time or register your client keys to test live government endpoints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 relative z-10 w-full md:w-auto">
            <Link href="/demo" className="w-full sm:w-auto">
              <button className="w-full bg-white text-blue-600 hover:bg-white/90 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95">
                Start Simulator <Activity className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/integrations" className="w-full sm:w-auto">
              <button className="w-full bg-blue-700/40 hover:bg-blue-700/60 border border-white/20 text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95">
                Connect LHDN <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
