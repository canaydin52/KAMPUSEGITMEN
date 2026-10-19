/* Kampüs Eğitmen – ortak menü (header) ve alt bilgi (footer). Menüyü değiştirmek için NAV'ı düzenle. */
(function () {
  const NAV = [
    ["index.html", "Ana Sayfa"],
    ["egitmenler.html", "Eğitmenler"],
    ["hakkimizda.html", "Hakkımızda"],
    ["iletisim.html", "İletişim"]
  ];
  const page = location.pathname.split("/").pop() || "index.html";
  const desktop = NAV.map(([h, t]) =>
    `<a href="${h}" class="nav-link${page === h ? " is-active" : ""}"${page === h ? ' aria-current="page"' : ""}>${t}</a>`).join("");
  const mobile = NAV.map(([h, t]) =>
    `<a href="${h}" class="block rounded-lg px-3 py-3 font-semibold ${page === h ? "bg-white/10 text-white" : "text-navy-100"}">${t}</a>`).join("");

  const header = document.getElementById("site-header");
  if (header) header.innerHTML = `
    <header class="sticky top-0 z-30 border-b border-white/10 bg-navy-900/95 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="index.html" class="font-display text-xl font-extrabold tracking-tight text-white">Kampüs<span class="text-navy-100/70"> Eğitmen</span></a>
        <nav class="hidden items-center gap-7 md:flex" aria-label="Ana menü">${desktop}</nav>
        <div class="flex items-center gap-2">
          <a data-wa-general href="#" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-full bg-wa px-4 py-2 text-sm font-bold text-navy-950 hover:brightness-110">${WA_ICON} <span class="hidden sm:inline">WhatsApp</span></a>
          <button id="menu-btn" type="button" aria-label="Menüyü aç" aria-expanded="false" aria-controls="mobile-menu" class="rounded-lg p-2 text-white md:hidden">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
        </div>
      </div>
      <nav id="mobile-menu" class="hidden border-t border-white/10 px-5 py-3 md:hidden" aria-label="Mobil menü">${mobile}</nav>
    </header>`;

  const footer = document.getElementById("site-footer");
  if (footer) footer.innerHTML = `
    <footer class="bg-navy-950 text-sm text-navy-100/70">
      <div class="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p class="font-display text-xl font-extrabold text-white">Kampüs Eğitmen</p>
          <p class="mt-3 max-w-sm leading-relaxed">Türkiye genelinde üniversiteli eğitmenlerle öğrencileri buluşturan birebir özel ders platformu.</p>
        </div>
        <div>
          <p class="font-bold text-white">Sayfalar</p>
          <ul class="mt-3 space-y-2">${NAV.map(([h, t]) => `<li><a href="${h}" class="hover:text-white">${t}</a></li>`).join("")}</ul>
        </div>
        <div>
          <p class="font-bold text-white">İletişim</p>
          <ul class="mt-3 space-y-2">
            <li><a data-wa-general href="#" target="_blank" rel="noopener" class="hover:text-white">WhatsApp</a></li>
            <li><a href="mailto:${CONTACT_EMAIL}" class="hover:text-white">${CONTACT_EMAIL}</a></li>
            <li><a href="${INSTAGRAM_URL}" target="_blank" rel="noopener" class="hover:text-white">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10 py-5 text-center">© ${new Date().getFullYear()} Kampüs Eğitmen. Tüm hakları saklıdır.</div>
    </footer>`;

  document.querySelectorAll("[data-wa-general]").forEach((a) => {
    a.href = waLink("Merhaba, Kampüs Eğitmen üzerinden özel ders hakkında bilgi almak istiyorum.");
  });

  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) btn.addEventListener("click", () => {
    const open = menu.classList.toggle("hidden") === false;
    btn.setAttribute("aria-expanded", String(open));
  });
})();
