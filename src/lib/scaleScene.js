import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Texture della superficie in vetro: elettrodi ITO, display LED, wordmark.
function makeTopTexture() {
  const S = 1024, c = document.createElement('canvas');
  c.width = c.height = S;
  const x = c.getContext('2d');
  const r = 120;
  x.clearRect(0, 0, S, S);
  x.save();
  x.beginPath(); x.roundRect(6, 6, S - 12, S - 12, r); x.clip();
  const g = x.createLinearGradient(0, 0, S, S);
  g.addColorStop(0, '#ffffff'); g.addColorStop(0.55, '#f3f8f7'); g.addColorStop(1, '#e6f1ef');
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  // elettrodi
  x.fillStyle = 'rgba(16,149,167,0.07)';
  x.strokeStyle = 'rgba(5,59,92,0.10)'; x.lineWidth = 2;
  [[70, 300, 330, 650], [S - 400, 300, 330, 650]].forEach(([px, py, w, h]) => {
    x.beginPath(); x.roundRect(px, py, w, h, 60); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(px + w / 2, py + 40); x.lineTo(px + w / 2, py + h - 40); x.stroke();
  });
  // display
  x.fillStyle = '#062a3d';
  x.beginPath(); x.roundRect(S / 2 - 150, 120, 300, 128, 28); x.fill();
  x.fillStyle = '#5ff2cf'; x.shadowColor = 'rgba(27,200,161,.9)'; x.shadowBlur = 18;
  x.font = '300 82px "Inter Tight Variable", Arial, sans-serif';
  x.textAlign = 'right'; x.textBaseline = 'middle';
  x.fillText('72.4', S / 2 + 60, 186);
  x.font = '400 30px "Inter Tight Variable", Arial, sans-serif'; x.textAlign = 'left';
  x.fillText('kg', S / 2 + 72, 200);
  x.shadowBlur = 0;
  // wordmark
  x.fillStyle = 'rgba(5,44,67,.38)';
  x.font = '300 40px "Inter Tight Variable", Arial, sans-serif'; x.textAlign = 'center';
  x.fillText('NutraIntel', S / 2, S - 92);
  x.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

export function createScaleScene(canvas, state) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  camera.position.set(0, 0, 12);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfe9e4, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(3, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xbfeff0, 1.1); rim.position.set(-5, -2, -4); scene.add(rim);

  const group = new THREE.Group(); scene.add(group);
  const W = 3.0, H = 0.2;

  const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0xf1f5f4, roughness: 0.42, metalness: 0, clearcoat: 0.4, clearcoatRoughness: 0.35, sheen: 0.3, sheenColor: new THREE.Color(0xe6f5f2) });
  const body = new THREE.Mesh(new RoundedBoxGeometry(W, H, W, 8, 0.1), bodyMat);
  group.add(body);

  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, transparent: true, opacity: 0.55, envMapIntensity: 1.4 });
  const glass = new THREE.Mesh(new RoundedBoxGeometry(W - 0.04, 0.05, W - 0.04, 6, 0.024), glassMat);
  glass.position.y = H / 2 + 0.012; group.add(glass);

  const topTex = makeTopTexture();
  const top = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.06, W - 0.06),
    new THREE.MeshPhysicalMaterial({ map: topTex, transparent: true, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 0.9 }));
  top.rotation.x = -Math.PI / 2; top.position.y = H / 2 + 0.04; group.add(top);
  // ri-disegna quando il font è pronto
  document.fonts?.ready.then(() => { const t = makeTopTexture(); top.material.map = t; top.material.needsUpdate = true; topTex.dispose(); });

  const footMat = new THREE.MeshStandardMaterial({ color: 0xd9e3e2, roughness: 0.6 });
  const footGeo = new THREE.CylinderGeometry(0.16, 0.18, 0.08, 32);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => {
    const f = new THREE.Mesh(footGeo, footMat); f.position.set(a * (W / 2 - 0.35), -H / 2 - 0.04, b * (W / 2 - 0.35)); group.add(f);
  });

  let w = 0, h = 0, raf = 0, visible = true, t0 = performance.now();
  const resize = () => {
    w = canvas.clientWidth; h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize); ro.observe(canvas);

  const render = (now) => {
    raf = requestAnimationFrame(render);
    if (!visible) return;
    const t = (now - t0) / 1000;
    const fit = Math.min(1, (w / h) / 1.45) * (w < 700 ? 1.18 : 1);
    group.scale.setScalar(state.s * fit);
    group.rotation.set(state.rx + Math.sin(t * 0.6) * 0.03, state.ry + Math.sin(t * 0.45) * 0.05, state.rz);
    group.position.set(state.x, state.y + Math.sin(t * 0.8) * 0.04, 0);
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(render);

  return {
    setVisible: (v) => { visible = v; },
    destroy: () => {
      cancelAnimationFrame(raf); ro.disconnect();
      scene.traverse((o) => { o.geometry?.dispose(); if (o.material) { o.material.map?.dispose(); o.material.dispose(); } });
      env.dispose(); pmrem.dispose(); renderer.dispose();
    },
  };
}
