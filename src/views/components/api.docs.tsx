import { useState } from "preact/hooks";

interface EndpointSpec {
  id: string;
  method: "GET" | "POST";
  path: string;
  category: "Produk" | "Transaksi" | "Riwayat";
  title: string;
  summary: string;
  description: string;
  sampleBody?: string;
  sampleQuery?: string;
  curlSnippet: (baseUrl: string) => string;
  jsSnippet: (baseUrl: string) => string;
  responseSuccess: string;
  rcCodes: { code: string; desc: string }[];
}

const ENDPOINTS: EndpointSpec[] = [
  {
    id: "get-products",
    method: "GET",
    path: "/api/products",
    category: "Produk",
    title: "Daftar Produk PDAM",
    summary: "Ambil seluruh daftar PDAM aktif beserta contoh ID Pelanggan uji.",
    description:
      "Mengembalikan daftar kode produk PDAM yang didukung sistem (WASDA untuk PDAM Sidoarjo, WABONDO untuk PDAM Bondowoso) serta contoh ID Pelanggan siap uji.",
    curlSnippet: (base) => `curl -X GET "${base}/api/products" \\
  -H "Accept: application/json"`,
    jsSnippet: (base) => `const res = await fetch("${base}/api/products", {
  headers: { "Accept": "application/json" }
});
const data = await res.json();
console.log(data);`,
    responseSuccess: `{
  "rc": "00",
  "ket": "Daftar produk berhasil dimuat.",
  "data": [
    {
      "code": "WASDA",
      "name": "PDAM SIDOARJO",
      "defaultIdpel": "01002676"
    },
    {
      "code": "WABONDO",
      "name": "PDAM BONDOWOSO",
      "defaultIdpel": "09000879"
    }
  ]
}`,
    rcCodes: [
      { code: "00", desc: "Berhasil mendapatkan daftar produk" },
      { code: "99", desc: "Kesalahan internal server" },
    ],
  },
  {
    id: "post-inquiry",
    method: "POST",
    path: "/api/inquiry",
    category: "Transaksi",
    title: "Inquiry Tagihan PDAM",
    summary: "Cek rincian tagihan air pelanggan ke server biller Rajabiller.",
    description:
      "Mengirimkan permintaan pengecekan tagihan berdasarkan IDPEL dan kode produk. Mengembalikan nominal, denda, admin, rincian bulan berjalan, serta token ref1 dan ref2 untuk sesi pembayaran.",
    sampleBody: `{
  "productCode": "WASDA",
  "customerId": "01002676"
}`,
    curlSnippet: (base) => `curl -X POST "${base}/api/inquiry" \\
  -H "Content-Type: application/json" \\
  -d '{
    "productCode": "WASDA",
    "customerId": "01002676"
  }'`,
    jsSnippet: (base) => `const res = await fetch("${base}/api/inquiry", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    productCode: "WASDA",
    customerId: "01002676"
  })
});
const result = await res.json();`,
    responseSuccess: `{
  "rc": "00",
  "ket": "Inquiry tagihan berhasil didapatkan.",
  "data": {
    "idpel": "01002676",
    "nama": "PERM. BUMI CITRA FAJAR",
    "nominal": 294500,
    "admin": 10806,
    "total_bayar": 305306,
    "jumlah_bulan": "6",
    "ref1": "INQ_1789381200000_A1B2",
    "ref2": "2818948501"
  }
}`,
    rcCodes: [
      { code: "00", desc: "Inquiry berhasil, data tagihan ditemukan" },
      { code: "05", desc: "Tagihan sudah lunas / tidak ada tunggakan" },
      { code: "400", desc: "ID Pelanggan atau Kode Produk tidak valid" },
    ],
  },
  {
    id: "post-payment",
    method: "POST",
    path: "/api/payment",
    category: "Transaksi",
    title: "Pembayaran Tagihan PDAM",
    summary:
      "Eksekusi pembayaran tagihan dengan perlindungan idempotensi ganda.",
    description:
      "Membayar tagihan berdasarkan token ref2 dari hasil inquiry. Menggunakan kunci idempotensi ref2 (dicek di service dan UNIQUE constraint di MySQL) untuk mencegah pendebetan ganda.",
    sampleBody: `{
  "productCode": "WASDA",
  "customerId": "01002676",
  "ref1": "INQ_WASDA_123456",
  "ref2": "2818948501",
  "nominal": 305306
}`,
    curlSnippet: (base) => `curl -X POST "${base}/api/payment" \\
  -H "Content-Type: application/json" \\
  -d '{
    "productCode": "WASDA",
    "customerId": "01002676",
    "ref1": "INQ_WASDA_123456",
    "ref2": "2818948501",
    "nominal": 305306
  }'`,
    jsSnippet: (base) => `const res = await fetch("${base}/api/payment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    productCode: "WASDA",
    customerId: "01002676",
    ref1: "INQ_WASDA_123456",
    ref2: "2818948501",
    nominal: 305306
  })
});
const result = await res.json();`,
    responseSuccess: `{
  "rc": "00",
  "ket": "Pembayaran berhasil diproses.",
  "data": {
    "transaction": {
      "id": 1,
      "ref1": "INQ_WASDA_123456",
      "ref2": "2818948501",
      "no_resi": "2818948433",
      "total_amount": 305306,
      "status": "SUKSES"
    },
    "receiptText": "STRUK PEMBAYARAN PDAM SIDOARJO\\n..."
  }
}`,
    rcCodes: [
      { code: "00", desc: "Pembayaran sukses dan tersimpan di database" },
      { code: "33", desc: "Tagihan sudah dibayar (idempoten dicegah)" },
      { code: "400", desc: "Parameter pembayaran tidak lengkap" },
    ],
  },
  {
    id: "get-transactions",
    method: "GET",
    path: "/api/transactions",
    category: "Riwayat",
    title: "Riwayat Transaksi",
    summary: "Daftar histori transaksi pembayaran dengan pagination guard.",
    description:
      "Mengambil riwayat transaksi pembayaran dari database dengan filter parameter limit (maksimum 500 baris) diurutkan dari transaksi terbaru.",
    sampleQuery: "?limit=100",
    curlSnippet: (base) => `curl -X GET "${base}/api/transactions?limit=100" \\
  -H "Accept: application/json"`,
    jsSnippet: (
      base,
    ) => `const res = await fetch("${base}/api/transactions?limit=100");
const data = await res.json();`,
    responseSuccess: `{
  "rc": "00",
  "ket": "Riwayat transaksi berhasil diambil.",
  "data": [
    {
      "id": 1,
      "ref1": "INQ_123",
      "ref2": "2818948501",
      "no_resi": "2818948433",
      "product_code": "WASDA",
      "pdam_name": "PDAM SIDOARJO",
      "customer_id": "01002676",
      "customer_name": "PERM. BUMI CITRA FAJAR",
      "total_amount": 305306,
      "status": "SUKSES",
      "created_at": "2026-09-14T12:15:07.000Z"
    }
  ]
}`,
    rcCodes: [
      { code: "00", desc: "Riwayat transaksi sukses dimuat" },
      { code: "99", desc: "Kesalahan internal basis data" },
    ],
  },
  {
    id: "get-transaction-detail",
    method: "GET",
    path: "/api/transactions/:id",
    category: "Riwayat",
    title: "Detail Transaksi & Struk",
    summary: "Detail rekaman transaksi spesifik beserta format teks struk.",
    description:
      "Mendapatkan objek transaksi lengkap berdasarkan ID database termasuk teks struk siap cetak dengan layout resmi Sidoarjo atau Bondowoso.",
    curlSnippet: (base) => `curl -X GET "${base}/api/transactions/1" \\
  -H "Accept: application/json"`,
    jsSnippet: (base) => `const res = await fetch("${base}/api/transactions/1");
const data = await res.json();`,
    responseSuccess: `{
  "rc": "00",
  "ket": "Detail transaksi berhasil didapatkan.",
  "data": {
    "transaction": {
      "id": 1,
      "no_resi": "2818948433",
      "customer_name": "PERM. BUMI CITRA FAJ"
    },
    "receiptText": "STRUK PEMBAYARAN PDAM SIDOARJO\\nTANGGAL : 14-09-2026..."
  }
}`,
    rcCodes: [
      { code: "00", desc: "Detail transaksi ditemukan" },
      { code: "404", desc: "Transaksi tidak ditemukan" },
    ],
  },
  {
    id: "get-receipt-download",
    method: "GET",
    path: "/api/transactions/:id/receipt",
    category: "Riwayat",
    title: "Unduh Struk TXT",
    summary: "Download file struk pembayaran resmi (.txt attachment).",
    description:
      "Mengunduh teks struk pembayaran dalam bentuk file lampiran .txt untuk pencetakan struk kasir atau arsip pelanggan.",
    curlSnippet: (base) => `curl -O -J "${base}/api/transactions/1/receipt"`,
    jsSnippet: (base) =>
      `window.open("${base}/api/transactions/1/receipt", "_blank");`,
    responseSuccess: `STRUK PEMBAYARAN PDAM SIDOARJO
TANGGAL        : 14-09-2026 19:15:07
NO. RESI       : 2818948431
NO. PELANGGAN  : 01002676
NAMA           : PERM. BUMI CITRA FAJ
TOTAL TAGIHAN  : Rp       305.306`,
    rcCodes: [
      { code: "200", desc: "File struk .txt terunduh" },
      { code: "404", desc: "Transaksi tidak ditemukan" },
    ],
  },
];

export function ApiDocs() {
  const [selectedId, setSelectedId] = useState<string>("get-products");
  const [activeSnippetTab, setActiveSnippetTab] = useState<"curl" | "fetch">(
    "curl",
  );
  const [searchFilter, setSearchFilter] = useState("");
  const [testPayload, setTestPayload] = useState<string>("");
  const [testParamId, setTestParamId] = useState<string>("1");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: number;
    timeMs: number;
    body: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedEndpoint =
    ENDPOINTS.find((e) => e.id === selectedId) || ENDPOINTS[0];
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  const filteredEndpoints = ENDPOINTS.filter(
    (e) =>
      e.path.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.category.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  const handleSelect = (endpoint: EndpointSpec) => {
    setSelectedId(endpoint.id);
    setTestPayload(endpoint.sampleBody || "");
    setTestResult(null);
  };

  const handleCopySnippet = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExecuteTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const start = performance.now();

    try {
      let url = `${baseUrl}${selectedEndpoint.path}`;
      if (selectedEndpoint.path.includes(":id")) {
        url = url.replace(":id", testParamId.trim() || "1");
      }
      if (selectedEndpoint.sampleQuery) {
        url += selectedEndpoint.sampleQuery;
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          Accept: "application/json",
          ...(selectedEndpoint.method === "POST"
            ? { "Content-Type": "application/json" }
            : {}),
        },
      };

      if (selectedEndpoint.method === "POST" && testPayload.trim()) {
        options.body = testPayload.trim();
      }

      const res = await fetch(url, options);
      const timeMs = Math.round(performance.now() - start);
      const isJson = res.headers
        .get("content-type")
        ?.includes("application/json");

      let bodyText = "";
      if (isJson) {
        const json = await res.json();
        bodyText = JSON.stringify(json, null, 2);
      } else {
        bodyText = await res.text();
      }

      setTestResult({
        status: res.status,
        timeMs,
        body: bodyText,
      });
    } catch (err) {
      const timeMs = Math.round(performance.now() - start);
      setTestResult({
        status: 0,
        timeMs,
        body: String(err),
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <h2 className="text-xl font-bold tracking-tight text-ink-950">
                Spesifikasi API Gateway PDAM
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-accent-50 text-accent-600 border border-accent-100">
                v2.1.3 OpenAPI
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Active
              </span>
            </div>
            <p className="text-[13px] text-ink-800/60 max-w-2xl">
              Dokumentasi interaktif gateway pembayaran tagihan PDAM (Sidoarjo &
              Bondowoso) terintegrasi dengan protokol resmi Biller Fastpay
              Rajabiller.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-mist-50 px-3.5 py-2 rounded-xl border border-black/[0.05]">
            <span className="text-[11px] font-semibold text-ink-800/40 uppercase tracking-wider">
              Base URL:
            </span>
            <code className="text-[12px] font-mono font-semibold text-ink-900">
              {baseUrl}/api
            </code>
          </div>
        </div>
      </div>

      {/* Main Scalar-style Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Endpoint Navigation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Cari endpoint..."
                value={searchFilter}
                onInput={(e) =>
                  setSearchFilter((e.target as HTMLInputElement).value)
                }
                className="w-full px-3 py-2 bg-mist-50 rounded-xl border border-black/[0.05] text-[12px] placeholder:text-ink-800/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/20"
              />
            </div>

            <div className="space-y-1">
              {filteredEndpoints.map((ep) => {
                const isSelected = ep.id === selectedId;
                return (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => handleSelect(ep)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-[12px] transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-ink-950 text-white shadow-sm"
                        : "hover:bg-mist-50 text-ink-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                          ep.method === "GET"
                            ? isSelected
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-emerald-100 text-emerald-800"
                            : isSelected
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-medium truncate">{ep.path}</span>
                    </div>
                    <span
                      className={`text-[10px] shrink-0 font-medium ${
                        isSelected ? "text-white/60" : "text-ink-800/40"
                      }`}
                    >
                      {ep.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business RC Code Reference Card */}
          <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
            <h3 className="text-[13px] font-bold text-ink-950 mb-2">
              Daftar Response Code (RC)
            </h3>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-1.5">
                <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  00
                </span>
                <span className="text-ink-800/70 font-medium text-right">
                  Sukses / Transaksi Berhasil
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-1.5">
                <span className="font-mono font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                  05
                </span>
                <span className="text-ink-800/70 font-medium text-right">
                  Tagihan Sudah Lunas
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-1.5">
                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  33
                </span>
                <span className="text-ink-800/70 font-medium text-right">
                  Sudah Dibayar (Idempoten)
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-1.5">
                <span className="font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                  400 / 422
                </span>
                <span className="text-ink-800/70 font-medium text-right">
                  Validasi Schema Gagal
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                  99
                </span>
                <span className="text-ink-800/70 font-medium text-right">
                  Kesalahan Server / Biller
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Detail & Interactive Playground */}
        <div className="lg:col-span-8 space-y-5">
          {/* Endpoint Header Card */}
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span
                  className={`text-[12px] font-bold font-mono px-2.5 py-1 rounded-lg ${
                    selectedEndpoint.method === "GET"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <h3 className="text-lg font-bold font-mono text-ink-950">
                  {selectedEndpoint.path}
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopySnippet(`${baseUrl}${selectedEndpoint.path}`)
                }
                className="text-[11px] font-semibold text-ink-800/60 hover:text-ink-900 bg-mist-50 hover:bg-mist-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied ? "✓ Tersalin" : "Salin URL"}
              </button>
            </div>
            <p className="text-[13px] text-ink-800/70 leading-relaxed mb-4">
              {selectedEndpoint.description}
            </p>

            {/* Code Snippets Section */}
            <div className="border-t border-black/[0.05] pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSnippetTab("curl")}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                      activeSnippetTab === "curl"
                        ? "bg-ink-950 text-white"
                        : "text-ink-800/50 hover:text-ink-900 hover:bg-mist-50"
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSnippetTab("fetch")}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                      activeSnippetTab === "fetch"
                        ? "bg-ink-950 text-white"
                        : "text-ink-800/50 hover:text-ink-900 hover:bg-mist-50"
                    }`}
                  >
                    JavaScript (fetch)
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopySnippet(
                      activeSnippetTab === "curl"
                        ? selectedEndpoint.curlSnippet(baseUrl)
                        : selectedEndpoint.jsSnippet(baseUrl),
                    )
                  }
                  className="text-[11px] text-ink-800/45 hover:text-ink-900"
                >
                  Salin Snippet
                </button>
              </div>
              <pre className="bg-ink-950 text-white/90 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-black/10">
                <code>
                  {activeSnippetTab === "curl"
                    ? selectedEndpoint.curlSnippet(baseUrl)
                    : selectedEndpoint.jsSnippet(baseUrl)}
                </code>
              </pre>
            </div>
          </div>

          {/* Interactive Request Tester (Scalar Live Playground) */}
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[14px] font-bold text-ink-950">
                Interactive Request Tester
              </h4>
              <button
                type="button"
                id="execute-api-test-btn"
                onClick={handleExecuteTest}
                disabled={isTesting}
                className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white text-[12px] font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <svg
                      className="animate-spin h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                        className="opacity-75"
                      />
                    </svg>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>Kirim Request Live</span>
                  </>
                )}
              </button>
            </div>

            {/* Path Parameter Input if applicable */}
            {selectedEndpoint.path.includes(":id") && (
              <div className="bg-mist-50 p-3 rounded-xl border border-black/[0.04]">
                <label
                  htmlFor="test-param-id"
                  className="block text-[11px] font-semibold text-ink-800/70 mb-1"
                >
                  Parameter :id (ID Transaksi):
                </label>
                <input
                  id="test-param-id"
                  type="text"
                  value={testParamId}
                  onInput={(e) =>
                    setTestParamId((e.target as HTMLInputElement).value)
                  }
                  className="w-full px-3 py-1.5 bg-white rounded-lg border border-black/[0.08] text-[12px] font-mono"
                  placeholder="1"
                />
              </div>
            )}

            {/* Request Body Editor for POST */}
            {selectedEndpoint.method === "POST" && (
              <div>
                <label
                  htmlFor="test-request-body"
                  className="block text-[11px] font-semibold text-ink-800/60 mb-1"
                >
                  Request Body (JSON):
                </label>
                <textarea
                  id="test-request-body"
                  rows={6}
                  value={testPayload || selectedEndpoint.sampleBody || ""}
                  onInput={(e) =>
                    setTestPayload((e.target as HTMLTextAreaElement).value)
                  }
                  className="w-full p-3 bg-mist-50 rounded-xl border border-black/[0.05] font-mono text-[12px] text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/20"
                />
              </div>
            )}

            {/* Live Response Viewer */}
            {testResult && (
              <div className="space-y-2 pt-2 border-t border-black/[0.05]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        testResult.status >= 200 && testResult.status < 300
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      Status: {testResult.status || "Error"}
                    </span>
                    <span className="text-[11px] text-ink-800/50 font-mono">
                      Waktu: {testResult.timeMs}ms
                    </span>
                  </div>
                  <span className="text-[11px] text-ink-800/40">
                    Live Server Response
                  </span>
                </div>
                <pre className="bg-ink-950 text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed">
                  <code>{testResult.body}</code>
                </pre>
              </div>
            )}

            {/* Default Schema Response Example */}
            {!testResult && (
              <div>
                <span className="block text-[11px] font-semibold text-ink-800/50 mb-1">
                  Contoh Response Sukses (Schema):
                </span>
                <pre className="bg-mist-50 text-ink-900 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto border border-black/[0.04]">
                  <code>{selectedEndpoint.responseSuccess}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
