(function(){
  const API_URL='https://script.google.com/macros/s/AKfycbxaRTFVJJPDwPdnWcSavK8VeZV8MX2NiDRHGccdDGWXSM0ZqDxGeug-qiT3r04-5SpE/exec';
  const CACHE_KEY='paperclip.papers.v2', CACHE_TTL=5*60*1000;
  const monthYear=new Intl.DateTimeFormat('en',{month:'long',year:'numeric'}),dayMonth=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short'});
  const normalizeDate=(value,formatter,separator)=>{if(!/^\d{4}-\d{2}-\d{2}T/.test(String(value??'')))return value;const parts=formatter.format(new Date(value)).split(' ');return separator===' | '?parts.join(separator):formatter.format(new Date(value))};
  const normalizePaper=paper=>({...paper,MONTH_YEAR:normalizeDate(paper.MONTH_YEAR,monthYear,' | '),STARTED:normalizeDate(paper.STARTED,dayMonth,' | '),SUBMISSION_DATE:normalizeDate(paper.SUBMISSION_DATE,dayMonth,' | ')});
  const readCache=()=>{try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'null')}catch{return null}};
  const writeCache=data=>localStorage.setItem(CACHE_KEY,JSON.stringify({savedAt:Date.now(),data}));
  async function request(action,{params={},body,cache=false}={}){
    const url=new URL(API_URL);url.searchParams.set('action',action);
    Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v??''));
    try{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
      const options=body?{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,...body}),signal:controller.signal}:{signal:controller.signal};
      const response=await fetch(body?API_URL:url,options);
      clearTimeout(timer);
      if(!response.ok)throw new Error(`Request failed (${response.status})`);
      const result=await response.json();
      if(!result||result.success!==true)throw new Error(result?.message||'Unexpected API response');
      const data=Array.isArray(result.data)?result.data.map(normalizePaper):result.data;
      if(cache)writeCache(data);
      return data;
    }catch(error){
      const saved=readCache();
      if(cache&&saved?.data){window.dispatchEvent(new CustomEvent('paperclip:offline'));return saved.data}
      throw new Error(error.name==='AbortError'?'Tracker request timed out.':error.message);
    }
  }
  window.PaperClipAPI={
    API_URL,CACHE_TTL,readCache,
    getAllPapers:()=>request('getAllPapers',{cache:true}),
    searchPapers:query=>request('searchPapers',{params:{query}}),
    getPapersByAssignee:name=>request('getPapersByAssignee',{params:{name}}),
    getDashboardStats:()=>request('getDashboardStats'),
    getAnalytics:()=>request('getAnalytics'),
    addPaper:data=>request('addPaper',{body:{data}}),
    updatePaper:(id,data)=>request('updatePaper',{body:{id,data}}),
    deletePaper:id=>request('deletePaper',{body:{id}})
  };
})();
