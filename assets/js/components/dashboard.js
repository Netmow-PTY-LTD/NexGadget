/**
 * NexGadget ERP - Scope 1: Management Dashboard
 * Executive Overview, KPI cards, Financial Charts, Activity Timeline
 */

function renderDashboardView() {
  const store = window.erpStore;
  const kpis = store.getSummaryKPIs();
  const branch = store.getActiveBranch();
  const branchObj = store.getBranchById(branch);
  const activities = store.state.activityLogs || [];
  const gadgets = store.getGadgets(branch);
  const sales = store.getSales(branch);

  // Group inventory by condition
  const newCount = gadgets.filter(g => g.condition === 'Brand New' && g.status === 'in_stock').length;
  const usedCount = gadgets.filter(g => g.condition === 'Pre-Owned' && g.status === 'in_stock').length;
  const refurbCount = gadgets.filter(g => g.condition === 'Refurbished' && g.status === 'in_stock').length;
  const openBoxCount = gadgets.filter(g => g.condition === 'Open Box' && g.status === 'in_stock').length;

  return `
    <div class="space-y-6 fade-in">
      
      <!-- Top Title Bar & Filter Status -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <h1 class="text-xl lg:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Executive Dashboard</span>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ${branch === 'ALL' ? 'Consolidated All Branches' : branchObj?.name}
            </span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">Real-time financial, IMEI inventory, and repair operations metrics.</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.openModal('pos-sale-modal')" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition">
            <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
            <span>Quick POS Sale</span>
          </button>
          <button onclick="window.openModal('tradein-intake-modal')" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition">
            <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-amber-400"></i>
            <span>Trade-In Valuation</span>
          </button>
        </div>
      </div>

      <!-- KPI Grid (6 Top Metrics) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        <!-- Total In-Stock Landed Cost -->
        <div class="glass-card rounded-2xl p-4 relative overflow-hidden border-l-4 border-l-blue-500">
          <div class="flex items-center justify-between text-slate-400 mb-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider">Inventory Value</span>
            <i data-lucide="boxes" class="w-4 h-4 text-blue-400"></i>
          </div>
          <div class="text-xl font-bold text-white font-mono-code">$${kpis.totalInventoryValue.toLocaleString()}</div>
          <div class="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span class="text-emerald-400 font-semibold">${kpis.inStockCount} Units</span> in stock
          </div>
        </div>

        <!-- Realized Net Sales -->
        <div class="glass-card rounded-2xl p-4 relative overflow-hidden border-l-4 border-l-emerald-500">
          <div class="flex items-center justify-between text-slate-400 mb-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider">Realized Sales</span>
            <i data-lucide="dollar-sign" class="w-4 h-4 text-emerald-400"></i>
          </div>
          <div class="text-xl font-bold text-white font-mono-code">$${kpis.totalNetSales.toLocaleString()}</div>
          <div class="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span class="text-emerald-400 font-semibold">${kpis.totalSalesCount} devices</span> sold
          </div>
        </div>

        <!-- Realized Gross Profit -->
        <div class="glass-card rounded-2xl p-4 relative overflow-hidden border-l-4 border-l-indigo-500">
          <div class="flex items-center justify-between text-slate-400 mb-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider">Gross Profit</span>
            <i data-lucide="trending-up" class="w-4 h-4 text-indigo-400"></i>
          </div>
          <div class="text-xl font-bold text-indigo-400 font-mono-code">$${kpis.totalRealizedProfit.toLocaleString()}</div>
          <div class="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span class="text-indigo-300 font-semibold">${kpis.overallMargin}%</span> avg margin
          </div>
        </div>

        <!-- Active Repairs -->
        <div class="glass-card rounded-2xl p-4 relative overflow-hidden border-l-4 border-l-amber-500">
          <div class="flex items-center justify-between text-slate-400 mb-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider">Active Repairs</span>
            <i data-lucide="hammer" class="w-4 h-4 text-amber-400"></i>
          </div>
          <div class="text-xl font-bold text-amber-400 font-mono-code">${kpis.activeRepairsCount}</div>
          <div class="text-[10px] text-slate-400 mt-1">In service queue</div>
        </div>

        <!-- Pending Refurbishment -->
        <div class="glass-card rounded-2xl p-4 relative overflow-hidden border-l-4 border-l-purple-500">
          <div class="flex items-center justify-between text-slate-400 mb-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider">Refurb Workshop</span>
            <i data-lucide="cpu" class="w-4 h-4 text-purple-400"></i>
          </div>
          <div class="text-xl font-bold text-purple-400 font-mono-code">${kpis.pendingRefurbsCount}</div>
          <div class="text-[10px] text-slate-400 mt-1">Units restoring</div>
        </div>

        <!-- Slow Moving Stock Alert -->
        <div class="glass-card rounded-2xl p-4 relative overflow-hidden border-l-4 border-l-rose-500">
          <div class="flex items-center justify-between text-slate-400 mb-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider">Aging Stock</span>
            <i data-lucide="hourglass" class="w-4 h-4 text-rose-400"></i>
          </div>
          <div class="text-xl font-bold text-rose-400 font-mono-code">${kpis.slowMovingCount}</div>
          <div class="text-[10px] text-slate-400 mt-1">&gt;60 days in shelf</div>
        </div>

      </div>

      <!-- Charts Section (2-Column Grid) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Sales & Profit Analytics Chart (2 Cols) -->
        <div class="lg:col-span-2 glass-card rounded-2xl p-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <i data-lucide="bar-chart-2" class="w-4 h-4 text-blue-400"></i>
                Revenue vs Realized Gross Profit Trend
              </h2>
              <p class="text-[11px] text-slate-400">Comparison of device selling price vs net profit after IMEI landed costs</p>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">Monthly / Weekly</span>
          </div>

          <div class="mt-4 h-64 relative">
            <canvas id="revenueProfitChart"></canvas>
          </div>
        </div>

        <!-- Inventory Condition Breakdown (1 Col) -->
        <div class="glass-card rounded-2xl p-5 flex flex-col justify-between">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <i data-lucide="pie-chart" class="w-4 h-4 text-emerald-400"></i>
                Condition Share
              </h2>
              <p class="text-[11px] text-slate-400">Stock distribution by grade</p>
            </div>
          </div>

          <div class="my-auto h-48 relative">
            <canvas id="conditionShareChart"></canvas>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800/80">
            <div class="flex items-center gap-1.5 text-slate-300">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>New: <b>${newCount}</b></span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-300">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Used: <b>${usedCount}</b></span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-300">
              <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>Refurb: <b>${refurbCount}</b></span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-300">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Open Box: <b>${openBoxCount}</b></span>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Row: Recent Sales & Live Operations Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Recent Device Sales (With Margin %) -->
        <div class="glass-card rounded-2xl p-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <i data-lucide="receipt" class="w-4 h-4 text-emerald-400"></i>
                Recent Device Sales & P&L Margins
              </h2>
              <p class="text-[11px] text-slate-400">Real-time individual IMEI profit realized</p>
            </div>
            <button onclick="window.navigateToView('sales')" class="text-xs text-blue-400 hover:text-blue-300 font-semibold">View All &rarr;</button>
          </div>

          <div class="mt-3 divide-y divide-slate-800/60">
            ${sales.slice(0, 4).map(s => `
              <div class="py-2.5 flex items-center justify-between text-xs">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                    $
                  </div>
                  <div>
                    <div class="font-semibold text-slate-200">${s.device.model}</div>
                    <div class="text-[10px] text-slate-400 font-mono-code">IMEI: ${s.device.imei.slice(0, 6)}...${s.device.imei.slice(-4)} • ${s.customer.name}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-white font-mono-code">$${s.financials.sellingPrice}</div>
                  <div class="text-[10px] text-emerald-400 font-semibold">+$${s.financials.realizedProfit} (${s.financials.marginPercent}%)</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Live Operations Feed -->
        <div class="glass-card rounded-2xl p-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <i data-lucide="activity" class="w-4 h-4 text-indigo-400"></i>
                Live Operations Activity Feed
              </h2>
              <p class="text-[11px] text-slate-400">Transfers, repair intake, refurbishments, and audits</p>
            </div>
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div class="mt-3 space-y-3 max-h-64 overflow-y-auto custom-scroll pr-1">
            ${activities.slice(0, 5).map(act => `
              <div class="flex items-start gap-3 text-xs p-2 rounded-xl bg-slate-800/40 border border-slate-700/30">
                <div class="w-2 h-2 rounded-full mt-1.5 ${
                  act.type === 'sale' ? 'bg-emerald-400' :
                  act.type === 'repair' ? 'bg-amber-400' :
                  act.type === 'refurb' ? 'bg-purple-400' :
                  act.type === 'tradein' ? 'bg-blue-400' : 'bg-sky-400'
                }"></div>
                <div class="flex-1 min-w-0">
                  <div class="text-slate-300 leading-snug">${act.message}</div>
                  <div class="text-[10px] text-slate-500 mt-0.5">${act.timestamp} • By ${act.user}</div>
                </div>
                <span class="text-[9px] px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 font-medium">
                  ${act.badge}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

    </div>
  `;
}

function initDashboardCharts() {
  const store = window.erpStore;
  const branch = store.getActiveBranch();
  const sales = store.getSales(branch);
  const gadgets = store.getGadgets(branch);

  // 1. Revenue vs Profit Chart
  const ctxRev = document.getElementById('revenueProfitChart');
  if (ctxRev) {
    const labels = ['May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026 (MTD)'];
    const revenueData = [18400, 22600, 19800, 26400, 28950];
    const profitData = [4800, 6100, 5200, 7400, 8120];

    new Chart(ctxRev, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Revenue ($)',
            data: revenueData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointBackgroundColor: '#3b82f6',
            pointRadius: 4
          },
          {
            label: 'Gross Profit ($)',
            data: profitData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointBackgroundColor: '#10b981',
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#94a3b8', font: { size: 11 } }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });
  }

  // 2. Condition Share Doughnut Chart
  const ctxCond = document.getElementById('conditionShareChart');
  if (ctxCond) {
    const newCount = gadgets.filter(g => g.condition === 'Brand New' && g.status === 'in_stock').length || 1;
    const usedCount = gadgets.filter(g => g.condition === 'Pre-Owned' && g.status === 'in_stock').length || 1;
    const refurbCount = gadgets.filter(g => g.condition === 'Refurbished' && g.status === 'in_stock').length || 1;
    const openBoxCount = gadgets.filter(g => g.condition === 'Open Box' && g.status === 'in_stock').length || 1;

    new Chart(ctxCond, {
      type: 'doughnut',
      data: {
        labels: ['Brand New', 'Pre-Owned', 'Refurbished', 'Open Box'],
        datasets: [{
          data: [newCount, usedCount, refurbCount, openBoxCount],
          backgroundColor: ['#3b82f6', '#f59e0b', '#a855f7', '#10b981'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        cutout: '70%'
      }
    });
  }
}

window.renderDashboardView = renderDashboardView;
window.initDashboardCharts = initDashboardCharts;
