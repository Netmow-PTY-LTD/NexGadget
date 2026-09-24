/**
 * NexGadget ERP - Initial Demo Seed Data
 * Rich realistic dataset for multi-branch gadget operations
 */

const INITIAL_DATA = {
  branches: [
    {
      id: "BR-01",
      name: "Downtown Flagship",
      code: "DT-01",
      address: "104 Tech Avenue, Downtown",
      phone: "+1 (555) 234-8901",
      manager: "Marcus Vance",
      color: "#3b82f6",
      isHQ: true
    },
    {
      id: "BR-02",
      name: "Uptown Mall Store",
      code: "UP-02",
      address: "Level 2, Uptown Galleria Mall",
      phone: "+1 (555) 345-6789",
      manager: "Elena Rostova",
      color: "#10b981",
      isHQ: false
    },
    {
      id: "BR-03",
      name: "Tech Hub Warehouse",
      code: "TH-03",
      address: "45 Logistics Way, Industrial Park",
      phone: "+1 (555) 456-7890",
      manager: "Darius Thorne",
      color: "#f59e0b",
      isHQ: false
    }
  ],

  // 3 & 4. Gadget Inventory with IMEI/Serial Number Cost Breakdown
  gadgets: [
    {
      id: "DEV-1001",
      imei: "359876102938471",
      serial: "F2LZ982Q0D",
      brand: "Apple",
      model: "iPhone 15 Pro Max",
      category: "Smartphone",
      variant: "256GB Natural Titanium",
      condition: "Brand New",
      grade: "New (Sealed)",
      batteryHealth: 100,
      branchId: "BR-01",
      status: "in_stock", // in_stock, in_refurb, reserved, sold, in_transfer
      intakeDate: "2026-08-20",
      agingDays: 35,
      costs: {
        acquisition: 980,
        parts: 0,
        labor: 0,
        logistics: 15,
        totalLanded: 995
      },
      suggestedPrice: 1199,
      sellingPrice: 1199,
      supplier: "Apex Global Wholesale",
      notes: "Original factory seal verified. US Retail Model.",
      costHistory: [
        { date: "2026-08-20", description: "Direct wholesale purchase", amount: 980, type: "acquisition" },
        { date: "2026-08-20", description: "Inbound shipping & customs allocation", amount: 15, type: "logistics" }
      ]
    },
    {
      id: "DEV-1002",
      imei: "354928172635489",
      serial: "DN6C78M3P0",
      brand: "Apple",
      model: "iPhone 14 Pro",
      category: "Smartphone",
      variant: "128GB Deep Purple",
      condition: "Refurbished",
      grade: "Grade A+",
      batteryHealth: 100,
      branchId: "BR-01",
      status: "in_stock",
      intakeDate: "2026-08-10",
      agingDays: 45,
      costs: {
        acquisition: 520, // Trade-in valuation
        parts: 95,       // New OLED Screen + OEM Battery
        labor: 40,       // Tech labor
        logistics: 10,
        totalLanded: 665
      },
      suggestedPrice: 849,
      sellingPrice: 849,
      supplier: "Trade-In #TI-8092",
      notes: "Screen & battery replaced in-house. 100% TrueTone calibrated.",
      costHistory: [
        { date: "2026-08-10", description: "Trade-in Intake from John Miller", amount: 520, type: "acquisition" },
        { date: "2026-08-12", description: "Replaced OEM OLED Screen (SKU: SCR-IP14P)", amount: 65, type: "parts" },
        { date: "2026-08-12", description: "Replaced OEM Battery Pack (SKU: BAT-IP14P)", amount: 30, type: "parts" },
        { date: "2026-08-12", description: "Technician Refurbishment Labor (Tech: Kevin S.)", amount: 40, type: "labor" },
        { date: "2026-08-13", description: "Handling & QC Verification", amount: 10, type: "logistics" }
      ]
    },
    {
      id: "DEV-1003",
      imei: "990012847583920",
      serial: "R5CW407KZLE",
      brand: "Samsung",
      model: "Galaxy S24 Ultra",
      category: "Smartphone",
      variant: "512GB Titanium Gray",
      condition: "Open Box",
      grade: "Pristine",
      batteryHealth: 99,
      branchId: "BR-02",
      status: "in_stock",
      intakeDate: "2026-09-12",
      agingDays: 12,
      costs: {
        acquisition: 910,
        parts: 0,
        labor: 0,
        logistics: 10,
        totalLanded: 920
      },
      suggestedPrice: 1150,
      sellingPrice: 1150,
      supplier: "Customer Return Outlet",
      notes: "Original box, cable and S-Pen included. Flawless condition.",
      costHistory: [
        { date: "2026-09-12", description: "Acquired from wholesale return lot", amount: 910, type: "acquisition" },
        { date: "2026-09-12", description: "Logistics and diagnostic test", amount: 10, type: "logistics" }
      ]
    },
    {
      id: "DEV-1004",
      imei: "358746201948573",
      serial: "C02G901AMD6",
      brand: "Apple",
      model: "MacBook Pro 16\" M3 Pro",
      category: "Laptop",
      variant: "18GB RAM / 512GB Space Black",
      condition: "Brand New",
      grade: "New (Sealed)",
      batteryHealth: 100,
      branchId: "BR-01",
      status: "in_stock",
      intakeDate: "2026-06-15",
      agingDays: 101, // Slow moving stock! (>90 days)
      costs: {
        acquisition: 1950,
        parts: 0,
        labor: 0,
        logistics: 25,
        totalLanded: 1975
      },
      suggestedPrice: 2499,
      sellingPrice: 2299, // Markdown applied
      markdownDiscount: 200,
      supplier: "TechDistro Corp",
      notes: "High value laptop, aging over 90 days. Flagged for promo.",
      costHistory: [
        { date: "2026-06-15", description: "Direct distributor order", amount: 1950, type: "acquisition" },
        { date: "2026-06-15", description: "Insured express delivery", amount: 25, type: "logistics" }
      ]
    },
    {
      id: "DEV-1005",
      imei: "860472059384712",
      serial: "NXKJ4002948",
      brand: "Sony",
      model: "PlayStation 5 Slim",
      category: "Gaming",
      variant: "1TB Disc Edition",
      condition: "Pre-Owned",
      grade: "Grade B+",
      batteryHealth: null,
      branchId: "BR-02",
      status: "in_stock",
      intakeDate: "2026-07-20",
      agingDays: 66, // 61-90 days bucket
      costs: {
        acquisition: 290,
        parts: 25, // New HDMI Port replacement
        labor: 30,
        logistics: 5,
        totalLanded: 350
      },
      suggestedPrice: 429,
      sellingPrice: 419,
      supplier: "Trade-In #TI-7822",
      notes: "HDMI port replaced, fully cleaned and thermally repasted.",
      costHistory: [
        { date: "2026-07-20", description: "Trade-in payout", amount: 290, type: "acquisition" },
        { date: "2026-07-22", description: "HDMI 2.1 port module (SKU: PRT-PS5-HDMI)", amount: 25, type: "parts" },
        { date: "2026-07-22", description: "Port microsoldering & deep cleaning labor", amount: 30, type: "labor" },
        { date: "2026-07-23", description: "QC thermal benchmark stress test", amount: 5, type: "logistics" }
      ]
    },
    {
      id: "DEV-1006",
      imei: "356782910394857",
      serial: "G6TF892KMD",
      brand: "Apple",
      model: "iPhone 13",
      category: "Smartphone",
      variant: "128GB Midnight",
      condition: "Pre-Owned",
      grade: "Grade B",
      batteryHealth: 88,
      branchId: "BR-03",
      status: "in_refurb",
      intakeDate: "2026-09-20",
      agingDays: 4,
      costs: {
        acquisition: 260,
        parts: 0,
        labor: 0,
        logistics: 5,
        totalLanded: 265
      },
      suggestedPrice: 449,
      sellingPrice: 449,
      supplier: "Trade-In #TI-9104",
      notes: "Currently in Refurbishment queue for battery replacement.",
      costHistory: [
        { date: "2026-09-20", description: "Customer trade-in credit", amount: 260, type: "acquisition" },
        { date: "2026-09-20", description: "Warehouse intake logistics", amount: 5, type: "logistics" }
      ]
    },
    {
      id: "DEV-1007",
      imei: "351982736452819",
      serial: "H8JK293L8Q",
      brand: "Google",
      model: "Pixel 8 Pro",
      category: "Smartphone",
      variant: "128GB Bay Blue",
      condition: "Refurbished",
      grade: "Grade A",
      batteryHealth: 96,
      branchId: "BR-03",
      status: "in_transfer",
      intakeDate: "2026-08-25",
      agingDays: 30,
      costs: {
        acquisition: 430,
        parts: 55, // Camera Glass + Housing polish
        labor: 35,
        logistics: 15,
        totalLanded: 535
      },
      suggestedPrice: 699,
      sellingPrice: 699,
      supplier: "Trade-In #TI-8411",
      notes: "In transit from Tech Hub Warehouse to Uptown Mall Store.",
      costHistory: [
        { date: "2026-08-25", description: "Trade-in intake", amount: 430, type: "acquisition" },
        { date: "2026-08-27", description: "Rear Camera Glass Assembly", amount: 55, type: "parts" },
        { date: "2026-08-27", description: "Technician assembly labor", amount: 35, type: "labor" },
        { date: "2026-08-28", description: "Transfer manifest #TRF-402", amount: 15, type: "logistics" }
      ]
    },
    {
      id: "DEV-1008",
      imei: "359182736450192",
      serial: "DNPX9012KA",
      brand: "Apple",
      model: "iPad Pro 12.9\" M2",
      category: "Tablet",
      variant: "256GB Wi-Fi Space Gray",
      condition: "Pre-Owned",
      grade: "Grade A",
      batteryHealth: 94,
      branchId: "BR-01",
      status: "in_stock",
      intakeDate: "2026-08-01",
      agingDays: 54, // 31-60 days
      costs: {
        acquisition: 680,
        parts: 0,
        labor: 0,
        logistics: 12,
        totalLanded: 692
      },
      suggestedPrice: 899,
      sellingPrice: 899,
      supplier: "Corporate Liquidation Lot",
      notes: "Includes Apple Pencil Gen 2 compatible.",
      costHistory: [
        { date: "2026-08-01", description: "Corporate buyback", amount: 680, type: "acquisition" },
        { date: "2026-08-01", description: "Sanitization & testing", amount: 12, type: "logistics" }
      ]
    },
    {
      id: "DEV-1009",
      imei: "358291049281726",
      serial: "L901KC72MD",
      brand: "Apple",
      model: "Apple Watch Ultra 2",
      category: "Smartwatch",
      variant: "49mm Titanium / Orange Alpine",
      condition: "Brand New",
      grade: "New (Sealed)",
      batteryHealth: 100,
      branchId: "BR-02",
      status: "sold",
      intakeDate: "2026-08-15",
      soldDate: "2026-09-18",
      agingDays: 34,
      costs: {
        acquisition: 610,
        parts: 0,
        labor: 0,
        logistics: 10,
        totalLanded: 620
      },
      suggestedPrice: 799,
      sellingPrice: 799,
      soldTo: {
        customer: "Sarah Jenkins",
        invoiceId: "INV-2026-0912",
        profit: 179,
        marginPercent: 22.4
      },
      costHistory: [
        { date: "2026-08-15", description: "Direct distributor order", amount: 610, type: "acquisition" },
        { date: "2026-08-15", description: "Freight fee", amount: 10, type: "logistics" }
      ]
    },
    {
      id: "DEV-1010",
      imei: "354109283746152",
      serial: "P409823LMK",
      brand: "Samsung",
      model: "Galaxy Z Fold 5",
      category: "Smartphone",
      variant: "512GB Phantom Black",
      condition: "Pre-Owned",
      grade: "Grade C",
      batteryHealth: 86,
      branchId: "BR-03",
      status: "in_stock",
      intakeDate: "2026-05-10",
      agingDays: 137, // Critical Dead Stock (>90 days)
      costs: {
        acquisition: 750,
        parts: 0,
        labor: 0,
        logistics: 15,
        totalLanded: 765
      },
      suggestedPrice: 1099,
      sellingPrice: 849, // Steep markdown suggested
      markdownDiscount: 250,
      supplier: "Trade-In #TI-6510",
      notes: "Small hinge scuff, screen 100% intact. Recommended for clearance sale.",
      costHistory: [
        { date: "2026-05-10", description: "Trade-in buyback", amount: 750, type: "acquisition" },
        { date: "2026-05-10", description: "Handling fee", amount: 15, type: "logistics" }
      ]
    }
  ],

  // 7. Spare Parts Inventory
  spareParts: [
    {
      id: "PRT-01",
      sku: "SCR-IP15PM-OLED",
      name: "iPhone 15 Pro Max OEM OLED Display Assembly",
      category: "Display / Screen",
      compatibility: ["iPhone 15 Pro Max"],
      stock: {
        "BR-01": 8,
        "BR-02": 4,
        "BR-03": 15
      },
      minThreshold: 5,
      costPrice: 110,
      retailPrice: 220,
      supplier: "Shenzhen Precision Tech",
      notes: "Grade AAA OLED with IC transfer capability."
    },
    {
      id: "PRT-02",
      sku: "SCR-IP14P-OLED",
      name: "iPhone 14 Pro OLED Display Assembly",
      category: "Display / Screen",
      compatibility: ["iPhone 14 Pro"],
      stock: {
        "BR-01": 2, // Alert: Low stock in Flagship!
        "BR-02": 3,
        "BR-03": 8
      },
      minThreshold: 4,
      costPrice: 85,
      retailPrice: 180,
      supplier: "Shenzhen Precision Tech",
      notes: "Includes proximity bracket and ear mesh."
    },
    {
      id: "PRT-03",
      sku: "BAT-IP14P",
      name: "iPhone 14 Pro OEM Replacement Battery (3200mAh)",
      category: "Battery",
      compatibility: ["iPhone 14 Pro"],
      stock: {
        "BR-01": 12,
        "BR-02": 7,
        "BR-03": 25
      },
      minThreshold: 6,
      costPrice: 22,
      retailPrice: 65,
      supplier: "Ampere Volt Components",
      notes: "TI Texas Instruments Gas Gauge chip."
    },
    {
      id: "PRT-04",
      sku: "BAT-IP15PM",
      name: "iPhone 15 Pro Max Battery Pack (4422mAh)",
      category: "Battery",
      compatibility: ["iPhone 15 Pro Max"],
      stock: {
        "BR-01": 6,
        "BR-02": 1, // Critical low in Uptown!
        "BR-03": 14
      },
      minThreshold: 5,
      costPrice: 28,
      retailPrice: 75,
      supplier: "Ampere Volt Components",
      notes: "0-Cycle brand new cell."
    },
    {
      id: "PRT-05",
      sku: "SCR-S24U-AMOL",
      name: "Samsung Galaxy S24 Ultra Dynamic AMOLED 2X Display + Frame",
      category: "Display / Screen",
      compatibility: ["Samsung Galaxy S24 Ultra"],
      stock: {
        "BR-01": 4,
        "BR-02": 2,
        "BR-03": 6
      },
      minThreshold: 3,
      costPrice: 145,
      retailPrice: 280,
      supplier: "Korea Semi Direct",
      notes: "Original Service Pack with Titanium bezel."
    },
    {
      id: "PRT-06",
      sku: "CHG-IP15-USBC",
      name: "iPhone 15 Series USB-C Flex Charging Port",
      category: "Charging Port",
      compatibility: ["iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max"],
      stock: {
        "BR-01": 15,
        "BR-02": 10,
        "BR-03": 30
      },
      minThreshold: 8,
      costPrice: 14,
      retailPrice: 45,
      supplier: "Shenzhen Precision Tech",
      notes: "Original microphone & fast charging controller."
    },
    {
      id: "PRT-07",
      sku: "CAM-IP14P-MAIN",
      name: "iPhone 14 Pro 48MP Main Camera Sensor Module",
      category: "Camera",
      compatibility: ["iPhone 14 Pro", "iPhone 14 Pro Max"],
      stock: {
        "BR-01": 3,
        "BR-02": 0, // Out of stock in Uptown
        "BR-03": 5
      },
      minThreshold: 3,
      costPrice: 58,
      retailPrice: 135,
      supplier: "Apex Optics",
      notes: "Sensor-shift OIS calibrated."
    },
    {
      id: "PRT-08",
      sku: "GLS-IP15P-BACK",
      name: "iPhone 15 Pro Rear Glass Panel (Natural Titanium)",
      category: "Back Glass / Housing",
      compatibility: ["iPhone 15 Pro"],
      stock: {
        "BR-01": 9,
        "BR-02": 4,
        "BR-03": 18
      },
      minThreshold: 5,
      costPrice: 18,
      retailPrice: 60,
      supplier: "Apex Optics",
      notes: "Matte finish with MagSafe magnet array pre-installed."
    }
  ],

  // 5. Trade-In Valuation Catalog & Intake Logs
  tradeInValuationMatrix: [
    { brand: "Apple", model: "iPhone 15 Pro Max", basePrice: 750, deductions: { screenBroken: -150, batterySub80: -40, bodyHeavyScratch: -60, cameraFaulty: -110, faceIdBroken: -120 } },
    { brand: "Apple", model: "iPhone 15 Pro", basePrice: 640, deductions: { screenBroken: -130, batterySub80: -35, bodyHeavyScratch: -50, cameraFaulty: -95, faceIdBroken: -100 } },
    { brand: "Apple", model: "iPhone 14 Pro Max", basePrice: 520, deductions: { screenBroken: -120, batterySub80: -30, bodyHeavyScratch: -45, cameraFaulty: -85, faceIdBroken: -90 } },
    { brand: "Apple", model: "iPhone 14 Pro", basePrice: 460, deductions: { screenBroken: -110, batterySub80: -30, bodyHeavyScratch: -40, cameraFaulty: -80, faceIdBroken: -85 } },
    { brand: "Apple", model: "iPhone 13", basePrice: 310, deductions: { screenBroken: -80, batterySub80: -25, bodyHeavyScratch: -35, cameraFaulty: -60, faceIdBroken: -70 } },
    { brand: "Samsung", model: "Galaxy S24 Ultra", basePrice: 700, deductions: { screenBroken: -160, batterySub80: -35, bodyHeavyScratch: -50, cameraFaulty: -100, faceIdBroken: -50 } },
    { brand: "Samsung", model: "Galaxy S23 Ultra", basePrice: 480, deductions: { screenBroken: -130, batterySub80: -30, bodyHeavyScratch: -40, cameraFaulty: -80, faceIdBroken: -40 } },
    { brand: "Google", model: "Pixel 8 Pro", basePrice: 420, deductions: { screenBroken: -100, batterySub80: -30, bodyHeavyScratch: -40, cameraFaulty: -70, faceIdBroken: -40 } }
  ],

  tradeInRecords: [
    {
      id: "TI-9104",
      date: "2026-09-20",
      customerName: "David Miller",
      customerPhone: "+1 (555) 789-0123",
      customerEmail: "david.m@example.com",
      branchId: "BR-03",
      deviceBrand: "Apple",
      deviceModel: "iPhone 13",
      deviceImei: "356782910394857",
      variant: "128GB Midnight",
      conditionNotes: "Scratched frame, battery 88%, fully functional screen.",
      evaluatedGrade: "Grade B",
      valuationOffer: 260,
      payoutType: "Store Voucher", // Store Voucher / Cash
      voucherCode: "TRD-VOUCH-8941",
      voucherStatus: "Active",
      status: "Sent to Refurbishment",
      routedToDeviceId: "DEV-1006",
      technician: "Alex Rivera"
    },
    {
      id: "TI-8092",
      date: "2026-08-10",
      customerName: "John Miller",
      customerPhone: "+1 (555) 456-7812",
      customerEmail: "jmiller99@example.com",
      branchId: "BR-01",
      deviceBrand: "Apple",
      deviceModel: "iPhone 14 Pro",
      deviceImei: "354928172635489",
      variant: "128GB Deep Purple",
      conditionNotes: "Cracked outer glass, degraded battery at 76%.",
      evaluatedGrade: "Grade C (Needs Refurb)",
      valuationOffer: 520,
      payoutType: "Instant Trade-In Credit",
      voucherCode: "TRD-VOUCH-7712",
      voucherStatus: "Redeemed",
      status: "Refurbished & Listed",
      routedToDeviceId: "DEV-1002",
      technician: "Kevin S."
    }
  ],

  // 6. Refurbishment Workshop Orders
  refurbOrders: [
    {
      id: "RFB-301",
      deviceId: "DEV-1006",
      imei: "356782910394857",
      deviceModel: "iPhone 13 128GB Midnight",
      branchId: "BR-03",
      technician: "Kevin S.",
      startDate: "2026-09-21",
      status: "In Progress", // Diagnostics, Waiting Parts, In Progress, QC Testing, Completed
      partsConsumed: [
        { partId: "PRT-03", name: "iPhone 14/13 Battery Pack", cost: 22, qty: 1 }
      ],
      laborCost: 35,
      qcChecklist: {
        screenTouch: true,
        displayTrueTone: true,
        frontCamera: true,
        rearCamera: true,
        speakers: true,
        microphone: true,
        wifiBluetooth: true,
        biometrics: true,
        chargingPort: true,
        batteryCycleReset: false,
        cosmeticPolishing: false,
        finalPass: false
      },
      notes: "Battery health was 88%, fitting fresh 100% capacity OEM pack."
    },
    {
      id: "RFB-298",
      deviceId: "DEV-1002",
      imei: "354928172635489",
      deviceModel: "iPhone 14 Pro 128GB Deep Purple",
      branchId: "BR-01",
      technician: "Kevin S.",
      startDate: "2026-08-11",
      completedDate: "2026-08-13",
      status: "Completed",
      partsConsumed: [
        { partId: "PRT-02", name: "iPhone 14 Pro OLED Display Assembly", cost: 65, qty: 1 },
        { partId: "PRT-03", name: "iPhone 14 Pro Battery Pack", cost: 30, qty: 1 }
      ],
      laborCost: 40,
      qcChecklist: {
        screenTouch: true,
        displayTrueTone: true,
        frontCamera: true,
        rearCamera: true,
        speakers: true,
        microphone: true,
        wifiBluetooth: true,
        biometrics: true,
        chargingPort: true,
        batteryCycleReset: true,
        cosmeticPolishing: true,
        finalPass: true
      },
      notes: "Passed full 12-point QC. Listed for $849 in Flagship Store."
    }
  ],

  // 8. Repair Management Tickets
  repairTickets: [
    {
      id: "REP-4011",
      customerName: "Jessica Lee",
      customerPhone: "+1 (555) 912-3456",
      customerEmail: "jessica.lee@example.com",
      branchId: "BR-01",
      device: "iPhone 15 Pro",
      imei: "359019284756192",
      problemDescription: "Shattered front screen after drop, touch unresponsive on lower half.",
      priority: "High",
      status: "In Progress", // Received, Diagnostic, Waiting for Parts, In Progress, Testing, Ready for Pickup, Delivered
      technician: "Alex Rivera",
      estimatedCost: 265,
      advanceDeposit: 100,
      createdAt: "2026-09-22T10:30:00",
      estimatedCompletion: "2026-09-24T17:00:00",
      partsRequired: [
        { partId: "PRT-01", name: "iPhone 15 Pro OLED Display", partCost: 110, clientPrice: 195, qty: 1 }
      ],
      laborFee: 70,
      totalBill: 265,
      warrantyDays: 90,
      notes: "Customer requested original color calibration."
    },
    {
      id: "REP-4012",
      customerName: "Robert Taylor",
      customerPhone: "+1 (555) 345-9876",
      customerEmail: "rtaylor@acme.org",
      branchId: "BR-02",
      device: "Samsung Galaxy S24 Ultra",
      imei: "990182746152819",
      problemDescription: "Device not charging, loose USB-C port connection.",
      priority: "Medium",
      status: "Waiting for Parts",
      technician: "Samantha Wu",
      estimatedCost: 115,
      advanceDeposit: 50,
      createdAt: "2026-09-23T14:15:00",
      estimatedCompletion: "2026-09-25T12:00:00",
      partsRequired: [
        { partId: "PRT-06", name: "USB-C Sub-Board Assembly", partCost: 14, clientPrice: 55, qty: 1 }
      ],
      laborFee: 60,
      totalBill: 115,
      warrantyDays: 90,
      notes: "Part requested from Warehouse TH-03."
    },
    {
      id: "REP-4009",
      customerName: "Michael Chang",
      customerPhone: "+1 (555) 789-4321",
      customerEmail: "m.chang@startup.io",
      branchId: "BR-01",
      device: "iPhone 14 Pro",
      imei: "354019284758192",
      problemDescription: "Battery drains quickly, shuts down at 20%.",
      priority: "Low",
      status: "Ready for Pickup",
      technician: "Alex Rivera",
      estimatedCost: 89,
      advanceDeposit: 89,
      createdAt: "2026-09-21T09:00:00",
      completedAt: "2026-09-23T16:00:00",
      partsRequired: [
        { partId: "PRT-03", name: "iPhone 14 Pro OEM Battery", partCost: 22, clientPrice: 59, qty: 1 }
      ],
      laborFee: 30,
      totalBill: 89,
      warrantyDays: 180,
      notes: "Replaced battery, calibrated to 100% capacity. Ready for collection."
    },
    {
      id: "REP-4005",
      customerName: "Amanda Foster",
      customerPhone: "+1 (555) 432-1098",
      customerEmail: "amanda.f@gmail.com",
      branchId: "BR-02",
      device: "Sony PlayStation 5",
      imei: "SN-PS5-9018471",
      problemDescription: "No HDMI signal on TV, black screen.",
      priority: "Medium",
      status: "Delivered",
      technician: "Samantha Wu",
      estimatedCost: 120,
      advanceDeposit: 120,
      createdAt: "2026-09-15T11:00:00",
      completedAt: "2026-09-17T15:30:00",
      deliveredAt: "2026-09-18T18:00:00",
      partsRequired: [
        { partId: "PRT-07", name: "PS5 HDMI 2.1 Port", partCost: 25, clientPrice: 60, qty: 1 }
      ],
      laborFee: 60,
      totalBill: 120,
      warrantyDays: 90,
      notes: "Successfully micro-soldered port. Tested 4K 120Hz."
    }
  ],

  // 9. Sales Transactions with Unit P&L Tracking
  salesTransactions: [
    {
      id: "INV-2026-0912",
      date: "2026-09-18T16:45:00",
      branchId: "BR-02",
      customer: {
        name: "Sarah Jenkins",
        phone: "+1 (555) 890-1234",
        email: "sarah.j@outlook.com"
      },
      device: {
        id: "DEV-1009",
        imei: "358291049281726",
        serial: "L901KC72MD",
        model: "Apple Watch Ultra 2 (49mm Titanium)",
        condition: "Brand New"
      },
      financials: {
        acquisitionCost: 610,
        partsCost: 0,
        laborCost: 0,
        logisticsCost: 10,
        totalLandedCost: 620,
        sellingPrice: 799,
        discount: 0,
        tax: 63.92,
        netTotal: 862.92,
        realizedProfit: 179,
        marginPercent: 22.4
      },
      paymentMethod: "Credit Card (Visa)",
      salesRep: "Elena Rostova",
      warrantyMonths: 12
    },
    {
      id: "INV-2026-0908",
      date: "2026-09-14T13:20:00",
      branchId: "BR-01",
      customer: {
        name: "Brandon Cole",
        phone: "+1 (555) 678-9012",
        email: "bcole@techfirm.com"
      },
      device: {
        id: "DEV-1099",
        imei: "352910485726190",
        serial: "X092LK391A",
        model: "iPhone 14 Pro Max 256GB Gold",
        condition: "Refurbished (Grade A+)"
      },
      financials: {
        acquisitionCost: 580,
        partsCost: 85,
        laborCost: 35,
        logisticsCost: 10,
        totalLandedCost: 710,
        sellingPrice: 949,
        discount: 30, // Promotional discount
        tax: 73.52,
        netTotal: 992.52,
        realizedProfit: 209,
        marginPercent: 22.7
      },
      paymentMethod: "Split (Cash $400 + Card $592.52)",
      salesRep: "Marcus Vance",
      warrantyMonths: 6
    },
    {
      id: "INV-2026-0899",
      date: "2026-09-05T11:10:00",
      branchId: "BR-01",
      customer: {
        name: "Sophia Martinez",
        phone: "+1 (555) 123-9988",
        email: "sophia.m@gmail.com"
      },
      device: {
        id: "DEV-1088",
        imei: "990182736450192",
        serial: "R5CWA01928K",
        model: "Samsung Galaxy S23 Ultra 256GB Green",
        condition: "Pre-Owned (Grade A)"
      },
      financials: {
        acquisitionCost: 490,
        partsCost: 0,
        laborCost: 0,
        logisticsCost: 10,
        totalLandedCost: 500,
        sellingPrice: 729,
        discount: 0,
        tax: 58.32,
        netTotal: 787.32,
        realizedProfit: 229,
        marginPercent: 31.4
      },
      paymentMethod: "Trade-In Voucher + Card",
      salesRep: "Alex Rivera",
      warrantyMonths: 3
    }
  ],

  // 2. Inter-Branch Stock Transfers
  transfers: [
    {
      id: "TRF-402",
      transferDate: "2026-08-28",
      fromBranchId: "BR-03",
      toBranchId: "BR-02",
      deviceId: "DEV-1007",
      imei: "351982736452819",
      deviceModel: "Google Pixel 8 Pro 128GB Bay Blue",
      status: "In Transit", // In Transit, Received, Cancelled
      initiatedBy: "Darius Thorne",
      receivedBy: null,
      trackingNote: "Express Courier Van #04. ETA: Afternoon."
    },
    {
      id: "TRF-398",
      transferDate: "2026-08-15",
      fromBranchId: "BR-03",
      toBranchId: "BR-01",
      deviceId: "DEV-1002",
      imei: "354928172635489",
      deviceModel: "iPhone 14 Pro 128GB Deep Purple",
      status: "Received",
      initiatedBy: "Darius Thorne",
      receivedBy: "Marcus Vance",
      trackingNote: "Received in pristine condition with QA certificate."
    }
  ],

  // Activity Feed
  activityLogs: [
    {
      id: "ACT-01",
      timestamp: "10 mins ago",
      type: "sale",
      message: "Sarah Jenkins purchased Apple Watch Ultra 2 (IMEI: ...1726) at Uptown Mall",
      user: "Elena Rostova",
      badge: "Sale: $799"
    },
    {
      id: "ACT-02",
      timestamp: "45 mins ago",
      type: "repair",
      message: "Repair Ticket #REP-4011 diagnostic completed for Jessica Lee (iPhone 15 Pro)",
      user: "Alex Rivera",
      badge: "In Progress"
    },
    {
      id: "ACT-03",
      timestamp: "2 hours ago",
      type: "refurb",
      message: "Refurbishment started on DEV-1006 (iPhone 13 128GB) — Battery replacement",
      user: "Kevin S.",
      badge: "Refurb Workshop"
    },
    {
      id: "ACT-04",
      timestamp: "4 hours ago",
      type: "tradein",
      message: "Trade-In received from David Miller (Valuation: $260, Voucher issued)",
      user: "Darius Thorne",
      badge: "Trade-In Intake"
    },
    {
      id: "ACT-05",
      timestamp: "Yesterday",
      type: "transfer",
      message: "Stock Transfer #TRF-402 initiated for Pixel 8 Pro to Uptown Mall",
      user: "Darius Thorne",
      badge: "In Transit"
    }
  ]
};

// Export to window object for vanilla JS usage
window.INITIAL_DATA = INITIAL_DATA;
