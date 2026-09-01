const UPDATED = '1er septembre 2026';
const CONTACT_EMAIL = 'contact@burkinasira.com';

const wrap: React.CSSProperties = {
  maxWidth: 760,
  margin: '0 auto',
  padding: 'var(--space-6, 24px) var(--space-4, 16px) var(--space-8, 48px)',
  lineHeight: 1.65,
  color: 'var(--color-text, #1f2937)',
};

const h1: React.CSSProperties = { fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, margin: '0 0 8px' };
const h2: React.CSSProperties = { fontSize: '1.125rem', fontWeight: 700, margin: '28px 0 8px' };
const p: React.CSSProperties = { margin: '0 0 12px' };
const muted: React.CSSProperties = { color: 'var(--color-text-muted, #6b7280)', fontSize: '0.875rem' };

export function PrivacyPolicyPage() {
  return (
    <div style={wrap}>
      <h1 style={h1}>Politique de confidentialité</h1>
      <p style={muted}>Dernière mise à jour : {UPDATED}</p>

      <p style={p}>
        BurkinaSira (« nous ») édite l'application mobile et le site web BurkinaSira, un guide touristique
        du Burkina Faso. Cette politique explique quelles données nous collectons, pourquoi, et
        quels sont vos droits.
      </p>

      <h2 style={h2}>1. Données que nous collectons</h2>
      <p style={p}>
        <strong>Compte :</strong> lorsque vous créez un compte, nous collectons votre nom, votre
        adresse e-mail et, le cas échéant, votre numéro de téléphone et votre mot de passe (stocké
        sous forme chiffrée).
      </p>
      <p style={p}>
        <strong>Contenu que vous fournissez :</strong> réservations, commandes, messages, avis,
        publications communautaires, documents de vérification pour les comptes professionnels.
      </p>
      <p style={p}>
        <strong>Localisation :</strong> uniquement si vous l'autorisez, pour afficher les lieux,
        hôtels, transports et services à proximité, et pour la fonction d'alerte d'urgence. Vous
        pouvez révoquer cette autorisation à tout moment dans les réglages de votre appareil.
      </p>
      <p style={p}>
        <strong>Données techniques :</strong> type d'appareil, version du système, identifiants
        techniques et journaux d'erreurs, afin d'assurer le fonctionnement et la sécurité du
        service.
      </p>

      <h2 style={h2}>2. Utilisation des données</h2>
      <p style={p}>
        Nous utilisons ces données pour : fournir et améliorer le service, gérer votre compte et
        vos réservations, assurer la sécurité, répondre à vos demandes, et respecter nos
        obligations légales. Nous n'utilisons pas vos données à des fins de publicité ciblée.
      </p>

      <h2 style={h2}>3. Partage des données</h2>
      <p style={p}>
        Vos données ne sont jamais vendues. Elles peuvent être partagées avec : les prestataires
        touristiques concernés par vos réservations ou commandes, nos sous-traitants techniques
        (hébergement, envoi d'e-mails) agissant sur nos instructions, et les autorités lorsque la
        loi l'exige.
      </p>

      <h2 style={h2}>4. Conservation</h2>
      <p style={p}>
        Nous conservons vos données tant que votre compte est actif, puis pendant la durée
        nécessaire au respect de nos obligations légales. Vous pouvez demander la suppression de
        votre compte à tout moment.
      </p>

      <h2 style={h2}>5. Sécurité</h2>
      <p style={p}>
        Les échanges sont chiffrés (HTTPS), les mots de passe sont hachés, et l'accès aux données
        est restreint. Aucun système n'étant infaillible, nous ne pouvons garantir une sécurité
        absolue.
      </p>

      <h2 style={h2}>6. Vos droits</h2>
      <p style={p}>
        Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition
        concernant vos données. Pour l'exercer, contactez-nous à l'adresse ci-dessous.
      </p>

      <h2 style={h2}>7. Enfants</h2>
      <p style={p}>
        Le service n'est pas destiné aux personnes de moins de 13 ans et nous ne collectons pas
        sciemment leurs données.
      </p>

      <h2 style={h2}>8. Modifications</h2>
      <p style={p}>
        Cette politique peut évoluer. Toute modification importante sera signalée dans
        l'application ou sur le site.
      </p>

      <h2 style={h2}>9. Contact</h2>
      <p style={p}>
        Pour toute question relative à cette politique ou à vos données :{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </div>
  );
}
