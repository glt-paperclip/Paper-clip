(function(){
  const FIELDS=['ID','PAPER_TITLE','DOMAIN','AI_PLAG_REPORT','ASSIGNEE','PRIORITY','WORK_STAGE','STARTED','SUBMISSION_DATE','MONTH_YEAR','LINK','NJR','NJA','RR','PUBLICATION_RESULT','DATASET','CLIENT_DETAILS','METHOD_TYPE','MODEL_NAME','HYPERPARAMETERS','JOURNAL','RESULT','NOVELTY_SCORE','NOTES','ABSTRACT'];
  const LABELS={ID:'ID',PAPER_TITLE:'Paper Title',DOMAIN:'Domain',AI_PLAG_REPORT:'AI | Plag | Report',ASSIGNEE:'Assignee',PRIORITY:'Priority',WORK_STAGE:'Work Stage',STARTED:'Started',SUBMISSION_DATE:'Submission Date',MONTH_YEAR:'Month | Year',LINK:'Link',NJR:'NJR',NJA:'NJA',RR:'RR',PUBLICATION_RESULT:'Publication Result',DATASET:'Dataset',CLIENT_DETAILS:'Client Details',METHOD_TYPE:'Method Type',MODEL_NAME:'Model Name',HYPERPARAMETERS:'Hyperparameters',JOURNAL:'Journal',RESULT:'Result',NOVELTY_SCORE:'Novelty Score',NOTES:'Notes',ABSTRACT:'Abstract'};
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text=value=>String(value??'').trim();
  const unique=(rows,key)=>[...new Set(rows.map(row=>text(row[key])).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  const debounce=(fn,wait=250)=>{let timer;return(...args)=>{clearTimeout(timer);timer=setTimeout(()=>fn(...args),wait)}};
  const status=paper=>/review/i.test(text(paper.PUBLICATION_RESULT))?'review':/done|complete/i.test(text(paper.WORK_STAGE))?'done':'pending';
  const safeUrl=value=>{try{const url=new URL(text(value));return ['http:','https:'].includes(url.protocol)?url.href:''}catch{return ''}};
  function csv(rows){return [FIELDS.map(f=>LABELS[f]),...rows.map(row=>FIELDS.map(f=>row[f]??''))].map(row=>row.map(cell=>`"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n')}
  function download(rows,name='paper-clip-export.csv'){const blob=new Blob([csv(rows)],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}
  function highlight(value,query){const safe=esc(value);if(!query)return safe;const q=esc(query).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return safe.replace(new RegExp(`(${q})`,'ig'),'<mark class="bg-yellow-200/70 dark:bg-yellow-500/30">$1</mark>')}
  window.PaperClipUtils={FIELDS,LABELS,esc,text,unique,debounce,status,safeUrl,download,highlight};
})();
