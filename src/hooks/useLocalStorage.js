import { useCallback, useSyncExternalStore } from "react";

/**
 * A tiny shared localStorage store.
 * Every component using the same key stays in sync (also across browser tabs),
 * and it falls back to in-memory storage when localStorage is unavailable
 * (e.g. some private-browsing modes).
 */
const PREFIX = "novelreader:";
const listeners = new Set();
const memory = new Map(); // fallback storage
const cache = new Map(); // key -> { raw, value } so snapshots stay referentially stable

function readRaw(key) {
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function writeRaw(key, raw) {
  try {
    window.localStorage.setItem(PREFIX + key, raw);
  } catch {
    memory.set(key, raw);
  }
}

function readValue(key, initialValue) {
  const raw = readRaw(key);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value;

  let value = initialValue;
  if (raw !== null) {
    try {
      value = JSON.parse(raw);
    } catch {
      /* corrupted value: keep the initial value */
    }
  }
  cache.set(key, { raw, value });
  return value;
}

function subscribe(callback) {
  listeners.add(callback);
  const onStorage = (e) => {
    if (!e.key || e.key.startsWith(PREFIX)) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useLocalStorage(key, initialValue) {
  const value = useSyncExternalStore(subscribe, () => readValue(key, initialValue));

  const setValue = useCallback(
    (next) => {
      const resolved = typeof next === "function" ? next(readValue(key, initialValue)) : next;
      writeRaw(key, JSON.stringify(resolved));
      listeners.forEach((listener) => listener());
    },
    // initialValue is only used as a fallback; ignoring it keeps setValue stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [value, setValue];
}
