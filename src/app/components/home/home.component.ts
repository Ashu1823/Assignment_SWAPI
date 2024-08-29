import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  characters: any[] = [];
  filteredCharacters: any[] = [];
  allList: any[] = [];
  birthYears: any[] = [];
  currentPage: number = 1;
  next: boolean = true;
  back: boolean = false;
  filterSelected: boolean = false;
  isLoading: boolean = false;

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit(): void {
    this.getCharacterList(this.currentPage);
    this.getALLData();
  }

  getALLData(urlData?: any) {
    try {
      const url = urlData ? urlData : 'https://swapi.dev/api/people/?page=1';
      this.appService.getAllPeople(url).subscribe((data: any) => {
        if (data.results && data.count !== this.allList.length) {
          this.allList = [...data.results, ...this.allList];
          if (data.next) {
            this.getALLData(data.next);
          } else {
            this.birthYears = Array.from(new Set(this.allList.map(person => person.birth_year)));
          }
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  getCharacterList(number: number) {
    try {
      this.isLoading = true
      this.appService.getPeople(number).subscribe((data: any) => {
        this.characters = data.results;
        this.filteredCharacters = this.characters;
        this.getSpeciesValues()
        this.next = data.next ? true : false;
        this.back = data.previous ? true : false;
        this.isLoading = false;
      });
    } catch (listError) {
      console.error(listError);
    }
  }

  /**
   * this will give the list of movies which apis are listed in persons list
   * this one just for showing purpose not using anywhere
   * @param arr 
   */
  getAllFilmList(arr: any) {
    const array = JSON.parse(JSON.stringify(arr))
    for (let eachVal of array) {
      if (eachVal.films && eachVal.films.length && !eachVal.filmUpdated) {
        this.appService.getDetailsByUrlList(eachVal.films).subscribe(
          (filmDetails: any) => {
            let data = filmDetails.map((film: { title: any; }) => film.title);
            eachVal.films = data;
            eachVal['filmUpdated'] = true;
          },
          (error: any) => {
            console.error('Error fetching film details:', error);
          }
        );
      }
    }
  }

  nextPage(): void {
    if (this.next) {
      this.currentPage++;
      this.getCharacterList(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.back) {
      this.currentPage--;
      this.getCharacterList(this.currentPage);
    }
  }

  applyFilter(filter: any): void {
    if (filter.type === 'applied') {
      const value = JSON.parse(JSON.stringify(filter));
      delete (value.type);
      if (Object.values(value).every(value => value === '')) {
        this.filteredCharacters = [];
        this.currentPage = 1;
        this.getCharacterList(this.currentPage);
        this.filterSelected = false;
        return;
      }
      this.filteredCharacters = JSON.parse(JSON.stringify(this.allList));
      this.filteredCharacters = this.filteredCharacters.filter(person => this.matchesFilter(person, filter));
      this.getSpeciesValues();
      this.filterSelected = true;
    } else if (filter.type === 'clear') {
      this.filteredCharacters = [];
      this.currentPage = 1;
      this.getCharacterList(this.currentPage);
      this.filterSelected = false;
    }
  }

  matchesFilter(person: any, filter: any): boolean {
    // Check for each filter condition
    return (
      (!filter.movie || person.films.includes(filter.movie)) &&
      (!filter.species || person.species.includes(filter.species)) &&
      (!filter.vehicle || person.vehicles.includes(filter.vehicle)) &&
      (!filter.starShip || person.starships.includes(filter.starShip)) &&
      (!filter.birthYear || person.birth_year === filter.birthYear)
    );
  }

  getSpeciesValues() {
    try {
     this.filteredCharacters.forEach((ele, ind) => {
      if(ele.species?.length) {
        this.appService.getDataByURl(ele.species[0]).subscribe(
          (value: any) => {
            this.filteredCharacters[ind]['species'][0] = value.name;
          },
        ) 
      }
     })
     this.filteredCharacters =[...this.filteredCharacters];
    } catch(error) {
      console.error(error);
    }
  }

  selectCharacter(character: any): void {
    this.router.navigate(['/characters', character.url]);
  }
}
