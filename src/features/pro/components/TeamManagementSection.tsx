import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, Trash2, Users } from 'lucide-react';

import { Button, Spinner, ConfirmDialog } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import { useTeamMembers, useInviteTeamMember, useRemoveTeamMember } from '../hooks/useTeamMembers';
import type { ProviderItemType, TeamMember, TeamMemberRole } from '../types';
import styles from './TeamManagementSection.module.css';

const ROLES: TeamMemberRole[] = ['manager', 'staff'];

interface TeamManagementSectionProps {
  itemType: ProviderItemType;
  itemId: string;
}

export function TeamManagementSection({ itemType, itemId }: TeamManagementSectionProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const { data: members, isLoading } = useTeamMembers(itemType, itemId);
  const inviteTeamMember = useInviteTeamMember();
  const removeTeamMember = useRemoveTeamMember(itemType, itemId);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMemberRole>('manager');
  const [pendingRemove, setPendingRemove] = useState<TeamMember | undefined>(undefined);

  function handleInvite(e: FormEvent) {
    e.preventDefault();
    inviteTeamMember.mutate(
      { email, role, establishment_type: itemType, establishment_id: itemId },
      {
        onSuccess: () => {
          push({ variant: 'success', message: t('pro.teamMemberInvited') });
          setEmail('');
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  return (
    <div className={styles.section}>
      <form onSubmit={handleInvite} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="team_email" className={styles.label}>
            {t('pro.inviteByEmail')}
          </label>
          <input
            id="team_email"
            type="email"
            className={styles.input}
            required
            placeholder="manager@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="team_role" className={styles.label}>
            {t('pro.teamRole')}
          </label>
          <select
            id="team_role"
            className={styles.select}
            value={role}
            onChange={(e) => setRole(e.target.value as TeamMemberRole)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {t(`pro.teamRole_${r}`)}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={inviteTeamMember.isPending}>
          {inviteTeamMember.isPending ? <Spinner size={16} /> : <UserPlus size={16} strokeWidth={2} />}
          {t('pro.invite')}
        </Button>
      </form>

      {isLoading ? (
        <Spinner size={22} />
      ) : !members || members.length === 0 ? (
        <div className={styles.empty}>
          <Users size={24} strokeWidth={1.5} />
          <p>{t('pro.noTeamMembers')}</p>
        </div>
      ) : (
        <div className={styles.list}>
          {members.map((member) => (
            <div key={member.id} className={styles.memberRow}>
              <div className={styles.memberInfo}>
                <span className={styles.memberEmail}>{member.email}</span>
                <span className={styles.memberMeta}>
                  <span className={styles.roleBadge}>{t(`pro.teamRole_${member.role}`)}</span>
                  {!member.user_id && <span className={styles.pendingTag}>{t('pro.invitePending')}</span>}
                </span>
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => setPendingRemove(member)}
                aria-label={t('common.delete')}
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingRemove)}
        title={t('pro.removeTeamMemberConfirmTitle')}
        message={t('pro.removeTeamMemberConfirmMessage')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('pro.cancel')}
        variant="danger"
        onCancel={() => setPendingRemove(undefined)}
        onConfirm={() => {
          if (!pendingRemove) return;
          removeTeamMember.mutate(pendingRemove.id, {
            onSuccess: () => {
              push({ variant: 'success', message: t('pro.teamMemberRemoved') });
              setPendingRemove(undefined);
            },
            onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
          });
        }}
      />
    </div>
  );
}
