import React from "react";
import styles from "./page.module.css";
import Header from "../header/header";

type PageProps = {
  children: React.ReactNode;
};

function Page({ children }: PageProps) {
  return (
    <div className={styles.page}>
      <Header />
      {children}
    </div>
  );
}

export default Page;
