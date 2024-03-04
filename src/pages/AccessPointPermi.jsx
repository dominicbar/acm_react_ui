import { useEffect, useState } from 'react';
import axios from 'axios';
import { MDBTable, MDBTableHead, MDBTableBody, MDBContainer,MDBBtn } from 'mdb-react-ui-kit';
import Sidebar from '../components/Sidebar';
import { useParams } from 'react-router-dom'


const AccessPointPermi = () => {
  const [permissions, setPermissions] = useState([]); 
  const { orgId,accessorId } = useParams();

  console.log('orgid in frontend',orgId)
  console.log('accessor in frontend',accessorId)
  

  const token = localStorage.getItem('token');
  console.log("token in permission info", token);

 


  const fetchAccessPoints = async () => {
    const storedTokenString = localStorage.getItem('token');
    console.log('Value of storedToken:', storedTokenString);
    console.log('fetching data');
    try {
      const storedToken = JSON.parse(storedTokenString);
      const response = await axios.get(`http://localhost:3000/getaccesspointpermi/${orgId}/${accessorId}`, {
        headers: {
            Authorization: `Bearer ${storedToken.token}`,
        },
      });

      const permissionsData = response.data.message.data.permissions; 
      setPermissions(permissionsData); 
    } catch (error) {
      console.error('Error fetching access points:', error.message);
    }
  };

  useEffect(() => {
    fetchAccessPoints();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId,accessorId]);


  const downloadExcelFile = async (option, orgId,accessorId) => {
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
  

  return (
    <div className="d-flex" style={{ height: '100vh', width: '100%' }}>
      <Sidebar />
      <MDBContainer className="text-center mt-4">
        <h2>Access Point Permissions</h2>

        <hr />
        <MDBBtn  style={{height:"40px", width:"300px",marginLeft:"900px"}}color="primary" size="m" onClick={() => downloadExcelFile(4,orgId,accessorId)}>
                   
                   Generate Excel
       </MDBBtn>
       <hr/>
        {permissions.length > 0 && (
          <MDBTable style={{ width: '100%', fontSize: '17px', marginRight: '0px' }}>
            <MDBTableHead>
              <tr>
                <th>Accessor ID</th>
                <th>Mobile</th>
                <th>Card</th>
                <th>Fingerprint</th>
                <th>Face</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {permissions.map((permission, index) => (
                <tr key={index}>
                  <td>{permission.accessorId}</td>
                  <td>{permission.mobile.enabled ? 'Enabled' : 'Disabled'}</td>
                  <td>{permission.card.enabled ? 'Enabled' : 'Disabled'}</td>
                  <td>{permission.fingerprint.enabled ? 'Enabled' : 'Disabled'}</td>
                  <td>{permission.face.enabled ? 'Enabled' : 'Disabled'}</td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        )}
      </MDBContainer>
    </div>
  );
};

export default AccessPointPermi;
