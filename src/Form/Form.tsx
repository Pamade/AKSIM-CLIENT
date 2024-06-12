import { Link } from "react-router-dom";
import styles from "./Form.module.scss";
import { FormEvent, useState } from "react";

type FormType = {
    formType:"login" | "register"
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


const fields:FieldsDisplay[] = [{
    name:"email",
    type:"email",
    placeholder:"Enter Your email",
    label:"Email",
}, 
{
    name:"password",
    type:"password",
    placeholder:"Enter your password",
    label:"Password",
},
{   name:"repeatPassword", 
    type:"password",
    placeholder:"Repeat password", 
    label:"Repeat Password"
}
]



function Form({formType}:FormType){

    const [reigsterValues, setRegisterValues] = useState<RegisterValues>({
        email: '',
        password: '',
        repeatPassword: ''
    });

    const [loginValues, setLoginValues] = useState<LoginValues>({
        email:'',
        password:''
    })

    const handleChangeRegister = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target

        setRegisterValues(prevState => ({
            ...prevState, [name]:value
        }))
    }

    const handleChangeLogin = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setLoginValues(prevState => ({
            ...prevState, [name]:value
        }))
    }

    const handleSubmit = async (e:FormEvent, {formType}:FormType)  => {
        e.preventDefault();
        const endpoint = formType === "register" ? "register" : "authenticate";
        const API = `http://localhost:8080/api/auth/${endpoint}`;
        const values = formType === "register" ? reigsterValues : loginValues

        const response = await fetch(API, {
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(values)
        })
        console.log(response)
        const data =  await response.json()
        console.log(data)
    }

    const RegisterForm = fields.map((field, index) => <Field onChange={handleChangeRegister} value={reigsterValues[field.name] as FieldsRegisterType} key={index} {...field} />)
    const LoginForm = fields.slice(0,-1).map((field, index) => <Field onChange={handleChangeLogin} value={loginValues[field.name as FieldsLoginType]}  key={index} {...field} />) 

    return (
        <form onSubmit={(e:FormEvent<HTMLFormElement>) => handleSubmit(e, {formType})} className={styles.form}>
            {formType=== "register" ? RegisterForm : LoginForm}
            <button type="submit" className={styles.button}>{formType === "register" ? "Create an Account" : "Log in"}</button>
            {formType === "login" && <Link className={styles.link} to="reset">Forgot password ?</Link>}
        </form>
    )
}

function Field({label, placeholder, type, name, value, onChange}:Field){

    return (
        <div className={styles.field}>
            <label>{label}</label>
            <input name={name}  value={value} onChange={onChange} className={styles.input} placeholder={placeholder} type={type} />
        </div>
    )
}
export default Form

