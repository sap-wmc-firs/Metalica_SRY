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
            socket : null
        }
    }
    
    componentWillReceiveProps(nextprops){
        console.log(nextprops);
    }

    componentDidMount() {

        var authURL = "http://localhost:9001/api/ref-data-service/refdataservice/username";
        fetch(authURL)
        .then(results => {
          return results.json;
        }).then(data => {
          console.log(data);
        })
        
        this.state.socket = io.connect( 'http://localhost:9003/consumer' );

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
            var respData = JSON.parse(socketData);
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


    render(){
        const {rightPanel, selected, trades} = this.props;
        return (
            <div>
                <Row>
                <Search />
                </Row>
                <Row>
                <TradeList 
                    rightPanel = {this.props.rightPanel}
                    selected = {this.props.selected}
                    setSelected = {(tradeObj) => this.setSelected(tradeObj)}
                    trades = {this.props.trades}
                    showRightPanel = {(panelName) => this.showRightPanel(panelName)}
                ></TradeList>
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