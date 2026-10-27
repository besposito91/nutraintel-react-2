import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, ScreenWeight, ScreenScale, ScreenTrend, ScreenRecord, ScreenAlerts, Laptop } from './Phone.jsx';

const steps = [
  { t: 'Monitoraggio del paziente a distanza', h: "Segui i tuoi pazienti, anche tra una visita e l'altra.", p: 'Monitora misurazioni corporee, idratazione e passi giornalieri, per avere una visione aggiornata del percorso nutrizionale dei tuoi pazienti, anche a distanza.', S: ScreenWeight },
  { t: 'Integrazione con bilancia smart', h: 'Le misurazioni, direttamente nel tuo ecosistema digitale.', p: 'La bilancia smart connessa rende disponibili le misurazioni corporee in NutraIntel, semplificando la raccolta dei dati e il monitoraggio nel tempo.', S: ScreenScale },
  { t: 'App mobile per il paziente', h: 'Rendi il paziente protagonista del suo percorso.', p: "Attraverso l'app NutraIntel, il paziente consulta i propri dati, monitora le proprie abitudini e partecipa attivamente al percorso nutrizionale.", S: ScreenTrend },
  { t: 'Scheda paziente digitale', h: 'Tutte le informazioni del paziente, in un unico posto.', p: "Consulta le informazioni del paziente e lo storico delle misurazioni in una scheda digitale organizzata, per seguire facilmente l'evoluzione del percorso.", S: ScreenRecord },
  { t: 'Avvisi su misurazioni e analisi cliniche mancanti', h: 'Non perdere di vista ciò che manca.', p: "Ricevi avvisi sull'assenza prolungata di misurazioni e sulle analisi cliniche mancanti, quando necessarie, per mantenere sotto controllo la continuità del percorso.", S: ScreenAlerts },
  { t: 'Gestione dei pazienti dal portale', h: 'Organizza e gestisci i tuoi pazienti con semplicità.', p: 'Gestisci i tuoi pazienti e accedi rapidamente alle loro informazioni attraverso un unico portale professionale, progettato per semplificare le attività quotidiane.', laptop: true },
];

const words = ['Il', 'percorso,', 'sempre', 'connesso.'];

export default function Workflow() {
  const hRef = useRef(null), sRef = useRef(null);
  const [step, setStep] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Testo gigante orizzontale con parole che si accendono
      const line = hRef.current.querySelector('.wf-line');
      const getX = () => -(line.scrollWidth - innerWidth * 0.55);
      gsap.fromTo(line, { x: () => innerWidth * 0.9 }, {
        x: getX, ease: 'none', invalidateOnRefresh: true,
        scrollTrigger: { trigger: hRef.current, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });
      // Griglia che si disegna
      gsap.fromTo('.wf-gl', { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', ease: 'none', stagger: 0.1, scrollTrigger: { trigger: sRef.current, start: 'top 90%', end: 'top 10%', scrub: true } });
      gsap.fromTo('.wf-gh', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left', ease: 'none', scrollTrigger: { trigger: sRef.current, start: 'top 60%', end: 'top 0%', scrub: true } });
      // Step attivo
      ScrollTrigger.create({
        trigger: sRef.current, start: 'top top', end: 'bottom bottom',
        onUpdate: (st) => setStep(Math.min(steps.length - 1, Math.floor(st.progress * steps.length * 0.999))),
      });
    });
    // opacità parole calcolata sulla posizione reale (il testo si muove in orizzontale)
    const words = hRef.current.querySelectorAll('.wf-word');
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const r = hRef.current.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      words.forEach((w) => {
        const b = w.getBoundingClientRect();
        const c = (b.left + b.width * 0.3) / innerWidth;
        w.style.opacity = String(Math.max(0.16, Math.min(1, (0.95 - c) / 0.4)));
      });
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ctx.revert(); };
  }, []);

  return (
    <div className="wf" id="funzioni" data-section="3">
      <section className="wf-h" ref={hRef} aria-label="Il percorso, sempre connesso">
        <div className="wf-h-sticky">
          <h2 className="wf-line">{words.map((w) => <span key={w} className="wf-word">{w} </span>)}</h2>
        </div>
      </section>

      <section className="wf-s" ref={sRef} aria-labelledby="wf-title" style={{ '--n': steps.length }}>
        <h2 id="wf-title" className="sr-only">Funzionalità NutraIntel</h2>
        <div className="wf-sticky">
          <i className="wf-gl" style={{ left: 'var(--c1)' }} /><i className="wf-gl" style={{ left: 'var(--c2)' }} /><i className="wf-gl" style={{ left: 'var(--c3)' }} />
          <i className="wf-gh" />
          <div className="wf-left">
            <div className="wf-num" aria-hidden="true">
              <div className="wf-num-track" style={{ transform: `translateY(${-step * 100}%)` }}>
                {steps.map((s, i) => <span key={i}>{i + 1}</span>)}
              </div>
            </div>
            <span className="wf-star" aria-hidden="true">✧</span>
            <div className="wf-copy">
              {steps.map((s, i) => (
                <article key={i} className={`wf-item ${i === step ? 'on' : ''}`} aria-hidden={i !== step}>
                  <small>{String(i + 1).padStart(2, '0')} / {s.t}</small>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="wf-right">
            <div className="wf-brand"><small>PARTE DI</small><b>Nutra<span>Intel</span></b></div>
            <div className="wf-device">
              <div className={`wf-phone ${steps[step].laptop ? 'out' : ''}`}>
                <Phone>
                  {steps.map((s, i) => s.S && (
                    <div key={i} className={`wf-scr ${i === step ? 'on' : i < step ? 'prev' : ''}`}><s.S /></div>
                  ))}
                </Phone>
              </div>
              <div className={`wf-lap ${steps[step].laptop ? 'on' : ''}`}><Laptop /></div>
            </div>
            <div className="wf-progress" aria-hidden="true">{steps.map((s, i) => <i key={i} className={i <= step ? 'on' : ''} />)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
