// src/components/SaveToDriveButton.jsx
import { useState, useEffect, useCallback } from 'react';
import { gapi } from 'gapi-script';
import { FaGoogleDrive } from 'react-icons/fa';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

function SaveToDriveButton({ getFileData }) {
  const [isGapiInitialized, setIsGapiInitialized] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fungsi untuk update status login
  const updateSigninStatus = useCallback((signedIn) => {
    setIsSignedIn(signedIn);
  }, []);

  // Inisialisasi Google API Client
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        setIsGapiInitialized(true);
        // Langsung set status login awal & tambahkan listener
        updateSigninStatus(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(updateSigninStatus);
      }).catch(error => {
        console.error("Error initializing GAPI client", error);
      });
    };
    gapi.load('client:auth2', initClient);
  }, [updateSigninStatus]);

  const handleAuthClick = () => {
    if (gapi.auth2.getAuthInstance()) {
      gapi.auth2.getAuthInstance().signIn();
    } else {
      console.error("Google Auth instance not initialized yet.");
    }
  };

  const uploadFile = (fileData) => {
    setIsSaving(true);
    // ... (Logika uploadFile sama persis seperti kode sebelumnya, tidak ada perubahan)
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const close_delim = `\r\n--${boundary}--`;

    const metadata = { name: fileData.fileName, mimeType: fileData.blob.type };

    const reader = new FileReader();
    reader.readAsBinaryString(fileData.blob);
    reader.onload = () => {
      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        `Content-Type: ${fileData.blob.type}\r\n\r\n` +
        reader.result +
        close_delim;
      
      const request = gapi.client.request({
        path: 'https://www.googleapis.com/upload/drive/v3/files',
        method: 'POST',
        params: { uploadType: 'multipart' },
        headers: { 'Content-Type': `multipart/mixed; boundary="${boundary}"` },
        body: multipartRequestBody,
      });

      request.execute((file, err) => {
        setIsSaving(false);
        if (err) {
          alert('Gagal menyimpan ke Google Drive: ' + err.message);
          console.error(err);
        } else {
          alert(`File "${file.name}" berhasil disimpan di Google Drive Anda!`);
        }
      });
    };
  };

  const handleSaveClick = () => {
    const fileData = getFileData();
    if (fileData) {
      uploadFile(fileData);
    }
  };

  if (!isGapiInitialized) {
    return (
      <button className="bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center" disabled>
        <FaGoogleDrive className="mr-2" />
        Inisialisasi...
      </button>
    );
  }

  if (!isSignedIn) {
    return (
      <button onClick={handleAuthClick} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
        <FaGoogleDrive className="mr-2" />
        Login dengan Google
      </button>
    );
  }

  return (
    <button onClick={handleSaveClick} disabled={isSaving} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center disabled:bg-blue-300">
      <FaGoogleDrive className="mr-2" />
      {isSaving ? 'Menyimpan...' : 'Simpan ke Google Drive'}
    </button>
  );
}

export default SaveToDriveButton;