import { CheckCircle2 } from "lucide-react";

export function InvoiceDetailView({ theme, invoice, onBack, language = "EN" }: { theme: "light" | "dark", invoice?: any, onBack?: () => void, language?: "EN" | "BM" }) {
  const isBM = language === "BM";

  return (
    <div className="animate-in fade-in duration-300 max-w-4xl mx-auto">
      {onBack && (
        <button onClick={onBack} className="text-[#3b43a8] text-sm hover:underline mb-6 flex items-center">
          {isBM ? "← Kembali ke Dokumen" : "← Back to Documents"}
        </button>
      )}

      <div className={`p-8 rounded-lg shadow-sm border ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-light text-gray-800 dark:text-gray-200 mb-2">{isBM ? "Invois" : "Invoice"}</h1>
            <div className="space-y-1 text-sm text-gray-500">
              <p>{isBM ? "No. e-Invois" : "e-Invoice No."} <span className="font-medium text-gray-800 dark:text-gray-300">{invoice?.code || "-"}</span></p>
              <p>UUID: <span className="font-medium text-gray-800 dark:text-gray-300 font-mono text-xs">{invoice?.uuid || "-"}</span></p>
            </div>
            {invoice?.status === "Valid" ? (
              <div className="mt-3 flex items-center text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                <CheckCircle2 className="w-4 h-4 mr-1" /> {isBM ? "Sah" : "Valid"}
              </div>
            ) : invoice?.status === "Invalid" ? (
              <div className="mt-3 flex items-center text-rose-600 dark:text-rose-400 font-medium text-sm">
                <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mr-1 text-[10px] font-bold">✕</span> {isBM ? "Tidak Sah" : "Invalid"}
              </div>
            ) : (
              <div className="mt-3 flex items-center text-slate-500 dark:text-slate-400 font-medium text-sm">
                <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-1 text-[10px] font-bold">⊘</span> {isBM ? "Dibatalkan" : "Cancelled"}
              </div>
            )}
          </div>
          <div className="text-sm font-medium text-gray-500">
            v1.1
          </div>
        </div>

        <div className={`p-6 rounded border ${theme === "dark" ? "bg-[#292b45] border-[#3b3a39]" : "bg-[#fcfcfc] border-[#edebe9]"}`}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">{isBM ? "Nama Pembekal" : "Supplier Name"}</label>
              <div className={`w-full p-2.5 rounded border ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
                {invoice?.supplier || "-"}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{isBM ? "Nama Pembeli" : "Buyer Name"}</label>
              <div className={`w-full p-2.5 rounded border ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
                {invoice?.buyer || "-"}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">{isBM ? "Jumlah Kena Bayar" : "Total Payable Amount"}</label>
              <div className={`w-full p-2.5 rounded border flex items-center ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
                <span className="w-8 border-r mr-3 text-gray-500 text-sm">RM</span> {invoice?.amount || "0.00"}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{isBM ? "Tarikh & Masa Pengeluaran" : "Issuance Date & Time"}</label>
              <div className={`w-full p-2.5 rounded border ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
                {invoice?.issued || "-"}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">{isBM ? "Tarikh & Masa Penyerahan" : "Submission Date & Time"}</label>
              <div className={`w-full p-2.5 rounded border ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
                {invoice?.submitted || "-"}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{isBM ? "Tarikh & Masa Pengesahan" : "Validation Date & Time"}</label>
              <div className={`w-full p-2.5 rounded border ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
                {invoice?.date || invoice?.submitted || "-"}
              </div>
            </div>

          </div>

          <div className="mt-8 text-center text-xs font-semibold text-gray-500">
            {isBM 
              ? "Terima kasih kerana menggunakan Portal MyInvois, Lembaga Hasil Dalam Negeri Malaysia (LHDNM)" 
              : "Thank you for using MyInvois Portal, Lembaga Hasil Dalam Negeri Malaysia (LHDNM)"
            }
          </div>
        </div>

      </div>
    </div>
  );
}
