const projects = [
    {
        id: 'p1', name: 'Inventory Redesign', status: 'active',
        tech: ['React', 'Node'], lead: 'u2',
        description: 'Rebuilding the inventory module UI from scratch.',
        team: ['u1', 'u2', 'u3']
    },
    {
        id: 'p2', name: 'Auth Migration', status: 'done',
        tech: ['TypeScript', 'JWT'], lead: 'u1',
        description: 'Migrated from cookie sessions to signed JWTs.',
        team: ['u1', 'u4']
    },
    {
        id: 'p3', name: 'Data Pipeline', status: 'planning',
        tech: ['Python', 'PostgreSQL'], lead: 'u3',
        description: 'ETL pipeline for the new reporting dashboard.',
        team: ['u3', 'u5']
    },
]

const articles = [
    {
        id: 'a1', title: 'Q2 Engineering Review', author: 'u1',
        date: '2025-06-01',
        body: 'We shipped three major features this quarter: the redesigned inventory UI, the auth migration, and the first phase of the data pipeline. Here is what went well and what we would do differently.'
    },
    {
        id: 'a2', title: 'New Onboarding Process', author: 'u4',
        date: '2025-05-15',
        body: 'Starting June, all new engineers will complete a two-week onboarding track before joining a project team. The track covers tooling, codebase orientation, and one starter task per area.'
    },
    {
        id: 'a3', title: 'Tooling Update: Bun Replaces npm', author: 'u2',
        date: '2025-04-30',
        body: 'After a month-long evaluation, the team has standardised on Bun as the package manager and runtime for all TypeScript projects. Existing projects will migrate over Q3.'
    },
]

const team = [
    { id: 'u1', name: 'Alice Nakamura', role: 'Tech Lead', dept: 'Engineering' },
    { id: 'u2', name: 'Ben Okafor', role: 'Frontend Engineer', dept: 'Engineering' },
    { id: 'u3', name: 'Carol Singh', role: 'Backend Engineer', dept: 'Engineering' },
    { id: 'u4', name: 'Dan Park', role: 'Engineering Manager', dept: 'Leadership' },
    { id: 'u5', name: 'Elena Russo', role: 'Data Engineer', dept: 'Data' },
]

// Auth — hardcoded for this capstone
const credentials = [
    { userId: 'u1', username: 'alice', password: 'pass123' },
    { userId: 'u2', username: 'ben', password: 'pass123' },
]

module.exports = { projects, articles, team, credentials }