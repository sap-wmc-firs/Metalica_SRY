import * as ActionTypes from "./ActionTypes";
import * as service from "../Services";

export const showRightPanel = (panelName) => {
    return {
        type:ActionTypes.SHOW_RIGHT_PANEL,
        payload: {
            panelName: panelName
        }
    }
}

export const setSelected = (trade) => {
    return {
        type:ActionTypes.SET_SELECTED,
        payload: {
            trade: trade
        }
    }
}

export const CreateTrade = (trade) => {
    return {
        type: ActionTypes.CREATE_TRADE,
        payload: {
            trade: {
                id: trade.id,
                tradeDate: trade.tradeDate,
                qty: trade.qty,
                price: trade.price,
                side: trade.side,
                commodity: trade.commodity,
                counterParty: trade.counterParty,
                location: trade.location
            }
        }
    }
}

export const deleteTraade= id => {
    return{
        type: ActionTypes.DELETE_TRADE,
        payload: {
            id: id
        }
    }
}

export const editTrade = trade => {
    return {
        type: ActionTypes.EDIT_TRADE,
        payload: {
            trade: trade
        }
    }
}

export function initTrades(trades) {
    return {
        type: ActionTypes.INIT_TRADES,
        payload: {
            trades: trades
        }
    }
}

export function updateMarketPrice(mktPriceDataArr) {
    return {
        type: ActionTypes.MKT_PRICE_UPDATED,
        payload: {
            mktPrices: mktPriceDataArr
        }
    }
}

export function loadCounterPartyData(counterPartyData) {
    return {
        type: ActionTypes.LOAD_COUNTER_PARTY_DATA,
        payload: {
            counterPartyData: counterPartyData
        }
    }
}

export function loading (status) {
    return {
        type: ActionTypes.LOADING,
        payload: {
            loading: status
        }
    }
}


export function initError(error) {
    return {
        type: ActionTypes.INIT_ERROR,
        payload: {
            error: error
        }
    }
}

export function fetchTradesAsync() {
    //thunk shall pass the dispatch
    return async function(dispatch, getState) {
        //no error
        dispatch(initError(false));
        dispatch(loading(true));

        try {
            let trades = await service.getTrades();
            dispatch(initTrades(trades));
            dispatch(loading(false));
        }catch (error){
            dispatch(loading(false));
            dispatch(initError(error.toString()));
        }
    }
}

export function fetchTradeDataListAsync() {
    //thunk shall pass the dispatch
    return async function(dispatch, getState) {
        //no error
        dispatch(initError(false));
        dispatch(loading(true));

        try {
            let trades = await service.getTradeDataList();
            dispatch(initTrades(trades));
            dispatch(loading(false));
        }catch (error){
            dispatch(loading(false));
            dispatch(initError(error.toString()));
        }
    }
}

export function fetchMktPriceDataListAsync() {
    //thunk shall pass the dispatch
    return async function(dispatch, getState) {
        //no error
        dispatch(initError(false));
        dispatch(loading(true));

        try {
            let priceDataList = await service.getMarketDataList();
            dispatch(priceDataList);
            dispatch(loading(false));
        }catch (error){
            dispatch(loading(false));
            dispatch(initError(error.toString()));
        }
    }
}

// action creator function
// return a function instead of objects
export function fetchCounterParties() {
    // this function called by thung middleware
    return async function(dispatch) {
        try {
            let counterPartyData = await service.fetchCounterParties();
            dispatch(loadCounterPartyData(counterPartyData));
        }catch (error){
            dispatch(initError(error.toString()));
        }
    }
}
