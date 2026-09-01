import type { Itinerary } from './types';

/**
 * Itinéraires premium BurkinaSira — sélection éditoriale.
 *
 * Les montants sont des estimations par personne en FCFA (XOF), hors vols
 * internationaux et visa. Ils servent de point de départ : le voyageur les
 * ajuste dans le planificateur après avoir cloné l'itinéraire.
 *
 * Les `destinationSlug` renvoient vers des fiches de la base quand elles
 * existent ; sinon l'étape reste informative.
 */

export const ITINERARIES: Itinerary[] = [
  {
    slug: 'ouagadougou-essentiel-3j',
    title: 'Ouagadougou, l’essentiel en 3 jours',
    tagline: 'Première immersion dans la capitale : culture, artisanat et vie de quartier.',
    intro:
      "Ouagadougou ne se livre pas au premier regard : elle se marche, se goûte et s’écoute. Ce parcours court est pensé pour un premier séjour ou une escale prolongée. Il alterne les grandes institutions culturelles, les ateliers d’artisans et les adresses où la ville se retrouve le soir, sans jamais courir. Un guide francophone la première journée facilite les repères et les rencontres.",
    region: 'Centre',
    durationDays: 3,
    pace: 'equilibre',
    audience: ['Première visite', 'Couples', 'Voyageurs solo', 'Court séjour'],
    bestSeason: 'Novembre à février (chaleur supportable, ciel dégagé)',
    highlights: [
      'Musée national et Village artisanal',
      'Grand marché Rood Woko et quartiers d’artisans',
      'Soirée musique vivante et cuisine burkinabè',
    ],
    coverTheme: 'ouaga',
    budgetFrom: { eco: 95000, standard: 190000, confort: 360000 },
    notIncluded: [
      'Vol international et visa',
      'Assurance voyage et rapatriement',
      'Dépenses personnelles et pourboires',
    ],
    days: [
      {
        title: 'Jour 1 — Prendre le pouls de la ville',
        summary:
          'Une journée d’acclimatation en douceur, accompagné d’un guide, pour comprendre la géographie de la ville et son histoire récente.',
        stops: [
          {
            time: '09:00',
            type: 'guide',
            title: 'Demi-journée avec un guide francophone',
            description:
              "Tour d’orientation à pied et en voiture : place des Cinéastes, avenue Kwame Nkrumah, mémoriaux et grands axes. Le guide adapte le rythme et répond aux questions sur la vie quotidienne, la monnaie, les usages.",
            estimatedCost: 15000,
            tip: 'Convenez du périmètre et de l’heure de fin dès le départ.',
          },
          {
            time: '11:00',
            type: 'destination',
            title: 'Musée national du Burkina Faso',
            description:
              "Panorama des cultures du pays : masques, textiles, instruments, habitat traditionnel reconstitué. Une bonne mise en perspective avant d’aller sur le terrain les jours suivants.",
            estimatedCost: 3000,
            destinationSlug: 'musee-national-burkina-faso',
            tip: 'Comptez 1 h 30. Photos parfois payantes selon les salles.',
          },
          {
            time: '13:00',
            type: 'restaurant',
            title: 'Déjeuner : cuisine burkinabè',
            description:
              "Riz gras, poulet bicyclette, sauces d’arachide ou de feuilles : la table locale, simple et généreuse. Choisissez une adresse fréquentée à midi, gage de fraîcheur.",
            estimatedCost: 4000,
          },
          {
            time: '16:00',
            type: 'destination',
            title: 'Village artisanal de Ouagadougou',
            description:
              "Bronziers, sculpteurs sur bois, maroquiniers, tisserands et batikeurs réunis dans un même lieu. On observe les gestes, on discute, on repart avec des pièces qui ont une histoire.",
            estimatedCost: 0,
            destinationSlug: 'village-artisanal-ouagadougou',
            tip: 'Prix affichés indicatifs : la négociation reste courtoise et attendue.',
          },
          {
            time: '20:00',
            type: 'experience',
            title: 'Soirée musique live',
            description:
              "Ouaga est une capitale musicale. Un maquis ou un bar-concert pour écouter de l’afro, du reggae ou des rythmes mandingues, dans une ambiance détendue.",
            estimatedCost: 6000,
          },
        ],
      },
      {
        title: 'Jour 2 — Marché, artisanat et savoir-faire',
        summary:
          'Journée consacrée au commerce populaire et aux ateliers, avec des pauses à l’ombre aux heures chaudes.',
        stops: [
          {
            time: '08:30',
            type: 'destination',
            title: 'Grand marché Rood Woko',
            description:
              "Le cœur commerçant de la ville sur plusieurs niveaux : tissus, épices, objets du quotidien, pagnes wax. Un labyrinthe animé qui se visite l’esprit ouvert et le sac près du corps.",
            estimatedCost: 0,
            tip: 'Le matin, c’est plus frais et moins dense. Gardez sur vous le strict nécessaire.',
          },
          {
            time: '11:00',
            type: 'experience',
            title: 'Atelier de tissage ou de batik',
            description:
              "Une à deux heures aux côtés d’un artisan pour comprendre — et essayer — le métier à tisser ou la cire sur tissu. Repartez avec votre réalisation.",
            estimatedCost: 8000,
          },
          {
            time: '13:30',
            type: 'restaurant',
            title: 'Déjeuner à l’ombre',
            description:
              "Pause longue dans un jardin-restaurant : jus de bissap ou de gingembre, plat du jour, un moment pour souffler avant de repartir.",
            estimatedCost: 5000,
          },
          {
            time: '16:30',
            type: 'destination',
            title: 'Cathédrale de Ouagadougou et quartier Zangouettin',
            description:
              "L’une des plus grandes églises d’Afrique de l’Ouest, en briques de latérite. Autour, un quartier ancien où l’on marche au ralenti en fin de journée.",
            estimatedCost: 0,
          },
          {
            time: '19:30',
            type: 'restaurant',
            title: 'Dîner : brochettes et grillades',
            description:
              "Le rituel du soir : brochettes de bœuf ou de mouton, poisson braisé, plantain. On s’installe dehors, on prend son temps.",
            estimatedCost: 5000,
          },
        ],
      },
      {
        title: 'Jour 3 — Art contemporain et au revoir',
        summary:
          'Matinée culturelle plus calme, puis temps libre pour les derniers achats avant le départ.',
        stops: [
          {
            time: '09:30',
            type: 'destination',
            title: 'Galerie d’art et ateliers d’artistes',
            description:
              "La scène contemporaine burkinabè est vivace. Une galerie du centre ou un atelier ouvert pour rencontrer peintres et plasticiens, souvent disponibles pour échanger.",
            estimatedCost: 0,
          },
          {
            time: '11:30',
            type: 'experience',
            title: 'Café de spécialité et pause lecture',
            description:
              "Un café torréfié localement, un carnet, l’ombre d’un manguier : le moment de mettre au propre ses impressions avant de repartir.",
            estimatedCost: 3000,
          },
          {
            time: '13:00',
            type: 'autre',
            title: 'Déjeuner libre et derniers achats',
            description:
              "Retour au Village artisanal ou au marché pour les cadeaux repérés, puis transfert vers l’aéroport ou l’étape suivante.",
            estimatedCost: 6000,
            tip: 'Prévoyez 45 min de trajet vers l’aéroport aux heures de pointe.',
          },
        ],
      },
    ],
  },

  {
    slug: 'bobo-dioulasso-culture-4j',
    title: 'Bobo-Dioulasso, capitale culturelle en 4 jours',
    tagline: 'La ville la plus musicale du pays, sa vieille ville en banco et ses environs verdoyants.',
    intro:
      "Bobo-Dioulasso a un tempo à part : plus lent, plus vert, profondément musical. On y vient pour la grande mosquée de style soudanais, le quartier historique de Kibidwé, les balafons qui résonnent le soir — et pour les excursions faciles vers les cascades et les villages de potières des environs. Quatre jours permettent d’en saisir l’âme sans se presser.",
    region: 'Hauts-Bassins',
    durationDays: 4,
    pace: 'tranquille',
    audience: ['Amateurs de musique', 'Photographes', 'Couples', 'Familles'],
    bestSeason: 'Novembre à février ; la fin de saison des pluies (octobre) offre des paysages très verts',
    highlights: [
      'Grande mosquée et vieille ville de Kibidwé',
      'Guimbi et la mémoire de la ville',
      'Excursion cascades de Karfiguéla et Dômes de Fabédougou',
    ],
    coverTheme: 'bobo',
    budgetFrom: { eco: 130000, standard: 250000, confort: 470000 },
    notIncluded: [
      'Vol international et visa',
      'Trajet Ouagadougou ↔ Bobo-Dioulasso (bus confort ou avion intérieur)',
      'Assurance voyage et pourboires',
    ],
    days: [
      {
        title: 'Jour 1 — Arrivée et vieille ville',
        summary:
          'Installation, puis première marche dans le quartier historique en fin d’après-midi, à la lumière douce.',
        stops: [
          {
            time: '15:00',
            type: 'hotel',
            title: 'Installation à l’hôtel',
            description:
              "Choisissez un hébergement central : la vieille ville et les lieux de concert se rejoignent alors à pied.",
            estimatedCost: 20000,
          },
          {
            time: '17:00',
            type: 'guide',
            title: 'Visite guidée de Kibidwé',
            description:
              "Le plus ancien quartier de Bobo, en banco : ruelles étroites, maisons de familles de forgerons et de griots, petit pont sur le marigot. Un guide du quartier ouvre les portes et raconte.",
            estimatedCost: 10000,
            tip: 'Une participation pour la communauté du quartier est d’usage, en plus du guide.',
          },
          {
            time: '20:00',
            type: 'restaurant',
            title: 'Dîner en terrasse',
            description:
              "Cuisine locale et ivoiro-burkinabè, souvent en musique. Goûtez le tô accompagné d’une sauce gombo ou graine.",
            estimatedCost: 5000,
          },
        ],
      },
      {
        title: 'Jour 2 — Mosquée, marché et balafons',
        summary:
          'Le cœur patrimonial et sonore de la ville, avec une soirée dédiée à la musique.',
        stops: [
          {
            time: '08:30',
            type: 'destination',
            title: 'Grande mosquée de Bobo-Dioulasso',
            description:
              "Édifice en terre de style soudanais, hérissé de pieux de bois, édifié à la fin du XIXᵉ siècle. On l’admire de l’extérieur ; l’intérieur se visite selon les horaires de prière et avec autorisation.",
            estimatedCost: 1000,
            tip: 'Tenue couvrante. Se renseigner sur place pour l’accès intérieur et la participation.',
          },
          {
            time: '10:00',
            type: 'destination',
            title: 'Marché central et rue des artisans',
            description:
              "Fruits, tissus, ferronnerie, instruments. Bobo est réputée pour ses fabricants de balafons et de djembés : on peut assister à l’accordage.",
            estimatedCost: 0,
          },
          {
            time: '13:00',
            type: 'restaurant',
            title: 'Déjeuner sous les manguiers',
            description:
              "Un maquis ombragé pour le riz sauce ou le poisson braisé, avec un jus de tamarin bien frais.",
            estimatedCost: 4000,
          },
          {
            time: '16:00',
            type: 'experience',
            title: 'Initiation au balafon',
            description:
              "Séance avec un maître balafoniste : histoire de l’instrument, premières mélodies pentatoniques, place de la musique dans la vie sociale.",
            estimatedCost: 10000,
          },
          {
            time: '21:00',
            type: 'experience',
            title: 'Concert dans un bar mythique',
            description:
              "Bobo s’écoute la nuit. Groupes de jazz mandingue, reggae ou fusion dans une salle qui a vu passer les grands noms de la scène ouest-africaine.",
            estimatedCost: 5000,
          },
        ],
      },
      {
        title: 'Jour 3 — Excursion cascades et dômes',
        summary:
          'Une journée nature à une heure de route, dans la région de Banfora.',
        stops: [
          {
            time: '07:30',
            type: 'transport',
            title: 'Route vers Banfora',
            description:
              "Environ 1 h 30 de trajet vers le sud-ouest, à travers champs de canne à sucre et vergers de manguiers. Véhicule privé avec chauffeur recommandé pour la souplesse.",
            estimatedCost: 20000,
          },
          {
            time: '09:30',
            type: 'destination',
            title: 'Cascades de Karfiguéla',
            description:
              "Une série de chutes et de vasques dans un décor de forêt-galerie. Baignade possible dans les bassins calmes en amont, selon la saison et le débit.",
            estimatedCost: 2000,
            tip: 'Chaussures qui accrochent, les roches sont glissantes. Éviter après de fortes pluies.',
          },
          {
            time: '12:30',
            type: 'destination',
            title: 'Dômes de Fabédougou',
            description:
              "Formations gréseuses en boules empilées, sculptées par l’érosion sur des millions d’années. Courte randonnée entre les dômes, très photogénique en fin de journée.",
            estimatedCost: 2000,
          },
          {
            time: '14:00',
            type: 'restaurant',
            title: 'Déjeuner à Banfora',
            description:
              "Pause dans un restaurant de la ville avant le lac de Tengréla en option (hippopotames observables en pirogue).",
            estimatedCost: 5000,
          },
          {
            time: '18:30',
            type: 'transport',
            title: 'Retour à Bobo-Dioulasso',
            description: 'Retour en fin de journée, dîner libre et repos.',
            estimatedCost: 0,
          },
        ],
      },
      {
        title: 'Jour 4 — Villages des environs et départ',
        summary:
          'Matinée chez les potières ou tisserands, puis transfert.',
        stops: [
          {
            time: '09:00',
            type: 'experience',
            title: 'Village de potières',
            description:
              "À la périphérie, des collectifs de femmes façonnent la terre à la main, sans tour, et cuisent à l’air libre. Démonstration, échange, achat direct au juste prix.",
            estimatedCost: 5000,
          },
          {
            time: '12:00',
            type: 'autre',
            title: 'Déjeuner et transfert',
            description:
              "Dernier repas en ville, puis route ou vol vers Ouagadougou / prochaine étape.",
            estimatedCost: 6000,
          },
        ],
      },
    ],
  },

  {
    slug: 'sud-ouest-nature-5j',
    title: 'Sud-Ouest, nature et pays lobi en 5 jours',
    tagline: 'Cascades, pics de Sindou, habitat fortifié lobi : le Burkina le plus spectaculaire.',
    intro:
      "Le Sud-Ouest concentre les paysages les plus photogéniques du pays et une culture, celle des Lobi, restée très singulière. Ce circuit relie Banfora et sa région verdoyante aux pics de Sindou, puis descend vers Gaoua et le pays lobi, avec ses maisons-forteresses en terre (les soukhala) et un musée de référence. Cinq jours, un véhicule avec chauffeur, et un guide sur les segments culturels.",
    region: 'Cascades',
    durationDays: 5,
    pace: 'equilibre',
    audience: ['Amoureux de nature', 'Randonneurs', 'Passionnés d’ethnographie', 'Photographes'],
    bestSeason: 'Décembre à février ; octobre-novembre pour la végétation la plus verte',
    highlights: [
      'Lac de Tengréla et ses hippopotames',
      'Pics de Sindou au lever ou au coucher du soleil',
      'Pays lobi : soukhala fortifiées et musée de Gaoua',
    ],
    coverTheme: 'sud-ouest',
    budgetFrom: { eco: 180000, standard: 330000, confort: 590000 },
    notIncluded: [
      'Vol international et visa',
      'Acheminement depuis Ouagadougou',
      'Assurance, boissons et pourboires',
    ],
    days: [
      {
        title: 'Jour 1 — Banfora, canne à sucre et lac',
        summary: 'Mise en route dans la région la plus verte du pays.',
        stops: [
          {
            time: '10:00',
            type: 'destination',
            title: 'Lac de Tengréla',
            description:
              "Sortie en pirogue à la recherche des hippopotames qui vivent dans le lac. Les piroguiers connaissent leurs habitudes ; on garde ses distances. Oiseaux d’eau nombreux au petit matin.",
            estimatedCost: 4000,
            tip: 'Tôt le matin ou en fin d’après-midi : meilleure lumière, hippos plus actifs.',
          },
          {
            time: '13:00',
            type: 'restaurant',
            title: 'Déjeuner à Banfora',
            description: 'Poisson du lac ou du barrage, riz, légumes de saison.',
            estimatedCost: 5000,
          },
          {
            time: '16:00',
            type: 'destination',
            title: 'Champs de canne et coucher de soleil',
            description:
              "Balade dans le damier vert de la plaine sucrière, à vélo ou à pied, jusqu’à un point de vue pour le coucher de soleil.",
            estimatedCost: 0,
          },
          {
            time: '19:30',
            type: 'hotel',
            title: 'Nuit à Banfora',
            description: 'Hébergement calme en ville ou en périphérie.',
            estimatedCost: 22000,
          },
        ],
      },
      {
        title: 'Jour 2 — Cascades et dômes',
        summary: 'Les grands classiques naturels de la région, à un rythme tranquille.',
        stops: [
          {
            time: '08:00',
            type: 'destination',
            title: 'Cascades de Karfiguéla',
            description:
              "Chutes étagées et bassins dans la forêt-galerie ; baignade selon le débit. Sentier aménagé, ombragé.",
            estimatedCost: 2000,
          },
          {
            time: '11:00',
            type: 'destination',
            title: 'Dômes de Fabédougou',
            description:
              "Empilements de grès arrondis par l’érosion. Petite randonnée entre les formations, superbe en lumière rasante.",
            estimatedCost: 2000,
          },
          {
            time: '13:30',
            type: 'restaurant',
            title: 'Déjeuner pique-nique',
            description: 'Panier préparé par l’hôtel, à l’ombre près des dômes.',
            estimatedCost: 4000,
          },
          {
            time: '19:00',
            type: 'hotel',
            title: 'Seconde nuit à Banfora',
            description: 'Retour en ville, soirée libre.',
            estimatedCost: 22000,
          },
        ],
      },
      {
        title: 'Jour 3 — Pics de Sindou',
        summary: 'Route vers l’ouest et randonnée dans une chaîne de grès ciselée.',
        stops: [
          {
            time: '08:00',
            type: 'transport',
            title: 'Route Banfora → Sindou',
            description: 'Environ 1 h 15 vers la frontière malienne, paysages de brousse arborée.',
            estimatedCost: 12000,
          },
          {
            time: '10:00',
            type: 'guide',
            title: 'Randonnée guidée dans les pics de Sindou',
            description:
              "Une muraille naturelle de lames et d’aiguilles de grès, longue de plusieurs kilomètres. Le guide local connaît les passages, les points de vue et les récits attachés aux formations.",
            estimatedCost: 8000,
            tip: 'Départ tôt pour éviter la chaleur ; 2 à 3 h de marche, dénivelé modéré.',
          },
          {
            time: '13:30',
            type: 'restaurant',
            title: 'Déjeuner à Sindou',
            description: 'Repas simple au village avant de reprendre la route vers le sud.',
            estimatedCost: 4000,
          },
          {
            time: '18:00',
            type: 'hotel',
            title: 'Nuit à Gaoua',
            description: 'Arrivée en pays lobi en fin de journée.',
            estimatedCost: 18000,
          },
        ],
      },
      {
        title: 'Jour 4 — Pays lobi',
        summary: 'Journée culturelle dense autour de Gaoua.',
        stops: [
          {
            time: '09:00',
            type: 'destination',
            title: 'Musée de Poni (Gaoua)',
            description:
              "Musée de référence sur la culture lobi : statuaire, autels, organisation sociale, rapport aux ancêtres. Indispensable avant d’aller dans les villages.",
            estimatedCost: 2000,
          },
          {
            time: '11:00',
            type: 'guide',
            title: 'Visite d’une soukhala',
            description:
              "Avec un guide lobi, découverte d’une maison-forteresse en terre, sans ouverture au sol, où l’on entre par le toit. Architecture défensive, greniers, autels : tout a un sens.",
            estimatedCost: 10000,
            tip: 'Le respect des règles de la maison prime : on suit strictement le guide et l’hôte.',
          },
          {
            time: '14:00',
            type: 'restaurant',
            title: 'Déjeuner à Gaoua',
            description: 'Cuisine du terroir : tô, sauces de brousse, bière de mil (dolo) en option.',
            estimatedCost: 4000,
          },
          {
            time: '17:00',
            type: 'experience',
            title: 'Rencontre avec un sculpteur lobi',
            description:
              "La statuaire lobi est recherchée des collectionneurs. Atelier, gestes, symbolique des figures — et achat direct possible.",
            estimatedCost: 5000,
          },
        ],
      },
      {
        title: 'Jour 5 — Retour',
        summary: 'Longue route de retour vers Ouagadougou (ou étape à Bobo).',
        stops: [
          {
            time: '07:30',
            type: 'transport',
            title: 'Route Gaoua → Ouagadougou',
            description:
              "Comptez 6 à 7 h avec les pauses. Une alternative confortable : couper le trajet par une nuit supplémentaire à Bobo-Dioulasso.",
            estimatedCost: 25000,
          },
          {
            time: '13:00',
            type: 'restaurant',
            title: 'Déjeuner sur la route',
            description: 'Arrêt à Pâ ou Boromo, portes d’entrée de la boucle du Mouhoun.',
            estimatedCost: 5000,
          },
        ],
      },
    ],
  },

  {
    slug: 'ranch-nazinga-safari-2j',
    title: 'Ranch de Nazinga, safari éléphants en 2 jours',
    tagline: 'La faune sauvage du Sud, éléphants en liberté, à 2 h 30 de Ouagadougou.',
    intro:
      "Le ranch de Nazinga, près de la frontière ghanéenne, est le meilleur endroit du pays pour observer les éléphants en liberté, souvent à quelques dizaines de mètres, ainsi que des antilopes, phacochères, singes et une avifaune remarquable. Une escapade nature courte et forte, idéale en complément d’un séjour à Ouagadougou. Nuit sur place, sorties au lever et au coucher du soleil, quand les animaux se rapprochent des points d’eau.",
    region: 'Centre-Sud',
    durationDays: 2,
    pace: 'equilibre',
    audience: ['Familles', 'Amateurs de faune', 'Photographes', 'Court séjour depuis Ouaga'],
    bestSeason: 'Décembre à avril : la saison sèche concentre les animaux autour des retenues d’eau',
    highlights: [
      'Éléphants en liberté aux points d’eau',
      'Safari au lever et au coucher du soleil',
      'Nuit en campement au cœur du ranch',
    ],
    coverTheme: 'nazinga',
    budgetFrom: { eco: 70000, standard: 130000, confort: 240000 },
    notIncluded: [
      'Vol international et visa',
      'Location du véhicule adapté (4x4 conseillé sur les pistes du ranch)',
      'Assurance et pourboires guide/pisteur',
    ],
    days: [
      {
        title: 'Jour 1 — Route et premier safari',
        summary: 'Départ matinal de Ouagadougou, arrivée pour la sortie de fin d’après-midi.',
        stops: [
          {
            time: '07:00',
            type: 'transport',
            title: 'Route Ouagadougou → Nazinga',
            description:
              "Environ 2 h 30, via Pô. Les derniers kilomètres se font sur piste ; un 4x4 ou un véhicule haut est recommandé, surtout en fin de saison des pluies.",
            estimatedCost: 25000,
          },
          {
            time: '11:00',
            type: 'hotel',
            title: 'Installation au campement du ranch',
            description:
              "Bungalows simples au bord d’une retenue d’eau. Depuis la terrasse, il n’est pas rare de voir passer des animaux.",
            estimatedCost: 20000,
          },
          {
            time: '12:30',
            type: 'restaurant',
            title: 'Déjeuner au campement',
            description: 'Cuisine du campement, repos pendant les heures chaudes.',
            estimatedCost: 6000,
          },
          {
            time: '16:00',
            type: 'guide',
            title: 'Safari du soir avec pisteur',
            description:
              "En véhicule ouvert avec un pisteur du ranch : recherche des troupeaux d’éléphants qui descendent boire, observation des antilopes rouannes, cobs, phacochères. Lumière dorée, silence, distances de sécurité respectées.",
            estimatedCost: 12000,
            tip: 'Vêtements neutres, jumelles, pas de parfum. On reste dans le véhicule sauf indication du pisteur.',
          },
          {
            time: '20:00',
            type: 'experience',
            title: 'Dîner sous les étoiles',
            description:
              "Repas au campement, ciel très pur loin des lumières de la ville, sons de la brousse.",
            estimatedCost: 6000,
          },
        ],
      },
      {
        title: 'Jour 2 — Safari du matin et retour',
        summary: 'La sortie la plus prometteuse, puis route vers la capitale.',
        stops: [
          {
            time: '06:00',
            type: 'guide',
            title: 'Safari du lever du soleil',
            description:
              "Le meilleur créneau : fraîcheur, animaux actifs, oiseaux nombreux. Deux à trois heures sur les pistes du ranch avec le pisteur.",
            estimatedCost: 12000,
          },
          {
            time: '09:30',
            type: 'restaurant',
            title: 'Petit-déjeuner tardif au campement',
            description: 'Retour au campement, douche, préparation des bagages.',
            estimatedCost: 4000,
          },
          {
            time: '11:00',
            type: 'transport',
            title: 'Retour à Ouagadougou',
            description:
              "Route retour, arrivée en début d’après-midi. Possibilité de s’arrêter à Pô (marché, artisanat).",
            estimatedCost: 25000,
          },
        ],
      },
    ],
  },
];

export function getItineraryBySlug(slug: string | undefined): Itinerary | undefined {
  if (!slug) return undefined;
  return ITINERARIES.find((it) => it.slug === slug);
}
