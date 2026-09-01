import { jsPDF } from 'jspdf';

import type { TripDetail } from '../trips/types';
import { buildBudget, formatXof, BUDGET_CATEGORIES, type ComfortLevel } from './budget';

interface RecapParams {
  trip: TripDetail;
  comfort: ComfortLevel;
  travelers: number;
  /** Libellés traduits pour les catégories et types (injectés depuis le composant). */
  labels: {
    categories: Record<string, string>;
    itemTypes: Record<string, string>;
    comfortLevel: string;
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

/** Génère le PDF du récapitulatif de voyage et déclenche le téléchargement. */
export function generateRecapPdf({ trip, comfort, travelers, labels }: RecapParams): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = margin;

  const line = (gap = 16) => {
    y += gap;
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // En-tête
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor('#dc5c0a');
  doc.text('BurkinaSira', margin, y);
  doc.setTextColor('#111111');
  doc.setFontSize(13);
  doc.text(labels.title, pageW - margin, y, { align: 'right' });
  line(10);
  doc.setDrawColor('#dc5c0a');
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageW - margin, y);
  line(24);

  // Bloc infos voyage
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(trip.title, margin, y);
  line(20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor('#555555');
  doc.text(labels.generatedOn, margin, y);
  line(14);

  doc.setTextColor('#111111');
  doc.setFontSize(11);
  const infoRows: [string, string][] = [];
  if (trip.start_date || trip.end_date) {
    infoRows.push([labels.tripDates, `${trip.start_date ?? '?'}  ->  ${trip.end_date ?? '?'}`]);
  }
  if (trip.region) infoRows.push([labels.zone, trip.region]);
  infoRows.push([labels.travelersLabel, String(travelers)]);
  infoRows.push([labels.comfortLabel, labels.comfortLevel]);
  for (const [k, v] of infoRows) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${k}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(v, margin + 120, y);
    line(16);
  }

  line(10);

  // Budget
  const budget = buildBudget({
    days: trip.days,
    startDate: trip.start_date,
    endDate: trip.end_date,
    comfort,
    travelers,
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(labels.budgetTitle, margin, y);
  line(20);

  doc.setFontSize(11);
  for (const cat of BUDGET_CATEGORIES) {
    const value = budget.byCategory[cat];
    if (value <= 0) continue;
    doc.setFont('helvetica', 'normal');
    doc.text(labels.categories[cat] ?? cat, margin, y);
    doc.text(formatXof(value), pageW - margin, y, { align: 'right' });
    line(16);
  }

  line(4);
  doc.setDrawColor('#cccccc');
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  line(16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(labels.total, margin, y);
  doc.text(formatXof(budget.total), pageW - margin, y, { align: 'right' });
  line(18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor('#555555');
  doc.text(
    `${labels.perPerson}: ${formatXof(budget.total / Math.max(travelers, 1))}   |   ${labels.perDay}: ${formatXof(
      budget.total / Math.max(budget.days, 1),
    )}`,
    margin,
    y,
  );
  doc.setTextColor('#111111');
  line(26);

  // Itinéraire
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(labels.itineraryTitle, margin, y);
  line(20);

  if (trip.days.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor('#777777');
    doc.text(labels.noPlan, margin, y);
    doc.setTextColor('#111111');
    line(18);
  } else {
    for (const day of trip.days) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(day.date, margin, y);
      line(16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      if (day.items.length === 0) {
        doc.setTextColor('#777777');
        doc.text('—', margin + 12, y);
        doc.setTextColor('#111111');
        line(14);
      } else {
        for (const item of day.items) {
          const typeLabel = labels.itemTypes[item.type] ?? item.type;
          const cost =
            typeof item.estimated_cost === 'number' && item.estimated_cost > 0
              ? `  (${formatXof(item.estimated_cost)})`
              : '';
          const time = item.time ? `${item.time} · ` : '';
          doc.text(`•  ${time}[${typeLabel}] ${item.title}${cost}`, margin + 12, y);
          line(14);
        }
      }
      line(6);
    }
  }

  line(10);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor('#888888');
  const disclaimerLines = doc.splitTextToSize(labels.disclaimer, pageW - margin * 2);
  doc.text(disclaimerLines, margin, y);

  const safeTitle = trip.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 40);
  doc.save(`burkinasira-voyage-${safeTitle || trip.id}.pdf`);
}
