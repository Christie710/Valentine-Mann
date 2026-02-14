import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MomentsCards from "./components/MomentsCards";
import GlowingCursor from "./components/GlowingCursor";

const RomanticScene = lazy(() => import("./components/RomanticScene"));

const noMessages = ["Are you certain?", "I can wait.", "Take another look.", "Still hoping for yes."];
const heartDrops = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: 4 + ((index * 97) % 92),
  delay: (index % 8) * 0.35,
  duration: 3.6 + (index % 5) * 0.45,
  size: 14 + (index % 4) * 7
}));
const fireworkBursts = Array.from({ length: 8 }, (_, index) => ({
  id: index,
  left: 12 + ((index * 73) % 76),
  top: 12 + ((index * 61) % 58),
  delay: index * 0.26
}));

const sectionFade = {
  hidden: { opacity: 0, y: 26, scale: 0.97, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 1.02,
    filter: "blur(10px)",
    transition: { duration: 0.62, ease: [0.4, 0, 1, 1] }
  }
};

const App = () => {
  const [section, setSection] = useState("hero");
  const [accepted, setAccepted] = useState(false);
  const [noClicks, setNoClicks] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const handleChange = (event) => setIsMobile(event.matches);
    setIsMobile(media.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const noMessage = useMemo(() => noMessages[noClicks % noMessages.length], [noClicks]);
  const yesScale = useMemo(() => Math.min(1 + noClicks * (isMobile ? 0.11 : 0.14), isMobile ? 1.9 : 2.4), [noClicks, isMobile]);
  const noScale = useMemo(() => Math.max(1 - noClicks * 0.2, 0), [noClicks]);
  const noOpacity = useMemo(() => Math.max(1 - noClicks * 0.22, 0), [noClicks]);
  const noGone = noScale <= 0.05;
  const noPosition = useMemo(() => {
    if (noClicks === 0) return { x: 0, y: 0 };
    const positions = isMobile
      ? [
          { x: 24, y: -10 },
          { x: 34, y: 8 },
          { x: 40, y: -7 },
          { x: 46, y: 12 }
        ]
      : [
          { x: 72, y: -22 },
          { x: 96, y: 8 },
          { x: 120, y: -10 },
          { x: 148, y: 20 }
        ];
    const current = positions[(noClicks - 1) % positions.length];
    const distanceFactor = 1 + noClicks * (isMobile ? 0.12 : 0.22);
    return {
      x: current.x * distanceFactor,
      y: current.y * distanceFactor
    };
  }, [noClicks, isMobile]);

  return (
    <div className={`app-shell ${accepted ? "accepted" : ""}`}>
      <div className="cinema-bars" aria-hidden="true" />
      <GlowingCursor />
      <div className="scene-layer">
        <Suspense fallback={<div className="scene-fallback" />}>
          <RomanticScene section={section} accepted={accepted} />
        </Suspense>
      </div>

      <main className="content-layer">
        <AnimatePresence mode="wait">
          {section === "hero" && (
            <motion.section
              key="hero"
              className="glass panel hero-panel"
              variants={sectionFade}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <p className="eyebrow">For Mann</p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              >
                Hey Mann
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              >
                I have been holding one question close, waiting for the right moment.
              </motion.p>
              <motion.button
                className="primary-btn"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setSection("moments")}
              >
                Step inside
              </motion.button>
            </motion.section>
          )}

          {section === "moments" && (
            <motion.section
              key="moments"
              className="glass panel moments-panel"
              variants={sectionFade}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <p className="eyebrow">Chapter 1</p>
              <h2>Lujeeeeee :)))))</h2>
              <MomentsCards />
              <button className="primary-btn" onClick={() => setSection("question")}>
                Continue
              </button>
            </motion.section>
          )}

          {section === "question" && (
            <motion.section
              key="question"
              className="glass panel question-panel"
              variants={sectionFade}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <p className="eyebrow">Finale</p>
              <h2>Mann</h2>
              <h3>Will you be my Valentine?</h3>

              <div className="question-actions">
                <motion.button
                  className="yes-btn"
                  animate={{ scale: yesScale }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setAccepted(true)}
                >
                  YES
                </motion.button>

                <motion.button
                  className="no-btn"
                  animate={{ x: noPosition.x, y: noPosition.y, scale: noScale, opacity: noOpacity }}
                  transition={{ type: "spring", stiffness: 210, damping: 18 }}
                  whileTap={{ scale: 0.99 }}
                  style={{ pointerEvents: noGone ? "none" : "auto" }}
                  onClick={() => setNoClicks((value) => value + 1)}
                >
                  No
                </motion.button>
              </div>

              <p className="no-message">{noClicks > 0 ? noMessage : "Your answer means everything."}</p>
            </motion.section>
          )}
        </AnimatePresence>

        {accepted && (
          <motion.section
            className="acceptance-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="fireworks-layer" aria-hidden="true">
              {fireworkBursts.map((burst) => (
                <span
                  key={`burst-${burst.id}`}
                  className="firework-burst"
                  style={{
                    left: `${burst.left}%`,
                    top: `${burst.top}%`,
                    animationDelay: `${burst.delay}s`
                  }}
                />
              ))}
            </div>
            <div className="heart-rain" aria-hidden="true">
              {heartDrops.map((heart) => (
                <span
                  key={`heart-${heart.id}`}
                  className="heart-drop"
                  style={{
                    left: `${heart.left}%`,
                    animationDelay: `${heart.delay}s`,
                    animationDuration: `${heart.duration}s`,
                    fontSize: `${heart.size}px`
                  }}
                >
                  {"\u2665"}
                </span>
              ))}
            </div>
            <div className="celebration" />
            <h2>Yayyy 🤭 thank u for taking me i love u more than luje 🤭</h2>
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default App;
