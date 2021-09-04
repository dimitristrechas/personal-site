export const normalizeText = (input: string): string => {
  // normalize and uppercase search value
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
};
