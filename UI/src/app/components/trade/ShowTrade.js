import React, {Component} from "react";
import PropTypes from "prop-types";
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Icon from 'react-icons-kit';
import { bin } from 'react-icons-kit/icomoon/bin';
import { pencil } from 'react-icons-kit/icomoon/pencil'; 
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import appConfig from 'config';


export default class ShowTrade extends Component{

    constructor(props){
        super(props);
        this.classes = props;
        this.state = {
            commodities : {},
            locations: {},
            counterParties: {}
        }
    }



    componentDidMount(){
       if('refData' in this.props){
           var commodities = {};
           this.props.refData.commodities.forEach(item=>{
                commodities[item.symbol] = item.name;
           });
            var counterParties = {};
            this.props.refData.counterParties.forEach(item=>{
                counterParties[item.symbol] = item.name;
           });
            var locations = {};
            this.props.refData.locations.forEach(item=>{
                locations[item.symbol] = item.name;
           });
           this.setState({commodities, counterParties, locations});
        }
    }
     
    
    deleteTrade(){
        fetch(appConfig.DELETE_TRADE_URI, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({tradeId: this.props.trade.tradeId})
          })
        this.props.hideShowPanel();
    }

    render(){
        return(
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography type="Subheading" color="secondary">
                        Trade ID: {this.props.trade.tradeId}
                        <Icon icon={pencil} onClick={() => this.props.editAction()} />
                        <Icon icon={bin} onClick={this.deleteTrade.bind(this)}/>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell><b>Trade Date</b></TableCell>
                            <TableCell>{this.props.trade.tradeDate}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><b>Commodity</b></TableCell>
                            <TableCell>{this.state.commodities[this.props.trade.commodity]}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><b>Side</b></TableCell>
                            <TableCell>{this.props.trade.side}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><b>Quantity</b></TableCell>
                            <TableCell>{this.props.trade.quantity}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><b>Price</b></TableCell>
                            <TableCell>{this.props.trade.price}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><b>Counterparty</b></TableCell>
                            <TableCell>{this.state.counterParties[this.props.trade.counterParty]}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><b>Location</b></TableCell>
                            <TableCell>{this.state.locations[this.props.trade.location]}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        )
    }
}

ShowTrade.defaultProps = {

}

ShowTrade.PropTypes = {
    classes: PropTypes.object.isRequired,
}