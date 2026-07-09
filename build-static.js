const fs = require('fs');
const path = require('path');

const root = process.cwd();
const assetsDir = path.join(root, 'assets');
fs.mkdirSync(assetsDir, { recursive: true });

function write(file, content) {
  fs.writeFileSync(path.join(root, file), content, 'utf8');
  console.log('wrote', file);
}

function read(file) {
  const p = path.join(root, file);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

function noClaus(html) {
  return html
    .replace(/Julian\s+Claus\s+Arndt/g, 'Julian Arndt')
    .replace(/Julian\s+Claus/g, 'Julian')
    .replace(/Über Julian Claus Arndt/g, 'Über Julian Arndt');
}

function svgBase({ title, subtitle, icon = '◆', portrait = false }) {
  const safeTitle = String(title).replace(/&/g, '&amp;');
  const safeSubtitle = String(subtitle || '').replace(/&/g, '&amp;');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <radialGradient id="g1" cx="30%" cy="20%" r="70%"><stop offset="0" stop-color="#3d310f"/><stop offset="0.42" stop-color="#0c0c0c"/><stop offset="1" stop-color="#050505"/></radialGradient>
    <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f1da7a"/><stop offset="0.48" stop-color="#c6a22a"/><stop offset="1" stop-color="#6f5512"/></linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="22"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#g1)"/>
  <g opacity="0.18" stroke="#c6a22a" stroke-width="1">
    ${Array.from({length: 18}, (_,i)=>`<line x1="${i*96}" y1="0" x2="${i*96}" y2="1000"/>`).join('')}
    ${Array.from({length: 11}, (_,i)=>`<line x1="0" y1="${i*96}" x2="1600" y2="${i*96}"/>`).join('')}
  </g>
  <circle cx="1260" cy="190" r="210" fill="#c6a22a" opacity="0.14" filter="url(#blur)"/>
  <circle cx="280" cy="810" r="260" fill="#c6a22a" opacity="0.10" filter="url(#blur)"/>
  <rect x="86" y="86" width="1428" height="828" rx="58" fill="rgba(255,255,255,0.035)" stroke="rgba(198,162,42,0.32)"/>
  ${portrait ? `<circle cx="800" cy="370" r="150" fill="url(#gold)" opacity="0.92"/><circle cx="800" cy="315" r="56" fill="#080808" opacity="0.8"/><path d="M660 560c40-120 240-120 280 0" fill="#080808" opacity="0.8"/>` : `<circle cx="800" cy="330" r="134" fill="url(#gold)"/><text x="800" y="374" text-anchor="middle" font-family="Georgia,serif" font-size="126" font-weight="700" fill="#070707">${icon}</text>`}
  <text x="800" y="610" text-anchor="middle" font-family="Georgia,serif" font-size="74" fill="#f2eee5" font-weight="500">${safeTitle}</text>
  <text x="800" y="682" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#c6a22a" font-weight="700" letter-spacing="3">${safeSubtitle}</text>
  <path d="M420 760 C620 690, 980 830, 1180 730" fill="none" stroke="#c6a22a" stroke-width="4" opacity="0.55"/>
  <circle cx="420" cy="760" r="9" fill="#e0bf56"/><circle cx="800" cy="750" r="9" fill="#e0bf56"/><circle cx="1180" cy="730" r="9" fill="#e0bf56"/>
</svg>`;
}

write('assets/logo.svg', `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f1da7a"/><stop offset=".5" stop-color="#c6a22a"/><stop offset="1" stop-color="#6f5512"/></linearGradient></defs>
  <rect width="800" height="800" rx="180" fill="#050505"/>
  <circle cx="400" cy="400" r="286" fill="none" stroke="url(#g)" stroke-width="32"/>
  <path d="M400 132 610 400 400 668 190 400Z" fill="url(#g)"/>
  <path d="M400 230 525 400 400 570 275 400Z" fill="#050505" opacity=".92"/>
</svg>`);

write('assets/hero-thumbnail.svg', svgBase({ title: 'Investmentprozess statt Chaos', subtitle: 'DEFI INTELLIGENCE · JULIAN ARNDT', icon: '▶' }));
write('assets/julian-portrait.svg', svgBase({ title: 'Julian Arndt', subtitle: 'PERSÖNLICHE ANALYSE', portrait: true }));
write('assets/julian-meeting.svg', svgBase({ title: 'Persönliche Analyse', subtitle: 'KLARHEIT · STRUKTUR · FOKUS', icon: '1' }));
write('assets/julian-analysis.svg', svgBase({ title: 'Marktverständnis', subtitle: 'REGELN VOR RENDITE', icon: '2' }));
write('assets/julian-handshake.svg', svgBase({ title: 'Vertrauen', subtitle: 'ZUSAMMENARBEIT AUF AUGENHÖHE', icon: '3' }));
write('assets/julian-brand.svg', svgBase({ title: 'Klare Personenmarke', subtitle: 'JULIAN ARNDT · DEFI INTELLIGENCE', icon: '4' }));
write('assets/og-image.svg', svgBase({ title: 'DeFi Intelligence', subtitle: 'INVESTMENTPROZESS MIT JULIAN ARNDT', icon: '◆' }));
write('site.webmanifest', JSON.stringify({ name: 'DeFi Intelligence', short_name: 'DeFi', icons: [{ src: 'assets/logo.svg', sizes: 'any', type: 'image/svg+xml' }], theme_color: '#050505', background_color: '#050505', display: 'standalone' }, null, 2));
write('robots.txt', 'User-agent: *\nAllow: /\nSitemap: https://www.julian-arndt.com/sitemap.xml\n');
write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.julian-arndt.com/</loc></url></urlset>\n');

let html = read('index.html');
html = noClaus(html);
html = html
  .replace(/assets\/defi-premium-signet\.(webp|png)/g, 'assets/logo.svg')
  .replace(/assets\/hero-thumbnail\.(webp|png)/g, 'assets/hero-thumbnail.svg')
  .replace(/assets\/julian-portrait\.(webp|png)/g, 'assets/julian-portrait.svg')
  .replace(/assets\/julian-meeting\.(webp|png)/g, 'assets/julian-meeting.svg')
  .replace(/assets\/julian-analysis\.(webp|png)/g, 'assets/julian-analysis.svg')
  .replace(/assets\/julian-handshake\.(webp|png)/g, 'assets/julian-handshake.svg')
  .replace(/assets\/julian-brand\.(webp|png)/g, 'assets/julian-brand.svg')
  .replace(/assets\/og-image\.jpg/g, 'assets/og-image.svg')
  .replace(/https:\/\/www\.julian-arndt\.com\/assets\/og-image\.jpg/g, 'https://www.julian-arndt.com/assets/og-image.svg')
  .replace(/https:\/\/defi-intelligence\.net\/assets\/og-image\.jpg/g, 'https://www.julian-arndt.com/assets/og-image.svg')
  .replace(/<link rel="icon" href="assets\/favicon\.ico" sizes="any">/g, '<link rel="icon" href="assets/logo.svg" type="image/svg+xml">')
  .replace(/<link rel="icon" type="image\/png" sizes="32x32" href="assets\/favicon-32\.png">/g, '')
  .replace(/<link rel="icon" type="image\/png" sizes="16x16" href="assets\/favicon-16\.png">/g, '')
  .replace(/<link rel="apple-touch-icon" href="assets\/apple-touch-icon\.png">/g, '<link rel="apple-touch-icon" href="assets/logo.svg">')
  .replace(/<meta property="og:image" content="assets\/hero-thumbnail\.svg">/g, '<meta property="og:image" content="https://www.julian-arndt.com/assets/og-image.svg">');

const clarity = `
<script>
(function(){
  const CLARITY_ID = "xjrqe58i0h";
  let clarityLoaded = false;
  function loadClarity(){
    if(clarityLoaded || window.__clarityLoaded) return;
    clarityLoaded = true;
    window.__clarityLoaded = true;
    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",CLARITY_ID);
  }
  function readConsent(){try{return JSON.parse(localStorage.getItem("defi_cookie_consent_v1"));}catch(e){return null;}}
  function check(){const c=readConsent(); if(c && c.analytics===true) loadClarity();}
  check();
  window.addEventListener("cookieConsentUpdated", function(e){ if(e.detail && e.detail.analytics===true) loadClarity(); });
  document.addEventListener("click", function(e){
    if(!window.clarity) return;
    const calendar=e.target.closest('a[href*="calendar.app.google"], .calendar-track');
    const video=e.target.closest('[data-video], .video-trigger, .play-btn, #vThumb, .yt-card');
    const cta=e.target.closest('a, button');
    if(calendar) try{window.clarity("event","CalendarClick");}catch(err){}
    if(video) try{window.clarity("event","VideoInteraction");}catch(err){}
    if(cta){const t=(cta.innerText||cta.getAttribute("aria-label")||"").toLowerCase(); if(t.includes("analyse")||t.includes("termin")||t.includes("platz")||t.includes("sichern")) try{window.clarity("event","CTA_Click");}catch(err){}}
  });
})();
</script>`;

if (!html.includes('CLARITY_ID = "xjrqe58i0h"')) html = html.replace('</body>', clarity + '\n</body>');
if (!html.includes('/_vercel/insights/script.js')) html = html.replace('</body>', '<script defer src="/_vercel/insights/script.js"></script>\n</body>');

write('index.html', html);

for (const page of ['datenschutz.html','impressum.html','agb.html']) {
  let pageHtml = read(page);
  if (!pageHtml) continue;
  pageHtml = noClaus(pageHtml);
  if (page === 'datenschutz.html' && !pageHtml.includes('Microsoft Clarity')) {
    const privacy = `<section class="legal-section"><h2>Microsoft Clarity</h2><p>Diese Website kann Microsoft Clarity für Heatmaps und Sitzungsaufzeichnungen einsetzen. Microsoft Clarity wird nur geladen, wenn du im Cookie-Banner der Kategorie „Statistik“ zustimmst.</p></section>`;
    pageHtml = pageHtml.includes('</main>') ? pageHtml.replace('</main>', privacy + '</main>') : pageHtml.replace('</body>', privacy + '</body>');
  }
  write(page, pageHtml);
}
