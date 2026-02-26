import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import "./AcceptInvitationScreen.css"

const AcceptInvitationScreen = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const acceptInvitation = async () => {
            try {
                const invitation_token = searchParams.get("invitation_token")

                if (!invitation_token) {
                    throw new Error("Token de invitación inválido")
                }

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/workspace/accept-invitation?invitation_token=${invitation_token}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                )

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || "Error al aceptar invitación")
                }

                // Espera un toque y redirige
                setTimeout(() => navigate("/"), 1200)

            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        acceptInvitation()
    }, [searchParams, navigate])

    return (
        <div className="accept-container">
            <div className="accept-box">

                {loading && (
                    <>
                        <h1>Aceptando invitación...</h1>
                        <p>Un momento por favor</p>
                    </>
                )}

                {!loading && error && (
                    <>
                        <h1>Error</h1>
                        <p>{error}</p>

                        <button onClick={() => navigate("/")}>
                            Volver al inicio
                        </button>
                    </>
                )}

                {!loading && !error && (
                    <>
                        <h1>¡Invitación aceptada!</h1>
                        <p>Redirigiendo...</p>
                    </>
                )}

            </div>
        </div>
    )
}

export default AcceptInvitationScreen