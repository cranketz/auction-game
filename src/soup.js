import {soupStructure} from '../public/theme-rules.js';
const ingredient=(modelId,group,name,points,hint)=>({modelId,group,name,points,hint,basic:['Sebze','Protein / bakliyat','Sıvı / taban'].includes(group)});
export const SOUP=[
 ingredient('carrot','Sebze','Havuç',5,'Tatlı ve yumuşak; sıcak baharatlara yakın.'),
 ingredient('tomato','Sebze','Domates',6,'Ekşi ve canlı; ferah otlarla açılır.'),
 ingredient('mushroom','Sebze','Mantar',7,'Topraksı ve yoğun; kremalı dokuyu sever.'),
 ingredient('pumpkin','Sebze','Balkabağı',6,'Tatlı ve dolgun; sütlü tabanla yumuşar.'),
 ingredient('lentil','Protein / bakliyat','Mercimek',7,'Doygun ve koyu; sıcak baharatlara yakın.'),
 ingredient('chickpea','Protein / bakliyat','Nohut',6,'Taneli ve tok; ekşi tabanla dengelenir.'),
 ingredient('chicken','Protein / bakliyat','Tavuk',8,'Hafif ve tuzlu; berrak tabanda açılır.'),
 ingredient('bean','Protein / bakliyat','Fasulye',6,'Yoğun ve taneli; ferah otlarla dengelenir.'),
 ingredient('water','Sıvı / taban','Su',3,'Nötr; malzemenin kendi tadını öne çıkarır.'),
 ingredient('broth','Sıvı / taban','Sebze suyu',6,'Tuzlu ve aromatik; hafif ana malzemelerle iyi gider.'),
 ingredient('milk','Sıvı / taban','Süt',5,'Yumuşak ve sütlü; çok ekşi tatlarla zor birleşir.'),
 ingredient('yogurt','Sıvı / taban','Yoğurt',5,'Ekşi ve ferah; taneli malzemeleri dengeler.'),
 ingredient('butter','Yağ','Tereyağı',5,'Dolgun; topraksı tatları taşır.'),
 ingredient('olive','Yağ','Zeytinyağı',4,'Hafif; ekşi sebzelere yakın.'),
 ingredient('sesame','Yağ','Susam yağı',5,'Keskin; sütlü tabanlarda baskın kalabilir.'),
 ingredient('cumin','Baharat','Kimyon',4,'Sıcak ve yoğun; bakliyatları tamamlar.'),
 ingredient('mint','Baharat','Nane',4,'Serin; ekşi tabanları ferahlatır.'),
 ingredient('pepper','Baharat','Karabiber',4,'Keskin; topraksı tatlara derinlik verir.'),
 ingredient('cream','Kıvam','Krema',5,'Kadifemsi; tatlı sebzeleri yumuşatır.'),
 ingredient('flour','Kıvam','Un',3,'Nötr koyuluk; berrak tabanı yoğunlaştırır.'),
 ingredient('rice','Kıvam','Pirinç',4,'Taneli; ekşi tabanla dengelenir.'),
 ingredient('lemon','Garnitür','Limon',3,'Ekşi; sütlü dokuyu bozabilir.'),
 ingredient('parsley','Garnitür','Maydanoz',3,'Ferah; yoğun bakliyatları hafifletir.'),
 ingredient('crouton','Garnitür','Kıtır ekmek',4,'Gevrek; yumuşak dokulara karşıtlık katar.')
];
// Only this server module contains the hidden relationships. No recipe is chosen.
const pairs=[
 ['carrot','cumin',6],['lentil','cumin',8],['tomato','mint',6],['mushroom','cream',8],['mushroom','butter',6],['pumpkin','milk',8],['chickpea','yogurt',7],['chicken','broth',8],['bean','parsley',6],['tomato','olive',6],['yogurt','mint',8],['yogurt','rice',6],['broth','flour',4],['cream','crouton',5],['tomato','milk',-6],['milk','lemon',-6],['yogurt','sesame',-5],['pumpkin','lemon',-4],['mushroom','mint',-4]
];
const triples=[['lentil','carrot','cumin',12],['mushroom','butter','cream',10],['yogurt','rice','mint',12],['tomato','milk','lemon',-8],['pumpkin','milk','cream',10],['chicken','broth','parsley',8]];
export function scoreSoup(selected){
 const unique=[...new Map(selected.map(p=>[p.modelId,p])).values()].sort((a,b)=>a.modelId.localeCompare(b.modelId)),ids=new Set(unique.map(p=>p.modelId));
 const valid=soupStructure(unique),items=unique.map(p=>({name:p.name,points:p.points}));
 const label=id=>SOUP.find(p=>p.modelId===id)?.name??id;
 const usedPairs=pairs.filter(([a,b])=>ids.has(a)&&ids.has(b)).map(([a,b,points])=>({name:`${label(a)} + ${label(b)}`,points}));
 const usedTriples=triples.filter(([a,b,c])=>ids.has(a)&&ids.has(b)&&ids.has(c)).map(([a,b,c,points])=>({name:`${label(a)} + ${label(b)} + ${label(c)}`,points}));
 const base=items.reduce((s,p)=>s+p.points,0),pairPoints=usedPairs.reduce((s,p)=>s+p.points,0),triplePoints=usedTriples.reduce((s,p)=>s+p.points,0),structure=valid?10:0,raw=base+pairPoints+triplePoints+structure;
 return {points:valid?Math.max(0,raw):0,complete:valid,breakdown:{type:'soup',base,completeness:structure,items,pairs:usedPairs,triples:usedTriples,pairPoints,triplePoints,raw,valid,duplicates:selected.length-unique.length}};
}
