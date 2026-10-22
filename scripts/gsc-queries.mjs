// Search Console organic queries for CONPLANOS; read-only and report-only.
import {writeFile} from 'node:fs/promises';
const token=process.env.GOOGLE_ACCESS_TOKEN;
if(!token) throw Error('Missing access token');
const day=d=>d.toISOString().slice(0,10);
const end=new Date();end.setUTCDate(end.getUTCDate()-3);
const start=new Date(end);start.setUTCDate(start.getUTCDate()-27);
const endpoint='https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent('sc-domain:conplanos.com')+'/searchAnalytics/query';
const res=await fetch(endpoint,{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},
  body:JSON.stringify({startDate:day(start),endDate:day(end),dimensions:['query'],rowLimit:2500})});
if(!res.ok) throw Error('Search Analytics HTTP '+res.status);
const data=await res.json();
const relevant=/(cusco|cuzco|topograf|geod[eé]s|gnss|titulaci[oó]n|saneamiento|f[aá]brica|perim[eé]tric|lotizaci[oó]n|independizaci[oó]n|habilitaci[oó]n|licencia|obra|construcci[oó]n|planos|parcelaci[oó]n)/i;
const rows=(data.rows||[]).map(r=>({query:r.keys?.[0]||'',clicks:r.clicks,impressions:r.impressions,ctr:r.ctr,position:r.position}));
const report={startDate:day(start),endDate:day(end),queryRowsReturned:rows.length,
  relevantQueries:rows.filter(r=>relevant.test(r.query)).slice(0,100),topQueries:rows.slice(0,30),
  note:'Search Analytics is sampled/limited to returned queries; position is average and not guaranteed ranking.'};
await writeFile('seo-search-queries.json',JSON.stringify(report,null,2)+'\n');
console.log('Search Analytics: '+rows.length+' queries; relevant: '+report.relevantQueries.length);
