export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <div className="font-bold text-lg">TrashTalker AI</div>
          <p className="mt-3 text-sm text-muted-foreground">
            AI-based waste classification for cleaner campuses and smarter cities.
          </p>
        </div>

        <div>
          <div className="font-semibold">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#solutions" className="hover:text-foreground">Solutions</a></li>
            <li><a href="#use-cases" className="hover:text-foreground">Use cases</a></li>
            <li><a href="#resources" className="hover:text-foreground">Docs</a></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#about" className="hover:text-foreground">About</a></li>
            <li><a href="#" className="hover:text-foreground">Contact</a></li>
            <li><a href="#" className="hover:text-foreground">Careers</a></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold">Stay in the loop</div>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            <button className="rounded-md border px-3 py-2 text-sm">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-muted-foreground flex items-center justify-between">
          <p>© {new Date().getFullYear()} TrashTalker. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
