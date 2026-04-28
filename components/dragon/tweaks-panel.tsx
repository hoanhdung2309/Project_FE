"use client";

import { useApp } from "./app-context";

const ACCENTS = [
  { id: "pink", color: "#E88BAE" },
  { id: "magenta", color: "#C4477A" },
  { id: "leaf", color: "#4A6B48" },
  { id: "gold", color: "#C9A961" },
] as const;

export function TweaksPanel() {
  const { tweaksOpen, darkNav, setDarkNav, accent, setAccent, lang, setLang } = useApp();
  return (
    <div className={`tweaks-panel ${tweaksOpen ? "open" : ""}`}>
      <h4>Tweaks</h4>
      <div className="row">
        <span>Language</span>
        <div className="toggle">
          <button className={lang === "vi" ? "active" : ""} onClick={() => setLang("vi")}>
            VI
          </button>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
            EN
          </button>
        </div>
      </div>
      <div className="row">
        <span>Header</span>
        <div className="toggle">
          <button className={darkNav ? "active" : ""} onClick={() => setDarkNav(true)}>
            Dark
          </button>
          <button className={!darkNav ? "active" : ""} onClick={() => setDarkNav(false)}>
            Cream
          </button>
        </div>
      </div>
      <div className="row">
        <span>Accent</span>
        <div className="swatches">
          {ACCENTS.map((a) => (
            <div
              key={a.id}
              className={`swatch ${accent === a.id ? "active" : ""}`}
              style={{ background: a.color }}
              onClick={() => setAccent(a.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
