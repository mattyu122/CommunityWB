import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addHandBill, getHandBillPages } from './handbillApi';

interface HandbillPagesQueryParams {
    lat: number;
    lng: number;
    radius: number;
    page?: number;
    size?: number;
    enabled?: boolean;
}

export const useHandbillPagesQuery = ({ lat, lng, radius, page = 0, size = 20, enabled=true }: HandbillPagesQueryParams) => {
    return useQuery({
        queryKey: ['handbillPages', page, lat, lng, radius],
        queryFn: () => getHandBillPages({ lat, lng, radius, page, size }),
        placeholderData: keepPreviousData, // prevent UI flickering(state jumping between loading and done loading)
        enabled: enabled,
        // refetchOnWindowFocus: false,
        // refetchOnReconnect: false,
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