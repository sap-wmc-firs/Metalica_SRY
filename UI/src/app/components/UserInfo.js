import React, {Component} from "react";
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Icon from 'react-icons-kit';
import { user } from 'react-icons-kit/fa/user';
//import * as Colors from 'material-ui/styles/colors';

    const styles = theme => ({
      root: {
        marginTop: theme.spacing.unit,
        width: '100%',
        //backgroundColor: theme.palette.background.paper,
      },
    });

   class UserInfo extends React.Component {
  
      constructor(props){
        super(props);
        this.classes = props;
      }

      render() {
        var uname = this.props.username;
        return (
          <div className={this.classes.root}>
          <AppBar position="static" style={{ backgroundColor: '#CFD8DC' }}>
             <Toolbar>
               <Typography type="title" color="black">
               FSD - Metallica | {uname} <Icon icon={user}/>
               </Typography>
               </Toolbar>
            
           </AppBar>
          </div>
        );
      }
    }
  
    UserInfo.propTypes = {
           classes: PropTypes.object.isRequired,
      };
  
    export default withStyles(styles)(UserInfo);