import { UserConfirmContactDto } from '../../dto/userAccount/UserConfirmContactDto';
import { UserSignInDto } from '../../dto/userAccount/UserSignInDto';
import { UserSignUpDto } from '../../dto/userAccount/userSignUpDto';
import { axiosClient } from '../axios/axiosClient';


export const signUpUser = async (dto: UserSignUpDto) => {
    const response = await axiosClient.post('/user/auth/signUp', dto);
    return response.data;
};

export const signInUser = async (dto: UserSignInDto) => {
    const response = await axiosClient.post('/user/auth/signIn', dto);
    return response.data;
};

export const confirmContact = async (dto: UserConfirmContactDto) => {
    const response = await axiosClient.post('/user/auth/confirmContact', dto);
    return response.data;
}