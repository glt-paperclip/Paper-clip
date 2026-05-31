(function(){
  const P=window.PaperClip,U=window.PaperClipUtils;let rows=[];
  P.setTitle('Monthly View','Select a month to see its papers');
  const root=document.getElementById('page-root');
  root.innerHTML=`<section class="panel rounded-2xl p-4"><div class="flex flex-wrap items-end justify-between gap-3"><label class="w-full max-w-sm"><span class="muted mb-1 block text-xs font-bold">Month | Year</span><select id="selected-month" class="select"></select></label><button id="export-month" class="btn btn-soft">↓ Export month CSV</button></div></section><section id="month-content" class="mt-5"></section>`;
  const selector=document.getElementById('selected-month'),content=document.getElementById('month-content');
  function monthOrder(value){const date=new Date(String(value).replace(' | ',' 1, '));return Number.isNaN(date.getTime())?0:date.getTime()}
  function render(){
    const selected=selector.value,list=rows.filter(p=>p.MONTH_YEAR===selected),stages=list.reduce((o,p)=>{const key=U.status(p);o[key]=(o[key]||0)+1;return o},{});
    content.innerHTML=`<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${[['Papers',list.length],['Completed',stages.done||0],['Pending',stages.pending||0],['Under review',stages.review||0]].map(([label,value])=>`<article class="panel rounded-2xl p-5"><span class="muted text-xs font-bold uppercase tracking-wider">${label}</span><b class="mt-3 block text-3xl">${value}</b></article>`).join('')}</section><section class="panel mt-5 rounded-2xl"><div class="p-4"><h2 class="font-extrabold">${U.esc(selected||'Monthly')} papers</h2><p class="muted text-xs">Filtered using the Month | Year column.</p></div>${list.length?P.table(list):P.empty('No papers found for this month','Select another month or add a paper with this Month | Year value.')}</section>`;
    P.bindTableActions(content);
  }
  function hydrate(data){
    rows=data;const months=U.unique(rows,'MONTH_YEAR').sort((a,b)=>monthOrder(b)-monthOrder(a));
    selector.innerHTML=months.map(month=>`<option>${U.esc(month)}</option>`).join('');
    render();
  }
  selector.onchange=render;document.getElementById('export-month').onclick=()=>U.download(rows.filter(p=>p.MONTH_YEAR===selector.value),`paper-clip-${selector.value.replace(/\s+\|\s+/g,'-').toLowerCase()}.csv`);
  window.addEventListener('paperclip:data',e=>hydrate(e.detail));P.refresh();
})();
