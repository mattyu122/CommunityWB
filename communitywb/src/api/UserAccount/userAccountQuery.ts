import { useMutation } from "@tanstack/react-query";
import { confirmContact, signInUser, signUpUser } from "./userAccountApi";
export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: (formData: any) => signUpUser(formData),
        onSuccess: () => {
            console.log('sign up success');
        },
        onError: (error) => {
            console.log('sign up error', error);
        }
    })
}

export const useSignInMutation = () => {
    return useMutation({
        mutationFn: (formData: any) => signInUser(formData),
        onSuccess: () => {
            console.log('sign in success');
        },
        onError: (error) => {
            console.log('sign in error', error);
        }
    })
}

export const useConfirmContactMutation = () => {
    return useMutation({
        mutationFn: (formData: any) => confirmContact(formData),
        onSuccess: () => {
            console.log('confirm contact success');
        },
        onError: (error) => {
            console.log('confirm contact error', error);
        }
    })
}