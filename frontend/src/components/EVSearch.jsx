import { useState } from "react"
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import axios from "axios";
import Input from "./Input";

export default function EVSearch({ updateFuelStations, panToUserLocation }) {
    const [zipCode, setZipCode] = useState('')
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [miles, setMiles] = useState('10')
    const [userLatitude, setUserLatitude] = useState('')
    const [userLongitude, setUserLongitude] = useState('')
    const [visible, setVisible] = useState(false)
    const [addyLock, setAddyLock] = useState(false)
    const [loadingLocation, setLoadingLocation] = useState(false)

    //clear all data in search boxes
    function clearSearch() {
        setZipCode('')
        setCity('')
        setState('')
        setStreet('')
        setMiles('10')
        setUserLatitude('')
        setUserLongitude('')
        setVisible(false)
        setAddyLock(false)
    }

    function addressFormat() {
        const phaseOne = [street, city, state, zipCode].filter(Boolean).join("+");
        const phaseTwo = phaseOne.replace(/\s/g, '+')
        evDataCall(phaseTwo)
        userSpot()
    }

    //https://developer.nrel.gov/docs/transportation/alt-fuel-stations-v1/all/

    //API call to retrieve EV Charging Station loction data based on address search
    async function evDataCall(address) {
        try {
            const fullLink = `https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=${process.env.REACT_APP_EV_API_KEY}&location=${address}&radius=${miles}&fuel_type=ELEC&limit=200`
            const results = await axios.get(fullLink)
            console.log(results)
            updateFuelStations(results.data.fuel_stations)
        } catch (error) {
            console.log(error)
        }
    }

    //API call to retrieve EV Charging Station loction data based on user current geoData
    async function evByCurrentLocation() {
        try {
            const fullLink = `https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=${process.env.REACT_APP_EV_API_KEY}&latitude=${userLatitude}&longitude=${userLongitude}&radius=${miles}&fuel_type=ELEC&limit=200`
            const results = await axios.get(fullLink)
            console.log(results)
            updateFuelStations(results.data.fuel_stations)
            panToUserLocation(userLatitude, userLongitude)
        } catch (error) {
            console.log(error)
        }
    }

    //finds lat lng by address searched and pans to that location
    async function userSpot() {
        const address = `${street} ${city} ${state} ${zipCode}`
        await getGeocode({ address: address }).then((results) => {
            const { lat, lng } = getLatLng(results[0]);
            panToUserLocation(lat, lng)
        });
    }

    async function handleSearch() {
        if (street) {
            addressFormat() //formats the address and then searches EV Stations by address
        } else if (userLatitude) {
            evByCurrentLocation()
        } else {
            alert('empty search criteria')
        }

    }

    //options for geoLocation -- get user locaiton
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    //success function for getting user location. Filles in lat lng and shows fields
    async function success(pos) {
        const crd = pos.coords;
        setUserLatitude(crd.latitude)
        setUserLongitude(crd.longitude)
        setZipCode('')
        setCity('')
        setState('')
        setStreet('')
        setVisible(true)
        setAddyLock(true)
        setLoadingLocation(false)
    }

    //error function for getting user locaiton.
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    return (
        <div className="EVSearch">
            <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSearch" aria-controls="offcanvasSearch">
                Search
            </button>

            <div className="offcanvas offcanvas-start" tabindex="-1" id="offcanvasSearch" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">EV Charging Station Search</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div>
                        Enter a location (not all fields required), and distance to populate a list of EV Charging Stations
                    </div>
                    <Input
                        onChange={(e) => { setStreet(e.target.value) }}
                        value={street}
                        type='text'
                        placeholder='Street Address'
                        label='Street Address'
                        disabled={addyLock}
                    />
                    <Input
                        onChange={(e) => { setCity(e.target.value) }}
                        value={city}
                        type='text'
                        placeholder='City'
                        label='City'
                        disabled={addyLock}
                    />
                    <Input
                        onChange={(e) => { setState(e.target.value) }}
                        value={state}
                        type='text'
                        placeholder='State'
                        label='State'
                        disabled={addyLock}
                    />
                    <Input
                        onChange={(e) => { setZipCode(e.target.value) }}
                        value={zipCode}
                        type='text'
                        placeholder='Zip Code'
                        label='Zip Code'
                        disabled={addyLock}
                    />

                    {/* lat lng fields, invisible by default */}
                    {visible ? <div>
                        <Input
                            onChange={(e) => { setUserLatitude(e.target.value) }}
                            value={userLatitude}
                            type='text'
                            placeholder='Latitude'
                            label='Latitude'
                            disabled={addyLock}
                        />
                        <Input
                            onChange={(e) => { setUserLongitude(e.target.value) }}
                            value={userLongitude}
                            type='text'
                            placeholder='Longitude'
                            label='Longitude'
                            disabled={addyLock}
                        />
                    </div> : null}

                    {/* radio select for miles */}
                    <div className="form-check form-check-inline">
                        <input onClick={() => { setMiles(10) }} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" defaultChecked />
                        <label className="form-check-label" for="inlineRadio1">10 Miles</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input onClick={() => { setMiles(25) }} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                        <label className="form-check-label" for="inlineRadio2">25 Miles</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input onClick={() => { setMiles(50) }} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" />
                        <label className="form-check-label" for="inlineRadio3">50 miles</label>
                    </div>

                    {/* button selections */}
                    <button className="w-100 py-2 mb-2 btn btn-outline-primary rounded-3" onClick={handleSearch} data-bs-toggle="offcanvas" data-bs-target="#offcanvas">Search</button>
                    <button className="w-100 py-2 mb-2 btn btn-outline-primary rounded-3" onClick={clearSearch}>Clear</button>
                    <button className="w-100 py-2 mb-2 btn btn-outline-primary rounded-3" onClick={() => { navigator.geolocation.getCurrentPosition(success, error, options); setLoadingLocation(true) }}>
                        {loadingLocation ? <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div> : 'Locate Me!'}</button>
                    {visible ? <p>Click Clear to Search By Address</p> : null}
                </div>
            </div>
        </div>
    )
}