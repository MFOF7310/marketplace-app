# 🛍 Woko — Multi-Vendor Marketplace

> Le marché en ligne pour l'Afrique de l'Ouest. Boutiques certifiées, livraison, prise de rendez-vous.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Supabase-green)
![License](https://img.shields.io/badge/license-MIT-orange)

---

## ✨ Fonctionnalités

### Côté Acheteur
- 🔍 **Catalogue & Recherche** — Parcourir produits et services, filtrer par catégorie
- 🏪 **Boutiques Vendeurs** — Profil certifié, catalogue dédié, zone de livraison
- 🛒 **Panier & Commande** — Tunnel d'achat simple avec choix de zone
- 💳 **Paiement Mobile** — Orange Money, Wave, Moov Money
- 📅 **Prise de Rendez-vous** — Calendrier par créneau pour les prestations de service

### Côté Vendeur
- 🏷 **Profil Vitrine** — Page publique avec badge de certification
- 📦 **Gestion Catalogue** — Ajouter, modifier, supprimer produits et services
- 📋 **Suivi Commandes** — Tableau de bord des achats à expédier
- 🗓 **Gestion RDV** — Vue des rendez-vous à venir

### Général
- 🌙 **Dark / Light Mode** — Automatique (système) + toggle manuel
- 📱 **Responsive** — Optimisé mobile-first
- 🔒 **Certification Manuelle** — Validation d'identité par l'équipe

---

## 🛠 Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | React 18 + Vite |
| UI | CSS-in-JS (tokens custom) |
| Icônes | Lucide React |
| Backend | Supabase (PostgreSQL) |
| Paiement | Orange Money · Wave · Moov Money |
| Hébergement | VPS Nginx (statique) |

---

## 🚀 Installation

```bash
# Cloner le repo
git clone https://github.com/askami2k22-blip/marketplace-app.git
cd marketplace-app

# Installer les dépendances
npm install

# Variables d'environnement
cp .env.example .env
# Remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY

# Lancer en développement
npm run dev

# Build production
npm run build
```

---

## ⚙️ Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Récupérer `Project URL` et `anon public key` dans **Settings → API**
3. Les ajouter dans `.env` :

```env
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### Schéma Base de Données

```sql
-- Vendeurs
CREATE TABLE vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  city TEXT,
  certified BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Produits & Services
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('produit', 'service')) NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Commandes
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

-- Rendez-vous
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id),
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);
```

---

## 📁 Structure du Projet

```
marketplace-app/
├── public/
├── src/
│   ├── App.jsx          # Application principale
│   ├── main.jsx         # Point d'entrée
│   └── index.css        # Reset CSS
├── index.html
├── vite.config.js
└── package.json
```

---

## 🗺 Roadmap

- [ ] Intégration Supabase (données réelles)
- [ ] Authentification vendeurs (email/phone)
- [ ] Intégration API Orange Money & Wave
- [ ] Système de notifications (commandes, RDV)
- [ ] Upload photos produits (Supabase Storage)
- [ ] Panneau admin certification
- [ ] PWA (Progressive Web App)

---

## 🤝 Contribuer

Les contributions sont les bienvenues !

1. Fork le projet
2. Crée une branche (`git checkout -b feature/ma-feature`)
3. Commit tes changements (`git commit -m 'feat: ma feature'`)
4. Push (`git push origin feature/ma-feature`)
5. Ouvre une Pull Request

---

## 📄 Licence

MIT © 2026 [askami2k22-blip](https://github.com/askami2k22-blip)

---

## 🙏 Remerciements

Construit avec ❤️ pour les entrepreneurs d'Afrique de l'Ouest.
