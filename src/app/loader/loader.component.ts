import { ChangeDetectorRef, Component } from '@angular/core';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  providers: [LoaderService],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  constructor(public loader: LoaderService, private cd: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }
}
