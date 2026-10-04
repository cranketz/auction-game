export const buildLimit=theme=>({kahvalti:8,corba:6,bilgisayar:10}[theme]??8);
export function nextSelection(theme,inventory,selection,id){
 if(selection.includes(id))return selection.filter(value=>value!==id);
 const product=inventory.find(value=>value.id===id);
 if(!product)throw Error('Bu ürün envanterinde yok.');
 const next=theme==='bilgisayar'?selection.filter(value=>inventory.find(p=>p.id===value)?.group!==product.group):selection;
 if(next.length>=buildLimit(theme))throw Error(`En fazla ${buildLimit(theme)} ürün seçebilirsin. Önce bir ürünü çıkar.`);
 return [...next,id];
}
export function validAmount(value,balance,minimum=0){
 return String(value).trim()!==''&&Number.isSafeInteger(Number(value))&&Number(value)>=minimum&&Number(value)<=balance;
}
export function bidChanged(bid,amount,preference){
 return !!bid&&(String(amount).trim()===''||Number(amount)!==bid.amount||preference.length!==bid.preference.length||preference.some((id,i)=>id!==bid.preference[i]));
}
export function resultRank(results,result){return results.filter(r=>r.points>result.points||(r.points===result.points&&r.remaining>result.remaining)).length+1;}
