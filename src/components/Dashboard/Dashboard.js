import React, { Component } from 'react'
import axios from 'axios';
import numeral from 'numeral';
import { Line, HorizontalBar } from 'react-chartjs-2';


// Import Components

import List from '../List/List';
import WatchList from '../WatchList/WatchList';


const optionsSectorChart = {
  legend: { display: false },
  scales: {
    xAxes: [{
      display: true,
      fontColor: 'yellow',
      labels: {
        fontColor: "white"
      },
      ticks: {
        fontColor: "white",
        display: true,
        source: 'labels'
      }
    }],
    yAxes: [{
      display: true,
      scaleLabel: {
        display: false,
        fontColor: "white",
        labelString: 'Closing price ($)'
      },
      ticks: {
        display: true,
        fontColor: "white",
        fontSize: 16
      }
    }]
  }
}


class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      auth_id: null,
      quote: {},
      sectors: [],
      chartData: [{
        data: [],
        borderWidth: 5
      }],
    }


  }

  componentDidMount() {
    axios.get("/me").then((res) => {

      this.setState({
        auth_id: res.data.id,
        picture: res.data.picture
      })
    })

    // Get SPY data
    axios.get(`https://api.iextrading.com/1.0/stock/SPY/quote`)
      .then(res => {
        this.setState({
          quote: res.data
        })

      })
      .catch(err => {
        console.log(err);
      })


    // Get Chart Data
    axios.get(`https://api.iextrading.com/1.0/stock/SPY/chart/1m`)
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
              pointStyle: 'circle',
              radius: 5,
              hoverRadius: 15,
              // borderColor: '#5a9ce7',
              borderColor: 'rgba(0,0,0,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              pointBorderColor: "rgba(0,0,0,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 0,
              pointHoverRadius: 10,
              pointHoverBackgroundColor: "rgba(255,0,0,1)",
              pointHoverBorderColor: "rgba(255,0,0,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 4,
              pointHitRadius: 10,
              lineTension: 0.1,
              fill: 'bottom',
              backgroundColor: 'rgba(229,229,229,0.4)',

            }
            ]
          },
          isLoaded: true
        })

      })
      .catch(err => {
        console.log(err);
      })

    // Get Sector Data 
    axios.get('/api/stocks/sectors/change')
      .then(res => {
        this.setState({
          sectors: res.data
        })
      })
      .catch(err => {
        console.log(err);
      })

  }

  render() {
    const options = {
      scales: {
        xAxes: [{
          display: true,
          ticks: {
            display: false,
            source: 'labels'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: false,
            labelString: 'Closing price ($)'
          }
        }]
      },
      legend: { display: false },
      maintainAspectRatio: true
    }

    let sectors = this.state.sectors.map(res => {
      return res.sector;
    })

    let sectorData = this.state.sectors.map(res => {
      let percentage = numeral(res.AvgPercent).format('0.00');
      return percentage;
    })


    const data = {
      labels: sectors,
      // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'YTD %Change',
          backgroundColor: 'rgba(255,99,132,0.2)',
          // borderColor: 'rgba(255,99,132,1)',
          borderColor: 'red',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          // data: [65, -59, 80, 81, -56, -55, 40]
          data: sectorData,

        },

      ]
    };


    return (
      <div className="container">


        <div className="row">
          <div className="col-sm-5">
            {/* <Tile symbol="SPY" /> */}

            <div className="card text-white bg-dark mb-3 rounded-0 border-0">
              <div className="card-body">
                <h2>S&P 500
                    <span className={this.state.quote.percentChange > 0 ? 'text-success ml-5' : 'text-danger ml-5'}>
                    {2 > 0 ? <span className="oi oi-caret-top"></span> : <span className="oi oi-caret-bottom"></span>}
                    {numeral(this.state.quote.changePercent).format('0.00%')}
                    {/* {this.state.quote.changePercent} */}
                  </span>
                </h2>
                {/* <h3>S&P 500</h3> */}
                <h5 className="text-uppercase">stock market index</h5>
                <h2 className="mt-4">Index Value: {this.state.quote.latestPrice * 10}
                  {/* <h4 className="mt-4">Last price: {numeral(this.state.quote.latestPrice).format('00.0') * 10} */}
                </h2>
                <h6 className="text-uppercase">52 Week Range</h6>
                <h5>{this.state.quote.week52Low * 10} - {this.state.quote.week52High * 10}</h5>
                {/* <h5>{ numeral(this.state.quote.week52Low).format('00.0') * 10 } - { numeral(this.state.quote.week52High).format('00.0') * 10 }</h5> */}


                <h6 className="text-uppercase">YTD Return</h6>
                <h5>{numeral(this.state.quote.ytdChange).format('0.00%')}</h5>


                <h6 className="text-right text-muted"><span className="oi oi-clock mr-3"></span>Latest update: {this.state.quote.latestTime}</h6>
                {/* <h6 className="text-right" onClick={this.handleClick}><span className="oi oi-star"></span>Add to Watchlist</h6> */}
              </div>
              {/* <div className="card-footer">
              <small className="text-muted">Last updated 3 mins ago</small>
            </div> */}
            </div>

          </div>

          <div className="col-sm-7">
            <div className="card rounded-0 border-0">
              {this.state.isLoaded ? <Line data={this.state.chartData} options={options} /> : <div>Still Loading... </div>}
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm">
            <List title="Best Performers" className="top-list card rounded-0" icon="oi oi-arrow-thick-top mr-3" source="gainers" />
          </div>
          <div className="col-sm">
            <List title="Worst Performers" className="top-list card rounded-0" icon="oi oi-arrow-thick-bottom mr-3" source="losers" />
          </div>
          <div className="col-sm">
            {this.state.auth_id !== null ? <WatchList /> : <List title="Most Active" className="card rounded-0" icon="oi oi-bar-chart mr-3" source="volume" />}

          </div>
        </div>

        <div className="row mb-5">
          <div className="col-sm-8">
            <div className="card text-white bg-dark rounded-0">
              {/* <div className="card-header">Header</div> */}
              <div className="card-body">
                <h5 className="card-title text-uppercase">Perfomance by Sectors</h5>
                <h6 className="card-subtitle mb-2 text-muted">YTD Percent Change</h6>
                <HorizontalBar data={data} options={optionsSectorChart} />
                {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
              </div>
            </div>
          </div>
          <div className="col-sm">
            {this.state.auth_id !== null ? <List title="Most Active" className="card rounded-0" icon="oi oi-bar-chart mr-3" source="volume" /> : null}


          </div>

        </div>

      </div>

    )
  }

}

export default Dashboard;
