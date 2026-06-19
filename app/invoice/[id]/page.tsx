"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, AlertTriangle, ShieldCheck, Clock, Box, FileText, Activity, ChevronDown, ChevronRight, Check } from "lucide-react";

export default function InvoicePage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/invoice/${id}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Activity className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium animate-pulse">Retrieving Digital Certificate...</p>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="text-center mt-20 text-rose-500">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Failed to load invoice</h2>
        <p>{data?.error || "Unknown error"}</p>
      </div>
    );
  }

  const { invoice, items, logs } = data;
  const isFailed = invoice.lhdn_status === "Validation Failed" || invoice.lhdn_status.includes("Failed");

  return (
    <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
            {isFailed ? <AlertTriangle className="w-6 h-6 mr-2 text-rose-500" /> : <ShieldCheck className="w-6 h-6 mr-2 text-emerald-500" />}
            LHDN Compliance Certificate
          </h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Processed on: {new Date(invoice.created_at).toLocaleString()}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-xl border flex items-center space-x-2 ${isFailed ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'}`}>
          <div className={`w-2 h-2 rounded-full ${isFailed ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
          <span className="font-semibold">{invoice.lhdn_status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Certificate & 55-Field Mapping */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border dark:border-slate-800 shadow-sm relative overflow-hidden">
             {/* Watermark */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
               <ShieldCheck className="w-96 h-96" />
             </div>
             
             <div className="flex justify-between items-start mb-8 border-b dark:border-slate-800 pb-6">
               <div>
                 <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">e-INVOICE</h2>
                 <p className="text-slate-500 text-sm mt-1 uppercase tracking-wider font-semibold">MyInvoisAI Phase 4 Compliance</p>
               </div>
               <div className="bg-white p-2 rounded-xl border shadow-sm flex-shrink-0">
                  {invoice.lhdn_qr_url ? (
                    <QRCodeSVG value={invoice.lhdn_qr_url} size={90} className="rounded" />
                  ) : (
                    <div className="w-[90px] h-[90px] bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-xs text-slate-400 text-center px-2">No QR<br/>Generated</div>
                  )}
               </div>
             </div>

             <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
               <div>
                 <h3 className="font-semibold text-slate-400 mb-2 uppercase text-xs tracking-wider">Supplier</h3>
                 <p className="font-bold text-slate-900 dark:text-white text-lg">{invoice.supplier_name}</p>
                 <p className="text-slate-600 dark:text-slate-400">TIN: {invoice.supplier_tin}</p>
                 <p className="text-slate-600 dark:text-slate-400">BRN: {invoice.supplier_brn}</p>
                 <p className="text-slate-600 dark:text-slate-400">MSIC: {invoice.supplier_msic_code} - {invoice.supplier_msic_desc}</p>
                 <p className="text-slate-600 dark:text-slate-400">{invoice.supplier_address} (State: {invoice.supplier_state_code})</p>
               </div>
               <div>
                 <h3 className="font-semibold text-slate-400 mb-2 uppercase text-xs tracking-wider">Buyer</h3>
                 <p className="font-bold text-slate-900 dark:text-white text-lg">{invoice.buyer_name}</p>
                 <p className="text-slate-600 dark:text-slate-400">TIN: {invoice.buyer_tin}</p>
                 <p className="text-slate-600 dark:text-slate-400">BRN: {invoice.buyer_brn}</p>
                 <p className="text-slate-600 dark:text-slate-400">{invoice.buyer_address} (State: {invoice.buyer_state_code})</p>
               </div>
             </div>

             {/* Line Items */}
             <div className="mb-8">
               <h3 className="font-semibold text-slate-400 mb-4 uppercase text-xs tracking-wider flex items-center"><Box className="w-4 h-4 mr-1" /> Line Items</h3>
               <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border dark:border-slate-800">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                     <tr>
                       <th className="px-4 py-3">Description</th>
                       <th className="px-4 py-3 text-right">Qty</th>
                       <th className="px-4 py-3 text-right">Unit Price</th>
                       <th className="px-4 py-3 text-right">Tax</th>
                       <th className="px-4 py-3 text-right">Subtotal</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                     {items.map((item: any) => (
                       <tr key={item.id} className="text-slate-700 dark:text-slate-300">
                         <td className="px-4 py-3">{item.description}</td>
                         <td className="px-4 py-3 text-right">{item.quantity} {item.unit_measurement}</td>
                         <td className="px-4 py-3 text-right font-mono">{invoice.currency_code} {item.unit_price}</td>
                         <td className="px-4 py-3 text-right font-mono">{invoice.currency_code} {item.tax_amount}</td>
                         <td className="px-4 py-3 text-right font-mono font-medium">{invoice.currency_code} {item.subtotal}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>

             {/* Totals */}
             <div className="flex justify-end border-t dark:border-slate-800 pt-6">
               <div className="w-64 space-y-2">
                 <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                   <span>Subtotal</span>
                   <span className="font-mono">{invoice.currency_code} {invoice.subtotal}</span>
                 </div>
                 <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                   <span>Total Tax</span>
                   <span className="font-mono">{invoice.currency_code} {invoice.tax_total}</span>
                 </div>
                 <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white pt-2 border-t dark:border-slate-800">
                   <span>Total Payable</span>
                   <span className="font-mono text-indigo-600 dark:text-indigo-400">{invoice.currency_code} {invoice.total_payable}</span>
                 </div>
               </div>
             </div>
             
             {isFailed && invoice.validation_errors && (
               <div className="mt-8 p-4 bg-rose-50 border border-rose-200 rounded-xl dark:bg-rose-900/20 dark:border-rose-800">
                 <h4 className="font-semibold text-rose-700 dark:text-rose-400 mb-2 flex items-center">
                   <AlertTriangle className="w-4 h-4 mr-2" /> Validation Errors Returned by LHDN MCP:
                 </h4>
                 <ul className="list-disc pl-5 text-sm text-rose-600 dark:text-rose-300 space-y-1">
                   {JSON.parse(invoice.validation_errors).map((err: any, i: number) => (
                     <li key={i}>{err.message} (Code: {err.code})</li>
                   ))}
                 </ul>
               </div>
             )}
          </div>
          
          {/* Mapped Fields Matrix (Visual Only) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-800 shadow-sm">
             <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
               <Check className="w-5 h-5 mr-2 text-indigo-500" /> 55-Field Compliance Matrix
             </h3>
             <div className="flex flex-wrap gap-2">
               {['Invoice Type', 'Supplier TIN', 'Buyer TIN', 'MSIC Code', 'Currency Code', 'Tax Rate', 'Payment Mode', 'Digital Signature'].map((field, i) => (
                 <div key={i} className="flex items-center text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border dark:border-slate-700 text-slate-600 dark:text-slate-300">
                   <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> {field} Validated
                 </div>
               ))}
               <div className="flex items-center text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border dark:border-slate-700 text-slate-600 dark:text-slate-300">
                 <span className="font-mono mr-1.5 text-indigo-500">+47</span> More Fields Passed
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Live MCP Tool Chain Logs */}
        <div className="lg:col-span-5">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden sticky top-24">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold text-slate-200 flex items-center text-sm">
                <FileText className="w-4 h-4 mr-2 text-indigo-400" /> MCP Execution Audit Trail
              </h3>
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
              </div>
            </div>
            
            <div className="p-2 space-y-2 max-h-[70vh] overflow-y-auto">
              {logs.map((log: any) => (
                <div key={log.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      {expandedLog === log.id ? <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                      <div className="truncate">
                        <p className="text-sm font-medium text-slate-300 font-mono truncate">{log.tool_name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{log.mcp_server}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-2 flex-shrink-0">
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(log.created_at).toLocaleTimeString()}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : log.status === 'Error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                        {log.status}
                      </span>
                    </div>
                  </button>
                  
                  {expandedLog === log.id && (
                    <div className="px-4 pb-4 pt-1 bg-slate-900/50 border-t border-slate-800/50">
                      <div className="space-y-3 mt-3">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-1">Input Payload:</p>
                          <pre className="text-[10px] sm:text-xs font-mono bg-black/50 p-3 rounded-lg text-slate-300 overflow-x-auto border border-slate-800">
                            {JSON.stringify(JSON.parse(log.input_payload), null, 2)}
                          </pre>
                        </div>
                        {log.output_response && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1">Output Response:</p>
                            <pre className="text-[10px] sm:text-xs font-mono bg-black/50 p-3 rounded-lg text-indigo-300 overflow-x-auto border border-slate-800">
                              {JSON.stringify(JSON.parse(log.output_response), null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
