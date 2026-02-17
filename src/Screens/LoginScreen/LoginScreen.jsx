import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { login } from '../../services/authService'
import useLogin from '../../hooks/useLogin'

import './LoginScreen.css'

const LoginScreen = () => {
    const {
        form_state,
        onChangeFieldValue,
        onSubmitForm,
        loading,
        error,
        response
    } = useLogin()

    return (
        <div className="login-container">
            <header className="login-header">
                <img
                    src="https://a.slack-edge.com/bv1-13/slack_logo-e971fd7.svg"
                    alt="Slack Logo"
                    className="slack-logo"
                />
            </header>
        
        <main>
            <h1>Escribe tu correo electronico para conectarte</h1>
            <p className="login-subhead">O selecciona otra forma de conectarte.</p>

                <form onSubmit={onSubmitForm} className="login-form">
                    <div className="input-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            onChange={onChangeFieldValue}
                            value={form_state.email}
                            placeholder="nombre@work.com"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={onChangeFieldValue}
                            value={form_state.password}
                            placeholder="Contraseña"
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
                                Te has logueado exitosamente
                            </div>
                        )
                    }
                    <button type="submit" className="login-btn" disabled={loading || (response && response.ok)}>
                        {loading ? 'Cargando...' : 'Iniciar sesión con correo'}
                    </button>
                </form>
                <div className="register-link">
                    ¿Nuevo en Slack? <Link to="/register">Crea una cuenta</Link>
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

export default LoginScreen