import styles from './CardSkeleton.module.css';

export function CardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.image} />
      <div className={styles.body}>
        <div className={styles.line} style={{ width: '70%' }} />
        <div className={styles.line} style={{ width: '45%' }} />
      </div>
    </div>
  );
}
