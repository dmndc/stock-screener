import React, { Component } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { Link } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroller';
import Trend from 'react-trend';
import Tile from './../Tile/Tile';

// Import Stocks APIs
import { getStocksFromDb } from './../../utils/stocks-api';
import './Tiles.css';




class Tiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      stocks: [],
      hasMoreItems: true,
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
          stocks: res.data
        })
      })
    })

    // axios.get('/api/user/16/stocks')
    //   .then( res => {
    //     this.setState({
    //       stocks: res.data
    //     })
    //   })

          

    // getStocksFromDb().then(stocks => {
    //   this.setState({ stocks });
    // }).catch(err => {
    //   console.log('Err: ', err);
    // });
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

    // let cards = stocks.map( (stock, index) => (
      
    //   let path = '/company/' + stock;
    //   // const path = `/company/${stock}`;
    //   <Link to=path>
    //     <Tile key={index} symbol={stock.symbol} company={stock.company} sector={stock.sector} price={stock.close} change={stock.changePercent} />
    //   </Link>


    // ))

    let cards = stocks.map( (stock, index) => {
      const path = `/company/${stock.symbol}`;

      return (
        <Link to={path}>
          <Tile key={index} symbol={stock.symbol} company={stock.companyName} sector={stock.sector} price={stock.close} change={stock.changePercent} />
        </Link>
      )
    })


    return (
      <div className="container">
        <div className="card-columns">
  
            {/* <InfiniteScroll
                pageStart={0}
                loadMore={this.loadItems.bind(this)}
                hasMore={this.state.hasMoreItems}
                useWindow={true}
                loader={<div className="loader">Loading ...</div>}
                threshold={20}
            >

                  <div className="tracks">
                      {cards}
                  </div>
              
            </InfiniteScroll> */}

            { cards }
            
        </div>
      </div>
    )
  }

}

export default Tiles;
