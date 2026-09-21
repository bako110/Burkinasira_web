import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, Briefcase } from 'lucide-react';
import clsx from 'clsx';

import { Card } from '../../../shared/ui';
import type { QuoteRequest } from '../types';
import styles from './QuoteRequestCard.module.css';

export function QuoteRequestCard({ quote }: { quote: QuoteRequest }) {
  const { t } = useTranslation();
  const visibleTags = quote.service_types.slice(0, 3);
  const extraCount = quote.service_types.length - visibleTags.length;

  return (
    <Link to={`/business/quotes/${quote.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.iconWrap}>
          <Briefcase size={18} strokeWidth={1.75} />
        </div>

        <div className={styles.cardHeader}>
          <h3 className={styles.companyName}>{quote.company_name}</h3>
          <span className={clsx(styles.statusBadge, styles[`status_${quote.status}`])}>
            {t(`business.quoteStatus.${quote.status}`)}
          </span>
        </div>

        <div className={styles.serviceTags}>
          {visibleTags.map((type) => (
            <span key={type} className={styles.serviceTag}>
              {t(`business.serviceTypes.${type}`)}
            </span>
          ))}
          {extraCount > 0 && <span className={styles.serviceTag}>+{extraCount}</span>}
        </div>

        <div className={styles.metaRow}>
          {quote.event_date && (
            <span className={styles.cardRow}>
              <Calendar size={14} strokeWidth={2} />
              {new Date(quote.event_date).toLocaleDateString('fr-FR')}
            </span>
          )}
          <span className={styles.cardRow}>
            <Users size={14} strokeWidth={2} />
            {t('business.participantCountValue', { count: quote.participant_count })}
          </span>
        </div>

        {typeof quote.quoted_amount === 'number' && (
          <p className={styles.quotedAmount}>
            {quote.quoted_amount.toLocaleString('fr-FR')} {quote.currency}
          </p>
        )}
      </Card>
    </Link>
  );
}
