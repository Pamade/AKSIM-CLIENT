import styles from "./UserSettings.module.scss"
import stylesProfile from "./Profile.module.scss";
import { useUserContext } from "../Context/UserContext";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Loader from "../Loader/Loader";

function UserSettings(){
    const {state} = useUserContext()
    const [errors, setErrors] = useState<String[]>([])
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
        repeatPassword:"",
        newPassword:"",
    })

      useEffect(() => {
        if (state.user) {
            setNewEmailCredentials({...newEmailCredentials, oldEmail:state.user?.email});
            setNameCredentials({...nameCredentials, oldName:state.user.name})
        }
      }, [state.user])


    if (state.user?.email) {
        const {email, name} = state.user
        return (
            <>
                <h5 className={stylesProfile.heading}>Settings</h5>
                {/* {errors.map((error) => error)} */}
                <div className={styles.forms_wrapper}>
                    <Form placeholder="SET NEW EMAIL" labelValue={email} showPasswordBox={true} stateForm={newEmailCredentials} setStateForm={setNewEmailCredentials} url={"change-email"} type="email" label="Email" name="newEmail"/>
                    <Form placeholder="SET NEW NAME" labelValue={name} showPasswordBox={false} stateForm={nameCredentials} setStateForm={setNameCredentials} url={"change-name"} type="text" label="Name" name="newName"/>
                </div>
            </>
        )
    }
    return (
        <h5 className={stylesProfile.heading}>Error</h5>
    ) 

}

interface PropsForm {
    showPasswordBox:boolean,
    stateForm:{[key:string]:string},
    setStateForm:React.Dispatch<React.SetStateAction<{
        [key: string]: string;
    }>>,
    url:string,
    label:string,
    type:string,
    name:string,
    labelValue:string,
    placeholder:string
}


function Form({showPasswordBox, stateForm, url, setStateForm, label, type, name, labelValue, placeholder}:PropsForm){
    const [errors, setErrors] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)


    const navigate = useNavigate();
    const {fetchUserData} = useUserContext()
    let token = localStorage.getItem("access_token") as string
    const handleSubmit = async (e:FormEvent) => {
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

    const [isVisiblePassword, setIsVisiblePassowrd] = useState(false)


    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {errors.map((error) => <p className={styles.error}>{error}</p>)}
            <div onClick={() => setIsVisiblePassowrd(true)} className={styles.email_input_btn}>
                <label className={styles.label}>
                    <span>{label}</span>
                    <p>{labelValue}</p>
                </label>
            <div>
                <div className={styles.input_container}>
                    <input onChange={handleChange} name={name} className={styles.input} placeholder={placeholder} type={type} />
                    {!showPasswordBox ? !isLoading ? <button onSubmit={handleSubmit} className={styles.btn}>SEND</button> : <Loader /> : null}
                </div>
            </div>
            </div>
            {showPasswordBox && <div className={`${styles.check_password_container} ${isVisiblePassword ? styles.show : styles.hide}`}>
                    <input onChange={handleChange} name="password" className={styles.input} placeholder="CONFIRM YOUR PASSWORD" type="password" />
                    {isLoading ? <Loader />: <button onSubmit={handleSubmit} className={styles.btn}>SEND</button>}
            </div>}
        </form>
    )
}





export default UserSettings;