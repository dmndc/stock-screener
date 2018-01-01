import React, { Component } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import Trend from 'react-trend';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';


import './Ticker.css';


class Ticker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quote: {},
    }
  }

  // Get Data
  getData(stock) {
    axios.get(`https://api.iextrading.com/1.0/stock/${stock}/quote`)
    .then ( res => {
      this.setState({
        quote: res.data
      })
    })
    .catch( err => {
      console.log(err);
    })
  }

  componentDidMount() {
    this.getData(this.props.symbol);
  }


  render() {

    const { stocks } = this.state;
    const percent = numeral(this.props.change).format('0.00');
    
    const symbol = this.props.symbol;
    let title = '';

    switch(symbol) {
      case 'SPY':
        title = 'S&P 500';
        break;
      case 'DIA':
        title = 'Dow Jones';
        break;
      case 'IWM': 
        title = 'Russel 2000';
        break;
    }

    return (
      
      <div className="card text-white bg-primary rounded-0" key={this.props.index}>
        <div className="card-body dark">
          <h6 className="card-title">{title}</h6>
          <h6 className={(percent > 0 ? 'text-success' : 'text-danger')}>
              {percent > 0 ? <span className="oi oi-caret-top ml-3"></span> : <span className="oi oi-caret-bottom ml-3"></span>}
              {numeral(this.state.quote.changePercent).format('0.00%')} 
            </h6>
          <p className="card-text text-muted">{this.props.sector}</p>

          
          {/* <h4>{this.state.quote.latestPrice} <span className="currency">USD</span></h4> */}
          
          
          <div className="row">
            <div className="col text-left">

            
            <div>
              <Trend
                autoDrawDuration={2000}
                autoDrawEasing="ease-out"
                data={[5,8,4,10,12,16,20,13,14,10,15,22]}
                
                radius={0}
                strokeWidth={5}
                strokeLinecap={'butt'}
              /> 
            
            
              <Sparklines data={[5, 10, 5, 20, 8, 15]} margin={6}>
              <SparklinesLine style={{ strokeWidth: 3, stroke: "white", fill: "none" }} />
              <SparklinesSpots size={4}
                  style={{ stroke: "#336aff", strokeWidth: 3, fill: "white" }} />
              </Sparklines>
            </div>

           
            </div>
            <div className="col text-right">

            </div>
          </div>
         
        </div>
      </div>
      
    )
  }

}

export default Ticker;
