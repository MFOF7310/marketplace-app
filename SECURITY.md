# 🔒 Security Policy

## Versions Supportées

| Version | Support Sécurité |
|---------|-----------------|
| 1.x     | ✅ Active        |

---

## 🚨 Signaler une Vulnérabilité

**Ne pas ouvrir une issue publique pour des failles de sécurité.**

Si vous découvrez une vulnérabilité, merci de la signaler de manière responsable :

1. **Email** — Contactez directement le mainteneur via GitHub
2. **Délai de réponse** — Sous 48 heures
3. **Divulgation** — Coordonnée après correction

---

## 🛡 Bonnes Pratiques de Sécurité

### Variables d'Environnement
- Ne jamais committer les fichiers `.env` dans le repo
- Utiliser uniquement la clé `anon` Supabase côté client (jamais la `service_role`)
- Rotation régulière des tokens et clés API

### Supabase
- Activer **Row Level Security (RLS)** en production sur toutes les tables
- Restreindre les policies aux utilisateurs authentifiés
- Activer la vérification email pour les vendeurs

### Déploiement
- Utiliser HTTPS uniquement (certificat Let's Encrypt)
- Headers de sécurité Nginx recommandés :
  ```nginx
  add_header X-Frame-Options "SAMEORIGIN";
  add_header X-Content-Type-Options "nosniff";
  add_header X-XSS-Protection "1; mode=block";
  add_header Referrer-Policy "strict-origin-when-cross-origin";
  ```

### Données Sensibles
- Ne jamais stocker les numéros de carte bancaire
- Les paiements mobile money se font via les APIs officielles des opérateurs
- Les pièces d'identité pour certification sont traitées hors-plateforme

---

## 📋 Checklist Avant Production

- [ ] RLS activé sur toutes les tables Supabase
- [ ] Variables d'environnement hors du code source
- [ ] HTTPS configuré
- [ ] Headers de sécurité Nginx en place
- [ ] Audit des dépendances (`npm audit`)
- [ ] Tokens GitHub supprimés après usage

---

*Dernière mise à jour : Août 2026*
