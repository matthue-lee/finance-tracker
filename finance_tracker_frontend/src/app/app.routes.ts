// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PdfUploadComponent } from './pdf-upload/pdf-upload.component';  // Add your component imports
import { HomeComponent } from './home/home.component';
import { TransactionsComponent } from './transactions/transactions.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Home route
  { path: 'pdf-upload', component: PdfUploadComponent },  // Upload PDF route
  { path: 'transactions', component: TransactionsComponent },  // About route
];
