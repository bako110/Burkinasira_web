import type { Itinerary } from './types';

/**
 * English translation of the editorial content of the itineraries. Only textual
 * fields are provided; structural values (slug, times, types, costs, coverTheme,
 * budgetFrom, region, durationDays, pace) are inherited from the French source
 * via mergeItinerary() in itineraries.i18n.ts.
 *
 * Kept loosely typed (Partial-ish via `as unknown as Itinerary[]`) because only
 * the merged fields matter.
 */
export const ITINERARIES_EN = [
  {
    slug: 'ouagadougou-essentiel-3j',
    title: 'Ouagadougou, the essentials in 3 days',
    tagline: 'A first dive into the capital: culture, crafts and neighbourhood life.',
    intro:
      "Ouagadougou does not reveal itself at first glance: you walk it, taste it and listen to it. This short route is designed for a first stay or an extended stopover. It alternates the major cultural institutions, artisans' workshops and the spots where the city gathers in the evening, never in a rush. A French-speaking guide on the first day makes it easier to get your bearings and to meet people.",
    audience: ['First visit', 'Couples', 'Solo travellers', 'Short stay'],
    bestSeason: 'November to February (bearable heat, clear skies)',
    highlights: [
      'National Museum and Artisans’ Village',
      'Rood Woko grand market and craft districts',
      'Live music evening and Burkinabe cuisine',
    ],
    notIncluded: [
      'International flight and visa',
      'Travel and repatriation insurance',
      'Personal spending and tips',
    ],
    days: [
      {
        title: 'Day 1 — Getting the feel of the city',
        summary:
          'A gentle acclimatisation day with a guide, to understand the city’s geography and its recent history.',
        stops: [
          {
            title: 'Half a day with a French-speaking guide',
            description:
              "Orientation tour on foot and by car: Place des Cinéastes, Avenue Kwame Nkrumah, memorials and main avenues. The guide adapts the pace and answers questions about daily life, money and local customs.",
            tip: 'Agree on the area covered and the finish time from the start.',
          },
          {
            title: 'National Museum of Burkina Faso',
            description:
              "An overview of the country’s cultures: masks, textiles, instruments, reconstructed traditional dwellings. A good frame of reference before heading into the field over the following days.",
            tip: 'Allow 1.5 hours. Photos are sometimes charged for depending on the room.',
          },
          {
            title: 'Lunch: Burkinabe cuisine',
            description:
              "Riz gras, free-range chicken, groundnut or leaf sauces: the local table, simple and generous. Pick a place that is busy at midday — a sign of freshness.",
          },
          {
            title: 'Ouagadougou Artisans’ Village',
            description:
              "Bronze casters, wood carvers, leather workers, weavers and batik makers gathered in one place. You watch the gestures, chat, and leave with pieces that have a story.",
            tip: 'Displayed prices are a guide: polite bargaining is expected.',
          },
          {
            title: 'Live music evening',
            description:
              "Ouaga is a musical capital. A maquis or a concert bar to hear afro, reggae or Mandingo rhythms in a relaxed atmosphere.",
          },
        ],
      },
      {
        title: 'Day 2 — Market, crafts and know-how',
        summary:
          'A day devoted to popular trade and workshops, with shade breaks during the hot hours.',
        stops: [
          {
            title: 'Rood Woko grand market',
            description:
              "The commercial heart of the city over several levels: fabrics, spices, everyday goods, wax pagnes. A lively maze best explored with an open mind and your bag held close.",
            tip: 'The morning is cooler and less crowded. Carry only the bare essentials.',
          },
          {
            title: 'Weaving or batik workshop',
            description:
              "One to two hours alongside an artisan to understand — and try — the loom or wax on fabric. Leave with your own piece.",
          },
          {
            title: 'Lunch in the shade',
            description:
              "A long break in a garden restaurant: bissap or ginger juice, dish of the day, a moment to catch your breath before setting off again.",
          },
          {
            title: 'Ouagadougou Cathedral and Zangouettin district',
            description:
              "One of the largest churches in West Africa, built in laterite brick. Around it, an old district where you stroll slowly at the end of the day.",
          },
          {
            title: 'Dinner: brochettes and grills',
            description:
              "The evening ritual: beef or mutton skewers, grilled fish, plantain. You settle outside and take your time.",
          },
        ],
      },
      {
        title: 'Day 3 — Contemporary art and farewell',
        summary:
          'A quieter cultural morning, then free time for last-minute shopping before departure.',
        stops: [
          {
            title: 'Art gallery and artists’ studios',
            description:
              "The Burkinabe contemporary scene is lively. A downtown gallery or an open studio to meet painters and visual artists, often happy to talk.",
          },
          {
            title: 'Speciality coffee and reading break',
            description:
              "A locally roasted coffee, a notebook, the shade of a mango tree: time to write up your impressions before leaving.",
          },
          {
            title: 'Free lunch and last purchases',
            description:
              "Back to the Artisans’ Village or the market for the gifts you spotted, then transfer to the airport or the next stage.",
            tip: 'Allow 45 minutes to reach the airport at peak times.',
          },
        ],
      },
    ],
  },

  {
    slug: 'bobo-dioulasso-culture-4j',
    title: 'Bobo-Dioulasso, cultural capital in 4 days',
    tagline: 'The country’s most musical city, its old town in banco and its green surroundings.',
    intro:
      "Bobo-Dioulasso has a tempo of its own: slower, greener, deeply musical. You come for the great Sudanese-style mosque, the historic Kibidwé district, the balafons that ring out in the evening — and for easy excursions to the waterfalls and the potters’ villages nearby. Four days let you grasp its soul without rushing.",
    audience: ['Music lovers', 'Photographers', 'Couples', 'Families'],
    bestSeason: 'November to February; the end of the rainy season (October) offers very green landscapes',
    highlights: [
      'Great mosque and old town of Kibidwé',
      'Guimbi and the memory of the city',
      'Excursion to Karfiguéla Falls and the Fabédougou Domes',
    ],
    notIncluded: [
      'International flight and visa',
      'Ouagadougou ↔ Bobo-Dioulasso journey (comfort bus or domestic flight)',
      'Travel insurance and tips',
    ],
    days: [
      {
        title: 'Day 1 — Arrival and old town',
        summary:
          'Check-in, then a first walk through the historic district in the late afternoon, in soft light.',
        stops: [
          {
            title: 'Check-in at the hotel',
            description:
              "Choose central accommodation: the old town and the concert venues are then within walking distance.",
          },
          {
            title: 'Guided visit of Kibidwé',
            description:
              "Bobo’s oldest district, in banco: narrow lanes, homes of blacksmith and griot families, a small bridge over the stream. A local guide opens doors and tells the story.",
            tip: 'A contribution for the neighbourhood community is customary, in addition to the guide’s fee.',
          },
          {
            title: 'Dinner on a terrace',
            description:
              "Local and Ivorian-Burkinabe cuisine, often with music. Try tô with an okra or seed sauce.",
          },
        ],
      },
      {
        title: 'Day 2 — Mosque, market and balafons',
        summary:
          'The heritage and musical heart of the city, with an evening dedicated to music.',
        stops: [
          {
            title: 'Great mosque of Bobo-Dioulasso',
            description:
              "An earthen building in Sudanese style, bristling with wooden stakes, built at the end of the 19th century. You admire it from outside; the interior can be visited depending on prayer times and with permission.",
            tip: 'Covering clothing. Ask on site about interior access and the contribution.',
          },
          {
            title: 'Central market and craftsmen’s street',
            description:
              "Fruit, fabrics, ironwork, instruments. Bobo is known for its balafon and djembe makers: you can watch the tuning.",
          },
          {
            title: 'Lunch under the mango trees',
            description:
              "A shaded maquis for rice with sauce or grilled fish, with a nicely chilled tamarind juice.",
          },
          {
            title: 'Introduction to the balafon',
            description:
              "A session with a master balafon player: the history of the instrument, first pentatonic melodies, the place of music in social life.",
          },
          {
            title: 'Concert in a legendary bar',
            description:
              "Bobo is heard at night. Mandingo jazz, reggae or fusion bands in a hall that has seen the great names of the West African scene.",
          },
        ],
      },
      {
        title: 'Day 3 — Excursion to waterfalls and domes',
        summary:
          'A nature day an hour’s drive away, in the Banfora region.',
        stops: [
          {
            title: 'Road to Banfora',
            description:
              "About 1.5 hours’ drive south-west, through sugar cane fields and mango orchards. A private vehicle with driver is recommended for flexibility.",
          },
          {
            title: 'Karfiguéla Falls',
            description:
              "A series of falls and pools in a gallery-forest setting. Swimming is possible in the calm upstream basins, depending on the season and the flow.",
            tip: 'Grippy shoes — the rocks are slippery. Avoid after heavy rain.',
          },
          {
            title: 'Fabédougou Domes',
            description:
              "Sandstone formations in stacked balls, carved by erosion over millions of years. A short walk among the domes, very photogenic at the end of the day.",
          },
          {
            title: 'Lunch in Banfora',
            description:
              "A break in a restaurant in town before the optional Tengéla lake (hippos visible from a pirogue).",
          },
          {
            title: 'Return to Bobo-Dioulasso',
            description: 'Return at the end of the day, free dinner and rest.',
          },
        ],
      },
      {
        title: 'Day 4 — Surrounding villages and departure',
        summary:
          'A morning with the potters or weavers, then transfer.',
        stops: [
          {
            title: 'Potters’ village',
            description:
              "On the outskirts, groups of women shape clay by hand, without a wheel, and fire it in the open air. Demonstration, exchange, direct purchase at a fair price.",
          },
          {
            title: 'Lunch and transfer',
            description:
              "A last meal in town, then road or flight to Ouagadougou / the next stage.",
          },
        ],
      },
    ],
  },

  {
    slug: 'sud-ouest-nature-5j',
    title: 'South-West, nature and Lobi country in 5 days',
    tagline: 'Waterfalls, Sindou Peaks, fortified Lobi dwellings: the most spectacular Burkina.',
    intro:
      "The South-West concentrates the country’s most photogenic landscapes and a culture, that of the Lobi, which has remained very distinctive. This circuit links Banfora and its green region to the Sindou Peaks, then heads down to Gaoua and Lobi country, with its earthen fortress-houses (the soukhala) and a reference museum. Five days, a vehicle with driver, and a guide on the cultural stretches.",
    audience: ['Nature lovers', 'Hikers', 'Ethnography enthusiasts', 'Photographers'],
    bestSeason: 'December to February; October-November for the greenest vegetation',
    highlights: [
      'Tengéla lake and its hippos',
      'Sindou Peaks at sunrise or sunset',
      'Lobi country: fortified soukhala and the Gaoua museum',
    ],
    notIncluded: [
      'International flight and visa',
      'Transport from Ouagadougou',
      'Insurance, drinks and tips',
    ],
    days: [
      {
        title: 'Day 1 — Banfora, sugar cane and lake',
        summary: 'Getting started in the greenest region of the country.',
        stops: [
          {
            title: 'Tengéla lake',
            description:
              "A pirogue outing in search of the hippos that live in the lake. The boatmen know their habits; you keep your distance. Many water birds in the early morning.",
            tip: 'Early morning or late afternoon: better light, more active hippos.',
          },
          {
            title: 'Lunch in Banfora',
            description: 'Fish from the lake or the dam, rice, seasonal vegetables.',
          },
          {
            title: 'Cane fields and sunset',
            description:
              "A walk through the green checkerboard of the sugar plain, by bike or on foot, to a viewpoint for the sunset.",
          },
          {
            title: 'Night in Banfora',
            description: 'Quiet accommodation in town or on the outskirts.',
          },
        ],
      },
      {
        title: 'Day 2 — Waterfalls and domes',
        summary: 'The region’s great natural classics, at a relaxed pace.',
        stops: [
          {
            title: 'Karfiguéla Falls',
            description:
              "Tiered falls and pools in the gallery forest; swimming depending on the flow. A laid-out, shaded path.",
          },
          {
            title: 'Fabédougou Domes',
            description:
              "Stacks of sandstone rounded by erosion. A short walk among the formations, superb in low, raking light.",
          },
          {
            title: 'Picnic lunch',
            description: 'A basket prepared by the hotel, in the shade near the domes.',
          },
          {
            title: 'Second night in Banfora',
            description: 'Back to town, free evening.',
          },
        ],
      },
      {
        title: 'Day 3 — Sindou Peaks',
        summary: 'Road west and a hike through a chiselled sandstone chain.',
        stops: [
          {
            title: 'Road Banfora → Sindou',
            description: 'About 1 hour 15 towards the Malian border, wooded bush landscapes.',
          },
          {
            title: 'Guided hike in the Sindou Peaks',
            description:
              "A natural wall of blades and needles of sandstone, several kilometres long. The local guide knows the passages, the viewpoints and the stories attached to the formations.",
            tip: 'An early start to avoid the heat; 2 to 3 hours’ walk, moderate elevation gain.',
          },
          {
            title: 'Lunch in Sindou',
            description: 'A simple meal in the village before setting off south again.',
          },
          {
            title: 'Night in Gaoua',
            description: 'Arrival in Lobi country at the end of the day.',
          },
        ],
      },
      {
        title: 'Day 4 — Lobi country',
        summary: 'A dense cultural day around Gaoua.',
        stops: [
          {
            title: 'Poni Museum (Gaoua)',
            description:
              "A reference museum on Lobi culture: statuary, altars, social organisation, the relationship with ancestors. Essential before visiting the villages.",
          },
          {
            title: 'Visit of a soukhala',
            description:
              "With a Lobi guide, discover an earthen fortress-house, with no ground-level opening, entered through the roof. Defensive architecture, granaries, altars: everything has a meaning.",
            tip: 'Respecting the rules of the house comes first: follow the guide and the host strictly.',
          },
          {
            title: 'Lunch in Gaoua',
            description: 'Local cuisine: tô, bush sauces, optional millet beer (dolo).',
          },
          {
            title: 'Meeting a Lobi sculptor',
            description:
              "Lobi statuary is sought after by collectors. Workshop, gestures, the symbolism of the figures — and direct purchase possible.",
          },
        ],
      },
      {
        title: 'Day 5 — Return',
        summary: 'A long drive back to Ouagadougou (or a stop in Bobo).',
        stops: [
          {
            title: 'Road Gaoua → Ouagadougou',
            description:
              "Allow 6 to 7 hours with breaks. A comfortable alternative: split the journey with an extra night in Bobo-Dioulasso.",
          },
          {
            title: 'Lunch on the road',
            description: 'A stop in Pâ or Boromo, gateways to the Mouhoun loop.',
          },
        ],
      },
    ],
  },

  {
    slug: 'ranch-nazinga-safari-2j',
    title: 'Nazinga Ranch, elephant safari in 2 days',
    tagline: 'The wildlife of the South, elephants in the wild, 2.5 hours from Ouagadougou.',
    intro:
      "The Nazinga ranch, near the Ghanaian border, is the best place in the country to see elephants in the wild, often within a few dozen metres, along with antelopes, warthogs, monkeys and remarkable birdlife. A short, strong nature escape, ideal as a complement to a stay in Ouagadougou. A night on site, outings at sunrise and sunset, when the animals come closer to the water points.",
    audience: ['Families', 'Wildlife lovers', 'Photographers', 'Short trip from Ouaga'],
    bestSeason: 'December to April: the dry season concentrates the animals around the water reservoirs',
    highlights: [
      'Elephants in the wild at the water points',
      'Safari at sunrise and sunset',
      'A night in a camp at the heart of the ranch',
    ],
    notIncluded: [
      'International flight and visa',
      'Hire of a suitable vehicle (4x4 recommended on the ranch tracks)',
      'Insurance and tips for guide/tracker',
    ],
    days: [
      {
        title: 'Day 1 — Road and first safari',
        summary: 'An early start from Ouagadougou, arriving for the late-afternoon outing.',
        stops: [
          {
            title: 'Road Ouagadougou → Nazinga',
            description:
              "About 2.5 hours, via Pô. The last kilometres are on a dirt track; a 4x4 or a high vehicle is recommended, especially at the end of the rainy season.",
          },
          {
            title: 'Check-in at the ranch camp',
            description:
              "Simple bungalows beside a water reservoir. From the terrace, it is not rare to see animals go by.",
          },
          {
            title: 'Lunch at the camp',
            description: 'Camp cuisine, rest during the hot hours.',
          },
          {
            title: 'Evening safari with a tracker',
            description:
              "In an open vehicle with a ranch tracker: looking for the herds of elephants coming down to drink, watching roan antelopes, kobs, warthogs. Golden light, silence, safe distances respected.",
            tip: 'Neutral clothing, binoculars, no perfume. You stay in the vehicle unless the tracker says otherwise.',
          },
          {
            title: 'Dinner under the stars',
            description:
              "A meal at the camp, a very pure sky far from the city lights, the sounds of the bush.",
          },
        ],
      },
      {
        title: 'Day 2 — Morning safari and return',
        summary: 'The most promising outing, then the road to the capital.',
        stops: [
          {
            title: 'Sunrise safari',
            description:
              "The best window: freshness, active animals, many birds. Two to three hours on the ranch tracks with the tracker.",
          },
          {
            title: 'Late breakfast at the camp',
            description: 'Back to the camp, a shower, packing.',
          },
          {
            title: 'Return to Ouagadougou',
            description:
              "The drive back, arriving in the early afternoon. Possible stop in Pô (market, crafts).",
          },
        ],
      },
    ],
  },
] as unknown as Itinerary[];
