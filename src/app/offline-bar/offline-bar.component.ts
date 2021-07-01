import { Component } from '@angular/core';
import { HttpService } from '../http';

@Component({
  selector: 'app-offline-bar',
  templateUrl: './offline-bar.component.html',
  styleUrls: ['./offline-bar.component.scss']
})
export class OfflineBarComponent {
  isOffline = false;

  constructor(private http: HttpService) {
    http.getConnectionEvent().subscribe((isConnected) => {
      this.isOffline = (isConnected === false);
    });
  }
}
