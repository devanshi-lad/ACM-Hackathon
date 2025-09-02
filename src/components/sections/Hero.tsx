import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Make waste <span className="bg-gradient-eco bg-clip-text text-transparent">visible</span>
          </motion.h1>

          <p className="mt-5 text-lg text-muted-foreground max-w-prose">
            TrashTalker AI classifies waste into recyclable, biodegradable and hazardous — in real time —
            so campuses and cities can improve segregation and recovery.
          </p>

          <div className="mt-8 flex gap-3">
            <Button asChild>
              <a href="#classifier">Try it now</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#learn-more">Learn more</a>
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="relative"
        >
          <img
            src="/assets/hero/hero-bin.jpg"
            alt="Smart waste bin"
            className="w-full rounded-2xl shadow-2xl border object-cover"
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5 dark:ring-white/10" />
        </motion.div>
      </div>
    </section>
  );
}
