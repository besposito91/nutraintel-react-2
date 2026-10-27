import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Hero from './components/Hero.jsx';
import SeeDeeper from './components/SeeDeeper.jsx';
import AppCarousel from './components/AppCarousel.jsx';
import Ecosystem from './components/Ecosystem.jsx';
import Workflow from './components/Workflow.jsx';
import Video from './components/Video.jsx';
import Prelaunch from './components/Prelaunch.jsx';
import { Nav, Progress, Outro, Footer } from './components/Chrome.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useLayoutEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis = null, tick = null;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    }
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      const el = document.querySelector(a.getAttribute('href')); if (!el) return;
      e.preventDefault();
      lenis ? lenis.scrollTo(el, { duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' });
    };
    document.addEventListener('click', onClick);

    const ctx = gsap.context(() => {
      // Nav: compare dopo l'intro dell'hero (come Exo)
      ScrollTrigger.create({ trigger: '.wf', start: 'top 64px', end: 'bottom 64px', toggleClass: { targets: '.nav', className: 'nav-dark' } });
      gsap.fromTo('.nav', { yPercent: -110, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: '.hero', start: '18% top', end: '24% top', scrub: true } });
      // Titoli: blur-in parola per parola
      gsap.utils.toArray('[data-blur]').forEach((el) => {
        gsap.fromTo(el.querySelectorAll('.bw'), { opacity: 0, filter: 'blur(14px)', y: 16 }, { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.06, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
      });
      gsap.utils.toArray('[data-blur-simple]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, filter: 'blur(18px)' }, { opacity: 1, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
      });
      gsap.utils.toArray('[data-fade]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 40, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
      });
      // Card sfalsate con parallasse
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const d = Number(el.dataset.parallax);
        gsap.fromTo(el, { y: d + 80, opacity: 0.2 }, { y: -d * 0.4, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.eco-cards', start: 'top bottom', end: 'bottom 30%', scrub: 1 } });
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      ctx.revert(); document.removeEventListener('click', onClick); window.removeEventListener('load', refresh);
      if (tick) gsap.ticker.remove(tick); lenis?.destroy();
    };
  }, []);

  return (
    <>
      <a className="skip" href="#main">Vai al contenuto</a>
      <Nav />
      <Progress />
      <main id="main">
        <Hero />
        <SeeDeeper />
        <AppCarousel />
        <Ecosystem />
        <Workflow />
        <Video />
        <Prelaunch />
        <Outro />
      </main>
      <Footer />
    </>
  );
}
