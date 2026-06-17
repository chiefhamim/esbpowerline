// Initialize charts when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Shared Chart Configuration
    Chart.defaults.color = '#A1A1AA';
    Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    // Initialize Generation Mix Chart (Doughnut)
    const genMixCtx = document.getElementById('generationMixChart');
    if (genMixCtx) {
        new Chart(genMixCtx, {
            type: 'doughnut',
            data: {
                labels: ['Gas', 'Coal', 'Furnace Oil', 'Solar', 'Hydro', 'Import'],
                datasets: [{
                    data: [45.2, 28.5, 12.3, 5.5, 1.5, 7.0],
                    backgroundColor: [
                        '#0070F3', // Gas (Primary Blue)
                        '#3F3F46', // Coal (Dark Gray)
                        '#F5A623', // Furnace Oil (Orange)
                        '#17C964', // Solar (Green)
                        '#3291FF', // Hydro (Light Blue)
                        '#8B5CF6'  // Import (Purple)
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Initialize Demand vs Generation Chart (Line)
    const demandVsGenCtx = document.getElementById('demandVsGenChart');
    if (demandVsGenCtx) {
        const labels = Array.from({length: 24}, (_, i) => `${i}:00`);
        
        // Mock data generator for smooth curves
        const genData = labels.map((_, i) => {
            const base = 12000;
            const peak = Math.sin(i / 24 * Math.PI) * 4000;
            return base + peak + (Math.random() * 500);
        });
        
        const demandData = genData.map((val, i) => {
            // Demand is slightly higher during peak hours (18:00 - 22:00)
            const isPeak = i >= 18 && i <= 22;
            return val + (isPeak ? (Math.random() * 800 + 200) : (Math.random() * 200 - 100));
        });

        new Chart(demandVsGenCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Generation (MW)',
                        data: genData,
                        borderColor: '#17C964',
                        backgroundColor: 'rgba(23, 201, 100, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHitRadius: 10
                    },
                    {
                        label: 'Demand (MW)',
                        data: demandData,
                        borderColor: '#0070F3',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHitRadius: 10
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.dataset.label}: ${Math.round(context.raw)} MW`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        min: 8000,
                        suggestedMax: 18000
                    }
                }
            }
        });
    }
});
