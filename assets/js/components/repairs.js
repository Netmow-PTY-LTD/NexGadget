/**
 * NexGadget ERP - Scope 8: Repair Management
 * Customer Service Tickets, Interactive Kanban Workflow, Parts Billing & Warranty
 */

function renderRepairsView() {
  const store = window.erpStore;
  const branch = store.getActiveBranch();
  const tickets = store.getRepairTickets(branch);

  const stages = [
    { id: 'Received', label: 'Received / Intake', color: 'border-t-blue-500' },
    { id: 'Diagnostic', label: 'Diagnostics', color: 'border-t-indigo-500' },
    { id: 'Waiting for Parts', label: 'Waiting for Parts', color: 'border-t-amber-500' },
    { id: 'In Progress', label: 'In Repair', color: 'border-t-purple-500' },
    { id: 'Ready for Pickup', label: 'Ready for Pickup', color: 'border-t-emerald-500' },
    { id: 'Delivered', label: 'Delivered / Closed', color: 'border-t-slate-500' }
  ];

  return `
    <div class="space-y-6 fade-in">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <h1 class="text-xl lg:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <i data-lucide="hammer" class="w-6 h-6 text-amber-400"></i>
            <span>Repair & Service Ticketing Hub</span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">Interactive Kanban service lifecycle, technician assignments, spare parts billing, and warranty certificates.</p>
        </div>

        <button onclick="window.openModal('new-repair-modal')" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-2 shadow-lg shadow-amber-500/20 transition">
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>Create Repair Ticket</span>
        </button>
      </div>

      <!-- Kanban Board Container -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        ${stages.map(stage => {
          const stageTickets = tickets.filter(t => t.status === stage.id);

          return `
            <div class="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 flex flex-col kanban-col ${stage.color} border-t-4">
              
              <!-- Column Header -->
              <div class="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div class="font-bold text-xs text-white truncate">${stage.label}</div>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono-code font-semibold">
                  ${stageTickets.length}
                </span>
              </div>

              <!-- Ticket Cards -->
              <div class="space-y-3 flex-1 overflow-y-auto custom-scroll pr-0.5">
                ${stageTickets.map(t => {
                  const branchObj = store.getBranchById(t.branchId);

                  return `
                    <div class="glass-card-subtle rounded-xl p-3.5 border border-slate-700/60 kanban-card space-y-2 relative">
                      <!-- Ticket ID & Priority -->
                      <div class="flex items-center justify-between">
                        <span class="text-[11px] font-bold text-blue-400 font-mono-code">${t.id}</span>
                        <span class="text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                          t.priority === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          t.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                        }">
                          ${t.priority}
                        </span>
                      </div>

                      <!-- Customer & Device -->
                      <div>
                        <div class="font-bold text-white text-xs">${t.device}</div>
                        <div class="text-[10px] text-slate-400">${t.customerName} • ${t.customerPhone}</div>
                        <div class="text-[9px] text-slate-500 font-mono-code">SN: ${t.imei}</div>
                      </div>

                      <!-- Problem description -->
                      <div class="text-[10px] text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80 leading-relaxed">
                        ${t.problemDescription}
                      </div>

                      <!-- Financials & Tech -->
                      <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                        <div>
                          <div class="text-slate-400">Est. Bill: <b class="text-white font-mono-code">$${t.totalBill || t.estimatedCost}</b></div>
                          <div class="text-emerald-400">Dep: $${t.advanceDeposit}</div>
                        </div>
                        <div class="text-right">
                          <div class="text-slate-400">Tech:</div>
                          <div class="font-semibold text-slate-300 truncate max-w-[80px]">${t.technician}</div>
                        </div>
                      </div>

                      <!-- Stage Movement Controls -->
                      <div class="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <select onchange="window.handleUpdateRepairStatus('${t.id}', this.value)" class="bg-slate-800 border border-slate-700 text-slate-200 text-[10px] rounded px-1.5 py-1 focus:outline-none">
                          <option value="" disabled selected>Move Stage &darr;</option>
                          ${stages.map(s => `
                            <option value="${s.id}" ${t.status === s.id ? 'disabled' : ''}>To: ${s.id}</option>
                          `).join('')}
                        </select>

                        <button onclick="window.openRepairDetailModal('${t.id}')" title="Repair invoice & parts" class="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition">
                          <i data-lucide="receipt" class="w-3.5 h-3.5"></i>
                        </button>
                      </div>

                    </div>
                  `;
                }).join('')}

                ${stageTickets.length === 0 ? `
                  <div class="py-8 text-center text-slate-600 text-[11px] border border-dashed border-slate-800 rounded-xl">
                    No tickets in this stage
                  </div>
                ` : ''}
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

window.renderRepairsView = renderRepairsView;
