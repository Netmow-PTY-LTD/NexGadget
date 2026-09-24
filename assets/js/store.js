/**
 * NexGadget ERP - Centralized Reactive State Store
 * Handles business logic, IMEI costing, P&L calculations, and LocalStorage persistence.
 */

class ERPStore {
  constructor() {
    this.STORAGE_KEY = 'NEXGADGET_ERP_STORAGE_V1';
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load from localStorage, initializing with defaults', e);
    }
    return JSON.parse(JSON.stringify(window.INITIAL_DATA));
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  resetToDefault() {
    this.state = JSON.parse(JSON.stringify(window.INITIAL_DATA));
    this.saveState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // ================= BRANCH & FILTER GETTERS =================
  getActiveBranch() {
    return this.state.activeBranchId || 'ALL';
  }

  setActiveBranch(branchId) {
    this.state.activeBranchId = branchId;
    this.saveState();
  }

  getBranches() {
    return this.state.branches || [];
  }

  getBranchById(id) {
    return this.state.branches.find(b => b.id === id);
  }

  // ================= GADGET & IMEI COSTING =================
  getGadgets(filterBranch = null) {
    const branch = filterBranch || this.getActiveBranch();
    let list = this.state.gadgets || [];
    if (branch !== 'ALL') {
      list = list.filter(g => g.branchId === branch);
    }
    return list;
  }

  getGadgetById(id) {
    return this.state.gadgets.find(g => g.id === id);
  }

  getGadgetByImei(imei) {
    return this.state.gadgets.find(g => g.imei === imei);
  }

  addGadget(gadgetData) {
    const newId = `DEV-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalLanded = (Number(gadgetData.acquisitionCost) || 0) +
                        (Number(gadgetData.partsCost) || 0) +
                        (Number(gadgetData.laborCost) || 0) +
                        (Number(gadgetData.logisticsCost) || 0);

    const newDevice = {
      id: newId,
      imei: gadgetData.imei,
      serial: gadgetData.serial || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      brand: gadgetData.brand,
      model: gadgetData.model,
      category: gadgetData.category || 'Smartphone',
      variant: gadgetData.variant || 'Standard',
      condition: gadgetData.condition || 'Brand New',
      grade: gadgetData.grade || 'New (Sealed)',
      batteryHealth: Number(gadgetData.batteryHealth) || 100,
      branchId: gadgetData.branchId || (this.getActiveBranch() === 'ALL' ? 'BR-01' : this.getActiveBranch()),
      status: 'in_stock',
      intakeDate: new Date().toISOString().split('T')[0],
      agingDays: 0,
      costs: {
        acquisition: Number(gadgetData.acquisitionCost) || 0,
        parts: Number(gadgetData.partsCost) || 0,
        labor: Number(gadgetData.laborCost) || 0,
        logistics: Number(gadgetData.logisticsCost) || 0,
        totalLanded: totalLanded
      },
      suggestedPrice: Number(gadgetData.sellingPrice) || Math.round(totalLanded * 1.3),
      sellingPrice: Number(gadgetData.sellingPrice) || Math.round(totalLanded * 1.3),
      supplier: gadgetData.supplier || 'Direct Purchase',
      notes: gadgetData.notes || '',
      costHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          description: 'Initial unit acquisition',
          amount: Number(gadgetData.acquisitionCost) || 0,
          type: 'acquisition'
        }
      ]
    };

    this.state.gadgets.unshift(newDevice);
    this.logActivity('inventory', `New device added: ${newDevice.brand} ${newDevice.model} (IMEI: ${newDevice.imei})`, 'In Stock');
    this.saveState();
    return newDevice;
  }

  // ================= SPARE PARTS =================
  getSpareParts() {
    return this.state.spareParts || [];
  }

  getSparePartById(partId) {
    return this.state.spareParts.find(p => p.id === partId);
  }

  adjustPartStock(partId, branchId, changeAmount, reason = 'Adjustment') {
    const part = this.getSparePartById(partId);
    if (!part) return false;
    if (!part.stock[branchId]) part.stock[branchId] = 0;
    part.stock[branchId] += changeAmount;
    if (part.stock[branchId] < 0) part.stock[branchId] = 0;
    
    this.logActivity('parts', `Stock updated for ${part.sku} in ${this.getBranchById(branchId)?.name || branchId} (${changeAmount > 0 ? '+' : ''}${changeAmount})`, 'Parts Inventory');
    this.saveState();
    return true;
  }

  // ================= TRADE-IN MANAGEMENT =================
  calculateValuation(brand, model, deductions = {}) {
    const matrix = this.state.tradeInValuationMatrix.find(m => m.brand.toLowerCase() === brand.toLowerCase() && m.model.toLowerCase() === model.toLowerCase());
    const base = matrix ? matrix.basePrice : 300;
    
    let totalDeductions = 0;
    if (deductions.screenBroken) totalDeductions += (matrix?.deductions?.screenBroken || -100);
    if (deductions.batterySub80) totalDeductions += (matrix?.deductions?.batterySub80 || -30);
    if (deductions.bodyHeavyScratch) totalDeductions += (matrix?.deductions?.bodyHeavyScratch || -40);
    if (deductions.cameraFaulty) totalDeductions += (matrix?.deductions?.cameraFaulty || -70);
    if (deductions.faceIdBroken) totalDeductions += (matrix?.deductions?.faceIdBroken || -80);

    const calculatedValuation = Math.max(50, base + totalDeductions);
    const estimatedResale = Math.round(calculatedValuation * 1.55);

    return {
      basePrice: base,
      totalDeductions,
      valuationOffer: calculatedValuation,
      estimatedResale
    };
  }

  processTradeInIntake(tradeData) {
    const tradeId = `TI-${Math.floor(1000 + Math.random() * 9000)}`;
    const voucherCode = `TRD-VOUCH-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Create inventory record
    const newDeviceId = `DEV-${Math.floor(1000 + Math.random() * 9000)}`;
    const isNeedsRefurb = tradeData.routeToRefurb || false;

    const newDevice = {
      id: newDeviceId,
      imei: tradeData.imei,
      serial: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      brand: tradeData.brand,
      model: tradeData.model,
      category: tradeData.category || 'Smartphone',
      variant: tradeData.variant || 'Standard',
      condition: isNeedsRefurb ? 'Refurbished' : 'Pre-Owned',
      grade: tradeData.evaluatedGrade || (isNeedsRefurb ? 'Grade C (Needs Refurb)' : 'Grade A'),
      batteryHealth: tradeData.batteryHealth || 90,
      branchId: tradeData.branchId,
      status: isNeedsRefurb ? 'in_refurb' : 'in_stock',
      intakeDate: new Date().toISOString().split('T')[0],
      agingDays: 0,
      costs: {
        acquisition: Number(tradeData.valuationOffer),
        parts: 0,
        labor: 0,
        logistics: 10,
        totalLanded: Number(tradeData.valuationOffer) + 10
      },
      suggestedPrice: Math.round(Number(tradeData.valuationOffer) * 1.5),
      sellingPrice: Math.round(Number(tradeData.valuationOffer) * 1.5),
      supplier: `Trade-In #${tradeId} (${tradeData.customerName})`,
      notes: `Trade-in intake from customer. Condition: ${tradeData.conditionNotes || 'Standard used'}`,
      costHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          description: `Trade-In Payout to ${tradeData.customerName}`,
          amount: Number(tradeData.valuationOffer),
          type: 'acquisition'
        },
        {
          date: new Date().toISOString().split('T')[0],
          description: 'Inbound inspection & intake handling',
          amount: 10,
          type: 'logistics'
        }
      ]
    };

    this.state.gadgets.unshift(newDevice);

    // If routed to Refurbishment, create a Refurb Job Card
    if (isNeedsRefurb) {
      const refurbId = `RFB-${Math.floor(100 + Math.random() * 900)}`;
      this.state.refurbOrders.unshift({
        id: refurbId,
        deviceId: newDeviceId,
        imei: tradeData.imei,
        deviceModel: `${tradeData.brand} ${tradeData.model} ${tradeData.variant || ''}`,
        branchId: tradeData.branchId,
        technician: tradeData.technician || 'Kevin S.',
        startDate: new Date().toISOString().split('T')[0],
        status: 'Diagnostics',
        partsConsumed: [],
        laborCost: 0,
        qcChecklist: {
          screenTouch: false, displayTrueTone: false, frontCamera: false, rearCamera: false,
          speakers: false, microphone: false, wifiBluetooth: false, biometrics: false,
          chargingPort: false, batteryCycleReset: false, cosmeticPolishing: false, finalPass: false
        },
        notes: `Auto-routed from Trade-In #${tradeId}. Needs inspection and parts restoration.`
      });
    }

    const tradeRecord = {
      id: tradeId,
      date: new Date().toISOString().split('T')[0],
      customerName: tradeData.customerName,
      customerPhone: tradeData.customerPhone,
      customerEmail: tradeData.customerEmail,
      branchId: tradeData.branchId,
      deviceBrand: tradeData.brand,
      deviceModel: tradeData.model,
      deviceImei: tradeData.imei,
      variant: tradeData.variant,
      conditionNotes: tradeData.conditionNotes,
      evaluatedGrade: tradeData.evaluatedGrade || 'Grade B',
      valuationOffer: Number(tradeData.valuationOffer),
      payoutType: tradeData.payoutType || 'Store Voucher',
      voucherCode: voucherCode,
      voucherStatus: 'Active',
      status: isNeedsRefurb ? 'Sent to Refurbishment' : 'Added to Stock',
      routedToDeviceId: newDeviceId,
      technician: tradeData.technician || 'Staff'
    };

    this.state.tradeInRecords.unshift(tradeRecord);
    this.logActivity('tradein', `Trade-In processed: ${tradeRecord.deviceBrand} ${tradeRecord.deviceModel} ($${tradeRecord.valuationOffer})`, tradeRecord.status);
    this.saveState();
    return { tradeRecord, newDevice };
  }

  // ================= REFURBISHMENT MANAGEMENT =================
  getRefurbOrders(filterBranch = null) {
    const branch = filterBranch || this.getActiveBranch();
    let list = this.state.refurbOrders || [];
    if (branch !== 'ALL') {
      list = list.filter(r => r.branchId === branch);
    }
    return list;
  }

  consumePartInRefurb(refurbOrderId, partId, qty = 1, laborAdded = 0) {
    const order = this.state.refurbOrders.find(r => r.id === refurbOrderId);
    const part = this.getSparePartById(partId);
    if (!order || !part) return false;

    // Deduct stock from branch
    const branchStock = (part.stock[order.branchId] || 0);
    if (branchStock < qty) {
      // Allow for demo purposes but adjust
      part.stock[order.branchId] = Math.max(0, branchStock - qty);
    } else {
      part.stock[order.branchId] -= qty;
    }

    const partTotalCost = part.costPrice * qty;
    order.partsConsumed.push({
      partId: part.id,
      name: part.name,
      cost: partTotalCost,
      qty: qty
    });

    order.laborCost = (order.laborCost || 0) + Number(laborAdded);

    // Update the linked Gadget's true landed cost in inventory!
    const gadget = this.getGadgetById(order.deviceId);
    if (gadget) {
      gadget.costs.parts = (gadget.costs.parts || 0) + partTotalCost;
      gadget.costs.labor = (gadget.costs.labor || 0) + Number(laborAdded);
      gadget.costs.totalLanded = gadget.costs.acquisition + gadget.costs.parts + gadget.costs.labor + gadget.costs.logistics;
      gadget.costHistory.push({
        date: new Date().toISOString().split('T')[0],
        description: `Refurb Part Replaced: ${part.name} (x${qty})`,
        amount: partTotalCost,
        type: 'parts'
      });
      if (laborAdded > 0) {
        gadget.costHistory.push({
          date: new Date().toISOString().split('T')[0],
          description: `Refurb Labor: ${order.technician}`,
          amount: Number(laborAdded),
          type: 'labor'
        });
      }
    }

    this.logActivity('refurb', `Part consumed in ${order.id}: ${part.name} (+$${partTotalCost})`, 'Cost Added');
    this.saveState();
    return true;
  }

  completeRefurbishment(refurbOrderId, newGrade = 'Grade A+') {
    const order = this.state.refurbOrders.find(r => r.id === refurbOrderId);
    if (!order) return false;

    order.status = 'Completed';
    order.completedDate = new Date().toISOString().split('T')[0];
    Object.keys(order.qcChecklist).forEach(k => order.qcChecklist[k] = true);

    const gadget = this.getGadgetById(order.deviceId);
    if (gadget) {
      gadget.status = 'in_stock';
      gadget.condition = 'Refurbished';
      gadget.grade = newGrade;
      gadget.batteryHealth = 100;
    }

    this.logActivity('refurb', `Refurbishment completed for ${order.deviceModel} (Passed QC)`, 'Ready for Shelf');
    this.saveState();
    return true;
  }

  // ================= REPAIR MANAGEMENT =================
  getRepairTickets(filterBranch = null) {
    const branch = filterBranch || this.getActiveBranch();
    let list = this.state.repairTickets || [];
    if (branch !== 'ALL') {
      list = list.filter(t => t.branchId === branch);
    }
    return list;
  }

  createRepairTicket(ticketData) {
    const ticketId = `REP-${Math.floor(4000 + Math.random() * 1000)}`;
    const newTicket = {
      id: ticketId,
      customerName: ticketData.customerName,
      customerPhone: ticketData.customerPhone,
      customerEmail: ticketData.customerEmail,
      branchId: ticketData.branchId || (this.getActiveBranch() === 'ALL' ? 'BR-01' : this.getActiveBranch()),
      device: ticketData.device,
      imei: ticketData.imei || `SN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      problemDescription: ticketData.problemDescription,
      priority: ticketData.priority || 'Medium',
      status: 'Received',
      technician: ticketData.technician || 'Alex Rivera',
      estimatedCost: Number(ticketData.estimatedCost) || 120,
      advanceDeposit: Number(ticketData.advanceDeposit) || 0,
      createdAt: new Date().toISOString(),
      partsRequired: [],
      laborFee: Number(ticketData.laborFee) || 50,
      totalBill: Number(ticketData.estimatedCost) || 120,
      warrantyDays: Number(ticketData.warrantyDays) || 90,
      notes: ticketData.notes || 'Ticket created at front desk.'
    };

    this.state.repairTickets.unshift(newTicket);
    this.logActivity('repair', `New repair ticket #${newTicket.id} created for ${newTicket.customerName} (${newTicket.device})`, 'Received');
    this.saveState();
    return newTicket;
  }

  updateRepairStatus(ticketId, newStatus) {
    const ticket = this.state.repairTickets.find(t => t.id === ticketId);
    if (!ticket) return false;

    ticket.status = newStatus;
    if (newStatus === 'Delivered') {
      ticket.deliveredAt = new Date().toISOString();
    } else if (newStatus === 'Ready for Pickup') {
      ticket.completedAt = new Date().toISOString();
    }

    this.logActivity('repair', `Ticket #${ticket.id} moved to status: ${newStatus}`, newStatus);
    this.saveState();
    return true;
  }

  addPartToRepair(ticketId, partId, clientPrice, laborAddition = 0) {
    const ticket = this.state.repairTickets.find(t => t.id === ticketId);
    const part = this.getSparePartById(partId);
    if (!ticket || !part) return false;

    // Deduct stock
    if (part.stock[ticket.branchId]) {
      part.stock[ticket.branchId] = Math.max(0, part.stock[ticket.branchId] - 1);
    }

    ticket.partsRequired.push({
      partId: part.id,
      name: part.name,
      partCost: part.costPrice,
      clientPrice: Number(clientPrice) || part.retailPrice,
      qty: 1
    });

    if (laborAddition > 0) {
      ticket.laborFee = (ticket.laborFee || 0) + Number(laborAddition);
    }

    // Recalculate bill
    const partsTotal = ticket.partsRequired.reduce((sum, p) => sum + p.clientPrice, 0);
    ticket.totalBill = partsTotal + (ticket.laborFee || 0);

    this.logActivity('repair', `Spare part attached to ticket #${ticket.id}: ${part.name}`, 'Bill Updated');
    this.saveState();
    return true;
  }

  // ================= POS & DEVICE SALES =================
  getSales(filterBranch = null) {
    const branch = filterBranch || this.getActiveBranch();
    let list = this.state.salesTransactions || [];
    if (branch !== 'ALL') {
      list = list.filter(s => s.branchId === branch);
    }
    return list;
  }

  processDeviceSale(saleData) {
    const gadget = this.getGadgetById(saleData.deviceId);
    if (!gadget) throw new Error('Device not found');

    const invoiceId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const sellingPrice = Number(saleData.sellingPrice);
    const discount = Number(saleData.discount) || 0;
    const finalPrice = Math.max(0, sellingPrice - discount);
    const tax = Math.round(finalPrice * 0.08 * 100) / 100;
    const netTotal = finalPrice + tax;

    const landedCost = gadget.costs.totalLanded || (gadget.costs.acquisition + gadget.costs.parts + gadget.costs.labor + gadget.costs.logistics);
    const realizedProfit = Math.round((finalPrice - landedCost) * 100) / 100;
    const marginPercent = finalPrice > 0 ? Math.round((realizedProfit / finalPrice) * 1000) / 10 : 0;

    // Mark device as sold
    gadget.status = 'sold';
    gadget.soldDate = new Date().toISOString().split('T')[0];
    gadget.soldTo = {
      customer: saleData.customerName,
      invoiceId: invoiceId,
      profit: realizedProfit,
      marginPercent: marginPercent
    };

    const transaction = {
      id: invoiceId,
      date: new Date().toISOString(),
      branchId: gadget.branchId,
      customer: {
        name: saleData.customerName,
        phone: saleData.customerPhone || 'N/A',
        email: saleData.customerEmail || 'N/A'
      },
      device: {
        id: gadget.id,
        imei: gadget.imei,
        serial: gadget.serial,
        model: `${gadget.brand} ${gadget.model} (${gadget.variant})`,
        condition: gadget.condition
      },
      financials: {
        acquisitionCost: gadget.costs.acquisition,
        partsCost: gadget.costs.parts,
        laborCost: gadget.costs.labor,
        logisticsCost: gadget.costs.logistics,
        totalLandedCost: landedCost,
        sellingPrice: sellingPrice,
        discount: discount,
        tax: tax,
        netTotal: netTotal,
        realizedProfit: realizedProfit,
        marginPercent: marginPercent
      },
      paymentMethod: saleData.paymentMethod || 'Credit Card',
      salesRep: saleData.salesRep || 'Store Specialist',
      warrantyMonths: Number(saleData.warrantyMonths) || 12
    };

    this.state.salesTransactions.unshift(transaction);
    this.logActivity('sale', `Sale #${invoiceId}: ${transaction.device.model} sold for $${finalPrice} (Profit: $${realizedProfit})`, `+${marginPercent}% Margin`);
    this.saveState();
    return transaction;
  }

  // ================= INTER-BRANCH TRANSFERS =================
  getTransfers() {
    return this.state.transfers || [];
  }

  initiateTransfer(deviceId, toBranchId, trackingNote = '') {
    const gadget = this.getGadgetById(deviceId);
    if (!gadget) return false;

    const transferId = `TRF-${Math.floor(400 + Math.random() * 600)}`;
    const fromBranchId = gadget.branchId;

    gadget.status = 'in_transfer';

    const transfer = {
      id: transferId,
      transferDate: new Date().toISOString().split('T')[0],
      fromBranchId: fromBranchId,
      toBranchId: toBranchId,
      deviceId: gadget.id,
      imei: gadget.imei,
      deviceModel: `${gadget.brand} ${gadget.model} ${gadget.variant}`,
      status: 'In Transit',
      initiatedBy: 'Store Supervisor',
      receivedBy: null,
      trackingNote: trackingNote || 'Scheduled branch inventory transfer'
    };

    this.state.transfers.unshift(transfer);
    this.logActivity('transfer', `Transfer #${transferId} created for IMEI ${gadget.imei} to ${this.getBranchById(toBranchId)?.name}`, 'In Transit');
    this.saveState();
    return transfer;
  }

  receiveTransfer(transferId) {
    const transfer = this.state.transfers.find(t => t.id === transferId);
    if (!transfer) return false;

    transfer.status = 'Received';
    transfer.receivedBy = 'Branch Manager';

    const gadget = this.getGadgetById(transfer.deviceId);
    if (gadget) {
      gadget.branchId = transfer.toBranchId;
      gadget.status = 'in_stock';
      gadget.costHistory.push({
        date: new Date().toISOString().split('T')[0],
        description: `Transferred from ${this.getBranchById(transfer.fromBranchId)?.name} to ${this.getBranchById(transfer.toBranchId)?.name}`,
        amount: 0,
        type: 'transfer'
      });
    }

    this.logActivity('transfer', `Transfer #${transferId} received at ${this.getBranchById(transfer.toBranchId)?.name}`, 'Stock Updated');
    this.saveState();
    return true;
  }

  // ================= STOCK AGING & MARKDOWN =================
  applyMarkdownDiscount(deviceId, discountAmount) {
    const gadget = this.getGadgetById(deviceId);
    if (!gadget) return false;

    gadget.markdownDiscount = Number(discountAmount);
    gadget.sellingPrice = Math.max(gadget.costs.totalLanded, (gadget.suggestedPrice || gadget.sellingPrice) - Number(discountAmount));

    this.logActivity('inventory', `Markdown promo applied to ${gadget.brand} ${gadget.model} (Discount: -$${discountAmount})`, 'Promo Active');
    this.saveState();
    return true;
  }

  // ================= METRICS & ANALYTICS HELPER =================
  getSummaryKPIs() {
    const branch = this.getActiveBranch();
    const gadgets = this.getGadgets(branch);
    const inStock = gadgets.filter(g => g.status === 'in_stock');
    const sales = this.getSales(branch);
    const repairs = this.getRepairTickets(branch);
    const refurbs = this.getRefurbOrders(branch);

    const totalInventoryValue = inStock.reduce((sum, g) => sum + (g.costs?.totalLanded || 0), 0);
    const totalPotentialSales = inStock.reduce((sum, g) => sum + (g.sellingPrice || 0), 0);
    const totalNetSales = sales.reduce((sum, s) => sum + (s.financials?.sellingPrice - (s.financials?.discount || 0)), 0);
    const totalRealizedProfit = sales.reduce((sum, s) => sum + (s.financials?.realizedProfit || 0), 0);
    const overallMargin = totalNetSales > 0 ? ((totalRealizedProfit / totalNetSales) * 100).toFixed(1) : 0;

    const activeRepairsCount = repairs.filter(r => r.status !== 'Delivered').length;
    const pendingRefurbsCount = refurbs.filter(r => r.status !== 'Completed').length;
    const slowMovingCount = inStock.filter(g => (g.agingDays || 0) > 60).length;

    return {
      totalInventoryValue,
      totalPotentialSales,
      totalNetSales,
      totalRealizedProfit,
      overallMargin,
      inStockCount: inStock.length,
      activeRepairsCount,
      pendingRefurbsCount,
      slowMovingCount,
      totalSalesCount: sales.length
    };
  }

  logActivity(type, message, badge) {
    if (!this.state.activityLogs) this.state.activityLogs = [];
    this.state.activityLogs.unshift({
      id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: 'Just now',
      type: type,
      message: message,
      user: 'Admin User',
      badge: badge
    });
    if (this.state.activityLogs.length > 20) {
      this.state.activityLogs.pop();
    }
  }
}

// Global Store Singleton
window.erpStore = new ERPStore();
