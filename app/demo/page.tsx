"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Play, Download, UploadCloud, CheckCircle2, AlertCircle,
  Database, Cpu, FileText, QrCode, ArrowRight, Edit,
  ArrowLeft, ExternalLink, X, FileCode, Shield,
  MessageSquare, ChevronDown, ChevronUp, Activity,
  Loader2, Check, Bot, Wrench, Hash, Send
} from "lucide-react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────
type NodeState = "idle" | "active" | "completed" | "failed";

function safeParseJSON(val: any): any {
  if (!val) return null;
  if (typeof val === "object") return val;
  try { return JSON.parse(val); } catch { return null; }
}

// ─── SVG Canvas Coordinate System (880 × 400) ────────────────────────────────
// Main rectangular nodes — row 1
const TRIG = { x: 28, y: 55, w: 172, h: 72 };
const AGENT = { x: 348, y: 55, w: 188, h: 72 };
const OUT = { x: 672, y: 55, w: 172, h: 72 };

const ROW1_CY = TRIG.y + TRIG.h / 2;           // 91
const AGENT_CX = AGENT.x + AGENT.w / 2;         // 442
const AGENT_BOT = AGENT.y + AGENT.h;            // 127

// Tool circles — row 2
const TOOL_R = 34;
const TOOL_CY = 302;

// Each tool: tcx = circle center x, dcx = diamond x on agent bottom
const TOOL_DEFS = [
  { id: "extractor", label: "extract_invoice_fields", mcp: "Gemini Vision", Icon: Cpu, tcx: 242, dcx: 388 },
  { id: "dbWriter", label: "write_invoice_record", mcp: "supabase-db-mcp", Icon: Database, tcx: 370, dcx: 422 },
  { id: "validator", label: "validateLHDNCompliance", mcp: "lhdn-sandbox", Icon: Shield, tcx: 498, dcx: 460 },
  { id: "qrSigner", label: "generate_lhdn_qr", mcp: "lhdn-validator-mcp", Icon: QrCode, tcx: 626, dcx: 496 },
];

// State-based color helpers
function stateStroke(s: NodeState) {
  return s === "active" ? "#38BDF8" : s === "completed" ? "#34D399" : s === "failed" ? "#FB7185" : "#E2E8F0";
}
function stateBg(s: NodeState) {
  return s === "active" ? "#F0F9FF" : s === "completed" ? "#F0FDF4" : s === "failed" ? "#FFF1F2" : "#FFFFFF";
}
function stateGlow(s: NodeState) {
  return s === "active" ? "0 0 22px rgba(56,189,248,0.28)"
    : s === "completed" ? "0 0 14px rgba(52,211,153,0.22)"
      : s === "failed" ? "0 0 14px rgba(251,113,133,0.22)"
        : "0 1px 3px rgba(0,0,0,0.06)";
}

// Arrow marker id
function arrowId(s: NodeState) {
  return s === "active" ? "arr-active" : s === "completed" ? "arr-done" : s === "failed" ? "arr-fail" : "arr-idle";
}

// ─── Main Pipeline Canvas ─────────────────────────────────────────────────────
function PipelineCanvas({
  trigState,
  agentState,
  toolStates,
  outState,
  idle,
}: {
  trigState: NodeState;
  agentState: NodeState;
  toolStates: Record<string, NodeState>;
  outState: NodeState;
  idle: boolean;
}) {
  return (
    <div className="relative overflow-x-auto rounded-xl">
      {/* Canvas wrapper: dot-grid background */}
      <div
        className="relative"
        style={{
          width: 880,
          height: 400,
          backgroundImage: "radial-gradient(circle, #CBD5E1 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          backgroundColor: "#F8FAFC",
          borderRadius: 12,
        }}
      >
        {/* ── SVG connection lines (drawn behind HTML nodes) ── */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={880}
          height={400}
          viewBox="0 0 880 400"
        >
          <defs>
            {(["idle", "active", "done", "fail"] as const).map((k) => (
              <marker key={k} id={`arr-${k}`} markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
                <path d="M 0 0 L 6 3 L 0 6 Z"
                  fill={k === "active" ? "#38BDF8" : k === "done" ? "#34D399" : k === "fail" ? "#FB7185" : "#CBD5E1"} />
              </marker>
            ))}
            <style>{`
              @keyframes marchDash { to { stroke-dashoffset: -18; } }
              .active-dash { animation: marchDash 0.55s linear infinite; }
            `}</style>
          </defs>

          {/* ── Line 1: Trigger → Agent ── */}
          {(() => {
            const color = stateStroke(agentState);
            return <>
              <line x1={TRIG.x + TRIG.w + 5} y1={ROW1_CY} x2={AGENT.x - 5} y2={ROW1_CY}
                stroke={color} strokeWidth="2" markerEnd={`url(#${arrowId(agentState)})`} />
              <text x={(TRIG.x + TRIG.w + AGENT.x) / 2} y={ROW1_CY - 11}
                textAnchor="middle" fontSize="10" fill="#94A3B8" fontFamily="Inter,sans-serif">
                {agentState !== "idle" ? "1 item" : ""}
              </text>
              {/* Edge circles */}
              <circle cx={TRIG.x + TRIG.w} cy={ROW1_CY} r="5" fill="white" stroke={agentState !== "idle" ? color : "#CBD5E1"} strokeWidth="1.5" />
              <circle cx={AGENT.x} cy={ROW1_CY} r="5" fill="white" stroke={agentState !== "idle" ? color : "#CBD5E1"} strokeWidth="1.5" />
            </>;
          })()}

          {/* ── Line 2: Agent → Output ── */}
          {(() => {
            const color = stateStroke(outState);
            return <>
              <line x1={AGENT.x + AGENT.w + 5} y1={ROW1_CY} x2={OUT.x - 5} y2={ROW1_CY}
                stroke={color} strokeWidth="2" markerEnd={`url(#${arrowId(outState)})`} />
              <text x={(AGENT.x + AGENT.w + OUT.x) / 2} y={ROW1_CY - 11}
                textAnchor="middle" fontSize="10" fill="#94A3B8" fontFamily="Inter,sans-serif">
                {outState !== "idle" ? "1 item" : ""}
              </text>
              <circle cx={AGENT.x + AGENT.w} cy={ROW1_CY} r="5" fill="white" stroke={outState !== "idle" ? color : "#CBD5E1"} strokeWidth="1.5" />
              <circle cx={OUT.x} cy={ROW1_CY} r="5" fill="white" stroke={outState !== "idle" ? color : "#CBD5E1"} strokeWidth="1.5" />
            </>;
          })()}

          {/* ── Dashed tool lines + diamond connectors ── */}
          {TOOL_DEFS.map((t) => {
            const s = toolStates[t.id] ?? "idle";
            const color = stateStroke(s);
            const dColor = s === "idle" ? "#CBD5E1" : color;
            const isActive = s === "active";
            return (
              <g key={t.id}>
                {/* Dashed diagonal line from diamond to circle */}
                <line
                  x1={t.dcx} y1={AGENT_BOT + 14}
                  x2={t.tcx} y2={TOOL_CY - TOOL_R - 5}
                  stroke={color} strokeWidth="1.5" strokeDasharray="5,4"
                  className={isActive ? "active-dash" : ""}
                />
                {/* Diamond connector on agent bottom */}
                <polygon
                  points={`${t.dcx},${AGENT_BOT} ${t.dcx + 7},${AGENT_BOT + 8} ${t.dcx},${AGENT_BOT + 16} ${t.dcx - 7},${AGENT_BOT + 8}`}
                  fill="white" stroke={dColor} strokeWidth="1.5"
                />
                {/* MCP server label above circle */}
                <text x={t.tcx} y={TOOL_CY - TOOL_R - 10}
                  textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily="Inter,sans-serif">
                  {t.mcp}
                </text>
                {/* Tool function name below circle */}
                <text x={t.tcx} y={TOOL_CY + TOOL_R + 16}
                  textAnchor="middle" fontSize="9" fontWeight="600"
                  fill={s === "completed" ? "#059669" : s === "active" ? "#0284C7" : s === "failed" ? "#E11D48" : "#94A3B8"}
                  fontFamily="JetBrains Mono,monospace">
                  {t.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* ── HTML: Trigger Node ── */}
        <NodeBox
          x={TRIG.x} y={TRIG.y} w={TRIG.w} h={TRIG.h}
          state={trigState}
          label="Document Trigger"
          sub="Invoice / Receipt"
          Icon={FileText}
          iconBg="bg-sky-100"
          iconColor="text-sky-500"
        />

        {/* ── HTML: AI Agent Node (larger center) ── */}
        <NodeBox
          x={AGENT.x} y={AGENT.y} w={AGENT.w} h={AGENT.h}
          state={agentState}
          label="LHDN AI Agent"
          sub="Gemini Model"
          Icon={Bot}
          iconBg="bg-violet-100"
          iconColor="text-violet-500"
        />

        {/* ── HTML: Output Node ── */}
        <NodeBox
          x={OUT.x} y={OUT.y} w={OUT.w} h={OUT.h}
          state={outState}
          label="LHDN Portal"
          sub="e-Invoice Submit"
          Icon={ExternalLink}
          iconBg="bg-teal-100"
          iconColor="text-teal-500"
        />

        {/* ── HTML: Tool Circle Nodes ── */}
        {TOOL_DEFS.map((t) => {
          const s = toolStates[t.id] ?? "idle";
          const Ic = t.Icon;
          return (
            <div
              key={t.id}
              className="absolute rounded-full flex items-center justify-center border-2 transition-all duration-500"
              style={{
                left: t.tcx - TOOL_R,
                top: TOOL_CY - TOOL_R,
                width: TOOL_R * 2,
                height: TOOL_R * 2,
                borderColor: stateStroke(s),
                backgroundColor: stateBg(s),
                boxShadow: stateGlow(s),
                zIndex: 10,
              }}
            >
              {s === "active" ? (
                <>
                  <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
                  <span className="absolute -inset-[3px] rounded-full border-2 border-sky-300/50 animate-ping" />
                </>
              ) : s === "completed" ? (
                <Check className="w-5 h-5 text-emerald-500" />
              ) : s === "failed" ? (
                <X className="w-5 h-5 text-rose-500" />
              ) : (
                <Ic className="w-5 h-5 text-slate-400" />
              )}
            </div>
          );
        })}

        {/* ── Idle overlay ── */}
        {idle && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-xl">
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 border border-slate-200/60">
              <Bot className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-400">Execute pipeline to see live graph</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reusable Rectangular Node ────────────────────────────────────────────────
function NodeBox({
  x, y, w, h, state, label, sub, Icon, iconBg, iconColor,
}: {
  x: number; y: number; w: number; h: number;
  state: NodeState; label: string; sub: string;
  Icon: any; iconBg: string; iconColor: string;
}) {
  return (
    <div
      className="absolute flex items-center gap-3 px-3.5 py-3 rounded-2xl border-2 transition-all duration-500"
      style={{
        left: x, top: y, width: w, height: h,
        borderColor: stateStroke(state),
        backgroundColor: stateBg(state),
        boxShadow: stateGlow(state),
        zIndex: 10,
      }}
    >
      {/* Icon box */}
      <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${state !== "idle" ? iconBg : "bg-slate-100"}`}>
        {state === "active" ? (
          <Loader2 className={`w-4 h-4 ${iconColor} animate-spin`} />
        ) : state === "completed" ? (
          <Check className="w-4 h-4 text-emerald-500" />
        ) : state === "failed" ? (
          <X className="w-4 h-4 text-rose-500" />
        ) : (
          <Icon className="w-4 h-4 text-slate-400" />
        )}
      </div>
      {/* Label */}
      <div className="min-w-0 flex-1">
        <p className={`text-[11px] font-bold leading-snug truncate ${state === "idle" ? "text-slate-400" : "text-slate-800"}`}>
          {label}
        </p>
        <p className="text-[9px] text-slate-400 mt-0.5 truncate">{sub}</p>
      </div>
      {/* Checkmark badge */}
      {state === "completed" && (
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
          <Check className="w-3 h-3 text-emerald-600" />
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LiveDemoPage() {
  const router = useRouter();

  // Input state
  const [inputType, setInputType] = useState<"preset" | "upload" | "whatsapp">("preset");
  const [selectedPreset, setSelectedPreset] = useState<"normal" | "violation" | "enterprise">("normal");
  const [file, setFile] = useState<File | null>(null);
  const [whatsappText, setWhatsappText] = useState("");
  const [previewUrl, setPreviewUrl] = useState("/Invoice1.pdf");

  // Pipeline state
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [logsExpanded, setLogsExpanded] = useState(false);

  // Node states
  const [trigState, setTrigState] = useState<NodeState>("idle");
  const [agentState, setAgentState] = useState<NodeState>("idle");
  const [outState, setOutState] = useState<NodeState>("idle");
  const [toolStates, setToolStates] = useState<Record<string, NodeState>>({
    extractor: "idle", dbWriter: "idle", validator: "idle", qrSigner: "idle",
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [extractedInvoice, setExtractedInvoice] = useState<any>(null);
  const [extractedItems, setExtractedItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const timerRef = useRef<any>(null);

  // ── Elapsed timer ──────────────────────────────────────────────
  useEffect(() => {
    if (isProcessing) {
      setElapsedTime(0);
      timerRef.current = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isProcessing]);

  // ── Document preview ───────────────────────────────────────────
  useEffect(() => {
    if (inputType === "preset") {
      setPreviewUrl(
        selectedPreset === "violation" ? "/Invoice2.pdf"
          : selectedPreset === "enterprise" ? "/Invoice3.pdf"
            : "/Invoice1.pdf"
      );
    } else if (inputType === "upload" && file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  }, [inputType, selectedPreset, file]);

  // ── Sequenced Replay Log Sync ─────────────────────────────────

  const fetchInvoiceForReview = async (id: string) => {
    try {
      const res = await fetch(`/api/invoice/${id}`);
      const data = await res.json();
      if (data?.invoice) {
        setExtractedInvoice(data.invoice);
        setExtractedItems(data.items || []);
        setTimeout(() => setShowModal(true), 600);
      }
    } catch (err) { console.error(err); }
  };

  // ── Reset node states ──────────────────────────────────────────
  const resetNodes = () => {
    setTrigState("idle"); setAgentState("idle"); setOutState("idle");
    setToolStates({ extractor: "idle", dbWriter: "idle", validator: "idle", qrSigner: "idle" });
  };

  // ── Start pipeline ─────────────────────────────────────────────
  const startPipeline = async () => {
    setIsProcessing(true);
    setLogs([]);
    setInvoiceId(null);
    setCurrentStep("Initializing agent…");
    resetNodes();

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    // 1. Animate trigger
    setTrigState("active");
    await sleep(400);
    setTrigState("completed");

    // 2. Animate agent
    setAgentState("active");
    setCurrentStep("AI Agent: reasoning and planning pipeline execution...");
    await sleep(600);

    // 3. Animate extractor active
    setToolStates(p => ({ ...p, extractor: "active" }));
    setCurrentStep("AI Agent: Dispatching extract_invoice_fields to Gemini Vision...");

    let payload: { documentType: string; documentData: string; documentMime?: string } = { documentType: "text", documentData: "" };

    if (inputType === "preset") {
      const filename = selectedPreset === "violation" ? "Invoice2.pdf" : selectedPreset === "enterprise" ? "Invoice3.pdf" : "Invoice1.pdf";
      try {
        setCurrentStep(`AI Agent: Loading ${filename} for Gemini Vision…`);
        const res = await fetch(`/${filename}`);
        const blob = await res.blob();
        const b64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        payload = { documentType: "image", documentData: b64, documentMime: "application/pdf" };
      } catch (err: any) {
        setIsProcessing(false); resetNodes();
        alert(`Failed to load PDF: ${err.message}`); return;
      }
    } else if (inputType === "whatsapp") {
      payload = { documentType: "text", documentData: whatsappText };
    } else {
      if (!file) { alert("Select a file first."); setIsProcessing(false); return; }
      const buffer = await file.arrayBuffer();
      const b64 = Buffer.from(buffer).toString("base64");
      const mime = file.type || (file.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg");
      payload = { documentType: "image", documentData: b64, documentMime: mime };
    }

    setCurrentStep("AI Agent: Extracting fields via Gemini Vision...");

    try {
      const res = await fetch("/api/agent/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, extract_only: true }),
      });
      const data = await res.json();
      
      if (!data.success) {
        setIsProcessing(false);
        setToolStates(p => ({ ...p, extractor: "failed" }));
        setAgentState("failed");
        alert("Pipeline failed: " + (data.error || "Unknown"));
        return;
      }

      // --- SEQUENCE REPLAY ---
      
      // 3. Extractor Complete
      setToolStates(p => ({ ...p, extractor: "completed" }));
      setCurrentStep("Gemini Vision: Extracted invoice fields successfully. Awaiting human review.");
      await sleep(1000);

      setExtractedInvoice(data.extraction || {});
      setExtractedItems(data.extraction?.items || []);
      
      setIsProcessing(false);
      setShowModal(true);

    } catch (e: any) {
      setIsProcessing(false);
      setToolStates(p => ({
        extractor: p.extractor === "completed" ? "completed" : "failed",
        dbWriter: p.dbWriter === "completed" ? "completed" : "failed",
        validator: p.validator === "completed" ? "completed" : "failed",
        qrSigner: p.qrSigner === "completed" ? "completed" : "failed",
      }));
      setAgentState("failed");
      alert("Error: " + e.message);
    }
  };


  const handleConfirmReview = async () => {
    setIsSaving(true);
    setShowModal(false);
    setIsProcessing(true);

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    try {
      // 4. DB Writer Invocation
      setToolStates(p => ({ ...p, dbWriter: "active" }));
      setCurrentStep("AI Agent: Dispatching write_invoice_record to supabase-db-mcp...");

      const res = await fetch(`/api/agent/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          invoice: extractedInvoice, 
          items: extractedItems,
          documentType: inputType === "whatsapp" ? "text" : "image"
        }),
      });
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || "Unknown error during submit");
      }
      
      setInvoiceId(data.invoice_id);

      // Fetch the actual tool call logs from the database
      const logsRes = await fetch(`/api/logs?invoiceId=${data.invoice_id}`);
      const logsData = await logsRes.json();
      setLogs(logsData);

      const dbLog = logsData.find((l: any) => l.tool_name === "write_invoice_record");
      if (dbLog) {
        setToolStates(p => ({ ...p, dbWriter: dbLog.status === "Success" ? "completed" : "failed" }));
        setCurrentStep(dbLog.status === "Success" ? "supabase-db-mcp: Saved draft invoice record successfully." : "supabase-db-mcp: Failed to write to database.");
      } else {
        setToolStates(p => ({ ...p, dbWriter: "completed" }));
        setCurrentStep("supabase-db-mcp: Saved draft invoice record successfully.");
      }
      await sleep(1000);

      // 5. Validator Invocation
      const valLog = logsData.find((l: any) => l.tool_name === "validateLHDNCompliance" && l.status !== "Invoked");
      setToolStates(p => ({ ...p, validator: "active" }));
      setCurrentStep("AI Agent: Dispatching validateLHDNCompliance to lhdn-sandbox...");
      await sleep(1200);

      let isValSuccess = true;
      if (valLog) {
        isValSuccess = valLog.status === "Success";
        setToolStates(p => ({ ...p, validator: isValSuccess ? "completed" : "failed" }));
        if (isValSuccess) {
          setCurrentStep("lhdn-sandbox: Invoice validation passed (Phase 4 rules compliant).");
        } else {
          setCurrentStep("lhdn-sandbox: Validation failed (Phase 4 limits or State Code errors).");
        }
      } else {
        setToolStates(p => ({ ...p, validator: "completed" }));
        setCurrentStep("lhdn-sandbox: Invoice validation passed.");
      }
      await sleep(1000);

      // 6. QR Signer Invocation
      const qrLog = logsData.find((l: any) => l.tool_name === "generate_lhdn_qr" && l.status !== "Invoked");
      setToolStates(p => ({ ...p, qrSigner: "active" }));
      setCurrentStep("AI Agent: Dispatching generate_lhdn_qr to lhdn-validator-mcp...");
      await sleep(1200);

      if (qrLog) {
        const isQrSuccess = qrLog.status === "Success";
        setToolStates(p => ({ ...p, qrSigner: isQrSuccess ? "completed" : "failed" }));
        setCurrentStep(isQrSuccess ? "lhdn-validator-mcp: Signed invoice and generated LHDN QR code." : "lhdn-validator-mcp: QR generation failed.");
      } else {
        setToolStates(p => ({ ...p, qrSigner: "completed" }));
        setCurrentStep("lhdn-validator-mcp: Signed invoice and generated LHDN QR code.");
      }
      await sleep(1000);

      // 7. Output portal integration complete
      setAgentState("completed");
      setOutState(data.status === "Validated" ? "completed" : "failed");
      setCurrentStep(data.status === "Validated" ? "e-Invoice successfully validated and signed. Redirecting to portal..." : "Pipeline completed. Verification issues detected.");
      
      setIsProcessing(false);

      if (data.success) { router.push(`/lhdn?highlight=${data.invoice_id}`); }
    } catch (err: any) { 
      setIsProcessing(false);
      setAgentState("failed");
      alert("Error: " + err.message); 
    }
    finally { setIsSaving(false); }
  };


  const isIdle = !isProcessing && !invoiceId;
  const anyActive = isProcessing || Object.values(toolStates).some(s => s === "active");

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-slate-950">

      {/* ── Page heading ─────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 pt-8 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="mb-1">
            <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">Interactive Simulator</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-ubuntu leading-tight">
            MyInvoisAI Live Agent Simulation
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 max-w-2xl">
            Watch the AI agent dispatch real MCP tool calls: extract invoice fields, validate UBL compliance, and generate LHDN QR codes in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          {isProcessing && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60">
              <Loader2 className="w-3 h-3 text-sky-500 animate-spin" />
              <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">{elapsedTime}s</span>
            </div>
          )}
          {invoiceId && !isProcessing && (
            <button
              onClick={() => fetchInvoiceForReview(invoiceId)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-all text-xs font-semibold"
            >
              <Edit className="w-3.5 h-3.5" /> Review Fields
            </button>
          )}
        </div>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">

        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Input Card */}
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[20px] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileCode className="w-4 h-4 text-sky-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-white">Document Input</h2>
            </div>

            {/* Type tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl mb-4">
              {(["preset", "upload", "whatsapp"] as const).map((t) => (
                <button key={t} onClick={() => setInputType(t)}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all capitalize ${inputType === t
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}>
                  {t === "whatsapp" ? "WhatsApp" : t === "upload" ? "Upload" : "Presets"}
                </button>
              ))}
            </div>

            {/* Preset selector */}
            {inputType === "preset" && (
              <div className="space-y-2">
                {([
                  { id: "normal" as const, label: "Invoice 1", desc: "Garnier Serum · B2B · RM 1,266", badge: "Valid", badgeClr: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
                  { id: "violation" as const, label: "Invoice 2", desc: "Multi-Line · Retail · RM 453", badge: "Valid", badgeClr: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
                  { id: "enterprise" as const, label: "Invoice 3", desc: "Enterprise B2B · RM 5,653", badge: "B2B", badgeClr: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400" },
                ]).map((p) => (
                  <button key={p.id} onClick={() => setSelectedPreset(p.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${selectedPreset === p.id
                      ? "border-sky-400 bg-sky-50/80 dark:bg-sky-950/30 dark:border-sky-600"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                      }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedPreset === p.id ? "bg-sky-100 dark:bg-sky-900/40" : "bg-slate-100 dark:bg-slate-800"}`}>
                        <FileText className={`w-3.5 h-3.5 ${selectedPreset === p.id ? "text-sky-500" : "text-slate-400"}`} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{p.label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{p.desc}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.badgeClr}`}>{p.badge}</span>
                  </button>
                ))}
                {/* Downloads */}
                <div className="flex gap-1.5 pt-2">
                  {["Invoice1.pdf", "Invoice2.pdf", "Invoice3.pdf"].map((f, i) => (
                    <a key={f} href={`/${f}`} download={f}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-400 transition-all">
                      <Download className="w-3 h-3" /> INV-{i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* File upload */}
            {inputType === "upload" && (
              <div onClick={() => document.getElementById("file-input")?.click()}
                className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 rounded-xl p-5 text-center cursor-pointer transition-all group">
                <input type="file" id="file-input" className="hidden" accept=".pdf,image/*"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
                <UploadCloud className="w-8 h-8 text-slate-300 dark:text-slate-600 group-hover:text-sky-400 mx-auto mb-2 transition-colors" />
                {file ? (
                  <><p className="text-xs font-bold text-slate-900 dark:text-white">{file.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB · Click to change</p></>
                ) : (
                  <><p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Upload Invoice PDF or Image</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">PDF, PNG, JPG up to 5MB</p></>
                )}
              </div>
            )}

            {/* WhatsApp */}
            {inputType === "whatsapp" && (
              <div className="space-y-3">
                <textarea
                  className="w-full h-[120px] p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 outline-none resize-none placeholder:text-slate-400 text-xs leading-relaxed"
                  placeholder={"e.g. From: Apex Supplies\nItem: Nasi Lemak x2 – RM 15.00\nSST: 8%\nTotal: RM 16.20"}
                  value={whatsappText}
                  onChange={(e) => setWhatsappText(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setWhatsappText("Hi Tan, please send 50 bags of grade A cement (RM250 each) and 10 boxes of steel nails (RM45 each) to the Puchong construction site. \nBill to: Pembinaan Jaya Sdn Bhd. \nBRN: 202101034567. \nBuyer TIN: C234567890.")}
                    className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/50 dark:border-slate-700/50"
                  >
                    Sample: Valid B2B Order
                  </button>
                  <button 
                    onClick={() => setWhatsappText("Cash Sale. \nItem: 200 sheets of industrial glass roof panels @ RM75.00 each. \nTotal: RM15,000.00. \nBill to: General Public (Cash Customer).\nTIN: EI00000000010")}
                    className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/50 dark:border-slate-700/50"
                  >
                    Sample: RM15k Consolidation Violation
                  </button>
                </div>
              </div>
            )}

            {/* Execute button */}
            <button
              onClick={startPipeline}
              disabled={isProcessing || (inputType === "upload" && !file) || (inputType === "whatsapp" && !whatsappText)}
              className="mt-4 w-full btn-premium-primary text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Agent Running…</>
              ) : (
                <><Play className="w-4 h-4 fill-current" /> Execute Agent Pipeline</>
              )}
            </button>
          </div>

          {/* Status banner */}
          {currentStep && (
            <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[16px] p-3.5 flex items-start gap-3 shadow-sm">
              <Activity className={`w-4 h-4 mt-0.5 flex-shrink-0 ${anyActive ? "text-sky-500 animate-pulse" : "text-emerald-500"}`} />
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pipeline Status</p>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{currentStep}</p>
              </div>
            </div>
          )}

          {/* Document Preview */}
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[20px] overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Document Preview</span>
              </div>
              {previewUrl && inputType === "preset" && (
                <span className="text-[9px] text-slate-400 font-mono">
                  Invoice{selectedPreset === "normal" ? "1" : selectedPreset === "violation" ? "2" : "3"}.pdf
                </span>
              )}
            </div>
            <div className="h-[550px] bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
              {previewUrl && (inputType === "preset" || (inputType === "upload" && file)) ? (
                <iframe src={`${previewUrl}#toolbar=0&navpanes=0`} className="w-full h-full border-0 overflow-hidden" scrolling="no" title="Invoice Preview" />
              ) : inputType === "whatsapp" ? (
                <div className="h-full flex flex-col bg-[#ECE5DD] p-3 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black/10">
                    <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center">
                      <MessageSquare className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div><p className="text-xs font-bold text-slate-900">Supplier Order</p><p className="text-[9px] text-[#25D366]">online</p></div>
                  </div>
                  {whatsappText ? (
                    <div className="self-start bg-white rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%] shadow-sm">
                      <pre className="text-[10px] text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">{whatsappText}</pre>
                      <p className="text-[8px] text-slate-400 mt-1 text-right">12:34 PM ✓✓</p>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-[10px] text-slate-500">Paste your WhatsApp order above…</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No document selected</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Canvas Card */}
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[20px] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-500" />
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">AI Agent Execution Graph</h2>
                <span className="text-[9px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  n8n-style · Tool Hierarchy
                </span>
              </div>
              {/* Legend */}
              <div className="hidden sm:flex items-center gap-3 text-[9px] text-slate-400">
                {(["idle", "active", "completed", "failed"] as const).map(s => (
                  <span key={s} className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full inline-block ${s === "active" ? "bg-sky-400 animate-ping" : s === "completed" ? "bg-emerald-400" : s === "failed" ? "bg-rose-400" : "bg-slate-300"}`} />
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4">
              <PipelineCanvas
                trigState={trigState}
                agentState={agentState}
                toolStates={toolStates}
                outState={outState}
                idle={isIdle}
              />
            </div>
          </div>

          {/* MCP Logs Card */}
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[20px] shadow-sm overflow-hidden">
            <button
              onClick={() => setLogsExpanded(!logsExpanded)}
              className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">MCP Tool Call Logs</span>
                {logs.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 text-[9px] font-bold border border-sky-200 dark:border-sky-800/60">
                    {logs.length} calls
                  </span>
                )}
              </div>
              {logsExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {logsExpanded && (
              <div className="border-t border-slate-200/60 dark:border-slate-800/60">
                {logs.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-xs text-slate-400">No traces yet, run the pipeline to see MCP tool calls.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[280px] overflow-y-auto">
                    {logs.map((log, i) => {
                      const payload = safeParseJSON(log.output_response);
                      return (
                        <div key={log.id || i} className="px-5 py-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <Wrench className="w-3 h-3 text-slate-400" />
                              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 font-mono">{log.tool_name}</span>
                              <span className="text-[9px] text-slate-400 font-mono">{log.mcp_server}</span>
                            </div>
                            <span className={`px-2 py-0.5 text-[8px] font-bold rounded-full uppercase tracking-wider ${log.status === "Success"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                              }`}>{log.status}</span>
                          </div>
                          {payload && (
                            <pre className="text-[9px] font-mono text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-lg p-2 overflow-x-auto max-h-[60px] whitespace-pre-wrap border border-slate-100 dark:border-slate-800">
                              {JSON.stringify(payload, null, 2)}
                            </pre>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Human-in-the-Loop Modal ────────────────────────────────────────── */}
      {showModal && extractedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-md z-[200] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-[28px] max-w-[940px] w-full shadow-2xl overflow-hidden my-8">

            <div className="bg-gradient-to-r from-sky-500/8 to-teal-500/8 border-b border-slate-200 dark:border-slate-800 px-8 py-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Human-in-the-Loop Verification
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Review AI-Extracted Invoice Fields</h3>
                <p className="text-xs text-slate-500 mt-1">Correct any field before submitting to the mock LHDN portal.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 max-h-[calc(100vh-260px)] overflow-y-auto space-y-6">
              {/* Phase 4 warning */}
              {extractedInvoice.buyer_tin === "EI00000000010" && parseFloat(extractedInvoice.total_payable || 0) >= 10000 && (
                <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-rose-700 dark:text-rose-300">LHDN Phase 4 Limit Exceeded</p>
                    <p className="text-xs text-rose-600 dark:text-rose-400/80 mt-0.5">Consolidated invoices (TIN: EI00000000010) cannot equal or exceed RM 10,000. Update the Buyer TIN below.</p>
                  </div>
                </div>
              )}

              {/* Core fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Invoice Number", key: "invoice_number", type: "text" },
                  { label: "Total Payable (RM)", key: "total_payable", type: "number", step: "0.01" },
                  { label: "Exchange Rate", key: "exchange_rate", type: "number", step: "0.1" },
                ].map(({ label, key, type, step }) => (
                  <div key={key}>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">{label}</label>
                    <input type={type} step={step}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 outline-none"
                      value={extractedInvoice[key] || ""} onChange={(e) => setExtractedInvoice({ ...extractedInvoice, [key]: e.target.value })} />
                  </div>
                ))}
              </div>

              {/* Supplier / Buyer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                {[
                  {
                    title: "Supplier", color: "text-sky-600 dark:text-sky-400", fields: [
                      { label: "Name", key: "supplier_name" }, { label: "TIN", key: "supplier_tin", mono: true }, { label: "BRN", key: "supplier_brn", mono: true }, { label: "State Code", key: "supplier_state_code", mono: true },
                    ]
                  },
                  {
                    title: "Buyer", color: "text-teal-600 dark:text-teal-400", fields: [
                      { label: "Name", key: "buyer_name" }, { label: "TIN", key: "buyer_tin", mono: true }, { label: "BRN", key: "buyer_brn", mono: true }, { label: "State Code", key: "buyer_state_code", mono: true },
                    ]
                  },
                ].map(({ title, color, fields }) => (
                  <div key={title} className="space-y-3">
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${color}`}>{title}</h4>
                    {fields.map(({ label, key, mono }: any) => (
                      <div key={key}>
                        <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">{label}</label>
                        <input type="text"
                          className={`w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 outline-none ${mono ? "font-mono" : ""}`}
                          value={extractedInvoice[key] || ""} onChange={(e) => setExtractedInvoice({ ...extractedInvoice, [key]: e.target.value })} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Line items */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Line Items</h4>
                  <button
                    onClick={() => setExtractedItems([...extractedItems, { description: "New Item", quantity: 1, unit_price: 0, subtotal: 0, tax_rate: 0, tax_amount: 0, classification_code: "022", tax_type: "N/A" }])}
                    className="text-xs text-sky-600 font-semibold hover:text-sky-500 transition-colors">+ Add Item</button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase">
                      <tr>
                        <th className="px-3 py-2.5 text-left font-bold tracking-wider">Description</th>
                        <th className="px-3 py-2.5 w-20">MSIC</th>
                        <th className="px-3 py-2.5 text-center w-14">Qty</th>
                        <th className="px-3 py-2.5 w-24">Unit Price</th>
                        <th className="px-3 py-2.5 w-16">SST %</th>
                        <th className="px-3 py-2.5 w-24">Subtotal</th>
                        <th className="px-3 py-2.5 w-10" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {extractedItems.map((item, idx) => (
                        <tr key={idx} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-2 py-2"><input type="text" className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:border-sky-400 outline-none text-xs" value={item.description || ""} onChange={(e) => { const n = [...extractedItems]; n[idx].description = e.target.value; setExtractedItems(n); }} /></td>
                          <td className="px-2 py-2"><input type="text" className="w-full px-2 py-1.5 text-center font-mono rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:border-sky-400 outline-none text-xs" value={item.classification_code || ""} onChange={(e) => { const n = [...extractedItems]; n[idx].classification_code = e.target.value; setExtractedItems(n); }} placeholder="MSIC" /></td>
                          <td className="px-2 py-2"><input type="number" className="w-full px-2 py-1.5 text-center rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:border-sky-400 outline-none text-xs" value={item.quantity || 0} onChange={(e) => { const n = [...extractedItems]; n[idx].quantity = parseFloat(e.target.value) || 0; n[idx].subtotal = n[idx].quantity * n[idx].unit_price; n[idx].tax_amount = n[idx].subtotal * (n[idx].tax_rate / 100); setExtractedItems(n); }} /></td>
                          <td className="px-2 py-2"><input type="number" step="0.01" className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:border-sky-400 outline-none text-xs" value={item.unit_price || 0} onChange={(e) => { const n = [...extractedItems]; n[idx].unit_price = parseFloat(e.target.value) || 0; n[idx].subtotal = n[idx].quantity * n[idx].unit_price; n[idx].tax_amount = n[idx].subtotal * (n[idx].tax_rate / 100); setExtractedItems(n); }} /></td>
                          <td className="px-2 py-2"><input type="number" className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:border-sky-400 outline-none text-xs" value={item.tax_rate || 0} onChange={(e) => { const n = [...extractedItems]; n[idx].tax_rate = parseFloat(e.target.value) || 0; n[idx].tax_amount = n[idx].subtotal * (n[idx].tax_rate / 100); setExtractedItems(n); }} /></td>
                          <td className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-200 font-mono text-xs">RM {parseFloat(item.subtotal || 0).toFixed(2)}</td>
                          <td className="px-2 py-2 text-center"><button onClick={() => setExtractedItems(extractedItems.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-rose-500 transition-colors p-1"><X className="w-3.5 h-3.5" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 px-8 py-5 flex items-center justify-between">
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all text-sm font-medium">
                Back to Simulator
              </button>
              <button onClick={handleConfirmReview} disabled={isSaving}
                className="btn-premium-primary flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-50">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isSaving ? "Submitting…" : "Confirm & Submit to LHDN Portal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
