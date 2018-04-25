import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import circuitBreaker from 'opossum';
import axios from 'axios';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})

export class ButtonComponent implements OnInit {
  constructor() { }

  @Output() onServiceResponse = new EventEmitter<object>();
  @Output() onClearList = new EventEmitter<any>();
  @Output() onSnapshot = new EventEmitter<any>();

  route = 'http://localhost:3030/flakeyService'
  circuitBreakerOptions = {
    timeout: 500,
    errorThresholdPercentage: 50,
    resetTimeout: 5000
  };
  circuit = circuitBreaker(_ => axios.get(this.route), this.circuitBreakerOptions);

  ngOnInit() {

    this.circuit.fallback(e => {
      return {
        data: {
          body: `${this.route} unavailable right now. Try later.`
        }
      }});

    this.circuit.status.on('snapshot', data => this.onSnapshot.emit(data));
    ['success', 'timeout', 'reject', 'open', 'halfOpen', 'close', 'fallback']
      .every(event => this.circuit.on(event,
        payload =>
          this.onServiceResponse.emit({
            event,
            data: payload ? JSON.stringify(payload.data) : ''
          })
        ));
  }

  callService() {
    this.circuit.fire();
  }

  clearList() {
    this.onClearList.emit(true);
  }
}
