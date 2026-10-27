import { useEffect, useRef, useState } from 'react';
import { NUTRAINTEL_CONFIG } from '../config.js';
import BlurText from './BlurText.jsx';

const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const store = {
  get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* bloccato */ } },
};

export default function Prelaunch() {
  const formRef = useRef(null);
  const [utm, setUtm] = useState({});
  const [status, setStatus] = useState({ text: '', tone: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search); const next = {};
    UTM.forEach((k) => { const v = params.get(k); if (v) store.set('ni_' + k, v); next[k] = v || store.get('ni_' + k) || ''; });
    setUtm(next);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form.reportValidity()) return;
    const endpoint = (NUTRAINTEL_CONFIG.formEndpoint || '').trim();
    if (!endpoint) { setStatus({ text: 'Modulo pronto: collega prima un endpoint CRM/form reale per attivare l’invio.', tone: 'warn' }); return; }
    setStatus({ text: 'Invio in corso…', tone: '' });
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
      if (!res.ok) throw new Error();
      setStatus({ text: 'Grazie. La tua richiesta è stata registrata.', tone: 'ok' }); form.reset();
    } catch { setStatus({ text: 'Invio non riuscito. Riprova o contattaci direttamente.', tone: 'err' }); }
  };

  return (
    <section className="pre" id="prelancio" aria-labelledby="pre-title" data-section="5">
      <div className="pre-head">
        <BlurText as="h2" id="pre-title" data-blur className="t-display" text="NutraIntel sta arrivando." />
        <p data-fade>Lascia i tuoi contatti per ricevere informazioni sul lancio e sulle novità di NutraIntel.</p>
      </div>
      <div className="pre-grid">
        <div className="pcard pcard-info" data-fade>
          <h3>Pre-lancio 2026</h3>
          <p>NutraIntel collega portale professionale, app per il paziente e bilancia connessa in un unico ecosistema digitale.</p>
          <ul>
            <li>Monitoraggio a distanza</li><li>Integrazione con bilancia smart</li><li>App mobile per il paziente</li>
            <li>Scheda paziente digitale</li><li>Avvisi su misurazioni mancanti</li><li>Gestione dal portale</li>
          </ul>
          <div className="pcard-foot"><i /><span>Manifestazione di interesse</span></div>
        </div>
        <form className="pcard pform" noValidate ref={formRef} onSubmit={onSubmit} data-fade>
          <h3>Resta aggiornato</h3>
          <label><span>Nome e cognome *</span><input type="text" name="name" autoComplete="name" required /></label>
          <label><span>Email *</span><input type="email" name="email" autoComplete="email" required /></label>
          <label><span>Telefono *</span><input type="tel" name="phone" autoComplete="tel" required /></label>
          <label><span>Professione / struttura</span><input type="text" name="profession" autoComplete="organization-title" /></label>
          {UTM.map((k) => <input key={k} type="hidden" name={k} value={utm[k] || ''} readOnly />)}
          <label className="chk"><input type="checkbox" name="privacy" required /><span>Ho letto l'informativa privacy e acconsento al trattamento dei dati per la gestione della mia richiesta. *</span></label>
          <label className="chk"><input type="checkbox" name="marketing" /><span>Acconsento a ricevere comunicazioni di aggiornamento e marketing relative a NutraIntel.</span></label>
          <button className="btn btn-dark wide" type="submit">Resta aggiornato sul lancio</button>
          <p className={`pform-status ${status.tone}`} role="status" aria-live="polite">{status.text}</p>
          <p className="pform-note">Inserire qui il link all'informativa privacy definitiva prima della pubblicazione.</p>
        </form>
      </div>
      <div className="pre-banner" data-fade>
        <div><span className="pb-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6" /></svg></span><h4>Manifestazione di interesse</h4><p>Lascia i tuoi contatti per ricevere informazioni sul lancio.</p><a href="#prelancio" className="mini-link">Compila il modulo <span>→</span></a></div>
        <div><span className="pb-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" transform="rotate(45 12 12)" /></svg></span><h4>Nessun acquisto richiesto</h4><p>Ricevi solo informazioni sul lancio e sulle novità di NutraIntel.</p><a href="#video" className="mini-link">Guarda il video <span>→</span></a></div>
      </div>
    </section>
  );
}
