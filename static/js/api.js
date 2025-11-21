const API_BASE = '/api';

function buildQuery(filters) {
    const params = new URLSearchParams();
    if (filters.department) params.append('department', filters.department);
    if (filters.city) params.append('city', filters.city);
    if (filters.gender) params.append('gender', filters.gender);
    return params.toString() ? `?${params.toString()}` : '';
}

async function fetchSummary(filters = {}) {
    const query = buildQuery(filters);
    const response = await fetch(`${API_BASE}/summary${query}`);
    return await response.json();
}

async function fetchTimeline(filters = {}) {
    const query = buildQuery(filters);
    const response = await fetch(`${API_BASE}/timeline${query}`);
    return await response.json();
}

async function fetchDemographics(filters = {}) {
    const query = buildQuery(filters);
    const response = await fetch(`${API_BASE}/demographics${query}`);
    return await response.json();
}

async function fetchLocations() {
    const response = await fetch(`${API_BASE}/locations`);
    return await response.json();
}

