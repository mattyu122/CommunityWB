import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});
export const axiosClientMultipart = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});