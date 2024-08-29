import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppService } from '../../services/app.service'

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  movies: any[] = [];
  speciesList: any[] = [];
  starShipList: any[] = [];
  vehicleList: any[] = [];
  selectedMovie: string = '';
  selectedSpecies: string = '';
  selectedBirthYear: string = '';
  selectedVehicle: string = '';
  selectedStarShip: string = '';

  @Input() birthYears: any;
  @Output() filterChange = new EventEmitter<any>();

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.appService.getFilms().subscribe((data: any) => {
      this.movies = data.results;
    });
    this.getSpecies()
    this.getStarShips();
    this.getVehicles();
  }

  getSpecies() {
    try {
      const initialApiUrl = 'https://swapi.dev/api/species/'
      this.appService.performSequentialApiCalls(initialApiUrl)
      .then(allResponses => {
        this.speciesList = allResponses;
        console.log('All API species responses:', this.speciesList);
      })
      .catch(error => {
        console.error('Error in performing API calls:', error);
      });
    } catch(error) {
      console.error(error);
    }
  }

  /**
   * this api call is written using Async function call first we are getting all the response nad populating it.
   */
  getStarShips() {
    try {
      const initialApiUrl = 'https://swapi.dev/api/starships/'
      this.appService.performSequentialApiCalls(initialApiUrl)
      .then(allResponses => {
        this.starShipList = allResponses;
        console.log('All API responses:', this.starShipList);
      })
      .catch(error => {
        console.error('Error in performing API calls:', error);
      });
  } catch(error) {
      console.error(error);
    }
  }

  /**
   * this api call is written using normal function call
   * @param pageUpdated it is current updated page number
   */
  getVehicles(pageUpdated? : any) {
    try {
      let page = pageUpdated ? pageUpdated : 1;
      this.appService.getVehicles(page).subscribe((data: any) => {
        if(data.results && data.count !== this.vehicleList.length) {
          this.vehicleList = [...data.results,...this.vehicleList];
          console.log('All Vehicle',this.vehicleList);
          if(data.next) {
            page++;
            this.getVehicles(page);
          }
        }
      });
    } catch(error) {
      console.error(error);
    }
  }

  applyFilter(typeFilter?: any): void {
    this.filterChange.emit({
      movie: this.selectedMovie,
      species: this.selectedSpecies,
      vehicle: this.selectedVehicle,
      starShip: this.selectedStarShip,
      birthYear: this.selectedBirthYear,
      type : typeFilter ? typeFilter :'applied'
    });
  }

  clearFilters(): void {
    this.selectedMovie = '';
    this.selectedSpecies = '';
    this.selectedStarShip = '';
    this.selectedVehicle = '';
    this.selectedBirthYear = '';
    this.applyFilter('clear');
  }
}
