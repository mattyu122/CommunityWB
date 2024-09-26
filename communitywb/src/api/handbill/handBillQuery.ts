import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addHandBill, getHandBillPages } from './handbillApi';

export const useHandbillPagesQuery = (page = 0, size = 10) => {
    return useQuery({
        queryKey: ['handbillPages', page],
        queryFn: () => getHandBillPages(page, size),
        placeholderData: keepPreviousData, // prevent UI flickering(state jumping between loading and done loading)
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