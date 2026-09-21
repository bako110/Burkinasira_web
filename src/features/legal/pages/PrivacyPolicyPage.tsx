import { ShieldCheck } from 'lucide-react';

import { LegalPage } from '../components/LegalPage';

const UPDATED = '1er septembre 2026';
const CONTACT_EMAIL = 'contact@burkinasira.com';

export function PrivacyPolicyPage() {
  return (
    <LegalPage
      icon={<ShieldCheck size={22} strokeWidth={1.75} />}
      title="Politique de confidentialité"
      updatedLabel={`Dernière mise à jour : ${UPDATED}`}
      intro={
        <p>
          BurkinaSira (« nous ») édite l'application mobile et le site web BurkinaSira, un guide
          touristique du Burkina Faso. Cette politique explique quelles données nous collectons,
          pourquoi, et quels sont vos droits.
        </p>
      }
      sections={[
        {
          id: 'donnees-collectees',
          title: '1. Données que nous collectons',
          body: (
            <>
              <p>
                <strong>Compte :</strong> lorsque vous créez un compte, nous collectons votre nom,
                votre adresse e-mail et, le cas échéant, votre numéro de téléphone et votre mot de
                passe (stocké sous forme chiffrée).
              </p>
              <p>
                <strong>Contenu que vous fournissez :</strong> réservations, commandes, messages, avis,
                publications communautaires, documents de vérification pour les comptes
                professionnels.
              </p>
              <p>
                <strong>Localisation :</strong> uniquement si vous l'autorisez, pour afficher les
                lieux, hôtels, transports et services à proximité, et pour la fonction d'alerte
                d'urgence. Vous pouvez révoquer cette autorisation à tout moment dans les réglages de
                votre appareil.
              </p>
              <p>
                <strong>Données techniques :</strong> type d'appareil, version du système,
                identifiants techniques et journaux d'erreurs, afin d'assurer le fonctionnement et la
                sécurité du service.
              </p>
            </>
          ),
        },
        {
          id: 'utilisation',
          title: '2. Utilisation des données',
          body: (
            <p>
              Nous utilisons ces données pour : fournir et améliorer le service, gérer votre compte et
              vos réservations, assurer la sécurité, répondre à vos demandes, et respecter nos
              obligations légales. Nous n'utilisons pas vos données à des fins de publicité ciblée.
            </p>
          ),
        },
        {
          id: 'partage',
          title: '3. Partage des données',
          body: (
            <p>
              Vos données ne sont jamais vendues. Elles peuvent être partagées avec : les prestataires
              touristiques concernés par vos réservations ou commandes, nos sous-traitants techniques
              (hébergement, envoi d'e-mails) agissant sur nos instructions, et les autorités lorsque la
              loi l'exige.
            </p>
          ),
        },
        {
          id: 'conservation',
          title: '4. Conservation',
          body: (
            <p>
              Nous conservons vos données tant que votre compte est actif, puis pendant la durée
              nécessaire au respect de nos obligations légales. Vous pouvez demander la suppression de
              votre compte à tout moment.
            </p>
          ),
        },
        {
          id: 'securite',
          title: '5. Sécurité',
          body: (
            <p>
              Les échanges sont chiffrés (HTTPS), les mots de passe sont hachés, et l'accès aux données
              est restreint. Aucun système n'étant infaillible, nous ne pouvons garantir une sécurité
              absolue.
            </p>
          ),
        },
        {
          id: 'droits',
          title: '6. Vos droits',
          body: (
            <p>
              Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition
              concernant vos données. Pour l'exercer, contactez-nous à l'adresse ci-dessous.
            </p>
          ),
        },
        {
          id: 'enfants',
          title: '7. Enfants',
          body: (
            <p>
              Le service n'est pas destiné aux personnes de moins de 13 ans et nous ne collectons pas
              sciemment leurs données.
            </p>
          ),
        },
        {
          id: 'modifications',
          title: '8. Modifications',
          body: (
            <p>
              Cette politique peut évoluer. Toute modification importante sera signalée dans
              l'application ou sur le site.
            </p>
          ),
        },
        {
          id: 'contact',
          title: '9. Contact',
          body: (
            <p>
              Pour toute question relative à cette politique ou à vos données :{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          ),
        },
      ]}
    />
  );
}
