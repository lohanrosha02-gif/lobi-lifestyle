
(() => {
  const sb=window.lobiSupabase;
  if(!sb) return;
  const CONFIG_CATEGORY="__site_config__";

  const defaults={
    campaign:{key:"original",label:"LOBI Original",icon:"spark",important:false,useHeroArt:false,usePromoArt:false,accent1:"#b7ff00",accent2:"#ef2b20"},
    theme:{background:"#050505",text:"#f4f4f1",primary:"#b7ff00",secondary:"#ef2b20",panel:"#0d0d0d",muted:"#9a9a9a"},
    header:{visible:true,height:85,logoWidth:115},
    hero:{visible:true,eyebrow:"LOBI LIFESTYLE · DROP 01",title:"NÃO É SÓ\nROUPA.",accent:"É PRESENÇA.",description:"Streetwear masculino selecionado para quem carrega identidade no jeito de vestir.",buttonText:"VER O DROP",buttonLink:"#produtos",titleMax:125,minHeight:760,imageUrl:"",imageX:50,imageY:50,overlay:45},
    marquee:{visible:true,text:"LOBI LIFESTYLE ✦ STREETWEAR MASCULINO ✦ DROP 01 ✦ PRESENÇA"},
    products:{visible:true,eyebrow:"PRIMEIRO DROP",title:"DROP 01",description:"Peças selecionadas pela LOBI.\nQuantidades limitadas.",columnsDesktop:3,columnsMobile:2,imageRatio:"4/5",sectionPadding:120},
    promo:{visible:false,title:"DROP 01",subtitle:"PEÇAS SELECIONADAS. QUANTIDADES LIMITADAS.",buttonText:"VER PRODUTOS",buttonLink:"#produtos",imageUrl:"",height:420,imageX:50,imageY:50,overlay:48},
    manifesto:{visible:true,eyebrow:"LOBI LIFESTYLE",title:"VISTA O QUE",accent:"TE REPRESENTA.",body:"A LOBI não nasceu para ser só mais uma loja de roupas. Nossa seleção é feita para quem vê o estilo como parte da própria identidade.",tags:"ESTILO, ATITUDE, IDENTIDADE"},
    footer:{visible:true,tagline:"Streetwear masculino para quem tem presença.",instagram:"",whatsapp:"https://wa.me/5583993149486",copyright:"© 2026 LOBI LIFESTYLE"},
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
  function markEditorField(el,section,field){if(!el)return;el.dataset.editorSection=section;el.dataset.editorField=field;}
  function safeColor(value,fallback="#b7ff00"){
    return /^#[0-9a-f]{6}$/i.test(String(value||""))?String(value):fallback;
  }

  function iconMarkup(name){
    const icons={
      spark:'<path d="M50 6 58 39 91 47 58 55 50 88 42 55 9 47 42 39Z"/>',
      confetti:'<path d="M18 22 31 35M67 16 62 34M78 56 91 65M22 72 38 64"/><circle cx="19" cy="49" r="5"/><circle cx="71" cy="78" r="6"/><path d="M46 14 49 25 60 28 49 31 46 42 43 31 32 28 43 25Z"/>',
      flower:'<circle cx="50" cy="50" r="10"/><circle cx="50" cy="27" r="13"/><circle cx="73" cy="50" r="13"/><circle cx="50" cy="73" r="13"/><circle cx="27" cy="50" r="13"/>',
      egg:'<path d="M50 10C34 10 23 36 23 58c0 18 12 29 27 29s27-11 27-29C77 36 66 10 50 10Z"/><path d="m29 54 10-7 10 7 10-7 12 8"/>',
      hardhat:'<path d="M20 58h60M27 57c2-22 13-34 23-34s21 12 23 34M50 23v22"/><path d="M16 59h68v12H16z"/>',
      heart:'<path d="M50 82 18 50C2 33 14 14 31 18c8 2 14 8 19 15 5-7 11-13 19-15 17-4 29 15 13 32Z"/>',
      doubleHeart:'<path d="M35 77 12 54C0 41 9 27 22 30c6 1 10 6 13 11 3-5 8-10 14-11 13-3 22 11 10 24Z"/><path d="M65 70 45 50c-10-11-3-23 8-21 5 1 9 5 12 9 3-4 7-8 12-9 11-2 18 10 8 21Z"/>',
      link:'<path d="M38 62 27 73c-9 9-23-5-14-14l17-17c9-9 23 5 14 14l-5 5M62 38l11-11c9-9 23 5 14 14L70 58c-9 9-23-5-14-14l5-5"/><path d="M37 63 63 37"/>',
      pennant:'<path d="M12 23c24 9 51 9 76 0"/><path d="m20 27 9 18 9-14M42 31l9 17 9-18M65 30l8 16 10-20"/>',
      tie:'<path d="M42 13h16l6 15-14 12-14-12Z"/><path d="m50 40 18 38-18 11-18-11Z"/>',
      book:'<path d="M12 20c17-5 30 1 38 9v55c-8-8-21-14-38-9ZM88 20c-17-5-30 1-38 9v55c8-8 21-14 38-9Z"/><path d="M50 29v55"/>',
      diamond:'<path d="m50 9 35 27-35 55L15 36Z"/><path d="M15 36h70M35 36l15 55 15-55M35 36 50 9l15 27"/>',
      kite:'<path d="m50 10 28 34-28 31-28-31Z"/><path d="M50 10v65M22 44h56M50 75c-4 10 8 8 2 17"/>',
      crescent:'<path d="M72 17c-23 3-37 26-28 47 7 17 26 25 43 18-12 12-31 17-47 9C16 80 8 50 22 27 32 10 53 4 72 17Z"/>',
      tree:'<path d="m50 10 18 25H57l19 25H60l18 24H22l18-24H24l19-25H32Z"/><path d="M45 84h10v9H45z"/>',
      bag:'<path d="M20 34h60l-5 53H25Z"/><path d="M36 38c0-17 28-17 28 0"/>',
      calendar:'<rect x="15" y="20" width="70" height="65" rx="6"/><path d="M15 39h70M32 12v17M68 12v17M28 53h10M45 53h10M62 53h10M28 68h10M45 68h10M62 68h10"/>',
      ticket:'<path d="M12 31h76v15c-11 0-11 16 0 16v15H12V62c11 0 11-16 0-16Z"/><path d="M50 31v46" stroke-dasharray="5 6"/>',
      badge:'<circle cx="50" cy="43" r="27"/><path d="m36 67-8 23 22-10 22 10-8-23"/><path d="m50 25 5 11 12 2-9 8 2 12-10-6-10 6 2-12-9-8 12-2Z"/>',
      bars:'<rect x="14" y="18" width="12" height="64"/><rect x="34" y="18" width="12" height="64"/><rect x="54" y="18" width="12" height="64"/><rect x="74" y="18" width="12" height="64"/>',
      flame:'<path d="M53 8c5 21-12 25-5 40 4-8 12-12 17-22 14 13 23 31 13 49-8 14-23 19-36 14-18-7-26-28-15-44 6-9 15-15 26-37Z"/><path d="M50 56c8 8 9 17 4 25"/>',
      tag:'<path d="M13 18h43l31 31-38 38-31-31Z"/><circle cx="35" cy="39" r="6"/>',
      chip:'<rect x="24" y="24" width="52" height="52" rx="5"/><rect x="38" y="38" width="24" height="24"/><path d="M34 12v12M50 12v12M66 12v12M34 76v12M50 76v12M66 76v12M12 34h12M12 50h12M12 66h12M76 34h12M76 50h12M76 66h12"/>',
      percent:'<circle cx="30" cy="30" r="12"/><circle cx="70" cy="70" r="12"/><path d="M24 78 76 22"/>',
      truck:'<path d="M10 31h48v39H10Z"/><path d="M58 44h17l15 16v10H58Z"/><circle cx="28" cy="74" r="9"/><circle cx="72" cy="74" r="9"/>',
      cake:'<path d="M18 54h64v30H18Z"/><path d="M24 44h52v10H24Z"/><path d="M31 44V28M50 44V22M69 44V28"/><path d="M28 25c0-7 6-7 6 0M47 19c0-7 6-7 6 0M66 25c0-7 6-7 6 0"/>',
      box:'<path d="m50 10 36 18-36 18-36-18Z"/><path d="M14 28v43l36 19 36-19V28M50 46v44"/><path d="m32 20 36 18"/>',
      notebook:'<rect x="22" y="12" width="62" height="76" rx="4"/><path d="M34 12v76M14 25h16M14 42h16M14 59h16M14 76h16M46 35h26M46 50h26M46 65h20"/>',
      sun:'<circle cx="50" cy="50" r="20"/><path d="M50 8v15M50 77v15M8 50h15M77 50h15M20 20l11 11M69 69l11 11M80 20 69 31M31 69 20 80"/>',
      snowflake:'<path d="M50 8v84M14 29l72 42M14 71l72-42M50 8l-8 10M50 8l8 10M50 92l-8-10M50 92l8-10M14 29l13 1M14 29l6 12M86 71l-13-1M86 71l-6-12M14 71l13-1M14 71l6-12M86 29l-13 1M86 29l-6 12"/>'
    };
    return icons[name]||icons.spark;
  }

  function motifMarkup(name){
    const special={
      pumpkin:'<path d="M50 22c-5-9-2-15 6-18"/><path d="M50 23c-22-12-38 7-35 31 3 25 21 34 35 29 14 5 32-4 35-29 3-24-13-43-35-31Z"/><path d="m31 48 10-7 5 11M69 48l-10-7-5 11M38 67c8 7 16 7 24 0"/>',
      bat:'<path d="M50 49c-8-12-19-17-32-14 4 4 5 9 3 14-4-2-9-2-14 1 9 5 13 13 14 24 10-9 19-10 29-3 10-7 19-6 29 3 1-11 5-19 14-24-5-3-10-3-14-1-2-5-1-10 3-14-13-3-24 2-32 14Z"/><path d="M43 39 50 29l7 10"/>',
      star:'<path d="m50 9 10 27 29 1-23 18 8 28-24-16-24 16 8-28-23-18 29-1Z"/>',
      gift:'<rect x="16" y="38" width="68" height="48" rx="2"/><path d="M50 38v48M12 28h76v14H12Z"/><path d="M50 28c-17-1-25-8-22-16 3-8 15-4 22 16ZM50 28c17-1 25-8 22-16-3-8-15-4-22 16Z"/>',
      flame:'<path d="M53 8c5 21-12 25-5 40 4-8 12-12 17-22 14 13 23 31 13 49-8 14-23 19-36 14-18-7-26-28-15-44 6-9 15-15 26-37Z"/><path d="M50 56c8 8 9 17 4 25"/>',
      ribbon:'<path d="M8 30c19-13 35-13 48 0s28 13 36 0M8 58c19-13 35-13 48 0s28 13 36 0"/><circle cx="27" cy="25" r="4"/><circle cx="69" cy="67" r="4"/>',
      sparkle:'<path d="M50 6 58 39 91 47 58 55 50 88 42 55 9 47 42 39Z"/>',
      leaf:'<path d="M15 76c44 0 69-24 70-61C48 16 22 40 15 76Z"/><path d="M22 69 75 25"/>',
      lightning:'<path d="m57 5-31 49h22l-8 41 34-54H51Z"/>',
      stripes:'<path d="M12 18h12v64H12zM32 18h12v64H32zM52 18h12v64H52zM72 18h12v64H72z"/>',
      heart:'<path d="M50 82 18 50C2 33 14 14 31 18c8 2 14 8 19 15 5-7 11-13 19-15 17-4 29 15 13 32Z"/>',
      snowflake:iconMarkup("snowflake"),
      tree:iconMarkup("tree"),
      pennant:iconMarkup("pennant"),
      confetti:iconMarkup("confetti"),
      flower:iconMarkup("flower"),
      egg:iconMarkup("egg"),
      truck:iconMarkup("truck"),
      tag:iconMarkup("tag"),
      chip:iconMarkup("chip"),
      cake:iconMarkup("cake"),
      box:iconMarkup("box"),
      notebook:iconMarkup("notebook"),
      sun:iconMarkup("sun"),
      crescent:iconMarkup("crescent"),
      tie:iconMarkup("tie"),
      book:iconMarkup("book"),
      kite:iconMarkup("kite"),
      bag:iconMarkup("bag"),
      calendar:iconMarkup("calendar"),
      ticket:iconMarkup("ticket"),
      badge:iconMarkup("badge"),
      percent:iconMarkup("percent"),
      link:iconMarkup("link"),
      diamond:iconMarkup("diamond"),
      hardhat:iconMarkup("hardhat"),
      spark:iconMarkup("spark")
    };
    return special[name]||iconMarkup(name||"spark");
  }

  function campaignMotifs(campaign){
    const key=campaign?.key||"original";
    const map={
      anoNovo:["sparkle","star","ribbon"],
      carnaval:["confetti","ribbon","sparkle"],
      diaMulher:["flower","sparkle","heart"],
      pascoa:["egg","sparkle","leaf"],
      diaTrabalhador:["hardhat","lightning","sparkle"],
      diaMaes:["flower","heart","sparkle"],
      diaNamorados:["heart","sparkle","ribbon"],
      diaAmigo:["link","sparkle","diamond"],
      saoJoao:["pennant","flame","star"],
      diaPais:["tie","diamond","sparkle"],
      diaAvos:["book","leaf","sparkle"],
      diaHomem:["diamond","lightning","sparkle"],
      diaCriancas:["kite","sparkle","confetti"],
      halloween:["pumpkin","bat","crescent"],
      natal:["tree","star","snowflake","gift"],
      diaConsumidor:["bag","tag","sparkle"],
      mesConsumidor:["calendar","bag","sparkle"],
      semanaCliente:["ticket","tag","sparkle"],
      diaCliente:["badge","sparkle","heart"],
      onzeOnze:["stripes","tag","sparkle"],
      esquentaBlack:["flame","tag","lightning"],
      blackFriday:["tag","percent","lightning"],
      cyberMonday:["chip","lightning","sparkle"],
      liquidacao:["percent","tag","lightning"],
      freteGratis:["truck","box","sparkle"],
      aniversarioLobi:["cake","sparkle","confetti"],
      dropEspecial:["box","sparkle","lightning"],
      voltaAulas:["notebook","sparkle","stripes"],
      verao:["sun","ribbon","sparkle"],
      inverno:["snowflake","sparkle","stripes"]
    };
    return map[key]||[campaign?.icon||"spark","sparkle"];
  }

  function motifSvg(name){
    return '<svg viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">'+motifMarkup(name)+'</svg>';
  }

  function clearThemeDecor(){
    document.querySelectorAll(".lobi-theme-decor-layer").forEach(x=>x.remove());
    document.querySelectorAll(".lobi-theme-decor-host").forEach(x=>x.classList.remove("lobi-theme-decor-host"));
  }

  function decorateHost(host,campaign,slot){
    if(!host||!campaign||campaign.key==="original")return;
    host.classList.add("lobi-theme-decor-host");
    const motifs=campaignMotifs(campaign);
    const layer=document.createElement("div");
    layer.className="lobi-theme-decor-layer lobi-theme-decor-"+slot;
    layer.setAttribute("aria-hidden","true");
    const count=campaign.important?5:4;
    for(let i=0;i<count;i++){
      const item=document.createElement("span");
      item.className="lobi-theme-decor-item lobi-theme-decor-item-"+(i+1);
      item.style.color=i%2?safeColor(campaign.accent2,"#ef2b20"):safeColor(campaign.accent1,"#b7ff00");
      item.innerHTML=motifSvg(motifs[i%motifs.length]);
      layer.appendChild(item);
    }
    host.appendChild(layer);
  }

  function applyThemeDecor(campaign,hosts){
    clearThemeDecor();
    if(!campaign||campaign.key==="original")return;
    decorateHost(hosts.hero,campaign,"hero");
    decorateHost(hosts.products,campaign,"products");
    decorateHost(hosts.manifesto,campaign,"manifesto");
    decorateHost(hosts.footer,campaign,"footer");
  }

  function campaignBannerImage(campaign,mobile=false){
    const available=new Set([
      "anoNovo","carnaval","diaMulher","pascoa","diaTrabalhador",
      "diaMaes","diaNamorados","diaAmigo","saoJoao","diaPais",
      "diaAvos","diaHomem","diaCriancas","halloween","natal",
      "diaConsumidor","mesConsumidor","semanaCliente","diaCliente","onzeOnze",
      "esquentaBlack","blackFriday","cyberMonday","liquidacao","freteGratis",
      "aniversarioLobi","dropEspecial","voltaAulas","verao","inverno"
    ]);
    const createdHere={
      halloween:"assets/themes/halloween-lobi.webp",
      natal:"assets/themes/natal-lobi.webp",
      saoJoao:"assets/themes/sao-joao-lobi.webp",
      blackFriday:"assets/themes/black-friday-lobi.webp",
      diaNamorados:"assets/themes/namorados-lobi.webp",
      diaMaes:"assets/themes/maes-lobi.webp",
      verao:"assets/themes/verao-lobi.webp",
      inverno:"assets/themes/inverno-lobi.webp"
    };
    const key=campaign?.key||"";
    if(!available.has(key))return "";
    if(!mobile&&createdHere[key])return createdHere[key]+"?v=5";
    return "assets/campaigns/"+key+"-"+(mobile?"mobile":"desktop")+".svg?v=5";
  }

  function themeArt(campaign,variant="hero",mobile=false){
    if(!campaign||campaign.key==="original")return "";
    const a1=safeColor(campaign.accent1,"#b7ff00");
    const a2=safeColor(campaign.accent2,"#ef2b20");
    const motifs=campaignMotifs(campaign);
    const primary=motifs[0]||"sparkle";
    const secondary=motifs[1]||"sparkle";
    const tertiary=motifs[2]||"sparkle";

    // Duas artes realmente diferentes: horizontal no computador e vertical no celular.
    const w=mobile?900:(variant==="hero"?1600:1600);
    const h=mobile?1200:(variant==="hero"?900:520);
    const mainX=mobile?w*.63:w*.80;
    const mainY=mobile?h*.67:h*.52;
    const mainScale=mobile?5.2:(variant==="hero"?4.4:3.25);
    const secondX=mobile?w*.72:w*.68;
    const secondY=mobile?h*.28:h*.25;
    const secondScale=mobile?2.15:1.8;
    const thirdX=mobile?w*.23:w*.91;
    const thirdY=mobile?h*.82:h*.72;
    const thirdScale=mobile?1.35:1.1;

    const softAccent=campaign.important?".16":".10";
    const lineAccent=campaign.important?".34":".24";
    const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+w+' '+h+'">'+
      '<defs>'+
        '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'+
          '<stop offset="0" stop-color="#030303"/>'+
          '<stop offset=".68" stop-color="#050505"/>'+
          '<stop offset="1" stop-color="'+a2+'" stop-opacity=".07"/>'+
        '</linearGradient>'+
        '<radialGradient id="halo" cx="50%" cy="50%" r="50%">'+
          '<stop offset="0" stop-color="'+a1+'" stop-opacity="'+softAccent+'"/>'+
          '<stop offset="1" stop-color="'+a1+'" stop-opacity="0"/>'+
        '</radialGradient>'+
        '<filter id="soft"><feGaussianBlur stdDeviation="'+(mobile?18:14)+'"/></filter>'+
        '<pattern id="grain" width="54" height="54" patternUnits="userSpaceOnUse">'+
          '<circle cx="8" cy="11" r=".8" fill="#fff" opacity=".028"/>'+
          '<circle cx="36" cy="31" r=".6" fill="#fff" opacity=".022"/>'+
          '<path d="M54 0H0V54" fill="none" stroke="#fff" stroke-opacity=".018"/>'+
        '</pattern>'+
      '</defs>'+
      '<rect width="100%" height="100%" fill="url(#bg)"/>'+
      '<rect width="100%" height="100%" fill="url(#grain)"/>'+
      '<ellipse cx="'+mainX+'" cy="'+mainY+'" rx="'+(mobile?w*.34:w*.22)+'" ry="'+(mobile?h*.24:h*.47)+'" fill="url(#halo)" filter="url(#soft)"/>'+
      '<path d="'+(mobile
        ? 'M80 '+(h*.14)+' C'+(w*.28)+' '+(h*.10)+','+(w*.42)+' '+(h*.18)+','+(w*.53)+' '+(h*.12)
        : 'M'+(w*.60)+' 0 C'+(w*.66)+' '+(h*.20)+','+(w*.77)+' '+(h*.11)+','+w+' '+(h*.24))+'" fill="none" stroke="'+a1+'" stroke-opacity="'+lineAccent+'" stroke-width="'+(mobile?4:3)+'" stroke-linecap="round"/>'+
      '<path d="'+(mobile
        ? 'M'+(w*.08)+' '+(h*.88)+' C'+(w*.25)+' '+(h*.82)+','+(w*.34)+' '+(h*.91)+','+(w*.51)+' '+(h*.84)
        : 'M'+(w*.56)+' '+h+' C'+(w*.72)+' '+(h*.70)+','+(w*.86)+' '+(h*.88)+','+w+' '+(h*.66))+'" fill="none" stroke="'+a2+'" stroke-opacity=".18" stroke-width="'+(mobile?5:3)+'" stroke-linecap="round"/>'+
      '<g transform="translate('+mainX+' '+mainY+') scale('+mainScale+')" fill="none" stroke="'+a1+'" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round" opacity=".88">'+motifMarkup(primary)+'</g>'+
      '<g transform="translate('+secondX+' '+secondY+') scale('+secondScale+')" fill="none" stroke="#f4f4f1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".34">'+motifMarkup(secondary)+'</g>'+
      '<g transform="translate('+thirdX+' '+thirdY+') scale('+thirdScale+')" fill="none" stroke="'+a2+'" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity=".48">'+motifMarkup(tertiary)+'</g>'+
      '<circle cx="'+(mobile?w*.15:w*.62)+'" cy="'+(mobile?h*.23:h*.66)+'" r="'+(mobile?5:4)+'" fill="'+a1+'" opacity=".55"/>'+
      '<circle cx="'+(mobile?w*.83:w*.93)+'" cy="'+(mobile?h*.90:h*.18)+'" r="'+(mobile?3.5:3)+'" fill="#f4f4f1" opacity=".34"/>'+
      '</svg>';
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  }

  function iconSvg(name){
    return '<svg viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">'+iconMarkup(name)+'</svg>';
  }

  function setThemeMark(container){
    container?.querySelector(':scope > .lobi-theme-mark')?.remove();
  }

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
    window.__lobiEditorConfig=c;
    const root=document.documentElement.style;
    root.setProperty("--black",c.theme.background);
    root.setProperty("--white",c.theme.text);
    root.setProperty("--green",c.theme.primary);
    root.setProperty("--green-hover",c.theme.primary);
    root.setProperty("--red",c.theme.secondary);
    root.setProperty("--black-card",c.theme.panel);
    root.setProperty("--gray-light",c.theme.muted);

    const header=document.querySelector(".header");
    if(header){header.dataset.editorSection="header";header.hidden=!c.header.visible;header.style.height=c.header.height+"px";}
    const logo=document.querySelector(".brand img");
    if(logo){logo.style.width=c.header.logoWidth+"px";markEditorField(logo,"header","logoWidth");}

    const hero=document.querySelector(".hero");
    if(hero){
      hero.dataset.editorSection="hero";
      hero.hidden=!c.hero.visible;
      hero.style.minHeight=c.hero.minHeight+"px";
      hero.style.backgroundPosition=c.hero.imageX+"% "+c.hero.imageY+"%";
      hero.style.backgroundSize="cover";
      hero.style.backgroundRepeat="no-repeat";
      const heroArt=c.hero.imageUrl||"";
      hero.style.backgroundImage=heroArt
        ? 'linear-gradient(rgba(5,5,5,'+(c.hero.overlay/100)+'),rgba(5,5,5,'+(c.hero.overlay/100)+')),url("'+heroArt.replaceAll('"','%22')+'")'
        : "";
      hero.querySelector(":scope > .lobi-theme-mark")?.remove();
      const heroEyebrow=hero.querySelector(".hero-content .eyebrow");setText(heroEyebrow,c.hero.eyebrow);markEditorField(heroEyebrow,"hero","heroEyebrow");
      const h1=hero.querySelector("h1");
      if(h1){
        h1.innerHTML="";
        lines(c.hero.title).forEach((line,i)=>{ if(i)h1.appendChild(document.createElement("br")); h1.appendChild(document.createTextNode(line)); });
        if(lines(c.hero.title).length)h1.appendChild(document.createElement("br"));
        const span=document.createElement("span");span.textContent=c.hero.accent;h1.appendChild(span);markEditorField(h1,"hero","heroTitle");markEditorField(span,"hero","heroAccent");
      }
      const heroDescription=hero.querySelector(".hero-description");setText(heroDescription,c.hero.description);markEditorField(heroDescription,"hero","heroDescription");
      const btn=hero.querySelector(".primary-button");
      if(btn){btn.href=c.hero.buttonLink||"#produtos";btn.innerHTML=(c.hero.buttonText||"VER O DROP")+' <span>→</span>';markEditorField(btn,"hero","heroButtonText");}
    }

    const marquee=document.querySelector(".marquee");
    if(marquee){marquee.dataset.editorSection="marquee";marquee.hidden=!c.marquee.visible;const mt=marquee.querySelector("div");setText(mt,c.marquee.text);markEditorField(mt,"marquee","marqueeText");}

    const products=document.querySelector("#produtos");
    if(products){
      products.dataset.editorSection="products";products.hidden=!c.products.visible;
      const pe=products.querySelector(".section-heading .eyebrow");setText(pe,c.products.eyebrow);markEditorField(pe,"products","productsEyebrow");
      const ph=products.querySelector(".section-heading h2");setText(ph,c.products.title);markEditorField(ph,"products","productsTitle");
      const d=products.querySelector(".section-heading>p");if(d){d.innerHTML=lines(c.products.description).join("<br>");markEditorField(d,"products","productsDescription");}
    }

    const manifesto=document.querySelector("#sobre");
    if(manifesto){
      manifesto.dataset.editorSection="manifesto";manifesto.hidden=!c.manifesto.visible;
      const me=manifesto.querySelector(".eyebrow");setText(me,c.manifesto.eyebrow);markEditorField(me,"manifesto","manifestoEyebrow");
      const h2=manifesto.querySelector("h2");if(h2){h2.innerHTML=(c.manifesto.title||"")+'<br><span>'+(c.manifesto.accent||"")+'</span>';markEditorField(h2,"manifesto","manifestoTitle");const ma=h2.querySelector("span");markEditorField(ma,"manifesto","manifestoAccent");}
      const body=manifesto.querySelector(":scope > p:not(.eyebrow)");setText(body,c.manifesto.body);markEditorField(body,"manifesto","manifestoBody");
      const tags=manifesto.querySelector(".manifesto-tags");if(tags){tags.innerHTML="";String(c.manifesto.tags||"").split(",").map(x=>x.trim()).filter(Boolean).forEach(t=>{const s=document.createElement("span");s.textContent=t;tags.appendChild(s);});markEditorField(tags,"manifesto","manifestoTags");}
    }

    document.querySelectorAll(".lobi-theme-mark").forEach(mark=>{if(!mark.closest("#lobiPromoBanner"))mark.remove();});

    const promo=ensurePromo();
    promo.dataset.editorSection="promo";promo.hidden=!c.promo.visible;
    promo.style.minHeight=c.promo.height+"px";
    promo.style.backgroundPosition=c.promo.imageX+"% "+c.promo.imageY+"%";
    promo.style.backgroundSize="cover";
    promo.style.backgroundRepeat="no-repeat";
    if(promo.classList.contains("lobi-premium-theme-banner")){
      promo.style.removeProperty("background-size");
      promo.style.removeProperty("background-position");
      promo.style.removeProperty("background-repeat");
    }
    const campaignArt=!!c.campaign?.usePromoArt&&c.campaign?.key!=="original";
    const isMobileBanner=window.matchMedia("(max-width: 700px)").matches;
    const campaignFile=campaignArt?campaignBannerImage(c.campaign,isMobileBanner):"";
    const promoArt=campaignArt?(campaignFile||themeArt(c.campaign,"promo",isMobileBanner)):(c.promo.imageUrl||"");
    promo.dataset.campaignKey=c.campaign?.key||"original";
    promo.dataset.campaignFile=campaignFile?"1":"0";
    promo.classList.toggle("lobi-premium-theme-banner",campaignArt);
    promo.classList.toggle("lobi-file-theme-banner",!!campaignFile);

    let campaignImg=promo.querySelector(":scope > .lobi-promo-media");
    if(!campaignImg){
      campaignImg=document.createElement("img");
      campaignImg.className="lobi-promo-media";
      campaignImg.alt="";
      campaignImg.decoding="async";
      promo.prepend(campaignImg);
    }

    if(campaignFile){
      campaignImg.src=campaignFile;
      campaignImg.hidden=false;
      promo.style.backgroundImage="";
      promo.style.backgroundColor="#050505";
    }else{
      campaignImg.removeAttribute("src");
      campaignImg.hidden=true;
      promo.style.backgroundSize="cover";
      promo.style.backgroundRepeat="no-repeat";
      promo.style.backgroundPosition=isMobileBanner?"center 62%":"center center";
      promo.style.backgroundImage=promoArt
        ? (campaignArt
            ? 'linear-gradient('+(isMobileBanner?'180deg':'90deg')+',rgba(3,3,3,'+(isMobileBanner?'.18':'.84')+') 0%,rgba(3,3,3,'+(isMobileBanner?'.26':'.56')+') 48%,rgba(3,3,3,'+(isMobileBanner?'.58':'.10')+') 100%),url("'+promoArt.replaceAll('"','%22')+'")'
            : 'linear-gradient(rgba(5,5,5,'+(c.promo.overlay/100)+'),rgba(5,5,5,'+(c.promo.overlay/100)+')),url("'+promoArt.replaceAll('"','%22')+'")')
        : `linear-gradient(135deg,${c.theme.primary}24,${c.theme.secondary}18)`;
    }
    setThemeMark(promo,c.campaign,"promo");
    const promoTitle=promo.querySelector("h2");const promoSubtitle=promo.querySelector(".lobi-promo-subtitle");
    const campaignOnly=!!c.campaign?.usePromoArt&&c.campaign?.key!=="original";
    setText(promoTitle,campaignOnly?(c.campaign.label||c.promo.title):c.promo.title);
    setText(promoSubtitle,campaignOnly?"":c.promo.subtitle);
    promoTitle.hidden=!!campaignFile;
    promoSubtitle.hidden=campaignOnly;
    markEditorField(promoTitle,"promo","promoTitle");markEditorField(promoSubtitle,"promo","promoSubtitle");
    const pb=promo.querySelector(".lobi-promo-button");if(pb){pb.textContent=c.promo.buttonText||"VER PRODUTOS";pb.href=c.promo.buttonLink||"#produtos";markEditorField(pb,"promo","promoButtonText");}

    const footer=document.querySelector(".footer");
    if(footer){
      footer.dataset.editorSection="footer";footer.hidden=!c.footer.visible;
      const ft=footer.querySelector(".footer-brand p");setText(ft,c.footer.tagline);markEditorField(ft,"footer","footerTagline");
      const links=[...footer.querySelectorAll("a")];
      const insta=links.find(a=>a.textContent.trim().toLowerCase()==="instagram");
      const whats=links.find(a=>a.textContent.trim().toLowerCase()==="whatsapp");
      if(insta){if(c.footer.instagram)insta.href=c.footer.instagram;markEditorField(insta,"footer","footerInstagram");}
      if(whats){whats.href=c.footer.whatsapp||"https://wa.me/5583993149486";whats.target="_blank";whats.rel="noopener";markEditorField(whats,"footer","footerWhatsapp");}
    }
    const copyright=document.querySelector(".copyright");
    if(copyright){copyright.dataset.editorSection="footer";copyright.hidden=!c.footer.visible;setText(copyright,c.footer.copyright);markEditorField(copyright,"footer","footerCopyright");}

    applyThemeDecor(c.campaign,{hero,products,manifesto,footer});

    const main=document.querySelector("main");
    if(main){
      const map={hero:hero,promo,marquee,products,manifesto};
      (c.order||defaults.order).forEach(key=>{if(map[key])main.appendChild(map[key]);});
    }

    if(new URLSearchParams(location.search).has("editorPreview")){
      [hero,promo,marquee,products,manifesto].forEach(el=>{if(el){el.draggable=true;el.dataset.editorDraggable="true";}});
    }

    window.dispatchEvent(new CustomEvent("lobi:layout-applied"));

    ensureStyle().textContent=`
      [data-editor-section][hidden]{display:none!important}\n      body{background:${c.theme.background};color:${c.theme.text}}
      .hero h1{font-size:clamp(48px,8vw,${c.hero.titleMax}px)!important}
      .products-section{padding-top:${c.products.sectionPadding}px!important;padding-bottom:${c.products.sectionPadding}px!important}
      .products-grid{grid-template-columns:repeat(${Math.max(1,Math.min(6,c.products.columnsDesktop))},minmax(0,1fr))!important}
      .product-image{aspect-ratio:${c.products.imageRatio}!important}
      .product-image img{width:100%!important;height:100%!important;object-fit:cover!important}
      .lobi-promo-banner{width:100%;display:flex;align-items:center;justify-content:center;padding:50px 6%;background:#0b0b0b;color:var(--white);position:relative;overflow:hidden}
      .lobi-promo-content{text-align:center;max-width:900px}
      .lobi-promo-banner.lobi-premium-theme-banner{justify-content:flex-start;padding:46px 6%;border-top:1px solid rgba(255,255,255,.055);border-bottom:1px solid rgba(255,255,255,.055)}
      .lobi-promo-banner.lobi-premium-theme-banner .lobi-promo-content{width:min(620px,48%);max-width:620px;text-align:left}
      .lobi-promo-banner.lobi-premium-theme-banner .lobi-promo-subtitle{color:rgba(244,244,241,.72);letter-spacing:.28em}
      .lobi-promo-banner.lobi-premium-theme-banner h2{font-size:clamp(38px,5.2vw,74px);line-height:.94;letter-spacing:-2.4px;max-width:620px;text-wrap:balance}
      .lobi-promo-banner.lobi-premium-theme-banner .lobi-promo-button{background:rgba(5,5,5,.22);color:var(--white);border:1px solid rgba(255,255,255,.30);padding:11px 16px;font-size:9px;border-radius:7px}
      .lobi-promo-banner.lobi-premium-theme-banner .lobi-promo-button:hover{border-color:var(--green);color:var(--green)}
      .lobi-promo-banner.lobi-file-theme-banner .lobi-promo-content{position:absolute;left:6%;bottom:24px;width:auto;max-width:none}
      .lobi-promo-banner.lobi-file-theme-banner .lobi-promo-button{margin-top:0;background:rgba(3,3,3,.68);backdrop-filter:blur(4px)}
      .lobi-promo-subtitle{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--gray-light);margin-bottom:14px}
      .lobi-promo-banner h2{font-family:"Archivo Black",sans-serif;font-size:clamp(42px,7vw,100px);line-height:.9;letter-spacing:-4px}
      .lobi-promo-button{display:inline-flex;margin-top:25px;background:var(--green);color:#050505;padding:16px 22px;font-size:10px;font-weight:800;letter-spacing:.14em}
      .lobi-theme-mark{position:absolute;right:5%;bottom:6%;z-index:3;display:flex;align-items:center;gap:9px;padding:8px 10px;border:1px solid currentColor;background:rgba(5,5,5,.68);backdrop-filter:blur(8px);pointer-events:none;opacity:.78}
      .lobi-theme-mark svg{width:23px;height:23px;display:block}
      .lobi-theme-mark span{color:var(--white);font-size:8px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
      .lobi-promo-banner>.lobi-theme-mark{right:3%;bottom:18px;opacity:.68}
      .lobi-theme-decor-host{position:relative;overflow:hidden}
      .lobi-theme-decor-layer{position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden}
      .lobi-theme-decor-host>.hero-content,.lobi-theme-decor-host>.section-heading,.lobi-theme-decor-host>.products-grid,.lobi-theme-decor-host>.filters,.lobi-theme-decor-host>.manifesto-tags,.lobi-theme-decor-host>.footer-brand,.lobi-theme-decor-host>div:not(.lobi-theme-decor-layer){position:relative;z-index:3}
      .lobi-theme-decor-item{position:absolute;display:block;opacity:.075;filter:drop-shadow(0 0 22px currentColor)}
      .lobi-theme-decor-item svg{width:100%;height:100%;display:block}
      .lobi-theme-decor-item-1{width:118px;height:118px;left:-28px;top:12%;transform:rotate(-12deg)}
      .lobi-theme-decor-item-2{width:92px;height:92px;right:4%;top:17%;transform:rotate(14deg)}
      .lobi-theme-decor-item-3{width:74px;height:74px;left:9%;bottom:8%;transform:rotate(9deg)}
      .lobi-theme-decor-item-4{width:132px;height:132px;right:-36px;bottom:3%;transform:rotate(-8deg)}
      .lobi-theme-decor-item-5{width:58px;height:58px;left:48%;top:7%;transform:rotate(20deg)}
      .lobi-theme-decor-products .lobi-theme-decor-item{opacity:.055}
      .lobi-theme-decor-manifesto .lobi-theme-decor-item{opacity:.065}
      .lobi-theme-decor-footer .lobi-theme-decor-item{opacity:.05}
      .lobi-theme-decor-footer .lobi-theme-decor-item-1{left:3%;top:12%}
      .lobi-theme-decor-footer .lobi-theme-decor-item-2{right:8%;top:10%}
      .lobi-theme-decor-footer .lobi-theme-decor-item-3{left:38%;bottom:-18px}
      .lobi-theme-decor-footer .lobi-theme-decor-item-4{right:32%;bottom:-30px}
      @media(max-width:600px){
        .lobi-theme-mark{right:4%;bottom:4%;padding:6px 7px}
        .lobi-theme-mark svg{width:18px;height:18px}
        .lobi-theme-mark span{display:none}
        .lobi-promo-banner.lobi-premium-theme-banner{
          min-height:440px!important;
          padding:0 6% 28px!important;
          align-items:flex-end!important;
          justify-content:flex-start!important;
          background-color:#050505!important;
          background-size:100% 100%,contain!important;
          background-position:center,center top!important;
          background-repeat:no-repeat,no-repeat!important;
        }
        .lobi-promo-banner.lobi-premium-theme-banner::after{
          content:"";
          position:absolute;
          inset:0;
          z-index:0;
          pointer-events:none;
          background:linear-gradient(180deg,rgba(5,5,5,.04) 0%,rgba(5,5,5,.12) 45%,rgba(5,5,5,.82) 78%,#050505 100%);
        }
        .lobi-promo-banner.lobi-premium-theme-banner .lobi-promo-content{
          position:relative;
          z-index:2;
          width:100%;
          max-width:100%;
          padding:16px 0 0;
          background:none;
          backdrop-filter:none;
        }
        .lobi-promo-banner.lobi-premium-theme-banner .lobi-promo-subtitle{
          margin-bottom:7px;
          font-size:8px;
          line-height:1.35;
          letter-spacing:.22em;
          color:rgba(244,244,241,.68);
        }
        .lobi-promo-banner.lobi-premium-theme-banner h2{
          max-width:92%;
          margin:0 0 12px;
          font-size:clamp(28px,9vw,42px);
          line-height:.95;
          letter-spacing:-1.4px;
          text-wrap:balance;
        }
        .lobi-promo-banner.lobi-premium-theme-banner .lobi-promo-button{
          min-height:38px;
          padding:10px 14px;
          border-radius:7px;
          font-size:8px;
          letter-spacing:.12em;
        }
        .lobi-theme-decor-item-1{width:72px;height:72px;left:-18px}
        .lobi-theme-decor-item-2{width:58px;height:58px;right:2%}
        .lobi-theme-decor-item-3{width:48px;height:48px;left:8%}
        .lobi-theme-decor-item-4{width:78px;height:78px;right:-24px}
        .lobi-theme-decor-item-5{display:none}
        .lobi-theme-decor-products .lobi-theme-decor-item,.lobi-theme-decor-manifesto .lobi-theme-decor-item,.lobi-theme-decor-footer .lobi-theme-decor-item{opacity:.045}
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

  function editorFieldValue(field){
    const c=window.__lobiEditorConfig||{};
    const map={
      heroEyebrow:c.hero?.eyebrow,heroTitle:c.hero?.title,heroAccent:c.hero?.accent,heroDescription:c.hero?.description,heroButtonText:c.hero?.buttonText,
      marqueeText:c.marquee?.text,
      productsEyebrow:c.products?.eyebrow,productsTitle:c.products?.title,productsDescription:c.products?.description,
      promoTitle:c.promo?.title,promoSubtitle:c.promo?.subtitle,promoButtonText:c.promo?.buttonText,
      manifestoEyebrow:c.manifesto?.eyebrow,manifestoTitle:c.manifesto?.title,manifestoAccent:c.manifesto?.accent,manifestoBody:c.manifesto?.body,manifestoTags:c.manifesto?.tags,
      footerTagline:c.footer?.tagline,footerInstagram:c.footer?.instagram,footerWhatsapp:c.footer?.whatsapp,footerCopyright:c.footer?.copyright
    };
    return map[field]??"";
  }

  function closeDirectTools(){
    document.querySelectorAll(".lobi-direct-editor,.lobi-direct-toolbar").forEach(x=>x.remove());
  }

  function openInlineEditor(target,section,field){
    closeDirectTools();
    const value=editorFieldValue(field);
    const multiline=["heroTitle","heroDescription","marqueeText","productsDescription","manifestoBody"].includes(field);
    const box=document.createElement("div");
    box.className="lobi-direct-editor";
    box.innerHTML='<div class="lobi-direct-label">EDITAR DIRETO</div>'+(multiline?'<textarea class="lobi-direct-input"></textarea>':'<input class="lobi-direct-input" type="text">')+'<div class="lobi-direct-actions"><button type="button" class="lobi-direct-cancel">CANCELAR</button><button type="button" class="lobi-direct-save">APLICAR</button></div>';
    const input=box.querySelector(".lobi-direct-input");
    input.value=value;
    document.body.appendChild(box);
    const r=target.getBoundingClientRect();
    const w=Math.min(380,window.innerWidth-20);
    box.style.width=w+"px";
    box.style.left=Math.max(10,Math.min(window.innerWidth-w-10,r.left))+"px";
    box.style.top=Math.max(10,Math.min(window.innerHeight-box.offsetHeight-10,r.bottom+8))+"px";
    const apply=()=>{
      parent.postMessage({type:"lobi-editor-inline-change",section,field,value:input.value},"*");
      box.remove();
    };
    box.querySelector(".lobi-direct-save").onclick=apply;
    box.querySelector(".lobi-direct-cancel").onclick=()=>box.remove();
    input.addEventListener("keydown",e=>{
      if(!multiline&&e.key==="Enter"){e.preventDefault();apply();}
      if(multiline&&e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();apply();}
      if(e.key==="Escape"){e.preventDefault();box.remove();}
    });
    setTimeout(()=>{input.focus();if(typeof input.select==="function")input.select();},0);
  }

  function openSectionToolbar(target,section){
    closeDirectTools();
    const box=document.createElement("div");
    box.className="lobi-direct-toolbar";
    const movable=["hero","promo","marquee","products","manifesto"].includes(section);
    box.innerHTML=(movable?'<button type="button" data-act="up">↑</button><button type="button" data-act="down">↓</button>':'')+
      (["hero","promo"].includes(section)?'<button type="button" data-act="image">IMAGEM</button>':'')+
      '<button type="button" data-act="advanced">AJUSTES</button><button type="button" class="danger" data-act="delete">EXCLUIR</button>';
    document.body.appendChild(box);
    const r=target.getBoundingClientRect();
    const w=box.offsetWidth;
    box.style.left=Math.max(8,Math.min(window.innerWidth-w-8,r.left+8))+"px";
    box.style.top=Math.max(8,r.top+8)+"px";
    box.querySelectorAll("button").forEach(btn=>btn.onclick=()=>{
      const act=btn.dataset.act;
      if(act==="up"||act==="down")parent.postMessage({type:"lobi-editor-move-fixed",section,dir:act==="up"?-1:1},"*");
      if(act==="image")parent.postMessage({type:"lobi-editor-quick-image",section},"*");
      if(act==="advanced")parent.postMessage({type:"lobi-editor-open-advanced",section},"*");
      if(act==="delete")parent.postMessage({type:"lobi-editor-context-delete-fixed",section},"*");
      box.remove();
    });
  }

  function setupEditorPreview(){
    if(!new URLSearchParams(location.search).has("editorPreview"))return;
    document.documentElement.classList.add("lobi-editor-preview");
    const s=document.createElement("style");
    s.textContent='html.lobi-editor-preview [data-editor-section]{outline:1px dashed transparent;cursor:pointer;transition:outline-color .15s ease,opacity .15s ease}html.lobi-editor-preview [data-editor-section]:hover{outline:2px solid #b7ff00;outline-offset:-2px}html.lobi-editor-preview [data-editor-field]:hover{outline:2px solid #fff;outline-offset:2px}html.lobi-editor-preview [data-editor-draggable="true"]{cursor:grab}html.lobi-editor-preview .lobi-editor-dragging{opacity:.45;outline:2px solid #b7ff00!important}html.lobi-editor-preview .lobi-editor-drop-target{outline:3px solid #b7ff00!important;outline-offset:-3px}.lobi-direct-editor{position:fixed;z-index:999999;padding:12px;border:1px solid rgba(183,255,0,.35);border-radius:12px;background:#0b0b0d;box-shadow:0 18px 60px rgba(0,0,0,.55);font-family:Inter,sans-serif}.lobi-direct-label{margin-bottom:8px;color:#b7ff00;font-size:9px;font-weight:800;letter-spacing:.14em}.lobi-direct-input{width:100%;min-height:44px;border:1px solid rgba(255,255,255,.14);border-radius:8px;background:#050505;color:#fff;padding:10px 11px;font:500 14px Inter,sans-serif;outline:none}.lobi-direct-editor textarea{min-height:110px;resize:vertical}.lobi-direct-input:focus{border-color:#b7ff00}.lobi-direct-actions{display:flex;justify-content:flex-end;gap:7px;margin-top:9px}.lobi-direct-actions button,.lobi-direct-toolbar button{border:1px solid rgba(255,255,255,.12);border-radius:7px;background:#111;color:#ddd;padding:8px 10px;font:800 8px Inter,sans-serif;letter-spacing:.08em}.lobi-direct-actions .lobi-direct-save{background:#b7ff00;color:#050505;border-color:#b7ff00}.lobi-direct-toolbar{position:fixed;z-index:999998;display:flex;gap:5px;padding:6px;border:1px solid rgba(183,255,0,.28);border-radius:10px;background:rgba(8,8,9,.95);box-shadow:0 12px 40px rgba(0,0,0,.4);backdrop-filter:blur(10px)}.lobi-direct-toolbar .danger{color:#ff6b63;border-color:rgba(239,43,32,.35)}html.lobi-editor-preview a,html.lobi-editor-preview button{pointer-events:auto}';
    document.head.appendChild(s);

    const clearSelected=()=>document.querySelectorAll(".lobi-editor-selected").forEach(x=>x.classList.remove("lobi-editor-selected"));
    const clearDrop=()=>document.querySelectorAll(".lobi-editor-drop-target").forEach(x=>x.classList.remove("lobi-editor-drop-target"));

    document.addEventListener("click",e=>{
      if(e.target.closest(".lobi-direct-editor,.lobi-direct-toolbar"))return;
      const field=e.target.closest("[data-editor-field]");
      const section=e.target.closest("[data-editor-section]");
      if(!section||section.classList.contains("lobi-extra-block"))return;
      e.preventDefault();e.stopPropagation();
      clearSelected();section.classList.add("lobi-editor-selected");
      if(field){
        openInlineEditor(field,field.dataset.editorSection||section.dataset.editorSection,field.dataset.editorField);
      }else{
        openSectionToolbar(section,section.dataset.editorSection);
      }
    },true);

    document.addEventListener("dragstart",e=>{
      const section=e.target.closest('[data-editor-draggable="true"]');
      if(!section||section.classList.contains("lobi-extra-block"))return;
      const key=section.dataset.editorSection;
      if(!["hero","promo","marquee","products","manifesto"].includes(key))return;
      e.dataTransfer.effectAllowed="move";
      e.dataTransfer.setData("text/plain","fixed:"+key);
      section.classList.add("lobi-editor-dragging");
    },true);

    document.addEventListener("dragend",e=>{
      e.target.closest?.(".lobi-editor-dragging")?.classList.remove("lobi-editor-dragging");
      clearDrop();
    },true);

    document.addEventListener("dragover",e=>{
      const target=e.target.closest('[data-editor-draggable="true"]');
      if(!target||target.classList.contains("lobi-extra-block"))return;
      e.preventDefault();
      clearDrop();
      target.classList.add("lobi-editor-drop-target");
      e.dataTransfer.dropEffect="move";
    },true);

    document.addEventListener("drop",e=>{
      const target=e.target.closest('[data-editor-draggable="true"]');
      if(!target||target.classList.contains("lobi-extra-block"))return;
      e.preventDefault();e.stopPropagation();
      const payload=e.dataTransfer.getData("text/plain")||"";
      const rect=target.getBoundingClientRect();
      const after=e.clientY>rect.top+rect.height/2;
      const targetKey=target.dataset.editorSection;
      clearDrop();
      if(payload.startsWith("fixed:")){
        parent.postMessage({type:"lobi-editor-reorder-fixed",from:payload.slice(6),to:targetKey,after:after},"*");
      }else if(payload.startsWith("block:")){
        let placement="afterHero";
        if(targetKey==="products")placement=after?"afterProducts":"beforeProducts";
        else if(targetKey==="manifesto")placement=after?"afterManifesto":"beforeManifesto";
        else if(targetKey==="hero")placement="afterHero";
        else if(["promo","marquee"].includes(targetKey))placement=after?"beforeProducts":"afterHero";
        parent.postMessage({type:"lobi-editor-place-block",id:payload.slice(6),placement:placement},"*");
      }
    },true);

    document.addEventListener("contextmenu",e=>{
      const section=e.target.closest("[data-editor-section]");
      if(!section||section.classList.contains("lobi-extra-block"))return;
      const key=section.dataset.editorSection;
      if(!["header","hero","promo","marquee","products","manifesto","footer"].includes(key))return;
      e.preventDefault();e.stopPropagation();
      parent.postMessage({type:"lobi-editor-context-delete-fixed",section:key},"*");
    },true);
    parent.postMessage({type:"lobi-preview-ready"},"*");
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{load().then(setupEditorPreview);});
  else load().then(setupEditorPreview);

  let lobiCampaignViewport=window.matchMedia("(max-width: 700px)").matches;
  window.addEventListener("resize",()=>{
    const now=window.matchMedia("(max-width: 700px)").matches;
    if(now===lobiCampaignViewport)return;
    lobiCampaignViewport=now;
    if(window.__lobiEditorConfig)apply(window.__lobiEditorConfig);
  });

})();
