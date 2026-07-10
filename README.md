# 🗡️ QuestArchive

**Curate Your Collection. Build Your Ultimate Game Archive. Rate the digital worlds.**

QuestArchive adalah platform ensiklopedia video game interaktif, perpustakaan digital, dan arena penilaian game berbasis komunitas. Didukung oleh **RAWG Video Games Database API** untuk data game global dan **Supabase (PostgreSQL)** untuk penyimpanan rating komunitas secara real-time.

Aplikasi ini dibangun menggunakan **Next.js (App Router)** dengan desain antarmuka gelap yang premium, animasi halus, dan kursor interaktif yang dinamis.

---

## ✨ Fitur Utama

### 1. 📖 Ensensiklopedia Game Dinamis
Jelajahi ribuan judul game dari database RAWG secara dinamis. Dilengkapi dengan fitur pencarian cepat, detail informasi developer, penerbit (publisher), tanggal rilis, platform, deskripsi lengkap, hingga batas usia game (ESRB rating).

### 2. 🏟️ Rate Arena (Community Hub)
Pusat interaksi komunitas gamer untuk menyuarakan pendapat mereka:
* **Penilaian 5 Aspek:** User dapat menilai game secara mendalam berdasarkan aspek *Gameplay*, *Visual/Graphics*, *Story/Lore*, *Audio/Sfx*, dan *Optimization/Performance*.
* **Formulir Interaktif:** Modal pengisian rating yang modern dilengkapi selektor bintang interaktif, penguncian scroll latar belakang (*scroll lock*), dan pengaman *scroll-bleed* menggunakan Lenis.
* **Aktivitas Terbaru (Recent Activity):** Menampilkan feed ulasan terbaru secara real-time langsung dari database Supabase.

### 3. 🏆 Global Leaderboard (Hall of Fame)
Papan klasemen game terbaik sepanjang masa yang diurutkan secara dinamis berdasarkan:
* **Metacritic Score:** Penilaian kritikus profesional industri game global.
* **Users Rating:** Penilaian rata-rata dari jutaan gamer dunia.
* Desain visual podium premium dengan efek border menyala (*glowing*) untuk peringkat 3 teratas.

### 4. 💎 Premium UI/UX & Micro-Animations
* **Smooth Scrolling:** Menggunakan **Lenis Scroll** untuk transisi gulir halaman yang sangat halus.
* **Custom Cursor:** Kursor khusus yang mengikuti pergerakan mouse dengan efek *trailing ring* interaktif.
* **Border Glow Effect:** Efek border gradien menyala dinamis yang mengikuti koordinat kursor mouse.
* **Interactive Toast Feedback:** Menggunakan **Sonner** untuk menampilkan notifikasi melayang yang interaktif saat mengirim ulasan atau terjadi error, menggantikan popup browser bawaan.

---

## 💻 Tech Stack

* **Frontend:** Next.js 14+ (App Router), React 18, TypeScript **Sonner (Toast Notification)**.
* **Styling:** Tailwind CSS, FontAwesome Icons.
* **Database & Backend:** Supabase (PostgreSQL), Next.js API/Client Services.
* **Smooth Scroll:** Lenis.
* **Data Source:** RAWG Video Games API.

---

## 🗄️ Skema Database (Supabase PostgreSQL)

Tabel `ratings` digunakan untuk menyimpan ulasan dari komunitas. Berikut adalah struktur kolomnya:

```sql
create table ratings (
  id uuid default gen_random_uuid() primary key,
  game_id integer not null,
  game_title text not null,
  game_image text,
  rating_gameplay integer check (rating_gameplay >= 1 and rating_gameplay <= 5) not null,
  rating_visual integer check (rating_visual >= 1 and rating_visual <= 5) not null,
  rating_story integer check (rating_story >= 1 and rating_story <= 5) not null,
  rating_audio integer check (rating_audio >= 1 and rating_audio <= 5) not null,
  rating_optimal integer check (rating_optimal >= 1 and rating_optimal <= 5) not null,
  username text not null,
  comment text,
  create_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

## 🚀 Setup & Instalasi Lokal

### 1. Clone Project
Masuk ke direktori project:
```bash
git clone <repository-url>
cd quest-archive
```

### 2. Instalasi Dependency
Instal library yang diperlukan:
```bash
npm install
```

### 3. Setup Environment Variables
Buat file baru bernama `.env.local` di root folder project, lalu isi dengan kredensial dari dashboard Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Setup Database di Supabase
1. Masuk ke dashboard project Supabase.
2. Buka **SQL Editor**.
3. Jalankan query pembuatan tabel `ratings` beserta kebijakan **RLS (Row Level Security)** seperti yang tertera pada bagian [Skema Database](#-skema-database-supabase-postgresql) di atas.
4. Buat policy agar client dapat membaca dan menulis ulasan:
   ```sql
   alter table ratings enable row level security;

   create policy "Allow public read access" on ratings for select using (true);
   create policy "Allow public insert access" on ratings for insert with check (true);
   ```

### 5. Jalankan Aplikasi
Jalankan server lokal untuk mulai menggunakan aplikasi:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🔒 Lisensi
Project ini dibuat untuk keperluan pengembangan portofolio dan edukasi. Hak cipta data game sepenuhnya dimiliki oleh penyedia data **RAWG API**.