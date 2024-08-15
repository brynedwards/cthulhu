export const debug = window.location.search.indexOf("debug") > 0;

export function toCssClass(s: string) {
  return s.toLowerCase().replaceAll(" ", "-");
}
