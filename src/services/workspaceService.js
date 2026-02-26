import { ServerError } from "../utils/errorUtils"

const URL_API = import.meta.env.VITE_API_URL
export async function getWorkspaceList() {
    const response_http = await fetch(
        URL_API + '/api/workspace',
        {
            method: 'GET',
            headers: {
                'x-api-key': import.meta.env.VITE_API_KEY,
                'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
            },
        }
    )
    const response = await response_http.json()
    if (!response.ok) {
        throw new ServerError(response.message, response.status)
    }
    return response
}

export async function createWorkspace(workspace_data) {
    const response_http = await fetch(
        URL_API + '/api/workspace',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': import.meta.env.VITE_API_KEY,
                'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
            },
            body: JSON.stringify(workspace_data)
        }
    )
    const response = await response_http.json()
    if (!response.ok) {
        throw new ServerError(response.message, response.status)
    }
    return response
}

export async function updateWorkspace(workspace_id, data) {
    const response_http = await fetch(`${URL_API}/api/workspace/${workspace_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
        },
        body: JSON.stringify(data)
    })
    const response = await response_http.json()
    if (!response.ok) throw new ServerError(response.message, response.status)
    return response
}

export async function deleteMember(workspace_id, member_id) {
    const response_http = await fetch(`${URL_API}/api/workspace/${workspace_id}/members/${member_id}`, {
        method: 'DELETE',
        headers: {
            'x-api-key': import.meta.env.VITE_API_KEY,
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
        }
    })
    const response = await response_http.json()
    if (!response.ok) throw new ServerError(response.message, response.status)
    return response
}

export async function updateMember(workspace_id, member_id, data) {
    const response_http = await fetch(`${URL_API}/api/workspace/${workspace_id}/members/${member_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
        },
        body: JSON.stringify(data)
    })
    const response = await response_http.json()
    if (!response.ok) throw new ServerError(response.message, response.status)
    return response
}

export async function updateChannel(workspace_id, channel_id, data) {
    const response_http = await fetch(`${URL_API}/api/workspace/${workspace_id}/channels/${channel_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
        },
        body: JSON.stringify(data)
    })
    const response = await response_http.json()
    if (!response.ok) throw new ServerError(response.message, response.status)
    return response
}

export async function deleteMessage(workspace_id, channel_id, message_id) {
    const response_http = await fetch(`${URL_API}/api/workspace/${workspace_id}/channels/${channel_id}/messages/${message_id}`, {
        method: 'DELETE',
        headers: {
            'x-api-key': import.meta.env.VITE_API_KEY,
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
        }
    })
    const response = await response_http.json()
    if (!response.ok) throw new ServerError(response.message, response.status)
    return response
}

export async function deleteChannel(workspace_id, channel_id) {
    const response_http = await fetch(`${URL_API}/api/workspace/${workspace_id}/channels/${channel_id}`, {
        method: 'DELETE',
        headers: {
            'x-api-key': import.meta.env.VITE_API_KEY,
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
        }
    })
    const response = await response_http.json()
    if (!response.ok) throw new ServerError(response.message, response.status)
    return response
}

export async function inviteMember(workspace_id, email, role) {
    const response_http = await fetch(`${URL_API}/api/workspace/${workspace_id}/members`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
        },
        body: JSON.stringify({ email, role })
    })
    const response = await response_http.json()
    if (!response.ok) throw new ServerError(response.message, response.status)
    return response
}