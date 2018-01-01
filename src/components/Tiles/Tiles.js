import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

import InfiniteScroll from 'react-infinite-scroller';
import Tile from './../Tile/Tile';

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

  // componentDidMount() {
    // axios.get("/api/user").then((res) => {
    //   this.setState({
    //     user: res.data.id
    //   })

    //   axios.get(`/api/user/${this.state.user}/stocks`)
    //   .then(res => {
    //     this.setState({
    //       stocks: res.data
    //     })
    //   })
    // })

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
  // }

  
  loadItems(page) {


    axios.get(`/api/stocks/page/${page}`)
      .then(res => {
        this.setState({
          stocks: [...this.state.stocks, ...res.data.stocks]
        })
        
        if (page === res.pages) {
          this.setState({
            hasMoreItems: false
          })
        }
      })
  }


  render() {

    

    let items = [];

    // let cards = stocks.map( (stock, index) => (
      
    //   // let path = '/company/' + stock;
    //   // const path = `/company/${stock}`;
    //   <Link to='/'>
    //     <Tile key={index} symbol={stock.symbol} company={stock.company} sector={stock.sector} price={stock.close} change={stock.changePercent} />
    //   </Link>


    // ))

    this.state.stocks.map( (stock, index) => {
      const path = `/company/${stock.symbol}`;

      items.push(
        <Link to={path}>
          <Tile key={index} symbol={stock.symbol} company={stock.companyName} sector={stock.sector} price={stock.close} change={stock.changePercent} />
        </Link>
      )
      
    })


    return (
      <div className="container">
        <div className="card-columns">

          <InfiniteScroll
              pageStart={0}
              initialLoad={true}
              loadMore={this.loadItems.bind(this)}
              hasMore={this.state.hasMoreItems}
              threshold={600}
              loader={<div className="loader">Loading ...</div>}>
              
            <div>
              {items}
            </div>
          </InfiniteScroll>


            {/* <InfiniteScroll
                pageStart={1}
                loadMore={this.loadItems.bind(this)}
                hasMore={this.state.hasMoreItems}
                useWindow={true}
                loader={<div className="loader">Loading ...</div>}
                threshold={20}
            >

                  <div className="tracks">
                    { 'ITEMS: ' }
                      {items}
                  </div>
              
            </InfiniteScroll> 

            { items } */}
            
        </div>
      </div>
    )
  }

}

export default Tiles;
