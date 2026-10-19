/* Kampüs Eğitmen – ORTAK YARDIMCI KODLAR (kart üretimi, WhatsApp linkleri vb.)
   Eğitmen eklemek/değiştirmek için bu dosyaya DEĞİL, veri.js dosyasına bak.
   Bu dosyanın çalışması için sayfalarda önce veri.js, sonra data.js yüklenir. */

const $ = (id) => document.getElementById(id);
const trLower = (t) => t.toLocaleLowerCase("tr");

const WA_ICON = '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7a11.3 11.3 0 0 1-4.8-4.2c-.4-.6-1.2-1.7-1.2-3s.7-1.9 1-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l1.8.9c.3.1.5.2.5.4.1.1.1.6-.1 1.2Z"/></svg>';

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* ---------- Eğitmen yardımcıları ---------- */
const findTutor = (id) => TUTORS.find((t) => t.id === id);
const tutorsByCity = (city) => TUTORS.filter((t) => t.il === city);
const profileUrl = (t) => "egitmen-detay.html?id=" + encodeURIComponent(t.id);
const tutorWaLink = (t) =>
  waLink(`Merhaba, Kampüs Eğitmen üzerinden ${t.ad} (${t.universite} - ${t.bolum}) ile ${t.il} için ders planlamak istiyorum.`);

function initials(name) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

// Fotoğraf yoksa ya da yüklenemezse isim baş harfleri görünür
function avatar(t, size = "h-16 w-16", text = "text-lg") {
  return `<div class="avatar relative ${size} shrink-0 overflow-hidden rounded-full bg-navy-800">
    <span class="absolute inset-0 flex items-center justify-center font-display ${text} font-extrabold text-white">${initials(t.ad)}</span>
    ${t.foto ? `<img src="${t.foto}" alt="${t.ad} profil fotoğrafı" loading="lazy" class="relative h-full w-full object-cover" onerror="this.remove()" />` : ""}
  </div>`;
}

// Eğitmen kartı: kartın tamamı profil sayfasına gider, WhatsApp butonu doğrudan yazdırır
function tutorCard(t) {
  return `
    <article class="tutor-card relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5">
      <div class="flex items-center gap-4">
        ${avatar(t)}
        <div class="min-w-0">
          <h4 class="font-display text-lg font-extrabold text-navy-900"><a href="${profileUrl(t)}" class="card-link">${t.ad}</a></h4>
          <p class="text-sm font-semibold text-slate-600">${t.universite}</p>
          <p class="text-sm text-slate-500">${t.bolum}</p>
        </div>
      </div>
      <ul class="mt-4 flex flex-wrap gap-2">
        ${t.dersler.map((s) => `<li class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-navy-800">${s}</li>`).join("")}
      </ul>
      <div class="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
        <p class="text-sm text-slate-500">Saatlik <span class="font-display text-xl font-extrabold text-navy-900">${t.ucret} ₺</span></p>
        <a href="${tutorWaLink(t)}" target="_blank" rel="noopener" class="relative z-10 inline-flex items-center gap-2 rounded-full bg-wa px-4 py-2 text-sm font-bold text-navy-950 hover:brightness-110">${WA_ICON} WhatsApp'tan yaz</a>
      </div>
    </article>`;
}

function emptyState(city) {
  const msg = `Merhaba, ${city} ilinde özel ders için eğitmen arıyorum. Yardımcı olabilir misiniz?`;
  return `
    <div class="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p class="font-display text-xl font-extrabold text-navy-900">${city} için henüz eğitmenimiz yok</p>
      <p class="mx-auto mt-2 max-w-md text-slate-600">Hangi ders ve seviyede destek aradığını yaz, seni uygun eğitmenle eşleştirelim.</p>
      <a href="${waLink(msg)}" target="_blank" rel="noopener" class="mt-5 inline-flex items-center gap-2 rounded-full bg-wa px-6 py-3 font-bold text-navy-950 hover:brightness-110">${WA_ICON} WhatsApp'tan yaz</a>
    </div>`;
}

/* ---------- veri.js'de hata yaparsan konsolda (F12) uyarı verir ---------- */
(function checkData() {
  const seen = new Set();
  TUTORS.forEach((t) => {
    if (seen.has(t.id)) console.warn(`[veri.js] Aynı id iki kez kullanılmış: "${t.id}"`);
    seen.add(t.id);
    if (!ILLER.includes(t.il)) console.warn(`[veri.js] "${t.ad}" için il hatalı: "${t.il}". Geçerli iller: ${ILLER.join(", ")}`);
    ["id", "ad", "il", "universite", "bolum", "derece", "dersler", "ucret"].forEach((k) => {
      if (t[k] === undefined || t[k] === "") console.warn(`[veri.js] "${t.ad || t.id}" eğitmeninde "${k}" eksik.`);
    });
  });
})();
