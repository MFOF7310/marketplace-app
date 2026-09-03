import { useState, useEffect } from "react";

// Register Service Worker
if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/market/sw.js')
      .then(r => console.log('SW registered'))
      .catch(e => console.log('SW failed:', e));
  });
}
import { supabase, SITE_URL } from './supabase.js'
import { getVendors, getProducts, getUserRole, getVendorByUserId, createProduct, deleteProduct, updateOrderStatus, getOrdersByVendor, getAppointmentsByVendor, uploadImage } from './api.js'

import { Search, ShoppingCart, CalendarDays, CheckCircle2, Plus, Minus, Trash2, Clock, ArrowLeft, BadgeCheck, Pencil, ClipboardList, Sun, Moon, Store, ChevronRight, Phone, MessageCircle, X, Menu, Home, Grid, PlusCircle, User, Heart, MapPin, Star, Filter, Shirt, Smartphone, UtensilsCrossed, Sparkles, Palette, Wrench, Flame, Bell, Settings, Lock, FileText } from "lucide-react";

const LIGHT = { bg:"#F5F5F5",card:"#FFFFFF",border:"#E0E0E0",text:"#1A1A1A",sub:"#757575",orange:"#E65100",indigoBg:"#FFF3E0",green:"#2E7D32",greenBg:"#E8F5E9",muted:"#9E9E9E",headerTop:"#E65100",navBg:"#FFFFFF",sectionBg:"#FFFFFF",tag:"#F5F5F5" };
const DARK  = { bg:"#121212",card:"#1E1E1E",border:"#2C2C2C",text:"#F0F0F0",sub:"#9E9E9E",orange:"#FF7043",indigoBg:"#2C1810",green:"#66BB6A",greenBg:"#1B5E2033",muted:"#616161",headerTop:"#BF360C",navBg:"#1A1A1A",sectionBg:"#1E1E1E",tag:"#2A2A2A" };

const money = n => Number(n).toLocaleString("fr-FR") + " FCFA";

const CATEGORIES = [
  {id:"all",label:"Tout",emoji:"🔥"},{id:"mode",label:"Mode",emoji:"👗"},
  {id:"elec",label:"Électronique",emoji:"📱"},{id:"resto",label:"Resto",emoji:"🍽"},
  {id:"beaute",label:"Beauté",emoji:"✨"},{id:"artisan",label:"Artisanat",emoji:"🎨"},
  {id:"service",label:"Services",emoji:"🔧"},
];

const VENDORS = [
  {id:"v1",name:"Aïcha Couture",category:"mode",certified:true,zone:"Bamako, ACI 2000",desc:"Tenues wax sur-mesure.",initials:"AC",color:"#E65100",phone:"+223 70 00 00 01"},
  {id:"v2",name:"TechFix Mali",category:"elec",certified:true,zone:"Bamako, Hamdallaye",desc:"Réparation smartphones.",initials:"TM",color:"#1565C0",phone:"+223 70 00 00 02"},
  {id:"v3",name:"Chez Mariam",category:"resto",certified:false,zone:"Bamako, Magnambougou",desc:"Cuisine malienne maison.",initials:"CM",color:"#2E7D32",phone:"+223 70 00 00 03"},
  {id:"v4",name:"Beauté Awa",category:"beaute",certified:true,zone:"Bamako, Badalabougou",desc:"Soins visage et corps.",initials:"BA",color:"#AD1457",phone:"+223 70 00 00 04"},
  {id:"v5",name:"Artisan Bogolan",category:"artisan",certified:true,zone:"Ségou",desc:"Textiles traditionnels.",initials:"AB",color:"#4527A0",phone:"+223 70 00 00 05"},
  {id:"v6",name:"Plombier Express",category:"service",certified:false,zone:"Bamako, Lafiabougou",desc:"Interventions rapides.",initials:"PE",color:"#00695C",phone:"+223 70 00 00 06"},
];

const PRODUCTS = [
  {id:"p1",vendorId:"v1",title:"Robe wax sur-mesure",price:35000,type:"produit",category:"mode",featured:true},
  {id:"p2",vendorId:"v1",title:"Retouche express (48h)",price:5000,type:"service",category:"mode",featured:false},
  {id:"p3",vendorId:"v2",title:"Réparation écran smartphone",price:15000,type:"service",category:"elec",featured:true},
  {id:"p4",vendorId:"v2",title:"Chargeur rapide USB-C 65W",price:8000,type:"produit",category:"elec",featured:false},
  {id:"p5",vendorId:"v3",title:"Attiéké poisson braisé",price:2500,type:"produit",category:"resto",featured:true},
  {id:"p6",vendorId:"v4",title:"Soin visage relaxant (1h)",price:12000,type:"service",category:"beaute",featured:true},
  {id:"p7",vendorId:"v4",title:"Huile de karité bio 250ml",price:3000,type:"produit",category:"beaute",featured:false},
  {id:"p8",vendorId:"v5",title:"Nappe bogolan tissée main",price:22000,type:"produit",category:"artisan",featured:true},
  {id:"p9",vendorId:"v6",title:"Intervention plomberie urgente",price:10000,type:"service",category:"service",featured:false},
];

const ZONES = [{id:"centre",label:"Bamako Centre",fee:500},{id:"peripherie",label:"Périphérie",fee:1000},{id:"interieur",label:"Intérieur Mali",fee:2500}];
const PAYMENTS = [{id:"orange",label:"Orange Money",color:"#FF6600"},{id:"moov",label:"Moov Money",color:"#0057B8"},{id:"wave",label:"Wave",color:"#1DC9E0"}];
const DAYS = ["Lun 24","Mar 25","Mer 26","Jeu 27","Ven 28","Sam 29"];
const SLOTS = ["09:00","10:00","11:00","14:00","15:00","16:00"];
const SLOT_TAKEN = {};  // Will be loaded from DB

const Placeholder = ({vendor,height=160,fontSize=32,title=""}) => (
  <div style={{
    background:`linear-gradient(135deg,${vendor?.color||"#E65100"}EE,${vendor?.color||"#E65100"}66)`,
    height,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
    position:"relative",overflow:"hidden"
  }}>
    {/* Background pattern */}
    <div style={{position:"absolute",inset:0,opacity:0.08,backgroundImage:`repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)`,backgroundSize:"12px 12px"}}/>
    <div style={{position:"relative",textAlign:"center"}}>
      <div style={{fontSize,color:"white",fontWeight:800,letterSpacing:-1,textShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>{vendor?.initials||"?"}</div>
      {title&&<div style={{fontSize:10,color:"rgba(255,255,255,0.8)",marginTop:4,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{title}</div>}
    </div>
  </div>
);

export default function App() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [dark,setDark] = useState(prefersDark);
  const [user,setUser] = useState(null);
  const [userRole,setUserRole] = useState('buyer');
  const [vendors,setVendors] = useState([]);
  const [products,setProducts] = useState([]);
  const [myVendor,setMyVendor] = useState(null);
  const [loading,setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [v, p] = await Promise.all([getVendors(), getProducts()]);
      setVendors((v||[]).map(vendor=>({
        ...vendor,
        color: getVendorColor(vendor),
        initials: vendor.initials || vendor.name?.[0]?.toUpperCase() || "?"
      })));
      setProducts(p || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const loadUserData = async (u) => {
    if(!u) { setUserRole('buyer'); setMyVendor(null); setSellerProducts([]); return; }
    try {
      const role = await getUserRole(u.id);
      const vendor = await getVendorByUserId(u.id);
      setUserRole(role || 'buyer');
      setMyVendor(vendor || null);
      if(vendor) {
        const [vProducts, vOrders, vAppts] = await Promise.all([
          getProducts(vendor.id),
          getOrdersByVendor(vendor.id),
          getAppointmentsByVendor(vendor.id)
        ]);
        setSellerProducts(vProducts || []);
        setOrders(vOrders || []);
        setAppts(vAppts || []);
      }
    } catch(e) { console.error("loadUserData error:", e); }
  };

  useEffect(() => {
    loadData();
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      loadUserData(u);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      loadUserData(u);
    });
    return () => subscription.unsubscribe();
  }, []);
  const T = dark ? DARK : LIGHT;
  const [screen,setScreen] = useState(()=>sessionStorage.getItem('woko-screen')||"home");
  const [screenId,setScreenId] = useState(()=>sessionStorage.getItem('woko-screen-id')||null);
  const [role,setRole] = useState("buyer");
  const [cart,setCart] = useState([]);
  const [zone,setZone] = useState("centre");
  const [payment,setPayment] = useState(null);
  const [search,setSearch] = useState("");
  const [category,setCategory] = useState("all");
  const [bookDay,setBookDay] = useState(null);
  const [bookSlot,setBookSlot] = useState(null);
  const [menuOpen,setMenuOpen] = useState(false);
  const [callModal,setCallModal] = useState(null);
  const [loginModal,setLoginModal] = useState(false);
  const [sellerProducts,setSellerProducts] = useState([]);
  const [sellerTab,setSellerTab] = useState("catalogue");
  const [showAdd,setShowAdd] = useState(false);
  const [showEditVendor,setShowEditVendor] = useState(false);
  const [newP,setNewP] = useState({title:"",price:"",type:"produit",imageFile:null,uploading:false});
  const [orders,setOrders] = useState([]);
  const [appts,setAppts] = useState([]);
  const [favorites,setFavorites] = useState([]);

  const go = (s,id=null) => {
    setScreen(s);
    setScreenId(id);
    setMenuOpen(false);
    setBookDay(null);
    setBookSlot(null);
    window.scrollTo({top:0,behavior:'smooth'});
    sessionStorage.setItem('woko-screen', s);
    sessionStorage.setItem('woko-screen-id', id||'');
  };
  const findP = id => {
    if(!id) return null;
    const fromProducts = products.find(p=>p.id===id);
    if(fromProducts) return fromProducts;
    const fromSeller = sellerProducts.find(p=>p.id===id);
    if(fromSeller) return fromSeller;
    return null;
  };
  const getVendorColor = (vendor) => {
    if(!vendor) return "#E65100";
    if(vendor.color) return vendor.color;
    // Generate consistent color from name
    const colors = ["#E65100","#1565C0","#2E7D32","#AD1457","#4527A0","#00695C","#F57F17","#6A1B9A"];
    const idx = (vendor.name||"").charCodeAt(0) % colors.length;
    return colors[idx];
  };

  const findV = id => {
    if(!id) return null;
    const direct = vendors.find(v=>v.id===id);
    if(direct) return {...direct, color: getVendorColor(direct), initials: direct.initials || direct.name?.[0]?.toUpperCase() || "?"};
    return null;
  };

  // Get vendor from product (handles both static and Supabase data)
  const getProductVendor = (p) => {
    if(!p) return null;
    let v = null;
    if(p.vendors) v = p.vendors;
    else if(p.vendor_id) v = findV(p.vendor_id);
    else if(p.vendorId) v = findV(p.vendorId);
    if(!v) return null;
    return {...v, color: getVendorColor(v), initials: v.initials || v.name?.[0]?.toUpperCase() || "?"};
  };
  const addCart = pid => setCart(prev => { const ex=prev.find(i=>i.pid===pid); return ex?prev.map(i=>i.pid===pid?{...i,qty:i.qty+1}:i):[...prev,{pid,qty:1}]; });
  const updQty = (pid,d) => setCart(prev=>prev.map(i=>i.pid===pid?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0));
  const remCart = pid => setCart(prev=>prev.filter(i=>i.pid!==pid));
  const toggleFav = id => setFavorites(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const subtotal = cart.reduce((s,i)=>s+(findP(i.pid)?.price||0)*i.qty,0);
  const delivFee = ZONES.find(z=>z.id===zone)?.fee||0;
  const total = subtotal+(cart.length?delivFee:0);
  const filtered = products.filter(p=>{
    const v = vendors.find(v=>v.id===p.vendor_id);
    const catMatch = category==="all" || p.category===category;
    const searchMatch = p.title.toLowerCase().includes(search.toLowerCase()) || v?.name?.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const CallModal = () => {
    if(!callModal) return null;
    const v = findV(callModal) || vendors.find(v=>v.id===callModal);
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setCallModal(null)}>
        <div style={{background:T.card,borderRadius:"16px 16px 0 0",padding:"24px 20px 40px",width:"100%",maxWidth:500}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <span style={{fontSize:18,fontWeight:700,color:T.text}}>Contacter</span>
            <button style={{background:"none",border:"none",cursor:"pointer",color:T.sub}} onClick={()=>setCallModal(null)}><X size={20}/></button>
          </div>
          <div style={{display:"flex",gap:12,marginBottom:12}}>
            <a href={`tel:${v?.phone}`} style={{flex:1,background:T.orange,color:"#fff",border:"none",borderRadius:25,padding:"13px",fontSize:14,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Phone size={16}/> Appeler
            </a>
            <a href={`https://wa.me/${v?.phone?.replace(/[^0-9]/g,"")}`} target="_blank" rel="noreferrer"
              style={{flex:1,background:"#25D366",color:"#fff",border:"none",borderRadius:25,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,textDecoration:"none"}}>
              <MessageCircle size={16}/> WhatsApp
            </a>
          </div>
          <div style={{textAlign:"center",color:T.sub,fontSize:13}}>{v?.phone}</div>
        </div>
      </div>
    );
  };

  const LoginModal = () => {
    if(!loginModal) return null;
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setLoginModal(false)}>
        <div style={{background:T.card,borderRadius:"20px 20px 0 0",padding:"8px 0 40px",width:"100%",maxWidth:500}} onClick={e=>e.stopPropagation()}>
          <div style={{width:40,height:4,background:T.border,borderRadius:2,margin:"12px auto 24px"}}/>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:36,marginBottom:4}}>🛍</div>
            <div style={{fontSize:22,fontWeight:800,color:T.orange}}>Woko</div>
            <div style={{fontSize:13,color:T.sub,marginTop:4}}>Le marché en ligne pour l'Afrique de l'Ouest</div>
          </div>
          <div style={{padding:"0 20px"}}>
            <button style={{width:"100%",background:"#fff",color:"#1A1A1A",border:"1.5px solid #E0E0E0",borderRadius:12,padding:"13px",fontSize:15,fontWeight:600,cursor:"pointer",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:12,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}
              onClick={async()=>{await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:SITE_URL}})}}>
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Continuer avec Google
            </button>
            <button style={{width:"100%",background:"#1877F2",color:"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:15,fontWeight:600,cursor:"pointer",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Continuer avec Facebook
            </button>
            <div style={{textAlign:"center",fontSize:11,color:T.muted,lineHeight:1.6}}>
              En continuant, vous acceptez nos <span style={{color:T.orange,cursor:"pointer"}} onClick={()=>{setLoginModal(false);go("tos");}}>Conditions d'utilisation</span> et notre <span style={{color:T.orange,cursor:"pointer"}} onClick={()=>{setLoginModal(false);go("privacy");}}>Politique de confidentialité</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SideMenu = () => (
    <>
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200}} onClick={()=>setMenuOpen(false)}/>
      <div style={{position:"fixed",top:0,left:0,bottom:0,width:280,background:T.card,zIndex:300,overflowY:"auto",boxShadow:"4px 0 20px rgba(0,0,0,0.2)",animation:"slideInLeft 0.25s ease both"}}>
        <style>{`@keyframes slideInLeft { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }`}</style>
        <div style={{background:T.headerTop,padding:"20px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{color:"#fff",fontWeight:800,fontSize:20}}>🛍 Woko</span>
          <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>setMenuOpen(false)}><X size={20}/></button>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",gap:12}}>
            <span style={{fontWeight:700,color:T.orange,fontSize:13}}>FR</span>
            <span style={{color:T.sub,fontSize:13}}>عربية</span>
            <span style={{color:T.sub,fontSize:13}}>EN</span>
          </div>
          <button style={{background:T.tag,border:"none",borderRadius:20,padding:"4px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:T.text,fontSize:13}} onClick={()=>setDark(d=>!d)}>
            {dark?<Sun size={14}/>:<Moon size={14}/>} {dark?"Clair":"Sombre"}
          </button>
        </div>
        <div style={{padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
          <div style={{padding:"4px 16px 8px",color:T.muted,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Compte</div>
          {user
            ? <button style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:15}} onClick={()=>{setMenuOpen(false);go("profile");}}>
                <span style={{color:T.orange}}><User size={18}/></span>Mon profil
              </button>
            : <>
                <button style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:15}} onClick={()=>{setMenuOpen(false);setLoginModal(true);}}>
                  <span style={{color:T.orange}}><User size={18}/></span>Se connecter
                </button>
                <button style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:15}} onClick={()=>{setMenuOpen(false);setLoginModal(true);}}>
                  <span style={{color:T.orange}}><Plus size={18}/></span>Créer compte
                </button>
                <button style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:15}} onClick={()=>{setMenuOpen(false);setLoginModal(true);}}>
                  <span style={{color:T.orange}}><PlusCircle size={18}/></span>Publier une annonce
                </button>
              </>
          }
        </div>
        <div style={{padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
          <div style={{padding:"4px 16px 8px",color:T.muted,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Espace</div>
          <button style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:15}} onClick={()=>{setMenuOpen(false);setRole("seller");go("dashboard");}}>
            <span style={{color:T.orange}}><Store size={18}/></span>Mon espace vendeur
          </button>
          <button style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:15}} onClick={()=>{setMenuOpen(false);setRole("buyer");go("home");}}>
            <span style={{color:T.orange}}><Home size={18}/></span>Espace acheteur
          </button>
        </div>
        <div style={{padding:"8px 0"}}>
          <div style={{padding:"4px 16px 8px",color:T.muted,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Catégories</div>
          {[
            {id:"mode",label:"Mode & Textile",icon:<Shirt size={17}/>},
            {id:"elec",label:"Électronique",icon:<Smartphone size={17}/>},
            {id:"resto",label:"Restauration",icon:<UtensilsCrossed size={17}/>},
            {id:"beaute",label:"Beauté & Bien-être",icon:<Sparkles size={17}/>},
            {id:"artisan",label:"Artisanat",icon:<Palette size={17}/>},
            {id:"service",label:"Services à domicile",icon:<Wrench size={17}/>},
          ].map(cat=>(
            <button key={cat.id} style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"11px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:14,borderLeft:category===cat.id?`3px solid ${T.orange}`:"3px solid transparent",background:category===cat.id?T.indigoBg:"none"}} onClick={()=>{setCategory(cat.id);setMenuOpen(false);go("home");}}>
              <span style={{color:T.orange,display:"flex",alignItems:"center"}}>{cat.icon}</span>
              <span style={{color:category===cat.id?T.orange:T.text,fontWeight:category===cat.id?700:400}}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  const Header = () => (
    <div style={{position:"sticky",top:0,zIndex:100}}>
      <div style={{background:T.headerTop,padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}>
        <button style={{background:"none",border:"none",cursor:"pointer",color:"#fff",padding:4}} onClick={()=>setMenuOpen(true)}><Menu size={22}/></button>
        <button style={{fontWeight:800,fontSize:20,color:"#fff",background:"none",border:"none",cursor:"pointer",flexShrink:0}} onClick={()=>go("home")}>🛍 Woko</button>
        <div style={{flex:1,display:"flex",alignItems:"center",background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"7px 12px",gap:8,cursor:"pointer"}} onClick={()=>go("search")}>
          <Search size={15} color="rgba(255,255,255,0.8)"/>
          <span style={{color:"rgba(255,255,255,0.8)",fontSize:14}}>Rechercher...</span>
        </div>
        <button style={{background:"none",border:"none",cursor:"pointer",color:"#fff",position:"relative",padding:4}} onClick={()=>go("cart")}>
          <ShoppingCart size={22}/>
          {cartCount>0&&<span style={{position:"absolute",top:-2,right:-2,background:"#fff",color:T.orange,borderRadius:"50%",width:16,height:16,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>{cartCount}</span>}
        </button>
        <button style={{background:"none",border:"none",cursor:"pointer",color:"#fff",padding:4}} onClick={()=>user?go("profile"):setLoginModal(true)}>
          {user
            ?<div style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff"}}>{user.email?.[0].toUpperCase()}</div>
            :<User size={22}/>
          }
        </button>
      </div>
    </div>
  );

  const BottomNav = () => {
    const tabs = [
      {icon:<Home size={20}/>,label:"Accueil",sc:"home"},
      {icon:<Grid size={20}/>,label:"Catégories",sc:"search"},
      {icon:<Search size={20}/>,label:"Recherche",sc:"search"},
      {icon:<PlusCircle size={22}/>,label:"Publier",sc:"publish",accent:true},
    ];
    return (
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.navBg,borderTop:`1px solid ${T.border}`,display:"flex",zIndex:100,maxWidth:600,margin:"0 auto"}}>
        {tabs.map(tab=>(
          <button key={tab.sc+tab.label} style={{flex:1,padding:"10px 4px 8px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:tab.accent?T.orange:(screen===tab.sc?T.orange:T.muted)}} onClick={()=>tab.accent?setLoginModal(true):go(tab.sc)}>
            {tab.icon}
            <span style={{fontSize:10,fontWeight:screen===tab.sc?700:400}}>{tab.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const ProductCard = ({p}) => {
    const v = getProductVendor(p);
    const isService = p.type==="service";
    const isFav = favorites.includes(p.id);
    return (
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden"}}>
        <div style={{position:"relative",cursor:"pointer"}} onClick={()=>go("product",p.id)}>
          {p.image_url
            ? <img src={p.image_url} alt={p.title} style={{width:"100%",height:130,objectFit:"cover"}} loading="lazy"/>
            : <Placeholder vendor={v||{initials:"?",color:"#E65100"}} height={130} fontSize={28} title={p.title}/>
          }
          <button style={{position:"absolute",top:8,right:8,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:isFav?"#E53935":T.muted}} onClick={e=>{e.stopPropagation();toggleFav(p.id);}}>
            <Heart size={15} fill={isFav?"#E53935":"none"}/>
          </button>
          <div style={{position:"absolute",top:8,left:8,background:isService?"#1565C0":T.orange,color:"#fff",borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:700}}>
            {isService?"SERVICE":"PRODUIT"}
          </div>
        </div>
        <div style={{padding:"10px 10px 4px",cursor:"pointer"}} onClick={()=>go("product",p.id)}>
          <div style={{fontSize:13,fontWeight:600,color:T.text,lineHeight:1.3,marginBottom:4}}>{p.title}</div>
          <div style={{fontSize:15,fontWeight:800,color:T.orange,marginBottom:4}}>{money(p.price)}</div>
          <div style={{fontSize:11,color:T.sub,display:"flex",alignItems:"center",gap:4,marginBottom:8}}><MapPin size={10}/>{v.zone}</div>
        </div>
        <div style={{display:"flex",borderTop:`1px solid ${T.border}`}}>
          <button style={{flex:1,padding:"9px 8px",background:"none",border:"none",borderRight:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:T.orange,fontSize:13,fontWeight:600}} onClick={()=>setCallModal(p.vendor_id||p.vendorId)}>
            <Phone size={14}/> Appeler
          </button>
          <button style={{flex:1,padding:"9px 8px",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:T.sub,fontSize:13}} onClick={()=>{isService?go("booking",p.id):addCart(p.id);}}>
            <MessageCircle size={14}/> {isService?"RDV":"Panier"}
          </button>
        </div>
      </div>
    );
  };

  const HomeScreen = () => (
    <div style={{paddingBottom:70}}>
      <div style={{background:T.card,padding:"12px 0 8px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",overflowX:"auto",gap:0,paddingLeft:8,scrollbarWidth:"none"}}>
          {[
            {id:"all",label:"Tout",icon:<Flame size={22}/>},
            {id:"mode",label:"Mode",icon:<Shirt size={22}/>},
            {id:"elec",label:"Électronique",icon:<Smartphone size={22}/>},
            {id:"resto",label:"Resto",icon:<UtensilsCrossed size={22}/>},
            {id:"beaute",label:"Beauté",icon:<Sparkles size={22}/>},
            {id:"artisan",label:"Artisanat",icon:<Palette size={22}/>},
            {id:"service",label:"Services",icon:<Wrench size={22}/>},
          ].map(cat=>(
            <button key={cat.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"4px 12px",background:"none",border:"none",cursor:"pointer",flexShrink:0}} onClick={()=>setCategory(cat.id)}>
              <div style={{width:52,height:52,borderRadius:"50%",background:category===cat.id?T.indigoBg:T.tag,border:`2px solid ${category===cat.id?T.orange:"transparent"}`,display:"flex",alignItems:"center",justifyContent:"center",color:category===cat.id?T.orange:T.sub}}>
                {cat.icon}
              </div>
              <span style={{fontSize:10,color:category===cat.id?T.orange:T.sub,fontWeight:category===cat.id?700:400,whiteSpace:"nowrap"}}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{background:T.sectionBg,padding:"14px 0 8px",borderBottom:`1px solid ${T.border}`,marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px 10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><Star size={16} fill={T.orange} color={T.orange}/><span style={{fontSize:15,fontWeight:700,color:T.text}}>Sponsorisées</span></div>
          <span style={{fontSize:13,color:T.orange,fontWeight:600}}>VOIR PLUS</span>
        </div>
        <div style={{display:"flex",overflowX:"auto",gap:10,paddingLeft:12,paddingRight:12,scrollbarWidth:"none"}}>
          {products.filter(p=>p.featured).map(p=>{
            const v=getProductVendor(p);
            return (
              <div key={p.id} style={{flexShrink:0,width:160,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>go("product",p.id)}>
                {p.image_url
                  ?<img src={p.image_url} alt={p.title} style={{width:"100%",height:110,objectFit:"cover"}} loading="lazy"/>
                  :<Placeholder vendor={v||{initials:"?",color:"#E65100"}} height={110} fontSize={24} title={p.title}/>
                }
                <div style={{padding:"8px 10px"}}>
                  <div style={{fontSize:12,fontWeight:600,color:T.text,lineHeight:1.3}}>{p.title}</div>
                  <div style={{fontSize:14,fontWeight:800,color:T.orange}}>{money(p.price)}</div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                    <button style={{fontSize:11,color:T.orange,background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:3}} onClick={e=>{e.stopPropagation();setCallModal(p.vendorId);}}><Phone size={11}/>Appeler</button>
                    <button style={{fontSize:11,color:T.sub,background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:3}}><MessageCircle size={11}/>Message</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{background:T.sectionBg,padding:"14px 0 8px",borderBottom:`1px solid ${T.border}`,marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px 10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:18}}>🏪</span><span style={{fontSize:15,fontWeight:700,color:T.text}}>Boutiques à la une</span></div>
          <span style={{fontSize:13,color:T.orange,fontWeight:600}}>VOIR PLUS</span>
        </div>
        <div style={{display:"flex",overflowX:"auto",gap:10,paddingLeft:12,paddingRight:12,scrollbarWidth:"none"}}>
          {vendors.map(v=>(
            <div key={v.id} style={{flexShrink:0,width:120,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden",cursor:"pointer",textAlign:"center"}} onClick={()=>go("vendor",v.id)}>
              <div style={{background:`linear-gradient(135deg,${v.color}CC,${v.color}44)`,height:75,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",inset:0,opacity:0.06,backgroundImage:`repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)`,backgroundSize:"10px 10px"}}/>
                {v.logo_url
                  ?<img src={v.logo_url} alt={v.name} style={{width:48,height:48,borderRadius:"50%",objectFit:"cover",border:"3px solid rgba(255,255,255,0.6)"}} loading="lazy"/>
                  :<div style={{width:48,height:48,borderRadius:"50%",background:v.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:17,border:"3px solid rgba(255,255,255,0.4)",position:"relative"}}>{v.initials||v.name?.[0]}</div>
                }
              </div>
              <div style={{padding:"8px 8px 10px"}}>
                <div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:3}}>{v.name}</div>
                {v.certified&&<div style={{display:"inline-flex",alignItems:"center",gap:3,background:"#E3F2FD",color:"#1565C0",borderRadius:10,padding:"2px 6px",fontSize:9,fontWeight:700}}><BadgeCheck size={9}/>CERTIFIÉ</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"14px 10px 8px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <span style={{fontSize:15,fontWeight:700,color:T.text}}>
            {category==="all"?"Toutes les annonces":CATEGORIES.find(c=>c.id===category)?.label}
            <span style={{fontSize:12,color:T.muted,fontWeight:400,marginLeft:6}}>({filtered.length})</span>
          </span>
          <button style={{background:T.tag,border:`1px solid ${T.border}`,borderRadius:6,padding:"5px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,color:T.text}}>
            <Filter size={12}/>Filtrer
          </button>
        </div>
        {loading
          ?<div style={{textAlign:"center",padding:"40px 20px",color:T.sub}}>Chargement...</div>
          :filtered.length===0
          ?<div style={{textAlign:"center",padding:"40px 20px",color:T.sub}}>Aucune annonce dans cette catégorie.</div>
          :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{filtered.map(p=><ProductCard key={p.id} p={p}/>)}</div>
        }
      </div>
    </div>
  );

  const SearchScreen = () => (
    <div style={{paddingBottom:70}}>
      <div style={{background:T.headerTop,padding:"10px 12px 14px",display:"flex",gap:10,alignItems:"center"}}>
        <button style={{background:"none",border:"none",cursor:"pointer",color:"#fff"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
        <div style={{flex:1,display:"flex",alignItems:"center",background:"#fff",borderRadius:8,padding:"8px 12px",gap:8}}>
          <Search size={15} color={T.muted}/>
          <input autoFocus style={{flex:1,border:"none",outline:"none",fontSize:14,background:"transparent",color:"#1A1A1A"}} placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}/>
          {search&&<button style={{background:"none",border:"none",cursor:"pointer"}} onClick={()=>setSearch("")}><X size={14} color={T.muted}/></button>}
        </div>
      </div>
      <div style={{padding:"12px 10px"}}>
        {search
          ?<><div style={{fontSize:13,color:T.sub,marginBottom:10}}>{filtered.length} résultat(s) pour "{search}"</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{filtered.map(p=><ProductCard key={p.id} p={p}/>)}</div></>
          :<div><div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10}}>Catégories populaires</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{CATEGORIES.filter(c=>c.id!=="all").map(cat=>(<button key={cat.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"14px 12px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",color:T.text,fontSize:14,fontWeight:500}} onClick={()=>{setCategory(cat.id);go("home");}}><span style={{fontSize:24}}>{cat.emoji}</span>{cat.label}</button>))}</div></div>
        }
      </div>
    </div>
  );

  const ProductScreen = () => {
    const p = findP(screenId);
    const [added,setAdded] = useState(false);
    if(!p) return null;
    const v=getProductVendor(p); const isService=p.type==="service"; const isFav=favorites.includes(p.id);
    return (
      <div style={{paddingBottom:70}}>
        <div style={{position:"relative"}}>
          {p.image_url
            ?<img src={p.image_url} alt={p.title} style={{width:"100%",height:200,objectFit:"cover",display:"block"}} loading="lazy"/>
            :<Placeholder vendor={v||{initials:"?",color:"#E65100"}} height={200} fontSize={48}/>
          }
          <button style={{position:"absolute",top:12,left:12,background:"rgba(0,0,0,0.5)",border:"none",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",zIndex:10}} onClick={()=>go("home")}><ArrowLeft size={18}/></button>
          <button style={{position:"absolute",top:12,right:12,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:isFav?"#E53935":T.muted}} onClick={()=>toggleFav(p.id)}><Heart size={18} fill={isFav?"#E53935":"none"}/></button>
          <div style={{position:"absolute",bottom:12,left:12,background:isService?"#1565C0":T.orange,color:"#fff",borderRadius:4,padding:"4px 10px",fontSize:11,fontWeight:700}}>{isService?"SERVICE":"PRODUIT"}</div>
        </div>
        <div style={{padding:"16px 14px",background:T.card,marginBottom:8}}>
          <div style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:6}}>{p.title}</div>
          <div style={{fontSize:24,fontWeight:800,color:T.orange,marginBottom:8}}>{money(p.price)}</div>
          <div style={{fontSize:13,color:T.sub,display:"flex",alignItems:"center",gap:6}}><MapPin size={13}/>{v.zone}</div>
        </div>
        <div style={{background:T.card,padding:"14px",marginBottom:8,cursor:"pointer"}} onClick={()=>v&&go("vendor",v.id)}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:v.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:18,flexShrink:0}}>{v.initials}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:16,fontWeight:700,color:T.text}}>{v.name}</div>
              <div style={{fontSize:12,color:T.sub}}>{v.desc}</div>
              {v.certified&&<div style={{display:"inline-flex",alignItems:"center",gap:4,background:"#E3F2FD",color:"#1565C0",borderRadius:10,padding:"2px 8px",fontSize:11,fontWeight:700,marginTop:4}}><BadgeCheck size={11}/>CERTIFIÉ</div>}
            </div>
            <ChevronRight size={18} color={T.muted}/>
          </div>
        </div>
        <div style={{padding:"0 14px 14px",display:"flex",gap:10,background:T.card}}>
          <button style={{flex:1,background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>setCallModal(p.vendor_id||p.vendorId)}><Phone size={16}/>Appeler</button>
          {isService
            ?<button style={{flex:1,background:"#1565C0",color:"#fff",border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>go("booking",p.id)}><CalendarDays size={16}/>Réserver</button>
            :<button style={{flex:1,background:added?"#2E7D32":T.indigoBg,color:added?"#fff":T.orange,border:`1px solid ${T.orange}`,borderRadius:10,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>{addCart(p.id);setAdded(true);setTimeout(()=>setAdded(false),1500);}}>
              {added?<><CheckCircle2 size={16}/>Ajouté</>:<><ShoppingCart size={16}/>Panier</>}
            </button>
          }
        </div>
      </div>
    );
  };

  // ── STAR RATING ──
  const StarRating = ({rating, size=16, interactive=false, onRate=null}) => {
    const [hover, setHover] = useState(0);
    return (
      <div style={{display:"flex",gap:2}}>
        {[1,2,3,4,5].map(star=>(
          <span key={star}
            style={{cursor:interactive?"pointer":"default",fontSize:size,color:star<=(hover||rating)?"#FFA000":"#E0E0E0",transition:"color 0.1s"}}
            onMouseEnter={()=>interactive&&setHover(star)}
            onMouseLeave={()=>interactive&&setHover(0)}
            onClick={()=>interactive&&onRate&&onRate(star)}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // ── REVIEW MODAL ──
  const ReviewModal = ({vendorId, onClose, onSubmitted}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if(!user) return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
        <div style={{background:T.card,borderRadius:16,padding:28,width:"100%",maxWidth:400,textAlign:"center"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:12}}>Connectez-vous pour laisser un avis</div>
          <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={()=>{onClose();setLoginModal(true);}}>Se connecter</button>
        </div>
      </div>
    );

    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
        <div style={{background:T.card,borderRadius:"20px 20px 0 0",padding:"8px 0 40px",width:"100%",maxWidth:500}} onClick={e=>e.stopPropagation()}>
          <div style={{width:40,height:4,background:T.border,borderRadius:2,margin:"12px auto 20px"}}/>
          <div style={{padding:"0 20px"}}>
            <div style={{fontSize:18,fontWeight:700,color:T.text,marginBottom:16,textAlign:"center"}}>Laisser un avis</div>
            <div style={{textAlign:"center",marginBottom:20}}>
              <StarRating rating={rating} size={40} interactive={true} onRate={setRating}/>
              <div style={{fontSize:12,color:T.sub,marginTop:8}}>
                {rating===0?"Touchez une étoile":rating===1?"Très mauvais":rating===2?"Mauvais":rating===3?"Correct":rating===4?"Bien":"Excellent !"}
              </div>
            </div>
            <textarea
              style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px",fontSize:14,color:T.text,outline:"none",resize:"none",boxSizing:"border-box",marginBottom:16,minHeight:80}}
              placeholder="Partagez votre expérience (optionnel)..."
              value={comment}
              onChange={e=>setComment(e.target.value)}
            />
            <button
              style={{width:"100%",background:rating>0?T.orange:T.muted,color:"#fff",border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,cursor:rating>0?"pointer":"not-allowed"}}
              disabled={rating===0||submitting}
              onClick={async()=>{
                if(rating===0||!user) return;
                setSubmitting(true);
                try {
                  const {submitReview} = await import('./api.js');
                  await submitReview({vendor_id:vendorId,buyer_id:user.id,rating,comment:comment||null});
                  onSubmitted();
                  onClose();
                } catch(e){
                  if(e.message?.includes('one_review_per_buyer')) alert("Vous avez déjà laissé un avis pour ce vendeur.");
                  else alert("Erreur: "+e.message);
                }
                setSubmitting(false);
              }}>
              {submitting?"Envoi...":"Publier mon avis"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const VendorScreen = () => {
    const v=findV(screenId); if(!v) return null;
    const vProducts=products.filter(p=>p.vendor_id===v.id||p.vendorId===v.id);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(()=>{
      const load = async () => {
        try {
          const {getVendorReviews, getVendorRating} = await import('./api.js');
          const [r, rt] = await Promise.all([getVendorReviews(v.id), getVendorRating(v.id)]);
          setReviews(r||[]);
          setRating(rt);
        } catch(e){console.error(e);}
      };
      load();
    },[v.id]);
    return (
      <div style={{paddingBottom:70}}>
        <div style={{background:`linear-gradient(135deg,${v.color}EE,${v.color}99)`,padding:"0 0 50px",position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",padding:"12px 14px 16px",gap:12}}>
            <button style={{background:"rgba(0,0,0,0.2)",border:"none",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",flexShrink:0}} onClick={()=>go("home")}><ArrowLeft size={18}/></button>
            {v.logo_url
              ?<img src={v.logo_url} alt={v.name} style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",border:"3px solid rgba(255,255,255,0.5)",flexShrink:0}}/>
              :<div style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:20,border:"3px solid rgba(255,255,255,0.5)",flexShrink:0}}>{v.initials||v.name?.[0]}</div>
            }
            <div>
              <div style={{color:"#fff",fontWeight:800,fontSize:18}}>{v.name}</div>
              <div style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>{v.city||v.zone||""}</div>
              {v.certified&&<div style={{display:"inline-flex",alignItems:"center",gap:4,background:"rgba(255,255,255,0.2)",color:"#fff",borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:700,marginTop:4}}><BadgeCheck size={10}/>CERTIFIÉ</div>}
            </div>
          </div>
        </div>
        <div style={{margin:"-30px 12px 12px",background:T.card,borderRadius:12,padding:14,boxShadow:"0 2px 12px rgba(0,0,0,0.1)"}}>
          <p style={{fontSize:14,color:T.sub,margin:"0 0 12px"}}>{v.desc}</p>
          <button style={{width:"100%",background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:12,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>setCallModal(v.id)}><Phone size={16}/>Contacter le vendeur</button>
        </div>
        <div style={{padding:"4px 12px 8px"}}>
          <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:10}}>Catalogue ({vProducts.length})</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{vProducts.map(p=><ProductCard key={p.id} p={p}/>)}</div>
        </div>

        {/* Reviews section */}
        <div style={{padding:"0 12px 20px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:T.text}}>Avis clients</div>
              {rating?.average>0&&(
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                  <StarRating rating={Math.round(rating.average)} size={16}/>
                  <span style={{fontSize:13,fontWeight:700,color:T.orange}}>{rating.average}</span>
                  <span style={{fontSize:12,color:T.sub}}>({rating.count} avis)</span>
                </div>
              )}
            </div>
            <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:20,padding:"8px 16px",fontSize:13,fontWeight:700,cursor:"pointer"}}
              onClick={()=>setShowReviewModal(true)}>
              + Avis
            </button>
          </div>

          {reviews.length===0
            ?<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:16,textAlign:"center",color:T.sub,fontSize:13}}>
              Aucun avis pour le moment. Soyez le premier !
            </div>
            :reviews.map(r=>(
              <div key={r.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:12,marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                  <StarRating rating={r.rating} size={14}/>
                  <span style={{fontSize:11,color:T.muted}}>{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
                {r.comment&&<div style={{fontSize:13,color:T.sub,lineHeight:1.5}}>{r.comment}</div>}
              </div>
            ))
          }
        </div>

        {showReviewModal&&<ReviewModal vendorId={v.id} onClose={()=>setShowReviewModal(false)} onSubmitted={async()=>{
          const {getVendorReviews,getVendorRating} = await import('./api.js');
          const [r,rt] = await Promise.all([getVendorReviews(v.id),getVendorRating(v.id)]);
          setReviews(r||[]); setRating(rt);
        }}/>}
      </div>
    );
  };

  const CartScreen = () => {
    const [confirmed,setConfirmed] = useState(false);
    if(confirmed) return (
      <div style={{padding:"60px 20px",textAlign:"center"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:"#E8F5E9",color:"#2E7D32",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><CheckCircle2 size={32}/></div>
        <div style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:8}}>Commande confirmée !</div>
        <div style={{color:T.sub,marginBottom:24}}>Total : {money(total)}</div>
        <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"13px 24px",fontSize:15,fontWeight:700,cursor:"pointer"}} onClick={()=>{setCart([]);setPayment(null);go("home");}}>Retour à l'accueil</button>
      </div>
    );
    if(cart.length===0) return (
      <div style={{padding:"60px 20px",textAlign:"center",paddingBottom:70}}>
        <ShoppingCart size={48} color={T.border} style={{margin:"0 auto 16px",display:"block"}}/>
        <div style={{fontSize:18,fontWeight:700,color:T.text,marginBottom:8}}>Panier vide</div>
        <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={()=>go("home")}>Explorer le marché</button>
      </div>
    );
    return (
      <div style={{paddingBottom:80}}>
        <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
          <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
          <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Mon panier ({cartCount})</span>
        </div>
        <div style={{padding:12}}>
          {cart.map(item=>{
            const p=findP(item.pid); const v=findV(p?.vendorId); if(!p||!v) return null;
            return (
              <div key={item.pid} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:12,marginBottom:8,display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:60,height:60,borderRadius:6,background:`linear-gradient(135deg,${v.color}CC,${v.color}44)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:16,flexShrink:0}}>{v.initials}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:T.text}}>{p.title}</div>
                  <div style={{fontSize:15,fontWeight:800,color:T.orange}}>{money(p.price*item.qty)}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <button style={{width:28,height:28,borderRadius:"50%",background:T.tag,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>updQty(item.pid,-1)}><Minus size={12}/></button>
                  <span style={{fontWeight:700,minWidth:20,textAlign:"center"}}>{item.qty}</span>
                  <button style={{width:28,height:28,borderRadius:"50%",background:T.tag,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>updQty(item.pid,1)}><Plus size={12}/></button>
                  <button style={{width:28,height:28,borderRadius:"50%",background:"#FFEBEE",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#E53935"}} onClick={()=>remCart(item.pid)}><Trash2 size={12}/></button>
                </div>
              </div>
            );
          })}
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:14,marginBottom:10}}>
            <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10}}>Zone de livraison</div>
            {ZONES.map(z=>(
              <button key={z.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"10px 0",background:"none",border:"none",borderBottom:`1px solid ${T.border}`,cursor:"pointer",color:T.text}} onClick={()=>setZone(z.id)}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${zone===z.id?T.orange:T.muted}`,background:zone===z.id?T.orange:"transparent"}}/>
                  <span style={{fontSize:14}}>{z.label}</span>
                </div>
                <span style={{fontSize:14,fontWeight:600,color:T.orange}}>{money(z.fee)}</span>
              </button>
            ))}
          </div>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:14,marginBottom:10}}>
            <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10}}>Paiement</div>
            <div style={{display:"flex",gap:8}}>
              {PAYMENTS.map(pm=>(
                <button key={pm.id} style={{flex:1,background:payment===pm.id?pm.color+"22":T.tag,border:`2px solid ${payment===pm.id?pm.color:T.border}`,borderRadius:8,padding:"10px 4px",cursor:"pointer",textAlign:"center"}} onClick={()=>setPayment(pm.id)}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:pm.color,margin:"0 auto 5px"}}/>
                  <div style={{fontSize:10,fontWeight:600,color:T.text}}>{pm.label}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:14,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:14,color:T.sub}}><span>Sous-total</span><span>{money(subtotal)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:14,color:T.sub}}><span>Livraison</span><span>{money(delivFee)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:18,fontWeight:800,color:T.orange}}><span>Total</span><span>{money(total)}</span></div>
          </div>
          <button style={{width:"100%",background:payment?T.orange:T.muted,color:"#fff",border:"none",borderRadius:10,padding:14,fontSize:16,fontWeight:700,cursor:payment?"pointer":"not-allowed"}} onClick={()=>payment&&setConfirmed(true)}>
            {payment?"Confirmer la commande":"Choisissez un mode de paiement"}
          </button>
        </div>
      </div>
    );
  };

  const CalendarPicker = ({selectedDay, onSelect, T}) => {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());

    const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
    const dayNames = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();

    const prevMonth = () => {
      if(month===0){setMonth(11);setYear(y=>y-1);}
      else setMonth(m=>m-1);
    };
    const nextMonth = () => {
      if(month===11){setMonth(0);setYear(y=>y+1);}
      else setMonth(m=>m+1);
    };

    const formatDay = (d) => `${String(d).padStart(2,"0")}/${String(month+1).padStart(2,"0")}/${year}`;
    const isPast = (d) => new Date(year,month,d) < new Date(today.getFullYear(),today.getMonth(),today.getDate());

    return (
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:12,marginBottom:8}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <button style={{background:T.tag,border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:16,color:T.text}} onClick={prevMonth}>‹</button>
          <span style={{fontWeight:700,fontSize:14,color:T.text}}>{monthNames[month]} {year}</span>
          <button style={{background:T.tag,border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:16,color:T.text}} onClick={nextMonth}>›</button>
        </div>
        {/* Day names */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
          {dayNames.map(d=>(
            <div key={d} style={{textAlign:"center",fontSize:10,color:T.muted,fontWeight:600,padding:"2px 0"}}>{d}</div>
          ))}
        </div>
        {/* Days grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
          {Array(firstDay).fill(null).map((_,i)=>(
            <div key={"e"+i}/>
          ))}
          {Array(daysInMonth).fill(null).map((_,i)=>{
            const d = i+1;
            const key = formatDay(d);
            const past = isPast(d);
            const selected = selectedDay===key;
            const isToday = d===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
            return (
              <button key={d} disabled={past}
                style={{
                  background:selected?T.orange:isToday?T.indigoBg:"transparent",
                  color:selected?"#fff":past?T.muted:isToday?T.orange:T.text,
                  border:`1px solid ${selected?T.orange:isToday?T.orange:"transparent"}`,
                  borderRadius:8,padding:"6px 2px",cursor:past?"not-allowed":"pointer",
                  fontSize:13,fontWeight:selected||isToday?700:400,
                  opacity:past?0.4:1,
                }}
                onClick={()=>!past&&onSelect(key)}>
                {d}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const BookingScreen = () => {
    const p=findP(screenId);
    const [confirmed,setConfirmed]=useState(false);
    if(!p) return (
      <div style={{padding:20,textAlign:"center",paddingTop:60}}>
        <div style={{fontSize:40,marginBottom:12}}>📅</div>
        <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:8}}>Chargement du service...</div>
        <div style={{fontSize:13,color:T.sub,marginBottom:20}}>ID: {screenId}</div>
        <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={()=>go("home")}>Retour</button>
      </div>
    );
    const v=getProductVendor(p) || {name:'Vendeur',zone:'',phone:''};
    if(confirmed) return (
      <div style={{padding:"60px 20px",textAlign:"center"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:"#E8F5E9",color:"#2E7D32",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><CheckCircle2 size={32}/></div>
        <div style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:8}}>Rendez-vous confirmé !</div>
        <div style={{color:T.orange,fontWeight:600,marginBottom:4}}>{bookDay} à {bookSlot}</div>
        <div style={{color:T.sub,fontSize:14,marginBottom:24}}>{p.title} avec {v.name}</div>
        <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"13px 24px",fontSize:15,fontWeight:700,cursor:"pointer"}} onClick={()=>go("home")}>Retour à l'accueil</button>
      </div>
    );
    return (
      <div style={{paddingBottom:70}}>
        <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
          <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("product",p.id)}><ArrowLeft size={20}/></button>
          <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Prendre rendez-vous</span>
        </div>
        <div style={{padding:14}}>
          <div style={{background:T.card,borderRadius:10,padding:14,marginBottom:14}}>
            <div style={{fontSize:16,fontWeight:700,color:T.text}}>{p.title}</div>
            <div style={{fontSize:14,color:T.sub}}>{v.name} · {v.zone}</div>
            <div style={{fontSize:20,fontWeight:800,color:T.orange,marginTop:6}}>{money(p.price)}</div>
          </div>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10}}>Choisir une date</div>
          <CalendarPicker selectedDay={bookDay} onSelect={(d)=>{setBookDay(d);setBookSlot(null);}} T={T}/>
          <div style={{marginBottom:16}}/>
          {bookDay&&<>
            <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10}}>Choisir un créneau</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
              {SLOTS.map(sl=>{
                const taken=SLOT_TAKEN[`${bookDay}-${sl}`];
                return <button key={sl} disabled={taken} style={{background:taken?T.tag:(bookSlot===sl?T.orange:T.card),color:taken?T.muted:(bookSlot===sl?"#fff":T.text),border:`1px solid ${taken?T.border:(bookSlot===sl?T.orange:T.border)}`,borderRadius:8,padding:"10px 4px",cursor:taken?"not-allowed":"pointer",fontSize:13,fontWeight:600,opacity:taken?0.5:1}} onClick={()=>!taken&&setBookSlot(sl)}>{taken?"Complet":sl}</button>;
              })}
            </div>
          </>}
          <button style={{width:"100%",background:bookDay&&bookSlot?T.orange:T.muted,color:"#fff",border:"none",borderRadius:10,padding:14,fontSize:16,fontWeight:700,cursor:bookDay&&bookSlot?"pointer":"not-allowed"}}
            onClick={()=>{
              if(!bookDay||!bookSlot) return;
              setConfirmed(true);
            }}>
            {bookDay&&bookSlot?"Confirmer le rendez-vous":"Sélectionnez date et créneau"}
          </button>
        </div>
      </div>
    );
  };

  const EditVendorForm = ({vendor, onSave}) => {
    const [form, setForm] = useState({
      name: vendor.name||"",
      description: vendor.description||"",
      phone: vendor.phone||"",
      city: vendor.city||""
    });
    const [saving, setSaving] = useState(false);
    const [logoFile, setLogoFile] = useState(null);

    return (
      <div style={{background:T.indigoBg,borderRadius:10,padding:14,border:`1px solid ${T.orange}`}}>
        <div style={{fontSize:13,fontWeight:700,color:T.orange,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
          <Pencil size={13}/> Complétez votre profil boutique — une seule fois
        </div>
        <div style={{fontSize:11,color:T.sub,marginBottom:12}}>
          Modifiez les informations de votre boutique.
        </div>
        {[
          {label:"Nom de la boutique",key:"name"},
          {label:"Description",key:"description"},
          {label:"Téléphone",key:"phone"},
          {label:"Ville",key:"city"},
        ].map(f=>(
          <input key={f.key}
            style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,color:T.text,outline:"none",marginBottom:8,boxSizing:"border-box"}}
            placeholder={f.label}
            defaultValue={form[f.key]}
            onBlur={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
          />
        ))}
        <label style={{display:"flex",alignItems:"center",gap:10,background:T.card,border:`1px dashed ${T.border}`,borderRadius:8,padding:"9px 12px",cursor:"pointer",marginBottom:12}}>
          <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>setLogoFile(e.target.files?.[0]||null)}/>
          <span style={{color:T.orange,display:"flex"}}><Store size={16}/></span>
          <span style={{fontSize:12,color:logoFile?T.green:T.sub}}>{logoFile?logoFile.name:"Logo de la boutique (optionnel)"}</span>
        </label>
        <button style={{width:"100%",background:saving?T.muted:T.orange,color:"#fff",border:"none",borderRadius:8,padding:"11px",fontSize:14,fontWeight:700,cursor:saving?"not-allowed":"pointer"}}
          disabled={saving}
          onClick={async()=>{
            if(!form.name||!form.phone||!form.city){alert("Remplissez tous les champs obligatoires");return;}
            setSaving(true);
            try {
              let logo_url = vendor.logo_url;
              if(logoFile) logo_url = await uploadImage(logoFile);
              await onSave({...form, logo_url});
            } catch(e){alert("Erreur: "+e.message);}
            setSaving(false);
          }}>
          {saving?"Enregistrement...":"Enregistrer définitivement"}
        </button>
      </div>
    );
  };

  const DashboardScreen = () => {
    const me = myVendor;
    if(!me && !loading) return (
      <div style={{padding:20,textAlign:"center",paddingBottom:70}}>
        <div style={{fontSize:40,marginBottom:12}}>🏪</div>
        <div style={{fontSize:17,fontWeight:700,color:T.text,marginBottom:8}}>Vous n'avez pas encore de boutique</div>
        <p style={{color:T.sub,fontSize:14,marginBottom:20}}>Soumettez une demande de certification pour créer votre boutique Woko.</p>
        <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"13px 24px",fontSize:15,fontWeight:700,cursor:"pointer"}} onClick={()=>go("vendor-request")}>
          Demander la certification
        </button>
      </div>
    );
    if(!me && loading) return (
      <div style={{padding:60,textAlign:"center",color:T.sub}}>
        <div style={{fontSize:14}}>Chargement de votre boutique...</div>
      </div>
    );
    const addProduct = async () => {
      if(!newP.title||!newP.price||!me) return;
      setNewP(p=>({...p,uploading:true}));
      try {
        let image_url = null;
        if(newP.imageFile) {
          image_url = await uploadImage(newP.imageFile);
        }
        const { createProduct } = await import('./api.js');
        const p = await createProduct({
          vendor_id: me.id,
          title: newP.title,
          price: Number(newP.price),
          type: newP.type,
          image_url,
          available: true
        });
        setSellerProducts(prev=>[...prev, p]);
        await loadData();
        setNewP({title:"",price:"",type:"produit",imageFile:null,uploading:false});
        setShowAdd(false);
      } catch(e) { console.error(e); alert("Erreur: " + e.message); setNewP(p=>({...p,uploading:false})); }
    };
    return (
      <div style={{paddingBottom:70}}>
        <div style={{background:T.headerTop,padding:"12px 14px"}}>
          <div style={{color:"#fff",fontWeight:800,fontSize:18}}>Mon espace vendeur</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>{me.name}</div>
        </div>
        <div style={{background:T.card,margin:12,borderRadius:10,padding:14,marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:me.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:18}}>{me.initials||me.name?.[0]}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontWeight:700,fontSize:16,color:T.text}}>{me.name}</div>
              <button style={{background:"none",border:"none",cursor:"pointer",color:T.orange,padding:2}} onClick={()=>setShowEditVendor(v=>!v)}>
                <Pencil size={14}/>
              </button>
            </div>
            <div style={{fontSize:12,color:T.sub,marginBottom:4}}>{me.city} · {me.phone}</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:4,background:"#E3F2FD",color:"#1565C0",borderRadius:10,padding:"2px 8px",fontSize:11,fontWeight:700}}><BadgeCheck size={11}/>CERTIFIÉ</div>
          </div>
        </div>
        {showEditVendor&&(
          <div style={{marginTop:12,padding:"0 0 4px"}}>
            <EditVendorForm vendor={me} onSave={async(data)=>{
              try {
                await supabase.from('vendors').update(data).eq('id',me.id);
                setMyVendor({...me,...data});
                setShowEditVendor(false);
                await loadData();
              } catch(e){alert("Erreur: "+e.message);}
            }}/>
          </div>
        )}
        <div style={{display:"flex",background:T.card,borderBottom:`1px solid ${T.border}`,marginBottom:8}}>
          {["catalogue","commandes"].map(tab=>(
            <button key={tab} style={{flex:1,padding:"13px",background:"none",border:"none",borderBottom:`3px solid ${sellerTab===tab?T.orange:"transparent"}`,cursor:"pointer",fontSize:14,fontWeight:600,color:sellerTab===tab?T.orange:T.sub}} onClick={()=>setSellerTab(tab)}>
              {tab==="catalogue"?"Mon catalogue":"Commandes & RDV"}
            </button>
          ))}
        </div>
        <div style={{padding:"0 12px"}}>
          {sellerTab==="catalogue"?<>
            {sellerProducts.map(p=>(
              <div key={p.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:12,marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:44,height:44,borderRadius:6,background:`${me.color}33`,display:"flex",alignItems:"center",justifyContent:"center",color:me.color,fontWeight:700,flexShrink:0}}>{me.initials}</div>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.text}}>{p.title}</div><div style={{fontSize:13,color:T.orange,fontWeight:700}}>{money(p.price)}</div></div>
                <button style={{width:32,height:32,borderRadius:6,background:T.tag,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Pencil size={14} color={T.sub}/></button>
                <button style={{width:32,height:32,borderRadius:6,background:"#FFEBEE",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={async()=>{
                    try{
                      const {deleteProduct}=await import('./api.js');
                      await deleteProduct(p.id);
                      setSellerProducts(prev=>prev.filter(x=>x.id!==p.id));
                      await loadData();
                    }catch(e){console.error(e);}
                  }}><Trash2 size={14} color="#E53935"/></button>
              </div>
            ))}
            {showAdd
              ?<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:14,marginBottom:8}}>
                <input style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",fontSize:14,color:T.text,outline:"none",marginBottom:8,boxSizing:"border-box"}} placeholder="Titre du produit / service" defaultValue={newP.title} onBlur={e=>setNewP(p=>({...p,title:e.target.value}))}/>
                <input style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",fontSize:14,color:T.text,outline:"none",marginBottom:8,boxSizing:"border-box"}} placeholder="Prix en FCFA" type="number" defaultValue={newP.price} onBlur={e=>setNewP(p=>({...p,price:e.target.value}))}/>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  {["produit","service"].map(t=><button key={t} style={{flex:1,background:newP.type===t?T.orange:T.tag,color:newP.type===t?"#fff":T.text,border:"none",borderRadius:8,padding:"10px",fontSize:14,fontWeight:600,cursor:"pointer"}} onClick={()=>setNewP({...newP,type:t})}>{t}</button>)}
                </div>
                <label style={{display:"flex",alignItems:"center",gap:10,background:T.bg,border:`1px dashed ${T.border}`,borderRadius:8,padding:"11px 12px",cursor:"pointer",marginBottom:12}}>
                  <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>setNewP({...newP,imageFile:e.target.files?.[0]||null})}/>
                  {newP.imageFile
                    ?<><span style={{fontSize:18}}>🖼</span><span style={{fontSize:13,color:T.green,fontWeight:600}}>{newP.imageFile.name}</span></>
                    :<><span style={{fontSize:18}}>📷</span><span style={{fontSize:13,color:T.sub}}>Ajouter une photo (optionnel)</span></>
                  }
                </label>
                {newP.uploading&&<div style={{fontSize:12,color:T.orange,marginBottom:8,textAlign:"center"}}>Upload en cours...</div>}
                <div style={{display:"flex",gap:8}}>
                  <button style={{flex:1,background:T.orange,color:"#fff",border:"none",borderRadius:8,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={addProduct}>Enregistrer</button>
                  <button style={{flex:1,background:T.tag,color:T.text,border:"none",borderRadius:8,padding:"12px",fontSize:14,cursor:"pointer"}} onClick={()=>setShowAdd(false)}>Annuler</button>
                </div>
              </div>
              :<button style={{width:"100%",background:T.card,border:`2px dashed ${T.orange}`,borderRadius:8,padding:"14px",color:T.orange,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:8}} onClick={()=>setShowAdd(true)}>
                <Plus size={16}/>Ajouter un produit / service
              </button>
            }
          </>:<>
            <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><ClipboardList size={15} color={T.orange}/>Commandes</div>
            {orders.map(o=>(
              <div key={o.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:12,marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.text}}>{o.produit}</div><div style={{fontSize:13,color:T.sub}}>{o.client} · <span style={{color:T.orange,fontWeight:700}}>{money(o.montant)}</span></div></div>
                {o.statut==="expediee"
                  ?<div style={{display:"flex",alignItems:"center",gap:4,background:"#E8F5E9",color:"#2E7D32",borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:700}}><CheckCircle2 size={11}/>EXPÉDIÉE</div>
                  :<button style={{background:T.orange,color:"#fff",border:"none",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>setOrders(prev=>prev.map(x=>x.id===o.id?{...x,statut:"expediee"}:x))}>Expédiée</button>
                }
              </div>
            ))}
            <div style={{fontSize:14,fontWeight:700,color:T.text,margin:"16px 0 10px",display:"flex",alignItems:"center",gap:6}}><CalendarDays size={15} color={T.orange}/>Rendez-vous</div>
            {appts.map(a=>(
              <div key={a.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:12,marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.text}}>{a.service}</div><div style={{fontSize:13,color:T.sub}}>{a.client}</div></div>
                <div style={{background:T.indigoBg,color:T.orange,borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:700}}>{a.date} · {a.heure}</div>
              </div>
            ))}
          </>}
        </div>
      </div>
    );
  };

  const VendorRequestScreen = () => {
    const [form, setForm] = useState({shop_name:"",description:"",phone:"",city:""});
    const [idFile, setIdFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    if(!user) return (
      <div style={{padding:20,textAlign:"center"}}>
        <div style={{fontSize:17,fontWeight:700,color:T.text,marginBottom:12}}>Connectez-vous d'abord</div>
        <button style={{background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={()=>setLoginModal(true)}>Se connecter</button>
      </div>
    );

    if(done) return (
      <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 24px",textAlign:"center"}}>
        <div style={{background:T.card,borderRadius:24,padding:"40px 28px",maxWidth:400,width:"100%",boxShadow:"0 8px 32px rgba(0,0,0,0.08)"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#E65100,#FF8F00)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:36}}>
            🏪
          </div>
          <div style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:8}}>Demande envoyée !</div>
          <div style={{width:48,height:3,background:T.orange,borderRadius:2,margin:"0 auto 16px"}}/>
          <p style={{color:T.sub,fontSize:14,lineHeight:1.7,marginBottom:24}}>
            Merci pour votre confiance. L'équipe <strong style={{color:T.orange}}>Woko</strong> va examiner votre dossier sous <strong>24 à 48 heures</strong>. Vous serez notifié par email dès validation.
          </p>
          <div style={{background:T.indigoBg,borderRadius:12,padding:"14px 16px",marginBottom:24,textAlign:"left"}}>
            {[
              {emoji:"📋",text:"Dossier en cours d'examen"},
              {emoji:"✅",text:"Validation sous 24-48h"},
              {emoji:"📧",text:"Notification par email"},
              {emoji:"🏪",text:"Boutique activée immédiatement"},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:i<3?10:0}}>
                <span style={{fontSize:18}}>{s.emoji}</span>
                <span style={{fontSize:13,color:T.text}}>{s.text}</span>
              </div>
            ))}
          </div>
          <button style={{width:"100%",background:T.orange,color:"#fff",border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer"}} onClick={()=>go("home")}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    );

    const handleSubmit = async () => {
      if(!form.shop_name||!form.phone||!form.city) { alert("Remplissez tous les champs obligatoires"); return; }
      setSubmitting(true);
      try {
        let id_document_url = null;
        if(idFile) {
          id_document_url = await uploadImage(idFile);
        }
        const { submitVendorRequest } = await import('./api.js');
        await submitVendorRequest({
          user_id: user.id,
          shop_name: form.shop_name,
          description: form.description,
          phone: form.phone,
          city: form.city,
          id_document_url
        });

        // Notify owner via Edge Function
        try {
          await supabase.functions.invoke('notify-vendor-request', {
            body: {
              shop_name: form.shop_name,
              phone: form.phone,
              city: form.city,
              user_email: user.email
            }
          });
        } catch(e) { console.warn("Email notification failed:", e); }

        setDone(true);
      } catch(e) {
        if(e.message?.includes('one_pending_per_user')) {
          alert("Vous avez déjà une demande en cours d'examen. L'équipe Woko vous contactera sous 24-48h.");
        } else if(e.message?.includes('one_vendor_per_user')) {
          alert("Vous avez déjà une boutique active sur Woko.");
        } else {
          alert("Erreur: " + e.message);
        }
      }
      setSubmitting(false);
    };

    return (
      <div style={{paddingBottom:70}}>
        <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
          <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
          <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Devenir vendeur certifié</span>
        </div>
        <div style={{padding:16}}>
          <div style={{background:T.indigoBg,borderRadius:10,padding:14,marginBottom:16,fontSize:13,color:T.orange}}>
            🏪 Complétez ce formulaire pour soumettre votre demande de certification. L'équipe Woko vérifiera votre identité sous 24-48h.
          </div>
          {[
            {label:"Nom de la boutique *",key:"shop_name",placeholder:"Ex: Aïcha Couture"},
            {label:"Description",key:"description",placeholder:"Décrivez votre activité..."},
            {label:"Téléphone *",key:"phone",placeholder:"+223 70 00 00 00"},
            {label:"Ville *",key:"city",placeholder:"Bamako, Sikasso..."},
          ].map(field=>(
            <div key={field.key} style={{marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:6}}>{field.label}</div>
              <input
                style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:"11px 12px",fontSize:14,color:T.text,outline:"none",boxSizing:"border-box"}}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={e=>setForm({...form,[field.key]:e.target.value})}
              />
            </div>
          ))}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:6}}>Pièce d'identité (optionnel)</div>
            <label style={{display:"flex",alignItems:"center",gap:10,background:T.bg,border:`1px dashed ${T.border}`,borderRadius:8,padding:"12px",cursor:"pointer"}}>
              <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>setIdFile(e.target.files?.[0]||null)}/>
              <span style={{fontSize:22}}>📄</span>
              <span style={{fontSize:13,color:idFile?T.green:T.sub}}>{idFile?idFile.name:"Importer votre CNI, passeport..."}</span>
            </label>
          </div>
          <button
            style={{width:"100%",background:submitting?T.muted:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"14px",fontSize:15,fontWeight:700,cursor:submitting?"not-allowed":"pointer"}}
            onClick={handleSubmit} disabled={submitting}>
            {submitting?"Envoi en cours...":"Soumettre ma demande"}
          </button>
        </div>
      </div>
    );
  };

  const AdminScreen = () => {
    const [adminTab, setAdminTab] = useState("requests");
    const [requests, setRequests] = useState([]);
    const [allVendors, setAllVendors] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [stats, setStats] = useState({vendors:0,products:0,requests:0,users:0});
    const [loadingReq, setLoadingReq] = useState(true);

    useEffect(()=>{
      const load = async () => {
        try {
          const { getPendingRequests, getAllUsers, getAdminStats, getAllVendorsAdmin } = await import('./api.js');
          const [reqs, users, vs, stats] = await Promise.all([
            getPendingRequests(),
            getAllUsers(),
            getAllVendorsAdmin(),
            getAdminStats()
          ]);
          setRequests(reqs||[]);
          setAllUsers(users||[]);
          setAllVendors(vs||[]);
          setStats({
            vendors: stats?.vendors||0,
            products: stats?.products||0,
            requests: stats?.pending_requests||0,
            users: stats?.users||0
          });
        } catch(e){ console.error(e); }
        setLoadingReq(false);
      };
      load();
    },[]);

    if(userRole !== 'admin' && userRole !== 'owner') return (
      <div style={{padding:40,textAlign:"center",color:T.sub}}>Accès refusé</div>
    );

    const handleReview = async (id, status) => {
      try {
        const { reviewVendorRequest } = await import('./api.js');
        await reviewVendorRequest(id, status, user.id);
        setRequests(prev=>prev.filter(r=>r.id!==id));
        await loadData();
        if(status==="approved") setStats(s=>({...s,vendors:s.vendors+1,requests:s.requests-1}));
        else setStats(s=>({...s,requests:s.requests-1}));
      } catch(e){ alert("Erreur: "+e.message); }
    };

    const handleToggleCert = async (vendorId, current) => {
      try {
        await supabase.from('vendors').update({certified:!current}).eq('id',vendorId);
        setAllVendors(prev=>prev.map(v=>v.id===vendorId?{...v,certified:!current}:v));
        await loadData();
      } catch(e){ alert("Erreur: "+e.message); }
    };

    const handleSetRole = async (userId, role) => {
      if(!window.confirm(`Définir ce rôle: ${role} ?`)) return;
      try {
        const { setUserRole } = await import('./api.js');
        await setUserRole(userId, role);
        setAllUsers(prev=>prev.map(u=>u.user_id===userId?{...u,role}:u));
      } catch(e){ alert("Erreur: "+e.message); }
    };

    const StatCard = ({emoji,label,value,color}) => (
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 10px",textAlign:"center",flex:1}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:6}}>{emoji}</div>
        <div style={{fontSize:22,fontWeight:800,color:color||T.orange}}>{value}</div>
        <div style={{fontSize:11,color:T.sub}}>{label}</div>
      </div>
    );

    return (
      <div style={{paddingBottom:70}}>
        <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
          <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
          <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Panel Admin</span>
          <span style={{background:"rgba(255,255,255,0.2)",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,marginLeft:"auto"}}>{userRole.toUpperCase()}</span>
        </div>

        {/* Stats */}
        <div style={{display:"flex",gap:8,padding:"12px 12px 0"}}>
          <StatCard emoji={<Store size={22} color={T.orange}/>} label="Boutiques" value={stats.vendors}/>
          <StatCard emoji={<ShoppingCart size={22} color={T.orange}/>} label="Produits" value={stats.products}/>
          <StatCard emoji={<Clock size={22} color="#E53935"/>} label="En attente" value={stats.requests} color="#E53935"/>
          <StatCard emoji={<User size={22} color={T.orange}/>} label="Utilisateurs" value={stats.users}/>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",background:T.card,borderBottom:`1px solid ${T.border}`,margin:"12px 0 0",overflowX:"auto"}}>
          {[
            {id:"requests",label:`Demandes (${stats.requests})`},
            {id:"vendors",label:"Boutiques"},
            ...(userRole==="owner"?[{id:"users",label:"Utilisateurs"}]:[]),
          ].map(tab=>(
            <button key={tab.id} style={{flex:1,padding:"12px 8px",background:"none",border:"none",borderBottom:`3px solid ${adminTab===tab.id?T.orange:"transparent"}`,cursor:"pointer",fontSize:13,fontWeight:600,color:adminTab===tab.id?T.orange:T.sub,whiteSpace:"nowrap"}}
              onClick={()=>setAdminTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{padding:"12px 12px"}}>
          {/* REQUESTS TAB */}
          {adminTab==="requests"&&(
            loadingReq
              ?<div style={{textAlign:"center",padding:20,color:T.sub}}>Chargement...</div>
              :requests.length===0
              ?<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:24,textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:8}}>🎉</div>
                <div style={{color:T.sub}}>Aucune demande en attente</div>
              </div>
              :requests.map(r=>(
                <div key={r.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:14,marginBottom:10}}>
                  <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:4}}>{r.shop_name}</div>
                  <div style={{fontSize:13,color:T.sub,marginBottom:4}}>📍 {r.city} · 📞 {r.phone}</div>
                  {r.description&&<div style={{fontSize:13,color:T.sub,marginBottom:6}}>{r.description}</div>}
                  {r.id_document_url&&(
                    <a href={r.id_document_url} target="_blank" rel="noreferrer"
                      style={{display:"inline-flex",alignItems:"center",gap:6,color:T.orange,fontSize:13,marginBottom:10,textDecoration:"none"}}>
                      📄 Voir pièce d'identité
                    </a>
                  )}
                  <div style={{fontSize:11,color:T.muted,marginBottom:10}}>
                    Soumis le {new Date(r.created_at).toLocaleDateString("fr-FR")}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button style={{flex:1,background:"#E8F5E9",color:"#2E7D32",border:"none",borderRadius:8,padding:"10px",fontSize:14,fontWeight:700,cursor:"pointer"}}
                      onClick={()=>handleReview(r.id,"approved")}>✅ Approuver</button>
                    <button style={{flex:1,background:"#FFEBEE",color:"#E53935",border:"none",borderRadius:8,padding:"10px",fontSize:14,fontWeight:700,cursor:"pointer"}}
                      onClick={()=>handleReview(r.id,"rejected")}>❌ Rejeter</button>
                  </div>
                </div>
              ))
          )}

          {/* VENDORS TAB */}
          {adminTab==="vendors"&&(
            allVendors.length===0
              ?<div style={{textAlign:"center",padding:20,color:T.sub}}>Aucune boutique</div>
              :allVendors.map(v=>(
                <div key={v.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:12,marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:T.orange,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:16,flexShrink:0}}>
                    {v.name?.[0]?.toUpperCase()||"?"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:700,color:T.text}}>{v.name}</div>
                    <div style={{fontSize:12,color:T.sub}}>📍 {v.city||"N/A"} · 📞 {v.phone||"N/A"}</div>
                  </div>
                  <button
                    style={{background:v.certified?"#E8F5E9":"#FFEBEE",color:v.certified?"#2E7D32":"#E53935",border:"none",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}
                    onClick={()=>handleToggleCert(v.id,v.certified)}>
                    {v.certified?"✅ Certifié":"❌ Non certifié"}
                  </button>
                </div>
              ))
          )}

          {/* USERS TAB - owner only */}
          {adminTab==="users"&&userRole==="owner"&&(
            allUsers.length===0
              ?<div style={{textAlign:"center",padding:20,color:T.sub}}>Aucun utilisateur</div>
              :allUsers.map(u=>(
                <div key={u.user_id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:12,marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:T.orange,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14}}>
                      {u.user_id?.[0]?.toUpperCase()||"?"}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,color:T.text,fontWeight:600}}>{u.user_id?.slice(0,8)}...</div>
                      <div style={{fontSize:11,color:T.sub}}>Inscrit le {new Date(u.created_at).toLocaleDateString("fr-FR")}</div>
                    </div>
                    <span style={{background:
                      u.role==="owner"?"#FFF3E0":
                      u.role==="admin"?"#E8EAF6":
                      u.role==="vendor"?"#E8F5E9":"#F5F5F5",
                      color:
                      u.role==="owner"?T.orange:
                      u.role==="admin"?"#3949AB":
                      u.role==="vendor"?"#2E7D32":"#757575",
                      borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700}}>
                      {u.role?.toUpperCase()}
                    </span>
                  </div>
                  {u.user_id!==user?.id&&(
                    <div style={{display:"flex",gap:6}}>
                      {["buyer","vendor","admin"].map(role=>(
                        <button key={role}
                          style={{flex:1,background:u.role===role?T.indigoBg:T.tag,color:u.role===role?T.orange:T.sub,border:`1px solid ${u.role===role?T.orange:T.border}`,borderRadius:6,padding:"6px 4px",fontSize:11,fontWeight:600,cursor:"pointer"}}
                          onClick={()=>handleSetRole(u.user_id,role)}>
                          {role}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
    );
  };

    const ProfileScreen = () => {
    if(!user) { go("home"); return null; }
    const [avatarUrl, setAvatarUrl] = useState(user.user_metadata?.avatar_url || null);
    const fileRef = useState(null);

    const handleAvatarChange = async (e) => {
      const file = e.target.files?.[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarUrl(ev.target.result);
      reader.readAsDataURL(file);
    };

    return (
      <div style={{paddingBottom:70,animation:"fadeIn 0.3s ease"}}>
        <style>{`
          @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
          @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          .slide-item { animation: slideUp 0.3s ease both; }
          html { scroll-behavior: smooth; }
        `}</style>
        <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
          <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
          <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Mon profil</span>
        </div>
        <div style={{padding:16}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:24,textAlign:"center",marginBottom:14}}>
            {/* Avatar clickable */}
            <label style={{cursor:"pointer",display:"inline-block",position:"relative",marginBottom:12}}>
              <input type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatarChange}/>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" style={{width:80,height:80,borderRadius:"50%",objectFit:"cover",border:`3px solid ${T.orange}`}}/>
                : <div style={{width:80,height:80,borderRadius:"50%",background:T.orange,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:30,border:`3px solid ${T.orange}`}}>
                    {user.email?.[0].toUpperCase()}
                  </div>
              }
              <div style={{position:"absolute",bottom:0,right:0,background:T.orange,borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff"}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
              </div>
            </label>
            <div style={{fontSize:18,fontWeight:700,color:T.text}}>{user.user_metadata?.full_name||user.email?.split("@")[0]}</div>
            <div style={{fontSize:13,color:T.sub,marginTop:4}}>{user.email}</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#E8F5E9",color:"#2E7D32",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,marginTop:10}}>
              <CheckCircle2 size={12}/> Compte vérifié Google
            </div>
          </div>
          {[
            {icon:<Store size={20}/>,label:"Mon espace vendeur",action:()=>go("dashboard"),delay:"0.1s"},
            {icon:<ShoppingCart size={20}/>,label:"Mes commandes",action:()=>{},delay:"0.15s"},
            {icon:<Heart size={20}/>,label:"Mes favoris",action:()=>{},delay:"0.2s"},
            {icon:<Bell size={20}/>,label:"Notifications",action:()=>{},delay:"0.25s"},
            {icon:<FileText size={20}/>,label:"Conditions d'utilisation",action:()=>go("tos"),delay:"0.3s"},
            {icon:<Lock size={20}/>,label:"Politique de confidentialité",action:()=>go("privacy"),delay:"0.35s"},
            ...(userRole==="admin"||userRole==="owner"?[{icon:<Settings size={20}/>,label:"Panel Admin",action:()=>go("admin"),delay:"0.4s"}]:[]),
          ].map((item,i)=>(
            <button key={i} className="slide-item" style={{display:"flex",alignItems:"center",gap:14,width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",marginBottom:8,cursor:"pointer",color:T.text,fontSize:15,fontWeight:500,textAlign:"left",animationDelay:item.delay}} onClick={item.action}>
              <span style={{color:T.orange,display:"flex"}}>{item.icon}</span>
              <span style={{flex:1}}>{item.label}</span>
              <ChevronRight size={16} color={T.muted}/>
            </button>
          ))}
          <button className="slide-item" style={{width:"100%",background:"#FFEBEE",color:"#E53935",border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:8,animationDelay:"0.4s"}}
            onClick={async()=>{await supabase.auth.signOut();go("home");}}>
            Se déconnecter
          </button>
        </div>
      </div>
    );
  };

    const TosScreen = () => (
    <div style={{paddingBottom:70}}>
      <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
        <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
        <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Conditions d'utilisation</span>
      </div>
      <div style={{padding:"20px 16px",lineHeight:1.7}}>
        <div style={{fontSize:13,color:T.muted,marginBottom:20}}>Dernière mise à jour : Août 2026</div>
        {[
          {title:"1. Acceptation des conditions",text:"En utilisant Woko, vous acceptez les présentes conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service."},
          {title:"2. Description du service",text:"Woko est une marketplace en ligne permettant aux vendeurs certifiés d'Afrique de l'Ouest de proposer leurs produits et services."},
          {title:"3. Inscription et compte",text:"Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de la confidentialité de vos informations de connexion."},
          {title:"4. Vendeurs certifiés",text:"La certification est effectuée manuellement par l'équipe Woko après vérification d'une pièce d'identité valide."},
          {title:"5. Paiements",text:"Les paiements sont effectués via Orange Money, Wave et Moov Money. Woko n'est pas responsable des litiges entre acheteurs et vendeurs."},
          {title:"6. Livraison",text:"Les conditions de livraison sont définies par chaque vendeur. Woko facilite la mise en relation mais n'est pas responsable des délais."},
          {title:"7. Modifications",text:"Woko se réserve le droit de modifier ces conditions à tout moment."},
        ].map((s,i)=>(
          <div key={i} style={{marginBottom:20}}>
            <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:6}}>{s.title}</div>
            <div style={{fontSize:14,color:T.sub}}>{s.text}</div>
          </div>
        ))}
        <div style={{fontSize:13,color:T.muted,borderTop:`1px solid ${T.border}`,paddingTop:16}}>Contact : <span style={{color:T.orange}}>support@woko.africa</span></div>
      </div>
    </div>
  );

  const PrivacyScreen = () => (
    <div style={{paddingBottom:70}}>
      <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
        <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
        <span style={{color:"#fff",fontWeight:700,fontSize:17}}>Politique de confidentialité</span>
      </div>
      <div style={{padding:"20px 16px",lineHeight:1.7}}>
        <div style={{fontSize:13,color:T.muted,marginBottom:20}}>Dernière mise à jour : Août 2026</div>
        {[
          {title:"1. Données collectées",text:"Woko collecte : adresse email, nom d'affichage via Google OAuth, historique des commandes et rendez-vous."},
          {title:"2. Utilisation des données",text:"Vos données sont utilisées pour gérer votre compte, traiter vos commandes et améliorer nos services. Nous ne vendons jamais vos données."},
          {title:"3. Authentification Google",text:"Lorsque vous vous connectez via Google, nous recevons uniquement votre email et votre nom."},
          {title:"4. Sécurité",text:"Vos données sont stockées de manière sécurisée via Supabase avec chiffrement en transit et au repos."},
          {title:"5. Vos droits",text:"Vous pouvez demander l'accès, la modification ou la suppression de vos données en nous contactant."},
          {title:"6. Cookies",text:"Woko utilise uniquement des cookies essentiels. Aucun cookie de tracking publicitaire."},
          {title:"7. Contact",text:"Pour toute question : privacy@woko.africa"},
        ].map((s,i)=>(
          <div key={i} style={{marginBottom:20}}>
            <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:6}}>{s.title}</div>
            <div style={{fontSize:14,color:T.sub}}>{s.text}</div>
          </div>
        ))}
        <div style={{fontSize:13,color:T.muted,borderTop:`1px solid ${T.border}`,paddingTop:16}}>Contact : <span style={{color:T.orange}}>privacy@woko.africa</span></div>
      </div>
    </div>
  );

    const screens = {home:HomeScreen,search:SearchScreen,product:ProductScreen,vendor:VendorScreen,cart:CartScreen,booking:BookingScreen,dashboard:DashboardScreen,profile:ProfileScreen,tos:TosScreen,privacy:PrivacyScreen,'vendor-request':VendorRequestScreen,admin:AdminScreen};
  const Current = screens[screen]||HomeScreen;

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Inter','Segoe UI',sans-serif",width:"100%",position:"relative"}}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { 
          -webkit-overflow-scrolling: touch;
          width: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          overscroll-behavior-y: none;
        }
        #root {
          width: 100%;
          min-height: 100vh;
        }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInLeft { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        .screen-fade { animation: fadeIn 0.25s ease both; }
        button { transition: opacity 0.15s, transform 0.1s; -webkit-tap-highlight-color: transparent; }
        button:active { opacity: 0.75; transform: scale(0.97); }
        a { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        * { -webkit-font-smoothing: antialiased; }
        /* Desktop */
        @media (min-width: 768px) {
          #root > div { max-width: 480px; margin: 0 auto; box-shadow: 0 0 60px rgba(0,0,0,0.15); min-height: 100vh; }
        }
        /* Mobile full width */
        @media (max-width: 767px) {
          #root > div { width: 100% !important; max-width: 100% !important; }
        }
      `}</style>
      <Header/>
      {menuOpen&&<SideMenu/>}
      <CallModal/>
      <LoginModal/>
      <Current/>
      {role==="buyer"&&<BottomNav/>}
    </div>
  );
}

