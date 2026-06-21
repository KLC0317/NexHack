"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, FileJson, FileSpreadsheet, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AccountantPortal() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      let url = "/api/invoices/validated";
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (params.toString()) {
        url += "?" + params.toString();
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.invoices) {
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [startDate, endDate]);

  const handleExportUBL = () => {
    const payload = {
      _type: "UBL 2.1 JSON Export",
      _comment: "Mapped for LHDN Phase 4 MyInvois System",
      exportDate: new Date().toISOString(),
      invoices: invoices.map((inv) => ({
        "cbc:ID": inv.invoice_number,
        "cbc:IssueDate": new Date(inv.created_at).toISOString().split('T')[0],
        "cbc:DocumentCurrencyCode": inv.currency_code,
        "cbc:LineExtensionAmount": inv.subtotal,
        "cbc:TaxInclusiveAmount": inv.total_payable,
        "cac:AccountingSupplierParty": {
          "Party": {
            "PartyName": { "Name": inv.supplier_name },
            "PartyIdentification": [{ "ID": inv.supplier_tin }],
            "PartyLegalEntity": [{ "CompanyID": inv.supplier_brn }]
          }
        },
        "cac:AccountingCustomerParty": {
          "Party": {
            "PartyName": { "Name": inv.buyer_name },
            "PartyIdentification": [{ "ID": inv.buyer_tin }],
            "PartyLegalEntity": [{ "CompanyID": inv.buyer_brn }]
          }
        },
        "cac:TaxTotal": {
          "TaxAmount": inv.tax_total
        }
      }))
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "myinvois_ubl_export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ["Invoice Date", "Invoice Number", "Buyer Name", "Buyer TIN", "Subtotal", "SST Tax Collected", "Total"];
    const rows = invoices.map(inv => [
      new Date(inv.created_at).toLocaleDateString(),
      inv.invoice_number,
      inv.buyer_name,
      inv.buyer_tin,
      inv.subtotal,
      inv.tax_total,
      inv.total_payable
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "myinvois_audit_log.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-slate-950 text-foreground font-sans animate-in fade-in zoom-in-95 duration-500 overflow-hidden relative">
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1152px] mx-auto px-6 py-[48px] relative z-10 space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4"
        >
          <div>
            <div className="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-full mb-3 shadow-sm">
              <span className="font-bold uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Audit Ready
              </span>
            </div>
            <h1 className="text-[32px] md:text-[38px] font-[800] tracking-tight text-slate-900 dark:text-white leading-none">
              Portal Akauntan
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2.5 max-w-lg text-[15px]">
              External auditor dashboard strictly for validated transactions. Export month-end UBL data and review audit logs.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-3 rounded-[16px] border border-slate-200/60 dark:border-slate-800 shadow-sm w-full md:w-auto">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <label className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide min-w-[40px]">Start</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm transition-all w-full sm:w-auto"
              />
            </div>
            <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <label className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide min-w-[40px]">End</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm transition-all w-full sm:w-auto"
              />
            </div>
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-4 items-center"
        >
          <button 
            onClick={handleExportUBL} 
            className="btn-premium-primary text-white px-6 py-[12px] rounded-[14px] font-[600] text-[14px] transition-all shadow-md flex items-center group cursor-pointer"
          >
            <FileJson className="w-4 h-4 mr-2" />
            <span className="text-candy-shadow">Export Month-End UBL 2.1 (JSON)</span>
          </button>
          
          <button 
            onClick={handleExportCSV} 
            className="btn-premium-secondary px-6 py-[12px] rounded-[14px] font-[600] text-[14px] transition-all flex items-center group shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-slate-500" />
            <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Export CSV Audit Log</span>
          </button>
        </motion.div>

        {/* Table View */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60 rounded-[24px] shadow-[0_10px_40px_rgba(8,112,184,0.03)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center bg-white/40 dark:bg-slate-950/40">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" />
              Validated Transactions ({invoices.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-transparent bg-transparent">
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider py-4 pl-6">Invoice Date</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider py-4">Invoice Number</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider py-4">Buyer Name</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider py-4">Buyer TIN</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider py-4 text-right">Subtotal</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider py-4 text-right">SST Tax</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider py-4 text-right pr-6">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-8 h-8 rounded-full border-4 border-sky-200 border-t-sky-500 animate-spin"></div>
                        <span className="font-medium text-sm">Syncing latest records...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                        <span className="font-medium">No validated invoices found.</span>
                        <span className="text-sm opacity-70">Try adjusting your date range.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((inv) => (
                    <TableRow key={inv.id} className="border-b border-slate-100/50 dark:border-slate-800/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <TableCell className="py-4 pl-6 text-sm text-slate-600 dark:text-slate-300">{new Date(inv.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="py-4 font-semibold text-sm text-slate-800 dark:text-slate-200">
                        {inv.invoice_number}
                        <div className="w-0 h-0.5 bg-sky-400 group-hover:w-full transition-all duration-300 mt-1 rounded-full opacity-50"></div>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-slate-600 dark:text-slate-300">{inv.buyer_name}</TableCell>
                      <TableCell className="py-4 text-sm font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-md px-2 my-2 inline-block border border-slate-100 dark:border-slate-800">{inv.buyer_tin}</TableCell>
                      <TableCell className="py-4 text-right text-sm text-slate-600 dark:text-slate-300">RM {Number(inv.subtotal).toFixed(2)}</TableCell>
                      <TableCell className="py-4 text-right text-sm text-slate-600 dark:text-slate-300">RM {Number(inv.tax_total).toFixed(2)}</TableCell>
                      <TableCell className="py-4 text-right font-bold text-slate-900 dark:text-white pr-6">RM {Number(inv.total_payable).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
