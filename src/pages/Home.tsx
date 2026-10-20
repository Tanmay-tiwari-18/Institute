import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Trophy,
  Users,
  Star,
  CheckCircle,
  ChevronRight,
  Target,
  Zap,
  Heart,
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import ResultBanner from "../components/ResultBanner";

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const stats = [
  { value: '6th–12th', label: 'Classes Covered', icon: '🏛️' },
  { value: '2', label: 'Board Options', icon: '🎓' },
  { value: '6 Courses', label: 'Course Options', icon: '🎯' },
  { value: '2025', label: 'Result Highlights', icon: '🏆' },
];

const features = [
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Regular Tests & Practice',
    description:
      'Regular tests, revision and board-oriented practice help students prepare for examinations.',
    color: '#f59e0b',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Academic Guidance',
    description:
      'Subject-focused academic support for students from Classes 6th to 12th.',
    color: '#3b82f6',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Student Development',
    description:
      'A supportive learning environment encourages confidence, communication and teamwork.',
    color: '#8b5cf6',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Study Material',
    description:
      'Comprehensive notes, practice papers, and previous year questions for every chapter.',
    color: '#10b981',
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Topper Recognition',
    description:
      'Student achievements are recognised to encourage effort, consistency and motivation.',
    color: '#f43f5e',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Creative Activities',
    description:
      'Activities such as essay writing and rangoli encourage creativity and expression.',
    color: '#06b6d4',
  },
];

const courses = [
  {
    title: 'Classes 6th–8th',
    desc: 'Comprehensive 2-year program for IIT aspirants with School-syllabus support, concept building and regular practice.',
    badge: 'Foundation Classes',
    badgeColor: '#f59e0b',
    duration: 'Classes 6th–8th',
    students: 'Fee: ₹400',
    icon: '📘',
    bg: 'from-amber-50 to-orange-50',
    border: 'border-amber-200',
  },
  {
    title: 'Classes 9th–10th',
    desc: 'Strengthen concepts through subject practice, revision and board-oriented preparation.',
    badge: 'Board Preparation',
    badgeColor: '#10b981',
    duration: 'Classes 6th–8th',
    students: 'Fee: ₹500',
    icon: '🎓',
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
  },
  {
    title: 'Classes 11th–12th',
    desc: 'Choose Mathematics, Biology, Arts or Commerce stream support according to your course.',
    badge: 'Stream Options',
    badgeColor: '#3b82f6',
    duration: 'Senior Secondary',
    students: 'Maths/Biology ₹800 • Arts/Commerce ₹700',
    icon: '📚',
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
  },
];

const testimonials = [
  {
    name: 'Class 10th Student',
    score: '93.4% – Class 10th',
    quote:
      'Regular practice and revision can help students prepare with confidence for board examinations.',
    avatar: '10',
    color: '#f59e0b',
  },
  {
    name: 'Class 12th Student',
    score: '91.0% – Class 12th',
    quote:
      "Study material and focused preparation support learning throughout the academic year.",
    avatar: '12',
    color: '#10b981',
  },
  {
    name: 'Student Achievement',
    score: '89.0% – Class 10th',
    quote:
      'Regular tests encourage students to track their progress and keep improving.',
    avatar: '★',
    color: '#3b82f6',
  },
];

/* ─── SCROLL PROGRESS LINE ──────────────────────────────────────────────── */
function ScrollProgressLine() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 origin-left z-[100] shadow-sm"
    />
  );
}

/* ─── CONNECTING SPINE (page-level vertical line) ───────────────────────── */
function PageSpine() {
  const spineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: spineRef,
    offset: ['start start', 'end end'],
  });
  const lineHeight = useSpring(
    useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
    { stiffness: 40, damping: 18 }
  );

  return (
    <div ref={spineRef} className="absolute inset-0 pointer-events-none">
      {/* track */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-amber-100 hidden lg:block" />
      {/* fill */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px overflow-hidden hidden lg:block">
        <motion.div
          style={{ height: lineHeight }}
          className="w-full bg-gradient-to-b from-amber-400 via-orange-400 to-rose-300"
        />
      </div>
    </div>
  );
}

/* ─── STAT COUNTER ──────────────────────────────────────────────────────── */
function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.6'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} transition={{ delay: index * 0.1 }}>
      <div className="bg-white rounded-2xl p-6 text-center shadow-lg shadow-gray-100 border border-gray-100 hover:border-amber-200 hover:shadow-amber-100/60 transition-all duration-300 group">
        <div className="text-3xl mb-2">{stat.icon}</div>
        <div className="text-3xl lg:text-4xl font-black text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
          {stat.value}
        </div>
        <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
      </div>
    </motion.div>
  );
}

/* ─── FEATURE CARD ──────────────────────────────────────────────────────── */
function FeatureCard({ feat }: { feat: (typeof features)[0]; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.65'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, scale, y }}>
      <div className="bg-white rounded-2xl p-6 h-full shadow-md shadow-gray-100 border border-gray-100 hover:border-amber-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
          style={{ backgroundColor: feat.color + '18', color: feat.color }}
        >
          {feat.icon}
        </div>
        <h3 className="font-bold text-gray-900 mb-2 text-base group-hover:text-amber-600 transition-colors">
          {feat.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">{feat.description}</p>
      </div>
    </motion.div>
  );
}

/* ─── COURSE CARD ───────────────────────────────────────────────────────── */
function CourseCard({ course, index }: { course: (typeof courses)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.6'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -40 : 40, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <motion.div ref={ref} style={{ opacity, x, scale }}>
      <div
        className={`bg-gradient-to-br ${course.bg} border ${course.border} rounded-2xl p-6 h-full hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden`}
      >
        <div className="absolute -top-8 -right-8 text-7xl opacity-10 group-hover:opacity-20 transition-opacity">
          {course.icon}
        </div>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block"
          style={{ color: course.badgeColor, backgroundColor: course.badgeColor + '18' }}
        >
          {course.badge}
        </span>
        <div className="text-3xl mb-3">{course.icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">{course.desc}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" /> {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {course.students}
          </span>
        </div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
          style={{ color: course.badgeColor }}
        >
          Learn More <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

/* ─── TESTIMONIAL CARD ──────────────────────────────────────────────────── */
function TestimonialCard({
  t,
}: {
  t: (typeof testimonials)[0];
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'center 0.65'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      <div className="bg-white rounded-2xl p-6 h-full shadow-lg border border-gray-100 hover:shadow-xl hover:border-amber-100 transition-all duration-300 relative">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: t.color }}
          >
            {t.avatar}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
            <p className="text-xs font-medium" style={{ color: t.color }}>
              {t.score}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────────────────────── */
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroBgY = useTransform(heroScroll, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <>
    <ResultBanner />
    <div className="relative">
      <ScrollProgressLine />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Parallax BG */}
        <motion.div
          style={{ y: heroBgY }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/images/hero-bg.jpg"
            alt="Institute"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/95" />
        </motion.div>

        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block bg-amber-100 text-amber-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6 border border-amber-200"
          >
            🏆 COACHING FOR CLASSES 6TH TO 12TH
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.08] mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Give Wings To Your{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                Dream
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  d="M2 8 C60 2, 140 12, 200 6 C240 2, 270 10, 298 6"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            <br />with Kavita Shree Institute Institute
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Kavita Shree Institute provides academic coaching for Classes 6th to 12th in Makronia, Sagar (M.P.), with regular assessments, study support and student development.
            6th–12th years of transforming students into toppers with expert faculty and
            personalised guidance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/courses"
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-2xl shadow-xl shadow-amber-200 hover:shadow-amber-300 hover:scale-105 transition-all duration-300 text-base"
            >
              Explore Courses
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/results"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 font-bold rounded-2xl hover:border-amber-300 hover:text-amber-600 transition-all duration-300 text-base shadow-sm"
            >
              <Trophy className="w-5 h-5 text-amber-500" />
              View Results
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
          >
            {['MP Board / CBSE Support', 'Classes 6th–12th', 'Regular Tests', 'Student Activities'].map((b) => (
              <span key={b} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {b}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 text-xs"
        >
          <span>Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-gray-300 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1.5 h-1.5 bg-amber-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">
              At A Glance
            </p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
              Academic Support for School Students
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((s, i) => (
              <StatCard key={i} stat={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY KSI ───────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <PageSpine />
        <div className="max-w-6xl mx-auto px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">
              Why Choose Us
            </p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              We combine regular practice, subject understanding and student development
              in a supportive learning environment.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} feat={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSES ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">
              Courses & Fees
            </p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Coaching for Classes 6th–12th
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Course options include Classes 6th–8th, Classes 9th–10th, and senior-secondary
              Mathematics, Biology, Arts and Commerce.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c, i) => (
              <CourseCard key={i} course={c} index={i} />
            ))}
          </div>
          <AnimatedSection className="text-center mt-10">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-amber-300 text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors text-sm"
            >
              View All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ── TIMELINE SECTION ──────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-amber-50/40">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection className="text-center mb-20">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">
              Learning Pathways
            </p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Learning Beyond the Classroom
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              The institute encourages academic preparation alongside creativity, communication, teamwork and confidence-building activities.
            </p>
          </AnimatedSection>
          <JourneyTimeline />
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-amber-50/40 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">
              Student Stories
            </p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Student Achievement Highlights
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-10 lg:p-16 text-center overflow-hidden shadow-2xl shadow-amber-200">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl" />
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full" />
              <div className="relative z-10">
                <span className="text-4xl">🚀</span>
                <h2 className="text-3xl lg:text-4xl font-black text-white mt-4 mb-4">
                  Give Wings To Your Dream
                </h2>
                <p className="text-white/80 mb-8 text-base max-w-lg mx-auto">
                  Contact Kavita Shree Institute to ask about classes, subjects, fees and admissions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/contact"
                    className="px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                  >
                    Contact Institute
                  </Link>
                  <Link
                    to="/courses"
                    className="px-8 py-4 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 text-sm"
                  >
                    Explore Courses
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
    </>
  );
}

/* ─── JOURNEY TIMELINE ───────────────────────────────────────────────────── */
const journeyItems = [
  {
    year: '6th–8th',
    title: 'Foundation Classes',
    description: 'Academic support for Classes 6th to 8th with concept building and regular practice.',
    icon: '🌱',
    color: '#10b981',
  },
  {
    year: '9th–10th',
    title: 'Board Preparation',
    description: 'Subject practice, revision and board-oriented preparation for Classes 9th and 10th.',
    icon: '⭐',
    color: '#f59e0b',
  },
  {
    year: 'Mathematics',
    title: 'Senior Secondary',
    description: 'Mathematics support for Classes 11th and 12th.',
    icon: '🏫',
    color: '#3b82f6',
  },
  {
    year: 'Biology',
    title: 'Biology Stream',
    description: 'Biology-focused academic support for Classes 11th and 12th.',
    icon: '🎓',
    color: '#8b5cf6',
  },
  {
    year: 'Arts',
    title: 'Arts Stream',
    description: 'Subject-focused academic guidance for students in the Arts stream.',
    icon: '💻',
    color: '#06b6d4',
  },
  {
    year: 'Commerce',
    title: 'Commerce Stream',
    description: 'Subject-focused academic guidance for students in the Commerce stream.',
    icon: '🏆',
    color: '#f43f5e',
  },
];

function JourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.3'],
  });
  const lineH = useSpring(
    useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
    { stiffness: 50, damping: 16 }
  );

  return (
    <div ref={containerRef} className="relative">
      {/* track */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200" />
      {/* fill */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 overflow-hidden">
        <motion.div style={{ height: lineH }} className="w-full bg-gradient-to-b from-amber-400 via-orange-400 to-rose-400" />
      </div>

      <div className="relative flex flex-col gap-14">
        {journeyItems.map((item, i) => (
          <JourneyItem key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}

function JourneyItem({ item, index }: { item: (typeof journeyItems)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'center 0.55'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -50 : 50, 0]);
  const dotScale = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1.3, 1]);

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative grid grid-cols-2 gap-4 items-center ${isLeft ? '' : ''}`}
    >
      {/* Left side */}
      <div className={isLeft ? 'flex justify-end pr-8' : 'col-start-2 flex justify-start pl-8'}>
        {isLeft && (
          <motion.div style={{ opacity, x }}>
            <JourneyCard item={item} />
          </motion.div>
        )}
        {!isLeft && (
          <motion.div style={{ opacity, x }}>
            <JourneyCard item={item} />
          </motion.div>
        )}
      </div>

      {/* Center dot */}
      <motion.div
        style={{ scale: dotScale, opacity }}
        className={`absolute left-1/2 -translate-x-1/2 z-10 ${isLeft ? '' : 'col-start-1'}`}
      >
        <div
          className="w-6 h-6 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
          style={{ backgroundColor: item.color }}
        >
          <span className="text-xs">{item.icon}</span>
        </div>
      </motion.div>

      {/* Right side label */}
      {isLeft && (
        <motion.div style={{ opacity }} className="pl-10">
          <span
            className="text-2xl font-black"
            style={{ color: item.color }}
          >
            {item.year}
          </span>
        </motion.div>
      )}
      {!isLeft && (
        <motion.div style={{ opacity }} className="col-start-1 flex justify-end pr-10">
          <span className="text-2xl font-black" style={{ color: item.color }}>
            {item.year}
          </span>
        </motion.div>
      )}
    </div>
  );
}

function JourneyCard({ item }: { item: (typeof journeyItems)[0] }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg hover:border-amber-100 transition-all duration-300 max-w-xs w-full">
      <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
    </div>
  );
}
