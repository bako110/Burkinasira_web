import type { ReactElement } from 'react';

import type { ItineraryCoverTheme } from '../types';
import styles from './ItineraryCover.module.css';

interface ItineraryCoverProps {
  theme: ItineraryCoverTheme;
  className?: string;
}

/**
 * Couverture illustrée vectorielle, une par thème d'itinéraire. Pas de photo
 * distante : rendu instantané, jamais cassé, cohérent avec l'identité visuelle
 * BurkinaSira (dégradés savane/coucher de soleil) plutôt que des photos stock
 * sans rapport direct avec le contenu.
 */
export function ItineraryCover({ theme, className }: ItineraryCoverProps) {
  const Illustration = ILLUSTRATIONS[theme];
  return (
    <svg
      className={`${styles.cover} ${className ?? ''}`}
      viewBox="0 0 400 250"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`grad-${theme}`} x1="0" y1="0" x2="1" y2="1">
          {GRADIENTS[theme].map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#grad-${theme})`} />
      <Illustration />
    </svg>
  );
}

const GRADIENTS: Record<ItineraryCoverTheme, [string, string][]> = {
  ouaga: [
    ['0%', '#f2760f'],
    ['55%', '#b5460b'],
    ['100%', '#5c260a'],
  ],
  bobo: [
    ['0%', '#0f9b8e'],
    ['60%', '#0c7d73'],
    ['100%', '#0a3d38'],
  ],
  'sud-ouest': [
    ['0%', '#d97706'],
    ['55%', '#92400e'],
    ['100%', '#451a03'],
  ],
  nazinga: [
    ['0%', '#4d7c0f'],
    ['55%', '#3f6212'],
    ['100%', '#1a2e05'],
  ],
};

/** Soleil + horizon commun à toutes les scènes, dessiné une fois. */
function SkyAndSun() {
  return (
    <>
      <circle cx="320" cy="60" r="34" fill="#ffe9b8" opacity="0.85" />
      <path d="M0,175 Q200,140 400,175 L400,250 L0,250 Z" fill="rgba(0,0,0,0.18)" />
    </>
  );
}

/** Ouagadougou : silhouette urbaine + baobab + oiseau (marché, artisanat). */
function OuagaScene() {
  return (
    <>
      <SkyAndSun />
      {/* Baobab stylisé */}
      <g transform="translate(70,205)">
        <rect x="-6" y="-55" width="12" height="55" rx="4" fill="rgba(0,0,0,0.35)" />
        <ellipse cx="0" cy="-70" rx="38" ry="26" fill="rgba(0,0,0,0.3)" />
        <ellipse cx="-22" cy="-58" rx="16" ry="12" fill="rgba(0,0,0,0.28)" />
        <ellipse cx="24" cy="-60" rx="18" ry="13" fill="rgba(0,0,0,0.28)" />
      </g>
      {/* Silhouette de toits / marché */}
      <g fill="rgba(0,0,0,0.32)">
        <rect x="160" y="165" width="34" height="45" />
        <polygon points="157,165 177,145 197,165" />
        <rect x="205" y="180" width="28" height="30" />
        <polygon points="203,180 219,163 235,180" />
        <rect x="245" y="170" width="40" height="40" />
        <polygon points="242,170 265,148 288,170" />
      </g>
      {/* Oiseaux */}
      <g stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M300,50 q6,-8 12,0 q6,-8 12,0" />
        <path d="M330,70 q5,-7 10,0 q5,-7 10,0" />
      </g>
    </>
  );
}

/** Bobo-Dioulasso : grande mosquée à pieux de bois + balafon. */
function BoboScene() {
  return (
    <>
      <SkyAndSun />
      <g fill="rgba(0,0,0,0.34)">
        {/* Corps de la mosquée */}
        <rect x="120" y="140" width="160" height="70" />
        {/* Pieux de bois dépassant (signature architecturale) */}
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x={128 + i * 17} y={122} width="5" height="26" />
        ))}
        {/* Tours / minarets */}
        <polygon points="140,140 152,80 164,140" />
        <polygon points="236,140 248,70 260,140" />
        <polygon points="188,140 200,55 212,140" />
      </g>
      {/* Balafon stylisé au premier plan */}
      <g transform="translate(60,205)" stroke="rgba(0,0,0,0.4)" strokeWidth="3" fill="none">
        <line x1="0" y1="0" x2="70" y2="-8" />
        <line x1="8" y1="4" x2="8" y2="-10" />
        <line x1="24" y1="1" x2="24" y2="-13" />
        <line x1="40" y1="-1" x2="40" y2="-15" />
        <line x1="56" y1="-4" x2="56" y2="-18" />
      </g>
    </>
  );
}

/** Sud-Ouest : pics de Sindou + cascade. */
function SudOuestScene() {
  return (
    <>
      <SkyAndSun />
      {/* Pics de grès dentelés */}
      <g fill="rgba(0,0,0,0.32)">
        <polygon points="40,210 55,150 65,210" />
        <polygon points="60,210 80,120 95,210" />
        <polygon points="90,210 105,160 118,210" />
        <polygon points="150,210 168,100 188,210" />
        <polygon points="180,210 198,140 212,210" />
        <polygon points="260,210 280,130 300,210" />
        <polygon points="295,210 312,165 326,210" />
      </g>
      {/* Cascade */}
      <g opacity="0.8">
        <path d="M225,95 L233,95 L238,210 L220,210 Z" fill="rgba(255,255,255,0.55)" />
        <path d="M227,95 L231,95 L234,210 L224,210 Z" fill="rgba(255,255,255,0.85)" />
      </g>
    </>
  );
}

/** Nazinga : éléphant + savane. */
function NazingaScene() {
  return (
    <>
      <SkyAndSun />
      {/* Acacia parasol */}
      <g transform="translate(310,190)" fill="rgba(0,0,0,0.3)">
        <rect x="-3" y="-15" width="6" height="30" />
        <ellipse cx="0" cy="-25" rx="55" ry="10" />
      </g>
      {/* Éléphant stylisé */}
      <g transform="translate(120,195)" fill="rgba(0,0,0,0.38)">
        <ellipse cx="0" cy="0" rx="46" ry="26" />
        <circle cx="-40" cy="-14" r="20" />
        <path d="M-58,-10 q-10,10 -6,26 q6,4 10,-2 Z" />
        <polygon points="-52,-30 -44,-42 -38,-28" />
        <rect x="-18" y="18" width="8" height="16" />
        <rect x="4" y="20" width="8" height="16" />
        <rect x="20" y="18" width="8" height="16" />
        <rect x="34" y="14" width="8" height="16" />
      </g>
    </>
  );
}

const ILLUSTRATIONS: Record<ItineraryCoverTheme, () => ReactElement> = {
  ouaga: OuagaScene,
  bobo: BoboScene,
  'sud-ouest': SudOuestScene,
  nazinga: NazingaScene,
};
