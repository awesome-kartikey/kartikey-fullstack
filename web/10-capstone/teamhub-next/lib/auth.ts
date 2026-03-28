import { credentials, getProjectsForUser, team } from '@/lib/data'

export const SESSION_COOKIE_NAME = 'session'

export function validateCredentials(username: string, password: string) {
    return (
        credentials.find(
            (credential) =>
                credential.username === username && credential.password === password
        ) ?? null
    )
}

export function getUserById(userId: string) {
    return team.find((member) => member.id === userId) ?? null
}

export function getUserFromSessionValue(sessionValue?: string) {
    if (!sessionValue) {
        return null
    }

    return getUserById(sessionValue)
}

export function getProfilePayload(userId: string) {
    const user = getUserById(userId)

    if (!user) {
        return null
    }

    return {
        user,
        projects: getProjectsForUser(userId),
    }
}
