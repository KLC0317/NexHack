import { LayoutTemplate, PlusCircle, Trash2, CheckCircle2 } from "lucide-react";

export function VisualTemplatesView({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light">Visual Templates</h1>
        <button className="px-4 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded-lg flex items-center font-medium shadow-sm transition-colors text-sm">
          <PlusCircle className="w-4 h-4 mr-2" /> Upload New Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Template 1 - Active */}
        <div className={`rounded-xl border shadow-sm overflow-hidden ${theme === "dark" ? "bg-[#201f1e] border-[#0078d4] ring-1 ring-[#0078d4]" : "bg-white border-[#0078d4] ring-1 ring-[#0078d4]"}`}>
          <div className="h-40 bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center border-b border-[#edebe9] dark:border-[#3b3a39]">
            <LayoutTemplate className="w-16 h-16 text-gray-400" />
            <div className="absolute top-2 right-2 bg-[#107c41] text-white text-xs px-2 py-1 rounded-full flex items-center font-medium shadow-sm">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Active
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg">Standard B2B Layout</h3>
            <p className={`text-sm mt-1 mb-4 ${theme === "dark" ? "text-[#a19f9d]" : "text-[#605e5c]"}`}>Default template for standard invoices and credit notes.</p>
            <div className="flex justify-between items-center text-sm">
              <span className={`text-xs ${theme === "dark" ? "text-[#a19f9d]" : "text-[#a19f9d]"}`}>Updated: 2026-05-10</span>
              <button className="text-[#0078d4] hover:underline font-medium">Preview</button>
            </div>
          </div>
        </div>

        {/* Template 2 */}
        <div className={`rounded-xl border shadow-sm overflow-hidden ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
          <div className="h-40 bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center border-b border-[#edebe9] dark:border-[#3b3a39]">
            <LayoutTemplate className="w-16 h-16 text-gray-400" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg">Retail Consumer Layout</h3>
            <p className={`text-sm mt-1 mb-4 ${theme === "dark" ? "text-[#a19f9d]" : "text-[#605e5c]"}`}>Simplified template optimized for B2C consumer receipts.</p>
            <div className="flex justify-between items-center text-sm">
              <span className={`text-xs ${theme === "dark" ? "text-[#a19f9d]" : "text-[#a19f9d]"}`}>Updated: 2026-06-01</span>
              <div className="flex space-x-3">
                <button className="text-[#0078d4] hover:underline font-medium">Set Active</button>
                <button className="text-[#a80000] hover:text-[#e81123]" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
