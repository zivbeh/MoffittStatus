import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet"
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
// import L from "leaflet";
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
// import ProgressBarCircle from "../basic/ProgressBarCircle/ProgressBarCircle";
import L from "leaflet";

export default function MapComponent() {
  //const url = 'https://api.openstreetmap.org/api/0.6/map?bbox=-0.489,-0.123,0.236,51.569';
  //http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png
  //https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
  // const icon = L.divIcon({
  //   className: 'custom-icon',
  //   html: "<ProgressBarCircle circleMax={20} duration={2}></ProgressBarCircle>", // Extract React component HTML
  //   iconSize: [40, 40], // Set the size
  //   iconAnchor: [20, 40], // Adjust anchor position
  // });

  return ( 
    <>
    <MapContainer className='w-full h-screen' center={[37.871682, -122.258107]} zoom={17} scrollWheelZoom={true} >
      <TileLayer attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'>
      </TileLayer>
      <Marker position={[37.872638, -122.260839]}>
          <Popup>
            A custom location! <br /> Latitude: {37.871682}, Longitude: {-122.258107}
            
          </Popup>
          {/* <ProgressBarCircle circleMax={40} duration={2}></ProgressBarCircle> */}

          

        </Marker>
        <Marker position={[37.872276, -122.259546]}>
          <Popup>
            A custom location! <br /> Latitude: {37.872276}, Longitude: {-122.259546}
          </Popup>
        </Marker>     
    </MapContainer>
    
      </>
  )
}
