import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, SunMedium } from "lucide-react";
import { motion } from "framer-motion";

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Button
      variant="secondary"
      className="rounded-full w-11 h-11 shadow-md hover:shadow-lg transition-all duration-300"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "dark" ? <SunMedium className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}

const nav = [
  { label: "Solutions", href: "#solutions" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Docs", href: "#resources" },
  { label: "About", href: "#about" },
];

export default function Header() {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
    >
      <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold text-lg">
          <span className="text-2xl">♻️</span>
          <span className="tracking-tight">TrashTalker AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-base font-medium">
          {nav.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="px-3 py-2 rounded-full hover:bg-muted hover:text-foreground transition-all duration-300 shadow-sm"
            >
              {n.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="#classifier" className="hidden sm:inline-block">
            <Button className="rounded-full px-6 py-2 text-base shadow-md hover:shadow-lg transition-all duration-300">
              Try demo
            </Button>
          </a>

          {/* NEW LOGIN BUTTON */}
          <Button
            className="rounded-full px-6 py-2 text-base shadow-md hover:shadow-lg transition-all duration-300"
            variant="outline"
            onClick={() => navigate("/auth-test")}
          >
            Login
          </Button>

          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}
