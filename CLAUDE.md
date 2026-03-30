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
│   ├── FormatBadge.tsx          # Badge statut format (✅/🚧/❌)
│   └── FormatTable.tsx          # Tableau des formats d'une source
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
  Ensemble des codes et lois en vigueur de la République française,
  nettoyés et structurés pour exploitation IA.
licence: Licence Ouverte v2.0
mise_a_jour: Quotidienne
derniere_maj: 2026-03-25
volumes:
  documents: 95000
  chunks: 450000
formats:
  site_web:
    statut: disponible        # disponible | experimental | indisponible
    url: https://legifrance.gouv.fr
    provenance: officielle    # officielle | validée
    tutoriel: null            # URL vers un tutoriel d'intégration (ou null)
  api:
    statut: disponible
    url: https://api.legifrance.gouv.fr
    provenance: officielle
    tutoriel: https://developer.aife.economie.gouv.fr/
  parquet:
    statut: disponible
    url: https://huggingface.co/datasets/AgentPublic/mediatech-legi
    provenance: officielle
    tutoriel: null
  mcp:
    statut: disponible
    url: données-ai-gouv/legi
    provenance: officielle
    tutoriel: null
  cli:
    statut: indisponible
  skill:
    statut: disponible
    url: "@skills-etat/legi"
    provenance: officielle
    tutoriel: null
  albert_api:
    statut: indisponible
tags:
  - juridique
  - lois
  - codes
  - droit
```

### Ajouter une nouvelle source de données

1. Créer `src/data/{id}.yaml` en suivant le schéma ci-dessus
2. Remplir les métadonnées et les formats disponibles
3. Pour chaque format disponible, renseigner l'URL et la provenance
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

### Provenance

- **officielle** : produite et maintenue par l'administration responsable
- **validée** : initiative tierce reconnue et référencée

### Statuts

- `disponible` → ✅
- `experimental` → 🚧
- `indisponible` → ❌

---

## Pages du site

### `/` — Page d'accueil

- Présentation courte du dispositif (pitch en 30 secondes)
- Référentiel des sources de données directement accessible (filtres par type, format, provenance)
- Chaque source affiche une carte avec les formats disponibles sous forme de badges

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

  it('every available format must have a url and provenance', () => {
    // Si statut = disponible ou experimental → url et provenance requis
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

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test
      - run: pnpm build
```

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

## Sources de données initiales (12)

| ID | Nom |
|----|-----|
| `data-gouv` | Data.gouv |
| `legi` | Légifrance |
| `service-public` | Annuaire du Service Public |
| `cnil` | CNIL |
| `dole` | Dossiers législatifs (DOLE) |
| `fiches-sp` | Fiches pratiques service-public.fr |
| `constit` | Délibérations du Conseil constitutionnel |
| `travail-emploi` | Fiches Travail Emploi |
| `senat` | Sénat |
| `assemblee` | Assemblée Nationale |
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
