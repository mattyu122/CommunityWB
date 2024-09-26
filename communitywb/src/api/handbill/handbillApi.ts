import { axiosClient, axiosClientMultipart } from '../axiosClient';

export const getHandBillPages = async (page = 0, size = 10) => {
    console.log('fetching handbill page', page);
    const response = await axiosClient.get('/whiteboard/handbillpage', {
        params: { page, size },
    });
    return {
        handBills: response.data.handBills,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        currentPage: response.data.currentPage,
    };
}

export const addHandBill = async (formData: FormData) => {
    const response = await axiosClientMultipart.post('/whiteboard/addHandBill', formData);
    return response.data;
}