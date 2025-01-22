import styles from "./Profile.module.scss" 
import userNotFound from "../assets/user.png"
import HeadingWithLink from "../HeadingWithLink/HeadingWithLink";
import { Outlet, useParams } from "react-router";
import { useUserContext } from "../Context/UserContext";
import { MdArticle } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { useState } from "react";
import axios from "axios";

const sections = 
    [ 
    {text:"YOUR ARTICLES", path:"./", icon:MdArticle},
    {text:"ACCOUNT SETTINGS", path:"./settings", icon:IoSettings}] as const;


function Profile() {
    const {fetchUserData} = useUserContext();
    const {state} = useUserContext()
    const {userName} = useParams()
    const isCurrentLoggedUser = userName === state.user?.name
    const [errorUploading, setErrorUploading] = useState("")
    const handleUploadBackgroundProfile = () => {
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
                  }
              } catch (error) {
                  setErrorUploading("Uploading file failed")
              } finally {
                  fetchUserData(token!);
              }
          }
      };
  
      input.click(); // This triggers the file input window
  };

    const loggedUserContent = (
        <ul className={styles.list}>
            {sections.map((section) => <li><HeadingWithLink path={section.path} text={section.text} Icon={section.icon}/></li>)}
        </ul>
    )
   
   return (
          <section className={styles.wrapper}>
                <div className={styles.profile}>
                    <div className={styles.avatar_name}>
                        <img onClick={handleUploadBackgroundProfile} className={styles.user_avatar} src={state.user?.profile_picture_link || userNotFound} alt="user" /> 
                        <p className={styles.name}>{userName}</p>
                    </div>
                    {isCurrentLoggedUser &&<>
                          <input onChange={handleUploadBackgroundProfile} type="file" id="avatarFileInput" className={styles.file_input} />
                        {loggedUserContent}
                    </>
                    }
                </div>
                <div className={styles.content_wrapper}>
                        <Outlet />
                </div>
          </section>
        
    )
}

export default Profile;