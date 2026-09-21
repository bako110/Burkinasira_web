import { FileText } from 'lucide-react';

import { LegalPage } from '../components/LegalPage';

const UPDATED = '1er septembre 2026';
const CONTACT_EMAIL = 'contact@burkinasira.com';

export function TermsOfServicePage() {
  return (
    <LegalPage
      icon={<FileText size={22} strokeWidth={1.75} />}
      title="Conditions générales d'utilisation"
      updatedLabel={`Dernière mise à jour : ${UPDATED}`}
      intro={
        <p>
          Les présentes conditions générales d'utilisation (« CGU ») régissent l'accès et l'usage de
          l'application mobile et du site web BurkinaSira (« le Service »), édité pour valoriser le
          tourisme au Burkina Faso. En créant un compte ou en utilisant le Service, vous acceptez
          sans réserve les présentes CGU. Si vous ne les acceptez pas, vous ne devez pas utiliser le
          Service.
        </p>
      }
      sections={[
        {
          id: 'description',
          title: '1. Description du service',
          body: (
            <>
              <p>
                BurkinaSira met en relation des visiteurs et habitants (« Touristes »), des guides
                touristiques indépendants (« Guides ») et des prestataires professionnels — hôtels,
                restaurants, transporteurs et artisans (« Prestataires ») — pour découvrir, réserver et
                acheter des services et produits liés au tourisme au Burkina Faso : hébergements,
                restauration, transport, visites guidées, événements, produits artisanaux, ainsi qu'un
                espace communautaire (publications, groupes, avis et messagerie).
              </p>
              <p>
                BurkinaSira agit comme intermédiaire technique entre Touristes, Guides et Prestataires.
                Sauf mention contraire, BurkinaSira n'est pas partie au contrat de vente ou de prestation
                conclu entre un Touriste et un Guide ou Prestataire, et n'est pas responsable de
                l'exécution de ce contrat.
              </p>
            </>
          ),
        },
        {
          id: 'comptes',
          title: '2. Comptes et rôles',
          body: (
            <>
              <p>
                L'utilisation de la plupart des fonctionnalités nécessite la création d'un compte. Trois
                types de comptes existent :
              </p>
              <ul>
                <li><strong>Touriste :</strong> découvre, réserve et achète des services et produits.</li>
                <li><strong>Guide :</strong> propose des prestations de guidage, gère ses disponibilités et ses réservations.</li>
                <li><strong>Prestataire :</strong> gère un ou plusieurs établissements (hôtel, restaurant, transport) ou une activité artisanale.</li>
              </ul>
              <p>
                Les comptes Guide et Prestataire sont soumis à une vérification d'identité et de
                documents professionnels avant activation complète. BurkinaSira se réserve le droit de
                refuser, suspendre ou révoquer une vérification en cas de documents incomplets,
                invalides ou frauduleux.
              </p>
              <p>
                Vous êtes responsable de l'exactitude des informations fournies lors de l'inscription,
                de la confidentialité de votre mot de passe et de toute activité effectuée depuis votre
                compte. Un compte est strictement personnel et non transférable. Vous devez avoir au
                moins 13 ans pour créer un compte.
              </p>
            </>
          ),
        },
        {
          id: 'reservations',
          title: '3. Réservations et commandes',
          body: (
            <>
              <h3>3.1 Réservations (hôtels, restaurants, transport, guides, événements)</h3>
              <p>
                Une réservation constitue une demande adressée au Prestataire ou au Guide concerné, qui
                doit la confirmer. Le prix affiché au moment de la réservation est calculé à partir des
                tarifs réels communiqués par le Prestataire ou le Guide ; il ne peut être modifié
                unilatéralement par le Touriste. La disponibilité n'est garantie qu'après confirmation.
              </p>
              <p>
                Chaque réservation peut être annulée par le Touriste tant qu'elle est en attente ou
                confirmée, selon les conditions d'annulation propres à chaque Prestataire ou Guide,
                affichées avant la validation de la réservation. Un remboursement peut être demandé
                après annulation, dans les conditions indiquées lors de la réservation.
              </p>
              <h3>3.2 Marché artisanal</h3>
              <p>
                Les commandes de produits artisanaux sont conclues directement entre le Touriste et
                l'artisan. BurkinaSira n'intervient ni dans la fabrication, ni dans l'expédition, ni
                dans la qualité des produits vendus. Les modalités de livraison ou de retrait sont
                convenues avec l'artisan au moment de la commande.
              </p>
            </>
          ),
        },
        {
          id: 'paiements',
          title: '4. Paiements',
          body: (
            <p>
              Selon les moyens de paiement disponibles sur le Service, le règlement peut s'effectuer en
              ligne ou directement auprès du Prestataire, du Guide ou de l'artisan. BurkinaSira ne
              stocke aucune donnée de carte bancaire sur ses propres serveurs. Les frais afférents
              (frais bancaires, frais de plateforme le cas échéant) sont indiqués avant la validation de
              tout paiement.
            </p>
          ),
        },
        {
          id: 'contenu',
          title: '5. Contenu et espace communautaire',
          body: (
            <>
              <p>
                Vous restez propriétaire du contenu que vous publiez (photos, avis, publications,
                messages), mais vous accordez à BurkinaSira une licence non exclusive, gratuite et
                mondiale pour l'héberger, l'afficher et le distribuer dans le cadre du fonctionnement du
                Service.
              </p>
              <p>Vous vous engagez à ne pas publier de contenu :</p>
              <ul>
                <li>illégal, diffamatoire, injurieux, discriminatoire ou incitant à la haine ;</li>
                <li>portant atteinte aux droits d'un tiers (droit d'auteur, image, vie privée) ;</li>
                <li>trompeur, frauduleux, ou constituant un faux avis ;</li>
                <li>à caractère commercial non autorisé (spam, démarchage).</li>
              </ul>
              <p>
                BurkinaSira peut modérer, masquer ou supprimer tout contenu non conforme, et suspendre
                ou résilier le compte de son auteur, sans préavis en cas de manquement grave.
              </p>
            </>
          ),
        },
        {
          id: 'obligations',
          title: '6. Obligations des Guides et Prestataires',
          body: (
            <p>
              Les Guides et Prestataires s'engagent à fournir des informations exactes et à jour sur
              leurs services, tarifs et disponibilités, à honorer les réservations confirmées, et à se
              conformer à la réglementation applicable à leur activité (tourisme, hôtellerie,
              restauration, transport, artisanat). BurkinaSira peut demander à tout moment des
              justificatifs complémentaires et suspendre un compte en cas de non-conformité, de
              plaintes répétées ou de fraude avérée.
            </p>
          ),
        },
        {
          id: 'usage-interdit',
          title: '7. Usage interdit',
          body: (
            <>
              <p>Il est interdit d'utiliser le Service pour :</p>
              <ul>
                <li>contourner les mécanismes de sécurité, de vérification ou de paiement ;</li>
                <li>extraire massivement des données (scraping) sans autorisation ;</li>
                <li>usurper l'identité d'un tiers ou créer un compte frauduleux ;</li>
                <li>perturber le fonctionnement technique du Service.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'propriete',
          title: '8. Propriété intellectuelle',
          body: (
            <p>
              La marque BurkinaSira, son logo, son design et ses éléments techniques sont la propriété
              de BurkinaSira ou de ses concédants et sont protégés par le droit de la propriété
              intellectuelle. Toute reproduction ou usage non autorisé est interdit.
            </p>
          ),
        },
        {
          id: 'responsabilite',
          title: '9. Limitation de responsabilité',
          body: (
            <p>
              BurkinaSira fournit le Service en l'état, sans garantie d'absence d'erreur ou
              d'interruption. BurkinaSira ne garantit pas l'exactitude, la disponibilité ou la qualité
              des informations fournies par les Guides, Prestataires ou artisans, ni la bonne exécution
              des prestations et commandes conclues via le Service. Dans les limites permises par la
              loi, la responsabilité de BurkinaSira ne saurait être engagée pour un dommage indirect
              résultant de l'utilisation du Service ou d'une prestation fournie par un tiers.
            </p>
          ),
        },
        {
          id: 'suspension',
          title: '10. Suspension et résiliation',
          body: (
            <p>
              Vous pouvez supprimer votre compte à tout moment depuis les paramètres du Service.
              BurkinaSira peut suspendre ou résilier un compte en cas de violation des présentes CGU,
              de fraude, ou d'usage abusif, après notification lorsque les circonstances le permettent.
            </p>
          ),
        },
        {
          id: 'modifications',
          title: '11. Modifications des CGU',
          body: (
            <p>
              BurkinaSira peut modifier les présentes CGU à tout moment. Toute modification
              substantielle sera signalée dans l'application ou sur le site avant son entrée en
              vigueur. La poursuite de l'utilisation du Service après une modification vaut acceptation
              des nouvelles CGU.
            </p>
          ),
        },
        {
          id: 'droit-applicable',
          title: '12. Droit applicable et litiges',
          body: (
            <p>
              Les présentes CGU sont régies par le droit burkinabè. Tout litige relatif à leur
              interprétation ou leur exécution sera soumis, à défaut de résolution amiable, aux
              juridictions compétentes du Burkina Faso.
            </p>
          ),
        },
        {
          id: 'contact',
          title: '13. Contact',
          body: (
            <p>
              Pour toute question relative aux présentes conditions :{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          ),
        },
      ]}
    />
  );
}
