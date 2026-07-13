const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'index.html');
const calendarUrl = 'https://calendar.app.google/sDXSGovL4Bjy41RB8';
let html = fs.readFileSync(file, 'utf8');

const calendarCss = `
/* DIRECT CALENDAR EMBED */
.calendar-section{background:linear-gradient(180deg,#080808,#050505);border-top:1px solid rgba(198,162,42,.13);border-bottom:1px solid rgba(198,162,42,.13)}
.calendar-intro{max-width:760px;margin:0 auto 38px;text-align:center;color:var(--muted);line-height:1.85}
.calendar-shell{position:relative;max-width:1040px;margin:0 auto;background:linear-gradient(145deg,rgba(18,18,18,.98),rgba(5,5,5,.98));border:1px solid rgba(198,162,42,.28);border-radius:34px;padding:22px;box-shadow:0 38px 130px rgba(0,0,0,.5),0 0 90px rgba(198,162,42,.08);overflow:hidden}
.calendar-shell:before{content:"";position:absolute;inset:-1px;background:radial-gradient(circle at 75% 10%,rgba(198,162,42,.18),transparent 34%);pointer-events:none}
.calendar-top{position:relative;z-index:2;display:flex;justify-content:space-between;gap:18px;align-items:center;padding:10px 8px 22px;border-bottom:1px solid rgba(198,162,42,.14);margin-bottom:18px}
.calendar-top strong{font-size:1.04rem;color:var(--cream)}
.calendar-top span{display:block;color:var(--soft);font-size:.82rem;margin-top:3px}
.calendar-badge{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(198,162,42,.28);background:rgba(198,162,42,.08);border-radius:999px;padding:10px 14px;color:var(--gold);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;font-weight:900;white-space:nowrap}
.calendar-frame-wrap{position:relative;z-index:2;border-radius:24px;overflow:hidden;border:1px solid rgba(242,238,229,.08);background:#0b0b0b;min-height:760px}
.calendar-iframe{width:100%;height:760px;border:0;background:#0b0b0b;display:block}
.calendar-fallback{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:18px;margin-top:18px;padding:18px 20px;border:1px solid rgba(242,238,229,.10);border-radius:22px;background:rgba(255,255,255,.035);color:var(--muted);font-size:.9rem}
.calendar-fallback a{flex:0 0 auto}
@media(max-width:760px){.calendar-shell{padding:14px;border-radius:24px}.calendar-top{display:block}.calendar-badge{margin-top:14px}.calendar-frame-wrap{min-height:680px}.calendar-iframe{height:680px}.calendar-fallback{display:block}.calendar-fallback a{margin-top:14px;width:100%}}
`;

const calendarSection = `
<section class="section calendar-section" id="termin">
  <div class="wrap">
    <div class="center sr">
      <span class="s-tag">Direkt Termin wählen</span>
      <h2 class="s-h2">Wähle jetzt deinen <em>Analyse-Termin.</em></h2>
      <div class="gold-rule c"></div>
      <p class="calendar-intro">Keine Weiterleitung, kein Suchen, kein unnötiger Zwischenschritt. Such dir direkt hier auf der Landingpage einen passenden Termin für deine kostenlose Analyse aus.</p>
    </div>

    <div class="calendar-shell sr d1">
      <div class="calendar-top">
        <div>
          <strong>Kostenlose Analyse mit Julian Arndt</strong>
          <span>Wähle einen freien Slot. Die Bestätigung kommt im Anschluss direkt per Kalender/E-Mail.</span>
        </div>
        <div class="calendar-badge">Nur 12 Plätze · kostenlos</div>
      </div>

      <div class="calendar-frame-wrap">
        <iframe class="calendar-iframe calendar-track" src="${calendarUrl}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" title="Kostenlose Analyse Termin buchen"></iframe>
      </div>

      <div class="calendar-fallback">
        <span>Falls der Kalender in deinem Browser nicht direkt lädt, öffne ihn hier in einem neuen Tab.</span>
        <a class="btn-main calendar-track" href="${calendarUrl}" target="_blank" rel="noopener">Kalender öffnen</a>
      </div>
    </div>
  </div>
</section>
`;

if (!html.includes('/* DIRECT CALENDAR EMBED */')) {
  html = html.replace('</style>', `${calendarCss}\n</style>`);
}

if (!html.includes('id="termin"')) {
  html = html.replace('<section class="section results" id="results">', `${calendarSection}\n<section class="section results" id="results">`);
}

// Make main CTAs scroll to the embedded calendar instead of throwing users away too early.
html = html.replace(/href="https:\/\/calendar\.app\.google\/sDXSGovL4Bjy41RB8"\s+target="_blank"/g, 'href="#termin"');
html = html.replace(/href="https:\/\/calendar\.app\.google\/sDXSGovL4Bjy41RB8"/g, 'href="#termin"');

// Restore the fallback button to open the external calendar.
html = html.replace(/<a class="btn-main calendar-track" href="#termin" rel="noopener">Kalender öffnen<\/a>/g, `<a class="btn-main calendar-track" href="${calendarUrl}" target="_blank" rel="noopener">Kalender öffnen</a>`);
html = html.replace(/<a class="btn-main calendar-track" href="#termin">Kalender öffnen<\/a>/g, `<a class="btn-main calendar-track" href="${calendarUrl}" target="_blank" rel="noopener">Kalender öffnen</a>`);

fs.writeFileSync(file, html, 'utf8');
console.log('Embedded calendar section installed.');
