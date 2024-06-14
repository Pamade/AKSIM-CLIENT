import { Link, useNavigate } from "react-router-dom";
import styles from "./Form.module.scss";
import { FormEvent, useState } from "react";

type FormType = {
    formType:"login" | "register",
    setRequestLoading:React.Dispatch<React.SetStateAction<boolean>>,
    requestLoading:boolean
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
    refresh_token:string
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




function Form({formType, setRequestLoading, requestLoading}:FormType){

    const navigate = useNavigate();
    const [reigsterValues, setRegisterValues] = useState<RegisterValues>({
        email: '',
        password: '',
        repeatPassword: ''
    });

    const [loginValues, setLoginValues] = useState<LoginValues>({
        email:'',
        password:''
    })
    const [errors, setErrors] = useState<String[] | null>(null)

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

    const handleSubmit = async (e:FormEvent, {formType}:Pick<FormType, "formType">)  => {
        e.preventDefault();
        setErrors(null)
        const endpoint = formType === "register" ? "register" : "authenticate";
        const API = `http://localhost:8080/api/auth/${endpoint}`;
        const values = formType === "register" ? reigsterValues : loginValues
        
        try {
            setRequestLoading(true)
            const response = await fetch(API, {
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(values)
            })
            if (!response.ok) {
                setErrors(["could not authenticate"])
            }
            const data:Data = await response.json()
    
            if (data.errors != null) {
                setErrors(data.errors)
            } else  {
                localStorage.setItem("access_token", data.access_token)
                navigate("/")
            }
        } catch (err) {
            formType === "login" ? setErrors(["Invalid Credentials"]) : setErrors(["An error occurred"])
        }
        finally {
            setRequestLoading(false)
        }



    }

    const RegisterForm = fields.map((field, index) => <Field onChange={handleChangeRegister} value={reigsterValues[field.name] as FieldsRegisterType} key={index} {...field} />)
    const LoginForm = fields.slice(0,-1).map((field, index) => <Field onChange={handleChangeLogin} value={loginValues[field.name as FieldsLoginType]}  key={index} {...field} />) 

    return (
        <div className={styles.form_wrapper}>
            <div className={`${errors === null  ? styles.error_wrapper__hidden : styles.error_wrapper}`}>
                {errors !== null  && errors.map((err, index) => <p key={index}>{err}</p>)}
            </div>
            <form onSubmit={(e:FormEvent<HTMLFormElement>) => handleSubmit(e, {formType})} className={styles.form}>
                <p className={styles.type}>{formType === "register" ? "REGISTER" : "LOGIN"}</p>
                {formType=== "register" ? RegisterForm : LoginForm}
                <button disabled={requestLoading === true ? true : false} type="submit" className={ requestLoading ? `${styles.disabled} ${styles.button}` 
                : styles.button}>{formType === "register" ? "Create an Account" : "Log in"}</button>
                {formType === "login" && <Link className={styles.link} to="reset">Forgot password ?</Link>}
            </form>
        </div>
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

