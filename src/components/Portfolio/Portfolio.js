import React, { Component } from 'react';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Clock from 'react-live-clock';
import axios from 'axios';
import numeral from 'numeral';


import './Portfolio.css';

class Portfolio extends Component {
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

    // axios.get('/api/user/26/stocks')
    //   .then(res => {
    //     console.log(res.data);
    //     this.setState({
    //       watchlist: res.data
    //     })
    //   })
  }

  chgPercentFormatter(cell) {
    let formatedCell = numeral(cell).format('0.00');
    // console.log('Percent: ', typeof formatedCell);
    if (formatedCell < 0) {
      return <span className="negative">{formatedCell}%</span>;
    } else {
      return <span className="positive">{formatedCell}%</span>;
    }
  }

  render() {


    return (

      
        <div className="row">

          <div className="col-sm">
          <p className="text-right"><Clock format={'MMMM Do YYYY, h:mm:ss a'} ticking={true} timezone={'US/Eastern'} /><span> EST</span></p>
          
          <BootstrapTable data={this.state.watchlist} version='4' hover tableBodyClass='table table-dark' tableHeaderClass='table-dark'>
            <TableHeaderColumn isKey={true} dataField='symbol' width='80'>Symbol</TableHeaderColumn>
            <TableHeaderColumn dataField='companyName' width='220'>Company</TableHeaderColumn>
            {/* <TableHeaderColumn dataField='sector'>Sector</TableHeaderColumn> */}
            <TableHeaderColumn dataField='latestPrice' width='100' dataAlign="right">Last Price</TableHeaderColumn>
            <TableHeaderColumn dataField='changePercent' width='100' dataFormat={this.chgPercentFormatter} dataAlign="right">Change</TableHeaderColumn>
            <TableHeaderColumn dataField='open' width='100' dataAlign="right">Open</TableHeaderColumn>
            <TableHeaderColumn dataField='close' width='100' dataAlign="right">Close</TableHeaderColumn>
            <TableHeaderColumn dataField='latestVolume' width='100' dataAlign="right">Volume</TableHeaderColumn>
            <TableHeaderColumn dataField='latestVolume' width='100' dataAlign="right">Volume</TableHeaderColumn>
          </BootstrapTable>
          </div>
        </div>
      
     
    )
  }

}

export default Portfolio;
