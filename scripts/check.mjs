import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'../dist');
const contacts=JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname,'../content/contacts.json'),'utf8'));
const team=[contacts.primary,...contacts.additional.filter(c=>c.enabled)];
for(const c of team){assert(c.name?.trim(),'Contacto sin nombre');assert.match(c.phone,/^\+51\d{9}$/,`Teléfono no válido: ${c.phone}`);}
assert(contacts.whatsappMessage?.trim(),'Mensaje de WhatsApp ausente');
const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(p.endsWith('.html'))files.push(p)}}
walk(root);
const titles=new Set();
let refs=0;
for(const file of files){
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: H1 único`);
 const title=html.match(/<title>(.*?)<\/title>/)[1];
 assert(!titles.has(title),'Title duplicado');titles.add(title);
 assert(html.includes('name="description"'),'Description ausente');
 assert(html.includes('rel="canonical"'),'Canonical ausente');
 assert(html.includes('property="og:image"'),'Open Graph ausente');
 for(const match of html.matchAll(/type="application\/ld\+json">(.*?)<\/script>/g)){const data=JSON.parse(match[1]);if(data.telephone)assert.equal(data.telephone,contacts.primary.phone,`${file}: teléfono JSON-LD`);}
 for(const c of team)assert((html.match(new RegExp(`href="tel:\\${c.phone}"`,'g'))||[]).length>=(html.includes('id="contacto"')?2:1),`${file}: falta ${c.name} en contacto o footer`);
 assert(html.includes('class="wa-float"'),`${file}: WhatsApp principal ausente`);
 for(const match of html.matchAll(/(?:src|href)="(\/[^"#]*)/g)){
  let ref=decodeURIComponent(match[1].split('#')[0]);let target=path.join(root,ref);
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert(fs.existsSync(target),`${file}: referencia no encontrada ${ref}`);refs++;
 }
 for(const match of html.matchAll(/<img\b[^>]*>/g)){assert(/alt="[^"]+"/.test(match[0]),'Alt ausente');assert(/width="\d+"/.test(match[0])&&/height="\d+"/.test(match[0]),'Dimensiones ausentes');}
 for(const match of html.matchAll(/href="(https:\/\/wa.me\/[^\"]+)"/g)){
  const u=new URL(match[1]);assert.equal(u.pathname,'/'+contacts.primary.phone.slice(1));assert.equal(u.searchParams.get('text'),contacts.whatsappMessage);
 }
 for(const match of html.matchAll(/srcset="([^"]+)"/g))for(const item of match[1].split(', ')){assert(fs.existsSync(path.join(root,item.split(' ')[0])),'Srcset no encontrado');}
}
assert.equal(files.length,11,'Diez páginas y 404');
assert.equal((fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').match(/<loc>/g)||[]).length,10);
console.log(`OK: ${files.length} documentos HTML, ${refs} enlaces/recursos locales, H1, titles únicos, metadatos, JSON-LD, alt, srcset, WhatsApp, ${team.length} contactos y sitemap.`);

