import { Bell, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

export function NotificationsView({ theme }: { theme: "light" | "dark" }) {
  const notifications = [
    { type: "error", title: "API Quota Warning", message: "You have reached 90% of your daily API validation limit.", time: "1 hour ago" },
    { type: "info", title: "Scheduled Maintenance", message: "MyInvois Portal will undergo scheduled maintenance on 25 June 2026 from 00:00 to 04:00 (GMT+8).", time: "1 day ago" },
    { type: "success", title: "Batch Upload Successful", message: "BatchSubmission-v2.xlsx has been successfully processed. 100/100 documents validated.", time: "2 days ago" },
    { type: "error", title: "Document Rejected", message: "Document INV-2026-003 was rejected due to: Invalid MSIC Code.", time: "2 days ago" },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light">Notifications</h1>
        <button className="text-sm font-medium text-[#0078d4] hover:underline">Mark all as read</button>
      </div>

      <div className={`rounded-xl border shadow-sm overflow-hidden ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
        {notifications.map((notif, idx) => (
          <div key={idx} className={`p-4 flex items-start border-b last:border-0 ${theme === "dark" ? "border-[#3b3a39] hover:bg-[#323130]" : "border-[#edebe9] hover:bg-[#f3f2f1]"}`}>
            <div className={`p-2 rounded-full mr-4 shrink-0 ${
              notif.type === 'error' ? 'bg-red-100 text-[#a80000] dark:bg-[#3b0a0a]' :
              notif.type === 'success' ? 'bg-green-100 text-[#107c41] dark:bg-[#051e0f]' :
              'bg-blue-100 text-[#0078d4] dark:bg-[#00245b]'
            }`}>
              {notif.type === 'error' && <AlertTriangle className="w-5 h-5" />}
              {notif.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {notif.type === 'info' && <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-sm">{notif.title}</h3>
                <span className={`text-xs ${theme === "dark" ? "text-[#a19f9d]" : "text-[#605e5c]"}`}>{notif.time}</span>
              </div>
              <p className={`text-sm ${theme === "dark" ? "text-[#c8c6c4]" : "text-[#323130]"}`}>{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
