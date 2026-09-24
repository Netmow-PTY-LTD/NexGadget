/**
 * NexGadget ERP - Scope 9: Individual Device Sales & Profit/Loss Tracking (POS)
 * Exact unit margin tracking: Realized Profit = Selling Price - Landed Cost (Acquisition + Parts + Labor + Logistics)
 */

function renderSalesView() {
  const store = window.erpStore;
  const branch = store.getActiveBranch();
  const sales = store.getSales(branch);

  const totalRev = sales.reduce((sum, s) => sum + (s.financials?.sellingPrice - (s.financials?.discount || 0)), 0);
  const totalCost = sales.reduce((sum, s) => sum + (s.financials?.totalLandedCost || 0), 0);
  const totalProfit = sales.reduce((sum, s) => sum + (s.financials?.realizedProfit || 0), 0);
  const avgMargin = totalRev > 0 ? ((totalProfit / totalRev) * 100).toFixed(1) : 0;

  return `
    <div class="space-y-6 fade-in">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <h1 class="text-xl lg:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <i data-lucide="receipt" class="w-6 h-6 text-emerald-400"></i>
            <span>Individual Device Sales & Profit/Loss Engine</span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">Realized unit margin tracking: Realized Profit = Sale Price - Landed Cost (Acquisition + Parts + Labor + Logistics).</p>
        </div>

        <button onclick="window.openModal('pos-sale-modal')" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i>
          <span>Launch POS Terminal</span>
        </button>
      </div>

      <!-- Financial KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="glass-card rounded-2xl p-4 border-l-4 border-l-blue-500">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Sales Revenue</div>
          <div class="text-2xl font-bold text-white font-mono-code mt-1">$${totalRev.toLocaleString()}</div>
          <div class="text-[10px] text-slate-400 mt-0.5">${sales.length} orders billed</div>
        </div>

        <div class="glass-card rounded-2xl p-4 border-l-4 border-l-slate-500">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total IMEI Landed Cost</div>
          <div class="text-2xl font-bold text-slate-300 font-mono-code mt-1">$${totalCost.toLocaleString()}</div>
          <div class="text-[10px] text-slate-400 mt-0.5">COG for sold units</div>
        </div>

        <div class="glass-card rounded-2xl p-4 border-l-4 border-l-emerald-500">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Realized Gross Profit</div>
          <div class="text-2xl font-bold text-emerald-400 font-mono-code mt-1">+$${totalProfit.toLocaleString()}</div>
          <div class="text-[10px] text-emerald-300/80 mt-0.5">Net profit realized</div>
        </div>

        <div class="glass-card rounded-2xl p-4 border-l-4 border-l-indigo-500">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Average Gross Margin</div>
          <div class="text-2xl font-bold text-indigo-400 font-mono-code mt-1">+${avgMargin}%</div>
          <div class="text-[10px] text-indigo-300/80 mt-0.5">Across all branches</div>
        </div>

      </div>

      <!-- Device Sales Ledger Table -->
      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 class="text-sm font-bold text-white flex items-center gap-2">
            <i data-lucide="file-spreadsheet" class="w-4 h-4 text-emerald-400"></i>
            Item-Level Sales & Unit P&L Audit Ledger
          </h2>
          <span class="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono-code">${sales.length} Invoices</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs custom-table">
            <thead>
              <tr class="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold">
                <th class="py-3 px-4">Invoice ID & Date</th>
                <th class="py-3 px-4">Sold Device & IMEI</th>
                <th class="py-3 px-4">Customer</th>
                <th class="py-3 px-4">Branch</th>
                <th class="py-3 px-4">IMEI Landed Cost</th>
                <th class="py-3 px-4">Final Sale Price</th>
                <th class="py-3 px-4">Unit Profit ($)</th>
                <th class="py-3 px-4">Margin (%)</th>
                <th class="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-slate-300">
              ${sales.map(s => {
                const branchObj = store.getBranchById(s.branchId);
                const isHighMargin = s.financials.marginPercent >= 20;

                return `
                  <tr class="hover:bg-slate-800/40 transition">
                    <!-- Invoice & Date -->
                    <td class="py-3 px-4 font-mono-code">
                      <div class="font-bold text-blue-400">${s.id}</div>
                      <div class="text-[10px] text-slate-500">${s.date ? s.date.split('T')[0] : 'N/A'}</div>
                    </td>

                    <!-- Device Info -->
                    <td class="py-3 px-4">
                      <div class="font-bold text-white text-xs">${s.device.model}</div>
                      <div class="text-[10px] font-mono-code text-slate-400">IMEI: ${s.device.imei}</div>
                      <span class="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">${s.device.condition}</span>
                    </td>

                    <!-- Customer -->
                    <td class="py-3 px-4">
                      <div class="font-semibold text-slate-200">${s.customer.name}</div>
                      <div class="text-[10px] text-slate-500">${s.customer.phone}</div>
                    </td>

                    <!-- Branch -->
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[11px]">
                        <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${branchObj?.color || '#3b82f6'}"></span>
                        ${branchObj?.name || 'HQ'}
                      </span>
                    </td>

                    <!-- Cost -->
                    <td class="py-3 px-4 font-mono-code">
                      <div class="font-bold text-slate-300">$${s.financials.totalLandedCost}</div>
                      <div class="text-[9px] text-slate-500">Acq:$${s.financials.acquisitionCost} | Prt:$${s.financials.partsCost}</div>
                    </td>

                    <!-- Sale Price -->
                    <td class="py-3 px-4 font-mono-code">
                      <div class="font-bold text-white">$${s.financials.sellingPrice}</div>
                      ${s.financials.discount > 0 ? `<div class="text-[9px] text-rose-400">-$${s.financials.discount} disc</div>` : ''}
                    </td>

                    <!-- Profit -->
                    <td class="py-3 px-4 font-mono-code">
                      <div class="font-bold text-emerald-400 text-xs">+$${s.financials.realizedProfit}</div>
                    </td>

                    <!-- Margin -->
                    <td class="py-3 px-4 font-mono-code">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isHighMargin ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}">
                        +${s.financials.marginPercent}%
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="py-3 px-4 text-right">
                      <button onclick="window.openReceiptModal('${s.id}')" title="Print Invoice Receipt" class="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg border border-slate-700 transition">
                        <i data-lucide="printer" class="w-3.5 h-3.5"></i>
                      </button>
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

window.renderSalesView = renderSalesView;
