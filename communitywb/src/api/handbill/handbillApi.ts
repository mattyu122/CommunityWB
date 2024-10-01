import { axiosClient, axiosClientMultipart } from '../axiosClient';

interface HandbillPagesQueryParams {
    lat: number;
    lng: number;
    radius: number;
    page?: number;
    size?: number;
}
export const getHandBillPages = async ({ lat, lng, radius, page, size }: HandbillPagesQueryParams) => {
    console.log('fetching handbill page', page);
    const response = await axiosClient.get('/whiteboard/handbillpage', {
        params: { page, size, lat, lng, radius }
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