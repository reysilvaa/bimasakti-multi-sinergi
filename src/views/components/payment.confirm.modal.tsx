import type { InquiryData } from "@/domain/inquiry.js";
import { terbilang } from "@/utils/terbilang.js";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/views/components/ui/index.js";
import { formatRupiah } from "@/views/utils.js";

export interface PaymentConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPaying: boolean;
  inquiry: InquiryData | null;
  productName: string;
}

export function PaymentConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isPaying,
  inquiry,
  productName,
}: PaymentConfirmModalProps) {
  if (!inquiry) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={isPaying ? () => {} : onClose}
      id="modal-payment-confirm"
    >
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div>
              <DialogTitle id="modal-confirm-title">
                Konfirmasi Pembayaran
              </DialogTitle>
              <p className="text-[11px] text-ink-800/50 mt-0.5">
                Verifikasi detail tagihan pelanggan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPaying}
            className="w-7 h-7 rounded-lg text-ink-800/40 hover:text-ink-900 hover:bg-black/[0.04] flex items-center justify-center transition-colors disabled:opacity-40"
          >
            ✕
          </button>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-amber-500/[0.08] border border-amber-500/20 rounded-xl flex items-start gap-3 text-amber-900">
            <svg
              className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="text-xs leading-relaxed">
              <span className="font-bold block text-amber-950 mb-0.5">
                Apakah Anda yakin ingin memproses pembayaran ini?
              </span>
              Pastikan data dan tagihan pelanggan sudah sesuai. Transaksi yang
              berhasil diproses tidak dapat dibatalkan atau ditarik kembali.
            </div>
          </div>

          {/* Details Breakdown */}
          <div className="bg-mist-50/70 rounded-xl p-4 border border-black/[0.06] space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-ink-800/70">
              <span>Wilayah / PDAM</span>
              <span className="font-semibold text-ink-900 text-right max-w-[200px] truncate">
                {productName}
              </span>
            </div>
            <div className="flex justify-between items-center text-ink-800/70">
              <span>ID Pelanggan</span>
              <span className="font-mono font-semibold text-ink-900">
                {inquiry.idpel}
              </span>
            </div>
            <div className="flex justify-between items-center text-ink-800/70">
              <span>Nama Pelanggan</span>
              <span className="font-semibold text-ink-900 text-right max-w-[200px] truncate">
                {inquiry.nama || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center text-ink-800/70">
              <span>Jumlah Tagihan</span>
              <span className="font-semibold text-ink-900">
                {inquiry.jumlah_bulan} Bulan
              </span>
            </div>

            <div className="pt-2 border-t border-black/[0.06] flex justify-between items-baseline">
              <span className="font-bold text-ink-950 text-sm">
                Total Pembayaran
              </span>
              <span className="text-base font-bold text-accent-600 tabular-nums">
                {formatRupiah(inquiry.total_bayar)}
              </span>
            </div>
            <p className="text-[11px] italic text-ink-800/40 text-right capitalize">
              "{terbilang(inquiry.total_bayar)}"
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isPaying}
            className="w-28"
          >
            Batal
          </Button>
          <Button
            type="button"
            id="btn-confirm-proceed-payment"
            variant="primary"
            size="md"
            onClick={onConfirm}
            disabled={isPaying}
            isLoading={isPaying}
            className="flex-1 gap-2"
          >
            Ya, Bayar Sekarang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
