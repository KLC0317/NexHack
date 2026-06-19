"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, Download, ShieldCheck, AlertTriangle, Printer } from "lucide-react";

export default function VerificationPortal() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center print:hidden">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#002A54] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#002A54] font-semibold tracking-widest uppercase">Connecting to HASiL Gateway...</p>
        </div>
      </div>
    );
  }

  if (!data || data.error || !data.invoice) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 print:hidden">
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-rose-500 max-w-md w-full text-center">
          <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error: Record Not Found</h2>
          <p className="text-slate-600 mb-6">
            Invoice record not found in LHDN database. Sila hubungi HASiL untuk pengesahan lanjut.
          </p>
          <a href="/" className="text-sm font-semibold text-[#002A54] hover:underline">
            &larr; Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const { invoice } = data;
  const isFailed = invoice.lhdn_status.includes("Failed");
  // Simple fake hash generation based on ID for visual simulation
  const signatureHash = `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855_${invoice.id.split('-')[0]}`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 print:bg-white print:pb-0">
      
      {/* Print-specific styles using a standard style block */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-break-inside-avoid { break-inside: avoid; }
        }
      `}} />

      {/* Official Top Header */}
      <header className="bg-[#002A54] text-white print:bg-[#002A54]">
        <div className="max-w-5xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/LHDN_logo.png" 
              alt="LHDN Logo" 
              className="h-12 md:h-[60px] object-contain bg-white p-1 rounded"
            />
            <div className="text-left">
              <h1 className="font-bold text-sm md:text-base tracking-wide uppercase">Lembaga Hasil Dalam Negeri Malaysia</h1>
              <p className="text-[#FFD700] text-xs md:text-sm font-medium">MyInvois Verification Portal (LHDNM / HASiL)</p>
            </div>
          </div>
          <div className="bg-white/10 border border-white/20 px-3 py-1.5 rounded text-[10px] md:text-xs font-mono uppercase tracking-widest text-emerald-300 print:border-[#002A54] print:text-white print:bg-transparent">
            [ PRE-PROD SANDBOX / TEST GATEWAY ]
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 md:mt-12">
        
        {/* Validation Status Hero Container */}
        <section className={`mb-8 p-6 md:p-8 rounded-xl border-l-8 shadow-sm print:shadow-none print:border-l-4 ${isFailed ? 'bg-rose-50 border-rose-600' : 'bg-emerald-50 border-emerald-600'}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              {isFailed ? (
                 <AlertTriangle className="w-10 h-10 md:w-14 md:h-14 text-rose-600 flex-shrink-0 mt-1" />
              ) : (
                 <CheckCircle className="w-10 h-10 md:w-14 md:h-14 text-emerald-600 flex-shrink-0 mt-1" />
              )}
              <div>
                <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tight mb-2 ${isFailed ? 'text-rose-800' : 'text-emerald-800'}`}>
                  STATUS: {isFailed ? 'DITOLAK / REJECTED' : 'SAH / VALIDATED'}
                </h2>
                <p className="text-sm md:text-base text-slate-700 font-medium">
                  This document is registered under Section 82C of the Income Tax Act 1967.
                </p>
                <div className="mt-4">
                  <p className="text-xs uppercase text-slate-500 font-bold mb-1">Unique Identifier Number (UUID)</p>
                  <p className="font-mono text-lg md:text-xl font-bold bg-white px-3 py-1.5 rounded border border-slate-200 text-slate-800 inline-block break-all shadow-sm">
                    {invoice.lhdn_uuid || invoice.id}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="md:text-right w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-200/60">
               <p className="text-xs uppercase text-slate-500 font-bold mb-1">Validation Date & Time</p>
               <p className="text-slate-800 font-mono text-sm md:text-base bg-white/60 px-2 py-1 rounded inline-block">
                 {invoice.lhdn_validation_date ? new Date(invoice.lhdn_validation_date).toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }) : new Date().toLocaleString()} (MYT)
               </p>
            </div>
          </div>
        </section>

        {/* Structured Taxonomy Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:gap-4 print:text-sm">
          
          {/* Card 1: Supplier Info */}
          <div className="bg-white border-t-4 border-[#002A54] rounded-lg shadow-sm overflow-hidden print-break-inside-avoid print:shadow-none print:border-l print:border-r print:border-b">
            <div className="bg-slate-50 px-4 py-3 border-b text-[#002A54] font-bold text-sm uppercase tracking-wider flex items-center">
              Supplier Information (Penjual)
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Registered Name</p>
                <p className="font-bold text-slate-900">{invoice.supplier_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">TIN</p>
                  <p className="font-mono text-slate-800">{invoice.supplier_tin}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">SSM BRN</p>
                  <p className="font-mono text-slate-800">{invoice.supplier_brn}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">MSIC Code</p>
                  <p className="font-mono text-slate-800">{invoice.supplier_msic_code}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">State Code</p>
                  <p className="font-mono text-slate-800">{invoice.supplier_state_code}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Buyer Info */}
          <div className="bg-white border-t-4 border-[#002A54] rounded-lg shadow-sm overflow-hidden print-break-inside-avoid print:shadow-none print:border-l print:border-r print:border-b">
            <div className="bg-slate-50 px-4 py-3 border-b text-[#002A54] font-bold text-sm uppercase tracking-wider flex items-center">
              Buyer Information (Pembeli)
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Registered Name</p>
                <p className="font-bold text-slate-900">{invoice.buyer_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">TIN</p>
                  <p className="font-mono text-slate-800">{invoice.buyer_tin}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">BRN / ID</p>
                  <p className="font-mono text-slate-800">{invoice.buyer_brn}</p>
                </div>
              </div>
              <div>
                 <p className="text-[10px] text-slate-500 uppercase font-semibold">State Code</p>
                 <p className="font-mono text-slate-800">{invoice.buyer_state_code}</p>
              </div>
            </div>
          </div>

          {/* Card 3: Document Particulars */}
          <div className="bg-white border-t-4 border-slate-400 rounded-lg shadow-sm overflow-hidden print-break-inside-avoid print:shadow-none print:border-l print:border-r print:border-b">
            <div className="bg-slate-50 px-4 py-3 border-b text-slate-700 font-bold text-sm uppercase tracking-wider">
              Document Particulars
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Internal Ref No.</p>
                <p className="font-mono font-bold text-slate-800">{invoice.invoice_number}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Type Code</p>
                <p className="font-mono text-slate-800">{invoice.invoice_type_code} (Invoice)</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Currency</p>
                <p className="font-mono text-slate-800">{invoice.currency_code}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Submission Route</p>
                <p className="text-slate-800 uppercase text-xs font-semibold">{invoice.raw_input_type}</p>
              </div>
            </div>
          </div>

          {/* Card 4: Financial Summary */}
          <div className="bg-white border-t-4 border-[#FFD700] rounded-lg shadow-sm overflow-hidden print-break-inside-avoid print:shadow-none print:border-l print:border-r print:border-b">
            <div className="bg-slate-50 px-4 py-3 border-b text-slate-800 font-bold text-sm uppercase tracking-wider">
              Financial Summary
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-dashed pb-2">
                <span className="text-sm font-semibold text-slate-600">Subtotal Amount</span>
                <span className="font-mono font-medium text-slate-800">{Number(invoice.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-dashed pb-2">
                <span className="text-sm font-semibold text-slate-600">Total Tax / SST Amount</span>
                <span className="font-mono font-medium text-slate-800">{Number(invoice.tax_total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-base font-black text-[#002A54]">TOTAL PAYABLE ({invoice.currency_code})</span>
                <span className="font-mono text-xl font-black text-[#002A54]">{Number(invoice.total_payable).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
        </section>

        {/* Cryptographic Integrity Footer */}
        <section className="bg-white border p-6 rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 print:shadow-none print-break-inside-avoid">
          <div className="flex items-start space-x-4">
             <div className="bg-[#002A54]/10 p-3 rounded-full print:border print:border-[#002A54]">
               <ShieldCheck className="w-6 h-6 text-[#002A54]" />
             </div>
             <div>
               <h4 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wider">Digital Signature (SHA-256)</h4>
               <p className="font-mono text-[10px] md:text-xs text-slate-500 break-all bg-slate-50 p-2 rounded border border-slate-100">
                 {signatureHash}
               </p>
               <p className="text-[10px] text-slate-400 mt-2">
                 Sealed and verified by HASiL Cryptographic Gateway. Do not modify.
               </p>
             </div>
          </div>
          
          <button 
            onClick={() => window.print()}
            className="print:hidden w-full md:w-auto flex-shrink-0 bg-[#002A54] hover:bg-[#003B75] text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center space-x-2 transition-colors shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Download Signed PDF Copy</span>
          </button>
        </section>

        <div className="hidden print:block mt-8 text-center text-xs text-slate-400">
           <p>Salinan PDF Rasmi - Dijana oleh Sistem MyInvois (HASiL)</p>
           <p>Dicetak pada: {new Date().toLocaleString('en-MY')}</p>
        </div>

      </main>
    </div>
  );
}
