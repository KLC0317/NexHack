import { CheckCircle2 } from "lucide-react";

export function InvoiceDetailView({ theme, invoice, onBack }: { theme: "light" | "dark", invoice?: any, onBack?: () => void }) {
  return (
    <div className="animate-in fade-in duration-300 max-w-4xl mx-auto">
      {onBack && (
        <button onClick={onBack} className="text-[#3b43a8] text-sm hover:underline mb-6 flex items-center">
          ← Back to Documents
        </button>
      )}

      <div className={`p-8 rounded-lg shadow-sm border ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-light text-gray-800 dark:text-gray-200 mb-2">Invoice</h1>
            <div className="space-y-1 text-sm text-gray-500">
              <p>e-Invoice No. <span className="font-medium text-gray-800 dark:text-gray-300">23701915219</span></p>
              <p>UUID: <span className="font-medium text-gray-800 dark:text-gray-300">067MK4HCR7JK6GE3YPYXS880</span></p>
            </div>
            <div className="mt-3 flex items-center text-[#107c41] font-medium text-sm">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Valid
            </div>
          </div>
          <div className="text-sm font-medium text-gray-500">
            v1.1
          </div>
        </div>

        <div className={`p-6 rounded border ${theme === "dark" ? "bg-[#292b45] border-[#3b3a39]" : "bg-[#fcfcfc] border-[#edebe9]"}`}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Supplier Name</label>
              <div className={`w-full p-2.5 rounded border ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
                Aisha S.
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Buyer Name</label>
              <div className={`w-full p-2.5 rounded border ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
                ONE WORLD SDN. BHD
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Total Payable Amount</label>
              <div className={`w-full p-2.5 rounded border flex items-center ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
                <span className="w-8 border-r mr-3 text-gray-500 text-sm">RM</span> 7,322.82
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Issuance Date & Time</label>
              <div className={`w-full p-2.5 rounded border ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
                1/9/2025 11:02:00 PM
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Submission Date & Time</label>
              <div className={`w-full p-2.5 rounded border ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
                1/9/2025 11:07:51 PM
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Validation Date & Time</label>
              <div className={`w-full p-2.5 rounded border ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
                1/9/2025 11:07:51 PM
              </div>
            </div>

          </div>

          <div className="mt-8 text-center text-xs font-semibold text-gray-500">
            Thank you for using MyInvois Portal, Lembaga Hasil Dalam Negeri Malaysia (LHDNM)
          </div>
        </div>

      </div>
    </div>
  );
}
