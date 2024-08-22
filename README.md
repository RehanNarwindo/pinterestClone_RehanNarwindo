# PinterestClone

PinterestClone adalah aplikasi mobile yang dibangun menggunakan **React Native** dan **Expo** untuk bagian client, serta **Node.js** untuk bagian server. Aplikasi ini menampilkan gambar dalam tata letak grid dinamis seperti Pinterest, dan backend digunakan untuk mengelola data pengguna serta gambar yang ditampilkan.

## Struktur Proyek

Proyek ini dibagi menjadi dua bagian utama: **client** dan **server**.

### Client

Bagian frontend aplikasi yang dibangun menggunakan **React Native** dan dijalankan menggunakan **Expo**.

```plaintext
pinterest_clone/
├── assets/           # Berisi file gambar dan font yang digunakan di aplikasi
├── components/       # Komponen UI reusable seperti grid, card, dll
├── screens/          # Layar-layar utama aplikasi (HomeScreen, ProfileScreen, dll)
├── App.js            # Entry point utama untuk aplikasi React Native
└── app.json          # Konfigurasi proyek Expo
```

### Server

```plaintext
server/
├── config/           # Berisi konfigurasi database dan pengaturan lainnya
├── helpers/          # Berisi helper seperti JWT untuk autentikasi
├── models/           # Berisi model database (schema MongoDB)
├── routes/           # Endpoint API untuk client (autentikasi, pengelolaan gambar, dll)
└── server.js         # Entry point utama untuk server Node.js
```

### Persyaratan

Pastikan Anda telah menginstal:

```plaintext
Node.js (versi minimal v14.x.x atau lebih baru)
Expo CLI: Untuk menjalankan proyek React Native.
MongoDB: Sebagai database yang digunakan di server.
```

### Instalasi

client

```plaintext
1. Clone Repository
Clone repository ini ke komputer Anda:
git clone https://github.com/username/pinterestclone.git
cd pinterestclone/pinterest_clone
npm install
expo start
```

server

```plaintext
cd pinterestclone/server
npm install
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
REDIS_PW=your-redis-key
npm start
Server akan berjalan pada http://localhost:3000 secara default.
```
