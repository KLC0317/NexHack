import fs from 'fs'
import path from 'path'

export interface Transaction {
  id: string
  created_at: string
  sender_name: string
  sender_phone: string
  sender_account: string
  recipient_name: string
  recipient_bank: string
  recipient_account: string
  amount: number
  device_id: string
  ip_address: string
  location: string
  status: 'Approved' | 'Hold 24h' | 'Blocked' | 'Pending Analysis'
  risk_score: number
  is_anomaly: boolean
  scenario_trigger: 'Normal' | 'SIM Swap' | 'Micro-Probing' | 'Mule Match' | string | null
}

export interface AgentLog {
  id: string
  transaction_id: string
  created_at: string
  agent_name: string
  status: 'Started' | 'Processing' | 'Completed' | 'Failed'
  action_taken: string
  confidence_score: number | null
  raw_payload: any
}

export interface ComplianceReport {
  id: string
  transaction_id: string
  created_at: string
  pdf_url: string | null
  report_markdown: string
  fi_duties_checked: Record<string, boolean>
  is_defensible: boolean
}

interface DB {
  transactions: Transaction[]
  agent_logs: AgentLog[]
  compliance_reports: ComplianceReport[]
}

const dbPath = path.join(process.cwd(), 'lib', 'mockDb.json')

function readDb(): DB {
  try {
    if (!fs.existsSync(dbPath)) {
      const initialDb: DB = { transactions: [], agent_logs: [], compliance_reports: [] }
      fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2))
      return initialDb
    }
    const data = fs.readFileSync(dbPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Failed to read mockDb.json', error)
    return { transactions: [], agent_logs: [], compliance_reports: [] }
  }
}

function writeDb(db: DB) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
  } catch (error) {
    console.error('Failed to write mockDb.json', error)
  }
}

export const mockDb = {
  getTransactions(): Transaction[] {
    const db = readDb()
    return db.transactions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  getTransaction(id: string): Transaction | undefined {
    const db = readDb()
    return db.transactions.find(t => t.id === id)
  },

  addTransaction(tx: Omit<Transaction, 'id' | 'created_at'>): Transaction {
    const db = readDb()
    const newTx: Transaction = {
      ...tx,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      created_at: new Date().toISOString()
    }
    db.transactions.push(newTx)
    writeDb(db)
    return newTx
  },

  updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
    const db = readDb()
    const index = db.transactions.findIndex(t => t.id === id)
    if (index === -1) return null
    db.transactions[index] = { ...db.transactions[index], ...updates }
    writeDb(db)
    return db.transactions[index]
  },

  getLogs(transactionId: string): AgentLog[] {
    const db = readDb()
    return db.agent_logs
      .filter(l => l.transaction_id === transactionId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  },

  addLog(log: Omit<AgentLog, 'id' | 'created_at'>): AgentLog {
    const db = readDb()
    const newLog: AgentLog = {
      ...log,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      created_at: new Date().toISOString()
    }
    db.agent_logs.push(newLog)
    writeDb(db)
    return newLog
  },

  getReport(transactionId: string): ComplianceReport | undefined {
    const db = readDb()
    return db.compliance_reports.find(r => r.transaction_id === transactionId)
  },

  addReport(report: Omit<ComplianceReport, 'id' | 'created_at'>): ComplianceReport {
    const db = readDb()
    const newReport: ComplianceReport = {
      ...report,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      created_at: new Date().toISOString()
    }
    db.compliance_reports.push(newReport)
    writeDb(db)
    return newReport
  },

  clearAll() {
    writeDb({ transactions: [], agent_logs: [], compliance_reports: [] })
  }
}
