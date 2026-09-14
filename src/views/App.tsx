import { useEffect, useState } from "preact/hooks";
import type { InquiryData } from "@/domain/inquiry.js";
import type { TransactionRecord } from "@/domain/transaction.js";
import { FlowStepper } from "@/views/components/FlowStepper.js";
import { Header } from "@/views/components/Header.js";
import { HistoryTable } from "@/views/components/HistoryTable.js";
import { InquiryForm } from "@/views/components/InquiryForm.js";
import { InquiryResult } from "@/views/components/InquiryResult.js";
import { ReceiptModal } from "@/views/components/ReceiptModal.js";
import { Sidebar } from "@/views/components/Sidebar.js";
import { type AlertState, Toast } from "@/views/components/Toast.js";
import type { Envelope, Product } from "@/views/utils.js";

export function App() {
  const [currentTab, setCurrentTab] = useState<"inquiry" | "history">(
    "inquiry",
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");

  const [isLoadingInquiry, setIsLoadingInquiry] = useState(false);
  const [inquiryData, setInquiryData] = useState<InquiryData | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const [alert, setAlert] = useState<AlertState | null>(null);
  const [receiptModal, setReceiptModal] = useState<{
    isOpen: boolean;
    text: string;
    txId?: number;
  }>({ isOpen: false, text: "" });

  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [historyProduct, setHistoryProduct] = useState("");

  const showAlert = (
    type: "success" | "error" | "info",
    title: string,
    message: string,
  ) => {
    setAlert({ type, title, message });
    setTimeout(() => {
      setAlert(null);
    }, 6000);
  };

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const json: Envelope<Product[]> = await res.json();
      if (json.rc === "00" && json.data && json.data.length > 0) {
        setProducts(json.data);
        setSelectedProduct(json.data[0].code);
        setCustomerId(json.data[0].defaultIdpel);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadTransactions = async () => {
    try {
      const res = await fetch("/api/transactions?limit=100");
      const json: Envelope<TransactionRecord[]> = await res.json();
      if (json.rc === "00" && json.data) {
        setTransactions(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadProducts();
    loadTransactions();
  }, []);

  const handleInquirySubmit = async () => {
    setAlert(null);
    const idpel = customerId.trim();
    if (!idpel) {
      showAlert("error", "Validasi Gagal", "Nomor ID Pelanggan wajib diisi.");
      return;
    }

    setIsLoadingInquiry(true);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productCode: selectedProduct,
          customerId: idpel,
        }),
      });
      const json: Envelope<InquiryData> = await res.json();
      if (json.rc !== "00" || !json.data) {
        throw new Error(json.ket || "Gagal melakukan inquiry tagihan.");
      }
      setInquiryData(json.data);
      showAlert(
        "success",
        "Inquiry Berhasil",
        `Data tagihan untuk ${json.data.nama} ditemukan.`,
      );
    } catch (err: unknown) {
      setInquiryData(null);
      const msg =
        err instanceof Error ? err.message : "Terjadi kesalahan jaringan.";
      showAlert("error", "Inquiry Gagal", msg);
    } finally {
      setIsLoadingInquiry(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!inquiryData) {
      showAlert("error", "Error", "Silakan lakukan inquiry terlebih dahulu.");
      return;
    }

    setIsPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productCode: selectedProduct,
          customerId: inquiryData.idpel,
          ref1: inquiryData.ref1,
          ref2: inquiryData.ref2,
          nominal: inquiryData.nominal.toString(),
        }),
      });
      const json: Envelope<{
        transaction: TransactionRecord;
        receiptText: string;
      }> = await res.json();

      if (json.rc !== "00" || !json.data) {
        throw new Error(json.ket || "Pembayaran gagal diproses.");
      }

      showAlert("success", "Pembayaran Berhasil!", json.ket);
      setReceiptModal({
        isOpen: true,
        text: json.data.receiptText,
        txId: json.data.transaction.id,
      });
      setInquiryData(null);
      loadTransactions();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan sistem saat pembayaran.";
      showAlert("error", "Pembayaran Gagal", msg);
    } finally {
      setIsPaying(false);
    }
  };

  const handleViewReceipt = async (tx: TransactionRecord) => {
    try {
      const res = await fetch(`/api/transactions/${tx.id}`);
      const json: Envelope<{
        transaction: TransactionRecord;
        receiptText: string;
      }> = await res.json();
      if (json.rc === "00" && json.data?.receiptText) {
        setReceiptModal({
          isOpen: true,
          text: json.data.receiptText,
          txId: tx.id,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectedProdObj = products.find((p) => p.code === selectedProduct);
  const selectedProductName = selectedProdObj
    ? `${selectedProdObj.name} (${selectedProdObj.code})`
    : selectedProduct;

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        products={products}
        onSelectProduct={(code, idpel) => {
          setSelectedProduct(code);
          setCustomerId(idpel);
        }}
      />

      <div className="flex-1 md:ml-60 flex flex-col min-w-0">
        <Header currentTab={currentTab} />
        <Toast alert={alert} onClose={() => setAlert(null)} />

        <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-6">
          {currentTab === "inquiry" ? (
            <section id="section-payment">
              <FlowStepper hasInquiry={!!inquiryData} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <InquiryForm
                  products={products}
                  selectedProduct={selectedProduct}
                  customerId={customerId}
                  onChangeProduct={setSelectedProduct}
                  onChangeCustomerId={setCustomerId}
                  onSubmit={handleInquirySubmit}
                  isLoading={isLoadingInquiry}
                />

                <InquiryResult
                  inquiry={inquiryData}
                  isLoading={isLoadingInquiry}
                  isPaying={isPaying}
                  selectedProductName={selectedProductName}
                  onProceedPayment={handlePaymentSubmit}
                  onCancel={() => setInquiryData(null)}
                />
              </div>
            </section>
          ) : (
            <HistoryTable
              records={transactions}
              products={products}
              searchQuery={historySearch}
              selectedProduct={historyProduct}
              onChangeSearch={setHistorySearch}
              onChangeProduct={setHistoryProduct}
              onRefresh={loadTransactions}
              onViewReceipt={handleViewReceipt}
            />
          )}
        </main>

        <footer className="print:hidden border-t border-black/[0.05] py-4 px-6 text-center text-xs text-ink-800/35">
          PDAM Multi-Biller Payment Gateway &copy; 2026 PT. Bimasakti Multi
          Sinergi.
        </footer>
      </div>

      <ReceiptModal
        isOpen={receiptModal.isOpen}
        receiptText={receiptModal.text}
        transactionId={receiptModal.txId}
        onClose={() => setReceiptModal({ isOpen: false, text: "" })}
      />
    </div>
  );
}
