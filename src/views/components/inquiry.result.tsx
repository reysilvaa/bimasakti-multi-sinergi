import { useState } from "preact/hooks";
import type { InquiryData, SpecBill } from "@/domain/inquiry.js";
import { terbilang } from "@/utils/terbilang.js";
import {
  Badge,
  Button,
  Card,
  LoadingSpinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/views/components/ui/index.js";
import { formatRupiah } from "@/views/utils.js";

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
  "DES",
];

interface InquiryResultProps {
  inquiry: InquiryData | null;
  isLoading: boolean;
  isPaying: boolean;
  selectedProductName: string;
  onProceedPayment: () => void;
  onCancel: () => void;
}

export function InquiryResult({
  inquiry,
  isLoading,
  isPaying,
  selectedProductName,
  onProceedPayment,
  onCancel,
}: InquiryResultProps) {
  const [showAllBills, setShowAllBills] = useState(false);

  if (isLoading) {
    return (
      <div className="lg:col-span-7 flex flex-col h-full">
        <Card
          id="inquiry-loading-state"
          className="p-8 text-center animate-card-in flex-1 flex flex-col items-center justify-center h-full min-h-[360px]"
        >
          <LoadingSpinner
            title="Menghubungi Server PDAM…"
            subtitle="Mengambil rincian tagihan terbaru"
          />
        </Card>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="lg:col-span-7 flex flex-col h-full">
        <Card
          id="inquiry-empty-state"
          className="p-12 text-center flex-1 flex flex-col items-center justify-center h-full min-h-[360px]"
        >
          <div className="w-12 h-12 mx-auto rounded-2xl bg-mist-100 flex items-center justify-center text-ink-800/30 mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6m-6 9h6m-6 4h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-ink-900">
            Belum Ada Data Inquiry
          </p>
          <p className="text-xs text-ink-800/40 mt-1 max-w-sm mx-auto">
            Pilih wilayah PDAM dan masukkan nomor ID Pelanggan di form sebelah
            kiri untuk memeriksa tagihan.
          </p>
        </Card>
      </div>
    );
  }

  let billEntries: [string, SpecBill][] = [];
  if (inquiry.data_bill) {
    if (Array.isArray(inquiry.data_bill)) {
      billEntries = inquiry.data_bill.map((b, i) => [`blth${i + 1}`, b]);
    } else {
      billEntries = Object.entries(inquiry.data_bill);
    }
  }
  const bills = billEntries.map(([, b]) => b);
  const hasNonair = bills.some((b) => b.nonair > 0);
  const hasMeter = bills.some((b) => b.meter_akhir > 0 || b.meter_awal > 0);

  const penaltyTotal = bills.reduce((a, b) => a + b.denda, 0);
  const miscTotal = bills.reduce((a, b) => a + b.nonair, 0);
  const visibleBills = showAllBills ? billEntries : billEntries.slice(0, 3);

  return (
    <div className="lg:col-span-7 flex flex-col h-full">
      <Card
        id="inquiry-result-card"
        className="animate-card-in flex-1 flex flex-col justify-between h-full"
      >
        <div>
          <div className="px-6 py-4 border-b border-black/[0.05] flex items-center justify-between bg-mist-50/40">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <div>
                <span
                  id="res-pdam-badge"
                  className="text-[11px] font-bold text-accent-600 uppercase tracking-wider block"
                >
                  {selectedProductName}
                </span>
                <h3 className="text-sm font-bold tracking-tight text-ink-900">
                  Detail Tagihan Pelanggan
                </h3>
              </div>
            </div>
            <Badge id="res-bill-count" variant="default">
              {inquiry.jumlah_bulan} Bulan Tagihan
            </Badge>
          </div>

          <div className="p-6 space-y-5">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-mist-50/50 border border-black/[0.04]">
              <div>
                <span className="text-[11px] font-semibold text-ink-800/40 uppercase tracking-wider block">
                  ID Pelanggan
                </span>
                <span
                  id="res-customer-id"
                  className="text-sm font-mono font-bold text-ink-900"
                >
                  {inquiry.idpel}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-ink-800/40 uppercase tracking-wider block">
                  No. Meter
                </span>
                <span
                  id="res-nomet"
                  className="text-sm font-mono font-medium text-ink-900"
                >
                  {inquiry.nomet || inquiry.nometer || "-"}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-ink-800/40 uppercase tracking-wider block">
                  Nama
                </span>
                <span
                  id="res-customer-name"
                  className="text-sm font-bold text-ink-900 truncate block"
                >
                  {inquiry.nama || "-"}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-ink-800/40 uppercase tracking-wider block">
                  Alamat
                </span>
                <span
                  id="res-customer-address"
                  className="text-xs font-medium text-ink-800/70 truncate block"
                >
                  {inquiry.alamat || "-"}
                </span>
              </div>
            </div>

            {/* Table of periods */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-800/40">
                  Rincian Tagihan per Periode
                </h4>
                {billEntries.length > 3 && (
                  <span className="text-[11px] text-ink-800/45 font-medium">
                    Menampilkan {visibleBills.length} dari {billEntries.length}{" "}
                    bulan
                  </span>
                )}
              </div>
              <div className="border border-black/[0.06] rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">Periode</TableHead>
                      {hasMeter && (
                        <TableHead id="th-meter">Pemakaian</TableHead>
                      )}
                      <TableHead className="text-right">Tagihan Air</TableHead>
                      <TableHead className="text-right">Denda</TableHead>
                      {hasNonair && (
                        <TableHead id="th-misc" className="text-right pr-4">
                          Non-Air / Beban
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody id="res-bills-tbody">
                    {visibleBills.map(([blthKey, bill]) => {
                      const meter = bill.meter_akhir - bill.meter_awal;
                      const monthIdx = parseInt(bill.bulan, 10) - 1;
                      const label = `${MONTHS[monthIdx] || bill.bulan} ${bill.tahun}`;
                      return (
                        <TableRow key={blthKey}>
                          <TableCell className="pl-4 font-semibold text-ink-900">
                            {label}
                          </TableCell>
                          {hasMeter && (
                            <TableCell className="text-ink-800/60 tabular-nums">
                              {meter > 0 ? `${meter} m³` : "-"}
                            </TableCell>
                          )}
                          <TableCell className="text-right tabular-nums text-ink-900">
                            {formatRupiah(bill.air)}
                          </TableCell>
                          <TableCell
                            className={`text-right tabular-nums ${
                              bill.denda > 0
                                ? "text-red-600 font-medium"
                                : "text-ink-800/35"
                            }`}
                          >
                            {formatRupiah(bill.denda)}
                          </TableCell>
                          {hasNonair && (
                            <TableCell className="text-right tabular-nums text-ink-800/70 pr-4">
                              {formatRupiah(bill.nonair)}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {billEntries.length > 3 && (
                  <div className="border-t border-black/[0.06] bg-mist-50/60 py-2.5 px-4 text-center">
                    <button
                      type="button"
                      id="btn-toggle-show-all-bills"
                      onClick={() => setShowAllBills(!showAllBills)}
                      className="text-[12px] font-semibold text-accent-600 hover:text-accent-700 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>
                        {showAllBills
                          ? "Sembunyikan"
                          : `Tampilkan semua (${billEntries.length} periode)`}
                      </span>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`transition-transform duration-200 ${
                          showAllBills ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Payment Summary & Actions */}
        <div className="p-6 pt-0 space-y-4">
          <div className="p-4 rounded-xl bg-mist-50/50 border border-black/[0.04] space-y-2.5 text-xs">
            <div className="flex justify-between text-ink-800/70">
              <span>Tagihan Pokok (Nominal)</span>
              <span
                id="res-nominal"
                className="font-semibold tabular-nums text-ink-900"
              >
                {formatRupiah(inquiry.nominal)}
              </span>
            </div>
            <div className="flex justify-between text-ink-800/70">
              <span>Total Denda</span>
              <span
                id="res-penalty-total"
                className={`font-semibold tabular-nums ${
                  penaltyTotal > 0 ? "text-red-600" : "text-ink-900"
                }`}
              >
                {formatRupiah(penaltyTotal)}
              </span>
            </div>
            {hasNonair && (
              <div
                id="row-misc-total"
                className="flex justify-between text-ink-800/70"
              >
                <span>Total Biaya Lain / Beban</span>
                <span
                  id="res-misc-total"
                  className="font-semibold tabular-nums text-ink-900"
                >
                  {formatRupiah(miscTotal)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-ink-800/70">
              <span>Biaya Admin</span>
              <span
                id="res-admin-fee"
                className="font-semibold tabular-nums text-ink-900"
              >
                {formatRupiah(inquiry.admin)}
              </span>
            </div>
            <div className="pt-2 border-t border-black/[0.06] flex justify-between items-baseline">
              <span className="text-sm font-bold text-ink-950">
                Total Pembayaran
              </span>
              <span
                id="res-total-amount"
                className="text-lg font-bold text-accent-600 tabular-nums"
              >
                {formatRupiah(inquiry.total_bayar)}
              </span>
            </div>
            <p
              id="res-terbilang"
              className="text-[11px] italic text-ink-800/40 text-right capitalize pt-1"
            >
              "{terbilang(inquiry.total_bayar)}"
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              id="btn-cancel-inquiry"
              variant="outline"
              size="lg"
              onClick={onCancel}
              className="w-1/3"
            >
              Batal
            </Button>
            <Button
              type="button"
              id="btn-proceed-payment"
              variant="primary"
              size="lg"
              disabled={isPaying}
              isLoading={isPaying}
              onClick={onProceedPayment}
              className="flex-1"
            >
              Bayar Sekarang
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
