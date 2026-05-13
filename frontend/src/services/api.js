const API_URL = 'http://localhost:3000/api';

export function getUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

export function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new Event('storage'));
}

export function logout() {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
}

async function fetchWrapper(url, options = {}) {
    options.headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    const response = await fetch(`${API_URL}${url}`, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || 'Server error');
    }
    return data;
}

export async function login(email, password) {
    const data = await fetchWrapper('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    setUser(data);
    return data;
}

export async function register(name, email, password, gender, dob) {
    const data = await fetchWrapper('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, gender, dob })
    });
    setUser(data);
    return data;
}

export async function getProfile() {
    const user = getUser();
    if (!user) throw new Error('Not logged in');
    return await fetchWrapper(`/profile?id=${user.id}`);
}

export async function updateProfile(profileData) {
    const user = getUser();
    if (!user) throw new Error('Not logged in');
    const data = await fetchWrapper(`/profile`, {
        method: 'PUT',
        body: JSON.stringify({ ...profileData, id: user.id })
    });
    setUser({ ...user, name: profileData.name, email: profileData.email, gender: profileData.gender, dob: profileData.dob });
    return data;
}

export async function getSurveys() {
    return await fetchWrapper('/surveys');
}

export async function getSurveyById(id) {
    return await fetchWrapper(`/surveys/${id}`);
}

export async function createSurvey(surveyData) {
    const user = getUser();
    if (!user) throw new Error('Not logged in');
    return await fetchWrapper('/surveys', {
        method: 'POST',
        body: JSON.stringify({ ...surveyData, user_id: user.id })
    });
}

export async function submitAnswers(answers) {
    return await fetchWrapper('/surveys/answers', {
        method: 'POST',
        body: JSON.stringify({ answers })
    });
}

export async function getSurveysByUser(userId) {
    return await fetchWrapper(`/surveys/user/${userId}`);
}

export async function getSurveyResults(id) {
    return await fetchWrapper(`/surveys/${id}/results`);
}
