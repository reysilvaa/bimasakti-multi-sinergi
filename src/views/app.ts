/**
 * Frontend Application Logic for PDAM Payment Gateway.
 * Bundled via esbuild for browser execution.
 */
import type { InquiryData, TransactionRecord, SpecBill } from "../models/transaction.js";
import { terbilang } from "../utils/terbilang.js";

/** Formats integer as dotted Rupiah string (spec struk format: 40.500). */
const formatRupiah = (amount: number): string => `Rp ${amount.toLocaleString("id-ID")}`;

type Product = { code: string; name: string; defaultIdpel: string };
type Envelope<T> = { rc: string; ket: string; data?: T };

class PdamApp {
  private currentInquiry: InquiryData | null = null;
  private allTransactions: TransactionRecord[] = [];

  // DOM Elements
  private formInquiry!: HTMLFormElement;
  private productSelect!: HTMLSelectElement;
  private customerIdInput!: HTMLInputElement;
  private btnSubmitInquiry!: HTMLButtonElement;
  private btnProceedPayment!: HTMLButtonElement;
  private btnCancelInquiry!: HTMLButtonElement;

  private emptyStateEl!: HTMLElement;
  private loadingStateEl!: HTMLElement;
  private resultCardEl!: HTMLElement;

  private alertBanner!: HTMLElement;
  private alertIcon!: HTMLElement;
  private alertTitle!: HTMLElement;
  private alertDesc!: HTMLElement;
  private alertCloseBtn!: HTMLButtonElement;

  private navInquiryBtn!: HTMLButtonElement;
  private navHistoryBtn!: HTMLButtonElement;
  private sectionPayment!: HTMLElement;
  private sectionHistory!: HTMLElement;

  private historyTbody!: HTMLElement;
  private historyEmptyRow!: HTMLElement;
  private historyCountBadge!: HTMLElement;
  private historySearchInput!: HTMLInputElement;
  private btnRefreshHistory!: HTMLButtonElement;

  private receiptModal!: HTMLElement;
  private modalReceiptContent!: HTMLElement;
  private btnCloseReceiptModal!: HTMLButtonElement;
  private btnPrintReceipt!: HTMLButtonElement;
  private btnDownloadReceipt!: HTMLAnchorElement;

  public init(): void {
    this.cacheDomElements();
    this.bindEvents();
    this.loadPresets();
    this.loadTransactionHistory();
  }

  private cacheDomElements(): void {
    this.formInquiry = document.getElementById('form-inquiry') as HTMLFormElement;
    this.productSelect = document.getElementById('product-select') as HTMLSelectElement;
    this.customerIdInput = document.getElementById('customer-id-input') as HTMLInputElement;
    this.btnSubmitInquiry = document.getElementById('btn-submit-inquiry') as HTMLButtonElement;
    this.btnProceedPayment = document.getElementById('btn-proceed-payment') as HTMLButtonElement;
    this.btnCancelInquiry = document.getElementById('btn-cancel-inquiry') as HTMLButtonElement;

    this.emptyStateEl = document.getElementById('inquiry-empty-state') as HTMLElement;
    this.loadingStateEl = document.getElementById('inquiry-loading-state') as HTMLElement;
    this.resultCardEl = document.getElementById('inquiry-result-card') as HTMLElement;

    this.alertBanner = document.getElementById('alert-banner') as HTMLElement;
    this.alertIcon = document.getElementById('alert-icon') as HTMLElement;
    this.alertTitle = document.getElementById('alert-title') as HTMLElement;
    this.alertDesc = document.getElementById('alert-desc') as HTMLElement;
    this.alertCloseBtn = document.getElementById('alert-close-btn') as HTMLButtonElement;

    this.navInquiryBtn = document.getElementById('nav-inquiry-btn') as HTMLButtonElement;
    this.navHistoryBtn = document.getElementById('nav-history-btn') as HTMLButtonElement;
    this.sectionPayment = document.getElementById('section-payment') as HTMLElement;
    this.sectionHistory = document.getElementById('section-history') as HTMLElement;

    this.historyTbody = document.getElementById('history-tbody') as HTMLElement;
    this.historyEmptyRow = document.getElementById('history-empty-row') as HTMLElement;
    this.historyCountBadge = document.getElementById('history-count-badge') as HTMLElement;
    this.historySearchInput = document.getElementById('history-search-input') as HTMLInputElement;
    this.btnRefreshHistory = document.getElementById('btn-refresh-history') as HTMLButtonElement;

    this.receiptModal = document.getElementById('receipt-modal') as HTMLElement;
    this.modalReceiptContent = document.getElementById('modal-receipt-content') as HTMLElement;
    this.btnCloseReceiptModal = document.getElementById('btn-close-receipt-modal') as HTMLButtonElement;
    this.btnPrintReceipt = document.getElementById('btn-print-receipt') as HTMLButtonElement;
    this.btnDownloadReceipt = document.getElementById('btn-download-receipt') as HTMLAnchorElement;
  }

  private bindEvents(): void {
    this.navInquiryBtn.addEventListener('click', () => this.switchTab('inquiry'));
    this.navHistoryBtn.addEventListener('click', () => {
      this.switchTab('history');
      this.loadTransactionHistory();
    });

    this.formInquiry.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleInquirySubmit();
    });

    this.btnCancelInquiry.addEventListener('click', () => this.resetInquiryView());
    this.btnProceedPayment.addEventListener('click', () => this.handlePaymentSubmit());

    this.historySearchInput.addEventListener('input', () => {
      this.filterTransactions(this.historySearchInput.value);
    });

    this.btnRefreshHistory.addEventListener('click', () => this.loadTransactionHistory());
    this.alertCloseBtn.addEventListener('click', () => this.hideAlert());

    this.btnCloseReceiptModal.addEventListener('click', () => this.closeReceiptModal());
    this.receiptModal.addEventListener('click', (e) => {
      if (e.target === this.receiptModal) this.closeReceiptModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.receiptModal.classList.contains('hidden')) {
        this.closeReceiptModal();
      }
    });

    this.btnPrintReceipt.addEventListener('click', () => window.print());
  }

  /** Fill product select + preset buttons from /api/products (single source of truth). */
  private async loadPresets(): Promise<void> {
    try {
      const res = await fetch('/api/products');
      const json: Envelope<Product[]> = await res.json();
      if (json.rc !== '00' || !json.data) return;

      this.productSelect.innerHTML = '';
      const presetWrap = document.getElementById('preset-buttons');
      if (presetWrap) presetWrap.innerHTML = '';

      for (const p of json.data) {
        const opt = document.createElement('option');
        opt.value = p.code;
        opt.textContent = `${p.name} (${p.code})`;
        this.productSelect.appendChild(opt);

        if (presetWrap) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1.5';
          btn.textContent = `${p.name} (${p.code}: ${p.defaultIdpel})`;
          btn.addEventListener('click', () => {
            this.productSelect.value = p.code;
            this.customerIdInput.value = p.defaultIdpel;
            this.customerIdInput.focus();
          });
          presetWrap.appendChild(btn);
        }
      }
    } catch {
      // Select already has static options in index.html; presets are a convenience.
    }
  }

  private switchTab(tab: 'inquiry' | 'history'): void {
    const isInquiry = tab === 'inquiry';
    this.sectionPayment.classList.toggle('hidden', !isInquiry);
    this.sectionHistory.classList.toggle('hidden', isInquiry);

    const activeClass = 'px-4 py-2 rounded-md text-sm font-medium transition-all bg-blue-600 text-white shadow-sm flex items-center gap-2';
    const inactiveClass = 'px-4 py-2 rounded-md text-sm font-medium transition-all text-blue-200 hover:text-white hover:bg-blue-800/50 flex items-center gap-2';

    this.navInquiryBtn.className = isInquiry ? activeClass : inactiveClass;
    this.navHistoryBtn.className = isInquiry ? inactiveClass : activeClass;
  }

  private showAlert(type: 'success' | 'error' | 'info', title: string, message: string): void {
    this.alertBanner.classList.remove('hidden', 'bg-emerald-50', 'border-emerald-200', 'text-emerald-900', 'bg-red-50', 'border-red-200', 'text-red-900', 'bg-blue-50', 'border-blue-200', 'text-blue-900');

    const config = {
      success: { cls: ['bg-emerald-50', 'border-emerald-200', 'text-emerald-900'], icon: 'fa-circle-check text-emerald-600' },
      error: { cls: ['bg-red-50', 'border-red-200', 'text-red-900'], icon: 'fa-circle-exclamation text-red-600' },
      info: { cls: ['bg-blue-50', 'border-blue-200', 'text-blue-900'], icon: 'fa-circle-info text-blue-600' },
    }[type];

    this.alertBanner.classList.add(...config.cls);
    this.alertIcon.innerHTML = `<i class="fa-solid ${config.icon}"></i>`;
    this.alertTitle.textContent = title;
    this.alertDesc.textContent = message;
    this.alertBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  private hideAlert(): void {
    this.alertBanner.classList.add('hidden');
  }

  private setInquiryLoading(isLoading: boolean): void {
    if (isLoading) {
      this.emptyStateEl.classList.add('hidden');
      this.loadingStateEl.classList.remove('hidden');
      this.resultCardEl.classList.add('hidden');
    } else {
      this.loadingStateEl.classList.add('hidden');
      if (!this.currentInquiry) {
        this.emptyStateEl.classList.remove('hidden');
      }
    }
    this.btnSubmitInquiry.disabled = isLoading;
    this.btnSubmitInquiry.innerHTML = isLoading
      ? '<i class="fa-solid fa-spinner animate-spin"></i><span>Memeriksa...</span>'
      : '<i class="fa-solid fa-magnifying-glass"></i><span>Cek Tagihan (Inquiry)</span>';
  }

  private async handleInquirySubmit(): Promise<void> {
    this.hideAlert();
    const productCode = this.productSelect.value;
    const customerId = this.customerIdInput.value.trim();

    if (!customerId) {
      this.showAlert('error', 'Validasi Gagal', 'Nomor ID Pelanggan wajib diisi.');
      return;
    }

    this.setInquiryLoading(true);

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productCode, customerId }),
      });
      const json: Envelope<InquiryData> = await res.json();

      if (json.rc !== '00' || !json.data) {
        throw new Error(json.ket || 'Gagal melakukan inquiry tagihan.');
      }

      this.currentInquiry = json.data;
      this.displayInquiryResult(this.currentInquiry);
      this.showAlert('success', 'Inquiry Berhasil', `Data tagihan untuk ${this.currentInquiry.nama} ditemukan.`);
    } catch (err: any) {
      this.resetInquiryView();
      this.showAlert('error', 'Inquiry Gagal', err.message || 'Terjadi kesalahan jaringan.');
    } finally {
      this.setInquiryLoading(false);
    }
  }

  private displayInquiryResult(data: InquiryData): void {
    this.emptyStateEl.classList.add('hidden');
    this.loadingStateEl.classList.add('hidden');
    this.resultCardEl.classList.remove('hidden');

    document.getElementById('res-pdam-badge')!.textContent =
      this.productSelect.options[this.productSelect.selectedIndex]?.textContent || data.idpel;
    document.getElementById('res-customer-id')!.textContent = data.idpel;
    document.getElementById('res-customer-name')!.textContent = data.nama || '-';
    document.getElementById('res-customer-address')!.textContent = data.alamat || '-';
    document.getElementById('res-bill-count')!.textContent = `${data.jumlah_bulan} Bulan Tagihan`;

    const bills: SpecBill[] = data.data_bill || [];
    const hasNonair = bills.some((b) => b.nonair > 0);
    const hasMeter = bills.some((b) => b.meterAkhir > 0 || b.meterAwal > 0);

    const toggleDisplay = (id: string, show: boolean, style: string = '') => {
      const el = document.getElementById(id);
      if (el) el.style.display = show ? style : 'none';
    };
    toggleDisplay('th-meter', hasMeter);
    toggleDisplay('th-misc', hasNonair);
    toggleDisplay('row-misc-total', hasNonair, 'flex');

    const tbody = document.getElementById('res-bills-tbody')!;
    tbody.innerHTML = '';

    bills.forEach((bill) => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50/80 transition-colors';
      const meter = bill.meterAkhir - bill.meterAwal;
      const monthIdx = parseInt(bill.bulan, 10) - 1;
      const MONTHS = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGS", "SEP", "OKT", "NOV", "DES"];
      const label = `${MONTHS[monthIdx] || bill.bulan} ${bill.tahun}`;
      tr.innerHTML = `
        <td class="py-3 px-4 font-semibold text-slate-800 flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span>${label}</span>
        </td>
        ${hasMeter ? `<td class="py-3 px-4 font-mono text-slate-600">${meter > 0 ? meter + ' m³' : '-'}</td>` : ''}
        <td class="py-3 px-4 text-right font-mono tabular-nums text-slate-800 font-medium">${formatRupiah(bill.air)}</td>
        <td class="py-3 px-4 text-right font-mono tabular-nums ${bill.denda > 0 ? 'text-rose-600 font-semibold' : 'text-slate-400'}">${formatRupiah(bill.denda)}</td>
        ${hasNonair ? `<td class="py-3 px-4 text-right font-mono tabular-nums text-slate-700">${formatRupiah(bill.nonair)}</td>` : ''}
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('res-nominal')!.textContent = formatRupiah(data.nominal);
    document.getElementById('res-penalty-total')!.textContent =
      formatRupiah(bills.reduce((a, b) => a + b.denda, 0));
    document.getElementById('res-misc-total')!.textContent =
      formatRupiah(bills.reduce((a, b) => a + b.nonair, 0));
    document.getElementById('res-admin-fee')!.textContent = formatRupiah(data.admin);
    document.getElementById('res-total-amount')!.textContent = formatRupiah(data.total_bayar);
    document.getElementById('res-terbilang')!.textContent =
      `"${terbilang(data.total_bayar)}"`;

    this.resultCardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  private resetInquiryView(): void {
    this.currentInquiry = null;
    this.resultCardEl.classList.add('hidden');
    this.loadingStateEl.classList.add('hidden');
    this.emptyStateEl.classList.remove('hidden');
  }

  private async handlePaymentSubmit(): Promise<void> {
    if (!this.currentInquiry) {
      this.showAlert('error', 'Error', 'Silakan lakukan inquiry terlebih dahulu.');
      return;
    }

    const inq = this.currentInquiry;
    this.btnProceedPayment.disabled = true;
    this.btnProceedPayment.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i><span>Memproses Pembayaran...</span>';

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCode: this.productSelect.value,
          customerId: inq.idpel,
          ref1: inq.ref1,
          ref2: inq.ref2,
          nominal: inq.nominal.toString(),
        }),
      });
      const json: Envelope<{ transaction: TransactionRecord; receiptText: string }> = await res.json();

      if (json.rc !== '00' || !json.data) {
        throw new Error(json.ket || 'Pembayaran gagal diproses.');
      }

      this.showAlert('success', 'Pembayaran Berhasil!', json.ket);

      this.openReceiptModal(json.data.receiptText, json.data.transaction.id);
      this.resetInquiryView();
      this.loadTransactionHistory();
    } catch (err: any) {
      this.showAlert('error', 'Pembayaran Gagal', err.message || 'Terjadi kesalahan sistem saat pembayaran.');
    } finally {
      this.btnProceedPayment.disabled = false;
      this.btnProceedPayment.innerHTML = '<i class="fa-solid fa-credit-card"></i><span>Konfirmasi & Bayar Sekarang</span>';
    }
  }

  public openReceiptModal(receiptText: string, transactionId?: number): void {
    this.modalReceiptContent.textContent = receiptText;

    if (transactionId) {
      this.btnDownloadReceipt.href = `/api/transactions/${transactionId}/receipt`;
      this.btnDownloadReceipt.setAttribute('download', `struk_${transactionId}.txt`);
    } else {
      const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
      this.btnDownloadReceipt.href = URL.createObjectURL(blob);
      this.btnDownloadReceipt.setAttribute('download', 'struk_pembayaran.txt');
    }

    this.receiptModal.classList.remove('hidden');
  }

  private closeReceiptModal(): void {
    if (this.btnDownloadReceipt.href.startsWith('blob:')) {
      URL.revokeObjectURL(this.btnDownloadReceipt.href);
    }
    this.receiptModal.classList.add('hidden');
  }

  private async loadTransactionHistory(): Promise<void> {
    try {
      const res = await fetch('/api/transactions?limit=100');
      const json: Envelope<TransactionRecord[]> = await res.json();

      if (json.rc !== '00' || !json.data) throw new Error(json.ket || 'Gagal mengambil riwayat transaksi.');

      this.allTransactions = json.data;
      this.renderTransactionTable(this.allTransactions);
    } catch (err: any) {
      console.error('Failed to load transaction history:', err);
    }
  }

  private filterTransactions(keyword: string): void {
    const q = keyword.trim().toLowerCase();
    if (!q) {
      this.renderTransactionTable(this.allTransactions);
      return;
    }

    const filtered = this.allTransactions.filter((tx) =>
      tx.customerId.toLowerCase().includes(q) ||
      tx.customerName.toLowerCase().includes(q) ||
      tx.noResi.toLowerCase().includes(q) ||
      tx.pdamName.toLowerCase().includes(q)
    );

    this.renderTransactionTable(filtered);
  }

  private renderTransactionTable(records: TransactionRecord[]): void {
    this.historyCountBadge.textContent = records.length.toString();
    this.historyTbody.innerHTML = '';

    if (records.length === 0) {
      this.historyEmptyRow.classList.remove('hidden');
      return;
    }

    this.historyEmptyRow.classList.add('hidden');

    records.forEach((tx) => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50 transition-colors border-b border-slate-100';

      const isSuccess = tx.status === '00';
      const statusBadge = isSuccess
        ? '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">SUKSES</span>'
        : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${tx.status === '33' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}">${tx.statusDescription || 'GAGAL'}</span>`;

      tr.innerHTML = `
        <td class="py-3 px-4 whitespace-nowrap text-slate-500">${tx.createdAt}</td>
        <td class="py-3 px-4 font-mono font-medium text-slate-800">${tx.noResi || tx.ref2}</td>
        <td class="py-3 px-4 font-semibold text-slate-800">${tx.pdamName}</td>
        <td class="py-3 px-4 font-mono text-slate-600">${tx.customerId}</td>
        <td class="py-3 px-4 font-medium text-slate-800">${tx.customerName || '-'}</td>
        <td class="py-3 px-4 text-right font-bold text-slate-900">${formatRupiah(tx.totalAmount)}</td>
        <td class="py-3 px-4 text-center">${statusBadge}</td>
        <td class="py-3 px-4 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button type="button" data-tx-id="${tx.id}" class="btn-view-receipt px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors flex items-center gap-1">
              <i class="fa-solid fa-eye text-xs"></i>
              <span>Struk</span>
            </button>
            <a href="/api/transactions/${tx.id}/receipt" download="struk_${tx.id}.txt" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors" title="Download TXT">
              <i class="fa-solid fa-download"></i>
            </a>
          </div>
        </td>
      `;

      tr.querySelector('.btn-view-receipt')?.addEventListener('click', async () => {
        try {
          const res = await fetch(`/api/transactions/${tx.id}`);
          const json: Envelope<{ transaction: TransactionRecord; receiptText: string }> = await res.json();
          if (json.rc === '00' && json.data?.receiptText) {
            this.openReceiptModal(json.data.receiptText, tx.id);
          }
        } catch (e) {
          console.error(e);
        }
      });

      this.historyTbody.appendChild(tr);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PdamApp().init();
});
