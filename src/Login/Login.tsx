import styles from './Login.module.scss';
import Form from '../Form/Form';

function Login() {

    return (
        <div className="content">
            <section>
                <h1 className={styles.heading}>AKSIM</h1>
            </section>
            <div className={styles.form_wrapper}>
                <div>
                    <p className={styles.type}>Login</p>
                    <Form formType="login"/>
                </div>
                <div>
                    <p className={styles.type}>Register</p>
                    <Form formType="register"/>
                </div>
            </div>
        </div>
    )
}
export default Login;