import React, { Component } from 'react';
import numeral from 'numeral';

import './InfoRow.css';
// Import Components


class InfoRow extends Component {

  render() {
    
    return (
      <div className="container bg-dark text-white mt-3">
          <div className="row">
            <div className="col-sm">
              <div class="card bg-dark">
                <div class="card-body">
                  <h4 class="card-title">Revenues</h4>
                  {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                  { numeral(this.props.data.revenue).format('($ 0.000 a)') }
                  {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                </div>
              </div>
            </div>
            <div className="col-sm">
            <div class="card bg-dark">
              <div class="card-body">
                <h4 class="card-title">Profits</h4>
                {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                { numeral(this.props.data.grossProfit).format('($ 0.000 a)') }
                {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
              </div>
            </div>

            </div>
            <div className="col-sm">
            <div class="card bg-dark">
              <div class="card-body">
                <h4 class="card-title">Profit Margin</h4>
                {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                { this.props.data.profitMargin }%
                {/* { numeral(this.props.data.profitMargin).format('0.0%') } */}
                {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
              </div>
            </div>

            </div>
            <div className="col-sm">
            <div class="card bg-dark">
                <div class="card-body">
                  <h4 class="card-title">Market Cap</h4>
                  {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                  { numeral(this.props.data.marketcap).format('($ 0.00 a)') }
                  {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                </div>
              </div>
            </div>
            <div className="col-sm">
            <div class="card bg-dark">
                <div class="card-body">
                  <h4 class="card-title">Employees</h4>
                  {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                  { Math.floor(this.props.data.revenue / this.props.data.revenuePerEmployee) }
                  {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                </div>
              </div>
            </div>
            {/* <div className="col-sm">
            <h4>Total Assets</h4>
              { this.props.financials.reportDate }
              
            </div> */}

          </div>
      </div>
    )
  }

}

export default InfoRow;
