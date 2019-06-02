import React from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

import useToggleState from "../hooks/useToggleState";

const TopNavBar = props => {
  const [isOpen, toggleIsOpen] = useToggleState(false);
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand tag={Link} to="/">
          Lista della spesa
        </NavbarBrand>

        <NavbarToggler onClick={toggleIsOpen} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/calendar" onClick={toggleIsOpen}>
                Menu
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink tag={Link} to="/shopping" onClick={toggleIsOpen}>
                Scegli
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink tag={Link} to="/shopping-list" onClick={toggleIsOpen}>
                Lista
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink tag={Link} to="/backoffice" onClick={toggleIsOpen}>
                Backoffice
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default TopNavBar;
