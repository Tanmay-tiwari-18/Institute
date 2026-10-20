import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const faculty = [
  { name: 'Classes 6th–8th', role: 'School-Level Coaching', exp: 'Regular tests', icon: '📚', color: '#f59e0b' },
  { name: 'Classes 9th–10th', role: 'School-Level Coaching', exp: 'Result-focused learning', icon: '🎓', color: '#3b82f6' },
  { name: 'Mathematics', role: 'Classes 11th–12th', exp: 'Subject coaching', icon: '📐', color: '#10b981' },
  { name: 'Biology', role: 'Classes 11th–12th', exp: 'Subject coaching', icon: '🔬', color: '#8b5cf6' },
  { name: 'Arts', role: 'Classes 11th–12th', exp: 'Subject coaching', icon: '📖', color: '#f43f5e' },
  { name: 'Commerce', role: 'Classes 11th–12th', exp: 'Subject coaching', icon: '📊', color: '#06b6d4' },
];

const values = [
  { icon: '🎯', title: 'Strong Academic Foundation', desc: 'Focused coaching for students from classes 6th to 12th.' },
  { icon: '📝', title: 'Regular Tests', desc: 'Regular tests help students practise and track their progress.' },
  { icon: '🏆', title: 'Topper Recognition', desc: 'Student achievements and results are celebrated and encouraged.' },
  { icon: '🎨', title: 'Practical Activities', desc: 'Competitions and activities support confidence and all-round learning.' },
];

const milestones = [
  { year: '6th–8th', event: 'School-Level Coaching', detail: 'Learning support for students in classes 6th to 8th.', color: '#f59e0b' },
  { year: '9th–10th', event: 'Board-Class Preparation', detail: 'Focused preparation and regular tests for classes 9th and 10th.', color: '#10b981' },
  { year: '11th–12th', event: 'Mathematics & Biology', detail: 'Subject coaching for Mathematics and Biology students.', color: '#3b82f6' },
  { year: '11th–12th', event: 'Arts & Commerce', detail: 'Coaching options for Arts and Commerce students.', color: '#8b5cf6' },
  { year: '93.4%', event: 'Class 10th Result Highlight', detail: 'Result percentage shown in the institute manifesto.', color: '#f43f5e' },
  { year: '91.0%', event: 'Class 12th Result Highlight', detail: 'Result percentage shown in the institute manifesto.', color: '#06b6d4' },
  { year: '89.0%', event: 'Class 10th Result Highlight', detail: 'Another result percentage shown in the institute manifesto.', color: '#f59e0b' },
  { year: '82.6%', event: 'Class 12th Result Highlight', detail: 'Another result percentage shown in the institute manifesto.', color: '#10b981' },
];

function MilestoneTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });
  const lineH = useSpring(
    useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
    { stiffness: 50, damping: 18 }
  );

  return (
    <div ref={containerRef} className="relative py-4">
      {/* track */}
      <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200" />
      {/* fill */}
      <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 overflow-hidden">
        <motion.div style={{ height: lineH }} className="w-full bg-gradient-to-b from-amber-400 via-orange-400 to-rose-400" />
      </div>

      <div className="flex flex-col gap-10">
        {milestones.map((m, i) => (
          <MilestoneItem key={i} milestone={m} index={i} />
        ))}
      </div>
    </div>
  );
}

function MilestoneItem({ milestone, index }: { milestone: (typeof milestones)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.6'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -40 : 40, 0]);
  const dotScale = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1.4, 1]);

  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative flex items-center md:grid md:grid-cols-2 gap-6 pl-14 md:pl-0">
      {/* dot */}
      <motion.div
        style={{ scale: dotScale, opacity, backgroundColor: milestone.color }}
        className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 w-4 h-4 rounded-full border-4 border-white shadow-md"
      />

      {/* Card */}
      <div className={`${isLeft ? 'md:flex md:justify-end' : 'md:col-start-2'}`}>
        <motion.div
          style={{ opacity, x }}
          className={`${isLeft ? 'md:mr-8' : 'md:ml-8'} max-w-sm`}
        >
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-amber-100 transition-all duration-300">
            <span
              className="text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-full mb-2 inline-block"
              style={{ color: milestone.color, backgroundColor: milestone.color + '15' }}
            >
              {milestone.year}
            </span>
            <h4 className="font-bold text-gray-900 text-sm mb-1">{milestone.event}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{milestone.detail}</p>
          </div>
        </motion.div>
      </div>

      {/* Year label opposite side */}
      {isLeft ? (
        <motion.div style={{ opacity }} className="hidden md:flex items-center pl-8">
          <span className="text-3xl font-black" style={{ color: milestone.color }}>{milestone.year}</span>
        </motion.div>
      ) : (
        <motion.div style={{ opacity }} className="hidden md:flex justify-end items-center pr-8 col-start-1 row-start-1">
          <span className="text-3xl font-black" style={{ color: milestone.color }}>{milestone.year}</span>
        </motion.div>
      )}
    </div>
  );
}

function FacultyCard({ f }: { f: (typeof faculty)[0]; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.65'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  return (
    <motion.div ref={ref} style={{ opacity, y, scale }}>
      <div className="bg-white rounded-2xl p-6 text-center shadow-md border border-gray-100 hover:shadow-xl hover:border-amber-200 transition-all duration-300 group hover:-translate-y-1">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: f.color + '15' }}
        >
          {f.icon}
        </div>
        <h3 className="font-bold text-gray-900 mb-1">{f.name}</h3>
        <p className="text-xs font-semibold mb-1" style={{ color: f.color }}>{f.role}</p>
        <p className="text-xs text-gray-400">{f.exp} experience</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-amber-50 via-white to-orange-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block bg-amber-100 text-amber-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6 border border-amber-200"
              >
                About Us
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Kavita Shree Institute —<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                  Give Wings To Your Dream
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-gray-600 leading-relaxed mb-6"
              >
                Kavita Shree Institute supports students from classes 6th to 12th with focused subject coaching and regular tests. Our aim is to help students build confidence and work toward their academic goals.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-gray-600 leading-relaxed mb-8"
              >
                We offer coaching in Mathematics, Biology, Arts and Commerce for senior classes, along with learning support for school-level students. Visit us near Rachna Medical, Gayatri Nagar, Makronia, Sagar (M.P.) or call 9691245740 / 8878059685.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-3"
              >
                {['Classes 6th–12th', 'Regular Tests', 'Student Activities'].map((b) => (
                  <span key={b} className="flex items-center gap-1.5 text-sm text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {b}
                  </span>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-amber-100">
                <img src="/images/director.jpg" alt="Director" className="w-full h-80 lg:h-96 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 to-transparent" />
                <div className="absolute bottom-5 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10">
  <div className="bg-white/95 backdrop-blur-md rounded-xl px-4 sm:px-5 py-4 shadow-lg text-center">
    <p className="font-bold text-gray-900 text-base sm:text-lg leading-6">
      Kavita Mishra
    </p>

    
  </div>
</div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-xl border border-amber-100">
                <div className="text-2xl font-black text-amber-600">6th–12th</div>
                <div className="text-xs text-gray-500">Classes</div>
              </div>
              <div className="absolute top-20 -left-4 sm:-left-6 z-20 bg-white rounded-2xl p-3 shadow-xl border border-green-100">
  <div className="text-2xl font-black text-green-600">93.4%</div>
  <div className="text-xs text-gray-500">Result Highlight</div>
</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">What Drives Us</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Our Core Values</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.65'] });
              const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
              const y = useTransform(scrollYProgress, [0, 1], [30, 0]);
              return (
                <motion.div key={i} ref={ref} style={{ opacity, y }}>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 hover:shadow-lg hover:border-amber-200 transition-all duration-300 h-full text-center group hover:-translate-y-1">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{v.icon}</div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">{v.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">Meet the Experts</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">Our Faculty</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Coaching options for school classes and senior secondary subjects.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {faculty.map((f, i) => (
              <FacultyCard key={i} f={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">Our Story</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">Learning & Achievement Highlights</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Explore the classes, results and student activities highlighted by Kavita Shree Institute.
            </p>
          </AnimatedSection>
          <MilestoneTimeline />
        </div>
      </section>

      {/* Awards */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">Recognition</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Student Activities & Recognition</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🎨', title: 'Rangoli Competition', year: 'Student Activity', body: 'Creative participation and expression' },
              { icon: '🎓', title: 'Class XII Farewell', year: 'Student Activity', body: 'Celebrating students completing class 12th' },
              { icon: '📝', title: 'Essay Competition', year: 'Student Activity', body: 'Encouraging writing and expression' },
              { icon: '📊', title: 'Regular Tests', year: 'Academic Support', body: 'Practice and progress tracking' },
              { icon: '🏆', title: 'Topper Recognition', year: 'Achievement', body: 'Celebrating student performance' },
              { icon: '🔬', title: 'Practical Activities', year: 'Learning', body: 'Activity-based learning experiences' },
            ].map((a, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.65'] });
              const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
              const y = useTransform(scrollYProgress, [0, 1], [30, 0]);
              return (
                <motion.div key={i} ref={ref} style={{ opacity, y }}>
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-md hover:shadow-lg hover:border-amber-200 transition-all duration-300 flex items-start gap-4 group">
                    <div className="text-3xl">{a.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-amber-600 transition-colors">{a.title}</h4>
                      <p className="text-xs text-amber-600 font-semibold mb-0.5">{a.year}</p>
                      <p className="text-xs text-gray-400">{a.body}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
