import React, { ChangeEvent } from "react";
import classNames from "classnames";
import styles from "./input.module.css";

type InputProps = {
  name?: string;
  error?: boolean;
  type?: "text" | "password";
  placeholder?: string;
  onChange?(value: string): void;
  value?: string;
};

export const Input = ({
  type,
  error,
  name,
  placeholder,
  value,
  onChange,
}: InputProps) => {
  const change = React.useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      onChange?.(value);
    },
    [onChange]
  );
  return (
    <input
      name={name}
      type={type || "text"}
      onChange={change}
      className={classNames(styles.input, { [styles.errored]: error })}
      placeholder={placeholder}
      value={value}
    />
  );
};
