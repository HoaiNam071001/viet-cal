/** `Tết Nguyên Đán` → `tet nguyen dan`, so search works without diacritics. */
export function normalizeVietnamese(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

/** Loose containment check used by search: diacritic- and case-insensitive. */
export function matchesQuery(haystack: string, query: string): boolean {
  const q = normalizeVietnamese(query)
  if (!q) return false
  return normalizeVietnamese(haystack).includes(q)
}
