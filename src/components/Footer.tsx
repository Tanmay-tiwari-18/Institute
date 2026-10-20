import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>

              <div className="leading-tight">
                <span className="block text-sm font-bold text-white">
                  Kavita Shree
                </span>

                <span className="block text-xs text-amber-500 font-semibold tracking-widest uppercase">
                  Institute
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-5">
              Give Wings To Your Dream. Providing affordable and structured
              academic coaching for Classes 6th to 12th, with regular tests,
              study support, practical learning and student development.
            </p>

            <div className="flex gap-3">
              {['f', 'in', 'yt', 'tw'].map((label, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={`Social media ${label}`}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-amber-500 flex items-center justify-center transition-colors text-xs font-bold text-gray-300 hover:text-white uppercase"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">
              Quick Links
            </h4>

            <ul className="space-y-2.5 text-sm">
              {['Home', 'About Us', 'Courses', 'Results', 'Contact'].map(
                (item, i) => {
                  const paths = [
                    '/',
                    '/about',
                    '/courses',
                    '/results',
                    '/contact',
                  ];

                  return (
                    <li key={item}>
                      <Link
                        to={paths[i]}
                        className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-amber-500 inline-block" />
                        {item}
                      </Link>
                    </li>
                  );
                }
              )}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">
              Our Courses
            </h4>

            <ul className="space-y-2.5 text-sm">
              {[
                'Classes 6th–8th (All Subjects)',
                'Classes 9th–10th (All Subjects)',
                'Mathematics (11th–12th)',
                'Biology (11th–12th)',
                'Arts (11th–12th)',
                'Commerce (11th–12th)',
              ].map((course) => (
                <li key={course} className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-500 inline-block mt-2 shrink-0" />
                  <span>{course}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">
              Contact Us
            </h4>

            <ul className="space-y-3 text-sm">

              {/* Address */}
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />

                <span>
                  Near Rachna Medical,
                  <br />
                  Gayatri Nagar, Makronia,
                  <br />
                  Sagar, Madhya Pradesh
                </span>
              </li>

              {/* Phone Number 1 */}
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />

                <a
                  href="tel:9691245740"
                  className="hover:text-amber-400 transition-colors"
                >
                  9691245740
                </a>
              </li>

              {/* Phone Number 2 */}
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />

                <a
                  href="tel:8878059685"
                  className="hover:text-amber-400 transition-colors"
                >
                  8878059685
                </a>
              </li>

              {/* Email */}
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />

                <span className="text-sm">
                  For admissions and course enquiries, please call us.
                </span>
              </li>

            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            © {new Date().getFullYear()} Kavita Shree Institute. All rights reserved.
          </p>

          <p className="text-gray-600">
            Designed with ❤️ for student success
          </p>
        </div>
      </div>
    </footer>
  );
}