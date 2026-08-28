import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCreateFavoriteList } from '../hooks/useFavoriteLists';
import styles from './CreateFavoriteListModal.module.css';

interface CreateFavoriteListModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateFavoriteListModal({ open, onClose }: CreateFavoriteListModalProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useCreateFavoriteList();
  const [name, setName] = useState('');

  function resetAndClose() {
    setName('');
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      { name },
      {
        onSuccess: () => {
          push({ variant: 'success', message: t('community.listCreated') });
          resetAndClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  return (
    <Modal open={open} onClose={resetAndClose} title={t('community.createListTitle')}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label={t('community.listNameLabel')}
          name="favorite-list-name"
          required
          minLength={1}
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, t('common.error'))}</p>}
        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? <Spinner size={18} /> : t('community.createList')}
        </Button>
      </form>
    </Modal>
  );
}
