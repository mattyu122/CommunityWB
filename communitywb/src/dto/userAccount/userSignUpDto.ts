export interface UserSignUpDto {
    phone: string | null;
    email: string | null;
    fullname: string;
    username: string;
    password: string;
}