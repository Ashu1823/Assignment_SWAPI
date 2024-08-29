import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, lastValueFrom, of } from 'rxjs';

import { map, mergeMap, expand, takeWhile, reduce } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private baseUrl = 'https://swapi.dev/api';

  constructor(private http: HttpClient) {}

  getPeople(page: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/people/?page=${page}`);
  }
  getAllPeople(url: any): Observable<any> {
    return this.http.get(url);
  }

  getSpecies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/species/`);
  }

  getFilms(): Observable<any> {
    return this.http.get(`${this.baseUrl}/films/`);
  }

  getCharacterDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/people/${id}/`);
  }
  getStarShips(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/starships/?page=${page}`);
  }
  getVehicles(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/vehicles/?page=${page}`);
  }
  getDetailsByUrlList(filmUrls: string[]): Observable<any[]> {
    const requests = filmUrls.map(url => this.http.get(url));
    return forkJoin(requests);
  }
  getDataByURl(url: string): Observable<any> {
    return this.http.get(url);
  }


  // Function to perform an API call and return a promise
  private apiCall(url: string): Promise<any> {
    return lastValueFrom(this.http.get<any>(url));
  }

  // Function to perform a series of API calls using Promises
  performSequentialApiCalls(initialUrl: string): Promise<any[]> {
    let respData: any = [];
    let currentUrl = initialUrl;

    // Function to handle the next API call
    const makeCalls: any = () => {
      if (!currentUrl) {
        return Promise.resolve(respData);
      }

      return this.apiCall(currentUrl).then(response => {
        respData = [...response.results, ...respData]
        currentUrl = response.next; // Adjust according to your response structure

        // Perform the next API call
        return makeCalls();
      });
    };

    return makeCalls();
  }
}
