import React, {Component} from "react";
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Radio from 'material-ui/Radio';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';

const style = {
  margin: 12,
};

export default class Search extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            tradeDate : '',
            location : '',
            commodity : '',
            counterParty : '',
            side : '',
            toDate: '',
            fromDate: ''
        }
        this.classes = props;
    }
    
  clear(){
    this.setState({
        tradeDate : '',
        location : '',
        commodity : '',
        counterParty : '',
        side : '',
        toDate: '',
        fromDate: ''
    })
    this.props.showAll();
  }

  search(){
    this.props.filterTrades(
        {
          to:this.state.toDate, 
          from:this.state.fromDate, 
          location: this.state.location, 
          commodity: this.state.commodity, 
          counterParty: this.state.counterParty,
          side: this.state.side
        })
  }
    
  render(){
      return (
      <AppBar position="static" color="default">
      <form className="row">
        <TextField
          className="col-md-2"
          style={{width: '13%', marginLeft:'25px' }}
          id="tradeDateSearch"
          label="Trade Date (From)"
          type="date"
          value={this.state.fromDate}
          onChange={(e) => this.setState({fromDate: e.target.value})}
          InputLabelProps={{
            shrink: true,
          }}
        /> 
        <TextField
          className="col-md-2"
          style={{width: '13%'}}
          id="toTradeDateSearch"
          label="Trade Date (To)"
          type="date"
          value={this.state.toDate}
          onChange={(e) => this.setState({toDate: e.target.value})}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl className="col-md-1" style={{width: '10%'}}>
          <InputLabel htmlFor="commoditySearch">Commodity</InputLabel>
          <Select native defaultValue={0} input={<Input id="commoditySearch" />}
value={this.state.commodity}
          onChange={(e) => this.setState({commodity: e.target.value})}
>
            <option value="0" />
            {'commodities' in this.props.refData ? 
                this.props.refData.commodities.map( n => {
                    return (
                        <option value={n.symbol}>{n.name}</option>
                    );
                })
                :
                null
            }
          </Select>
        </FormControl>
        
        <FormControl className="col-md-1" style={{width: '5%'}}>
            <label>Buy</label>
            <Radio
              checked={this.state.side === 'Buy'}
              onChange={(e) => this.setState({side:'Buy'})}
              value="Buy" label="Buy"/>
          </FormControl>
        <FormControl className="col-md-1" style={{width: '5%'}}>
            <label>Sell</label>
            <Radio
              checked={this.state.side === 'Sell'}
              onChange={(e) => this.setState({side:'Sell'})}
              value="Sell" label="Sell"/>
        </FormControl>
        <FormControl className="col-md-2" style={{width: '12%'}}>
          <InputLabel htmlFor="counterpartySearch">Counterparty</InputLabel>
          <Select native defaultValue={0} input={<Input id="counterpartySearch" />} 
            value={this.state.counterParty}
          onChange={(e) => this.setState({counterParty: e.target.value})}>
          <option value="0" />
          {'counterParties' in this.props.refData ? 
              this.props.refData.counterParties.map( n => {
                  return (
                      <option value={n.symbol}>{n.name}</option>
                  );
              })
              :
              null
          }
          </Select>
        </FormControl>
        &emsp;
        <FormControl className="col-md-2" style={{width: '10%'}}>
          <InputLabel htmlFor="locationSearch">Location</InputLabel>
          <Select native defaultValue={0} input={<Input id="locationSearch" />}
            value={this.state.location}
          onChange={(e) => this.setState({location: e.target.value})}>
          <option value="0" />
          {'locations' in this.props.refData ? 
              this.props.refData.locations.map( n => {
                  return (
                      <option value={n.symbol}>{n.name}</option>
                  );
              })
              : null
          }
          </Select>
        </FormControl>
        <Button onClick={this.clear.bind(this)} style={style} raised>Clear</Button>
        <Button onClick={this.search.bind(this)} style={style} raised color="primary">Search</Button>
      </form>
      </AppBar>
    );
  }
  }