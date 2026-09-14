# Sistem Pembayaran Tagihan PDAM (Sidoarjo & Bondowoso)

Aplikasi Full-Stack Web Gateway Pembayaran Tagihan Air PDAM (PDAM Sidoarjo & PDAM Bondowoso) terintegrasi secara langsung dengan API Rajabiller Fastpay. Dibangun menggunakan **Node.js + Express.js** dengan **TypeScript (ES Modules)**, basis data portabel **SQLite**, serta antarmuka modern **HTML5, Tailwind CSS, dan TypeScript**.

---

## 📋 Daftar Isi
- [Arsitektur & Alur Transaksi](#-arsitektur--alur-transaksi)
- [Tech Stack](#-tech-stack)
- [Struktur Folder](#-struktur-folder)
- [Data Pemetaan Produk & IDPEL Uji Coba](#-data-pemetaan-produk--idpel-uji-coba)
- [Spesifikasi Format Struk](#-spesifikasi-format-struk)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Panduan Instalasi & Menjalankan Program](#-panduan-instalasi--menjalankan-program)
- [Spesifikasi Endpoint API](#-spesifikasi-endpoint-api)
- [Pengujian Otomatis (E2E Test)](#-pengujian-otomatis-e2e-test)

---

## 🏛 Arsitektur & Alur Transaksi

Sistem ini mengimplementasikan alur transaksi 8 tahap sesuai spesifikasi:
1. **Aktor (User)** mengakses halaman antarmuka Inquiry pada Frontend.
2. **Frontend Inquiry** mengirimkan permintaan (request) ke **API Internal**.
3. **API Internal** meneruskan request ke **API Inquiry Rajabiller** (`fastpay.inq`).
4. Setelah inquiry berhasil dan rincian tagihan ditampilkan, Aktor dapat melanjutkan ke **Frontend Payment**.
5. **Frontend Payment** mengirimkan konfirmasi pembayaran ke **API Internal**.
6. **API Internal** memproses transaksi ke **API Payment Rajabiller** (`fastpay.pay`).
7. Setelah pembayaran berhasil, **API Internal** menyimpan data transaksi ke dalam **DB Internal (SQLite)**.
8. Aktor dapat melihat dan mengunduh struk pada menu **Riwayat Transaksi (Transaction History)** yang mengambil data dari **DB Internal**.

---

## 🛠 Tech Stack

- **Backend**: Node.js (v20+) dengan Express.js
  - Bahasa: **TypeScript** (Strict Mode, 0% `any`)
  - Modul: **ECMAScript Modules (ESM)** dengan `import`/`export`
  - Validasi & Penanganan Error terstruktur
- **Frontend**:
  - **HTML5 & Vanilla CSS / Tailwind CSS** (tampilan responsif & modern)
  - **TypeScript** yang dibundel secara otomatis menggunakan `esbuild` ke `public/js/app.js`
  - Font & Ikon: Inter Font, JetBrains Mono (Thermal Struk View), Font Awesome 6
- **Database**:
  - **SQLite** (`node:sqlite` bawaan standar Node.js) - Sangat portabel, zero-configuration, tanpa dependensi kompilasi C++ eksternal.
  - Data tersimpan otomatis di berkas `./data/database.sqlite`.

---

## 📂 Struktur Folder

```text
bimasakti-multi-sinergi/
├── .env                          # Konfigurasi Environment aktif
├── .env.example                  # Template Environment
├── .gitignore                    # Berkas yang diabaikan oleh Git
├── package.json                  # Konfigurasi dependensi dan skrip npm
├── tsconfig.json                 # Konfigurasi TypeScript NodeNext (ESM)
├── README.md                     # Dokumentasi teknis lengkap
├── test_integration.mjs         # Skrip pengujian otomatis E2E
├── data/
│   └── database.sqlite           # Berkas database SQLite internal
├── public/                       # Berkas statis frontend
│   ├── index.html                # Antarmuka SPA (Inquiry, Payment, History, Modal Struk)
│   ├── css/
│   │   └── style.css             # Gaya struk thermal & print stylesheet
│   └── js/
│       └── app.js                # Hasil kompilasi/bundle TypeScript frontend
└── src/
    ├── server.ts                 # Entry point Express Server
    ├── config/
    │   └── constants.ts          # Kredensial Rajabiller, Port, & Mapping Produk
    ├── types/
    │   ├── rajabiller.types.ts   # Tipe & Interface ketat API Rajabiller
    │   └── transaction.types.ts  # Tipe internal transaksi, inquiry, & struk
    ├── database/
    │   ├── connection.ts         # Inisialisasi koneksi SQLite & DDL Skema
    │   └── transactionRepository.ts # Operasi CRUD transaksi berbasis TypeScript
    ├── services/
    │   ├── rajabillerService.ts  # HTTP client ke gateway Rajabiller
    │   ├── receiptService.ts     # Generator format struk Sidoarjo & Bondowoso
    │   └── terbilang.ts          # Konversi angka ke kata nominal rupiah Indonesia
    ├── controllers/
    │   ├── inquiryController.ts  # Handler endpoint POST /api/inquiry
    │   ├── paymentController.ts  # Handler endpoint POST /api/payment
    │   └── historyController.ts  # Handler endpoint GET /api/transactions & struk
    ├── routes/
    │   └── api.ts                # Router Express untuk semua endpoint internal
    └── frontend/
        └── app.ts                # Logika antarmuka TypeScript untuk browser
```

---

## 🎯 Data Pemetaan Produk & IDPEL Uji Coba

| Nama PDAM | Kode Produk | ID Pelanggan (IDPEL) Uji Coba | Catatan |
| :--- | :---: | :---: | :--- |
| **PDAM SIDOARJO** | `WASDA` | `01002676` | Tersedia 6 periode tagihan |
| **PDAM BONDOWOSO** | `WABONDO` | `09000879` | Terdapat rincian Pemakaian (M3) & Beban |

*(Tersedia tombol pintasan "Test IDPEL Cepat" pada antarmuka pengguna untuk pengisian otomatis).*

---

## 🧾 Spesifikasi Format Struk

Aplikasi menghasilkan struk bukti pembayaran yang **persis sama** dengan layout wajib berikut:

### 1. Format PDAM Sidoarjo (`WASDA`):
```text
STRUK PEMBAYARAN PDAM SIDOARJO
TANGGAL : [TANGGAL TRANSAKSI]
NO. RESI : [NO RESI]
NAMA PAM : PDAM SIDOARJO
NO. PELANGGAN : [IDPEL]
NAMA : [NAMA PELANGGAN]
ALAMAT : [ALAMAT]
RINCIAN TAGIHAN
 BULAN 1 : Rp [NOMINAL]
 BULAN 2 : Rp [NOMINAL]
DENDA : Rp [DENDA]
ADMIN : Rp [ADMIN]
 -------------------
TOTAL TAGIHAN : Rp [TOTAL_BAYAR]
TERBILANG : [TERBILANG TOTAL]
PDAM SIDOARJO MENYATAKAN STRUK INI
SEBAGAI BUKTI PEMBAYARAN YANG SAH
```

### 2. Format PDAM Bondowoso (`WABONDO`):
```text
STRUK PEMBAYARAN PDAM BONDOWOSO
TANGGAL : [TANGGAL TRANSAKSI]
NO. RESI : [NO RESI]
NAMA PAM : PDAM BONDOWOSO
NO. PELANGGAN : [IDPEL]
NAMA : [NAMA PELANGGAN]
ALAMAT : [ALAMAT]
PEMAKAIAN : [METER] M3
RINCIAN TAGIHAN
 BULAN 1 : Rp [NOMINAL]
DENDA : Rp [DENDA]
BEBAN : Rp [BEBAN]
ADMIN : Rp [ADMIN]
 --------------------
TOTAL TAGIHAN : Rp [TOTAL_BAYAR]
TERBILANG : [TERBILANG TOTAL]
PDAM BONDOWOSO MENYATAKAN STRUK INI
SEBAGAI BUKTI PEMBAYARAN YANG SAH
```

---

## ⚙️ Persyaratan Sistem

- **Node.js**: Versi `22.x` atau lebih baru (Mendukung ESM dan bawaan `node:sqlite`).
- **NPM** atau **PNPM** package manager.

---

## 🚀 Panduan Instalasi & Menjalankan Program

### 1. Ekstrak Berkas & Buka Terminal
Buka direktori proyek di terminal / Command Prompt:
```bash
cd bimasakti-multi-sinergi
```

### 2. Pasang Dependensi
```bash
npm install
```
*(Atau `pnpm install` jika menggunakan pnpm).*

### 3. Konfigurasi Environment
Berkas `.env` sudah disediakan secara default. Anda dapat menyesuaikannya bila diperlukan:
```ini
PORT=3000
NODE_ENV=development
RAJABILLER_URL=https://c-dev-partnerlink.rajabiller.com/json/index.php
RAJABILLER_UID=SP300203
RAJABILLER_PIN=311575
DATABASE_PATH=./data/database.sqlite
```

### 4. Kompilasi TypeScript (Build)
Jalankan kompilasi TypeScript untuk backend dan frontend:
```bash
npm run build
```
Skrip ini akan:
- Mem-bundle `src/frontend/app.ts` menjadi `public/js/app.js`.
- Mengompilasi seluruh kode backend TypeScript di `src/` menjadi JavaScript ESM di direktori `dist/`.

### 5. Jalankan Server

- **Mode Produksi**:
  ```bash
  npm start
  ```

- **Mode Development (Hot-Reloading)**:
  ```bash
  npm run dev
  ```

Akses antarmuka web melalui browser di:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📡 Spesifikasi Endpoint API Internal

### 1. `GET /api/products`
Mengambil daftar produk PDAM yang didukung dan IDPEL sampel.

### 2. `POST /api/inquiry`
Melakukan inquiry tagihan ke server Rajabiller.
- **Request Body**:
  ```json
  {
    "productCode": "WASDA",
    "customerId": "01002676"
  }
  ```
- **Response Success (200)**:
  Mengembalikan data tagihan ternormalisasi (`customerName`, `bills`, `nominal`, `adminFee`, `totalAmount`, `terbilang`, `ref1`, `ref2`).

### 3. `POST /api/payment`
Mengeksekusi pembayaran tagihan ke server Rajabiller dan menyimpan data ke database.
- **Request Body**:
  ```json
  {
    "productCode": "WASDA",
    "customerId": "01002676",
    "ref1": "INQ_...",
    "ref2": "2818...",
    "nominal": "294500"
  }
  ```
- **Response Success (200)**:
  Mengembalikan rekaman transaksi yang tersimpan di SQLite beserta teks struk tercetak (`receiptText`).

### 4. `GET /api/transactions`
Mengambil seluruh riwayat transaksi yang tersimpan di SQLite.

### 5. `GET /api/transactions/:id`
Mengambil rincian satu transaksi tertentu beserta format struknya.

### 6. `GET /api/transactions/:id/receipt`
Mengunduh struk pembayaran dalam bentuk berkas teks `.txt` (`Content-Disposition: attachment`).

---

## 🧪 Pengujian Otomatis (E2E Test)

Proyek ini telah dilengkapi dengan suite automated integration test (`test_integration.mjs`) yang menguji keseluruhan siklus:
1. Endpoint produk
2. Inquiry PDAM Sidoarjo (`WASDA`)
3. Inquiry PDAM Bondowoso (`WABONDO`)
4. Payment eksekusi
5. Verifikasi format struk (sesuai template)
6. Riwayat transaksi database
7. Unduh struk teks

Jalankan pengujian dengan perintah:
```bash
npm test
```
Hasil seluruh tes akan tampil di terminal dengan status sukses (PASS).
