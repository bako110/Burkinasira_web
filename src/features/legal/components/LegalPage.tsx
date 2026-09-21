import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollText } from 'lucide-react';

import { Reveal } from '../../../shared/ui/Reveal';
import styles from './LegalPage.module.css';

interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalPageProps {
  icon?: ReactNode;
  title: string;
  updatedLabel: string;
  intro: ReactNode;
  sections: LegalSection[];
}

export function LegalPage({ icon, title, updatedLabel, intro, sections }: LegalPageProps) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>{icon ?? <ScrollText size={22} strokeWidth={1.75} />}</span>
          <h1 className={styles.heroTitle}>{title}</h1>
          <p className={styles.heroMeta}>{updatedLabel}</p>
        </div>
      </div>

      <div className={styles.body}>
        <aside className={styles.toc}>
          <span className={styles.tocKicker}>{t('legal.tableOfContents')}</span>
          <nav className={styles.tocNav}>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={s.id === activeId ? `${styles.tocLink} ${styles.tocLinkActive}` : styles.tocLink}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className={styles.content}>
          <Reveal className={styles.intro}>{intro}</Reveal>

          {sections.map((s, i) => (
            <Reveal key={s.id} delay={Math.min(i, 6) * 40}>
              <section id={s.id} className={styles.section}>
                <h2 className={styles.sectionTitle}>{s.title}</h2>
                <div className={styles.sectionBody}>{s.body}</div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
