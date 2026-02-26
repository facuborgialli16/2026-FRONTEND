    import { useParams, useEffect } from "react"

    const AcceptInvitationScreen = () => {
    const { token } = useParams()

    useEffect(() => {
        fetch(`http://localhost:8080/api/invitations/accept?invitation_token=${token}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            // redirigir a home o login
        })
    }, [])

    return <h1>Aceptando invitación...</h1>
    }

    export default AcceptInvitationScreen