# NutraIntel – Landing pre-lancio (React + Vite)

Landing immersiva ispirata alla struttura e alle animazioni di exo.inc/iris, con palette e testi NutraIntel.

## Avvio
```bash
npm install
npm run dev      # sviluppo
npm run build    # produzione in dist/
npm run preview
```

## Variabili d'ambiente (.env)
- `VITE_VIDEO_URL` – URL embed del video di presentazione (YouTube/Vimeo)
- `VITE_FORM_ENDPOINT` – endpoint POST JSON del form (es. webhook GoHighLevel). Senza endpoint il form simula l'invio.

## Struttura delle sezioni
1. Hero – bilancia 3D (Three.js) che ruota con lo scroll, wordmark "Nutra | Intel", titolo con blur-in
2. Monitoraggio – titoli in dissolvenza, telefono che sale, statistiche
3. App – carosello di 3 telefoni
4. Ecosistema – 3 tile (portale, app, bilancia)
5. Funzioni – testo orizzontale + 6 step sticky con telefono/laptop
6. Video, Pre-lancio (form), Outro, Footer

Animazioni: GSAP ScrollTrigger + Lenis. Componenti in `src/components`, scena 3D in `src/lib/scaleScene.js`, stili in `src/styles.css`.
