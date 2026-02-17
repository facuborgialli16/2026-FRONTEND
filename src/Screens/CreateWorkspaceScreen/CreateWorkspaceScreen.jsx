import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import useRequest from '../../hooks/useRequest'
import { createWorkspace } from '../../services/workspaceService'
import './CreateWorkspaceScreen.css'

const CreateWorkspaceScreen = () => {
    const navigate = useNavigate()
    const { loading, error, sendRequest } = useRequest()
    const [workspaceData, setWorkspaceData] = useState({
        name: ''
    })

    const handleChange = (e) => {
        setWorkspaceData({ ...workspaceData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await sendRequest(async () => {
            const result = await createWorkspace({
                title: workspaceData.name // Backend expects 'title'
            })
            navigate('/home')
            return result
        })
    }

    return (
        <div className="create-workspace-container">
            <header className="create-header">
                <img src="https://a.slack-edge.com/38f0e7c/marketing/img/nav/slack-salesforce-logo-nav-white.png" alt="Slack" className="create-logo" />
            </header>

            <main className="create-main">
                <div className="create-card">
                    <h1>Crea un nuevo espacio de trabajo</h1>
                    <p className="create-subtitle">Diferentes espacios de trabajo para diferentes equipos.</p>

                    <form onSubmit={handleSubmit} className="create-form">
                        <div className="form-group">
                            <label htmlFor="name">Nombre del espacio de trabajo</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={workspaceData.name}
                                onChange={handleChange}
                                placeholder="Ej: Acme Corp, Proyecto X"
                                required
                            />
                        </div>

                        {error && (
                            <div className="create-error">
                                ⚠️ {error.message || 'Error al crear el espacio de trabajo'}
                            </div>
                        )}

                        <button type="submit" className="create-btn" disabled={loading}>
                            {loading ? 'Creando...' : 'Crear Espacio de Trabajo'}
                        </button>
                    </form>

                    <div className="create-footer">
                        <button className="cancel-btn" onClick={() => navigate('/home')}>Cancelar</button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default CreateWorkspaceScreen
