import { useState, useRef } from "react";
import { FileText, UploadCloud, Trash2, PenTool, X, Download, Loader2, Play } from "lucide-react";

export function SubmissionsView({ theme, onBatchUpload }: { theme: "light" | "dark", onBatchUpload?: (docs: any[]) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const mockDrafts = Array(10).fill({
    code: "",
    lastModified: "",
    type: "",
    supplier: "",
    buyer: "",
    amount: "",
    status: "Ready for submission",
    error: ""
  });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-light mb-4">Submissions</h1>
        <div className={`flex items-center border-b ${theme === "dark" ? "border-[#3b3a39]" : "border-[#edebe9]"}`}>
          <span className={`text-[14px] mr-4 mb-2 ${theme === "dark" ? "text-[#a19f9d]" : "text-[#605e5c]"}`}>Or continue from:</span>
          <button className="text-[14px] font-semibold text-[#0078d4] border-b-2 border-[#0078d4] pb-2 px-2 flex items-center">
            <FileText className="w-4 h-4 mr-1.5" /> Drafts
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-4 space-x-2">
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center px-4 py-1.5 border text-[14px] font-medium rounded shadow-sm transition-colors ${theme === "dark" ? "bg-[#323130] border-[#3b3a39] text-white hover:bg-[#201f1e]" : "bg-white border-[#8a8886] text-[#323130] hover:bg-[#f3f2f1]"}`}
        >
          <UploadCloud className="w-4 h-4 mr-2" /> Batch Upload
        </button>
        <button className={`flex items-center px-4 py-1.5 border text-[14px] font-medium rounded shadow-sm opacity-50 cursor-not-allowed ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39] text-[#a19f9d]" : "bg-[#f3f2f1] border-[#8a8886] text-[#a19f9d]"}`} disabled>
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </button>
        <button className={`flex items-center px-4 py-1.5 border text-[14px] font-medium rounded shadow-sm opacity-50 cursor-not-allowed ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39] text-[#a19f9d]" : "bg-[#f3f2f1] border-[#8a8886] text-[#a19f9d]"}`} disabled>
          <PenTool className="w-4 h-4 mr-2" /> Sign & Submit
        </button>
      </div>

      <div className={`border shadow-sm overflow-hidden ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#413f6e] text-white">
              <tr>
                <th className="px-4 py-3 w-10 text-center"><input type="checkbox" className="border-gray-400 rounded-sm" /></th>
                <th className="px-4 py-3 font-medium">e-Invoice Code...</th>
                <th className="px-4 py-3 font-medium flex items-center">Last Modified <span className="ml-1">↓</span></th>
                <th className="px-4 py-3 font-medium">Type / Version</th>
                <th className="px-4 py-3 font-medium">Supplier Name / TIN</th>
                <th className="px-4 py-3 font-medium">Buyer Name / TIN</th>
                <th className="px-4 py-3 font-medium">Total Amount ...</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Error</th>
              </tr>
            </thead>
            <tbody>
              {mockDrafts.map((draft, idx) => (
                <tr key={idx} className={`border-b transition-colors ${theme === "dark" ? "border-[#3b3a39] hover:bg-[#323130]" : "border-[#edebe9] hover:bg-[#f3f2f1]"}`}>
                  <td className="px-4 py-2.5 text-center"><input type="checkbox" className="border-gray-300 rounded-sm" /></td>
                  <td className="px-4 py-2.5"></td>
                  <td className="px-4 py-2.5"></td>
                  <td className="px-4 py-2.5"></td>
                  <td className="px-4 py-2.5"></td>
                  <td className="px-4 py-2.5"></td>
                  <td className="px-4 py-2.5"></td>
                  <td className="px-4 py-2.5 text-[#107c41] font-medium">Ready for submission</td>
                  <td className="px-4 py-2.5"></td>
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
              <h2 className="text-[18px] font-semibold">Batch Upload</h2>
              <button onClick={() => setIsModalOpen(false)} className={`p-1 rounded transition-colors ${theme === "dark" ? "hover:bg-[#323130]" : "hover:bg-gray-100"}`}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="px-6 py-4 text-[14px] space-y-4">
              <div className="p-6 text-center">
                {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-[#0078d4] animate-spin mb-3" />
                    <p>Processing File...</p>
                  </div>
                ) : (
                  <>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".xlsx,.xml,.csv,.pdf" />
                    <button onClick={handleUploadClick} className="bg-[#0078d4] text-white px-4 py-2 rounded flex items-center mx-auto">
                      <UploadCloud className="w-4 h-4 mr-2" /> Choose File
                    </button>
                  </>
                )}
              </div>

              <div className={`pt-4 border-t ${theme === "dark" ? "border-[#3b3a39]" : "border-[#edebe9]"}`}>
                <p className={`text-[12px] leading-relaxed mb-4 ${theme === "dark" ? "text-[#c8c6c4]" : "text-[#605e5c]"}`}>
                  <br/><br/>
                  The maximum number of documents in the Excel file should not exceed 
                  <span className="font-bold"> 100 documents per file and total size should not exceed 25 MB.</span>
                </p>
                
                <p className={`text-[12px] font-bold ${theme === "dark" ? "text-[#ff99a4]" : "text-[#a80000]"}`}>
                  Important : Where taxpayer encounter any issues on the Batch Upload, please re-download and use the file Excel template for submission purpose.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
