"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/utils/terbilang.ts
  var UNITS = [
    "",
    "SATU",
    "DUA",
    "TIGA",
    "EMPAT",
    "LIMA",
    "ENAM",
    "TUJUH",
    "DELAPAN",
    "SEMBILAN",
    "SEPULUH",
    "SEBELAS"
  ];
  function convertNumberToWords(n) {
    const num = Math.floor(Math.abs(n));
    if (num === 0) return "";
    if (num < 12) return UNITS[num] ?? "";
    if (num < 20) return `${convertNumberToWords(num - 10)} BELAS`;
    if (num < 100) {
      const tens = Math.floor(num / 10);
      const remainder2 = num % 10;
      return `${UNITS[tens]} PULUH ${convertNumberToWords(remainder2)}`.trim();
    }
    if (num < 200) {
      return `SERATUS ${convertNumberToWords(num - 100)}`.trim();
    }
    if (num < 1e3) {
      const hundreds = Math.floor(num / 100);
      const remainder2 = num % 100;
      return `${UNITS[hundreds]} RATUS ${convertNumberToWords(remainder2)}`.trim();
    }
    if (num < 2e3) {
      return `SERIBU ${convertNumberToWords(num - 1e3)}`.trim();
    }
    if (num < 1e6) {
      const thousands = Math.floor(num / 1e3);
      const remainder2 = num % 1e3;
      return `${convertNumberToWords(thousands)} RIBU ${convertNumberToWords(remainder2)}`.trim();
    }
    if (num < 1e9) {
      const millions = Math.floor(num / 1e6);
      const remainder2 = num % 1e6;
      return `${convertNumberToWords(millions)} JUTA ${convertNumberToWords(remainder2)}`.trim();
    }
    if (num < 1e12) {
      const billions = Math.floor(num / 1e9);
      const remainder2 = num % 1e9;
      return `${convertNumberToWords(billions)} MILYAR ${convertNumberToWords(remainder2)}`.trim();
    }
    const trillions = Math.floor(num / 1e12);
    const remainder = num % 1e12;
    return `${convertNumberToWords(trillions)} TRILIUN ${convertNumberToWords(remainder)}`.trim();
  }
  function terbilang(amount) {
    if (amount === 0) return "NOL RUPIAH";
    const words = convertNumberToWords(amount).replace(/\s+/g, " ").trim();
    return `${words} RUPIAH`;
  }

  // src/views/app.ts
  var formatRupiah = (amount) => `Rp ${amount.toLocaleString("id-ID")}`;
  var PdamApp = class {
    constructor() {
      __publicField(this, "currentInquiry", null);
      __publicField(this, "allTransactions", []);
      __publicField(this, "formInquiry");
      __publicField(this, "productSelect");
      __publicField(this, "customerIdInput");
      __publicField(this, "btnSubmitInquiry");
      __publicField(this, "btnProceedPayment");
      __publicField(this, "btnCancelInquiry");
      __publicField(this, "emptyStateEl");
      __publicField(this, "loadingStateEl");
      __publicField(this, "resultCardEl");
      __publicField(this, "alertBanner");
      __publicField(this, "alertIcon");
      __publicField(this, "alertTitle");
      __publicField(this, "alertDesc");
      __publicField(this, "alertCloseBtn");
      __publicField(this, "alertTimeoutId", null);
      __publicField(this, "navInquiryBtn");
      __publicField(this, "navHistoryBtn");
      __publicField(this, "sectionPayment");
      __publicField(this, "sectionHistory");
      __publicField(this, "historyTbody");
      __publicField(this, "historyEmptyRow");
      __publicField(this, "historyCountBadge");
      __publicField(this, "historySearchInput");
      __publicField(this, "btnRefreshHistory");
      __publicField(this, "receiptModal");
      __publicField(this, "modalReceiptContent");
      __publicField(this, "btnCloseReceiptModal");
      __publicField(this, "btnPrintReceipt");
      __publicField(this, "btnDownloadReceipt");
    }
    init() {
      this.cacheDomElements();
      this.bindEvents();
      this.loadPresets();
      this.loadTransactionHistory();
    }
    cacheDomElements() {
      this.formInquiry = document.getElementById(
        "form-inquiry"
      );
      this.productSelect = document.getElementById(
        "product-select"
      );
      this.customerIdInput = document.getElementById(
        "customer-id-input"
      );
      this.btnSubmitInquiry = document.getElementById(
        "btn-submit-inquiry"
      );
      this.btnProceedPayment = document.getElementById(
        "btn-proceed-payment"
      );
      this.btnCancelInquiry = document.getElementById(
        "btn-cancel-inquiry"
      );
      this.emptyStateEl = document.getElementById(
        "inquiry-empty-state"
      );
      this.loadingStateEl = document.getElementById(
        "inquiry-loading-state"
      );
      this.resultCardEl = document.getElementById(
        "inquiry-result-card"
      );
      this.alertBanner = document.getElementById("alert-banner");
      this.alertIcon = document.getElementById("alert-icon");
      this.alertTitle = document.getElementById("alert-title");
      this.alertDesc = document.getElementById("alert-desc");
      this.alertCloseBtn = document.getElementById(
        "alert-close-btn"
      );
      this.navInquiryBtn = document.getElementById(
        "nav-inquiry-btn"
      );
      this.navHistoryBtn = document.getElementById(
        "nav-history-btn"
      );
      this.sectionPayment = document.getElementById(
        "section-payment"
      );
      this.sectionHistory = document.getElementById(
        "section-history"
      );
      this.historyTbody = document.getElementById("history-tbody");
      this.historyEmptyRow = document.getElementById(
        "history-empty-row"
      );
      this.historyCountBadge = document.getElementById(
        "history-count-badge"
      );
      this.historySearchInput = document.getElementById(
        "history-search-input"
      );
      this.btnRefreshHistory = document.getElementById(
        "btn-refresh-history"
      );
      this.receiptModal = document.getElementById("receipt-modal");
      this.modalReceiptContent = document.getElementById(
        "modal-receipt-content"
      );
      this.btnCloseReceiptModal = document.getElementById(
        "btn-close-receipt-modal"
      );
      this.btnPrintReceipt = document.getElementById(
        "btn-print-receipt"
      );
      this.btnDownloadReceipt = document.getElementById(
        "btn-download-receipt"
      );
    }
    bindEvents() {
      this.navInquiryBtn.addEventListener(
        "click",
        () => this.switchTab("inquiry")
      );
      this.navHistoryBtn.addEventListener("click", () => {
        this.switchTab("history");
        this.loadTransactionHistory();
      });
      this.formInquiry.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleInquirySubmit();
      });
      this.btnCancelInquiry.addEventListener(
        "click",
        () => this.resetInquiryView()
      );
      this.btnProceedPayment.addEventListener(
        "click",
        () => this.handlePaymentSubmit()
      );
      this.historySearchInput.addEventListener("input", () => {
        this.filterTransactions(this.historySearchInput.value);
      });
      this.btnRefreshHistory.addEventListener(
        "click",
        () => this.loadTransactionHistory()
      );
      this.alertCloseBtn.addEventListener("click", () => this.hideAlert());
      this.btnCloseReceiptModal.addEventListener(
        "click",
        () => this.closeReceiptModal()
      );
      this.receiptModal.addEventListener("click", (e) => {
        if (e.target === this.receiptModal) this.closeReceiptModal();
      });
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !this.receiptModal.classList.contains("hidden")) {
          this.closeReceiptModal();
        }
      });
      this.btnPrintReceipt.addEventListener("click", () => window.print());
    }
    async loadPresets() {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.rc !== "00" || !json.data) return;
        this.productSelect.innerHTML = "";
        const presetWrap = document.getElementById("preset-buttons");
        const sidebarWrap = document.getElementById("sidebar-products");
        if (presetWrap) presetWrap.innerHTML = "";
        if (sidebarWrap) sidebarWrap.innerHTML = "";
        for (const p of json.data) {
          const opt = document.createElement("option");
          opt.value = p.code;
          opt.textContent = `${p.name} (${p.code})`;
          this.productSelect.appendChild(opt);
          if (sidebarWrap) {
            const row = document.createElement("button");
            row.type = "button";
            row.className = "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-black/[0.04] transition-colors text-left";
            row.innerHTML = `
            <span class="w-7 h-7 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center text-[10px] font-bold shrink-0">${p.code.slice(0, 2)}</span>
            <span class="min-w-0">
              <span class="block text-[12px] font-semibold text-ink-900 truncate">${p.name}</span>
              <span class="block text-[10px] font-mono text-ink-800/45">${p.defaultIdpel}</span>
            </span>`;
            row.addEventListener("click", () => {
              this.switchTab("inquiry");
              this.productSelect.value = p.code;
              this.customerIdInput.value = p.defaultIdpel;
              this.customerIdInput.focus();
            });
            sidebarWrap.appendChild(row);
          }
          if (presetWrap) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "px-3 py-1.5 rounded-lg text-[12px] font-medium bg-mist-50 text-ink-900 border border-black/[0.07] hover:border-black/[0.16] transition-all";
            btn.textContent = `${p.code} \xB7 ${p.defaultIdpel}`;
            btn.addEventListener("click", () => {
              this.productSelect.value = p.code;
              this.customerIdInput.value = p.defaultIdpel;
              this.customerIdInput.focus();
            });
            presetWrap.appendChild(btn);
          }
        }
      } catch {
      }
    }
    switchTab(tab) {
      const isInquiry = tab === "inquiry";
      this.sectionPayment.classList.toggle("hidden", !isInquiry);
      this.sectionHistory.classList.toggle("hidden", isInquiry);
      const activeCls = "nav-item w-full flex items-center gap-2.5 px-3 h-10 rounded-xl text-[13px] font-semibold transition-all bg-ink-950 text-white";
      const inactiveCls = "nav-item w-full flex items-center gap-2.5 px-3 h-10 rounded-xl text-[13px] font-semibold transition-all text-ink-800/60 hover:text-ink-900 hover:bg-black/[0.04]";
      this.navInquiryBtn.className = isInquiry ? activeCls : inactiveCls;
      this.navHistoryBtn.className = isInquiry ? inactiveCls : activeCls;
      const title = document.getElementById("page-title");
      const subtitle = document.getElementById("page-subtitle");
      if (title)
        title.textContent = isInquiry ? "Bayar Tagihan" : "Riwayat Transaksi";
      if (subtitle)
        subtitle.textContent = isInquiry ? "Inquiry & pembayaran tagihan PDAM" : "Monitor seluruh transaksi tersimpan";
    }
    showAlert(type, title, message) {
      if (this.alertTimeoutId) {
        clearTimeout(this.alertTimeoutId);
        this.alertTimeoutId = null;
      }
      this.alertBanner.classList.remove(
        "hidden",
        "bg-emerald-50",
        "border-emerald-200",
        "text-emerald-950",
        "bg-red-50",
        "border-red-200",
        "text-red-950",
        "bg-sky-50",
        "border-sky-200",
        "text-sky-950",
        "bg-emerald-50/95",
        "border-emerald-200/80",
        "text-emerald-900",
        "bg-red-50/95",
        "border-red-200/80",
        "text-red-900",
        "bg-accent-50/95",
        "border-accent-100",
        "text-ink-900"
      );
      const config = {
        success: {
          cls: ["bg-emerald-50", "border-emerald-200", "text-emerald-950"],
          icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#10b981"/><path d="M6 10.2l2.6 2.6L14 7.4" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        },
        error: {
          cls: ["bg-red-50", "border-red-200", "text-red-950"],
          icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#ef4444"/><path d="M7 7l6 6M13 7l-6 6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>'
        },
        info: {
          cls: ["bg-sky-50", "border-sky-200", "text-sky-950"],
          icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#0284c7"/><path d="M10 9v5M10 6.2v.2" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>'
        }
      }[type];
      this.alertBanner.classList.add(...config.cls);
      this.alertIcon.innerHTML = config.icon;
      this.alertTitle.textContent = title;
      this.alertDesc.textContent = message;
      this.alertTimeoutId = window.setTimeout(() => {
        this.hideAlert();
      }, 4500);
    }
    hideAlert() {
      if (this.alertTimeoutId) {
        clearTimeout(this.alertTimeoutId);
        this.alertTimeoutId = null;
      }
      this.alertBanner.classList.add("hidden");
    }
    setInquiryLoading(isLoading) {
      if (isLoading) {
        this.emptyStateEl.classList.add("hidden");
        this.loadingStateEl.classList.remove("hidden");
        this.resultCardEl.classList.add("hidden");
      } else {
        this.loadingStateEl.classList.add("hidden");
        if (!this.currentInquiry) {
          this.emptyStateEl.classList.remove("hidden");
        }
      }
      this.btnSubmitInquiry.disabled = isLoading;
      this.btnSubmitInquiry.innerHTML = isLoading ? '<svg class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-opacity="0.25" stroke-width="2"/><path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Memeriksa\u2026</span>' : "<span>Cek Tagihan</span>";
    }
    async handleInquirySubmit() {
      this.hideAlert();
      const productCode = this.productSelect.value;
      const customerId = this.customerIdInput.value.trim();
      if (!customerId) {
        this.showAlert(
          "error",
          "Validasi Gagal",
          "Nomor ID Pelanggan wajib diisi."
        );
        return;
      }
      this.setInquiryLoading(true);
      try {
        const res = await fetch("/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productCode, customerId })
        });
        const json = await res.json();
        if (json.rc !== "00" || !json.data) {
          throw new Error(json.ket || "Gagal melakukan inquiry tagihan.");
        }
        this.currentInquiry = json.data;
        this.displayInquiryResult(this.currentInquiry);
        this.showAlert(
          "success",
          "Inquiry Berhasil",
          `Data tagihan untuk ${this.currentInquiry.nama} ditemukan.`
        );
      } catch (err) {
        this.resetInquiryView();
        this.showAlert(
          "error",
          "Inquiry Gagal",
          err.message || "Terjadi kesalahan jaringan."
        );
      } finally {
        this.setInquiryLoading(false);
      }
    }
    displayInquiryResult(data) {
      this.emptyStateEl.classList.add("hidden");
      this.loadingStateEl.classList.add("hidden");
      this.resultCardEl.classList.remove("hidden");
      document.getElementById("res-pdam-badge").textContent = this.productSelect.options[this.productSelect.selectedIndex]?.textContent || data.idpel;
      document.getElementById("res-customer-id").textContent = data.idpel;
      document.getElementById("res-customer-name").textContent = data.nama || "-";
      document.getElementById("res-customer-address").textContent = data.alamat || "-";
      document.getElementById("res-bill-count").textContent = `${data.jumlah_bulan} Bulan Tagihan`;
      const bills = data.data_bill ? Array.isArray(data.data_bill) ? data.data_bill : Object.values(data.data_bill) : [];
      const hasNonair = bills.some((b) => b.nonair > 0);
      const hasMeter = bills.some((b) => b.meter_akhir > 0 || b.meter_awal > 0);
      const toggleDisplay = (id, show, style = "") => {
        const el = document.getElementById(id);
        if (el) el.style.display = show ? style : "none";
      };
      toggleDisplay("th-meter", hasMeter);
      toggleDisplay("th-misc", hasNonair);
      toggleDisplay("row-misc-total", hasNonair, "flex");
      const tbody = document.getElementById("res-bills-tbody");
      tbody.innerHTML = "";
      bills.forEach((bill) => {
        const tr = document.createElement("tr");
        const meter = bill.meter_akhir - bill.meter_awal;
        const monthIdx = parseInt(bill.bulan, 10) - 1;
        const MONTHS = [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MEI",
          "JUN",
          "JUL",
          "AGS",
          "SEP",
          "OKT",
          "NOV",
          "DES"
        ];
        const label = `${MONTHS[monthIdx] || bill.bulan} ${bill.tahun}`;
        tr.innerHTML = `
        <td class="py-2.5 pr-4 font-semibold text-ink-900">${label}</td>
        ${hasMeter ? `<td class="py-2.5 pr-4 text-ink-800/60 tabular-nums">${meter > 0 ? meter + " m\xB3" : "-"}</td>` : ""}
        <td class="py-2.5 px-4 text-right tabular-nums text-ink-900">${formatRupiah(bill.air)}</td>
        <td class="py-2.5 px-4 text-right tabular-nums ${bill.denda > 0 ? "text-red-600 font-medium" : "text-ink-800/35"}">${formatRupiah(bill.denda)}</td>
        ${hasNonair ? `<td class="py-2.5 pl-4 text-right tabular-nums text-ink-800/70">${formatRupiah(bill.nonair)}</td>` : ""}
      `;
        tbody.appendChild(tr);
      });
      document.getElementById("res-nominal").textContent = formatRupiah(
        data.nominal
      );
      document.getElementById("res-penalty-total").textContent = formatRupiah(
        bills.reduce((a, b) => a + b.denda, 0)
      );
      document.getElementById("res-misc-total").textContent = formatRupiah(
        bills.reduce((a, b) => a + b.nonair, 0)
      );
      document.getElementById("res-admin-fee").textContent = formatRupiah(
        data.admin
      );
      document.getElementById("res-total-amount").textContent = formatRupiah(
        data.total_bayar
      );
      document.getElementById("res-terbilang").textContent = `"${terbilang(data.total_bayar)}"`;
      this.resultCardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    resetInquiryView() {
      this.currentInquiry = null;
      this.resultCardEl.classList.add("hidden");
      this.loadingStateEl.classList.add("hidden");
      this.emptyStateEl.classList.remove("hidden");
    }
    async handlePaymentSubmit() {
      if (!this.currentInquiry) {
        this.showAlert(
          "error",
          "Error",
          "Silakan lakukan inquiry terlebih dahulu."
        );
        return;
      }
      const inq = this.currentInquiry;
      this.btnProceedPayment.disabled = true;
      this.btnProceedPayment.innerHTML = '<svg class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-opacity="0.25" stroke-width="2"/><path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Memproses\u2026</span>';
      try {
        const res = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productCode: this.productSelect.value,
            customerId: inq.idpel,
            ref1: inq.ref1,
            ref2: inq.ref2,
            nominal: inq.nominal.toString()
          })
        });
        const json = await res.json();
        if (json.rc !== "00" || !json.data) {
          throw new Error(json.ket || "Pembayaran gagal diproses.");
        }
        this.showAlert("success", "Pembayaran Berhasil!", json.ket);
        this.openReceiptModal(json.data.receiptText, json.data.transaction.id);
        this.resetInquiryView();
        this.loadTransactionHistory();
      } catch (err) {
        this.showAlert(
          "error",
          "Pembayaran Gagal",
          err.message || "Terjadi kesalahan sistem saat pembayaran."
        );
      } finally {
        this.btnProceedPayment.disabled = false;
        this.btnProceedPayment.innerHTML = "<span>Bayar Sekarang</span>";
      }
    }
    openReceiptModal(receiptText, transactionId) {
      this.modalReceiptContent.textContent = receiptText;
      if (transactionId) {
        this.btnDownloadReceipt.href = `/api/transactions/${transactionId}/receipt`;
        this.btnDownloadReceipt.setAttribute(
          "download",
          `struk_${transactionId}.txt`
        );
      } else {
        const blob = new Blob([receiptText], {
          type: "text/plain;charset=utf-8"
        });
        this.btnDownloadReceipt.href = URL.createObjectURL(blob);
        this.btnDownloadReceipt.setAttribute("download", "struk_pembayaran.txt");
      }
      this.receiptModal.classList.remove("hidden");
    }
    closeReceiptModal() {
      if (this.btnDownloadReceipt.href.startsWith("blob:")) {
        URL.revokeObjectURL(this.btnDownloadReceipt.href);
      }
      this.receiptModal.classList.add("hidden");
    }
    async loadTransactionHistory() {
      try {
        const res = await fetch("/api/transactions?limit=100");
        const json = await res.json();
        if (json.rc !== "00" || !json.data)
          throw new Error(json.ket || "Gagal mengambil riwayat transaksi.");
        this.allTransactions = json.data;
        this.renderTransactionTable(this.allTransactions);
      } catch (err) {
        console.error("Failed to load transaction history:", err);
      }
    }
    filterTransactions(keyword) {
      const q = keyword.trim().toLowerCase();
      if (!q) {
        this.renderTransactionTable(this.allTransactions);
        return;
      }
      const filtered = this.allTransactions.filter(
        (tx) => tx.customerId.toLowerCase().includes(q) || tx.customerName.toLowerCase().includes(q) || tx.noResi.toLowerCase().includes(q) || tx.pdamName.toLowerCase().includes(q)
      );
      this.renderTransactionTable(filtered);
    }
    renderTransactionTable(records) {
      this.historyCountBadge.textContent = records.length.toString();
      this.historyTbody.innerHTML = "";
      const statTotal = document.getElementById("stat-total-count");
      const statSuccess = document.getElementById("stat-success-count");
      const statValue = document.getElementById("stat-total-value");
      if (statTotal) statTotal.textContent = records.length.toString();
      if (statSuccess)
        statSuccess.textContent = records.filter((t) => t.status === "00").length.toString();
      if (statValue) {
        const sum = records.filter((t) => t.status === "00").reduce((acc, t) => acc + t.totalAmount, 0);
        statValue.textContent = formatRupiah(sum);
      }
      if (records.length === 0) {
        this.historyEmptyRow.classList.remove("hidden");
        return;
      }
      this.historyEmptyRow.classList.add("hidden");
      records.forEach((tx) => {
        const tr = document.createElement("tr");
        const isSuccess = tx.status === "00";
        const statusBadge = isSuccess ? '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">SUKSES</span>' : `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${tx.status === "33" ? "bg-amber-50 text-amber-700 border-amber-200/60" : "bg-red-50 text-red-700 border-red-200/60"}">${tx.statusDescription || "GAGAL"}</span>`;
        tr.innerHTML = `
        <td class="py-3 px-5 whitespace-nowrap text-ink-800/55 tabular-nums">${tx.createdAt}</td>
        <td class="py-3 px-4 font-mono text-[12px] font-medium text-ink-900">${tx.noResi || tx.ref2}</td>
        <td class="py-3 px-4 font-medium text-ink-900">${tx.pdamName}</td>
        <td class="py-3 px-4 font-mono text-[12px] text-ink-800/65">${tx.customerId}</td>
        <td class="py-3 px-4 text-ink-800/80">${tx.customerName || "-"}</td>
        <td class="py-3 px-4 text-right font-semibold tabular-nums">${formatRupiah(tx.totalAmount)}</td>
        <td class="py-3 px-4 text-center">${statusBadge}</td>
        <td class="py-3 px-5 text-right">
          <div class="flex items-center justify-end gap-2">
            <button type="button" data-tx-id="${tx.id}" class="btn-view-receipt h-7 px-3 rounded-full border border-black/[0.1] hover:bg-mist-50 text-ink-900 font-semibold text-xs transition-colors">
              Struk
            </button>
            <a href="/api/transactions/${tx.id}/receipt" download="struk_${tx.id}.txt" class="w-7 h-7 rounded-full border border-black/[0.1] hover:bg-mist-50 text-ink-800/60 flex items-center justify-center transition-colors" title="Download TXT">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1v8m0 0L3.5 5.5M7 9l3.5-3.5M1.5 12.5h11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </td>
      `;
        tr.querySelector(".btn-view-receipt")?.addEventListener(
          "click",
          async () => {
            try {
              const res = await fetch(`/api/transactions/${tx.id}`);
              const json = await res.json();
              if (json.rc === "00" && json.data?.receiptText) {
                this.openReceiptModal(json.data.receiptText, tx.id);
              }
            } catch (e) {
              console.error(e);
            }
          }
        );
        this.historyTbody.appendChild(tr);
      });
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    new PdamApp().init();
  });
})();
