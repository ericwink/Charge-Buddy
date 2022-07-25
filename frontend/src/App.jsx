import './App.css';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";
import EVSearch from './components/EVSearch'
import StationCard from './components/StationCard'
import mapStyles from "./mapStyles"
import AccountHandle from './components/AccountHandle';
import { UserContext } from './Context/UserContext';

const mapContainerStyle = { width: '100vw', height: '100vh' }
const center = { lat: 39.76453, lng: -105.1353038 }
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControll: true
}

function App() {
  const [selectedStation, setSelectedStation] = useState(null)
  const [fuelStations, updateFuelStations] = useState([])
  const [loggedInUser, setloggedInUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [clickFav, setClickFav] = useState(false)


  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY
  })

  //define the map in the useRef value
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map
  }, [])

  //pan-to a specific location within the map
  function panToUserLocation(userLat, userLng) {
    mapRef.current.panTo({ lat: userLat, lng: userLng })
  }

  //need to fix the placement of this at some point...
  if (loadError) return "Error loading map"
  if (!isLoaded) return "Loading..."
  return (
    <div>
      <UserContext.Provider value={{ loggedInUser, setloggedInUser, favorites, setFavorites, clickFav, setClickFav }}>
        <nav className='d-flex justify-content-between navbuddy'>
          <EVSearch
            updateFuelStations={updateFuelStations}
            panToUserLocation={panToUserLocation}
          />
          <h1 className='bigtitle'><i class="fa-solid fa-car-side"></i> ChargeBuddy</h1>
          <AccountHandle
            updateFuelStations={updateFuelStations}
            panToUserLocation={panToUserLocation} />
        </nav>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={center}
          options={options}
          onLoad={onMapLoad}
          onClick={() => setSelectedStation(null)}
        >
          {
            fuelStations.map((station, index) => {
              if (station.access_code === 'public') {
                return (
                  <Marker
                    key={index}
                    position={{ lat: station.latitude, lng: station.longitude }}
                    label={index}
                    onClick={() => { { setSelectedStation(station) } }}
                  />
                )
              }
            })
          }
          {selectedStation ? <InfoWindow
            position={{ lat: selectedStation.latitude, lng: selectedStation.longitude }}
            onCloseClick={() => { setSelectedStation(null) }}
          >
            <div>
              <StationCard stationInfo={selectedStation} />
            </div>

          </InfoWindow> : null}
        </GoogleMap>
      </UserContext.Provider>
    </div>)

}
export default App;

//To Visit
//https://afdc.energy.gov/fuels/electricity_locations.html#/find/nearest?fuel=ELEC
//https://www.plugshare.com/location/369243