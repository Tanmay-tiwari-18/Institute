import { useEffect, useState } from "react";
import axios from "axios";

interface Note {
  _id: string;
  boardName: string;
  className: string;
  image: string;
  pdf: string;
  createdAt?: string;
}

const API_URL = "http://localhost:5000";

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [boards, setBoards] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [boardFilter, setBoardFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Load notes from backend
  useEffect(() => {
    loadNotes();
  }, []);

  // Filter notes by board and class
  useEffect(() => {
    let filtered = [...notes];

    if (boardFilter) {
      filtered = filtered.filter(
        (note) => note.boardName === boardFilter
      );
    }

    if (classFilter) {
      filtered = filtered.filter(
        (note) => note.className === classFilter
      );
    }

    setFilteredNotes(filtered);
  }, [boardFilter, classFilter, notes]);

  // Fetch notes
  const loadNotes = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/api/notes`);

      const notesData: Note[] = res.data.notes || [];

      setNotes(notesData);
      setFilteredNotes(notesData);

      const uniqueBoards = [
        ...new Set(notesData.map((note) => note.boardName)),
      ];

      const uniqueClasses = [
        ...new Set(notesData.map((note) => note.className)),
      ].sort((a, b) => Number(a) - Number(b));

      setBoards(uniqueBoards);
      setClasses(uniqueClasses);
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate file URL
  const getFileUrl = (filename: string) => {
    if (!filename) return "";

    if (
      filename.startsWith("http://") ||
      filename.startsWith("https://")
    ) {
      return filename;
    }

    return `${API_URL}/uploads/${encodeURIComponent(filename)}`;
  };

  // Direct download for image and PDF
  const handleDownload = async (
    fileUrl: string,
    fileName: string
  ) => {
    try {
      if (!fileUrl) {
        alert("File not found");
        return;
      }

      const response = await axios.get(fileUrl, {
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  return (
    <div className="notes-page">
      <div className="container">
        <h1>Study Notes</h1>

        {/* Board and Class Filters */}
        <div className="filters">
          <select
            value={boardFilter}
            onChange={(e) => setBoardFilter(e.target.value)}
          >
            <option value="">All Boards</option>

            {boards.map((board) => (
              <option key={board} value={board}>
                {board}
              </option>
            ))}
          </select>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="">All Classes</option>

            {classes.map((cls) => (
              <option key={cls} value={cls}>
                Class {cls}
              </option>
            ))}
          </select>
        </div>

        {/* Loading and Empty States */}
        {loading ? (
          <div className="empty-state">Loading Notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">No Notes Found</div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => {
              const imageUrl = getFileUrl(note.image);
              const pdfUrl = getFileUrl(note.pdf);

              return (
                <div className="card" key={note._id}>
                  {/* Image Preview or PDF Placeholder */}
                  <div className="image-wrapper">
                    {note.image ? (
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="image-link"
                      >
                        <img
                          src={imageUrl}
                          alt={`${note.boardName} Class ${note.className}`}
                          loading="lazy"
                        />
                      </a>
                    ) : (
                      <div className="pdf-placeholder">
                        <span className="pdf-icon">PDF</span>
                        <p>PDF Document</p>
                      </div>
                    )}
                  </div>

                  {/* Note Details */}
                  <div className="content">
                    <span className="board">
                      {note.boardName}
                    </span>

                    <h3>Class {note.className}</h3>

                    {/* File Availability */}
                    <div className="file-info">
                      {note.image && (
                        <span className="file-badge image-badge">
                          Image Available
                        </span>
                      )}

                      {note.pdf && (
                        <span className="file-badge pdf-badge">
                          PDF Available
                        </span>
                      )}
                    </div>

                    {/* Image Section */}
                    {note.image && (
                      <div className="file-section">
                        <p className="file-title">Note Image</p>

                        <div className="buttons">
                          <a
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-view"
                          >
                            Open Image
                          </a>

                          <button
                            type="button"
                            className="btn btn-download"
                            onClick={() =>
                              handleDownload(
                                imageUrl,
                                note.image || "notes-image.jpg"
                              )
                            }
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    )}

                    {/* PDF Section */}
                    {note.pdf && (
                      <div className="file-section">
                        <p className="file-title">Note PDF</p>

                        <div className="buttons">
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-pdf"
                          >
                            Open PDF
                          </a>

                          <button
                            type="button"
                            className="btn btn-download"
                            onClick={() =>
                              handleDownload(
                                pdfUrl,
                                note.pdf || "notes.pdf"
                              )
                            }
                          >
                            Download PDF
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .notes-page {
          min-height: 100vh;
          padding: 40px 20px;
          background: #f5f7fb;
        }

        .container {
          max-width: 1200px;
          margin: auto;
        }

        .notes-page h1 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
        }

        .filters {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .filters select {
          padding: 12px 15px;
          border-radius: 10px;
          border: 1px solid #ddd;
          min-width: 180px;
          background: white;
          outline: none;
        }

        .notes-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(280px, 1fr)
          );
          gap: 25px;
        }

        .card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          min-width: 0;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
        }

        .image-wrapper {
          height: 260px;
          background: #f1f5f9;
          overflow: hidden;
        }

        .image-link {
          display: flex;
          height: 100%;
          width: 100%;
          align-items: center;
          justify-content: center;
        }

        .image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .pdf-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .pdf-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 75px;
          height: 90px;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 10px;
          font-size: 22px;
          font-weight: 800;
          border: 1px solid #fecaca;
        }

        .pdf-placeholder p {
          margin-top: 12px;
          font-weight: 600;
        }

        .content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .board {
          background: #eef2ff;
          color: #4338ca;
          padding: 6px 12px;
          border-radius: 20px;
          width: fit-content;
          font-size: 13px;
          font-weight: 600;
        }

        .content h3 {
          margin: 15px 0;
          color: #1e293b;
          font-size: 19px;
        }

        .file-info {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
        }

        .file-badge {
          padding: 5px 9px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
        }

        .image-badge {
          color: #1d4ed8;
          background: #dbeafe;
        }

        .pdf-badge {
          color: #b91c1c;
          background: #fee2e2;
        }

        .file-section {
          margin-top: 12px;
        }

        .file-title {
          margin: 0 0 10px;
          font-size: 14px;
          font-weight: 700;
          color: #475569;
        }

        .buttons {
          display: flex;
          gap: 10px;
        }

        .btn {
          flex: 1;
          min-width: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          text-decoration: none;
          padding: 10px 8px;
          color: white;
          border: none;
          border-radius: 8px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn:hover {
          opacity: 0.85;
        }

        .btn-view {
          background: #2563eb;
        }

        .btn-pdf {
          background: #dc2626;
        }

        .btn-download {
          background: #16a34a;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #666;
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .notes-page {
            padding: 25px 15px;
          }

          .notes-page h1 {
            font-size: 26px;
          }

          .buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Notes;