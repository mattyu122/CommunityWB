import { LatLng } from 'leaflet';
import { GetHandBillPageDto } from '../../dto/handbill/getHandBillPageDto';
import { axiosClient, axiosClientMultipart } from '../axiosClient';
interface HandbillPagesQueryParams {
    location: LatLng;
    radius: number;
    page?: number;
    size?: number;
}
export const getHandBillPages = async ({
    location,
    radius,
    page = 0, // Provide defaults if needed
    size = 10,
}: HandbillPagesQueryParams) => {
    try {
        // Ensure location has valid lat and lng values
        if (!location?.lat || !location?.lng) {
            throw new Error('Invalid location coordinates provided.');
        }

        const { data } = await axiosClient.get('/handbill/handbillpage', {
            params: {
                page,
                size,
                lat: location.lat,
                lng: location.lng,
                radius,
            },
        });
        console.log('Handbill pages fetched:', data);
        const handBillPage :GetHandBillPageDto = data;
        return handBillPage;
    } catch (error) {
        console.error('Error fetching handbill pages:', error);
        throw new Error('Failed to fetch handbill pages.');
    }
};

export const addHandBill = async (formData: FormData) => {
    const response = await axiosClientMultipart.post('/handbill/addHandBill', formData);
    return response.data;
}