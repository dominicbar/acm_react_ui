/* eslint-disable react/prop-types */
import  { useState, useEffect } from 'react';
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
  MDBCheckbox,
} from 'mdb-react-ui-kit';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function UpdatePermissionsModal({displayModal,onClose,accessorId}) {

  const { id } = useParams();
  const [orgId] = useState(parseInt(id, 10))
  //const [basicModal, setBasicModal] = useState(false);
  const [accessPoints, setAccessPoints] = useState([]);
  const [accessorPermissions, setAccessorPermissions] = useState([]);

  //const toggleOpen = () => setBasicModal(!basicModal);

  const token = localStorage.getItem('token');
  console.log('token in update permissions modal', token);

 
  const storedTokenString = localStorage.getItem('token')
  const storedToken = JSON.parse(storedTokenString);

  const fetchAccessPoints = async (orgId) => {
    console.log("Value of storedToken:", storedTokenString)
    try {
      const response = await axios.get(`http://localhost:3000/${orgId}/getaccesspointofsitebyOrgId`, {
        headers: {
          Authorization: `Bearer ${storedToken.token}`
        },
      });
      const data = response.data.message.data.accessPoints;
      console.log("data from the first api displaying access points",data)
      setAccessPoints(data);
    } catch (error) {
      console.error('Error fetching access points:', error);
    }
  };

  const fetchAccessorPermissions = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/getaccessorpermi/${orgId}/${accessorId}`, {
        headers: {
          Authorization: `Bearer ${storedToken.token}`
        },
      });
      const data = response.data.message.data.permissions;
      setAccessorPermissions(data);
    } catch (error) {
      console.error('Error fetching accessor permissions:', error);
    }
  };

  useEffect(() => {

    fetchAccessPoints(orgId);
    fetchAccessorPermissions(accessorId);
  }, [orgId,accessorId]);

  const handleUpdate = async () => {
    try {
      // Separate access points into selected and unselected arrays
      const { selectedAccessPoints, unselectedAccessPoints } = accessPoints.reduce(
        (result, accessPoint) => {
          if (accessorPermissions.some(permission => permission.accessPointId === accessPoint.id)) {
            result.selectedAccessPoints.push(accessPoint.id);
          } else {
            result.unselectedAccessPoints.push(accessPoint.id);
          }
          return result;
        },
        { selectedAccessPoints: [], unselectedAccessPoints: [] }
      );
  
      // Create the request body
      const requestBody = {
        permissionsToAdd: selectedAccessPoints.map(accessPointId => ({
          accessPointId: accessPointId,
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
        })),
        permissionsToRemove: unselectedAccessPoints,
      };
  
      console.log("selected", selectedAccessPoints);
      console.log("unselected", unselectedAccessPoints);
  
      const response = await axios.patch(`http://localhost:3000/addpermisacessor/${orgId}/${accessorId}`, requestBody, {
        headers: {
          Authorization: `Bearer ${storedToken.token}`,
          'Content-Type': 'application/json',
        },
      });

      Swal.fire({
        title: "Success!",
        text: "Permissions updated Succesfully",
        icon: "success"
      });
    
      // alert("updated");
      console.log('Update successful:', response.data);
      onClose()
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };
  
  const handleCheckboxChange = (accessPointId) => {
    // Toggle the accessorPermissions array based on the checkbox state
    const updatedPermissions = accessorPermissions.some(permission => permission.accessPointId === accessPointId)
      ? accessorPermissions.filter(permission => permission.accessPointId !== accessPointId)
      : [...accessorPermissions, { accessPointId }];
    setAccessorPermissions(updatedPermissions);
  };

  return (
    <>
 
      <MDBModal  open={displayModal} toggle={onClose} size="xl" centered tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>ACCESS POINTS</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={onClose}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div>
                {accessPoints.length > 0 ? (
                  accessPoints.map((accessPoint) => (
                    <div key={accessPoint.id} className="d-flex align-items-center">

                      <MDBCheckbox
                        className='me-2'
                        checked={accessorPermissions.some(permission => permission.accessPointId === accessPoint.id)}
                        onChange={() => handleCheckboxChange(accessPoint.id)}
                      />
                      <hr/>
                    <p className="me-3">{` ${accessPoint.id}`}</p>
                    <p className="me-3">{` ${accessPoint.name}`}</p>
                       
                      <hr className='my-3'/>
                    </div>
                  ))
                ) : (
                  <p>No access points available.</p>
                )}
              </div>
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={onClose}>
                Close
              </MDBBtn>
              <MDBBtn color='primary' onClick={handleUpdate}>
                Update
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
