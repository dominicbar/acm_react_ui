import {  MDBBtn, } from 'mdb-react-ui-kit'
import axios from 'axios'

const DownloadFile = () => {
  const handleDownload = async (option) => {
    console.log("starting...");

    try {
      const response = await axios.post('http://localhost:3000/generateMessage', {
        option,
      }, {
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
    <>
        
        <MDBBtn type="submit" className="mb-4" onClick={() => handleDownload(8)}>
        Download JSON
      </MDBBtn>
    </>
  )
};

export default DownloadFile;
