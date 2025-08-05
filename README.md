# REST API
Mission Back End Advanced

Stack: `express`, `mysql2`, `dotenv`, `bcrypt`

## .env

variabel pada `.env`:
```
PORT=5000

MYSQL_HOST='127.0.0.1'
MYSQL_USER='root'
MYSQL_PASSWORD=''
MYSQL_DATABASE='chill_app'
```

## Database
Untuk membuat database, jalankan script `migration/create-database.sql` dalam MySQL.

(Optional) Untuk mengisikan data dummy ke dalam database, jalankan script berikut dalam MySQL:
- `migration/insert-into-series_film.sql`
- `migration/insert-into-episode_movie.sql`
- `migration/insert-into-genres.sql`

Contoh dummy data lainnya untuk `POST` atau `UPDATE` dapat dilihat pada folder `migration/data/`

## Fitur
Skill set:
- Authentication (Login atau Register)
- REST API dengan query params (filter, sort, search)
- Send & Validasi Email
- Upload image & File

## Task
1. Menambahkan entitas `User`
- [x] Atribut entitas `User`: `Fullname`, `Username`, `Password`, `email`, `token`
- [x] Buat tabel pada database

2. Implementasi Register
- [x] Buat service/controller untuk menerima data User baru menggunakan perintah `INSERT`
- [x] Enskripsi password menggunakan `bcrypt`
- [ ] buat endpoint untuk pendaftaran pengguna. Pastikan payload sesuai dengan data yang diperlukan pada `User`

3. Implementasi Login
- [ ] Install `jsonwebtoken`
- [ ] Buat service/controller untuk proses login
- [ ] Periksa keberadaan User berdasarkan email. Jika email tidak ditemukan, beri response dengan status kode yang sesuai serta beritahu pengguna.
- [ ] Jika pengguna ditemukan, periksa password dengan fungsi `compare` dari libabry bcrypt. Jika password tidak cocok, beri response dengan status kode yang sesuai serta beritahu pengguna.
- [ ] Jika password sesuai, buat password `jsonwebtoken` dan beri respons berhasil dan sampaikan token kepada pengguna.

4. Implementasi Middleware
- [ ] Buat service auth untuk memeriksa token saat ada permintaan dari endpoint. Periksa apakah token ada di header menggunakan `req.headers.authorization`
- [ ] Validasi token dengan menggunakan `jwt.verify` dan `secretkey` yang sama dengan login. Jika token tidak valid, beri respons yang sesuai dan beri tahu pengguna. Jika token valid, biarkan permintaan berlanjut dengan menggunakan `next()`.
- [ ] Sambungkan service middleware ke dalam route yang membutuhkan autentikasi. Mis:
        ```router.get('/movies', authMiddleware.verifyToken, moviecontroller.getList);```

5. Implementasi Query Params: filter, sort, & search
Modifikasi `GET all DATA` agar dapat melakukan get DATA sesuai filter, search, dan view sesuai urutan yang diminta
- [ ] Filtering: dapatkan query parameter melalui `req.query`. Gunakan pada `WHERE`.
- [ ] Sorting: dapatkan query parameter. Gunakan pada `ORDER BY`.
- [ ] Search: dapatkan query parameter. Gunakan pada `WHERE ... LIKE ...`

6. Implementasi Send Email
untuk verifikasi akun saat registrasi
nodemailer
- [ ] 1. Install library `nodemailer`
- [ ] 2. Install library `uuid`
- [ ] 3. Tambahkan `token` field di User table
- [ ] 4. Modifikasi service `Register` untuk menghasilkan token
- [ ] 5. `INSERT` token ke dalam User table
- [ ] 6. Buat function `sendmail` via nodemail
- [ ] 7. Buat service endpoint `verifikasi-email` dengan mengirimkan parameter token. Cari token dalam database. Jika tidak ditemukan, beri response `Invalid Verification Token`
- [ ] 8. Jika berhasil beri response `Email Verified Successfully`

7. Implementasi Upload Image
Multer
- [ ] 1. Install `multer`
- [ ] 2. Buat folder `upload` di root app
- [ ] 3. Buat service untuk menangani multer 
- [ ] 4. Buat route dengan endpoin `/upload` 