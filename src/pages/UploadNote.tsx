import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface FormDataState {
  boardName: string;
  className: string;
}

export default function UploadNote() {
  const [form, setForm] = useState<FormDataState>({
    boardName: "",
    className: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImage(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");
      e.target.value = "";
      setImage(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10 MB");
      e.target.value = "";
      setImage(null);
      return;
    }

    setImage(file);
  };

  // Handle PDF selection
  const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPdf(null);
      return;
    }

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Please select a valid PDF file");
      e.target.value = "";
      setPdf(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("PDF size must be less than 10 MB");
      e.target.value = "";
      setPdf(null);
      return;
    }

    setPdf(file);
  };

  // Upload note
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image && !pdf) {
      alert("Please select an image or PDF");
      return;
    }

    const data = new FormData();

    data.append("boardName", form.boardName);
    data.append("className", form.className);

    // Append image only if selected
    if (image) {
      data.append("image", image);
    }

    // Append PDF only if selected
    if (pdf) {
      data.append("pdf", pdf);
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/notes",
        data
      );

      if (response.data.success) {
        alert("Note uploaded successfully!");

        setForm({
          boardName: "",
          className: "",
        });

        setImage(null);
        setPdf(null);

        // Reset file inputs
        const fileInputs = document.querySelectorAll<HTMLInputElement>(
          'input[type="file"]'
        );

        fileInputs.forEach((input) => {
          input.value = "";
        });
      } else {
        alert(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Upload failed. Please check your backend."
        );
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Upload Notes</h2>

        <form onSubmit={handleSubmit}>
          {/* Board Name */}
          <div className="form-group">
            <label>Board Name</label>

            <select
              name="boardName"
              value={form.boardName}
              onChange={handleChange}
              required
            >
              <option value="">Select Board</option>
              <option value="MP Board">MP Board</option>
              <option value="CBSE">CBSE</option>
            </select>
          </div>

          {/* Class Name */}
          <div className="form-group">
            <label>Class Name</label>

            <select
              name="className"
              value={form.className}
              onChange={handleChange}
              required
            >
              <option value="">Select Class</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Note Image (Optional)</label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
            />

            {image && (
              <div className="selected-file">
                <strong>Selected Image:</strong>
                <span>{image.name}</span>
                <small>
                  {(image.size / (1024 * 1024)).toFixed(2)} MB
                </small>
              </div>
            )}
          </div>

          {/* PDF Upload */}
          <div className="form-group">
            <label>Note PDF (Optional)</label>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handlePdfChange}
            />

            {pdf && (
              <div className="selected-file pdf-file">
                <strong>Selected PDF:</strong>
                <span>{pdf.name}</span>
                <small>
                  {(pdf.size / (1024 * 1024)).toFixed(2)} MB
                </small>
              </div>
            )}
          </div>

          <p className="help-text">
            You can upload an image, a PDF, or both. Maximum size:
            10 MB per file.
          </p>

          {/* Submit */}
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Note"}
          </button>
        </form>
      </div>

      <style>{`
        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f7fb;
          padding: 20px;
        }

        .card {
          width: 100%;
          max-width: 500px;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        h2 {
          text-align: center;
          margin-bottom: 25px;
          font-size: 25px;
          font-weight: 700;
          color: #1e293b;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #334155;
        }

        input,
        select {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-sizing: border-box;
          background: white;
        }

        input[type="file"] {
          font-size: 13px;
          cursor: pointer;
        }

        .selected-file {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-top: 10px;
          padding: 12px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          overflow-wrap: anywhere;
        }

        .selected-file strong {
          color: #1d4ed8;
          font-size: 13px;
        }

        .selected-file span {
          color: #334155;
          font-size: 13px;
        }

        .selected-file small {
          color: #64748b;
        }

        .pdf-file {
          background: #fff1f2;
          border-color: #fecdd3;
        }

        .pdf-file strong {
          color: #be123c;
        }

        .help-text {
          margin: 0 0 18px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
        }

        button {
          width: 100%;
          padding: 12px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: background 0.2s;
        }

        button:hover:not(:disabled) {
          background: #1d4ed8;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .card {
            padding: 22px;
          }
        }
      `}</style>
    </div>
  );
}