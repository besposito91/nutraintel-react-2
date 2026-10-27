import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { createScaleScene } from '../lib/scaleScene.js';
import BlurText from './BlurText.jsx';

export default function Hero() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const canvas = root.querySelector('.hero-canvas');
    const state = { s: 0.42, rx: 1.42, ry: 0.0, rz: 0.0, x: 0, y: 0.15 };
    let scene = null;
    try { scene = createScaleScene(canvas, state); } catch (e) { console.warn('WebGL non disponibile', e); root.classList.add('no-gl'); }

    const ctx = gsap.context(() => {
      // Intro temporale: sfondo che appare, prodotto che passa da sfocato a nitido
      gsap.timeline({ delay: 0.15 })
        .fromTo('.hero-bg', { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0)
        .fromTo('.hero-canvas', { filter: 'blur(26px)', opacity: 0 }, { filter: 'blur(0px)', opacity: 1, duration: 1.8, ease: 'power3.out' }, 0.1)
        .fromTo('.hero-hint', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 1.2);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root, start: 'top top', end: 'bottom bottom', scrub: 1,
          onUpdate: (st) => scene?.setVisible(st.progress < 0.995),
          onLeave: () => scene?.setVisible(false), onEnterBack: () => scene?.setVisible(true),
        },
      });
      // 0 → 0.30 : il prodotto cresce e ruota, il wordmark appare
      tl.to(state, { s: 0.62, rx: 0.32, ry: -0.62, rz: 0.12, y: 0, duration: 0.3, ease: 'power1.inOut' }, 0)
        .to('.hero-hint', { opacity: 0, duration: 0.05 }, 0.02)
        .fromTo('.wm-r', { opacity: 0, filter: 'blur(24px)', xPercent: 18 }, { opacity: 1, filter: 'blur(0px)', xPercent: 0, duration: 0.12 }, 0.08)
        .fromTo('.wm-l', { opacity: 0, filter: 'blur(24px)', xPercent: -18 }, { opacity: 1, filter: 'blur(0px)', xPercent: 0, duration: 0.12 }, 0.16)
        .fromTo('.hero-tag', { opacity: 0, filter: 'blur(14px)', y: 30 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.1 }, 0.24)
        // 0.30 → 0.44 : pausa con leggera rotazione
        .to(state, { ry: -0.38, rz: 0.06, duration: 0.14 }, 0.3)
        // 0.44 → 0.62 : wordmark sale e si dissolve
        .to('.hero-wm', { yPercent: -150, scale: 0.72, duration: 0.18, ease: 'power1.in' }, 0.44)
        .to('.hero-wm', { opacity: 0, filter: 'blur(18px)', duration: 0.08 }, 0.54)
        .to('.hero-tag', { opacity: 0, filter: 'blur(14px)', y: -30, duration: 0.08 }, 0.44)
        // 0.46 → 0.76 : zoom sul display della bilancia
        .to(state, { s: 1.25, rx: 1.12, ry: 0, rz: 0, y: -1.95, duration: 0.3, ease: 'power2.inOut' }, 0.46)
        // 0.60 → 0.80 : messaggio principale
        .fromTo('.hero-story .bw', { opacity: 0, filter: 'blur(14px)', y: 18 }, { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.008, duration: 0.07 }, 0.6)
        .fromTo('.hero-story-side', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.08 }, 0.72)
        .to({}, { duration: 0.2 }, 0.8);
    }, root);

    return () => { ctx.revert(); scene?.destroy(); };
  }, []);

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-title" data-section="0">
      <div className="hero-sticky">
        <div className="hero-bg mesh" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="grain" aria-hidden="true" />
        <div className="hero-wm" aria-hidden="true">
          <span className="wm-l">Nutra</span><span className="wm-gap" /><span className="wm-r">Intel<sup>®</sup></span>
        </div>
        <canvas className="hero-canvas" aria-hidden="true" />
        <p className="hero-tag">Il follow-up, oltre la visita</p>
        <div className="hero-story">
          <BlurText as="h1" id="hero-title" className="hero-title" text="Il percorso nutrizionale continua anche tra una visita e l'altra." />
          <div className="hero-story-side">
            <p>NutraIntel collega portale professionale, app per il paziente e bilancia connessa in un unico ecosistema digitale, per rendere disponibili le misurazioni e supportare il follow-up a distanza.</p>
            <div className="btns">
              <a className="btn btn-dark" href="#prelancio">Resta aggiornato sul lancio</a>
              <a className="btn btn-line" href="#monitoraggio">Scopri NutraIntel</a>
            </div>
          </div>
        </div>
        <div className="hero-hint" aria-hidden="true"><span>Scorri per scoprire</span><i /></div>
      </div>
    </section>
  );
}
