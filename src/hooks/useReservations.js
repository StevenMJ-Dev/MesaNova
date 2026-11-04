import {useEffect,useRef,useState} from 'react';
import {createReservation,cancelReservation} from '../lib/reservations';
import {readReservations,mutateReservations} from '../lib/storage';
const CHANNEL='mesanova-updates';
export default function useReservations(){
 const [records,setRecords]=useState([]),[error,setError]=useState(''),[now,setNow]=useState(()=>new Date());const channel=useRef(null);
 // Suscripción a cambios entre pestañas y reloj; ambos se limpian al desmontar.
 useEffect(()=>{
  let active=true;const sync=async()=>{try{const data=await readReservations();if(active){setRecords(data);setError('');}}catch{if(active)setError('No se pudieron leer las reservas guardadas. No se sobrescribirán.');}};
  sync();if('BroadcastChannel' in window){channel.current=new BroadcastChannel(CHANNEL);channel.current.onmessage=sync;}
  const onStorage=e=>{if(e.key===CHANNEL)sync();};window.addEventListener('storage',onStorage);window.addEventListener('focus',sync);
  const timer=setInterval(()=>{setNow(new Date());sync();},30000);
  return()=>{active=false;channel.current?.close();channel.current=null;clearInterval(timer);window.removeEventListener('storage',onStorage);window.removeEventListener('focus',sync);};
 },[]);
 async function change(operation){
  try{const result=await mutateReservations(operation);setRecords(result.records);if(result.ok){setError('');channel.current?.postMessage('updated');try{localStorage.setItem(CHANNEL,String(Date.now())+Math.random());}catch{/* La reserva ya está confirmada en IndexedDB. */}}return result;}
  catch(e){if(import.meta.env.DEV)console.error('Reserva no guardada:',e.message);return {ok:false,message:'No se pudo guardar. Revisa el almacenamiento del navegador; no se confirmó ningún cambio.'};}
 }
 return {records,error,now,save:(details,ignoreId)=>change(records=>createReservation(records,details,{ignoreId})),cancel:id=>change(records=>cancelReservation(records,id))};
}
