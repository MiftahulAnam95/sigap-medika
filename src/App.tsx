import { useCallback, useEffect, useState } from "react";
import { scroller, ScrollTrigger } from "./lib/motion";
import { ContactDrawer, Loader, Nav, type Topic } from "./components/ui";
import { Traveler } from "./components/Traveler";
import { Hero } from "./sections/Hero";
import { Products } from "./sections/Products";
import { Reach } from "./sections/Reach";
import { Steps } from "./sections/Steps";
import { StartNow } from "./sections/StartNow";
import { Support } from "./sections/Support";
import { Footer } from "./sections/Footer";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);

  const openContact = useCallback((t: Topic) => setTopic(t), []);
  const closeContact = useCallback(() => setTopic(null), []);
  const reveal = useCallback(() => {
    setReady(true);
    document.documentElement.classList.add("is-ready");
  }, []);
  const loaded = useCallback(() => setLoading(false), []);

  // smooth scrolling
  useEffect(() => scroller.init(), []);

  // the colour behind the page (overscroll / scrollbar gutter) follows day → night
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "#penutup",
      start: "top bottom",
      onToggle: (self) => document.documentElement.classList.toggle("at-night", self.isActive),
    });
    return () => st.kill();
  }, []);

  return (
    <div className="page">
      <a
        href="#produk"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300] focus:rounded-xl focus:bg-pine focus:px-4 focus:py-3 focus:text-white"
      >
        Lewati ke konten
      </a>

      {loading && <Loader onReveal={reveal} onDone={loaded} />}

      <Nav onContact={openContact} />

      <main>
        <Hero ready={ready} />
        <Products />
        <Reach onContact={openContact} />
        <Steps onContact={openContact} />
        <StartNow onContact={openContact} />
        <Support />
      </main>
      <Footer onContact={openContact} />

      <Traveler />
      <ContactDrawer topic={topic} onClose={closeContact} />
    </div>
  );
}
