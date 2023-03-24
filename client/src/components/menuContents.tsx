import { Link } from "react-router-dom";

const MenuContents = () => {
  return (
    <div style={{ padding: "10px" }}>
      <ul
        style={{
          listStyleType: "none",
          margin: 0,
          padding: 0,
          marginLeft: "1rem",
        }}
      >
        <li
          style={{
            marginBottom: "10px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          <Link to="/logs" style={{ textDecoration: "none" }}>
            <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
              Logger
            </h3>
          </Link>
        </li>
        <li
          style={{
            marginBottom: "10px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          <Link to="/logs" style={{ textDecoration: "none" }}>
            <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
              Logs Analyzer
            </h3>
          </Link>
        </li>
        <li
          style={{
            marginBottom: "10px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          <Link to="/logs" style={{ textDecoration: "none" }}>
            <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
              Logs Planner
            </h3>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuContents;
