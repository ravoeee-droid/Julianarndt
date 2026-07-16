const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SOURCE_BASE = 'https://raw.githubusercontent.com/ravoeee-droid/Julian-arndt.com/main/';
const workDir = path.join(process.cwd(), '.final-static-build');
const payloadDir = path.join(workDir, 'static-payload');
const expectedSha256 = '2499dcf6dc1e519cd90ba0f547c15e4b47f45334bef75a0a71619e31cffd5c6f';

async function fetchText(relativePath, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(SOURCE_BASE + relativePath, {
        headers: { 'User-Agent': 'julian-arndt-final-production-build' }
      });
      if (!response.ok) throw new Error(`${relativePath}: HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 750 * attempt));
      }
    }
  }
  throw lastError;
}

(async () => {
  fs.rmSync(workDir, { recursive: true, force: true });
  fs.mkdirSync(payloadDir, { recursive: true });

  const files = [
    'assemble-static.js',
    ...Array.from({ length: 8 }, (_, index) => `static-payload/payload-${String(index).padStart(3, '0')}.txt`)
  ];

  const contents = await Promise.all(files.map((file) => fetchText(file)));
  for (let index = 0; index < files.length; index += 1) {
    const destination = path.join(workDir, files[index]);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, contents[index], 'utf8');
  }

  require(path.join(workDir, 'assemble-static.js'));

  const generatedFile = path.join(workDir, 'index.html');
  const generated = fs.readFileSync(generatedFile);
  const sha256 = crypto.createHash('sha256').update(generated).digest('hex');
  if (sha256 !== expectedSha256) {
    throw new Error(`Final website verification failed: ${sha256}`);
  }

  fs.writeFileSync(path.join(process.cwd(), 'index.html'), generated);
  console.log(`Final Julian Arndt website installed: ${generated.length} bytes, SHA-256 ${sha256}`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
