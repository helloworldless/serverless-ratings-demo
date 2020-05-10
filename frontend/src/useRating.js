import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

const url = 'https://zdqthrrof0.execute-api.us-east-1.amazonaws.com/dev/beer/rating';

const getRating = async (_, beer) => {
    const { data } = await axios.get(`${url}?beer=${beer}`);
    return data;
};

const saveRating = async (rating) => {
    const { data } = await axios.post(url, rating);
    return data;
};

export function useRating(beer) {
    return useQuery(['rating', beer], getRating, {
        retry: 1,
    });
}

export function usePersistRating() {
    return useMutation(saveRating, {
        retry: 1,
    });
}
