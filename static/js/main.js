// Main dashboard logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard initialized');
    initTheme();
    initDashboard();
});

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // Change the icons inside the button based on previous settings
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        themeToggleLightIcon.classList.remove('hidden');
        document.documentElement.classList.add('dark');
    } else {
        themeToggleDarkIcon.classList.remove('hidden');
        document.documentElement.classList.remove('dark');
    }

    themeToggleBtn.addEventListener('click', function () {
        // toggle icons inside button
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');

        // if set via local storage previously
        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }

            // if NOT set via local storage previously
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }
    });
}

let locationsData = {};

async function initDashboard() {
    await loadLocations();
    setupEventListeners();
    updateDashboard();
}

async function loadLocations() {
    locationsData = await fetchLocations();
    const deptSelect = document.getElementById('department-filter');

    Object.keys(locationsData).sort().forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        deptSelect.appendChild(option);
    });
}

function setupEventListeners() {
    const deptSelect = document.getElementById('department-filter');
    const citySelect = document.getElementById('city-filter');
    const genderSelect = document.getElementById('gender-filter');

    deptSelect.addEventListener('change', () => {
        const selectedDept = deptSelect.value;
        citySelect.innerHTML = '<option value="">Todas</option>';

        if (selectedDept && locationsData[selectedDept]) {
            locationsData[selectedDept].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
        updateDashboard();
    });

    citySelect.addEventListener('change', updateDashboard);
    genderSelect.addEventListener('change', updateDashboard);
}

function getFilters() {
    return {
        department: document.getElementById('department-filter').value,
        city: document.getElementById('city-filter').value,
        gender: document.getElementById('gender-filter').value
    };
}

async function updateDashboard() {
    const filters = getFilters();

    // Fetch all data in parallel
    const [summary, timeline, demographics] = await Promise.all([
        fetchSummary(filters),
        fetchTimeline(filters),
        fetchDemographics(filters)
    ]);

    updateKPIs(summary);
    updateCharts(summary, timeline, demographics);
}

function updateKPIs(summary) {
    document.getElementById('total-cases').textContent = summary.total_cases.toLocaleString();
    document.getElementById('total-deceased').textContent = summary.deceased.toLocaleString();
    document.getElementById('total-recovered').textContent = summary.recovered.toLocaleString();
    document.getElementById('total-active').textContent = summary.active.toLocaleString();
}

function updateCharts(summary, timeline, demographics) {
    // Deceased Chart
    const deceasedCtx = document.getElementById('deceased-chart').getContext('2d');
    renderDeceasedChart(deceasedCtx, timeline.dates, timeline.values);

    // Age Chart
    const ageCtx = document.getElementById('age-chart').getContext('2d');
    renderAgeChart(ageCtx, demographics.labels, demographics.values);

    // Gender Chart
    const genderCtx = document.getElementById('gender-chart').getContext('2d');
    const genderLabels = Object.keys(summary.gender);
    const genderValues = Object.values(summary.gender);
    renderGenderChart(genderCtx, genderLabels, genderValues);

    // Status Chart
    const statusCtx = document.getElementById('status-chart').getContext('2d');
    const statusLabels = Object.keys(summary.status);
    const statusValues = Object.values(summary.status);
    renderStatusChart(statusCtx, statusLabels, statusValues);
}

