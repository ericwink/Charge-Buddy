import { useState } from "react"
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import axios from "axios";
//react-bootstrap
import Offcanvas from 'react-bootstrap/Offcanvas';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

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
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


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

    //API call to retrieve EV Charging Station loction data based on address search
    async function evDataCall(address) {
        try {
            const results = await axios.post('/evapi/address', {
                address: address,
                miles: miles,
            })
            updateFuelStations(results.data.fuel_stations)
        } catch (error) {
            console.log(error)
        }
    }

    //API call to retrieve EV Charging Station loction data based on user current geoData
    async function evByCurrentLocation() {
        try {
            const results = await axios.post('/evapi/latlng', {
                userLatitude: userLatitude,
                userLongitude: userLongitude,
                miles: miles
            })
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

    //validate available information and determine which search route to use with API
    async function handleSearch(e) {
        e.preventDefault()
        //required field combos as determeind by API
        if ((street && city && state && zipCode) || (street && city && state) || (street && zipCode) || (zipCode) || (city && state)) {
            addressFormat() //formats the address and then searches EV Stations by address
            handleClose()
        } else if (userLatitude) {
            evByCurrentLocation()
            handleClose()
        } else {
            alert('Please fill in addiitonal search criteria')
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
        alert(`ERROR(${err.code}): ${err.message}`);
        setLoadingLocation(false)
    }

    return (
        <div className="EVSearch">
            <Button variant="primary" onClick={handleShow}><i class="fa-solid fa-magnifying-glass"></i></Button>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>EV Charging Station Search</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <p>Enter a location (not all fields required), and distance to populate a list of EV Charging Stations</p>

                    <Form onSubmit={handleSearch} className='dropshadow'>
                        <FloatingLabel controlId="floatingStreet" label='Street Address' className='mb-3'>
                            <Form.Control
                                type='text'
                                placeholder='Street Address'
                                value={street}
                                onChange={(e) => { setStreet(e.target.value) }}
                                disabled={addyLock}
                            />
                        </FloatingLabel>

                        <FloatingLabel controlId="floatingCity" label='City' className='mb-3'>
                            <Form.Control
                                type='text'
                                placeholder='City'
                                value={city}
                                onChange={(e) => { setCity(e.target.value) }}
                                disabled={addyLock}
                            />
                        </FloatingLabel>


                        <FloatingLabel controlId="floatingState" label='State' className='mb-3'>
                            <Form.Control
                                type='text'
                                placeholder='State'
                                value={state}
                                onChange={(e) => { setState(e.target.value) }}
                                disabled={addyLock}
                            />
                        </FloatingLabel>

                        <FloatingLabel controlId="floatingZip" label='Zip Code' className='mb-3'>
                            <Form.Control
                                type='text'
                                placeholder='Zip Code'
                                value={zipCode}
                                onChange={(e) => { setZipCode(e.target.value) }}
                                disabled={addyLock}
                            />
                        </FloatingLabel>

                        {/* lat lng fields, invisible by default */}
                        {visible ? <div>
                            <FloatingLabel controlId="floatingZip" label='Latitude' className='mb-3'>
                                <Form.Control
                                    type='text'
                                    placeholder='Latitude'
                                    value={userLatitude}
                                    onChange={(e) => { setUserLatitude(e.target.value) }}
                                    disabled={addyLock}
                                />
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingZip" label='Longitude' className='mb-3'>
                                <Form.Control
                                    type='text'
                                    placeholder='Longitude'
                                    value={userLongitude}
                                    onChange={(e) => { setUserLongitude(e.target.value) }}
                                    disabled={addyLock}
                                />
                            </FloatingLabel>

                        </div> : null}

                        {/* radio select for miles */}
                        <Form.Check name='miles' inline type='radio' label='10 Miles' id='10miles' onClick={() => { setMiles(10) }} defaultChecked />
                        <Form.Check name='miles' inline type='radio' label='25 Miles' id='25miles' onClick={() => { setMiles(25) }} />
                        <Form.Check name='miles' inline type='radio' label='50 Miles' id='50miles' onClick={() => { setMiles(50) }} />

                        {/* button selections */}
                        <div className="d-grid gap-2">
                            <Button variant="outline-primary" size='lg' disabled={loadingLocation} type='submit'>Search</Button>
                            <Button variant="outline-primary" size='lg' disabled={loadingLocation} onClick={clearSearch}>Clear</Button>
                            <Button variant="outline-primary" size='lg' disabled={loadingLocation} onClick={() => { navigator.geolocation.getCurrentPosition(success, error, options); setLoadingLocation(true) }}>
                                {!loadingLocation ? 'Locate Me!' :
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                }
                            </Button>
                        </div>
                    </Form>
                    {visible ? <p>Click Clear to Search By Address</p> : null}
                </Offcanvas.Body>
            </Offcanvas>

        </div>
    )
}