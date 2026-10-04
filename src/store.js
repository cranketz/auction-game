import {neon} from '@neondatabase/serverless';
export const emptyData=()=>({sessions:{},rooms:{},rates:{}});
export class MemoryStore {
  data=emptyData();version=0;
  async read(){return {data:structuredClone(this.data),version:this.version};}
  async compareAndSet(version,data){if(version!==this.version)return false;this.data=structuredClone(data);this.version++;return true;}
}
export class PostgresStore {
  constructor(url){this.sql=neon(url);}
  async initialize(){
    await this.sql`CREATE TABLE IF NOT EXISTS auction_state (id integer PRIMARY KEY CHECK(id=1), version integer NOT NULL DEFAULT 0, data jsonb NOT NULL)`;
    await this.sql`INSERT INTO auction_state (id,data) VALUES (1,${JSON.stringify(emptyData())}::jsonb) ON CONFLICT (id) DO NOTHING`;
  }
  async read(){
    let rows;
    try{rows=await this.sql`SELECT version,data FROM auction_state WHERE id=1`;}
    catch(e){if(e.code!=='42P01')throw e;await this.initialize();rows=await this.sql`SELECT version,data FROM auction_state WHERE id=1`;}
    if(!rows.length){await this.initialize();return this.read();}return rows[0];
  }
  async compareAndSet(version,data){
    const rows=await this.sql`UPDATE auction_state SET data=${JSON.stringify(data)}::jsonb,version=version+1 WHERE id=1 AND version=${version} RETURNING version`;
    return rows.length===1;
  }
}
let store;
export function getStore(){
  if(!store){if(process.env.VERCEL&&!process.env.DATABASE_URL)throw Error('DATABASE_URL yapılandırılmadı.');store=process.env.DATABASE_URL?new PostgresStore(process.env.DATABASE_URL):new MemoryStore();}return store;
}
// Compare-and-set prevents simultaneous requests on separate servers losing bids.
export async function transact(store,operation){
  for(let i=0;i<12;i++){const {data,version}=await store.read();const result=operation(data);if(!result.changed||await store.compareAndSet(version,data))return result;}
  throw Error('Oda yoğun. Lütfen tekrar deneyin.');
}
