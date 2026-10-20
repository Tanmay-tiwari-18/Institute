import { Link } from "react-router-dom";
import { ArrowRight, Bell } from "lucide-react";

export default function ResultBanner() {
  return (
    <section
      aria-label="Result announcement"
      className="w-full bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-b border-orange-100"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-24 pb-4 md:pt-28 md:pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-red-100 bg-white px-4 py-3.5 sm:px-5 shadow-sm">
          {/* Icon + text */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative flex w-11 h-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-600/30">
              <Bell className="w-5 h-5 fill-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-70 motion-safe:animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400 ring-2 ring-white" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                  New
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  Examination results have been published
                </h2>
              </div>
              <p className="mt-0.5 text-sm text-slate-500">
                Students can now view and download their latest results.
              </p>
            </div>
          </div>

          {/* CTA */}
          <Link
            to="/results"
            className="group inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-red-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300"
          >
            View results
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}