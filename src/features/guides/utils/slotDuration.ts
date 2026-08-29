export function computeSlotDurationHours(startTime: string, endTime: string): number {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const minutes = endH * 60 + endM - (startH * 60 + startM);
  return Math.max(0, minutes) / 60;
}

export function formatDurationHours(hours: number): string {
  if (Number.isInteger(hours)) return `${hours}h`;
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h${minutes.toString().padStart(2, '0')}`;
}
