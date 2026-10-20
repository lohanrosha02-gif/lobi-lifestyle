/* LOBI Lifestyle | atualizações em tempo real, com conferência de segurança.
   Recebe eventos apenas de catálogo público, sem sincronizar carrinhos privados. */
(function(){
  "use strict";
  const sb=window.lobiSupabase;
  if(!sb||!sb.channel)return;
  const isPreview=new URLSearchParams(window.location.search).has("editorPreview");
  if(isPreview)return; // Não sobrescrever a prévia não publicada do administrador.

  let scheduled=null;
  let pendingProducts=false,pendingConfig=false,pendingBlocks=false;
  const refreshAll=()=>{
    scheduled=null;
    if(document.hidden)return;
    const products=pendingProducts,config=pendingConfig,blocks=pendingBlocks;
    pendingProducts=pendingConfig=pendingBlocks=false;
    if(products&&typeof loadProducts==="function")loadProducts({silent:true}).catch(console.warn);
    if(config&&typeof window.lobiReloadConfig==="function")window.lobiReloadConfig().catch(console.warn);
    if(blocks&&typeof window.lobiReloadBlocks==="function")window.lobiReloadBlocks().catch(console.warn);
  };
  const schedule=(kind)=>{
    if(kind==="__site_config__")pendingConfig=true;
    else if(kind==="__site_blocks__")pendingBlocks=true;
    else pendingProducts=true;
    if(scheduled!==null)clearTimeout(scheduled);
    scheduled=setTimeout(refreshAll,450);
  };
  const refreshOnFocus=()=>{
    if(document.hidden)return;
    pendingProducts=pendingConfig=pendingBlocks=true;
    if(scheduled!==null)clearTimeout(scheduled);
    scheduled=setTimeout(refreshAll,200);
  };
  sb.channel("lobi-public-live-catalog")
    .on("postgres_changes",{event:"*",schema:"public",table:"products"},(payload)=>{
      const category=payload.new?.category||payload.old?.category||"";
      // Old row details on DELETE may be incomplete; refreshing product list is safe.
      if(!category){schedule("");return;}
      schedule(category);
    })
    .subscribe((status)=>{
      if(status==="CHANNEL_ERROR")console.warn("LOBI: tempo real indisponível; atualização periódica permanece ativa.");
    });
  document.addEventListener("visibilitychange",refreshOnFocus);
  // Fallback if realtime publication is not enabled or connection drops.
  setInterval(refreshOnFocus,120000);
})();
