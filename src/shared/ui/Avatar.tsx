import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

import styles from './Avatar.module.css';

interface AvatarProps {
  /** URL de la photo. Absente, vide ou en échec de chargement -> initiale ou icône. */
  src?: string | null;
  /** Nom complet : sert à afficher une initiale plutôt que l'icône générique. */
  name?: string | null;
  /** Diamètre en pixels. */
  size?: number;
  className?: string;
}

/**
 * Avatar robuste : tente la photo, et retombe proprement sur l'initiale du nom
 * (ou une icône) si l'URL est absente OU si l'image échoue à charger — ce qui
 * arrive avec certaines photos Google (`picture`) bloquées ou expirées.
 */
export function Avatar({ src, name, size = 32, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImage = Boolean(src) && !failed;
  const initial = name?.trim()?.[0]?.toUpperCase() ?? '';

  return (
    <span
      className={[styles.avatar, className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <img
          src={src as string}
          alt=""
          className={styles.img}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : initial ? (
        <span className={styles.initial} style={{ fontSize: Math.round(size * 0.42) }}>
          {initial}
        </span>
      ) : (
        <User size={Math.round(size * 0.5)} strokeWidth={2} />
      )}
    </span>
  );
}
