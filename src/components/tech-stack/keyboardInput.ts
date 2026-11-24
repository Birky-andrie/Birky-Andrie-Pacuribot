import type { TechStackKey } from "@/data/techStack";

export type KeyPressListener = (
  key: TechStackKey,
  pressed: boolean,
  source: string
) => void;

export interface KeyInputController {
  shortcuts: Map<string, TechStackKey>;
  subscribe: (listener: KeyPressListener) => () => void;
  press: (source: string, keyId: string) => boolean;
  release: (source: string, keyId?: string) => void;
  releaseAll: () => void;
  getLatestActive: () => TechStackKey | null;
}

export function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    Boolean(
      target.closest(
        "input, textarea, select, [contenteditable]:not([contenteditable='false'])"
      )
    )
  );
}

/**
 * Multi-source ref-counted key input controller:
 * a keycap stays physically depressed until every source holding it (hover, pointer, keyboard) releases.
 */
export function createKeyInputController(
  keys: readonly TechStackKey[]
): KeyInputController {
  const listeners = new Set<KeyPressListener>();
  const byId = new Map<string, TechStackKey>(keys.map((k) => [k.id, k]));
  const shortcuts = new Map<string, TechStackKey>();
  const heldBySource = new Map<string, string>();
  const heldSourcesByKey = new Map<string, Set<string>>();
  const activeStack: string[] = [];

  for (const key of keys) {
    shortcuts.set(key.shortcutCode, key);
  }

  const notify = (key: TechStackKey, pressed: boolean, source: string) => {
    listeners.forEach((listener) => listener(key, pressed, source));
  };

  const release = (source: string, keyId?: string) => {
    const currentId = heldBySource.get(source);
    if (!currentId || (keyId !== undefined && currentId !== keyId)) return;

    heldBySource.delete(source);
    const sources = heldSourcesByKey.get(currentId);
    sources?.delete(source);

    if (!sources || sources.size === 0) {
      heldSourcesByKey.delete(currentId);
      const stackIdx = activeStack.lastIndexOf(currentId);
      if (stackIdx !== -1) activeStack.splice(stackIdx, 1);
      const key = byId.get(currentId);
      if (key) notify(key, false, source);
    }
  };

  const press = (source: string, keyId: string): boolean => {
    const key = byId.get(keyId);
    if (!key) return false;
    if (heldBySource.get(source) === keyId) return false;

    release(source);
    heldBySource.set(source, keyId);

    const sources = heldSourcesByKey.get(keyId) ?? new Set<string>();
    const isFirstPress = sources.size === 0;
    sources.add(source);
    heldSourcesByKey.set(keyId, sources);

    const existingIdx = activeStack.indexOf(keyId);
    if (existingIdx !== -1) activeStack.splice(existingIdx, 1);
    activeStack.push(keyId);

    if (isFirstPress) {
      notify(key, true, source);
    }
    return true;
  };

  return {
    shortcuts,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    press,
    release,
    releaseAll() {
      for (const source of [...heldBySource.keys()]) {
        release(source);
      }
    },
    getLatestActive() {
      const id = activeStack[activeStack.length - 1];
      return id ? byId.get(id) ?? null : null;
    },
  };
}
