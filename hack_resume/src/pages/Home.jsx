import React, { useState } from "react";
import { Navbar, Container, Button, Row, Col, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phoneCountry: "Canada", phoneCode: "+1",
    company: "", companySize: "", marketing: false,
  });
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Please complete this required field.";
    if (!form.lastName.trim()) e.lastName = "Please complete this required field.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Please enter a valid email.";
    if (!form.company.trim()) e.company = "Please complete this required field.";
    if (!form.companySize) e.companySize = "Please complete this required field.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    // TODO: Connect to your backend; for now navigate to applications
    window.location.href = "/applications";
  };

  return (
    <>
      <Navbar expand="md" variant="dark" className="bg-navy shadow-sm">
        <Container>
          <Navbar.Brand className="fw-semibold">Hack Resume</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav" className="justify-content-end">
            <Button as={Link} to="/applications" variant="outline-light" className="me-2">
              Application Tracker
            </Button>
            <Button as={Link} to="/tailor" variant="primary">
              Tailor Resume
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero: left content, right signup card */}
      <section className="hero-dark py-5">
        <Container>
          <Row className="align-items-start g-4">
            {/* Left side headline & blurb */}
            <Col lg={6}>
              <h1 className="display-4 fw-bold text-white lh-tight">
                Find and hire with a modern applicant tracking workflow
              </h1>
              <p className="lead text-white-50 mt-3">
                From saving roles to making offers, get everything you need to attract and win great opportunities.
              </p>
              <div className="mt-4">
                <div className="mock-screenshot" />
              </div>
            </Col>

            {/* Right side signup form in white card */}
            <Col lg={6}>
              <Card className="signup-card shadow-lg border-0">
                <Card.Body className="p-4 p-md-5">
                  <h2 className="h3 text-primary mb-2">Get a demo of Hack Resume</h2>
                  <p className="text-secondary mb-4">
                    Tell us about your goals and see our tracking software in action.
                  </p>

                  <Form onSubmit={onSubmit} noValidate>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>First Name<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          name="firstName" value={form.firstName} onChange={onChange}
                          className={errors.firstName ? "is-invalid" : ""} autoComplete="given-name"
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </Col>
                      <Col md={6}>
                        <Form.Label>Last Name<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          name="lastName" value={form.lastName} onChange={onChange}
                          className={errors.lastName ? "is-invalid" : ""} autoComplete="family-name"
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </Col>

                      <Col xs={12}>
                        <Form.Label>Work Email<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="email" name="email" value={form.email} onChange={onChange}
                          className={errors.email ? "is-invalid" : ""} autoComplete="email"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </Col>

                      <Col md={6}>
                        <Form.Label>Country</Form.Label>
                        <Form.Select name="phoneCountry" value={form.phoneCountry} onChange={onChange}>
                          <option>Canada</option><option>United States</option>
                          <option>United Kingdom</option><option>India</option><option>Other</option>
                        </Form.Select>
                      </Col>
                      <Col md={6}>
                        <Form.Label>Phone</Form.Label>
                        <div className="d-flex">
                          <Form.Select
                            style={{ maxWidth: 110 }}
                            name="phoneCode" value={form.phoneCode} onChange={onChange}
                          >
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                            <option value="+61">+61</option>
                            <option value="+91">+91</option>
                          </Form.Select>
                          <Form.Control placeholder="123 456 7890" className="ms-2" />
                        </div>
                      </Col>

                      <Col xs={12}>
                        <Form.Label>Company name<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          name="company" value={form.company} onChange={onChange}
                          className={errors.company ? "is-invalid" : ""}
                        />
                        {errors.company && <div className="invalid-feedback">{errors.company}</div>}
                      </Col>

                      <Col xs={12}>
                        <Form.Label>Company size<span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="companySize" value={form.companySize} onChange={onChange}
                          className={errors.companySize ? "is-invalid" : ""}
                        >
                          <option value="">Please Select</option>
                          <option>1–10</option><option>11–50</option>
                          <option>51–200</option><option>201–500</option><option>500+</option>
                        </Form.Select>
                        {errors.companySize && <div className="invalid-feedback">{errors.companySize}</div>}
                      </Col>

                      <Col xs={12}>
                        <Form.Check
                          type="checkbox" id="marketing" name="marketing"
                          checked={form.marketing} onChange={onChange}
                          label={
                            <small className="text-secondary">
                              Yes, I’d like helpful resources and invitations (you can opt out anytime).
                            </small>
                          }
                        />
                      </Col>

                      <Col xs={12} className="d-grid">
                        <Button type="submit" variant="primary">Request a demo</Button>
                      </Col>

                      <Col xs={12}>
                        <small className="text-secondary">
                          By continuing, you agree to our Terms and Privacy Policy.
                        </small>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
