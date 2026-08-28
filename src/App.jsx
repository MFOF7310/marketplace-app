import { useState } from "react";
import { Search, ShoppingCart, CalendarDays, CheckCircle2, Plus, Minus, Trash2, Clock, ArrowLeft, BadgeCheck, Pencil, ClipboardList, Sun, Moon, Store, ChevronRight, Phone, MessageCircle, X, Menu, Home, Grid, PlusCircle, User, Heart, MapPin, Star, Filter } from "lucide-react";

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
const SLOT_TAKEN = {"Lun 24-09:00":true,"Mar 25-15:00":true};

const Placeholder = ({vendor,height=160,fontSize=32}) => (
  <div style={{background:`linear-gradient(135deg,${vendor.color}CC,${vendor.color}44)`,height,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
    <div style={{fontSize,color:"white",fontWeight:800}}>{vendor.initials}</div>
    <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",marginTop:4}}>Photo bientôt</div>
  </div>
);

export default function App() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [dark,setDark] = useState(prefersDark);
  const T = dark ? DARK : LIGHT;
  const [screen,setScreen] = useState("home");
  const [screenId,setScreenId] = useState(null);
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
  const [sellerProducts,setSellerProducts] = useState(PRODUCTS.filter(p=>p.vendorId==="v1"));
  const [sellerTab,setSellerTab] = useState("catalogue");
  const [showAdd,setShowAdd] = useState(false);
  const [newP,setNewP] = useState({title:"",price:"",type:"produit"});
  const [orders,setOrders] = useState([
    {id:1,client:"Awa K.",produit:"Robe wax",montant:35000,statut:"a_expedier"},
    {id:2,client:"Jean-Marc D.",produit:"Retouche",montant:5000,statut:"a_expedier"},
    {id:3,client:"Nadège P.",produit:"Robe wax",montant:35000,statut:"expediee"},
  ]);
  const [appts] = useState([
    {id:1,client:"Marie C.",service:"Retouche express",date:"24 août",heure:"10:00"},
    {id:2,client:"Fatoumata S.",service:"Essayage robe",date:"25 août",heure:"14:00"},
  ]);
  const [favorites,setFavorites] = useState([]);

  const go = (s,id=null) => { setScreen(s); setScreenId(id); setMenuOpen(false); setBookDay(null); setBookSlot(null); window.scrollTo(0,0); };
  const findP = id => [...PRODUCTS,...sellerProducts].find(p=>p.id===id);
  const findV = id => VENDORS.find(v=>v.id===id);
  const addCart = pid => setCart(prev => { const ex=prev.find(i=>i.pid===pid); return ex?prev.map(i=>i.pid===pid?{...i,qty:i.qty+1}:i):[...prev,{pid,qty:1}]; });
  const updQty = (pid,d) => setCart(prev=>prev.map(i=>i.pid===pid?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0));
  const remCart = pid => setCart(prev=>prev.filter(i=>i.pid!==pid));
  const toggleFav = id => setFavorites(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const subtotal = cart.reduce((s,i)=>s+(findP(i.pid)?.price||0)*i.qty,0);
  const delivFee = ZONES.find(z=>z.id===zone)?.fee||0;
  const total = subtotal+(cart.length?delivFee:0);
  const filtered = PRODUCTS.filter(p=>(category==="all"||p.category===category)&&(p.title.toLowerCase().includes(search.toLowerCase())||findV(p.vendorId)?.name.toLowerCase().includes(search.toLowerCase())));

  const CallModal = () => {
    if(!callModal) return null;
    const v = findV(callModal);
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
            <button style={{flex:1,background:T.indigoBg,color:T.orange,border:`1px solid ${T.orange}`,borderRadius:25,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <MessageCircle size={16}/> Message
            </button>
          </div>
          <div style={{textAlign:"center",color:T.sub,fontSize:13}}>{v?.phone}</div>
        </div>
      </div>
    );
  };

  const LoginModal = () => {
    if(!loginModal) return null;
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setLoginModal(false)}>
        <div style={{background:T.card,borderRadius:16,padding:28,width:"100%",maxWidth:400}} onClick={e=>e.stopPropagation()}>
          <h2 style={{color:T.text,marginBottom:8,fontSize:20}}>Se connecter</h2>
          <p style={{color:T.sub,fontSize:14,marginBottom:24}}>Créez un compte ou connectez-vous à Woko pour faire cette action.</p>
          <button style={{width:"100%",background:"#DB4437",color:"#fff",border:"none",borderRadius:10,padding:"13px",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            <span style={{fontSize:18}}>G</span> Continuer avec Google
          </button>
          <button style={{width:"100%",background:"#1877F2",color:"#fff",border:"none",borderRadius:10,padding:"13px",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            <span style={{fontSize:18}}>f</span> Continuer avec Facebook
          </button>
          <button style={{width:"100%",background:"none",border:"none",cursor:"pointer",color:T.sub,fontSize:14}} onClick={()=>setLoginModal(false)}>ANNULER</button>
        </div>
      </div>
    );
  };

  const SideMenu = () => (
    <>
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200}} onClick={()=>setMenuOpen(false)}/>
      <div style={{position:"fixed",top:0,left:0,bottom:0,width:280,background:T.card,zIndex:300,overflowY:"auto",boxShadow:"4px 0 20px rgba(0,0,0,0.2)"}}>
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
          {[{icon:<User size={18}/>,label:"Se connecter"},{icon:<Plus size={18}/>,label:"Créer compte"},{icon:<PlusCircle size={18}/>,label:"Publier une annonce"}].map((item,i)=>(
            <button key={i} style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:15}} onClick={()=>{setMenuOpen(false);setLoginModal(true);}}>
              <span style={{color:T.orange}}>{item.icon}</span>{item.label}
            </button>
          ))}
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
          {CATEGORIES.filter(c=>c.id!=="all").map(cat=>(
            <button key={cat.id} style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"11px 16px",background:"none",border:"none",cursor:"pointer",color:T.text,fontSize:14}} onClick={()=>{setCategory(cat.id);setMenuOpen(false);go("home");}}>
              <span style={{fontSize:20}}>{cat.emoji}</span>{cat.label}
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
        <button style={{background:"none",border:"none",cursor:"pointer",color:"#fff",padding:4}} onClick={()=>setLoginModal(true)}><User size={22}/></button>
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
    const v = findV(p.vendorId);
    const isService = p.type==="service";
    const isFav = favorites.includes(p.id);
    return (
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden"}}>
        <div style={{position:"relative",cursor:"pointer"}} onClick={()=>go("product",p.id)}>
          <Placeholder vendor={v} height={130} fontSize={28}/>
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
          <button style={{flex:1,padding:"9px 8px",background:"none",border:"none",borderRight:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:T.orange,fontSize:13,fontWeight:600}} onClick={()=>setCallModal(p.vendorId)}>
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
          {CATEGORIES.map(cat=>(
            <button key={cat.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"4px 12px",background:"none",border:"none",cursor:"pointer",flexShrink:0}} onClick={()=>setCategory(cat.id)}>
              <div style={{width:52,height:52,borderRadius:"50%",background:category===cat.id?T.indigoBg:T.tag,border:`2px solid ${category===cat.id?T.orange:"transparent"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>
                {cat.emoji}
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
          {PRODUCTS.filter(p=>p.featured).map(p=>{
            const v=findV(p.vendorId);
            return (
              <div key={p.id} style={{flexShrink:0,width:160,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>go("product",p.id)}>
                <Placeholder vendor={v} height={110} fontSize={24}/>
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
          {VENDORS.map(v=>(
            <div key={v.id} style={{flexShrink:0,width:120,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden",cursor:"pointer",textAlign:"center"}} onClick={()=>go("vendor",v.id)}>
              <div style={{background:`linear-gradient(135deg,${v.color}CC,${v.color}44)`,height:75,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:v.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:17,border:"3px solid rgba(255,255,255,0.4)"}}>{v.initials}</div>
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
        {filtered.length===0
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
    const v=findV(p.vendorId); const isService=p.type==="service"; const isFav=favorites.includes(p.id);
    return (
      <div style={{paddingBottom:70}}>
        <div style={{position:"relative"}}>
          <Placeholder vendor={v} height={220} fontSize={48}/>
          <button style={{position:"absolute",top:12,left:12,background:"rgba(0,0,0,0.4)",border:"none",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}} onClick={()=>go("home")}><ArrowLeft size={18}/></button>
          <button style={{position:"absolute",top:12,right:12,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:isFav?"#E53935":T.muted}} onClick={()=>toggleFav(p.id)}><Heart size={18} fill={isFav?"#E53935":"none"}/></button>
          <div style={{position:"absolute",bottom:12,left:12,background:isService?"#1565C0":T.orange,color:"#fff",borderRadius:4,padding:"4px 10px",fontSize:11,fontWeight:700}}>{isService?"SERVICE":"PRODUIT"}</div>
        </div>
        <div style={{padding:"16px 14px",background:T.card,marginBottom:8}}>
          <div style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:6}}>{p.title}</div>
          <div style={{fontSize:24,fontWeight:800,color:T.orange,marginBottom:8}}>{money(p.price)}</div>
          <div style={{fontSize:13,color:T.sub,display:"flex",alignItems:"center",gap:6}}><MapPin size={13}/>{v.zone}</div>
        </div>
        <div style={{background:T.card,padding:"14px",marginBottom:8,cursor:"pointer"}} onClick={()=>go("vendor",v.id)}>
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
          <button style={{flex:1,background:T.orange,color:"#fff",border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>setCallModal(p.vendorId)}><Phone size={16}/>Appeler</button>
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

  const VendorScreen = () => {
    const v=findV(screenId); if(!v) return null;
    const vProducts=PRODUCTS.filter(p=>p.vendorId===v.id);
    return (
      <div style={{paddingBottom:70}}>
        <div style={{background:v.color,padding:"14px 14px 50px"}}>
          <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer",marginBottom:12}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:24,border:"3px solid rgba(255,255,255,0.5)"}}>{v.initials}</div>
            <div>
              <div style={{color:"#fff",fontWeight:800,fontSize:20}}>{v.name}</div>
              <div style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>{v.zone}</div>
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

  const BookingScreen = () => {
    const p=findP(screenId); const [confirmed,setConfirmed]=useState(false); if(!p) return null;
    const v=findV(p.vendorId);
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
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
            {DAYS.map(d=>(
              <button key={d} style={{background:bookDay===d?T.orange:T.card,color:bookDay===d?"#fff":T.text,border:`1px solid ${bookDay===d?T.orange:T.border}`,borderRadius:8,padding:"10px 4px",cursor:"pointer",fontSize:13,fontWeight:600}} onClick={()=>{setBookDay(d);setBookSlot(null);}}>
                {d}
              </button>
            ))}
          </div>
          {bookDay&&<>
            <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10}}>Choisir un créneau</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
              {SLOTS.map(sl=>{
                const taken=SLOT_TAKEN[`${bookDay}-${sl}`];
                return <button key={sl} disabled={taken} style={{background:taken?T.tag:(bookSlot===sl?T.orange:T.card),color:taken?T.muted:(bookSlot===sl?"#fff":T.text),border:`1px solid ${taken?T.border:(bookSlot===sl?T.orange:T.border)}`,borderRadius:8,padding:"10px 4px",cursor:taken?"not-allowed":"pointer",fontSize:13,fontWeight:600,opacity:taken?0.5:1}} onClick={()=>!taken&&setBookSlot(sl)}>{taken?"Complet":sl}</button>;
              })}
            </div>
          </>}
          <button style={{width:"100%",background:bookDay&&bookSlot?T.orange:T.muted,color:"#fff",border:"none",borderRadius:10,padding:14,fontSize:16,fontWeight:700,cursor:bookDay&&bookSlot?"pointer":"not-allowed"}} onClick={()=>bookDay&&bookSlot&&setConfirmed(true)}>
            {bookDay&&bookSlot?"Confirmer le rendez-vous":"Sélectionnez date et créneau"}
          </button>
        </div>
      </div>
    );
  };

  const DashboardScreen = () => {
    const me=findV("v1");
    const addProduct = () => {
      if(!newP.title||!newP.price) return;
      setSellerProducts(prev=>[...prev,{id:"sp"+Date.now(),vendorId:"v1",title:newP.title,price:Number(newP.price),type:newP.type,category:me.category,featured:false}]);
      setNewP({title:"",price:"",type:"produit"}); setShowAdd(false);
    };
    return (
      <div style={{paddingBottom:70}}>
        <div style={{background:T.headerTop,padding:"12px 14px"}}>
          <div style={{color:"#fff",fontWeight:800,fontSize:18}}>Mon espace vendeur</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>{me.name}</div>
        </div>
        <div style={{background:T.card,margin:12,borderRadius:10,padding:14,marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:me.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:18}}>{me.initials}</div>
          <div>
            <div style={{fontWeight:700,fontSize:16,color:T.text}}>{me.name}</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:4,background:"#E3F2FD",color:"#1565C0",borderRadius:10,padding:"2px 8px",fontSize:11,fontWeight:700}}><BadgeCheck size={11}/>CERTIFIÉ</div>
          </div>
        </div>
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
                <button style={{width:32,height:32,borderRadius:6,background:"#FFEBEE",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setSellerProducts(prev=>prev.filter(x=>x.id!==p.id))}><Trash2 size={14} color="#E53935"/></button>
              </div>
            ))}
            {showAdd
              ?<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:14,marginBottom:8}}>
                <input style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",fontSize:14,color:T.text,outline:"none",marginBottom:8,boxSizing:"border-box"}} placeholder="Titre" value={newP.title} onChange={e=>setNewP({...newP,title:e.target.value})}/>
                <input style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",fontSize:14,color:T.text,outline:"none",marginBottom:10,boxSizing:"border-box"}} placeholder="Prix FCFA" type="number" value={newP.price} onChange={e=>setNewP({...newP,price:e.target.value})}/>
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  {["produit","service"].map(t=><button key={t} style={{flex:1,background:newP.type===t?T.orange:T.tag,color:newP.type===t?"#fff":T.text,border:"none",borderRadius:8,padding:"10px",fontSize:14,fontWeight:600,cursor:"pointer"}} onClick={()=>setNewP({...newP,type:t})}>{t}</button>)}
                </div>
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

  const screens = {home:HomeScreen,search:SearchScreen,product:ProductScreen,vendor:VendorScreen,cart:CartScreen,booking:BookingScreen,dashboard:DashboardScreen};
  const Current = screens[screen]||HomeScreen;

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Inter','Segoe UI',sans-serif",width:"100%",position:"relative"}}>
      <Header/>
      {menuOpen&&<SideMenu/>}
      <CallModal/>
      <LoginModal/>
      <Current/>
      {role==="buyer"&&<BottomNav/>}
    </div>
  );
}

