/* Kampüs Eğitmen – il seçimi, eğitmen kartları ve WhatsApp yönlendirmesi */

// 1) KENDİ NUMARANLA DEĞİŞTİR: başında + ve boşluk olmadan, ülke koduyla (örn. 905551234567)
const WHATSAPP_NUMBER = "905527971888";

// 2) Örnek eğitmen verisi (görseller randomuser.me'den örnek amaçlıdır)
// Alanlar: ad, cinsiyet (men/women), foto no, üniversite, bölüm, uzmanlık[], saatlik ücret (₺)
const TUTORS = {
  "İstanbul": [
    ["Mert Aksoy", "men", 32, "İstanbul Teknik Üniversitesi", "Bilgisayar Mühendisliği", ["Python", "Algoritmalar", "Veri Yapıları"], 500],
    ["Zeynep Karaca", "women", 44, "Boğaziçi Üniversitesi", "İngiliz Dili ve Edebiyatı", ["IELTS", "Konuşma Pratiği", "Akademik Yazım"], 600],
    ["Emre Doğan", "men", 75, "Marmara Üniversitesi", "İktisat", ["Mikroekonomi", "İstatistik", "Excel"], 400]
  ],
  "Ankara": [
    ["Elif Yıldız", "women", 68, "ODTÜ", "Matematik", ["TYT/AYT Matematik", "Kalkülüs", "Lineer Cebir"], 450],
    ["Burak Şen", "men", 22, "Bilkent Üniversitesi", "Elektrik-Elektronik Müh.", ["Fizik", "Devre Analizi", "MATLAB"], 500],
    ["Selin Aydın", "women", 12, "Hacettepe Üniversitesi", "Tıp Fakültesi", ["Biyoloji", "Kimya", "TUS Hazırlık"], 450]
  ],
  "İzmir": [
    ["Can Özkan", "men", 52, "Dokuz Eylül Üniversitesi", "Makine Mühendisliği", ["Statik", "Termodinamik", "AutoCAD"], 400],
    ["Deniz Kaya", "women", 26, "Ege Üniversitesi", "Psikoloji", ["Psikolojiye Giriş", "SPSS", "Araştırma Yöntemleri"], 350],
    ["Oğuz Tekin", "men", 61, "İzmir Yüksek Teknoloji Enstitüsü", "Kimya", ["Genel Kimya", "Organik Kimya", "Lab Raporu"], 400]
  ],
  "Eskişehir": [
    ["Ayşe Nur Çelik", "women", 33, "Anadolu Üniversitesi", "İşletme", ["Muhasebe", "Finansal Yönetim", "Pazarlama"], 300],
    ["Kerem Başaran", "men", 18, "Eskişehir Teknik Üniversitesi", "Uçak Mühendisliği", ["Fizik", "Matematik", "Dinamik"], 350],
    ["Sude Polat", "women", 90, "Eskişehir Osmangazi Üniversitesi", "Eczacılık", ["Kimya", "Biyokimya", "Farmakoloji"], 350]
  ],
  "Bursa": [
    ["Yusuf Er", "men", 41, "Uludağ Üniversitesi", "Endüstri Mühendisliği", ["Yöneylem", "Olasılık", "Matematik"], 350],
    ["Merve Aslan", "women", 55, "Bursa Teknik Üniversitesi", "Yazılım Mühendisliği", ["Web Geliştirme", "JavaScript", "Java"], 400],
    ["Tuna Erdem", "men", 8, "Uludağ Üniversitesi", "Türk Dili ve Edebiyatı", ["TYT Türkçe", "Paragraf", "Edebiyat"], 300]
  ],
  "Antalya": [
    ["Naz Yalçın", "women", 79, "Akdeniz Üniversitesi", "Mimarlık", ["Mimari Proje", "Çizim", "Portfolyo Hazırlığı"], 400],
    ["Barış Kılıç", "men", 14, "Akdeniz Üniversitesi", "Fizik", ["Fizik", "TYT/AYT Fizik", "Mekanik"], 350],
    ["Ece Tunç", "women", 5, "Antalya Bilim Üniversitesi", "Hukuk", ["Anayasa Hukuku", "Medeni Hukuk", "Hukuk Yazımı"], 450]
  ]
};

const ALL_CITIES = ["Adana","Adıyaman","Afyonkarahisar","Ağrı","Aksaray","Amasya","Ankara","Antalya","Ardahan","Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Düzce","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkâri","Hatay","Iğdır","Isparta","İstanbul","İzmir","Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kilis","Kırıkkale","Kırklareli","Kırşehir","Kocaeli","Konya","Kütahya","Malatya","Manisa","Mardin","Mersin","Muğla","Muş","Nevşehir","Niğde","Ordu","Osmaniye","Rize","Sakarya","Samsun","Şanlıurfa","Siirt","Sinop","Sivas","Şırnak","Tekirdağ","Tokat","Trabzon","Tunceli","Uşak","Van","Yalova","Yozgat","Zonguldak"];

const POPULAR = Object.keys(TUTORS);
const $ = (id) => document.getElementById(id);

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const WA_ICON = '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7a11.300 11.300 0 0 1-4.800-4.200c-.4-.6-1.200-1.700-1.200-3s.7-1.900 1-2.200c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.500l.8 1.900c.1.200.1.400 0 .6l-.4.600-.4.500c-.1.200-.3.400-.1.700.2.300.8 1.300 1.700 2.100 1.100 1 2.100 1.300 2.400 1.500.3.100.5.100.6-.1l.9-1.100c.2-.3.4-.2.700-.1l1.800.9c.3.100.5.200.5.400.1.100.1.600-.1 1.200Z"/></svg>';

function initials(name) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

function tutorCard([name, gender, photo, uni, dept, skills, price], city) {
  const msg = `Merhaba, Kampüs Eğitmen üzerinden ${name} (${uni} - ${dept}) ile ${city} için özel ders hakkında bilgi almak istiyorum.`;
  const img = `https://randomuser.me/api/portraits/${gender}/${photo}.jpg`;
  return `
    <article class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5">
      <div class="flex items-center gap-4">
        <div class="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-navy-800">
          <span class="absolute inset-0 flex items-center justify-center font-display text-lg font-extrabold text-white">${initials(name)}</span>
          <img src="${img}" alt="${name} profil fotoğrafı" loading="lazy" class="relative h-full w-full object-cover" onerror="this.remove()" />
        </div>
        <div class="min-w-0">
          <h4 class="font-display text-lg font-extrabold text-navy-900">${name}</h4>
          <p class="text-sm font-semibold text-slate-600">${uni}</p>
          <p class="text-sm text-slate-500">${dept}</p>
        </div>
      </div>
      <ul class="mt-4 flex flex-wrap gap-2">
        ${skills.map((s) => `<li class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-navy-800">${s}</li>`).join("")}
      </ul>
      <div class="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
        <p class="text-sm text-slate-500">Saatlik <span class="font-display text-xl font-extrabold text-navy-900">${price} ₺</span></p>
        <a href="${waLink(msg)}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-full bg-wa px-4 py-2 text-sm font-bold text-navy-950 hover:brightness-110">${WA_ICON} WhatsApp'tan yaz</a>
      </div>
    </article>`;
}

function emptyState(city) {
  const msg = `Merhaba, ${city} ilinde özel ders için eğitmen arıyorum. Yardımcı olabilir misiniz?`;
  return `
    <div class="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p class="font-display text-xl font-extrabold text-navy-900">${city} için eğitmen listemiz hazırlanıyor</p>
      <p class="mx-auto mt-2 max-w-md text-slate-600">Hangi ders ve seviyede destek aradığını yaz, seni ${city} ve çevresindeki uygun eğitmenle eşleştirelim.</p>
      <a href="${waLink(msg)}" target="_blank" rel="noopener" class="mt-5 inline-flex items-center gap-2 rounded-full bg-wa px-6 py-3 font-bold text-navy-950 hover:brightness-110">${WA_ICON} ${city} için WhatsApp'tan yaz</a>
    </div>`;
}

function selectCity(city) {
  const list = TUTORS[city] || [];
  const grid = $("tutor-grid");

  $("results-title").textContent = list.length
    ? `${city} eğitmenleri`
    : `${city}`;
  grid.innerHTML = list.length ? list.map((t) => tutorCard(t, city)).join("") : emptyState(city);

  // Küçük geçiş animasyonu (kullanıcı il değiştirdiğinde)
  grid.classList.remove("is-updating");
  void grid.offsetWidth;
  grid.classList.add("is-updating");

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.setAttribute("aria-pressed", String(chip.dataset.city === city));
  });
  $("city-select").value = city;
}

function init() {
  // Popüler il butonları
  $("city-chips").innerHTML = POPULAR.map(
    (c) => `<button type="button" class="chip" data-city="${c}" aria-pressed="false">${c}</button>`
  ).join("");
  $("city-chips").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (btn) selectCity(btn.dataset.city);
  });

  // 81 il listesi
  $("city-select").innerHTML = ALL_CITIES.map((c) => `<option value="${c}">${c}</option>`).join("");
  $("city-select").addEventListener("change", (e) => selectCity(e.target.value));

  // Genel WhatsApp butonları
  document.querySelectorAll("[data-wa-general]").forEach((a) => {
    a.href = waLink("Merhaba, Kampüs Eğitmen üzerinden özel ders hakkında bilgi almak istiyorum.");
  });

  $("year").textContent = new Date().getFullYear();
  selectCity("İstanbul");
}

document.addEventListener("DOMContentLoaded", init);
