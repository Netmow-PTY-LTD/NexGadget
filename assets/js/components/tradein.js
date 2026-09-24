/**
 * NexGadget ERP - Scope 5: Trade-In & Exchange Management
 * Interactive Valuation Calculator, Diagnostic Grading, Voucher Generation, and Queue Routing
 */

function renderTradeInView() {
  const store = window.erpStore;
  const records = store.state.tradeInRecords || [];
  const matrix = store.state.tradeInValuationMatrix || [];

  return `
    <div class="space-y-6 fade-in">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <h1 class="text-xl lg:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <i data-lucide="refresh-cw" class="w-6 h-6 text-amber-400"></i>
            <span>Trade-In & Exchange Hub</span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">Algorithm-driven device valuation, condition grading, trade voucher issuance, and stock intake.</p>
        </div>

        <button onclick="window.openModal('tradein-intake-modal')" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-2 shadow-lg shadow-amber-500/20 transition">
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>New Trade-In Intake</span>
        </button>
      </div>

      <!-- Live Interactive Valuation Simulator Box -->
      <div class="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <i data-lucide="calculator" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">Instant Trade-In Valuation Engine</h3>
              <p class="text-[11px] text-slate-400">Select model and diagnostic defects to compute automated offer price & projected resale margin.</p>
            </div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold border border-amber-500/30">Live Calculator</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Column 1: Model Selector -->
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Select Target Model</label>
              <select id="val-model-select" onchange="window.updateValuationCalculator()" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
                ${matrix.map(m => `
                  <option value="${m.brand}|${m.model}">${m.brand} ${m.model} (Base: $${m.basePrice})</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Storage / Variant</label>
              <select class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
                <option>128GB Standard</option>
                <option selected>256GB Standard</option>
                <option>512GB Premium</option>
                <option>1TB Ultra</option>
              </select>
            </div>
          </div>

          <!-- Column 2: Diagnostic Checkboxes -->
          <div class="space-y-2">
            <label class="block text-xs font-medium text-slate-300 mb-1">Functional & Cosmetic Checklist</label>
            
            <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80">
              <input type="checkbox" id="chk-screen" onchange="window.updateValuationCalculator()" class="rounded bg-slate-700 text-amber-500 focus:ring-0">
              <span>Cracked / Faulty Screen (-$110 to -$160)</span>
            </label>

            <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80">
              <input type="checkbox" id="chk-battery" onchange="window.updateValuationCalculator()" class="rounded bg-slate-700 text-amber-500 focus:ring-0">
              <span>Battery Health &lt; 80% (-$30 to -$40)</span>
            </label>

            <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80">
              <input type="checkbox" id="chk-body" onchange="window.updateValuationCalculator()" class="rounded bg-slate-700 text-amber-500 focus:ring-0">
              <span>Heavy Scratches / Dents on Body (-$40 to -$60)</span>
            </label>

            <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80">
              <input type="checkbox" id="chk-faceid" onchange="window.updateValuationCalculator()" class="rounded bg-slate-700 text-amber-500 focus:ring-0">
              <span>Face ID / Biometrics Failed (-$80 to -$120)</span>
            </label>
          </div>

          <!-- Column 3: Live Valuation Result Box -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-amber-500/30 flex flex-col justify-between">
            <div>
              <div class="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Calculated Offer Payout</div>
              <div id="calc-offer-val" class="text-3xl font-extrabold text-white font-mono-code mt-1">$750</div>
              <div id="calc-deductions-label" class="text-[11px] text-rose-400 mt-1 font-mono-code">Deductions: $0</div>
            </div>

            <div class="pt-3 border-t border-slate-800/80 mt-3 space-y-1 text-xs">
              <div class="flex justify-between text-slate-400">
                <span>Estimated Resale Value:</span>
                <span id="calc-resale-val" class="text-emerald-400 font-bold font-mono-code">$1,162</span>
              </div>
              <div class="flex justify-between text-slate-400">
                <span>Projected Gross Margin:</span>
                <span class="text-indigo-400 font-bold font-mono-code">+35.5%</span>
              </div>
            </div>

            <button onclick="window.launchIntakeWithCalculator()" class="mt-3 w-full py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-500/20 transition">
              Launch Intake with these Values &rarr;
            </button>
          </div>

        </div>
      </div>

      <!-- Trade-In Intake History Table -->
      <div class="glass-card rounded-2xl p-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
              <i data-lucide="history" class="w-4 h-4 text-amber-400"></i>
              Trade-In Intake & Voucher Ledger
            </h2>
            <p class="text-[11px] text-slate-400">Customer records, evaluated condition, voucher codes, and inventory routing</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono-code">${records.length} Records</span>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-left text-xs custom-table">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 font-semibold">
                <th class="py-2.5 px-3">Trade ID</th>
                <th class="py-2.5 px-3">Date</th>
                <th class="py-2.5 px-3">Customer (KYC)</th>
                <th class="py-2.5 px-3">Device & IMEI</th>
                <th class="py-2.5 px-3">Condition & Grade</th>
                <th class="py-2.5 px-3">Valuation Payout</th>
                <th class="py-2.5 px-3">Voucher Code</th>
                <th class="py-2.5 px-3">Status / Routing</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-slate-300">
              ${records.map(r => `
                <tr>
                  <td class="py-3 px-3 font-mono-code font-bold text-amber-400">${r.id}</td>
                  <td class="py-3 px-3 text-slate-400">${r.date}</td>
                  <td class="py-3 px-3">
                    <div class="font-semibold text-white">${r.customerName}</div>
                    <div class="text-[10px] text-slate-400">${r.customerPhone}</div>
                  </td>
                  <td class="py-3 px-3">
                    <div class="font-semibold text-white">${r.deviceBrand} ${r.deviceModel}</div>
                    <div class="text-[10px] font-mono-code text-blue-400">IMEI: ${r.deviceImei}</div>
                  </td>
                  <td class="py-3 px-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-amber-300 border border-slate-700">
                      ${r.evaluatedGrade}
                    </span>
                    <div class="text-[10px] text-slate-500 mt-0.5 truncate max-w-xs">${r.conditionNotes}</div>
                  </td>
                  <td class="py-3 px-3 font-mono-code">
                    <div class="font-bold text-white text-xs">$${r.valuationOffer}</div>
                    <div class="text-[10px] text-slate-400">${r.payoutType}</div>
                  </td>
                  <td class="py-3 px-3 font-mono-code">
                    <span class="px-2 py-1 rounded bg-slate-800/90 text-blue-300 font-semibold border border-blue-500/20 text-[10px]">
                      ${r.voucherCode}
                    </span>
                  </td>
                  <td class="py-3 px-3">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      r.status.includes('Refurb') ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }">
                      ${r.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function updateValuationCalculator() {
  const select = document.getElementById('val-model-select');
  if (!select) return;
  const [brand, model] = select.value.split('|');

  const deductions = {
    screenBroken: document.getElementById('chk-screen')?.checked || false,
    batterySub80: document.getElementById('chk-battery')?.checked || false,
    bodyHeavyScratch: document.getElementById('chk-body')?.checked || false,
    faceIdBroken: document.getElementById('chk-faceid')?.checked || false
  };

  const result = window.erpStore.calculateValuation(brand, model, deductions);

  const offerEl = document.getElementById('calc-offer-val');
  const dedEl = document.getElementById('calc-deductions-label');
  const resaleEl = document.getElementById('calc-resale-val');

  if (offerEl) offerEl.textContent = `$${result.valuationOffer}`;
  if (dedEl) dedEl.textContent = `Deductions: -$${Math.abs(result.totalDeductions)}`;
  if (resaleEl) resaleEl.textContent = `$${result.estimatedResale}`;
}

window.renderTradeInView = renderTradeInView;
window.updateValuationCalculator = updateValuationCalculator;
