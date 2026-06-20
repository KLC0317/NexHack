import { useState } from "react";
import { FileText, ArrowRight, ArrowLeft, Check, Plus, Edit2, Info, Save, Send, Clock } from "lucide-react";
import type { LHDNDocument } from "../../app/lhdn/page";

export function NewDocumentView({ theme, onSubmit, language = "EN" }: { theme: "light" | "dark", onSubmit?: (doc: LHDNDocument) => void, language?: "EN" | "BM" }) {
  const [step, setStep] = useState(0); // 0 = initial, 1-5 = wizard steps
  const isBM = language === "BM";

  // Initial Step Form
  const [docType, setDocType] = useState("Invoice");
  const [docVersion, setDocVersion] = useState("v 1.1");
  const [tin, setTin] = useState("C884079020");
  const [lineItems, setLineItems] = useState([
    { id: 1, code: "022-Others", desc: "Bangkok 4 Days 3 Nights - Adult VIP", qty: 1.00, measure: "E48", total: 7312.82 }
  ]);

  const steps = [
    { id: 1, name: isBM ? "Maklumat Asas" : "Basic Information" },
    { id: 2, name: isBM ? "Pembekal Dan Pembeli" : "Supplier And Buyer" },
    { id: 3, name: isBM ? "Item Baris" : "Line Item" },
    { id: 4, name: isBM ? "Maklumat Tambahan" : "Additional Information" },
    { id: 5, name: isBM ? "Ringkasan Dan Serah" : "Summary And Submit" },
  ];

  const getTranslatedDocType = (type: string) => {
    if (type === "Invoice") return isBM ? "Invois" : "Invoice";
    if (type === "Credit Note") return isBM ? "Nota Kredit" : "Credit Note";
    if (type === "Debit Note") return isBM ? "Nota Debit" : "Debit Note";
    if (type === "Refund Note") return isBM ? "Nota Bayaran Balik" : "Refund Note";
    return type;
  };

  // Helper for Stepper UI
  const renderStepper = () => (
    <div className={`flex items-center space-x-1 p-2 rounded-full mb-8 ${theme === "dark" ? "bg-[#323130]" : "bg-[#f5f5f5]"}`}>
      {steps.map((s, idx) => {
        const isCompleted = step > s.id;
        const isActive = step === s.id;
        return (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isActive ? "bg-[#292b45] text-white" : 
              isCompleted ? "text-[#107c41]" : 
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>
              {isCompleted ? (
                <Check className="w-4 h-4 mr-2 text-[#107c41]" />
              ) : (
                <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs ${isActive ? "bg-white text-[#292b45]" : theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-300 text-gray-700"}`}>
                  {s.id}
                </span>
              )}
              {s.name}
            </div>
            {idx < steps.length - 1 && <span className="mx-1 text-gray-300"></span>}
          </div>
        );
      })}
    </div>
  );

  // --- Views ---

  if (step === 0) {
    return (
      <div className="animate-in fade-in duration-300 max-w-4xl">
        <div className="flex items-center border-b border-[#edebe9] dark:border-[#3b3a39] mb-8 pb-4">
          <FileText className="w-5 h-5 mr-2 text-gray-400" />
          <h1 className="text-xl font-medium">{isBM ? "Dokumen Baru" : "New Document"}</h1>
          <span className="mx-4 text-gray-300">|</span>
          <span className="text-sm text-gray-400">{isBM ? "Atau teruskan dari:" : "Or continue from:"}</span>
          <button className="text-sm text-[#3b43a8] font-medium ml-2 flex items-center">
            <FileText className="w-4 h-4 mr-1" /> {isBM ? "Draf" : "Drafts"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{isBM ? "Jenis Dokumen" : "Type of Document"}</label>
            <select 
              value={docType} onChange={e => setDocType(e.target.value)}
              className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}
            >
              <option value="Invoice">{isBM ? "Invois" : "Invoice"}</option>
              <option value="Credit Note">{isBM ? "Nota Kredit" : "Credit Note"}</option>
              <option value="Debit Note">{isBM ? "Nota Debit" : "Debit Note"}</option>
              <option value="Refund Note">{isBM ? "Nota Bayaran Balik" : "Refund Note"}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{isBM ? "Versi Dokumen" : "Document Version"}</label>
            <select 
              value={docVersion} onChange={e => setDocVersion(e.target.value)}
              className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}
            >
              <option>v 1.1</option>
              <option>v 1.0</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => setStep(1)}
          className="bg-[#292b45] hover:bg-[#1a1c30] text-white px-6 py-2 rounded flex items-center transition-colors shadow-sm"
        >
          {isBM ? "Mula" : "Start"} <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl">
      
      {/* Top Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">{getTranslatedDocType(docType)} | {docVersion}</h1>
          <p className="text-sm text-gray-500 mt-1">{isBM ? "Kod / Nombor e-Invois" : "e-Invoice Code / Number"}<br/>23701915219</p>
        </div>
        {renderStepper()}
      </div>

      <div className={`border rounded-lg shadow-sm ${theme === "dark" ? "bg-[#201f1e] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
        
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="p-8">
            <h2 className="text-lg font-semibold border-b-2 border-[#292b45] inline-block pb-1 mb-8">{isBM ? "Maklumat Asas" : "Basic Information"}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">{isBM ? "Kod / Nombor e-Invois" : "e-Invoice Code / Number"} <span className="text-red-500">*</span></label>
                  <button className="text-xs text-[#3b43a8] flex items-center"><Edit2 className="w-3 h-3 mr-1" /> {isBM ? "Atasi" : "Override"}</button>
                </div>
                <input type="text" value="23701915219" disabled className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-[#f5f5f5] border-[#edebe9]"}`} />
              </div>
              <div className="text-sm text-gray-500 self-center pt-6">
                {isBM ? "Kod / Nombor e-Invois boleh diedit mengikut organisasi anda sendiri. Atau ia boleh dijana secara automatik." : "e-Invoice Code / Number can be edited to align with your own organization. Or, it can be automatically generated."}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">{isBM ? "Tarikh dan Masa Dikeluarkan" : "Date and Time Issued"} <span className="text-red-500">*</span></label>
                  <button className="text-xs text-[#3b43a8] flex items-center"><Edit2 className="w-3 h-3 mr-1" /> {isBM ? "Atasi" : "Override"}</button>
                </div>
                <div className="flex space-x-4">
                  <input type="text" value="Auto" disabled className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-[#f5f5f5] border-[#edebe9]"}`} />
                  <input type="text" value="Auto" disabled className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-[#f5f5f5] border-[#edebe9]"}`} />
                </div>
              </div>
              <div className="text-sm text-gray-500 self-center pt-6">
                {isBM ? "Akan dijana secara automatik setelah dihantar, melainkan anda memilih tarikh tertentu secara manual" : "Will be automatically generated upon submission, unless you need a specific date manually picked"}
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">{isBM ? "Beritahu saya tentang dokumen ini" : "Notify me about this document"}</label>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-5 bg-gray-300 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                  </div>
                  <span className="text-sm">{isBM ? "Secara Peribadi di Web / Mudah Alih" : "Personally on Web / Mobile"}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 self-center pt-6">
                {isBM ? "Secara lalai anda dan pembayar cukai hanya akan menerima notifikasi seperti yang ditakrifkan dalam" : "By default you and taxpayer will receive only notifications as defined in"} <a href="#" className="text-[#3b43a8] underline">{isBM ? "Pilihan Pembayar Cukai" : "Taxpayer Preferences"}</a>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Supplier And Buyer */}
        {step === 2 && (
          <div className="p-8">
            <h2 className="text-lg font-semibold border-b-2 border-[#292b45] inline-block pb-1 mb-8">{isBM ? "Pembekal Dan Pembeli" : "Supplier And Buyer"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">{isBM ? "Nama" : "Name"}</label>
                <input type="text" value="Aisha S." disabled className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{isBM ? "Nombor Pengenalan Cukai (TIN)" : "Tax Identification Number (TIN)"}</label>
                <input type="text" value="IG228600000" disabled className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{isBM ? "Nombor Pendaftaran / Pengenalan / Pasport" : "Registration / Identification / Passport Number"}</label>
                <input type="text" value="980212049552" disabled className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{isBM ? "Kod MSIC" : "MSIC Code"} <span className="text-red-500">*</span></label>
                <select className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`}>
                  <option>00000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{isBM ? "Penerangan Aktiviti Perniagaan" : "Business Activity Description"} <span className="text-red-500">*</span></label>
                <input type="text" defaultValue={isBM ? "Tidak Berkenaan" : "Not Applicable"} className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{isBM ? "Nombor Pendaftaran SST" : "SST Registration Number"}</label>
                <input type="text" defaultValue="SST123456" className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`} />
              </div>
              
              <div className="md:col-span-2 my-4 border-t border-dashed border-gray-300 dark:border-gray-700 pt-4"><span className="text-sm font-semibold text-[#3b43a8]">{isBM ? "Butiran Pembeli" : "Buyer Details"}</span></div>

              <div>
                <label className="block text-sm font-medium mb-1">{isBM ? "Jenis ID" : "ID Type"} <span className="text-red-500">*</span></label>
                <input type="text" defaultValue={isBM ? "No. Pendaftaran Perniagaan" : "Business Registration No."} className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{isBM ? "Nombor Pendaftaran / Pengenalan" : "Registration / Identification Number"} <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="197601004256" className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center">{isBM ? "Nombor Pengenalan Cukai (TIN)" : "Tax Identification Number (TIN)"} <span className="text-red-500 mx-1">*</span> <Info className="w-3 h-3 text-gray-400"/></label>
                <div className="flex space-x-2">
                  <input type="text" value={tin} onChange={e => setTin(e.target.value)} className={`flex-1 p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`} />
                  <button onClick={() => setTin("")} className="bg-[#292b45] hover:bg-[#1a1c30] text-white px-4 rounded text-sm transition-colors">{isBM ? "Padam" : "Clear"}</button>
                </div>
              </div>
              <div />

              <div>
                <label className="block text-sm font-medium mb-1">{isBM ? "Nama" : "Name"} <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="ONE WORLD SDN. BHD." className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{isBM ? "Nombor Pendaftaran SST" : "SST Registration Number"} <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="SST012345678" className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{isBM ? "E-mel" : "E-mail"}</label>
                <input type="text" className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{isBM ? "Nombor Telefon" : "Telephone Number"} <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="+60123123123" className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`} />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">{isBM ? "Alamat Baris 1" : "Address Line 1"} <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="A22, 80F, KLCC TOWER 1" className={`w-full p-2.5 rounded border outline-none ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`} />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Line Item */}
        {step === 3 && (
          <div className="p-8">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
               <h2 className="text-lg font-semibold border-b-2 border-[#292b45] inline-block mb-[-18px]">{isBM ? "Item Baris" : "Line Item"}</h2>
               <div className="flex items-center space-x-6 text-sm">
                 <div className="flex items-center">
                   <span className="text-gray-500 mr-2">{isBM ? "Mata Wang" : "Currency"}</span>
                   <span className={`border px-2 py-1 rounded-l bg-gray-100 dark:bg-gray-800 dark:border-gray-700`}>RM</span>
                   <select className={`border-y border-r px-2 py-1 rounded-r outline-none dark:bg-[#323130] dark:border-gray-700`}>
                     <option>{isBM ? "Ringgit Malaysia" : "Malaysian Ringgit"}</option>
                   </select>
                 </div>
                 <div className="flex items-center">
                   <span className="text-gray-500 mr-2">{isBM ? "Kadar Pertukaran" : "Exchange Rate"}</span>
                   <span className={`border px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700`}>RM</span>
                   <span className="ml-2 font-medium">0.00</span>
                 </div>
                 <button className="text-[#3b43a8] flex items-center hover:underline"><FileText className="w-4 h-4 mr-1"/> {isBM ? "Paparan Penuh" : "Full View"}</button>
                 <button className="text-[#3b43a8] flex items-center hover:underline"><Clock className="w-4 h-4 mr-1"/> {isBM ? "Pilih Item Sebelumnya" : "Select Previous Items"}</button>
                 <button onClick={() => setLineItems([...lineItems, { id: Date.now(), code: "022-Others", desc: "New Item Service", qty: 1, measure: "E48", total: 100 }])} className="text-[#3b43a8] flex items-center hover:underline font-semibold"><Plus className="w-4 h-4 mr-1"/> {isBM ? "Tambah Baris" : "Add Line"}</button>
               </div>
            </div>

            <table className="w-full text-sm text-left mb-8">
              <thead className="bg-[#292b45] text-white">
                <tr>
                  <th className="px-4 py-3 font-medium">{isBM ? "Kod Klasifikasi" : "Classification Codes"}</th>
                  <th className="px-4 py-3 font-medium">{isBM ? "Penerangan Produk atau Perkhidmatan" : "Description of Product or Service"}</th>
                  <th className="px-4 py-3 font-medium">{isBM ? "Kuantiti" : "Quantity"}</th>
                  <th className="px-4 py-3 font-medium">{isBM ? "Ukuran" : "Measurement"}</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map(item => (
                  <tr key={item.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-4 flex items-center">{item.code} <Info className="w-3 h-3 ml-2 text-gray-400"/></td>
                    <td className="px-4 py-4"><div className="flex items-center">{item.desc} <Info className="w-3 h-3 ml-2 text-gray-400"/></div></td>
                    <td className="px-4 py-4">{item.qty.toFixed(2)}</td>
                    <td className="px-4 py-4">{item.measure}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Section */}
            <div className="flex justify-end">
              <div className="w-96 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">{isBM ? "Jumlah Amaun Cukai" : "Total Tax Amount"} <Info className="w-3 h-3 ml-1 text-gray-400"/></span>
                  <div className="flex items-center">
                    <span className="w-12 bg-gray-100 dark:bg-gray-800 text-center py-1.5 border dark:border-gray-700 rounded-l">RM</span>
                    <span className="w-32 text-right border-y border-r dark:border-gray-700 py-1.5 px-3 rounded-r bg-white dark:bg-[#323130]">10.00</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">{isBM ? "Jumlah Amaun Bersih" : "Total Net Amount"}</span>
                  <div className="flex items-center">
                    <span className="w-12 bg-gray-100 dark:bg-gray-800 text-center py-1.5 border dark:border-gray-700 rounded-l">RM</span>
                    <span className="w-32 text-right border-y border-r dark:border-gray-700 py-1.5 px-3 rounded-r bg-white dark:bg-[#323130] font-semibold">
                      {lineItems.reduce((acc, curr) => acc + curr.total, 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Additional Information */}
        {step === 4 && (
          <div className="p-8">
             <h2 className="text-lg font-semibold border-b-2 border-[#292b45] inline-block pb-1 mb-8">{isBM ? "Maklumat Tambahan" : "Additional Information"}</h2>
             <p className="text-sm text-gray-500 mb-4">{isBM ? "Anda boleh menambah lampiran atau rujukan pilihan di sini." : "You can add optional attachments or references here."}</p>
             <textarea className={`w-full p-4 rounded border outline-none h-32 ${theme === "dark" ? "bg-[#323130] border-[#3b3a39]" : "bg-white border-[#edebe9]"}`} placeholder={isBM ? "Nota atau catatan..." : "Notes or remarks..."}></textarea>
          </div>
        )}

        {/* Step 5: Summary And Submit */}
        {step === 5 && (
          <div className="p-8">
            <h2 className="text-lg font-semibold border-b-2 border-[#292b45] inline-block pb-1 mb-8">{isBM ? "Ringkasan" : "Summary"}</h2>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">{isBM ? "Kod / Nombor e-Invois" : "e-Invoice Code / Number"}</p>
                <p className="font-medium">23701915219</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{isBM ? "Tarikh dan Masa Dikeluarkan" : "Date and Time Issued"}</p>
                <p className="font-medium">1/9/2025 11:02 AM</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 border border-gray-200 dark:border-[#3b3a39] rounded overflow-hidden">
              {/* Supplier Header */}
              <div className="bg-[#292b45] text-white p-3 font-semibold text-sm border-r border-[#3b3a39]">{isBM ? "Pembekal (Daripada)" : "Supplier (From)"}</div>
              {/* Buyer Header */}
              <div className="bg-[#292b45] text-white p-3 font-semibold text-sm">{isBM ? "Pembeli (Kepada)" : "Buyer (To)"}</div>

              {/* Supplier Details */}
              <div className="p-4 space-y-4 border-r border-gray-200 dark:border-[#3b3a39] text-sm">
                <div className="grid grid-cols-2">
                  <div>
                    <p className="text-gray-500 mb-1">{isBM ? "Nama" : "Name"}</p>
                    <p className="font-medium">Aisha S.</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">{isBM ? "Nombor Pengenalan Cukai (TIN)" : "Tax Identification Number (TIN)"}</p>
                    <p className="font-medium">IG228600000</p>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div>
                    <p className="text-gray-500 mb-1">{isBM ? "Kod MSIC" : "MSIC Code"}</p>
                    <p className="font-medium">00000</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">{isBM ? "Nombor Pendaftaran SST" : "SST Registration Number"}</p>
                    <p className="font-medium">SST123456</p>
                  </div>
                </div>
              </div>

              {/* Buyer Details */}
              <div className="p-4 space-y-4 text-sm">
                <div className="grid grid-cols-2">
                  <div>
                    <p className="text-gray-500 mb-1">{isBM ? "Jenis ID" : "ID Type"}</p>
                    <p className="font-medium">BRN</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">{isBM ? "Pendaftaran / Pengenalan" : "Registration / Identification"}</p>
                    <p className="font-medium">197601004256</p>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div>
                    <p className="text-gray-500 mb-1">{isBM ? "Nama" : "Name"}</p>
                    <p className="font-medium">ONE WORLD SDN. BHD</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">{isBM ? "Nombor Pengenalan Cukai (TIN)" : "Tax Identification Number (TIN)"}</p>
                    <p className="font-medium">C884079029</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">{isBM ? "Alamat" : "Address"}</p>
                  <p className="font-medium">A22, 80F, KLCC TOWER 1, 53000, KUALA LUMPUR...</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Footer Actions */}
        <div className={`p-4 border-t flex justify-between items-center ${theme === "dark" ? "border-[#3b3a39] bg-[#1a1c30]" : "border-[#edebe9] bg-[#f5f5f5]"}`}>
          <button className="bg-[#292b45] hover:bg-[#1a1c30] text-white px-4 py-2 rounded text-sm transition-colors flex items-center">
             {isBM ? "Tutup" : "Close"}
          </button>
          
          <div className="flex items-center space-x-3">
             <span className="text-[#107c41] text-xs font-medium flex items-center mr-4"><Check className="w-3 h-3 mr-1"/> {isBM ? "Disimpan automatik 3 minit yang lalu" : "Auto-saved 3 minute Ago"}</span>
             <button className="bg-white border text-gray-400 px-6 py-2 rounded text-sm flex items-center cursor-not-allowed">
               <Save className="w-4 h-4 mr-2" /> {isBM ? "Simpan" : "Save"}
             </button>
             <button 
               onClick={() => setStep(step - 1)}
               disabled={step === 1}
               className={`bg-[#292b45] hover:bg-[#1a1c30] text-white px-6 py-2 rounded text-sm transition-colors flex items-center ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
               <ArrowLeft className="w-4 h-4 mr-2" /> {isBM ? "Sebelumnya" : "Previous"}
             </button>
             {step < 5 ? (
               <button 
                 onClick={() => setStep(step + 1)}
                 className="bg-[#292b45] hover:bg-[#1a1c30] text-white px-6 py-2 rounded text-sm transition-colors flex items-center"
               >
                 {isBM ? "Teruskan" : "Continue"} <ArrowRight className="w-4 h-4 ml-2" />
               </button>
             ) : (
               <button 
                 onClick={() => {
                   if (onSubmit) {
                     const total = lineItems.reduce((acc, curr) => acc + curr.total, 0).toLocaleString(undefined, {minimumFractionDigits: 2});
                     onSubmit({
                       id: Date.now().toString(),
                       uuid: "NEW-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
                       code: "23701915219", // mock hardcoded
                       supplier: "Aisha S.",
                       buyer: "ONE WORLD SDN. BHD",
                       amount: total,
                       issued: new Date().toLocaleString(),
                       submitted: new Date().toLocaleString(),
                       status: "Valid"
                     });
                   }
                   setStep(0);
                   setLineItems([{ id: 1, code: "022-Others", desc: "Bangkok 4 Days 3 Nights - Adult VIP", qty: 1.00, measure: "E48", total: 7312.82 }]);
                 }}
                 className="bg-[#292b45] hover:bg-[#1a1c30] text-white px-6 py-2 rounded text-sm transition-colors flex items-center"
               >
                 <Send className="w-4 h-4 mr-2" /> {isBM ? "Tandatangan & Serah Dokumen" : "Sign & Submit Document"}
               </button>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
