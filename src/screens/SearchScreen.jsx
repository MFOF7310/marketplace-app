import { useState, useEffect } from "react";
import { ArrowLeft, Search, X, BadgeCheck, ChevronRight, Shirt, Smartphone, UtensilsCrossed, Sparkles, Palette, Wrench, Filter } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';
import { Placeholder } from '../components/Placeholder.jsx';

const CATS = [
  {id:"mode",label:"Mode & Textile",icon:<Shirt size={20}/>},
  {id:"elec",label:"Électronique",icon:<Smartphone size={20}/>},
  {id:"resto",label:"Restauration",icon:<UtensilsCrossed size={20}/>},
  {id:"beaute",label:"Beauté",icon:<Sparkles size={20}/>},
  {id:"artisan",label:"Artisanat",icon:<Palette size={20}/>},
  {id:"service",label:"Services",icon:<Wrench size={20}/>},
];

export const SearchScreen = () => {
  const { T, vendors, products, go, setCallModal, getProductVendor, favorites, toggleFav, addCart } = useWoko();
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [searchTab, setSearchTab] = useState("produits");
  const [cityFilter, setCityFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [vendorRatings, setVendorRatings] = useState({});

  useEffect(()=>{
    const load = async () => {
      const {getVendorRating} = await import('../api.js');
      const r = {};
      for(const v of vendors) { try { r[v.id]=await getVendorRating(v.id); } catch(e){} }
      setVendorRatings(r);
    };
    if(vendors.length) load();
  },[vendors.length]);

  const cities = ["all",...new Set(vendors.map(v=>v.city).filter(Boolean))];

  const handleSearch = () => {
    if(query.trim()) setSubmitted(true);
  };

  const filteredProducts = submitted ? products.filter(p=>{
    const v=getProductVendor(p);
    return p.title?.toLowerCase().includes(query.toLowerCase())||v?.name?.toLowerCase().includes(query.toLowerCase());
  }) : [];

  const filteredVendors = submitted ? vendors.filter(v=>{
    const cityOk=cityFilter==="all"||v.city===cityFilter;
    const nameOk=v.name?.toLowerCase().includes(query.toLowerCase());
    const ratingOk=ratingFilter===0||(vendorRatings[v.id]?.average||0)>=ratingFilter;
    return cityOk&&(nameOk||!query)&&ratingOk;
  }) : vendors.filter(v=>{
    const cityOk=cityFilter==="all"||v.city===cityFilter;
    const ratingOk=ratingFilter===0||(vendorRatings[v.id]?.average||0)>=ratingFilter;
    return cityOk&&ratingOk;
  });

  return (
    <div style={{paddingBottom:70}}>
      {/* Search bar */}
      <div style={{background:T.headerTop,padding:"10px 12px 14px"}}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button style={{background:"none",border:"none",cursor:"pointer",color:"#fff"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
          <div style={{flex:1,display:"flex",alignItems:"center",background:"#fff",borderRadius:8,padding:"0 12px",gap:8,height:40}}>
            <Search size={16} color={T.orange}/>
            <input
              autoFocus
              style={{flex:1,border:"none",outline:"none",fontSize:14,background:"transparent",color:"#1A1A1A",height:"100%"}}
              placeholder="Produit, service, boutique..."
              value={query}
              onChange={e=>{setQuery(e.target.value);setSubmitted(false);}}
              onKeyDown={e=>e.key==="Enter"&&handleSearch()}
            />
            {query&&<button style={{background:"none",border:"none",cursor:"pointer",padding:4}} onClick={()=>{setQuery("");setSubmitted(false);}}><X size={14} color="#999"/></button>}
          </div>
          <button
            style={{background:T.orange,border:"none",borderRadius:8,padding:"0 16px",height:40,fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6}}
            onClick={handleSearch}>
            <Search size={14} color="#fff"/>
            Rechercher
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",background:T.card,borderBottom:`1px solid ${T.border}`}}>
        {[{id:"produits",label:"Produits"},{id:"vendeurs",label:"Vendeurs"}].map(tab=>(
          <button key={tab.id} style={{flex:1,padding:"12px",background:"none",border:"none",borderBottom:`3px solid ${searchTab===tab.id?T.orange:"transparent"}`,cursor:"pointer",fontSize:14,fontWeight:600,color:searchTab===tab.id?T.orange:T.sub}} onClick={()=>setSearchTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vendor filters */}
      {searchTab==="vendeurs"&&(
        <div style={{background:T.card,padding:"10px 12px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",marginBottom:8}}>
            {cities.map(c=>(
              <button key={c} style={{background:cityFilter===c?T.orange:T.tag,color:cityFilter===c?"#fff":T.sub,border:"none",borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setCityFilter(c)}>
                📍 {c==="all"?"Toutes les villes":c}
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <span style={{fontSize:12,color:T.sub,whiteSpace:"nowrap"}}>Note min:</span>
            {[0,3,4,5].map(r=>(
              <button key={r} style={{background:ratingFilter===r?T.orange:T.tag,color:ratingFilter===r?"#fff":T.sub,border:"none",borderRadius:20,padding:"5px 10px",fontSize:12,fontWeight:600,cursor:"pointer"}} onClick={()=>setRatingFilter(r)}>
                {r===0?"Tous":r+"★+"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{padding:"12px 10px"}}>
        {/* PRODUITS */}
        {searchTab==="produits"&&(
          !submitted
            ?<>
              <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:10}}>Catégories populaires</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {CATS.map(cat=>(
                  <button key={cat.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"14px 12px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",color:T.text,fontSize:14,fontWeight:500}} onClick={()=>go("home")}>
                    <span style={{color:T.orange,display:"flex"}}>{cat.icon}</span>{cat.label}
                  </button>
                ))}
              </div>
            </>
            :filteredProducts.length===0
            ?<div style={{textAlign:"center",padding:"60px 20px"}}>
              <Search size={48} color={T.border} style={{margin:"0 auto 16px",display:"block"}}/>
              <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:8}}>Aucun résultat</div>
              <div style={{fontSize:13,color:T.sub}}>Aucun produit trouvé pour "<strong>{query}</strong>"</div>
            </div>
            :<>
              <div style={{fontSize:13,color:T.sub,marginBottom:10}}>{filteredProducts.length} résultat(s) pour "<strong>{query}</strong>"</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {filteredProducts.map(p=>{
                  const v=getProductVendor(p);
                  return (
                    <div key={p.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>go("product",p.id)}>
                      {p.image_url?<img src={p.image_url} style={{width:"100%",height:120,objectFit:"cover"}}/>:<Placeholder vendor={v||{initials:"?",color:"#E65100"}} height={120} fontSize={24}/>}
                      <div style={{padding:"8px 10px"}}>
                        <div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.title}</div>
                        <div style={{fontSize:14,fontWeight:800,color:T.orange}}>{Number(p.price).toLocaleString("fr-FR")} FCFA</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
        )}

        {/* VENDEURS */}
        {searchTab==="vendeurs"&&(
          filteredVendors.length===0
            ?<div style={{textAlign:"center",padding:"60px 20px"}}>
              <Search size={48} color={T.border} style={{margin:"0 auto 16px",display:"block"}}/>
              <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:8}}>Aucun vendeur trouvé</div>
              <div style={{fontSize:13,color:T.sub}}>Essayez avec d'autres filtres</div>
            </div>
            :filteredVendors.map(v=>{
              const rating=vendorRatings[v.id];
              return (
                <div key={v.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:14,marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:12}} onClick={()=>go("vendor",v.id)}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:v.color||"#E65100",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:18,flexShrink:0,overflow:"hidden"}}>
                    {v.logo_url?<img src={v.logo_url} style={{width:52,height:52,objectFit:"cover"}}/>:<span>{v.initials||v.name?.[0]}</span>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                      <span style={{fontSize:15,fontWeight:700,color:T.text}}>{v.name}</span>
                      {v.certified&&<BadgeCheck size={14} color="#1565C0"/>}
                    </div>
                    <div style={{fontSize:12,color:T.sub,marginBottom:4}}>📍 {v.city||"N/A"}</div>
                    {rating?.average>0&&(
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <span style={{color:"#FFA000",fontSize:12}}>{"★".repeat(Math.round(rating.average))}</span>
                        <span style={{fontSize:12,fontWeight:600,color:"#E65100"}}>{rating.average}</span>
                        <span style={{fontSize:11,color:T.muted}}>({rating.count})</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight size={16} color={T.muted}/>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};
