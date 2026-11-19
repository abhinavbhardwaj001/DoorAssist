import { Link } from "react-router-dom";
import { Compass, Home, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-[#fefcfb] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg rounded-3xl border border-[#d8e2eb] bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
            <Compass className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-7xl font-black tracking-tight text-[#0a1128] sm:text-8xl">
            404
          </h1>

          <h2 className="mt-3 text-xl font-extrabold tracking-tight text-[#0a1128] sm:text-2xl">
            Page Not Found
          </h2>

          <p className="mt-2.5 max-w-sm text-sm font-medium leading-6 text-[#33415c]">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#034078] px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54]"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-6 py-3 text-sm font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078]"
            >
              <Search className="h-4 w-4 text-[#1282a2]" />
              <span>Browse Services</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
