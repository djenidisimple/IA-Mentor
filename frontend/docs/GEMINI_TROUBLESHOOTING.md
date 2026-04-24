# 🔍 Guide de Diagnostic - Gemini API

## ⚠️ Problème: "Analyse indisponible"

Votre clé API Gemini **EST configurée**, mais l'analyse échoue quand même. Voici pourquoi cela peut arriver et comment diagnostiquer:

---

## 🎯 Causes possibles (par ordre de probabilité)

### 1️⃣ **Quota API dépassé** ⭐ PLUS PROBABLE
- **Symptôme**: Erreur 429 "Rate Limited" ou message de quota
- **Cause**: Google gratuit = 60 requêtes/minute limité
- **Solution**: 
  - Attendre 1 minute
  - Ou activer la facturation sur Google Cloud Console
  - Ou augmenter le quota payant

### 2️⃣ **Clé API révoquée ou expirée**
- **Symptôme**: Erreur 401 "UNAUTHENTICATED"
- **Cause**: Clé supprimée/invalidée du côté Google
- **Solution**: 
  - Vérifier sur [Google AI Studio](https://aistudio.google.com/app/apikeys)
  - Créer une nouvelle clé
  - Mettre à jour `.env`

### 3️⃣ **Permissions insuffisantes**
- **Symptôme**: Erreur 403 "PERMISSION_DENIED"
- **Cause**: Clé n'a pas accès à l'endpoint Gemini 2.0
- **Solution**:
  - Vérifier que le modèle `gemini-2.0-flash` est disponible
  - Vérifier les permissions sur la clé

### 4️⃣ **Fichiers du repository vides ou corrompus**
- **Symptôme**: Analyse lance mais retourne vide
- **Cause**: Repo GitHub mal récupéré ou n'a pas de fichiers
- **Solution**:
  - Vérifier que le repository GitHub est accessible
  - Vérifier qu'il contient des fichiers valides

### 5️⃣ **Réponse Gemini invalide**
- **Symptôme**: Réponse non-JSON ou format incorrect
- **Cause**: Gemini retourne du texte au lieu de JSON
- **Solution**:
  - Vérifier le prompt dans `AnalysisPromptTemplates.java`
  - Tester directement sur [Google AI Studio](https://aistudio.google.com)

### 6️⃣ **Problème réseau**
- **Symptôme**: Erreur "Connection refused"
- **Cause**: Firewall ou VPN bloquant Google API
- **Solution**:
  - Vérifier la connexion réseau
  - Désactiver le VPN
  - Vérifier le firewall

---

## 🔧 Comment diagnostiquer

### Option 1: Tester via l'API (FACILE) 

```bash
# 1. Test simple (pas de login requis)
curl http://localhost:8080/api/gemini/test

# 2. Diagnostic complet (admin uniquement)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/gemini/diagnose
```

**Réponse attendue:**
```json
{
  "apiKeyConfigured": true,
  "connectionSuccessful": true,
  "model": "gemini-2.0-flash",
  "quotaAvailable": true,
  "testMessage": " Simple test successful - Gemini API is reachable",
  "responseTimeMs": 1250
}
```

**Si elle échoue, le message d'erreur vous dira pourquoi:**
- ❌ `QUOTA_EXCEEDED` → Attendre ou activer la facturation
- ❌ `UNAUTHENTICATED` → Clé API invalide
- ❌ `PERMISSION_DENIED` → Permissions insuffisantes
- ❌ `CONNECTION_REFUSED` → Problème réseau

### Option 2: Vérifier les logs (AVANCÉ)

1. **Lancer le backend avec logs DEBUG:**
```bash
# Dans le terminal backend
# Modifier application.properties:
logging.level.com.djenidi=DEBUG
logging.level.org.springframework.web=DEBUG
```

2. **Faire une analyse et chercher:**
```
❌ Gemini analysis failed: ...
❌ Gemini API error: ...
❌ All 3 retry attempts failed!
```

Le message d'erreur vous donnera le détail du problème.

### Option 3: Tester directement Gemini (RECOMMANDÉ)

1. Aller sur [Google AI Studio](https://aistudio.google.com)
2. Copier-coller votre clé API
3. Tester le même prompt que votre app:

```
Analysez ce code et retournez un JSON:
{
  "summary": "...",
  "score": 0-100,
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "codeQualityMetrics": {...}
}
```

Si Gemini répond bien ici, le problème est dans votre config ou réseau.

---

## 🚨 Erreurs courants et solutions

### Erreur: "quotaExceeded"
```
❌ QUOTA_EXCEEDED - Your Google Gemini API quota has been reached
```
**Solution:**
- Plan gratuit: Max 60 req/minute
- Attendre une minute ou activer la facturation sur [Google Cloud](https://console.cloud.google.com)

### Erreur: "UNAUTHENTICATED"
```
❌ UNAUTHENTICATED - API key is invalid, expired, or disabled
```
**Solution:**
- Aller sur [Google AI Studio](https://aistudio.google.com/app/apikeys)
- Supprimer l'ancienne clé
- Créer une nouvelle clé
- Mettre à jour `backend/.env`

### Erreur: "Empty response from Gemini"
```
❌ Gemini returned empty text content
```
**Solution:**
- Le prompt est trop long?
- Vérifier le contenu du repository
- Vérifier que la config JSON est correcte

---

##  Checklist de vérification

- [ ] Clé API dans `backend/.env`?
- [ ] Clé API valide sur [Google AI Studio](https://aistudio.google.com/app/apikeys)?
- [ ] Quota disponible (pas > 60 req/min)?
- [ ] Firewall/VPN autorise Google APIs?
- [ ] Repository GitHub accessible et contient des fichiers?
- [ ] Backend peut se connecter à Gemini (test endpoint)?
- [ ] Les logs backend montrent l'erreur exacte?

---

## 🧪 Commande de test complète

```bash
# 1. Tester la connexion basique
curl -s http://localhost:8080/api/gemini/test | jq

# 2. Si le backend retourne une erreur, check les logs:
# Terminal backend doit afficher:
# ❌ Gemini analysis failed: [RAISON EXACTE]

# 3. Vérifier la clé API Gemini
# https://aistudio.google.com/app/apikeys

# 4. Tester Gemini directement sur Google AI Studio
# https://aistudio.google.com/app/prompts?utm_source=ai-studio
```

---

## 💡 Prochaines étapes

Si le diagnostic montre que tout fonctionne mais l'analyse échoue quand même:

1. **Vérifier le prompt** dans [AnalysisPromptTemplates.java]
2. **Vérifier la parsing** de la réponse
3. **Augmenter les logs** en DEBUG
4. **Contacter le support Google** si la clé API est effectivement invalide

---

**Statut**: 🔍 Guide de diagnostic complet
**Dernière mise à jour**: 2026-04-20
