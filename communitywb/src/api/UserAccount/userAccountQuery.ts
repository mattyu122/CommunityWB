import { useMutation } from "@tanstack/react-query";
import { confirmContact, signInUser, signUpUser } from "./userAccountApi";
export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: (formData: any) => signUpUser(formData),
        onSuccess: () => {
        },
        onError: (error) => {
        }
    })
}

export const useSignInMutation = () => {
    return useMutation({
        mutationFn: (formData: any) => signInUser(formData),
        onSuccess: () => {
        },
        onError: () => {
        }
    })
}

export const useConfirmContactMutation = () => {
    return useMutation({
        mutationFn: (formData: any) => confirmContact(formData),
        onSuccess: () => {
        },
        onError: (error) => {
        }
    })
}