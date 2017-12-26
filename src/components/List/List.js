import React, { Component } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { Link } from 'react-router-dom';


import './List.css';

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      watchlist: [],
      topGainers: [],
      oldPrice: null,
      updatedPrice: null,
      isUpdated: false,
      increasing: false,
      data: []
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


    axios.get(`/api/stocks/top/${this.props.source}`)
      .then(res => {
        this.setState({
          data: res.data
        })
      })

  }

  render() {
    
    return (

      <div className={this.props.class}>
        <div className="card-header"><span className={this.props.icon}></span>{this.props.title}</div>
        <div className="card-body">

          <table className="table table-sm">

            <tbody>

              {this.state.data.map(item => {
                let symbol = '/company/' + item.symbol;

                return <tr key={item.id}>

                  <td>
                    <Link className="my-class" to={symbol}>
                      <div className="font-weight-bold">{item.symbol}</div>
                    </Link>
                    <div className="my-text">{item.companyName}</div>
                  </td>

                  {
                    item.changePercent > 0
                      ?
                      <td className="text-right"><h5 className="positive">{numeral(item.changePercent).format('0.00')}%</h5></td>
                      :
                      <td className="text-right"><h5 className="negative">{numeral(item.changePercent).format('0.00')}%</h5></td>
                  }

                </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

}

export default List;
