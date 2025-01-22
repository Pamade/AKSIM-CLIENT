import styles from "./UserSettings.module.scss"
import stylesProfile from "./Profile.module.scss";
import { useUserContext } from "../Context/UserContext";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Loader from "../Loader/Loader";

function UserSettings(){
    const {state} = useUserContext()
    const [newEmailCredentials, setNewEmailCredentials] = useState<{ [key: string]: string }>({
        oldEmail: state.user?.email as string,
        newEmail: "",
        password: ""
      });

    const [nameCredentials, setNameCredentials] = useState<{ [key: string]: string }>({
        oldName:state.user?.name as string,
        newName:""
      })

    const [passwordCredentials, setPasswordCredentials] = useState<{ [key: string]: string }>({
        userEmail:state.user?.email as string,
        validationPassowrd:"",
        newPassword:""
    })
    
      useEffect(() => {
        // MAKE SURE THAT USER DATA IS CORRECTLY FETCHED
        if (state.user) {
            setNewEmailCredentials({...newEmailCredentials, oldEmail:state.user.email});
            setNameCredentials({...nameCredentials, oldName:state.user.name})
            setPasswordCredentials({...passwordCredentials, userEmail:state.user.email})
        }
      }, [state.user])


    if (state.user?.email) {
        const {email, name} = state.user
        return (
            <>
                <h5 className={stylesProfile.heading}>Settings</h5>
                <div className={styles.forms_wrapper}>
                    <Form passwordNameInput="password" placeholder="SET NEW EMAIL" labelValue={email} stateForm={newEmailCredentials} setStateForm={setNewEmailCredentials} url={"change-email"} type="email" label="Email" name="newEmail"/>
                    <Form placeholder="SET NEW NAME" labelValue={name} stateForm={nameCredentials} setStateForm={setNameCredentials} url={"change-name"} type="text" label="Name" name="newName"/>
                    <Form passwordNameInput="validationPassword" placeholder="SET NEW PASSWORD" labelValue="Password" stateForm={passwordCredentials} setStateForm={setPasswordCredentials} url={"change-password"} type="password" label="" name="newPassword"/>
                </div>
            </>
        )
    }
    return (
        <h5 className={stylesProfile.heading}>Error</h5>
    ) 

}

interface PropsForm {
    stateForm:{[key:string]:string},
    setStateForm:React.Dispatch<React.SetStateAction<{
        [key: string]: string;
    }>>,
    url:string,
    label:string,
    type:string,
    name:string,
    labelValue:string,
    placeholder:string,
    passwordNameInput?:string
}


function Form({stateForm, url, setStateForm, label, type, name, labelValue, placeholder, passwordNameInput}:PropsForm){
    const [errors, setErrors] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isVisiblePassword, setIsVisiblePassowrd] = useState(false)
    const navigate = useNavigate();
    const {fetchUserData} = useUserContext()

    
    const handleSubmit = async (e:FormEvent) => {
        let token = localStorage.getItem("access_token") as string
        e.preventDefault()  
        
        try {
            setIsLoading(true)
            const response = await axios.patch("http://localhost:8080/api/user/" + url, stateForm, {
                headers:{
                    Authorization:"Bearer " + token,
                    "Content-Type":"application/json"
                }
            })            
            const errors = response.data.errors;
            if (response.status === 200) {
                setErrors([])
                if (response.data.access_token) {
                    localStorage.setItem("access_token", response.data.access_token)
                    token = localStorage.getItem("access_token") as string
                }
                
                if (url === "change-name" && !errors) {
                    console.log("idzie")
                    navigate(`/profile/${stateForm.newName}/settings`)
                }
                fetchUserData(token)
                if (errors) {
                    setErrors(errors)
                }
            }

        } catch (e) {
            console.log(e)
            setErrors(["Server error"]);
        } finally {
            setIsLoading(false)
        }
        
    }
    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setStateForm({...stateForm, [name]:value})
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {errors.map((error) => <p className={styles.error}>{error}</p>)}
            <div onClick={() => setIsVisiblePassowrd(!isVisiblePassword)} className={styles.email_input_btn}>
                <label className={styles.label}>
                    <span>{label}</span>
                    <p>{labelValue}</p>
                </label>
            <div>
                <div className={styles.input_container}>
                    <input onChange={handleChange} name={name} className={styles.input} placeholder={placeholder} type={type} />
                </div>
            </div>
            </div>
            <div className={`${styles.check_password_container} ${isVisiblePassword ? styles.show : styles.hide}`}>
                    {name !== "newName" && <input onChange={handleChange} name={passwordNameInput} className={styles.input} placeholder="CONFIRM YOUR PASSWORD" type="password" />}
                    {isLoading ? <Loader />: <button onSubmit={handleSubmit} className={styles.btn}>SUBMIT</button>}
            </div>
        </form>
    )
}

export default UserSettings;