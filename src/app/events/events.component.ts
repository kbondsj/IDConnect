import { Component } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {

  showDay(day:number){

    // read the day of events json and build the list
    alert(day);
  }
}
