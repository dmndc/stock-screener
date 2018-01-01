import React, { Component } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import Trend from 'react-trend';

import './Tile.css';


class Tile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [1,5,3,7,2,6,7,8],
    }
  }

  // Get Tile Data

  getTileData(stock) {
    axios.get(`https://api.iextrading.com/1.0/stock/${stock}/chart/1m`)
    .then ( res => {

      let prices = res.data.map( data => data.close );
      this.setState({
        data: prices
      })
    })
    .catch( err => {
      console.log(err);
    })
  }

  componentDidMount() {
    this.getTileData(this.props.symbol);
  }

  handleCloseButton() {

  }


  render() {

    const { stocks } = this.state;
    const percent = numeral(this.props.change).format('0.00');
    

    return (
      <div className="card text-white bg-dark mb-3 rounded-0" key={this.props.index}>
        <div className="card-body">
          <h5 className="card-title">
            {this.props.company}
            {/* <span>
              <button type="button" className="close" onClick={this.handleCloseButton} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </span> */}
          </h5>
          <p className="card-text text-muted">{this.props.sector}</p>

          <Trend
            smooth
            autoDraw
            autoDrawDuration={2000}
            autoDrawEasing="ease-out"
            data={this.state.data}
            gradient={['#00c6ff', '#F0F', '#FF0']}
            radius={0}
            strokeWidth={3}
            strokeLinecap={'butt'}
          />
          
          <div className="row">
            <div className="col-sm text-left">
            

            <h3><span className={(percent > 0 ? 'text-success' : 'text-danger')}>
              {percent > 0 ? <span className="oi oi-caret-top"></span> : <span className="oi oi-caret-bottom"></span>}
              {percent}%
            </span></h3>
            </div>
            <div className="col-sm text-right">
            <h2>${this.props.price}</h2>
            </div>
          </div>

          {/* <p className="card-text">MarketCap: {stock.marketCap}</p> */}
          {/* <p className="card-text text-right"><h2>${this.props.price}</h2></p> */}


          {/* <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p> */}
        </div>
      </div>
    )
  }

}

export default Tile;
