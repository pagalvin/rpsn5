
import React, { Component } from 'react';
import { GameLogic } from '../../Game/GameLogic';
import { MissileBase } from '../../Entities/WorldObjects/Bases/MissileBase';
import { Button } from '@material-ui/core';
import { MissileTargetingComponent } from '../MissileTargetingComponent';

interface props {
    base: MissileBase;
}

interface state {
    isTargetingMissiles: boolean;
}

export class MissileBaseComponent extends Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            isTargetingMissiles: false
        }

    }


    componentDidMount() {

        console.log(`MissileBaseComponent: componentDidMount: state and props:`, { state: this.state, props: this.props });

    }

    private activateMissileBase() {
        console.log(`MissileBaseComponent: activateMissileBase: entering.`);
        GameLogic.activateMissileBase({forBase: this.props.base});
        this.setState({isTargetingMissiles: true});
    }

    render() {

        const isTargetingMarkup = 
            <React.Fragment>
                <span>{`Targeting ${this.props.base.missiles.length} missiles.`}<br/></span>
                <MissileTargetingComponent parentBase={this.props.base}/>                
            </React.Fragment>;

        const readyToActivateMarkup =
            <React.Fragment>
                <Button onClick={() => this.activateMissileBase()}>
                    {`Target ${this.props.base.missiles.length} Missiles`}
                </Button>
            </React.Fragment>;

        const allTargetedMarkup =
            <React.Fragment>
                <span>
                    {
                        `${this.props.base.missiles.length} en route.`
                    }
                </span>
            </React.Fragment>;


        const isNotReceivingOrdersMarkup =
            <React.Fragment>
                <span>Fueling missiles...</span>
            </React.Fragment>;

        if (this.state.isTargetingMissiles) { return isTargetingMarkup; }
        if (! this.props.base.isReceivingOrders) { return isNotReceivingOrdersMarkup; }
        if (this.props.base.areAllMissilesTargeted() ) { return allTargetedMarkup; }

        return readyToActivateMarkup;

    };

}
