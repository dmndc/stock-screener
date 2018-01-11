import React, { Component } from 'react';

import './Search.css';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    }
  }

  componentDidMount() {
    const client = window.algoliasearch('2PRBHHP5UP', 'b54bd31f95e9079416e303a8fcf03a45');
    const index = client.initIndex('stocks');

    window.autocomplete('#search-input', { hint: false }, [
      {
        source: window.autocomplete.sources.hits(index, { hitsPerPage: 8 }),
        displayKey: 'my_attribute',
        templates: {
          suggestion: function(suggestion) {
          return '<div class="name">' +
          suggestion._highlightResult.name.value + '</div><div class="symbol">' +
          suggestion._highlightResult.symbol.value + '</div>';
          }
        }
      }
    ]).on('autocomplete:selected', function(event, suggestion, dataset) {
      console.log('Selected stock: ', suggestion, dataset);
      console.log('TICKER: ', suggestion.symbol);

      // window.open('http://localhost:3001/api/stock/' + suggestion.symbol);
      window.location.replace(`/company/${suggestion.symbol}`);
      
    });
  }


  render() {
    return (
      <div>
        <input className="form-control mr-sm-2" type="text" id="search-input" placeholder="Search by ticker or company name..." />
      </div>
    )
  }

}

export default Search;
