import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit {

  public personDetails: any = {};
  public ItemsToShow: any = [{ label: 'Name', value: 'name' },
  { label: 'Birth Year', value: 'birth_year' },
  { label: 'Gender', value: 'gender' },
  { label: 'Height', value: 'height' },
  { label: 'Weight', value: 'mass' },
  { label: 'Created', value: 'created' },
  { label: 'Edited', value: 'edited' },
  { label: 'Hair color', value: 'hair_color' },
  { label: 'Eye color', value: 'eye_color' },
  { label: 'Skin color', value: 'skin_color' },
  { label: 'Planet name', value: 'homeworld' },
  { label: 'Species', value: 'species' }];
  public filmDetails: any;
  public vehicleList: any;
  public starShipList: any;
  public isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private appService: AppService, private router: Router) { }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getDetailsOfPerson(id);
    }
  }

  async getDetailsOfPerson(id: any) {
    try {
      this.appService.getDataByURl(id).subscribe(
        (person: any) => {
          this.personDetails = JSON.parse(JSON.stringify(person));
          if (person.homeworld) {
            this.isLoading = true;
            this.appService.getDataByURl(person.homeworld).subscribe((home: any) => {
              this.personDetails['homeworld'] = home.name;
              this.isLoading = false;
            }, (error) => {
              this.isLoading = false;
              console.error(error);
            });
          }
          if (person.species?.length) {
            const arr = person.species;
            this.getAllValue(arr);
          } else {
            this.personDetails['species'] = 'Not Available';
          }
          if (person.films?.length) {
            this.isLoading = true;
            this.appService.getDetailsByUrlList(person.films).subscribe(
              (data: any) => {
                this.filmDetails = data;
                this.isLoading = false;
              },
              (error: any) => {
                console.error('Error fetching film details:', error);
                this.isLoading = false;
              }
            );
          }
          if (person.vehicles?.length) {
            this.isLoading = true;
            this.appService.getDetailsByUrlList(person.vehicles).subscribe(
              (data: any) => {
                this.vehicleList = data;
                this.isLoading = false;
              },
              (error: any) => {
                console.error('Error fetching film details:', error);
                this.isLoading = false;
              }
            );
          }
          if (person.starships?.length) {
            this.appService.getDetailsByUrlList(person.starships).subscribe(
              (data: any) => {
                this.starShipList = data;
              },
              (error: any) => {
                console.error('Error fetching film details:', error);
              }
            );
          }
        });
    } catch (error) {
      console.error(error);
    }
  }

backToHome() {
  this.router.navigate(['/home']);
}

  async getAllValue(arr: any) {
    try {
      const details = await this.appService.getDetailsByUrlList(arr).toPromise();
      this.personDetails['species'] = details?.[0]?.['name'];
      return details;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
