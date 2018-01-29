import React from 'react';
import ReactDOM from 'react-dom';

import Footer from "../../src/app/components/Footer";
import Transfers from "../../src/app/components/Transfers";
import Transports from "../../src/app/components/Transports";
import UserInfo from "../../src/app/components/UserInfo";

describe('Footer', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Footer/>, div);
    });
});

describe('Transfers', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Transfers/>, div);
    });
});

describe('Transports', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Transports/>, div);
    });
});

describe('UserInfo', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<UserInfo/>, div);
    });
});
