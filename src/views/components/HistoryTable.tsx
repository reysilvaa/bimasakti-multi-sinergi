import type { TransactionRecord } from "@/domain/transaction.js";
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/views/components/ui/index.js";
import { formatRupiah, type Product } from "@/views/utils.js";

interface HistoryTableProps {
  records: TransactionRecord[];
  products: Product[];
  searchQuery: string;
  selectedProduct: string;
  onChangeSearch: (q: string) => void;
  onChangeProduct: (code: string) => void;
  onRefresh: () => void;
  onViewReceipt: (tx: TransactionRecord) => void;
}

export function HistoryTable({
  records,
  products,
  searchQuery,
  selectedProduct,
  onChangeSearch,
  onChangeProduct,
  onRefresh,
  onViewReceipt,
}: HistoryTableProps) {
  const filtered = records.filter((tx) => {
    const q = searchQuery.trim().toLowerCase();
    const matchKeyword =
      !q ||
      tx.customerId.toLowerCase().includes(q) ||
      tx.customerName.toLowerCase().includes(q) ||
      tx.noResi.toLowerCase().includes(q) ||
      tx.pdamName.toLowerCase().includes(q);

    const matchProduct = !selectedProduct || tx.productCode === selectedProduct;
    return matchKeyword && matchProduct;
  });

  const totalSuccess = records.filter((t) => t.status === "00").length;
  const totalVolume = records
    .filter((t) => t.status === "00")
    .reduce((acc, t) => acc + t.totalAmount, 0);

  return (
    <section id="section-history" className="space-y-6">
      {/* Header & Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          id="stat-total-count"
          label="Total Transaksi"
          value={records.length}
          unit="record"
          variant="default"
        />
        <StatCard
          id="stat-success-count"
          label="Pembayaran Sukses"
          value={totalSuccess}
          unit="berhasil"
          variant="success"
        />
        <StatCard
          id="stat-total-value"
          label="Total Volume (Sukses)"
          value={formatRupiah(totalVolume)}
          variant="accent"
        />
      </div>

      {/* Main Table Card */}
      <Card>
        {/* Controls Bar */}
        <div className="p-4 border-b border-black/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-mist-50/30">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-ink-900">
              Riwayat Pembayaran
            </h3>
            <Badge id="history-count-badge" variant="outline">
              {filtered.length}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <input
                type="text"
                id="history-search-input"
                placeholder="Cari IDPEL, Nama, Resi…"
                value={searchQuery}
                onInput={(e) =>
                  onChangeSearch((e.target as HTMLInputElement).value)
                }
                className="h-9 pl-8 pr-3 w-56 rounded-xl bg-white border border-black/[0.08] text-xs focus:border-accent-500 focus:outline-none transition-all placeholder:text-ink-800/35"
              />
              <svg
                className="absolute left-2.5 top-2.5 text-ink-800/40"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="m11 11 3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <select
              id="history-product-filter"
              value={selectedProduct}
              onChange={(e) =>
                onChangeProduct((e.target as HTMLSelectElement).value)
              }
              className="h-9 px-3 pr-7 rounded-xl bg-white border border-black/[0.08] text-xs font-medium focus:border-accent-500 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">Semua PDAM</option>
              {products.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>

            <Button
              type="button"
              id="btn-refresh-history"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="h-9 gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M13 2v4h-4M1 12V8h4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 5A5.5 5.5 0 0 1 12 6M11.5 9a5.5 5.5 0 0 1-9.5-1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5 whitespace-nowrap">Waktu</TableHead>
              <TableHead className="whitespace-nowrap">No. Resi</TableHead>
              <TableHead>PDAM</TableHead>
              <TableHead>ID Pelanggan</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="text-right">Total Tagihan</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right pr-5">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody id="history-tbody">
            {filtered.length === 0 ? (
              <tr id="history-empty-row">
                <td colSpan={8} className="py-12 text-center text-ink-800/40">
                  <p className="text-xs">
                    Belum ada data transaksi yang sesuai.
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const isSuccess = tx.status === "00";
                const badgeVariant = isSuccess
                  ? "success"
                  : tx.status === "33"
                    ? "warning"
                    : "danger";

                return (
                  <TableRow key={tx.id}>
                    <TableCell className="pl-5 whitespace-nowrap text-ink-800/55 tabular-nums">
                      {tx.createdAt}
                    </TableCell>
                    <TableCell className="font-mono text-[12px] font-medium text-ink-900">
                      {tx.noResi || tx.ref2}
                    </TableCell>
                    <TableCell className="font-medium text-ink-900">
                      {tx.pdamName}
                    </TableCell>
                    <TableCell className="font-mono text-[12px] text-ink-800/65">
                      {tx.customerId}
                    </TableCell>
                    <TableCell className="text-ink-800/80">
                      {tx.customerName || "-"}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatRupiah(tx.totalAmount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={badgeVariant}>
                        {isSuccess ? "SUKSES" : tx.statusDescription || "GAGAL"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-5">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onViewReceipt(tx)}
                          className="btn-view-receipt"
                        >
                          Struk
                        </Button>
                        <a
                          href={`/api/transactions/${tx.id}/receipt`}
                          download={`struk_${tx.id}.txt`}
                          className="w-7 h-7 rounded-full border border-black/[0.1] hover:bg-mist-50 text-ink-800/60 flex items-center justify-center transition-colors"
                          title="Download TXT"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M7 1v8m0 0L3.5 5.5M7 9l3.5-3.5M1.5 12.5h11"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </section>
  );
}
