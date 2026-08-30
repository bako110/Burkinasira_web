import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Building } from 'lucide-react';

import { Button, Spinner, Modal, ConfirmDialog } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import type { TransportProviderDetail } from '../../mobility/types';
import { useMyTransportProviders, useDeleteMyTransportProvider } from '../hooks/useMyEstablishments';
import { EstablishmentListItem } from './EstablishmentListItem';
import { TransportProviderForm } from './TransportProviderForm';
import { EstablishmentDetailPanel } from './EstablishmentDetailPanel';
import styles from './TransportSection.module.css';

export function TransportSection() {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const { data: providers, isLoading } = useMyTransportProviders();
  const deleteProvider = useDeleteMyTransportProvider();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<TransportProviderDetail | undefined>(undefined);
  const [analyticsProvider, setAnalyticsProvider] = useState<TransportProviderDetail | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<TransportProviderDetail | undefined>(undefined);

  if (isLoading) {
    return <Spinner size={22} />;
  }

  if (analyticsProvider) {
    return (
      <EstablishmentDetailPanel
        itemType="transport"
        itemId={analyticsProvider.id}
        name={analyticsProvider.name}
        status={analyticsProvider.status}
        onBack={() => setAnalyticsProvider(undefined)}
      />
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3 className={styles.headerTitle}>{t('pro.myEstablishments')}</h3>
        <Button
          size="sm"
          onClick={() => {
            setEditingProvider(undefined);
            setFormOpen(true);
          }}
        >
          <Plus size={16} strokeWidth={2} />
          {t('pro.addTransport')}
        </Button>
      </div>

      {!providers || providers.length === 0 ? (
        <div className={styles.empty}>
          <Building size={28} strokeWidth={1.5} />
          <p>{t('pro.noEstablishments')}</p>
          <span>{t('pro.noEstablishmentsDesc')}</span>
        </div>
      ) : (
        <div className={styles.list}>
          {providers.map((provider) => (
            <div key={provider.id} className={styles.listItemWrap}>
              <EstablishmentListItem
                name={provider.name}
                photo={undefined}
                typeLabel={t(`mobility.types.${provider.type}`, provider.type)}
                meta={<span>{provider.city ?? provider.region}</span>}
                priceLabel={
                  provider.price_estimate !== undefined
                    ? `${provider.price_estimate.toLocaleString('fr-FR')} ${provider.price_currency}`
                    : undefined
                }
                rating={provider.average_rating}
                reviewCount={provider.review_count}
                status={provider.status}
                statusLabel={t(`pro.establishmentStatus_${provider.status}`, provider.status)}
                onViewAnalytics={() => setAnalyticsProvider(provider)}
                onEdit={() => {
                  setEditingProvider(provider);
                  setFormOpen(true);
                }}
                onDelete={() => setPendingDelete(provider)}
              />
            </div>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingProvider ? t('pro.editEstablishment') : t('pro.addTransport')}
      >
        <TransportProviderForm
          provider={editingProvider}
          onSaved={() => setFormOpen(false)}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('pro.deleteEstablishmentConfirmTitle')}
        message={t('pro.deleteEstablishmentConfirmMessage')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('pro.cancel')}
        variant="danger"
        onCancel={() => setPendingDelete(undefined)}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteProvider.mutate(pendingDelete.id, {
            onSuccess: () => {
              push({ variant: 'success', message: t('pro.establishmentDeleted') });
              setPendingDelete(undefined);
            },
            onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
          });
        }}
      />
    </div>
  );
}
