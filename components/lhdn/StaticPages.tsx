import { BookOpen, FileText, ShieldCheck, Info } from "lucide-react";

export function StaticPages({ type, theme }: { type: string, theme: "light" | "dark" }) {
  const contentMap: Record<string, { title: string, icon: any, content: React.ReactNode }> = {
    "User Guide": {
      title: "User Guide",
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <p>Welcome to the MyInvois Portal User Guide. This guide provides comprehensive instructions on how to navigate and utilize the features available in the portal.</p>
          <h3 className="font-semibold text-lg mt-6">1. Getting Started</h3>
          <p>Learn how to manage your profile, add representatives, and configure your ERP system.</p>
          <h3 className="font-semibold text-lg mt-6">2. Issuing Documents</h3>
          <p>Step-by-step instructions for creating Invoices, Credit Notes, Debit Notes, and Refund Notes.</p>
          <h3 className="font-semibold text-lg mt-6">3. Batch Upload</h3>
          <p>How to use the Batch Upload feature to submit up to 100 documents at once via Excel template.</p>
        </div>
      )
    },
    "Terms & Conditions": {
      title: "Terms & Conditions",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p>By using the MyInvois Portal, you agree to comply with the rules and regulations set forth by Lembaga Hasil Dalam Negeri Malaysia (LHDNM).</p>
          <p>Access to the portal is granted only to authorized personnel. Any unauthorized access or misuse of the system is strictly prohibited and may result in legal action.</p>
        </div>
      )
    },
    "Policies": {
      title: "Policies",
      icon: ShieldCheck,
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Privacy Policy</h3>
          <p>LHDNM is committed to protecting the confidentiality and security of all data submitted through the MyInvois Portal.</p>
          <h3 className="font-semibold text-lg mt-4">Data Retention</h3>
          <p>e-Invoices validated by the system are retained in accordance with the statutory requirements defined by Malaysian tax laws.</p>
        </div>
      )
    },
    "About": {
      title: "About",
      icon: Info,
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium">MyInvois Portal v1.4.2</p>
          <p>The MyInvois Portal is the official platform provided by Lembaga Hasil Dalam Negeri Malaysia (LHDNM) to facilitate the implementation of e-Invoicing in Malaysia.</p>
          <p className="mt-8 text-sm opacity-70">© 2026 Lembaga Hasil Dalam Negeri Malaysia. All rights reserved.</p>
        </div>
      )
    }
  };

  const { title, icon: Icon, content } = contentMap[type] || contentMap["User Guide"];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 max-w-4xl">
      <div className="flex items-center mb-6 border-b pb-4 dark:border-[#3b3a39] border-[#edebe9]">
        <div className={`p-3 rounded-xl mr-4 ${theme === "dark" ? "bg-[#323130] text-[#c8c6c4]" : "bg-[#f3f2f1] text-[#605e5c]"}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-light">{title}</h1>
      </div>
      
      <div className={`p-8 rounded-xl border shadow-sm leading-relaxed ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39] text-[#c8c6c4]" : "bg-white border-[#edebe9] text-[#323130]"}`}>
        {content}
      </div>
    </div>
  );
}
