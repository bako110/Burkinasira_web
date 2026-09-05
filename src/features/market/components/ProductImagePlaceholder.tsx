import {
  Shirt,
  Gem,
  Palette,
  Hammer,
  Sprout,
  Cookie,
  Gift,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';
import clsx from 'clsx';

import type { ProductCategory } from '../types';
import styles from './ProductImagePlaceholder.module.css';

const CATEGORY_ICON: Record<ProductCategory, LucideIcon> = {
  tissus_vetements: Shirt,
  bijoux: Gem,
  poterie: Palette,
  sculpture: Hammer,
  objet_art: Palette,
  produit_agricole: Sprout,
  produit_alimentaire: Cookie,
  souvenir: Gift,
};

interface ProductImagePlaceholderProps {
  category?: ProductCategory;
  /** Diamètre de l'icône. Défaut adapté à une vignette de carte. */
  iconSize?: number;
  className?: string;
}

/**
 * Remplace l'absence de photo produit par un visuel plein : un dégradé savane et
 * l'icône de la catégorie (poterie, bijoux, tissu…). Remplit son conteneur ;
 * c'est l'appelant qui fixe la taille et le rayon.
 */
export function ProductImagePlaceholder({
  category,
  iconSize = 28,
  className,
}: ProductImagePlaceholderProps) {
  const Icon = (category && CATEGORY_ICON[category]) || ShoppingBag;
  return (
    <div className={clsx(styles.placeholder, className)} aria-hidden="true">
      <Icon size={iconSize} strokeWidth={1.5} className={styles.icon} />
    </div>
  );
}
