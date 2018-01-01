import React, { Component } from 'react';

import numeral from 'numeral';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


import './Filters.css';


class Filters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      marketCapFilter: null,
      sectorFilter: null,
      priceFilter: null,
      peRatioFilter: null
    }
  }


  handleSectorChange = (sectorFilter) => {
    
    if (sectorFilter === null) {
      this.setState({ sectorFilter });  
      this.props.sectorFilter('');
    } else {
      this.props.sectorFilter(sectorFilter.value);
      this.setState({ sectorFilter: sectorFilter.value });    
    }
  }

  handlePriceFilterChange = (priceFilter) => {
    
    if (priceFilter === null) {
      this.setState({ priceFilter });  
      this.props.priceFilter('');
    } else {
      this.props.priceFilter(priceFilter.value);
      this.setState({ priceFilter: priceFilter.value });    
    }
  }

  handlePeRatioChange = (peRatioFilter) => {
    if (peRatioFilter === null) {
      this.setState({ peRatioFilter });  
      this.props.peRatioFilter('');
    } else {
      this.props.peRatioFilter(peRatioFilter.value);
      this.setState({ peRatioFilter: peRatioFilter.value });    
    }
  }

  handleMarketCapChange = (marketCapFilter) => {
    console.log('MCap Filter: ', marketCapFilter);

    if (marketCapFilter === null) {
      this.setState({ marketCapFilter });  
      this.props.marketCapFilter('');
    } else {
      this.props.marketCapFilter(marketCapFilter);
      this.setState({ marketCapFilter });    
    }
  }



  render() {

    const { stocks } = this.state;
    const percent = numeral(this.props.change).format('0.00');
    

    return (
      <div className="container">
        <div className="row">
        <div className="col-sm">
          
          <h6 className="text-uppercase"><span className="oi oi-chevron-bottom mr-3"></span>Sector</h6>
          <Select
            id="sector-select"
            ref="sectorSelect"
            value={this.state.sectorFilter}
            onChange={this.handleSectorChange}
            placeholder={'Filter by sector...'}
            options={[
              { value: 'Basic Materials', label: 'Basic Materials' },                            
              { value: 'Communication Services', label: 'Communication Services' },
              { value: 'Consumer Cyclical', label: 'Consumer Cyclical' },                            
              { value: 'Consumer Defensive', label: 'Consumer Defensive' },    
              { value: 'Energy', label: 'Energy' },                                                    
              { value: 'Financial Services', label: 'Financial Services' },
              { value: 'Healthcare', label: 'Healthcare' },
              { value: 'Industrials', label: 'Industrials' },              
              { value: 'Real Estate', label: 'Real Estate' },                            
              { value: 'Technology', label: 'Technology' }, 
              { value: 'Utilities', label: 'Utilities' }                            
            ]}
            // multi={true}
            removeSelected={false}
          />
        </div>
        {/* <div className="col-sm">
          
        <h6>Industry</h6>
          <Select
            name="sector-select"
            value={this.state.value}
            onChange={this.handleChange}
            placeholder={'Filter by industry...'}
            options={[
              { value: 'Financial', label: 'Financial' },
              { value: 'Healthcare', label: 'Healthcare' }
            ]}
          />

        </div> */}
        <div className="col-sm">
          
          <h6 className="text-uppercase"><span className="oi oi-chevron-bottom mr-3"></span>Price</h6>
          <Select
            id="price-select"
            name="price-select"
            ref="priceSelect"
            value={this.state.priceFilter}
            onChange={this.handlePriceFilterChange}
            placeholder={'Filter by price...'}            
            options={[
              { value: '<5', label: 'Under $5' },
              { value: '<10', label: 'Under $10' },
              { value: '<20', label: 'Under $20' },
              { value: '<50', label: 'Under $50' },
              { value: '>5', label: 'Over $5' },
              { value: '>10', label: 'Over $10' },
              { value: '>20', label: 'Over $20' },
              { value: '>100', label: 'Over $100' },
              { value: '>500', label: 'Over $500' },
            ]}
          />
        </div>

        <div className="col-sm">
          
          <h6 className="text-uppercase"><span className="oi oi-chevron-bottom mr-3"></span>Change</h6>
          <Select
            name="sector-select"
            value={this.state.value}
            placeholder={'Filter by % change...'}                        
            onChange={this.handleChange}
            options={[
              { value: 'Financial', label: 'Financial' },
              { value: 'Healthcare', label: 'Healthcare' }
            ]}
          />
        </div>

        <div className="col-sm">
          
          <h6 className="text-uppercase"><span className="oi oi-chevron-bottom mr-3"></span>P/E Ratio</h6>
          <Select
            name="pe-ratio"
            id="pe-ratio"
            ref="peRatioSelect"
            value={this.state.peRatioFilter}
            onChange={this.handlePeRatioChange}
            placeholder={'Filter by P/E Ratio...'}            
            options={[
              { value: '<0', label: 'Negative (<0)' },
              { value: '>0', label: 'Positive (>0)' },
              { value: '<15', label: 'Low (<15)' },
              { value: '>50', label: 'High (>50)' },
              
            ]}
          />
        </div>   

        <div className="col-sm">
          
        <h6 className="text-uppercase"><span className="oi oi-chevron-bottom mr-3"></span>Market Cap</h6>
          <Select
            id="marketcap-select"
            ref="marketCapSelect"
            value={this.state.marketCapFilter}
            clearable={true}
            placeholder={'Filter by Market Cap...'}                        
            onChange={this.handleMarketCapChange}
            openOnFocus={false}
            openOnClick={true}            
            options={[
              { value: '<10', label: 'Under $10 Billion' },
              { value: '<50', label: 'Under $50 Billion' },
              { value: '>50', label: 'Over $50 Billion' },
              { value: '>100', label: 'Over $100 Billion' },
              { value: '>250', label: 'Over $250 Billion' },
            ]}
          />

        </div>
          
        </div>


      </div>
    )
  }

}

export default Filters;
