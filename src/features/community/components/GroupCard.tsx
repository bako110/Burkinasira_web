import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Lock, MapPin, Tag, UsersRound } from 'lucide-react';

import { useAuthStore } from '../../../store/auth.store';
import type { Group } from '../types';
import styles from './GroupCard.module.css';

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const { t } = useTranslation();
  const userId = useAuthStore((s) => s.user?.id);
  const isMember = userId ? group.member_ids.includes(userId) : false;

  return (
    <Link to={`/community/groups/${group.id}`} className={styles.card}>
      <div className={styles.cover}>
        {group.cover_photo ? (
          <img src={group.cover_photo} alt="" className={styles.coverImg} />
        ) : (
          <div className={styles.coverPlaceholder}>
            <UsersRound size={32} strokeWidth={1.5} />
          </div>
        )}
        {!group.is_public && (
          <span className={styles.lockBadge}>
            <Lock size={12} strokeWidth={2} />
          </span>
        )}
        {isMember && <span className={styles.memberBadge}>{t('community.alreadyMember')}</span>}
      </div>

      <div className={styles.info}>
        <span className={styles.name}>{group.name}</span>
        {group.description && <p className={styles.description}>{group.description}</p>}

        {(group.region || group.theme) && (
          <div className={styles.tags}>
            {group.region && (
              <span className={styles.tag}>
                <MapPin size={11} strokeWidth={2} />
                {group.region}
              </span>
            )}
            {group.theme && (
              <span className={styles.tag}>
                <Tag size={11} strokeWidth={2} />
                {t(`community.themes.${group.theme}`, group.theme)}
              </span>
            )}
          </div>
        )}

        <span className={styles.memberCount}>
          <Users size={13} strokeWidth={2} />
          {t('community.memberCount', { count: group.member_ids.length })}
        </span>
      </div>
    </Link>
  );
}
