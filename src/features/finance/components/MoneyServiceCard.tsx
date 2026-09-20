import { Link } from 'react-router-dom';
import { MapPin, Phone, Landmark, CreditCard, Smartphone, ArrowLeftRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../shared/ui';
import type { MoneyServiceSummary, MoneyServiceType } from '../types';
import styles from './MoneyServiceCard.module.css';

const ICONS: Record<MoneyServiceType, typeof Landmark> = {
  banque: Landmark,
  distributeur: CreditCard,
  mobile_money: Smartphone,
  bureau_change: ArrowLeftRight,
};

export function MoneyServiceCard({ service }: { service: MoneyServiceSummary }) {
  const { t } = useTranslation();
  const Icon = ICONS[service.type] ?? Landmark;
  const location = [service.city, service.region].filter(Boolean).join(', ');

  return (
    <Link to={`/finance/${service.slug}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.iconBanner}>
          <Icon size={30} strokeWidth={1.5} />
        </div>
        <div className={styles.body}>
          <span className={styles.typeLabel}>{t(`finance.types.${service.type}`, service.type)}</span>
          <h3 className={styles.name}>{service.name}</h3>
          {service.operator && <p className={styles.operator}>{service.operator}</p>}
          <div className={styles.footer}>
            {location && (
              <p className={styles.location}>
                <MapPin size={13} strokeWidth={2} />
                {location}
              </p>
            )}
            {service.contact_phone && (
              <span className={styles.phone}>
                <Phone size={13} strokeWidth={2} />
                {service.contact_phone}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
