type FormType = {
    formType:"login" | "register" | "forgotPassword",
}
type FieldsRegisterType = "email" | "password" | "repeatPassword";
type FieldsLoginType = "email" | "password";
type FieldsDisplay = Omit<Field, "value" | "onChange">;

interface Field {
    name:FieldsRegisterType | FieldsLoginType
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


interface Data {
    errors:string[] | null,
    access_token:string,
    refresh_token:string,
    success?:string
}