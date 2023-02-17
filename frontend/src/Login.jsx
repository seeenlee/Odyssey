import React, {useState} from "react"
export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input size="45" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Alex Smith" id="email" name="email" />
                <label htmlFor="password">Password</label>
                <input size="45" value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="alexsmith@gmail.com" id="password" name="password" />
                <button type="submit">Log In</button>
            </form>
            
            <button className="reg-btn" onClick={() => props.onFormSwitch('register')}>Create an account</button>
        </div>
    )
}