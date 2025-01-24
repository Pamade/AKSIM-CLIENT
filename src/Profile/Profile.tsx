import styles from "./Profile.module.scss" 
import userNotFound from "../assets/user.png"
import HeadingWithLink from "../HeadingWithLink/HeadingWithLink";
import { Outlet, useParams } from "react-router";
import { useUserContext } from "../Context/UserContext";
import { MdArticle } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { ProfileDataUser} from "../Types/types";
import UsersProfiles from "../UsersProfiles/UsersProfiles";

const sections = 
    [ 
    {text:"YOUR ARTICLES", path:"./", icon:MdArticle},
    {text:"ACCOUNT SETTINGS", path:"./settings", icon:IoSettings}] as const;


function Profile() {
    const {fetchUserData} = useUserContext();
    const {state} = useUserContext()
    const {userName} = useParams()
    const {responseData, isLoading} = useFetchOnLoad<ProfileDataUser>(`http://localhost:8080/api/content/get-user-profile/${userName}`)
    
    const [userProfileData, setUserProfileData] = useState<ProfileDataUser | null>(null)

    const loggedUser = state.user?.name === userName

    useEffect(() => {
        if (responseData?.userEmail !== null) {
          setUserProfileData(responseData)
        }
        
    }, [responseData])


    const [errorUploading, setErrorUploading] = useState("")

    const handleUploadProfileFile = () => {

      if (loggedUser) {
        const token = localStorage.getItem("access_token");
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
    
        // Listen to change once for the file input
        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('userEmail', state.user?.email || "test");
                try {
                    // Send the image to the server for storage
                    const response = await axios.patch('http://localhost:8080/api/user/add-profile-picture', formData, {
                        headers: {
                            Authorization: "Bearer " + token,
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    if (response.status !== 200) {
                      setErrorUploading("Uploading file failed")
                    } else fetchUserData(token!);
  
                } catch (error) {
                    setErrorUploading("Uploading file failed")
                } 
            }
        };
    
        input.click(); // This triggers the file input window
      }

  };

    const loggedUserContent = (
        <ul className={styles.list}>
            {sections.map((section) => <li><HeadingWithLink path={section.path} text={section.text} Icon={section.icon}/></li>)}
        </ul>
    )
  
  const photo = (loggedUser ? state.user?.profile_picture_link : userProfileData?.profilePictureLink) || userNotFound
  const name = (loggedUser ? state.user?.name : userProfileData?.userName)
  const email = (loggedUser ? state.user?.email : userProfileData?.userEmail)

  if (isLoading) return <></>
  if (userProfileData === null) return <h4 className={styles.not_found}>User {userName} not found</h4>
  return (
        <section className={styles.content}>
          <section className={styles.wrapper}>
                {errorUploading && <h3>{errorUploading}</h3>}
                <div className={styles.profile}>
                    <div className={styles.avatar_name}>
                        <img style={loggedUser ? {cursor:"pointer"} : {cursor:"default"}} onClick={handleUploadProfileFile} className={styles.user_avatar} src={photo} alt="user" /> 
                        <div className={styles.mail_email}>
                          <p className={styles.name}>Email: {email}</p>
                          <p className={styles.name}>Name: {name}</p>
                        </div>
                    </div>
                    {loggedUser && <>
                          <input onChange={handleUploadProfileFile} type="file" id="avatarFileInput" className={styles.file_input} />
                        {loggedUserContent}
                    </>
                    }
                </div>
                <div className={styles.content_wrapper}>
                        <Outlet />
                </div>
          </section>
          <div>
            <UsersProfiles />
          </div>
        </section>
        
    )
}

export default Profile;