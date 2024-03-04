import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginForm from './pages/login'
// import TestPage from './pages/orgdetails'
import Page from './pages/page'
import Tabs from './pages/tabs'
import Modal from './components/AddAcessorModal'
import AccessPointPermi from './pages/AccessPointPermi'
import AssignCardModal from './components/AssignCardModal'
// import  TestPage  from './pages/testpage'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import SiteInfo from './pages/SiteInfo'
import UpdatePermissionsModal from './components/UpdatePermissionsModal'
import Loginnew from './playground/Loginnew'
import DownloadFile from './playground/Postmanbutton'

import 'bootstrap/dist/css/bootstrap.min.css';


// import Dashboard from './pages/Dashboard'; // Update the path accordingly

const App = () => {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<LoginForm />} />
        <Route path="/page" element={<Page />} />
  
           <Route path="/Tabs/:id/:name" element={<Tabs />} /> 
           <Route path="/modal" element={<Modal />} /> 
           <Route path="/SiteInfo/:siteId/:orgId" element={<SiteInfo/>} /> 
           <Route path="/AccessPointPermi/:orgId/:accessorId" element={<AccessPointPermi/>} /> 
           <Route path="/UpdatePermissionsModal" element={<UpdatePermissionsModal/>} /> 
           <Route path="/AssignCardModal" element={<AssignCardModal/>} /> 
           <Route path="/LogiNew" element={<Loginnew/>} /> 
           <Route path="/Postmanbutton" element={<DownloadFile />} /> 
           {/* <Route path="/OrgDetails" element={<TestPage   />} />  */}
           {/* <Route path="/testPage" element={<TestPage   />} />  */}
      
      </Routes>


    </Router>
  );
};

export default App;
