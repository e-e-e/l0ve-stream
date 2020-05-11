import React, { PropsWithChildren } from 'react';
import styles from './drop_area.module.css';
import classNames from 'classnames';
import { CloudIcon, Spinner } from '../icons/icons';

type DropAreaProps = {
  onFileDrop?(file: Blob): Promise<void> | void;
  overlayText?: string;
};

export const DropArea = ({
  onFileDrop,
  overlayText,
  children,
}: PropsWithChildren<DropAreaProps>) => {
  const [over, setOver] = React.useState<boolean>(false);
  const [processing, setProcessing] = React.useState<boolean>(false);

  const onEnter = React.useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      !over && setOver(true);
    },
    [over, setOver],
  );
  const onLeave = React.useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      over && setOver(false);
    },
    [over, setOver],
  );
  const onDropHandler = React.useCallback(
    async (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setOver(false);
      if (!onFileDrop || processing) return;
      setProcessing(true);
      try {
        const files = e.dataTransfer?.files ?? [];
        for (let i = 0; i < files.length; i++) {
          console.log(files[i].name);
          await onFileDrop(files[i]);
        }
      } finally {
        setProcessing(false);
      }
    },
    [onFileDrop, setProcessing, setOver, processing],
  );
  return (
    <div
      onDragOver={onEnter}
      onDragEnter={onEnter}
      onDragEnd={onLeave}
      onDragLeave={onLeave}
      onDrop={onDropHandler}
      className={classNames(styles.container, {
        [styles.over]: over || processing,
      })}
    >
      {children}
      <div className={styles.overlay}>
        <div className={styles.overlayContent}>
          <div>{!processing ? <CloudIcon /> : <Spinner />}</div>
          {overlayText && <div>{!processing ? overlayText : ''}</div>}
        </div>
      </div>
    </div>
  );
};
