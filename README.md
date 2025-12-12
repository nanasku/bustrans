🧩 Alur Sistem Pembayaran Bus

1. Penumpang Naik di Halte A
   
   • Pada aplikasi (misalnya dipakai oleh kondektur atau mesin di bus), ada tombol "Cetak Struk Awal".
   
   • Saat ditekan, sistem akan:
   
        ◦ Menyimpan data lokasi naik (halte A).
   
        ◦ Menghasilkan barcode / QR Code berisi data:
   
            ▪ ID tiket
   
            ▪ Halte awal
   
            ▪ Timestamp naik
   
        ◦ Mencetak / menampilkan struk (berisi QR code tersebut).
   
3. Penumpang Turun di Halte B
   
    • Ketika bus berhenti di halte B, aplikasi mode "scan barcode" digunakan.
   
    • QR code di scan → sistem membaca:
   
        ◦ ID tiket
   
        ◦ Halte awal

5. Perhitungan Tarif

   • Sistem menghitung ongkos berdasarkan rute:
   
        ◦ Halte awal → halte tujuan

   • Tarif bisa berdasarkan:
   
        ◦ Jarak
   
        ◦ Jumlah halte
   
        ◦ Zona tarif

   • Setelah scan, aplikasi menampilkan:
   
        ◦ Halte awal
   
        ◦ Halte tujuan
   
        ◦ Total biaya
   
   
=======================================================


📋 Panduan Instalasi dan Menjalankan Aplikasi Bus Payment System

📂 Struktur Project


🚀 Langkah Instalasi Lengkap


1. Clone Repository

git clone https://github.com/nanasku/bustrans.git
cd bustrans


2. Setup Database MySQL
   
Install MySQL dari https://dev.mysql.com/downloads/installer/

Buka XAMPP atau MySQL Workbench

Buat database baru:


CREATE DATABASE bus_payment;

USE bus_payment;

Import file SQL (jika ada database.sql di folder database):

mysql -u root -p bus_payment < database/bus_payment.sql


3. Konfigurasi Backend (Server)
   
Masuk ke folder server:

cd server

Install dependencies backend:


npm install express cors mysql2

Konfigurasi koneksi database di server/db.js:


const db = mysql.createPool({

    host: "localhost",
    
    user: "root",           // sesuaikan dengan username MySQL
    
    password: "",           // sesuaikan dengan password MySQL
    
    database: "bus_payment"
    
});


Jalankan server backend:

node index.js

Server akan berjalan di http://localhost:5000


4. Konfigurasi Frontend (React)
   
Kembali ke root folder:


cd ..

Install dependencies frontend:


npm install

Jika ada error tentang Node.js versi, set environment variable:


# Windows (Command Prompt)

set NODE_OPTIONS=--openssl-legacy-provider


# Windows (PowerShell)

$env:NODE_OPTIONS = "--openssl-legacy-provider"


# Linux/Mac

export NODE_OPTIONS=--openssl-legacy-provider

Jalankan aplikasi React:


npm start

Aplikasi akan terbuka di http://localhost:3000


📝 Setup Database Manual (Jika tidak ada file SQL)

Buat tabel-tabel di MySQL:


CREATE TABLE stations (

    id INT PRIMARY KEY AUTO_INCREMENT,
    
    code VARCHAR(10) UNIQUE NOT NULL,
    
    name VARCHAR(100) NOT NULL,
    
    lat DECIMAL(10, 8) NOT NULL,
    
    lng DECIMAL(11, 8) NOT NULL
    
);


CREATE TABLE tickets (

    id INT PRIMARY KEY AUTO_INCREMENT,
    
    ticket_code VARCHAR(50) UNIQUE NOT NULL,
    
    start_station VARCHAR(10) NOT NULL,
    
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    end_station VARCHAR(10),
    
    end_time DATETIME,
    
    fare DECIMAL(10, 2),
    
    status ENUM('active', 'completed') DEFAULT 'active',
    
    FOREIGN KEY (start_station) REFERENCES stations(code)
    
);


CREATE TABLE fares (

    id INT PRIMARY KEY AUTO_INCREMENT,
    
    from_station VARCHAR(10) NOT NULL,
    
    to_station VARCHAR(10) NOT NULL,
    
    price DECIMAL(10, 2) NOT NULL,
    
    FOREIGN KEY (from_station) REFERENCES stations(code),
    
    FOREIGN KEY (to_station) REFERENCES stations(code)
    
);


INSERT INTO stations (code, name, lat, lng) VALUES

('SEN', 'Halte Senayan', -6.227, 106.799),

('SUD', 'Halte Sudirman', -6.208, 106.818),

('THA', 'Halte Thamrin', -6.185, 106.823),

('KOT', 'Halte Kota', -6.135, 106.813);


INSERT INTO fares (from_station, to_station, price) VALUES

('SEN', 'SUD', 5000),

('SEN', 'THA', 7000),

('SEN', 'KOT', 10000),

('SUD', 'THA', 4000),

('SUD', 'KOT', 8000),

('THA', 'KOT', 5000);



🔧 Troubleshooting

Masalah Umum dan Solusi:

Error: Cannot find module


# Hapus node_modules dan install ulang

rm -rf node_modules package-lock.json

npm install --legacy-peer-deps

Error: Digital envelope routines::unsupported


# Set environment variable sebelum npm start

set NODE_OPTIONS=--openssl-legacy-provider
npm start

Error: MySQL connection refused


Pastikan MySQL service berjalan

Cek username/password di db.js

Cek apakah database 'bus_payment' sudah dibuat

Peta tidak muncul

Izinkan akses lokasi di browser

Pastikan koneksi internet aktif (untuk load tile map)

Refresh halaman

QR Scanner tidak bekerja

Izinkan akses kamera di browser

Pastikan menggunakan HTTPS atau localhost

Coba browser lain (Chrome biasanya paling kompatibel)


🌐 Akses Aplikasi

Backend API: http://localhost:5000


GET /api/stations - Daftar halte

POST /api/tickets/create - Buat tiket baru

POST /api/tickets/fare - Hitung tarif

Frontend App: http://localhost:3000

Peta dengan tracking lokasi real-time

Generator tiket dengan QR code

Scanner tiket untuk pembayaran


📱 Fitur Aplikasi

✅ Real-time Location Tracking - Deteksi halte terdekat

✅ Ticket Generation - Buat tiket dengan QR code

✅ QR Code Scanner - Scan tiket untuk pembayaran

✅ Fare Calculation - Hitung tarif berdasarkan rute

✅ Responsive Design - Tampilan optimal di semua device


🐛 Reporting Issues

Jika menemukan bug:


Cek console browser (F12) untuk error detail

Cek log server backend

Pastikan semua dependency terinstall

Buat issue di GitHub repository


📄 Lisensi

Project ini menggunakan lisensi MIT. Bebas digunakan, dimodifikasi, dan didistribusikan.


🎯 Catatan Penting:

Pastikan MySQL berjalan sebelum start backend

Izinkan akses lokasi dan kamera saat diminta browser

Untuk production, ganti credentials database dengan yang aman

Update environment variables untuk konfigurasi yang berbeda

Selamat menggunakan Aplikasi Bus Payment System! 🚌💳
