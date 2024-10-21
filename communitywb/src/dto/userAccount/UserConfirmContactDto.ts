export interface UserConfirmContactDto {
    email: string | null;
    phone: string | null;
    username: string;
    fullname: string;
    password: string;
    confirmationCode: string;
}