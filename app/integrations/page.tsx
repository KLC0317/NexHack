"use client";

import { useState } from "react";
import { Server, Key, Shield, CheckCircle2, AlertCircle, Save, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function IntegrationsPage() {
  const [env, setEnv] = useState<"sandbox" | "production">("sandbox");
  const [clientId, setClientId] = useState("");
  const [clientSecret1, setClientSecret1] = useState("");
  const [clientSecret2, setClientSecret2] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleTestConnection = () => {
    if (!clientId || (!clientSecret1 && !clientSecret2)) return;
    
    setIsTesting(true);
    setStatus("idle");
    
    // Simulate API test
    setTimeout(() => {
      setIsTesting(false);
      setStatus("success");
    }, 1500);
  };

  return (
    <div className="font-ubuntu animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto py-24">
      
      <div className="mb-10 text-center">
        <h1 className="text-[44px] leading-[1.15] tracking-tight font-bold text-slate-900 dark:text-white mb-4">LHDN API Integration</h1>
        <p className="text-[20px] leading-[1.7] text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Connect MyInvoisAI directly to the LHDN MyInvois System using OAuth 2.0 Client Credentials. 
          You can obtain these credentials by registering an ERP on the MyInvois Portal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#F8FAFC]/90 dark:bg-slate-900/50 p-8 rounded-[24px] border border-[#E5EDF4]/60 dark:border-slate-800/50 shadow-md relative overflow-hidden backdrop-blur-md">
            
            {/* Background Glow */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center space-x-4 mb-8">
              <button 
                onClick={() => setEnv("sandbox")}
                className={`flex-1 py-3 px-4 rounded-[8px] font-medium transition-all ${env === "sandbox" ? "btn-candy-blue btn-glint text-candy-shadow text-white shadow-md" : "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"}`}
              >
                Sandbox Environment
              </button>
              <button 
                onClick={() => setEnv("production")}
                className={`flex-1 py-3 px-4 rounded-[8px] font-medium transition-all ${env === "production" ? "btn-candy-blue btn-glint text-candy-shadow text-white shadow-md" : "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"}`}
              >
                Production Environment
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[14px] font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                  <Server className="w-4 h-4 mr-2 text-sky-500" /> API Base URL
                </label>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-[8px] border border-slate-200 dark:border-slate-800 text-[14px] font-mono text-slate-500 dark:text-slate-400">
                  {env === "sandbox" ? "https://preprod-api.myinvois.hasil.gov.my" : "https://api.myinvois.hasil.gov.my"}
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                  <Key className="w-4 h-4 mr-2 text-sky-500" /> Client ID
                </label>
                <input 
                  type="text" 
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="e.g. 5d9b...a12c"
                  className="w-full px-4 py-[10px] bg-[#F0F4F8]/70 dark:bg-slate-950 rounded-[8px] border border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all text-slate-900 dark:text-white shadow-sm"
                />
              </div>
 
              <div>
                <label className="block text-[14px] font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-sky-500" /> Client Secret 1
                </label>
                <input 
                  type="password" 
                  value={clientSecret1}
                  onChange={(e) => setClientSecret1(e.target.value)}
                  placeholder="••••••••••••••••••••••••"
                  className="w-full px-4 py-[10px] bg-[#F0F4F8]/70 dark:bg-slate-950 rounded-[8px] border border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all text-slate-900 dark:text-white shadow-sm"
                />
              </div>
 
              <div>
                <label className="block text-[14px] font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-sky-500" /> Client Secret 2 (Optional Backup)
                </label>
                <input 
                  type="password" 
                  value={clientSecret2}
                  onChange={(e) => setClientSecret2(e.target.value)}
                  placeholder="••••••••••••••••••••••••"
                  className="w-full px-4 py-[10px] bg-[#F0F4F8]/70 dark:bg-slate-950 rounded-[8px] border border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all text-slate-900 dark:text-white shadow-sm"
                />
                <p className="text-[14px] text-slate-500 mt-2">Used as a fallback during secret rotation.</p>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              
              <div className="flex items-center">
                {status === "success" && (
                  <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-[14px] font-medium animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Connection Successful
                  </span>
                )}
                {status === "error" && (
                  <span className="flex items-center text-rose-600 dark:text-rose-400 text-[14px] font-medium animate-in fade-in">
                    <AlertCircle className="w-4 h-4 mr-2" /> Connection Failed
                  </span>
                )}
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={handleTestConnection}
                  disabled={isTesting || !clientId || (!clientSecret1 && !clientSecret2)}
                  className="px-5 py-2.5 rounded-[8px] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[14px] font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-xs"
                >
                  {isTesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Test Connection
                </button>
                <button 
                  className="px-6 py-2.5 rounded-[8px] btn-candy-blue btn-glint text-white text-candy-shadow text-[14px] font-medium transition-all flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Configuration
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Info & Help */}
        <div className="space-y-6">
          <div className="bg-[#E5EDF4]/40 dark:bg-slate-900/50 border border-[#E5EDF4]/60 dark:border-slate-800 rounded-[24px] p-6 relative overflow-hidden backdrop-blur-md shadow-md">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-[16px]">How to get API Keys?</h3>
            <ol className="list-decimal list-inside text-[14px] leading-[1.6] text-slate-700 dark:text-slate-400 space-y-3">
              <li>Log in to the LHDN MyInvois Portal.</li>
              <li>Navigate to your Taxpayer Profile.</li>
              <li>Go to Representatives and click <strong>Register ERP</strong>.</li>
              <li>Enter system details and click Generate.</li>
              <li>Copy the generated Client ID and Secrets.</li>
            </ol>
            <Link href="/lhdn" className="mt-6 flex items-center text-[14px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
              Go to Mock Portal <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
 
          <div className="bg-[#E5EDF4]/40 dark:bg-slate-900/50 border border-[#E5EDF4]/60 dark:border-slate-800 rounded-[24px] p-6 backdrop-blur-md shadow-md">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-[16px]">Security Notice</h3>
            <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-[1.6]">
              Your Client Secrets are encrypted at rest using AES-256. 
              MyInvoisAI uses these credentials exclusively to negotiate OAuth 2.0 Bearer tokens 
              with the LHDN Identity Service. Tokens are cached and rotated automatically.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
