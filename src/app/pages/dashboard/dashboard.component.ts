import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Chart from 'chart.js/auto';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
    private charts: Chart[] = [];
    private apiUrl = 'http://127.0.0.1/sae301/api/boxes/dashboard.php';

    constructor(private http: HttpClient) { }

    ngAfterViewInit() {
        this.initCharts();
    }

    initCharts() {
        // Ventes Mensuelles (données statiques pour l'exemple)
        const salesChartElement = document.getElementById('salesChart') as HTMLCanvasElement | null;
        if (salesChartElement) {
            const c = new Chart(salesChartElement, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                    datasets: [{
                        label: 'Ventes',
                        // Données fictives pour les ventes mensuelles
                        data: [12000, 19000, 15000, 25000, 22000, 30000],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: true }
            });
            this.charts.push(c);
        }

        // Utilisateurs Actifs : récupérer le nombre de comptes depuis l'API
        const usersChartElement = document.getElementById('usersChart') as HTMLCanvasElement | null;
        if (usersChartElement) {
            // Appel API pour obtenir le nombre total d'utilisateurs
            this.http.get<{ count: number }>(this.apiUrl).subscribe({
                next: (res) => {
                    const count = res?.count ?? 0;
                    const c = new Chart(usersChartElement, {
                        type: 'bar',
                        data: {
                            labels: ['Comptes'],
                            datasets: [{
                                label: 'Nombre de comptes',
                                data: [count],
                                backgroundColor: '#2ecc71'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            scales: {
                                y: { beginAtZero: true }
                            }
                        }
                    });
                    this.charts.push(c);
                },
                error: (err) => {
                    console.error('Erreur en récupérant le nombre de comptes :', err);
                    // fallback : afficher 0 si erreur
                    const c = new Chart(usersChartElement, {
                        type: 'bar',
                        data: {
                            labels: ['Comptes'],
                            datasets: [{
                                label: 'Nombre de comptes',
                                data: [0],
                                backgroundColor: '#2ecc71'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            scales: {
                                y: { beginAtZero: true }
                            }
                        }
                    });
                    this.charts.push(c);
                }
            });
        }

        // Distribution des Boxes (doughnut) — labels = noms de boxes, data fictive
        const categoriesChartElement = document.getElementById('categoriesChart') as HTMLCanvasElement | null;
        if (categoriesChartElement) {
            const c = new Chart(categoriesChartElement, {
                type: 'doughnut',
                data: {
                    labels: ["Tasty Blend", "Amateur Mix", "Saumon Original", "Salmon Lovers", "Salmon Classic", "Master Mix", "Sunrise", "Sando Box Chicken Katsu","Sando Box Salmon Aburi","California Dream","Gourmet Mix","Fresh Mix"],
                    datasets: [{
                        data: [45, 25, 20, 10, 15, 20, 10, 5, 10, 15, 20, 25], // données fictives (en pourcentage ou unités)
                        backgroundColor: ['#e74c3c', '#f39c12', '#9b59b6', '#3498db', '#2ecc71', '#1abc9c', '#e67e22', '#d35400', '#27ae60', '#8e44ad', '#2980b9', '#c0392b'],
                        hoverBackgroundColor: ['#c0392b', '#d35400', '#8e44ad', '#2980b9', '#27ae60', '#16a085', '#d35400', '#e74c3c', '#2ecc71', '#9b59b6', '#3498db', '#e67e22']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label ?? '';
                                    const value = context.parsed ?? 0;
                                    return `${label}: ${value}`;
                                }
                            }
                        }
                    }
                }
            });
            this.charts.push(c);
        }

        // Performance
        const performanceChartElement = document.getElementById('performanceChart') as HTMLCanvasElement | null;
        if (performanceChartElement) {
            const c = new Chart(performanceChartElement, {
                type: 'radar',
                data: {
                    labels: ['satisfaction', 'Vitesse', 'Fiabilité', 'Support'],
                    datasets: [{
                        label: 'Performance',
                        data: [3, 4, 3, 5], // valeurs entre 1 et 5
                        backgroundColor: 'rgba(231, 76, 60, 0.2)',
                        borderColor: '#e74c3c',
                        pointBackgroundColor: '#e74c3c'
                    }]
                },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        scales: {
                            r: {
                                min: 1,
                                max: 5,
                            }
                        }
                    }
                });
            this.charts.push(c);
        }
    }

    ngOnDestroy() {
        // détruire les instances Chart pour nettoyer la mémoire
        this.charts.forEach(chart => chart.destroy());
        this.charts = [];
    }
}
