# 🔐 Session, expiration et renouvellement du token

## Vue d'ensemble

L'application utilise deux jetons :

| | Access token | Refresh token |
|---|---|---|
| Format | JWT HS256 | UUID opaque, stocké **haché** (SHA-256) en base |
| Durée | 15 min (`application.security.jwt.expiration`) | 90 jours (`application.security.jwt.refresh-expiration`) |
| Transport | Header `Authorization: Bearer` | Cookie `HttpOnly` `refresh_token` |
| Stockage client | Mémoire (store Zustand) — **jamais** dans le localStorage | Cookie, invisible pour JavaScript |
| Stockage serveur | Aucun (stateless) | Table `auth_sessions` (une ligne par appareil) |

## 📋 Composants

### 1. Frontend — `lib/tokenExpiration.ts`
- `decodeToken()` — décode le payload, y compris les JWT en base64url
- `getStoredToken()` — lit le token depuis le store Zustand
- `getSecondsUntilExpiration()` / `getTimeUntilExpiration()`
- `isTokenExpiringSoon()` / `isTokenExpired()`

> Le token n'étant pas persisté, toute lecture doit passer par le store. Une
> ancienne version lisait `localStorage['auth-storage']` et renvoyait donc
> toujours `null`.

### 2. Hook — `hooks/useTokenExpiration.ts`
- vérifie l'expiration toutes les 60 s (configurable)
- déclenche un refresh automatique sous le seuil (5 min par défaut)
- réinitialise son verrou après chaque refresh réussi ou sur `auth:token-refreshed`
- écoute `auth:logout`

### 3. Composant — `components/TokenExpirationAlert.tsx`
Alerte sticky proposant « Renouveler », montée dans `app/layout.tsx`.

### 4. Backend
- `AuthController` : `/api/auth/{register,login,refresh,logout,oauth2/exchange}`
- `RefreshTokenService` : création de session, rotation, révocation, détection de rejeu
- `RefreshTokenCookieService` : attributs du cookie pilotés par propriétés
- `AuthRateLimitFilter` : limite de débit sur les routes d'authentification

**Requête de refresh** (le cookie suffit) :
```http
POST /api/auth/refresh
Cookie: refresh_token=<opaque>
```
**Réponse** :
```json
{ "id": 1, "token": "eyJhbGc...", "email": "user@example.com", "username": "john", "role": "USER" }
```

## 🚀 Flux

```
Connexion / Register / OAuth2
    ↓
JWT 15 min (mémoire) + session en base + cookie HttpOnly 90 j
    ↓
Toutes les requêtes : Authorization: Bearer <JWT>
    ↓ 401
Intercepteur Axios → POST /api/auth/refresh (une seule fois, file d'attente)
    ↓
Rotation du refresh token + nouveau JWT → la requête initiale est rejouée
```

Refresh automatique proactif : l'alerte apparaît quand il reste < 5 min ; avec un
token de 15 min, cela correspond à 10 min d'utilisation.

## 🔒 Sécurité

- Refresh token **haché** en base (aucun token en clair en cas de fuite de dump).
- **Rotation** à chaque refresh + fenêtre de grâce de 30 s (course entre onglets).
- **Détection de rejeu** hors fenêtre : toutes les sessions de l'utilisateur sont révoquées.
- **Multi-appareils** : chaque connexion crée une session ; limite `max-sessions` (10).
- Cookie `HttpOnly`, `SameSite=Strict`, `Path=/api/auth`, `Secure` activable.
- OAuth2 : le JWT ne transite plus dans l'URL, seul un code à usage unique (60 s) est échangé.
- Limitation de débit : 20 requêtes / 60 s / IP sur login, register, refresh, exchange.
- Access token non révocable côté serveur : sa durée courte (15 min) est la contrepartie assumée.

## 🔧 Configuration

```properties
# backend/src/main/resources/application.properties
application.security.jwt.expiration=${JWT_EXPIRATION_MS:900000}          # 15 min
application.security.jwt.refresh-expiration=${JWT_REFRESH_EXPIRATION_DAYS:90}
application.security.jwt.refresh-grace-seconds=${JWT_REFRESH_GRACE_SECONDS:30}
application.security.jwt.max-sessions=${JWT_MAX_SESSIONS:10}
app.cookie.refresh-token.secure=${COOKIE_SECURE:false}                    # true en prod (HTTPS)
app.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:3000}
app.oauth2.redirect-uri=${OAUTH2_REDIRECT_URI:http://localhost:3000/oauth2/callback}
app.rate-limit.auth.max-requests=${AUTH_RATE_LIMIT_MAX_REQUESTS:20}
app.rate-limit.auth.window-seconds=${AUTH_RATE_LIMIT_WINDOW_SECONDS:60}
```

```tsx
// app/layout.tsx
<TokenExpirationAlert thresholdMinutes={5} position="top" />
```

## 🔁 Migration depuis l'ancienne table

L'ancienne table `refresh_tokens` (une session par utilisateur) n'est plus utilisée :
les sessions vivent désormais dans `auth_sessions`, créée automatiquement par
Hibernate (`ddl-auto=update`). Deux conséquences :

- les cookies de refresh émis avant le changement ne sont plus valides :
  **une reconnexion est nécessaire** ;
- l'ancienne table peut être supprimée :

```sql
DROP TABLE IF EXISTS refresh_tokens;
```

## 📱 Événements personnalisés

```typescript
window.addEventListener('auth:token-refreshed', () => console.log('Token renouvelé'))
window.addEventListener('auth:logout', () => console.log('Déconnexion'))
```

## 🐛 Dépannage

| Symptôme | Cause probable |
|---|---|
| Alerte jamais visible | Token absent du store (non connecté) ou seuil > durée restante |
| Boucle de redirection `/login` | Cookie de refresh absent/expiré, ou `CORS_ALLOWED_ORIGINS` incorrect |
| `401` juste après connexion | Cookie non envoyé : vérifier `withCredentials` et l'origine CORS |
| Refresh refusé en production | `COOKIE_SECURE=true` sans HTTPS, ou `SameSite`/domaine inadaptés |
| « Trop de tentatives » (429) | Limite de débit atteinte, attendre la fenêtre configurée |

## 📝 Fichiers

```
frontend/
├── lib/tokenExpiration.ts            # décodage + lecture du store
├── lib/axiosInstance.ts              # refresh silencieux (file d'attente)
├── lib/store/authStore.ts            # token en mémoire + refreshAccessToken
├── hooks/useTokenExpiration.ts       # surveillance périodique
├── components/TokenExpirationAlert.tsx
└── app/oauth2/callback/page.tsx      # échange du code OAuth2

backend/src/main/java/com/djenidi/ai_mentor/
├── controller/AuthController.java
├── service/RefreshTokenService.java
├── entity/AuthSession.java
├── repository/AuthSessionRepository.java
└── security/{RefreshTokenCookieService,OAuth2CodeStore,AuthRateLimitFilter}.java
```

---

**Dernière mise à jour** : 2026-11-15
