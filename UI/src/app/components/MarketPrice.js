import React, {Component} from "react";
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter } from 'material-ui/Table';


import io from 'socket.io-client';

class MarketPrice extends React.Component {

  constructor(props){
      super(props);
      this.classes = props;
      this.state = {
        socket : null,
        oldMktPrices : new Object(),
        mktPrices : []
      }
  }

    componentDidMount() {
      
      this.state.socket = io.connect( 'http://localhost:9003' );
      console.log("this.state.socket : "+this.state.socket);

      // listen to messages on socket
      // built-in message
      this.state.socket.on( 'connect', () => {
          alert("connected..");
          this.state.socket.emit( 'join channel', 'MARKET_DATA_MODIFIED', function( confirmation ) {
            alert( confirmation );
        });
      } );
      this.state.socket.on( 'connect_error', () => {
              alert( "There seems to be an issue with Data Notification Service !!" );
      } );
      
      this.state.socket.on('MARKET_DATA_MODIFIED', ( socketData ) => {
          var respData = JSON.parse(socketData);
          if(respData.length > 0){
                  //alert("respData.length : "+respData.length);
                  if(this.state.mktPrices != null && this.state.mktPrices.length > 0){
                    var priceMap = new Object();
                    this.state.mktPrices.map(n => {
                      priceMap[n.symbol] = n.price;
                    });
                    this.setState({oldMktPrices:priceMap}); 
                  }
                  this.setState({mktPrices:respData}); 
          }
      } );

}

    
    render() {
      return (
        <List>
          <Typography type="caption" headline>
               <b>Live market prices of metal, all prices are listed in USD.</b><br/>
            </Typography>
          <ListItem leftAvatar={<Avatar>A</Avatar>}>
            {this.state.mktPrices.map(n => {
                      return (
                       <p><b>{n.name}</b> {this.state.oldMktPrices[n.symbol] != null && this.state.oldMktPrices[n.symbol] > n.price ? <font color="red" weight="bold">{n.price}</font> : <font color="green" weight="bold">{n.price}</font>}</p>
                      );
                    })}
          </ListItem>
        </List>
      );
    }
  }
export default MarketPrice;