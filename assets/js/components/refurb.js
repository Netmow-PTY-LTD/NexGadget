/**
 * NexGadget ERP - Scope 6: Refurbishment Management
 * Job Cards, Spare Parts Consumed Linkage, 12-Point QC Checklist, Landed Cost Recalculation
 */

function renderRefurbView() {
  const store = window.erpStore;
  const branch = store.getActiveBranch();
  const orders = store.getRefurbOrders(branch);
  const parts = store.getSpareParts();

  return `
    <div class="space-y-6 fade-in">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <h1 class="text-xl lg:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <i data-lucide="cpu" class="w-6 h-6 text-purple-400"></i>
            <span>Refurbishment Management & Workshop</span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">Link spare parts consumed directly to device IMEI landed cost and verify 12-point quality testing.</p>
        </div>
      </div>

      <!-- Active Refurbishment Job Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        ${orders.map(o => {
          const gadget = store.getGadgetById(o.deviceId);
          const branchObj = store.getBranchById(o.branchId);
          const isCompleted = o.status === 'Completed';
          const partsTotal = (o.partsConsumed || []).reduce((sum, p) => sum + p.cost, 0);

          return `
            <div class="glass-card rounded-2xl p-5 border-l-4 ${isCompleted ? 'border-l-emerald-500' : 'border-l-purple-500'} flex flex-col justify-between">
              <div>
                <!-- Top Info Row -->
                <div class="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-mono-code font-bold text-sm text-purple-400">${o.id}</span>
                      <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30 animate-pulse'
                      }">
                        ${o.status}
                      </span>
                    </div>
                    <h3 class="font-bold text-white text-sm mt-1">${o.deviceModel}</h3>
                    <div class="text-[10px] font-mono-code text-slate-400">IMEI: ${o.imei} • Branch: ${branchObj?.name}</div>
                  </div>

                  <div class="text-right text-xs">
                    <div class="text-slate-400 text-[10px]">Assigned Tech</div>
                    <div class="font-semibold text-slate-200">${o.technician}</div>
                  </div>
                </div>

                <!-- Parts Consumed & Cost Linkage -->
                <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 mb-3 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-slate-300 flex items-center gap-1.5">
                      <i data-lucide="wrench" class="w-3.5 h-3.5 text-purple-400"></i>
                      Spare Parts Consumed & Landed Cost Impact
                    </span>
                    <span class="font-mono-code font-bold text-purple-400 text-xs">+$${partsTotal + (o.laborCost || 0)} Total</span>
                  </div>

                  <div class="divide-y divide-slate-800 text-[11px] text-slate-300">
                    ${(o.partsConsumed || []).map(p => `
                      <div class="py-1.5 flex justify-between">
                        <span>• ${p.name} (x${p.qty})</span>
                        <span class="font-mono-code font-semibold text-rose-400">+$${p.cost}</span>
                      </div>
                    `).join('')}
                    ${o.laborCost ? `
                      <div class="py-1.5 flex justify-between text-slate-400">
                        <span>• Technician Labor</span>
                        <span class="font-mono-code font-semibold text-rose-400">+$${o.laborCost}</span>
                      </div>
                    ` : ''}
                    ${(!o.partsConsumed || o.partsConsumed.length === 0) ? `
                      <div class="py-1 text-slate-500 text-[10px]">No parts consumed yet.</div>
                    ` : ''}
                  </div>

                  <!-- Quick Add Part Dropdown (If active) -->
                  ${!isCompleted ? `
                    <div class="pt-2 border-t border-slate-800 flex items-center gap-2">
                      <select id="refurb-part-select-${o.id}" class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none">
                        ${parts.map(p => `
                          <option value="${p.id}">${p.name} ($${p.costPrice})</option>
                        `).join('')}
                      </select>
                      <button onclick="window.handleConsumePartInRefurb('${o.id}')" class="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow transition">
                        Attach Part
                      </button>
                    </div>
                  ` : ''}
                </div>

                <!-- 12-Point QC Checklist -->
                <div class="space-y-1.5">
                  <div class="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>12-Point Quality Control (QC)</span>
                    <span class="text-[10px] text-slate-400 font-normal">Passed ${Object.values(o.qcChecklist || {}).filter(Boolean).length}/12</span>
                  </div>

                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px]">
                    ${Object.entries(o.qcChecklist || {}).map(([key, val]) => `
                      <div class="flex items-center gap-1.5 p-1.5 rounded-lg ${val ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800/40 text-slate-400 border border-slate-800'}">
                        <i data-lucide="${val ? 'check-circle-2' : 'circle'}" class="w-3 h-3 flex-shrink-0"></i>
                        <span class="capitalize truncate">${key.replace(/([A-Z])/g, ' $1')}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div class="text-slate-400 text-[11px]">
                  Current IMEI Landed Cost: <b class="text-white font-mono-code">$${gadget?.costs?.totalLanded || 0}</b>
                </div>

                ${!isCompleted ? `
                  <button onclick="window.handleCompleteRefurb('${o.id}')" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md transition flex items-center gap-1.5">
                    <i data-lucide="check" class="w-3.5 h-3.5"></i>
                    <span>Pass QC & Move to Stock</span>
                  </button>
                ` : `
                  <span class="text-emerald-400 font-semibold flex items-center gap-1 text-xs">
                    <i data-lucide="check-check" class="w-4 h-4"></i> Listed for Sale (Grade A+)
                  </span>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

window.renderRefurbView = renderRefurbView;
