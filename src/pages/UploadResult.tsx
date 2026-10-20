import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/results";
const STUDENT_API_URL = "http://localhost:5000/api/students";

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

const currentYear = new Date().getFullYear();

// Last 5 years + next year
const YEARS = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i).reverse();

const SUBJECT_OPTIONS = [
  "Hindi",
  "English",
  "Mathematics",
  "Science",
  "Social Science",
  "Sanskrit",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Accountancy",
  "Business Studies",
  "Economics",
  "History",
  "Geography",
  "Political Science",
  "Physical Education",
  "Drawing",
  "General Knowledge",
];

const OTHER_SUBJECT = "Other";

interface Student {
  _id: string;
  studentName: string;
  board: string;
  className: string;
  rollNumber: string;
  academicSession: string;
}

interface Subject {
  subjectName: string; // dropdown value
  customSubjectName: string; // used when "Other" is selected
  obtainedMarks: string;
  totalMarks: string;
}

interface StudentForm {
  studentName: string;
  rollNumber: string;
  boardName: string;
  className: string;
  examType: string;
  examMonth: string;
  examYear: string;
}

const createSubject = (): Subject => ({
  subjectName: "",
  customSubjectName: "",
  obtainedMarks: "",
  totalMarks: "100",
});

const initialFormData: StudentForm = {
  studentName: "",
  rollNumber: "",
  boardName: "",
  className: "",
  examType: "Annual Exam",
  examMonth: MONTHS[new Date().getMonth()],
  examYear: String(currentYear),
};

// Automatically calculate grade from marks
const getGrade = (obtained: number, total: number) => {
  if (!Number.isFinite(obtained) || !Number.isFinite(total) || total <= 0) {
    return "";
  }

  const percent = (obtained / total) * 100;

  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B+";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  if (percent >= 33) return "D";

  return "F";
};

// Final subject name (dropdown value or custom text)
const getSubjectName = (subject: Subject) =>
  subject.subjectName === OTHER_SUBJECT
    ? subject.customSubjectName.trim()
    : subject.subjectName.trim();

export default function UploadResult() {
  // Student + exam details
  const [formData, setFormData] = useState<StudentForm>(initialFormData);

  // Student dropdown
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Multiple subjects
  const [subjects, setSubjects] = useState<Subject[]>([createSubject()]);

  // Remarks
  const [remarks, setRemarks] = useState("");

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingExcel, setUploadingExcel] = useState(false);

  // Fetch students for dropdown
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const res = await axios.get(STUDENT_API_URL);
        setStudents(res.data.students || []);
      } catch (error) {
        console.error("Fetch students error:", error);
        alert("Failed to load students. Please check your backend.");
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  // When a student is chosen, auto-fill the details
  const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedStudentId(id);

    const student = students.find((s) => s._id === id);

    setFormData((prev) => ({
      ...prev,
      studentName: student?.studentName || "",
      rollNumber: student?.rollNumber || "",
      boardName: student?.board || "",
      className: student?.className || "",
    }));
  };

  // Exam type / month / year change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add subject
  const addSubject = () => {
    setSubjects((prev) => [...prev, createSubject()]);
  };

  // Remove subject
  const removeSubject = (index: number) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  // Update subject
  const handleSubjectChange = (
    index: number,
    field: keyof Subject,
    value: string
  ) => {
    setSubjects((prev) =>
      prev.map((subject, i) =>
        i === index ? { ...subject, [field]: value } : subject
      )
    );
  };

  // Subjects already picked in other rows (so they can't be chosen twice)
  const isSubjectTaken = (name: string, currentIndex: number) =>
    subjects.some((s, i) => i !== currentIndex && s.subjectName === name);

  // Calculate total obtained marks
  const totalObtainedMarks = subjects.reduce(
    (sum, subject) => sum + Number(subject.obtainedMarks || 0),
    0
  );

  // Calculate maximum marks
  const totalMaximumMarks = subjects.reduce(
    (sum, subject) => sum + Number(subject.totalMarks || 0),
    0
  );

  // Calculate percentage
  const percentage =
    totalMaximumMarks > 0
      ? Number(((totalObtainedMarks / totalMaximumMarks) * 100).toFixed(2))
      : 0;

  // Validate form
  const validateForm = () => {
    if (!selectedStudentId) {
      alert("Please select a student.");
      return false;
    }

    if (!formData.examMonth || !formData.examYear) {
      alert("Please select exam month and year.");
      return false;
    }

    if (subjects.length === 0) {
      alert("Please add at least one subject.");
      return false;
    }

    const usedNames = new Set<string>();

    for (const subject of subjects) {
      const name = getSubjectName(subject);

      if (!name) {
        alert("Please select or enter all subject names.");
        return false;
      }

      const key = name.toLowerCase();

      if (usedNames.has(key)) {
        alert(`${name} is added more than once.`);
        return false;
      }

      usedNames.add(key);

      if (
        subject.obtainedMarks.trim() === "" ||
        subject.totalMarks.trim() === ""
      ) {
        alert("Please enter obtained marks and total marks.");
        return false;
      }

      const obtained = Number(subject.obtainedMarks);
      const total = Number(subject.totalMarks);

      if (
        !Number.isFinite(obtained) ||
        !Number.isFinite(total) ||
        total <= 0 ||
        obtained < 0 ||
        obtained > total
      ) {
        alert(`Please enter valid marks for ${name}.`);
        return false;
      }
    }

    return true;
  };

  // Save result
  const submitSingle = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const formattedSubjects = subjects.map((subject) => {
        const obtained = Number(subject.obtainedMarks);
        const total = Number(subject.totalMarks);

        return {
          subjectName: getSubjectName(subject),
          obtainedMarks: obtained,
          totalMarks: total,
          grade: getGrade(obtained, total), // auto grade
        };
      });

      // Passing rule: minimum 33% in every subject.
      // Change this rule according to your school policy.
      const hasFailedSubject = formattedSubjects.some(
        (subject) => (subject.obtainedMarks / subject.totalMarks) * 100 < 33
      );

      const calculatedResult = hasFailedSubject ? "Fail" : "Pass";

      const payload = {
        ...formData,
        examYear: Number(formData.examYear),
        studentId: selectedStudentId, // link the result to the student
        subjects: formattedSubjects,
        totalObtainedMarks,
        totalMaximumMarks,
        percentage,
        result: calculatedResult,
        remarks: remarks.trim(),
      };

      const response = await axios.post(API_URL, payload);

      if (response.data.success === false) {
        throw new Error(response.data.message || "Failed to save result");
      }

      alert("Result Added Successfully!");

      // Reset student, subjects and remarks.
      // Exam type, month and year are kept so you can add the next student quickly.
      setSelectedStudentId("");
      setFormData((prev) => ({
        ...initialFormData,
        examType: prev.examType,
        examMonth: prev.examMonth,
        examYear: prev.examYear,
      }));
      setSubjects([createSubject()]);
      setRemarks("");
    } catch (error) {
      console.error("Save result error:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            "Failed to save result. Please check your backend."
        );
      } else {
        alert(error instanceof Error ? error.message : "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Excel upload
  const uploadExcel = async () => {
    if (!excelFile) {
      alert("Please select an Excel file.");
      return;
    }

    try {
      setUploadingExcel(true);

      const fd = new FormData();
      fd.append("file", excelFile);

      const response = await axios.post(`${API_URL}/excel`, fd);

      if (response.data.success === false) {
        throw new Error(response.data.message || "Excel upload failed");
      }

      alert(`Excel Uploaded Successfully! Records: ${response.data.count ?? 0}`);

      setExcelFile(null);

      const fileInput = document.getElementById(
        "excelFile"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Excel upload error:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            "Excel upload failed. Please check the backend."
        );
      } else {
        alert(error instanceof Error ? error.message : "Excel upload failed.");
      }
    } finally {
      setUploadingExcel(false);
    }
  };

  return (
    <div className="result-container">
      <h1 className="page-title">Upload Results</h1>

      {/* Student Details */}
      <div className="card">
        <h2>Student Details</h2>

        <div className="form-group">
          <label>Select Student</label>

          <select
            value={selectedStudentId}
            onChange={handleStudentSelect}
            disabled={loadingStudents}
          >
            <option value="">
              {loadingStudents ? "Loading students..." : "-- Select Student --"}
            </option>

            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.studentName} | Roll {student.rollNumber} |{" "}
                {student.className} | {student.board} |{" "}
                {student.academicSession}
              </option>
            ))}
          </select>
        </div>

        {selectedStudentId && (
          <div className="student-info">
            <div>
              <span>Name</span>
              <strong>{formData.studentName}</strong>
            </div>
            <div>
              <span>Roll No.</span>
              <strong>{formData.rollNumber}</strong>
            </div>
            <div>
              <span>Board</span>
              <strong>{formData.boardName}</strong>
            </div>
            <div>
              <span>Class</span>
              <strong>{formData.className}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Exam Details */}
      <div className="card">
        <h2>Exam Details</h2>

        <div className="form-grid form-grid-3">
          <div className="form-group">
            <label>Exam Type</label>

            <select
              name="examType"
              value={formData.examType}
              onChange={handleChange}
            >
              <option value="Annual Exam">Annual Exam</option>
              <option value="Half Yearly">Half Yearly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Unit Test">Unit Test</option>
              <option value="Monthly Test">Monthly Test</option>
              <option value="Pre Board">Pre Board</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Month</label>

            <select
              name="examMonth"
              value={formData.examMonth}
              onChange={handleChange}
            >
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Year</label>

            <select
              name="examYear"
              value={formData.examYear}
              onChange={handleChange}
            >
              {YEARS.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="session-preview">
          Result session:{" "}
          <strong>
            {formData.examMonth} {formData.examYear}
          </strong>
        </p>
      </div>

      {/* Multiple Subjects */}
      <div className="card">
        <div className="section-header">
          <div>
            <h2>Subject Details</h2>

            <p className="subtitle">
              Choose subjects and enter marks. Grades are calculated
              automatically.
            </p>
          </div>

          <button type="button" className="add-button" onClick={addSubject}>
            + Add Subject
          </button>
        </div>

        {subjects.map((subject, index) => {
          const grade = getGrade(
            Number(subject.obtainedMarks),
            Number(subject.totalMarks)
          );

          const showGrade =
            subject.obtainedMarks !== "" && subject.totalMarks !== "";

          return (
            <div className="subject-card" key={index}>
              <div className="subject-header">
                <h3>Subject {index + 1}</h3>

                {subjects.length > 1 && (
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeSubject(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Subject Name</label>

                  <select
                    value={subject.subjectName}
                    onChange={(e) =>
                      handleSubjectChange(index, "subjectName", e.target.value)
                    }
                  >
                    <option value="">-- Select Subject --</option>

                    {SUBJECT_OPTIONS.map((name) => (
                      <option
                        key={name}
                        value={name}
                        disabled={isSubjectTaken(name, index)}
                      >
                        {name}
                      </option>
                    ))}

                    <option value={OTHER_SUBJECT}>Other (type manually)</option>
                  </select>
                </div>

                {subject.subjectName === OTHER_SUBJECT && (
                  <div className="form-group">
                    <label>Custom Subject Name</label>

                    <input
                      placeholder="Enter subject name"
                      value={subject.customSubjectName}
                      onChange={(e) =>
                        handleSubjectChange(
                          index,
                          "customSubjectName",
                          e.target.value
                        )
                      }
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Obtained Marks</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 85"
                    value={subject.obtainedMarks}
                    onChange={(e) =>
                      handleSubjectChange(index, "obtainedMarks", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Total Marks</label>

                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 100"
                    value={subject.totalMarks}
                    onChange={(e) =>
                      handleSubjectChange(index, "totalMarks", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Grade (auto)</label>

                  <div
                    className={`grade-box ${
                      showGrade && grade === "F" ? "grade-fail" : ""
                    }`}
                  >
                    {showGrade && grade ? grade : "—"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          className="add-button full-width"
          onClick={addSubject}
        >
          + Add Another Subject
        </button>
      </div>

      {/* Result Summary */}
      <div className="card">
        <h2>Result Summary</h2>

        <div className="summary-grid">
          <div className="summary-item">
            <span>Total Obtained Marks</span>
            <strong>{totalObtainedMarks}</strong>
          </div>

          <div className="summary-item">
            <span>Total Maximum Marks</span>
            <strong>{totalMaximumMarks}</strong>
          </div>

          <div className="summary-item percentage-item">
            <span>Percentage</span>
            <strong>{percentage.toFixed(2)}%</strong>
          </div>
        </div>

        <div className="form-group">
          <label>Remarks (optional)</label>

          <textarea
            className="remarks-input"
            rows={3}
            maxLength={300}
            placeholder="e.g. Excellent performance. Keep it up!"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <span className="char-count">{remarks.length}/300</span>
        </div>

        <button
          type="button"
          className="save-button"
          onClick={submitSingle}
          disabled={loading}
        >
          {loading ? "Saving Result..." : "Save Result"}
        </button>
      </div>

      {/* Excel Upload */}
      <div className="card">
        <h2>Excel Upload</h2>

        <p className="subtitle">
          Upload an Excel file containing student results.
        </p>

        <input
          id="excelFile"
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
        />

        {excelFile && <p className="selected-file">Selected: {excelFile.name}</p>}

        <button
          type="button"
          className="save-button"
          onClick={uploadExcel}
          disabled={uploadingExcel}
        >
          {uploadingExcel ? "Uploading..." : "Upload Excel"}
        </button>
      </div>

      {/* Styling */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        .result-container {
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
          padding: 30px 20px;
          color: #172033;
        }

        .page-title {
          font-size: 30px;
          font-weight: 700;
          margin: 0 0 25px;
        }

        .card {
          background: #ffffff;
          padding: 28px;
          border-radius: 16px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.07);
          margin-bottom: 25px;
          border: 1px solid #eeeeee;
        }

        .card h2 {
          margin: 0 0 20px;
          font-size: 21px;
          font-weight: 600;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .form-grid-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
          min-width: 0;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .form-group input,
        .form-group select,
        .form-group textarea,
        #excelFile {
          width: 100%;
          min-width: 0;
          padding: 12px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          background: #ffffff;
          color: #172033;
          outline: none;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .remarks-input {
          resize: vertical;
          min-height: 80px;
          line-height: 1.5;
        }

        .char-count {
          align-self: flex-end;
          font-size: 12px;
          color: #6b7280;
        }

        .session-preview {
          margin: 4px 0 0;
          font-size: 14px;
          color: #5b6475;
        }

        .session-preview strong {
          color: #172033;
        }

        .grade-box {
          display: flex;
          align-items: center;
          min-height: 44px;
          padding: 12px 14px;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          background: #ecfdf3;
          color: #15803d;
          font-size: 16px;
          font-weight: 700;
        }

        .grade-box.grade-fail {
          border-color: #fecaca;
          background: #fee2e2;
          color: #dc2626;
        }

        .student-info {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          padding: 16px;
          margin-bottom: 16px;
          background: #f3f6ff;
          border-radius: 12px;
        }

        .student-info div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .student-info span {
          font-size: 13px;
          color: #5b6475;
        }

        .student-info strong {
          color: #172033;
          overflow-wrap: anywhere;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 22px;
        }

        .section-header h2 {
          margin-bottom: 7px;
        }

        .subtitle {
          color: #6b7280;
          font-size: 14px;
          margin: 0 0 18px;
          line-height: 1.5;
        }

        .subject-card {
          padding: 22px;
          margin-bottom: 18px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #f9fafb;
        }

        .subject-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .subject-header h3 {
          margin: 0;
          font-size: 17px;
        }

        .add-button,
        .remove-button,
        .save-button {
          border: none;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .add-button {
          background: #e8efff;
          color: #2458d3;
          white-space: nowrap;
        }

        .add-button:hover {
          background: #d9e5ff;
        }

        .remove-button {
          background: #fee2e2;
          color: #dc2626;
        }

        .remove-button:hover {
          background: #fecaca;
        }

        .full-width {
          width: 100%;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 20px;
        }

        .summary-item {
          padding: 20px 14px;
          border-radius: 12px;
          background: #f3f6ff;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .summary-item span {
          color: #5b6475;
          font-size: 13px;
        }

        .summary-item strong {
          color: #1d4ed8;
          font-size: 24px;
          overflow-wrap: anywhere;
        }

        .percentage-item {
          background: #ecfdf3;
        }

        .percentage-item strong {
          color: #15803d;
        }

        .save-button {
          display: block;
          width: 100%;
          padding: 14px;
          margin-top: 15px;
          background: #2563eb;
          color: #ffffff;
        }

        .save-button:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .selected-file {
          color: #374151;
          font-size: 14px;
          margin-top: 12px;
          overflow-wrap: anywhere;
        }

        @media (max-width: 600px) {
          .result-container {
            padding: 20px 12px;
          }

          .card {
            padding: 20px 15px;
          }

          .form-grid,
          .form-grid-3 {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .student-info {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .subject-card {
            padding: 15px;
          }

          .page-title {
            font-size: 25px;
          }
        }
      `}</style>
    </div>
  );
}