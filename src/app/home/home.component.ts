import { ChangeDetectionStrategy, Component } from '@angular/core';
import {AppModule} from "../app.module";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AppModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

}
