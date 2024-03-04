import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column "> 
      <div className="flex-shrink-0 p-3 bg-body-tertiary" style={{ width: '230px', height: '900px' }}>
        <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
          <svg className="bi pe-none me-2" width="40" height="52">
            <use xlinkHref="#bootstrap"></use>
          </svg>
          <span className="fs-4">Spintly</span>
        </Link>
        <hr />
        <button className="navbar-toggler d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarCollapse" aria-controls="sidebarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse d-md-flex flex-md-column" id="sidebarCollapse">
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <i className="bi-house-door me-2"></i>
                Home
              </Link>
            </li>
            <li>
              <Link to="/page" className="nav-link">
                <i className="bi-key me-2"></i>
                Organisations
              </Link>
            </li>
           
            <li>
              <Link to="/" className="nav-link">
                <i className="bi-coin me-2"></i>
                Log Out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
