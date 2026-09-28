(() => {
  const sb=window.lobiSupabase;
  if(!sb)return;
  const CATEGORY="__site_blocks__";
  let current=[];

  function clearZones(){document.querySelectorAll(".lobi-dynamic-zone").forEach(x=>x.remove());}
  function style(){
    if(document.getElementById("lobiBlocksStyle"))return;
    const s=document.createElement("style");s.id="lobiBlocksStyle";
    s.textContent=
      ".lobi-dynamic-zone{width:100%}.lobi-extra-block[hidden]{display:none!important}.lobi-extra-block{width:100%;display:flex;align-items:center;justify-content:center;padding-left:6%;padding-right:6%;overflow:hidden}.lobi-extra-inner{width:100%;max-width:1200px;margin:0 auto}.lobi-extra-block h2{font-family:'Archivo Black',sans-serif;font-size:clamp(34px,5vw,72px);line-height:.95;letter-spacing:-3px}.lobi-extra-eyebrow{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--gray-light);margin-bottom:14px}.lobi-extra-body{margin:18px auto 0;max-width:760px;color:var(--gray-light);line-height:1.8;white-space:pre-line}.lobi-extra-button{display:inline-flex;margin-top:25px;background:var(--green);color:#050505;padding:16px 22px;font-size:10px;font-weight:800;letter-spacing:.14em}.lobi-extra-image{width:100%;height:auto;display:block}.lobi-extra-caption{margin-top:10px;color:var(--gray-light);font-size:11px}.lobi-extra-divider{margin:0 auto}.lobi-extra-banner{background-size:cover;background-position:center}.lobi-editor-preview .lobi-extra-block{cursor:pointer;outline:1px dashed transparent}.lobi-editor-preview .lobi-extra-block:hover{outline:2px solid var(--green);outline-offset:-2px}@media(max-width:600px){.lobi-extra-block{padding-left:5%;padding-right:5%}.lobi-extra-block h2{letter-spacing:-2px}}";
    document.head.appendChild(s);
  }

  function zone(where){
    const z=document.createElement("div");z.className="lobi-dynamic-zone";z.dataset.zone=where;
    const hero=document.querySelector(".hero"),products=document.querySelector("#produtos"),manifesto=document.querySelector("#sobre"),main=document.querySelector("main");
    if(where==="afterHero"&&hero)hero.insertAdjacentElement("afterend",z);
    else if(where==="beforeProducts"&&products)products.insertAdjacentElement("beforebegin",z);
    else if(where==="afterProducts"&&products)products.insertAdjacentElement("afterend",z);
    else if(where==="beforeManifesto"&&manifesto)manifesto.insertAdjacentElement("beforebegin",z);
    else if(where==="afterManifesto"&&manifesto)manifesto.insertAdjacentElement("afterend",z);
    else main?.appendChild(z);
    return z;
  }

  function button(text,href){
    const a=document.createElement("a");a.className="lobi-extra-button";a.textContent=text||"VER MAIS";a.href=href||"#";return a;
  }

  function block(b){
    const s=document.createElement("section");s.className="lobi-extra-block lobi-extra-"+b.type;s.dataset.blockId=b.id;s.dataset.editorSection="blocks";
    if(b.visible===false)s.hidden=true;
    if(b.background)s.style.background=b.background;
    s.style.paddingTop=(b.paddingTop||0)+"px";s.style.paddingBottom=(b.paddingBottom||0)+"px";s.style.textAlign=b.align||"center";
    const inner=document.createElement("div");inner.className="lobi-extra-inner";s.appendChild(inner);
    if(b.type==="banner"){
      s.classList.add("lobi-extra-banner");s.style.minHeight=(b.height||420)+"px";s.style.backgroundPosition=(b.imageX??50)+"% "+(b.imageY??50)+"%";
      if(b.imageUrl)s.style.backgroundImage='linear-gradient(rgba(5,5,5,'+((b.overlay??45)/100)+'),rgba(5,5,5,'+((b.overlay??45)/100)+')),url("'+String(b.imageUrl).replaceAll('"','%22')+'")';
      const p=document.createElement("p");p.className="lobi-extra-eyebrow";p.textContent=b.subtitle||"";const h=document.createElement("h2");h.textContent=b.title||"";inner.append(p,h);if(b.buttonText)inner.appendChild(button(b.buttonText,b.buttonLink));
    }else if(b.type==="text"){
      inner.style.maxWidth=(b.maxWidth||820)+"px";const e=document.createElement("p");e.className="lobi-extra-eyebrow";e.textContent=b.eyebrow||"";const h=document.createElement("h2");h.textContent=b.title||"";const p=document.createElement("p");p.className="lobi-extra-body";p.textContent=b.body||"";inner.append(e,h,p);
    }else if(b.type==="image"){
      inner.style.maxWidth=(b.maxWidth||1400)+"px";inner.style.width=Math.max(10,Math.min(100,b.width||100))+"%";const img=document.createElement("img");img.className="lobi-extra-image";img.src=b.imageUrl||"";img.alt=b.alt||"";inner.appendChild(img);if(b.caption){const p=document.createElement("p");p.className="lobi-extra-caption";p.textContent=b.caption;inner.appendChild(p);}
    }else if(b.type==="cta"){
      const h=document.createElement("h2");h.textContent=b.title||"";const p=document.createElement("p");p.className="lobi-extra-body";p.textContent=b.body||"";inner.append(h,p);if(b.buttonText)inner.appendChild(button(b.buttonText,b.buttonLink));
    }else if(b.type==="spacer"){
      s.style.padding="0";s.style.height=(b.height||120)+"px";inner.remove();
    }else if(b.type==="divider"){
      const d=document.createElement("div");d.className="lobi-extra-divider";d.style.width=(b.width||80)+"%";d.style.height=(b.thickness||1)+"px";d.style.background=b.color||"#2a2a2a";inner.appendChild(d);
    }
    return s;
  }

  function render(items){
    current=Array.isArray(items)?items:[];
    style();clearZones();
    const places=["afterHero","beforeProducts","afterProducts","beforeManifesto","afterManifesto"];
    places.forEach(p=>{
      const list=current.filter(b=>(b.placement||"afterHero")===p);
      if(!list.length)return;
      const z=zone(p);list.forEach(b=>z.appendChild(block(b)));
    });
  }

  async function load(){
    const r=await sb.from("products").select("description").eq("category",CATEGORY).order("updated_at",{ascending:false}).limit(1);
    if(r.error){console.warn("LOBI blocks:",r.error);render([]);return;}
    if(r.data&&r.data.length){try{render(JSON.parse(r.data[0].description||"[]"));}catch{render([]);}}else render([]);
  }

  window.addEventListener("message",e=>{if(e.data&&e.data.type==="lobi-preview-blocks")render(e.data.blocks);});
  document.addEventListener("click",e=>{
    if(!new URLSearchParams(location.search).has("editorPreview"))return;
    const b=e.target.closest(".lobi-extra-block");if(!b)return;e.preventDefault();e.stopPropagation();parent.postMessage({type:"lobi-editor-select",section:"blocks"},"*");
  },true);

  document.addEventListener("contextmenu",e=>{
    if(!new URLSearchParams(location.search).has("editorPreview"))return;
    const b=e.target.closest(".lobi-extra-block");if(!b)return;
    e.preventDefault();e.stopPropagation();
    parent.postMessage({type:"lobi-editor-context-delete-block",id:b.dataset.blockId},"*");
  },true);

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(load,250));else setTimeout(load,250);
})();