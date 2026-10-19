/* =====================================================================
   KAMPÜS EĞİTMEN – VERİ DOSYASI
   >>> Yeni eğitmen eklemek veya bilgi değiştirmek için SADECE bu dosyayı düzenle. <<<

   YENİ EĞİTMEN EKLEMEK:
   1) Aşağıdaki eğitmenlerden birinin { ... }, bloğunun tamamını kopyala.
   2) Kendi ilinin bölümüne yapıştır (sondaki virgülü unutma).
   3) Alanları değiştir. "id" her eğitmende FARKLI olmalı: küçük harf, boşluk yok,
      Türkçe karakter yok (örn. "ahmet-yilmaz"). Profil adresi bu id'den oluşur.

   FOTOĞRAF: "foto" alanına bir internet adresi yazabilirsin ya da fotoğrafı
   GitHub'da "img" klasörüne yükleyip "img/ahmet.jpg" yazabilirsin.
   Boş bırakırsan (foto: "") isim baş harfleri görünür.

   EĞİTMEN SİLMEK: ilgili { ... }, bloğunu tamamen sil.
   NOT: Aşağıdaki isimler, dereceler ve bilgiler ÖRNEKTİR; gerçek verilerinle değiştir.
   ===================================================================== */

// WhatsApp numarası: başında + ve boşluk olmadan, ülke koduyla (örn. 905551234567)
const WHATSAPP_NUMBER = "905527971888";
const CONTACT_EMAIL = "v.canaydin52@gmail.com";
const INSTAGRAM_URL = "https://www.instagram.com/cnaydinvs/";

// Aktif pilot iller (eğitmenlerdeki "il" alanı bunlardan biriyle birebir aynı yazılmalı)
const ILLER = ["İstanbul", "Ankara", "İzmir", "Bursa", "Eskişehir", "Antalya"];

const TUTORS = [

  // ---------------------- İSTANBUL ----------------------
  {
    id: "mert-aksoy",
    ad: "Mert Aksoy",
    il: "İstanbul",
    foto: "https://randomuser.me/api/portraits/men/32.jpg",
    universite: "İstanbul Teknik Üniversitesi",
    bolum: "Bilgisayar Mühendisliği",
    derece: "YKS Sayısal İlk 3.000",
    dersler: ["Python", "Algoritmalar", "Veri Yapıları"],
    ucret: 500,
    lokasyon: ["Kadıköy", "Beşiktaş", "Online"],
    saatler: "Hafta içi 18:00–22:00, hafta sonu esnek",
    hakkinda: "Mert Aksoy, İstanbul Teknik Üniversitesi Bilgisayar Mühendisliği bölümünde. Python, Algoritmalar ve Veri Yapıları konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },
  {
    id: "zeynep-karaca",
    ad: "Zeynep Karaca",
    il: "İstanbul",
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
    universite: "Boğaziçi Üniversitesi",
    bolum: "İngiliz Dili ve Edebiyatı",
    derece: "YDS 95 / IELTS 8.0",
    dersler: ["IELTS", "Konuşma Pratiği", "Akademik Yazım"],
    ucret: 600,
    lokasyon: ["Beşiktaş", "Üsküdar", "Online"],
    saatler: "Hafta içi 17:00–21:00, Cumartesi tüm gün",
    hakkinda: "Zeynep Karaca, Boğaziçi Üniversitesi İngiliz Dili ve Edebiyatı bölümünde. IELTS, Konuşma Pratiği ve Akademik Yazım konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },
  {
    id: "emre-dogan",
    ad: "Emre Doğan",
    il: "İstanbul",
    foto: "https://randomuser.me/api/portraits/men/75.jpg",
    universite: "Marmara Üniversitesi",
    bolum: "İktisat",
    derece: "YKS Eşit Ağırlık İlk 5.000",
    dersler: ["Mikroekonomi", "İstatistik", "Excel"],
    ucret: 400,
    lokasyon: ["Üsküdar", "Şişli", "Online"],
    saatler: "Hafta sonu 10:00–20:00, hafta içi akşamlar",
    hakkinda: "Emre Doğan, Marmara Üniversitesi İktisat bölümünde. Mikroekonomi, İstatistik ve Excel konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },

  // ---------------------- ANKARA ----------------------
  {
    id: "elif-yildiz",
    ad: "Elif Yıldız",
    il: "Ankara",
    foto: "https://randomuser.me/api/portraits/women/68.jpg",
    universite: "ODTÜ",
    bolum: "Matematik",
    derece: "YKS Sayısal İlk 1.000",
    dersler: ["TYT/AYT Matematik", "Kalkülüs", "Lineer Cebir"],
    ucret: 450,
    lokasyon: ["Çankaya", "Yenimahalle", "Online"],
    saatler: "Hafta içi 18:00–22:00, hafta sonu esnek",
    hakkinda: "Elif Yıldız, ODTÜ Matematik bölümünde. TYT/AYT Matematik, Kalkülüs ve Lineer Cebir konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },
  {
    id: "burak-sen",
    ad: "Burak Şen",
    il: "Ankara",
    foto: "https://randomuser.me/api/portraits/men/22.jpg",
    universite: "Bilkent Üniversitesi",
    bolum: "Elektrik-Elektronik Müh.",
    derece: "YKS Sayısal İlk 2.500",
    dersler: ["Fizik", "Devre Analizi", "MATLAB"],
    ucret: 500,
    lokasyon: ["Yenimahalle", "Kızılay", "Online"],
    saatler: "Hafta içi 17:00–21:00, Cumartesi tüm gün",
    hakkinda: "Burak Şen, Bilkent Üniversitesi Elektrik-Elektronik Müh. bölümünde. Fizik, Devre Analizi ve MATLAB konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },
  {
    id: "selin-aydin",
    ad: "Selin Aydın",
    il: "Ankara",
    foto: "https://randomuser.me/api/portraits/women/12.jpg",
    universite: "Hacettepe Üniversitesi",
    bolum: "Tıp Fakültesi",
    derece: "YKS Sayısal İlk 2.000",
    dersler: ["Biyoloji", "Kimya", "TUS Hazırlık"],
    ucret: 450,
    lokasyon: ["Kızılay", "Bilkent", "Online"],
    saatler: "Hafta sonu 10:00–20:00, hafta içi akşamlar",
    hakkinda: "Selin Aydın, Hacettepe Üniversitesi Tıp Fakültesi bölümünde. Biyoloji, Kimya ve TUS Hazırlık konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },

  // ---------------------- İZMIR ----------------------
  {
    id: "can-ozkan",
    ad: "Can Özkan",
    il: "İzmir",
    foto: "https://randomuser.me/api/portraits/men/52.jpg",
    universite: "Dokuz Eylül Üniversitesi",
    bolum: "Makine Mühendisliği",
    derece: "YKS Sayısal İlk 8.000",
    dersler: ["Statik", "Termodinamik", "AutoCAD"],
    ucret: 400,
    lokasyon: ["Karşıyaka", "Bornova", "Online"],
    saatler: "Hafta içi 18:00–22:00, hafta sonu esnek",
    hakkinda: "Can Özkan, Dokuz Eylül Üniversitesi Makine Mühendisliği bölümünde. Statik, Termodinamik ve AutoCAD konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },
  {
    id: "deniz-kaya",
    ad: "Deniz Kaya",
    il: "İzmir",
    foto: "https://randomuser.me/api/portraits/women/26.jpg",
    universite: "Ege Üniversitesi",
    bolum: "Psikoloji",
    derece: "YKS Eşit Ağırlık İlk 6.000",
    dersler: ["Psikolojiye Giriş", "SPSS", "Araştırma Yöntemleri"],
    ucret: 350,
    lokasyon: ["Bornova", "Alsancak", "Online"],
    saatler: "Hafta içi 17:00–21:00, Cumartesi tüm gün",
    hakkinda: "Deniz Kaya, Ege Üniversitesi Psikoloji bölümünde. Psikolojiye Giriş, SPSS ve Araştırma Yöntemleri konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },
  {
    id: "oguz-tekin",
    ad: "Oğuz Tekin",
    il: "İzmir",
    foto: "https://randomuser.me/api/portraits/men/61.jpg",
    universite: "İzmir Yüksek Teknoloji Enstitüsü",
    bolum: "Kimya",
    derece: "YKS Sayısal İlk 7.000",
    dersler: ["Genel Kimya", "Organik Kimya", "Lab Raporu"],
    ucret: 400,
    lokasyon: ["Alsancak", "Konak", "Online"],
    saatler: "Hafta sonu 10:00–20:00, hafta içi akşamlar",
    hakkinda: "Oğuz Tekin, İzmir Yüksek Teknoloji Enstitüsü Kimya bölümünde. Genel Kimya, Organik Kimya ve Lab Raporu konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },

  // ---------------------- BURSA ----------------------
  {
    id: "yusuf-er",
    ad: "Yusuf Er",
    il: "Bursa",
    foto: "https://randomuser.me/api/portraits/men/41.jpg",
    universite: "Uludağ Üniversitesi",
    bolum: "Endüstri Mühendisliği",
    derece: "YKS Sayısal İlk 9.000",
    dersler: ["Yöneylem", "Olasılık", "Matematik"],
    ucret: 350,
    lokasyon: ["Nilüfer", "Osmangazi", "Online"],
    saatler: "Hafta içi 18:00–22:00, hafta sonu esnek",
    hakkinda: "Yusuf Er, Uludağ Üniversitesi Endüstri Mühendisliği bölümünde. Yöneylem, Olasılık ve Matematik konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },
  {
    id: "merve-aslan",
    ad: "Merve Aslan",
    il: "Bursa",
    foto: "https://randomuser.me/api/portraits/women/55.jpg",
    universite: "Bursa Teknik Üniversitesi",
    bolum: "Yazılım Mühendisliği",
    derece: "YKS Sayısal İlk 6.000",
    dersler: ["Web Geliştirme", "JavaScript", "Java"],
    ucret: 400,
    lokasyon: ["Osmangazi", "Yıldırım", "Online"],
    saatler: "Hafta içi 17:00–21:00, Cumartesi tüm gün",
    hakkinda: "Merve Aslan, Bursa Teknik Üniversitesi Yazılım Mühendisliği bölümünde. Web Geliştirme, JavaScript ve Java konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },
  {
    id: "tuna-erdem",
    ad: "Tuna Erdem",
    il: "Bursa",
    foto: "https://randomuser.me/api/portraits/men/8.jpg",
    universite: "Uludağ Üniversitesi",
    bolum: "Türk Dili ve Edebiyatı",
    derece: "YKS Türkçe-Edebiyat İlk 3.000",
    dersler: ["TYT Türkçe", "Paragraf", "Edebiyat"],
    ucret: 300,
    lokasyon: ["Yıldırım", "Nilüfer", "Online"],
    saatler: "Hafta sonu 10:00–20:00, hafta içi akşamlar",
    hakkinda: "Tuna Erdem, Uludağ Üniversitesi Türk Dili ve Edebiyatı bölümünde. TYT Türkçe, Paragraf ve Edebiyat konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },

  // ---------------------- ESKIŞEHIR ----------------------
  {
    id: "ayse-nur-celik",
    ad: "Ayşe Nur Çelik",
    il: "Eskişehir",
    foto: "https://randomuser.me/api/portraits/women/33.jpg",
    universite: "Anadolu Üniversitesi",
    bolum: "İşletme",
    derece: "YKS Eşit Ağırlık İlk 9.000",
    dersler: ["Muhasebe", "Finansal Yönetim", "Pazarlama"],
    ucret: 300,
    lokasyon: ["Odunpazarı", "Tepebaşı", "Online"],
    saatler: "Hafta içi 18:00–22:00, hafta sonu esnek",
    hakkinda: "Ayşe Nur Çelik, Anadolu Üniversitesi İşletme bölümünde. Muhasebe, Finansal Yönetim ve Pazarlama konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },
  {
    id: "kerem-basaran",
    ad: "Kerem Başaran",
    il: "Eskişehir",
    foto: "https://randomuser.me/api/portraits/men/18.jpg",
    universite: "Eskişehir Teknik Üniversitesi",
    bolum: "Uçak Mühendisliği",
    derece: "YKS Sayısal İlk 4.000",
    dersler: ["Fizik", "Matematik", "Dinamik"],
    ucret: 350,
    lokasyon: ["Tepebaşı", "Bahçelievler", "Online"],
    saatler: "Hafta içi 17:00–21:00, Cumartesi tüm gün",
    hakkinda: "Kerem Başaran, Eskişehir Teknik Üniversitesi Uçak Mühendisliği bölümünde. Fizik, Matematik ve Dinamik konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },
  {
    id: "sude-polat",
    ad: "Sude Polat",
    il: "Eskişehir",
    foto: "https://randomuser.me/api/portraits/women/90.jpg",
    universite: "Eskişehir Osmangazi Üniversitesi",
    bolum: "Eczacılık",
    derece: "YKS Sayısal İlk 5.000",
    dersler: ["Kimya", "Biyokimya", "Farmakoloji"],
    ucret: 350,
    lokasyon: ["Bahçelievler", "Odunpazarı", "Online"],
    saatler: "Hafta sonu 10:00–20:00, hafta içi akşamlar",
    hakkinda: "Sude Polat, Eskişehir Osmangazi Üniversitesi Eczacılık bölümünde. Kimya, Biyokimya ve Farmakoloji konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },

  // ---------------------- ANTALYA ----------------------
  {
    id: "naz-yalcin",
    ad: "Naz Yalçın",
    il: "Antalya",
    foto: "https://randomuser.me/api/portraits/women/79.jpg",
    universite: "Akdeniz Üniversitesi",
    bolum: "Mimarlık",
    derece: "YKS Sayısal İlk 8.500",
    dersler: ["Mimari Proje", "Çizim", "Portfolyo Hazırlığı"],
    ucret: 400,
    lokasyon: ["Muratpaşa", "Konyaaltı", "Online"],
    saatler: "Hafta içi 18:00–22:00, hafta sonu esnek",
    hakkinda: "Naz Yalçın, Akdeniz Üniversitesi Mimarlık bölümünde. Mimari Proje, Çizim ve Portfolyo Hazırlığı konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },
  {
    id: "baris-kilic",
    ad: "Barış Kılıç",
    il: "Antalya",
    foto: "https://randomuser.me/api/portraits/men/14.jpg",
    universite: "Akdeniz Üniversitesi",
    bolum: "Fizik",
    derece: "YKS Sayısal İlk 5.500",
    dersler: ["Fizik", "TYT/AYT Fizik", "Mekanik"],
    ucret: 350,
    lokasyon: ["Konyaaltı", "Kepez", "Online"],
    saatler: "Hafta içi 17:00–21:00, Cumartesi tüm gün",
    hakkinda: "Barış Kılıç, Akdeniz Üniversitesi Fizik bölümünde. Fizik, TYT/AYT Fizik ve Mekanik konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },
  {
    id: "ece-tunc",
    ad: "Ece Tunç",
    il: "Antalya",
    foto: "https://randomuser.me/api/portraits/women/5.jpg",
    universite: "Antalya Bilim Üniversitesi",
    bolum: "Hukuk",
    derece: "YKS Eşit Ağırlık İlk 4.500",
    dersler: ["Anayasa Hukuku", "Medeni Hukuk", "Hukuk Yazımı"],
    ucret: 450,
    lokasyon: ["Kepez", "Muratpaşa", "Online"],
    saatler: "Hafta sonu 10:00–20:00, hafta içi akşamlar",
    hakkinda: "Ece Tunç, Antalya Bilim Üniversitesi Hukuk bölümünde. Anayasa Hukuku, Medeni Hukuk ve Hukuk Yazımı konularında birebir, sade anlatımla çalışıyor; ders planı öğrencinin seviyesine göre hazırlanır."
  },
];
