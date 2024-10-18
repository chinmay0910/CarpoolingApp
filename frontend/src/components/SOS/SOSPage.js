import { React, useState, useEffect, useRef } from 'react';
import { Button, Col, Container, Row, Alert } from 'react-bootstrap';
import { GoogleMap, Marker } from '@react-google-maps/api';
import Geocode from "react-geocode";
import Cookies from 'js-cookie';

Geocode.setApiKey(process.env.REACT_APP_MAPS_API_KEY);

const mapContainerStyle = {
  height: "50vh",
  width: "100%",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const center = {
  lat: 43.473078230478336,
  lng: -80.54225947407059, // Default center; can be updated to the user's location
};

export default function SOSPage() {
  const [mapCoords, setMapCoords] = useState(center);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null); // State to hold the recorded audio blob
  const mediaRecorderRef = useRef(null); // Ref to hold media recorder instance
  const mapRef = useRef(); // Define mapRef to hold the Google Map instance

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  // Fetch user's current location and address
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setMapCoords({ lat: latitude, lng: longitude });
          getAddressFromCoords(latitude, longitude);
        },
        () => {
          setError('Unable to retrieve your location.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  // Convert coordinates to address
  const getAddressFromCoords = (lat, lng) => {
    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        const location = response.results[0].formatted_address;
        setAddress(location);
      },
      (err) => {
        console.error(err);
        setError('Error fetching address from coordinates.');
      }
    );
  };

  const handleSOS = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('location', address);
      formData.append('coords', JSON.stringify(mapCoords));
      formData.append('audio', recordedBlob);
      // Send SOS request to your server or handle it as needed
      const response = await fetch(`${process.env.REACT_APP_END_POINT}/sos`, {
        method: 'POST',
        headers: {
          'Coookie': Cookies.get('tokken')
        },
        body: formData,
      });
      if (response.ok) {
        alert('SOS alert sent successfully!');
      } else {
        alert('Failed to send SOS alert.');
      }
    } catch (error) {
      console.error('Error sending SOS:', error);
      alert('An error occurred while sending SOS.');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert blob to base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Start recording audio
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      setRecordedBlob(event.data); // Store the recorded audio blob
    };

    mediaRecorderRef.current.start();

    // Stop recording after 20 seconds
    setTimeout(async () => {
      mediaRecorderRef.current.stop();
      await new Promise(resolve => mediaRecorderRef.current.onstop = resolve);
      await handleSOS(); 
    }, 10000);
  };

  useEffect(() => {
    getUserLocation(); // Get the user's location on component mount
    startRecording(); // Start recording on component mount
  }, []);

  return (
    <Container fluid>
      {error && <Alert variant="danger">{error}</Alert>}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={mapCoords}
        options={options}
        onLoad={onMapLoad}
      >
        <Marker position={mapCoords} />
      </GoogleMap>
      <Row className="mt-3">
        <Col>
          <h3>Your Location:</h3>
          <p>{address || 'Fetching address...'}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="danger" onClick={handleSOS} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send SOS'}
          </Button>
        </Col>
      </Row>
      {recordedBlob && (
        <Row className="mt-3">
          <Col>
            <h4>Recorded Audio:</h4>
            <audio controls>
              <source src={URL.createObjectURL(recordedBlob)} type="audio/webm" />
              Your browser does not support the audio element.
            </audio>
          </Col>
        </Row>
      )}
    </Container>
  );
}
