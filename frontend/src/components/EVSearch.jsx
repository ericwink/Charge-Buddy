import { useState } from "react"
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import axios from '../config/axios'
//react-bootstrap
import Offcanvas from 'react-bootstrap/Offcanvas';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export default function EVSearch({ updateFuelStations, panToUserLocation }) {
    const [miles, setMiles] = useState('10')
    const [userLatitude, setUserLatitude] = useState('')
    const [userLongitude, setUserLongitude] = useState('')
    const [visible, setVisible] = useState(false)
    const [addyLock, setAddyLock] = useState(false)
    const [loadingLocation, setLoadingLocation] = useState(false)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [values, setValues] = useState({
        zipCode: '',
        street: '',
        city: '',
        state: '',
    })

    function handleFormChange(e) {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    //clear all data in search boxes
    function clearSearch() {
        setMiles('10')
        setValues({
            zipCode: '',
            street: '',
            city: '',
            state: '',
        })
        setUserLatitude('')
        setUserLongitude('')
        setVisible(false)
        setAddyLock(false)
    }

    function addressFormat() {
        const phaseOne = [values.street, values.city, values.state, values.zipCode].filter(Boolean).join("+");
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
        const address = `${values.street} ${values.city} ${values.state} ${values.zipCode}`
        await getGeocode({ address: address }).then((results) => {
            const { lat, lng } = getLatLng(results[0]);
            panToUserLocation(lat, lng)
        });
    }

    //validate available information and determine which search route to use with API
    async function handleSearch(e) {
        e.preventDefault()
        //required field combos as determeind by API
        if ((values.street && values.city && values.state && values.zipCode) || (values.street && values.city && values.state) || (values.street && values.zipCode) || (values.zipCode) || (values.city && values.state)) {
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
        setValues({
            zipCode: '',
            street: '',
            city: '',
            state: '',
        })
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
                                value={values.street}
                                name='street'
                                // onChange={(e) => { setStreet(e.target.value) }}
                                onChange={(e) => handleFormChange(e)}
                                disabled={addyLock}
                            />
                        </FloatingLabel>

                        <FloatingLabel controlId="floatingCity" label='City' className='mb-3'>
                            <Form.Control
                                type='text'
                                placeholder='City'
                                name='city'
                                value={values.city}
                                // onChange={(e) => { setCity(e.target.value) }}
                                onChange={(e) => handleFormChange(e)}
                                disabled={addyLock}
                            />
                        </FloatingLabel>


                        <FloatingLabel controlId="floatingState" label='State' className='mb-3'>
                            <Form.Control
                                type='text'
                                placeholder='State'
                                name='state'
                                value={values.state}
                                // onChange={(e) => { setState(e.target.value) }}
                                onChange={(e) => handleFormChange(e)}
                                disabled={addyLock}
                            />
                        </FloatingLabel>

                        <FloatingLabel controlId="floatingZip" label='Zip Code' className='mb-3'>
                            <Form.Control
                                type='text'
                                placeholder='Zip Code'
                                name='zipCode'
                                value={values.zipCode}
                                // onChange={(e) => { setZipCode(e.target.value) }}
                                onChange={(e) => handleFormChange(e)}
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
                                    // onChange={(e) => { setUserLatitude(e.target.value) }}
                                    onChange={(e) => handleFormChange(e)}
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