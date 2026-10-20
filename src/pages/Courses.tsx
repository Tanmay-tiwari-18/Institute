import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Users, BarChart2, CheckCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const courses = [
  { id: 'classes-6-8', title: 'Classes 6th–8th', subtitle: 'School-Level Coaching', icon: '📚', duration: 'Regular Classes', students: '—', level: 'Class 6th–8th', color: '#f59e0b', bg: 'from-amber-50 to-orange-50', border: 'border-amber-200', badge: 'Foundation', price: '₹400', desc: 'Build strong academic foundations with regular classes, concept-focused learning, and tests to track student progress.', highlights: ['School-level subject support', 'Regular tests and practice', 'Concept clarity and revision', 'Guidance for academic improvement', 'Student progress support', 'Focus on consistent learning'], syllabus: ['School curriculum support', 'Concept revision', 'Practice questions', 'Regular tests'] },
  { id: 'classes-9-10', title: 'Classes 9th–10th', subtitle: 'Board Exam Preparation', icon: '🎓', duration: 'Regular Classes', students: '—', level: 'Class 9th–10th', color: '#3b82f6', bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', badge: 'Board Preparation', price: '₹500', desc: 'Prepare for school and board examinations through subject guidance, regular practice, and tests that help students identify areas for improvement.', highlights: ['Board-focused preparation', 'Regular tests and revision', 'Practice with subject questions', 'Concept-based teaching', 'Guidance for exam preparation', 'Topper recognition'], syllabus: ['School curriculum support', 'Board exam practice', 'Chapter revision', 'Regular tests'] },
  { id: 'mathematics', title: 'Mathematics', subtitle: 'Classes 11th–12th', icon: '📐', duration: 'Regular Classes', students: '—', level: 'Class 11th–12th', color: '#10b981', bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-200', badge: 'Subject Coaching', price: '₹800', desc: 'Mathematics coaching for Classes 11th and 12th with topic-focused teaching, practice, and regular assessment.', highlights: ['Class 11th–12th Mathematics', 'Topic-wise concept explanation', 'Practice questions', 'Regular tests', 'Revision and doubt support', 'Exam preparation guidance'], syllabus: ['Class 11th Mathematics', 'Class 12th Mathematics', 'Topic practice', 'Revision and tests'] },
  { id: 'biology', title: 'Biology', subtitle: 'Classes 11th–12th', icon: '🔬', duration: 'Regular Classes', students: '—', level: 'Class 11th–12th', color: '#8b5cf6', bg: 'from-violet-50 to-purple-50', border: 'border-violet-200', badge: 'Subject Coaching', price: '₹800', desc: 'Biology coaching for Classes 11th and 12th with structured topic coverage, practice, and regular assessments.', highlights: ['Class 11th–12th Biology', 'Concept-focused teaching', 'Topic-wise revision', 'Regular tests', 'Practice and doubt support', 'Exam preparation guidance'], syllabus: ['Class 11th Biology', 'Class 12th Biology', 'Topic revision', 'Practice and tests'] },
  { id: 'arts', title: 'Arts', subtitle: 'Classes 11th–12th', icon: '📖', duration: 'Regular Classes', students: '—', level: 'Class 11th–12th', color: '#f43f5e', bg: 'from-rose-50 to-pink-50', border: 'border-rose-200', badge: 'Subject Coaching', price: '₹700', desc: 'Arts stream coaching for Classes 11th and 12th with regular learning support, practice, and assessments.', highlights: ['Class 11th–12th Arts', 'Subject-wise guidance', 'Regular tests and practice', 'Revision support', 'Exam preparation guidance', 'Student progress support'], syllabus: ['Class 11th Arts', 'Class 12th Arts', 'Subject revision', 'Practice and tests'] },
  { id: 'commerce', title: 'Commerce', subtitle: 'Classes 11th–12th', icon: '📊', duration: 'Regular Classes', students: '—', level: 'Class 11th–12th', color: '#06b6d4', bg: 'from-cyan-50 to-sky-50', border: 'border-cyan-200', badge: 'Subject Coaching', price: '₹700', desc: 'Commerce stream coaching for Classes 11th and 12th with subject guidance, practice, and regular assessments.', highlights: ['Class 11th–12th Commerce', 'Subject-wise guidance', 'Regular tests and practice', 'Revision support', 'Exam preparation guidance', 'Student progress support'], syllabus: ['Class 11th Commerce', 'Class 12th Commerce', 'Subject revision', 'Practice and tests'] },
];
function CourseCard({ course }: { course: (typeof courses)[0]; index?: number }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.65'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <motion.div ref={ref} style={{ opacity, y, scale }}>
      <div className={`bg-gradient-to-br ${course.bg} border ${course.border} rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group`}>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: course.color + '20' }}
              >
                {course.icon}
              </div>
              <div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full mb-1 inline-block"
                  style={{ color: course.color, backgroundColor: course.color + '18' }}
                >
                  {course.badge}
                </span>
                <h3 className="font-black text-gray-900 text-lg leading-tight">{course.title}</h3>
                <p className="text-xs text-gray-500">{course.subtitle}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-black text-gray-900">{course.price}</p>
              <p className="text-xs text-gray-400">fees</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{course.desc}</p>

          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students} students</span>
            <span className="flex items-center gap-1"><BarChart2 className="w-3.5 h-3.5" /> {course.level}</span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
            style={{ color: course.color }}
          >
            {expanded ? 'Show Less' : 'View Details'}
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Expandable Details */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 border-t border-white/60 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-3">✅ Key Highlights</h4>
                <ul className="space-y-2">
                  {course.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: course.color }} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-3">📖 Topics Covered</h4>
                <ul className="space-y-2">
                  {course.syllabus.map((s, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: course.color }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-5">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl shadow-md hover:scale-105 transition-all duration-200"
                style={{ backgroundColor: course.color }}
              >
                Enroll Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function CoursesSpine() {
  const spineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: spineRef, offset: ['start 0.5', 'end 0.5'] });
  const lineH = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '100%']), { stiffness: 50, damping: 18 });
  return (
    <div ref={spineRef} className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px pointer-events-none hidden lg:block">
      <div className="w-full h-full bg-amber-100" />
      <div className="absolute top-0 left-0 w-full overflow-hidden h-full">
        <motion.div style={{ height: lineH }} className="w-full bg-gradient-to-b from-amber-400 via-orange-400 to-rose-400" />
      </div>
    </div>
  );
}

export default function Courses() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-amber-100 text-amber-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6 border border-amber-200"
          >
            Our Programs
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl lg:text-5xl font-black text-gray-900 mb-5"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Learning for Every{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              Student
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Kavita Shree Institute offers coaching for Classes 6th–12th. Choose the class or subject that matches your learning needs.
          </motion.p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-white relative">
        <div className="max-w-6xl mx-auto px-6 relative">
          <CoursesSpine />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((c, i) => (
              <CourseCard key={c.id} course={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">At a Glance</p>
            <h2 className="text-3xl font-black text-gray-900">Compare Programs</h2>
          </AnimatedSection>
          <AnimatedSection>
            <div className="overflow-x-auto rounded-2xl shadow-md border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                    <th className="text-left p-4 font-bold text-gray-900">Program</th>
                    <th className="p-4 font-bold text-gray-900">Duration</th>
                    <th className="p-4 font-bold text-gray-900">Level</th>
                    <th className="p-4 font-bold text-gray-900">Fees</th>
                    <th className="p-4 font-bold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c, i) => (
                    <tr key={c.id} className={`border-b border-gray-100 hover:bg-amber-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{c.icon}</span>
                          <span className="font-semibold text-gray-900">{c.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center text-gray-600">{c.duration}</td>
                      <td className="p-4 text-center text-gray-600">{c.level}</td>
                      <td className="p-4 text-center font-semibold text-gray-900">{c.price}</td>
                      <td className="p-4 text-center">
                        <Link
                          to="/contact"
                          className="px-4 py-1.5 text-xs font-semibold rounded-lg text-white inline-block"
                          style={{ backgroundColor: c.color }}
                        >
                          Enroll
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-10 text-center text-white shadow-2xl shadow-amber-200">
              <span className="text-4xl">🎓</span>
              <h2 className="text-2xl font-black mt-4 mb-3">Not Sure Which Course to Pick?</h2>
              <p className="text-white/80 mb-6 text-sm max-w-md mx-auto">
                Contact Kavita Shree Institute to learn more about classes, subjects, and admission.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg text-sm"
              >
                Contact Institute <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
