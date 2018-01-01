import React, { Component } from 'react';
import openSocket from 'socket.io-client';


import './Card.css';

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      oldPrice: null,
      updatedPrice: null,
      isUpdated: false,
      increasing: false
    }


  }

  componentDidMount() {
    const socket = openSocket('https://ws-api.iextrading.com/1.0/tops');
    console.log('SOCKET: ', socket);
    const symbol = this.props.symbol;

    socket.on('connect', () => {
      
        console.log('Socket connected');
      
        // Subscribe to topics (i.e. appl,fb,aig+)
        socket.emit('subscribe', symbol)
      
        // Unsubscribe from topics (i.e. aig+)
        socket.emit('unsubscribe', symbol)
      })


    socket.on('message', message => {
      // console.log(message);
      let stockData = JSON.parse(message);
      console.log(`${stockData.symbol}: ${stockData.lastSalePrice}`);
      if (stockData.lastSalePrice >= this.state.oldPrice) {
        this.setState({
          increasing: true
        })
      } else {
        this.setState({
          increasing: false
        })
      }

      this.setState({
        oldPrice: this.state.updatedPrice,
        updatedPrice: stockData.lastSalePrice,
        isUpdated: true

      })
    })
  }


  render() {
    return (

            <div className="card" key={this.props.index}>
              <div className="card-header">My Wonderful Card Component</div>
              <div className="card-body">
                <h6 className="card-title">{this.props.symbol} - Real Time Updated Price</h6>
                <h1 className={this.state.isUpdated && this.state.increasing ? "green animated flash" : "red animated flash" }>${this.state.updatedPrice}</h1>
                <p className="card-text">{this.props.companyName}</p>
              </div>
              <div className="card-footer">
                <small className="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
                
    )
  }

}

export default Card;
