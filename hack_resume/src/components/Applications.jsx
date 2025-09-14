// src/components/Applications.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Container, Row, Col, Card, Form, Button, Stack,
  Modal, FloatingLabel, Badge, Alert
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { api } from "../api";                 // axios instance with baseURL=/api
import StatusBadge from "./StatusBadge";
import FollowUpTag from "./FollowUpTag";

const LABELS = {
  applied: "Applied", oa: "OA",
  interview: "Interview", offer: "Offer",
  rejected: "Rejected", ghosted: "No Response",
};
const STATUS_ORDER = ["applied","interview","offer","rejected","oa","ghosted"];

function ApplicationCard({ a, onChangeStatus, onViewDetails }) {
  return (
    <Card className="card-lift bg-light text-dark" style={{ cursor: 'pointer' }}>
      <Card.Body onClick={() => onViewDetails(a)}>
        <Stack direction="horizontal" gap={2} className="justify-content-between mb-1">
          <strong className="fs-6">{a.company}</strong>
          <StatusBadge value={a.status} />
        </Stack>

        <div className="text-secondary">{a.role}</div>

        <div className="mt-1 meta-row">
          <span className="meta-label">Applied:</span>{" "}
          <span className="meta-value">{a.date_applied}</span>
        </div>

        {a.notes && a.notes.length > 0 && (
          <div className="mt-1">
            <Badge bg="primary">
              {a.notes.length} note{a.notes.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        )}

        <div className="mt-2">
          <FollowUpTag dateStr={a.next_followup_on} />
        </div>

        <Form className="mt-3" onClick={(e) => e.stopPropagation()}>
          <Form.Select
            value={a.status}
            onChange={(e) => onChangeStatus(a.id, e.target.value)}
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>{LABELS[s]}</option>
            ))}
          </Form.Select>
        </Form>
      </Card.Body>
    </Card>
  );
}

function ApplicationDetailsModal({ application, show, onHide, onUpdate }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [editNoteText, setEditNoteText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [followup, setFollowup] = useState("");
  useEffect(() => {
    if (application) setFollowup(application.next_followup_on || "");
  }, [application]);
  
  async function saveFollowup() {
    if (!application) return;
    setError("");
    try {
      await api.put(`/applications/${application.id}/`, {
        ...application,
        next_followup_on: followup || null,
      });
      if (onUpdate) onUpdate();
    } catch {
      setError("Failed to update follow-up date");
    }
  }
  
  function clearFollowup() {
    setFollowup("");
  }

  useEffect(() => {
    if (show && application) loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, application]);

  async function loadNotes() {
    if (!application) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/applications/${application.id}/notes/`);
      setNotes(response.data || []);
    } catch {
      setError("Failed to load notes");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }

  async function addNote() {
    if (!newNote.trim() || !application) return;
    setError("");
    try {
      const response = await api.post(`/applications/${application.id}/notes/`, {
        content: newNote.trim(),
      });
      setNotes((prev) => [response.data, ...prev]);
      setNewNote("");
      if (onUpdate) onUpdate();
    } catch {
      setError("Failed to add note");
    }
  }

  async function updateNote(noteId) {
    if (!editNoteText.trim()) return;
    setError("");
    try {
      const response = await api.put(`/applications/${application.id}/notes/${noteId}/`, {
        content: editNoteText.trim(),
      });
      setNotes((prev) => prev.map((note) => (note.id === noteId ? response.data : note)));
      setEditingNote(null);
      setEditNoteText("");
    } catch {
      setError("Failed to update note");
    }
  }

  async function confirmDeleteNote() {
    if (!deleteConfirm) return;
    setError("");
    try {
      await api.delete(`/applications/${application.id}/notes/${deleteConfirm}/`);
      setNotes((prev) => prev.filter((note) => note.id !== deleteConfirm));
      setDeleteConfirm(null);
      if (onUpdate) onUpdate();
    } catch {
      setError("Failed to delete note");
    }
  }

  function startEdit(note) {
    setEditingNote(note.id);
    setEditNoteText(note.content);
  }

  function cancelEdit() {
    setEditingNote(null);
    setEditNoteText("");
  }

  function formatDate(dateStr) {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  if (!application) return null;

  const statusBg =
    application.status === "applied" ? "primary" :
    application.status === "interview" ? "warning" :
    application.status === "offer" ? "success" :
    application.status === "rejected" ? "danger" :
    application.status === "oa" ? "info" :
    "secondary";

  const statusTextClass = application.status === "interview" ? "text-dark" : "text-white";

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span>{application.company}</span>
                <Badge bg={statusBg} className={statusTextClass}>
                  {LABELS[application.status] || application.status}
                </Badge>
              </div>
              <div className="fs-6 fw-normal text-dark">{application.role}</div>
            </div>
          </Modal.Title>
        </Modal.Header>
          {/* Application Details */}
          <Modal.Body className="on-dark">
          <div className="mb-4">
            <h6 className="text-light fw-semibold">Application Details</h6>
            <Row>
              <Col md={6}>
                <div className="mb-1 fw-semibold cream-label">Date Applied</div>
                <div className="meta-value">{application.date_applied}</div>
              </Col>

              <Col md={6}>
                <div className="mb-1 fw-semibold cream-label">Next Follow-up</div>
                <div className="d-flex gap-2 align-items-center">
                  <Form.Control
                    type="date"
                    value={followup}
                    onChange={(e) => setFollowup(e.target.value)}
                    className="on-dark-input"
                    style={{ maxWidth: 200 }}
                  />
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={saveFollowup}
                    disabled={followup === (application.next_followup_on || "")}
                  >
                    Save
                  </Button>
                  {followup && (
                    <Button variant="outline-danger" size="sm" onClick={clearFollowup}>
                      Clear
                    </Button>
                  )}
                </div>
              </Col>
            </Row>

          </div>

          {/* Error Alert */}
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

          {/* Add New Note */}
          <div className="mb-4">
            <h6 className="text-secondary fw-semibold">Add Note</h6>
            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Add a note about this application..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              size="sm"
              onClick={addNote}
              disabled={!newNote.trim()}
            >
              Add Note
            </Button>
          </div>

          {/* Notes List */}
          <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-secondary fw-semibold m-0">
                Notes {notes.length > 0 && `(${notes.length})`}
              </h6>
            </div>

            {loading ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-muted text-center py-3">
                No notes yet. Add your first note above!
              </div>
            ) : (
              <div className="notes-list" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {notes.map((note) => (
                  <Card key={note.id} className="mb-2">
                    <Card.Body className="py-2">
                      {editingNote === note.id ? (
                        <div>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={editNoteText}
                            onChange={(e) => setEditNoteText(e.target.value)}
                            className="mb-2"
                          />
                          <div className="d-flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => updateNote(note.id)}
                              disabled={!editNoteText.trim()}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-2" style={{ whiteSpace: "pre-wrap" }}>
                            {note.content}
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-secondary">
                              {formatDate(note.created_at)}
                              {note.updated_at !== note.created_at && (
                                <span> (edited {formatDate(note.updated_at)})</span>
                              )}
                            </small>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => startEdit(note)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => setDeleteConfirm(note.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-light border-top">
          <Button variant="outline-secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={deleteConfirm !== null}
        onHide={() => setDeleteConfirm(null)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this note? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteNote}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default function Applications() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("all");
  const [kanban, setKanban] = useState(true);

  // Add Application modal state
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "applied",
    next_followup_on: "",
  });
  const canSave = form.company.trim().length > 0;

  // Details modal state
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  async function load() {
    try {
      const r = await api.get("/applications/?flat=1");
      setRows(r.data || []);
    } catch (e) {
      if (e?.response?.status === 401) {
        nav("/login");
        return;
      }
      setRows([]);
    }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function onChangeStatus(id, status) {
    const item = rows.find((r) => r.id === id);
    if (!item) return;
    try {
      await api.put(`/applications/${id}/`, { ...item, status });
      await load();
    } catch (e) {
      if (e?.response?.status === 401) nav("/login");
    }
  }

  async function onCreate(e) {
    e?.preventDefault();
    if (!canSave) return;
    try {
      await api.post("/applications/", {
        company: form.company.trim(),
        role: form.role.trim(),
        status: form.status,
        next_followup_on: form.next_followup_on || null,
      });
      setShowAdd(false);
      setForm({ company: "", role: "", status: "applied", next_followup_on: "" });
      await load();
    } catch (e) {
      if (e?.response?.status === 401) nav("/login");
    }
  }

  function onViewDetails(application) {
    setSelectedApp(application);
    setShowDetails(true);
  }

  function onCloseDetails() {
    setShowDetails(false);
    setSelectedApp(null);
  }

  function onUpdateApplication() {
    load();
  }

  const filtered = useMemo(
    () =>
      rows.filter((a) => {
        const okStage = stage === "all" ? true : a.status === stage;
        const t = q.trim().toLowerCase();
        const okQ = !t
          ? true
          : a.company?.toLowerCase().includes(t) || a.role?.toLowerCase().includes(t);
        return okStage && okQ;
      }),
    [rows, q, stage]
  );

  const groups = useMemo(() => {
    const map = Object.fromEntries(STATUS_ORDER.map((s) => [s, []]));
    for (const a of filtered) (map[a.status] ?? (map[a.status] = [])).push(a);
    return map;
  }, [filtered]);

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <h2 className="m-0">Applications</h2>
        <div className="d-flex gap-2">
          <Button
            variant={kanban ? "secondary" : "outline-secondary"}
            onClick={() => setKanban(true)}
            size="sm"
          >
            Kanban
          </Button>
          <Button
            variant={!kanban ? "secondary" : "outline-secondary"}
            onClick={() => setKanban(false)}
            size="sm"
          >
            List
          </Button>
          <Button variant="primary" onClick={() => setShowAdd(true)}>
            + New Application
          </Button>
        </div>
      </div>

      <Form className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <Form.Control
          type="search"
          placeholder="Search company or role"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="form-control-dark"
          style={{ minWidth: 260 }}
        />
        <Form.Select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="form-select-dark"
          style={{ maxWidth: 220 }}
        >
          <option value="all">All stages</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>{LABELS[s]}</option>
          ))}
        </Form.Select>
      </Form>

      {kanban ? (
        <Row className="g-3">
          {["applied", "interview", "offer"].map((col) => (
            <Col md={4} key={col}>
              <div className="kanban-col p-3 h-100">
                <div className="fw-semibold mb-2">{LABELS[col]}</div>
                <Stack gap={3}>
                  {groups[col].map((a) => (
                    <ApplicationCard
                      key={a.id}
                      a={a}
                      onChangeStatus={onChangeStatus}
                      onViewDetails={onViewDetails}
                    />
                  ))}
                </Stack>
              </div>
            </Col>
          ))}
          <Col md={12}>
            <div className="kanban-col p-3">
              <div className="fw-semibold mb-2">Other</div>
              <Row className="g-3">
                {filtered
                  .filter((a) => !["applied", "interview", "offer"].includes(a.status))
                  .map((a) => (
                    <Col md={4} key={a.id}>
                      <ApplicationCard
                        a={a}
                        onChangeStatus={onChangeStatus}
                        onViewDetails={onViewDetails}
                      />
                    </Col>
                  ))}
              </Row>
            </div>
          </Col>
        </Row>
      ) : (
        <Stack gap={3}>
          {filtered.map((a) => (
            <ApplicationCard
              key={a.id}
              a={a}
              onChangeStatus={onChangeStatus}
              onViewDetails={onViewDetails}
            />
          ))}
        </Stack>
      )}

      {/* Add Application Modal */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Form onSubmit={onCreate}>
          <Modal.Header closeButton>
            <Modal.Title>New Application</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel label="Company" className="mb-3">
              <Form.Control
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                required
                autoFocus
              />
            </FloatingLabel>
            <FloatingLabel label="Role" className="mb-3">
              <Form.Control
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              />
            </FloatingLabel>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>{LABELS[s]}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Next follow-up</Form.Label>
              <Form.Control
                type="date"
                value={form.next_followup_on}
                onChange={(e) => setForm((f) => ({ ...f, next_followup_on: e.target.value }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={!canSave}>
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        application={selectedApp}
        show={showDetails}
        onHide={onCloseDetails}
        onUpdate={onUpdateApplication}
      />
    </Container>
  );
}
