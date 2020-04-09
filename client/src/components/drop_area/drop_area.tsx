import React, { PropsWithChildren, useState } from "react";
import styles from "./drop_area.module.css";
import classNames from "classnames";

type DropAreaProps = {
  onFileDrop?(file: Blob): Promise<void> | void;
};

export const DropArea = ({
  onFileDrop,
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
    [over, setOver]
  );
  const onLeave = React.useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      over && setOver(false);
    },
    [over, setOver]
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
          await onFileDrop(files[i]);
        }
      } finally {
        setProcessing(false);
      }
    },
    [setProcessing, setOver, processing]
  );
  console.log('processing', processing);
  return (
    <div
      onDragOver={onEnter}
      onDragEnter={onEnter}
      onDragEnd={onLeave}
      onDragLeave={onLeave}
      onDrop={onDropHandler}
      className={classNames(styles.container, { [styles.over]: over, [styles.processing]: processing})}
    >
      {children}
      <div className={styles.overlay}></div>
    </div>
  );
};
