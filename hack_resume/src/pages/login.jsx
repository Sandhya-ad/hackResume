// no use rn
import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { getCSRF, login, me } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  useEffect(() => { getCSRF(); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await login(username, password);
      const r = await me();
      if (r.data.user) nav("/applications");
    } catch (e) {
      setErr("Invalid username or password");
    }
  }

  return (
    <Container className="py-5" style={{ maxWidth: 480 }}>
      <Card className="p-4">
        <h3 className="mb-3">Sign in</h3>
        {err && <Alert variant="danger">{err}</Alert>}
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control value={username} onChange={(e) => setU(e.target.value)} autoFocus />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setP(e.target.value)} />
          </Form.Group>
          <Button type="submit" variant="primary">Login</Button>
        </Form>
      </Card>
    </Container>
  );
}
