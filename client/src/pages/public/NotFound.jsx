import { Link } from "react-router-dom";
import { Compass, Home, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-lg overflow-hidden rounded-4xl border border-white/75 bg-white/80 p-8 text-center shadow-[0_16px_55px_rgba(203,189,255,0.22)] backdrop-blur-2xl sm:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#e4a5ff]/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-[#acdcff]/30 blur-3xl"
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
            <Compass className="h-7 w-7" />
          </div>

          <h1 className="mt-5 bg-linear-to-r from-[#8e54b5] via-[#6669c7] to-[#3b82b8] bg-clip-text text-7xl font-black tracking-tight text-transparent sm:text-8xl">
            404
          </h1>

          <h2 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Page Not Found
          </h2>

          <p className="mt-2.5 max-w-sm text-sm font-medium leading-6 text-slate-500">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#bfcaff]/55 bg-white/85 px-6 py-3 text-sm font-bold text-slate-700 shadow-xs transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-[0.99]"
            >
              <Search className="h-4 w-4 text-[#7c56a8]" />
              <span>Browse Services</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
