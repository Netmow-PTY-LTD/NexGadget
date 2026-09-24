/**
 * NexGadget ERP - Scope 7: Spare Parts Management
 * Parts Inventory, Low-Stock Alerts, Branch Quantities, and Compatibility Mapping
 */

function renderPartsView() {
  const store = window.erpStore;
  const parts = store.getSpareParts();
  const branches = store.getBranches();
  const activeBranch = store.getActiveBranch();

  return `
    <div class="space-y-6 fade-in">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <h1 class="text-xl lg:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <i data-lucide="wrench" class="w-6 h-6 text-rose-400"></i>
            <span>Spare Parts Inventory & Compatibility Matrix</span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">OEM replacement screens, batteries, camera modules, and flex circuits across all branches.</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.openModal('restock-part-modal')" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-2 shadow-lg shadow-rose-500/20 transition">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Adjust / Restock Part</span>
          </button>
        </div>
      </div>

      <!-- Parts Inventory Table -->
      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs custom-table">
            <thead>
              <tr class="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold">
                <th class="py-3 px-4">Part Details & SKU</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Compatibility Models</th>
                <th class="py-3 px-4">Cost vs Retail</th>
                <th class="py-3 px-4">Branch Stock Levels</th>
                <th class="py-3 px-4">Threshold Status</th>
                <th class="py-3 px-4 text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-slate-300">
              ${parts.map(p => {
                const totalStock = Object.values(p.stock || {}).reduce((a, b) => a + b, 0);
                const currentBranchStock = activeBranch === 'ALL' ? totalStock : (p.stock[activeBranch] || 0);
                const isLowStock = currentBranchStock <= p.minThreshold;

                return `
                  <tr class="hover:bg-slate-800/40 transition">
                    <!-- Part Name & SKU -->
                    <td class="py-3 px-4">
                      <div class="font-bold text-white text-xs">${p.name}</div>
                      <div class="text-[10px] font-mono-code text-rose-400 font-semibold">SKU: ${p.sku}</div>
                      <div class="text-[10px] text-slate-400">Supplier: ${p.supplier}</div>
                    </td>

                    <!-- Category -->
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        ${p.category}
                      </span>
                    </td>

                    <!-- Compatibility -->
                    <td class="py-3 px-4">
                      <div class="flex flex-wrap gap-1 max-w-xs">
                        ${p.compatibility.map(c => `
                          <span class="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-medium">
                            ${c}
                          </span>
                        `).join('')}
                      </div>
                    </td>

                    <!-- Pricing -->
                    <td class="py-3 px-4 font-mono-code">
                      <div class="text-xs font-bold text-white">Cost: $${p.costPrice}</div>
                      <div class="text-[10px] text-emerald-400 font-semibold">Retail: $${p.retailPrice}</div>
                    </td>

                    <!-- Stock per branch -->
                    <td class="py-3 px-4">
                      <div class="space-y-1 text-[10px]">
                        ${branches.map(b => {
                          const qty = p.stock[b.id] || 0;
                          return `
                            <div class="flex items-center justify-between gap-2">
                              <span class="text-slate-400">${b.code}:</span>
                              <span class="font-mono-code font-bold ${qty <= p.minThreshold ? 'text-rose-400' : 'text-slate-200'}">${qty} units</span>
                            </div>
                          `;
                        }).join('')}
                      </div>
                    </td>

                    <!-- Status -->
                    <td class="py-3 px-4">
                      ${isLowStock ? `
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-max animate-pulse">
                          <i data-lucide="alert-triangle" class="w-3 h-3"></i> Low Stock (Min: ${p.minThreshold})
                        </span>
                      ` : `
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-max">
                          Optimal (${currentBranchStock} Available)
                        </span>
                      `}
                    </td>

                    <!-- Action -->
                    <td class="py-3 px-4 text-right">
                      <button onclick="window.openRestockModalForPart('${p.id}')" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">
                        + Restock
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

window.renderPartsView = renderPartsView;
