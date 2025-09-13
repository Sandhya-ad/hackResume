// ================= src/components/TopNav.jsx =================
import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function TopNav() {
return (
<Navbar bg="light" expand="md" className="border-bottom">
    <Container>
        <Navbar.Brand as={NavLink} to="/">JobTrackr</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto">
                <Nav.Link as={NavLink} to="/" end>
                    Applications
                </Nav.Link>
                <Nav.Link as={NavLink} to="/resumes">
                    Resume Tailor
                </Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Container>
</Navbar>
);
}