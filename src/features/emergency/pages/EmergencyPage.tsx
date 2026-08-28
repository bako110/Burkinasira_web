import { useState } from 'react';
import { ShieldAlert, Siren, FileWarning } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Spinner, Reveal, EmptyResults, Button } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useEmergencyContacts } from '../hooks/useEmergencyContacts';
import { useSecurityAlerts } from '../hooks/useSecurityAlerts';
import { EmergencyContactCard } from '../components/EmergencyContactCard';
import { SecurityAlertBanner } from '../components/SecurityAlertBanner';
import { SOSModal } from '../components/SOSModal';
import { ReportIncidentModal } from '../components/ReportIncidentModal';
import styles from './EmergencyPage.module.css';

export function EmergencyPage() {
  const { t } = useTranslation();
  const requireAuth = useRequireAuth();
  const { data: contacts, isLoading: isLoadingContacts, isError, refetch } = useEmergencyContacts();
  const { data: alerts, isLoading: isLoadingAlerts } = useSecurityAlerts();
  const [sosOpen, setSosOpen] = useState(false);
  const [incidentOpen, setIncidentOpen] = useState(false);

  const activeAlerts = alerts?.filter((a) => a.is_active) ?? [];
  const activeContacts = contacts?.filter((c) => c.is_active) ?? [];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>
            <ShieldAlert size={28} strokeWidth={1.75} />
          </span>
          <h1 className={styles.heroTitle}>{t('emergency.title')}</h1>
          <p className={styles.heroSubtitle}>{t('emergency.subtitle')}</p>
          <div className={styles.heroActions}>
            <Button
              variant="danger"
              onClick={() => requireAuth(() => setSosOpen(true), t('emergency.sosRequiresAuth'))}
            >
              <Siren size={16} strokeWidth={2} />
              {t('emergency.sosTrigger')}
            </Button>
            <Button variant="secondary" onClick={() => setIncidentOpen(true)}>
              <FileWarning size={16} strokeWidth={2} />
              {t('emergency.reportIncidentCta')}
            </Button>
          </div>
        </div>
      </section>

      <SOSModal open={sosOpen} onClose={() => setSosOpen(false)} />
      <ReportIncidentModal open={incidentOpen} onClose={() => setIncidentOpen(false)} />

      <div className={styles.body}>
        {!isLoadingAlerts && activeAlerts.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('emergency.alertsTitle')}</h2>
            <div className={styles.alertList}>
              {activeAlerts.map((alert, i) => (
                <Reveal key={alert.id} delay={i * 60}>
                  <SecurityAlertBanner alert={alert} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('emergency.contactsTitle')}</h2>

          {isLoadingContacts && (
            <div className={styles.center}>
              <Spinner size={24} />
            </div>
          )}

          {!isLoadingContacts && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

          {!isLoadingContacts && !isError && activeContacts.length === 0 && (
            <EmptyResults variant="empty" title={t('emergency.empty')} text={t('explore.emptyText')} />
          )}

          {!isLoadingContacts && !isError && activeContacts.length > 0 && (
            <div className={styles.contactGrid}>
              {activeContacts.map((contact, i) => (
                <Reveal key={contact.id} delay={Math.min(i, 8) * 50}>
                  <EmergencyContactCard contact={contact} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
