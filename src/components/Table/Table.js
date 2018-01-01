import React, { Component } from 'react';
import { Link } from "react-router-dom";
import numeral from 'numeral';
import Filters from '../Filters/Filters.js';


// Import Stocks APIs
import { getStocksFromDb } from './../../utils/stocks-api';

import Icon from 'react-icons-kit';
import { androidArrowDropup } from 'react-icons-kit/ionicons/androidArrowDropup';
import { androidArrowDropdown } from 'react-icons-kit/ionicons/androidArrowDropdown';

// React Bootstrap Table
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import './Table.css';





class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stocks: [],
    }

    // this.filterBySector =this.filterBySector.bind(this); 
    this.handleSectorChange = this.handleSectorChange.bind(this);
    this.handleSelectInput = this.handleSelectInput.bind(this);
    this.handleMarketCapChange = this.handleMarketCapChange.bind(this);
  }

  componentDidMount() {
    getStocksFromDb().then(stocks => {
      this.setState({ stocks });
    }).catch(err => {
      console.log('Err: ', err);
    });
  }

  // filterBySector(sector) {
  //   axios.get(`http://localhost:3001/api/stocks/${sector}`)
  //     .then( res => {
  //       this.setState({
  //         stocks: res.data
  //       })
  //     })
  //     .catch(console.log);
  // }


  priceSortFunc(a, b, order) {
    if (order === 'desc') {
      return Number(b.latestPrice) - Number(a.latestPrice);
    } else {
      return Number(a.latestPrice) - Number(b.latestPrice);
    }
  }

  changePercentSortFunc(a, b, order) {
    console.log(a);
    if (order === 'desc') {
      return Number(b.changePercent) - Number(a.changePercent);
    } else {
      return Number(a.changePercent) - Number(b.changePercent);
    }
  }

  peRatioSortFunc(a, b, order) {
    console.log(a);
    if (order === 'desc') {
      return Number(b.peRatio) - Number(a.peRatio);
    } else {
      return Number(a.peRatio) - Number(b.peRatio);
    }
  }

  volumeSortFunc(a, b, order) {
    console.log(a);
    if (order === 'desc') {
      return Number(b.latestVolume) - Number(a.latestVolume);
    } else {
      return Number(a.latestVolume) - Number(b.latestVolume);
    }
  }

  marketCapSortFunc(a, b, order) {
    console.log(a);
    if (order === 'desc') {
      return Number(b.marketCap) - Number(a.marketCap);
    } else {
      return Number(a.marketCap) - Number(b.marketCap);
    }
  }

  volumeFormatter(cell) {
    let formatedCell = numeral(cell).format('0,0,0');
    // console.log('Volume: ', typeof formatedCell);
    return `${formatedCell}`;
  }

  chgPercentFormatter(cell) {
    let formatedCell = numeral(cell).format('0.00');
    // console.log('Percent: ', typeof formatedCell);
    if (formatedCell < 0) {
      return <span><Icon icon={androidArrowDropdown} />{formatedCell}%</span>;
    } else {
      return <span><Icon icon={androidArrowDropup} />{formatedCell}%</span>;
    }
  }

  marketCapFormatter(cell) {
    // let formatedCell = numeral(cell).format('0.000 a');
    // console.log('Marketcap: ', typeof formatedCell);
    // return `<span className="positive">${formatedCell}</span>`;
    let formatedCell = numeral(cell).format('0.000 a');
    formatedCell = formatedCell.slice(0, -1);
    return `${formatedCell}B`;
  }

  makeCellLink(cell) {
    const path = `/company/${cell}`
    return <Link to={path}>{cell}</Link>;

    // return <Link to=`/company/${cell}`>${cell}</Link>;

  }


  handleSelectInput = (selected) => {
    let comparator = '';
    let number = 0;

    switch (selected) {
      case '<5':
        comparator = '<';
        number = 5;
        break;
      case '<10':
        comparator = '<';
        number = 10;
        break;
      case '<20':
        comparator = '<';
        number = 20;
        break;
      case '<50':
        comparator = '<';
        number = 50;
        break;
      case '>5':
        comparator = '>';
        number = 5;
        break;
      case '>10':
        comparator = '>';
        number = 10;
        break;
      case '>20':
        comparator = '>';
        number = 20;
        break;
      case '>100':
        comparator = '>';
        number = 100;
        break;
      case '>500':
        comparator = '>';
        number = 500;
        break;
      default:
        console.log('Sorry, we are out of ');
    }

    this.refs.latestPrice.applyFilter({
      number: number,
      comparator: comparator
    });
  }

  handleMarketCapChange = (selected) => {
    let comparator = '';
    let number = 0;

    switch (selected.value) {
      case '<10':
        comparator = '<';
        number = 10000000000;
        break;
      case '<50':
        comparator = '<';
        number = 50000000000;
        break;
      case '>50':
        comparator = '>';
        number = 50000000000;
        break;
      case '>100':
        comparator = '>';
        number = 100000000000;
        break;
      case '>250':
        comparator = '>';
        number = 250000000000;
        break;
      default:
        console.log('Market filter not applied');
    }

    this.refs.marketCap.applyFilter({
      number: number,
      comparator: comparator
    });
  }

  handleSectorChange = (sector) => {
    this.refs.Sector.applyFilter(sector);
  }

  handlePeRatioChange = (selected) => {
    
    let comparator = '';
    let number = 0;

    switch (selected) {
      case '<15':
        comparator = '<';
        number = 15;
        break;
      case '>0':
        comparator = '>';
        number = 0;
        break;
      case '<0':
        comparator = '<';
        number = 0;
        break;
      case '>50':
        comparator = '>';
        number = 50;
        break;
      case '>250':
        comparator = '>';
        number = 250000000000;
        break;
      default:
        console.log('P/R Ratio filter not applied');
    }

    this.refs.peRatio.applyFilter({
      number: number,
      comparator: comparator
    });
  }

  resetFilters() {
    this.refs.Sector.cleanFiltered();
    this.refs.latestPrice.cleanFiltered();
    this.refs.peRatio.cleanFiltered();
    this.refs.marketCap.cleanFiltered();
    // this.refs.name1.cleanFiltered();
    // this.refs.name1.cleanFiltered();
  }

  renderPaginationShowsTotal(start, to, total) {
    return (
      <p style={{ color: 'black' }}>
        Number of Companies: {total}
      </p>
    );
  }

  render() {

    return (
      // <div className="container">
        <div className="table">
          {/* <div className="row mt-3 mb-3">
            <div className="col-sm-5">
              <p className="h3">List of S&P 500 Companies</p>
            </div>
            <div className="col-sm-7">
              <p>The S&P 500 stock market index, maintained by S&P Dow Jones Indices, comprises 505 common stocks issued by 500 large-cap companies and traded on American stock exchanges, and covers about 80 percent of the American equity market by capitalization.
              </p>
            </div>
          </div> */}
          
            <dl className="description row">
              <dt className="col-sm-5">
                <p className="h3">List of S&P 500 Companies</p>
              </dt>
              <dd className="col-sm-7">
                The S&P 500 stock market index, maintained by S&P Dow Jones Indices, comprises 505 common stocks issued by 500 large-cap companies and traded on American stock exchanges, and covers about 80 percent of the American equity market by capitalization.
            </dd>
            </dl>
         
          {/* <div className="container mt-3">
            <div className="row mb-3">
              <h1>S&P 500 Companies</h1>
            </div>
          </div>   */}


          <div className="row mb-3">
            <Filters filter={this.filterBySector} sectorFilter={this.handleSectorChange} priceFilter={this.handleSelectInput} peRatioFilter={this.handlePeRatioChange} marketCapFilter={this.handleMarketCapChange} />
          </div>

          <div className="row mb-4">
            <div className="col-sm text-right">
              <button type="button" onClick={this.resetFilters.bind(this)} className='btn btn-outline-primary'>Reset Filters</button>
            </div>
          </div>

          <section className="Data-table">
            <BootstrapTable
              data={this.state.stocks}
              options={{ noDataText: 'No data available', sizePerPage: 25, paginationShowsTotal: this.renderPaginationShowsTotal }}
              bordered={true}
              hover
              // striped
              pagination
              condensed
              // sortIndicator
              version='4'
            >

              <TableHeaderColumn width='85' isKey dataField='symbol' dataFormat={this.makeCellLink} dataSort dataAlign="left" tdStyle={{ 'fontWeight': 'bold' }}>Symbol</TableHeaderColumn>
              <TableHeaderColumn width='330' dataField='companyName' dataSort={true} dataAlign="left">Company</TableHeaderColumn>
              <TableHeaderColumn width='170' ref='Sector' dataField='sector' dataSort dataAlign="left" filter={{ type: 'TextFilter', delay: 1000, condition: 'eq' }}>Sector</TableHeaderColumn>
              <TableHeaderColumn width='80' ref='latestPrice' dataField='latestPrice' dataSort sortFunc={this.priceSortFunc} dataAlign="right" filter={{ type: 'NumberFilter', delay: 1000 }}>Last Price</TableHeaderColumn>
              {/* <TableHeaderColumn width='100' dataField='change' dataAlign="right">Change</TableHeaderColumn> */}
              <TableHeaderColumn width='80' dataField='changePercent' dataSort sortFunc={this.changePercentSortFunc} dataFormat={this.chgPercentFormatter} dataAlign="right">Change</TableHeaderColumn>
              <TableHeaderColumn width='70' ref='peRatio' dataField='peRatio' dataSort sortFunc={this.peRatioSortFunc} dataAlign="right" filter={{ type: 'NumberFilter', delay: 1000 }}>P/E</TableHeaderColumn>
              <TableHeaderColumn width='100' dataField='latestVolume' dataSort sortFunc={this.volumeSortFunc} dataFormat={this.volumeFormatter} dataAlign="right">Volume</TableHeaderColumn>
              <TableHeaderColumn width='100' ref='marketCap' dataField='marketCap' dataSort sortFunc={this.marketCapSortFunc} dataFormat={this.marketCapFormatter} dataAlign="right" filter={{ type: 'NumberFilter', delay: 1000 }}>Market Cap</TableHeaderColumn>

            </BootstrapTable>


          </section>

        </div>
      // </div>
    )
  }

}

export default Table;
