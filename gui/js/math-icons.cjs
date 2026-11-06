/**
 * MathIcon — Matematiksel formüllerle SVG simge üreteci
 * Her simge parametrik denklemler, trigonometrik fonksiyonlar veya 
 * analitik geometri kullanılarak çizilir.
 */
class MathIcon {
  /**
   * SVG path string döndürür
   * @param {string} name - Simge adı
   * @param {number} size - Boyut (px)
   * @param {string} color - Renk
   * @returns {string} SVG HTML string
   */
  static render(name, size = 24, color = '#e2e8f0') {
    const s = size;
    const r = s / 2;
    const cx = r;
    const cy = r;
    
    let paths = '';
    
    switch (name) {
      // ─── DASHBOARD: Lissajous eğrisi (x=sin(t), y=sin(2t)) ───
      case 'dashboard': {
        const pts = [];
        for (let t = 0; t <= Math.PI * 2; t += 0.1) {
          const x = cx + (r - 3) * Math.sin(t);
          const y = cy + (r - 3) * Math.sin(2 * t);
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        paths = `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
        paths += `<circle cx="${cx}" cy="${cy}" r="2" fill="${color}"/>`;
        break;
      }
      
      // ─── DISCORD: Kardioid (r = a(1 + cos θ)) ───
      case 'discord': {
        const pts = [];
        const a = (r - 4) * 0.5;
        for (let t = 0; t <= Math.PI * 2; t += 0.08) {
          const rr = a * (1 + Math.cos(t));
          const x = cx + rr * Math.cos(t);
          const y = cy + rr * Math.sin(t);
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        paths = `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
        paths += `<circle cx="${cx - 2}" cy="${cy - 1}" r="1.5" fill="${color}"/>`;
        paths += `<circle cx="${cx + 3}" cy="${cy - 1}" r="1.5" fill="${color}"/>`;
        break;
      }
      
      // ─── MINECRAFT: 3D küp izometrik (affin dönüşüm) ───
      case 'minecraft': {
        const h = s * 0.35;
        const w = s * 0.35;
        const cos30 = Math.cos(Math.PI / 6);
        const sin30 = Math.sin(Math.PI / 6);
        const project = (x, y, z) => [
          cx + (x - y) * cos30 * 0.5,
          cy + (x + y) * sin30 * 0.5 - z * 0.5
        ];
        const [ax, ay] = project(-w, -w, h);
        const [bx, by] = project(w, -w, h);
        const [dx, dy] = project(-w, w, h);
        const [ex, ey] = project(w, w, h);
        const [fx, fy] = project(-w, -w, -h);
        const [gx, gy] = project(w, -w, -h);
        const [hx, hy] = project(-w, w, -h);
        const [ix, iy] = project(w, w, -h);
        paths += `<polygon points="${ax},${ay} ${bx},${by} ${ex},${ey} ${dx},${dy}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
        paths += `<polygon points="${ax},${ay} ${dx},${dy} ${hx},${hy} ${fx},${fy}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>`;
        paths += `<polygon points="${bx},${by} ${ex},${ey} ${ix},${iy} ${gx},${gy}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.5"/>`;
        break;
      }
      
      // ─── ECONOMY: Fibonacci spirali (altın oran) ───
      case 'economy': {
        const pts = [];
        const phi = (1 + Math.sqrt(5)) / 2;
        for (let t = 0; t <= Math.PI * 4; t += 0.08) {
          const rr = 0.5 * Math.pow(phi, t / (Math.PI / 2));
          if (rr > r - 2) break;
          const x = cx + rr * Math.cos(t);
          const y = cy + rr * Math.sin(t);
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        paths = `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
        paths += `<circle cx="${cx}" cy="${cy}" r="3" fill="none" stroke="${color}" stroke-width="1.2"/>`;
        paths += `<line x1="${cx}" y1="${cy - 4}" x2="${cx}" y2="${cy + 4}" stroke="${color}" stroke-width="1"/>`;
        break;
      }
      
      // ─── COMMANDS: Fourier dalgası (∑ sin harmonikleri) ───
      case 'commands': {
        const pts = [];
        for (let x = 2; x <= s - 2; x += 0.5) {
          const t = (x - 2) / (s - 4) * Math.PI * 2;
          const y = cy + 
            (r * 0.3) * Math.sin(t) + 
            (r * 0.15) * Math.sin(3 * t) + 
            (r * 0.07) * Math.sin(5 * t);
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        paths = `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
        paths += `<line x1="3" y1="${s - 4}" x2="${s - 3}" y2="${s - 4}" stroke="${color}" stroke-width="1" opacity="0.4"/>`;
        break;
      }
      
      // ─── SETTINGS: Epitrochoid (dişli çark denklemi) ───
      case 'settings': {
        const pts = [];
        const R = (r - 3) * 0.6;
        const rg = R / 3;
        const d = R / 2.5;
        for (let t = 0; t <= Math.PI * 6; t += 0.05) {
          const x = cx + (R + rg) * Math.cos(t) - d * Math.cos((R + rg) / rg * t);
          const y = cy + (R + rg) * Math.sin(t) - d * Math.sin((R + rg) / rg * t);
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        paths = `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`;
        paths += `<circle cx="${cx}" cy="${cy}" r="2.5" fill="none" stroke="${color}" stroke-width="1.5"/>`;
        break;
      }
      
      // ─── LOG: Arşimet spirali (r = a + bθ) ───
      case 'log': {
        const pts = [];
        const a = 1;
        const b = (r - 3) / (Math.PI * 4);
        for (let t = 0; t <= Math.PI * 4; t += 0.1) {
          const rr = a + b * t;
          const x = cx + rr * Math.cos(t);
          const y = cy + rr * Math.sin(t);
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        paths = `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`;
        break;
      }
      
      // ─── START: Üçgen + çember ───
      case 'start': {
        paths += `<circle cx="${cx}" cy="${cy}" r="${r - 2}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
        const triR = (r - 2) * 0.5;
        const pts = [];
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI / 3) - Math.PI / 2 + Math.PI / 6;
          pts.push(`${(cx + triR * Math.cos(angle) + 1).toFixed(1)},${(cy + triR * Math.sin(angle)).toFixed(1)}`);
        }
        paths += `<polygon points="${pts.join(' ')}" fill="${color}"/>`;
        break;
      }
      
      // ─── STOP: Lamé eğrisi / kare ───
      case 'stop': {
        paths += `<circle cx="${cx}" cy="${cy}" r="${r - 2}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
        const sq = r * 0.3;
        paths += `<rect x="${cx - sq}" y="${cy - sq}" width="${sq * 2}" height="${sq * 2}" rx="2" fill="${color}"/>`;
        break;
      }
      
      // ─── CHAT: Bezier eğrili konuşma balonu ───  
      case 'chat': {
        const bw = s * 0.7;
        const bh = s * 0.45;
        const bx = (s - bw) / 2;
        const by = (s - bh) / 2 - 1;
        const br = 4;
        paths += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${br}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
        const tx = bx + bw * 0.25;
        const tbottom = by + bh;
        paths += `<path d="M${tx},${tbottom} Q${tx - 2},${tbottom + 5} ${tx - 6},${tbottom + 6} Q${tx + 1},${tbottom + 3} ${tx + 4},${tbottom}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
        for (let i = -1; i <= 1; i++) {
          paths += `<circle cx="${cx + i * 4}" cy="${cy - 1}" r="1.2" fill="${color}"/>`;
        }
        break;
      }
      
      // ─── USERS: Kesişen çemberler (Venn) ───
      case 'users': {
        const ur = r * 0.35;
        paths += `<circle cx="${cx - ur * 0.5}" cy="${cy - 1}" r="${ur}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
        paths += `<circle cx="${cx + ur * 0.5}" cy="${cy - 1}" r="${ur}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
        paths += `<ellipse cx="${cx}" cy="${cy + ur + 3}" rx="${ur * 1.5}" ry="${ur * 0.6}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
        break;
      }
      
      // ─── HEALTH: Parametrik kalp ───
      case 'health': {
        const pts = [];
        for (let t = 0; t <= Math.PI * 2; t += 0.08) {
          const x = cx + (r - 4) * 0.06 * (16 * Math.pow(Math.sin(t), 3));
          const y = cy - (r - 4) * 0.06 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        paths = `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
        break;
      }
      
      // ─── FOOD: Sinüs eğrileri (buğday) ───
      case 'food': {
        paths += `<line x1="${cx}" y1="${s - 3}" x2="${cx}" y2="4" stroke="${color}" stroke-width="1.5"/>`;
        for (let i = 0; i < 4; i++) {
          const py = s - 6 - i * 4;
          const dir = i % 2 === 0 ? 1 : -1;
          paths += `<path d="M${cx},${py} Q${cx + dir * 5},${py - 2} ${cx + dir * 7},${py - 4}" fill="none" stroke="${color}" stroke-width="1.3"/>`;
        }
        paths += `<ellipse cx="${cx}" cy="5" rx="2.5" ry="3.5" fill="none" stroke="${color}" stroke-width="1.3"/>`;
        break;
      }
      
      // ─── POSITION: Polar ızgara + nokta ───
      case 'position': {
        for (let i = 1; i <= 3; i++) {
          paths += `<circle cx="${cx}" cy="${cy}" r="${i * (r - 2) / 3}" fill="none" stroke="${color}" stroke-width="0.7" opacity="0.4"/>`;
        }
        paths += `<line x1="${cx}" y1="3" x2="${cx}" y2="${s - 3}" stroke="${color}" stroke-width="0.7" opacity="0.4"/>`;
        paths += `<line x1="3" y1="${cy}" x2="${s - 3}" y2="${cy}" stroke="${color}" stroke-width="0.7" opacity="0.4"/>`;
        paths += `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${color}"/>`;
        break;
      }
      
      // ─── POWER: Parçalı lineer ───
      case 'power': {
        const lx = cx;
        paths += `<polyline points="${lx - 3},${2} ${lx + 1},${cy - 1} ${lx - 2},${cy + 1} ${lx + 3},${s - 2}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
        break;
      }
      
      // ─── REFRESH: Logaritmik spiral oklar ───
      case 'refresh': {
        const pts1 = [];
        const pts2 = [];
        for (let t = 0; t <= Math.PI * 1.5; t += 0.08) {
          const rr = (r - 4) * 0.8;
          pts1.push(`${(cx + rr * Math.cos(t)).toFixed(1)},${(cy + rr * Math.sin(t)).toFixed(1)}`);
          pts2.push(`${(cx + rr * Math.cos(t + Math.PI)).toFixed(1)},${(cy + rr * Math.sin(t + Math.PI)).toFixed(1)}`);
        }
        paths += `<polyline points="${pts1.join(' ')}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
        paths += `<polyline points="${pts2.join(' ')}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
        const arrowSize = 3;
        const endAngle1 = Math.PI * 1.5;
        const ax1 = cx + (r - 4) * 0.8 * Math.cos(endAngle1);
        const ay1 = cy + (r - 4) * 0.8 * Math.sin(endAngle1);
        paths += `<polygon points="${ax1},${ay1 - arrowSize} ${ax1 + arrowSize},${ay1 + 1} ${ax1 - arrowSize},${ay1 + 1}" fill="${color}"/>`;
        break;
      }
      
      // ─── INFO: Lemniskate (∞) ───
      case 'info': {
        const pts = [];
        const a = (r - 3) * 0.7;
        for (let t = 0; t <= Math.PI * 2; t += 0.06) {
          const denom = 1 + Math.sin(t) * Math.sin(t);
          const x = cx + a * Math.cos(t) / denom;
          const y = cy + a * Math.sin(t) * Math.cos(t) / denom;
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        paths = `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
        break;
      }
      
      // ─── SEND: Vektör ok ───
      case 'send': {
        paths += `<line x1="3" y1="${cy}" x2="${s - 5}" y2="${cy}" stroke="${color}" stroke-width="1.8"/>`;
        paths += `<polygon points="${s - 3},${cy} ${s - 8},${cy - 3.5} ${s - 8},${cy + 3.5}" fill="${color}"/>`;
        break;
      }
      
      // ─── MINIMIZE ───
      case 'minimize': {
        paths += `<line x1="4" y1="${cy}" x2="${s - 4}" y2="${cy}" stroke="${color}" stroke-width="1.5"/>`;
        break;
      }
      
      // ─── MAXIMIZE ───
      case 'maximize': {
        paths += `<rect x="4" y="4" width="${s - 8}" height="${s - 8}" rx="1" fill="none" stroke="${color}" stroke-width="1.5"/>`;
        break;
      }
      
      // ─── CLOSE ───
      case 'close': {
        paths += `<line x1="5" y1="5" x2="${s - 5}" y2="${s - 5}" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`;
        paths += `<line x1="${s - 5}" y1="5" x2="5" y2="${s - 5}" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`;
        break;
      }

      // ─── MEMORY: Hilbert eğrisi ───
      case 'memory': {
        const m = 3;
        const step = (s - 2 * m) / 3;
        const pts = [
          [m, s - m], [m, s - m - step], [m, s - m - 2 * step], [m, m],
          [m + step, m], [m + step, s - m - 2 * step], [m + step, s - m - step], [m + step, s - m],
          [m + 2 * step, s - m], [m + 2 * step, s - m - step], [m + 2 * step, s - m - 2 * step], [m + 2 * step, m],
          [s - m, m], [s - m, s - m - 2 * step], [s - m, s - m - step], [s - m, s - m]
        ];
        const ptStr = pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
        paths = `<polyline points="${ptStr}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
        break;
      }
      
      // ─── AI: Sinir ağı ───
      case 'ai': {
        const layers = [[cy - 4, cy + 4], [cy - 6, cy, cy + 6], [cy - 4, cy + 4]];
        const layerX = [5, cx, s - 5];
        for (let l = 0; l < layers.length - 1; l++) {
          for (const y1 of layers[l]) {
            for (const y2 of layers[l + 1]) {
              paths += `<line x1="${layerX[l]}" y1="${y1}" x2="${layerX[l + 1]}" y2="${y2}" stroke="${color}" stroke-width="0.7" opacity="0.4"/>`;
            }
          }
        }
        for (let l = 0; l < layers.length; l++) {
          for (const y of layers[l]) {
            paths += `<circle cx="${layerX[l]}" cy="${y}" r="2" fill="${color}"/>`;
          }
        }
        break;
      }
      
      default:
        paths = `<circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
    }
    
    return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
  }
}

if (typeof module !== 'undefined') module.exports = MathIcon;
if (typeof window !== 'undefined') window.MathIcon = MathIcon;
