// IndexedDB serializa las transacciones de escritura del mismo almacén,
// incluso cuando dos pestañas intentan reservar la última mesa a la vez.
import {validStoredRecord} from './reservations';
const DB_NAME='mesanova-demo-v1', STORE='booking-data';
let opening;
function openDatabase(){
 if(!opening)opening=new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB_NAME,1);
  req.onupgradeneeded=()=>req.result.createObjectStore(STORE);
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>{opening=null;reject(req.error);};
  req.onblocked=()=>{opening=null;reject(new Error('Cierra otras versiones de esta demo.'));};
 });
 return opening;
}
function check(value){const data=value??[];if(!Array.isArray(data)||!data.every(validStoredRecord))throw new Error('Los datos guardados no tienen un formato válido.');return data;}
export async function readReservations(){const db=await openDatabase();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly');const req=tx.objectStore(STORE).get('all');req.onsuccess=()=>{try{resolve(check(req.result));}catch(e){reject(e);}};req.onerror=()=>reject(req.error);});}
export async function mutateReservations(operation){
 const db=await openDatabase();return new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE);let result;
  const req=store.get('all');req.onsuccess=()=>{try{const latest=check(req.result);result=operation(latest);if(result.ok)store.put(result.records,'all');else result.records=latest;}catch(e){tx.abort();reject(e);}};
  tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('No se guardó la operación.'));
 });
}
