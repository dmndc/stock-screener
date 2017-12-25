<div className="row">
<div className="col-sm-5">
  <div className="card text-white bg-dark mb-3 rounded-0 border-0">
    <div className="card-body">
      <h2>MSFT
      <span className="text-success ml-5">
          <span className="oi oi-caret-top"></span>
          2.24%
      </span>
      </h2>
      <h3>Microsoft</h3>
      <h6 className="text-uppercase">Technology</h6>
      <h4 className="mt-4">Last price: $223
    </h4>
      {/* <h5 className="text-uppercase">52 Week Range</h5>
      <h4>210 - 238</h4> */}

      <h6 className="text-right"><span className="oi oi-star"></span>Add to Watchlist</h6>
    </div>
    <div className="card-footer">
      <small className="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
</div>

<div className="col-sm-7">
  <div className="row">
    <div className="col-sm-4">
      <Ticker symbol="SPY" />
    </div>
    <div className="col-sm-4">
      <Ticker symbol="DIA" />
    </div>
    <div className="col-sm-4">
      <Ticker symbol="IWM" />
    </div>
  </div>
  <div className="row mt-4">
    <div className="col-sm-4">
      <Ticker symbol="SPY" />
    </div>
    <div className="col-sm-4">
      <Ticker symbol="SPY" />
    </div>
    <div className="col-sm-4">
      <Ticker symbol="IWM" />
    </div>
  </div>
</div>
</div>
</div>

<h1>{numeral(24121709904816).format('0.00 a')}</h1>
numeral(cell).format('0.00 a');
{router}