import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">MyInvoisAI</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              Autonomous LHDN Phase 4 e-Invoicing compliance agent. Built for Malaysia&apos;s digital tax mandate.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Navigate</h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 text-sm transition-colors">Home</Link></li>
              <li><Link href="/demo" className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 text-sm transition-colors">Agent Simulator</Link></li>
              <li><Link href="/integrations" className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 text-sm transition-colors">How It Works</Link></li>
              <li><Link href="/lhdn" className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 text-sm transition-colors">LHDN Portal</Link></li>
            </ul>
          </div>

          {/* Compliance */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Compliance</h4>
            <ul className="space-y-2.5">
              <li><span className="text-slate-500 dark:text-slate-400 text-sm">LHDN Phase 4 (2025–2026)</span></li>
              <li><span className="text-slate-500 dark:text-slate-400 text-sm">UBL 2.1 Standard</span></li>
              <li><span className="text-slate-500 dark:text-slate-400 text-sm">MyInvois API Compatible</span></li>
              <li><span className="text-slate-500 dark:text-slate-400 text-sm">SST &amp; GST Aligned</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            © {new Date().getFullYear()} MyInvoisAI · Built for NexHack 2026
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Made in Malaysia 🇲🇾</span>
            <span>·</span>
            <span>Powered by Google Gemini</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
