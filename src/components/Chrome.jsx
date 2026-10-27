import { useEffect, useState } from 'react';

export function Nav() {
  return (
    <header className="nav" aria-label="Navigazione NutraIntel">
      <a className="nav-logo" href="#top" aria-label="NutraIntel - torna all'inizio">Nutra<span>Intel</span><sup>®</sup></a>
      <nav className="nav-links" aria-label="Sezioni">
        <a href="#monitoraggio">Monitoraggio</a><a href="#app">App</a><a href="#funzioni">Funzioni</a><a href="#video">Video</a>
      </nav>
      <div className="nav-cta"><a className="btn btn-line xs" href="#video">Video</a><a className="btn btn-dark xs" href="#prelancio">Resta aggiornato</a></div>
    </header>
  );
}

export function Progress() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-section]')];
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.dataset.section)); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return <div className="progress" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} className={i === active ? 'on' : ''} />)}</div>;
}

export function Outro() {
  return (
    <section className="outro" aria-labelledby="outro-title">
      <div className="outro-blobs" aria-hidden="true"><i /><i /><i /></div>
      <h2 id="outro-title" data-blur-simple>Il percorso, sempre connesso.</h2>
      <div className="btns center" data-fade>
        <a className="btn btn-dark" href="#prelancio">Resta aggiornato</a>
        <a className="btn btn-line" href="#video">Guarda il video</a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="foot-top">
        <a className="nav-logo" href="#top">Nutra<span>Intel</span></a>
        <nav className="foot-big" aria-label="Footer">
          <a href="#monitoraggio">Monitoraggio</a><a href="#app">App paziente</a><a href="#funzioni">Funzionalità</a><a href="#prelancio">Pre-lancio</a>
        </nav>
        <div className="foot-small">
          <a href="#funzioni">Scheda paziente digitale</a><a href="#funzioni">Avvisi</a><a href="#funzioni">Portale professionale</a><a href="#video">Video</a><a href="#top">Torna su ↑</a>
        </div>
        <p className="foot-addr">Ecosistema digitale<br />Professionista + Paziente</p>
      </div>
      <div className="foot-bot"><span>© 2026 NutraIntel · Pre-lancio</span><span>Informativa privacy — link da inserire</span></div>
    </footer>
  );
}
