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
        this.state ={
            commodities : [],
            locations: [],
            counterParties: [],
            price: '',
            elements:{},
            trade:{commodity:'',location:'',counterParty:''}
        }
    }
    
    componentDidMount(){
        fetch("http://localhost:9001/api/ref-data-service/refdataservice/entities/locations")
            .then(response=>{
            response.json().then(data=> {
                console.log(data);
                this.setState({locations:data});
              });
        }); 
        fetch("http://localhost:9001/api/ref-data-service/refdataservice/entities/counterparties")
            .then(response=>{
            response.json().then(data=> {
                console.log(data);
                this.setState({counterParties:data});
              });
        }); 
        fetch("http://localhost:9001/api/ref-data-service/refdataservice/entities/commodities")
            .then(response=>{
            response.json().then(data=> {
                console.log(data);
                this.setState({commodities:data});
                fetch("http://localhost:9001/api/metal-price-service/mktpriceservice/price/all")
                .then(response=>{
                    response.json().then(data=> {
                        console.log(data);
                        var elements = {};
                        data.forEach(item=>{
                            elements[item.symbol] = item.price;
                        })
                        this.setState({elements:elements,price:elements[this.state.commodities[0].symbol]});
                    });
                }); 
            });
        }); 
        
        if(this.props.isEditable == 'true'){
            this.setState({trade: this.props.trade})
        }
        
        this.state.socket = io.connect('http://localhost:9003');

        this.state.socket.on( 'connect', () => {
            this.state.socket.emit( 'join channel', 'marketDataModified', function( confirmation ) {
                console.log( confirmation );
            } );
        } );
        this.state.socket.on( 'connect_error', () => {
                //alert( "There seems to be an issue with Data Notification Service! Please contact #FIIDS" );
        } );
        this.state.socket.on( 'market data modified', ( socketData ) => {
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
        this.setState({price:this.state.elements[event.target.value]});
    }

    saveTrade() {
        console.log("save trade called..");
        console.log(this.state.trade);
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
                        <Icon icon={bin} />
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
                                    defaultValue=""
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
            <Select native defaultValue={this.state.trade.commodity} 
            input={<Input id="commodityCT" />}  onChange={this.setPriceValue.bind(this)} >
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
                                    checked={this.state.trade.side === 'Buy'}
                                    onChange={this.handleChange}
                                    value="Buy"
                                    name="side"
                                    aria-label="Buy"
                                    label="Buy"
                                /> Buy
                                <Radio
                                    id="sideCT"
                                    ref="sideCT"
                                    checked={this.state.trade.side === 'Sell'}
                                    onChange={this.handleChange}
                                    value="Sell"
                                    name="side"
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
                                    <Select native defaultValue={this.state.trade.counterParty} 
                                    input={<Input id="counterPartyCT" />}>
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
                            <td>Location</td>
                            <td>
                                <FormControl className={this.classes.formControl}>
                                    {/* <InputLabel htmlFor="uncontrolled-native">Location</InputLabel> */}
                                    {this.state.locations.length > 0 ?
                                        <Select native defaultValue={this.state.trade.location} 
                                        input={<Input id="locationCT" />}>
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