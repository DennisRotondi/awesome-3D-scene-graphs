// Persistent "read later" bookmarks for papers, stored in localStorage.
// Survives browser restarts; scoped per browser/device.

const STORAGE_KEY = 'bookmarkedPapers';
const CHANGE_EVENT = 'bookmarks-changed';

function read(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.map(String)) : new Set();
  } catch {
    return new Set();
  }
}

function write(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    /* localStorage unavailable (e.g. private mode) -> degrade to in-session only */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getBookmarkCount(): number {
  return read().size;
}

/** Subscribe to bookmark changes; returns an unsubscribe function. */
export function onBookmarksChange(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

export function isBookmarked(id: string): boolean {
  return read().has(id);
}

/** Toggle a paper's bookmark; returns the new bookmarked state. */
export function toggleBookmark(id: string): boolean {
  const ids = read();
  if (ids.has(id)) {
    ids.delete(id);
  } else {
    ids.add(id);
  }
  write(ids);
  return ids.has(id);
}
