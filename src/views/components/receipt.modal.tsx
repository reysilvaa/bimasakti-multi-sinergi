import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/views/components/ui/index.js";

interface ReceiptModalProps {
  isOpen: boolean;
  receiptText: string;
  transactionId?: number;
  onClose: () => void;
}

export function ReceiptModal({
  isOpen,
  receiptText,
  transactionId,
  onClose,
}: ReceiptModalProps) {
  const downloadUrl = transactionId
    ? `/api/transactions/${transactionId}/receipt`
    : receiptText
      ? URL.createObjectURL(
          new Blob([receiptText], { type: "text/plain;charset=utf-8" }),
        )
      : "#";

  const downloadFilename = transactionId
    ? `struk_${transactionId}.txt`
    : "struk_pembayaran.txt";

  const handlePrint = () => {
    let iframe = document.getElementById(
      "receipt-print-frame",
    ) as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "receipt-print-frame";
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);
    }
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Struk Pembayaran PDAM</title>
  <style>
    @page { size: auto; margin: 8mm; }
    body {
      margin: 0;
      padding: 16px;
      font-family: 'JetBrains Mono', 'Courier New', Courier, monospace;
      font-size: 10pt;
      line-height: 1.4;
      color: #000;
      background: #fff;
    }
    .receipt-container {
      max-width: 380px;
      margin: 0 auto;
      border: 1px dashed #666;
      border-radius: 4px;
      padding: 16px;
      white-space: pre;
    }
  </style>
</head>
<body><div class="receipt-container">${receiptText}</div></body>
</html>`);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
      }, 150);
    } else {
      window.print();
    }
  };

  return (
    <Dialog id="receipt-modal" isOpen={isOpen} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bukti Pembayaran (Struk)</DialogTitle>
          <button
            type="button"
            id="btn-close-receipt-modal"
            onClick={onClose}
            className="text-ink-800/40 hover:text-ink-900 transition-colors p-1 cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </DialogHeader>

        <div className="p-6 print:p-0">
          <div
            id="modal-receipt-content"
            className="receipt-paper bg-mist-50/70 p-5 rounded-xl border border-black/[0.07] font-mono text-xs text-ink-950 leading-relaxed overflow-x-auto whitespace-pre select-all print:bg-transparent print:border-none print:p-0 print:text-black print:text-[11pt] print:leading-snug"
          >
            {receiptText}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            id="btn-print-receipt"
            variant="outline"
            size="md"
            onClick={handlePrint}
            className="gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6v-7Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Cetak</span>
          </Button>
          <a
            id="btn-download-receipt"
            href={downloadUrl}
            download={downloadFilename}
            className="inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer h-10 px-4 text-[13px] bg-accent-500 hover:bg-accent-600 text-white shadow-sm shadow-accent-500/20 gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Unduh TXT</span>
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
