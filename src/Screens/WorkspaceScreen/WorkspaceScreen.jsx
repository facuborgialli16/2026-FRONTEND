import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
// Link removed
import useRequest from '../../hooks/useRequest'
import './WorkspaceScreen.css'

const WorkspaceScreen = () => {
    const { workspace_id } = useParams()
    const navigate = useNavigate()

    // State
    const [workspace, setWorkspace] = useState(null)
    const [channels, setChannels] = useState([])
    const [members, setMembers] = useState([])
    const [currentChannel, setCurrentChannel] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')

    // UI State
    const [isCreatingChannel, setIsCreatingChannel] = useState(false)
    const [newChannelName, setNewChannelName] = useState('')

    // API Hooks (Assuming generic hook implies I need to write specific requests here or import them? 
    // I'll inline fetch calls for now or assume a service exists. 
    // Actually, I should probably check for services. 
    // workspaceService has getById? NO.
    // I will write fetch logic here for speed, or add to service. 
    // Let's add simple helpers here or standard fetch.)
    const URL_API = import.meta.env.VITE_API_URL
    const getHeaders = () => ({
        'x-api-key': import.meta.env.VITE_API_KEY,
        'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
        'Content-Type': 'application/json'
    })

    // Fetch Workspace Info
    useEffect(() => {
        const fetchWorkspaceInfo = async () => {
            try {
                // Get Workspace Details (using getById endpoint verified in backend)
                const resWs = await fetch(`${URL_API}/api/workspace/${workspace_id}`, { headers: getHeaders() })
                const dataWs = await resWs.json()
                if (dataWs.ok) setWorkspace(dataWs.data.workspace)

                // Get Channels
                const resCh = await fetch(`${URL_API}/api/workspace/${workspace_id}/channels`, { headers: getHeaders() })
                const dataCh = await resCh.json()
                if (dataCh.ok) {
                    setChannels(dataCh.data.channels)
                    if (dataCh.data.channels.length > 0) {
                        setCurrentChannel(dataCh.data.channels[0])
                    }
                }
            } catch (e) { console.error(e) }
        }
        fetchWorkspaceInfo()
    }, [workspace_id])

    // Fetch Messages when Channel Changes
    useEffect(() => {
        if (!currentChannel) return
        const fetchMessages = async () => {
            try {
                const res = await fetch(`${URL_API}/api/workspace/${workspace_id}/channels/${currentChannel._id}/messages`, { headers: getHeaders() })
                const data = await res.json()
                if (data.ok) setMessages(data.data.messages)
            } catch (e) { console.error(e) }
        }
        fetchMessages()
        // Poll for messages every 3s? Or just fetch once. User didn't ask for realtime but "chat". 
        // Simple polling for now
        const interval = setInterval(fetchMessages, 3000)
        return () => clearInterval(interval)
    }, [currentChannel, workspace_id])

    // Send Message
    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !currentChannel) return
        try {
            await fetch(`${URL_API}/api/workspace/${workspace_id}/channels/${currentChannel._id}/messages`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ content: newMessage })
            })
            setNewMessage('')
            // Refetch immediately
            const res = await fetch(`${URL_API}/api/workspace/${workspace_id}/channels/${currentChannel._id}/messages`, { headers: getHeaders() })
            const data = await res.json()
            if (data.ok) setMessages(data.data.messages)
        } catch (e) { console.error(e) }
    }

    // Create Channel
    const handleCreateChannel = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${URL_API}/api/workspace/${workspace_id}/channels`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ name: newChannelName })
            })
            const data = await res.json()
            if (data.ok) {
                setChannels([...channels, data.data.channel_created])
                setIsCreatingChannel(false)
                setNewChannelName('')
            }
        } catch (e) { console.error(e) }
    }


    return (
        <div className="workspace-layout">
            {/* Top Navigation Bar */}
            <nav className="workspace-top-navbar">
                <div className="top-nav-left"></div>
                <div className="top-nav-center">
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input type="text" placeholder={`Buscar en ${workspace ? workspace.title : 'Workspace'}`} />
                    </div>
                </div>
                <div className="top-nav-right">
                    <div className="user-avatar-small">
                        {/* Placeholder for user avatar */}
                        U
                    </div>
                </div>
            </nav>

            <div className="workspace-body">
                {/* Side Rail (Mini Sidebar) */}
                <div className="workspace-rail">
                    <div className="rail-item active">
                        {workspace ? workspace.title.charAt(0).toUpperCase() : 'W'}
                    </div>
                    <div className="rail-item">
                        +
                    </div>
                </div>

                {/* Main Sidebar */}
                <aside className="workspace-sidebar">
                    <div className="sidebar-header">
                        <h2>{workspace ? workspace.title : 'Loading...'}
                            <span className="chevron-down">▼</span>
                        </h2>
                    </div>

                    <div className="sidebar-scroll-area">
                        {/* Channels Section */}
                        <div className="sidebar-section">
                            <div className="section-title">
                                <span className="section-header-content">▼ Canales</span>
                            </div>

                            <ul className="channel-list">
                                {channels.map(channel => (
                                    <li
                                        key={channel._id}
                                        className={currentChannel && currentChannel._id === channel._id ? 'active' : ''}
                                        onClick={() => setCurrentChannel(channel)}
                                    >
                                        <span className="channel-hash">#</span> {channel.name}
                                    </li>
                                ))}
                                <li className="add-channel-item" onClick={() => setIsCreatingChannel(!isCreatingChannel)}>
                                    <div className="add-icon">+</div> Agregar canales
                                </li>
                            </ul>
                            {isCreatingChannel && (
                                <form onSubmit={handleCreateChannel} className="create-channel-form">
                                    <input
                                        autoFocus
                                        value={newChannelName}
                                        onChange={(e) => setNewChannelName(e.target.value)}
                                        placeholder="Nombre del canal"
                                    />
                                </form>
                            )}
                        </div>

                        {/* Direct Messages Section */}
                        <div className="sidebar-section">
                            <div className="section-title">
                                <span className="section-header-content">▼ Mensajes directos</span>
                            </div>
                            <div className="member-list-placeholder">
                                {/* Placeholder members */}
                                <div className="dm-item">
                                    <span className="status-indicator online">●</span> Facundo Borgialli (tú)
                                </div>
                                <div className="dm-item">
                                    <span className="status-indicator offline">○</span> Slackbot
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Chat Area */}
                <main className="workspace-chat">
                    <header className="chat-header">
                        <div className="chat-header-left">
                            <h3>#{currentChannel ? currentChannel.name : 'Select a channel'}</h3>
                        </div>
                        <div className="chat-header-right">
                            {/* Member count or details icon could go here */}
                        </div>
                    </header>

                    <div className="chat-messages">
                        {messages.length === 0 && currentChannel && (
                            <div className="empty-chat">
                                <div className="empty-chat-icon">#</div>
                                <h3>¡Te damos la bienvenida a #{currentChannel.name}!</h3>
                                <p>Este es el comienzo del canal #{currentChannel.name}.</p>
                            </div>
                        )}
                        {messages.map(msg => (
                            <div key={msg._id} className="message-item">
                                <div className="message-avatar">
                                    {msg.fk_workspace_member_id.fk_id_user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="message-content">
                                    <div className="message-sender">
                                        {msg.fk_workspace_member_id.fk_id_user.username}
                                        <span className="message-time">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="message-text">{msg.mensaje}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="chat-input-container">
                        <div className="chat-input-wrapper">
                            <div className="rich-text-toolbar-top">
                                <button className="toolbar-btn"><b>B</b></button>
                                <button className="toolbar-btn"><i>I</i></button>
                                <button className="toolbar-btn"><s>S</s></button>
                                <button className="toolbar-btn">🔗</button>
                            </div>
                            <form onSubmit={handleSendMessage}>
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={`Enviar un mensaje a #${currentChannel ? currentChannel.name : '...'}`}
                                />
                                <button type="submit" style={{ display: 'none' }}></button>
                            </form>
                            <div className="rich-text-toolbar-bottom">
                                <div className="toolbar-left">
                                    <button className="toolbar-icon-btn">+</button>
                                    <button className="toolbar-icon-btn">Aa</button>
                                    <button className="toolbar-icon-btn">@</button>
                                </div>
                                <div className="toolbar-right">
                                    <button className="send-btn-icon" onClick={handleSendMessage}>➤</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )

}

export default WorkspaceScreen
