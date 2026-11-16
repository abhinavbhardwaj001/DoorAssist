import { Link } from "react-router-dom";
import {
  Compass,
  UserCircle2,
  Sparkles,
  ArrowUpRight,
  Code2,
  ShieldCheck,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-[#bfcaff]/20 bg-slate-950 text-slate-300">
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#e4a5ff] opacity-15 blur-3xl"></div>
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#acdcff] opacity-15 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white transition-opacity hover:opacity-90"
            >
              <span>DoorAssist</span>
              <span className="h-2.5 w-2.5 rounded-full bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] shadow-[0_0_10px_#cbbdff]"></span>
            </Link>

            <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-slate-400">
              Connecting you with trusted local service providers for everyday
              home maintenance, repairs, and professional assistance.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#cbbdff]/25 bg-white/5 px-4 py-1.5 text-xs font-bold text-[#d1b7ff] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#e4a5ff]" />
              <span>Verified Local Professionals</span>
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-white">
              <Compass className="h-4 w-4 text-[#deabff]" />
              <span>Explore</span>
            </h3>

            <ul className="flex flex-col space-y-3 text-sm font-medium">
              <li>
                <Link
                  to="/services"
                  className="group inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-[#e4a5ff]"
                >
                  <span>Browse Services</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </Link>
              </li>

              <li>
                <Link
                  to="/categories"
                  className="group inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-[#acdcff]"
                >
                  <span>Categories</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Column */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-white">
              <UserCircle2 className="h-4 w-4 text-[#b2d6ff]" />
              <span>Account</span>
            </h3>

            <ul className="flex flex-col space-y-3 text-sm font-medium">
              <li>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-[#cbbdff]"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-[#deabff]"
                >
                  Create Account
                </Link>
              </li>

              <li>
                <Link
                  to="/become-provider"
                  className="group inline-flex items-center gap-1.5 font-bold text-[#b8d0ff] transition-colors hover:text-[#acdcff]"
                >
                  <span>Become a Provider</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Developer Credit Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-center text-xs font-medium text-slate-400 md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} DoorAssist. All rights reserved.</p>

          <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-[#cbbdff]/20 bg-white/3 px-4 py-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e4a5ff]/15 text-[#e4a5ff] ring-1 ring-inset ring-[#e4a5ff]/30">
                <Code2 className="h-3.5 w-3.5" />
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#acdcff]/15 text-[#acdcff] ring-1 ring-inset ring-[#acdcff]/30">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="text-left leading-tight">
              <p className="text-[11px] font-medium text-slate-400">
                Designed, Developed &amp; Secured by
              </p>
              <p className="animate-text-shimmer mt-0.5 text-xs font-extrabold tracking-wider uppercase">
                Abhinav Bhardwaj
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
