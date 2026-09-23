import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, HeartPulse } from 'lucide-react';

import { Button, Spinner, Modal, ConfirmDialog, Reveal } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import type { HealthFacilityDetail } from '../../health/types';
import { useMyHealthFacilities, useDeleteMyHealthFacility } from '../hooks/useMyEstablishments';
import { EstablishmentListItem } from './EstablishmentListItem';
import { HealthFacilityForm } from './HealthFacilityForm';
import styles from './HotelSection.module.css';

export function HealthFacilitySection() {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const { data: facilities, isLoading } = useMyHealthFacilities();
  const deleteFacility = useDeleteMyHealthFacility();

  const [formOpen, setFormOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<HealthFacilityDetail | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<HealthFacilityDetail | undefined>(undefined);

  if (isLoading) {
    return <Spinner size={22} />;
  }

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3 className={styles.headerTitle}>{t('pro.myEstablishments')}</h3>
        <Button
          size="sm"
          onClick={() => {
            setEditingFacility(undefined);
            setFormOpen(true);
          }}
        >
          <Plus size={16} strokeWidth={2} />
          {t('pro.addHealthFacility')}
        </Button>
      </div>

      {!facilities || facilities.length === 0 ? (
        <div className={styles.empty}>
          <HeartPulse size={28} strokeWidth={1.5} />
          <p>{t('pro.noEstablishments')}</p>
          <span>{t('pro.noEstablishmentsDesc')}</span>
        </div>
      ) : (
        <div className={styles.list}>
          {facilities.map((facility, i) => (
            <Reveal key={facility.id} delay={Math.min(i, 8) * 50}>
              <div className={styles.listItemWrap}>
                <EstablishmentListItem
                  name={facility.name}
                  typeLabel={t(`health.types.${facility.type}`, facility.type)}
                  meta={<span>{facility.city ?? facility.region}</span>}
                  status={facility.status}
                  statusLabel={facility.status ? t(`pro.establishmentStatus_${facility.status}`, facility.status) : undefined}
                  onEdit={() => {
                    setEditingFacility(facility);
                    setFormOpen(true);
                  }}
                  onDelete={() => setPendingDelete(facility)}
                />
              </div>
            </Reveal>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingFacility ? t('pro.editEstablishment') : t('pro.addHealthFacility')}
      >
        <HealthFacilityForm
          facility={editingFacility}
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
          deleteFacility.mutate(pendingDelete.id, {
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
