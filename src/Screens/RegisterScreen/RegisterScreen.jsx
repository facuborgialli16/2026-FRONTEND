import React from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import { register } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import useRegister from '../../hooks/useRegister'

import './RegisterScreen.css'

const RegisterScreen = () => {
    const {
        form_state,
        onChangeFieldValue,
        onSubmitForm,
        loading,
        error,
        response
    } = useRegister()
    return (
        <div className="register-container">
            <header className="register-header">
                <img
                    src="https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png"
                    alt="Slack Logo"
                    className="slack-logo"
                />
            </header>
            <main>
                <h1>Regístrate en Slack</h1>
                <p className="register-subhead">Te sugerimos usar la dirección de correo electrónico que usas en el trabajo.</p>

                <form onSubmit={onSubmitForm} className="register-form">
                    <div className="input-group">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={form_state.username}
                            onChange={onChangeFieldValue}
                            placeholder="Nombre de usuario"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form_state.password}
                            onChange={onChangeFieldValue}
                            placeholder="Contraseña"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form_state.email}
                            onChange={onChangeFieldValue}
                            placeholder="nombre@trabajo.com"
                        />
                    </div>
                    {
                        error && (
                            <div className="error-message">
                                ⚠️ {error.message}
                            </div>
                        )
                    }
                    {
                        response && response.ok && (
                            <div className="success-message">
                                Usuario registrado exitosamente. Te enviaremos un mail con instrucciones.
                            </div>
                        )
                    }
                    <button type="submit" className="register-btn" disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
                <div className="login-link">
                    ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
                </div>
            </main>
            <footer>
                <a href="">Privacidad y Términos</a>
                <a href="">Contáctanos</a>
                <a href="">Cambiar la región</a>
            </footer>
        </div>
    )
}

export default RegisterScreen