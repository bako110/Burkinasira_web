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
const h3: React.CSSProperties = { fontSize: '1rem', fontWeight: 700, margin: '16px 0 6px' };
const p: React.CSSProperties = { margin: '0 0 12px' };
const li: React.CSSProperties = { margin: '0 0 8px' };
const muted: React.CSSProperties = { color: 'var(--color-text-muted, #6b7280)', fontSize: '0.875rem' };

export function TermsOfServicePage() {
  return (
    <div style={wrap}>
      <h1 style={h1}>Conditions générales d'utilisation</h1>
      <p style={muted}>Dernière mise à jour : {UPDATED}</p>

      <p style={p}>
        Les présentes conditions générales d'utilisation (« CGU ») régissent l'accès et l'usage de
        l'application mobile et du site web BurkinaSira (« le Service »), édité pour valoriser le
        tourisme au Burkina Faso. En créant un compte ou en utilisant le Service, vous acceptez
        sans réserve les présentes CGU. Si vous ne les acceptez pas, vous ne devez pas utiliser le
        Service.
      </p>

      <h2 style={h2}>1. Description du service</h2>
      <p style={p}>
        BurkinaSira met en relation des visiteurs et habitants (« Touristes »), des guides
        touristiques indépendants (« Guides ») et des prestataires professionnels — hôtels,
        restaurants, transporteurs et artisans (« Prestataires ») — pour découvrir, réserver et
        acheter des services et produits liés au tourisme au Burkina Faso : hébergements,
        restauration, transport, visites guidées, événements, produits artisanaux, ainsi qu'un
        espace communautaire (publications, groupes, avis et messagerie).
      </p>
      <p style={p}>
        BurkinaSira agit comme intermédiaire technique entre Touristes, Guides et Prestataires. Sauf
        mention contraire, BurkinaSira n'est pas partie au contrat de vente ou de prestation conclu
        entre un Touriste et un Guide ou Prestataire, et n'est pas responsable de l'exécution de ce
        contrat.
      </p>

      <h2 style={h2}>2. Comptes et rôles</h2>
      <p style={p}>
        L'utilisation de la plupart des fonctionnalités nécessite la création d'un compte. Trois
        types de comptes existent :
      </p>
      <ul>
        <li style={li}><strong>Touriste :</strong> découvre, réserve et achète des services et produits.</li>
        <li style={li}><strong>Guide :</strong> propose des prestations de guidage, gère ses disponibilités et ses réservations.</li>
        <li style={li}><strong>Prestataire :</strong> gère un ou plusieurs établissements (hôtel, restaurant, transport) ou une activité artisanale.</li>
      </ul>
      <p style={p}>
        Les comptes Guide et Prestataire sont soumis à une vérification d'identité et de documents
        professionnels avant activation complète. BurkinaSira se réserve le droit de refuser,
        suspendre ou révoquer une vérification en cas de documents incomplets, invalides ou
        frauduleux.
      </p>
      <p style={p}>
        Vous êtes responsable de l'exactitude des informations fournies lors de l'inscription, de
        la confidentialité de votre mot de passe et de toute activité effectuée depuis votre
        compte. Un compte est strictement personnel et non transférable. Vous devez avoir au moins
        13 ans pour créer un compte.
      </p>

      <h2 style={h2}>3. Réservations et commandes</h2>
      <h3 style={h3}>3.1 Réservations (hôtels, restaurants, transport, guides, événements)</h3>
      <p style={p}>
        Une réservation constitue une demande adressée au Prestataire ou au Guide concerné, qui
        doit la confirmer. Le prix affiché au moment de la réservation est calculé à partir des
        tarifs réels communiqués par le Prestataire ou le Guide ; il ne peut être modifié
        unilatéralement par le Touriste. La disponibilité n'est garantie qu'après confirmation.
      </p>
      <p style={p}>
        Chaque réservation peut être annulée par le Touriste tant qu'elle est en attente ou
        confirmée, selon les conditions d'annulation propres à chaque Prestataire ou Guide,
        affichées avant la validation de la réservation. Un remboursement peut être demandé après
        annulation, dans les conditions indiquées lors de la réservation.
      </p>
      <h3 style={h3}>3.2 Marché artisanal</h3>
      <p style={p}>
        Les commandes de produits artisanaux sont conclues directement entre le Touriste et
        l'artisan. BurkinaSira n'intervient ni dans la fabrication, ni dans l'expédition, ni dans la
        qualité des produits vendus. Les modalités de livraison ou de retrait sont convenues avec
        l'artisan au moment de la commande.
      </p>

      <h2 style={h2}>4. Paiements</h2>
      <p style={p}>
        Selon les moyens de paiement disponibles sur le Service, le règlement peut s'effectuer en
        ligne ou directement auprès du Prestataire, du Guide ou de l'artisan. BurkinaSira ne stocke
        aucune donnée de carte bancaire sur ses propres serveurs. Les frais afférents (frais
        bancaires, frais de plateforme le cas échéant) sont indiqués avant la validation de tout
        paiement.
      </p>

      <h2 style={h2}>5. Contenu et espace communautaire</h2>
      <p style={p}>
        Vous restez propriétaire du contenu que vous publiez (photos, avis, publications,
        messages), mais vous accordez à BurkinaSira une licence non exclusive, gratuite et mondiale
        pour l'héberger, l'afficher et le distribuer dans le cadre du fonctionnement du Service.
      </p>
      <p style={p}>Vous vous engagez à ne pas publier de contenu :</p>
      <ul>
        <li style={li}>illégal, diffamatoire, injurieux, discriminatoire ou incitant à la haine ;</li>
        <li style={li}>portant atteinte aux droits d'un tiers (droit d'auteur, image, vie privée) ;</li>
        <li style={li}>trompeur, frauduleux, ou constituant un faux avis ;</li>
        <li style={li}>à caractère commercial non autorisé (spam, démarchage).</li>
      </ul>
      <p style={p}>
        BurkinaSira peut modérer, masquer ou supprimer tout contenu non conforme, et suspendre ou
        résilier le compte de son auteur, sans préavis en cas de manquement grave.
      </p>

      <h2 style={h2}>6. Obligations des Guides et Prestataires</h2>
      <p style={p}>
        Les Guides et Prestataires s'engagent à fournir des informations exactes et à jour sur
        leurs services, tarifs et disponibilités, à honorer les réservations confirmées, et à se
        conformer à la réglementation applicable à leur activité (tourisme, hôtellerie,
        restauration, transport, artisanat). BurkinaSira peut demander à tout moment des justificatifs
        complémentaires et suspendre un compte en cas de non-conformité, de plaintes répétées ou de
        fraude avérée.
      </p>

      <h2 style={h2}>7. Usage interdit</h2>
      <p style={p}>Il est interdit d'utiliser le Service pour :</p>
      <ul>
        <li style={li}>contourner les mécanismes de sécurité, de vérification ou de paiement ;</li>
        <li style={li}>extraire massivement des données (scraping) sans autorisation ;</li>
        <li style={li}>usurper l'identité d'un tiers ou créer un compte frauduleux ;</li>
        <li style={li}>perturber le fonctionnement technique du Service.</li>
      </ul>

      <h2 style={h2}>8. Propriété intellectuelle</h2>
      <p style={p}>
        La marque BurkinaSira, son logo, son design et ses éléments techniques sont la propriété de
        BurkinaSira ou de ses concédants et sont protégés par le droit de la propriété intellectuelle.
        Toute reproduction ou usage non autorisé est interdit.
      </p>

      <h2 style={h2}>9. Limitation de responsabilité</h2>
      <p style={p}>
        BurkinaSira fournit le Service en l'état, sans garantie d'absence d'erreur ou d'interruption.
        BurkinaSira ne garantit pas l'exactitude, la disponibilité ou la qualité des informations
        fournies par les Guides, Prestataires ou artisans, ni la bonne exécution des prestations et
        commandes conclues via le Service. Dans les limites permises par la loi, la responsabilité
        de BurkinaSira ne saurait être engagée pour un dommage indirect résultant de l'utilisation du
        Service ou d'une prestation fournie par un tiers.
      </p>

      <h2 style={h2}>10. Suspension et résiliation</h2>
      <p style={p}>
        Vous pouvez supprimer votre compte à tout moment depuis les paramètres du Service. BurkinaSira
        peut suspendre ou résilier un compte en cas de violation des présentes CGU, de fraude, ou
        d'usage abusif, après notification lorsque les circonstances le permettent.
      </p>

      <h2 style={h2}>11. Modifications des CGU</h2>
      <p style={p}>
        BurkinaSira peut modifier les présentes CGU à tout moment. Toute modification substantielle
        sera signalée dans l'application ou sur le site avant son entrée en vigueur. La poursuite
        de l'utilisation du Service après une modification vaut acceptation des nouvelles CGU.
      </p>

      <h2 style={h2}>12. Droit applicable et litiges</h2>
      <p style={p}>
        Les présentes CGU sont régies par le droit burkinabè. Tout litige relatif à leur
        interprétation ou leur exécution sera soumis, à défaut de résolution amiable, aux
        juridictions compétentes du Burkina Faso.
      </p>

      <h2 style={h2}>13. Contact</h2>
      <p style={p}>
        Pour toute question relative aux présentes conditions :{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </div>
  );
}
