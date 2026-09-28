
(() => {
  const sb=window.lobiSupabase;
  if(!sb) return;
  const CONFIG_CATEGORY="__site_config__";

  const defaults={
    theme:{background:"#050505",text:"#f4f4f1",primary:"#b7ff00",secondary:"#ef2b20",panel:"#0d0d0d",muted:"#9a9a9a"},
    header:{height:85,logoWidth:115},
    hero:{visible:true,eyebrow:"LOBI LIFESTYLE · DROP 01",title:"NÃO É SÓ\nROUPA.",accent:"É PRESENÇA.",description:"Streetwear masculino selecionado para quem carrega identidade no jeito de vestir.",buttonText:"VER O DROP",buttonLink:"#produtos",titleMax:125,minHeight:760,imageUrl:"",imageX:50,imageY:50,overlay:45},
    marquee:{visible:true,text:"LOBI LIFESTYLE ✦ STREETWEAR MASCULINO ✦ DROP 01 ✦ PRESENÇA"},
    products:{visible:true,eyebrow:"PRIMEIRO DROP",title:"DROP 01",description:"Peças selecionadas pela LOBI.\nQuantidades limitadas.",columnsDesktop:3,columnsMobile:2,imageRatio:"4/5",sectionPadding:120},
    promo:{visible:false,title:"DROP 01",subtitle:"PEÇAS SELECIONADAS. QUANTIDADES LIMITADAS.",buttonText:"VER PRODUTOS",buttonLink:"#produtos",imageUrl:"",height:420,imageX:50,imageY:50,overlay:48},
    manifesto:{visible:true,eyebrow:"LOBI LIFESTYLE",title:"VISTA O QUE",accent:"TE REPRESENTA.",body:"A LOBI não nasceu para ser só mais uma loja de roupas. Nossa seleção é feita para quem vê o estilo como parte da própria identidade.",tags:"ESTILO, ATITUDE, IDENTIDADE"},
    footer:{visible:true,tagline:"Streetwear masculino para quem tem presença.",instagram:"",whatsapp:"",copyright:"© 2026 LOBI LIFESTYLE"},
    order:["hero","promo","marquee","products","manifesto"]
  };

  function deepMerge(base,extra){
    if(!extra||typeof extra!=="object")return base;
    for(const[k,v]of Object.entries(extra)){
      if(v&&typeof v==="object"&&!Array.isArray(v)&&base[k]&&typeof base[k]==="object"&&!Array.isArray(base[k]))deepMerge(base[k],v);
      else base[k]=v;
    }
    return base;
  }
  function lines(text){return String(text||"").split("\n").map(x=>x.trim()).filter(Boolean);}
  function setText(el,text){if(el)el.textContent=text??"";}
  function ensurePromo(){
    let p=document.getElementById("lobiPromoBanner");
    if(p)return p;
    p=document.createElement("section");
    p.id="lobiPromoBanner";p.className="lobi-promo-banner";
    p.innerHTML='<div class="lobi-promo-content"><p class="lobi-promo-subtitle"></p><h2></h2><a class="lobi-promo-button" href="#produtos"></a></div>';
    const main=document.querySelector("main"),hero=document.querySelector(".hero");
    if(main&&hero)hero.insertAdjacentElement("afterend",p);
    return p;
  }
  function ensureStyle(){
    let s=document.getElementById("lobiDynamicStyle");
    if(!s){s=document.createElement("style");s.id="lobiDynamicStyle";document.head.appendChild(s);}
    return s;
  }

  function apply(config){
    const c=deepMerge(JSON.parse(JSON.stringify(defaults)),config||{});
    const root=document.documentElement.style;
    root.setProperty("--black",c.theme.background);
    root.setProperty("--white",c.theme.text);
    root.setProperty("--green",c.theme.primary);
    root.setProperty("--green-hover",c.theme.primary);
    root.setProperty("--red",c.theme.secondary);
    root.setProperty("--black-card",c.theme.panel);
    root.setProperty("--gray-light",c.theme.muted);

    const header=document.querySelector(".header");
    if(header)header.style.height=c.header.height+"px";
    const logo=document.querySelector(".brand img");
    if(logo)logo.style.width=c.header.logoWidth+"px";

    const hero=document.querySelector(".hero");
    if(hero){
      hero.dataset.editorSection="hero";
      hero.hidden=!c.hero.visible;
      hero.style.minHeight=c.hero.minHeight+"px";
      hero.style.backgroundPosition=c.hero.imageX+"% "+c.hero.imageY+"%";
      hero.style.backgroundSize="cover";
      hero.style.backgroundRepeat="no-repeat";
      hero.style.backgroundImage=c.hero.imageUrl
        ? 'linear-gradient(rgba(5,5,5,'+(c.hero.overlay/100)+'),rgba(5,5,5,'+(c.hero.overlay/100)+')),url("'+c.hero.imageUrl.replaceAll('"','%22')+'")'
        : "";
      setText(hero.querySelector(".hero-content .eyebrow"),c.hero.eyebrow);
      const h1=hero.querySelector("h1");
      if(h1){
        h1.innerHTML="";
        lines(c.hero.title).forEach((line,i)=>{ if(i)h1.appendChild(document.createElement("br")); h1.appendChild(document.createTextNode(line)); });
        if(lines(c.hero.title).length)h1.appendChild(document.createElement("br"));
        const span=document.createElement("span");span.textContent=c.hero.accent;h1.appendChild(span);
      }
      setText(hero.querySelector(".hero-description"),c.hero.description);
      const btn=hero.querySelector(".primary-button");
      if(btn){btn.href=c.hero.buttonLink||"#produtos";btn.innerHTML=(c.hero.buttonText||"VER O DROP")+' <span>→</span>';}
    }

    const marquee=document.querySelector(".marquee");
    if(marquee){marquee.dataset.editorSection="marquee";marquee.hidden=!c.marquee.visible;setText(marquee.querySelector("div"),c.marquee.text);}

    const products=document.querySelector("#produtos");
    if(products){
      products.dataset.editorSection="products";products.hidden=!c.products.visible;
      setText(products.querySelector(".section-heading .eyebrow"),c.products.eyebrow);
      setText(products.querySelector(".section-heading h2"),c.products.title);
      const d=products.querySelector(".section-heading>p");if(d){d.innerHTML=lines(c.products.description).join("<br>");}
    }

    const manifesto=document.querySelector("#sobre");
    if(manifesto){
      manifesto.dataset.editorSection="manifesto";manifesto.hidden=!c.manifesto.visible;
      setText(manifesto.querySelector(".eyebrow"),c.manifesto.eyebrow);
      const h2=manifesto.querySelector("h2");if(h2){h2.innerHTML=(c.manifesto.title||"")+'<br><span>'+(c.manifesto.accent||"")+'</span>';}
      const body=manifesto.querySelector(":scope > p:not(.eyebrow)");setText(body,c.manifesto.body);
      const tags=manifesto.querySelector(".manifesto-tags");if(tags){tags.innerHTML="";String(c.manifesto.tags||"").split(",").map(x=>x.trim()).filter(Boolean).forEach(t=>{const s=document.createElement("span");s.textContent=t;tags.appendChild(s);});}
    }

    const promo=ensurePromo();
    promo.dataset.editorSection="promo";promo.hidden=!c.promo.visible;
    promo.style.minHeight=c.promo.height+"px";
    promo.style.backgroundPosition=c.promo.imageX+"% "+c.promo.imageY+"%";
    promo.style.backgroundSize="cover";
    promo.style.backgroundImage=c.promo.imageUrl
      ? 'linear-gradient(rgba(5,5,5,'+(c.promo.overlay/100)+'),rgba(5,5,5,'+(c.promo.overlay/100)+')),url("'+c.promo.imageUrl.replaceAll('"','%22')+'")'
      : 'linear-gradient(135deg,rgba(183,255,0,.12),rgba(239,43,32,.08))';
    setText(promo.querySelector("h2"),c.promo.title);setText(promo.querySelector(".lobi-promo-subtitle"),c.promo.subtitle);
    const pb=promo.querySelector(".lobi-promo-button");if(pb){pb.textContent=c.promo.buttonText||"VER PRODUTOS";pb.href=c.promo.buttonLink||"#produtos";}

    const footer=document.querySelector(".footer");
    if(footer){
      footer.dataset.editorSection="footer";footer.hidden=!c.footer.visible;
      setText(footer.querySelector(".footer-brand p"),c.footer.tagline);
      const links=[...footer.querySelectorAll("a")];
      const insta=links.find(a=>a.textContent.trim().toLowerCase()==="instagram");
      const whats=links.find(a=>a.textContent.trim().toLowerCase()==="whatsapp");
      if(insta&&c.footer.instagram)insta.href=c.footer.instagram;
      if(whats&&c.footer.whatsapp)whats.href=c.footer.whatsapp;
    }
    setText(document.querySelector(".copyright"),c.footer.copyright);

    const main=document.querySelector("main");
    if(main){
      const map={hero:hero,promo,marquee,products,manifesto};
      (c.order||defaults.order).forEach(key=>{if(map[key])main.appendChild(map[key]);});
    }

    ensureStyle().textContent=`
      body{background:${c.theme.background};color:${c.theme.text}}
      .hero h1{font-size:clamp(48px,8vw,${c.hero.titleMax}px)!important}
      .products-section{padding-top:${c.products.sectionPadding}px!important;padding-bottom:${c.products.sectionPadding}px!important}
      .products-grid{grid-template-columns:repeat(${Math.max(1,Math.min(6,c.products.columnsDesktop))},minmax(0,1fr))!important}
      .product-image{aspect-ratio:${c.products.imageRatio}!important}
      .product-image img{width:100%!important;height:100%!important;object-fit:cover!important}
      .lobi-promo-banner{width:100%;display:flex;align-items:center;justify-content:center;padding:50px 6%;background:#0b0b0b;color:var(--white);position:relative;overflow:hidden}
      .lobi-promo-content{text-align:center;max-width:900px}
      .lobi-promo-subtitle{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--gray-light);margin-bottom:14px}
      .lobi-promo-banner h2{font-family:"Archivo Black",sans-serif;font-size:clamp(42px,7vw,100px);line-height:.9;letter-spacing:-4px}
      .lobi-promo-button{display:inline-flex;margin-top:25px;background:var(--green);color:#050505;padding:16px 22px;font-size:10px;font-weight:800;letter-spacing:.14em}
      @media(max-width:600px){
        .products-grid{grid-template-columns:repeat(${Math.max(1,Math.min(2,c.products.columnsMobile))},minmax(0,1fr))!important}
        .hero{min-height:min(${c.hero.minHeight}px,calc(100svh - ${c.header.height}px))!important}
      }
    `;
  }

  async function load(){
    const {data,error}=await sb.from("products").select("description").eq("category",CONFIG_CATEGORY).order("updated_at",{ascending:false}).limit(1);
    if(error){console.warn("LOBI config:",error);apply(defaults);return;}
    if(data?.length){
      try{apply(JSON.parse(data[0].description||"{}"));}catch(e){console.warn(e);apply(defaults);}
    }else apply(defaults);
  }

  window.addEventListener("message",e=>{if(e.data?.type==="lobi-preview-config")apply(e.data.config);});

  function setupEditorPreview(){
    if(!new URLSearchParams(location.search).has("editorPreview"))return;
    document.documentElement.classList.add("lobi-editor-preview");
    const s=document.createElement("style");s.textContent='html.lobi-editor-preview [data-editor-section]{outline:1px dashed transparent;cursor:pointer}html.lobi-editor-preview [data-editor-section]:hover{outline:2px solid #b7ff00;outline-offset:-2px}';document.head.appendChild(s);
    document.addEventListener("click",e=>{
      const section=e.target.closest("[data-editor-section]");
      if(!section)return;
      e.preventDefault();e.stopPropagation();
      parent.postMessage({type:"lobi-editor-select",section:section.dataset.editorSection},"*");
    },true);
    parent.postMessage({type:"lobi-preview-ready"},"*");
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{load().then(setupEditorPreview);});
  else load().then(setupEditorPreview);
})();
