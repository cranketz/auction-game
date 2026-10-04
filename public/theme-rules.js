export function computerStatus(selected){
  const part=group=>selected.find(p=>p.group===group);
  const cpu=part('İşlemci'),board=part('Anakart'),ram=part('RAM'),box=part('Kasa'),psu=part('Güç kaynağı'),gpu=part('Ekran kartı'),cooler=part('Soğutma');
  const messages=[];
  const fits=!!board&&!!box&&(box.size==='L'||board.size==='S');
  const socket=!!cpu&&!!board&&cpu.socket===board.socket;
  const memory=!!ram&&!!board&&ram.memory===board.memory;
  const watts=50+(cpu?.watts??0)+(gpu?.watts??0);
  const power=!!psu&&psu.capacity>=watts;
  if(cpu&&board&&!socket)messages.push('İşlemci ve anakart soketleri uyuşmuyor.');
  if(ram&&board&&!memory)messages.push('RAM sınıfı anakarta uymuyor.');
  if(board&&box&&!fits)messages.push('Büyük anakart küçük kasaya sığmıyor.');
  if(psu&&!power)messages.push(`Güç yetersiz: ${watts} W gerekli, ${psu.capacity} W mevcut.`);
  const core=fits&&socket&&memory&&power;
  const cooling=!!cooler&&!!cpu&&cooler.capacity>=cpu.watts;
  if(cooler&&cpu&&!cooling)messages.push('Soğutucu işlemcinin güç ihtiyacını karşılamıyor.');
  const active={'İşlemci':core,'Anakart':fits,'RAM':fits&&memory,'Depolama':fits,'Güç kaynağı':!!psu,'Kasa':!!box,'Ekran kartı':core,'Monitör':core,'Klavye':core,'Soğutma':core&&cooling};
  const complete=['İşlemci','Anakart','RAM','Depolama','Güç kaynağı','Kasa'].every(g=>part(g)&&active[g]);
  const reasons={
    'İşlemci':!socket?'İşlemci/anakart soketi eksik veya uyumsuz':!memory?'Anakart/RAM eksik veya uyumsuz':!fits?'Anakart/kasa eksik veya uyumsuz':'Güç yetersiz',
    'Anakart':'Kasa eksik veya anakart kasaya sığmıyor',
    'RAM':!fits?'Anakart/kasa eksik veya uyumsuz':'Bellek sınıfı uyumsuz veya anakart eksik',
    'Depolama':'Kasaya uygun anakart eksik',
    'Ekran kartı':'Çalışan çekirdek veya yeterli güç yok',
    'Monitör':'Çalışan çekirdek yok','Klavye':'Çalışan çekirdek yok',
    'Soğutma':!core?'Çalışan çekirdek yok':'Soğutma kapasitesi yetersiz'
  };
  return {active,core,complete,watts,power,messages,reasons};
}
export function soupStructure(selected){return selected.some(p=>p.group==='Sıvı / taban')&&selected.some(p=>['Sebze','Protein / bakliyat'].includes(p.group));}
