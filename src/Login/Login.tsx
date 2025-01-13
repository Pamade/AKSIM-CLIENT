import styles from './Login.module.scss';
import Form from '../Form/Form';


function Login() {

    return (
            <div className={styles.form_wrapper}>
                <div>
                    <Form formType="login"/>
                </div>
                <div>
                    <Form formType="register"/>
                </div>
            </div>
    )
}
export default Login;