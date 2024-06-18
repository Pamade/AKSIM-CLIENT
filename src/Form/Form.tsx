import { Link, useNavigate } from "react-router-dom";
import styles from "./Form.module.scss";
import { FormEvent, useState } from "react";
import { ClipLoader } from "react-spinners";

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

    const navigate = useNavigate();
    const [requestLoading, setRequestLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [reigsterValues, setRegisterValues] = useState<RegisterValues>({
        email: '',
        password: '',
        repeatPassword: ''
    });

    const [loginValues, setLoginValues] = useState<LoginValues>({
        email:'',
        password:''
    })

    const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("")

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
        let endpoint = "";
        let values:RegisterValues | LoginValues | string;
        switch (formType) {
            case "register":
                endpoint = "register"
                values = reigsterValues
                break;
            case "login":
                endpoint = "authenticate"
                values = loginValues;
                break;
            case "forgotPassword":
                endpoint = "forgotPassword"
                values = forgotPasswordEmail
                break;
        }
        const API = `http://localhost:8080/api/auth/${endpoint}`;
    
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
            } 

            if (data.errors === null && "access_token" in data) {
                localStorage.setItem("access_token", data.access_token)
                navigate("/")
            }

            if (data.success) setSuccessMessage(data.success)

        } catch (err) {
            console.log(err);
            formType === "login" ? setErrors(["Invalid Credentials"]) : setErrors(["An error occurred"])
        }
        finally {
            setRequestLoading(false)
        }

    }

    const RegisterForm = fields.map((field, index) => <Field onChange={handleChangeRegister} value={reigsterValues[field.name] as FieldsRegisterType} key={index} {...field} />)
    const LoginForm = fields.slice(0,-1).map((field, index) => <Field onChange={handleChangeLogin} value={loginValues[field.name as FieldsLoginType]}  key={index} {...field} />) 
    const EmailForm = fields.slice(0, 1).map((field, index) => <Field onChange={(e) => setForgotPasswordEmail(e.target.value)} value={forgotPasswordEmail} key={index} {...field}/>)

    function content(description:string, fields:JSX.Element[], buttonText:string, additionalContent?:JSX.Element){
        return (
            <div className={styles.form_wrapper}>
                {/* <div className={styles.loading_wrapper}>
                    {requestLoading && <ClipLoader size={125} />}
                </div> */}
                {successMessage ? <div className={`${successMessage === ""  ? styles.success_wrapper__hidden : styles.success_wrapper}`}>{successMessage}</div> :                 <div className={`${errors === null  ? styles.error_wrapper__hidden : styles.error_wrapper}`}>
                    {errors !== null  && errors.map((err, index) => <p key={index}>{err}</p>)}
                </div>}

                <form onSubmit={(e:FormEvent<HTMLFormElement>) => handleSubmit(e, {formType})} className={styles.form}>
                        <p className={styles.type}>{description}</p>
                        {fields}
                        <button disabled={requestLoading === true ? true : false} type="submit" className={ requestLoading ? `${styles.disabled} ${styles.button}` 
                        : styles.button}>{buttonText}</button>
                        <div>
                            {additionalContent}
                        </div>
                </form>
            </div>
        )
    }

    switch(formType) {
        case "register":
            return content("Register", RegisterForm, "CREATE AN ACCOUNT",<Link className={styles.link} to="reset">Forgot password ?</Link> )
        case "login":
            return content("Login", LoginForm, "LOG IN")
        case "forgotPassword":
            return content("Forgot Password", EmailForm, "SEND")
        default:
            return null;
    }

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

