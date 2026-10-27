import { useState } from 'react';
import { NUTRAINTEL_CONFIG } from '../config.js';
import BlurText from './BlurText.jsx';

export default function Video() {
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);
  const url = (NUTRAINTEL_CONFIG.videoUrl || '').trim();
  return (
    <section className="vid" id="video" aria-labelledby="vid-title" data-section="4">
      <div className="vid-head">
        <BlurText as="h2" id="vid-title" data-blur className="t-h2" text="Scopri l'ecosistema NutraIntel." />
        <p data-fade>Guarda il video di presentazione e scopri come NutraIntel collega professionista e paziente attraverso un ecosistema digitale integrato.</p>
      </div>
      <div className="vid-card" data-fade>
        {playing ? (
          <iframe src={url} title="Video NutraIntel" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        ) : (
          <button className="vid-poster" type="button" aria-label="Riproduci il video NutraIntel" onClick={() => (url ? setPlaying(true) : setMissing(true))}>
            <span className="mesh mesh-deep" aria-hidden="true"><i /><i /><i /><i /></span>
            <span className="vid-word" aria-hidden="true">Nutra<b>Intel</b></span>
            <span className="vid-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span>
            <span className="vid-meta"><span>Video di presentazione</span><span>01:48</span></span>
            <span className="vid-note">{missing ? 'Collega VITE_VIDEO_URL per attivare il video' : 'Video promozionale — asset da collegare'}</span>
          </button>
        )}
      </div>
    </section>
  );
}
