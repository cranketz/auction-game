export function pollingDelay({phase,inRoom,hidden=false,failures=0}){
 if(failures)return Math.min(30000,1000*2**Math.min(failures,5));
 if(hidden)return 10000;
 if(!inRoom)return 15000;
 if(phase==='results')return 10000;
 if(phase==='build')return 1500;
 return phase?750:2500;
}
