import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UpdatePermissionsModal from '../components/UpdatePermissionsModal'
import Modal from '../components/AddAcessorModal';
import AssignCardModal from '../components/AssignCardModal'
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import {
  MDBIcon,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBInputGroup,
  MDBInput,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem
} from 'mdb-react-ui-kit';
import Swal from 'sweetalert2';
import Sidebar from '../components/Sidebar';
//import SiteInfo from './SiteInfo'


export default function Tabs() {
  const [iconsActive, setIconsActive] = useState('tab1');

  const handleIconsClick = (value) => {
    if (value === iconsActive) {
      return;
    }

    setIconsActive(value);
  };

  const { id, name } = useParams();
  const [orgId] = useState(id);
  const [showModal, setShowModal] = useState(false);
  const [displayModal,setDisplayModal]=useState(false)
  const navigate = useNavigate();


  //navigation to the next page after clicking on view access points under sites tab
  const handleNavigate = (siteId) => {
    navigate(`/SiteInfo/${siteId}/${orgId}`)
  }

  const token = localStorage.getItem('token');
  console.log('token in tab', token);


  const organisationName = name;

  const [sitesData, setSitesData] = useState([]);

  const [permissions, setPermissions] = useState([]);
  const [accessorId,setAccessorId]=useState('')

  const fetchSitesData = async (orgId) => {
    const storedTokenString = localStorage.getItem('token');

    console.log('Value of storedToken:', storedTokenString);
    try {
      const storedToken = JSON.parse(storedTokenString);
      const response = await axios.get(`http://localhost:3000/organisations/${orgId}/sites`, {
        headers: {
          Authorization: `Bearer ${storedToken.token}`,
        },
      });

      const responseData = response.data.message.data;

      if (responseData && responseData.sites) {
        setSitesData(responseData.sites);
      }
    } catch (error) {
      console.error('Error fetching sites data:', error);
      console.error('Error:', error.response);
    }
  };

  useEffect(() => {
    console.log('Org ID changed:', orgId);
    if (orgId) {
      fetchSitesData(orgId);
    }
  }, [orgId, token]);

  const fetchData = async (orgId, accessorId) => {
    const storedTokenString = localStorage.getItem('token');
    console.log("fetching data using accessor id", accessorId)
    try {
      const storedToken = JSON.parse(storedTokenString);
      const response = await axios.get(`http://localhost:3000/getaccessorpermi/${orgId}/${accessorId}`, {
        headers: {
          Authorization: `Bearer ${storedToken.token}`,
        },
      });

      const data = response.data.message.data.permissions;
      setPermissions(data);
      console.log(setPermissions);


    } catch (error) {
     
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Accessor ID Unavailable!"
      });
      console.error(error);


    }
  };

  const handleDownload = async (orgId,option,accessorId) => {
    console.log("starting...");
    console.log("orgId",orgId)
    const storedToken = JSON.parse(localStorage.getItem('token'))

    try {
      const response = await axios.post('http://localhost:3000/generateMessage', {
        option,
        orgId,
        accessorId,
        token: storedToken.token
      },
       {
        responseType: 'json'
      });
      
      if (!response.data) {
        throw new Error('Empty response');
      }


      const { filePath, collectionJSON } = response.data;

      // Ensure the data is an array of BlobParts
      // const blobData = Array.isArray(response.data)
      //   ? response.data
      //   : [response.data];

      // Creating a blob from the response data

      if (!filePath || !collectionJSON) {
        throw new Error('Invalid response data');
      }
      
      const blob = new Blob([collectionJSON], { type: 'application/json' });
     

      // link element and trigger a click to start the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'latest_download.json';
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const downloadExcelFile = async (option,orgId,accessorId) => {
    try {
      console.log("fetchinggg.....")
      const storedToken = JSON.parse(localStorage.getItem('token'))
      const response = await axios.get('http://localhost:3000/excel', {
        params: {
          option,
          orgId,
          accessorId,
          token: storedToken.token

        },
        headers: {
          Authorization: `Bearer ${storedToken.token}`,
        },
        responseType: 'blob'
      });
  
      // Create a blob from the response
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
  
      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'organizations.xlsx';
  
      // Append the link to the document
      document.body.appendChild(link);
  
      // Trigger a click to start the download
      link.click();
  
      // Remove the link from the document
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading Excel file:', error.message);
    }
  };
  

//assign card




  const handleSearch = () => {
    fetchData(orgId, accessorId);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDisplayModal=()=>{
    console.log('opening modal...')
    setDisplayModal(true)
  }

  const handleDisplayCloseModal=() =>{
    setDisplayModal(false)
  }

  

  return (
    <div className="d-flex" style={{ height: '100vh', width: '100%' }}>
      <Sidebar />
      <div className="flex-grow-5 d-flex flex-column align-items-center mt-4" style={{ height: '100%', width: '100%' }}>
        <h2 className="text-center">Organisation Name: {organisationName} </h2>
       
       <hr/>
        <div>
        <MDBDropdown>
      <MDBDropdownToggle size='lg' style={{ marginLeft:"900px" }}>Generate Postman / Excel</MDBDropdownToggle>
      <MDBDropdownMenu>
      <MDBDropdownItem onClick={() => handleDownload(orgId,11)}
            style={{ cursor: 'pointer' }} link>Generate Postman Collection</MDBDropdownItem>
        <MDBDropdownItem onClick={() => downloadExcelFile(1,orgId)}
            style={{ cursor: 'pointer' }}  link>Download Excel File</MDBDropdownItem>

      </MDBDropdownMenu>
    </MDBDropdown>


      

       
        </div>
       


        <MDBTabs className="mb-3" style={{ width: '100%',marginTop:'40px' }}>
          <MDBTabsItem style={{ flex: 1 }}>
            <MDBTabsLink onClick={() => handleIconsClick('tab1')} active={iconsActive === 'tab1'}>
              <MDBIcon fas icon="user" className="me-2" /> Sites
            </MDBTabsLink>
          </MDBTabsItem>
         
          <MDBTabsItem style={{ flex: 1 }}>
            <MDBTabsLink onClick={() => handleIconsClick('tab3')} active={iconsActive === 'tab3'}>
              <MDBIcon fas icon="cogs" className="me-2" /> Accessors
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent style={{ height: '100%', width: '98%' }}>
          <MDBTabsPane open={iconsActive === 'tab1'}>
          <MDBTable style={{ width: '120%', fontSize: '18px' }}>
          <MDBTableHead>
            <tr>
              <th>Site ID</th>
              <th>Site Name</th>
              <th>Site Location</th>
              <th>Action</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {sitesData.map((site) => (
              <tr key={site.id}>
                <td>{site.id}</td>
                <td>{site.name}</td>
                <td>{site.location}</td>
                <td>
                 
                    <MDBBtn color="primary" size="m"
                     onClick={() => handleNavigate(site.id)}
                    >
                      View Access Points
                    </MDBBtn>
                 
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>





            
          </MDBTabsPane>
        
          <MDBTabsPane open={iconsActive === 'tab3'}>
          <div className="d-flex justify-content-end mb-1">
              <MDBBtn style={{marginRight:"50px"}} onClick={handleOpenModal}>Add Accessor</MDBBtn>

         
            </div>

            {showModal && <Modal showModal={showModal} onClose={handleCloseModal} />}
            {console.log('showModal:', showModal)}
            <hr />

            <MDBInputGroup className="mb-2" style={{width:"300px"}} >

              <MDBInput label="Accessor ID" value={accessorId} onChange={(e) => setAccessorId(e.target.value)} style={{ width: "300px" }}  />
              <MDBBtn rippleColor="dark" onClick={handleSearch}>
                <MDBIcon icon="search" />
              </MDBBtn>
              {permissions.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <MDBBtn onClick={handleDisplayModal} style={{ height: '40px', width: '200px', marginLeft: '100px' }}>Update Permissions</MDBBtn>
            {displayModal && <UpdatePermissionsModal displayModal={displayModal} onClose={handleDisplayCloseModal} accessorId={accessorId} />}
            <AssignCardModal orgId={orgId} accessorId={accessorId} />
            <MDBDropdown>
      <MDBDropdownToggle style={{ marginLeft:"150px" }}>Generate Postman Collection / Excel</MDBDropdownToggle>
      <MDBDropdownMenu>
        <MDBDropdownItem onClick={() => handleDownload(orgId, 2,accessorId)}
            style={{ cursor: 'pointer' }} link >Update Accessor Permissions</MDBDropdownItem>


            {/* token is coming undefined in the below postman collections need to check also the accessor id is not getting shown properly*/}
        <MDBDropdownItem onClick={() => handleDownload(orgId, 3,accessorId)}
            style={{ cursor: 'pointer' }} link>Assign Card</MDBDropdownItem>
        <MDBDropdownItem onClick={() => handleDownload(orgId, 4,accessorId)}
            style={{ cursor: 'pointer' }} link>UnAssign Card</MDBDropdownItem>
              <MDBDropdownItem onClick={() => downloadExcelFile(5,orgId,accessorId)}
            style={{ cursor: 'pointer' }} link>Generate Excel for Access Point Permissions</MDBDropdownItem>
      </MDBDropdownMenu>
    </MDBDropdown>

   
    
            
        
        </div>

            
              
            

            )}
            </MDBInputGroup>
            
            {permissions.length > 0 && (
          
              <MDBTable style={{ width: '100%', fontSize: '17px', marginRight: '0px' }}>

                <MDBTableHead>
                  <tr>
                    <th>Access Point ID</th>
                    <th>Mobile</th>
                    <th>Card</th>
                    <th>Fingerprint</th>
                    <th>Face</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {permissions.map((permission, index) => (
                    <tr key={index}>
                      <td>{permission.accessPointId}</td>
                      <td>{permission.mobile.enabled ? 'Enabled' : 'Disabled'}</td>
                      <td>{permission.card.enabled ? 'Enabled' : 'Disabled'}</td>
                      <td>{permission.fingerprint.enabled ? 'Enabled' : 'Disabled'}</td>
                      <td>{permission.face.enabled ? 'Enabled' : 'Disabled'}</td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            )
              }
          
          </MDBTabsPane>
        </MDBTabsContent>
       <div className="mt-4">
  {token && typeof token === 'string' ? (
    <div style={{ fontSize: '0.6rem', border: '2px solid #ccc', padding: '5px', borderRadius: '5px', marginTop: '230px' }}>
      <strong>Token:</strong> {JSON.parse(token).token}
    </div>
  ) : (
    <p>No token available.</p>
  )}
</div>

      </div>
    </div>
  );
}
