import { LatLng } from 'leaflet';
import { GetHandBillPageDto } from '../../dto/handbill/getHandBillPageDto';
import { handbillInteractionDto } from '../../dto/handbill/handbillInteractionDto';
import { HandBill } from '../../models/HandBill';
import { axiosClient, axiosClientMultipart } from '../axios/axiosClient';
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
        const handBillPage :GetHandBillPageDto = data;
        return handBillPage;
    } catch (error) {
        console.error('Error fetching handbill pages:', error);
        throw new Error('Failed to fetch handbill pages.');
    }
};

export const getHandBillById = async (id: number) => {
    try {
        const {data} = await axiosClient.get(`/handbill/${id}`);
        const handBill: HandBill = data;
        return handBill;
    } catch (error) {
        console.error('Error fetching handbill by id:', error);
        throw new Error('Failed to fetch handbill by id.');
    }
}

export const addHandBill = async (formData: FormData) => {
    try{
        const response = await axiosClientMultipart.post('/handbill/addHandBill', formData);
        return response.data;
    }catch(error){
        console.error('Error adding handbill:', error);
        throw new Error('Failed to add handbill.');
    }
}

export const handbillInteraction = async({handbillId, interactionType , userId}: handbillInteractionDto) => {
    try{
        await axiosClient.post(`/handbill/interaction`, {
            userId,
            handbillId,
            interactionType,
        });
    }catch(error){
        console.error('Error interacting with handbill:', error);
        throw new Error('Failed to interact with handbill.');
    }
}