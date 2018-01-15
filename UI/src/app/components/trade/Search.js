import React, {Component} from "react";
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Button from 'material-ui/Button';

 const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
    },
  });

  
  function clear(){
    console.log("clear method");
  }

  function search(){
    console.log("search method");
  }

  function Search(props) {
    const { classes } = props;

    
    const state = {
        "priceData": [],
        "counterPartyData": [],
        "locationData": [],
        "commodityData": [],
        "side": "Buy"
      };
  
    return (
      <form className={classes.container} noValidate>
        <TextField
          id="tradeDateSearch"
          label="Trade Date"
          type="date"
          defaultValue=""
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        /> 
        to
        <TextField
          id="toTradeDateSearch"
          label="To Trade Date"
          type="date"
          defaultValue=""
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
        &emsp;
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="commoditySearch">Commodity</InputLabel>
          <Select native defaultValue={0} input={<Input id="commoditySearch" />}>
            <option value="0" />
            {
                state.commodityData.map( n => {
                    return (
                        <option value={n.commodityId}>{n.commodity}</option>
                    );
                })
            }
          </Select>
        </FormControl>
        &emsp;
        <FormGroup row>
        {/* <InputLabel htmlFor="sideSearch">Side</InputLabel> */}
        <FormControlLabel
          control={
            <Checkbox
              checked={state.side === 'Buy'}
              onChange={() => state.side='Buy'}
              value="Buy"
            />
          }
          label="Buy"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={state.side === 'Sell'}
              onChange={() => state.side='Sell'}
              value="Sell"
            />
          }
          label="Sell"
        />
        </FormGroup>
        &emsp;
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="counterpartySearch">Counterparty</InputLabel>
          <Select native defaultValue={0} input={<Input id="counterpartySearch" />}>
          <option value="0" />
          {
              state.counterPartyData.map( n => {
                  return (
                      <option value={n.counterPartyId}>{n.counterParty}</option>
                  );
              })
          }
          </Select>
          {/* <FormHelperText>Uncontrolled</FormHelperText> */}
        </FormControl>
        &emsp;
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="locationSearch">Location</InputLabel>
          <Select native defaultValue={0} input={<Input id="locationSearch" />}>
          <option value="0" />
          {
              state.locationData.map( n => {
                  return (
                      <option value={n.locationId}>{n.location}</option>
                  );
              })
          }
          </Select>
        </FormControl>
        <Button className={classes.button} onClick={clear}>clear</Button>
        <Button className={classes.button} onClick={search}>Search</Button>
      </form>
    );
  }
    
  Search.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(Search);