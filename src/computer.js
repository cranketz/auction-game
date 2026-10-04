import {randomInt} from 'node:crypto';
import {computerStatus} from '../public/theme-rules.js';
const model=(modelId,group,name,points,spec,hint)=>({modelId,group,name,points,...spec,hint,basic:!['Ekran kartı','Monitör','Klavye','Soğutma'].includes(group)});
export const COMPUTER=[
 model('cpu-a','İşlemci','Atlas 4',10,{socket:'A',watts:65},'A soket · 65 W'),
 model('cpu-b','İşlemci','Bora 8',18,{socket:'B',watts:110},'B soket · 110 W'),
 model('cpu-a-fast','İşlemci','Atlas 7',16,{socket:'A',watts:95},'A soket · 95 W'),
 model('board-a4','Anakart','Ada Mini',8,{socket:'A',memory:'D4',size:'S'},'A soket · D4 RAM · Küçük boy'),
 model('board-b5','Anakart','Bora Pro',14,{socket:'B',memory:'D5',size:'L'},'B soket · D5 RAM · Büyük boy'),
 model('board-a5','Anakart','Ada Yeni',12,{socket:'A',memory:'D5',size:'S'},'A soket · D5 RAM · Küçük boy'),
 model('ram-4','RAM','Bellek D4 16',8,{memory:'D4'},'D4 sınıfı · 16 GB'),
 model('ram-5','RAM','Bellek D5 32',15,{memory:'D5'},'D5 sınıfı · 32 GB'),
 model('ram-5-lite','RAM','Bellek D5 16',10,{memory:'D5'},'D5 sınıfı · 16 GB'),
 model('disk-1','Depolama','Depo 256',5,{},'Ortak bağlantı · 256 GB'),
 model('disk-2','Depolama','Depo 512',9,{},'Ortak bağlantı · 512 GB'),
 model('disk-3','Depolama','Depo 1000',13,{},'Ortak bağlantı · 1 TB'),
 model('psu-1','Güç kaynağı','Enerji 250',5,{capacity:250},'250 W kapasite'),
 model('psu-2','Güç kaynağı','Enerji 400',9,{capacity:400},'400 W kapasite'),
 model('psu-3','Güç kaynağı','Enerji 650',13,{capacity:650},'650 W kapasite'),
 model('case-1','Kasa','Kutu Mini',5,{size:'S'},'Yalnızca küçük anakart'),
 model('case-2','Kasa','Kutu Geniş',8,{size:'L'},'Küçük ve büyük anakart'),
 model('case-3','Kasa','Kutu Ferah',11,{size:'L'},'Küçük ve büyük anakart'),
 ...[80,160,240].map((watts,i)=>model(`gpu-${i}`,'Ekran kartı',`Görüntü ${i+1}`,7+i*4,{watts},`${watts} W ek güç ister`)),
 ...[65,100,150].map((capacity,i)=>model(`cool-${i}`,'Soğutma',`Serin ${i+1}`,3+i*3,{capacity},`Her soket · ${capacity} W soğutma`)),
 ...[1,2,3].map(i=>model(`monitor-${i}`,'Monitör',`Ekran ${i}`,3+i*3,{},'Çalışan sistemle katkı verir')),
 ...[1,2,3].map(i=>model(`keys-${i}`,'Klavye',`Tuş ${i}`,2+i*2,{},'Çalışan sistemle katkı verir'))
];
export function createComputerKits(count){
 return Array.from({length:count},()=>{
  const platform=randomInt(3);
  return [COMPUTER[platform].modelId,COMPUTER[3+platform].modelId,COMPUTER[6+platform].modelId,COMPUTER[9+randomInt(3)].modelId,COMPUTER[12+randomInt(3)].modelId,COMPUTER[platform===1?16+randomInt(2):15+randomInt(3)].modelId];
 });
}
export function scoreComputer(selected){
 const status=computerStatus(selected);
 const items=selected.map(p=>({name:p.name,points:status.active[p.group]?p.points:0,reason:status.active[p.group]?'Çalışıyor':status.reasons[p.group]}));
 const base=items.reduce((sum,p)=>sum+p.points,0),coreBonus=status.core?15:0,completeness=status.complete?25:0;
 return {points:base+coreBonus+completeness,complete:status.complete,breakdown:{type:'computer',base,coreBonus,completeness,items,messages:status.messages,watts:status.watts}};
}
