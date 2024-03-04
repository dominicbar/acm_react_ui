import { useEffect, useState } from 'react'
import axios from 'axios'
import { MDBTable, MDBTableHead, MDBTableBody, MDBContainer,MDBDropdown,MDBDropdownToggle,MDBDropdownItem,MDBDropdownMenu} from 'mdb-react-ui-kit'
import '../components/Sidebar'
import Sidebar from '../components/Sidebar'
import { useParams } from 'react-router-dom'
import { useNavigate} from 'react-router-dom';


const SiteInfo = () => {
  const [accessPoints, setAccessPoints] = useState([])
  const { siteId,orgId} = useParams()
  const token = localStorage.getItem('token')
  console.log("token in site info", token)

  const navigate = useNavigate();

  const handleNavigate = (accessPointId) => {
    console.log("accessor id",accessPointId)
    navigate(`/AccessPointPermi/${orgId}/${accessPointId}`);
  };
  


  const fetchAccessPoints = async (siteId) => {
    const storedTokenString = localStorage.getItem('token');
    console.log('Value of storedToken:', storedTokenString);
    console.log('fetching data')
    try {
      const storedToken = JSON.parse(storedTokenString);
      const response = await axios.get(`http://localhost:3000/getaccesspointofsite/${siteId}`, {
        headers: {
          Authorization: `Bearer ${storedToken.token}`,
        },
      })

      const accessPointsData = response.data.message.data.accessPoints
      setAccessPoints(accessPointsData)
    } catch (error) {
      console.error('Error fetching access points:', error.message)
    }
  }

  useEffect(() => {
    fetchAccessPoints(siteId,orgId); 
  }, [siteId,orgId])


  const addRemoteAccess = async (accessPoint) => {
    const storedTokenString = localStorage.getItem('token');
    console.log('Value of storedToken:', storedTokenString);
    console.log('fetching data')
    try {
      const storedToken = JSON.parse(storedTokenString);
      console.log("passing access point id", accessPoint.id)
      const response = await axios.post(
        'http://localhost:3000/addRemoteAccess',
        {
          accessPointId: accessPoint.id
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const remoteAccessData = response.data.message.data;
      console.log('Response from addRemoteAccess:', remoteAccessData);
  
      if (response.status === 200) {
        alert('Remote access added successfully');
      } else {
        alert('Failed to add remote access');
      }
    } catch (error) {
      console.error('Error adding remote access:', error.message);
      alert('Failed to add remote access');
    }
  }


const handleDownload = async (orgId,option,accessPointId) => {
    console.log("starting...");
    const storedToken = JSON.parse(localStorage.getItem('token'))

    try {
      const response = await axios.post('http://localhost:3000/generateMessage', {
        option,
        orgId,
        accessPointId,
        siteId,
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

  const downloadExcelFile = async (option) => {
    try {
      console.log("fetchinggg.....")
      const storedToken = JSON.parse(localStorage.getItem('token'))
      const response = await axios.get('http://localhost:3000/excel', {
        params: {
          option,
          siteId,
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


  return (
    <div className="d-flex" style={{ height: '100vh', width: '100%' }}>
      <Sidebar />
      <MDBContainer className="text-center mt-4">
        <h2>Access Points</h2>
        <hr/>

        <MDBDropdown >
      <MDBDropdownToggle size='lg' style={{ marginLeft:"900px" }}>Generate Postman / Excel</MDBDropdownToggle>
      <MDBDropdownMenu>
      <MDBDropdownItem onClick={() => handleDownload(siteId,12)}
            style={{ cursor: 'pointer' }} link>Generate Postman Collection</MDBDropdownItem>
        <MDBDropdownItem onClick={() => downloadExcelFile(3,siteId)}
            style={{ cursor: 'pointer' }} link >Download Excel File</MDBDropdownItem>

      </MDBDropdownMenu>
    </MDBDropdown>
       
        <hr/>
        <MDBTable style={{ width: '100%', fontSize: '18px' }}>
          <MDBTableHead>
            <tr>
              <th>Access Point ID</th>
              <th>Name</th>
              <th>Remote </th>
              <th>Action</th>
              <th>Generate Postman Collection</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {accessPoints.map((accessPoint) => (
              <tr key={accessPoint.id}>
                <td>{accessPoint.id}</td>
                <td>{accessPoint.name}</td>
                <td>
              <button
             
                className="btn btn-primary"
                onClick={()=> addRemoteAccess(accessPoint)}
         
              >
                
                Remote Access
              </button>

            </td>
                <td>
              <button
             
                className="btn btn-primary"
                onClick={() => handleNavigate(accessPoint.id)
                }
                
              >
                
                View Permissions
              </button>
            </td>
            <td>
      <MDBDropdown>
        <MDBDropdownToggle color="primary" caret>
                Generate Postman Collection
        </MDBDropdownToggle>
        <MDBDropdownMenu>
          <MDBDropdownItem
            onClick={() => handleDownload(orgId, 6, accessPoint.id)}
            style={{ cursor: 'pointer' }} 
            link
          >
            Access Point Permissions
          </MDBDropdownItem>
          <MDBDropdownItem
            onClick={() => handleDownload(orgId, 13, accessPoint.id)}
            style={{ cursor: 'pointer' }} 
            link
          >
            Remote Access
          </MDBDropdownItem>
        </MDBDropdownMenu>
      </MDBDropdown>
    </td>
          
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </MDBContainer>
    </div>
  );
};

export default SiteInfo;
