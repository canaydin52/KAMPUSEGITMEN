/* Kampüs Eğitmen – Supabase bağlantısı ve ortak yardımcılar.
   Supabase > Project Settings > API sayfasından değerleri al.
   UYARI: Buraya SADECE "anon public" anahtarı konur. "service_role" anahtarı ASLA siteye konmaz. */
const SUPABASE_URL = "https://fxrogwsgtcstcmnthyvm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_DZB8imU2iB7mV2QXz5UTug_Xj5bzGsJ";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DERSLER = ["Matematik", "Geometri", "Fizik", "Kimya", "Biyoloji", "Türkçe", "Edebiyat", "İngilizce", "Tarih", "Coğrafya", "Programlama", "Kalkülüs"];
const KEY = { "İstanbul": "istanbul", "Ankara": "ankara", "İzmir": "izmir", "Bursa": "bursa", "Eskişehir": "eskisehir", "Antalya": "antalya" };
const STATUS_TR = { pending: "Bekliyor", approved: "Onaylandı", rejected: "Reddedildi" };
const CHIP = { pending: "bg-slate-100 text-slate-700", approved: "bg-emerald-50 text-emerald-800", rejected: "bg-red-50 text-red-700" };

// Kullanıcıdan gelen her metin HTML'e basılmadan önce mutlaka esc() ile temizlenir (XSS koruması)
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDate = (d) => new Date(d).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });
const statusChip = (s) => `<span class="rounded-full px-3 py-1 text-xs font-bold ${CHIP[s] || CHIP.pending}">${STATUS_TR[s] || esc(s)}</span>`;

async function me() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return null;
  const { data } = await sb.from("profiles").select("*").eq("id", session.user.id).single();
  return data ? { ...data, email: session.user.email } : null;
}

// Sayfa koruması (rahatlık içindir; asıl güvenlik veritabanındaki RLS kurallarıdır)
async function guard(roles) {
  const u = await me();
  if (!u) { location.href = "giris.html?next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search); return null; }
  if (u.is_banned) { await sb.auth.signOut(); location.href = "giris.html?banned=1"; return null; }
  if (roles && !roles.includes(u.role)) { location.href = "index.html"; return null; }
  return u;
}

// ---------- Rozetler, günler, ortak görünüm yardımcıları ----------
const KE_BADGES = {
  yks_uzmani: "🎯 YKS Uzmanı", lgs_kocu: "🧭 LGS Koçu", sabirli_anlatim: "🕊️ Sabırlı Anlatım",
  problem_cozucu: "🧩 Problem Çözücü", eglenceli_ders: "😄 Eğlenceli Ders", soru_cozum_makinesi: "⚡ Soru Çözüm Makinesi",
  disiplinli_takip: "📋 Disiplinli Takip", deneme_analisti: "📊 Deneme Analisti", yeni_nesil_soru: "🆕 Yeni Nesil Soru Üstadı",
  motivasyon_kaynagi: "🔥 Motivasyon Kaynağı", temelden_alan: "🌱 Temelden Alan", hizli_ilerleme: "🚀 Hızlı İlerleme",
  odev_takipcisi: "📝 Ödev Takipçisi", konu_anlatim_gurusu: "🎓 Konu Anlatım Gurusu", sinav_stratejisti: "♟️ Sınav Stratejisti",
  birebir_ilgi: "🤝 Birebir İlgi"
};
const KE_MAX_BADGES = 8;
const KE_GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const keHhmm = (t) => String(t).slice(0, 5);
const keInitials = (n) => (n || "?").trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toLocaleUpperCase("tr-TR");

// Fotoğraf varsa <img>, yoksa (veya yüklenemezse) baş harfli daire
function keAvatar(t, size = "h-16 w-16", text = "text-lg") {
  const fb = `<div class="avatar flex ${size} shrink-0 items-center justify-center rounded-full bg-navy-800 font-display ${text} font-extrabold text-white">${esc(keInitials(t.full_name))}</div>`;
  if (!t.avatar_url) return fb;
  return `<img src="${esc(t.avatar_url)}" alt="${esc(t.full_name)}" loading="lazy" referrerpolicy="no-referrer" class="${size} shrink-0 rounded-full bg-slate-200 object-cover" data-fb="${esc(fb)}" onerror="this.outerHTML=this.dataset.fb" />`;
}
const keBadgeChips = (arr, max = 99) => (arr || []).filter((b) => KE_BADGES[b]).slice(0, max)
  .map((b) => `<li class="rounded-full bg-navy-900/5 px-3 py-1 text-xs font-bold text-navy-800">${KE_BADGES[b]}</li>`).join("");
const keFreeChip = (t) => t.free_intro ? '<span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">🎁 İlk 20 dk ücretsiz</span>' : "";
const keRatingChip = (t) => t.review_count > 0
  ? `<span class="font-bold text-navy-900"><span class="text-amber-500">★</span> ${Number(t.rating_avg).toFixed(1)} <span class="font-normal text-slate-500">(${t.review_count})</span></span>`
  : '<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Yeni</span>';
const keStars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

// Veritabanından gelen eğitmen kartı (action: kartın altındaki buton/bağlantı HTML'i)
// Karta (butonlar hariç) tıklayınca eğitmenin detay sayfası açılır.
function dbCard(t, action) {
  const href = "egitmen-detay.html?id=" + encodeURIComponent(t.user_id);
  const derece = t.osym_verified
    ? `<p class="osym-badge mt-4">ÖSYM Onaylı Derece${t.rank_text ? ": " + esc(t.rank_text) : ""}</p>`
    : t.rank_text ? `<p class="mt-4 text-sm text-slate-500">${esc(t.rank_text)} <span class="text-xs">(eğitmen beyanı)</span></p>` : "";
  return `
    <article class="tutor-card flex flex-col rounded-2xl border border-slate-200 bg-white p-5" style="cursor:pointer" data-href="${href}">
      <div class="flex items-center gap-4">
        ${keAvatar(t)}
        <div class="min-w-0">
          <h4 class="font-display text-lg font-extrabold text-navy-900"><a href="${href}" class="hover:underline">${esc(t.full_name)}</a></h4>
          <p class="text-sm font-semibold text-slate-600">${esc(t.university)}</p>
          <p class="text-sm text-slate-500">${esc(t.department)}</p>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-2 text-sm">${keRatingChip(t)}${keFreeChip(t)}</div>
      ${derece}
      ${(t.badges || []).length ? `<ul class="mt-4 flex flex-wrap gap-2">${keBadgeChips(t.badges, 3)}</ul>` : ""}
      <ul class="mt-4 flex flex-wrap gap-2">${(t.subjects || []).map((s) => `<li class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-navy-800">${esc(s)}</li>`).join("")}</ul>
      <div class="mt-auto flex items-center justify-between gap-2 border-t border-slate-200 pt-4" style="margin-top:1.25rem">
        <p class="text-sm text-slate-500">Saatlik <span class="font-display text-xl font-extrabold text-navy-900">${esc(t.hourly_rate)} ₺</span></p>
        ${action}
      </div>
    </article>`;
}
document.addEventListener("click", (e) => {
  const c = e.target.closest("[data-href]");
  if (!c || e.target.closest("a,button,input,select,textarea,label")) return;
  location.href = c.dataset.href;
});
