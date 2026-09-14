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

## Menjalankan

1. **Install**: `npm install` (atau `pnpm install`).
2. **Siapkan MySQL** (lokal atau remote), lalu buat database:

   ```sql
   CREATE DATABASE IF NOT EXISTS bimasakti_pdam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Konfigurasi** — copy `.env.example` → `.env` dan sesuaikan:

   ```ini
   PORT=3000
   NODE_ENV=development
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=bimasakti_pdam
   DB_TEST_NAME=bimasakti_pdam_test
   RAJABILLER_URL=https://c-dev-partnerlink.rajabiller.com/json/index.php
   RAJABILLER_UID=SP300203
   RAJABILLER_PIN=311575
   ```

4. **Build + migrasi schema** (`src/views/app.ts` → bundle esbuild, `src/` → `dist/`, schema Drizzle → MySQL):

   ```bash
   npm run build          # bersihkan dist + build client & server
   npm run db:generate    # (sekali per perubahan schema) generate SQL migrasi
   npm run db:migrate     # terapkan migrasi ke DB_NAME (auto-create DB bila belum ada)
   ```

5. **Jalankan**:
   - Produksi: `npm start`
   - Development (hot-reload): `npm run dev`
6. Buka **http://localhost:3000**

## Testing

```bash
npm test
```

Suite E2E (8 test) memakai database MySQL terisolasi `bimasakti_pdam_test` (DB_TEST_NAME, auto-create + migrasi + truncate per run — tidak menyentuh DB aplikasi) dan menguji: produk, validasi inquiry, inquiry WASDA & WABONDO (assert nilai persis sesuai spec), payment + format struk, idempotensi `ref2`, history + guard `limit`, unduh struk + 404.

> Catatan: test memanggil sandbox Rajabiller langsung (sesuai spec point 5). Karena tagihan sandbox WABONDO berstatus "sudah dibayar", test payment menguji jalur `status 33` yang tetap tersimpan & menghasilkan struk, lalu idempotensi memblokir replay-nya.

## Struktur Folder (MVC: model → repository → service → controller → view)

```text
├── views/                          # VIEW (frontend statis): index.html, css, js hasil bundle
├── drizzle/                        # Migrasi SQL hasil drizzle-kit (jangan edit manual)
├── drizzle.config.ts               # Config drizzle-kit (baca ENV DB_*)
├── src/
│   ├── server.ts                   # Entry point Express
│   ├── config/constants.ts         # ENV (PORT, DB_*, RAJABILLER_*) + SUPPORTED_PRODUCTS
│   ├── models/                     # MODEL: entitas & tipe domain (murni, tanpa I/O)
│   │   └── transaction.ts          #   TransactionRecord, InquiryData, DuplicatePaymentError
│   ├── repository/                 # REPOSITORY: satu-satunya lapisan yang menyentuh SQL/DB
│   │   ├── schema.ts               #   Definisi tabel Drizzle (transactions)
│   │   ├── connection.ts           #   Pool MySQL + instance Drizzle
│   │   └── transaction.repository.ts#  CRUD transactions (create/find/findById/findByRef2)
│   ├── scripts/migrate.ts          # Runner migrasi (db:migrate; juga dipakai test)
│   ├── services/                   # SERVICE: use case + business logic (validasi, idempotensi)
│   │   ├── inquiryService.ts       #   Inquiry use case
│   │   ├── paymentService.ts       #   Payment use case (idempotensi ref2 → rc 33)
│   │   ├── historyService.ts       #   History use case (limit clamp 500)
│   │   ├── rajabillerService.ts    #   Client fastpay.inq / fastpay.pay
│   │   └── receiptService.ts       #   Generator struk Sidoarjo & Bondowoso
│   ├── controllers/                # CONTROLLER: adapter HTTP tipis (parse → service → envelope)
│   │   ├── inquiryController.ts
│   │   ├── paymentController.ts
│   │   ├── historyController.ts
│   │   └── errorMapper.ts          #   ApiError.rc → HTTP status
│   ├── routes/api.ts               # Router endpoint internal
│   ├── utils/                      # apiResponse (envelope), terbilang, helpers, apiError
│   └── views/app.ts                # VIEW logic: logika UI (dibundel esbuild → views/js/app.js)
└── test_integration.mjs            # Suite E2E
```

**Arah dependensi (satu arah):** `view → controller → service → repository → model`. Model tidak mengimpor lapisan lain; controller tidak berisi business logic; hanya repository yang menulis SQL.
