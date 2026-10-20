import React from 'react';
import { X, Download, FileSpreadsheet, Trash2, Calendar, Clock, BarChart2 } from 'lucide-react';

export default function CallLogsModal({
  isOpen,
  onClose,
  callLogs = [],
  onClearLogs,
}) {
  if (!isOpen) return null;

  // Calculate KPIs
  const totalSlidesViewed = callLogs.length;
  const totalDurationSec = callLogs.reduce((acc, log) => acc + (log.durationSeconds || 0), 0);
  const totalMinutes = Math.round(totalDurationSec / 60);

  // Group by product
  const productFrequency = {};
  callLogs.forEach((log) => {
    productFrequency[log.productName] = (productFrequency[log.productName] || 0) + 1;
  });
  const topProducts = Object.entries(productFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(callLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `conceptors_call_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = ['Timestamp', 'Company', 'Product', 'Slide Number', 'Duration (seconds)'];
    const rows = callLogs.map((log) => [
      `"${log.timestamp || new Date().toISOString()}"`,
      `"${log.company || ''}"`,
      `"${log.productName || ''}"`,
      log.slideNumber || '',
      log.durationSeconds || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `conceptors_call_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F4EC] border border-[#0B431E]/20 flex items-center justify-center text-[#0B431E] shadow-sm">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#0B431E]">In-Clinic Detailing Analytics</h3>
              <p className="text-xs text-slate-500 font-medium">Session duration, slide dwell metrics, and doctor presentation audit log</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analytics KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 flex-shrink-0">
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0B431E]" />
              <span>Slides Presented</span>
            </div>
            <div className="text-2xl font-black text-[#0B431E] mt-1 font-mono">
              {totalSlidesViewed}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#96916E]" />
              <span>Detailing Time</span>
            </div>
            <div className="text-2xl font-black text-[#96916E] mt-1 font-mono">
              {totalMinutes} <span className="text-xs font-normal text-slate-500">min ({totalDurationSec}s)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Top Detailed Therapy
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-1.5 truncate">
              {topProducts[0] ? `${topProducts[0][0]} (${topProducts[0][1]} views)` : 'No calls recorded'}
            </div>
          </div>
        </div>

        {/* Scrollable Logs Table */}
        <div className="flex-1 overflow-y-auto no-scrollbar border border-slate-200 rounded-2xl bg-white">
          {callLogs.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <BarChart2 className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#0B431E]" />
              <p className="text-xs font-bold text-slate-600">No slide impressions recorded yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Start presenting products to automatically track detailing dwell times.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] text-slate-600 uppercase text-[10px] font-black border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Slide</th>
                  <th className="py-2.5 px-3 text-right">Dwell Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {callLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#0B431E]">
                      {log.company}
                    </td>
                    <td className="py-2.5 px-3 font-extrabold text-slate-900">
                      {log.productName}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      Slide #{log.slideNumber}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#0B431E]">
                      {log.durationSeconds}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer & Export Options */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={onClearLogs}
            disabled={callLogs.length === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              callLogs.length > 0 
                ? 'text-rose-600 hover:bg-rose-50' 
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              disabled={callLogs.length === 0}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                callLogs.length > 0 
                  ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200' 
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-[#0B431E]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={exportJSON}
              disabled={callLogs.length === 0}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                callLogs.length > 0 
                  ? 'bg-[#0B431E] hover:bg-[#14632E] text-white shadow-sm' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Download className="w-4 h-4 text-white" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
