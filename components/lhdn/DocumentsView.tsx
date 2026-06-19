import { Search, Filter, Download, FileText, CheckCircle2, AlertTriangle, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import type { LHDNDocument } from "../../app/lhdn/page";

export function DocumentsView({ theme, documents, onView, newestId }: { 
  theme: "light" | "dark"; 
  documents?: LHDNDocument[]; 
  onView?: (doc: LHDNDocument) => void;
  newestId?: string;
}) {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [glowingIds, setGlowingIds] = useState<Set<string>>(new Set());
  const [prevCount, setPrevCount] = useState(0);

  const data = documents || [];

  // Track newly added documents and glow them
  useEffect(() => {
    if (data.length > prevCount && prevCount > 0) {
      const newIds = data.slice(0, data.length - prevCount).map(d => d.id);
      setGlowingIds(prev => new Set([...prev, ...newIds]));
      // Remove glow after 6s
      setTimeout(() => {
        setGlowingIds(prev => {
          const next = new Set(prev);
          newIds.forEach(id => next.delete(id));
          return next;
        });
      }, 6000);
    }
    setPrevCount(data.length);
  }, [data.length]);

  const handleDownload = (doc: LHDNDocument) => {
    alert(`Downloading ${doc.code} as PDF...`);
  };

  // Apply filters
  const filtered = data.filter(doc => {
    const matchesTab = activeTab === "All" || doc.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      doc.code.toLowerCase().includes(q) || 
      doc.supplier?.toLowerCase().includes(q) || 
      doc.buyer?.toLowerCase().includes(q) ||
      doc.uuid?.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const tabCounts: Record<string, number> = {
    All: data.length,
    Valid: data.filter(d => d.status === "Valid").length,
    Invalid: data.filter(d => d.status === "Invalid").length,
    Cancelled: data.filter(d => d.status === "Cancelled").length,
  };

  const cardBg = theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]";
  const inputBg = theme === "dark" ? "bg-[#323130] border-[#3b3a39] text-white" : "bg-white border-[#edebe9]";

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light">Documents Directory</h1>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${theme === "dark" ? "bg-[#3b43a8]/30 text-[#8b92e8]" : "bg-blue-50 text-[#0078d4]"}`}>
            {filtered.length} documents
          </span>
        </div>
      </div>

      <div className={`p-5 rounded-xl border shadow-sm mb-6 ${cardBg}`}>
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex space-x-1 border-b border-[#edebe9] dark:border-[#3b3a39] w-full md:w-auto">
            {["All", "Valid", "Invalid", "Cancelled"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors relative ${
                  activeTab === tab
                    ? "border-[#0078d4] text-[#0078d4]"
                    : "border-transparent hover:text-[#0078d4] text-[#605e5c] dark:text-[#a19f9d]"
                }`}
              >
                {tab}
                {tabCounts[tab] > 0 && (
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab ? "bg-[#0078d4] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>
                    {tabCounts[tab]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex space-x-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search ID, TIN, Supplier..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-lg border text-sm outline-none transition-shadow focus:ring-2 focus:ring-[#0078d4]/20 focus:border-[#0078d4] ${inputBg}`}
              />
            </div>
            <button className={`p-2 rounded-lg border transition-colors ${theme === "dark" ? "border-[#3b3a39] hover:bg-[#323130]" : "border-[#edebe9] hover:bg-[#f3f2f1]"}`}>
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`text-xs uppercase border-b ${theme === "dark" ? "text-[#a19f9d] border-[#3b3a39]" : "text-[#605e5c] border-[#edebe9]"}`}>
              <tr>
                <th className="px-4 py-3 font-medium">Invoice ID</th>
                <th className="px-4 py-3 font-medium">Supplier</th>
                <th className="px-4 py-3 font-medium">Buyer</th>
                <th className="px-4 py-3 font-medium">Issue Date</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                    <p className={`text-sm font-medium ${theme === "dark" ? "text-[#a19f9d]" : "text-[#605e5c]"}`}>
                      {searchQuery ? `No results for "${searchQuery}"` : `No ${activeTab.toLowerCase()} documents`}
                    </p>
                  </td>
                </tr>
              ) : filtered.map((doc, idx) => {
                const isNew = glowingIds.has(doc.id);
                const isNewest = doc.id === newestId;
                return (
                  <tr
                    key={doc.id || idx}
                    onClick={() => onView && onView(doc)}
                    className={`border-b cursor-pointer transition-all duration-300 group relative ${
                      theme === "dark" ? "border-[#3b3a39]" : "border-[#edebe9]"
                    } ${
                      isNew || isNewest
                        ? "bg-[#eef6ff] dark:bg-[#1e2a3a] shadow-[0_0_0_2px_rgba(0,120,212,0.35)] shadow-inner"
                        : theme === "dark" ? "hover:bg-[#323130]" : "hover:bg-blue-50/60"
                    }`}
                    style={isNew || isNewest ? {
                      animation: "glowRow 2.5s ease-in-out infinite alternate",
                    } : undefined}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* Glowing "click me" indicator */}
                        <div className={`relative flex-shrink-0 ${isNew || isNewest ? "block" : "hidden group-hover:block"}`}>
                          <span className="w-2 h-2 rounded-full bg-[#0078d4] block" />
                          <span className="absolute inset-0 w-2 h-2 rounded-full bg-[#0078d4] animate-ping opacity-75" />
                        </div>
                        <span className="font-medium text-[#0078d4] hover:underline">{doc.code}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{doc.supplier}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{doc.buyer}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{doc.issued || doc.date}</td>
                    <td className="px-4 py-3 font-semibold">RM {doc.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        doc.status === "Valid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : doc.status === "Cancelled"
                          ? "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {doc.status === "Valid" ? "✓ " : doc.status === "Invalid" ? "✕ " : ""}{doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={e => { e.stopPropagation(); onView && onView(doc); }}
                        className="p-1.5 hover:bg-[#0078d4]/10 rounded transition-colors"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4 text-[#0078d4]" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleDownload(doc); }}
                        className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors ml-1"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-[#605e5c]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`flex items-center justify-between pt-4 mt-4 border-t ${theme === "dark" ? "border-[#3b3a39]" : "border-[#edebe9]"}`}>
          <div className={`text-sm ${theme === "dark" ? "text-[#a19f9d]" : "text-[#605e5c]"}`}>
            Showing {filtered.length} of {data.length} entries
          </div>
        </div>
      </div>

      {/* Inline glow animation */}
      <style>{`
        @keyframes glowRow {
          from { box-shadow: 0 0 0 2px rgba(0,120,212,0.25), 0 0 8px rgba(0,120,212,0.1); }
          to   { box-shadow: 0 0 0 2px rgba(0,120,212,0.55), 0 0 18px rgba(0,120,212,0.25); }
        }
      `}</style>
    </div>
  );
}
