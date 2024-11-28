import { keepPreviousData, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { LatLng } from 'leaflet';
import { addHandBill, getHandBillPages } from './handbillApi';


interface HandbillPagesInfiniteQueryParams {
    location: LatLng | null;
    radius: number;
    size?: number;
    enabled?: boolean | null;
}


export const useHandbillPagesInfiniteQuery = ({ location, radius, size = 10, enabled = true}: HandbillPagesInfiniteQueryParams) => {
    return useInfiniteQuery({
        queryKey: ['handbillPages'],
        queryFn: ({ pageParam = 0 }) => {
            if (!location) {
                return Promise.reject(new Error('Location is null'));
            }
            return getHandBillPages({ location, radius, page: pageParam, size });
        },
        getNextPageParam: (getHandBillPageDto) => {
            if (
                getHandBillPageDto &&
                getHandBillPageDto.currentPage < getHandBillPageDto.totalPages - 1
            ) {

                return getHandBillPageDto.currentPage + 1;
            } else {
                return undefined;
            }
        },
        initialPageParam: 0,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        placeholderData: keepPreviousData,
        enabled: enabled ?? true, // Ensure 'enabled' is a boolean
    });
}

export const useAddHandBillMutation = () =>{
    return useMutation({
        mutationFn: (formData: FormData) => addHandBill(formData),
        onSuccess: () => {
        },
        onError: (error)=> {
        }
    })
}