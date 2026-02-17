import React, { useContext } from 'react'
import { Link } from 'react-router'
import { WorkspaceContext } from '../../Context/WorkspaceContext'
import './HomeScreen.css'

const HomeScreen = () => {
    const { workspace_list_loading, workspace_list_error, workspace_list } = useContext(WorkspaceContext)
    console.log(workspace_list)



    if (workspace_list_loading) {
        return (
            <div className="loading-container">
                <span>Loading workspaces...</span>
            </div>
        )
    }

    if (workspace_list_error) {
        return (
            <div className="error-container">
                <span>Error: {workspace_list_error.message}</span>
            </div>
        )
    }

    return (
        <div className="home-container">
            <header className="home-navbar">
                <div className="nav-left">
                    <div className="nav-logo">
                        <img src="https://a.slack-edge.com/38f0e7c/marketing/img/nav/slack-salesforce-logo-nav-white.png" alt="Slack" className="nav-image" />
                    </div>
                    <div>
                        <nav className="nav-links">
                            <a href="#">Funciones</a>
                            <a href="#">Soluciones</a>
                            <a href="#">Empresa</a>
                            <a href="#">Recursos</a>
                            <a href="#">Precios</a>
                        </nav>
                    </div>
                </div>
                <div className="nav-actions">
                    <button className="btn-sales">HABLAR CON VENTAS</button>
                    <Link to="/create-workspace" className="btn-create-workspace">CREAR UN NUEVO ESPACIO DE TRABAJO</Link>
                </div>
            </header>

            <div className="home-header">
                <h1>Bienvenido nuevamente</h1>
                <span>Elige un espacio de trabajo para comenzar</span>
            </div>

            <div className="workspace-list">
                {
                    workspace_list && workspace_list.data.workspaces && workspace_list.data.workspaces.length > 0 ? (
                        workspace_list.data.workspaces.map(workspace => (
                            <div key={workspace.workspace_id} className="workspace-item">
                                <div className="workspace-info">
                                    <div className="workspace-avatar">
                                        {workspace.workspace_title.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="workspace-details">
                                        <div className="workspace-name">{workspace.workspace_title}</div>
                                        {/* Placeholder for URL if it existed, or just keep name */}
                                    </div>
                                </div>
                                <Link to={'/workspace/' + workspace.workspace_id} className="enter-btn">ABRIR</Link>
                            </div>
                        ))
                    ) : (
                        <div className="empty-container">
                            <span>No tienes workspaces</span>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default HomeScreen