import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PointerProvider } from "./lib/pointer";
import { FieldProvider, useField } from "./lib/field";
import { pageVariants } from "./lib/motion";
import Field from "./components/Field";
import Nav from "./components/Nav";
import Intro, { shouldPlayIntro } from "./components/Intro";
import { Footer } from "./components/primitives";
import Home from "./pages/Home";

const Work = lazy(() => import("./pages/Work"));
const Project = lazy(() => import("./pages/Project"));
const About = lazy(() => import("./pages/About"));
const Experience = lazy(() => import("./pages/Experience"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

/** Old static URLs keep working. */
const legacy: Record<string, string> = {
  "/index.html": "/",
  "/projects.html": "/work",
  "/about.html": "/about",
  "/contact.html": "/contact",
  "/project-apexiq.html": "/work/apexiq",
  "/project-novabank.html": "/work/novabank",
  "/project-premieriq.html": "/work/premieriq",
  "/project-chatwire.html": "/work/chatwire",
  "/project-emergency-call-queue.html": "/work/emergency-call-queue",
  "/project-video-game-catalogue.html": "/work/video-game-catalogue",
  "/project-aid-optimiser.html": "/work/aid-optimiser",
  "/project-metro-routes.html": "/work/metro-routes",
  "/project-whats-for-dinner.html": "/work/whats-for-dinner",
  "/project-vault-comics.html": "/work/vault-comics",
  "/project-space-survival.html": "/work/space-survival",
};

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

function Shell() {
  const location = useLocation();
  const reduced = useReducedMotion();
  const { setOn } = useField();
  const [intro, setIntro] = useState(() => shouldPlayIntro(location.pathname) && !reduced);
  const [introDone, setIntroDone] = useState(!intro);

  const finish = useCallback(() => {
    setIntro(false);
    setIntroDone(true);
  }, []);

  useEffect(() => {
    if (!intro) setOn(true);
  }, [intro, setOn]);

  // Field materialises during the last phase of the intro.
  useEffect(() => {
    if (!intro) return;
    const t = window.setTimeout(() => setOn(true), 1900);
    return () => window.clearTimeout(t);
  }, [intro, setOn]);

  return (
    <>
      <Field />
      {intro && <Intro onDone={finish} />}
      <Nav />
      <ScrollManager />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          className="page"
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <Suspense fallback={<div className="page-fallback" aria-busy="true" />}>
            <Routes location={location}>
              <Route path="/" element={<Home introDone={introDone} />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:slug" element={<Project />} />
              <Route path="/about" element={<About />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/contact" element={<Contact />} />
              {Object.entries(legacy).map(([from, to]) => (
                <Route key={from} path={from} element={<Navigate to={to} replace />} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </motion.main>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <PointerProvider>
      <FieldProvider>
        <Shell />
      </FieldProvider>
    </PointerProvider>
  );
}
