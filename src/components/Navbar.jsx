import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { ConnectKitButton } from "connectkit";

function Navbar() {
  return (
    <>
      <header className="header">
        <nav className="navbar">
          <span
            className="logo"
            style={{
              width: "35%",
              display: "flex",
              // textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "5%",
            }}
          >
            <Link to="/">
              <img src={logo} alt="logo" style={{ width: "35%" }} />
            </Link>
          </span>
          <div
            style={{
              width: "30%",
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ConnectKitButton></ConnectKitButton>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
