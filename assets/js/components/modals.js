/**
 * NexGadget ERP - Global Modals Manager
 * Handles POS checkout, Trade-In intake, IMEI Cost audit drawer, and Repair billing
 */

function renderModalsContainer() {
  const store = window.erpStore;
  const branches = store.getBranches();
  const availableGadgets = store.state.gadgets.filter(g => g.status === 'in_stock');
  const parts = store.getSpareParts();

  return `
    <div id="modals-root">
      
      <!-- ================= 1. POS DEVICE SALE MODAL ================= -->
      <div id="pos-sale-modal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="glass-card w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-700/80 max-h-[90vh] overflow-y-auto custom-scroll fade-in">
          
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-white text-base">Point of Sale — Device Checkout</h3>
                <p class="text-[11px] text-slate-400">Scan or select IMEI to calculate exact profit margin</p>
              </div>
            </div>
            <button onclick="window.closeModal('pos-sale-modal')" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form id="pos-sale-form" onsubmit="window.handleExecuteSale(event)" class="mt-4 space-y-4">
            
            <!-- Select Device by IMEI -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Select Available Device (IMEI)</label>
              <select id="pos-device-select" onchange="window.updatePosCalculation()" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                <option value="" disabled selected>-- Select device by IMEI / Model --</option>
                ${availableGadgets.map(g => `
                  <option value="${g.id}">
                    ${g.brand} ${g.model} (${g.variant}) - IMEI: ${g.imei} [Cost: $${g.costs.totalLanded} | Price: $${g.sellingPrice}]
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Customer Details -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Customer Name</label>
                <input type="text" id="pos-cust-name" required placeholder="e.g., Jennifer Aniston" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Customer Phone</label>
                <input type="text" id="pos-cust-phone" required placeholder="+1 (555) 000-0000" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
              </div>
            </div>

            <!-- Pricing & Discount -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Selling Price ($)</label>
                <input type="number" id="pos-price-input" oninput="window.updatePosCalculation()" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-code focus:outline-none focus:border-emerald-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Discount ($)</label>
                <input type="number" id="pos-discount-input" oninput="window.updatePosCalculation()" value="0" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-code focus:outline-none focus:border-emerald-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Warranty (Months)</label>
                <select id="pos-warranty-select" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                  <option value="12">12 Months (Standard)</option>
                  <option value="6">6 Months (Refurb)</option>
                  <option value="3">3 Months (Used)</option>
                  <option value="24">24 Months (Extended)</option>
                </select>
              </div>
            </div>

            <!-- Payment Method -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
              <select id="pos-payment-method" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                <option value="Credit Card (Visa / MC)">Credit Card (Visa / Mastercard)</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Trade-In Voucher Credit">Trade-In Voucher Credit</option>
                <option value="Split Payment (Cash + Card)">Split Payment (Cash + Card)</option>
              </select>
            </div>

            <!-- Real-Time Margin & P&L Preview Box -->
            <div class="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
              <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Unit Margin Calculation Preview</div>
              
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                <div>
                  <div class="text-slate-400 text-[10px]">IMEI Landed Cost:</div>
                  <div id="pos-calc-cost" class="font-bold text-white font-mono-code">$0</div>
                </div>
                <div>
                  <div class="text-slate-400 text-[10px]">Final Price:</div>
                  <div id="pos-calc-final-price" class="font-bold text-white font-mono-code">$0</div>
                </div>
                <div>
                  <div class="text-slate-400 text-[10px]">Realized Profit:</div>
                  <div id="pos-calc-profit" class="font-bold text-emerald-400 font-mono-code">+$0</div>
                </div>
                <div>
                  <div class="text-slate-400 text-[10px]">Gross Margin:</div>
                  <div id="pos-calc-margin" class="font-bold text-indigo-400 font-mono-code">+0%</div>
                </div>
              </div>
            </div>

            <!-- Form Submit -->
            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onclick="window.closeModal('pos-sale-modal')" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition">
                Complete Sale & Print Receipt &rarr;
              </button>
            </div>

          </form>
        </div>
      </div>


      <!-- ================= 2. TRADE-IN INTAKE MODAL ================= -->
      <div id="tradein-intake-modal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="glass-card w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-700/80 max-h-[90vh] overflow-y-auto custom-scroll fade-in">
          
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <i data-lucide="refresh-cw" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-white text-base">Trade-In Intake & Valuation</h3>
                <p class="text-[11px] text-slate-400">Evaluate used device, issue voucher, and route to stock or refurb</p>
              </div>
            </div>
            <button onclick="window.closeModal('tradein-intake-modal')" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form id="tradein-intake-form" onsubmit="window.handleExecuteTradeIn(event)" class="mt-4 space-y-4">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Customer Name (KYC)</label>
                <input type="text" id="ti-cust-name" required placeholder="Customer Full Name" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Customer Phone</label>
                <input type="text" id="ti-cust-phone" required placeholder="+1 (555) 000-0000" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Brand</label>
                <select id="ti-brand" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Google">Google</option>
                  <option value="Sony">Sony</option>
                </select>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-300 mb-1">Model & Variant</label>
                <input type="text" id="ti-model" required placeholder="e.g., iPhone 14 Pro 128GB" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Device IMEI (15 Digits)</label>
                <input type="text" id="ti-imei" required placeholder="35xxxxxxxxxxxxx" maxlength="15" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-code focus:outline-none focus:border-amber-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Receiving Branch</label>
                <select id="ti-branch" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                  ${branches.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Valuation Payout Offer ($)</label>
                <input type="number" id="ti-offer" required placeholder="e.g., 450" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-code focus:outline-none focus:border-amber-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Payout Option</label>
                <select id="ti-payout-type" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                  <option value="Store Voucher (Credit)">Store Voucher (Credit)</option>
                  <option value="Instant Cash Payout">Instant Cash Payout</option>
                  <option value="Direct Purchase Offset">Direct Purchase Offset</option>
                </select>
              </div>
            </div>

            <!-- Route destination -->
            <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2">
              <label class="block text-xs font-semibold text-slate-200">Inventory Routing Decision</label>
              <div class="flex items-center gap-4 text-xs text-slate-300">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="ti-route" value="direct_stock" checked class="text-amber-500">
                  <span>Direct to Stock (Grade A/B)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="ti-route" value="refurb_queue" class="text-amber-500">
                  <span>Send to Refurbishment Workshop</span>
                </label>
              </div>
            </div>

            <!-- Form Submit -->
            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onclick="window.closeModal('tradein-intake-modal')" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/20 transition">
                Generate Voucher & Intake Unit &rarr;
              </button>
            </div>

          </form>
        </div>
      </div>


      <!-- ================= 3. ADD NEW DEVICE (IMEI COSTING) MODAL ================= -->
      <div id="add-gadget-modal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="glass-card w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-700/80 max-h-[90vh] overflow-y-auto custom-scroll fade-in">
          
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <i data-lucide="smartphone" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-white text-base">New Gadget & IMEI Costing Registration</h3>
                <p class="text-[11px] text-slate-400">Granular landed cost ledger input per device unit</p>
              </div>
            </div>
            <button onclick="window.closeModal('add-gadget-modal')" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form id="add-gadget-form" onsubmit="window.handleExecuteAddGadget(event)" class="mt-4 space-y-4">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Brand</label>
                <input type="text" id="add-brand" required placeholder="e.g., Apple, Samsung" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Model Name</label>
                <input type="text" id="add-model" required placeholder="e.g., iPhone 15 Pro Max" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select id="add-category" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                  <option value="Smartphone">Smartphone</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Smartwatch">Smartwatch</option>
                  <option value="Gaming">Gaming Console</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Variant (Spec/Color)</label>
                <input type="text" id="add-variant" placeholder="e.g., 256GB Black" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Condition</label>
                <select id="add-condition" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                  <option value="Brand New">Brand New</option>
                  <option value="Open Box">Open Box</option>
                  <option value="Pre-Owned">Pre-Owned</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Unique IMEI (15 Digits)</label>
                <input type="text" id="add-imei" required placeholder="359xxxxxxxxxxxx" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-code focus:outline-none focus:border-blue-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Serial Number (SN)</label>
                <input type="text" id="add-serial" placeholder="F2LZ982Q0D" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-code focus:outline-none focus:border-blue-500">
              </div>
            </div>

            <!-- Granular Landed Cost Structure -->
            <div class="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <div class="text-[11px] font-bold text-blue-400 uppercase tracking-wider">True Landed Cost Breakdown ($)</div>
              
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label class="block text-[10px] text-slate-400 mb-1">Acquisition / PO</label>
                  <input type="number" id="add-cost-acq" required placeholder="0" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono-code">
                </div>
                <div>
                  <label class="block text-[10px] text-slate-400 mb-1">Spare Parts</label>
                  <input type="number" id="add-cost-parts" placeholder="0" value="0" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono-code">
                </div>
                <div>
                  <label class="block text-[10px] text-slate-400 mb-1">Labor / Tech</label>
                  <input type="number" id="add-cost-labor" placeholder="0" value="0" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono-code">
                </div>
                <div>
                  <label class="block text-[10px] text-slate-400 mb-1">Logistics / Tax</label>
                  <input type="number" id="add-cost-logistics" placeholder="10" value="10" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono-code">
                </div>
              </div>
            </div>

            <!-- Selling Price & Branch -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Target Selling Price ($)</label>
                <input type="number" id="add-selling-price" required placeholder="e.g., 1199" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-code focus:outline-none focus:border-blue-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Assigned Branch</label>
                <select id="add-branch" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                  ${branches.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Form Submit -->
            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onclick="window.closeModal('add-gadget-modal')" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition">
                Register Device &rarr;
              </button>
            </div>

          </form>
        </div>
      </div>


      <!-- ================= 4. NEW REPAIR TICKET MODAL ================= -->
      <div id="new-repair-modal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="glass-card w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-700/80 max-h-[90vh] overflow-y-auto custom-scroll fade-in">
          
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <i data-lucide="hammer" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-white text-base">New Repair Service Ticket</h3>
                <p class="text-[11px] text-slate-400">Customer device intake, problem diagnosis & advance deposit</p>
              </div>
            </div>
            <button onclick="window.closeModal('new-repair-modal')" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form id="new-repair-form" onsubmit="window.handleExecuteCreateRepair(event)" class="mt-4 space-y-4">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Customer Name</label>
                <input type="text" id="rep-cust-name" required placeholder="Customer Name" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input type="text" id="rep-cust-phone" required placeholder="+1 (555) 000-0000" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Device Model</label>
                <input type="text" id="rep-device" required placeholder="e.g., iPhone 15 Pro, PS5" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">IMEI / Serial Number</label>
                <input type="text" id="rep-imei" placeholder="359xxxxxx or SN" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-code focus:outline-none focus:border-purple-500">
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Reported Issue / Fault</label>
              <textarea id="rep-issue" rows="2" required placeholder="Describe problem: screen cracked, no power, battery drain..." class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Estimated Cost ($)</label>
                <input type="number" id="rep-est-cost" required placeholder="120" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-code focus:outline-none">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Advance Deposit ($)</label>
                <input type="number" id="rep-deposit" placeholder="0" value="50" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-code focus:outline-none">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Technician</label>
                <select id="rep-tech" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                  <option value="Alex Rivera">Alex Rivera</option>
                  <option value="Samantha Wu">Samantha Wu</option>
                  <option value="Kevin S.">Kevin S.</option>
                </select>
              </div>
            </div>

            <!-- Form Submit -->
            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onclick="window.closeModal('new-repair-modal')" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20 transition">
                Create Repair Ticket &rarr;
              </button>
            </div>

          </form>
        </div>
      </div>


      <!-- ================= 5. INTER-BRANCH TRANSFER MODAL ================= -->
      <div id="transfer-modal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="glass-card w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-700/80 fade-in">
          
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <i data-lucide="arrow-left-right" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-white text-base">Inter-Branch Stock Transfer</h3>
                <p class="text-[11px] text-slate-400">Transfer device IMEI to another retail location</p>
              </div>
            </div>
            <button onclick="window.closeModal('transfer-modal')" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form id="transfer-form" onsubmit="window.handleExecuteTransfer(event)" class="mt-4 space-y-4">
            
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Select Device to Transfer</label>
              <select id="trf-device" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                ${availableGadgets.map(g => `
                  <option value="${g.id}">
                    ${g.brand} ${g.model} (${g.variant}) - IMEI: ${g.imei} [Current: ${store.getBranchById(g.branchId)?.name}]
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Destination Branch</label>
              <select id="trf-destination" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                ${branches.map(b => `<option value="${b.id}">${b.name} (${b.code})</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Courier / Transfer Note</label>
              <input type="text" id="trf-note" placeholder="e.g., Courier Van #02, Urgent display request" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onclick="window.closeModal('transfer-modal')" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-500/20 transition">
                Initiate Transfer &rarr;
              </button>
            </div>

          </form>
        </div>
      </div>


      <!-- ================= 6. PRINTABLE INVOICE / RECEIPT MODAL ================= -->
      <div id="receipt-modal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="glass-card w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-700/80 max-h-[90vh] overflow-y-auto custom-scroll fade-in">
          
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 class="font-bold text-white text-sm">Sale Invoice & Warranty Certificate</h3>
            <button onclick="window.closeModal('receipt-modal')" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Printable Area Content -->
          <div id="receipt-content" class="mt-4 bg-white text-slate-900 p-5 rounded-2xl font-mono text-xs space-y-3 shadow-inner">
            <!-- Dynamic Receipt Data populated via openReceiptModal -->
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-4">
            <button onclick="window.print()" class="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2">
              <i data-lucide="printer" class="w-4 h-4"></i>
              <span>Print Customer Receipt (Thermal / Full)</span>
            </button>
          </div>
        </div>
      </div>


      <!-- ================= 7. IMEI COST SHEET & LIFECYCLE AUDIT DRAWER ================= -->
      <div id="imei-drawer-modal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="glass-card w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-slate-700/80 max-h-[90vh] overflow-y-auto custom-scroll fade-in">
          
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div class="flex items-center gap-2">
              <i data-lucide="file-text" class="w-5 h-5 text-blue-400"></i>
              <div>
                <h3 class="font-bold text-white text-base">IMEI Landed Cost Breakdown & Lifecycle Audit</h3>
                <p id="imei-drawer-subtitle" class="text-[11px] text-slate-400">Complete itemized audit trail</p>
              </div>
            </div>
            <button onclick="window.closeModal('imei-drawer-modal')" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <div id="imei-drawer-content" class="mt-4 space-y-4">
            <!-- Populated dynamically via openImeiDrawer -->
          </div>
        </div>
      </div>


      <!-- ================= 8. RESTOCK SPARE PART MODAL ================= -->
      <div id="restock-part-modal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="glass-card w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-700/80 fade-in">
          
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 class="font-bold text-white text-sm">Adjust / Restock Spare Part</h3>
            <button onclick="window.closeModal('restock-part-modal')" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <form id="restock-part-form" onsubmit="window.handleExecuteRestockPart(event)" class="mt-4 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Select Spare Part</label>
              <select id="restock-part-id" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                ${parts.map(p => `<option value="${p.id}">${p.name} (SKU: ${p.sku})</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Branch</label>
              <select id="restock-branch-id" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                ${branches.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Units to Add (+)</label>
              <input type="number" id="restock-qty" min="1" value="5" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-code focus:outline-none">
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onclick="window.closeModal('restock-part-modal')" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow transition">
                Confirm Restock &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `;
}

window.renderModalsContainer = renderModalsContainer;
