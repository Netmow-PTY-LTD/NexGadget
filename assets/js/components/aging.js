/**
 * NexGadget ERP - Scope 10: Stock Aging & Slow-Moving Stock Management
 * Aging Buckets (0-30d, 31-60d, 61-90d, 90+d), Holding Cost Calculation & Markdown Recommender
 */

function renderAgingView() {
  const store = window.erpStore;
  const branch = store.getActiveBranch();
  const gadgets = store.getGadgets(branch).filter(g => g.status === 'in_stock');

  // Bucketing
  const bucket0_30 = gadgets.filter(g => (g.agingDays || 0) <= 30);
  const bucket31_60 = gadgets.filter(g => (g.agingDays || 0) >= 31 && (g.agingDays || 0) <= 60);
  const bucket61_90 = gadgets.filter(g => (g.agingDays || 0) >= 61 && (g.agingDays || 0) <= 90);
  const bucket90Plus = gadgets.filter(g => (g.agingDays || 0) > 90);

  // Holding Cost estimation ($0.75 per day on avg)
  const totalHoldingCost = gadgets.reduce((sum, g) => sum + (g.agingDays * 0.75), 0);

  return `
    <div class="space-y-6 fade-in">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <h1 class="text-xl lg:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <i data-lucide="hourglass" class="w-6 h-6 text-rose-400"></i>
            <span>Stock Aging & Slow-Moving Stock Engine</span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">Automated holding cost analytics, depreciation risk detection, and dynamic clearance markdown recommendations.</p>
        </div>
      </div>

      <!-- Aging Buckets Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- 0-30 Days -->
        <div class="glass-card rounded-2xl p-4 border-l-4 border-l-emerald-500">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-emerald-400">0 – 30 Days (Fresh Stock)</span>
            <i data-lucide="sparkles" class="w-4 h-4 text-emerald-400"></i>
          </div>
          <div class="text-2xl font-bold text-white font-mono-code">${bucket0_30.length} <span class="text-xs font-normal text-slate-400">units</span></div>
          <div class="text-[10px] text-slate-400 mt-1">Value: $${bucket0_30.reduce((s, g) => s + (g.costs?.totalLanded || 0), 0).toLocaleString()}</div>
        </div>

        <!-- 31-60 Days -->
        <div class="glass-card rounded-2xl p-4 border-l-4 border-l-yellow-500">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-yellow-400">31 – 60 Days (Normal)</span>
            <i data-lucide="clock" class="w-4 h-4 text-yellow-400"></i>
          </div>
          <div class="text-2xl font-bold text-white font-mono-code">${bucket31_60.length} <span class="text-xs font-normal text-slate-400">units</span></div>
          <div class="text-[10px] text-slate-400 mt-1">Value: $${bucket31_60.reduce((s, g) => s + (g.costs?.totalLanded || 0), 0).toLocaleString()}</div>
        </div>

        <!-- 61-90 Days -->
        <div class="glass-card rounded-2xl p-4 border-l-4 border-l-amber-500">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-amber-400">61 – 90 Days (Aging Alert)</span>
            <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-400"></i>
          </div>
          <div class="text-2xl font-bold text-amber-400 font-mono-code">${bucket61_90.length} <span class="text-xs font-normal text-slate-400">units</span></div>
          <div class="text-[10px] text-slate-400 mt-1">Value: $${bucket61_90.reduce((s, g) => s + (g.costs?.totalLanded || 0), 0).toLocaleString()}</div>
        </div>

        <!-- 90+ Days (Critical Dead Stock) -->
        <div class="glass-card rounded-2xl p-4 border-l-4 border-l-rose-500">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-rose-400">90+ Days (Critical Dead Stock)</span>
            <i data-lucide="alert-octagon" class="w-4 h-4 text-rose-400 animate-pulse"></i>
          </div>
          <div class="text-2xl font-bold text-rose-400 font-mono-code">${bucket90Plus.length} <span class="text-xs font-normal text-slate-400">units</span></div>
          <div class="text-[10px] text-rose-300/80 mt-1">Holding Cost Impact: ~$${Math.round(totalHoldingCost)}</div>
        </div>

      </div>

      <!-- Slow Moving Devices & Markdown Recommender Table -->
      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
              <i data-lucide="trending-down" class="w-4 h-4 text-rose-400"></i>
              Slow-Moving Stock & Recommended Liquidation Markdowns
            </h2>
            <p class="text-[11px] text-slate-400">Suggested promotional markdowns to unlock tied up capital</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs custom-table">
            <thead>
              <tr class="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold">
                <th class="py-3 px-4">Device & IMEI</th>
                <th class="py-3 px-4">Branch</th>
                <th class="py-3 px-4">Days in Stock</th>
                <th class="py-3 px-4">Landed Cost</th>
                <th class="py-3 px-4">Current Price</th>
                <th class="py-3 px-4">Est. Holding Cost</th>
                <th class="py-3 px-4">Recommended Markdown</th>
                <th class="py-3 px-4 text-right">Quick Apply</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-slate-300">
              ${gadgets.sort((a, b) => b.agingDays - a.agingDays).map(g => {
                const branchObj = store.getBranchById(g.branchId);
                const holdingCost = Math.round(g.agingDays * 0.75);
                const suggestedDiscount = g.agingDays > 90 ? Math.round(g.sellingPrice * 0.15) : (g.agingDays > 60 ? Math.round(g.sellingPrice * 0.08) : 0);

                let badge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400">Fresh (${g.agingDays}d)</span>`;
                if (g.agingDays > 90) {
                  badge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">Critical (${g.agingDays}d)</span>`;
                } else if (g.agingDays > 60) {
                  badge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">Aging (${g.agingDays}d)</span>`;
                } else if (g.agingDays > 30) {
                  badge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-300">Normal (${g.agingDays}d)</span>`;
                }

                return `
                  <tr class="hover:bg-slate-800/40 transition">
                    <!-- Device & IMEI -->
                    <td class="py-3 px-4">
                      <div class="font-bold text-white text-xs">${g.brand} ${g.model}</div>
                      <div class="text-[10px] font-mono-code text-blue-400">IMEI: ${g.imei}</div>
                      <div class="text-[9px] text-slate-500">${g.variant} • ${g.condition}</div>
                    </td>

                    <!-- Branch -->
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[11px]">
                        <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${branchObj?.color || '#3b82f6'}"></span>
                        ${branchObj?.name || 'HQ'}
                      </span>
                    </td>

                    <!-- Days in Stock -->
                    <td class="py-3 px-4">${badge}</td>

                    <!-- Cost -->
                    <td class="py-3 px-4 font-mono-code text-slate-300">$${g.costs.totalLanded}</td>

                    <!-- Current Price -->
                    <td class="py-3 px-4 font-mono-code">
                      <div class="font-bold text-white">$${g.sellingPrice}</div>
                      ${g.markdownDiscount ? `<span class="text-[9px] text-rose-400 font-semibold">-$${g.markdownDiscount} applied</span>` : ''}
                    </td>

                    <!-- Est Holding Cost -->
                    <td class="py-3 px-4 font-mono-code text-rose-400">-$${holdingCost}</td>

                    <!-- Recommended Markdown -->
                    <td class="py-3 px-4">
                      ${suggestedDiscount > 0 ? `
                        <span class="text-xs font-bold text-amber-400 font-mono-code">-$${suggestedDiscount} (${g.agingDays > 90 ? '15%' : '8%'})</span>
                      ` : `
                        <span class="text-[10px] text-slate-500">None required</span>
                      `}
                    </td>

                    <!-- Quick Apply -->
                    <td class="py-3 px-4 text-right">
                      ${suggestedDiscount > 0 ? `
                        <button onclick="window.handleApplyMarkdown('${g.id}', ${suggestedDiscount})" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-600/90 hover:bg-rose-500 text-white shadow transition">
                          Apply Promo
                        </button>
                      ` : `
                        <button onclick="window.quickPosForDevice('${g.id}')" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-blue-400 transition">
                          Sell (POS)
                        </button>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

window.renderAgingView = renderAgingView;
