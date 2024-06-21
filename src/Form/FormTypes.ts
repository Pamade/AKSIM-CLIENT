
type FormType = {
    formType:"login" | "register" | "forgotPassword" | "resetPassword",
}

type FieldsRegisterType = "email" | "password" | "repeatPassword";
type FieldsLoginType = "email" | "password";
type FieldsResetPassword = "password" | "repeatPassword";
type FieldsDisplay = Omit<Field, "value" | "onChange">;

interface Field{
    name:FieldsRegisterType | FieldsLoginType | FieldsResetPassword
    type: string;
    placeholder: string;
    label: string;
    value:string    
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface LoginValues {
    email:string,
    password:string
}

interface RegisterValues extends LoginValues {
    repeatPassword:string
}

interface ResetPasswordValues {
    password:string,
    repeatPassword:string,
}

interface ForgotPasswordResponse{
    errors:string[],
    successMessage:string | null,
}

interface ValidateTokenResponse {
    isTokenValid:boolean
}

interface AuthenticationResponse {
    access_token:string | null,
    refresh_token:string | null,
    errors:string[]
}

function isForgotPasswordResponse(value: any): value is ForgotPasswordResponse {
    return 'errors' in value && 'successMessage' in value;
}

function isValidateTokenResponse(value: any): value is ValidateTokenResponse {
    return 'isTokenValid' in value;
}

function isAuthenticationResponse(value: any): value is AuthenticationResponse {
    return 'access_token' in value && 'refresh_token' in value && 'errors' in value;
}
// function isData(value:Data | IsTokenValid):value is Data {
//     return (value as Data).refresh_token !== undefined;
// }