import React from "react";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import ASLOGO from "../data/images/ASLOGO.png";

function Header() {
    return (
        <Navbar
            expand={window.innerWidth > 800 ? true : false}
            className="justify-content-center navbar-top"
            style={{
                whiteSpace: "nowrap",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Container>
                <Navbar.Brand href="#home">
                    <img alt="aslogo" src={ASLOGO} width="85px" height="65px"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav
                        className="me-auto"
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            flexWrap: "wrap",
                            fontSize: "10px !important",
                        }}
                    >
                        <NavDropdown title="About Us" id="about-us-nav-dropdown">
                            <NavDropdown.Item href="/">Resources</NavDropdown.Item>
                            <NavDropdown.Item href="/">Advisors</NavDropdown.Item>
                            <NavDropdown.Item href="/">Contact us</NavDropdown.Item>
                            <NavDropdown.Item href="/">Governing Documents</NavDropdown.Item>
                            <NavDropdown.Item href="/">Student Comments</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown
                            title="Meet the Committees"
                            id="meet-the-committees-nav-dropdown"
                        >
                            <NavDropdown.Item href="/">General Info</NavDropdown.Item>
                            <NavDropdown.Item href="/">Executive Committee</NavDropdown.Item>
                            <NavDropdown.Item href="/">
                                Administration Committee
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/">Finance Committee</NavDropdown.Item>
                            <NavDropdown.Item href="/">Activities Committee</NavDropdown.Item>
                            <NavDropdown.Item href="/">Relations Committee</NavDropdown.Item>
                            <NavDropdown.Item href="/">
                                Organizations Committee
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link>ASGCC Meetings</Nav.Link>
                        <NavDropdown title="Student Clubs" id="student-clubs-nav-dropdown">
                            <NavDropdown.Item href="/">Club Directory</NavDropdown.Item>
                            <NavDropdown.Item href="/">Club Registration</NavDropdown.Item>
                            <NavDropdown.Item href="/">Forms for Clubs</NavDropdown.Item>
                            <NavDropdown.Item href="/">
                                Inter-Organizational Council (IOC)
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/">Funding</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link>Event Calendar</Nav.Link>
                        <Nav.Link>Student Advocacy</Nav.Link>
                        <NavDropdown
                            title="Become a Student Leader"
                            id="student-leader-nav-dropdown"
                        >
                            <NavDropdown.Item href="/">
                                Join ASGCC - Important Information
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/">Alumni Experiences</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown
                            title="Business Office"
                            id="business-office-nav-dropdown"
                        >
                            <NavDropdown.Item href="/">Forms for ASGCC</NavDropdown.Item>
                            <NavDropdown.Item href="/">Forms for Athletics</NavDropdown.Item>
                            <NavDropdown.Item href="/">
                                Forms for Departments
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link>Members Only</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
