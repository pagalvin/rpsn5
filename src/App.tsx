import React, { Component } from 'react';
import './App.css';
import { GameComponent } from './Components/Game';
import { Grid, Paper } from '@material-ui/core';

class App extends Component {

  render() {

    return (
      <Paper>
        <Grid container justify="center"><GameComponent/></Grid>
      </Paper>
    );

  }
}

export default App;
