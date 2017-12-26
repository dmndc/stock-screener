import React, { Component } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { Link } from 'react-router-dom';


import './watchList.css';

class WatchList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      watchlist: [],
      oldPrice: null,
      updatedPrice: null,
      isUpdated: false,
      increasing: false
    }
  }


  componentDidMount() {
    axios.get("/api/user").then((res) => {
      this.setState({
        user: res.data.id
      })

      axios.get(`/api/user/${this.state.user}/stocks`)
        .then(res => {
          this.setState({
            watchlist: res.data
          })
        })
    })
  }


  render() {


    return (

      <div className="card text-white bg-dark rounded-0 mb-3">
        <div className="card-header"><h5 className="text-uppercase"><span className="oi oi-list mr-4"></span>My Watchlist</h5></div>
        <div className="card-body">
          <table className="table table-sm table-dark">
            <thead>
              <tr>

                <th scope="col">Stock</th>
                <th className="text-right" scope="col">Price</th>
                <th className="text-right" scope="col">Change</th>
              </tr>
            </thead>
            <tbody>
              {this.state.watchlist.map(item => {
                let symbol = '/company/' + item.symbol;

                return <tr key={item.id}>

                  <Link to={symbol}><td>{item.symbol}</td></Link>
                  <td className="text-right">${item.latestPrice}</td>

                  {
                    item.changePercent > 0
                      ?
                      <td className="text-right"><span className="positive">{numeral(item.changePercent).format('0.00')}%</span></td>
                      :
                      <td className="text-right"><span className="negative">{numeral(item.changePercent).format('0.00')}%</span></td>
                  }

                </tr>

              })}
            </tbody>
          </table>
        </div>
      </div>

    )
  }

}

export default WatchList;
