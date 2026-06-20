"use client";

import { useState, useEffect } from "react";
import { 
  Home, 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  UploadCloud, 
  LayoutTemplate, 
  Bell, 
  BookOpen, 
  ShieldCheck, 
  Info,
  Menu,
  HelpCircle
} from "lucide-react";
import Link from "next/link";

// Import Views
import { HomeView } from "../../components/lhdn/HomeView";
import { DashboardView } from "../../components/lhdn/DashboardView";
import { NewDocumentView } from "../../components/lhdn/NewDocumentView";
import { DocumentsView } from "../../components/lhdn/DocumentsView";
import { SubmissionsView } from "../../components/lhdn/SubmissionsView";
import { VisualTemplatesView } from "../../components/lhdn/VisualTemplatesView";
import { NotificationsView } from "../../components/lhdn/NotificationsView";
import { StaticPages } from "../../components/lhdn/StaticPages";
import { InvoiceDetailView } from "../../components/lhdn/InvoiceDetailView";

export type LHDNDocument = {
  id: string;
  uuid: string;
  code: string;
  supplier: string;
  buyer: string;
  amount: string;
  issued: string;
  submitted: string;
  status: "Valid" | "Invalid" | "Cancelled";
  date?: string;
};

export default function LHDNPortalMock() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState<"EN" | "BM">("EN");
  const [activeTab, setActiveTab] = useState("Home");
  const [activeInvoice, setActiveInvoice] = useState<LHDNDocument | null>(null);
  const [newestId, setNewestId] = useState<string | undefined>(undefined);

  // Parse URL parameters to highlight the newly uploaded document
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const highlight = params.get("highlight");
      if (highlight) {
        setNewestId(highlight);
        setActiveTab("Documents");
        
        // Remove query parameters from address bar to keep URL clean
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
        
        // Clear glow after 6 seconds
        const timer = setTimeout(() => setNewestId(undefined), 6000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Global Mock State
  const [metrics, setMetrics] = useState({
    submitted: 1204,
    validated: 1195,
    rejected: 9,
    pending: 0
  });

  const [documents, setDocuments] = useState<LHDNDocument[]>([
    {
      id: "1",
      uuid: "067MK4HCR7JK6GE3YPYXS880",
      code: "23701915219",
      supplier: "Aisha S.",
      buyer: "ONE WORLD SDN. BHD",
      amount: "7,322.82",
      issued: "1/9/2025 11:02:00 PM",
      submitted: "1/9/2025 11:07:51 PM",
      status: "Valid"
    }
  ]);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const res = await fetch("/api/invoices");
        const data = await res.json();
        if (data && Array.isArray(data.invoices)) {
          const mapped: LHDNDocument[] = data.invoices.map((inv: any) => {
            const formattedDate = inv.lhdn_validation_date 
              ? new Date(inv.lhdn_validation_date).toLocaleString() 
              : new Date(inv.created_at).toLocaleString();
            return {
              id: inv.id,
              uuid: inv.id,
              code: inv.invoice_number,
              supplier: inv.supplier_name,
              buyer: inv.buyer_name,
              amount: parseFloat(inv.total_payable || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
              issued: formattedDate,
              submitted: formattedDate,
              status: inv.lhdn_status === "Validated" ? "Valid" : "Invalid",
              date: formattedDate
            };
          });
          
          const initialMock: LHDNDocument[] = [
            {
              id: "mock-1",
              uuid: "067MK4HCR7JK6GE3YPYXS880",
              code: "23701915219",
              supplier: "Aisha S.",
              buyer: "ONE WORLD SDN. BHD",
              amount: "7,322.82",
              issued: "1/9/2025 11:02:00 PM",
              submitted: "1/9/2025 11:07:51 PM",
              status: "Valid"
            }
          ];
          
          const filteredMock = initialMock.filter(m => !mapped.some(mapDoc => mapDoc.code === m.code));
          setDocuments([...mapped, ...filteredMock]);
          
          const totalSubmitted = 1204 + mapped.length;
          const totalValidated = 1195 + mapped.filter(d => d.status === "Valid").length;
          const totalRejected = 9 + mapped.filter(d => d.status === "Invalid").length;
          
          setMetrics({
            submitted: totalSubmitted,
            validated: totalValidated,
            rejected: totalRejected,
            pending: 0
          });
        }
      } catch (err) {
        console.error("Failed to load dynamic invoices for portal:", err);
      }
    };
    
    loadInvoices();
  }, []);

  const handleNewSubmission = (doc: LHDNDocument) => {
    setDocuments(prev => [doc, ...prev]);
    setMetrics(prev => ({
      ...prev,
      submitted: prev.submitted + 1,
      validated: prev.validated + 1
    }));
    setNewestId(doc.id);
    setActiveTab("Documents");
    // Clear the glow after 6s
    setTimeout(() => setNewestId(undefined), 6000);
  };

  const handleBatchUpload = (docs: LHDNDocument[]) => {
    setDocuments(prev => [...docs, ...prev]);
    setMetrics(prev => ({
      ...prev,
      submitted: prev.submitted + docs.length,
      validated: prev.validated + docs.length
    }));
  };

  const sidebarItems = [
    { icon: Home, label: "Home" },
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: PlusCircle, label: "New Document" },
    { icon: FileText, label: "Documents" },
    { icon: UploadCloud, label: "Submissions" },
    { icon: LayoutTemplate, label: "Visual Templates" },
    { icon: Bell, label: "Notifications" },
    { icon: BookOpen, label: "User Guide" },
    { icon: FileText, label: "Terms & Conditions" },
    { icon: ShieldCheck, label: "Policies" },
    { icon: Info, label: "About" },
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case "Home": return <HomeView theme={theme} language={language} onNavigate={setActiveTab} />;
      case "Dashboard": return <DashboardView theme={theme} language={language} metrics={metrics} />;
      case "New Document": return <NewDocumentView theme={theme} language={language} onSubmit={handleNewSubmission} />;
      case "Documents": return <DocumentsView theme={theme} language={language} documents={documents} newestId={newestId} onView={(doc) => { setActiveInvoice(doc); setActiveTab("Invoice Detail"); }} />;
      case "Invoice Detail": return <InvoiceDetailView theme={theme} language={language} invoice={activeInvoice} onBack={() => setActiveTab("Documents")} />;
      case "Submissions": return <SubmissionsView theme={theme} language={language} onBatchUpload={handleBatchUpload} />;
      case "Visual Templates": return <VisualTemplatesView theme={theme} language={language} />;
      case "Notifications": return <NotificationsView theme={theme} language={language} />;
      case "User Guide":
      case "Terms & Conditions":
      case "Policies":
      case "About":
        return <StaticPages type={activeTab} theme={theme} language={language} />;
      default: return <HomeView theme={theme} language={language} />;
    }
  };

  const sidebarLabels: Record<"EN" | "BM", Record<string, string>> = {
    EN: {
      Home: "Home",
      Dashboard: "Dashboard",
      "New Document": "New Document",
      Documents: "Documents",
      Submissions: "Submissions",
      "Visual Templates": "Visual Templates",
      Notifications: "Notifications",
      "User Guide": "User Guide",
      "Terms & Conditions": "Terms & Conditions",
      Policies: "Policies",
      About: "About"
    },
    BM: {
      Home: "Utama",
      Dashboard: "Papan Pemuka",
      "New Document": "Dokumen Baru",
      Documents: "Dokumen",
      Submissions: "Penyerahan",
      "Visual Templates": "Templat Visual",
      Notifications: "Notifikasi",
      "User Guide": "Panduan Pengguna",
      "Terms & Conditions": "Terma & Syarat",
      Policies: "Polisi",
      About: "Perihal"
    }
  };

  return (
    <div className={`flex h-screen w-full font-sans ${theme === "dark" ? "bg-[#1b1a19] text-[#f3f2f1]" : "bg-[#f5f5f5] text-[#323130]"} fixed inset-0 z-[100]`}>
      
      {/* Sidebar */}
      <div className={`w-[240px] flex flex-col ${theme === "dark" ? "bg-[#292b45] border-[#3b3a39]" : "bg-[#292b45]"} text-white border-r-0`}>
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="space-y-0.5 mt-2">
            {sidebarItems.map((item, idx) => {
              const isActive = activeTab === item.label;
              const translatedLabel = sidebarLabels[language][item.label] || item.label;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(item.label)}
                  className={`w-full flex items-center px-6 py-3 text-[14px] transition-all relative group ${
                    isActive
                      ? "bg-[#383a5e] font-semibold border-l-4 border-[#5b64c8]"
                      : "hover:bg-[#383a5e]/60 border-l-4 border-transparent text-[#d1d2e3] cursor-pointer"
                  }`}
                  style={isActive ? {
                    boxShadow: "inset 4px 0 12px rgba(91,100,200,0.25), 0 0 20px rgba(91,100,200,0.1)"
                  } : undefined}
                >
                  {/* Active glow pulse dot */}
                  {isActive && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7b84e8] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5b64c8]" />
                      </span>
                    </span>
                  )}
                  <item.icon className={`w-4 h-4 mr-3 transition-colors ${isActive ? "text-white" : "text-[#d1d2e3] group-hover:text-white"}`} />
                  <span className={isActive ? "text-white" : "text-[#d1d2e3] group-hover:text-white"}>{translatedLabel}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className={`h-14 flex items-center justify-between px-6 ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9] shadow-sm"} border-b shrink-0 z-10`}>
          <div className="flex items-center">
            <Menu onClick={() => setActiveTab("Home")} className="w-5 h-5 mr-4 text-[#605e5c] cursor-pointer hover:text-[#3b43a8] transition-colors" />
            <img src="/LHDN_logo.png" className="w-8 h-8 object-contain mr-3" alt="LHDN" />
            <span className="text-[16px] text-slate-700 font-semibold">{language === "BM" ? "Portal MyInvois" : "MyInvois Portal"}</span>
          </div>
          <div className="flex items-center space-x-4 text-[14px]">
            {/* Theme Toggle */}
            <div className="flex items-center space-x-2">
              <span className={`text-[12px] ${theme === "light" ? "font-bold" : "text-[#605e5c]"}`}>{language === "BM" ? "Terang" : "Light"}</span>
              <button 
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className={`w-10 h-5 rounded-full relative flex items-center transition-colors ${theme === "dark" ? "bg-[#0078d4]" : "bg-[#605e5c]"}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute transition-all ${theme === "dark" ? "right-1" : "left-1"}`} />
              </button>
              <span className={`text-[12px] ${theme === "dark" ? "font-bold" : "text-[#605e5c]"}`}>{language === "BM" ? "Gelap" : "Dark"}</span>
            </div>
            
            <div className="w-px h-4 bg-gray-300 mx-2" />
            
            <button onClick={() => setActiveTab("User Guide")} className="flex items-center hover:text-[#0078d4] transition-colors"><HelpCircle className="w-4 h-4 mr-1" /> {language === "BM" ? "Soalan Lazim" : "FAQ"}</button>
            
            <div className="w-px h-4 bg-gray-300 mx-2" />
            
            <div className="flex space-x-2 font-medium">
              <button onClick={() => setLanguage("EN")} className={`${language === "EN" ? "text-[#0078d4]" : "text-[#605e5c]"}`}>EN</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => setLanguage("BM")} className={`${language === "BM" ? "text-[#0078d4]" : "text-[#605e5c]"}`}>BM</button>
            </div>
            
            <div className="w-px h-4 bg-gray-300 mx-3" />
            
            <button onClick={() => setActiveTab("Notifications")} className="relative hover:opacity-85 transition-opacity">
              <Bell className="w-5 h-5 text-[#3b43a8]" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
            
            <div className="flex items-center space-x-2 ml-4">
              <button 
                onClick={() => alert(language === "BM" ? "Log masuk sebagai: Pentadbir MyInvois (admin@myinvois.gov.my)" : "Logged in as: MyInvois Administrator (admin@myinvois.gov.my)")}
                className="w-8 h-8 rounded-full bg-[#3b43a8] text-white flex items-center justify-center font-medium text-sm shadow-md hover:bg-[#292b45] transition-colors"
              >
                M
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-auto p-8 relative">
          {renderActiveView()}
          
          <div className="flex justify-end mt-8">
             <Link href="/">
                <button className="text-sm text-[#0078d4] hover:underline flex items-center font-medium transition-all hover:translate-x-[-4px]">
                  ← {language === "BM" ? "Kembali ke Demo MyInvoisAI" : "Return to MyInvoisAI Demo"}
                </button>
             </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
