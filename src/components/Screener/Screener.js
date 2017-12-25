import React, { Component } from 'react'

// Import Components
import Table from './../Table/Table';

class Screener extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.location)
    

    return (
      <div className="container mt-3">
        <Table />
      </div>
    )
  }

}

export default Screener;
