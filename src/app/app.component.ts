import { Component } from '@angular/core';
import { GeneralService } from './main/shared/service/general.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'zul-assets';
  constructor(private genralSerivice: GeneralService) {}

  ngOnInit(): void {
    this.genralSerivice.getRoleRightsByID();
  }
}
