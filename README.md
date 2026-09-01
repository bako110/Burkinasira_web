# BurkinaSira

**BurkinaSira** est le compagnon de voyage pour découvrir le Burkina Faso en toute
sérénité, de la préparation jusqu'au retour.

Le pays des Hommes intègres, c'est **1 080 sites et attraits touristiques
inventoriés** à travers **17 régions** et **47 provinces** : la vieille ville en
banco de Bobo‑Dioulasso, les cascades de Karfiguéla, les pics de Sindou, les
éléphants du ranch de Nazinga, l'artisanat de Ouagadougou, les maisons‑forteresses
du pays lobi… BurkinaSira rassemble tout cela en un seul endroit, avec des
informations fiables et à jour, en **français, anglais, mooré et dioula**.

> Découvrir. Vivre. Partager.

---

## Fonctionnalités

- **Explorer les destinations** — sites naturels, historiques, culturels et
  religieux, musées, villages touristiques et marchés artisanaux, avec photos,
  descriptions, horaires, tarifs et localisation.
- **Trouver où dormir et manger** — hôtels, auberges, campements et maisons
  d'hôtes ; restaurants, maquis et adresses de cuisine locale, filtrables par
  région, ville et budget.
- **Réserver un guide local** — guides francophones et certifiés, avec leurs
  langues, leurs spécialités et leurs tarifs journaliers.
- **Planifier son voyage** — composer son séjour zone par zone (hôtels,
  restaurants, guides, transport, activités), choisir un niveau de confort
  (éco / standard / confort) et obtenir une **estimation de la dépense globale**,
  ventilée par poste. Récapitulatif complet **exportable en PDF**.
- **Itinéraires clés en main** — des parcours composés par la rédaction
  (Ouagadougou 3 j, Bobo‑Dioulasso 4 j, Sud‑Ouest 5 j, safari à Nazinga 2 j) avec
  programme jour par jour, budget indicatif et conseils. Clonables et
  personnalisables dans le planificateur.
- **Voyager bien informé** — conseils pratiques en trois temps (avant le départ,
  sur place, au retour) : visa, vaccins, meilleure saison, argent, sécurité,
  chaleur, us et coutumes, marchandage, carte SIM, numéros d'urgence.
- **Rester connecté et en sécurité** — météo, points de connectivité, services
  financiers, établissements de santé, contacts d'urgence et alertes de sécurité
  par région.
- **Carte BurkinaSira** — carte de voyageur numérique avec QR code de
  vérification, points et badges collectés au fil des découvertes.

---

## Architecture

Ce dépôt contient l'application web / mobile (front). Le projet complet est
réparti en trois dépôts :

| Dépôt | Rôle | Stack |
|---|---|---|
| **webMobile** (ce dépôt) | Application voyageur (web responsive + app Android) | React 19, TypeScript, Vite, React Router, TanStack Query, Zustand, i18next, Leaflet, Capacitor |
| **backend** | API REST | FastAPI (Python), MongoDB (Motor) |
| **admin** | Back‑office de gestion du contenu | React, TypeScript, Vite |

Détails d'organisation du front : voir [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Démarrage

Prérequis : Node 20+.

```bash
npm install
cp .env.example .env.local   # renseigner VITE_API_BASE_URL
npm run dev                  # serveur de dev (http://localhost:5173)
```

Scripts :

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement (HMR) |
| `npm run build` | Vérification TypeScript puis build de production dans `dist/` |
| `npm run preview` | Sert le build de production localement |
| `npm run lint` | Analyse statique (Oxlint) |

### Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `VITE_API_BASE_URL` | URL de base de l'API | `https://api.exemple.com/api/v1` |
| `VITE_APP_NAME` | Nom affiché de l'application | `BurkinaSira` |

---

## Application Android (Capacitor)

Le dossier [`android/`](./android) est le projet natif Capacitor.

```bash
npm run build            # génère dist/
npx cap sync android     # copie le web + les plugins dans le projet Android
cd android
./gradlew assembleRelease   # APK signé   -> app/build/outputs/apk/release/
./gradlew bundleRelease     # AAB (Play Store) -> app/build/outputs/bundle/release/
```

- **Package** : `com.burkinasira.app`
- **Signature** : `android/keystore.properties` pointe vers un keystore local
  (jamais versionné). Le keystore et ses mots de passe doivent être sauvegardés
  hors du dépôt : sans eux, aucune mise à jour Play Store n'est possible.
- **Icône / splash** : générés depuis `public/logo.png` via
  `npx @capacitor/assets generate --android`.

---

## Internationalisation

Les traductions vivent dans [`src/locales/`](./src/locales) : `fr.json` (langue
de référence), `en.json`, `mo.json` (mooré), `dyu.json` (dioula). Toute nouvelle
clé doit être ajoutée au minimum en français et en anglais.

---

## Licence

Projet privé. Tous droits réservés.
