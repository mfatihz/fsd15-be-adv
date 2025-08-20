-- db v2

CREATE DATABASE adv_chill_app;
USE adv_chill_app;

-- tabel: users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password CHAR(60) NOT NULL, -- bcrypt
    token VARCHAR(255) UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE
);

-- tabel: series_film
-- atribut turunan (tidak perlu disimpan sebagai field): jumlah_episode, new 
CREATE TABLE series_film (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipe ENUM('Series', 'Film') NOT NULL,
    judul VARCHAR(255) NOT NULL,
    tanggal_keluar DATE,
    cast TEXT,
    director VARCHAR(255),
    durasi INT,
    top_10 BOOLEAN DEFAULT FALSE,
    rating_isi VARCHAR(50),
    rating_penonton DECIMAL(3,2),
    path_gambar_hero VARCHAR(255),
    path_gambar_landscape VARCHAR(255),
    path_gambar_portrait VARCHAR(255),
    ringkasan TEXT
);

-- tabel: daftar_saya
CREATE TABLE daftar_saya (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_series_film INT NOT NULL,
    UNIQUE KEY (id_user, id_series_film),
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (id_series_film) REFERENCES series_film(id) ON DELETE CASCADE
);

-- -- tabel: memuat (junction-table antara daftar_saya dan series_film)
-- CREATE TABLE memuat (
--     id_daftar_saya INT NOT NULL,
--     id_series_film INT NOT NULL,
--     PRIMARY KEY (id_daftar_saya, id_series_film),
--     FOREIGN KEY (id_daftar_saya) REFERENCES daftar_saya(id) ON DELETE CASCADE,
--     FOREIGN KEY (id_series_film) REFERENCES series_film(id) ON DELETE CASCADE
-- );

-- tabel: genres
CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(50) NOT NULL UNIQUE,
    format_path VARCHAR(50) NOT NULL UNIQUE
);

-- tabel: memiliki_genres (junction-table antara series_film dan genres)
CREATE TABLE memiliki_genres (
    id_series_film INT NOT NULL,
    id_genre INT NOT NULL,
    PRIMARY KEY (id_series_film, id_genre),
    FOREIGN KEY (id_series_film) REFERENCES series_film(id) ON DELETE CASCADE,
    FOREIGN KEY (id_genre) REFERENCES genres(id) ON DELETE CASCADE
);

-- tabel: episode_movie
CREATE TABLE episode_movie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_series_film INT NOT NULL,
    no_episode INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    durasi INT,
    tanggal_keluar DATE,
    tanggal_ditambahkan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    path_gambar_hero VARCHAR(255),
    path_gambar_landscape VARCHAR(255),
    path_gambar_portrait VARCHAR(255),
    path_gambar_thumbnail VARCHAR(255),
    ringkasan TEXT,
    UNIQUE KEY (id_series_film, no_episode),
    FOREIGN KEY (id_series_film) REFERENCES series_film(id) ON DELETE CASCADE
);

-- tabel: paket
CREATE TABLE paket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_paket VARCHAR(50) NOT NULL UNIQUE,
    jumlah_akun VARCHAR(50) NOT NULL,
    biaya_paket DECIMAL(6) NOT NULL,
    keuntungan TEXT
);

-- tabel: pembayaran
CREATE TABLE pembayaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metode_bayar VARCHAR(50) NOT NULL UNIQUE,
    biaya_admin DECIMAL(4) NOT NULL
);

-- tabel: orders
-- atribut turunan (tidak perlu disimpan sebagai field): biaya_total
CREATE TABLE `orders` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    kode_bayar VARCHAR(50) NOT NULL UNIQUE,
    kode_voucher VARCHAR(50),
    id_paket INT NOT NULL,
    id_pembayaran INT NOT NULL,
    tanggal_beli DATETIME NOT NULL,
    tanggal_bayar DATETIME,
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (id_paket) REFERENCES paket(id),
    FOREIGN KEY (id_pembayaran) REFERENCES pembayaran(id)
);