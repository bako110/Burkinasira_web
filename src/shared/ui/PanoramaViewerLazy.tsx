import { Suspense, lazy } from 'react';

import type { PanoramaViewer as PanoramaViewerType } from './PanoramaViewer';

const PanoramaViewerImpl = lazy(() =>
  import('./PanoramaViewer').then((m) => ({ default: m.PanoramaViewer })),
);

type Props = Parameters<typeof PanoramaViewerType>[0];

/**
 * Wrapper qui ne charge Pannellum (~60 Ko gzip) que lorsqu'une visite 360° est
 * réellement ouverte. Rien n'est rendu tant que `open` est faux, donc rien
 * n'est téléchargé au montage de la page.
 */
export function PanoramaViewer(props: Props) {
  if (!props.open) return null;
  return (
    <Suspense fallback={null}>
      <PanoramaViewerImpl {...props} />
    </Suspense>
  );
}
