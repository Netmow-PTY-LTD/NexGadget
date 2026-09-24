/**
 * NexGadget ERP - Scope 3 & 4: New & Used Gadget Management + IMEI/SN Costing Engine
 * Detailed item-level ledger, landed cost formula, battery health, and lifecycle audit trail
 */

function renderInventoryView() {
  const store = window.erpStore;
  const branch = store.getActiveBranch();
  const gadgets = store.getGadgets(branch);

  return `
    <div class="space-y-6 fade-in">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <h1 class="text-xl lg:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <i data-lucide="smartphone" class="w-6 h-6 text-blue-400"></i>
            <span>Gadget Inventory & IMEI Costing Engine</span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">Item-level granular costing: Total Cost = Acquisition + Parts Consumed + Labor + Logistics.</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.openModal('add-gadget-modal')" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-blue-500/20 transition">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>Add New Device (IMEI)</span>
          </button>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2 text-xs flex-1">
          
          <!-- Category Filter -->
          <select id="inv-category-filter" onchange="window.handleInventoryFilterChange()" class="bg-slate-800 border border-slate-700/80 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500">
            <option value="ALL">All Categories</option>
            <option value="Smartphone">Smartphones</option>
            <option value="Laptop">Laptops</option>
            <option value="Tablet">Tablets</option>
            <option value="Smartwatch">Smartwatches</option>
            <option value="Gaming">Gaming Consoles</option>
          </select>

          <!-- Condition Filter -->
          <select id="inv-condition-filter" onchange="window.handleInventoryFilterChange()" class="bg-slate-800 border border-slate-700/80 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500">
            <option value="ALL">All Conditions</option>
            <option value="Brand New">Brand New</option>
            <option value="Refurbished">Refurbished</option>
            <option value="Pre-Owned">Pre-Owned</option>
            <option value="Open Box">Open Box</option>
          </select>

          <!-- Status Filter -->
          <select id="inv-status-filter" onchange="window.handleInventoryFilterChange()" class="bg-slate-800 border border-slate-700/80 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500">
            <option value="ALL">All Statuses</option>
            <option value="in_stock" selected>In Stock</option>
            <option value="in_refurb">In Refurbishment</option>
            <option value="in_transfer">In Transfer</option>
            <option value="sold">Sold</option>
          </select>

        </div>

        <div class="text-xs text-slate-400 font-medium">
          Showing <span id="inventory-count-label" class="text-white font-bold">${gadgets.length}</span> devices
        </div>
      </div>

      <!-- Inventory Devices Data Table -->
      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs custom-table">
            <thead>
              <tr class="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold">
                <th class="py-3 px-4">Device & Specifications</th>
                <th class="py-3 px-4">IMEI / Serial</th>
                <th class="py-3 px-4">Condition & Grade</th>
                <th class="py-3 px-4">Branch</th>
                <th class="py-3 px-4">Landed Cost Breakdown</th>
                <th class="py-3 px-4">Selling Price</th>
                <th class="py-3 px-4">Margin %</th>
                <th class="py-3 px-4">Status & Aging</th>
                <th class="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody id="inventory-table-body" class="divide-y divide-slate-800/60 text-slate-300">
              ${renderInventoryRows(gadgets)}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function renderInventoryRows(gadgets) {
  const store = window.erpStore;

  if (gadgets.length === 0) {
    return `
      <tr>
        <td colspan="9" class="py-8 text-center text-slate-400 text-xs">
          No gadgets match the current filter criteria.
        </td>
      </tr>
    `;
  }

  return gadgets.map(g => {
    const branch = store.getBranchById(g.branchId);
    const landedCost = g.costs?.totalLanded || (g.costs?.acquisition + g.costs?.parts + g.costs?.labor + g.costs?.logistics) || 0;
    const price = g.sellingPrice || 0;
    const profit = price - landedCost;
    const marginPct = price > 0 ? ((profit / price) * 100).toFixed(1) : 0;

    let conditionBadgeClass = 'badge-new';
    if (g.condition === 'Pre-Owned') conditionBadgeClass = 'badge-used';
    else if (g.condition === 'Refurbished') conditionBadgeClass = 'badge-refurb';
    else if (g.condition === 'Open Box') conditionBadgeClass = 'badge-instock';

    let statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold badge-instock">In Stock</span>`;
    if (g.status === 'in_refurb') {
      statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">In Refurb</span>`;
    } else if (g.status === 'in_transfer') {
      statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">In Transit</span>`;
    } else if (g.status === 'sold') {
      statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold badge-sold">Sold</span>`;
    }

    // Aging color
    let agingClass = 'text-emerald-400';
    if (g.agingDays > 90) agingClass = 'text-rose-400 font-bold';
    else if (g.agingDays > 60) agingClass = 'text-amber-400 font-semibold';
    else if (g.agingDays > 30) agingClass = 'text-yellow-300';

    return `
      <tr class="hover:bg-slate-800/40 transition">
        <!-- Device Info -->
        <td class="py-3 px-4">
          <div class="font-bold text-white text-xs">${g.brand} ${g.model}</div>
          <div class="text-[10px] text-slate-400">${g.variant} • ${g.category}</div>
          ${g.batteryHealth ? `<div class="text-[9px] text-slate-500 font-mono-code mt-0.5"><i data-lucide="battery" class="w-3 h-3 inline"></i> Health: ${g.batteryHealth}%</div>` : ''}
        </td>

        <!-- IMEI / Serial -->
        <td class="py-3 px-4 font-mono-code">
          <div class="text-blue-400 font-semibold">${g.imei}</div>
          <div class="text-[10px] text-slate-500">SN: ${g.serial}</div>
        </td>

        <!-- Condition -->
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${conditionBadgeClass}">
            ${g.condition}
          </span>
          <div class="text-[10px] text-slate-400 mt-1">${g.grade}</div>
        </td>

        <!-- Branch -->
        <td class="py-3 px-4">
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[11px]">
            <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${branch?.color || '#3b82f6'}"></span>
            ${branch?.name || 'HQ'}
          </span>
        </td>

        <!-- True Landed Cost Breakdown -->
        <td class="py-3 px-4">
          <div class="font-bold text-white font-mono-code text-xs">$${landedCost.toLocaleString()}</div>
          <div class="text-[9px] text-slate-400 space-x-1 font-mono-code mt-0.5">
            <span title="Acquisition Cost">Acq:$${g.costs.acquisition}</span>
            <span title="Parts Consumed">Prt:$${g.costs.parts}</span>
            <span title="Refurb Labor">Lab:$${g.costs.labor}</span>
          </div>
        </td>

        <!-- Selling Price -->
        <td class="py-3 px-4 font-mono-code">
          <div class="font-bold text-emerald-400 text-xs">$${price.toLocaleString()}</div>
          ${g.markdownDiscount ? `<span class="text-[9px] text-rose-400">-$${g.markdownDiscount} promo</span>` : ''}
        </td>

        <!-- Margin % -->
        <td class="py-3 px-4 font-mono-code">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${marginPct >= 20 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}">
            +${marginPct}%
          </span>
          <div class="text-[9px] text-slate-500 mt-0.5">+$${profit}</div>
        </td>

        <!-- Status & Aging -->
        <td class="py-3 px-4">
          <div>${statusBadge}</div>
          <div class="text-[10px] mt-1 ${agingClass}">${g.agingDays} days in stock</div>
        </td>

        <!-- Actions -->
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button 
              onclick="window.openImeiDrawer('${g.id}')" 
              title="View IMEI Cost Sheet & Lifecycle Audit"
              class="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg border border-slate-700 transition"
            >
              <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
            </button>

            ${g.status === 'in_stock' ? `
              <button 
                onclick="window.quickPosForDevice('${g.id}')"
                title="Instant POS Sale"
                class="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
              >
                <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.renderInventoryView = renderInventoryView;
window.renderInventoryRows = renderInventoryRows;
