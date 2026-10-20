import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const contactInfo = [
  {
    icon: <Phone className="w-5 h-5" />,
    label: 'Phone',
    value: '9691245740',
    sub: 'Call for class and admission details',
    color: '#f59e0b',
  },
  {
    icon: <Mail className="w-5 h-5" />,
    label: 'Email',
    value: 'Email not provided',
    sub: 'Please contact us by phone',
    color: '#3b82f6',
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: 'Address',
    value: 'Near Rachna Medical, Gayatri Nagar',
    sub: 'Makronia, Sagar (M.P.)',
    color: '#10b981',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    label: 'Hours',
    value: 'Contact for timings',
    sub: 'Timings not specified',
    color: '#8b5cf6',
  },
];

const faqs = [
  {
    q: 'Which classes are available?',
    a: 'Kavita Shree Institute offers coaching for Classes 6th to 12th. Please call the institute for current batch timings and admission details.',
  },
  {
    q: 'Which subjects and streams are available?',
    a: 'For Classes 11th and 12th, the listed streams include Mathematics, Biology, Arts, and Commerce. Contact the institute to confirm subject combinations.',
  },
  {
    q: 'Where is the institute located?',
    a: 'The institute is near Rachna Medical, Gayatri Nagar, Makronia, Sagar, Madhya Pradesh.',
  },
  {
    q: 'How can I know the fees?',
    a: 'The listed fees are ₹400 for Classes 6th–8th, ₹500 for Classes 9th–10th, ₹800 for Mathematics and Biology, and ₹700 for Arts and Commerce. Please confirm the fee details directly with the institute.',
  },
  {
    q: 'How can I contact the institute?',
    a: 'Call 9691245740 or 8878059685 for admission and class-related enquiries.',
  },
];

function FAQItem({ faq }: { faq: (typeof faqs)[0]; index?: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.7'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [20, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white hover:bg-amber-50/30 transition-colors"
        >
          <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
          <span
            className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              open ? 'bg-amber-500 text-white rotate-45' : 'bg-gray-100 text-gray-600'
            }`}
          >
            +
          </span>
        </button>
        <motion.div
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
            {faq.a}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitNotice, setSubmitNotice] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitNotice('');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          course: formData.course.trim(),
          message: formData.message.trim() || 'No additional message provided.',
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to submit your enquiry. Please try again.');
      }

      setSubmitted(true);
      if (data.confirmationSent === false) {
        setSubmitNotice('Your enquiry reached the institute, but the confirmation email could not be sent.');
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Unable to connect to the server. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-amber-100 text-amber-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6 border border-amber-200"
          >
            Get In Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl lg:text-5xl font-black text-gray-900 mb-5"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Let's Begin Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              Success Story
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 max-w-xl mx-auto"
          >
            Have questions or ready to enroll? Reach out and our academic counselors will guide you every step of the way.
          </motion.p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactInfo.map((c, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.65'] });
              const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
              const y = useTransform(scrollYProgress, [0, 1], [30, 0]);
              return (
                <motion.div key={i} ref={ref} style={{ opacity, y }}>
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-md hover:shadow-xl hover:border-amber-200 transition-all duration-300 group text-center hover:-translate-y-1">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: c.color + '15', color: c.color }}
                    >
                      {c.icon}
                    </div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{c.label}</p>
                    <p className="font-bold text-gray-900 text-sm">{c.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Form */}
            <AnimatedSection direction="left">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Book Free Counselling</h2>
                <p className="text-sm text-gray-500 mb-6">Fill in your details and contact the institute for admission information.</p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-500 text-sm">
                      Your enquiry has been submitted successfully. Our team will contact you shortly.
                    </p>
                    {submitNotice && (
                      <p className="mt-3 text-sm text-amber-700">{submitNotice}</p>
                    )}
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Interested Course *</label>
                      <select
                        name="course"
                        required
                        value={formData.course}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all bg-white"
                      >
                        <option value="">Select a program</option>
                        <option>Classes 6th–8th</option>
                        <option>Classes 9th–10th</option>
                        <option>Mathematics (Classes 11th–12th)</option>
                        <option>Biology (Classes 11th–12th)</option>
                        <option>Arts (Classes 11th–12th)</option>
                        <option>Commerce (Classes 11th–12th)</option>
                        <option>Free Counselling Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Any specific doubts, requirements, or questions..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
                      />
                    </div>
                    {submitError && (
                      <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                        {submitError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-200 hover:scale-[1.02] transition-all duration-300 text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting ? 'Sending...' : 'Submit Enquiry'}
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      By submitting, you agree to our privacy policy. We never spam.
                    </p>
                  </form>
                )}
              </div>
            </AnimatedSection>

            {/* Map + Info */}
            <AnimatedSection direction="right">
              <div className="flex flex-col gap-6 h-full">
                {/* Google Map */}
<div className="w-full h-64 rounded-2xl overflow-hidden border border-amber-100 shadow-md">
  <iframe
    title="Kavita Coaching Classes Location"
    src="https://maps.google.com/maps?q=23.8575019,78.7965521&z=17&output=embed"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    loading="lazy"
    allowFullScreen
    referrerPolicy="no-referrer-when-downgrade"
  />
</div>



                {/* Campus info cards */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '🏫', label: 'Institute', value: 'Kavita Shree Institute', color: '#f59e0b' },
                    { icon: '📍', label: 'Location', value: 'Makronia, Sagar (M.P.)', color: '#3b82f6' },
                    { icon: '📚', label: 'Classes', value: '6th to 12th', color: '#10b981' },
                    { icon: '🎓', label: 'Tagline', value: 'Give Wings To Your Dream', color: '#8b5cf6' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 hover:border-amber-200 transition-colors">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                        style={{ backgroundColor: item.color + '15' }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-xs font-semibold text-gray-900">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick enquiry */}
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-white">
                  <h4 className="font-bold mb-1 text-sm">Prefer to call directly?</h4>
                  <p className="text-white/80 text-xs mb-3">Call us for admission and class-related enquiries.</p>
                  <div className="flex items-center gap-2 text-lg font-black">
                    <Phone className="w-5 h-5" />
                    9691245740 / 8878059685
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">Common Questions</p>
            <h2 className="text-3xl font-black text-gray-900">Frequently Asked Questions</h2>
          </AnimatedSection>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
