/**
 * API Service Layer
 * =================
 * Handles all HTTP requests to the backend
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Generic fetch wrapper with error handling
 */
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE}${endpoint}`;

    // Get token from localStorage
    const token = localStorage.getItem('token');

    const config: RequestInit = {
        ...options,
        credentials: 'include', // Keep for compatibility if needed
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // Add Auth header
            ...options.headers,
        },
    };

    const response = await fetch(url, config);

    // Handle 401 Unauthorized or 403 Forbidden (Invalid Token)
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        window.location.href = '/login';
        throw new Error('Session expired or invalid');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
}

// ==============================================
// AUTH API
// ==============================================

export const authApi = {
    login: (username: string, password: string) =>
        request<{ success: boolean; user: { id: string; username: string }; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        }),

    logout: () =>
        request<{ success: boolean }>('/auth/logout', { method: 'POST' }),

    verify: () =>
        request<{ success: boolean; valid: boolean; user: { id: string; username: string } }>('/auth/verify', { method: 'POST' }),

    me: () =>
        request<{ success: boolean; user: { id: string; username: string } }>('/auth/me'),

    changePassword: (currentPassword: string, newPassword: string) =>
        request<{ success: boolean; message: string }>('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword }),
        }),
};

// ==============================================
// PROJECTS API
// ==============================================

export interface Project {
    id: string;
    title: string;
    subtitle: string;
    stack: string[];
    features: string[];
    link?: string;
    image: string;
}

export const projectsApi = {
    getAll: () =>
        request<{ success: boolean; data: Project[] }>('/projects'),

    getById: (id: string) =>
        request<{ success: boolean; data: Project }>(`/projects/${id}`),

    create: (project: Omit<Project, 'id'>) =>
        request<{ success: boolean; data: Project }>('/projects', {
            method: 'POST',
            body: JSON.stringify(project),
        }),

    update: (id: string, project: Partial<Project>) =>
        request<{ success: boolean; data: Project }>(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(project),
        }),

    delete: (id: string) =>
        request<{ success: boolean }>(`/projects/${id}`, { method: 'DELETE' }),
};

// ==============================================
// SKILLS API
// ==============================================

export interface Skill {
    id: string;
    title: string;
    level: string;
    color: string;
    progress: number;
    totalSkills: number; // Changed from total_skills to match frontend
    equipment: string[];
    achievements: string[];
}

export const skillsApi = {
    getAll: () =>
        request<{ success: boolean; data: Skill[] }>('/skills'),

    create: (skill: Omit<Skill, 'id'>) =>
        request<{ success: boolean; data: Skill }>('/skills', {
            method: 'POST',
            body: JSON.stringify(skill),
        }),

    update: (id: string, skill: Partial<Skill>) =>
        request<{ success: boolean; data: Skill }>(`/skills/${id}`, {
            method: 'PUT',
            body: JSON.stringify(skill),
        }),

    delete: (id: string) =>
        request<{ success: boolean }>(`/skills/${id}`, { method: 'DELETE' }),
};

// ==============================================
// EXPERIENCES API
// ==============================================

export interface Experience {
    id: string;
    company: string;
    role: string;
    period: string;
    description: string;
    achievements: string[];
    stack: string[];
}

export const experiencesApi = {
    getAll: () =>
        request<{ success: boolean; data: Experience[] }>('/experiences'),

    create: (exp: Omit<Experience, 'id'>) =>
        request<{ success: boolean; data: Experience }>('/experiences', {
            method: 'POST',
            body: JSON.stringify(exp),
        }),

    update: (id: string, exp: Partial<Experience>) =>
        request<{ success: boolean; data: Experience }>(`/experiences/${id}`, {
            method: 'PUT',
            body: JSON.stringify(exp),
        }),

    delete: (id: string) =>
        request<{ success: boolean }>(`/experiences/${id}`, { method: 'DELETE' }),
};

// ==============================================
// SOCIALS API
// ==============================================

export interface SocialLink {
    id: string;
    platform: string;
    href: string;
    label: string;
}

export const socialsApi = {
    getAll: () =>
        request<{ success: boolean; data: SocialLink[] }>('/socials'),

    update: (platform: string, data: { href: string; label: string }) =>
        request<{ success: boolean; data: SocialLink }>(`/socials/${platform}`, {
            method: 'PUT',
            body: JSON.stringify({ platform, ...data }),
        }),
};

// ==============================================
// PROFILE API
// ==============================================

export interface Profile {
    id: string;
    name: string;
    role: string;
    bio: string;
    years: string;
    projects_count: string;
    awesomeness: string;
    expertise: string[];
}

export const profileApi = {
    get: () =>
        request<{ success: boolean; data: Profile | null }>('/profile'),

    update: (profile: Partial<Profile>) =>
        request<{ success: boolean; data: Profile }>('/profile', {
            method: 'PUT',
            body: JSON.stringify(profile),
        }),
};

// ==============================================
// MESSAGES API
// ==============================================

export interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export const messagesApi = {
    getAll: () =>
        request<{ success: boolean; data: Message[]; unreadCount: number }>('/messages'),

    send: (data: { name: string; email: string; message: string }) =>
        request<{ success: boolean; message: string }>('/messages', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    markRead: (id: string) =>
        request<{ success: boolean; data: Message }>(`/messages/${id}/read`, {
            method: 'PUT',
        }),

    delete: (id: string) =>
        request<{ success: boolean }>(`/messages/${id}`, { method: 'DELETE' }),
};

// ==============================================
// REVIEWS API (ARCADE REVIEWS)
// ==============================================

export interface Review {
    id: string;
    name: string;
    role: string;
    text: string;
    rating: number;
    created_at?: string;
}

export const reviewsApi = {
    getAll: () =>
        request<{ success: boolean; data: Review[] }>('/reviews'),

    create: (review: Omit<Review, 'id' | 'created_at'>) =>
        request<{ success: boolean; data: Review }>('/reviews', {
            method: 'POST',
            body: JSON.stringify(review),
        }),

    update: (id: string, review: Partial<Review>) =>
        request<{ success: boolean; data: Review }>(`/reviews/${id}`, {
            method: 'PUT',
            body: JSON.stringify(review),
        }),

    delete: (id: string) =>
        request<{ success: boolean }>(`/reviews/${id}`, { method: 'DELETE' }),
};
