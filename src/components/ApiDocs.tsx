import React, { useState } from 'react';
import { Terminal, Copy, Check, Play } from 'lucide-react';

export const ApiDocs: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const samplePayload = {
    purchasePrice: 6.67,
    sellingPrice: 19.99,
    amazonFees: 3.00,
    fbaFee: 4.10,
    shipping: 1.50,
  };

  const runLiveTest = async () => {
    setTestLoading(true);
    try {
      const res = await fetch('/api/products/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(samplePayload),
      });
      const data = await res.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestResult(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setTestLoading(false);
    }
  };

  const curlExample = `curl -X POST http://localhost:3000/api/products/analyze \\
  -H "Content-Type: application/json" \\
  -d '{
    "purchasePrice": 6.67,
    "sellingPrice": 19.99,
    "amazonFees": 3.00,
    "fbaFee": 4.10,
    "shipping": 1.50
  }'`;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">REST API Specification &amp; cURL Reference</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          REST / JSON
        </span>
      </div>

      {/* Health endpoint */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              GET
            </span>
            <code className="text-xs font-mono text-slate-200">/api/health</code>
          </div>
          <span className="text-xs text-slate-400">Health Endpoint</span>
        </div>
        <p className="text-xs text-slate-400">
          Returns <code className="text-amber-300">Amazon Product Analyzer is running!</code> with status 200 OK.
        </p>
      </div>

      {/* Analyze endpoint */}
      <div className="space-y-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              POST
            </span>
            <code className="text-xs font-mono text-slate-200">/api/products/analyze</code>
          </div>
          <span className="text-xs text-slate-400">Profitability Engine</span>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-medium text-slate-400">cURL Example</span>
            <button
              onClick={() => copyToClipboard(curlExample, 'curl')}
              className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer"
            >
              {copied === 'curl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied === 'curl' ? 'Copied' : 'Copy cURL'}
            </button>
          </div>
          <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-amber-200/90 overflow-x-auto">
            {curlExample}
          </pre>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400">Live Endpoint Execution</span>
            <button
              onClick={runLiveTest}
              disabled={testLoading}
              className="text-xs px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              {testLoading ? 'Calling API...' : 'Execute Test Call'}
            </button>
          </div>

          {testResult && (
            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
              {testResult}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
