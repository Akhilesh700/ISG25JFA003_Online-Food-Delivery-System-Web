import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap, map, shareReplay } from 'rxjs/operators';
import { SearchResponse, SearchResultItem } from 'src/app/models/iSearch';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private http = inject(HttpClient);

    // Private subject to handle incoming search terms
    private searchTermSubject = new Subject<string>();

    // Public signals for component consumption
    public isLoading: WritableSignal<boolean> = signal(false);
    public hasResults: WritableSignal<boolean> = signal(false); // Signal if there are results

    // The public observable stream of search results
    public searchResults$: Observable<SearchResultItem[]>;

    // *** IMPORTANT: Replace with your ACTUAL backend API endpoint ***
    private readonly apiUrl = `${environment.apiUrl}api/${environment.version}/customer/search`; // Base API URL

    constructor() {
        this.searchResults$ = this.searchTermSubject.pipe(
            debounceTime(400),                  // Wait for 400ms pause in typing
            distinctUntilChanged(),             // Only emit if value has changed
            tap(query => {
                // Set loading state *before* making the API call
                this.isLoading.set(query.trim().length > 0);
                this.hasResults.set(false); // Reset hasResults on new search
            }),
            switchMap(query => {
                const trimmedQuery = query.trim();
                // If the query is empty, clear results and stop loading
                if (!trimmedQuery) {
                    this.isLoading.set(false);
                    return of([]); // Return an empty array observable
                }

                // Prepare query parameters
                const params = new HttpParams().set('q', trimmedQuery);
                // Add pagination params if needed, e.g., .set('page', '1').set('limit', '10')

                // Make the HTTP request
                return this.http.get<SearchResponse>(this.apiUrl, { params }).pipe(
                    map(response => response.results || []), // Extract results array
                    tap(results => {
                        this.isLoading.set(false); // Stop loading on success
                        this.hasResults.set(results.length > 0); // Update hasResults based on response
                    }),
                    catchError(error => {
                        console.error('Search API failed:', error);
                        this.isLoading.set(false); // Stop loading on error
                        this.hasResults.set(false); // No results on error
                        return of([]); // Return an empty array observable on error
                    })
                );
            }),
            shareReplay(1) // Cache the last emitted results and share among subscribers
        );
    }

    /**
     * Pushes a new search term into the observable stream.
     * @param term The search term entered by the user.
     */
    updateSearchTerm(term: string): void {
        this.searchTermSubject.next(term);
    }
}