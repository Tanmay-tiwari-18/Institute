import { useEffect, useRef, useState, type FormEvent } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const boards = ["MP Board", "CBSE", "ICSE", "Other"];

const classes = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface Student {
  _id: string;
  studentName: string;
  board: string;
  className: string;
  rollNumber: string;
  academicSession: string;
}

interface StudentForm {
  studentName: string;
  board: string;
  className: string;
  rollNumber: string;
  academicSession: string;
}

interface ResultSubject {
  subjectName: string;
  obtainedMarks: number;
  totalMarks: number;
  grade: string;
}

interface StudentResult {
  _id: string;
  examType: string;
  examMonth?: string;
  examYear?: number;
  subjects: ResultSubject[];
  totalObtainedMarks: number;
  totalMaximumMarks: number;
  percentage: number;
  result: "Pass" | "Fail";
  remarks?: string;
  createdAt: string;
}

const initialForm: StudentForm = {
  studentName: "",
  board: "",
  className: "",
  rollNumber: "",
  academicSession: "2026-27",
};

// Newest exam session first, then newest upload first
const sortResults = (list: StudentResult[]) =>
  [...list].sort((a, b) => {
    const yearDiff = (b.examYear || 0) - (a.examYear || 0);
    if (yearDiff !== 0) return yearDiff;

    const monthDiff =
      MONTHS.indexOf(b.examMonth || "") - MONTHS.indexOf(a.examMonth || "");
    if (monthDiff !== 0) return monthDiff;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function AddStudent() {
  const [form, setForm] = useState<StudentForm>(initialForm);
  const [students, setStudents] = useState<Student[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Student results viewer
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState("");
  const latestRequest = useRef(0);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/students`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch students.");
      }

      setStudents(data.students || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to backend."
      );
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Open the results viewer for a student
  const handleViewResults = async (student: Student) => {
    const requestId = ++latestRequest.current;

    setViewingStudent(student);
    setStudentResults([]);
    setResultsError("");
    setResultsLoading(true);

    try {
      const params = new URLSearchParams({
        studentId: student._id,
        rollNumber: student.rollNumber,
        boardName: student.board,
        className: student.className,
      });

      const response = await fetch(`${API_URL}/api/results?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch results.");
      }

      // Ignore this response if another student was opened meanwhile
      if (requestId !== latestRequest.current) return;

      setStudentResults(sortResults(data.results || []));
    } catch (err) {
      if (requestId !== latestRequest.current) return;

      setResultsError(
        err instanceof Error ? err.message : "Unable to fetch results."
      );
    } finally {
      if (requestId === latestRequest.current) {
        setResultsLoading(false);
      }
    }
  };

  const closeResults = () => {
    latestRequest.current++;
    setViewingStudent(null);
    setStudentResults([]);
    setResultsError("");
    setResultsLoading(false);
  };

  // Close the viewer with the Escape key
  useEffect(() => {
    if (!viewingStudent) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeResults();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewingStudent]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save or update student
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const url = editingId
        ? `${API_URL}/api/students/${editingId}`
        : `${API_URL}/api/students`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save student.");
      }

      setMessage(
        editingId
          ? "Student updated successfully!"
          : "Student saved successfully!"
      );

      setForm(initialForm);
      setEditingId(null);

      await fetchStudents();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit student
  const handleEdit = (student: Student) => {
    setForm({
      studentName: student.studentName,
      board: student.board,
      className: student.className,
      rollNumber: student.rollNumber,
      academicSession: student.academicSession,
    });

    setEditingId(student._id);
    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete student
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/students/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete student.");
      }

      setMessage("Student deleted successfully!");

      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
      }

      if (viewingStudent?._id === id) {
        closeResults();
      }

      await fetchStudents();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete student."
      );
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Student Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-800">
            {editingId ? "Edit Student" : "Add New Student"}
          </h1>

          <p className="mt-2 text-slate-500">
            Enter student details and save them to the database.
          </p>
        </div>

        {/* Student form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-semibold text-slate-800">
            Student Information
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Student Name */}
              <div>
                <label
                  htmlFor="studentName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Student Name *
                </label>

                <input
                  id="studentName"
                  name="studentName"
                  type="text"
                  value={form.studentName}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  required
                  maxLength={100}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Board */}
              <div>
                <label
                  htmlFor="board"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Board *
                </label>

                <select
                  id="board"
                  name="board"
                  value={form.board}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Board</option>

                  {boards.map((board) => (
                    <option key={board} value={board}>
                      {board}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class */}
              <div>
                <label
                  htmlFor="className"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Class *
                </label>

                <select
                  id="className"
                  name="className"
                  value={form.className}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Class</option>

                  {classes.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>

              {/* Roll Number */}
              <div>
                <label
                  htmlFor="rollNumber"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Roll Number *
                </label>

                <input
                  id="rollNumber"
                  name="rollNumber"
                  type="text"
                  value={form.rollNumber}
                  onChange={handleChange}
                  placeholder="Enter roll number"
                  required
                  maxLength={30}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Academic Session */}
              <div>
                <label
                  htmlFor="academicSession"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Academic Session *
                </label>

                <select
                  id="academicSession"
                  name="academicSession"
                  value={form.academicSession}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="2025-26">2025-26</option>
                  <option value="2026-27">2026-27</option>
                  <option value="2027-28">2027-28</option>
                  <option value="2028-29">2028-29</option>
                </select>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div
                role="alert"
                className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {message && (
              <div
                role="status"
                className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700"
              >
                {message}
              </div>
            )}

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : editingId
                    ? "Update Student"
                    : "Save Student"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Saved students */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Saved Students
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Total students: {students.length}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchStudents}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-4">S.No.</th>
                  <th className="px-5 py-4">Student Name</th>
                  <th className="px-5 py-4">Board</th>
                  <th className="px-5 py-4">Class</th>
                  <th className="px-5 py-4">Roll Number</th>
                  <th className="px-5 py-4">Session</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {students.map((student, index) => (
                  <tr key={student._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">{index + 1}</td>

                    <td className="px-5 py-4 font-medium text-slate-800">
                      {student.studentName}
                    </td>

                    <td className="px-5 py-4">{student.board}</td>

                    <td className="px-5 py-4">{student.className}</td>

                    <td className="px-5 py-4">{student.rollNumber}</td>

                    <td className="px-5 py-4">
                      {student.academicSession}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleViewResults(student)}
                          className="font-medium text-emerald-600 hover:underline"
                        >
                          View Results
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEdit(student)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(student._id)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {students.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-slate-500"
                    >
                      No students found. Add your first student above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Student results viewer */}
      {viewingStudent && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:p-8"
          onClick={closeResults}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="results-title"
            className="w-full max-w-3xl rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
              <div className="min-w-0">
                <h2
                  id="results-title"
                  className="text-xl font-bold text-slate-800"
                >
                  {viewingStudent.studentName}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Roll {viewingStudent.rollNumber} · Class{" "}
                  {viewingStudent.className} · {viewingStudent.board} ·{" "}
                  {viewingStudent.academicSession}
                </p>
              </div>

              <button
                type="button"
                onClick={closeResults}
                aria-label="Close results"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            {/* Body */}
            <div className="space-y-5 p-6">
              {resultsLoading && (
                <p className="py-8 text-center text-slate-500">
                  Loading results...
                </p>
              )}

              {resultsError && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {resultsError}
                </div>
              )}

              {!resultsLoading &&
                !resultsError &&
                studentResults.length === 0 && (
                  <p className="py-8 text-center text-slate-500">
                    No results uploaded for this student yet.
                  </p>
                )}

              {!resultsLoading && studentResults.length > 0 && (
                <p className="text-sm text-slate-500">
                  Total results: {studentResults.length}
                </p>
              )}

              {studentResults.map((item) => (
                <div
                  key={item._id}
                  className="overflow-hidden rounded-xl border border-slate-200"
                >
                  {/* Result header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 px-5 py-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {item.examType}
                        {item.examMonth && item.examYear
                          ? ` — ${item.examMonth} ${item.examYear}`
                          : ""}
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Uploaded on {formatDate(item.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.result === "Pass"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.result}
                    </span>
                  </div>

                  {/* Totals */}
                  <div className="grid grid-cols-2 gap-3 px-5 pt-4">
                    <div className="rounded-lg bg-blue-50 p-3">
                      <p className="text-xs text-slate-500">Total marks</p>
                      <p className="mt-1 text-lg font-bold text-blue-700">
                        {item.totalObtainedMarks} / {item.totalMaximumMarks}
                      </p>
                    </div>

                    <div className="rounded-lg bg-green-50 p-3">
                      <p className="text-xs text-slate-500">Percentage</p>
                      <p className="mt-1 text-lg font-bold text-green-700">
                        {Number(item.percentage).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="overflow-x-auto px-5 py-4">
                    <table className="w-full min-w-[420px] text-left text-sm">
                      <thead className="text-slate-500">
                        <tr className="border-b border-slate-200">
                          <th className="py-2 pr-3 font-medium">Subject</th>
                          <th className="py-2 pr-3 font-medium">Obtained</th>
                          <th className="py-2 pr-3 font-medium">Total</th>
                          <th className="py-2 font-medium">Grade</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {item.subjects.map((subject, i) => (
                          <tr key={`${item._id}-${i}`}>
                            <td className="py-2 pr-3 font-medium text-slate-800">
                              {subject.subjectName}
                            </td>
                            <td className="py-2 pr-3">
                              {subject.obtainedMarks}
                            </td>
                            <td className="py-2 pr-3">{subject.totalMarks}</td>
                            <td
                              className={`py-2 font-semibold ${
                                subject.grade === "F"
                                  ? "text-red-600"
                                  : "text-green-700"
                              }`}
                            >
                              {subject.grade || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Remarks */}
                  {item.remarks && (
                    <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-600">
                      <span className="font-medium text-slate-700">
                        Remarks:{" "}
                      </span>
                      {item.remarks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}