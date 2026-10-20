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

// Veritabanından gelen eğitmen kartı (action: kartın altındaki buton/bağlantı HTML'i)
function dbCard(t, action) {
  const ini = (t.full_name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("");
  const derece = t.osym_verified
    ? `<p class="osym-badge mt-4">ÖSYM Onaylı Derece${t.rank_text ? ": " + esc(t.rank_text) : ""}</p>`
    : t.rank_text ? `<p class="mt-4 text-sm text-slate-500">${esc(t.rank_text)} <span class="text-xs">(eğitmen beyanı)</span></p>` : "";
  return `
    <article class="tutor-card flex flex-col rounded-2xl border border-slate-200 bg-white p-5" style="cursor:default">
      <div class="flex items-center gap-4">
        <div class="avatar flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy-800 font-display text-lg font-extrabold text-white">${esc(ini)}</div>
        <div class="min-w-0">
          <h4 class="font-display text-lg font-extrabold text-navy-900">${esc(t.full_name)}</h4>
          <p class="text-sm font-semibold text-slate-600">${esc(t.university)}</p>
          <p class="text-sm text-slate-500">${esc(t.department)}</p>
        </div>
      </div>
      ${derece}
      <ul class="mt-4 flex flex-wrap gap-2">${(t.subjects || []).map((s) => `<li class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-navy-800">${esc(s)}</li>`).join("")}</ul>
      <div class="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
        <p class="text-sm text-slate-500">Saatlik <span class="font-display text-xl font-extrabold text-navy-900">${esc(t.hourly_rate)} ₺</span></p>
        ${action}
      </div>
    </article>`;
}
