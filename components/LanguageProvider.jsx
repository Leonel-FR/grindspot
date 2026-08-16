"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import en from "@/lib/i18n/dictionaries/en";
import es from "@/lib/i18n/dictionaries/es";

const dictionaries = { en, es };
const STORAGE_KEY = "grindspot-language";
// localStorage's own "storage" event only fires in *other* tabs, never the
// tab that made the write, so setLanguage dispatches this one itself —
// that's what makes the toggle button re-render its own tab immediately.
const LANGUAGE_EVENT = "grindspot-language-change";

const LanguageContext = createContext(null);

function getNested(dict, path) {
  return path.split(".").reduce((value, key) => value?.[key], dict);
}

function subscribe(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(LANGUAGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANGUAGE_EVENT, callback);
  };
}

function getSnapshot() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && dictionaries[stored]) return stored;
  return window.navigator.language?.startsWith("es") ? "es" : "en";
}

// Server-rendered markup has no way to know the visitor's stored/browser
// language ahead of time (it lives in localStorage, not a cookie or the
// URL), so every load starts in English and useSyncExternalStore swaps it
// to the real snapshot right after hydration. That means a one-frame flash
// to the stored language for returning Spanish readers — an accepted
// trade-off for keeping this client-only, no routing.
function getServerSnapshot() {
  return "en";
}

export function LanguageProvider({ children }) {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang) => {
    if (!dictionaries[lang]) return;
    window.localStorage.setItem(STORAGE_KEY, lang);
    window.dispatchEvent(new Event(LANGUAGE_EVENT));
  };

  // Falls back to the English string (and finally the raw key) so a typo'd
  // or not-yet-translated path fails visibly instead of rendering nothing.
  const t = (path) =>
    getNested(dictionaries[language], path) ??
    getNested(dictionaries.en, path) ??
    path;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// For one-shot translations needed the instant a component mounts (e.g. a
// toast fired from a mount effect), not for regular rendering. `t` from
// useLanguage() lags one frame on first paint — language starts at the
// server snapshot ("en") and only flips to the real stored value after
// hydration settles (see getServerSnapshot above) — so a toast fired in a
// mount effect using that `t` can catch the wrong language. This reads
// localStorage directly, which has no such lag.
export function translateNow(path) {
  const language = getSnapshot();
  return (
    getNested(dictionaries[language], path) ??
    getNested(dictionaries.en, path) ??
    path
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
