import styles from './Login.module.scss';
import Form from '../Form/Form';


function Login() {

    return (
            <div className={styles.form_wrapper}>
                <div>
                    <div className={styles.login_testing}>
                        <h5>Account for testing purposes</h5>
                        <h6>Email:admin@gmail.com</h6>
                        <h6>Password:adminadmin</h6>
                    </div>
                    <Form formType="login"/>
                </div>
                <div>
                    <Form formType="register"/>
                </div>
                
            </div>
    )
}
export default Login;