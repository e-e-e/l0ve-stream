import React from "react";
import classNames from "classnames";
import styles from "./typography.module.css";

type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle" | "body";
type Color = "black" | "grey" | "white"; // #8D8D8D

const defaultVariantMapping: Record<Variant, string> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  subtitle: "p",
  body: "p",
};
type TypographyProps = {
  variant?: Variant;
  align?: "left" | "right" | "center";
  color?: Color;
  wrap?: boolean;
};

type VariantComponentTypes =
  | React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >
  | React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    >;

export const Typography = (props: React.PropsWithChildren<TypographyProps>) => {
  const { variant, children, align, wrap, color } = props;
  const Component = (defaultVariantMapping[
    variant || "body"
  ] as any) as React.ComponentType<VariantComponentTypes>;
  return (
    <Component
      className={classNames(
        styles.typography,
        styles[align || variant === "h1" ? "center" : "left"],
        styles[color || variant === "subtitle" ? "grey" : "black"],
        {
          [styles.noWrap]: wrap === false,
        }
      )}
    >
      {children}
    </Component>
  );
};
