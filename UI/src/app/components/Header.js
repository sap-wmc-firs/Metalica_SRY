import React, {Component} from "react";
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import MarketPrice from "./MarketPrice";
import Grid from "react-bootstrap/lib/Grid";
import Row from "react-bootstrap/lib/Row";

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit,
      width: '100%'
      //backgroundColor: theme.palette.backgroundColor.red
    },
});
  
  
  
  class Header extends React.Component {

    constructor(props){
      super(props);
      this.classes = props;
    }
    
    render() {      
      return (
        <Grid>
        <div className={this.classes.root}>
          <Row><MarketPrice /></Row>
        </div>
        </Grid>
      );
    }
  }

  Header.propTypes = {
         classes: PropTypes.object.isRequired,
    };

  export default withStyles(styles)(Header);