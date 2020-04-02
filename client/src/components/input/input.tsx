import React from "react";
import classNames from "classnames";
import styles from "./input.module.css";

type InputProps = {
  name?: string;
  error?: boolean;
  type?: "text" | "password";
  placeholder?: string;
};

export const Input = ({ type, error, name, placeholder }: InputProps) => {
  return (
    <input
      name={name}
      type={type || "text"}
      className={classNames(styles.input, { [styles.errored]: error })}
      placeholder={placeholder}
    />
  );
};
