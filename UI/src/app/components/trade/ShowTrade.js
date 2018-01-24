import React, {Component} from "react";
import PropTypes from "prop-types";
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Icon from 'react-icons-kit';
import { bin } from 'react-icons-kit/icomoon/bin';
import { pencil } from 'react-icons-kit/icomoon/pencil'; 
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

export default class ShowTrade extends Component{

    constructor(props){
        super(props);

        this.classes = props;
    }
    
    deleteTrade(){
        fetch('localhost:9001/api/trade-data-service/tradeservice/delete/trade', {
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
                            <TableCell>Trade Date</TableCell>
                            <TableCell>{this.props.trade.tradeDate}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Commodity</TableCell>
                            <TableCell>{this.props.trade.commodity}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Side</TableCell>
                            <TableCell>{this.props.trade.side}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Counterparty</TableCell>
                            <TableCell>{this.props.trade.counterParty}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Price</TableCell>
                            <TableCell>{this.props.trade.price}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Location</TableCell>
                            <TableCell>{this.props.trade.location}</TableCell>
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