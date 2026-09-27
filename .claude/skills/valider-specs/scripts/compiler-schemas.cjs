// Compile chaque schema du contrat avec Ajv.
// Usage : node compiler-schemas.cjs specs/openapi.yaml
const SwaggerParser = require('@apidevtools/swagger-parser');
const Ajv = require('ajv');

const chemin = process.argv[2];
if (!chemin) {
  console.log('Usage : node compiler-schemas.cjs <openapi.yaml>');
  process.exit(2);
}

(async () => {
  // bundle garde les $ref internes : Categorie, recursif, reste une reference
  // au lieu de devenir une boucle d'objets.
  const api = await SwaggerParser.bundle(chemin);
  // Ajv connait deja le mot-cle `nullable` : ne pas le redeclarer.
  const ajv = new Ajv({ strict: false, logger: false });
  ajv.addSchema({ $id: 'api', components: api.components });

  const noms = Object.keys(api.components.schemas);
  let fautes = 0;
  for (const nom of noms) {
    try {
      ajv.compile({ $ref: `api#/components/schemas/${nom}` });
    } catch (e) {
      fautes++;
      console.log(`FAUTE  ${nom} : ${e.message}`);
    }
  }
  console.log(fautes ? `${fautes} schema(s) fautif(s)` : `Les ${noms.length} schemas compilent sans faute`);
  process.exit(fautes ? 1 : 0);
})();
