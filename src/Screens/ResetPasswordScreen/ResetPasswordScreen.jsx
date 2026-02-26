import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { resetPassword } from '../../services/authService'
import './ResetPasswordScreen.css'

const ResetPasswordScreen = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const navigate = useNavigate()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!token) {
            setError('No se proporcionó un token de recuperación válido.')
        }
    }, [token])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }
        if (!token) {
            setError('Falta el token de recuperación')
            return
        }

        setLoading(true)
        setError(null)
        setSuccess(false)
        try {
            await resetPassword(token, password)
            setSuccess(true)
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (err) {
            setError(err.message || 'Error al restablecer la contraseña')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="reset-pwd-container">
            <header className="reset-pwd-header">
                <img
                    src="https://a.slack-edge.com/bv1-13/slack_logo-e971fd7.svg"
                    alt="Slack Logo"
                    className="slack-logo"
                />
            </header>

            <main className="reset-pwd-main">
                <h1>Elige una nueva contraseña</h1>
                <p className="reset-pwd-subhead">
                    Asegúrate de que tu nueva contraseña tenga al menos 8 caracteres.
                </p>

                <form onSubmit={handleSubmit} className="reset-pwd-form">
                    <div className="input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nueva contraseña"
                            required
                            minLength={8}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirmar contraseña"
                            required
                            minLength={8}
                        />
                    </div>
                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}
                    {success && (
                        <div className="success-message">
                            Contraseña restablecida con éxito. Redirigiendo al inicio de sesión...
                        </div>
                    )}
                    <button type="submit" className="reset-pwd-btn" disabled={loading || !token || success}>
                        {loading ? 'Guardando...' : 'Restablecer contraseña'}
                    </button>
                </form>
                <div className="back-to-login">
                    <Link to="/login">Volver al inicio de sesión</Link>
                </div>
            </main>
        </div>
    )
}

export default ResetPasswordScreen
