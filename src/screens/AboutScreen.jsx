import { ArrowLeft, Mail, Phone, MapPin, Shield, Star, Users, Store } from "lucide-react";
import { useWoko } from '../WokoContext.jsx';

export const AboutScreen = () => {
  const { T, go, vendors, products } = useWoko();

  const stats = [
    {icon:<Store size={24} color={T.orange}/>, value:vendors.length+"+" , label:"Vendeurs certifiés"},
    {icon:<Star size={24} color={T.orange}/>, value:products.length+"+", label:"Annonces actives"},
    {icon:<Users size={24} color={T.orange}/>, value:"100+", label:"Acheteurs satisfaits"},
    {icon:<Shield size={24} color={T.orange}/>, value:"100%", label:"Vendeurs vérifiés"},
  ];

  return (
    <div style={{paddingBottom:70}}>
      <div style={{background:T.headerTop,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
        <button style={{background:"none",border:"none",color:"#fff",cursor:"pointer"}} onClick={()=>go("home")}><ArrowLeft size={20}/></button>
        <span style={{color:"#fff",fontWeight:700,fontSize:17}}>À propos de Woko</span>
      </div>

      {/* Hero */}
      <div style={{background:`linear-gradient(135deg,#E65100,#FF8F00)`,padding:"40px 20px",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:12}}>🛍</div>
        <div style={{fontSize:28,fontWeight:800,color:"#fff",marginBottom:8}}>Woko</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.85)",lineHeight:1.7,maxWidth:300,margin:"0 auto"}}>
          Le marché en ligne qui connecte acheteurs et vendeurs certifiés en Afrique de l'Ouest
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:T.border,margin:"0 0 12px"}}>
        {stats.map((s,i)=>(
          <div key={i} style={{background:T.card,padding:"20px 16px",textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>{s.icon}</div>
            <div style={{fontSize:24,fontWeight:800,color:T.orange}}>{s.value}</div>
            <div style={{fontSize:12,color:T.sub}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{padding:"0 16px"}}>
        {/* Mission */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16,marginBottom:12}}>
          <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:8}}>🎯 Notre mission</div>
          <div style={{fontSize:14,color:T.sub,lineHeight:1.7}}>
            Woko facilite le commerce local en Afrique de l'Ouest en donnant à chaque vendeur une vitrine digitale professionnelle et en offrant aux acheteurs un accès simple à des produits et services de qualité, vérifiés par notre équipe.
          </div>
        </div>

        {/* Why Woko */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16,marginBottom:12}}>
          <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:12}}>✅ Pourquoi Woko ?</div>
          {[
            {e:"🔒",t:"Vendeurs certifiés",d:"Chaque vendeur est vérifié manuellement"},
            {e:"📅",t:"RDV en ligne",d:"Prenez rendez-vous directement"},
            {e:"💬",t:"Contact direct",d:"WhatsApp et appel intégrés"},
            {e:"⭐",t:"Avis vérifiés",d:"Notes et commentaires des vrais acheteurs"},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",gap:12,marginBottom:12}}>
              <span style={{fontSize:24,flexShrink:0}}>{item.e}</span>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:T.text}}>{item.t}</div>
                <div style={{fontSize:12,color:T.sub}}>{item.d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16,marginBottom:12}}>
          <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:12}}>📬 Nous contacter</div>
          {[
            {icon:<Mail size={16} color={T.orange}/>, label:"Email", value:"support@woko.africa", href:"mailto:support@woko.africa"},
            {icon:<Phone size={16} color={T.orange}/>, label:"WhatsApp", value:"+223 XX XX XX XX", href:"https://wa.me/223XXXXXXXX"},
            {icon:<MapPin size={16} color={T.orange}/>, label:"Adresse", value:"Bamako, Mali", href:null},
          ].map((c,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<2?`1px solid ${T.border}`:"none"}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:T.indigoBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{c.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:T.muted}}>{c.label}</div>
                {c.href
                  ?<a href={c.href} style={{fontSize:14,fontWeight:600,color:T.orange,textDecoration:"none"}}>{c.value}</a>
                  :<div style={{fontSize:14,fontWeight:600,color:T.text}}>{c.value}</div>
                }
              </div>
            </div>
          ))}
        </div>

        {/* Become vendor CTA */}
        <div style={{background:`linear-gradient(135deg,${T.orange},#FF8F00)`,borderRadius:12,padding:20,textAlign:"center",marginBottom:12}}>
          <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:8}}>Vous êtes vendeur ?</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.85)",marginBottom:16}}>Rejoignez Woko et développez votre activité en ligne</div>
          <button style={{background:"#fff",color:T.orange,border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={()=>go("vendor-request")}>
            Devenir vendeur certifié →
          </button>
        </div>

        <div style={{textAlign:"center",fontSize:12,color:T.muted,padding:"8px 0 20px"}}>
          Woko © 2026 · Bamako, Mali · Tous droits réservés
        </div>
      </div>
    </div>
  );
};
