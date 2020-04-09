import React from "react";
import styles from "./page.module.css";

type PageProps = {
  children: React.ReactNode;
};

function Page({ children }: PageProps) {
  return (
    <div className={styles.page}>
      {children}
    </div>
  );
}

export default Page;
