
export type FormType = {
    formType:"login" | "register" | "forgotPassword" | "resetPassword",
}

export type FieldsRegisterType = "email" | "password" | "repeatPassword";
export type FieldsLoginType = "email" | "password";
export type FieldsResetPassword = "password" | "repeatPassword";
export type FieldsDisplay = Omit<FieldType, "value" | "onChange">;

export interface FieldType{
    name:FieldsRegisterType | FieldsLoginType | FieldsResetPassword
    type: string;
    placeholder: string;
    label: string;
    value:string    
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface LoginValues {
    email:string,
    password:string
}

export interface RegisterValues extends LoginValues {
    repeatPassword:string
}

export interface ResetPasswordValues {
    password:string,
    repeatPassword:string,
    tokenType:string,
    tokenValue:string
}

export interface ForgotPasswordResponse{
    errors:string[],
    successMessage:string | null,
}

export interface ValidateTokenResponse {
    isTokenValid:boolean
}

export interface AuthenticationResponse {
    access_token:string | null,
    refresh_token:string | null,
    errors:string[]
}

export function isForgotPasswordResponse(value: any): value is ForgotPasswordResponse {
    return 'errors' in value && 'successMessage' in value;
}

export function isValidateTokenResponse(value: any): value is ValidateTokenResponse {
    return 'isTokenValid' in value;
}

export function isAuthenticationResponse(value: any): value is AuthenticationResponse {
    return 'access_token' in value && 'refresh_token' in value && 'errors' in value;
}
