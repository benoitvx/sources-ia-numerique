# CLAUDE.md — sources.ia.numerique.gouv.fr

> Référentiel national des données publiques AI-ready

---

## Context

**sources.ia.numerique.gouv.fr** est le portail officiel qui référence les sources de données publiques françaises exploitables par l'IA. Pour chaque source de données, il indique les formats de consommation disponibles (statut, provenance, lien direct, lien vers tutoriel d'intégration).

Le site **ne produit aucun format** — il référence l'existant.

Projet porté par le département IAE (Intelligence Artificielle dans l'État) de la DINUM.

## Language

| Context | Language |
|---------|----------|
| Source code (variables, functions, types) | English |
| Code comments | English |
| Commit messages | **Français** |
| Pull/Merge Requests | **Français** |
| User interface | **Français** |

---

## Comportement attendu

### Plan Mode

Pour toute tâche non triviale (3+ étapes ou décision architecturale) :

1. Écrire le plan dans `tasks/todo.md` avec des items cochables
2. Valider le plan avant d'implémenter
3. Marquer les items comme terminés au fur et à mesure
4. Ajouter une section "résultat" à la fin de `tasks/todo.md`

Si quelque chose déraille en cours de route : **STOP** et replanifier avant de continuer.

### Gestion des tâches (`tasks/`)

```
tasks/
├── todo.md      # Plan en cours : items cochables, résultat final
└── lessons.md   # Patterns d'erreurs rencontrés sur ce projet
```

`tasks/todo.md` est réinitialisé à chaque nouvelle tâche. `tasks/lessons.md` est cumulatif.

### Self-Improvement Loop

Après toute correction de l'utilisateur :
- Mettre à jour `tasks/lessons.md` avec le pattern d'erreur et la règle à retenir
- Relire `tasks/lessons.md` en début de session pour éviter de reproduire les mêmes erreurs

### Correction de bugs

Face à un bug : corriger directement. Pointer les logs, erreurs et tests qui échouent — puis résoudre sans demander de guidage pas à pas.

### Qualité du code

Pour tout changement non trivial, se poser la question : **"Y a-t-il une solution plus élégante ?"**

Si un fix semble hacky : *"Knowing everything I know now, implement the elegant solution."*

Ne pas appliquer aux corrections simples et évidentes — pas d'over-engineering.

---

## Architecture

### Site statique

Le portail est un **site statique** généré par Next.js (SSG). Les fiches sources de données sont déclaratives (YAML) et compilées en pages statiques au build.

```
src/
├── data/                        # Fiches sources de données (YAML)
│   ├── data-gouv.yaml
│   ├── legifrance.yaml
│   ├── ...
│   └── dsfr.yaml
├── app/
│   ├── page.tsx                 # Page d'accueil : présentation + référentiel
│   ├── sources/
│   │   └── [id]/page.tsx        # Fiche source de données
│   └── en-savoir-plus/page.tsx  # Contexte, gouvernance, présentation détaillée
├── components/
│   ├── Header.tsx               # Header DSFR avec bouton "Demander une source de données"
│   ├── SourceCard.tsx           # Carte résumé d'une source (formats, statuts)
│   ├── SourceTable.tsx          # Vue matrice : toutes les sources × 6 formats (hors site_web)
│   ├── SourceFilter.tsx         # Filtres par format + bascule vue tableau/liste (client component)
│   ├── FormatBadge.tsx          # Badge statut format (✅/☑️/🚧/❌/N/A)
│   └── FormatTable.tsx          # Tableau des formats d'une source (fiche détail)
├── lib/
│   ├── sources.ts               # Chargement et validation des fichiers YAML
│   └── types.ts                 # Types TypeScript (Source, Format, Status, etc.)
└── __tests__/
    ├── sources.test.ts          # Tests unitaires : chargement, validation YAML
    ├── compliance.test.ts       # Tests conformité : schéma des sources, formats requis
    └── e2e/
        └── navigation.spec.ts   # Tests E2E : navigation, fiches, filtres
```

### Stack

| Composant | Choix |
|-----------|-------|
| Framework | **Next.js** (App Router, `output: 'export'` pour SSG) |
| Design System | **@codegouvfr/react-dsfr** |
| Données | Fichiers YAML dans `src/data/` |
| Validation | **Zod** (schéma des fiches sources) |
| Tests unitaires | **Vitest** |
| Tests E2E | **Playwright** |
| Package manager | **pnpm** |
| Hébergement | Infrastructure DINUM |
| TypeScript | Strict mode |
| Formatting | Prettier (single quotes) |
| Linting | ESLint with TypeScript rules |

---

## Gestion du contenu

### Principe

Toutes les données du site sont gérées via des **fichiers YAML dans le repo**. Ajouter ou modifier une source de données = éditer un fichier YAML + ouvrir une PR. Le build valide automatiquement le schéma.

### Cycle de vie d'une source de données

1. **Demande** : un utilisateur soumet une demande via le formulaire Grist (bouton "Demander une source de données")
2. **Instruction** : l'équipe évalue la demande (formats disponibles, provenance, qualité)
3. **Ajout** : création d'un fichier YAML dans `src/data/`, PR + review
4. **Validation CI** : le schéma Zod valide la fiche, les tests passent
5. **Déploiement** : merge → build → publication automatique

### Fichiers YAML — Fiche source de données

Chaque source est un fichier YAML dans `src/data/`. Le schéma est validé par Zod au build et en CI.

```yaml
id: legi
nom: Légifrance — Codes et lois en vigueur
source: Direction de l'information légale et administrative (DILA)
description: >
  Législation française consolidée : lois, codes, décrets, circulaires,
  ordonnances, arrêtés ministériels depuis 1945. Tous les statuts
  (en vigueur, modifié, abrogé, annulé, etc.).
licence: Licence Ouverte v2.0
mise_a_jour: Quotidienne
derniere_maj: "2026-03-25"
volumes:
  documents: 95000
  chunks: 450000
formats:
  site_web:
    statut: officiel          # officiel | tiers | wip | indisponible
    url: https://legifrance.gouv.fr
    tutoriel: null            # URL vers un tutoriel d'intégration (ou null)
  api:
    statut: officiel
    url: https://www.data.gouv.fr/dataservices/legifrance
    tutoriel: null
  parquet:
    statut: officiel
    url: https://huggingface.co/datasets/AgentPublic/legi
    tutoriel: null
  mcp:
    statut: wip
  cli:
    statut: indisponible
  skill:
    statut: indisponible
  albert_api:
    statut: officiel
    url: https://albert.api.gouv.fr
    tutoriel: https://doc.incubateur.net/alliance/albert-api/guides/collections-documents
tags:
  - juridique
  - lois
  - codes
  - droit
```

### Ajouter une nouvelle source de données

1. Créer `src/data/{id}.yaml` en suivant le schéma ci-dessus
2. Remplir les métadonnées et les formats disponibles
3. Pour chaque format, choisir le bon statut (`officiel`, `tiers`, `wip`, `indisponible`, `na`) et remplir les champs requis
4. Ajouter les URLs de tutoriels quand ils existent (liens externes)
5. Lancer `pnpm test` pour valider le schéma
6. Ouvrir une PR sur la branche `data/{id}`

### Tutoriels d'intégration

Les tutoriels sont des **liens externes** — le site ne les héberge pas. Chaque format d'une source peut pointer vers un tutoriel existant (documentation officielle, article de blog, README GitHub, etc.). Le champ `tutoriel` dans le YAML est une URL ou `null`.

### Formats référencés (7)

| Format | Clé YAML | Usage |
|--------|----------|-------|
| Site web | `site_web` | Consultation humaine, documentation |
| API REST | `api` | Intégration applicative |
| Parquet | `parquet` | Fine-tuning, data science |
| MCP | `mcp` | Agents IA, assistants |
| CLI | `cli` | Scripting, pipelines |
| Skill | `skill` | Assistants de code |
| Collection Albert API | `albert_api` | RAG as a service, Assistant IA |

### Statuts (union discriminée)

Le champ `statut` détermine la structure de chaque format via une union discriminée Zod :

| Statut | Emoji | Signification | Champs requis |
|--------|-------|---------------|---------------|
| `officiel` | ✅ | Produit par l'administration responsable | `url` (obligatoire) |
| `tiers` | ☑️ | Initiative tierce reconnue et référencée | `url` + `tiers_label` (obligatoires) |
| `wip` | 🚧 | En cours de développement | `url` (optionnel) |
| `indisponible` | ❌ | Non disponible | `url` (optionnel) |

Tous les statuts acceptent un champ optionnel `tutoriel` (URL ou null).

---

## Pages du site

### `/` — Page d'accueil

- Présentation courte du dispositif (pitch en 30 secondes)
- Référentiel des sources de données directement accessible
- Filtres par format avec persistance dans l'URL (query params)
- Deux modes de vue : **tableau** (matrice sources × formats) et **liste** (cartes individuelles)
- Chaque source affiche les formats disponibles sous forme de badges

### `/sources/{id}` — Fiche source de données

- Description et métadonnées
- Tableau des formats avec statut, provenance et lien direct
- Lien vers un tutoriel d'intégration pour chaque format disponible
- Exemples de requêtes / prompts

### `/en-savoir-plus` — Présentation détaillée

- Contexte et enjeux
- Gouvernance du référentiel
- Positionnement par rapport à data.gouv.fr

### Header

- Logo DSFR + titre "sources.ia.numerique.gouv.fr"
- Navigation : Accueil, En savoir plus
- Bouton "Demander une source de données" → lien vers formulaire Grist (URL à définir)

---

## Design System — DSFR

Le [DSFR](https://www.systeme-de-design.gouv.fr/) est **obligatoire**. Utiliser `@codegouvfr/react-dsfr`.

Ref : https://github.com/codegouvfr/react-dsfr

**Règles :**
- JAMAIS de composant custom si un équivalent DSFR existe
- Toujours vérifier la doc DSFR et react-dsfr avant d'implémenter
- Utiliser les couleurs et espacements DSFR (pas de valeurs hardcodées)
- Importer les composants depuis `@codegouvfr/react-dsfr`

**Composants react-dsfr à utiliser :**
- `Header` pour le header avec le bouton d'action rapide
- `Card` pour les cartes sources de données
- `Badge` pour les statuts de format
- `Table` pour le tableau des formats dans les fiches
- `Tag` pour les tags/filtres
- `Callout` pour les mises en avant
- `Tabs` si besoin de grouper des informations

Ref composants DSFR : https://www.systeme-de-design.gouv.fr/version-courante/fr/composants
Ref react-dsfr : https://components.react-dsfr.codegouv.studio/

---

## Tests & Definition of Done

### Definition of Done

Une tâche n'est terminée que lorsque les 3 étapes sont validées, dans l'ordre :

1. **Tests automatisés** : `pnpm validate` passe (lint + type-check + tests unitaires)
2. **Vérification visuelle** : ouvrir la page concernée via MCP Chrome DevTools, vérifier le rendu, la navigation et les interactions
3. **Corrections** : si un problème est constaté (tests ou visuel), corriger et reprendre à l'étape 1

Ne jamais considérer un développement terminé sur la seule base du code — le rendu navigateur fait foi.

### Commandes

```bash
pnpm dev               # Serveur de dev
pnpm test              # Tests unitaires (Vitest)
pnpm test:e2e          # Tests E2E (Playwright)
pnpm test:coverage     # Couverture
pnpm validate          # Lint + type-check + tests
```

### Tests de conformité (`compliance.test.ts`)

Valident que chaque fichier YAML dans `src/data/` respecte le schéma attendu :

```typescript
// Exemples de tests de conformité
describe('Source data compliance', () => {
  it('every YAML file in src/data/ must match the Zod schema', () => {
    // Charge tous les .yaml, parse avec Zod, aucune erreur attendue
  })

  it('every source must have an id matching its filename', () => {
    // data-gouv.yaml → id: data-gouv
  })

  it('every available format must have required fields per status', () => {
    // officiel → url requis, tiers → url + tiers_label requis
  })

  it('every source must have at least one available format', () => {
    // Au moins un format avec statut !== indisponible
  })

  it('tutoriel URLs must be valid URLs or null', () => {
    // Validation des liens tutoriels
  })
})
```

### CI — GitHub Actions

**`ci.yml`** — Validation sur chaque push et PR : lint, type-check, tests, build.

**`pages.yml`** — Déploiement automatique sur GitHub Pages au push sur `main`. Le build utilise `PAGES_BASE_PATH=/sources-ia-numerique` et publie le dossier `out/`.

### Génération llms.txt

Le script `scripts/generate-llms-txt.ts` génère deux fichiers conformes à [llmstxt.org](https://llmstxt.org/) à partir des fichiers YAML :

- `public/llms.txt` — vue concise (liste des sources et formats disponibles)
- `public/llms-full.txt` — fiches détaillées (descriptions, URLs, tutoriels, volumes)

Le script s'exécute automatiquement en `prebuild` (avant `pnpm build`). Les fichiers générés sont gitignorés.

### Couverture

- 90%+ sur `lib/sources.ts` (chargement et validation des YAML)
- 100% sur les tests de conformité (chaque règle de schéma testée)
- Tests E2E : navigation page d'accueil → fiche source → retour

---

## Accessibilité — RGAA

RGAA 4.2 (WCAG 2.1 AA) obligatoire.
Ref : https://accessibilite.numerique.gouv.fr/

- `alt` uniquement sur les images informatives, `alt=""` pour les décoratives
- Hiérarchie de titres h1-h6 stricte, sans saut de niveau
- Navigation clavier fonctionnelle
- Chaque input a un `<label for="...">` ou `aria-label`
- Contrastes : 4.5:1 minimum (texte), 3:1 (composants d'interface)
- `@codegouvfr/react-dsfr` est conforme par défaut — ne pas le contourner

---

## Sécurité — ANSSI

- Aucun secret, clé API ou mot de passe dans le code
- Variables d'environnement non commitées
- Toutes les entrées validées (Zod)
- Pas de `console.log` en production
- Dépendances à jour, sans vulnérabilités connues

Ref : https://cyber.gouv.fr/les-regles-de-securite

---

## Sources de données (12)

| ID | Nom |
|----|-----|
| `data-gouv` | Data.gouv |
| `legi` | Légifrance |
| `service-public-etat` | Annuaire du Service Public — Administrations de l'État |
| `service-public-local` | Annuaire du Service Public — Administrations locales |
| `cnil` | CNIL |
| `dole` | Dossiers législatifs (DOLE) |
| `fiches-sp` | Fiches pratiques service-public.fr |
| `constit` | Délibérations du Conseil constitutionnel |
| `travail-emploi` | Fiches Travail Emploi |
| `parlement` | Parlement (Assemblée nationale & Sénat) |
| `anssi` | ANSSI |
| `dsfr` | Design Système de l'État |

---

## Pre-commit (Husky)

`pnpm validate` tourne à chaque commit via Husky. Ne jamais bypasser avec `--no-verify` — si le hook échoue, corriger le problème sous-jacent.

---

## Dépendances

**Ne jamais ajouter de dépendance sans validation explicite.** Avant d'installer un nouveau package :
- Vérifier si la fonctionnalité existe déjà dans la stack actuelle ou dans le DSFR
- Préférer les API standard du navigateur ou de Node.js quand c'est possible
- Demander validation avant de lancer `pnpm add`

---

## Git

### Commits

Format : `type: Description en français`

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation |
| `refactor` | Refactoring sans changement fonctionnel |
| `test` | Ajout ou modification de tests |
| `chore` | Maintenance, config, CI |
| `data` | Ajout/modification d'une fiche source de données |

### Branches

```
feat/description-courte
fix/description-courte
data/nom-source
```

---

## Open Source

- Code 100% public
- Licence : MIT
- Pas de dépendance à des services propriétaires
- Formats ouverts et standards (YAML, Parquet, MCP, REST)

---

## Skills disponibles

Les [skills-etat](https://github.com/numerique-gouv/skills-etat) fournissent des compétences spécialisées :

- **react-dsfr** — Référence complète des composants `@codegouvfr/react-dsfr` avec patterns et exemples
- **rgaa** — Audit accessibilité 106 critères RGAA
- **securite-anssi** — Checklist sécurité ANSSI 12 règles

---

## Ressources

- [react-dsfr — Composants](https://components.react-dsfr.codegouv.studio/)
- [DSFR — Documentation officielle](https://www.systeme-de-design.gouv.fr/)
- [RGAA 4.2](https://accessibilite.numerique.gouv.fr/)
- [ANSSI — Règles de sécurité](https://cyber.gouv.fr/les-regles-de-securite)
- [Next.js — App Router](https://nextjs.org/docs/app)
