import { Link } from "react-router-dom";
import styles from "./Form.module.scss";
import { FormEvent, useState } from "react";

type Form = {
    formType:"login" | "register"
}

type FieldName = "email" | "password" | "repeatPassword";

interface Field {
    name:FieldName,
    type: string;
    placeholder: string;
    label: string;
    value:string    
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // values: {}
}

const fields:Omit<Field, "value" | "onChange">[] = [{
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
{
    name:"repeatPassword",
    type:"password",
    placeholder:"Repeat password",
    label:"Repeat password",
}
] as const;


function Form({formType}:Form){

    const [values, setValues] = useState({
        email: '',
        password: '',
        repeatPassword: ''
    });

    const requestOptions = {
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password:values.password, repeatPassword:values.repeatPassword })
    }

    const createUserPostRequest = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch('http://localhost:8080/api/createUser', requestOptions)
        .then(response => response.json())
        .then(data => {});
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target

        setValues(prevState => ({
            ...prevState, [name]:value
        }))
    }

    return (
        <form onSubmit={(e:FormEvent<HTMLFormElement>) => createUserPostRequest(e)} className={styles.form}>
            {formType === "register" ? fields.map((field, index) => <Field onChange={handleChange} value={values[field.name]} key={index} {...field} />) 
            : fields.slice(0,-1).map((field, index) => <Field onChange={handleChange} value={values[field.name]}  key={index} {...field} />) }
            <button  className={styles.button}>{formType === "register" ? "Create an Account" : "Log in"}</button>
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

