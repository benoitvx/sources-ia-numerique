# Ajout de llms.txt au site sources.ia.numerique.gouv.fr

## Tâches

- [x] Créer `scripts/generate-llms-txt.ts` — script de génération
- [x] Ajouter le script prebuild dans `package.json`
- [x] Ajouter `public/llms.txt` et `public/llms-full.txt` au `.gitignore`
- [x] Tester : génération OK, 12 sources
- [x] `pnpm validate` passe (lint + type-check + 13 tests)

## Résultat

Fichiers créés/modifiés :
- `scripts/generate-llms-txt.ts` — génère les deux fichiers depuis les YAML
- `package.json` — ajout de `"prebuild": "npx tsx scripts/generate-llms-txt.ts"`
- `.gitignore` — ajout de `public/llms.txt` et `public/llms-full.txt`

Fichiers générés au build :
- `public/llms.txt` (40 lignes) — vue concise avec liste des sources et formats
- `public/llms-full.txt` (295 lignes) — fiches détaillées avec descriptions, URLs, tutoriels
