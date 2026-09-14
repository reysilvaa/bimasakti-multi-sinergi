import { useEffect, useState } from "preact/hooks";
import type { InquiryData } from "@/domain/inquiry.js";
import type { TransactionRecord } from "@/domain/transaction.js";
import {
  getProducts,
  getTransactionDetail,
  getTransactions,
  requestInquiry,
  requestPayment,
} from "@/views/api/pdam.api.js";
import { ApiDocs } from "@/views/components/api.docs.js";
import { FlowStepper } from "@/views/components/flow.stepper.js";
import { Header } from "@/views/components/header.js";
import { HistoryTable } from "@/views/components/history.table.js";
import { InquiryForm } from "@/views/components/inquiry.form.js";
import { InquiryResult } from "@/views/components/inquiry.result.js";
import { PaymentConfirmModal } from "@/views/components/payment.confirm.modal.js";
import { ReadmeViewer } from "@/views/components/readme.viewer.js";
import { ReceiptModal } from "@/views/components/receipt.modal.js";
import { Sidebar } from "@/views/components/sidebar.js";
import { type AlertState, Toast } from "@/views/components/toast.js";
import type { Product } from "@/views/utils.js";

function getInitialTab(): "inquiry" | "history" | "docs" | "readme" {
  if (typeof window === "undefined") return "inquiry";
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");
  if (
    tab === "readme" ||
    window.location.pathname === "/readme" ||
    window.location.hash === "#readme"
  ) {
    return "readme";
  }
  if (
    tab === "docs" ||
    window.location.pathname === "/docs" ||
    window.location.hash === "#docs"
  ) {
    return "docs";
  }
  if (
    tab === "history" ||
    window.location.pathname === "/history" ||
    window.location.hash === "#history"
  ) {
    return "history";
  }
  return "inquiry";
}

export function App() {
  const [currentTab, setCurrentTab] = useState<
    "inquiry" | "history" | "docs" | "readme"
  >(getInitialTab);

  const handleSelectTab = (tab: "inquiry" | "history" | "docs" | "readme") => {
    setCurrentTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url.toString());
    }
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");

  const [isLoadingInquiry, setIsLoadingInquiry] = useState(false);
  const [inquiryData, setInquiryData] = useState<InquiryData | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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
      const data = await getProducts();
      if (data.length > 0) {
        setProducts(data);
        setSelectedProduct(data[0].code);
        setCustomerId(data[0].defaultIdpel);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadTransactions = async () => {
    try {
      const data = await getTransactions(100);
      setTransactions(data);
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
      const data = await requestInquiry(selectedProduct, idpel);
      setInquiryData(data);
      showAlert(
        "success",
        "Inquiry Berhasil",
        `Data tagihan untuk ${data.nama} ditemukan.`,
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
      const { data, ket } = await requestPayment({
        productCode: selectedProduct,
        customerId: inquiryData.idpel,
        ref1: inquiryData.ref1,
        ref2: inquiryData.ref2,
        nominal: inquiryData.nominal.toString(),
      });

      showAlert("success", "Pembayaran Berhasil!", ket);
      setIsConfirmModalOpen(false);
      setReceiptModal({
        isOpen: true,
        text: data.receiptText,
        txId: data.transaction.id,
      });
      setInquiryData(null);
      loadTransactions();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan sistem saat pembayaran.";
      showAlert("error", "Pembayaran Gagal", msg);
      setIsConfirmModalOpen(false);
    } finally {
      setIsPaying(false);
    }
  };

  const handleViewReceipt = async (tx: TransactionRecord) => {
    try {
      const data = await getTransactionDetail(tx.id);
      setReceiptModal({
        isOpen: true,
        text: data.receiptText,
        txId: tx.id,
      });
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
        onSelectTab={handleSelectTab}
        products={products}
        onSelectProduct={(code, idpel) => {
          setSelectedProduct(code);
          setCustomerId(idpel);
        }}
      />

      <div className="flex-1 md:ml-60 flex flex-col min-w-0">
        <Header currentTab={currentTab} />
        <Toast alert={alert} onClose={() => setAlert(null)} />

        <main className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
          {currentTab === "inquiry" && (
            <section id="section-payment">
              <FlowStepper hasInquiry={!!inquiryData} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
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
                  onProceedPayment={() => setIsConfirmModalOpen(true)}
                  onCancel={() => setInquiryData(null)}
                />
              </div>
            </section>
          )}

          {currentTab === "history" && (
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

          {currentTab === "docs" && <ApiDocs />}

          {currentTab === "readme" && (
            <ReadmeViewer onNavigateToApp={() => handleSelectTab("inquiry")} />
          )}
        </main>

        <footer className="print:hidden border-t border-black/[0.05] py-4 px-6 text-center text-xs text-ink-800/35">
          PDAM Multi-Biller Payment Gateway &copy; 2026 PT. Bimasakti Multi
          Sinergi.
        </footer>
      </div>

      <PaymentConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handlePaymentSubmit}
        isPaying={isPaying}
        inquiry={inquiryData}
        productName={selectedProductName}
      />

      <ReceiptModal
        isOpen={receiptModal.isOpen}
        receiptText={receiptModal.text}
        transactionId={receiptModal.txId}
        onClose={() => setReceiptModal({ isOpen: false, text: "" })}
      />
    </div>
  );
}
