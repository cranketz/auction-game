import {BREAKFAST} from './breakfast.js';
import {COMPUTER} from './computer.js';
import {SOUP} from './soup.js';

// Explicit allowlist keeps scoring and hidden relationships on the server.
export function catalog(){
 return Object.entries({kahvalti:BREAKFAST,bilgisayar:COMPUTER,corba:SOUP}).flatMap(([theme,products])=>products.map(({modelId,group,name,hint,basic})=>({theme,modelId,group,name,hint,basic})));
}
