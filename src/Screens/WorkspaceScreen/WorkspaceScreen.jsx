import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { AuthContext } from '../../Context/AuthContext'
import { updateWorkspace, updateChannel, deleteMessage, deleteMember, updateMember, inviteMember, deleteChannel } from '../../services/workspaceService'
import './WorkspaceScreen.css'

const WorkspaceScreen = () => {
    const { workspace_id, channel_id } = useParams()
    const navigate = useNavigate()
    const { session } = useContext(AuthContext)

    const [workspace, setWorkspace] = useState(null)
    const [channels, setChannels] = useState([])
    const [currentChannel, setCurrentChannel] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [isCreatingChannel, setIsCreatingChannel] = useState(false)
    const [newChannelName, setNewChannelName] = useState('')
    const [currentUserRole, setCurrentUserRole] = useState(null)

    // Modals
    const [isWorkspaceSettingsOpen, setIsWorkspaceSettingsOpen] = useState(false)
    const [editWorkspaceTitle, setEditWorkspaceTitle] = useState('')

    const [isChannelSettingsOpen, setIsChannelSettingsOpen] = useState(false)
    const [editChannelName, setEditChannelName] = useState('')

    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)
    const [members, setMembers] = useState([])
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteRole, setInviteRole] = useState('Member')

    const URL_API = import.meta.env.VITE_API_URL
    const getHeaders = () => ({
        'x-api-key': import.meta.env.VITE_API_KEY,
        'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
        'Content-Type': 'application/json',
    })

    // Fetch workspace + channels
    useEffect(() => {
        const fetchWorkspaceInfo = async () => {
            try {
                const resWs = await fetch(`${URL_API}/api/workspace/${workspace_id}`, { headers: getHeaders() })
                const dataWs = await resWs.json()
                if (dataWs.ok) {
                    setWorkspace(dataWs.data.workspace)
                    setCurrentUserRole(dataWs.data.member.role)
                }

                const resCh = await fetch(`${URL_API}/api/workspace/${workspace_id}/channels`, { headers: getHeaders() })
                const dataCh = await resCh.json()
                if (dataCh.ok) {
                    const fetchedChannels = dataCh.data.channels
                    setChannels(fetchedChannels)
                    if (fetchedChannels.length > 0) {
                        const selected = fetchedChannels.find(c => c._id === channel_id) || fetchedChannels[0]
                        setCurrentChannel(selected)
                        if (!channel_id) navigate(`/workspace/${workspace_id}/channel/${selected._id}`, { replace: true })
                    }
                }
            } catch (e) { console.error(e) }
        }
        fetchWorkspaceInfo()
    }, [workspace_id, channel_id])

    // Fetch messages
    // Fetch messages SOLO cuando cambia el canal
    useEffect(() => {
        if (!channel_id) return

        const fetchMessages = async () => {
            try {
                const res = await fetch(`${URL_API}/api/workspace/${workspace_id}/channels/${channel_id}/messages`, { headers: getHeaders() })
                const data = await res.json()
                if (data.ok) setMessages(data.data.messages)
            } catch (e) { console.error(e) }
        }

        fetchMessages()
    }, [workspace_id, channel_id])

    // Enviar mensaje
    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !channel_id) return
        try {
            await fetch(`${URL_API}/api/workspace/${workspace_id}/channels/${channel_id}/messages`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ content: newMessage }),
            })
            setNewMessage('')
        } catch (e) { console.error(e) }
    }

    // Crear canal
    const handleCreateChannel = async (e) => {
        e.preventDefault()
        if (!newChannelName.trim()) return
        try {
            const res = await fetch(`${URL_API}/api/workspace/${workspace_id}/channels`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ name: newChannelName }),
            })
            const data = await res.json()
            if (data.ok) {
                const created = data.data.channel_created
                setChannels(prev => [...prev, created])
                setIsCreatingChannel(false)
                setNewChannelName('')
                navigate(`/workspace/${workspace_id}/channel/${created._id}`)
            }
        } catch (e) { console.error(e) }
    }

    const handleUpdateWorkspace = async (e) => {
        e.preventDefault()
        if (!editWorkspaceTitle.trim()) return
        try {
            await updateWorkspace(workspace_id, { title: editWorkspaceTitle })
            setWorkspace({ ...workspace, title: editWorkspaceTitle })
            setIsWorkspaceSettingsOpen(false)
        } catch (e) {
            console.error(e)
        }
    }

    const handleRenameChannel = async (e) => {
        e.preventDefault()
        if (!editChannelName.trim() || !channel_id) return
        try {
            await updateChannel(workspace_id, channel_id, { name: editChannelName })
            setChannels(channels.map(c => c._id === channel_id ? { ...c, name: editChannelName } : c))
            setCurrentChannel({ ...currentChannel, name: editChannelName })
            setIsChannelSettingsOpen(false)
        } catch (e) {
            console.error(e)
        }
    }

    const handleDeleteMessage = async (msgId) => {
        if (!window.confirm("¿Seguro que quieres eliminar este mensaje?")) return
        try {
            await deleteMessage(workspace_id, channel_id, msgId)
            setMessages(messages.filter(m => m._id !== msgId))
        } catch (e) {
            console.error(e)
            alert("No tienes permiso o ha ocurrido un error al eliminar este mensaje")
        }
    }

    const handleDeleteChannel = async (id, name) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar el canal "# ${name}"? Esta acción no se puede deshacer.`)) {
            return
        }
        try {
            await deleteChannel(workspace_id, id)
            setChannels(prev => prev.filter(ch => ch._id !== id))
            if (channel_id === id) {
                setMessages([])
                setCurrentChannel(null)
                navigate(`/workspace/${workspace_id}`)
            }
        } catch (e) {
            console.error(e)
            alert("Error al eliminar el canal: " + e.message)
        }
    }

    const openWorkspaceSettings = () => {
        if (workspace) setEditWorkspaceTitle(workspace.title)
        setIsWorkspaceSettingsOpen(true)
    }

    const openChannelSettings = () => {
        if (currentChannel) setEditChannelName(currentChannel.name)
        setIsChannelSettingsOpen(true)
    }

    const fetchMembers = async () => {
        try {
            const res = await fetch(`${URL_API}/api/workspace/${workspace_id}/members`, { headers: getHeaders() })
            const data = await res.json()
            if (data.ok) setMembers(data.data.members)
        } catch (e) { console.error(e) }
    }

    const openMembersModal = () => {
        fetchMembers()
        setIsMembersModalOpen(true)
    }

    useEffect(() => {
        if (workspace_id) {
            fetchMembers()
        }
    }, [workspace_id])

    const handleUpdateMemberRole = async (member_id, newRole) => {
        try {
            await updateMember(workspace_id, member_id, { role: newRole })
            setMembers(members.map(m => m._id === member_id ? { ...m, role: newRole } : m))
        } catch (e) { console.error(e) }
    }

    const handleRemoveMember = async (member_id) => {
        if (!window.confirm("¿Seguro que quieres eliminar a este miembro?")) return
        try {
            await deleteMember(workspace_id, member_id)
            setMembers(members.filter(m => m._id !== member_id))
        } catch (e) {
            console.error(e)
            alert("No tienes permiso o ha ocurrido un error al eliminar este miembro")
        }
    }

    const handleInviteMember = async (e) => {
        e.preventDefault()
        if (!inviteEmail.trim()) return
        try {
            await inviteMember(workspace_id, inviteEmail, inviteRole)
            alert('Invitación enviada con éxito')
            setInviteEmail('')
        } catch (e) {
            console.error(e)
            alert("Error al enviar invitación: " + e.message)
        }
    }

    const workspaceInitial = workspace ? workspace.title.charAt(0).toUpperCase() : 'W'
    const isAdmin = currentUserRole === 'Owner' || currentUserRole === 'Admin'

    return (
        <div className="workspace-layout slack-theme">
            {/* ── TOP NAVBAR ── */}
            <nav className="ws-topbar">
                <div className="ws-topbar__left">
                    <button className="ws-topbar__nav-btn" onClick={() => navigate(-1)} title="Atrás">←</button>
                    <button className="ws-topbar__nav-btn" onClick={() => navigate(1)} title="Adelante">→</button>
                    <button className="ws-topbar__nav-btn ws-topbar__nav-btn--home" onClick={() => navigate('/home')} title="Inicio">⌂</button>
                </div>

                <div className="ws-topbar__center">
                    <div className="ws-searchbar">
                        <span className="ws-searchbar__icon">🔍</span>
                        <input
                            type="text"
                            placeholder={`Buscar en ${workspace ? workspace.title : 'Workspace'}`}
                        />
                    </div>
                </div>

                <div className="ws-topbar__right">
                    <div className="ws-avatar-chip">
                        {workspaceInitial}
                        <span className="ws-avatar-chip__status" />
                    </div>
                </div>
            </nav>

            {/* ── BODY ── */}
            <div className="workspace-body">

                {/* RAIL */}
                <div className="ws-rail">
                    <div className="ws-rail__logo ws-rail__logo--active">
                        {workspaceInitial}
                    </div>
                    <button className="ws-rail__icon" title="Inicio">🏠</button>
                    <button className="ws-rail__icon" title="Mensajes directos">💬</button>
                    <button className="ws-rail__icon" title="Actividad">🔔</button>
                    <button className="ws-rail__icon" title="Archivos">📁</button>
                    <div className="ws-rail__spacer" />
                    <button className="ws-rail__icon" title="Más">•••</button>
                </div>

                {/* SIDEBAR */}
                <aside className="workspace-sidebar">

                    {/* Nombre del workspace */}
                    <div className="sidebar-header" onClick={openWorkspaceSettings} style={{ cursor: 'pointer' }} title="Configuración del Workspace">
                        <span className="sidebar-header__title">
                            {workspace ? workspace.title : 'Loading...'}
                        </span>
                        {isAdmin && <span className="sidebar-header__chevron">⚙️</span>}
                    </div>

                    {/* Scroll area */}
                    <div className="sidebar-scroll">

                        {/* Miembros */}
                        {isAdmin && (
                            <div className="sidebar-section">
                                <div className="sidebar-section__title" onClick={openMembersModal}>
                                    <span>👥 Gestionar Miembros</span>
                                </div>
                            </div>
                        )}

                        {/* Canales */}
                        <div className="sidebar-section">
                            <div
                                className="sidebar-section__title"
                                onClick={() => setIsCreatingChannel(false)}
                            >
                                <span>▾ Canales</span>
                            </div>

                            <ul className="channel-list">
                                {channels.map(channel => (
                                    <li
                                        key={channel._id}
                                        className={`channel-item-container ${channel_id === channel._id ? 'active' : ''}`}
                                    >
                                        <Link
                                            to={`/workspace/${workspace_id}/channel/${channel._id}`}
                                            className="channel-link"
                                        >
                                            <span className="channel-link__hash">#</span>
                                            <span className="channel-link__name">{channel.name}</span>
                                        </Link>
                                        {isAdmin && (
                                            <button
                                                className="channel-delete-btn"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    handleDeleteChannel(channel._id, channel.name)
                                                }}
                                                title="Eliminar canal"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </li>
                                ))}

                                <li
                                    className="add-channel-item"
                                    onClick={() => setIsCreatingChannel(v => !v)}
                                >
                                    <span className="add-channel-item__plus">+</span>
                                    Agregar canales
                                </li>
                            </ul>

                            {isCreatingChannel && (
                                <form className="create-channel-form" onSubmit={handleCreateChannel}>
                                    <input
                                        autoFocus
                                        value={newChannelName}
                                        onChange={e => setNewChannelName(e.target.value)}
                                        placeholder="Nombre del canal"
                                    />
                                </form>
                            )}
                        </div>

                        {/* Lista de Miembros en Sidebar */}
                        <div className="sidebar-section">
                            <div className="sidebar-section__title">
                                <span>▾ Miembros</span>
                            </div>
                            <ul className="channel-list" style={{ marginTop: '4px' }}>
                                {members.map(m => (
                                    <li key={m._id} style={{ padding: '4px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#bbc0c4', fontSize: '15px' }}>
                                            <span style={{ fontSize: '12px' }}>👤</span>
                                            <span style={{ color: '#bbc0c4' }}>{m.fk_id_user?.username || 'Usuario'}</span>
                                        </div>
                                        <span style={{ fontSize: '10px', color: '#bbc0c4', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                            {m.role}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Mensajes directos */}
                        <div className="sidebar-section">
                            <div className="sidebar-section__title">
                                <span>▾ Mensajes directos</span>
                            </div>
                            <div className="dm-list">
                                <div className="dm-item">
                                    <span className="dm-item__dot dm-item__dot--online">●</span>
                                    <span className="dm-item__name">
                                        {workspace?.owner_name ?? 'Tú'}
                                    </span>
                                </div>
                                <div className="dm-item">
                                    <span className="dm-item__dot dm-item__dot--offline">○</span>
                                    <span className="dm-item__name">Slackbot</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </aside>

                {/* CHAT */}
                <main className="workspace-chat">

                    {/* Channel header */}
                    <header className="chat-header">
                        <div className="chat-header__left">
                            <h3 className="chat-header__name">
                                # {currentChannel ? currentChannel.name : ''}
                            </h3>
                            {currentChannel && isAdmin && (
                                <button className="tbar-btn" onClick={openChannelSettings} title="Renombrar Canal" style={{ marginLeft: '10px' }}>
                                    ✏️
                                </button>
                            )}
                        </div>

                    </header>

                    {/* Messages */}
                    <div className="chat-messages">
                        {messages.length === 0 && currentChannel && (
                            <div className="chat-welcome">
                                <h2>¡Te damos la bienvenida al canal <strong>{currentChannel.name}</strong>!</h2>
                                <p>Este es el comienzo del canal <strong>{currentChannel.name}</strong>.</p>
                            </div>
                        )}

                        {messages.map(msg => {
                            const isMyMessage = session && msg.fk_workspace_member_id.fk_id_user._id === session.id;
                            return (
                                <div key={msg._id} className={`message-item ${isMyMessage ? 'message-item--sent' : 'message-item--received'}`}>
                                    <div className="message-item__avatar">
                                        {msg.fk_workspace_member_id.fk_id_user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="message-item__body">
                                        <div className="message-item__meta">
                                            <span className="message-item__author">
                                                {msg.fk_workspace_member_id.fk_id_user.username}
                                            </span>
                                            <span className="message-item__time">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="message-item__text">{msg.mensaje}</div>
                                    </div>
                                    <div className="message-item__actions">
                                        {(isAdmin || isMyMessage) && (
                                            <button className="del-msg-btn" onClick={() => handleDeleteMessage(msg._id)} title="Eliminar mensaje">
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Input */}
                    <div className="chat-input-area">
                        <div className="chat-input-box">
                            {/* Toolbar superior */}
                            <div className="chat-input-box__toolbar-top">
                                <button className="tbar-btn"><b>B</b></button>
                                <button className="tbar-btn"><i>I</i></button>
                                <button className="tbar-btn"><u>U</u></button>
                                <button className="tbar-btn"><s>S</s></button>
                                <span className="tbar-divider" />
                                <button className="tbar-btn">🔗</button>
                                <button className="tbar-btn">☰</button>
                                <button className="tbar-btn">✓☰</button>
                                <span className="tbar-divider" />
                                <button className="tbar-btn">{ }</button>
                                <button className="tbar-btn">📎</button>
                            </div>

                            {/* Textfield */}
                            <form onSubmit={handleSendMessage} className="chat-input-box__form">
                                <input
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder={`Mensaje #${currentChannel ? currentChannel.name : ''}`}
                                />
                            </form>

                            {/* Toolbar inferior */}
                            <div className="chat-input-box__toolbar-bottom">
                                <div className="chat-input-box__toolbar-bottom-left">
                                    <button className="tbar-btn">+</button>
                                    <button className="tbar-btn">Aa</button>
                                    <button className="tbar-btn">😊</button>
                                    <button className="tbar-btn">@</button>
                                    <button className="tbar-btn">📁</button>
                                    <button className="tbar-btn">📝</button>
                                </div>
                                <div className="chat-input-box__toolbar-bottom-right">
                                    <button
                                        className="send-btn"
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                    >
                                        ➤
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>

            {/* Modals */}
            {isWorkspaceSettingsOpen && (
                <div className="ws-modal-overlay">
                    <div className="ws-modal-content">
                        <h2>Actualizar Workspace</h2>
                        <form onSubmit={handleUpdateWorkspace}>
                            <input
                                autoFocus
                                value={editWorkspaceTitle}
                                onChange={e => setEditWorkspaceTitle(e.target.value)}
                                placeholder="Nuevo nombre del workspace"
                                className="ws-modal-input"
                            />
                            <div className="ws-modal-actions">
                                <button type="button" onClick={() => setIsWorkspaceSettingsOpen(false)} className="cancel-btn">Cancelar</button>
                                <button type="submit" className="save-btn">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isChannelSettingsOpen && (
                <div className="ws-modal-overlay">
                    <div className="ws-modal-content">
                        <h2>Renombrar Canal</h2>
                        <form onSubmit={handleRenameChannel}>
                            <input
                                autoFocus
                                value={editChannelName}
                                onChange={e => setEditChannelName(e.target.value)}
                                placeholder="Nuevo nombre del canal"
                                className="ws-modal-input"
                            />
                            <div className="ws-modal-actions">
                                <button type="button" onClick={() => setIsChannelSettingsOpen(false)} className="cancel-btn">Cancelar</button>
                                <button type="submit" className="save-btn">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Miembros */}
            {isMembersModalOpen && (
                <div className="ws-modal-overlay">
                    <div className="ws-modal-content members-modal">
                        <h2>Miembros del Workspace</h2>
                        {isAdmin && (
                            <div className="invite-section" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
                                <h4 style={{ marginTop: 0, marginBottom: '10px', color: '#1d1c1d' }}>Invitar Nuevo Miembro</h4>
                                <form onSubmit={handleInviteMember} style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={e => setInviteEmail(e.target.value)}
                                        placeholder="Correo electrónico"
                                        className="ws-modal-input"
                                        style={{ flex: 1, margin: 0 }}
                                        required
                                    />
                                    <select
                                        value={inviteRole}
                                        onChange={e => setInviteRole(e.target.value)}
                                        className="role-select"
                                    >
                                        <option value="Member">Miembro</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                    <button type="submit" className="save-btn" style={{ padding: '8px 16px', margin: 0 }}>Invitar</button>
                                </form>
                            </div>
                        )}

                        <div className="members-list">
                            {members.map(m => (
                                <div key={m._id} className="member-row">
                                    <div className="member-info">
                                        <strong>{m.fk_id_user?.username}</strong>
                                        <span>({m.fk_id_user?.email})</span>
                                    </div>
                                    <div className="member-actions">
                                        {isAdmin ? (
                                            <>
                                                <select
                                                    value={m.role}
                                                    onChange={(e) => handleUpdateMemberRole(m._id, e.target.value)}
                                                    className="role-select"
                                                >
                                                    <option value="Member">Miembro</option>
                                                    <option value="Admin">Admin</option>
                                                    <option value="Owner">Owner</option>
                                                </select>
                                                <button className="remove-member-btn" onClick={() => handleRemoveMember(m._id)}>Expulsar</button>
                                            </>
                                        ) : (
                                            <span style={{ fontSize: '13px', color: '#616061' }}>{m.role}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="ws-modal-actions mt-20">
                            <button type="button" onClick={() => setIsMembersModalOpen(false)} className="cancel-btn">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

        </div >
    )
}

export default WorkspaceScreen