import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

import Swal from 'sweetalert2';
// eslint-disable-next-line react/prop-types
const Modal = ({showModal,onClose}) => {

  const { id } = useParams();
  const [orgId] = useState(parseInt(id, 10))
  //const [centredModal, setCentredModal] = useState(false);
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [accessPoints, setAccessPoints] = useState([]);
  const [selectedAccessPoints, setSelectedAccessPoints] = useState([]);

  const [provider, setProvider] = useState(null);
  const [sub, setSub] = useState('');
  //const [credentialId, setCredentialId] = useState(null);

  const token = localStorage.getItem('token');
  console.log('token in org details', token);

  //const toggleOpen = ()  => onClose();
  const storedTokenString = localStorage.getItem('token')
  const storedToken = JSON.parse(storedTokenString);

 


  const fetchSitesData = async (orgId) => {
   

    console.log("Value of storedToken:", storedTokenString)
    try {


      const response = await axios.get(
        `http://localhost:3000/organisations/${orgId}/sites`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken.token}`
          
          },
        }
      );

      const sitesData = response.data.message.data.sites;
      setSites(sitesData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (orgId) {
      fetchSitesData(orgId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, token]);




  const fetchAccessPoints = async (siteId) => {
    try {
      const response = await axios.get(`http://localhost:3000/getaccesspointofsite/${siteId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken.token}`
         
        },
      });

      const accessPointsData = response.data.message.data.accessPoints;
      setAccessPoints(accessPointsData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSiteChange = (event) => {
    const siteId = event.target.value;
    setSelectedSite(siteId);
    fetchAccessPoints(siteId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();


  
    try {
      if (provider && !sub) {
        // alert('Missing sub value. Please provide a sub value.');
        Swal.fire({
          title: "Missing Sub Value!",
          text: "Please provide a sub value!",
          icon: "error"
        });
        return; 
      }

      const apiUrl = 'http://localhost:3000/addacessor'
  
      //const accessPointId = parseInt(document.getElementById('exampleFormControlSelect2').value);
  
      const permissionsToAdd = selectedAccessPoints.includes("") ? [] : selectedAccessPoints.map(accessPointId => ({
        accessPointId: parseInt(accessPointId),
        mobile: {
          enabled: true,
          settings: {
            proximityAccess: false,
            tapToAccess: true,
            clickToAccessRange: 1,
            remoteAccess: true,
            mfaEnabledRemoteAccess: false,
            mfaEnabledClickToAccess: false,
          },
        },
        card: {
          enabled: true,
        },
        fingerprint: {
          enabled: true,
        },
        face: {
          enabled: true,
        },
      }));

      
      
      const data = {
        orgId,
        credentialId: null,
        permissionsToAdd,
        ...(provider && sub && { identityInfo: { provider, sub } }),
      };
      
      const response = await axios.post(apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken.token}`
        },
      });
  
      console.log('POST Response:', response.data);
      Swal.fire({
        title: "Success!",
        text: "Accessor Added Succesfully",
        icon: "success"
      });

      onClose()
    } catch (error) {
      console.log(error.response.data.message);
      console.error('POST Error:', error);
      // alert('Error creating Accessor. Please try again.');
      Swal.fire({
        title: "Error!",
        text: "Error!Creating Accessor",
        icon: "error"
      });
    }
  };


  const handleAccessPointChange = (event) => {
   
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedAccessPoints(selectedOptions);
    console.log("access points",selectedAccessPoints)
  };

  const handleDownload = async (option) => {
    console.log("starting...");
    const storedToken = JSON.parse(localStorage.getItem('token'))

    try {
      const response = await axios.post('http://localhost:3000/generateMessage', {
        option,
        orgId,    
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

  useEffect(() => {
    // Call the getMobileClients API
    const fetchProviderId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getmobileclients`,  
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${storedToken.token}`,
            },
          }
        );
        const { providerId } = response.data.message;
        console.log("providerId:", providerId);
        console.log('Full response:', response.data);
        setProvider(providerId);

     
      } catch (error) {
        console.error('Error fetching providerId:', error);
      }
    };
  
    fetchProviderId();
  }, [storedToken.token, setProvider]);
  






  return (
    <>
    

    <MDBModal tabIndex="-1" open={showModal} toggle={onClose}>

        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Add Accessor</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={onClose}></MDBBtn>

            </MDBModalHeader>
            <MDBModalBody>
              <MDBBtn style={{marginLeft:"200px"}} onClick={() => handleDownload(9,orgId)}>Generate POstman Collection</MDBBtn>
              <hr/>
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="provider" className="form-label">
                    Provider
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="provider"
                    value={provider || "Provider not present"}
                    readOnly 
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="sub" className="form-label">
                    Sub
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="sub"
                    placeholder="Sub"
                    value={sub}
                    readOnly={!provider}
                    onChange={(e) => setSub(e.target.value)}
                  />
                </div>

              
                <div className="mb-5">
                  <label htmlFor="exampleFormControlSelect1" className="form-label">
                    Sites
                  </label>
                  <select
                    className="form-select"
                    id="exampleFormControlSelect1"
                    value={selectedSite}
                    onChange={handleSiteChange}
                  >
                    <option value="" disabled selected>
                      Select a Site
                    </option>
                    {sites.map((site) => (
                      <option key={site.id} value={site.id}>
                        <p>id {site.id}</p>
                        {site.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-5">
                  <label htmlFor="exampleFormControlSelect1" className="form-label">
                    Access Points
                  </label>
                  <select className="form-select" 
                  id="exampleFormControlSelect2"
                  multiple
                  value={selectedAccessPoints}
        onChange={handleAccessPointChange}>
                    <option value="">None</option>

                    {accessPoints.map((accessPoint) => (
                      <option key={accessPoint.id} value={accessPoint.id}>
                        {accessPoint.name}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={onClose}>
                Close
              </MDBBtn>
              <MDBBtn type="submit" onClick={handleSubmit}>Submit</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default Modal;

