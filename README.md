# Sistem Pembayaran Tagihan PDAM (Sidoarjo & Bondowoso)

Aplikasi Full-Stack Web Gateway Pembayaran Tagihan Air PDAM (PDAM Sidoarjo & PDAM Bondowoso) terintegrasi dengan API Rajabiller Fastpay, sesuai dokumen **Full Stack Dev Test (Rev 2.1.3)** PT. Bimasakti Multi Sinergi.

**Node.js + Express + TypeScript (ESM)**, MySQL via **Drizzle ORM** (`mysql2` pool), frontend HTML5 + Tailwind + TypeScript (esbuild).

---

## Alur Transaksi (sesuai spec)

1. User isi **select nama PDAM + input idpel** di frontend, klik Inquiry.
2. Frontend → **API Internal** `POST /api/inquiry` → **Rajabiller** `fastpay.inq`.
3. Rincian tagihan (format json point 4) ditampilkan, user lanjut Payment.
4. Frontend → **API Internal** `POST /api/payment` → **Rajabiller** `fastpay.pay` (nominal & ref2 dari respon inquiry).
5. API Internal simpan transaksi ke **MySQL internal** (Drizzle ORM) → tampilkan + unduh struk.
6. **History** membaca DB internal, bisa ditampilkan berulang-ulang.

## List Produk Test (spec)

| Produk          | Kode Produk | Idpel      |
| :-------------- | :---------- | :--------- |
| PDAM SIDOARJO   | `WASDA`     | `01002676` |
| PDAM BONDOWOSO  | `WABONDO`   | `09000879` |

Tombol pintasan Test IDPEL tersedia di UI (terisi otomatis dari `GET /api/products`).

## Format API Internal (spec point 4)

Semua endpoint mengembalikan envelope `{ "rc": "00", "ket": "sukses", "data": ... }`.

Contoh respon inquiry (WASDA):

```json
{
  "rc": "00",
  "ket": "Inquiry tagihan berhasil didapatkan.",
  "data": {
    "idpel": "01002676",
    "nometer": "01/II/013/0083/6D",
    "alamat": "SEKAWAN SEJUK C.16A",
    "nama": "PERM. BUMI CITRA FAJAR",
    "nominal": 294500,
    "admin": 10806,
    "total_bayar": 305306,
    "jumlah_bulan": "6",
    "data_bill": {
      "blth1": { "air": 40500, "denda": 7500, "nonair": 0, "meter_awal": 0, "meter_akhir": 0, "bulan": "5", "tahun": "2024" },
      "blth2": { "...": "loop sejumlah billquantity dari respon inq/pay" }
    },
    "ref1": "INQ_...",
    "ref2": "28189..."
  }
}
```

## Endpoint API Internal

| Endpoint                                  | Fungsi                                                        |
| :---------------------------------------- | :------------------------------------------------------------ |
| `GET /api/products`                       | Daftar produk + idpel sample                                   |
| `POST /api/inquiry`                       | `{ productCode, customerId }` → data tagihan (format di atas)  |
| `POST /api/payment`                       | `{ productCode, customerId, ref1, ref2, nominal }` → simpan DB + struk |
| `GET /api/transactions?limit=100`         | Riwayat transaksi (max 500)                                    |
| `GET /api/transactions/:id`               | Detail transaksi + teks struk                                  |
| `GET /api/transactions/:id/receipt`       | Unduh struk `.txt` (attachment)                                |

**Proteksi pembayaran ganda:** `POST /api/payment` dengan `ref2` yang sudah tersimpan ditolak dengan `rc "33"` dan mengembalikan transaksi asli — tidak ada request kedua dikirim ke Rajabiller. Ditegakkan dua lapis: pre-check di service + `UNIQUE(ref2)` di MySQL (race-free; lost race tertangkap dari `ER_DUP_ENTRY`).

## Struk (spec point 8)

Tersedia dua layout sesuai contoh: Sidoarjo (rincian bulanan + denda + admin) dan Bondowoso (plus `PEMAKAIAN M3` dan `BEBAN`). Tanggal format `dd-mm-yyyy HH:mm:ss`, nominal pakai pemisah titik (`40.500`), label periode `AGS2014`. Struk dapat dilihat di modal, dicetak, dan diunduh sebagai `.txt`.

## Menjalankan Program

### 1. Prasyarat
- **Node.js**: `>= 22` (Direkomendasikan Node.js v26.x)
- **npm**: `>= 10.x` (Bawaan resmi Node.js)
- **Database**: MySQL 8.x / MariaDB lokal atau cloud (FreeDB, PlanetScale, dsb.)

### 2. Konfigurasi Lingkungan (`.env`)
Salin file konfigurasi contoh:
```bash
cp .env.example .env
```
Sesuaikan nilai konfigurasi di file `.env`:
```ini
PORT=3000
NODE_ENV=development

# Database MySQL / Cloud
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=bimasakti_pdam
DB_TEST_NAME=bimasakti_pdam_test

# Kredensial API Rajabiller Fastpay
RAJABILLER_URL=https://c-dev-partnerlink.rajabiller.com/json/index.php
RAJABILLER_UID=SP300203
RAJABILLER_PIN=311575
```

### 3. Instalasi Dependensi
Gunakan **npm**:
```bash
npm install
```

### 4. Migrasi Database
Jalankan migrasi tabel Drizzle ORM ke database MySQL:
```bash
npm run db:migrate
```
*(Tabel `transactions` dan `__drizzle_migrations` otomatis dibuat).*

### 5. Menjalankan Aplikasi

- **Mode Development (Hot-Reloading):**
  ```bash
  npm run dev
  ```
- **Mode Produksi (Build + Start):**
  ```bash
  npm run build
  npm start
  ```
  *Keterangan Build Pipeline (`scripts/build.mjs`):*
  - Membersihkan direktori `dist/` & `public/`.
  - Otomatis mengeliminasi komentar kode (`decomment`).
  - Mem-bundle client Preact TSX ke `views/js/app.js` & minify CSS.
  - Mem-bundle server TypeScript ESM ke `dist/server.js`.
  - Pre-kompresi multi-tier: **Zstandard (.zst)**, **Brotli (.br)**, dan **Gzip (.gz)**.
- Akses aplikasi di browser: **http://localhost:3000**

### 6. Deployment ke Vercel

Aplikasi siap dideploy langsung ke Vercel:
1. Hubungkan repository GitHub ke Vercel.
2. Di Vercel Project Settings:
   - **Framework Preset**: `Other` (dikelola oleh `vercel.json`)
   - **Build & Output Settings**: Biarkan default / OFF (Build: `npm run build`, Output: `views`)
   - **Environment Variables**: Tambahkan variabel dari `.env` (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `RAJABILLER_*`).
3. Klik **Deploy**.

## Pengujian & Kualitas Kode

```bash
# Menjalankan seluruh test suite E2E (9 integration tests)
npm test

# Pemeriksaan linter (Biome) & TypeScript
npm run lint
npm run typecheck

# Audit dead-code / unneeded dependencies
npx knip
```

## Struktur Folder (Dot-Notation & Clean Architecture)

```text
├── api/
│   └── index.js                    # Vercel Serverless Function entry point
├── views/                          # Static assets & compressed files (.zst, .br, .gz)
├── drizzle/                        # Drizzle SQL migration files
├── scripts/
│   └── build.mjs                   # Esbuild bundling, comment stripper, multi-compression
├── src/
│   ├── server.ts                   # Express server bootstrap (26 lines)
│   ├── config/
│   │   └── constants.ts            # Environment constants & supported products
│   ├── controllers/                # HTTP Controllers (dot-notation)
│   │   ├── inquiry.controller.ts
│   │   ├── payment.controller.ts
│   │   ├── history.controller.ts
│   │   └── error.mapper.ts
│   ├── domain/                     # Domain schemas & entities
│   ├── middleware/                 # Middlewares
│   │   ├── error.middleware.ts     # Global error handler & RC mapper
│   │   └── static.middleware.ts    # Multi-tier compression negotiation (zstd/br/gz)
│   ├── repository/                 # Database access layer
│   │   ├── connection.ts           # MySQL connection pool
│   │   ├── schema.ts               # Drizzle table schemas
│   │   └── transaction.repository.ts
│   ├── routes/
│   │   └── api.routes.ts           # API route declarations
│   ├── services/                   # Business logic & external gateway
│   │   ├── inquiry.service.ts
│   │   ├── payment.service.ts      # Idempotency checks & payment flow
│   │   ├── history.service.ts
│   │   ├── rajabiller.service.ts   # Rajabiller JSON API client
│   │   └── receipt.service.ts      # Plain-text receipt formatting
│   └── views/                      # Preact TSX Frontend
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/             # Reusable UI components
│       └── api/
│           └── pdam.api.ts         # Frontend API fetcher layer
├── test_integration.mjs            # 9 E2E Integration tests
├── vercel.json                     # Vercel configuration
└── package.json
```
