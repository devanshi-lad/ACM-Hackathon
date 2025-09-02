const logos = [
  "/assets/logos/brand-1.svg",
  "/assets/logos/brand-2.svg",
  "/assets/logos/brand-3.svg",
  "/assets/logos/brand-4.svg",
  "/assets/logos/brand-5.svg",
  "/assets/logos/brand-6.svg",
  "/assets/logos/brand-7.svg",
  "/assets/logos/brand-8.svg",
];

export default function LogoMarquee() {
  const track = [...logos, ...logos]; // duplicate track for seamless infinite loop

  return (
    <section aria-label="Trusted by" className="py-8 md:py-12 border-y bg-muted/20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-xs tracking-widest uppercase text-muted-foreground mb-6">
          Trusted by teams
        </p>

        <div className="marquee relative overflow-hidden">
          <div className="marquee-track flex items-center gap-10">
            {track.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="h-8 md:h-10 opacity-70 hover:opacity-100 transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
