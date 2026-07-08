const fs = require('fs');
const path = require('path');

const PIXEL_ID = '1789508675795500';

const META_PIXEL_HEAD = `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');

(function () {
  var trackedEvents = {};

  function isPixelReady() {
    return typeof window.fbq === 'function';
  }

  function safeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 140);
  }

  function trackMetaEvent(eventName, params, onceKey) {
    if (!isPixelReady()) return;
    if (onceKey) {
      if (trackedEvents[onceKey]) return;
      trackedEvents[onceKey] = true;
    }
    window.fbq('track', eventName, params || {});
  }

  function getElementLabel(element) {
    if (!element) return '';
    return safeText(
      element.getAttribute('data-meta-label') ||
      element.getAttribute('aria-label') ||
      element.getAttribute('title') ||
      element.innerText ||
      element.textContent ||
      ''
    );
  }

  function getHref(element) {
    if (!element || typeof element.getAttribute !== 'function') return '';
    return element.getAttribute('href') || element.href || '';
  }

  function looksLikeCalendar(href, label) {
    var value = (href + ' ' + label).toLowerCase();
    return value.indexOf('calendar.app.google') > -1 ||
      value.indexOf('calendly') > -1 ||
      value.indexOf('termin') > -1 ||
      value.indexOf('kalender') > -1 ||
      value.indexOf('gespräch buchen') > -1 ||
      value.indexOf('call buchen') > -1 ||
      value.indexOf('analyse buchen') > -1;
  }

  function looksLikeContact(href, label) {
    var value = (href + ' ' + label).toLowerCase();
    return value.indexOf('mailto:') === 0 ||
      value.indexOf('tel:') === 0 ||
      value.indexOf('wa.me') > -1 ||
      value.indexOf('whatsapp') > -1 ||
      value.indexOf('kontakt') > -1 ||
      value.indexOf('email') > -1 ||
      value.indexOf('e-mail') > -1 ||
      value.indexOf('anrufen') > -1;
  }

  function looksLikeLead(href, label) {
    var value = (href + ' ' + label).toLowerCase();
    return value.indexOf('lead') > -1 ||
      value.indexOf('anfrage') > -1 ||
      value.indexOf('beratung') > -1 ||
      value.indexOf('erstgespräch') > -1 ||
      value.indexOf('analyse') > -1 ||
      value.indexOf('prozess') > -1 ||
      value.indexOf('strategie') > -1 ||
      value.indexOf('sichern') > -1 ||
      value.indexOf('bewerben') > -1 ||
      value.indexOf('jetzt') > -1;
  }

  function looksLikeRegistration(href, label) {
    var value = (href + ' ' + label).toLowerCase();
    return value.indexOf('registr') > -1 ||
      value.indexOf('anmelden') > -1 ||
      value.indexOf('signup') > -1 ||
      value.indexOf('sign up') > -1;
  }

  function looksLikeApplication(href, label) {
    var value = (href + ' ' + label).toLowerCase();
    return value.indexOf('bewerbung') > -1 ||
      value.indexOf('bewerben') > -1 ||
      value.indexOf('karriere') > -1 ||
      value.indexOf('application') > -1;
  }

  function looksLikeSearch(href, label) {
    var value = (href + ' ' + label).toLowerCase();
    return value.indexOf('suche') > -1 || value.indexOf('search') > -1;
  }

  function looksLikeCustomize(href, label) {
    var value = (href + ' ' + label).toLowerCase();
    return value.indexOf('personalis') > -1 ||
      value.indexOf('konfigur') > -1 ||
      value.indexOf('customiz') > -1 ||
      value.indexOf('rechner') > -1 ||
      value.indexOf('quiz') > -1;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var currentPath = window.location.pathname || '/';
    var isMainPage = currentPath === '/' || currentPath === '/index.html' || currentPath.indexOf('index.html') > -1;

    if (isMainPage) {
      trackMetaEvent('ViewContent', {
        content_name: document.title || 'DeFi Intelligence Landingpage',
        content_category: 'Landingpage',
        page_path: currentPath
      }, 'viewcontent:' + currentPath);
    }

    document.addEventListener('click', function (event) {
      var element = event.target && event.target.closest ? event.target.closest('a, button, [role="button"], [data-meta-event]') : null;
      if (!element) return;

      var href = getHref(element);
      var label = getElementLabel(element);
      var destination = element.href || href || '';
      var manualEvent = element.getAttribute ? element.getAttribute('data-meta-event') : '';
      var baseParams = {
        button_text: label || 'Unbenannter Klick',
        destination_url: destination || window.location.href,
        page_path: window.location.pathname || '/'
      };

      if (manualEvent) {
        trackMetaEvent(manualEvent, baseParams, 'manual:' + manualEvent + ':' + destination + ':' + label);
      }

      if (looksLikeCalendar(href, label)) {
        trackMetaEvent('Schedule', Object.assign({}, baseParams, {
          content_name: 'Terminbuchung',
          event_action: 'calendar_click'
        }), 'schedule:' + destination + ':' + label);

        trackMetaEvent('Lead', Object.assign({}, baseParams, {
          content_name: 'Terminbuchung Lead',
          lead_type: 'calendar_booking_click'
        }), 'lead:schedule:' + destination + ':' + label);
      }

      if (looksLikeContact(href, label)) {
        trackMetaEvent('Contact', Object.assign({}, baseParams, {
          contact_type: href.indexOf('mailto:') === 0 ? 'email' : href.indexOf('tel:') === 0 ? 'phone' : href.toLowerCase().indexOf('whatsapp') > -1 || href.toLowerCase().indexOf('wa.me') > -1 ? 'whatsapp' : 'contact_click'
        }), 'contact:' + destination + ':' + label);
      }

      if (looksLikeApplication(href, label)) {
        trackMetaEvent('SubmitApplication', Object.assign({}, baseParams, {
          content_name: 'Bewerbung eingereicht'
        }), 'application:' + destination + ':' + label);
      }

      if (looksLikeRegistration(href, label)) {
        trackMetaEvent('CompleteRegistration', Object.assign({}, baseParams, {
          content_name: 'Registrierung abgeschlossen'
        }), 'registration:' + destination + ':' + label);
      }

      if (looksLikeSearch(href, label)) {
        trackMetaEvent('Search', Object.assign({}, baseParams, {
          search_string: label || href || 'Website Suche'
        }), 'search:' + destination + ':' + label);
      }

      if (looksLikeCustomize(href, label)) {
        trackMetaEvent('CustomizeProduct', Object.assign({}, baseParams, {
          content_name: 'Produkt personalisiert'
        }), 'customize:' + destination + ':' + label);
      }

      if (looksLikeLead(href, label) && !looksLikeCalendar(href, label)) {
        trackMetaEvent('Lead', Object.assign({}, baseParams, {
          content_name: 'Lead Aktion',
          lead_type: 'cta_click'
        }), 'lead:cta:' + destination + ':' + label);
      }
    }, true);

    document.addEventListener('submit', function (event) {
      var form = event.target;
      var label = getElementLabel(form) || safeText(form.getAttribute && (form.getAttribute('name') || form.getAttribute('id'))) || 'Formular';
      var action = form && form.getAttribute ? form.getAttribute('action') || '' : '';
      var params = {
        content_name: label,
        form_action: action,
        page_path: window.location.pathname || '/'
      };

      trackMetaEvent('Lead', Object.assign({}, params, { lead_type: 'form_submit' }), 'lead:form:' + label + ':' + action);

      if (looksLikeRegistration(action, label)) {
        trackMetaEvent('CompleteRegistration', params, 'registration:form:' + label + ':' + action);
      }

      if (looksLikeApplication(action, label)) {
        trackMetaEvent('SubmitApplication', params, 'application:form:' + label + ':' + action);
      }

      if (looksLikeSearch(action, label)) {
        var searchInput = form && form.querySelector ? form.querySelector('input[type="search"], input[name*="search"], input[name*="suche"]') : null;
        trackMetaEvent('Search', Object.assign({}, params, { search_string: searchInput ? safeText(searchInput.value) : label }), 'search:form:' + label);
      }
    }, true);
  });
})();
</script>
<!-- End Meta Pixel Code -->`;

const META_PIXEL_NOSCRIPT = `<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1"
/></noscript>`;

const ALLOWED_FILES = new Set([
  'index.html',
  'impressum.html',
  'datenschutz.html',
  'agb.html'
]);

function injectMetaPixel(html) {
  let output = html;

  if (!output.includes(`fbq('init', '${PIXEL_ID}')`)) {
    output = output.replace(/<\/head>/i, `${META_PIXEL_HEAD}\n</head>`);
  }

  if (!output.includes(`tr?id=${PIXEL_ID}`)) {
    output = output.replace(/<body\b[^>]*>/i, (match) => `${match}\n${META_PIXEL_NOSCRIPT}`);
  }

  return output;
}

module.exports = function handler(req, res) {
  const requested = typeof req.query.file === 'string' ? req.query.file : 'index.html';
  const file = ALLOWED_FILES.has(requested) ? requested : 'index.html';
  const filePath = path.join(process.cwd(), file);

  try {
    const html = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(injectMetaPixel(html));
  } catch (error) {
    res.status(500).send('Could not load page.');
  }
};
