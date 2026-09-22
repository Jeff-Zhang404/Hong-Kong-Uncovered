import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useLocation  } from "react-router";


const NAVBAR_STYLE = {
    backgroundColor: "#ffffff",
    //backgroundColor: "#c60c30",
    borderBottom: "2px solid #c60c30",
};
const LINK_STYLE = {
    color: "#c60c30",
    fontWeight: 500,
    margin: "0 1rem",
};

export default function AppNavBar() {
    const location = useLocation();

    const makeStyle = (to) => {
    const isActive =
      to === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(to);
    if (!isActive) return LINK_STYLE;
    return {
      ...LINK_STYLE,
      fontWeight: 600,
      paddingBottom: 8, 
      boxShadow: "inset 0 -3px 0 #c60c30", 
    };
  };

    return (
        <Navbar expand="lg" style={NAVBAR_STYLE} variant="light" sticky="top">
            <Container fluid className="justify-content-between">
                <Navbar.Brand as={Link} to="/" style={{ color: "#c60c30", fontWeight: 700 }}>
                    Hong Kong Uncovered
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navigation" />
                <Navbar.Collapse id="main-navigation" className="justify-content-between">
                <Nav className="align-items-center">
                    <Nav.Link as={Link} to="/" style={makeStyle("/")}>
                        Home Page
                    </Nav.Link>
                    <Nav.Link as={Link} to="/knowledge" style={makeStyle("/knowledge")}>
                        HK Knowledge
                    </Nav.Link>
                    <Nav.Link as={Link} to="/tourist" style={makeStyle("/tourist")}>
                        Tourist Attractions
                    </Nav.Link>
                    <Nav.Link as={Link} to="/food" style={makeStyle("/food")}>
                        Food
                    </Nav.Link>
                </Nav>

                <Nav className="align-items-center">
                    <Nav.Link as={Link} to="/bookmark" style={makeStyle("/bookmark")}>
                        Bookmark
                    </Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
