// src/app/services/csv-fetch.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvFetchService {
  private fetchUrl = 'http://localhost:8000/api/fetch-csv/';  // Django API endpoint

  constructor(private http: HttpClient) {}

  fetchCSV(): Observable<any> {
    return this.http.get(this.fetchUrl);  // GET request to fetch CSV data
  }
}
