# 🔐 Système d'Alerte d'Expiration de Token

## Vue d'ensemble

Ce système alerte les utilisateurs quand leur token JWT est sur le point d'expirer, et leur permet de le renouveler sans se reconnecter.

## 📋 Composants créés

### 1. **Frontend** (`lib/tokenExpiration.ts`)
Utilitaires pour décoder et analyser les tokens JWT:
- `decodeToken()` - Décoder le payload du token
- `getStoredToken()` - Récupérer le token du localStorage
- `getTimeUntilExpiration()` - Obtenir le temps restant en minutes
- `isTokenExpiringSoon()` - Vérifier si le token expire bientôt (< 5 min)
- `isTokenExpired()` - Vérifier si le token a expiré

### 2. **Hook React** (`hooks/useTokenExpiration.ts`)
Hook personnalisé qui:
- Surveille l'expiration du token en temps réel
- Vérifie tous les 60 secondes par défaut
- Retourne: `isExpiringSoon`, `minutesLeft`, `isExpired`
- Écoute les événements de logout

### 3. **Composant d'Alerte** (`components/TokenExpirationAlert.tsx`)
Affiche une notification sticky quand le token expire dans < 5 minutes:
- ✅ Bouton "Renouveler" pour prolonger la session
- ✅ Bouton "✕" pour fermer l'alerte
- ✅ Animations fluides (slide-in/out)
- ✅ Responsive et accessible

### 4. **Endpoint Backend** (`POST /api/auth/refresh`)
Contrôleur: `AuthController.java`
Service: `AuthService.java`

**Requête:**
```bash
POST /api/auth/refresh
Authorization: Bearer {token_actuel}
```

**Réponse:**
```json
{
  "token": "eyJhbGc...",
  "email": "user@example.com",
  "username": "john_doe",
  "role": "USER"
}
```

## 🚀 Comment ça marche

### Flux utilisateur

```
Utilisateur connecté
    ↓
[useTokenExpiration] vérifie chaque 60s
    ↓
Token expire dans < 5 minutes?
    ↓ OUI
[TokenExpirationAlert] s'affiche
    ↓
Utilisateur clique "Renouveler"?
    ↓ OUI
POST /api/auth/refresh
    ↓
Backend génère nouveau token
    ↓
Frontend met à jour localStorage
    ↓
Alerte se ferme ✓
```

### Timeline par défaut

| Événement | Quand |
|-----------|-------|
| Token généré | À la connexion |
| Durée du token | 1 heure (3600000 ms) |
| Alerte affichée | 55 minutes (5 min avant expiration) |
| Token expiré | 60 minutes |
| Auto-logout | Automatique si token expiré |

## 🔧 Configuration

### Modifier le délai d'alerte

```tsx
// Dans app/layout.tsx
<TokenExpirationAlert 
  thresholdMinutes={3}  // Alerte 3 min avant expiration
  position="top"        // ou "bottom"
/>
```

### Modifier la durée du token

```properties
# backend/src/main/resources/application.properties
application.security.jwt.expiration=3600000  # en millisecondes (1h)
```

### Personnaliser l'intervalle de vérification

```tsx
const { isExpiringSoon, minutesLeft } = useTokenExpiration(
  5,        // thresholdMinutes
  30000     // pollInterval (30s au lieu de 60s)
)
```

## 📱 Événements personnalisés

Le système dispatch des événements que vous pouvez écouter:

```typescript
// Quand le token est renouvelé
window.addEventListener('auth:token-refreshed', () => {
  console.log('Token renouvelé!')
})

// Quand l'utilisateur se déconnecte
window.addEventListener('auth:logout', () => {
  console.log('Déconnexion')
})
```

## 🔒 Sécurité

✅ **Tokens HTTP-Only (recommandé)**: Ajouter un cookie HttpOnly côté serveur
✅ **Refresh automatique**: Aucune interaction requise après l'alerte
✅ **Validation backend**: Chaque refresh vérifie l'authentification
✅ **Logout automatique**: Après 401 ou expiration

## 🐛 Dépannage

### L'alerte ne s'affiche pas
- Vérifier que `TokenExpirationAlert` est dans le layout
- Vérifier la valeur de `JWT_EXPIRATION` (doit être > 1000)
- Ouvrir la console: `useTokenExpiration()` affiche les logs

### Le bouton "Renouveler" ne fonctionne pas
- Vérifier que l'endpoint `/api/auth/refresh` existe
- Vérifier l'authentification du request
- Vérifier que `authStore` se met à jour avec le nouveau token

### Le token expire trop vite
- Vérifier `JWT_EXPIRATION` en millisecondes
- Exemple: 3600000 = 1 heure, 1800000 = 30 min

## 📝 Fichiers modifiés

**Frontend:**
```
frontend/
├── lib/
│   └── tokenExpiration.ts          ✨ NOUVEAU
├── hooks/
│   └── useTokenExpiration.ts       ✨ NOUVEAU
├── components/
│   └── TokenExpirationAlert.tsx    ✨ NOUVEAU
└── app/
    └── layout.tsx                  🔄 MODIFIÉ
```

**Backend:**
```
backend/
└── src/main/java/com/djenidi/ai_mentor/
    ├── controller/
    │   └── AuthController.java    🔄 MODIFIÉ (+ endpoint /refresh)
    └── service/
        └── AuthService.java       🔄 MODIFIÉ (+ refreshToken)
```

## ✨ Prochaines étapes (optionnelles)

- [ ] Ajouter un son/notification système
- [ ] Ajouter un countdown visuel
- [ ] Implémenter refresh automatique sans interaction
- [ ] Ajouter des métriques d'expiration
- [ ] Tester avec plusieurs onglets

---

**Statut**: ✅ En production
**Dernière mise à jour**: 2026-04-20
