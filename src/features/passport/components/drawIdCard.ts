/**
 * Rendu de la carte BurkinaSira sur un <canvas>, indépendant du DOM.
 *
 * On n'utilise PAS html-to-image : sur mobile (surtout dans la WebView Android)
 * il capture mal les dégradés / le clip-path texte / la mise en page flex et
 * produit une image déformée. Ici tout est dessiné à des coordonnées fixes, donc
 * le résultat est identique sur desktop, mobile web et APK.
 */

// Gabarit haute résolution, ratio ~1.585 (format carte bancaire).
export const CARD_W = 1080;
export const CARD_H = 681;

export interface DrawCardOptions {
  fullName: string;
  roleLabel: string;
  memberSinceLabel: string; // texte déjà formaté ("Membre depuis sept. 2026")
  pointsLabel: string; // texte déjà formaté ("points : 0")
  cardLabel: string; // "CARTE MEMBRE"
  tagline: string; // "Découvrir · Vivre · Partager"
  isVerified: boolean;
  /** Image déjà chargée : photo de profil (ou null). */
  avatar: HTMLImageElement | null;
  /** Filigrane (logo) déjà chargé (ou null). */
  watermark: HTMLImageElement | null;
  /** QR déjà rendu (canvas de qrcode.react, ou null). */
  qr: HTMLCanvasElement | null;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCircleImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  radius: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  const side = Math.min(img.naturalWidth, img.naturalHeight) || 1;
  const sx = (img.naturalWidth - side) / 2;
  const sy = (img.naturalHeight - side) / 2;
  ctx.drawImage(img, sx, sy, side, side, cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();
}

export function drawIdCard(canvas: HTMLCanvasElement, opts: DrawCardOptions): void {
  const dpr = 3;
  canvas.width = CARD_W * dpr;
  canvas.height = CARD_H * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  const pad = 52;
  const brand = '#dc5c0a';
  const ink = '#2a1a0f';

  // --- Fond dégradé + bord arrondi ---
  ctx.save();
  roundRect(ctx, 0, 0, CARD_W, CARD_H, 40);
  ctx.clip();

  const g = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
  g.addColorStop(0, '#fff8f0');
  g.addColorStop(0.55, '#fdeee0');
  g.addColorStop(1, '#fbe4d0');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Filigrane
  if (opts.watermark) {
    const ww = CARD_W * 0.72;
    const wh = (opts.watermark.naturalHeight / opts.watermark.naturalWidth) * ww || ww;
    ctx.globalAlpha = 0.16;
    ctx.drawImage(opts.watermark, (CARD_W - ww) / 2, (CARD_H - wh) / 2, ww, wh);
    ctx.globalAlpha = 1;
  }
  ctx.restore();

  // Bord
  ctx.save();
  roundRect(ctx, 1, 1, CARD_W - 2, CARD_H - 2, 40);
  ctx.strokeStyle = 'rgba(220, 92, 10, 0.28)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // --- En-tête ---
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = brand;
  ctx.font = '800 46px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('BurkinaSira', pad, pad + 40);

  ctx.fillStyle = 'rgba(42, 26, 15, 0.6)';
  ctx.font = '700 22px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(opts.cardLabel.toUpperCase(), CARD_W - pad, pad + 34);

  // --- Corps ---
  const bodyTop = pad + 86;
  const photoR = 74;
  const photoCx = pad + photoR;
  const photoCy = bodyTop + photoR + 18;

  // Photo (cercle)
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoCx, photoCy, photoR, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(220, 92, 10, 0.1)';
  ctx.fill();
  ctx.restore();

  if (opts.avatar) {
    drawCircleImage(ctx, opts.avatar, photoCx, photoCy, photoR);
  } else {
    ctx.fillStyle = brand;
    ctx.font = '700 64px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((opts.fullName.trim()[0] ?? 'U').toUpperCase(), photoCx, photoCy + 4);
    ctx.textBaseline = 'alphabetic';
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoCx, photoCy, photoR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(220, 92, 10, 0.35)';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();

  // Bloc infos (à droite de la photo)
  const infoX = photoCx + photoR + 40;
  const qrSize = 210;
  const qrX = CARD_W - pad - qrSize;
  const infoMaxW = qrX - 32 - infoX;
  let y = bodyTop + 20;

  ctx.textAlign = 'left';
  ctx.fillStyle = ink;
  ctx.font = '800 40px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  // Nom sur 1 ou 2 lignes
  const nameLines = wrapText(ctx, opts.fullName, infoMaxW - (opts.isVerified ? 40 : 0), 2);
  nameLines.forEach((line, idx) => {
    ctx.fillText(line, infoX, y + 34 + idx * 46);
  });
  if (opts.isVerified) {
    const lastLine = nameLines[nameLines.length - 1] ?? '';
    const w = ctx.measureText(lastLine).width;
    drawVerifiedBadge(ctx, infoX + w + 14, y + 20 + (nameLines.length - 1) * 46, 16);
  }
  y += 34 + nameLines.length * 46 + 6;

  ctx.fillStyle = brand;
  ctx.font = '700 24px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(opts.roleLabel.toUpperCase(), infoX, y);
  y += 40;

  ctx.fillStyle = 'rgba(42, 26, 15, 0.7)';
  ctx.font = '400 24px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(opts.memberSinceLabel, infoX, y);
  y += 34;
  ctx.fillText(opts.pointsLabel, infoX, y);

  // --- QR ---
  const qrY = bodyTop + 14;
  ctx.save();
  roundRect(ctx, qrX - 14, qrY - 14, qrSize + 28, qrSize + 28, 16);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = 'rgba(220, 92, 10, 0.18)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
  if (opts.qr) {
    ctx.drawImage(opts.qr, qrX, qrY, qrSize, qrSize);
  }

  // --- Pied ---
  ctx.strokeStyle = 'rgba(220, 92, 10, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, CARD_H - 78);
  ctx.lineTo(CARD_W - pad, CARD_H - 78);
  ctx.stroke();

  ctx.fillStyle = 'rgba(42, 26, 15, 0.55)';
  ctx.font = 'italic 400 24px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(opts.tagline, CARD_W / 2, CARD_H - 40);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  // Tronque la dernière ligne si le texte restait trop long
  if (lines.length > maxLines) lines.length = maxLines;
  if (lines.length === maxLines) {
    let last = lines[maxLines - 1];
    while (last && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    lines[maxLines - 1] = last.length < (lines[maxLines - 1]?.length ?? 0) ? `${last}…` : last;
  }
  return lines;
}

function drawVerifiedBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.4, cy);
  ctx.lineTo(cx - r * 0.1, cy + r * 0.35);
  ctx.lineTo(cx + r * 0.45, cy - r * 0.35);
  ctx.stroke();
  ctx.restore();
}

/** Charge une image (data: URL, chemin public ou URL distante) en Promise. */
export function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
