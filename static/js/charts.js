// Chart.js rendering logic will go here
let deceasedChartInstance = null;
let ageChartInstance = null;
let genderChartInstance = null;
let statusChartInstance = null;

function renderDeceasedChart(ctx, labels, data) {
    if (deceasedChartInstance) deceasedChartInstance.destroy();
    deceasedChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Fallecidos',
                data: data,
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { grid: { color: '#4B5563' }, ticks: { color: '#9CA3AF' } },
                x: { grid: { display: false }, ticks: { color: '#9CA3AF' } }
            }
        }
    });
}

function renderAgeChart(ctx, labels, data) {
    if (ageChartInstance) ageChartInstance.destroy();
    ageChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Casos',
                data: data,
                backgroundColor: '#3B82F6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { grid: { color: '#4B5563' }, ticks: { color: '#9CA3AF' } },
                x: { grid: { display: false }, ticks: { color: '#9CA3AF' } }
            }
        }
    });
}

function renderGenderChart(ctx, labels, data) {
    if (genderChartInstance) genderChartInstance.destroy();
    genderChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#3B82F6', '#EC4899'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#9CA3AF' } }
            }
        }
    });
}

function renderStatusChart(ctx, labels, data) {
    if (statusChartInstance) statusChartInstance.destroy();
    statusChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#EF4444', '#10B981', '#F59E0B'], // Fallecido, Recuperado, Activo
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#9CA3AF' } }
            }
        }
    });
}
