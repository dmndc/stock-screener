import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import numeral from 'numeral';

// React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css'

// Import my Components
import NavBar from './components/NavBar/NavBar';
import Card from './components/Card/Card';
import Cards from './components/Cards/Cards';
import Ticker from './components/Ticker/Ticker';
import Tile from './components/Tile/Tile';
import WatchList from './components/WatchList/WatchList';
import List from './components/List/List';
import Dashboard from './components/Dashboard/Dashboard'

import router from './router';
import { withRouter } from "react-router-dom";

import { getStocksFromDb } from './utils/stocks-api';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      auth_id: null,
      picture: '',
      // stocks: []
      topGainers: null
    }
  }

  componentWillMount(){
    axios.get("/me").then((res) => {
      console.log(res.data.id)
      this.setState({
        auth_id:res.data.id,
        picture:res.data.picture
      })
    })

    axios.get("/api/user").then((res) => {
      this.setState({
        id: res.data.id
      })
    })

    // axios.get('/api/top/gainers')
    // .then(res => {
    //   this.setState({
    //     topGainers: res.data
    //   })
    // }) 

  }

  componentDidMount() {

    // axios.get('/api/top/gainers')
    //   .then(res => {
    //     this.setState({
    //       topGainers: res.data
    //     })
    //   })

    // getStocksFromDb().then(stocks => {
    //   this.setState({ stocks });
    // }).catch(err => {
    //   console.log('Err: ', err);
    // });
  }

  render() {

    return (
      <div className="app">
        <NavBar user={this.state.auth_id} picture={this.state.picture} />
        {/* {this.state.auth_id !== null ? <WatchList /> : null} */}
       
        {(this.props.location.pathname === '/') &&
          <Dashboard />
        }

        { router }

      </div>
    );
  }
}

export default withRouter(App);
