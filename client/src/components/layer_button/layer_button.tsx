import React from 'react';
import { Button, IconButton } from '../button/button';
import { Layer } from '../layer/layer';

type LayerButtonProps = {
  children: React.ReactNode;
  Content: React.ComponentType<{ close?(): void }>;
};

type InternalLayerButtonProps = {
  ButtonElement: React.ComponentType<{ onClick?(): void }>;
} & LayerButtonProps;

function InternalLayerButton({
  ButtonElement,
  children,
  Content,
}: InternalLayerButtonProps) {
  const [open, setOpen] = React.useState(false);
  const hide = React.useCallback(() => setOpen(false), [setOpen]);
  const show = React.useCallback(() => setOpen(true), [setOpen]);
  return (
    <span>
      <ButtonElement onClick={show}>{children}</ButtonElement>
      {open && (
        <Layer onBackgroundClick={hide}>
          <Content close={hide} />
        </Layer>
      )}
    </span>
  );
}

export const LayerIconButton = (props: LayerButtonProps) => (
  <InternalLayerButton ButtonElement={IconButton} {...props} />
);

export const LayerButton = (props: LayerButtonProps) => (
  <InternalLayerButton ButtonElement={Button} {...props} />
);
