import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import Trades from "../components/trade/Trades";
import * as actions from "../state/actions";

const mapStateToProps = (state) => {
    return {
        rightPanel: state.tradeState.rightPanel,
        selected: state.tradeState.selected,
        trades: state.tradeState.trades,
        mktPrices: state.tradeState.mktPrices,
        commodities: state.tradeState.commodities,
        counterparties: state.tradeState.counterParties,
        locations: state.tradeState.locations,
        loading: state.tradeState.loading,
        error: state.tradeState.error,
        errorMessage: state.tradeState.errorMessage
    }
}

 const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
} 

export default connect(mapStateToProps, 
                    mapDispatchToProps) (Trades)