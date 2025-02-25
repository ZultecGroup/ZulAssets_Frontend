import { Component, inject } from '@angular/core';
import { GeneralService } from '../../service/general.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {

  public loader = inject(GeneralService)
}
