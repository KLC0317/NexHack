import { User, Briefcase, FileText, Phone } from "lucide-react";

export function HomeView({ theme, onNavigate }: { theme: "light" | "dark", onNavigate?: (tab: string) => void }) {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 max-w-5xl">
      {/* Banner Image */}
      <div className="w-full h-64 bg-slate-200 rounded-xl overflow-hidden mb-8 relative">
        <img 
          src="/LHDN_building.jpg" 
          alt="LHDN Building" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent flex flex-col justify-center p-10">
          <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center p-4 mb-4">
             <img src="/LHDN_logo.png" className="w-full object-contain" alt="LHDN Logo" />
          </div>
        </div>
      </div>

      {/* Welcome Text */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[#3b43a8] mb-4">Welcome to MyInvois Portal</h1>
        <p className={`text-[15px] leading-relaxed max-w-4xl ${theme === "dark" ? "text-[#c8c6c4]" : "text-gray-600"}`}>
          The MyInvois Portal is an e-Invoicing solution provided by HASiL at no charge. This platform is designed to facilitate 
          the implementation of e-Invoicing for all persons. Accessible via computers and laptops, the portal enables users to 
          manage e-Invoicing efficiently from anywhere and at any time.
        </p>
      </div>
      
      <div className="w-full h-px bg-gray-200 dark:bg-[#3b3a39] mb-8" />

      {/* Quick Links Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div onClick={() => onNavigate && onNavigate("Home")} className={`flex flex-col text-center group cursor-pointer`}>
            <div className={`w-full aspect-[4/3] rounded-xl flex items-center justify-center mb-4 transition-colors ${theme === "dark" ? "bg-[#292b45] group-hover:bg-[#383a5e]" : "bg-[#f5f5f5] group-hover:bg-[#ebebeb]"}`}>
              <User className="w-10 h-10 text-gray-500 group-hover:text-[#3b43a8] transition-colors" />
            </div>
            <h3 className="font-semibold text-[15px] mb-2 text-left">Manage your Profile</h3>
            <p className={`text-[13px] text-left leading-relaxed ${theme === "dark" ? "text-[#a19f9d]" : "text-gray-500"}`}>
              View and edit personal information and notification details (e.g. name, ID type, ID number, notification e-mail).
            </p>
          </div>
          
          <div className={`flex flex-col text-center group cursor-pointer`}>
            <div className={`w-full aspect-[4/3] rounded-xl flex items-center justify-center mb-4 transition-colors ${theme === "dark" ? "bg-[#292b45] group-hover:bg-[#383a5e]" : "bg-[#f5f5f5] group-hover:bg-[#ebebeb]"}`}>
              <Briefcase className="w-10 h-10 text-gray-500 group-hover:text-[#3b43a8] transition-colors" />
            </div>
            <h3 className="font-semibold text-[15px] mb-2 text-left">Manage Taxpayer Profile</h3>
            <p className={`text-[13px] text-left leading-relaxed ${theme === "dark" ? "text-[#a19f9d]" : "text-gray-500"}`}>
              View and edit taxpayer information and register your Enterprise Resource Planning (ERP) system and obtain the...
            </p>
          </div>
          
          <div onClick={() => onNavigate && onNavigate("About")} className={`flex flex-col text-center group cursor-pointer`}>
            <div className={`w-full aspect-[4/3] rounded-xl flex items-center justify-center mb-4 transition-colors ${theme === "dark" ? "bg-[#292b45] group-hover:bg-[#383a5e]" : "bg-[#f5f5f5] group-hover:bg-[#ebebeb]"}`}>
              <FileText className="w-10 h-10 text-gray-500 group-hover:text-[#3b43a8] transition-colors" />
            </div>
            <h3 className="font-semibold text-[15px] mb-2 text-left">MyInvois Portal User Guide</h3>
            <p className={`text-[13px] text-left leading-relaxed ${theme === "dark" ? "text-[#a19f9d]" : "text-gray-500"}`}>
              Step-by-step guidance on how to use the MyInvois Portal.
            </p>
          </div>
          
          <div className={`flex flex-col text-center group cursor-pointer`}>
            <div className={`w-full aspect-[4/3] rounded-xl flex items-center justify-center mb-4 transition-colors ${theme === "dark" ? "bg-[#292b45] group-hover:bg-[#383a5e]" : "bg-[#f5f5f5] group-hover:bg-[#ebebeb]"}`}>
              <Phone className="w-10 h-10 text-gray-500 group-hover:text-[#3b43a8] transition-colors" />
            </div>
            <h3 className="font-semibold text-[15px] mb-2 text-left">Contact Us</h3>
            <p className={`text-[13px] text-left leading-relaxed ${theme === "dark" ? "text-[#a19f9d]" : "text-gray-500"}`}>
              Reach out to our team for assistance and support.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
