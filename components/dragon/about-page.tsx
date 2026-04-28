"use client";

import Image from "next/image";
import { useApp } from "./app-context";
import { TIMELINE } from "./data";
import { CtaBand } from "./home";

const ABOUT_GALLERY = [
  { src: "/assets/images/about-farm.webp", caption_vi: "Nông trại — góc nhìn từ trên cao", caption_en: "Farm photo — aerial view" },
  { src: "/assets/images/about-packing.webp", caption_vi: "Xưởng đóng gói — bên trong", caption_en: "Packing facility — interior" },
  { src: "/assets/images/about-harvest.webp", caption_vi: "Thu hoạch — hái thủ công", caption_en: "Harvest — hand-picked" },
  { src: "/assets/images/about-export.webp", caption_vi: "Xuất khẩu — cảng Bình Thuận", caption_en: "Export container — Binh Thuan port" },
] as const;

export function AboutPage() {
  const { t, lang } = useApp();
  const titleLines = t("about_title").split("\n");

  return (
    <>
      <section style={{ background: "var(--cream)", padding: "100px 0 80px" }}>
        <div className="wrap">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: 24 }}>
                {t("about_eyebrow")}
              </div>
              <h1
                className="display"
                style={{ fontSize: "clamp(48px, 6vw, 88px)", whiteSpace: "pre-line" }}
              >
                {titleLines.map((line, i) => (
                  <div key={line}>
                    {i === 1 ? (
                      <em className="italic" style={{ color: "var(--magenta)" }}>
                        {line}
                      </em>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </h1>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: "var(--ink-soft)",
                  marginTop: 32,
                  maxWidth: 520,
                }}
              >
                {t("about_body")}
              </p>
            </div>
            <div
              style={{
                position: "relative",
                aspectRatio: "4/5",
                borderRadius: 24,
                overflow: "hidden",
                background: "var(--cream-light)",
              }}
            >
              <Image
                src="/assets/images/pitaya-organic.webp"
                alt="Nông trại thanh long D-Dragon — Bình Thuận"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
              <span
                style={{
                  position: "absolute",
                  top: 24,
                  left: 24,
                  padding: "8px 14px",
                  background: "var(--magenta)",
                  color: "var(--cream-light)",
                  borderRadius: 100,
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                }}
              >
                {t("about_hero_badge")}
              </span>
              <div
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: 24,
                  right: 24,
                  padding: 20,
                  background: "rgba(245,241,232,0.9)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    color: "var(--mute)",
                  }}
                >
                  BINH THUAN, VIETNAM
                </div>
                <div className="serif" style={{ fontSize: 22, marginTop: 4 }}>
                  {lang === "vi" ? "Nông trại gốc" : "Our origin farm"} • 2011
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--cream)", paddingBottom: 100 }}>
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 32 }}>
            {t("about_stat_eyebrow")}
          </div>
          <div className="about-stats">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="about-stat">
                <div className="about-stat-num">{t(`about_stat_${n}_value`)}</div>
                <div className="about-stat-label">{t(`about_stat_${n}_label`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          background: "var(--ink)",
          color: "var(--cream-light)",
          padding: "120px 0",
        }}
      >
        <div className="wrap">
          <div className="eyebrow" style={{ color: "var(--pink-deep)", marginBottom: 24 }}>
            {t("about_values_title")}
          </div>
          <h2 className="h2" style={{ maxWidth: 800, marginBottom: 80 }}>
            {lang === "vi" ? (
              <>
                Ba nguyên tắc định hình{" "}
                <em className="italic" style={{ color: "var(--pink)" }}>
                  mọi quyết định
                </em>{" "}
                của chúng tôi.
              </>
            ) : (
              <>
                Three principles that shape{" "}
                <em className="italic" style={{ color: "var(--pink)" }}>
                  every decision
                </em>{" "}
                we make.
              </>
            )}
          </h2>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  padding: 40,
                  borderTop: "1px solid rgba(255,255,255,0.2)",
                  minHeight: 300,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: 88,
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    color: "var(--pink-deep)",
                    marginBottom: 16,
                  }}
                >
                  0{n}
                </div>
                <div
                  className="serif"
                  style={{ fontSize: 30, lineHeight: 1.1, marginBottom: 16 }}
                >
                  {t(`about_value_${n}_title`)}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    lineHeight: 1.6,
                    opacity: 0.75,
                    marginTop: "auto",
                  }}
                >
                  {t(`about_value_${n}_desc`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--cream-light)", padding: "120px 0" }}>
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 20 }}>
            Timeline
          </div>
          <h2 className="h2" style={{ marginBottom: 60 }}>
            {t("timeline_title")}
            <em className="italic" style={{ color: "var(--magenta)" }}>
              .
            </em>
          </h2>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 100,
                top: 0,
                bottom: 0,
                width: 1,
                background: "var(--line)",
              }}
            />
            {TIMELINE.map((e, i) => (
              <div
                key={e.year}
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 60px 1fr",
                  gap: 0,
                  padding: "28px 0",
                  borderBottom:
                    i < TIMELINE.length - 1 ? "1px solid var(--line)" : "none",
                  alignItems: "flex-start",
                }}
              >
                <div
                  className="serif"
                  style={{ fontSize: 36, lineHeight: 1, color: "var(--magenta)" }}
                >
                  {e.year}
                </div>
                <div style={{ position: "relative", height: 40 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: -4,
                      top: 10,
                      width: 13,
                      height: 13,
                      borderRadius: "50%",
                      background: "var(--cream-light)",
                      border: "2px solid var(--magenta)",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 18,
                    lineHeight: 1.5,
                    maxWidth: 620,
                    paddingTop: 6,
                  }}
                >
                  {lang === "vi" ? e.vi : e.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--cream)", padding: "120px 0" }}>
        <div className="wrap">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, marginBottom: 60, flexWrap: "wrap" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                {t("about_gallery_eyebrow")}
              </div>
              <h2 className="h2" style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: "0.04em" }}>
                {t("about_gallery_title")
                  .split("\n")
                  .map((line, i) =>
                    i === 1 ? (
                      <em key={line} className="italic" style={{ display: "block" }}>
                        {line}
                      </em>
                    ) : (
                      <span key={line} style={{ display: "block" }}>
                        {line}
                      </span>
                    ),
                  )}
              </h2>
            </div>
          </div>

          <div className="about-bento">
            {ABOUT_GALLERY.map((item, i) => (
              <figure
                key={item.src}
                className={`about-bento-item bento-${i + 1}`}
              >
                <Image
                  src={item.src}
                  alt={lang === "vi" ? item.caption_vi : item.caption_en}
                  fill
                  sizes={i === 0 ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 30vw"}
                  style={{ objectFit: "cover" }}
                />
                <figcaption className="about-bento-caption">
                  {lang === "vi" ? item.caption_vi : item.caption_en}
                </figcaption>
              </figure>
            ))}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--mute)",
              fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textAlign: "center",
              marginTop: 32,
            }}
          >
            {lang === "vi"
              ? "Ảnh tư liệu — D-Dragon Group 2024"
              : "Editorial photography — D-Dragon Group 2024"}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
