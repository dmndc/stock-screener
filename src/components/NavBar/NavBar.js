import React, { Component } from 'react';
import { Link } from "react-router-dom";
import logo from './logo.png';
import './NavBar.css';


// Import my components
import Search from './../Search/Search';


class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    }

    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    // axios.get('http://localhost:3001/api/stocks')
    //   .then( res => {
    //     this.setState({
    //       data: res.data
    //     })
    //   }).catch( err => {
    //       console.log(err);
    //   })
  }

  handleLogin() {
    window.location.href = '/login';
  }

  handleLogout() {
    window.location.href = '/logout';
  }

  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-3">
      <div className="container">
        <Link className="navbar-brand" to="/">
        <img  src={logo} className="logo" alt="logo"/>
        My App
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          
          <form className="form-inline mt-2 mt-md-0 ml-5">
            <Search />
          </form>
          
          <ul className="navbar-nav navbar-right ml-5 mr-auto">
            <li className="nav-item">
              <Link className="nav-link text-uppercase active" to="/screener">Screener</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-uppercase active" to="/watchlist">Watchlist</Link>
            </li>           
          </ul>
          
          


          {/* <button type="button" className="btn btn-outline-info btn-live"><span className="oi oi-media-record pulse"></span>Live</button> */}
         

            <ul className="nav navbar-nav navbar-right">
             {
                this.props.user === null 
                ? 
                <li className="nav-item">
                  <button className="btn btn-outline-primary log btn-lg" onClick={this.handleLogin}>LOG IN</button>
                </li>
                :
                <li className="nav-item">
                  <img src={this.props.picture} className="rounded-circle mr-4" height="40" alt="Avatar"></img>
                  <button className="btn btn-outline-danger log" onClick={this.handleLogout}>LOG OUT</button>
                </li>
              }

            </ul>  

        </div>
      </div>
    </nav>
    )
  }

}

export default NavBar;
