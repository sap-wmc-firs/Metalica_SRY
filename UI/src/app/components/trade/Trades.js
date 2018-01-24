import React, {Component} from "react";
import PropTypes from 'prop-types';

import Grid from "react-bootstrap/lib/Grid";
import Row from "react-bootstrap/lib/Row";

import io from 'socket.io-client';

import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';

import Search from "./Search";
import TradeList from "./TradeList";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import * as actions from "../../state/actions";


export default class Trades extends Component{

    constructor(props){
        super(props);
        this.state = {
            socket : null,
            refData : {},
            trades: []
        }
    }
    
    componentWillReceiveProps(nextprops){
        console.log(nextprops);
        this.setState({refData : {commodities: nextprops.commodities, locations: nextprops.locations,
                              counterParties: nextprops.counterparties, marketPrices: nextprops.mktPrices}})
        this.setState({trades: nextprops.trades});
    }
    
    componentWillMount(){
        this.props.actions.fetchCounterParties();
        this.props.actions.fetchLocations();
        this.props.actions.fetchCommodities();
        this.props.actions.fetchMarketPrices();
    }

    componentDidMount() {

        this.state.socket = io.connect( 'http://localhost:9003' );

        // listen to messages on socket
        // built-in message
        this.state.socket.on( 'connect', () => {
            this.state.socket.emit('join channel', 'TRADE_ADDED', function( confirmation ) {
                //console.log( confirmation );
            } );
        } );
        this.state.socket.on( 'connect_error', () => {
                alert( "There seems to be an issue with Data Notification Service !!" );
        } );
        this.state.socket.on( 'TRADE_ADDED', ( socketData ) => {
            alert(socketData);
            var respData = JSON.parse(socketData);
            //alert(respData);
               if(respData.length > 0){
                   this.props.actions.initTrades(respData);
               }
        } );
                
        this.props.actions.fetchTradeDataListAsync();
        
      }

    showRightPanel (panelName){
        this.props.actions.showRightPanel(panelName);
    }
    setSelected(tradeObj){
        this.props.actions.setSelected(tradeObj);
    }
    
    showAll(){
        this.setState({trades: this.props.trades});
    }
    
    filterTrades(trade){
        console.log(trade);
        var tradeCopy = this.props.trades;
        tradeCopy = tradeCopy.filter(tradeObj => {
            var res = ((trade.commodity == ''? true : tradeObj.commodity == trade.commodity)
                && (trade.counterParty == ''? true : tradeObj.counterParty == trade.counterParty)
                   && (trade.location == ''? true : tradeObj.location == trade.location)
                      && (trade.to != '' &&  trade.from != '' ? (Date.parse(trade.from) < Date.parse(tradeObj.tradeDate) && Date.parse(tradeObj.tradeDate) < Date.parse(trade.to)) : true)
                         && (trade.side == '' ? true : tradeObj.side == trade.side)
              );
            console.log(res);
            return res;
        });
        this.setState({trades: tradeCopy});
    }


    render(){
        const {rightPanel, selected, trades} = this.props;
        return (
            <div>
                <Row><Search refData = {this.state.refData} filterTrades={this.filterTrades.bind(this)}
                showAll={this.showAll.bind(this)}/></Row>
                <Row>
                <TradeList 
                    rightPanel = {this.props.rightPanel}
                    selected = {this.props.selected}
                    setSelected = {(tradeObj) => this.setSelected(tradeObj)}
                    trades = {this.state.trades}
                    refData = {this.state.refData}
                    showRightPanel = {(panelName) => this.showRightPanel(panelName)}
                />
                </Row>
                </div>
        );
    }
}

Trades.defaultProps = {
    rightPanel: 'none',
    selected: {},
    trades: [],
    loading: false,
    error: false,
    errorMessage: ''
}

Trades.propTypes = {
    
}