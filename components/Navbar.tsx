"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"

export function Navbar() {
  const { setTheme, theme } = useTheme()

  return (
    <nav className="font-ubuntu border-b border-slate-200 dark:border-slate-800/50 bg-[#F0F4F8]/80 dark:bg-slate-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#F0F4F8]/60 dark:supports-[backdrop-filter]:bg-slate-950/60 flex items-center justify-between px-6 py-4 sticky top-0 z-50 transition-colors">
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center space-x-3 group">
          <img src="/logo.png" alt="MyInvoisAI Logo" className="h-8 w-auto transition-transform group-hover:scale-105" />
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">MyInvoisAI</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">Home</Link>
          <Link href="/how-it-works" className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">How It Works</Link>
          <Link href="/demo" className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">Agent Simulator</Link>
          <Link href="/integrations" className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">Connect to LHDN</Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/lhdn" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">
            LHDN Portal
          </Link>
          <Link href="/demo" className="btn-premium-primary text-white text-sm font-medium px-4 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]">
            Get Started
          </Link>
        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full bg-slate-200/80 dark:bg-slate-700/80 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors border border-slate-300/50 dark:border-slate-600/50"
          aria-label="Toggle theme"
        >
          <Sun className="h-[1.1rem] w-[1.1rem] text-slate-700 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] text-slate-300 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" style={{ marginTop: '-1.1rem' }} />
          <span className="sr-only">Toggle theme</span>
        </button>
      </div>
    </nav>
  )
}
