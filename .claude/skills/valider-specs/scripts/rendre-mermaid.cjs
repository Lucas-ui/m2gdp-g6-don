// Rend chaque bloc Mermaid d'un fichier Markdown dans Chromium.
// Usage : node rendre-mermaid.cjs specs/data-model.md [dossier-de-sortie]
// Les PNG vont par defaut dans le dossier temporaire, jamais dans le depot.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');

const fichier = process.argv[2];
if (!fichier) {
  console.log('Usage : node rendre-mermaid.cjs <fichier.md> [dossier-de-sortie]');
  process.exit(2);
}
const sortie = process.argv[3] || os.tmpdir();
const md = fs.readFileSync(fichier, 'utf8');
// \r? : les fichiers extraits par Git sous Windows sont en CRLF.
const blocs = [...md.matchAll(/```mermaid\r?\n([\s\S]*?)```/g)].map((m) => m[1]);

(async () => {
  const nav = await chromium.launch();
  const page = await nav.newPage({ viewport: { width: 1800, height: 1200 } });
  await page.setContent('<html><body style="background:#fff"></body></html>');
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js' });

  let ok = true;
  for (let i = 0; i < blocs.length; i++) {
    const res = await page.evaluate(async ([src, i]) => {
      mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });
      try {
        const { svg } = await mermaid.render('d' + i, src);
        const div = document.createElement('div');
        div.id = 'rendu' + i;
        div.style.cssText = 'display:inline-block;padding:16px';
        div.innerHTML = svg;
        div.querySelector('svg').style.maxWidth = 'none';
        document.body.appendChild(div);
        return 'OK';
      } catch (e) {
        return 'ERREUR : ' + (e.message || e).toString().slice(0, 300);
      }
    }, [blocs[i], i]);

    const type = blocs[i].trim().split(/\r?\n/)[0];
    console.log(`Diagramme ${i + 1} (${type}) : ${res}`);
    if (res !== 'OK') ok = false;
    else
      await page
        .locator('#rendu' + i)
        .screenshot({ path: path.join(sortie, `diagramme-${i + 1}.png`) });
  }
  console.log(`PNG dans ${sortie}`);
  await nav.close();
  process.exit(ok ? 0 : 1);
})();
