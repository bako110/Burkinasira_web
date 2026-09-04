/**
 * Interrupteurs de fonctionnalités.
 *
 * RESERVATIONS_ENABLED : mettre à `false` désactive TOUS les parcours de
 * réservation (hôtel, guide, expérience, événement, sortie éducative, garde
 * d'enfants). Les boutons "Réserver" affichent alors un message
 * d'indisponibilité au lieu d'ouvrir le formulaire. Repasser à `true` +
 * redéployer pour réactiver.
 *
 * N'affecte PAS : le panier / la marketplace, la demande de trajet transport,
 * les demandes de devis, les messages, les avis, les favoris.
 */
export const RESERVATIONS_ENABLED = false;

/** Clé i18n du message affiché quand les réservations sont coupées. */
export const RESERVATIONS_DISABLED_MESSAGE_KEY = 'bookings.temporarilyUnavailable';
