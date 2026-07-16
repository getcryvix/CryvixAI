import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo />

        <nav className="flex items-center gap-6">
          <a href="#features" className="text-white/70 hover:text-white">
            Features
          </a>

          <a href="#pricing" className="text-white/70 hover:text-white">
            Pricing
          </a>

          <Link to="/login" className="text-white/70 hover:text-white">
            Login
          </Link>

          <Link
            to="/signup"
            className="rounded-xl bg-cyan-500 px-5 py-2 text-white hover:bg-cyan-400"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}