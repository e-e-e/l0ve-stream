import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import React, { PropsWithChildren } from 'react';

type DraggableListProps = {
  onDrop(result: DropResult): void;
};

export const DraggableList = ({
  onDrop,
  children,
}: PropsWithChildren<DraggableListProps>) => {
  return (
    <DragDropContext onDragEnd={onDrop}>
      <Droppable droppableId="draggable-list">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
