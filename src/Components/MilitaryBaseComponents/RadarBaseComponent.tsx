import React, { Component } from 'react';
import { RadarBase } from '../../Entities/WorldObjects/Bases/RadarBase';
import { Button } from '@material-ui/core';
import { GameLogic } from '../../Game/GameLogic';
import { MapLocation } from '../../Entities/MapObjects/MapLocation';
import { MapUtil } from '../../Utils/MapUtils';

interface props {
    base: RadarBase
}

interface state {
    didActivate: boolean;
}

export class RadarBaseComponent extends Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            didActivate: false
        }

    }

    componentDidMount() {
        console.log(`RadarBaseComponent: componentDidMount: state and props:`, { state: this.state, props: this.props });
    }

    render() {

        const setMode = (args: { mode: "Active" | "Passive" }) => {
            this.props.base.setModeOfOperation(args);
            this.setState({ didActivate: true });
            this.handleRaderPulser({ forBase: this.props.base });
            GameLogic.activateRadarBase({ forBase: this.props.base });
        }

        const readyToActivateMarkup =
            <React.Fragment>
                <Button onClick={() => setMode({ mode: "Active" })}>Go Active</Button>
                <Button onClick={() => setMode({ mode: "Passive" })}>Go Passive</Button>
            </React.Fragment>;

        const isActivatedMarkup =
            <React.Fragment>
                <span>Mode: {this.props.base.modeOfOperation} Tracking</span>
            </React.Fragment>

        const isNotReceivingOrdersMarkup =
            <React.Fragment>
                <span>Warming up...</span>
            </React.Fragment>;

        const wrapper = (toWrap: JSX.Element) => {
            return (
                <div>
                    <span>{`${this.props.base.WorldObjectLabel}: ${this.props.base.Name}`}</span>
                    {toWrap}
                </div>
            )
        };


        return (
            this.props.base.isReceivingOrders
                ? (
                    this.props.base.modeOfOperation === "Inactive" ? wrapper(readyToActivateMarkup) : wrapper(isActivatedMarkup)
                )
                : wrapper(isNotReceivingOrdersMarkup)
        );
    };

    private handleRaderPulser(args: { forBase: RadarBase }) {

        const mapLocElement = document.getElementById(MapUtil.getMapLocationHtmlID(args.forBase.myMapLocation));

        const { modeOfOperation } = args.forBase;

        const pulseUp = `${modeOfOperation === "Active" ? "active" : "passive"}RadarPulseUp`;
        const pulseDown = `${modeOfOperation === "Active" ? "active" : "passive"}RadarPulseDown`;

        setInterval(() => {
            if (mapLocElement) {

                mapLocElement.classList.remove(pulseUp);
                mapLocElement.classList.remove(pulseDown);

                mapLocElement.classList.add(pulseUp);

                setTimeout(() => {
                    mapLocElement.classList.add(pulseDown);
                }, 3000);

            }
        }, 6000);

    }


}
