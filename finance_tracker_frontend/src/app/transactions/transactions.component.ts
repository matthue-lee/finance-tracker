import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';  // To check if the platform is browser
import { CsvFetchService } from '../services/csv-fetch.service';
import { HttpClient } from '@angular/common/http';    // Import HttpClient for making API calls
import { Chart, registerables } from 'chart.js';      // Import Chart.js
import { CommonModule } from '@angular/common';       // Import CommonModule for *ngIf and *ngFor
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';  // Import the spinner module

@Component({
  selector: 'app-transactions',
  standalone: true,                                  // Mark the component as standalone
  imports: [CommonModule, MatProgressSpinnerModule],                           // Ensure CommonModule is imported to use *ngIf and *ngFor
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements AfterViewInit {
  transactions: any[] = [];
  fetchError: boolean = false;
  chart: any;
  loading: boolean = false;  // Add a loading state


  constructor(
    private csvFetchService: CsvFetchService,
    private http: HttpClient,  // Inject HttpClient to call your update CSV API
    @Inject(PLATFORM_ID) private platformId: Object  // Inject PLATFORM_ID to detect the environment
  ) {
    Chart.register(...registerables);  // Register Chart.js components
  }

  ngOnInit() {
    this.fetchCSVData();
  }

  ngAfterViewInit() {
    // After the view (DOM) is fully initialized, you can safely manipulate the canvas
    if (isPlatformBrowser(this.platformId)) {
      this.createSpendingChart();
    }
  }

  // Method to refresh transactions and update categories
  refreshTransactions() {
    // Call your backend API to update the CSV categories
    this.http.get('http://localhost:8000/api/update-csv-category/')  // Adjust the API URL
      .subscribe(
        (response) => {
          console.log('CSV categories updated successfully', response);
          this.fetchCSVData();  // Refresh the transactions after the CSV is updated
        },
        (error) => {
          console.error('Error updating CSV categories', error);
        }
      );
  }

  fetchCSVData() {
    this.loading = true;  // Set loading to true when fetching data
    this.csvFetchService.fetchCSV().subscribe(
      (response) => {
        this.transactions = response;
        this.loading = false;  // Set loading to false when data is received
        this.createSpendingChart();
      },
      (error) => {
        console.error('Error fetching CSV data', error);
        this.fetchError = true;
        this.loading = false;  // Set loading to false in case of error
      }
    );
  }
  createSpendingChart() {
    // Filter transactions to exclude income categories
    const spendingTransactions = this.transactions.filter(transaction => transaction.Category !== 'Income');

    // Aggregate spending by category
    const spendingByCategory: { [key: string]: number } = {};
    spendingTransactions.forEach(transaction => {
      const category = transaction.Category;
      const amount = Math.abs(transaction.Amount);  // Get absolute value of spending

      if (spendingByCategory[category]) {
        spendingByCategory[category] += amount;
      } else {
        spendingByCategory[category] = amount;
      }
    });

    const specificColors = [
      '#264653', // Color 1
      '#2a9d8f', // Color 2
      '#e9c46a', // Color 3
      '#f4a261', // Color 4
      '#e76f51'  // Color 5
    ];

    // Check if running in a browser environment and the canvas exists
    if (isPlatformBrowser(this.platformId)) {
      const canvas = document.getElementById('spendingChart') as HTMLCanvasElement;
      const ctx = canvas?.getContext('2d');

      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: Object.keys(spendingByCategory),  // Category labels
            datasets: [{
              data: Object.values(spendingByCategory),  // Spending amounts
              backgroundColor: specificColors  // Specific colors
            }]
          },
          options: {
            responsive: true
          }
        });
      } else {
        console.error('Canvas context not available; skipping chart rendering.');
      }
    } else {
      console.warn('Document is not available; skipping chart rendering.');
    }
  }
}
