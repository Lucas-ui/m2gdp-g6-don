// Valide le contrat OpenAPI et en affiche les volumes.
// Usage : node valider-openapi.cjs specs/openapi.yaml
const SwaggerParser = require('@apidevtools/swagger-parser');

const chemin = process.argv[2];
if (!chemin) {
  console.log('Usage : node valider-openapi.cjs <openapi.yaml>');
  process.exit(2);
}

(async () => {
  try {
    const api = await SwaggerParser.validate(chemin);
    const routes = Object.entries(api.paths);
    let operations = 0;
    for (const [, p] of routes)
      for (const m of ['get', 'post', 'put', 'patch', 'delete']) if (p[m]) operations++;
    console.log(`VALIDE — OpenAPI ${api.openapi}, version ${api.info.version}`);
    console.log(
      `${routes.length} chemins, ${operations} operations, ${Object.keys(api.components.schemas).length} schemas`
    );
  } catch (e) {
    console.log('INVALIDE :', e.message);
    process.exit(1);
  }
})();
