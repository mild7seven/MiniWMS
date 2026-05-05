# WMS ERP Agile - PT Agri Wangi Indonesia

Aplikasi **Warehouse Management System (WMS)** berbasis *Progressive Web App* (PWA) yang dirancang khusus untuk mengelola alur kerja *Raw Material* (RM) dan *Packaging Material* (PM). Sistem ini mengadopsi antarmuka bergaya SAP Fiori untuk efisiensi operasional tinggi.

## 🚀 Fitur Utama

- **Hybrid Persistence:** Bekerja secara *Offline* menggunakan LocalStorage dan siap disinkronkan ke Cloud SQL.
- **Multi-Role Authority:** - `SU (Super User)`: Akses penuh termasuk konfigurasi Master Data & MSDN.
  - `ADM (Admin)`: Akses terbatas hanya untuk operasional harian (Inbound/Outbound).
- **Master Data & MSDN:** Pendataan spesifikasi material lengkap mencakup:
  - Sertifikasi Halal
  - Status Allergen
  - Produsen Asal & Distributor
- **Advanced Logistics:**
  - **Batch Generation:** Kode unik otomatis per kedatangan barang.
  - **Strict FEFO:** Sistem memblokir pengiriman jika material tertua belum digunakan.
  - **Traceability:** Pelacakan material dari kedatangan (GR) hingga pemakaian (GI).
- **Bluetooth Printing:** Integrasi langsung dengan printer thermal portable via Web Bluetooth API.
- **Daily Reporting:** Fitur tutup shift otomatis yang mengirimkan ringkasan stok via email.

## 🛠️ Teknologi yang Digunakan

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla ES6)
- **Framework UI:** Bootstrap 5.3 + Bootstrap Icons
- **PWA Engine:** Service Workers, Web Manifest
- **Storage:** LocalStorage (Offline Mode)

## 📋 Data Login Pengujian (Dummy)

| Role | Username | Password |
| :--- | :--- | :--- |
| **Super User** | `dimas` | `su2026` |
| **Admin** | `stafrm` | `staf123` |

## 📦 Cara Instalasi

1. Clone repositori ini:
   ```bash
   git clone [https://github.com/username/nama-repo.git](https://github.com/username/nama-repo.git)
