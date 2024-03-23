import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule, MainComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {}
