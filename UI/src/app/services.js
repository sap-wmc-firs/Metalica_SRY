const API_END_POINT = "http://localhost:7070";
//const TRADE_SERVICE_API_END_POINT = "http://localhost:8999";
const TRADE_SERVICE_API_END_POINT = "http://localhost:9001/api/trade-data-service/tradeservice";
const REF_DATA_SERVICE_API_END_POINT = "http://localhost:9001/api/ref-data-service/refdataservice";
const MKT_DATA_SERVICE_API_END_POINT = "http://localhost:9001/api/metal-price-service/mktpriceservice";

function fetchJson(url){
    return fetch(url).then(
        response => {
            console.log(response);

            if (response.status == 400)
            throw new Error( "bad request, check token or token expired");

            if (response.status == 404)
             throw new Error("Resource not found");

             if (response.status == 403)
              throw new Error("Not permitted, auth needed");

             //generic
             if (response.state >= 400 && response.status < 500) {
                 throw new Error("client error");
             }

             if (response.status >= 500)
                 throw new Error("Server error ");

             if (response.status == 0)
                 throw new Error("Check network connection ");

           //since we can't know exact error
            if (!response.ok) {
             throw new Error("Request failed");
            }
            
            return response.json()
    })
}

export function fetchTrades() {
    return fetchJson(API_END_POINT + "/getTrades");
}

export function getTradeDataList() {
    return fetchJson(TRADE_SERVICE_API_END_POINT + "/get/trades/all");
}

export function fetchCounterParties() {
    return fetchJson(REF_DATA_SERVICE_API_END_POINT + "/entities/counterparties");
}

export function fetchMarketPrices() {
    return fetchJson(MKT_DATA_SERVICE_API_END_POINT + "/price/all");
}

export function fetchCommodities(){
    return fetchJson(REF_DATA_SERVICE_API_END_POINT + "/entities/commodities");
}

export function fetchLocations(){
    return fetchJson(REF_DATA_SERVICE_API_END_POINT + "/entities/locations");
}