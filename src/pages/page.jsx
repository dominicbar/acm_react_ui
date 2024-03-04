import { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import { MDBTable, MDBTableHead, MDBTableBody, MDBContainer,MDBDropdown,MDBDropdownToggle,MDBDropdownMenu,MDBDropdownItem} from 'mdb-react-ui-kit'
import axios from 'axios'
import Sidebar from '../components/Sidebar'

const Page = () => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  // State to store the organizations data
  const [organisations, setOrganisations] = useState([])

  useEffect(() => {
    if (!token) {
      console.error('Token not found in localStorage');
      return;
    }

    // Fetch organizations data from the API
    const fetchData = async () => {
      const storedToken = JSON.parse(localStorage.getItem('token'))
      console.log("fetching from backend...")

      try {
        const response = await axios.get('http://localhost:3000/integrators/organisations', {
          headers: {
            Authorization: `Bearer ${storedToken.token}`,
          },
        });

       
        const organizationsData = response.data.message.data.organisations;
        setOrganisations(organizationsData);
        console.log(organizationsData)

      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

  
    fetchData()
  }, [token])

  const handleDownload = async (orgId,option) => {
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

  const downloadExcelFile = async (option) => {
    try {
      console.log("fetchinggg.....")
      const storedToken = JSON.parse(localStorage.getItem('token'))
      const response = await axios.get('http://localhost:3000/excel', {
        params: {
          option,
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
  
  











  // Function to navigate to the next page with the token
  const handleNavigate = (organisationId, organisationName) => {
    navigate(`/Tabs/${organisationId}/${organisationName}`)
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <MDBContainer className="list-view text-center mt-4">
        <h2>Organisations List</h2>
        <hr/>

        <MDBDropdown>
      <MDBDropdownToggle size='lg' style={{ marginLeft:"800px" }}>Generate Postman / Excel</MDBDropdownToggle>
      <MDBDropdownMenu>
        <MDBDropdownItem onClick={() => handleDownload(8,8)}
            style={{ cursor: 'pointer' }}  link>Generate Postman Collection</MDBDropdownItem>


            {/* token is coming undefined in the below postman collections need to check also the accessor id is not getting shown properly*/}
        <MDBDropdownItem onClick={() => downloadExcelFile(2)}
            style={{ cursor: 'pointer' }} link>Generate Excel File</MDBDropdownItem>
        
      </MDBDropdownMenu>
    </MDBDropdown>
        <MDBTable style={{ width: '100%', fontSize: '18px',marginTop:"40px" }}>
      <MDBTableHead style={{fontSize:'18px'}}>
        <tr>
          <th>Organisation ID</th>
          <th>Organisation Name</th>
          <th>Action</th>
          <th>Postman Collection</th>  
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {organisations.map((organisation) => (
          <tr key={organisation.id} >
            <td>{organisation.id}</td>
            <td>{organisation.name}</td>
            <td>
              <button
                onClick={() => handleNavigate(organisation.id, organisation.name)}
                className="btn btn-primary"
              >
                View Details
              </button>
            </td>
               <td>
              <button
               onClick={() => handleDownload(organisation.id,10)}
                className="btn btn-primary"
              >
               Generate Postman Collection
              </button>
            </td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>

    <div className="mt-4">
  {token && typeof token === 'string' ? (
    <div style={{ fontSize: '0.6rem', border: '2px solid #ccc', padding: '5px', borderRadius: '5px', marginTop: '230px' }}>
      <strong>Token:</strong> {JSON.parse(token).token}
    </div>
  ) : (
    <p>No token available.</p>
  )}
</div>
      </MDBContainer>
    </div>
  )
}

export default Page;
