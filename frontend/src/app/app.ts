import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SyncIndicatorComponent } from './shared/components/sync-indicator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SyncIndicatorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
