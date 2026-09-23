import { useEffect, useRef } from 'react';

/**
 * Observe un élément sentinelle en bas de liste et déclenche `onIntersect`
 * (chargement de la page suivante) tant qu'il reste dans le viewport,
 * contrairement à `useInView` qui ne se déclenche qu'une seule fois.
 */
export function useInfiniteScrollSentinel<T extends HTMLElement>(
  onIntersect: () => void,
  { enabled = true, rootMargin = '400px' }: { enabled?: boolean; rootMargin?: string } = {},
) {
  const ref = useRef<T | null>(null);
  const onIntersectRef = useRef(onIntersect);
  onIntersectRef.current = onIntersect;

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersectRef.current();
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return ref;
}
