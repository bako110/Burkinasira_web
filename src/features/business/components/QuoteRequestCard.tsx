import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Users } from 'lucide-react';
import clsx from 'clsx';

import { Card } from '../../../shared/ui';
import type { QuoteRequest } from '../types';
import styles from './QuoteRequestCard.module.css';

export function QuoteRequestCard({ quote }: { quote: QuoteRequest }) {
  const { t } = useTranslation();

  return (
    <Link to={`/business/quotes/${quote.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.companyName}>{quote.company_name}</h3>
          <span className={clsx(styles.statusBadge, styles[`status_${quote.status}`])}>
            {t(`business.quoteStatus.${quote.status}`)}
          </span>
        </div>

        <div className={styles.serviceTags}>
          {quote.service_types.map((type) => (
            <span key={type} className={styles.serviceTag}>
              {t(`business.serviceTypes.${type}`)}
            </span>
          ))}
        </div>

        {quote.event_date && (
          <div className={styles.cardRow}>
            <Calendar size={14} strokeWidth={2} />
            <span>{new Date(quote.event_date).toLocaleDateString('fr-FR')}</span>
          </div>
        )}
        <div className={styles.cardRow}>
          <Users size={14} strokeWidth={2} />
          <span>{t('business.participantCountValue', { count: quote.participant_count })}</span>
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
