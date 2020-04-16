import style from "./layer.module.css";
import React, { MouseEvent, PropsWithChildren } from "react";
import ReactDOM from "react-dom";

class Layers {
  private layers: HTMLElement[] = [];
  private root: HTMLElement | null = null;

  push(): HTMLDivElement {
    const element = document.createElement("div");
    if (!this.root) {
      this.root = document.createElement("div");
      document.body.style.overflow = "hidden";
      document.body.append(this.root);
    }
    this.layers.push(element);
    this.root.append(element);
    return element;
  }
  pop() {
    const element = this.layers.pop();
    element?.parentElement?.removeChild(element);
    if (this.layers.length === 0 && this.root) {
      document.body.removeChild(this.root);
      document.body.style.overflow = "scroll";
      this.root = null;
    }
  }
}

const layers = new Layers();

type LayerProps = {
  onBackgroundClick?(e: MouseEvent): void;
};

const LayerInternal = ({
  children,
  onBackgroundClick,
}: PropsWithChildren<LayerProps>) => {
  const onClick = React.useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onBackgroundClick?.(e);
      }
    },
    [onBackgroundClick]
  );
  return (
    <div className={style.layer} onClick={onClick}>
      <div className={style.layerContainer}>{children}</div>
    </div>
  );
};

export const Layer = (props: PropsWithChildren<LayerProps>) => {
  const [layerElement, setLayerElement] = React.useState<HTMLDivElement>();
  React.useEffect(() => {
    const layer = layers.push();
    setLayerElement(layer);
    return () => {
      layers.pop();
    };
  }, []);
  if (!layerElement) return <></>;
  return ReactDOM.createPortal(<LayerInternal {...props} />, layerElement);
};
