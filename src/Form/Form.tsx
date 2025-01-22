import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./Form.module.scss";
import { FormEvent, useEffect, useState } from "react";
import { useUserContext } from "../Context/UserContext";
import { FieldsDisplay, FormType, FieldType, RegisterValues, LoginValues, ResetPasswordValues, ForgotPasswordResponse, ValidateTokenResponse, AuthenticationResponse, isForgotPasswordResponse, isValidateTokenResponse, isAuthenticationResponse, FieldsLoginType, FieldsResetPassword, FieldsRegisterType, FetchValues } from "./FormTypes";
import axios from "axios";

const fields:FieldsDisplay[] = [{
    name:"email",
    type:"email",
    placeholder:"Enter Your email",
    label:"Email",
}, 
{
    name:"name",
    type:"text",
    placeholder:"Username",
    label:"Username",
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
    const {token} = useParams()
    const {fetchUserData} = useUserContext()
    const navigate = useNavigate();
    const [requestLoading, setRequestLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [reigsterValues, setRegisterValues] = useState<RegisterValues>({email:'', password:'', repeatPassword:'', name:''})
    const [loginValues, setLoginValues] = useState<LoginValues>({email:'', password:''})
    const [resetPasswordValues, setResetPasswordValues] = useState<ResetPasswordValues>({password:'', repeatPassword:'',
         tokenValue:token as string, tokenType:'forgot_password' })
         
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("")
    const [errors, setErrors] = useState<String[] | null>(null)

    useEffect(() => {
        formType === "resetPassword" && fetchPost({value:token, type:"forgot_password"}, "validateToken")
    }, [])

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

    const handleChangeResetPassword = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setResetPasswordValues(prevState => ({
            ...prevState, [name]:value
        }))
    }

    const fetchPost = async (values:FetchValues, endpoint:string) => {
        const API = `http://localhost:8080/api/auth/${endpoint}`;
        try {
            setRequestLoading(true)
            console.log(values)
            const response = await axios.post(API, values, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });

            if (response.status !== 200) {
                setErrors(["Could not authenticate"])
            }
            const data:ForgotPasswordResponse | ValidateTokenResponse | AuthenticationResponse = response.data
        if (isForgotPasswordResponse(data)) {
            const {successMessage, errors} = data
            successMessage ? setSuccessMessage(successMessage) : setErrors(errors)
        }
        else if (isValidateTokenResponse(data)) {
            const {isTokenValid} = data
            isTokenValid && formType === "resetPassword" ? null : navigate("/")
        }
        else if (isAuthenticationResponse(data)){
            const {access_token, refresh_token, errors} = data
            if (access_token) {
                localStorage.setItem("access_token", access_token)
                fetchUserData(access_token)
                return navigate("/")
            } 
            setErrors(errors)
        }
        } catch (err) {
            setErrors(["Server error"])
        }
        finally {
            setRequestLoading(false)
        }
    }

    const handleSubmit = async (e:FormEvent, {formType}:Pick<FormType, "formType">)  => {
        e.preventDefault();
        setErrors(null)
        let endpoint = "";
        let values: FetchValues;
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
            case "resetPassword":
                endpoint = "resetPassword"
                values = resetPasswordValues
                break;
            default:
                values = ""
                endpoint = "/"
        }
        await fetchPost(values, endpoint)
    }

    const RegisterForm = fields.map((field, index) => <Field onChange={handleChangeRegister} value={reigsterValues[field.name] as FieldsRegisterType} key={index} {...field} />)
    const LoginForm = fields.filter(field => field.name === "email" || field.name === "password").map((field, index) => <Field onChange={handleChangeLogin} value={loginValues[field.name as FieldsLoginType]}  key={index} {...field} />) 
    const EmailForm = fields.filter((field) => field.name === "email").map((field, index) => <Field onChange={(e) => setForgotPasswordEmail(e.target.value)} value={forgotPasswordEmail} key={index} {...field}/>)
    const ResetPasswordForm =  fields.filter((field) => field.name === "password" || field.name === "repeatPassword").map((field, index) => <Field onChange={handleChangeResetPassword} value={resetPasswordValues[field.name as FieldsResetPassword]}  key={index} {...field}/>)

    function content(description:string, fields:JSX.Element[], buttonText:string, additionalContent?:JSX.Element){
        return (
            <div className={styles.form_wrapper}>
                {successMessage? <div className={`${successMessage === ""  ? styles.success_wrapper__hidden : styles.success_wrapper}`}>
                    <p>{successMessage}</p>
                    {formType === "resetPassword" && <Link className={styles.link_back_to_login} to={"/login"}>Go To Login Page</Link>}
                </div> :                 <div className={`${errors === null  ? styles.error_wrapper__hidden : styles.error_wrapper}`}>
                    {errors !== null  && errors.map((err, index) => <p key={index}>{err}</p>)}
                </div>}
                {successMessage && formType === "resetPassword" ? 
                    ""
                    :
                     <form onSubmit={(e:FormEvent<HTMLFormElement>) => handleSubmit(e, {formType})} className={styles.form}>
                        <p className={styles.type}>{description}</p>
                        {fields}
                        <button disabled={requestLoading === true ? true : false} type="submit" className={ requestLoading ? `${styles.disabled} ${styles.button}` 
                        : styles.button}>{buttonText}</button>
                        <div>
                            {additionalContent}
                        </div>
                </form>
                }    
            </div>
        )
    }

    switch(formType) {
        case "register":
            return content("Register", RegisterForm, "CREATE AN ACCOUNT")
        case "login":
            return content("Login", LoginForm, "LOG IN", <Link className={styles.link} to="../forgotPassword">Forgot password ?</Link>)
        case "forgotPassword":
            return content("Forgot Password", EmailForm, "SEND")
        case "resetPassword":
            return content("Reset Password", ResetPasswordForm, "CHANGE PASSWORD")
        default:
            return null;
    }

}

function Field({label, placeholder, type, name, value, onChange}:FieldType){

    return (
        <div className={styles.field}>
            <label>{label}</label>
            <input name={name}  value={value} onChange={onChange} className={styles.input} placeholder={placeholder} type={type} />
        </div>
    )
}
export default Form

