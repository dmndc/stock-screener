import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import { Sparklines, SparklinesLine, SparklinesSpots  } from 'react-sparklines';
import Trend from 'react-trend';

import { flash } from 'react-animations'


import axios from 'axios';
import numeral from 'numeral';
import { Route, Redirect } from 'react-router';


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

      // <div className="container">
      //   <div className="row">
      //     <div className="col-sm">
      //       { this.props.user }
      //       One of three columns
      //     </div>
      //     <div className="col-sm">
            
      //       One of three columns
      //     </div>
      //     <div className="col-sm">
      

            <div className="card text-white bg-dark rounded-0 mb-3">
              <div className="card-header"><h5 className="text-uppercase"><span className="oi oi-list mr-4"></span>My Watchlist</h5></div>
              <div className="card-body">
                <table className="table table-sm table-dark">
                  <thead>
                    <tr>
                      {/* <th scope="col">#</th> */}
                      <th scope="col">Stock</th>
                      <th className="text-right" scope="col">Price</th>
                      <th className="text-right" scope="col">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.watchlist.map(item => {
                      return <tr key={item.id}>
                        {/* <th scope="row">1</th> */}
                        <td>{item.symbol}</td>
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


            
      //     </div>
      //   </div>
      // </div>
     
    )
  }

}

export default WatchList;
