import React, { useState } from 'react'
import { Link } from 'react-router'
import { forgotPassword } from '../../services/authService'
import './ForgotPasswordScreen.css'

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)
        try {
            await forgotPassword(email)
            setSuccess(true)
        } catch (err) {
            setError(err.message || 'Ocurrió un error al intentar enviar el correo')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="forgot-pwd-container">
            <header className="forgot-pwd-header">
                <img
                    src="https://a.slack-edge.com/bv1-13/slack_logo-e971fd7.svg"
                    alt="Slack Logo"
                    className="slack-logo"
                />
            </header>

            <main className="forgot-pwd-main">
                <h1>Restablecer contraseña</h1>
                <p className="forgot-pwd-subhead">
                    Para restablecer tu contraseña, ingresa la dirección de correo electrónico que usas para iniciar sesión en Slack.
                </p>

                <form onSubmit={handleSubmit} className="forgot-pwd-form">
                    <div className="input-group">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nombre@work.com"
                            required
                        />
                    </div>
                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}
                    {success && (
                        <div className="success-message">
                            Si el correo existe, se ha enviado un enlace de recuperación.
                        </div>
                    )}
                    <button type="submit" className="forgot-pwd-btn" disabled={loading}>
                        {loading ? 'Enviando...' : 'Obtener enlace para restablecer'}
                    </button>
                </form>
                <div className="back-to-login">
                    <Link to="/login">Volver al inicio de sesión</Link>
                </div>
            </main>
        </div>
    )
}

export default ForgotPasswordScreen
