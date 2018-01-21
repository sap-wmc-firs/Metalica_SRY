import React, {Component} from "react";
import PropTypes from "prop-types";

import Grid from "react-bootstrap/lib/Grid";
import Row from "react-bootstrap/lib/Row";

import UserInfo from "./components/UserInfo";
import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/footer";

export default class App extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        const uname = this.props.username;
        return(
        <Grid>
            <Row><UserInfo username={uname}/></Row>
            <Row><Header /></Row>
            <Row><Home /></Row>
            <Row><Footer /></Row>
        </Grid>
        );
    }
}

App.defaultProps = {
    
}

App.propTypes = {
    
}