import { useState } from 'react'
import axios from 'axios';
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

//assign and unassign card component

// eslint-disable-next-line react/prop-types
export default function AssignCardModal({orgId,accessorId}) {
  const [basicModal, setBasicModal] = useState(false);
  const [credentialId, setCredentialId] = useState('');

  const token = localStorage.getItem('token');
  console.log("token in aSSIG CARD MODal", token);

  const toggleOpen = () => setBasicModal(!basicModal);

  const handleSaveChanges = async () => {
    const storedTokenString = localStorage.getItem('token');
    console.log('Value of storedToken:', storedTokenString);
    console.log('fetching data');
    try {
      const storedToken = JSON.parse(storedTokenString);
      console.log("credentialid", credentialId);
      const response = await axios.patch(
        `http://localhost:3000/AssignCard/${orgId}/${accessorId}`,
        {
          credentialId: parseInt(credentialId, 10),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken.token}`,
          },
        }
      );
  
      if (response.status === 200) {
        console.log('successful');
        alert('Card assigned successfully');
      } else {
        console.error('failed');
      
      }
    } catch (error) {
      console.error('Error during API request:', error);
      alert('Error assigining card');
    }
  
    toggleOpen();
  };
  
  const deleteCard = async () => {
    const storedTokenString = localStorage.getItem('token');
    console.log('Value of storedToken:', storedTokenString);
    console.log('fetching data');
    try {
      const storedToken = JSON.parse(storedTokenString);
  
      const response = await axios.delete(
        `http://localhost:3000/UnAssignCard/${orgId}/${accessorId}`,
      
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken.token}`,
          },
        }
      );
  
      if (response.status === 200) {
        console.log('successful');
        alert('Card unassigned successfully');
      } else {
        console.error('failed');
      
      }
    } catch (error) {
      console.error('Error during API request:', error);
      alert('Error unassigining card');
    }
  

  };
  
  
  

  return (
    <>
      <MDBBtn style={{marginLeft:"20px", height:"40px", width:"150px"}}  onClick={toggleOpen}>ASSIGN CARD</MDBBtn>
      <MDBBtn style={{marginLeft:"10px", height:"40px", width:"150px"}} onClick={deleteCard }>UNASSIGN CARD</MDBBtn>
      <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>ASSIGN CARD</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>

            <MDBModalBody>
              <form>
                <div className="mb-5">
                  <label htmlFor="provider" className="form-label">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Credential ID"
                    placeholder="Credential ID"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                  />
                </div>
              </form>
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleSaveChanges}>Save changes</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
