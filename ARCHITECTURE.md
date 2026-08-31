# FasoViva — Architecture Frontend (webMobile)

Web app React responsive (mobile + desktop, une seule codebase), branchée sur le backend FastAPI/MongoDB (`/api/v1`).

## Stack

- **Vite + React 19 + TypeScript**
- **React Router v7** — routing
- **TanStack Query** — cache/synchronisation des appels API
- **Zustand** — état global (auth, thème), persistance manuelle via `localStorage`
- **i18next / react-i18next** — i18n FR / EN / Mooré (`mo`) / Dioula (`dyu`)
- **Axios** — client HTTP avec intercepteur JWT
- CSS Modules + design tokens CSS (`src/styles/tokens.css`) — thème clair/sombre via `data-theme` + `prefers-color-scheme`

## Structure

```
src/
  app/                    bootstrap: providers, layout, router
    layout/               AppLayout (header desktop), MobileTabBar (nav mobile <768px)
    routes/                router.tsx, ProtectedRoute.tsx
  shared/
    api/                  client axios + intercepteurs JWT, types de réponse génériques (PaginatedResponse, UserPublic...)
    ui/                   design system (Button, Card, Input, Spinner, ThemeToggle, LanguageSwitcher)
    config/                env.ts (variables d'environnement)
  store/                  auth.store.ts, theme.store.ts (zustand)
  styles/                 tokens.css (design tokens), globals.css
  i18n/                   config.ts (init i18next)
  locales/                fr.json, en.json, mo.json, dyu.json
  features/               1 dossier par module métier (mirroring des 47 domaines backend)
    <feature>/
      api/                appels HTTP du domaine (ex: destinations.api.ts)
      hooks/              hooks React Query (useDestinations, useLogin...)
      components/         composants spécifiques au domaine
      pages/              pages routées
      types.ts            types du domaine
```

## Ajouter un nouveau module (ex: Hébergement)

1. `src/features/hotels/{api,hooks,components,pages}/` + `types.ts`
2. `api/hotels.api.ts` → wrap `apiClient` (voir `shared/api/client.ts`), endpoints `/hotels/*`
3. `hooks/useHotels.ts` → `useQuery`/`useMutation` (voir `features/destinations/hooks/useDestinations.ts` comme modèle)
4. `pages/HotelsPage.tsx` → composée de composants `shared/ui` + composants locaux
5. Enregistrer la route dans `app/routes/router.tsx` (sous `ProtectedRoute` si authentification requise)
6. Ajouter les clés de traduction dans les 4 fichiers `locales/*.json`

## Authentification

JWT stateless, `Bearer` token dans le header `Authorization`, stocké dans `localStorage` via `store/auth.store.ts`. Expiration 24h côté backend, pas de refresh token — à la 401, la session est nettoyée automatiquement (`shared/api/client.ts`).

## i18n — état des traductions

FR et EN sont complets. **Mooré et Dioula sont des traductions de base à faire valider par un locuteur natif** avant mise en production — actuellement couvrent uniquement l'UI (navigation, boutons, formulaires auth). Le contenu métier (noms de lieux, descriptions) provient du backend en français uniquement (pas d'i18n de contenu côté API).

## Thème clair/sombre

Tokens définis dans `styles/tokens.css` sous `:root`, `[data-theme='light']`, `[data-theme='dark']`, et `@media (prefers-color-scheme: dark)` pour le mode "système" (par défaut). Piloté par `store/theme.store.ts` (`ThemeMode = 'light' | 'dark' | 'system'`), persisté en `localStorage`.

## Modules livrés dans cette itération

- Auth (login/register, branché sur `/auth/login`, `/auth/register`)
- Destinations / Explorer (branché sur `/destinations`, recherche texte)
- Home
- Layout applicatif complet (header desktop + tab bar mobile, thème, langue)

## Modules restants (43)

À construire en suivant le même pattern feature-based, module par module, en s'appuyant sur les 47 domaines déjà exposés par le backend (voir Swagger `/api/docs`).
