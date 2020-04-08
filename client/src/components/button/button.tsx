import React, { PropsWithChildren, ReactEventHandler } from "react";
import classNames from "classnames";
import styles from "./button.module.css";

type CommonProps = {
  variant?: "basic" | "icon";
  onClick?: ReactEventHandler;
  disabled?: boolean;
  children?: React.ReactNode;
};

type CommonButtonProps = {
  type: "submit" | "button";
};

type CommonLinkProps = {
  type: "link";
  href: string;
};
type ButtonOrLinkProps = CommonProps & (CommonButtonProps | CommonLinkProps);

const UnstyledButtonOrLink = (props: ButtonOrLinkProps) => {
  const buttonClass = classNames(styles.reset, {
    [styles.disabled]: props.disabled,
    [styles.basicButton]: props.variant === "basic",
    [styles.iconButton]: props.variant === "icon",
  });
  if (props.type === "link") {
    // need to prevent navigation if disabled
    return (
      <a className={buttonClass} onClick={props.onClick} href={props.href}>
        {props.children}
      </a>
    );
  }
  return (
    <button
      className={buttonClass}
      onClick={props.onClick}
      type={props.type === "submit" ? "submit" : undefined}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

type ButtonProps = Omit<CommonProps, "variant"> &
  Omit<CommonButtonProps, "type"> & { type?: "submit" };
type LinkProps = Omit<CommonProps, "variant"> & Omit<CommonLinkProps, "type">;

export const Button = (props: ButtonProps) => (
  <UnstyledButtonOrLink
    {...props}
    type={props.type || "button"}
    variant="basic"
  />
);
export const IconButton = (props: ButtonProps) => (
  <UnstyledButtonOrLink
    {...props}
    type={props.type || "button"}
    variant="icon"
  />
);

export const Link = (props: LinkProps) => (
  <UnstyledButtonOrLink {...props} type="link" variant="basic" />
);
export const IconLink = (props: LinkProps) => (
  <UnstyledButtonOrLink {...props} type="link" variant="icon" />
);
