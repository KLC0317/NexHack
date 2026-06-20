import { User, Briefcase, FileText, Phone } from "lucide-react";

export function HomeView({ theme, onNavigate, language = "EN" }: { theme: "light" | "dark", onNavigate?: (tab: string) => void, language?: "EN" | "BM" }) {
  const isBM = language === "BM";
  
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
        <h1 className="text-3xl font-semibold text-[#3b43a8] mb-4">
          {isBM ? "Selamat Datang ke Portal MyInvois" : "Welcome to MyInvois Portal"}
        </h1>
        <p className={`text-[15px] leading-relaxed max-w-4xl ${theme === "dark" ? "text-[#c8c6c4]" : "text-gray-600"}`}>
          {isBM 
            ? "Portal MyInvois merupakan penyelesaian e-Invois percuma yang disediakan oleh HASiL. Platform ini direka untuk memudahkan pelaksanaan e-Invois bagi semua pembayar cukai. Boleh diakses melalui komputer dan komputer riba, portal ini membolehkan pengguna menguruskan e-Invois secara cekap dari mana-mana sahaja pada bila-bila masa."
            : "The MyInvois Portal is an e-Invoicing solution provided by HASiL at no charge. This platform is designed to facilitate the implementation of e-Invoicing for all persons. Accessible via computers and laptops, the portal enables users to manage e-Invoicing efficiently from anywhere and at any time."
          }
        </p>
      </div>
      
      <div className="w-full h-px bg-gray-200 dark:bg-[#3b3a39] mb-8" />

      {/* Quick Links Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">{isBM ? "Pautan Pantas" : "Quick Links"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div onClick={() => onNavigate && onNavigate("Home")} className={`flex flex-col text-center group cursor-pointer`}>
            <div className={`w-full aspect-[4/3] rounded-xl flex items-center justify-center mb-4 transition-colors ${theme === "dark" ? "bg-[#292b45] group-hover:bg-[#383a5e]" : "bg-[#f5f5f5] group-hover:bg-[#ebebeb]"}`}>
              <User className="w-10 h-10 text-gray-500 group-hover:text-[#3b43a8] transition-colors" />
            </div>
            <h3 className="font-semibold text-[15px] mb-2 text-left">{isBM ? "Urus Profil Anda" : "Manage your Profile"}</h3>
            <p className={`text-[13px] text-left leading-relaxed ${theme === "dark" ? "text-[#a19f9d]" : "text-gray-500"}`}>
              {isBM 
                ? "Lihat dan edit maklumat peribadi serta butiran notifikasi (cth: nama, jenis kad pengenalan, nombor kad pengenalan, e-mel)."
                : "View and edit personal information and notification details (e.g. name, ID type, ID number, notification e-mail)."
              }
            </p>
          </div>
          
          <div className={`flex flex-col text-center group cursor-pointer`}>
            <div className={`w-full aspect-[4/3] rounded-xl flex items-center justify-center mb-4 transition-colors ${theme === "dark" ? "bg-[#292b45] group-hover:bg-[#383a5e]" : "bg-[#f5f5f5] group-hover:bg-[#ebebeb]"}`}>
              <Briefcase className="w-10 h-10 text-gray-500 group-hover:text-[#3b43a8] transition-colors" />
            </div>
            <h3 className="font-semibold text-[15px] mb-2 text-left">{isBM ? "Urus Profil Pembayar Cukai" : "Manage Taxpayer Profile"}</h3>
            <p className={`text-[13px] text-left leading-relaxed ${theme === "dark" ? "text-[#a19f9d]" : "text-gray-500"}`}>
              {isBM 
                ? "Lihat dan kemas kini maklumat profil pembayar cukai serta daftarkan sistem ERP Enterprise anda."
                : "View and edit taxpayer information and register your Enterprise Resource Planning (ERP) system and obtain the..."
              }
            </p>
          </div>
          
          <div onClick={() => onNavigate && onNavigate("User Guide")} className={`flex flex-col text-center group cursor-pointer`}>
            <div className={`w-full aspect-[4/3] rounded-xl flex items-center justify-center mb-4 transition-colors ${theme === "dark" ? "bg-[#292b45] group-hover:bg-[#383a5e]" : "bg-[#f5f5f5] group-hover:bg-[#ebebeb]"}`}>
              <FileText className="w-10 h-10 text-gray-500 group-hover:text-[#3b43a8] transition-colors" />
            </div>
            <h3 className="font-semibold text-[15px] mb-2 text-left">{isBM ? "Panduan Pengguna Portal" : "MyInvois Portal User Guide"}</h3>
            <p className={`text-[13px] text-left leading-relaxed ${theme === "dark" ? "text-[#a19f9d]" : "text-gray-500"}`}>
              {isBM 
                ? "Panduan langkah demi langkah tentang cara menggunakan Portal MyInvois secara terperinci."
                : "Step-by-step guidance on how to use the MyInvois Portal."
              }
            </p>
          </div>
          
          <div className={`flex flex-col text-center group cursor-pointer`}>
            <div className={`w-full aspect-[4/3] rounded-xl flex items-center justify-center mb-4 transition-colors ${theme === "dark" ? "bg-[#292b45] group-hover:bg-[#383a5e]" : "bg-[#f5f5f5] group-hover:bg-[#ebebeb]"}`}>
              <Phone className="w-10 h-10 text-gray-500 group-hover:text-[#3b43a8] transition-colors" />
            </div>
            <h3 className="font-semibold text-[15px] mb-2 text-left">{isBM ? "Hubungi Kami" : "Contact Us"}</h3>
            <p className={`text-[13px] text-left leading-relaxed ${theme === "dark" ? "text-[#a19f9d]" : "text-gray-500"}`}>
              {isBM 
                ? "Hubungi pasukan sokongan kami untuk mendapatkan bantuan teknikal dan khidmat pelanggan."
                : "Reach out to our team for assistance and support."
              }
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
