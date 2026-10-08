import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Racine du depot, quel que soit le dossier d'ou le script est lance. */
export const RACINE_DEPOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
