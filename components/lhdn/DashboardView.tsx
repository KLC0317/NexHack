import { Calendar, ChevronDown, ArrowUpCircle, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";

export function DashboardView({ theme, metrics, language = "EN" }: { theme: "light" | "dark", metrics?: any, language?: "EN" | "BM" }) {
  const [activeTab, setActiveTab] = useState<"Taxpayer" | "Intermediary">("Taxpayer");

  const data = metrics || { submitted: 0, validated: 0, rejected: 0, pending: 0 };
  const isBM = language === "BM";

  const getTranslatedTab = (tab: "Taxpayer" | "Intermediary") => {
    if (tab === "Taxpayer") return isBM ? "Pembayar Cukai" : "Taxpayer";
    return isBM ? "Perantara" : "Intermediary";
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center space-x-6 mb-8 border-b border-gray-200 dark:border-[#3b3a39]">
        <button 
          onClick={() => setActiveTab("Taxpayer")}
          className={`pb-3 text-[15px] font-medium transition-colors border-b-2 ${activeTab === "Taxpayer" ? "border-black text-black dark:border-white dark:text-white" : "border-transparent text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"}`}
        >
          {isBM ? "Pembayar Cukai" : "Taxpayer"}
        </button>
        <button 
          onClick={() => setActiveTab("Intermediary")}
          className={`pb-3 text-[15px] font-medium transition-colors border-b-2 ${activeTab === "Intermediary" ? "border-black text-black dark:border-white dark:text-white" : "border-transparent text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"}`}
        >
          {isBM ? "Perantara" : "Intermediary"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="flex items-center text-2xl font-light">
          <span className="text-gray-800 dark:text-gray-200">
            {isBM ? `Papan Pemuka ${getTranslatedTab(activeTab)}` : `${activeTab} Dashboard`}
          </span>
          <span className="mx-3 text-gray-300">|</span>
          <span className="text-[#3b43a8] flex items-center cursor-pointer">
            {isBM ? "Mei 2025" : "May 2025"}
            <Calendar className="w-5 h-5 ml-3 mr-1" />
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </span>
        </div>
      </div>

      {/* Main Metrics Boxes based on screenshot style */}
      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        
        {/* Submitted Documents Box */}
        <div className={`p-6 rounded-lg border-t-4 border-[#3b43a8] shadow-sm ${theme === "dark" ? "bg-[#201f1e] border-x border-b border-[#3b3a39]" : "bg-white border-x border-b border-[#edebe9]"}`}>
          <div className="flex items-center mb-4">
            <ArrowUpCircle className="w-5 h-5 text-[#3b43a8] mr-2" />
            <h3 className="text-[#3b43a8] text-sm font-semibold tracking-wide">
              {isBM ? "DOKUMEN DIHANTAR" : "SUBMITTED DOCUMENTS"}: {data.submitted.toLocaleString()}
            </h3>
          </div>
          <div className={`text-sm mb-4 ${theme === "dark" ? "text-[#a19f9d]" : "text-gray-600"}`}>
            {isBM ? "Dikeluarkan Sendiri" : "Self Issued"}: {(data.submitted - 54).toLocaleString()} / {isBM ? "Perantara" : "Intermediary"} : 54
          </div>
          <div className="w-full h-px bg-black dark:bg-white opacity-20" />
        </div>

        {/* Validated Documents Box */}
        <div className={`p-6 rounded-lg border-t-4 border-[#107c41] shadow-sm ${theme === "dark" ? "bg-[#201f1e] border-x border-b border-[#3b3a39]" : "bg-white border-x border-b border-[#edebe9]"}`}>
          <div className="flex items-center mb-4">
            <CheckCircle2 className="w-5 h-5 text-[#107c41] mr-2" />
            <h3 className="text-[#107c41] text-sm font-semibold tracking-wide">
              {isBM ? "DOKUMEN DISAHKAN" : "VALIDATED DOCUMENTS"}: {data.validated.toLocaleString()}
            </h3>
          </div>
          <div className={`text-sm mb-4 ${theme === "dark" ? "text-[#a19f9d]" : "text-gray-600"}`}>
            {isBM ? "Dikeluarkan Sendiri" : "Self Issued"}: {(data.validated - 53).toLocaleString()} / {isBM ? "Perantara" : "Intermediary"} : 53
          </div>
          <div className="w-full h-px bg-black dark:bg-white opacity-20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rejected Box */}
          <div className={`p-6 rounded-lg border-t-4 border-[#a80000] shadow-sm ${theme === "dark" ? "bg-[#201f1e] border-x border-b border-[#3b3a39]" : "bg-white border-x border-b border-[#edebe9]"}`}>
            <div className="flex items-center mb-4">
              <AlertCircle className="w-5 h-5 text-[#a80000] mr-2" />
              <h3 className="text-[#a80000] text-sm font-semibold tracking-wide">
                {isBM ? "DITOLAK" : "REJECTED"}: {data.rejected.toLocaleString()}
              </h3>
            </div>
            <div className={`text-sm mb-4 ${theme === "dark" ? "text-[#a19f9d]" : "text-gray-600"}`}>
              {isBM ? "Dikeluarkan Sendiri" : "Self Issued"}: {Math.max(0, data.rejected - 1).toLocaleString()} / {isBM ? "Perantara" : "Intermediary"} : {data.rejected > 0 ? 1 : 0}
            </div>
            <div className="w-full h-px bg-black dark:bg-white opacity-20" />
          </div>

          {/* Pending Box */}
          <div className={`p-6 rounded-lg border-t-4 border-[#ffb900] shadow-sm ${theme === "dark" ? "bg-[#201f1e] border-x border-b border-[#3b3a39]" : "bg-white border-x border-b border-[#edebe9]"}`}>
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-[#ffb900] mr-2" />
              <h3 className="text-[#ffb900] text-sm font-semibold tracking-wide">
                {isBM ? "TERTUNDA" : "PENDING"}: {data.pending.toLocaleString()}
              </h3>
            </div>
            <div className={`text-sm mb-4 ${theme === "dark" ? "text-[#a19f9d]" : "text-gray-600"}`}>
              {isBM ? "Dikeluarkan Sendiri" : "Self Issued"}: {data.pending.toLocaleString()} / {isBM ? "Perantara" : "Intermediary"} : 0
            </div>
            <div className="w-full h-px bg-black dark:bg-white opacity-20" />
          </div>
        </div>

      </div>
    </div>
  );
}
