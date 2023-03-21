import { Link } from "react-router-dom";

const MenuContents = () => {
  return (
    <div style={{ backgroundColor: "green", padding: "10px" }}>
      <ul>
        <li>
          <Link to="/logs">
            <h3>Logger</h3>
          </Link>
        </li>
        <li>
          <Link to="/logs">
            <h3>Logs Analyzer</h3>
          </Link>
        </li>
        <li>
          <Link to="/logs">
            <h3>Logs Planner</h3>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuContents;
