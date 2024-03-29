

import { MDBContainer, MDBInput,  MDBBtn,MDBRow, MDBCol } from 'mdb-react-ui-kit'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';
const LoginForm = () => {
  const [client_id, setClientId] = useState('')
  const [client_secret, setClientSecret] = useState('')
  const [token, setToken] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
  
    console.log('attempting login ....');
  
    // Basic validation
    if (client_id.trim() === '' || client_secret.trim() === '') {
      alert('Please enter both client id and client secret');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/genToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id,
          client_secret,
          grant_type: 'urn:ietf:params:oauth:grant-type:client-credentials',
        }),
      });
  
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
  
      const data = await response.json();
      console.log('API Response:', data);
      console.log('Access Token:', data.message);
  
      // Save the token to localStorage
      localStorage.setItem('token', JSON.stringify(data.message));
  
      console.log("token generated", localStorage);
  
      // Update the token state
      setToken(data.message);
  
      // Navigate to Page component with token
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
        icon: "success",
        title: "Logged in successfully"
      });
      navigate('/page');
      //navigate(`/organization/${data.organizationId}/${data.organizationName}`, { state: { token: data.message } });
      console.log('data sent', data.message);
    } catch (error) {
      // alert('Login failed. Please check your credentials.');
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
        title: "Login Failed"
      });
      console.error(error);
    }
  };
  

  useEffect(() => {
    console.log('Token in useEffect:', token)
  }, [token])


  const handleDownload = async (option) => {
    console.log("starting...");
    const storedToken = JSON.parse(localStorage.getItem('token'))

    try {
      const response = await axios.post('http://localhost:3000/generateMessage', {
        option,
        
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



  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
    <MDBContainer>
      <MDBRow className="justify-content-center">
        <MDBCol md="6" className="mb-4">
          <form onSubmit={handleLogin} className="p-4 shadow-2-strong border rounded">
            <h2 className="text-center mb-6">Login</h2>

            <MDBInput label='Client Id' id='clientId' type='text' value={client_id} onChange={(e) => setClientId(e.target.value)} className="mb-4" />
            <MDBInput label='Client Secret' id='clientSecret' type='password' value={client_secret} onChange={(e) => setClientSecret(e.target.value)} className="mb-3" />

            <MDBBtn type="submit" className="w-100 mt-3">
              Login
            </MDBBtn>
          </form>
        </MDBCol>
      </MDBRow>

      <MDBRow className="justify-content-center">
        <MDBCol md="6" className="mb-4">
          <MDBBtn type="submit" onClick={() => handleDownload(14)} className="w-100">
            Generate Postman Collection
          </MDBBtn>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  </div>
  );
};

export default LoginForm;
