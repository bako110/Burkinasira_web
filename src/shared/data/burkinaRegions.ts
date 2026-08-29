/** Découpage administratif du Burkina Faso : 13 régions et leurs provinces. */
export const BURKINA_REGIONS: Record<string, string[]> = {
  'Boucle du Mouhoun': ['Balé', 'Banwa', 'Kossi', 'Mouhoun', 'Nayala', 'Sourou'],
  Cascades: ['Comoé', 'Léraba'],
  Centre: ['Kadiogo'],
  'Centre-Est': ['Boulgou', 'Koulpélogo', 'Kouritenga'],
  'Centre-Nord': ['Bam', 'Namentenga', 'Sanmatenga'],
  'Centre-Ouest': ['Boulkiemdé', 'Sanguié', 'Sissili', 'Ziro'],
  'Centre-Sud': ['Bazèga', 'Nahouri', 'Zoundwéogo'],
  Est: ['Gnagna', 'Gourma', 'Komondjari', 'Kompienga', 'Tapoa'],
  'Hauts-Bassins': ['Houet', 'Kénédougou', 'Tuy'],
  Nord: ['Loroum', 'Passoré', 'Yatenga', 'Zondoma'],
  'Plateau-Central': ['Ganzourgou', 'Kourwéogo', 'Oubritenga'],
  Sahel: ['Oudalan', 'Séno', 'Soum', 'Yagha'],
  'Sud-Ouest': ['Bougouriba', 'Ioba', 'Noumbiel', 'Poni'],
};

export const BURKINA_REGION_NAMES = Object.keys(BURKINA_REGIONS);

export function getProvincesForRegion(region: string | undefined): string[] {
  if (!region) return [];
  return BURKINA_REGIONS[region] ?? [];
}
