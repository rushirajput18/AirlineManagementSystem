import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';

type Airport = {
  code: string;
  name: string;
  lat: number;
  lng: number;
};

type FlightPlan = {
  flightNumber: string;
  origin: Airport;
  destination: Airport;
};

const FlightMap = ({ flights }: { flights: FlightPlan[] }) => {
  const center: [number, number] = [20.5937, 78.9629];
  const airportIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
  });

  return (
    <MapContainer center={center} zoom={4} style={{
        margin: '2rem auto',
        height: '500px',
        width: '90%',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #ddd',
    }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {flights.map((flight, idx) => (
        <Polyline
            key={idx}
            positions={[
                [flight.origin.lat, flight.origin.lng],
                [flight.destination.lat, flight.destination.lng],
            ]}
            pathOptions={{
                color: 'dodgerblue',
                weight: 3,
                opacity: 0.7,
                dashArray: '6',
            }}
        />
      ))}

      {flights.map((flight, idx) => (
        <>
          <Marker
            key={`origin-${idx}`}
            position={[flight.origin.lat, flight.origin.lng]}
            icon={airportIcon}
            >
            <Popup>
                <strong>{flight.origin.name}</strong><br />
                Code: {flight.origin.code}
            </Popup>
          </Marker>
          <Marker
            key={`dest-${idx}`}
            position={[flight.destination.lat, flight.destination.lng]}
          />
        </>
      ))}
    </MapContainer>
  );
};

export default FlightMap;
