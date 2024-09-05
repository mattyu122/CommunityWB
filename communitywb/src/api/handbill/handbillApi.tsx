import axiosClient from '../axiosClient';

export const getHandBillPages = async (page = 0, size = 10) => {
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