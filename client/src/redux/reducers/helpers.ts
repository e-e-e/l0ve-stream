
export type GroupedById<T> = { byId: Record<string, T>; allIds: string[] };

export function groupByIds<T extends { id: string }>(data: T[]): GroupedById<T> {
  return data.reduce(
    (p: GroupedById<T>, c: T) => {
      p.byId[c.id] = c;
      p.allIds.push(c.id);
      return p;
    },
    { byId: {}, allIds: [] }
  );
}

export enum LoadingState {
  INITIAL,
  LOADING,
  SYNCING,
  LOADED,
  ERROR,
}
