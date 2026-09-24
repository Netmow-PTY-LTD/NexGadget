/**
 * NexGadget ERP - Main Application Controller & View Router
 * Orchestrates event handling, modal dialogs, reactive re-rendering, and toast notifications.
 */

class ERPApp {
  constructor() {
    this.currentView = 'dashboard';
    this.init();
  }

  init() {
    // Subscribe to store updates to trigger UI refreshes
    window.erpStore.subscribe(() => {
      this.render();
    });

    // Initial render
    this.render();

    // Bind Global Keyboard Shortcuts (Esc to close modals)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      const branchBtn = document.getElementById('branch-dropdown-btn');
      const branchMenu = document.getElementById('branch-dropdown-menu');
      if (branchBtn && branchMenu && !branchBtn.contains(e.target) && !branchMenu.contains(e.target)) {
        branchMenu.classList.add('hidden');
      }

      const quickBtn = document.getElementById('quick-actions-btn');
      const quickMenu = document.getElementById('quick-actions-menu');
      if (quickBtn && quickMenu && !quickBtn.contains(e.target) && !quickMenu.contains(e.target)) {
        quickMenu.classList.add('hidden');
      }
    });
  }

  render() {
    const navbarContainer = document.getElementById('navbar-root');
    const sidebarContainer = document.getElementById('sidebar-root');
    const contentContainer = document.getElementById('main-content-root');
    const modalsContainer = document.getElementById('modals-container-root');

    if (navbarContainer) navbarContainer.innerHTML = window.renderNavbar();
    if (sidebarContainer) sidebarContainer.innerHTML = window.renderSidebar(this.currentView);
    if (modalsContainer) modalsContainer.innerHTML = window.renderModalsContainer();

    // Render the active view
    if (contentContainer) {
      switch (this.currentView) {
        case 'dashboard':
          contentContainer.innerHTML = window.renderDashboardView();
          setTimeout(() => window.initDashboardCharts(), 50);
          break;
        case 'branches':
          contentContainer.innerHTML = window.renderBranchesView();
          break;
        case 'inventory':
          contentContainer.innerHTML = window.renderInventoryView();
          break;
        case 'tradein':
          contentContainer.innerHTML = window.renderTradeInView();
          setTimeout(() => window.updateValuationCalculator(), 50);
          break;
        case 'refurb':
          contentContainer.innerHTML = window.renderRefurbView();
          break;
        case 'parts':
          contentContainer.innerHTML = window.renderPartsView();
          break;
        case 'repairs':
          contentContainer.innerHTML = window.renderRepairsView();
          break;
        case 'sales':
          contentContainer.innerHTML = window.renderSalesView();
          break;
        case 'aging':
          contentContainer.innerHTML = window.renderAgingView();
          break;
        case 'reports':
          contentContainer.innerHTML = window.renderReportsView();
          break;
        default:
          contentContainer.innerHTML = window.renderDashboardView();
          setTimeout(() => window.initDashboardCharts(), 50);
      }
    }

    // Refresh Lucide Icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Re-bind dropdown triggers
    this.bindDropdownEvents();
  }

  bindDropdownEvents() {
    const branchBtn = document.getElementById('branch-dropdown-btn');
    const branchMenu = document.getElementById('branch-dropdown-menu');
    if (branchBtn && branchMenu) {
      branchBtn.onclick = (e) => {
        e.stopPropagation();
        branchMenu.classList.toggle('hidden');
      };
    }

    const quickBtn = document.getElementById('quick-actions-btn');
    const quickMenu = document.getElementById('quick-actions-menu');
    if (quickBtn && quickMenu) {
      quickBtn.onclick = (e) => {
        e.stopPropagation();
        quickMenu.classList.toggle('hidden');
      };
    }

    const mobileBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar-container');
    if (mobileBtn && sidebar) {
      mobileBtn.onclick = () => {
        sidebar.classList.toggle('hidden');
      };
    }

    // Global search input
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.handleGlobalSearch(e.target.value.trim().toLowerCase());
      };
    }
  }

  handleGlobalSearch(query) {
    if (!query) return;
    if (this.currentView !== 'inventory') {
      this.navigateToView('inventory');
    }
    setTimeout(() => {
      const store = window.erpStore;
      const filtered = store.getGadgets().filter(g => 
        g.imei.toLowerCase().includes(query) ||
        g.serial.toLowerCase().includes(query) ||
        g.brand.toLowerCase().includes(query) ||
        g.model.toLowerCase().includes(query)
      );
      const tbody = document.getElementById('inventory-table-body');
      const countLabel = document.getElementById('inventory-count-label');
      if (tbody) tbody.innerHTML = window.renderInventoryRows(filtered);
      if (countLabel) countLabel.textContent = filtered.length;
      if (window.lucide) window.lucide.createIcons();
    }, 100);
  }

  navigateToView(viewName) {
    this.currentView = viewName;
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.toggleMobileSidebar(false);
  }

  toggleMobileSidebar(open) {
    const sidebar = document.getElementById('sidebar-container');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) {
      if (open) {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
      } else {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0');
      }
    }
    if (backdrop) {
      if (open) {
        backdrop.classList.remove('hidden');
      } else {
        backdrop.classList.add('hidden');
      }
    }
  }

  closeAllModals() {
    const modals = document.querySelectorAll('#modals-root > div');
    modals.forEach(m => m.classList.add('hidden'));
  }
}

// Global Toast System
window.showToast = function(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `glass-dropdown px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-semibold fade-in ${
    type === 'success' ? 'border-emerald-500/40 text-emerald-300' :
    type === 'error' ? 'border-rose-500/40 text-rose-300' : 'border-blue-500/40 text-blue-300'
  }`;

  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="w-4 h-4 flex-shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// ================= GLOBAL HELPER METHODS & MODAL TRIGGERS =================

window.navigateToView = function(viewName) {
  window.app.navigateToView(viewName);
};

window.toggleMobileSidebar = function(open) {
  window.app.toggleMobileSidebar(open);
};

window.handleNavigateAndClose = function(viewName) {
  window.app.navigateToView(viewName);
  window.app.toggleMobileSidebar(false);
};


window.handleSelectBranch = function(branchId) {
  window.erpStore.setActiveBranch(branchId);
  window.showToast(`Active Branch set to: ${branchId === 'ALL' ? 'Consolidated All Branches' : window.erpStore.getBranchById(branchId)?.name}`);
};

window.handleResetDemoData = function() {
  if (confirm('Reset demo dataset back to initial pre-seeded state?')) {
    window.erpStore.resetToDefault();
    window.showToast('Demo data successfully restored to factory defaults!');
  }
};

window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
};

// ================= POS SALE ACTIONS =================
window.quickPosForDevice = function(deviceId) {
  window.openModal('pos-sale-modal');
  const select = document.getElementById('pos-device-select');
  if (select) {
    select.value = deviceId;
    window.updatePosCalculation();
  }
};

window.updatePosCalculation = function() {
  const deviceId = document.getElementById('pos-device-select')?.value;
  if (!deviceId) return;

  const gadget = window.erpStore.getGadgetById(deviceId);
  if (!gadget) return;

  const priceInput = document.getElementById('pos-price-input');
  if (priceInput && !priceInput.value) {
    priceInput.value = gadget.sellingPrice;
  }

  const sellingPrice = Number(priceInput?.value) || 0;
  const discount = Number(document.getElementById('pos-discount-input')?.value) || 0;
  const landedCost = gadget.costs.totalLanded || (gadget.costs.acquisition + gadget.costs.parts + gadget.costs.labor + gadget.costs.logistics);

  const finalPrice = Math.max(0, sellingPrice - discount);
  const profit = Math.round((finalPrice - landedCost) * 100) / 100;
  const marginPct = finalPrice > 0 ? Math.round((profit / finalPrice) * 1000) / 10 : 0;

  document.getElementById('pos-calc-cost').textContent = `$${landedCost}`;
  document.getElementById('pos-calc-final-price').textContent = `$${finalPrice}`;
  document.getElementById('pos-calc-profit').textContent = `+$${profit}`;
  document.getElementById('pos-calc-margin').textContent = `+${marginPct}%`;
};

window.handleExecuteSale = function(e) {
  e.preventDefault();
  const deviceId = document.getElementById('pos-device-select').value;
  const customerName = document.getElementById('pos-cust-name').value;
  const customerPhone = document.getElementById('pos-cust-phone').value;
  const sellingPrice = document.getElementById('pos-price-input').value;
  const discount = document.getElementById('pos-discount-input').value;
  const warrantyMonths = document.getElementById('pos-warranty-select').value;
  const paymentMethod = document.getElementById('pos-payment-method').value;

  try {
    const sale = window.erpStore.processDeviceSale({
      deviceId,
      customerName,
      customerPhone,
      sellingPrice,
      discount,
      warrantyMonths,
      paymentMethod
    });

    window.closeModal('pos-sale-modal');
    window.showToast(`Sale Invoice #${sale.id} completed! Realized Profit: +$${sale.financials.realizedProfit}`);
    window.openReceiptModal(sale.id);
  } catch (err) {
    window.showToast(err.message, 'error');
  }
};

window.openReceiptModal = function(invoiceId) {
  const sale = window.erpStore.state.salesTransactions.find(s => s.id === invoiceId);
  if (!sale) return;

  const branch = window.erpStore.getBranchById(sale.branchId);
  const content = document.getElementById('receipt-content');
  if (content) {
    content.innerHTML = `
      <div id="printable-area" class="text-slate-900 font-mono text-xs">
        <div class="text-center pb-3 border-b border-dashed border-slate-400">
          <div class="font-extrabold text-sm tracking-wider">NEXGADGET ERP STORE</div>
          <div class="text-[10px] text-slate-600">${branch?.name || 'Flagship Branch'} • ${branch?.phone || '+1 555-234-8901'}</div>
          <div class="text-[10px] text-slate-500">${branch?.address || '104 Tech Avenue'}</div>
        </div>

        <div class="pt-2 pb-2 border-b border-dashed border-slate-400 space-y-0.5 text-[11px]">
          <div><b>INVOICE:</b> ${sale.id}</div>
          <div><b>DATE:</b> ${sale.date ? sale.date.replace('T', ' ').slice(0, 19) : ''}</div>
          <div><b>CUSTOMER:</b> ${sale.customer.name} (${sale.customer.phone})</div>
          <div><b>PAYMENT:</b> ${sale.paymentMethod}</div>
          <div><b>SALES REP:</b> ${sale.salesRep}</div>
        </div>

        <div class="pt-2 pb-2 border-b border-dashed border-slate-400">
          <div class="font-bold text-[11px]">${sale.device.model}</div>
          <div class="text-[10px] text-slate-600">IMEI: ${sale.device.imei}</div>
          <div class="text-[10px] text-slate-600">SN: ${sale.device.serial} • Condition: ${sale.device.condition}</div>
          <div class="flex justify-between font-bold text-xs mt-1">
            <span>Unit Base Price:</span>
            <span>$${sale.financials.sellingPrice}</span>
          </div>
          ${sale.financials.discount > 0 ? `
            <div class="flex justify-between text-[11px] text-rose-600">
              <span>Promo Discount:</span>
              <span>-$${sale.financials.discount}</span>
            </div>
          ` : ''}
          <div class="flex justify-between text-[11px] text-slate-600">
            <span>Sales Tax (8%):</span>
            <span>$${sale.financials.tax}</span>
          </div>
        </div>

        <div class="pt-2 pb-2 border-b border-dashed border-slate-400 space-y-1">
          <div class="flex justify-between text-sm font-extrabold">
            <span>TOTAL PAID:</span>
            <span>$${sale.financials.netTotal}</span>
          </div>
          <div class="text-[10px] text-slate-500 italic">
            * Internal Landed Cost COG: $${sale.financials.totalLandedCost} | Realized Margin: +$${sale.financials.realizedProfit} (+${sale.financials.marginPercent}%)
          </div>
        </div>

        <div class="text-center pt-2 text-[10px] text-slate-600 space-y-0.5">
          <div class="font-bold text-slate-800">WARRANTY CERTIFICATE: ${sale.warrantyMonths} MONTHS</div>
          <div>Covers hardware defects. Physical & water damage excluded.</div>
          <div class="text-[9px] text-slate-400 mt-2">Thank you for shopping at NexGadget!</div>
        </div>
      </div>
    `;
  }
  window.openModal('receipt-modal');
};

// ================= TRADE-IN ACTIONS =================
window.launchIntakeWithCalculator = function() {
  const select = document.getElementById('val-model-select');
  if (!select) return;
  const [brand, model] = select.value.split('|');
  const offerVal = document.getElementById('calc-offer-val')?.textContent.replace('$', '') || 400;

  window.openModal('tradein-intake-modal');
  const brandEl = document.getElementById('ti-brand');
  const modelEl = document.getElementById('ti-model');
  const offerEl = document.getElementById('ti-offer');

  if (brandEl) brandEl.value = brand;
  if (modelEl) modelEl.value = `${model} 256GB`;
  if (offerEl) offerEl.value = offerVal;
};

window.handleExecuteTradeIn = function(e) {
  e.preventDefault();
  const customerName = document.getElementById('ti-cust-name').value;
  const customerPhone = document.getElementById('ti-cust-phone').value;
  const brand = document.getElementById('ti-brand').value;
  const model = document.getElementById('ti-model').value;
  const imei = document.getElementById('ti-imei').value;
  const branchId = document.getElementById('ti-branch').value;
  const valuationOffer = document.getElementById('ti-offer').value;
  const payoutType = document.getElementById('ti-payout-type').value;
  const routeToRefurb = document.querySelector('input[name="ti-route"]:checked')?.value === 'refurb_queue';

  const { tradeRecord } = window.erpStore.processTradeInIntake({
    customerName,
    customerPhone,
    brand,
    model,
    imei,
    branchId,
    valuationOffer,
    payoutType,
    routeToRefurb,
    evaluatedGrade: routeToRefurb ? 'Grade C (Needs Refurb)' : 'Grade A'
  });

  window.closeModal('tradein-intake-modal');
  window.showToast(`Trade-In #${tradeRecord.id} recorded! Voucher Code: ${tradeRecord.voucherCode} issued.`);
};

// ================= GADGET ADD ACTIONS =================
window.handleExecuteAddGadget = function(e) {
  e.preventDefault();
  const brand = document.getElementById('add-brand').value;
  const model = document.getElementById('add-model').value;
  const category = document.getElementById('add-category').value;
  const variant = document.getElementById('add-variant').value;
  const condition = document.getElementById('add-condition').value;
  const imei = document.getElementById('add-imei').value;
  const serial = document.getElementById('add-serial').value;
  const acquisitionCost = document.getElementById('add-cost-acq').value;
  const partsCost = document.getElementById('add-cost-parts').value;
  const laborCost = document.getElementById('add-cost-labor').value;
  const logisticsCost = document.getElementById('add-cost-logistics').value;
  const sellingPrice = document.getElementById('add-selling-price').value;
  const branchId = document.getElementById('add-branch').value;

  const newDev = window.erpStore.addGadget({
    brand,
    model,
    category,
    variant,
    condition,
    imei,
    serial,
    acquisitionCost,
    partsCost,
    laborCost,
    logisticsCost,
    sellingPrice,
    branchId
  });

  window.closeModal('add-gadget-modal');
  window.showToast(`Device registered! Total Landed Cost: $${newDev.costs.totalLanded}`);
};

// ================= REPAIR ACTIONS =================
window.handleExecuteCreateRepair = function(e) {
  e.preventDefault();
  const customerName = document.getElementById('rep-cust-name').value;
  const customerPhone = document.getElementById('rep-cust-phone').value;
  const device = document.getElementById('rep-device').value;
  const imei = document.getElementById('rep-imei').value;
  const problemDescription = document.getElementById('rep-issue').value;
  const estimatedCost = document.getElementById('rep-est-cost').value;
  const advanceDeposit = document.getElementById('rep-deposit').value;
  const technician = document.getElementById('rep-tech').value;

  const ticket = window.erpStore.createRepairTicket({
    customerName,
    customerPhone,
    device,
    imei,
    problemDescription,
    estimatedCost,
    advanceDeposit,
    technician
  });

  window.closeModal('new-repair-modal');
  window.showToast(`Repair Ticket #${ticket.id} created for ${ticket.customerName}!`);
};

window.handleUpdateRepairStatus = function(ticketId, newStatus) {
  window.erpStore.updateRepairStatus(ticketId, newStatus);
  window.showToast(`Ticket #${ticketId} status updated to: ${newStatus}`);
};

window.openRepairDetailModal = function(ticketId) {
  const ticket = window.erpStore.state.repairTickets.find(t => t.id === ticketId);
  if (!ticket) return;
  alert(`Repair Ticket #${ticket.id}\nCustomer: ${ticket.customerName}\nDevice: ${ticket.device}\nIssue: ${ticket.problemDescription}\nTotal Bill: $${ticket.totalBill || ticket.estimatedCost}\nStatus: ${ticket.status}`);
};

// ================= REFURB ACTIONS =================
window.handleConsumePartInRefurb = function(refurbOrderId) {
  const select = document.getElementById(`refurb-part-select-${refurbOrderId}`);
  if (!select) return;
  const partId = select.value;

  window.erpStore.consumePartInRefurb(refurbOrderId, partId, 1, 30);
  window.showToast('Part attached to Refurbishment & device landed cost updated!');
};

window.handleCompleteRefurb = function(refurbOrderId) {
  window.erpStore.completeRefurbishment(refurbOrderId, 'Grade A+ (Refurbished)');
  window.showToast(`Refurb Job #${refurbOrderId} passed 12-point QC & listed in stock!`);
};

// ================= TRANSFER ACTIONS =================
window.handleExecuteTransfer = function(e) {
  e.preventDefault();
  const deviceId = document.getElementById('trf-device').value;
  const toBranchId = document.getElementById('trf-destination').value;
  const note = document.getElementById('trf-note').value;

  const trf = window.erpStore.initiateTransfer(deviceId, toBranchId, note);
  window.closeModal('transfer-modal');
  window.showToast(`Transfer #${trf.id} initiated to ${window.erpStore.getBranchById(toBranchId)?.name}!`);
};

window.handleReceiveTransfer = function(transferId) {
  window.erpStore.receiveTransfer(transferId);
  window.showToast(`Transfer #${transferId} received & stock updated!`);
};

// ================= STOCK AGING & MARKDOWN =================
window.handleApplyMarkdown = function(deviceId, discountAmount) {
  window.erpStore.applyMarkdownDiscount(deviceId, discountAmount);
  window.showToast(`Markdown promo applied! New price set with -$${discountAmount} discount.`);
};

// ================= RESTOCK SPARE PART =================
window.openRestockModalForPart = function(partId) {
  window.openModal('restock-part-modal');
  const select = document.getElementById('restock-part-id');
  if (select) select.value = partId;
};

window.handleExecuteRestockPart = function(e) {
  e.preventDefault();
  const partId = document.getElementById('restock-part-id').value;
  const branchId = document.getElementById('restock-branch-id').value;
  const qty = Number(document.getElementById('restock-qty').value) || 1;

  window.erpStore.adjustPartStock(partId, branchId, qty, 'Restock Shipment');
  window.closeModal('restock-part-modal');
  window.showToast(`Restocked +${qty} units of part into ${window.erpStore.getBranchById(branchId)?.name}!`);
};

// ================= IMEI COST SHEET DRAWER =================
window.openImeiDrawer = function(deviceId) {
  const gadget = window.erpStore.getGadgetById(deviceId);
  if (!gadget) return;

  const subtitle = document.getElementById('imei-drawer-subtitle');
  const content = document.getElementById('imei-drawer-content');
  const branch = window.erpStore.getBranchById(gadget.branchId);

  if (subtitle) {
    subtitle.textContent = `${gadget.brand} ${gadget.model} • IMEI: ${gadget.imei}`;
  }

  if (content) {
    content.innerHTML = `
      <!-- Device Specs Summary Card -->
      <div class="glass-card-subtle p-4 rounded-2xl border border-slate-700/60 flex flex-wrap justify-between gap-3 text-xs">
        <div>
          <div class="font-bold text-white text-sm">${gadget.brand} ${gadget.model}</div>
          <div class="text-slate-400">${gadget.variant} • ${gadget.condition} (${gadget.grade})</div>
          <div class="text-blue-400 font-mono-code mt-0.5">IMEI: ${gadget.imei} | SN: ${gadget.serial}</div>
        </div>
        <div class="text-right">
          <div class="text-slate-400">Current Location:</div>
          <div class="font-bold text-emerald-400">${branch?.name || 'HQ'}</div>
          <div class="text-slate-400 text-[10px]">Aging: ${gadget.agingDays} Days</div>
        </div>
      </div>

      <!-- Landed Cost Formula Grid -->
      <div class="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-blue-500/30">
        <div class="text-[11px] font-bold uppercase text-blue-400 tracking-wider mb-2">Item-Level True Landed Cost Breakdown</div>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div class="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
            <div class="text-[10px] text-slate-400">1. Acquisition / PO</div>
            <div class="font-bold text-white font-mono-code text-sm">$${gadget.costs.acquisition}</div>
          </div>
          <div class="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
            <div class="text-[10px] text-slate-400">2. Consumed Parts</div>
            <div class="font-bold text-white font-mono-code text-sm">$${gadget.costs.parts}</div>
          </div>
          <div class="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
            <div class="text-[10px] text-slate-400">3. Tech Labor</div>
            <div class="font-bold text-white font-mono-code text-sm">$${gadget.costs.labor}</div>
          </div>
          <div class="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
            <div class="text-[10px] text-slate-400">4. Logistics / Tax</div>
            <div class="font-bold text-white font-mono-code text-sm">$${gadget.costs.logistics}</div>
          </div>
        </div>

        <div class="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
          <div>
            <span class="text-slate-400">Total Landed Cost:</span>
            <span class="font-extrabold text-white font-mono-code text-base ml-1">$${gadget.costs.totalLanded}</span>
          </div>
          <div>
            <span class="text-slate-400">Selling Price:</span>
            <span class="font-extrabold text-emerald-400 font-mono-code text-base ml-1">$${gadget.sellingPrice}</span>
          </div>
          <div>
            <span class="text-slate-400">Margin:</span>
            <span class="font-extrabold text-indigo-400 font-mono-code text-base ml-1">+${gadget.sellingPrice > 0 ? (((gadget.sellingPrice - gadget.costs.totalLanded) / gadget.sellingPrice) * 100).toFixed(1) : 0}%</span>
          </div>
        </div>
      </div>

      <!-- Lifecycle Cost & Transfer Audit Trail -->
      <div>
        <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-2">Device Lifecycle & Cost Audit Ledger</h4>
        <div class="space-y-2 max-h-56 overflow-y-auto custom-scroll pr-1">
          ${(gadget.costHistory || []).map(h => `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs">
              <div>
                <div class="font-semibold text-slate-200">${h.description}</div>
                <div class="text-[10px] text-slate-500 font-mono-code">${h.date} • Type: ${h.type}</div>
              </div>
              <div class="font-mono-code font-bold ${h.amount > 0 ? 'text-rose-400' : 'text-slate-400'}">
                ${h.amount > 0 ? `+$${h.amount}` : '$0'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  window.openModal('imei-drawer-modal');
};

// ================= INVENTORY FILTER CHANGE =================
window.handleInventoryFilterChange = function() {
  const category = document.getElementById('inv-category-filter')?.value || 'ALL';
  const condition = document.getElementById('inv-condition-filter')?.value || 'ALL';
  const status = document.getElementById('inv-status-filter')?.value || 'ALL';

  let filtered = window.erpStore.getGadgets();

  if (category !== 'ALL') filtered = filtered.filter(g => g.category === category);
  if (condition !== 'ALL') filtered = filtered.filter(g => g.condition === condition);
  if (status !== 'ALL') filtered = filtered.filter(g => g.status === status);

  const tbody = document.getElementById('inventory-table-body');
  const countLabel = document.getElementById('inventory-count-label');
  if (tbody) tbody.innerHTML = window.renderInventoryRows(filtered);
  if (countLabel) countLabel.textContent = filtered.length;
  if (window.lucide) window.lucide.createIcons();
};

// App Initialization on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new ERPApp();
});
