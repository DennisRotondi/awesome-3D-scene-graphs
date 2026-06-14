/// <reference types="vite/client" />

// Google Analytics gtag.js, loaded globally in index.html.
interface Window {
  gtag?: (...args: unknown[]) => void;
}
