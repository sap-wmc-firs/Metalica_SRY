import appConfig from 'config';

function fetchJson(url){
    return fetch(url).then(
        response => {
            console.log(response);

            if (response.status == 400) {
                throw new Error( "Bad request !");
            }
            if (response.status == 404) {
                throw new Error("Resource not found.");
            }
            if (response.status >= 500) {
                throw new Error("Server error");
            }
            //since we can't know exact error
            if (!response.ok) {
                throw new Error("Request failed !!");
            }
            return response.json()
    })
}

export function getTradeDataList() {
    return fetchJson(appConfig.GET_ALL_TRADE_URI);
}

export function fetchMarketPrices() {
    return fetchJson(appConfig.GET_ALL_METAL_MKT_PRICE_URI);
}

export function fetchCounterParties() {
    return fetchJson(appConfig.GET_ALL_COUNTER_PARTIES_URI);
}

export function fetchCommodities(){
    return fetchJson(appConfig.GET_ALL_COMODITIES_URI);
}

export function fetchLocations(){
    return fetchJson(appConfig.GET_ALL_LOCATIONS_URI);
}