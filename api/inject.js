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
