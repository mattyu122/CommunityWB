import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getHandBillPages } from './handbillApi';

export const useHandbillPagesQuery = (page = 0, size = 10) => {
    return useQuery({
        queryKey: ['handbillPages', page],
        queryFn: () => getHandBillPages(page, size),
        placeholderData: keepPreviousData, // prevent UI flickering(state jumping between loading and done loading)
    });
}