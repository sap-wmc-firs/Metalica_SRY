import "babel-polyfill";
import React from "react";

import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./app/store";

import App from "./app/App";
import OAuthWeb from 'oauthio-web';

// Hardcode user testing
/*
var uname = "Sitaram Yadav"
console.log("User Name :: "+uname);
render((<Provider store= {store} >
        <App username={uname}/>
</Provider>),
       document.getElementById("root")); 
*/

// OAutho.io auth init and intergration
const OAUTH_INIT_KEY =  "ee-zUzpQqr9ZeCMPlmWQk-EKfb4";

console.log("OAUTH.io : pre init");
OAuthWeb.OAuth.initialize(OAUTH_INIT_KEY);
console.log("OAUTH.io : post init");  

setTimeout(function(){ 
        OAuthWeb.OAuth.popup('facebook').done(function(result) {
                console.log("Auth result "+result);
                // do some stuff with result
                result.get('/me')
                .done(function (response) {
                        var uname = response.name
                        console.log("User Name :: "+uname);
                        render((<Provider store= {store} >
                                <App username={uname}/>
                        </Provider>),
                               document.getElementById("root")); 
                })
                .fail(function (err) {
                    //handle error with err
                    alert("Authentication Error !!");
                });
        }).fail(function (err) {
                alert("Authentication error !!");
        }); 
}, 500);

