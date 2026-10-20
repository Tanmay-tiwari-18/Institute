import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Trophy, Star, TrendingUp } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const toppers = [
  { name: 'Class 10th Result', rank: '93.4%', exam: 'Class 10th', college: 'Kavita Shree Institute', score: '93.4%', color: '#f59e0b', avatar: '10', year: 'Result' },
  { name: 'Class 12th Result', rank: '91.0%', exam: 'Class 12th', college: 'Kavita Shree Institute', score: '91.0%', color: '#3b82f6', avatar: '12', year: 'Result' },
  { name: 'Class 10th Result', rank: '89.0%', exam: 'Class 10th', college: 'Kavita Shree Institute', score: '89.0%', color: '#10b981', avatar: '10', year: 'Result' },
  { name: 'Class 12th Result', rank: '82.6%', exam: 'Class 12th', college: 'Kavita Shree Institute', score: '82.6%', color: '#8b5cf6', avatar: '12', year: 'Result' },
];

const yearlyStats = [
  { year: 'Results', jeeSelections: 93.4, neetSelections: 91.0, boardToppers: 89.0, iitSelections: 82.6 },
];

const testimonials = [
  { name: 'Regular Tests', score: 'Academic Practice', quote: 'Regular tests help students review their preparation and identify areas for improvement.', color: '#f59e0b', avatar: 'RT' },
  { name: 'Topper Recognition', score: 'Student Achievement', quote: 'Students are encouraged and recognised for their academic efforts and achievements.', color: '#10b981', avatar: 'TR' },
  { name: 'Practical Activities', score: 'Learning by Doing', quote: 'Practical activities support learning beyond textbook study.', color: '#3b82f6', avatar: 'PA' },
  { name: 'Student Competitions', score: 'Co-curricular Activities', quote: 'Activities such as rangoli and essay competitions encourage creativity and participation.', color: '#8b5cf6', avatar: 'SC' },
];

function TopperCard({ topper }: { topper: (typeof toppers)[0]; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.65'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  return (
    <motion.div ref={ref} style={{ opacity, y, scale }}>
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-md hover:shadow-xl hover:border-amber-100 transition-all duration-300 group relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5 -translate-y-6 translate-x-6"
          style={{ backgroundColor: topper.color }}
        />
        <div className="flex items-center gap-4 mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ backgroundColor: topper.color }}
          >
            {topper.avatar}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{topper.name}</h3>
            <p className="text-xs text-gray-500">{topper.college}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-lg font-black"
              style={{ color: topper.color }}
            >
              {topper.rank}
            </span>
            <p className="text-xs text-gray-500">{topper.exam}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">{topper.score}</p>
            <p className="text-xs text-gray-400">Score</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatsSpine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.3'] });
  const lineH = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '100%']), { stiffness: 50, damping: 18 });

  return (
    <div ref={ref} className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px pointer-events-none hidden lg:block">
      <div className="absolute inset-0 bg-amber-100" />
      <div className="absolute inset-0 overflow-hidden">
        <motion.div style={{ height: lineH }} className="w-full bg-gradient-to-b from-amber-400 via-orange-400 to-rose-400" />
      </div>
    </div>
  );
}

function YearRow({ stat, index }: { stat: (typeof yearlyStats)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.6'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -40 : 40, 0]);
  const dotScale = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1.3, 1]);
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative grid grid-cols-2 gap-8 items-center">
      {/* Dot */}
      <motion.div
        style={{ scale: dotScale, opacity }}
        className="absolute left-1/2 -translate-x-1/2 z-10 w-5 h-5 rounded-full bg-amber-400 border-4 border-white shadow-lg"
      />

      {/* Left / Right card */}
      <motion.div
        style={{ opacity, x }}
        className={isLeft ? 'flex justify-end pr-6' : 'col-start-2 flex justify-start pl-6'}
      >
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-amber-100 transition-all w-full max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-black text-amber-600">{stat.year}</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Class 10th', value: stat.jeeSelections, color: '#f59e0b' },
              { label: 'Class 12th', value: stat.neetSelections, color: '#10b981' },
              { label: 'Class 10th', value: stat.boardToppers, color: '#3b82f6' },
              { label: 'Class 12th', value: stat.iitSelections, color: '#8b5cf6' },
            ].map((item) => (
              <div key={item.label} className="text-center p-2 rounded-lg bg-gray-50">
                <p className="text-lg font-black" style={{ color: item.color }}>{item.value}</p>
                <p className="text-xs text-gray-400 leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Year label on opposite side */}
      <motion.div style={{ opacity }} className={isLeft ? 'flex items-center pl-8' : 'col-start-1 row-start-1 flex justify-end items-center pr-8'}>
        <span className="text-4xl font-black text-gray-200">{stat.year}</span>
      </motion.div>
    </div>
  );
}

export default function Results() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-amber-100 text-amber-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6 border border-amber-200"
          >
            Hall of Fame
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl lg:text-5xl font-black text-gray-900 mb-5"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Student Results{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              Louder Than Words
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 max-w-xl mx-auto leading-relaxed"
          >
            Kavita Shree Institute celebrates student performance, regular assessments, and continuous academic improvement.
          </motion.p>
           <a
                href="/search-result"
                className="inline-block px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm hover:scale-105 shadow-lg"
              >
                View All Results
              </a>
        </div>
        
      </section>

      {/* Overall Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { label: 'Class 10th Result', value: '93.4%', icon: '📚', color: '#f59e0b' },
              { label: 'Class 12th Result', value: '91.0%', icon: '🎓', color: '#10b981' },
              { label: 'Class 10th Result', value: '89.0%', icon: '📘', color: '#3b82f6' },
              { label: 'Class 12th Result', value: '82.6%', icon: '🏅', color: '#f43f5e' },
            ].map((s, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.65'] });
              const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
              const y = useTransform(scrollYProgress, [0, 1], [30, 0]);
              return (
                <motion.div key={i} ref={ref} style={{ opacity, y }}>
                  <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-md hover:shadow-lg hover:border-amber-100 transition-all">
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Toppers Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">Result Highlights</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">Student Result Highlights</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              These result highlights are shared in the institute manifesto.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {toppers.map((t, i) => (
              <TopperCard key={i} topper={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Year-wise Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection className="text-center mb-20">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">Student Results</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">Academic Result Highlights</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              The institute highlights these student results and supports learning through regular tests and activities.
            </p>
          </AnimatedSection>

          <div className="relative">
            <StatsSpine />
            <div className="flex flex-col gap-14">
              {yearlyStats.map((s, i) => (
                <YearRow key={s.year} stat={s} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-amber-50/40 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">In Their Words</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Student Activities</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.65'] });
              const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
              const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
              return (
                <motion.div key={i} ref={ref} style={{ opacity, y }}>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl hover:border-amber-100 transition-all duration-300">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed italic mb-6">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: t.color }}
                      >
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                        <p className="text-xs font-semibold" style={{ color: t.color }}>{t.score}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trophy showcase */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-10 text-center text-white shadow-2xl shadow-amber-200">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-white/80" />
              <h2 className="text-2xl font-black mb-3">Keep Learning, Keep Growing</h2>
              <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
                Join Kavita Shree Institute for classes 6th to 12th. Contact us to learn more about courses and admissions.
              </p>
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm hover:scale-105 shadow-lg"
              >
                Contact the Institute
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
