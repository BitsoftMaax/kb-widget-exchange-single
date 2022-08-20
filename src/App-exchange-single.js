import React from 'react';
import ExchangeSingle from "./components/ExchangeSingle";

function AppExchangeSingle(props) {

  return (
    <div>
      <ExchangeSingle symbol={props.symbol}/>
    </div>
  );
}

export default AppExchangeSingle;
