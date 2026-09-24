/**
 * NexGadget ERP - Top Navigation Bar Component
 */

function renderNavbar() {
  const activeBranch = window.erpStore.getActiveBranch();
  const branches = window.erpStore.getBranches();
  const activeBranchObj = window.erpStore.getBranchById(activeBranch);

  return `
    <header class="h-16 border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      <!-- Left: Mobile Toggle & Global Search -->
      <div class="flex items-center gap-2 sm:gap-4 flex-1 max-w-xl">
        <button 
          id="mobile-menu-btn" 
          onclick="window.toggleMobileSidebar(true)" 
          class="lg:hidden p-2 text-slate-300 hover:text-white rounded-xl bg-slate-800/80 border border-slate-700/60 hover:bg-slate-800 transition"
          aria-label="Open Navigation Menu"
        >
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>

        <div class="relative w-full max-w-xs sm:max-w-md">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input 
            type="text" 
            id="global-search-input"
            placeholder="Search IMEI, Serial, Model..." 
            class="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner"
          />
        </div>
      </div>

      <!-- Right: Branch Switcher, Quick Actions, Notifications, User Profile -->
      <div class="flex items-center gap-1.5 sm:gap-3">
        
        <!-- Multi-Branch Selector -->
        <div class="relative">
          <button 
            id="branch-dropdown-btn" 
            class="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:border-blue-500/50 hover:bg-slate-800 transition shadow-sm"
          >
            <span class="w-2 h-2 rounded-full ${activeBranch === 'ALL' ? 'bg-blue-400' : 'bg-emerald-400'} animate-pulse"></span>
            <span class="hidden md:inline">${activeBranch === 'ALL' ? 'All Branches (Consolidated)' : activeBranchObj?.name}</span>
            <span class="md:hidden text-[11px] font-mono-code">${activeBranch === 'ALL' ? 'All Branches' : activeBranchObj?.code}</span>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
          </button>

          <!-- Branch Dropdown Menu -->
          <div id="branch-dropdown-menu" class="hidden absolute right-0 mt-2 w-64 glass-dropdown rounded-2xl p-2 z-50 fade-in">
            <div class="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
              Select Operating Branch
            </div>
            <div class="mt-1 space-y-1">
              <button 
                onclick="window.handleSelectBranch('ALL')" 
                class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${activeBranch === 'ALL' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold' : 'text-slate-300 hover:bg-slate-800/80'}"
              >
                <div class="flex items-center gap-2">
                  <i data-lucide="layers" class="w-4 h-4 text-blue-400"></i>
                  <span>All Branches (Consolidated)</span>
                </div>
                ${activeBranch === 'ALL' ? '<i data-lucide="check" class="w-4 h-4 text-blue-400"></i>' : ''}
              </button>

              ${branches.map(b => `
                <button 
                  onclick="window.handleSelectBranch('${b.id}')" 
                  class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${activeBranch === b.id ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-semibold' : 'text-slate-300 hover:bg-slate-800/80'}"
                >
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${b.color}"></span>
                    <div>
                      <div class="font-medium">${b.name}</div>
                      <div class="text-[10px] text-slate-400">${b.code} • ${b.isHQ ? 'HQ Warehouse' : 'Retail'}</div>
                    </div>
                  </div>
                  ${activeBranch === b.id ? '<i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>' : ''}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Quick Launch Action Button -->
        <div class="relative">
          <button 
            id="quick-actions-btn"
            class="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition active:scale-95"
          >
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span class="hidden sm:inline">Action</span>
          </button>

          <!-- Quick Actions Menu -->
          <div id="quick-actions-menu" class="hidden absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl p-2 z-50 fade-in">
            <button onclick="window.openModal('pos-sale-modal')" class="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-blue-600/20 hover:text-blue-400 flex items-center gap-2.5 transition">
              <i data-lucide="shopping-cart" class="w-4 h-4 text-blue-400"></i>
              <div>
                <div class="font-semibold">New Device Sale (POS)</div>
                <div class="text-[10px] text-slate-400">Instant IMEI P&L checkout</div>
              </div>
            </button>
            <button onclick="window.openModal('tradein-intake-modal')" class="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-amber-600/20 hover:text-amber-400 flex items-center gap-2.5 transition">
              <i data-lucide="refresh-cw" class="w-4 h-4 text-amber-400"></i>
              <div>
                <div class="font-semibold">Trade-In Intake</div>
                <div class="text-[10px] text-slate-400">Evaluate & issue voucher</div>
              </div>
            </button>
            <button onclick="window.openModal('new-repair-modal')" class="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-purple-600/20 hover:text-purple-400 flex items-center gap-2.5 transition">
              <i data-lucide="wrench" class="w-4 h-4 text-purple-400"></i>
              <div>
                <div class="font-semibold">New Repair Ticket</div>
                <div class="text-[10px] text-slate-400">Customer service intake</div>
              </div>
            </button>
            <button onclick="window.openModal('add-gadget-modal')" class="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-emerald-600/20 hover:text-emerald-400 flex items-center gap-2.5 transition">
              <i data-lucide="smartphone" class="w-4 h-4 text-emerald-400"></i>
              <div>
                <div class="font-semibold">Add New Device</div>
                <div class="text-[10px] text-slate-400">IMEI cost & inventory entry</div>
              </div>
            </button>
            <button onclick="window.openModal('transfer-modal')" class="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-sky-600/20 hover:text-sky-400 flex items-center gap-2.5 transition">
              <i data-lucide="arrow-left-right" class="w-4 h-4 text-sky-400"></i>
              <div>
                <div class="font-semibold">Inter-Branch Transfer</div>
                <div class="text-[10px] text-slate-400">Move device / parts</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Reset Demo Data Button -->
        <button 
          onclick="window.handleResetDemoData()"
          title="Reset to initial seed demo data"
          class="p-2 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-800/80 border border-slate-700/50 transition"
        >
          <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
        </button>

        <!-- User Profile Pill -->
        <div class="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
            MV
          </div>
          <div class="hidden xl:block text-left">
            <div class="text-xs font-semibold text-slate-200 leading-tight">Marcus Vance</div>
            <div class="text-[10px] text-slate-400">HQ Admin</div>
          </div>
        </div>

      </div>
    </header>
  `;
}

window.renderNavbar = renderNavbar;

