// ✨ implement axiosWithAuth
import axios from 'axios'

export const axiosWithAuth = () => {
    const token = localStorage.getItem('theToken')

    return axios.create({
        baseUrl: 'http://localhost:9000/api/',
        headers: {
            authorization: token
        }
    })
}

export default axiosWithAuth
