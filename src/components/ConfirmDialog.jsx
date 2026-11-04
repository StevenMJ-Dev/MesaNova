import {useEffect,useRef,useState} from 'react';
export default function ConfirmDialog({reservation,onClose,onConfirm}){
 const ref=useRef(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{const el=ref.current;el.showModal();const handle=e=>{e.preventDefault();onClose();};el.addEventListener('cancel',handle);return()=>el.removeEventListener('cancel',handle);},[onClose]);
 return <dialog ref={ref} className="dialog" aria-labelledby="cancel-title"><span className="eyebrow">REVISAR CANCELACIÓN</span><h2 id="cancel-title">¿Cancelar esta reserva?</h2><p>La mesa de {reservation.name} para las {reservation.time} quedará disponible. Esta acción no se puede deshacer.</p>{error&&<p className="alert error" role="alert">{error}</p>}<div className="actions"><button className="secondary" disabled={busy} autoFocus onClick={onClose}>Conservar reserva</button><button className="danger-button" disabled={busy} onClick={async()=>{setBusy(true);const r=await onConfirm(reservation.id);setBusy(false);if(r.ok)onClose();else setError(r.message);}}>{busy?'Cancelando…':'Sí, cancelar'}</button></div></dialog>;
}
