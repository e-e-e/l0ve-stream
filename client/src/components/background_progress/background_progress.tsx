import * as React from 'react';
import styles from './background_progress.module.css';

export const BackgroundProgress = ({ progress }: { progress: number }) => {
  if (!progress) return <></>;
  return (
    <div className={styles.progress}>
      <div
        className={styles.left}
        style={{ transform: `scaleY(${progress})` }}
      />
      <div
        className={styles.right}
        style={{ transform: `scaleY(${progress})` }}
      />
      <div
        className={styles.indicatorContainer}
        style={{ transform: `translateY(${progress * 100}%)` }}
      >
        <div className={styles.indicator} />
      </div>
    </div>
  );
};
