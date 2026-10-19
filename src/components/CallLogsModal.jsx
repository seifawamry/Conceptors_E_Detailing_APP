import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, Trash2, Calendar, Clock, BarChart2, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-4xl glass-modal rounded-3xl p-6 shadow-2xl border border-white/20 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Call Logs & Rep Analytics</h3>
              <p className="text-xs text-slate-400">Offline session tracking and doctor detailing telemetry</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 py-4 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
              <Clock className="w-8 h-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-black text-white">{totalMinutes} <span className="text-sm font-normal text-slate-400">min</span></div>
                <div className="text-xs text-slate-400 font-medium">Total Detail Time</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-amber-400" />
              <div>
                <div className="text-2xl font-black text-white">{totalSlidesViewed}</div>
                <div className="text-xs text-slate-400 font-medium">Slides Presented</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
              <div>
                <div className="text-sm font-bold text-white line-clamp-1">
                  {topProducts.length > 0 ? topProducts[0][0] : 'None yet'}
                </div>
                <div className="text-xs text-slate-400 font-medium">Most Detailed Product</div>
              </div>
            </div>
          </div>

          {/* Table of Slides Viewed */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Detailing Activity History ({callLogs.length} events)
            </h4>

            {callLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 rounded-2xl border border-white/5 bg-white/5 text-xs">
                No detailing calls logged yet. Start presenting slides to automatically record presentation telemetry.
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-white/5 text-slate-400 uppercase font-mono text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">Company</th>
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3">Slide</th>
                      <th className="py-2.5 px-3 text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {callLogs.slice(0, 50).map((log, index) => (
                      <tr key={index} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-mono text-slate-400">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="py-2 px-3 font-semibold">{log.company}</td>
                        <td className="py-2 px-3 text-white">{log.productName}</td>
                        <td className="py-2 px-3 font-mono text-emerald-400">#{log.slideNumber}</td>
                        <td className="py-2 px-3 font-mono text-right text-slate-200">
                          {log.durationSeconds}s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with Exports */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={onClearLogs}
            disabled={callLogs.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/40 border border-rose-500/20 hover:bg-rose-900/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Logs</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              disabled={callLogs.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={exportJSON}
              disabled={callLogs.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-glow-emerald disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
