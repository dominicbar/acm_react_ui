

import { MDBContainer, MDBInput,  MDBBtn, } from 'mdb-react-ui-kit'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loginnew = () => {
  const [client_id, setClientId] = useState('')
  const [client_secret, setClientSecret] = useState('')
  const [token, setToken] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    console.log('attempting login ....')

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
      
            // if (!response.ok) {
            //   throw new Error('Invalid credentials');
            // }
      
            const data = await response.json()
            console.log('API Response:', data)
            console.log('Access Token:', data.message)
      
            // Save the token to localStorage
            localStorage.setItem('token', JSON.stringify(data.message))
      
            console.log("token generated",localStorage)
      
            // Update the token state
            setToken(data.message)
      
            // Navigate to Page component with token
            navigate('/Postmanbutton')
            //navigate(`/organization/${data.organizationId}/${data.organizationName}`, { state: { token: data.message } });
            console.log('data sent', data.message)
          } catch (error) {
            //alert('Login failed. Please check your credentials.')
            console.error(error)
          }
        }

  useEffect(() => {
    console.log('Token in useEffect:', token)
  }, [token])

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <form onSubmit={handleLogin}>
        <MDBInput wrapperClass='mb-4'  label='Client Id' id='clientId' type='text' value={client_id} onChange={(e) => setClientId(e.target.value)} />
        <MDBInput wrapperClass='mb-4' label='Client Secret' id='clientSecret' type='password' value={client_secret} onChange={(e) => setClientSecret(e.target.value)}  />

        <MDBBtn type="submit" className="mb-4">
          Login
        </MDBBtn>
      </form>
    </MDBContainer>
  );
};

export default Loginnew;
