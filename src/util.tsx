export const debug = window.location.search.indexOf("debug") > 0;

export function toCssClass(s: string | null) {
  if (s === null) return "";
  return s.toLowerCase().replaceAll(" ", "-");
}
