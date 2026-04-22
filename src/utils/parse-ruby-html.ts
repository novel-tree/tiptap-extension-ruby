export interface ParsedRuby {
  rb: string;
  rt: string;
}

/**
 * Extract `{ rb, rt }` from a `<ruby>` element, tolerant of `<rb>` / `<rp>` /
 * nested spans. Returns `null` if the element isn't a usable ruby structure.
 */
export const parseRubyElement = (element: Element): ParsedRuby | null => {
  if (element.tagName.toLowerCase() !== 'ruby') return null;

  // Collect readings — a ruby may contain multiple <rt> elements (one per rb).
  // For the atom form we flatten them into a single string.
  const rtNodes = Array.from(element.querySelectorAll('rt'));
  const rt = rtNodes.map((n) => n.textContent ?? '').join('').trim();
  if (!rt) return null;

  // Base text is everything else.
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('rt, rp').forEach((n) => n.remove());
  const rb = (clone.textContent ?? '').trim();
  if (!rb) return null;

  return { rb, rt };
};