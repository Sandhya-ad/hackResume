// src/components/Applications.jsx
import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Stack } from "react-bootstrap";
import { api } from "../api";
import StatusBadge from "./StatusBadge";
import FollowUpTag from "./FollowUpTag";

const LABELS = {
  applied: "Applied", oa: "OA",
  interview: "Interview", offer: "Offer",
  rejected: "Rejected", ghosted: "No Response",
};
const STATUS_ORDER = ["applied","interview","offer","rejected","oa","ghosted"];

function ApplicationCard({ a, onChangeStatus }) {
  return (
    <Card className="card-lift bg-light text-dark">
      <Card.Body>
        <Stack direction="horizontal" gap={2} className="justify-content-between mb-1">
          <strong className="fs-6">{a.company}</strong>
          <StatusBadge value={a.status} />
        </Stack>
        <div className="text-secondary">{a.role}</div>
        <div className="small text-muted mt-1">Applied: {a.date_applied}</div>
        <div className="mt-2">
          <FollowUpTag dateStr={a.next_followup_on} />
        </div>
        <Form className="mt-3">
          <Form.Select
            value={a.status}
            onChange={(e) => onChangeStatus(a.id, e.target.value)}
          >
            {STATUS_ORDER.map(s => (
              <option key={s} value={s}>{LABELS[s]}</option>
            ))}
          </Form.Select>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default function Applications() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("all");
  const [kanban, setKanban] = useState(true);

  async function load() {
    try {
      const r = await api.get("/applications/");
      setRows(r.data);
    } catch {
      setRows([]);
    }
  }
  useEffect(() => { load(); }, []);

  async function onChangeStatus(id, status) {
    const item = rows.find(r => r.id === id);
    if (!item) return;
    await api.put(`/applications/${id}/`, { ...item, status });
    load();
  }

  const filtered = useMemo(() => rows.filter(a => {
    const okStage = stage === "all" ? true : a.status === stage;
    const t = q.trim().toLowerCase();
    const okQ = !t ? true :
      (a.company?.toLowerCase().includes(t) || a.role?.toLowerCase().includes(t));
    return okStage && okQ;
  }), [rows, q, stage]);

  const groups = useMemo(() => {
    const map = Object.fromEntries(STATUS_ORDER.map(s => [s, []]));
    for (const a of filtered) (map[a.status] ?? (map[a.status] = [])).push(a);
    return map;
  }, [filtered]);

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <h2 className="m-0">Applications</h2>
        <div className="d-flex gap-2">
          <Button
            variant={kanban ? "light" : "outline-light"}
            onClick={() => setKanban(true)}
            size="sm"
          >
            Kanban
          </Button>
          <Button
            variant={!kanban ? "light" : "outline-light"}
            onClick={() => setKanban(false)}
            size="sm"
          >
            List
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
          style={{ minWidth: 260 }}     // replace the non-Bootstrap class
        />

        <Form.Select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="form-select-dark"
          style={{ maxWidth: 220 }}
        >
          <option value="all">All stages</option>
          {STATUS_ORDER.map(s => (
            <option key={s} value={s}>{LABELS[s]}</option>
          ))}
        </Form.Select>
      </Form>


      {kanban ? (
        <Row className="g-3">
          {["applied","interview","offer"].map(col => (
            <Col md={4} key={col}>
              <div className="kanban-col p-3 h-100">
                <div className="fw-semibold mb-2">{LABELS[col]}</div>
                <Stack gap={3}>
                  {groups[col].map(a => (
                    <ApplicationCard key={a.id} a={a} onChangeStatus={onChangeStatus} />
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
                  .filter(a => !["applied","interview","offer"].includes(a.status))
                  .map(a => (
                    <Col md={4} key={a.id}>
                      <ApplicationCard a={a} onChangeStatus={onChangeStatus} />
                    </Col>
                  ))}
              </Row>
            </div>
          </Col>
        </Row>
      ) : (
        <Stack gap={3}>
          {filtered.map(a => (
            <ApplicationCard key={a.id} a={a} onChangeStatus={onChangeStatus} />
          ))}
        </Stack>
      )}
    </Container>
  );
}
