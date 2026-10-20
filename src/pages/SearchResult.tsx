import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, XCircle, Printer, AlertCircle, Loader2 } from 'lucide-react';

interface Subject {
  name: string;
  maxMarks: number;
  obtainedMarks: number;
  grade?: string;
}

interface ResultRecord {
  _id: string;
  examType: string;
  totalObtainedMarks: number;
  totalMaximumMarks: number;
  remarks: string;
  studentName: string;
  rollNumber: string;
  boardName: string;
  className: string;
  percentage: number;
  result: string;
  subjects: Subject[];
  createdAt: string;
}

const API_URL = 'http://localhost:5000/api/results';

export default function SearchResult() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [record, setRecord] = useState<ResultRecord | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setRecord(null);
    setSearched(true);

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();

      const all: ResultRecord[] = data?.results ?? [];
      const match = all.find(
        (r) =>
          r.rollNumber.toLowerCase() === query.trim().toLowerCase() ||
          r.studentName.toLowerCase() === query.trim().toLowerCase()
      );

      if (match) {
        setRecord(match);
      } else {
        setError('No result found for that roll number or name. Please check and try again.');
      }
    } catch {
      setError('Could not reach the results server. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  }

  const isPass = record?.result?.toLowerCase() === 'pass';

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-amber-100 text-amber-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6 border border-amber-200"
          >
            Result Portal
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-black text-gray-900 mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Check Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Result</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-sm mb-8"
          >
            Enter your roll number or full name to view your marksheet.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Roll number or full name"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl text-sm hover:scale-105 transition-all shadow-lg disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? 'Searching' : 'Search'}
            </button>
          </motion.form>
        </div>
      </section>

      {/* Result area */}
      <section className="px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 rounded-xl px-5 py-4 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}

            {record && !error && (
              <motion.div
                key="marksheet"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              >
                {/* Marksheet header band */}
                <div
                  className={`px-6 py-5 flex items-center justify-between ${
                    isPass ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-gradient-to-r from-rose-500 to-red-600'
                  } text-white`}
                >
                  <div className="flex items-center gap-2">
                    {isPass ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    <span className="font-black text-lg uppercase tracking-wide">{record.result}</span>
                  </div>
                  <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                    {record.examType}
                  </span>
                </div>

                {/* Student info */}
                <div className="px-6 pt-6 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Student Name</p>
                    <p className="font-bold text-gray-900 text-sm">{record.studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Roll Number</p>
                    <p className="font-bold text-gray-900 text-sm">{record.rollNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Board</p>
                    <p className="font-bold text-gray-900 text-sm">{record.boardName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Class</p>
                    <p className="font-bold text-gray-900 text-sm">{record.className}</p>
                  </div>
                </div>

                {/* Subjects table */}
                <div className="px-6 py-5">
                  {record.subjects && record.subjects.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                          <th className="pb-2 font-semibold">Subject</th>
                          <th className="pb-2 font-semibold text-right">Obtained</th>
                          <th className="pb-2 font-semibold text-right">Maximum</th>
                        </tr>
                      </thead>
                    <tbody>
  {record.subjects.map((s, i) => (
  <tr key={i} className="border-b border-gray-50">
    <td className="py-2 text-gray-700">
      {s.subjectName}
    </td>

    <td className="py-2 text-right font-semibold text-gray-900">
      {s.obtainedMarks}
    </td>

    <td className="py-2 text-right text-gray-500">
      {s.totalMarks}
    </td>
  </tr>
))}
</tbody>
                    </table>
                  ) : (
                    <p className="text-sm text-gray-400 italic text-center py-2">
                      Subject-wise breakdown is not available for this result.
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div className="px-6 py-5 bg-gray-50 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Obtained</p>
                    <p className="text-xl font-black text-gray-900">{record.totalObtainedMarks || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Maximum</p>
                    <p className="text-xl font-black text-gray-900">{record.totalMaximumMarks || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Percentage</p>
                    <p className="text-xl font-black text-amber-600">{record.percentage}%</p>
                  </div>
                </div>

                {record.remarks && (
                  <div className="px-6 py-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">Remarks</p>
                    <p className="text-sm text-gray-700">{record.remarks}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="px-6 py-5 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    Print Marksheet
                  </button>
                </div>
              </motion.div>
            )}

            {!record && !error && searched === false && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400 text-sm py-10"
              >
                Your marksheet will appear here once you search.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}