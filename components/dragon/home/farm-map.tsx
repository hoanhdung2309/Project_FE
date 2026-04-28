"use client";

import { useState } from "react";
import { useApp } from "../app-context";
import { FARMS } from "../data";
import { SectionTitle } from "./section-title";
import { FarmMapSvg } from "./farm-map-svg";

export function FarmMap() {
  const { t } = useApp();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section
      className="home-section-pad"
      style={{
        background: "var(--cream-light)",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="wrap">
        <div className="home-map-grid">
          <div>
            <div className="eyebrow home-farm-eyebrow">{t("map_eyebrow")}</div>
            <SectionTitle
              text={t("map_title")}
              italicColor="var(--leaf)"
              style={{ marginBottom: 24 }}
            />
            <div className="home-farm-sub">{t("map_sub")}</div>

            <div className="home-farm-list">
              {FARMS.map((f, i) => {
                const isHovered = hovered === f.id;
                return (
                  <div
                    key={f.id}
                    className={`home-farm-row${isHovered ? " is-hovered" : ""}`}
                    onMouseEnter={() => setHovered(f.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="home-farm-num">0{i + 1}</div>
                    <div>
                      <div className="home-farm-name">{t(`farm_${f.id}_name`)}</div>
                      <div className="home-farm-desc">{t(`farm_${f.id}_desc`)}</div>
                    </div>
                    <div className="home-farm-size">{f.size}ha</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="home-map-frame">
            <FarmMapSvg
              hovered={hovered}
              setHovered={setHovered}
              labelFor={(id) => t(`farm_${id}_name`)}
            />
            <div className="home-map-coord bl">VIETNAM • 10°N 106°E</div>
            <div className="home-map-coord tr">
              N<br />↑
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
