import React, { Component } from 'react';
import circuitBreaker from 'opossum';
import $ from 'jquery';

class App extends Component {

  constructor () {
    super();

    // state
    this.state = {requestState: []};

    // binds
    this.makeRequest = this.makeRequest.bind(this);
    this.makeNode = this.makeNode.bind(this);
    this.clearNodes = this.clearNodes.bind(this);

    // circuit breaker settings
    this.circuitBreakerOptions = { timeout: 500, maxFailures: 3, resetTimeout: 5000 };
    this.route = 'http://localhost:3000/flakeyService';

    this.circuit = circuitBreaker(() => $.get(this.route), this.circuitBreakerOptions);

    // circuit breaker events
    this.circuit.fallback(() =>
      ({ body: `${this.route} unavailable right now. Try later.` }));
    this.circuit.on('success', (result) =>
      this.makeNode({state: `SUCCESS`, body: `${JSON.stringify(result)}`}));
    this.circuit.on('timeout', () =>
      this.makeNode({state: `TIMEOUT`, body: `${this.route} is taking too long to respond.`}));
    this.circuit.on('reject', () =>
      this.makeNode({state: `REJECTED`, body: `The breaker for ${this.route} is open. Failing fast.`}));
    this.circuit.on('open', () =>
      this.makeNode({state: `OPEN`, body: `The breaker for ${this.route} just opened.`}));
    this.circuit.on('halfOpen', () =>
      this.makeNode({state: `HALF_OPEN`, body: `The breaker for ${this.route} is half open.`}));
    this.circuit.on('close', () =>
      this.makeNode({state: `CLOSE`, body: `The breaker for ${this.route} has closed. Service OK.`}));
    this.circuit.on('fallback', (data) =>
      this.makeNode({state: `FALLBACK`, body: `${JSON.stringify(data)}`}));
  }

  clearNodes (event) {
    this.setState({requestState: []});
  }

  makeNode (event) {
    let list = this.state.requestState;
    event.id = list.length++;
    list.push(event);
    this.setState({requestState: list});
  }

  makeRequest (event) {
    this.circuit.fire().catch((e) => console.error(e));
  }

  render () {
    return (

        <div className="App">
          <h1>Opossum Circuit Breaker Example</h1>

          <p>
            When you click the button here, this simple app calls a flakey web service that takes longer and longer to respond. The app circuit breaker is configured to timeout after 500ms and execute a fallback command. Every 20 seconds, the flakey service is reset and the pattern is repeated.
          </p>
          <p>
            If more than 3 errors are observed by the circuit within a single timeout period, then it begins to fail fast, rejecting the network call outright and executing the fallback function.
          </p>
          <p>
             This should allow you to see all of the various events that occur when using a circuit breaker.
          </p>
          <p>
            The <a href="/app.js">source code</a> for the application is relatively simple, and uses some basic jQuery capabilities to make the ajax calls and update the DOM accordingly.
          </p>
          <div className="row">
            <button type="button" id="flakey" onClick={this.makeRequest}>
              Flakey Service
            </button>
          </div>

          <div className="row" id="flakeyResponse">
            <h2>FLAKEY RESPONSES</h2>
            <span className="clear" onClick={this.clearNodes}>Click to clear</span>
            {
              this.state.requestState.map((element) => {
                return (
                  <p key={element.id} className={element.state.toLowerCase()}>
                    <span>{ element.state}: </span>
                    <span>{ element.body}</span>
                  </p>
                );
              })
            }
          </div>
        </div>
    );
  }
}

export default App;
