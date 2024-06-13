import styles from './Login.module.scss';
import Form from '../Form/Form';
import { useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";



function Login() {

    const [requestLoading, setRequestLoading] = useState(false)

    return (
        <div className="content">
            <section>
                <h1 className={styles.heading}>AKSIM</h1>
            </section>
            <div className={styles.loading_wrapper}>
                    {requestLoading && <ClipLoader />}
                </div>
            <div className={styles.form_wrapper}>
                <div>
                    <Form requestLoading={requestLoading} setRequestLoading={setRequestLoading} formType="login"/>
                </div>
                <div>
                    <Form requestLoading={requestLoading} setRequestLoading={setRequestLoading} formType="register"/>
                </div>
            </div>
        </div>
    )
}
export default Login;