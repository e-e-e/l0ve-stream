import React from "react";
import styles from "./grid_card.module.css";
import classNames from "classnames";

type GridProps = {
  onClick?: () => void;
  topLeft?: React.ReactNode;
  bottomLeft?: React.ReactNode;
  bottomRight?: React.ReactNode;
  info?: {
    top?: string;
    bottom?: string;
  };
};
export const GridCard = (props: GridProps) => {
  const { topLeft, bottomLeft, bottomRight, info, onClick } = props;
  return (
    <div className={classNames(styles.gridContainer, { [styles.clickable]: !!onClick })} onClick={onClick}>
      <div className={styles.gridTop}>
        <div className={classNames(styles.gridLeft, styles.item)}>
          {topLeft}
        </div>
        <div className={styles.gridRight}>
          <div className={styles.aspect}>
            <div className={classNames(styles.info, styles.fill)}>
              <svg style={{ width: "100%", height: "100%" }}>
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="0"
                  style={{ stroke: "rgb(0,0,0)", strokeWidth: 1 }}
                />
              </svg>
            </div>
            <div
              className={classNames(styles.infoTop, styles.info, styles.item)}
            >
              {info?.top}
            </div>
            <div
              className={classNames(
                styles.infoBottom,
                styles.info,
                styles.item
              )}
            >
              {info?.bottom}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.gridBottom}>
        <div className={classNames(styles.gridLeft, styles.item)}>
          {bottomLeft}
        </div>
        <div className={classNames(styles.gridRight)}>
          <div className={styles.item}>{bottomRight}</div>
        </div>
      </div>
    </div>
  );
};
