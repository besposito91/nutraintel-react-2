import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Phone, ScreenWeight, ScreenScale, ScreenPatients } from './Phone.jsx';

const heads = ['Monitoraggio a distanza', 'Ecosistema connesso', 'Gestione professionale'];

export default function SeeDeeper() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom bottom', scrub: 1 } });
      gsap.set('.sd-head', { opacity: 0, filter: 'blur(16px)' });
      gsap.set('.sd-head-0', { opacity: 1, filter: 'blur(0px)' });
      gsap.set('.sd-scr', { opacity: 0 }); gsap.set('.sd-scr-0', { opacity: 1 });
      tl.fromTo('.sd-white', { opacity: 1 }, { opacity: 0, duration: 0.1 }, 0.08)
        .fromTo('.sd-phone', { yPercent: 95 }, { yPercent: 0, duration: 0.14, ease: 'power2.out' }, 0.06)
        .fromTo('.sd-fan', { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.16, ease: 'power2.out' }, 0.08)
        // step 2
        .to('.sd-head-0', { opacity: 0, filter: 'blur(16px)', duration: 0.05 }, 0.27)
        .to('.sd-head-1', { opacity: 1, filter: 'blur(0px)', duration: 0.05 }, 0.31)
        .to('.sd-scr-1', { opacity: 1, duration: 0.05 }, 0.29)
        .to('.sd-fan', { opacity: 0, scale: 1.25, duration: 0.08 }, 0.28)
        .fromTo('.sd-circle', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.12, ease: 'power2.out' }, 0.29)
        // step 3
        .to('.sd-head-1', { opacity: 0, filter: 'blur(16px)', duration: 0.05 }, 0.5)
        .to('.sd-head-2', { opacity: 1, filter: 'blur(0px)', duration: 0.05 }, 0.54)
        .to('.sd-scr-2', { opacity: 1, duration: 0.05 }, 0.52)
        .to('.sd-circle', { scale: 1.6, opacity: 0, duration: 0.12 }, 0.5)
        // stats
        .to('.sd-head-2', { opacity: 0, filter: 'blur(16px)', yPercent: -40, duration: 0.06 }, 0.7)
        .to('.sd-phone', { yPercent: -12, scale: 0.86, duration: 0.12 }, 0.7)
        .fromTo('.sd-stat-l', { opacity: 0, x: -60, filter: 'blur(10px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.08 }, 0.74)
        .fromTo('.sd-stat-r', { opacity: 0, x: 60, filter: 'blur(10px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.08 }, 0.78)
        .fromTo('.sd-stat-b', { opacity: 0, y: 60, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.08 }, 0.82)
        .to({}, { duration: 0.08 }, 0.92);
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sd" id="monitoraggio" ref={ref} aria-label="Monitoraggio del paziente a distanza" data-section="1">
      <div className="sd-sticky">
        <div className="mesh mesh-soft" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="grain" aria-hidden="true" />
        <div className="sd-white" aria-hidden="true" />
        <svg className="sd-fan" viewBox="0 0 1000 700" aria-hidden="true" preserveAspectRatio="xMidYMax meet">
          <defs><linearGradient id="fanG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".05" /><stop offset="1" stopColor="#ffffff" stopOpacity=".85" /></linearGradient></defs>
          <path d="M500 0 L1000 700 L0 700 Z" fill="url(#fanG)" />
        </svg>
        <div className="sd-circle" aria-hidden="true" />
        <div className="sd-heads">
          {heads.map((h, i) => <h2 key={h} className={`sd-head sd-head-${i}`}>{h}</h2>)}
        </div>
        <div className="sd-phone">
          <Phone>
            <div className="sd-scr sd-scr-0"><ScreenWeight /></div>
            <div className="sd-scr sd-scr-1"><ScreenScale /></div>
            <div className="sd-scr sd-scr-2"><ScreenPatients /></div>
          </Phone>
        </div>
        <div className="sd-stat sd-stat-l">
          <svg viewBox="0 0 60 24" aria-hidden="true"><path d="M2 20 Q30 -6 58 20" /><path d="M10 20 Q30 2 50 20" /></svg>
          <strong>72,4<span>kg</span></strong><p>Misurazioni corporee sempre aggiornate.</p>
        </div>
        <div className="sd-stat sd-stat-r">
          <svg viewBox="0 0 60 24" aria-hidden="true"><path d="M4 20V10M16 20V4M28 20V12M40 20V6M52 20V14" /></svg>
          <strong>6.842</strong><p>Passi giornalieri, anche a distanza.</p>
        </div>
        <div className="sd-stat sd-stat-b">
          <svg viewBox="0 0 60 24" aria-hidden="true"><path d="M30 2 C40 12 44 16 44 20 a14 14 0 0 1 -28 0 C16 16 20 12 30 2Z" /></svg>
          <strong>52%</strong><p>Idratazione, per una visione aggiornata del percorso nutrizionale.</p>
        </div>
      </div>
    </section>
  );
}
