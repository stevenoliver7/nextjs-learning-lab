"use client";

import { useMemo, useState, type CSSProperties } from "react";
import "./LabClient.css";
import { curriculumPrinciples, lessons, type Lesson } from "@/content/lessons";

const conceptColors = [
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#22c55e",
  "#f43f5e",
  "#facc15",
];

// Next.js static export + GitHub Pages: assets live under basePath.
// usePathname() would require a server/layout boundary, so we read from
// __NEXT_DATA__ at runtime instead — works for fully static builds.
const baseAssetUrl = (): string => {
  if (typeof window === "undefined") return "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nextData = (window as any).__NEXT_DATA__;
  if (nextData?.runtimeConfig?.basePath) {
    return `${nextData.runtimeConfig.basePath}/`;
  }
  return "/";
};

const assetUrl = (path: string | null | undefined) => {
  if (!path) return null;
  const base = baseAssetUrl();
  return `${base}${path.replace(/^\//, "")}`;
};

const statusLabel: Record<Lesson["status"], string> = {
  complete: "audio ready",
  planned: "planned",
};

function LabClient() {
  const [selectedId, setSelectedId] = useState(lessons[5].id);
  const [activeConcept, setActiveConcept] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const selected = lessons.find((lesson) => lesson.id === selectedId) ?? lessons[0];
  const selectedAudio = assetUrl(selected.audio);
  const selectedScript = assetUrl(selected.scriptPath);
  const completeLessons = lessons.filter(
    (lesson) => lesson.status === "complete"
  );
  const progress = Math.round(
    (completeLessons.length / lessons.length) * 100
  );
  const activeConceptDetails =
    selected.concepts[activeConcept] ?? selected.concepts[0];
  const activeRehearsal =
    selected.rehearsalSteps[activeStep] ?? selected.rehearsalSteps[0];

  const rooms = useMemo(
    () =>
      lessons.map((lesson, index) => ({
        id: lesson.id,
        number: lesson.number,
        title: lesson.room,
        motion: lesson.motion,
        color: conceptColors[index % conceptColors.length],
        status: lesson.status,
      })),
    []
  );

  const selectLesson = (lessonId: string) => {
    setSelectedId(lessonId);
    setActiveConcept(0);
    setActiveStep(0);
  };

  return (
    <main className="app-shell">
      <section className="hero-section" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Daniel&apos;s Next.js learning journey</p>
          <h1 id="page-title">
            A voice-first memory palace for the lessons.
          </h1>
          <p className="hero-lede">
            This is the web companion for the audio curriculum: one place to
            replay the lectures, review the mental models, and rehearse technical
            ideas without needing a screen full of code.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a href="#lessons" className="button primary">
              Open the cockpit
            </a>
            <a href="#memory-palace" className="button ghost">
              Walk the rooms
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Curriculum map">
          <div className="orbital-card" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="center-node">Next.js</div>
            {["DOM", "React", "Hooks", "TS", "Async"].map((label, index) => (
              <span key={label} className={`satellite satellite-${index + 1}`}>
                {label}
              </span>
            ))}
          </div>
          <div className="progress-card">
            <span>
              {completeLessons.length} / {lessons.length} lessons represented
            </span>
            <div className="progress-track">
              <div style={{ width: `${progress}%` }} />
            </div>
            <strong>
              {progress}% mapped · {completeLessons.length} audio files embedded
            </strong>
          </div>
        </div>
      </section>

      <section className="principles" aria-label="Curriculum principles">
        {curriculumPrinciples.map((principle) => (
          <span key={principle}>{principle}</span>
        ))}
      </section>

      <section id="lessons" className="lesson-grid" aria-label="Lesson explorer">
        <aside className="lesson-list" aria-label="Lesson list">
          <div className="section-kicker">Curriculum spine</div>
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              className={`lesson-tab ${lesson.id === selected.id ? "active" : ""}`}
              onClick={() => selectLesson(lesson.id)}
              type="button"
            >
              <span className="lesson-number">{lesson.number}</span>
              <span>
                <strong>{lesson.title}</strong>
                <small>
                  {lesson.duration} · {statusLabel[lesson.status]}
                </small>
              </span>
            </button>
          ))}
        </aside>

        <article className="lesson-detail">
          <div className="detail-header">
            <div>
              <p className="eyebrow">
                {selected.number} · {selected.room}
              </p>
              <h2>{selected.title}</h2>
              <p>{selected.subtitle}</p>
            </div>
            <span className={`status-pill ${selected.status}`}>
              {statusLabel[selected.status]}
            </span>
          </div>

          <div className="audio-card">
            <div>
              <p className="card-label">Audio player</p>
              {selectedAudio ? (
                <audio
                  controls
                  preload="metadata"
                  src={selectedAudio}
                  aria-label={`${selected.title} audio`}
                />
              ) : (
                <div className="planned-audio">
                  Audio slot reserved for the next lesson.
                </div>
              )}
            </div>
            <div className="audio-meta">
              <span>{selected.duration}</span>
              <span>{selected.source}</span>
              {selectedScript ? (
                <a href={selectedScript} className="inline-link">
                  Open source script
                </a>
              ) : null}
            </div>
          </div>

          <section className="brief-card">
            <p className="card-label">Listening brief</p>
            <p>{selected.audioBrief}</p>
          </section>

          <div className="detail-layout">
            <section className="mental-model-card">
              <p className="card-label">Mental model</p>
              <h3>{selected.mentalModel}</h3>
              <p>
                <strong>Object:</strong> {selected.visualAnchor}
              </p>
              <p>
                <strong>Motion:</strong> {selected.motion}
              </p>
            </section>

            <section
              className="interaction-card"
              aria-label="Interactive concept explorer"
            >
              <p className="card-label">Concept lens</p>
              <div className="concept-buttons">
                {selected.concepts.map((concept, index) => (
                  <button
                    key={concept.label}
                    type="button"
                    className={activeConcept === index ? "selected" : ""}
                    onClick={() => setActiveConcept(index)}
                    style={
                      {
                        "--concept-color":
                          conceptColors[index % conceptColors.length],
                      } as CSSProperties
                    }
                  >
                    {concept.label}
                  </button>
                ))}
              </div>
              <div className="concept-output">
                <span
                  style={{
                    background: conceptColors[activeConcept % conceptColors.length],
                  }}
                />
                <strong>{activeConceptDetails.label}</strong>
                <p>{activeConceptDetails.explanation}</p>
              </div>
            </section>
          </div>

          <section
            className="rehearsal-card"
            aria-label="Audio rehearsal steps"
          >
            <div>
              <p className="card-label">No-screen rehearsal</p>
              <h3>{activeRehearsal}</h3>
              <p>{selected.prompt}</p>
            </div>
            <div className="step-buttons" aria-label="Rehearsal step selector">
              {selected.rehearsalSteps.map((step, index) => (
                <button
                  type="button"
                  key={step}
                  className={activeStep === index ? "selected" : ""}
                  onClick={() => setActiveStep(index)}
                >
                  Step {index + 1}
                </button>
              ))}
            </div>
          </section>

          <section className="checkpoint-card" aria-label="Lesson checkpoints">
            <p className="card-label">Listening checkpoints</p>
            <div className="checkpoints">
              {selected.checkpoints.map((checkpoint) => {
                const key = `${selected.id}:${checkpoint}`;
                return (
                  <label key={key} className={checked[key] ? "checked" : ""}>
                    <input
                      type="checkbox"
                      checked={Boolean(checked[key])}
                      onChange={(event) =>
                        setChecked((state) => ({
                          ...state,
                          [key]: event.target.checked,
                        }))
                      }
                    />
                    <span>{checkpoint}</span>
                  </label>
                );
              })}
            </div>
          </section>
        </article>
      </section>

      <section
        id="memory-palace"
        className="rooms-section"
        aria-labelledby="rooms-title"
      >
        <div className="section-heading">
          <p className="eyebrow">Audio-first review mode</p>
          <h2 id="rooms-title">Walk the technical building.</h2>
          <p>
            Each room converts screen-heavy programming concepts into something
            Daniel can picture while listening: an object, a motion, and a
            reason it matters when reading a real project.
          </p>
        </div>
        <div className="rooms-grid">
          {rooms.map((room) => (
            <button
              type="button"
              className={`room-card ${selected.id === room.id ? "active" : ""}`}
              key={room.id}
              onClick={() => selectLesson(room.id)}
              style={
                { "--room-color": room.color } as CSSProperties
              }
            >
              <span>{room.number}</span>
              <h3>{room.title}</h3>
              <p>{room.motion}</p>
              <small>
                {room.status === "complete"
                  ? "audio available"
                  : "next landing zone"}
              </small>
            </button>
          ))}
        </div>
      </section>

      <section className="source-section" aria-labelledby="source-title">
        <div>
          <p className="eyebrow">Repository as source of truth</p>
          <h2 id="source-title">
            Audio, scripts, and web interactions share one model.
          </h2>
        </div>
        <div className="source-grid">
          <div>
            <strong>Structured metadata</strong>
            <p>
              <code>src/content/lessons.ts</code> powers titles, summaries,
              concepts, checkpoints, and rehearsal prompts.
            </p>
          </div>
          <div>
            <strong>Canonical scripts</strong>
            <p>
              <code>public/scripts/</code> exposes the longer source text for
              the TypeScript, async, and re-entry lectures.
            </p>
          </div>
          <div>
            <strong>Static audio assets</strong>
            <p>
              <code>public/audio/</code> contains MP3 lessons ready for GitHub
              Pages delivery.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LabClient;
