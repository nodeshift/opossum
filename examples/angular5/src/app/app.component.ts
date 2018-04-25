'use strict';

import { Component } from '@angular/core';
import { ResponseListComponent } from './response-list/response-list.component'
import { StatsCardComponent } from './stats-card/stats-card.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Circuit Breaker Example';
}
