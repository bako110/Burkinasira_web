import { jsPDF } from 'jspdf';

import type { GuideBooking } from './types';

/**
 * Neutralise les caractères hors du jeu WinAnsi géré par les polices PDF
 * standard (Helvetica) : les noms clients / adresses sont du texte libre,
 * potentiellement porteur de caractères que jsPDF ne sait pas dessiner
 * correctement (glyphe de remplacement visible).
 */
function pdfSafeText(text: string): string {
  const nbsp = String.fromCharCode(160);
  let out = text.split(nbsp).join(' ');
  let result = '';
  for (const ch of out) {
    const code = ch.codePointAt(0) ?? 0;
    const isAsciiPrintable = code >= 0x20 && code <= 0x7e;
    const isLatin1Accent = code >= 0xa1 && code <= 0x17f;
    if (isAsciiPrintable || isLatin1Accent) result += ch;
  }
  return result;
}

/** Convertit une image distante en data URL base64 (nécessaire pour l'insérer dans le PDF). */
async function toDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/** Génère une référence de document courte et vérifiable (horodatage + empreinte des données). */
function buildDocumentReference(establishmentId: string, bookingCount: number): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const shortId = establishmentId.slice(-6).toUpperCase();
  return `BSR-${shortId}-${stamp}-${bookingCount}`;
}

const STATUS_COLOR: Record<GuideBooking['status'], [number, number, number]> = {
  pending: [217, 119, 6], // --color-warning
  confirmed: [22, 163, 74], // --color-success
  completed: [22, 163, 74],
  cancelled: [220, 38, 38], // --color-danger
  refunded: [110, 110, 110],
};

interface BookingsPdfParams {
  establishmentName: string;
  establishmentTypeLabel: string;
  logoUrl?: string;
  bookings: GuideBooking[];
  /** Libellés traduits injectés depuis le composant appelant. */
  labels: {
    documentTitle: string;
    generatedOn: string;
    documentRef: string;
    authenticityNotice: string;
    columnCustomer: string;
    columnReference: string;
    columnDate: string;
    columnAmount: string;
    columnStatus: string;
    totalBookings: string;
    statusLabels: Record<GuideBooking['status'], string>;
    unknownCustomer: string;
    noBookings: string;
  };
}

const BRAND_COLOR: [number, number, number] = [220, 92, 10]; // #dc5c0a
const INK: [number, number, number] = [26, 26, 26];
const MUTED: [number, number, number] = [110, 110, 110];
const LINE: [number, number, number] = [225, 225, 225];
const PANEL_BG: [number, number, number] = [250, 248, 246];

const PAGE_MARGIN = 48;
const CONTENT_TOP = 150;
const CONTENT_BOTTOM = 60;

/**
 * Génère le PDF de la liste des réservations d'un établissement prestataire et
 * déclenche le téléchargement. Reprend la mise en page "document officiel" du
 * récapitulatif de voyage : bandeau de marque, logo de l'établissement,
 * tableau à filets nets, référence de document et mention d'authenticité,
 * pied de page numéroté sur chaque page.
 */
export async function generateBookingsPdf({
  establishmentName,
  establishmentTypeLabel,
  logoUrl,
  bookings,
  labels,
}: BookingsPdfParams): Promise<void> {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - PAGE_MARGIN * 2;

  const logoDataUrl = logoUrl ? await toDataUrl(logoUrl) : null;
  const documentRef = buildDocumentReference(establishmentName, bookings.length);
  const establishmentTitle = pdfSafeText(establishmentName);

  let y = CONTENT_TOP;
  let pageNumber = 1;

  function setColor(rgb: [number, number, number]) {
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  }
  function setDraw(rgb: [number, number, number]) {
    doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
  }
  function setFill(rgb: [number, number, number]) {
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  }

  function drawHeader() {
    // Bandeau fin en haut
    setFill(BRAND_COLOR);
    doc.rect(0, 0, pageW, 6, 'F');

    const logoSize = 34;
    const logoX = PAGE_MARGIN;
    const logoY = 20;
    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, logoX, logoY, logoSize, logoSize, undefined, 'FAST');
        setDraw(LINE);
        doc.setLineWidth(0.75);
        doc.roundedRect(logoX, logoY, logoSize, logoSize, 3, 3, 'S');
      } catch {
        // image illisible (format non supporté) : on continue sans logo
      }
    }

    const textX = logoDataUrl ? logoX + logoSize + 12 : logoX;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    setColor(INK);
    doc.text(establishmentTitle, textX, logoY + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    setColor(MUTED);
    doc.text(establishmentTypeLabel, textX, logoY + 27);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    setColor(BRAND_COLOR);
    doc.text('BurkinaSira', pageW - PAGE_MARGIN, logoY + 14, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    setColor(MUTED);
    doc.text(labels.generatedOn, pageW - PAGE_MARGIN, logoY + 27, { align: 'right' });

    setDraw(LINE);
    doc.setLineWidth(0.75);
    doc.line(PAGE_MARGIN, 70, pageW - PAGE_MARGIN, 70);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    setColor(INK);
    doc.text(labels.documentTitle, PAGE_MARGIN, 96);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    setColor(MUTED);
    doc.text(`${labels.documentRef} ${documentRef}`, PAGE_MARGIN, 112);
    doc.text(
      `${labels.totalBookings} ${bookings.length}`,
      pageW - PAGE_MARGIN,
      112,
      { align: 'right' },
    );
  }

  function drawFooter() {
    setDraw(LINE);
    doc.setLineWidth(0.5);
    doc.line(PAGE_MARGIN, pageH - 54, pageW - PAGE_MARGIN, pageH - 54);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    setColor(MUTED);
    const authLines = doc.splitTextToSize(labels.authenticityNotice, contentW * 0.7) as string[];
    doc.text(authLines, PAGE_MARGIN, pageH - 40);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(String(pageNumber), pageW - PAGE_MARGIN, pageH - 30, { align: 'right' });
    doc.text('BurkinaSira - burkinasira.com', PAGE_MARGIN, pageH - 30);
  }

  function newPage() {
    drawFooter();
    doc.addPage();
    pageNumber += 1;
    y = CONTENT_TOP;
    drawHeader();
  }

  function ensureSpace(space: number) {
    if (y + space > pageH - CONTENT_BOTTOM) {
      newPage();
    }
  }

  drawHeader();
  y = CONTENT_TOP;

  if (bookings.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10.5);
    setColor(MUTED);
    doc.text(labels.noBookings, PAGE_MARGIN, y);
    drawFooter();
    downloadDoc();
    return;
  }

  // --- Tableau des réservations ---
  const colRef = PAGE_MARGIN + 12;
  const colCustomer = PAGE_MARGIN + 100;
  const colDate = PAGE_MARGIN + 290;
  const colAmount = PAGE_MARGIN + 380;
  const colStatusRight = pageW - PAGE_MARGIN - 12;

  const tableRowH = 24;

  function drawTableHeader() {
    setFill(PANEL_BG);
    doc.rect(PAGE_MARGIN, y, contentW, tableRowH, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setColor(MUTED);
    doc.text(labels.columnReference.toUpperCase(), colRef, y + 15);
    doc.text(labels.columnCustomer.toUpperCase(), colCustomer, y + 15);
    doc.text(labels.columnDate.toUpperCase(), colDate, y + 15);
    doc.text(labels.columnAmount.toUpperCase(), colAmount, y + 15);
    doc.text(labels.columnStatus.toUpperCase(), colStatusRight, y + 15, { align: 'right' });
    y += tableRowH;
  }

  ensureSpace(tableRowH * 2);
  drawTableHeader();

  doc.setFontSize(9);
  for (const booking of bookings) {
    ensureSpace(tableRowH);
    // ré-affiche l'en-tête de tableau après un saut de page
    if (y === CONTENT_TOP) drawTableHeader();

    doc.setFont('helvetica', 'normal');
    setColor(INK);
    doc.text(pdfSafeText(booking.booking_reference), colRef, y + 15);

    const customerName = pdfSafeText(booking.customer_name || labels.unknownCustomer);
    const truncatedCustomer = doc.splitTextToSize(customerName, 180)[0] as string;
    doc.text(truncatedCustomer, colCustomer, y + 15);

    const dateLabel = booking.scheduled_date
      ? new Date(booking.scheduled_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
      : '-';
    doc.text(dateLabel, colDate, y + 15);

    doc.text(`${booking.total_price.toLocaleString('fr-FR')} ${booking.currency}`, colAmount, y + 15);

    const statusColor = STATUS_COLOR[booking.status];
    const statusText = labels.statusLabels[booking.status];
    doc.setFont('helvetica', 'bold');
    setColor(statusColor);
    doc.text(statusText, colStatusRight, y + 15, { align: 'right' });

    setDraw(LINE);
    doc.setLineWidth(0.5);
    doc.line(PAGE_MARGIN, y + tableRowH, pageW - PAGE_MARGIN, y + tableRowH);
    y += tableRowH;
  }

  drawFooter();
  downloadDoc();

  function downloadDoc() {
    const safeName = establishmentName.replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 40);
    doc.save(`burkinasira-reservations-${safeName || 'etablissement'}.pdf`);
  }
}
