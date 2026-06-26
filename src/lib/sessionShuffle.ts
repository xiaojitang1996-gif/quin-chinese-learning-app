const sessionSeed = Math.random().toString(36).slice(2);

function hashText(value: string) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function shuffleItems<T>(items: T[], seed: string) {
  return [...items]
    .map((item, index) => ({
      item,
      weight: hashText(`${seed}-${index}-${JSON.stringify(item)}`)
    }))
    .sort((a, b) => a.weight - b.weight)
    .map(({ item }) => item);
}

export function getSessionShuffledItems<T>(items: T[], key: string) {
  return shuffleItems(items, `${sessionSeed}-${key}`);
}

