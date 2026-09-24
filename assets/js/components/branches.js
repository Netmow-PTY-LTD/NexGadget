/**
 * NexGadget ERP - Scope 2: Multi-Branch Management & Transfers
 * Branch isolation, performance benchmarks, and Inter-Branch stock transfer wizard
 */

function renderBranchesView() {
  const store = window.erpStore;
  const branches = store.getBranches();
  const transfers = store.getTransfers();
  const allGadgets = store.state.gadgets || [];
  const allSales = store.state.salesTransactions || [];
  const allRepairs = store.state.repairTickets || [];

  return `
    <div class="space-y-6 fade-in">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <h1 class="text-xl lg:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <i data-lucide="building-2" class="w-6 h-6 text-blue-400"></i>
            <span>Multi-Branch Management & Operations</span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">Manage store locations, compare sales & stock metrics, and execute inter-branch transfers.</p>
        </div>

        <button onclick="window.openModal('transfer-modal')" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-lg shadow-blue-500/20 transition">
          <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
          <span>New Stock Transfer</span>
        </button>
      </div>

      <!-- Branch Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        ${branches.map(b => {
          const branchGadgets = allGadgets.filter(g => g.branchId === b.id && g.status === 'in_stock');
          const branchSales = allSales.filter(s => s.branchId === b.id);
          const branchRepairs = allRepairs.filter(r => r.branchId === b.id && r.status !== 'Delivered');
          const branchStockVal = branchGadgets.reduce((sum, g) => sum + (g.costs?.totalLanded || 0), 0);
          const branchRevenue = branchSales.reduce((sum, s) => sum + (s.financials?.sellingPrice - (s.financials?.discount || 0)), 0);

          return `
            <div class="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between border-t-4" style="border-top-color: ${b.color}">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white" style="background-color: ${b.color}33; color: ${b.color}">
                      ${b.code}
                    </div>
                    <div>
                      <h3 class="font-bold text-white text-sm">${b.name}</h3>
                      <span class="text-[10px] text-slate-400 font-medium">${b.isHQ ? 'Central Warehouse & HQ' : 'Retail Storefront'}</span>
                    </div>
                  </div>
                  <span class="text-[10px] px-2 py-0.5 rounded-full ${b.isHQ ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'} font-semibold">
                    ${b.isHQ ? 'HQ' : 'Active'}
                  </span>
                </div>

                <div class="text-xs text-slate-400 space-y-1 mb-4">
                  <div class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-500"></i> ${b.address}</div>
                  <div class="flex items-center gap-1.5"><i data-lucide="user" class="w-3.5 h-3.5 text-slate-500"></i> Manager: <b class="text-slate-200">${b.manager}</b></div>
                </div>

                <div class="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800 text-xs">
                  <div class="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/40">
                    <div class="text-[10px] text-slate-400 font-medium">In-Stock Value</div>
                    <div class="text-sm font-bold text-white font-mono-code">$${branchStockVal.toLocaleString()}</div>
                    <div class="text-[10px] text-slate-400">${branchGadgets.length} devices</div>
                  </div>
                  <div class="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/40">
                    <div class="text-[10px] text-slate-400 font-medium">Sales Revenue</div>
                    <div class="text-sm font-bold text-emerald-400 font-mono-code">$${branchRevenue.toLocaleString()}</div>
                    <div class="text-[10px] text-slate-400">${branchSales.length} orders</div>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span class="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                  <i data-lucide="hammer" class="w-3.5 h-3.5"></i> ${branchRepairs.length} Active Repairs
                </span>
                <button onclick="window.handleSelectBranch('${b.id}')" class="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                  Focus Branch &rarr;
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Inter-Branch Transfer Manifests -->
      <div class="glass-card rounded-2xl p-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
              <i data-lucide="truck" class="w-4 h-4 text-blue-400"></i>
              Inter-Branch Stock Transfer Audit Trail
            </h2>
            <p class="text-[11px] text-slate-400">Track device IMEI movement between warehouse and retail storefronts</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono-code">${transfers.length} Transfers</span>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-left text-xs custom-table">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 font-semibold">
                <th class="py-2.5 px-3">Transfer ID</th>
                <th class="py-2.5 px-3">Date</th>
                <th class="py-2.5 px-3">Device & IMEI</th>
                <th class="py-2.5 px-3">From Branch</th>
                <th class="py-2.5 px-3">Destination Branch</th>
                <th class="py-2.5 px-3">Status</th>
                <th class="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-slate-300">
              ${transfers.map(t => {
                const fromB = store.getBranchById(t.fromBranchId);
                const toB = store.getBranchById(t.toBranchId);
                const isInTransit = t.status === 'In Transit';

                return `
                  <tr>
                    <td class="py-3 px-3 font-mono-code font-bold text-blue-400">${t.id}</td>
                    <td class="py-3 px-3 text-slate-400">${t.transferDate}</td>
                    <td class="py-3 px-3">
                      <div class="font-semibold text-white">${t.deviceModel}</div>
                      <div class="text-[10px] font-mono-code text-slate-400">IMEI: ${t.imei}</div>
                    </td>
                    <td class="py-3 px-3">
                      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        <span class="w-2 h-2 rounded-full" style="background-color: ${fromB?.color || '#94a3b8'}"></span>
                        ${fromB?.name}
                      </span>
                    </td>
                    <td class="py-3 px-3">
                      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        <span class="w-2 h-2 rounded-full" style="background-color: ${toB?.color || '#94a3b8'}"></span>
                        ${toB?.name}
                      </span>
                    </td>
                    <td class="py-3 px-3">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        isInTransit ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }">
                        ${t.status}
                      </span>
                    </td>
                    <td class="py-3 px-3 text-right">
                      ${isInTransit ? `
                        <button onclick="window.handleReceiveTransfer('${t.id}')" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition">
                          Receive Stock
                        </button>
                      ` : `
                        <span class="text-[11px] text-slate-500 font-medium">Completed</span>
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

window.renderBranchesView = renderBranchesView;
