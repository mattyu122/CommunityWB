import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LatLng } from 'leaflet';
import { addHandBill, getHandBillPages } from './handbillApi';

interface HandbillPagesQueryParams {
    location: LatLng;
    radius: number;
    page?: number;
    size?: number;
    enabled?: boolean;
}

export const useHandbillPagesQuery = ({ location, radius, page = 0, size = 20, enabled=true }: HandbillPagesQueryParams) => {

    return useQuery({
        queryKey: ['handbillPages', page, location.lat, location.lng, radius],
        queryFn: () => getHandBillPages({ location, radius, page, size }),
        placeholderData: keepPreviousData, // prevent UI flickering(state jumping between loading and done loading)
        enabled: enabled,
        // staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}

export const useAddHandBillMutation = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => addHandBill(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['handbillPages']});
        },
        onError: (error)=> {
            console.log('error adding handbill', error);
        }
    })
}