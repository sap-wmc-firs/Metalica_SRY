import * as ActionTypes from './ActionTypes';

const INITIAL_STATE = {
    rightPanel: 'none',
    selected: {},
    mktPrices: [],
    trades: [],
    commodities: [],
    counterParties: [],
    locations: [],
    loading: false,
    error: false,
    errorMessage: ''
};

export default function tradeReducer(state = INITIAL_STATE, action){
    console.log("TradeReducer called: ", state, action);

    switch(action.type){

        case ActionTypes.MKT_PRICE_UPDATED: {
            console.log("MKT_PRICE_UPDATED called");
            let mkPriceData = state.mktPrices;
            mkPriceData = mkPriceData.concat(action.payload.marketPrice);
            return Object.assign({}, state, {mktPrices : mkPriceData})
        }
            
        case ActionTypes.INIT_MARKET_PRICE: {
            console.log("MKT_PRICE_INIT called");
            let mkPriceData = state.mktPrices;
            mkPriceData = mkPriceData.concat(action.payload.mktPrices);
            return Object.assign({}, state, {mkPriceData})
        }
        
        case ActionTypes.LOADING: {
            return Object.assign({}, state, {loading: action.payload.loading})
        }

        case ActionTypes.INIT_ERROR: {
            return Object.assign({}, state, {error: action.payload.error})
        }

        case ActionTypes.INIT_TRADES: {
            return Object.assign({}, state, {trades: action.payload.trades})
        }
            
        case ActionTypes.INIT_COMMODITIES: {
            let commodities = state.commodities;
            commodities = action.payload.commodities;
            return Object.assign({}, state, {commodities})
        }
            
        case ActionTypes.INIT_COUNTERPARTIES: {
            let counterParties = state.counterParties;
            counterParties = action.payload.counterParties;
            return Object.assign({}, state, {counterParties})
        }
        
        case ActionTypes.INIT_LOCATIONS: {
            let locations = state.locations;
            locations = action.payload.locations;
            return Object.assign({}, state, {locations})
        }

        case ActionTypes.SHOW_RIGHT_PANEL: {
            return Object.assign({}, state, {rightPanel: action.payload.panelName})
        }

        case ActionTypes.SET_SELECTED: {
            return Object.assign({}, state, {selected: action.payload.trade})
        }

        case ActionTypes.CREATE_TRADE: {

            let trade = state.find(trade => trade.id == action.payload.trade.id);
            if(!trade)
                return [...state, action.payload.trade]
        }

        case ActionTypes.EDIT_TRADE: {
            return state.map(trade => {
                if(trade.id != action.payload.trade.id)
                    return trade;

                return Object.assign({}, trade, 
                    {qty: action.payload.trade.qty,
                        price: action.payload.trade.price,
                        commodity: action.payload.trade.commodity,
                        side: action.payload.trade.side,
                        tradeDate: action.payload.trade.tradeDate,
                        counterParty: action.payload.trade.counterParty,
                        location: action.payload.trade.location
                    });
            })
        }

        case ActionTypes.DELETE_TRADE: {
            return state.filter(trade => trade.id != action.payload.id);
        }

        default:
            return state;
    }
}