import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface Props {
  items: TimelineItem[];
}

function TimelineCard({ item, index }: { item: TimelineItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'center 0.6'],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? -60 : 60, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <div
      ref={ref}
      className={`relative flex items-center gap-6 lg:gap-12 ${
        index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {/* Card */}
      <motion.div
        style={{ opacity, x, scale }}
        className="flex-1"
      >
        <div className={`bg-white rounded-2xl p-6 shadow-xl shadow-gray-100 border border-gray-100 hover:shadow-2xl hover:shadow-amber-100/50 transition-all duration-300 group ${
          index % 2 === 0 ? 'mr-0 lg:mr-8' : 'ml-0 lg:ml-8'
        }`}>
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: item.color + '20' }}
            >
              {item.icon}
            </div>
            <div>
              <span
                className="text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-2 inline-block"
                style={{ color: item.color, backgroundColor: item.color + '15' }}
              >
                {item.year}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Center dot connector */}
      <motion.div
        style={{ opacity, scale }}
        className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center"
      >
        <div
          className="w-5 h-5 rounded-full border-4 border-white shadow-lg"
          style={{ backgroundColor: item.color }}
        />
      </motion.div>

      {/* Spacer for opposite side */}
      <div className="flex-1" />
    </div>
  );
}

export default function ScrollTimeline({ items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const lineHeight = useSpring(
    useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
    { stiffness: 60, damping: 20 }
  );

  return (
    <div ref={containerRef} className="relative py-8">
      {/* Vertical center line track */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200" />

      {/* Animated fill line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 overflow-hidden">
        <motion.div
          style={{ height: lineHeight }}
          className="w-full bg-gradient-to-b from-amber-400 via-orange-400 to-rose-400"
        />
      </div>

      {/* Timeline items */}
      <div className="relative flex flex-col gap-16 lg:gap-20">
        {items.map((item, i) => (
          <TimelineCard key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
