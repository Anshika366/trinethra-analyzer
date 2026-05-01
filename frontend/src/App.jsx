// import { useState, useEffect, useRef, useMemo } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// function App() {
//   const [transcript, setTranscript] = useState("");
//   const [analysis, setAnalysis] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [logs, setLogs] = useState([]);
//   const [theme, setTheme] = useState("dark");
//   const [activeTab, setActiveTab] = useState("analytics");
//   const [searchTerm, setSearchTerm] = useState("");

//   const logEndRef = useRef(null);
//   const reportRef = useRef(null);

//   const [history, setHistory] = useState(() => {
//     try {
//       const saved = localStorage.getItem("trinethra_ultimate_v2");
//       return saved ? JSON.parse(saved) : [];
//     } catch {
//       return [];
//     }
//   });

//   useEffect(() => {
//     if (logEndRef.current)
//       logEndRef.current.scrollIntoView({ behavior: "smooth" });
//   }, [logs]);

//   const filteredHistory = useMemo(() => {
//     const term = searchTerm.toLowerCase().trim();
//     if (!term) return history;
//     return history.filter(
//       (h) =>
//         (h.label || "").toLowerCase().includes(term) ||
//         (h.preview || "").toLowerCase().includes(term),
//     );
//   }, [history, searchTerm]);

//   const addLog = (msg) => {
//     setLogs((prev) => [...prev, { id: Date.now(), msg: `[Neural]: ${msg}` }]);
//   };

//   const runAudit = async () => {
//     if (!transcript.trim()) return;
//     setLoading(true);
//     setAnalysis(null);
//     addLog("Analyzing patterns in Supervisor Feedback...");

//     try {
//       const res = await fetch("http://localhost:11434/api/generate", {
//         method: "POST",
//         body: JSON.stringify({
//           model: "llama3.2",
//           prompt: `You are the DeepThought Trinethra AI. Analyze this transcript (can be Hindi/Hinglish/English).
//           Return ONLY JSON in English.
//           Structure:
//           {
//             "score": 7,
//             "label": "BRONZE GRADE",
//             "justification": "Detailed reasoning...",
//             "confidence": 85,
//             "evidence": [{"quote": "...", "sentiment": "positive"}],
//             "kpis": ["Efficiency", "Accountability"],
//             "gaps": ["No mention of systems building"],
//             "followUps": [{"q": "...", "reason": "..."}]
//           }
//           Transcript: ${transcript}`,
//           stream: false,
//           format: "json",
//         }),
//       });

//       const data = await res.json();
//       const parsed = JSON.parse(data.response);
//       setAnalysis(parsed);

//       const newEntry = {
//         id: Date.now(),
//         ...parsed,
//         preview: transcript.slice(0, 50) + "...",
//       };
//       setHistory((prev) => {
//         const up = [newEntry, ...prev].slice(0, 10);
//         localStorage.setItem("trinethra_ultimate_v2", JSON.stringify(up));
//         return up;
//       });
//       addLog("Analysis Ready for Human Review.");
//     } catch (err) {
//       addLog(`Sync Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportPDF = async () => {
//     if (!analysis || !reportRef.current) return;
//     addLog("Exporting PDF Dossier...");
//     const canvas = await html2canvas(reportRef.current, {
//       scale: 2,
//       backgroundColor: theme === "dark" ? "#030712" : "#ffffff",
//     });
//     const pdf = new jsPDF("p", "mm", "a4");
//     pdf.addImage(
//       canvas.toDataURL("image/png"),
//       "PNG",
//       0,
//       0,
//       210,
//       (canvas.height * 210) / canvas.width,
//     );
//     pdf.save(`Trinethra_Audit_${Date.now()}.pdf`);
//   };

//   // Helper for dynamic text color
//   const textColor = theme === "dark" ? "text-slate-100" : "text-slate-900";
//   const subTextColor = theme === "dark" ? "text-slate-400" : "text-slate-600";
//   const cardBg =
//     theme === "dark"
//       ? "bg-[#111111] border-white/5"
//       : "bg-white border-slate-200 shadow-sm";

//   return (
//     <div
//       className={`h-screen flex overflow-hidden font-sans transition-colors duration-300 ${theme === "dark" ? "bg-[#030712]" : "bg-slate-50"}`}
//     >
//       {/* 🧭 SIDEBAR */}
//       <aside
//         className={`w-24 border-r flex flex-col items-center py-10 z-50 ${theme === "dark" ? "bg-black/60 border-white/5" : "bg-white border-slate-200 shadow-xl"}`}
//       >
//         <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black italic shadow-lg text-white mb-16">
//           DT
//         </div>
//         <nav className="flex-1 flex flex-col gap-10">
//           <button
//             onClick={() => setActiveTab("analytics")}
//             className={`p-4 rounded-2xl transition-all ${activeTab === "analytics" ? "bg-blue-600 text-white shadow-xl" : "opacity-30 hover:opacity-100 " + textColor}`}
//           >
//             📊
//           </button>
//           <button
//             onClick={() => setActiveTab("history")}
//             className={`p-4 rounded-2xl transition-all ${activeTab === "history" ? "bg-blue-600 text-white shadow-xl" : "opacity-30 hover:opacity-100 " + textColor}`}
//           >
//             🧠
//           </button>
//         </nav>
//         <button
//           onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//           className={`text-xl opacity-50 hover:opacity-100 transition-all ${textColor}`}
//         >
//           {theme === "dark" ? "☀️" : "🌙"}
//         </button>
//       </aside>

//       <main className="flex-1 flex flex-col overflow-hidden relative">
//         <header
//           className={`h-20 px-10 border-b flex justify-between items-center backdrop-blur-xl ${theme === "dark" ? "bg-black/10 border-white/5" : "bg-white/50 border-slate-200"}`}
//         >
//           <h1
//             className={`text-sm font-black tracking-widest uppercase italic ${textColor}`}
//           >
//             Trinethra <span className="text-blue-500">Titan-OS</span>
//           </h1>
//           <div className="flex items-center gap-6">
//             {activeTab === "history" && (
//               <input
//                 type="text"
//                 placeholder="Search Memory..."
//                 className={`border rounded-xl px-6 py-2 text-[10px] w-64 outline-none focus:border-blue-500 transition-all ${theme === "dark" ? "bg-white/5 border-white/10 text-white" : "bg-slate-100 border-slate-300 text-slate-900"}`}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             )}
//             {analysis && (
//               <button
//                 onClick={exportPDF}
//                 className={`${theme === "dark" ? "bg-white text-black" : "bg-blue-600 text-white"} px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl`}
//               >
//                 Export PDF
//               </button>
//             )}
//           </div>
//         </header>

//         <div className="flex-1 p-8 grid grid-cols-12 gap-8 overflow-hidden">
//           {/* INPUT & CONSOLE */}
//           <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
//             <div
//               className={`flex-1 p-8 rounded-[3rem] border flex flex-col transition-all ${cardBg}`}
//             >
//               <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">
//                 Input Feed
//               </span>
//               <textarea
//                 className={`flex-1 bg-transparent border-none outline-none text-sm font-medium resize-none leading-relaxed placeholder:opacity-30 ${textColor}`}
//                 placeholder="Paste Supervisor Transcript (Any Language)..."
//                 value={transcript}
//                 onChange={(e) => setTranscript(e.target.value)}
//               />
//               <button
//                 onClick={runAudit}
//                 disabled={loading}
//                 className="w-full mt-6 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg hover:brightness-110 active:scale-95 transition-all"
//               >
//                 {loading ? "PROCESSING..." : "Run Neural Audit"}
//               </button>
//             </div>
//             <div
//               className={`h-32 p-4 border rounded-2xl font-mono text-[9px] overflow-y-auto custom-scrollbar ${theme === "dark" ? "bg-black border-white/5 text-blue-400/60" : "bg-slate-900 border-slate-800 text-emerald-400"}`}
//             >
//               {logs.map((l) => (
//                 <div key={l.id}>&gt; {l.msg}</div>
//               ))}
//               <div ref={logEndRef}></div>
//             </div>
//           </div>

//           {/* DASHBOARD AREA */}
//           <div className="col-span-12 lg:col-span-8 overflow-y-auto pr-4 custom-scrollbar">
//             {activeTab === "analytics" ? (
//               !analysis ? (
//                 <div
//                   className={`h-full border-2 border-dashed rounded-[4rem] flex flex-col items-center justify-center opacity-20 font-black uppercase tracking-[1em] ${theme === "dark" ? "border-white/5 text-white" : "border-slate-300 text-slate-400"}`}
//                 >
//                   Standby
//                 </div>
//               ) : (
//                 <div ref={reportRef} className="space-y-8 pb-10">
//                   {/* EDITABLE HERO SECTION */}
//                   <div className="p-12 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[3.5rem] text-white relative shadow-2xl overflow-hidden">
//                     <div className="relative z-10">
//                       <div className="flex justify-between items-start mb-6">
//                         <input
//                           className="bg-transparent text-6xl font-black italic outline-none w-full"
//                           value={analysis.label}
//                           onChange={(e) =>
//                             setAnalysis({ ...analysis, label: e.target.value })
//                           }
//                         />
//                         <div className="flex flex-col items-end">
//                           <span className="text-[120px] font-black leading-none">
//                             {analysis.score}
//                           </span>
//                           <span className="text-[10px] font-black opacity-50 uppercase tracking-widest">
//                             Confidence: {analysis.confidence}%
//                           </span>
//                         </div>
//                       </div>
//                       <textarea
//                         className="bg-transparent text-xs font-bold opacity-80 italic w-full outline-none resize-none leading-relaxed"
//                         rows="3"
//                         value={analysis.justification}
//                         onChange={(e) =>
//                           setAnalysis({
//                             ...analysis,
//                             justification: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className="absolute top-0 right-0 p-10 text-[200px] font-black opacity-5 italic -z-0">
//                       APEX
//                     </div>
//                   </div>

//                   {/* EVIDENCE GRID */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div
//                       className={`p-10 rounded-[3rem] border transition-all ${cardBg}`}
//                     >
//                       <h4 className="text-[10px] font-black text-blue-500 uppercase mb-8">
//                         Behavioral Evidence
//                       </h4>
//                       <div className="space-y-4">
//                         {analysis.evidence?.map((item, i) => (
//                           <div
//                             key={i}
//                             className={`p-4 rounded-2xl border ${item.sentiment === "positive" ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}
//                           >
//                             <p
//                               className={`text-[11px] italic mb-2 ${textColor}`}
//                             >
//                               "{item.quote}"
//                             </p>
//                             <span
//                               className={`text-[8px] font-black uppercase px-2 py-1 rounded ${item.sentiment === "positive" ? "text-emerald-500" : "text-red-500"}`}
//                             >
//                               {item.sentiment}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="space-y-6">
//                       <div
//                         className={`p-10 rounded-[3rem] border transition-all ${cardBg}`}
//                       >
//                         <h4 className="text-[10px] font-black text-blue-500 uppercase mb-6">
//                           KPI Targets
//                         </h4>
//                         <div className="flex flex-wrap gap-2">
//                           {analysis.kpis?.map((k, i) => (
//                             <span
//                               key={i}
//                               className="px-3 py-1 bg-blue-600/10 border border-blue-600/30 text-blue-500 rounded-full text-[9px] font-black"
//                             >
//                               {k}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                       <div
//                         className={`p-10 rounded-[3rem] border transition-all ${theme === "dark" ? "bg-red-950/10 border-red-500/10" : "bg-red-50 border-red-200"}`}
//                       >
//                         <h4 className="text-[10px] font-black text-red-500 uppercase mb-4">
//                           Gap Detection
//                         </h4>
//                         <ul className="space-y-2">
//                           {analysis.gaps?.map((g, i) => (
//                             <li
//                               key={i}
//                               className={`text-[10px] font-bold ${theme === "dark" ? "text-red-200/60" : "text-red-700"}`}
//                             >
//                               × {g}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   </div>

//                   {/* FOLLOW UPS */}
//                   <div
//                     className={`p-10 rounded-[3.5rem] border transition-all ${cardBg}`}
//                   >
//                     <h4 className="text-[10px] font-black text-blue-500 uppercase mb-8">
//                       Intern-Ready Interview Guide
//                     </h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {analysis.followUps?.map((f, i) => (
//                         <div
//                           key={i}
//                           className={`p-6 rounded-2xl border transition-all ${theme === "dark" ? "bg-white/5 border-white/5 hover:border-blue-600" : "bg-slate-50 border-slate-200 hover:border-blue-500"}`}
//                         >
//                           <p
//                             className={`text-[11px] font-black uppercase mb-1 ${textColor}`}
//                           >
//                             {f.q}
//                           </p>
//                           <p
//                             className={`text-[9px] font-bold italic opacity-60 ${subTextColor}`}
//                           >
//                             {f.reason}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-5">
//                 {filteredHistory.map((item) => (
//                   <div
//                     key={item.id}
//                     onClick={() => {
//                       setAnalysis(item);
//                       setActiveTab("analytics");
//                     }}
//                     className={`p-8 rounded-[2.5rem] border hover:border-blue-600 transition-all cursor-pointer group shadow-sm ${cardBg}`}
//                   >
//                     <div className="text-5xl font-black text-blue-500 mb-2">
//                       {item.score}
//                     </div>
//                     <div
//                       className={`text-[10px] font-black uppercase italic tracking-widest mb-4 ${textColor}`}
//                     >
//                       {item.label}
//                     </div>
//                     <p
//                       className={`text-[10px] truncate italic ${subTextColor}`}
//                     >
//                       "{item.preview}"
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;

// import { useState, useRef, useMemo } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// export default function App() {
//   // FIX: image_4bbf41 ke liye - Initializer function use kiya taaki useEffect ki zaroorat na pade
//   const [history, setHistory] = useState(() => {
//     try {
//       const saved = localStorage.getItem("trinethra_v6_pro");
//       return saved ? JSON.parse(saved) : [];
//     } catch (err) {
//       console.error("Vault access blocked:", err);
//       return [];
//     }
//   });

//   const [transcript, setTranscript] = useState("");
//   const [analysis, setAnalysis] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("trinethra");
//   const [darkMode, setDarkMode] = useState(true);
//   const [lang, setLang] = useState("en");

//   const reportRef = useRef(null);

//   const uiLabels = useMemo(
//     () => ({
//       en: {
//         title: "TRINETHRA",
//         run: "Run Neural Audit",
//         vault: "Vault",
//         audit: "Audit",
//         loading: "Processing...",
//       },
//       hi: {
//         title: "त्रिनेत्र",
//         run: "ऑडिट करें",
//         vault: "संग्रह",
//         audit: "ऑडिट",
//         loading: "प्रोसेसिंग...",
//       },
//     }),
//     [],
//   );

//   const runAudit = async () => {
//     if (!transcript.trim()) return;
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:11434/api/generate", {
//         method: "POST",
//         body: JSON.stringify({
//           model: "llama3.2",
//           prompt: `Analyze transcript: ${transcript}. Return ONLY JSON with: score, label, justification, kpis(array), gaps(array), emotions(object).`,
//           stream: false,
//           format: "json",
//         }),
//       });
//       const data = await res.json();
//       const result = JSON.parse(data.response);
//       setAnalysis(result);

//       const newEntry = {
//         ...result,
//         id: "TR-" + Date.now(),
//         preview: transcript.slice(0, 40),
//       };
//       setHistory((prev) => {
//         const updated = [newEntry, ...prev].slice(0, 10);
//         localStorage.setItem("trinethra_v6_pro", JSON.stringify(updated));
//         return updated;
//       });
//     } catch (apiErr) {
//       console.error("Neural Link Error:", apiErr);
//       alert("Neural Link Offline!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadPDF = async () => {
//     if (!reportRef.current) return;
//     try {
//       const canvas = await html2canvas(reportRef.current, {
//         scale: 2,
//         backgroundColor: darkMode ? "#020617" : "#ffffff",
//       });
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       pdf.addImage(
//         imgData,
//         "PNG",
//         0,
//         0,
//         210,
//         (canvas.height * 210) / canvas.width,
//       );
//       pdf.save(`Trinethra_Audit_${Date.now()}.pdf`);
//     } catch (pdfErr) {
//       console.error("PDF Generation Error:", pdfErr);
//     }
//   };

//   const handleEdit = (field, val) => {
//     setAnalysis((prev) => (prev ? { ...prev, [field]: val } : null));
//   };

//   return (
//     <div
//       className={`${darkMode ? "bg-[#020617] text-white" : "bg-slate-50 text-slate-900"} min-h-screen font-sans transition-colors duration-500`}
//     >
//       {/* NAVBAR */}
//       <nav
//         className={`p-6 border-b ${darkMode ? "border-white/10" : "border-slate-200"} flex justify-between items-center sticky top-0 z-50 backdrop-blur-xl`}
//       >
//         <h1 className="text-3xl font-black italic tracking-tighter uppercase">
//           {uiLabels[lang].title} <span className="text-indigo-500">V6 PRO</span>
//         </h1>

//         <div className="flex gap-6 items-center">
//           <select
//             value={lang}
//             onChange={(e) => setLang(e.target.value)}
//             className="bg-transparent font-black text-xs uppercase cursor-pointer text-indigo-500 outline-none border-none"
//           >
//             <option value="en">English</option>
//             <option value="hi">Hindi</option>
//           </select>
//           <button onClick={() => setDarkMode(!darkMode)} className="text-xl">
//             {darkMode ? "☀️" : "🌙"}
//           </button>
//           <div
//             className={`p-1 rounded-2xl flex ${darkMode ? "bg-black/40 border border-white/5" : "bg-slate-200"}`}
//           >
//             <button
//               onClick={() => setActiveTab("trinethra")}
//               className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase ${activeTab === "trinethra" ? "bg-indigo-600 text-white shadow-lg" : "opacity-40"}`}
//             >
//               {uiLabels[lang].audit}
//             </button>
//             <button
//               onClick={() => setActiveTab("vault")}
//               className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase ${activeTab === "vault" ? "bg-indigo-600 text-white shadow-lg" : "opacity-40"}`}
//             >
//               {uiLabels[lang].vault}
//             </button>
//           </div>
//         </div>
//       </nav>

//       <main className="p-8 lg:p-12 grid grid-cols-12 gap-10 max-w-[1500px] mx-auto">
//         {/* INPUT */}
//         <div className="col-span-12 lg:col-span-4">
//           <div
//             className={`${darkMode ? "bg-white/[0.03] border-white/10" : "bg-white border-slate-200 shadow-xl"} p-10 rounded-[3rem] border sticky top-32`}
//           >
//             <textarea
//               className="w-full h-80 bg-transparent border-none outline-none resize-none text-sm leading-relaxed"
//               placeholder="Paste transcript here..."
//               value={transcript}
//               onChange={(e) => setTranscript(e.target.value)}
//             />
//             <button
//               onClick={runAudit}
//               disabled={loading}
//               className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] mt-8 flex justify-center items-center gap-4 hover:bg-indigo-500 active:scale-95 transition-all"
//             >
//               {loading && (
//                 <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
//               )}
//               {loading ? uiLabels[lang].loading : uiLabels[lang].run}
//             </button>
//           </div>
//         </div>

//         {/* OUTPUT */}
//         <div className="col-span-12 lg:col-span-8">
//           {activeTab === "trinethra" ? (
//             analysis ? (
//               <div
//                 ref={reportRef}
//                 className="space-y-8 animate-in fade-in duration-700"
//               >
//                 {/* HERO CARD (EDITABLE) */}
//                 <div
//                   className={`${darkMode ? "bg-gradient-to-br from-indigo-900/30 via-black to-black border-white/10" : "bg-white border-slate-200 shadow-2xl"} p-16 rounded-[5rem] border relative overflow-hidden`}
//                 >
//                   <div className="relative z-10 flex justify-between items-center gap-6">
//                     <div className="flex-1">
//                       <input
//                         className="bg-transparent text-7xl font-black italic uppercase outline-none w-full text-indigo-500"
//                         value={analysis.label}
//                         onChange={(e) => handleEdit("label", e.target.value)}
//                       />
//                       <textarea
//                         className="bg-transparent mt-8 text-lg opacity-60 w-full outline-none h-24 resize-none leading-relaxed italic"
//                         value={analysis.justification}
//                         onChange={(e) =>
//                           handleEdit("justification", e.target.value)
//                         }
//                       />
//                     </div>
//                     <div className="text-center min-w-[200px]">
//                       <input
//                         type="number"
//                         className="bg-transparent text-[130px] font-black outline-none w-56 text-center leading-none text-white"
//                         value={analysis.score}
//                         onChange={(e) => handleEdit("score", e.target.value)}
//                       />
//                       <button
//                         onClick={downloadPDF}
//                         className="mt-6 block w-full text-[10px] font-black underline opacity-30 hover:opacity-100 uppercase tracking-widest"
//                       >
//                         Download PDF
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* EMOTIONS & KPIs */}
//                 <div className="grid grid-cols-2 gap-8">
//                   <div
//                     className={`${darkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-slate-100 shadow-lg"} p-10 rounded-[3.5rem] border`}
//                   >
//                     <h4 className="text-[11px] font-black opacity-30 uppercase mb-8">
//                       Emotion spectrum
//                     </h4>
//                     <div className="space-y-6">
//                       {Object.entries(analysis.emotions || {}).map(
//                         ([key, val]) => (
//                           <div key={key}>
//                             <div className="flex justify-between text-[10px] font-black uppercase mb-2">
//                               <span>{key}</span>
//                               <span className="text-indigo-400">{val}%</span>
//                             </div>
//                             <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
//                               <div
//                                 className="h-full bg-indigo-500 rounded-full"
//                                 style={{ width: `${val}%` }}
//                               />
//                             </div>
//                           </div>
//                         ),
//                       )}
//                     </div>
//                   </div>
//                   <div
//                     className={`${darkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-slate-100 shadow-lg"} p-10 rounded-[3.5rem] border`}
//                   >
//                     <h4 className="text-[11px] font-black opacity-30 uppercase mb-8">
//                       Neural KPIs
//                     </h4>
//                     <div className="flex flex-wrap gap-3">
//                       {analysis.kpis.map((k, i) => (
//                         <span
//                           key={i}
//                           className="px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-2xl text-[10px] font-black uppercase"
//                         >
//                           #{k}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* GAPS */}
//                 <div
//                   className={`${darkMode ? "bg-rose-500/5 border-rose-500/20" : "bg-rose-50 border-rose-200"} p-12 rounded-[4rem] border`}
//                 >
//                   <h4 className="text-[11px] font-black text-rose-500 uppercase mb-8 tracking-widest">
//                     Gap Identification
//                   </h4>
//                   <div className="grid grid-cols-2 gap-6">
//                     {analysis.gaps.map((g, i) => (
//                       <div
//                         key={i}
//                         className="text-xs opacity-70 flex items-center gap-4"
//                       >
//                         <span className="w-2 h-2 bg-rose-500 rounded-full" />{" "}
//                         {g}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="h-full min-h-[600px] border-2 border-dashed border-indigo-500/10 rounded-[5rem] flex items-center justify-center italic opacity-10 text-[100px] font-black">
//                 T6
//               </div>
//             )
//           ) : (
//             <div className="grid grid-cols-2 gap-8">
//               {history.map((h, i) => (
//                 <div
//                   key={i}
//                   className={`${darkMode ? "bg-white/[0.02] border-white/5" : "bg-white shadow-md"} p-10 rounded-[3.5rem] border`}
//                 >
//                   <div className="text-5xl font-black text-indigo-500 mb-2">
//                     {h.score}
//                   </div>
//                   <div className="text-[10px] font-black uppercase opacity-40">
//                     {h.label}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * 🛰️ TITAN V55: FINAL PROTOCOL
 * -------------------------------------------
 * - FIXED: Strict 5-Step JSON Output Logic
 * - STYLE: Industrial Deep-Dark UI
 * - FEATURES: Multi-Lang, Pro-PDF, Unique Tabs
 */

export default function TitanV55() {
  const [vault, setVault] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("titan_v55_vault");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [input, setInput] = useState("");
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("terminal");
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [sys, setSys] = useState({ cpu: 8, ram: 22 });

  const reportRef = useRef(null);

  // System Stats Simulation (For Health Tab)
  useEffect(() => {
    const i = setInterval(
      () =>
        setSys({
          cpu: Math.floor(Math.random() * 12 + 4),
          ram: Math.floor(Math.random() * 10 + 20),
        }),
      2500,
    );
    return () => clearInterval(i);
  }, []);

  // --- [CORE AUDIT ENGINE] ---
  const handleAudit = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify({
          model: "llama3.2",
          prompt: `System: Industrial Data Auditor. Language: ${lang === "hi" ? "Hindi" : "English"}.
          Analyze: "${input}".
          Response Format (JSON ONLY):
          {
            "step1": "Summary of the data provided",
            "step2": "Detailed critical analysis of the logic or content",
            "step3": {"Accuracy": 90, "Security": 85, "Efficiency": 95},
            "step4": ["Anomaly 1", "Anomaly 2"],
            "step5": ["Actionable Recommendation 1", "Future Roadmap Point"]
          }`,
          stream: false,
          format: "json",
        }),
      });

      const json = await response.json();
      const parsed = JSON.parse(json.response);

      const dossier = {
        ...parsed,
        uid: `TX-${Date.now()}`,
        date: new Date().toLocaleString(),
        raw: input,
      };

      setRes(dossier);
      setVault((prev) => [dossier, ...prev].slice(0, 20));
      localStorage.setItem(
        "titan_v55_vault",
        JSON.stringify([dossier, ...vault].slice(0, 20)),
      );
      setInput("");
    } catch (e) {
      alert("CRITICAL_ERR: Bridge to Llama failed. Check Ollama status.");
    } finally {
      setLoading(false);
    }
  }, [input, lang, vault]);

  const ui = useMemo(
    () =>
      theme === "dark"
        ? {
            bg: "bg-[#09090B]",
            side: "bg-[#111113] border-[#1F1F21]",
            card: "bg-[#18181B] border-[#27272A]",
            text: "text-zinc-100",
            accent: "text-blue-500",
            btn: "bg-blue-600 hover:bg-blue-500",
          }
        : {
            bg: "bg-[#FAFAFA]",
            side: "bg-white border-[#E4E4E7]",
            card: "bg-white border-[#E4E4E7]",
            text: "text-zinc-900",
            accent: "text-blue-600",
            btn: "bg-zinc-900 hover:bg-black",
          },
    [theme],
  );

  return (
    <div
      className={`${ui.bg} ${ui.text} min-h-screen flex font-sans antialiased`}
    >
      {/* 🛠️ SIDEBAR NAVIGATION */}
      <aside
        className={`w-64 ${ui.side} border-r flex flex-col fixed h-full z-50`}
      >
        <div className="p-8 border-b border-inherit">
          <h1 className="text-xl font-black tracking-tighter flex items-center gap-3 italic">
            <div className="w-5 h-5 bg-blue-600 rounded-sm shadow-lg shadow-blue-600/30"></div>{" "}
            TITAN V55
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 mt-6">
          {[
            { id: "terminal", icon: "◈", label: "Command" },
            { id: "vault", icon: "◰", label: "Vault" },
            { id: "health", icon: "⚡", label: "Health" },
            { id: "config", icon: "⚙", label: "Config" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full text-left px-5 py-3 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${tab === item.id ? "bg-blue-600/10 text-blue-500 border-r-2 border-blue-600" : "opacity-30 hover:opacity-100"}`}
            >
              <span className="text-xs">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* 🖥️ MAIN VIEWPORT */}
      <main className="flex-1 ml-64 p-12 pb-40">
        {tab === "terminal" && (
          <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in">
            {/* 📥 FLOATING INPUT BAR */}
            <div className="fixed bottom-10 left-[calc(16rem+4rem)] right-[4rem] z-50">
              <div
                className={`${ui.card} border-2 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 backdrop-blur-xl bg-opacity-90`}
              >
                <div className="pl-4 text-blue-500 font-bold opacity-50">
                  /audit_
                </div>
                <input
                  className="flex-1 bg-transparent border-none outline-none py-4 text-sm font-medium"
                  placeholder="Enter raw intelligence or logs for 5-step analysis..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAudit()}
                />
                <div className="flex items-center gap-3 pr-2">
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="bg-transparent text-[9px] font-black uppercase outline-none opacity-40 cursor-pointer"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                  <button
                    onClick={handleAudit}
                    disabled={loading}
                    className={`${ui.btn} px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-lg shadow-blue-600/20`}
                  >
                    {loading ? "SYNC..." : "Process"}
                  </button>
                </div>
              </div>
            </div>

            {/* 📤 5-STEP PROTOCOL OUTPUT */}
            {res ? (
              <div ref={reportRef} className="space-y-8 slide-up pb-10">
                <div className="flex justify-between items-center border-b border-inherit pb-6">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 italic">
                    Audit Dossier // {res.uid}
                  </h2>
                  <button
                    onClick={() => {
                      html2canvas(reportRef.current, {
                        scale: 3,
                        backgroundColor:
                          theme === "dark" ? "#09090B" : "#FAFAFA",
                      }).then((canvas) => {
                        const pdf = new jsPDF("p", "mm", "a4");
                        pdf.addImage(
                          canvas.toDataURL("image/png"),
                          "PNG",
                          0,
                          0,
                          210,
                          (canvas.height * 210) / canvas.width,
                        );
                        pdf.save(`Audit_Dossier_${res.uid}.pdf`);
                      });
                    }}
                    className="text-[10px] font-black uppercase text-blue-500 hover:underline underline-offset-8 transition-all"
                  >
                    Download PDF Report
                  </button>
                </div>

                {/* STEP 1: SUMMARY */}
                <div
                  className={`${ui.card} p-10 rounded-[2.5rem] border-l-[12px] border-l-blue-600 bg-gradient-to-r from-blue-600/5 to-transparent`}
                >
                  <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-4">
                    Step 01 // Summary
                  </h4>
                  <p className="text-3xl font-light italic leading-tight">
                    "{res.step1}"
                  </p>
                </div>

                {/* STEP 3: METRICS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(res.step3).map(([k, v]) => (
                    <div
                      key={k}
                      className={`${ui.card} p-8 rounded-3xl border text-center transition-transform hover:-translate-y-1`}
                    >
                      <div className="text-4xl font-black text-blue-500 mb-1">
                        {v}%
                      </div>
                      <div className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em]">
                        {k} Index
                      </div>
                    </div>
                  ))}
                </div>

                {/* STEP 2: ANALYSIS */}
                <div className={`${ui.card} p-10 rounded-[2.5rem] border`}>
                  <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-6 block italic">
                    Step 02 // Deep Logic Analysis
                  </h4>
                  <p className="text-base opacity-70 leading-relaxed font-medium">
                    {res.step2}
                  </p>
                </div>

                {/* STEP 4 & 5: ANOMALIES & ROADMAP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-10 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/20">
                    <h4 className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-8 italic">
                      Step 04 // Anomalies
                    </h4>
                    <ul className="space-y-4">
                      {res.step4.map((a, i) => (
                        <li
                          key={i}
                          className="text-xs font-bold opacity-60 flex gap-3 border-b border-rose-500/10 pb-3 italic"
                        >
                          <span className="text-rose-500">◈</span> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-10 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/20">
                    <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-8 italic">
                      Step 05 // Roadmap
                    </h4>
                    <div className="space-y-4">
                      {res.step5.map((r, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-6 h-6 rounded bg-blue-600/10 flex items-center justify-center text-[9px] font-black text-blue-500 border border-blue-600/20">
                            {i + 1}
                          </div>
                          <p className="text-xs font-bold opacity-70 tracking-tight">
                            {r}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center opacity-5 select-none grayscale">
                <div className="text-[14rem] font-black italic tracking-tighter">
                  TITAN
                </div>
                <p className="text-xl font-black uppercase tracking-[2em] mt-6">
                  System Standby
                </p>
              </div>
            )}
          </div>
        )}

        {/* VAULT TAB */}
        {tab === "vault" && (
          <div className="max-w-6xl mx-auto animate-in fade-in">
            <div className="flex justify-between items-end mb-16 border-b border-inherit pb-8">
              <h2 className="text-7xl font-black italic tracking-tighter opacity-80 uppercase">
                Archives
              </h2>
              <button
                onClick={() => {
                  localStorage.clear();
                  setVault([]);
                }}
                className="text-[10px] font-black uppercase text-rose-500 hover:underline"
              >
                Purge Core
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {vault.map((v) => (
                <div
                  key={v.uid}
                  onClick={() => {
                    setRes(v);
                    setTab("terminal");
                  }}
                  className={`${ui.card} p-10 rounded-[3rem] border group cursor-pointer hover:border-blue-500 transition-all`}
                >
                  <div className="text-5xl font-black text-blue-500/20 group-hover:text-blue-500 transition-all mb-4">
                    {v.step3.Accuracy}%
                  </div>
                  <h4 className="text-xs font-black uppercase italic mb-3 tracking-widest">
                    Dossier: {v.uid.slice(-6)}
                  </h4>
                  <p className="text-[10px] opacity-40 italic line-clamp-2">
                    "{v.raw.substring(0, 100)}..."
                  </p>
                  <p className="mt-8 text-[8px] font-mono opacity-20 uppercase">
                    {v.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HEALTH TAB */}
        {tab === "health" && (
          <div className="max-w-4xl mx-auto animate-in fade-in space-y-12">
            <div className={`${ui.card} p-14 rounded-[4rem] border`}>
              <h2 className="text-5xl font-black italic uppercase mb-12 tracking-tighter">
                Node health
              </h2>
              <div className="grid grid-cols-2 gap-10">
                <div className="p-10 rounded-3xl bg-blue-500/5 border border-blue-500/10 space-y-6">
                  <p className="text-[10px] font-black uppercase opacity-30 tracking-widest">
                    Neural Load
                  </p>
                  <div className="text-8xl font-black text-blue-500 tracking-tighter">
                    {sys.cpu}%
                  </div>
                </div>
                <div className="p-10 rounded-3xl bg-blue-500/5 border border-blue-500/10 space-y-6">
                  <p className="text-[10px] font-black uppercase opacity-30 tracking-widest">
                    Buffer Capacity
                  </p>
                  <div className="text-8xl font-black text-blue-500 tracking-tighter">
                    {sys.ram}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONFIG TAB */}
        {tab === "config" && (
          <div className="max-w-3xl mx-auto animate-in fade-in">
            <div className={`${ui.card} p-14 rounded-[4rem] border space-y-10`}>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter">
                Settings
              </h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-8 bg-white/5 rounded-3xl border border-white/5">
                  <div>
                    <p className="font-bold text-lg">System Appearance</p>
                    <p className="text-xs opacity-40 italic tracking-widest">
                      Toggle Light/Dark Interface
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/30"
                  >
                    {theme}
                  </button>
                </div>
                <div className="flex justify-between items-center p-8 bg-white/5 rounded-3xl border border-white/5">
                  <div>
                    <p className="font-bold text-lg">Language Core</p>
                    <p className="text-xs opacity-40 italic tracking-widest">
                      Target Language for Audit
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {["en", "hi"].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lang === l ? "bg-blue-600 text-white" : "bg-white/5 opacity-40"}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 10px; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in 0.8s ease-out forwards; }
        .slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}