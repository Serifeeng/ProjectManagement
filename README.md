# 👾 TaskFlow — Retro Cozy Pixel Art Task Management App

TaskFlow, retro arcade oyunlarından ilham alan **Cozy Pixel Art UI** temasıyla tasarlanmış, full-stack (MERN stack) bir görev ve proje yönetim uygulamasıdır. Klasik, sıkıcı kurumsal tasarımlardan uzak, pikselli ızgara arka planı, 8-bit yazı tipleri ve neon renk paleti ile eğlenceli ve samimi bir çalışma ortamı sunar.

---

## 📸 Ekran Görüntüleri & Tasarım Detayları

* **Renk Paleti:** Cozy Mor (`#9867c5`), Retro Koyu Mor (`#2d1050`), Canlı Sarı (`#f7d358`) ve Neon Başarı/Hata renkleri.
* **Tipografi:** Başlıklar ve butonlar için 8-bit tarzdaki **`Press Start 2P`**, içerikler için **`VT323`** yazı tipleri kullanılmıştır.
* **Görsel Stil:** Yuvarlatılmamış keskin pikselli kenarlar (`border-radius: 0px`), kalın gölgeler (`pixel-shadow`) ve retro pikselli dolgulara sahip ilerleme çubukları (stripes progress-bar).

---

## 🚀 Özellikler

### 🛡️ Admin Paneli
* **Kullanıcı Yönetimi (Userlist Management):** 
  * Kullanıcı adı, isim, e-posta ve yetki (IsAdmin) bilgilerini içeren retro tablo görünümü.
  * Gerçek zamanlı arama filtresi (username, name ya da email'e göre).
  * Yeni kullanıcı ekleme ve düzenleme modalları.
  * Özel pikselli silme onay modali ("Are you sure you want to delete...?").
* **Proje Yönetimi (Project Management):**
  * Proje listeleme tablosu ve detaylar butonu.
  * Proje ekleme modali (Proje adı ve başlangıç üyeleri atama).
  * Proje düzenleme ekranında projeye atanan üyeleri ekleme/çıkarma tablosu.
* **Özet (Summary) Yönetimi:**
  * Her projenin içindeki görevleri (Summary) listeleme (ID, Kullanıcı, Özet, Açıklama, Durum, Başlangıç Tarihi, Bitiş Tarihi).
  * Görev ekleme ve düzenleme modalları (Tüm tarih ve kullanıcı atamaları ile).

### 🕹️ Kullanıcı Arayüzü (User Dashboard)
* **Kişisel Gösterge Paneli:** Atanan projelerin sayısı, görevler, tamamlanan ve bekleyen görevlerin pikselli sayaç kartları.
* **Proje Takibi:** Kullanıcının dahil olduğu projeler ve ilerleme çubukları ile kendi görevlerinin listesi.
* **Özet Listesi (Summarylist):** Projeye ait tüm görevleri retro tablo formatında görüntüleme.
* **Görev Detay & Durum Güncelleme:**
  * Kullanıcı kendi görevinin detayına tıkladığında açılan iki bölümlü (Split) özel modal.
  * Görevin sahibi olan kullanıcı durumu (Pending, In Progress, Completed) anlık güncelleyebilir; görevin sahibi olmayan diğer kullanıcılar ise sadece detayları okuyabilir.

### ⚙️ Genel Sistem Özellikleri
* **Esnek Giriş Sistemi:** Kullanıcılar hem **kullanıcı adı** (`username`) hem de **e-posta** (`email`) adresleriyle şifrelerini girerek giriş yapabilirler.
* **🔔 Toast Bildirim Sistemi:** Tarayıcının klasik `alert()` pencereleri yerine sağ alt köşede beliren retro animasyonlu Toast bildirimleri (`Success`, `Error`, `Warning`, `Info`).
* **👤 Profil Sayfası:** Kullanıcıların kendi görünen isimlerini güncelleyebileceği ve şifrelerini değiştirebileceği profil yönetim alanı.
* **🔄 401 Otomatik Çıkış Güvenliği:** Token süresi dolduğunda veya geçersiz olduğunda axios interceptor algılayarak otomatik olarak oturumu kapatır ve giriş sayfasına yönlendirir.
* **🗺️ 404 Sayfası:** Olmayan sayfalara girildiğinde retro pikselli "Page Not Found" hata ekranı.

---

## 🛠️ Teknolojiler

* **Frontend:** ReactJS, Vite, Vanilla CSS (retro pixel art rules)
* **Backend:** Node.js, Express.js, JSON Web Token (JWT)
* **Veritabanı:** MongoDB (Mongoose)

---

## 📦 Kurulum ve Çalıştırma

### Gereksinimler
* Node.js (v16+)
* Yerel veya Bulut MongoDB Veritabanı

### 1. Depoyu Klonlayın
```bash
git clone <depo_adresi>
cd task-manager
```

### 2. Backend Kurulumu
1. `backend` klasörüne geçin ve bağımlılıkları yükleyin:
   ```bash
   cd backend
   npm install
   ```
2. `.env` dosyası oluşturun ve şu değişkenleri tanımlayın:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=supersecretpixelkey
   ```
3. Veritabanını admin kullanıcısı ile başlatmak için seed betiğini çalıştırın:
   ```bash
   node seed.js
   ```
4. Sunucuyu başlatın:
   ```bash
   npm run dev
   ```

### 3. Frontend Kurulumu
1. `frontend` klasörüne geçin ve bağımlılıkları yükleyin:
   ```bash
   cd ../frontend
   npm install
   ```
2. Uygulamayı geliştirme modunda çalıştırın:
   ```bash
   npm run dev
   ```
3. Tarayıcınızdan `http://localhost:5173` adresine giderek TaskFlow evrenine giriş yapın!

---

## 🔑 Varsayılan Giriş Bilgileri

* **Admin Kullanıcı Adı:** `admin` (veya `admin@taskflow.com`)
* **Admin Şifre:** `admin123`
