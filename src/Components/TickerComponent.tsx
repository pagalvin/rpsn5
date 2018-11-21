import React, { Component } from 'react';

interface props {
    tickerMessage: string;
    tickerInterval: number;
    onRenderCompleteCallback?: () => void;
}

interface state {
}

export class TickerComponent extends Component<props, state> {

    private idx: number = 0;
    private static nextHtmlID: number = 0;

    constructor(props: props, state: state) {
        super(props, state);
    }

    showMessage(forHtmLID: string) {

        const msgTextElem = document.getElementById(forHtmLID);
        if (msgTextElem) {
            msgTextElem.innerHTML = "&nbsp;";
        }

        this.idx = 0;

        const intervalHandler = setInterval(() => {
            if (msgTextElem) {
                msgTextElem.innerHTML = this.props.tickerMessage.substring(0, this.idx++) + "█";
            }
        }, this.props.tickerInterval);

        setTimeout(() => {
            // console.log("clearing");
            clearInterval(intervalHandler);
            if (msgTextElem) {
                msgTextElem.innerHTML = this.props.tickerMessage;
            }
            if (this.props.onRenderCompleteCallback) {this.props.onRenderCompleteCallback()};

        }, this.props.tickerInterval * this.props.tickerMessage.length + this.props.tickerInterval * 3);

    }

    render() {

        const htmlID = `ticker_${TickerComponent.nextHtmlID++}`;
        // console.log(`TickerComponent: render: Entering.`);

        // Give the ticker a moment to get started.
        setTimeout(() => {
            this.showMessage(htmlID);
        }, 50);

        return (
            <span id={htmlID}></span>
        );

    }
}
