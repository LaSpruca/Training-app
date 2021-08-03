import { eventbriteEvent, attendee } from './classes';
import {
  AfterContentInit,
  Component,
  ViewChild,
  Directive,
  ElementRef,
} from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterContentInit {
  selectedFacilitator: string = '';
  selectedEvent: any;
  trainings: eventbriteEvent[] = [];
  showConfirm = false;
  showError: boolean = false;
  anyone_attending = false;
  authenticated = false;

  @ViewChild('banner', { static: false }) banner: any;

  facilitators = [
    'Hayden',
    'Melissa',
    'Mat',
    'Caroline',
    'Petr',
    'Rosa',
    'Julia',
    'Daniele',
    'Andi',
    'Nova',
    'Hajar',
    'Karthik',
    'Iris',
    'Hugh',
    'Blake',
    'Raymond',
    'Etienne',
    'Anne',
    'Sean',
    'Ariel',
  ];

  constructor(public api: ApiService) {}

  async ngAfterContentInit() {
    let auth = (await this.api.signIn()).subscribe((auth: any) => {
      auth.signIn().then((res: any) => {
        this.api.signInSuccessHandler(res);
        console.log(auth);
        this.authenticated = true;
      });
    });
    const res = await this.api.getTodaysEvents();
    console.log(auth);
    if (res.status === 0) {
      this.showError = true;
    } else {
      this.trainings = res.trainings;
    }
  }

  newAttendee() {
    this.selectedEvent.attendees.push({
      name: { firstName: '', lastName: '' },
      upi: '',
      id: '',
      email: '',
      attending: false,
    });
  }

  async submitData() {
    this.anyone_attending = false;
    this.selectedEvent.attendees.forEach((attendee: any) => {
      if (attendee.attending) this.anyone_attending = true;
    });

    if (!this.anyone_attending) {
      this.showError = true;
      return;
    }

    var table = '';

    if (this.selectedEvent.title.includes('Router')) table = 'CNC Router';
    else if (this.selectedEvent.title.includes('Laser')) table = 'Laser';
    else if (this.selectedEvent.title.includes('3D')) table = '3D Printer';
    else if (this.selectedEvent.title.includes('Vinyl')) table = 'Vinyl';
    else if (this.selectedEvent.title.includes('Sewing')) table = 'Sewing';
    else if (this.selectedEvent.title.includes('Solder')) table = 'Soldering';

    console.log(this.selectedEvent, table, this.selectedFacilitator);

    var res = await this.api.insertData(
      this.selectedEvent,
      table,
      this.selectedFacilitator
    );

    if (res === 200) {
      this.banner.nativeElement.className = 'bannerCont show';
      setTimeout(() => {
        this.banner.nativeElement.className = 'bannerCont';
      }, 1500);
    } else {
      console.log('ERROR');
      this.showError = true;
    }
  }
}
