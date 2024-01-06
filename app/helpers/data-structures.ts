export const moveElement = (items: any[], from: number, to: number) => {
  if (from !== to) {
    const raw = items.filter((_, index) => index !== from);
    const firstPart = raw.slice(0, to);
    const secondPart = raw.slice(to);

    return [...firstPart, items[from], ...secondPart];
  }

  return items;
};
