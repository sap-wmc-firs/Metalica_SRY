import React, {Component} from "react";
import PropTypes from "prop-types";

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';
import io from 'socket.io-client';
import Icon from 'react-icons-kit';
import { bin } from 'react-icons-kit/icomoon/bin';

import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Radio, { RadioGroup } from 'material-ui/Radio';


export default class CreateTrade extends Component{

    constructor(props){
        super(props);
        this.classes = props;
        this.state = {
            commodities : [],
            locations: [],
            counterParties: [],
            price: '',
            elements: {},
            counterParty: '',
            commodity: '',
            location: '',
            side: '',
            quantity: 0
        }
    }
    
    componentDidMount(){
        if('trade' in this.props && this.props.isEditable){
            this.setState(
            {side : this.props.trade.side, 
             quantity: this.props.trade.quantity, 
             tradeDate: this.props.trade.tradeDate, 
             commodity: this.props.trade.commodity,
             location: this.props.trade.location,
             counterParty: this.props.trade.counterParty
            });
        }
        
        if('refData' in this.props){
            var elements = {};
            var data = this.props.refData.marketPrices;
            data.forEach(item=>{
                elements[item.symbol] = item.price;
            })
            this.setState({elements:elements});

            if(this.props.isEditable == 'true'){
                this.setState({trade: this.props.trade});
                if(this.props.refData.commodities.length > 0){
                    this.setState({price:elements[this.props.trade.commodity]});
                }
                this.setState({
                    locations:this.props.refData.locations,
                    counterParties:this.props.refData.counterParties,
                    commodities:this.props.refData.commodities
                });
            } else {
                if(this.props.refData.commodities.length > 0){
                    this.setState({price:elements[this.props.refData.commodities[0].symbol]});
                }
                this.setState({
                    commodity: this.props.refData.commodities[0].symbol,
                    location: this.props.refData.locations[0].symbol,
                    counterParty: this.props.refData.counterParties[0].symbol
                });
            }
            
            
            
            
        }
        
        this.state.socket = io.connect('http://localhost:9003');

        this.state.socket.on( 'connect', () => {
            //alert("connected..");
            this.state.socket.emit( 'join channel', 'MARKET_DATA_MODIFIED', function( confirmation ) {
                //console.log( confirmation );
            } );
        } );
        this.state.socket.on( 'connect_error', () => {
                alert( "There seems to be an issue with Data Notification Service!");
        } );
        this.state.socket.on('MARKET_DATA_MODIFIED', ( socketData ) => {
            var respData = JSON.parse(socketData);
               if(respData.length > 0){
                   var elements = {};
                   respData.forEach(item=>{
                        elements[item.symbol] = item.price;
                   });
                   this.setState({elements:elements});
               }
        } );
    }
    
    setPriceValue(event){
        this.setState({price:this.state.elements[event.target.value], commodity:event.target.value});
    }

    saveTrade() {
        console.log("save trade called..");
        var tradeObj = new Object();
        tradeObj.tradeId = this.props.trade.tradeId;
        tradeObj.side = this.state.side;
        tradeObj.quantity = parseInt(this.state.quantity);
        tradeObj.price = this.state.price;
        tradeObj.tradeDate = this.state.tradeDate;
        tradeObj.counterParty = this.state.counterParty;
        tradeObj.commodity = this.state.commodity;
        tradeObj.location = this.state.location;
        tradeObj.status = "OPEN";

        this.state.trade = tradeObj;
        
        console.log(this.state.trade);

        fetch('http://localhost:9001/api/trade-data-service/tradeservice/update/trade', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(tradeObj)
          })
    }
    
    handleChange(e){
        this.setState({side: e.target.value});
    }

    render(){
        return(
             <div> 
                 <AppBar position="static">
            
                    <Toolbar>
                        {this.props.isEditable == 'true'
            ?
            <Typography type="Subheading" color="secondary">
                        Trade ID(): {this.props.trade.tradeId}
                        </Typography>
            :
            <Typography type="Subheading" color="secondary">
                        Create Trade
                        </Typography>
            }
                    </Toolbar>
                </AppBar>
               <table>
                    <body>
                        <tr>
                            <td>Trade Date</td>
                            <td>
                                <TextField
                                    ref="tradeDateCT"
                                    id="tradeDateCT"
                                    label=""
                                    type="date"
                                    defaultValue={this.state.tradeDate}
                                    value={this.state.tradeDate}
                                    onChange={(e)=> this.setState({tradeDate: e.target.value})}
                                    className={this.classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Commodity</td>
                            <td>
                                <FormControl className={this.classes.formControl}>
                                    {this.state.commodities.length > 0 ?
            <Select native defaultValue={this.state.commodity} 
            input={<Input id="commodityCT" />} value={this.state.commodity} onChange={this.setPriceValue.bind(this)} >
            {
                                        this.state.commodities.map(n=> {
                                            return (<option value={n.symbol}>{n.name}</option>);
                                        })
            }
            </Select>
                                    :
                                    null
                                    }
                                </FormControl>
                           </td>
                        </tr>
                        <tr>
                            <td>Side</td>
                            <td>
                                <Radio
                                    ref="sideCT"
                                    id="sideCT"
                                    checked={this.state.side === 'Buy'}
                                    onChange={this.handleChange.bind(this)}
                                    value="Buy"
                                    name="side"
                                    aria-label="Buy"
                                    label="Buy"
                                /> Buy
                                <Radio
                                    id="sideCT"
                                    ref="sideCT"
                                    checked={this.state.side === 'Sell'}
                                    onChange={this.handleChange.bind(this)}
                                    name="side"
                                    value="Sell"
                                    aria-label="Sell"
                                    label="Sell"
                                /> Sell
                          </td>
                        </tr>
                        <tr>
                            <td>Counterparty</td>
                            <td>
                                <FormControl className={this.classes.formControl}>
                                    {/* <InputLabel htmlFor="uncontrolled-native">Counterparty</InputLabel> */}
                                        {this.state.counterParties.length > 0 ?
                                    <Select native defaultValue={this.state.counterParty} 
                                    input={<Input id="counterPartyCT" />} value={this.state.counterParty}
                                            onChange={(e) => this.setState({counterParty:e.target.value})}>
                                            {
                                        this.state.counterParties.map(n=> {
                                        return (<option value={n.symbol}>{n.name}</option>);
                                        })
                                        }
                                    </Select>
                                    :
                                    null
                                    }
                                    {/* <FormHelperText>Uncontrolled</FormHelperText> */}
                                    </FormControl>

                           </td>
                        </tr>
                        <tr>
                            <td>Price</td>
                            <td>
                                <div id="priceCT" ref="priceCT"> {this.state.price}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>Quantity</td>
                            <td>
                                <input type='text' value={this.state.quantity} onChange={e=> this.setState({quantity: e.target.value})} />
                            </td>
                        </tr>
                        <tr>
                            <td>Location</td>
                            <td>
                                <FormControl className={this.classes.formControl}>
                                    {/* <InputLabel htmlFor="uncontrolled-native">Location</InputLabel> */}
                                    {this.state.locations.length > 0 ?
                                        <Select native defaultValue={this.state.location} 
                                        input={<Input id="locationCT" />} value={this.state.location}
                                        onChange = {e => this.setState({location: e.target.value})}>
                                        {
                                        this.state.locations.map(n=> {
                                            return (<option value={n.symbol}>{n.name}</option>);
                                        })
                                    }
                                    </Select>
                                    :
                                    null
                                    }
                                </FormControl>
                             </td>
                        </tr>
                    </body>
                </table>
                <Button raised  className={this.classes.button} onClick = {() => this.props.showRightPanel('none')}>Cancel</Button>&emsp;
{this.props.isEditable == 'true'?
     <Button raised  className={this.classes.button} onClick = {() => this.saveTrade()}>Update</Button>
:
<Button raised  className={this.classes.button} onClick = {() => this.saveTrade()}>Save</Button>
}
            </div> 
        )
    }
}