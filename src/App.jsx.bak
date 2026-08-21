import { useState, useEffect } from "react";
import {
  Search, ShoppingCart, CalendarDays, Truck, CheckCircle2,
  Plus, Minus, Trash2, Clock, ArrowLeft, BadgeCheck,
  Pencil, ClipboardList, Sun, Moon, Store, Shirt, Scissors,
  Smartphone, Zap, UtensilsCrossed, Sparkles, Droplet,
  Palette, Wrench, X, ChevronRight
} from "lucide-react";

/* ─────────────── THEME ─────────────── */
const LIGHT = {
  bg: "#F8F5F0", card: "#FFFFFF", border: "#E8E0D0",
  text: "#1A1A1A", sub: "#6B6560", indigo: "#3949AB",
  indigoBg: "#E8EAF6", green: "#2E7D32", greenBg: "#E8F5E9",
  orange: "#E65100", orangeBg: "#FFF3E0", muted: "#9E9E9E",
  header: "#FFFFFF", tag: "#F5F5F5",
};
const DARK = {
  bg: "#121212", card: "#1E1E1E", border: "#2C2C2C",
  text: "#F0F0F0", sub: "#9E9E9E", indigo: "#7986CB",
  indigoBg: "#1A237E33", green: "#66BB6A", greenBg: "#1B5E2033",
  orange: "#FFA726", orangeBg: "#E6510022", muted: "#616161",
  header: "#1A1A1A", tag: "#2A2A2A",
};

const money = (n) => Number(n).toLocaleString("fr-FR") + " FCFA";

/* ─────────────── DATA ─────────────── */
const CATEGORIES = ["Tous", "Mode & Textile", "Électronique", "Restauration", "Beauté & Bien-être", "Artisanat", "Services à domicile"];

const VENDORS = [
  { id: "v1", name: "Aïcha Couture", category: "Mode & Textile", certified: true, zone: "Bamako, ACI 2000", desc: "Couturière spécialisée en tenues wax sur-mesure et retouches express.", initials: "AC", color: "#3949AB" },
  { id: "v2", name: "TechFix Mali", category: "Électronique", certified: true, zone: "Bamako, Hamdallaye", desc: "Réparation smartphones, vente d'accessoires, diagnostics garantis 30 jours.", initials: "TM", color: "#00695C" },
  { id: "v3", name: "Chez Mariam", category: "Restauration", certified: false, zone: "Bamako, Magnambougou", desc: "Cuisine malienne maison, plats du jour préparés chaque matin.", initials: "CM", color: "#E65100" },
  { id: "v4", name: "Beauté Awa", category: "Beauté & Bien-être", certified: true, zone: "Bamako, Badalabougou", desc: "Soins visage et corps, produits capillaires naturels.", initials: "BA", color: "#AD1457" },
  { id: "v5", name: "Artisan Bogolan", category: "Artisanat", certified: true, zone: "Ségou", desc: "Textiles traditionnels tissés et teints à la main, pièces uniques.", initials: "AB", color: "#4527A0" },
  { id: "v6", name: "Plombier Express", category: "Services à domicile", certified: false, zone: "Bamako, Lafiabougou", desc: "Interventions plomberie rapides, devis gratuit avant intervention.", initials: "PE", color: "#1565C0" },
];

const PRODUCTS = [
  { id: "p1", vendorId: "v1", title: "Robe wax sur-mesure", price: 35000, type: "produit", category: "Mode & Textile" },
  { id: "p2", vendorId: "v1", title: "Retouche express (48h)", price: 5000, type: "service", category: "Mode & Textile" },
  { id: "p3", vendorId: "v2", title: "Réparation écran smartphone", price: 15000, type: "service", category: "Électronique" },
  { id: "p4", vendorId: "v2", title: "Chargeur rapide USB-C 65W", price: 8000, type: "produit", category: "Électronique" },
  { id: "p5", vendorId: "v3", title: "Attiéké poisson braisé", price: 2500, type: "produit", category: "Restauration" },
  { id: "p6", vendorId: "v4", title: "Soin visage relaxant (1h)", price: 12000, type: "service", category: "Beauté & Bien-être" },
  { id: "p7", vendorId: "v4", title: "Huile de karité bio 250ml", price: 3000, type: "produit", category: "Beauté & Bien-être" },
  { id: "p8", vendorId: "v5", title: "Nappe bogolan tissée main", price: 22000, type: "produit", category: "Artisanat" },
  { id: "p9", vendorId: "v6", title: "Intervention plomberie urgente", price: 10000, type: "service", category: "Services à domicile" },
];

const ZONES = [
  { id: "centre", label: "Bamako Centre", fee: 500 },
  { id: "peripherie", label: "Bamako Périphérie", fee: 1000 },
  { id: "interieur", label: "Intérieur Mali", fee: 2500 },
];

const PAYMENTS = [
  { id: "orange", label: "Orange Money", color: "#FF6600" },
  { id: "moov", label: "Moov Money", color: "#0057B8" },
  { id: "wave", label: "Wave", color: "#1DC9E0" },
];

const DAYS = ["Lun 24", "Mar 25", "Mer 26", "Jeu 27", "Ven 28", "Sam 29"];
const SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
const SLOT_TAKEN = { "Lun 24-09:00": true, "Mar 25-15:00": true };

/* ─────────────── MAIN APP ─────────────── */
export default function App() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [dark, setDark] = useState(prefersDark);
  const T = dark ? DARK : LIGHT;

  const [role, setRole] = useState("buyer");
  const [screen, setScreen] = useState("home");
  const [screenId, setScreenId] = useState(null);
  const [cart, setCart] = useState([]);
  const [zone, setZone] = useState("centre");
  const [payment, setPayment] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [bookDay, setBookDay] = useState(null);
  const [bookSlot, setBookSlot] = useState(null);
  const [sellerProducts, setSellerProducts] = useState(PRODUCTS.filter(p => p.vendorId === "v1"));
  const [sellerTab, setSellerTab] = useState("catalogue");
  const [showAdd, setShowAdd] = useState(false);
  const [newP, setNewP] = useState({ title: "", price: "", type: "produit" });
  const [orders, setOrders] = useState([
    { id: 1, client: "Awa K.", produit: "Robe wax sur-mesure", montant: 35000, statut: "a_expedier" },
    { id: 2, client: "Jean-Marc D.", produit: "Retouche express", montant: 5000, statut: "a_expedier" },
    { id: 3, client: "Nadège P.", produit: "Robe wax sur-mesure", montant: 35000, statut: "expediee" },
  ]);
  const [appts] = useState([
    { id: 1, client: "Marie C.", service: "Retouche express", date: "24 août", heure: "10:00" },
    { id: 2, client: "Fatoumata S.", service: "Essayage robe", date: "25 août", heure: "14:00" },
  ]);

  const go = (s, id = null) => { setScreen(s); setScreenId(id); setBookDay(null); setBookSlot(null); };
  const findP = (id) => [...PRODUCTS, ...sellerProducts].find(p => p.id === id);
  const findV = (id) => VENDORS.find(v => v.id === id);

  const addCart = (pid) => setCart(prev => {
    const ex = prev.find(i => i.pid === pid);
    return ex ? prev.map(i => i.pid === pid ? { ...i, qty: i.qty + 1 } : i) : [...prev, { pid, qty: 1 }];
  });
  const updQty = (pid, d) => setCart(prev => prev.map(i => i.pid === pid ? { ...i, qty: i.qty + d } : i).filter(i => i.qty > 0));
  const remCart = (pid) => setCart(prev => prev.filter(i => i.pid !== pid));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + (findP(i.pid)?.price || 0) * i.qty, 0);
  const delivFee = ZONES.find(z => z.id === zone)?.fee || 0;
  const total = subtotal + (cart.length ? delivFee : 0);

  const filtered = PRODUCTS.filter(p =>
    (category === "Tous" || p.category === category) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const css = (styles) => Object.entries(styles).reduce((acc, [k, v]) => acc + `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v};`, '');

  /* ── STYLES ── */
  const s = {
    app: { minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Inter', 'Segoe UI', sans-serif", transition: "background 0.2s, color 0.2s" },
    header: { background: T.header, borderBottom: `1px solid ${T.border}`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
    logo: { fontWeight: 700, fontSize: 20, color: T.indigo, letterSpacing: "-0.5px" },
    headerRight: { display: "flex", alignItems: "center", gap: 8 },
    iconBtn: { background: T.tag, border: "none", borderRadius: 8, padding: "8px", cursor: "pointer", color: T.text, display: "flex", alignItems: "center", justifyContent: "center" },
    roleToggle: { display: "flex", background: T.tag, borderRadius: 20, padding: 3, gap: 2 },
    roleBtn: (active) => ({ background: active ? T.indigo : "transparent", color: active ? "#fff" : T.sub, border: "none", borderRadius: 16, padding: "6px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }),
    cartBtn: { position: "relative", background: T.tag, border: "none", borderRadius: 8, padding: 8, cursor: "pointer", color: T.text },
    cartBadge: { position: "absolute", top: -4, right: -4, background: "#E53935", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
    container: { maxWidth: 640, margin: "0 auto", padding: "16px 16px 80px" },
    hero: { background: T.indigo, borderRadius: 16, padding: "28px 20px", marginBottom: 20, textAlign: "center" },
    heroTitle: { color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 },
    heroSub: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
    searchBox: { display: "flex", alignItems: "center", gap: 10, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 14px", marginBottom: 14 },
    searchInput: { flex: 1, border: "none", outline: "none", background: "transparent", color: T.text, fontSize: 14 },
    catScroll: { display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20, scrollbarWidth: "none" },
    catBtn: (active) => ({ background: active ? T.indigo : T.card, color: active ? "#fff" : T.sub, border: `1px solid ${active ? T.indigo : T.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }),
    sectionTitle: { fontSize: 17, fontWeight: 700, marginBottom: 12, color: T.text },
    vendorScroll: { display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, marginBottom: 24, scrollbarWidth: "none" },
    vendorCard: { background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 14, minWidth: 150, flexShrink: 0, cursor: "pointer", transition: "box-shadow 0.15s" },
    card: { background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 12 },
    cardRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 },
    cardTitle: { fontSize: 15, fontWeight: 600, color: T.text, flex: 1 },
    badge: (isService) => ({ background: isService ? T.indigoBg : T.orangeBg, color: isService ? T.indigo : T.orange, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }),
    price: { fontSize: 20, fontWeight: 700, color: T.green, marginBottom: 12 },
    btnPrimary: { width: "100%", background: T.indigo, color: "#fff", border: "none", borderRadius: 10, padding: "12px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
    btnSecondary: { width: "100%", background: T.greenBg, color: T.green, border: `1px solid ${T.green}`, borderRadius: 10, padding: "12px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
    btnMuted: { width: "100%", background: T.tag, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 14, fontWeight: 600, cursor: "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
    backBtn: { display: "flex", alignItems: "center", gap: 6, color: T.indigo, background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 16, padding: 0 },
    avatar: (color, size = 44) => ({ background: color, width: size, height: size, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size > 40 ? 16 : 13, flexShrink: 0 }),
    certBadge: { display: "inline-flex", alignItems: "center", gap: 4, background: "#E3F2FD", color: "#1565C0", borderRadius: 20, padding: "3px 8px", fontSize: 11, fontWeight: 600 },
    pendingBadge: { display: "inline-flex", alignItems: "center", gap: 4, background: T.tag, color: T.muted, borderRadius: 20, padding: "3px 8px", fontSize: 11 },
    divider: { height: 1, background: T.border, margin: "16px 0" },
    input: { width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 14, color: T.text, outline: "none", boxSizing: "border-box" },
    vendorRow: { display: "flex", alignItems: "center", gap: 10, background: T.bg, borderRadius: 10, padding: "10px 12px", marginBottom: 12, cursor: "pointer" },
    tabRow: { display: "flex", background: T.tag, borderRadius: 20, padding: 3, gap: 2, marginBottom: 16 },
    tab: (active) => ({ flex: 1, background: active ? T.indigo : "transparent", color: active ? "#fff" : T.sub, border: "none", borderRadius: 16, padding: "8px 12px", fontWeight: 600, fontSize: 13, cursor: "pointer" }),
    successBox: { textAlign: "center", padding: "40px 20px" },
    successIcon: { background: T.greenBg, borderRadius: "50%", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: T.green },
    orderRow: { display: "flex", alignItems: "center", gap: 10, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 12, marginBottom: 8 },
    gridBtn: (active, color) => ({ background: active ? color + "22" : T.card, border: `2px solid ${active ? color : T.border}`, borderRadius: 10, padding: "10px 8px", cursor: "pointer", textAlign: "center" }),
    emptyState: { textAlign: "center", padding: "60px 20px", color: T.sub },
  };

  /* ── COMPONENTS ── */
  const CertTag = ({ certified }) => certified
    ? <span style={s.certBadge}><BadgeCheck size={11} /> CERTIFIÉ</span>
    : <span style={s.pendingBadge}><Clock size={11} /> EN VÉRIFICATION</span>;

  const BackBtn = ({ to, id }) => (
    <button style={s.backBtn} onClick={() => go(to, id)}>
      <ArrowLeft size={16} /> Retour
    </button>
  );

  const ProductCard = ({ p }) => {
    const v = findV(p.vendorId);
    const isService = p.type === "service";
    return (
      <div style={s.card}>
        <div style={s.cardRow}>
          <span style={s.cardTitle}>{p.title}</span>
          <span style={s.badge(isService)}>{isService ? "Service" : "Produit"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={s.avatar(v.color, 28)}>{v.initials}</div>
          <span style={{ fontSize: 13, color: T.sub }}>{v.name}</span>
          <CertTag certified={v.certified} />
        </div>
        <div style={s.price}>{money(p.price)}</div>
        {isService ? (
          <button style={s.btnPrimary} onClick={() => go("booking", p.id)}>
            <CalendarDays size={16} /> Prendre Rendez-vous
          </button>
        ) : (
          <button style={s.btnSecondary} onClick={() => { addCart(p.id); go("product", p.id); }}>
            <Truck size={16} /> Acheter avec livraison
          </button>
        )}
      </div>
    );
  };

  /* ── SCREENS ── */

  // HOME
  const HomeScreen = () => (
    <div style={s.container}>
      <div style={s.hero}>
        <div style={s.heroTitle}>Le marché, en ligne</div>
        <div style={s.heroSub}>Boutiques certifiées · Livraison · Rendez-vous</div>
      </div>

      <div style={s.searchBox}>
        <Search size={16} color={T.muted} />
        <input style={s.searchInput} placeholder="Rechercher un produit, service..." value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button style={{ background: "none", border: "none", cursor: "pointer", color: T.muted }} onClick={() => setSearch("")}><X size={14} /></button>}
      </div>

      <div style={s.catScroll}>
        {CATEGORIES.map(c => (
          <button key={c} style={s.catBtn(category === c)} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      <div style={s.sectionTitle}>Boutiques à la une</div>
      <div style={s.vendorScroll}>
        {VENDORS.map(v => (
          <div key={v.id} style={s.vendorCard} onClick={() => go("vendor", v.id)}>
            <div style={s.avatar(v.color)}>{v.initials}</div>
            <div style={{ marginTop: 8, fontWeight: 600, fontSize: 13, color: T.text }}>{v.name}</div>
            <div style={{ fontSize: 11, color: T.sub, marginBottom: 6 }}>{v.category}</div>
            <CertTag certified={v.certified} />
          </div>
        ))}
      </div>

      <div style={s.sectionTitle}>
        Produits & services
        {filtered.length > 0 && <span style={{ fontSize: 13, fontWeight: 400, color: T.muted, marginLeft: 8 }}>({filtered.length})</span>}
      </div>

      {filtered.length === 0 ? (
        <div style={s.emptyState}>Aucun résultat pour cette recherche.</div>
      ) : (
        filtered.map(p => <ProductCard key={p.id} p={p} />)
      )}
    </div>
  );

  // PRODUCT DETAIL
  const ProductScreen = () => {
    const p = findP(screenId);
    const [added, setAdded] = useState(false);
    if (!p) return <div style={s.container}><BackBtn to="home" />Produit introuvable.</div>;
    const v = findV(p.vendorId);
    const isService = p.type === "service";
    return (
      <div style={s.container}>
        <BackBtn to="home" />
        <div style={{ ...s.card, border: `2px solid ${T.border}` }}>
          <div style={{ background: v.color + "18", borderRadius: 10, padding: 24, textAlign: "center", marginBottom: 16 }}>
            <div style={{ ...s.avatar(v.color, 64), margin: "0 auto" }}>{v.initials}</div>
          </div>
          <div style={s.cardRow}>
            <span style={{ ...s.cardTitle, fontSize: 18 }}>{p.title}</span>
            <span style={s.badge(isService)}>{isService ? "Service" : "Produit"}</span>
          </div>
          <div style={s.price}>{money(p.price)}</div>

          <div style={s.vendorRow} onClick={() => go("vendor", v.id)}>
            <div style={s.avatar(v.color, 36)}>{v.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{v.name}</div>
              <div style={{ fontSize: 12, color: T.sub }}>{v.zone}</div>
            </div>
            <CertTag certified={v.certified} />
            <ChevronRight size={14} color={T.muted} />
          </div>

          <p style={{ fontSize: 13, color: T.sub, lineHeight: 1.6, marginBottom: 16 }}>
            {isService ? "Prestation assurée par le vendeur. Choisissez un créneau sans avance à payer." : "Article proposé par le vendeur, livrable selon la zone choisie."}
          </p>

          {isService ? (
            <button style={s.btnPrimary} onClick={() => go("booking", p.id)}>
              <CalendarDays size={16} /> Prendre Rendez-vous
            </button>
          ) : (
            <button style={added ? { ...s.btnSecondary, background: T.greenBg } : s.btnSecondary}
              onClick={() => { addCart(p.id); setAdded(true); setTimeout(() => setAdded(false), 1500); }}>
              {added ? <><CheckCircle2 size={16} /> Ajouté au panier</> : <><ShoppingCart size={16} /> Ajouter au panier</>}
            </button>
          )}
        </div>
      </div>
    );
  };

  // VENDOR PAGE
  const VendorScreen = () => {
    const v = findV(screenId);
    if (!v) return <div style={s.container}><BackBtn to="home" />Vendeur introuvable.</div>;
    const vProducts = PRODUCTS.filter(p => p.vendorId === v.id);
    return (
      <div>
        <div style={{ background: v.color, padding: "24px 16px 48px" }}>
          <button style={{ ...s.backBtn, color: "rgba(255,255,255,0.9)", marginBottom: 16 }} onClick={() => go("home")}>
            <ArrowLeft size={16} /> Retour
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ ...s.avatar(v.color), border: "3px solid rgba(255,255,255,0.5)", width: 56, height: 56, fontSize: 18 }}>{v.initials}</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>{v.name}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{v.category}</div>
            </div>
          </div>
        </div>
        <div style={{ ...s.container, marginTop: -24 }}>
          <div style={{ ...s.card, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: T.sub }}>📍 {v.zone}</span>
              <CertTag certified={v.certified} />
            </div>
            <p style={{ fontSize: 14, color: T.sub, lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
          </div>
          <div style={s.sectionTitle}>Catalogue ({vProducts.length} articles)</div>
          {vProducts.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    );
  };

  // CART
  const CartScreen = () => {
    const [confirmed, setConfirmed] = useState(false);
    if (confirmed) return (
      <div style={s.container}>
        <div style={s.successBox}>
          <div style={s.successIcon}><CheckCircle2 size={32} /></div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Commande confirmée</div>
          <div style={{ color: T.sub, fontSize: 14, marginBottom: 24 }}>Total réglé : {money(total)}</div>
          <button style={s.btnPrimary} onClick={() => { setCart([]); setPayment(null); go("home"); }}>Retour à l'accueil</button>
        </div>
      </div>
    );
    if (cart.length === 0) return (
      <div style={s.container}>
        <div style={s.emptyState}>
          <ShoppingCart size={40} color={T.border} style={{ margin: "0 auto 12px" }} />
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Panier vide</div>
          <div style={{ fontSize: 13, marginBottom: 20 }}>Explorez le catalogue pour trouver votre bonheur.</div>
          <button style={s.btnPrimary} onClick={() => go("home")}>Explorer le marché</button>
        </div>
      </div>
    );
    return (
      <div style={s.container}>
        <BackBtn to="home" />
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Mon panier</div>

        {cart.map(item => {
          const p = findP(item.pid);
          const v = findV(p?.vendorId);
          if (!p || !v) return null;
          return (
            <div key={item.pid} style={s.orderRow}>
              <div style={s.avatar(v.color, 36)}>{v.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{p.title}</div>
                <div style={{ fontSize: 12, color: T.sub }}>{money(p.price)} × {item.qty} = {money(p.price * item.qty)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button style={s.iconBtn} onClick={() => updQty(item.pid, -1)}><Minus size={12} /></button>
                <span style={{ fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                <button style={s.iconBtn} onClick={() => updQty(item.pid, 1)}><Plus size={12} /></button>
                <button style={{ ...s.iconBtn, color: "#E53935" }} onClick={() => remCart(item.pid)}><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}

        <div style={s.divider} />
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Zone de livraison</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {ZONES.map(z => (
            <button key={z.id} style={s.gridBtn(zone === z.id, T.indigo)} onClick={() => setZone(z.id)}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{z.label}</div>
              <div style={{ fontSize: 11, color: T.sub }}>{money(z.fee)}</div>
            </button>
          ))}
        </div>

        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Mode de paiement</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {PAYMENTS.map(pm => (
            <button key={pm.id} style={s.gridBtn(payment === pm.id, pm.color)} onClick={() => setPayment(pm.id)}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: pm.color, margin: "0 auto 4px" }} />
              <div style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{pm.label}</div>
            </button>
          ))}
        </div>

        <div style={s.divider} />
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14, color: T.sub }}>
          <span>Sous-total</span><span>{money(subtotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14, color: T.sub }}>
          <span>Livraison</span><span>{money(delivFee)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 18, fontWeight: 700 }}>
          <span>Total</span><span style={{ color: T.green }}>{money(total)}</span>
        </div>

        <button style={payment ? s.btnPrimary : s.btnMuted} onClick={() => payment && setConfirmed(true)}>
          {payment ? "Confirmer la commande" : "Choisissez un mode de paiement"}
        </button>
      </div>
    );
  };

  // BOOKING
  const BookingScreen = () => {
    const p = findP(screenId);
    const [confirmed, setConfirmed] = useState(false);
    if (!p) return <div style={s.container}><BackBtn to="home" />Introuvable.</div>;
    const v = findV(p.vendorId);
    if (confirmed) return (
      <div style={s.container}>
        <div style={s.successBox}>
          <div style={s.successIcon}><CheckCircle2 size={32} /></div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Rendez-vous confirmé</div>
          <div style={{ color: T.sub, fontSize: 14, marginBottom: 4 }}>{p.title} avec {v.name}</div>
          <div style={{ color: T.indigo, fontWeight: 600, marginBottom: 24 }}>{bookDay} à {bookSlot}</div>
          <button style={s.btnPrimary} onClick={() => go("home")}>Retour à l'accueil</button>
        </div>
      </div>
    );
    return (
      <div style={s.container}>
        <BackBtn to="product" id={p.id} />
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{p.title}</div>
        <div style={{ fontSize: 13, color: T.sub, marginBottom: 20 }}>avec {v.name} · {v.zone}</div>

        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Choisir une date</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {DAYS.map(d => (
            <button key={d} style={s.gridBtn(bookDay === d, T.indigo)} onClick={() => { setBookDay(d); setBookSlot(null); }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: bookDay === d ? T.indigo : T.text }}>{d}</div>
            </button>
          ))}
        </div>

        {bookDay && <>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Choisir un créneau</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
            {SLOTS.map(sl => {
              const taken = SLOT_TAKEN[`${bookDay}-${sl}`];
              return (
                <button key={sl} disabled={taken}
                  style={{ ...s.gridBtn(!taken && bookSlot === sl, T.indigo), opacity: taken ? 0.5 : 1, cursor: taken ? "not-allowed" : "pointer" }}
                  onClick={() => !taken && setBookSlot(sl)}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: taken ? T.muted : (bookSlot === sl ? T.indigo : T.text) }}>
                    {taken ? "Complet" : sl}
                  </div>
                </button>
              );
            })}
          </div>
        </>}

        <button style={bookDay && bookSlot ? s.btnPrimary : s.btnMuted} onClick={() => bookDay && bookSlot && setConfirmed(true)}>
          <CalendarDays size={16} />
          {bookDay && bookSlot ? "Confirmer le rendez-vous" : "Sélectionnez une date et un créneau"}
        </button>
      </div>
    );
  };

  // DASHBOARD
  const DashboardScreen = () => {
    const me = findV("v1");
    const addProduct = () => {
      if (!newP.title || !newP.price) return;
      setSellerProducts(prev => [...prev, { id: "sp" + Date.now(), vendorId: "v1", title: newP.title, price: Number(newP.price), type: newP.type, category: me.category }]);
      setNewP({ title: "", price: "", type: "produit" });
      setShowAdd(false);
    };
    return (
      <div style={s.container}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={s.avatar(me.color, 52)}>{me.initials}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Bonjour, {me.name}</div>
            <CertTag certified={me.certified} />
          </div>
        </div>

        <div style={{ background: T.indigoBg, borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 13, color: T.indigo }}>
          <strong>Certification active</strong> — Votre identité a été vérifiée manuellement par l'équipe.
        </div>

        <div style={s.tabRow}>
          <button style={s.tab(sellerTab === "catalogue")} onClick={() => setSellerTab("catalogue")}>Mon catalogue</button>
          <button style={s.tab(sellerTab === "commandes")} onClick={() => setSellerTab("commandes")}>Commandes & RDV</button>
        </div>

        {sellerTab === "catalogue" ? (
          <>
            {sellerProducts.map(p => (
              <div key={p.id} style={s.orderRow}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: T.sub }}>{money(p.price)} · {p.type}</div>
                </div>
                <button style={s.iconBtn}><Pencil size={14} /></button>
                <button style={{ ...s.iconBtn, color: "#E53935" }} onClick={() => setSellerProducts(prev => prev.filter(x => x.id !== p.id))}><Trash2 size={14} /></button>
              </div>
            ))}

            {showAdd ? (
              <div style={{ ...s.card, marginTop: 8 }}>
                <input style={{ ...s.input, marginBottom: 8 }} placeholder="Titre du produit / service" value={newP.title} onChange={e => setNewP({ ...newP, title: e.target.value })} />
                <input style={{ ...s.input, marginBottom: 8 }} placeholder="Prix en FCFA" type="number" value={newP.price} onChange={e => setNewP({ ...newP, price: e.target.value })} />
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <button style={s.gridBtn(newP.type === "produit", T.orange)} onClick={() => setNewP({ ...newP, type: "produit" })}>Produit</button>
                  <button style={s.gridBtn(newP.type === "service", T.indigo)} onClick={() => setNewP({ ...newP, type: "service" })}>Service</button>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...s.btnPrimary, flex: 1 }} onClick={addProduct}>Enregistrer</button>
                  <button style={{ ...s.btnMuted, flex: 1, cursor: "pointer" }} onClick={() => setShowAdd(false)}>Annuler</button>
                </div>
              </div>
            ) : (
              <button style={{ ...s.card, border: `2px dashed ${T.indigo}`, cursor: "pointer", color: T.indigo, fontWeight: 600, fontSize: 14, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => setShowAdd(true)}>
                <Plus size={16} /> Ajouter un produit / service
              </button>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <ClipboardList size={15} /> Commandes
            </div>
            {orders.map(o => (
              <div key={o.id} style={s.orderRow}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{o.produit}</div>
                  <div style={{ fontSize: 12, color: T.sub }}>Client : {o.client} · {money(o.montant)}</div>
                </div>
                {o.statut === "expediee"
                  ? <span style={s.certBadge}><CheckCircle2 size={11} /> EXPÉDIÉE</span>
                  : <button style={{ ...s.btnPrimary, width: "auto", padding: "6px 12px", fontSize: 12 }} onClick={() => setOrders(prev => prev.map(x => x.id === o.id ? { ...x, statut: "expediee" } : x))}>Marquer expédiée</button>
                }
              </div>
            ))}

            <div style={{ fontSize: 14, fontWeight: 700, margin: "20px 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
              <CalendarDays size={15} /> Rendez-vous
            </div>
            {appts.map(a => (
              <div key={a.id} style={s.orderRow}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{a.service}</div>
                  <div style={{ fontSize: 12, color: T.sub }}>Client : {a.client}</div>
                </div>
                <span style={{ ...s.certBadge, background: T.indigoBg, color: T.indigo }}>{a.date} · {a.heure}</span>
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  const screens = { home: HomeScreen, product: ProductScreen, vendor: VendorScreen, cart: CartScreen, booking: BookingScreen, dashboard: DashboardScreen };
  const Current = screens[screen] || HomeScreen;

  return (
    <div style={s.app}>
      {/* HEADER */}
      <div style={s.header}>
        <div style={s.logo} onClick={() => go(role === "seller" ? "dashboard" : "home")}>🛍 Woko</div>
        <div style={s.headerRight}>
          <div style={s.roleToggle}>
            <button style={s.roleBtn(role === "buyer")} onClick={() => { setRole("buyer"); go("home"); }}>Acheteur</button>
            <button style={s.roleBtn(role === "seller")} onClick={() => { setRole("seller"); go("dashboard"); }}>Vendeur</button>
          </div>
          {role === "buyer" && (
            <button style={s.cartBtn} onClick={() => go("cart")}>
              <ShoppingCart size={18} />
              {cartCount > 0 && <span style={s.cartBadge}>{cartCount}</span>}
            </button>
          )}
          <button style={s.iconBtn} onClick={() => setDark(d => !d)}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      <Current />
    </div>
  );
}

