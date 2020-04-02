import React, { PropsWithChildren, ReactEventHandler } from "react";
import classNames from "classnames";
import styles from "./button.module.css";

type ButtonProps = {
  onClick?: ReactEventHandler;
  type?: "submit";
  href?: string;
  disabled?: boolean;
};

export const Button = ({
  type,
  href,
  disabled,
  onClick,
  children,
}: PropsWithChildren<ButtonProps>) => {
  const buttonClass = classNames(styles.reset, styles.baseButton, {
    [styles.disabled]: disabled,
  });
  return (
    <button className={buttonClass} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
};
