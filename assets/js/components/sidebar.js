/**
 * NexGadget ERP - Sidebar Navigation Component
 * Covers all 11 Scope Modules with dynamic counter badges & full mobile responsiveness
 */

function renderSidebar(activeView = 'dashboard') {
  const store = window.erpStore;
  const kpis = store.getSummaryKPIs();
  const branch = store.getActiveBranch();
  const lowPartsCount = store.getSpareParts().filter(p => (p.stock[branch] || 0) <= p.minThreshold).length;

  const navItems = [
    {
      id: 'dashboard',
      label: '1. Dashboard',
      icon: 'layout-dashboard',
      badge: null
    },
    {
      id: 'branches',
      label: '2. Multi-Branch',
      icon: 'building-2',
      badge: store.getBranches().length
    },
    {
      id: 'inventory',
      label: '3 & 4. Gadget Inventory',
      subtitle: 'IMEI / SN Costing',
      icon: 'smartphone',
      badge: kpis.inStockCount
    },
    {
      id: 'tradein',
      label: '5. Trade-In Hub',
      subtitle: 'Exchange & Valuation',
      icon: 'refresh-cw',
      badge: store.state.tradeInRecords.length
    },
    {
      id: 'refurb',
      label: '6. Refurbishment',
      subtitle: 'Workshop & QC',
      icon: 'cpu',
      badge: kpis.pendingRefurbsCount > 0 ? kpis.pendingRefurbsCount : null,
      badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
    },
    {
      id: 'parts',
      label: '7. Spare Parts',
      subtitle: 'Inventory & Alerts',
      icon: 'wrench',
      badge: lowPartsCount > 0 ? `${lowPartsCount} Low` : null,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    },
    {
      id: 'repairs',
      label: '8. Repair Tickets',
      subtitle: 'Kanban & Service',
      icon: 'hammer',
      badge: kpis.activeRepairsCount > 0 ? kpis.activeRepairsCount : null,
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    },
    {
      id: 'sales',
      label: '9. POS & Device P&L',
      subtitle: 'Unit Profit Tracker',
      icon: 'receipt',
      badge: kpis.totalSalesCount
    },
    {
      id: 'aging',
      label: '10. Stock Aging',
      subtitle: 'Slow-Moving Stock',
      icon: 'hourglass',
      badge: kpis.slowMovingCount > 0 ? `${kpis.slowMovingCount} Alert` : null,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    },
    {
      id: 'reports',
      label: '11. Reports & BI',
      subtitle: 'Financial & ROI',
      icon: 'bar-chart-3',
      badge: 'PRO'
    }
  ];

  return `
    <!-- Mobile Backdrop Overlay -->
    <div id="sidebar-backdrop" onclick="window.toggleMobileSidebar(false)" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 lg:hidden hidden transition-opacity"></div>

    <!-- Sidebar Aside Drawer -->
    <aside id="sidebar-container" class="fixed lg:sticky top-0 lg:top-16 left-0 h-full lg:h-[calc(100vh-4rem)] w-72 lg:w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col z-40 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 shadow-2xl lg:shadow-none">
      
      <!-- Brand Logo (Visible on mobile top of drawer) -->
      <div class="px-5 py-4 flex items-center justify-between border-b border-slate-800/60">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <i data-lucide="zap" class="w-5 h-5 fill-current"></i>
          </div>
          <div>
            <div class="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
              NexGadget <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">ERP</span>
            </div>
            <div class="text-[10px] text-slate-400 font-medium">Electronics Chain Suite</div>
          </div>
        </div>

        <!-- Mobile Close Drawer Button -->
        <button onclick="window.toggleMobileSidebar(false)" class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Navigation Links -->
      <div class="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scroll">
        <div class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Operations
        </div>

        ${navItems.map(item => {
          const isActive = activeView === item.id;
          return `
            <button 
              onclick="window.handleNavigateAndClose('${item.id}')"
              class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between group transition duration-150 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/10 text-blue-400 border border-blue-500/40 font-semibold shadow-sm' 
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }"
            >
              <div class="flex items-center gap-3 min-w-0">
                <i data-lucide="${item.icon}" class="w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}"></i>
                <div class="truncate">
                  <div class="truncate ${isActive ? 'text-white' : ''}">${item.label}</div>
                  ${item.subtitle ? `<div class="text-[10px] text-slate-400 font-normal truncate">${item.subtitle}</div>` : ''}
                </div>
              </div>
              
              ${item.badge ? `
                <span class="text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700/60'}">
                  ${item.badge}
                </span>
              ` : ''}
            </button>
          `;
        }).join('')}
      </div>

      <!-- System Status Footer -->
      <div class="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div class="glass-card-subtle rounded-xl p-2.5 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <div class="text-[11px] font-semibold text-slate-200">Local Engine Active</div>
              <div class="text-[9px] text-slate-400">Multi-Device Responsive</div>
            </div>
          </div>
          <button 
            onclick="window.handleResetDemoData()"
            title="Reset dataset"
            class="text-[10px] text-slate-400 hover:text-amber-400 underline font-medium"
          >
            Reset
          </button>
        </div>
      </div>

    </aside>
  `;
}

window.renderSidebar = renderSidebar;

