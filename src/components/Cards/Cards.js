import React, { Component } from 'react';
import axios from 'axios';


import Card from './../Card/Card';

// Import Stocks APIs
import { getStocksFromDb } from './../../utils/stocks-api';
// import './Tiles.css';




class Cards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stocks: [],
      hasMoreItems: true,
    }
  }

  componentDidMount() {
    getStocksFromDb().then(stocks => {
      this.setState({ stocks });
    }).catch(err => {
      console.log('Err: ', err);
    });
  }

  loadItems(page) {


    axios.get(`/api/stocks/${page}`)
      // .then(res => {
      //   // this.setState({ stocks: res})
      // })
      .then(res => {
        console.log('EVO RES: ', res.data);
        this.setState({
          stocks: res.data.stocks
        })
        
        if (page === res.pages) {
          this.setState({
            hasMoreItems: false
          })
        }
      })
  }


  render() {

    const { stocks } = this.state;

    let cards = stocks.map( (stock, index) => {
      // const path = `/company/${stock.symbol}`;

      return (
        
          <Card key={index} symbol="NVDA"/>
        
      )
    })


    return (
      <div className="card-columns">
        { cards }
      </div>
    )
  }

}

export default Cards;
