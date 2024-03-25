import { Link } from "react-router-dom";
import PageNav from "../component/PageNav";

function Homepage() {
  return (
    <div>
      <PageNav />
      <h1>WorldWise</h1>
      <Link to="/app">Home</Link>
    </div>
  );
}

export default Homepage;
