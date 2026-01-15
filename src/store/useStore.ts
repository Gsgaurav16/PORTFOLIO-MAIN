import { create } from 'zustand';
import {
    projectsApi,
    skillsApi,
    experiencesApi,
    socialsApi,
    profileApi,
    reviewsApi,
    type Project,
    type Skill,
    type Experience,
    type SocialLink,
    type Profile,
    type Review
} from '../services/api';

// --- Types ---
interface PortfolioState {
    projects: Project[];
    skills: Skill[];
    experiences: Experience[];
    socials: SocialLink[];
    reviews: Review[];
    profile: Profile;
    isLoading: boolean;
    error: string | null;
    hasFetched: boolean;

    // Actions
    fetchAllData: () => Promise<void>;
    refreshData: () => void;
}

// Default initial state with Hardcoded Seed Data for Instant Load
const defaultProfile: Profile = {
    id: "static-init",
    name: "Gaurav",
    role: "Dev & Creator",
    bio: "Building clean UI, scalable backends, and creative tech.",
    years: "5+",
    projects_count: "42",
    awesomeness: "100%",
    expertise: ['Frontend', 'Backend', 'UI/UX']
};

// Helper: Fetch with retry
const fetchWithRetry = async <T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000
): Promise<T> => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            console.warn(`Fetch failed, retrying in ${delay}ms... (${i + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
    throw new Error('Fetch failed after retries');
};

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
    projects: [],
    skills: [],
    experiences: [],
    socials: [],
    reviews: [],
    profile: defaultProfile,
    isLoading: false,
    error: null,
    hasFetched: false,

    fetchAllData: async () => {
        if (get().hasFetched) return; // Prevent refetching if already done

        set({ isLoading: true, error: null });

        try {
            // 1. Fetch Profile FAST (Critical for Hero)
            // We use the static defaultProfile initially, but updated it if API returns new data
            fetchWithRetry(() => profileApi.get())
                .then((res) => {
                    if (res.data) set({ profile: res.data });
                })
                .catch(err => console.error("Profile fetch silent fail:", err));

            // 2. Fetch Heavy Data in Background (Parallel)
            const [
                projectsRes,
                skillsRes,
                expRes,
                socialsRes,
                reviewsRes
            ] = await Promise.all([
                fetchWithRetry(() => projectsApi.getAll()),
                fetchWithRetry(() => skillsApi.getAll()),
                fetchWithRetry(() => experiencesApi.getAll()),
                fetchWithRetry(() => socialsApi.getAll()),
                fetchWithRetry(() => reviewsApi.getAll()),
            ]);

            set({
                projects: projectsRes.data || [],
                skills: skillsRes.data || [],
                experiences: expRes.data || [],
                socials: socialsRes.data || [],
                reviews: reviewsRes.data || [],
                isLoading: false,
                hasFetched: true
            });
        } catch (error) {
            console.error('Failed to fetch portfolio data:', error);
            // Don't block the UI with full error screen if we have static data
            // Just mark loading as false
            set({
                isLoading: false,
                // Only show global error if EVERYTHING failed and we have no static fallback (unlikely with hardcoded profile)
                error: 'Connection unstable. Some data may be missing.'
            });
        }
    },

    // Reset hasFetched to force refetch on next homepage visit
    refreshData: () => {
        set({ hasFetched: false });
    }
}));
