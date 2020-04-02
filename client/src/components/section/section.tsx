import React, {PropsWithChildren} from "react";
import styles from './section.module.css';

export const Section = (props: PropsWithChildren<{}>) => {
  return <section className={styles.section}>{props.children}</section>;
}
