import { jsPDF } from 'jspdf';

import type { TripDetail } from '../trips/types';
import { buildBudget, BUDGET_CATEGORIES, type ComfortLevel, type OriginRegion } from './budget';

/**
 * Formate un montant FCFA pour le PDF avec un espace normal entre les groupes
 * de milliers. `formatXof` (utilisé à l'écran) insère un espace insécable via
 * `toLocaleString`, que la police Helvetica standard de jsPDF ne sait pas
 * dessiner (elle affiche un glyphe de remplacement, un "/" à l'usage).
 */
function pdfFormatXof(amount: number): string {
  const rounded = Math.round(amount);
  const withSpaces = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${withSpaces} FCFA`;
}

/**
 * Neutralise les caractères hors du jeu WinAnsi géré par les polices PDF
 * standard (Helvetica) : les titres/notes du voyage sont du texte libre saisi
 * par l'utilisateur ou une fiche externe, potentiellement porteur de flèches,
 * emojis ou espaces insécables que jsPDF ne sait pas dessiner correctement
 * (glyphe de remplacement visible, ou déformation du texte qui suit).
 */
const PDF_ALLOWED_EXTRA_CODES = [
  8211, // tiret demi-cadratin
  8212, // tiret cadratin
  8216, 8217, // apostrophes typographiques
  8220, 8221, // guillemets typographiques
  8226, // puce
  183, // point median
];

function pdfSafeText(text: string): string {
  const nbsp = String.fromCharCode(160);
  const rightArrows = [8594, 10132, 10145].map((c) => String.fromCharCode(c));
  const leftArrow = String.fromCharCode(8592);

  let out = text.split(nbsp).join(' ');
  for (const arrow of rightArrows) out = out.split(arrow).join('->');
  out = out.split(leftArrow).join('<-');

  // Conserve uniquement l'ASCII imprimable, les accents latin-1 (WinAnsi) et une
  // courte liste de ponctuation typographique confirmee lisible avec Helvetica
  // standard ; tout le reste (emojis, fleches Unicode restantes, symboles rares)
  // est retire caractere par caractere pour eviter les faux positifs d'une regex
  // a base de plages Unicode.
  const allowedExtra = new Set(PDF_ALLOWED_EXTRA_CODES);
  let result = '';
  for (const ch of out) {
    const code = ch.codePointAt(0) ?? 0;
    const isAsciiPrintable = code >= 0x20 && code <= 0x7e;
    const isLatin1Accent = code >= 0xa1 && code <= 0x17f;
    if (isAsciiPrintable || isLatin1Accent || allowedExtra.has(code)) {
      result += ch;
    }
  }
  return result;
}

interface RecapParams {
  trip: TripDetail;
  comfort: ComfortLevel;
  travelers: number;
  originRegion?: OriginRegion;
  /** Libellés traduits pour les catégories et types (injectés depuis le composant). */
  labels: {
    categories: Record<string, string>;
    itemTypes: Record<string, string>;
    comfortLevel: string;
    originRegionLabel?: string;
    originRegionValue?: string;
    title: string;
    generatedOn: string;
    tripDates: string;
    zone: string;
    travelersLabel: string;
    comfortLabel: string;
    budgetTitle: string;
    perDay: string;
    perPerson: string;
    total: string;
    itineraryTitle: string;
    noPlan: string;
    disclaimer: string;
  };
}

const BRAND_COLOR: [number, number, number] = [220, 92, 10]; // #dc5c0a
const INK: [number, number, number] = [26, 26, 26];
const MUTED: [number, number, number] = [110, 110, 110];
const LINE: [number, number, number] = [225, 225, 225];
const PANEL_BG: [number, number, number] = [250, 248, 246];

const PAGE_MARGIN = 48;
const CONTENT_TOP = 128; // hauteur réservée à l'en-tête sur chaque page
const CONTENT_BOTTOM = 60; // hauteur réservée au pied de page

/**
 * Génère le PDF du récapitulatif de voyage et déclenche le téléchargement.
 *
 * Mise en page sobre de type document officiel : en-tête à bandeau fin,
 * bloc d'informations en grille, tableau budget avec filets nets,
 * itinéraire jour par jour, pied de page numéroté sur chaque page.
 */
export function generateRecapPdf({ trip, comfort, travelers, originRegion, labels }: RecapParams): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - PAGE_MARGIN * 2;

  const tripTitle = pdfSafeText(trip.title);
  const tripRegion = trip.region ? pdfSafeText(trip.region) : undefined;

  let y = CONTENT_TOP;
  let pageNumber = 1;
  const pageTitles: string[] = [];

  function setColor(rgb: [number, number, number]) {
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  }
  function setDraw(rgb: [number, number, number]) {
    doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
  }
  function setFill(rgb: [number, number, number]) {
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  }

  function drawHeader(sectionLabel: string) {
    // Bandeau fin en haut
    setFill(BRAND_COLOR);
    doc.rect(0, 0, pageW, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    setColor(INK);
    doc.text('BurkinaSira', PAGE_MARGIN, 42);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor(MUTED);
    doc.text(labels.title, PAGE_MARGIN, 58);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    setColor(INK);
    const truncatedTitle = doc.splitTextToSize(tripTitle, contentW * 0.6)[0] as string;
    doc.text(truncatedTitle, pageW - PAGE_MARGIN, 42, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor(MUTED);
    doc.text(labels.generatedOn, pageW - PAGE_MARGIN, 58, { align: 'right' });

    setDraw(LINE);
    doc.setLineWidth(0.75);
    doc.line(PAGE_MARGIN, 74, pageW - PAGE_MARGIN, 74);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    setColor(INK);
    doc.text(sectionLabel, PAGE_MARGIN, 100);
  }

  function drawFooter() {
    setDraw(LINE);
    doc.setLineWidth(0.5);
    doc.line(PAGE_MARGIN, pageH - 46, pageW - PAGE_MARGIN, pageH - 46);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    setColor(MUTED);
    doc.text('BurkinaSira · burkinasira.com', PAGE_MARGIN, pageH - 30);
    doc.text(String(pageNumber), pageW - PAGE_MARGIN, pageH - 30, { align: 'right' });
  }

  function currentSectionLabel(): string {
    return pageTitles[pageTitles.length - 1] ?? labels.title;
  }

  function newPage(sectionLabel: string) {
    drawFooter();
    doc.addPage();
    pageNumber += 1;
    pageTitles.push(sectionLabel);
    y = CONTENT_TOP;
    drawHeader(sectionLabel);
  }

  /** Garantit `space` points disponibles avant le pied de page ; change de page sinon. */
  function ensureSpace(space: number, sectionLabel = currentSectionLabel()) {
    if (y + space > pageH - CONTENT_BOTTOM) {
      newPage(sectionLabel);
    }
  }

  function setSectionLabel(label: string) {
    pageTitles[pageTitles.length - 1] = label;
  }

  // --- Page 1 ---
  pageTitles.push(tripTitle);
  drawHeader(tripTitle);
  y = CONTENT_TOP + 20;

  // --- Bloc informations voyage (grille 2 colonnes) ---
  const infoRows: [string, string][] = [];
  if (trip.start_date || trip.end_date) {
    infoRows.push([labels.tripDates, formatDateRange(trip.start_date, trip.end_date)]);
  }
  if (tripRegion) infoRows.push([labels.zone, tripRegion]);
  infoRows.push([labels.travelersLabel, String(travelers)]);
  infoRows.push([labels.comfortLabel, labels.comfortLevel]);
  if (labels.originRegionLabel && labels.originRegionValue) {
    infoRows.push([labels.originRegionLabel, labels.originRegionValue]);
  }

  const infoBoxHeight = Math.ceil(infoRows.length / 2) * 22 + 24;
  setFill(PANEL_BG);
  setDraw(LINE);
  doc.setLineWidth(0.75);
  doc.roundedRect(PAGE_MARGIN, y, contentW, infoBoxHeight, 4, 4, 'FD');

  const colW = contentW / 2;
  doc.setFontSize(9.5);
  infoRows.forEach(([k, v], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = PAGE_MARGIN + 16 + col * colW;
    const rowY = y + 22 + row * 22;
    doc.setFont('helvetica', 'bold');
    setColor(MUTED);
    doc.text(k.toUpperCase(), x, rowY);
    doc.setFont('helvetica', 'normal');
    setColor(INK);
    doc.text(v, x, rowY + 13);
  });
  y += infoBoxHeight + 32;

  // --- Bloc budget ---
  const budget = buildBudget({
    days: trip.days,
    startDate: trip.start_date,
    endDate: trip.end_date,
    comfort,
    travelers,
    originRegion,
  });

  ensureSpace(60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  setColor(INK);
  doc.text(labels.budgetTitle, PAGE_MARGIN, y);
  y += 20;

  const rows = BUDGET_CATEGORIES.map((cat) => [labels.categories[cat] ?? cat, budget.byCategory[cat]] as const).filter(
    ([, value]) => value > 0,
  );

  // En-tête de tableau
  const tableRowH = 22;
  ensureSpace(tableRowH * 2);
  setFill(PANEL_BG);
  doc.rect(PAGE_MARGIN, y, contentW, tableRowH, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  setColor(MUTED);
  doc.text('CATÉGORIE', PAGE_MARGIN + 12, y + 14);
  doc.text('MONTANT', pageW - PAGE_MARGIN - 12, y + 14, { align: 'right' });
  y += tableRowH;

  doc.setFontSize(10.5);
  for (const [label, value] of rows) {
    ensureSpace(tableRowH);
    doc.setFont('helvetica', 'normal');
    setColor(INK);
    doc.text(label, PAGE_MARGIN + 12, y + 15);
    doc.text(pdfFormatXof(value), pageW - PAGE_MARGIN - 12, y + 15, { align: 'right' });
    setDraw(LINE);
    doc.setLineWidth(0.5);
    doc.line(PAGE_MARGIN, y + tableRowH, pageW - PAGE_MARGIN, y + tableRowH);
    y += tableRowH;
  }

  // Total
  ensureSpace(tableRowH + 4);
  setDraw(INK);
  doc.setLineWidth(1);
  doc.line(PAGE_MARGIN, y, pageW - PAGE_MARGIN, y);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  setColor(INK);
  doc.text(labels.total, PAGE_MARGIN + 12, y + 14);
  doc.text(pdfFormatXof(budget.total), pageW - PAGE_MARGIN - 12, y + 14, { align: 'right' });
  y += tableRowH + 6;

  ensureSpace(16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  setColor(MUTED);
  doc.text(
    `${labels.perPerson} ${pdfFormatXof(budget.total / Math.max(travelers, 1))}   -   ${labels.perDay} ${pdfFormatXof(
      budget.total / Math.max(budget.days, 1),
    )}`,
    PAGE_MARGIN,
    y,
  );
  y += 36;

  // --- Bloc itinéraire ---
  ensureSpace(40, labels.itineraryTitle);
  setSectionLabel(labels.itineraryTitle);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  setColor(INK);
  doc.text(labels.itineraryTitle, PAGE_MARGIN, y);
  y += 22;

  if (trip.days.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10.5);
    setColor(MUTED);
    doc.text(labels.noPlan, PAGE_MARGIN, y);
    y += 20;
  } else {
    for (const day of trip.days) {
      ensureSpace(28, labels.itineraryTitle);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      setColor(INK);
      doc.text(formatDayHeading(day.date), PAGE_MARGIN, y);
      y += 8;
      setDraw(LINE);
      doc.setLineWidth(0.5);
      doc.line(PAGE_MARGIN, y, PAGE_MARGIN + 140, y);
      y += 16;

      if (day.items.length === 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9.5);
        setColor(MUTED);
        doc.text('—', PAGE_MARGIN + 14, y);
        y += 16;
      } else {
        for (const item of day.items) {
          const typeLabel = labels.itemTypes[item.type] ?? item.type;
          const time = item.time ? `${item.time}  ·  ` : '';
          const cost =
            typeof item.estimated_cost === 'number' && item.estimated_cost > 0
              ? pdfFormatXof(item.estimated_cost)
              : '';

          const leftText = pdfSafeText(`${time}${typeLabel} — ${item.title}`);
          const wrapped = doc.splitTextToSize(leftText, contentW - 130) as string[];
          ensureSpace(wrapped.length * 13 + 6, labels.itineraryTitle);

          // Puce
          setFill(BRAND_COLOR);
          doc.circle(PAGE_MARGIN + 16, y - 3, 1.6, 'F');

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          setColor(INK);
          doc.text(wrapped, PAGE_MARGIN + 24, y);

          if (cost) {
            setColor(MUTED);
            doc.text(cost, pageW - PAGE_MARGIN, y, { align: 'right' });
          }
          y += wrapped.length * 13 + 6;
        }
      }
      y += 10;
    }
  }

  // --- Avertissement ---
  ensureSpace(40, labels.itineraryTitle);
  y += 8;
  setDraw(LINE);
  doc.setLineWidth(0.5);
  doc.line(PAGE_MARGIN, y, pageW - PAGE_MARGIN, y);
  y += 16;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  setColor(MUTED);
  const disclaimerLines = doc.splitTextToSize(labels.disclaimer, contentW) as string[];
  ensureSpace(disclaimerLines.length * 11, labels.itineraryTitle);
  doc.text(disclaimerLines, PAGE_MARGIN, y);

  drawFooter();

  const safeTitle = trip.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 40);
  doc.save(`burkinasira-voyage-${safeTitle || trip.id}.pdf`);
}

/** "2026-09-12" -> "12 sept. 2026" (ou plage si les deux bornes sont connues). */
function formatDateRange(start?: string, end?: string): string {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  if (start && end) return `${fmt(start)}  -  ${fmt(end)}`;
  if (start) return fmt(start);
  if (end) return fmt(end);
  return '—';
}

/** "2026-09-12" -> "Samedi 12 septembre" pour un en-tête de journée lisible. */
function formatDayHeading(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const label = date.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
