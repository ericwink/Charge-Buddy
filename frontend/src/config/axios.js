import axios from 'axios'

export default axios.create({
    withCredentials: true,
    baseURL: 'https://charge-buddy-api.herokuapp.com/'
    // baseURL: 'http://localhost:8080/'
})
