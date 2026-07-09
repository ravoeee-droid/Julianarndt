const fs = require('fs');
const path = require('path');

const CONSENT_KEY = 'defi_cookie_consent_v1';
const CLARITY_ID = 'xjrqe58i0h';

const clarityLoader = `
<script>
(function(){
  const CLARITY_ID = "${CLARITY_ID}";
  let clarityLoaded = false;

  function loadClarity(){
    if(clarityLoaded || window.__clarityLoaded) return;
    clarityLoaded = true;
    window.__clarityLoaded = true;

    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);
      t.async=1;
      t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }

  function readConsent(){
    try { return JSON.parse(localStorage.getItem("${CONSENT_KEY}")); }
    catch(e) { return null; }
  }

  function checkConsentAndLoad(){
    const consent = readConsent();
    if(consent && consent.analytics === true){ loadClarity(); }
  }

  checkConsentAndLoad();

  window.addEventListener("cookieConsentUpdated", function(e){
    if(e.detail && e.detail.analytics === true){ loadClarity(); }
  });

  document.addEventListener("click", function(e){
    const calendar = e.target.closest('a[href*="calendar.app.google"], .calendar-track');
    if(calendar && window.clarity){
      try { window.clarity("event", "CalendarClick"); } catch(err) {}
    }

    const video = e.target.closest('[data-video], .video-trigger, .play-btn, #vThumb, .yt-card');
    if(video && window.clarity){
      try { window.clarity("event", "VideoInteraction"); } catch(err) {}
    }

    const cta = e.target.closest('a, button');
    if(cta && window.clarity){
      const txt = (cta.innerText || cta.getAttribute("aria-label") || "").trim().toLowerCase();
      if(txt.includes("analyse") || txt.includes("termin") || txt.includes("platz") || txt.includes("sichern")){
        try { window.clarity("event", "CTA_Click"); } catch(err) {}
      }
    }
  });
})();
</script>`;

const vercelAnalyticsScript = '<script defer src="/_vercel/insights/script.js"></script>';

function updateFile(filePath, updater) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return false;
  const before = fs.readFileSync(fullPath, 'utf8');
  const after = updater(before);
  if (after !== before) {
    fs.writeFileSync(fullPath, after, 'utf8');
    console.log(`updated ${filePath}`);
    return true;
  }
  console.log(`no changes ${filePath}`);
  return false;
}

updateFile('index.html', (html) => {
  let output = html;

  output = output.replace(/<script[^>]*>\s*\(function\(c,l,a,r,i,t,y\)\{.*?xjrqe58i0h.*?<\/script>/gs, '');

  if (!output.includes(`CLARITY_ID = "${CLARITY_ID}"`)) {
    output = output.replace('</body>', `${clarityLoader}\n</body>`);
  }

  if (!output.includes('/_vercel/insights/script.js')) {
    output = output.replace('</body>', `${vercelAnalyticsScript}\n</body>`);
  }

  output = output.replace(
    'Hilft uns zu verstehen, welche Inhalte genutzt werden und wie die Seite verbessert werden kann.',
    'Hilft uns mit Microsoft Clarity Heatmaps und Sitzungsaufzeichnungen zu verstehen, welche Inhalte genutzt werden und wie die Seite verbessert werden kann.'
  );

  return output;
});

updateFile('datenschutz.html', (html) => {
  let output = html;

  if (!output.includes('Microsoft Clarity')) {
    const clarityPrivacy = `
<section class="legal-section">
  <h2>Microsoft Clarity</h2>
  <p>Diese Website kann Microsoft Clarity einsetzen, um das Nutzungsverhalten auf der Website in Form von Heatmaps und Sitzungsaufzeichnungen besser zu verstehen. Dies hilft uns, Inhalte, Benutzerführung und technische Darstellung zu verbessern.</p>
  <p>Microsoft Clarity wird nur geladen, wenn du im Cookie-Banner der Kategorie „Statistik“ zustimmst. Du kannst deine Auswahl jederzeit über die Cookie-Einstellungen ändern.</p>
  <p>Anbieter ist Microsoft Ireland Operations Limited, One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Irland.</p>
</section>`;

    if (output.includes('</main>')) output = output.replace('</main>', `${clarityPrivacy}\n</main>`);
    else output = output.replace('</body>', `${clarityPrivacy}\n</body>`);
  }

  if (!output.includes('Vercel Web Analytics')) {
    const vercelPrivacy = `
<section class="legal-section">
  <h2>Vercel Web Analytics</h2>
  <p>Diese Website kann Vercel Web Analytics einsetzen, um Seitenaufrufe und technische Nutzungssignale datenschutzfreundlich auszuwerten. Die Auswertung dient der Verbesserung von Ladezeit, Nutzerführung und Seitenqualität.</p>
</section>`;

    if (output.includes('</main>')) output = output.replace('</main>', `${vercelPrivacy}\n</main>`);
    else output = output.replace('</body>', `${vercelPrivacy}\n</body>`);
  }

  return output;
});
