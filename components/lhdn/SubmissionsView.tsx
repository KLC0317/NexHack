import { useState, useRef } from "react";
import { FileText, UploadCloud, Trash2, PenTool, X, Download, Loader2 } from "lucide-react";

export function SubmissionsView({ theme, onBatchUpload, language = "EN" }: { theme: "light" | "dark", onBatchUpload?: (docs: any[]) => void, language?: "EN" | "BM" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isBM = language === "BM";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsModalOpen(false);
        const newDocs = Array(3).fill(null).map((_, i) => ({
          code: `INV-2024-00${i}`,
          lastModified: new Date().toISOString(),
          type: "Invoice",
          supplier: "Supplier Co",
          buyer: "Buyer Co",
          amount: "100.00",
          status: "Ready for submission",
          error: ""
        }));
        if (onBatchUpload) onBatchUpload(newDocs);
      }, 2000);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const mockDrafts = [
    {
      code: "DFT-2026-09151",
      lastModified: "6/20/2026 12:44:12 PM",
      type: "Invoice (01) / v1.1",
      supplier: "Apex Logistics Ltd / C7891234560",
      buyer: "Zenith Retail Corp / EI00000000010",
      amount: "8,950.00",
      status: "Ready for submission",
      error: ""
    },
    {
      code: "DFT-2026-09152",
      lastModified: "6/20/2026 12:38:05 PM",
      type: "Invoice (01) / v1.1",
      supplier: "Alpha Tech Solutions / C1234567890",
      buyer: "Global Goods Sdn Bhd / EI00000000010",
      amount: "1,240.50",
      status: "Ready for submission",
      error: ""
    },
    {
      code: "DFT-2026-09153",
      lastModified: "6/20/2026 11:55:00 AM",
      type: "Credit Note (02) / v1.1",
      supplier: "Alpha Tech Solutions / C1234567890",
      buyer: "Synergy Corp / C883921000",
      amount: "-450.00",
      status: "Ready for submission",
      error: ""
    },
    {
      code: "DFT-2026-09154",
      lastModified: "6/20/2026 10:20:11 AM",
      type: "Invoice (01) / v1.1",
      supplier: "Lian He Trading / C988273910",
      buyer: "General Public / EI00000000010",
      amount: "350.25",
      status: "Ready for submission",
      error: ""
    },
    {
      code: "DFT-2026-09155",
      lastModified: "6/20/2026 09:12:45 AM",
      type: "Debit Note (03) / v1.1",
      supplier: "Apex Logistics Ltd / C7891234560",
      buyer: "Zenith Retail Corp / EI00000000010",
      amount: "120.00",
      status: "Ready for submission",
      error: ""
    },
    {
      code: "DFT-2026-09156",
      lastModified: "6/19/2026 06:14:02 PM",
      type: "Invoice (01) / v1.1",
      supplier: "Garnier Cosmetics / C552839210",
      buyer: "Aisha S. / EI00000000010",
      amount: "1,266.00",
      status: "Ready for submission",
      error: ""
    },
    {
      code: "DFT-2026-09157",
      lastModified: "6/19/2026 04:30:51 PM",
      type: "Invoice (01) / v1.1",
      supplier: "Metro Foods / C112233445",
      buyer: "Hypermarket Enterprise / C667788990",
      amount: "5,653.00",
      status: "Ready for submission",
      error: ""
    },
    {
      code: "DFT-2026-09158",
      lastModified: "6/19/2026 02:44:10 PM",
      type: "Invoice (01) / v1.1",
      supplier: "Digital Hub / C909090901",
      buyer: "One World Sdn Bhd / EI00000000010",
      amount: "7,322.82",
      status: "Ready for submission",
      error: ""
    },
    {
      code: "DFT-2026-09159",
      lastModified: "6/19/2026 11:05:12 AM",
      type: "Invoice (01) / v1.1",
      supplier: "Sincere Flowers / C454545450",
      buyer: "Bouquet Florists / C202020202",
      amount: "800.00",
      status: "Ready for submission",
      error: ""
    },
    {
      code: "DFT-2026-09160",
      lastModified: "6/19/2026 09:00:00 AM",
      type: "Invoice (01) / v1.1",
      supplier: "Prime Power Ltd / C676767676",
      buyer: "State Grid Corp / C545454545",
      amount: "12,400.00",
      status: "Ready for submission",
      error: ""
    }
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-light mb-4">{isBM ? "Penyerahan" : "Submissions"}</h1>
        <div className={`flex items-center border-b ${theme === "dark" ? "border-[#3b3a39]" : "border-[#edebe9]"}`}>
          <span className={`text-[14px] mr-4 mb-2 ${theme === "dark" ? "text-[#a19f9d]" : "text-[#605e5c]"}`}>
            {isBM ? "Atau teruskan dari:" : "Or continue from:"}
          </span>
          <button className="text-[14px] font-semibold text-[#0078d4] border-b-2 border-[#0078d4] pb-2 px-2 flex items-center">
            <FileText className="w-4 h-4 mr-1.5" /> {isBM ? "Draf" : "Drafts"}
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-4 space-x-2">
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center px-4 py-1.5 border text-[14px] font-medium rounded shadow-sm transition-colors ${theme === "dark" ? "bg-[#323130] border-[#3b3a39] text-white hover:bg-[#201f1e]" : "bg-white border-[#8a8886] text-[#323130] hover:bg-[#f3f2f1]"}`}
        >
          <UploadCloud className="w-4 h-4 mr-2" /> {isBM ? "Muat Naik Kelompok" : "Batch Upload"}
        </button>
        <button className={`flex items-center px-4 py-1.5 border text-[14px] font-medium rounded shadow-sm opacity-50 cursor-not-allowed ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39] text-[#a19f9d]" : "bg-[#f3f2f1] border-[#8a8886] text-[#a19f9d]"}`} disabled>
          <Trash2 className="w-4 h-4 mr-2" /> {isBM ? "Padam" : "Delete"}
        </button>
        <button className={`flex items-center px-4 py-1.5 border text-[14px] font-medium rounded shadow-sm opacity-50 cursor-not-allowed ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39] text-[#a19f9d]" : "bg-[#f3f2f1] border-[#8a8886] text-[#a19f9d]"}`} disabled>
          <PenTool className="w-4 h-4 mr-2" /> {isBM ? "Tandatangan & Serah" : "Sign & Submit"}
        </button>
      </div>

      <div className={`border shadow-sm overflow-hidden ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#413f6e] text-white">
              <tr>
                <th className="px-4 py-3 w-10 text-center"><input type="checkbox" className="border-gray-400 rounded-sm" /></th>
                <th className="px-4 py-3 font-medium">{isBM ? "Kod e-Invois..." : "e-Invoice Code..."}</th>
                <th className="px-4 py-3 font-medium flex items-center">{isBM ? "Terakhir Diubah Suai" : "Last Modified"} <span className="ml-1">↓</span></th>
                <th className="px-4 py-3 font-medium">{isBM ? "Jenis / Versi" : "Type / Version"}</th>
                <th className="px-4 py-3 font-medium">{isBM ? "Nama Pembekal / TIN" : "Supplier Name / TIN"}</th>
                <th className="px-4 py-3 font-medium">{isBM ? "Nama Pembeli / TIN" : "Buyer Name / TIN"}</th>
                <th className="px-4 py-3 font-medium">{isBM ? "Jumlah Amaun..." : "Total Amount ..."}</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">{isBM ? "Ralat" : "Error"}</th>
              </tr>
            </thead>
            <tbody>
              {mockDrafts.map((draft, idx) => (
                <tr key={idx} className={`border-b transition-colors ${theme === "dark" ? "border-[#3b3a39] hover:bg-[#323130]" : "border-[#edebe9] hover:bg-[#f3f2f1]"}`}>
                  <td className="px-4 py-2.5 text-center"><input type="checkbox" className="border-gray-300 rounded-sm" /></td>
                  <td className="px-4 py-2.5 font-medium text-[#0078d4]">{draft.code}</td>
                  <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{draft.lastModified}</td>
                  <td className="px-4 py-2.5">{draft.type}</td>
                  <td className="px-4 py-2.5">{draft.supplier}</td>
                  <td className="px-4 py-2.5">{draft.buyer}</td>
                  <td className="px-4 py-2.5 font-semibold">RM {draft.amount}</td>
                  <td className="px-4 py-2.5 text-[#107c41] font-medium">
                    {isBM ? "Sedia untuk diserahkan" : "Ready for submission"}
                  </td>
                  <td className="px-4 py-2.5 text-rose-600 font-medium">{draft.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-[500px] shadow-2xl rounded-lg overflow-hidden animate-in zoom-in-95 ${theme === "dark" ? "bg-[#201f1e] text-[#f3f2f1] border border-[#3b3a39]" : "bg-white text-[#323130] border border-[#edebe9]"}`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${theme === "dark" ? "border-[#3b3a39]" : "border-[#edebe9]"}`}>
              <h2 className="text-[18px] font-semibold">{isBM ? "Muat Naik Kelompok" : "Batch Upload"}</h2>
              <button onClick={() => setIsModalOpen(false)} className={`p-1 rounded transition-colors ${theme === "dark" ? "hover:bg-[#323130]" : "hover:bg-gray-100"}`}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="px-6 py-4 text-[14px] space-y-4">
              <div className="p-6 text-center">
                {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-[#0078d4] animate-spin mb-3" />
                    <p>{isBM ? "Memproses Fail..." : "Processing File..."}</p>
                  </div>
                ) : (
                  <>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".xlsx,.xml,.csv,.pdf" />
                    <button onClick={handleUploadClick} className="bg-[#0078d4] text-white px-4 py-2 rounded flex items-center mx-auto">
                      <UploadCloud className="w-4 h-4 mr-2" /> {isBM ? "Pilih Fail" : "Choose File"}
                    </button>
                  </>
                )}
              </div>

              <div className={`pt-4 border-t ${theme === "dark" ? "border-[#3b3a39]" : "border-[#edebe9]"}`}>
                <p className={`text-[12px] leading-relaxed mb-4 ${theme === "dark" ? "text-[#c8c6c4]" : "text-[#605e5c]"}`}>
                  <br/><br/>
                  {isBM ? "Jumlah maksimum dokumen dalam fail Excel tidak boleh melebihi " : "The maximum number of documents in the Excel file should not exceed "}
                  <span className="font-bold">{isBM ? " 100 dokumen setiap fail dan saiz keseluruhan tidak melebihi 25 MB." : " 100 documents per file and total size should not exceed 25 MB."}</span>
                </p>
                
                <p className={`text-[12px] font-bold ${theme === "dark" ? "text-[#ff99a4]" : "text-[#a80000]"}`}>
                  {isBM 
                    ? "Penting : Sekiranya pembayar cukai menghadapi sebarang masalah semasa Muat Naik Kelompok, sila muat turun semula dan gunakan templat Excel fail rasmi untuk tujuan penyerahan."
                    : "Important : Where taxpayer encounter any issues on the Batch Upload, please re-download and use the file Excel template for submission purpose."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
