import React, { Component } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { Line, Doughnut } from 'react-chartjs-2';

// Import Components
import InfoRow from './../InfoRow/InfoRow';


import './StockDetails.css';


const options = {
  scales: {
    xAxes: [{


      ticks: {
        source: 'labels'
      }
    }],
    yAxes: [{
      scaleLabel: {
        display: false,
        labelString: 'Closing price ($)'
      }
    }]
  },
  legend: { display: false },
  maintainAspectRatio: true
}

const doughNutData = {
  labels: [
    'Institutional',
    'Insiders',
    'Public'
  ],
  datasets: [{
    data: [32.1, 12.9, 65],
    backgroundColor: [
      'black',
      'grey',
      '#36A2EB'
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ],
    options: {
      legend: 'bottom'
    },
    width: 500
  }]
};


class StockDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      quote: {},
      chartData: [{
        data: [],
        borderWidth: 5
      }],
      info: {},
      stats: {},
      financials: {},

      isLoaded: false
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let symbol = this.state.info.symbol;
    let user = this.state.user;
    console.log('Clicked on!')
    console.log('Symbol: ', symbol);
    console.log('User: ', user);
    axios.post('/api/watchlist', {
      user,
      symbol
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  }

  requestPriceData() {

    const pathArray = window.location.pathname.split('/');
    const symbol = pathArray[2];

    // Get Stock Data
    axios.get(`https://api.iextrading.com/1.0/stock/${symbol}/quote`)
      .then(res => {
        this.setState({
          quote: res.data
        })

      })
      .catch(err => {
        console.log(err);
      })


    // Get Chart Data
    axios.get(`https://api.iextrading.com/1.0/stock/${symbol}/chart/1m`)
      .then(res => {

        let data = res.data.map(data => data.close);
        let labels = res.data.map(data => data.label);

        this.setState({
          chartData: {
            labels: labels,
            datasets: [{
              data: data,
              label: 'Close Price',
              type: 'line',
              borderWidth: 2,
              borderColor: 'black',
              // borderCapStyle: 'butt',
              lineTension: 0,
              fill: 'bottom'
            }
            ]
          },
          isLoaded: true
        })

      })
      .catch(err => {
        console.log(err);
      })
  }

  requestCompanyInfo() {
    const pathArray = window.location.pathname.split('/');
    const symbol = pathArray[2];

    // Get Stock Data
    axios.get(`https://api.iextrading.com/1.0/stock/${symbol}/company`)
      .then(res => {
        this.setState({
          info: res.data
        })

      })
      .catch(err => {
        console.log(err);
      })
  }

  requestCompanyStats() {
    const pathArray = window.location.pathname.split('/');
    const symbol = pathArray[2];

    // Get Stock Data
    axios.get(`https://api.iextrading.com/1.0/stock/${symbol}/stats`)
      .then(res => {
        this.setState({
          stats: res.data
        })

      })
      .catch(err => {
        console.log(err);
      })

    // Get Financials 
    axios.get(`https://api.iextrading.com/1.0/stock/${symbol}/financials`)
    .then(res => {
      this.setState({
        financials: res.data.financials
      })

    })
    .catch(err => {
      console.log(err);
    })
  }

  componentDidMount() {

    axios.get("/api/user").then((res) => {
      this.setState({
        user: res.data.id
      })
    })

    this.requestPriceData();
    this.requestCompanyInfo();
    this.requestCompanyStats();

  }


  render() {


    const formattedPercent = numeral(this.state.quote.changePercent).format('0.00%');


    return (
      <div className="container">
      
        <div className="row">
          <div className="col-sm-6">
            <div className="card text-white bg-dark mb-3 rounded-0 border-0">
              <div className="card-body mb-2 mt-2">
                <h2>{this.state.quote.symbol}
                  <span className={(this.state.quote.changePercent > 0 ? 'text-success ml-5' : 'text-danger ml-5')}>
                    {this.state.quote.changePercent > 0 ? <span className="oi oi-caret-top"></span> : <span className="oi oi-caret-bottom"></span>}
                    {formattedPercent}
                  </span>
                </h2>
                <h3 className="company-name">{this.state.quote.companyName}</h3>
                <span className="mb-2"><h6 className="text-uppercase mb-2">{this.state.info.sector}</h6></span>

                <div className="row mb-3 mt-3">
                  <div className="col-sm-5 text-left mt-3">
                    <h6 className="text-uppercase">52 Week Range: <span>{this.state.quote.week52Low} - {this.state.quote.week52High}</span></h6>
                    {/* <h5>{this.state.quote.week52Low} - {this.state.quote.week52High}</h5> */}
                   <h6 className="text-uppercase">YTD Return: <span>{numeral(this.state.quote.ytdChange).format('0.00%')}</span></h6>
                   {/* <h5>{numeral(this.state.quote.ytdChange).format('0.00%')}</h5> */}
                  </div>
                  <div className="col-sm-7 mt-3">
                    <h2 className="mt-1 mb-2 text-right align-top">Last price: ${this.state.quote.close}</h2>
                  </div>
                </div>


                <div className="row mt-1">
                  <div className="col-sm">
                    <h6 className="text-left text-secondary"><span className="oi oi-clock mr-3"></span>Latest update: {this.state.quote.latestTime}</h6>
                  </div>
                  <div className="col-sm">
                    <h6 className="watchlist-link text-right" onClick={this.handleClick}><span className="oi oi-star"></span>Add to Watchlist</h6>
                  </div>
                </div>
                {/* <h6 className="watchlist-link text-right" onClick={this.handleClick}><span className="oi oi-star"></span>Add to Watchlist</h6> */}
              </div>
              {/* <div className="card-footer">
                <small className="text-muted">Last updated 3 mins ago</small>
              </div> */}
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card rounded-0">
              <div className="card-body">
                {this.state.isLoaded ? <Line data={this.state.chartData} options={options} /> : <div>Still Loading... </div>}
              </div>
            </div>
          </div>

        </div>


          <div className="company-info ">
            <h5 className="card-header text-uppercase">Company Info</h5>
            <div className="card-body">



              <div className="row">
                <div className="col-sm text-left">
                  <h4 className="card-title">{this.state.info.companyName}</h4>
                  <p className="card-text">{this.state.info.description}</p>

                  <table className="table mt-3">
                    <tbody>
                      <tr>
                        <th scope="row">CEO</th>
                        <td className="text-right">{this.state.info.CEO}</td>
                      </tr>
                      <tr>
                        <th scope="row">Industry</th>
                        <td className="text-right">{this.state.info.industry}</td>
                      </tr>
                      <tr>
                        <th scope="row">Exchange</th>
                        <td className="text-right">{this.state.info.exchange}</td>
                      </tr>
                      <tr>
                        <th scope="row">Website</th>
                        <td className="text-right"><a href={this.state.info.website}>{this.state.info.website}</a></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="col-sm">
                  <h4 className="card-title text-center mb-3">Ownership</h4>
                  <Doughnut
                    data={doughNutData}
                    width={200}
                    height={200}
                    options={{ maintainAspectRatio: true }}
                    legend={{ position: 'top', labels: { boxWidth: 20 } }}
                    labels={{ boxWidth: 10 }}
                  />
                </div>

                <div className="col-sm">
                  <h4 className="card-title text-center mb-3">Performance</h4>


                  <table className="table mt-3">
                    <tbody>
                      <tr>
                        <th scope="row">5 Day</th>
                        <td className="text-right">
                          <strong>
                            {numeral(this.state.quote.changePercent).format('0.00%')}
                            

                            {/* {this.state.quote.changePercent > 0
                              ?
                              <span className="oi oi-caret-top">{numeral(this.state.quote.changePercent).format('0.00%')}</span>
                              :
                              <span className="oi oi-caret-bottom">{numeral(this.state.quote.changePercent).format('0.00%')}</span>} */}

                          </strong></td>
                      </tr>
                      <tr>
                        <th scope="row">1 Month</th>
                        <td className="text-right">
                          <strong>
                            {numeral(this.state.stats.month1ChangePercent).format('0.00%')}
                          </strong></td>
                      </tr>
                      <tr>
                        <th scope="row">3 Month</th>
                        <td className="text-right">
                          <strong>
                            {numeral(this.state.stats.month3ChangePercent).format('0.00%')}
                          </strong></td>
                      </tr>
                      <tr>
                        <th scope="row">YDT</th>
                        <td className="text-right">
                          <strong>
                            {numeral(this.state.stats.ytdChangePercent).format('0.00%')}
                          </strong></td>
                      </tr>
                      <tr>
                        <th scope="row">1 YEAR</th>
                        <td className="text-right">
                          <strong>
                            {numeral(this.state.stats.year1ChangePercent).format('0.00%')}
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>


              <div className="row mt-3 mb-3">
                <InfoRow data={this.state.stats} financials={this.state.financials[0]} />
              </div>
              

            </div>
          </div>



      </div>                       
    )
  }

}

export default StockDetails;
