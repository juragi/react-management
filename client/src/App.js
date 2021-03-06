import './App.css';
import React from 'react';
import Customer from "./components/Customer";
import CustomerAdd from "./components/CustomerAdd";
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: "auto"
  },
  table: {
    maxWidth: 1080,
    width: 900
  }
})

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      completed: 0
    }
  }

  stateRefresh = () => {
    //this.setState({
    //  customers: [],
    //  completed: 0
    //});
    this.callApi()
      .then(res => {
        this.setState({customers: res});
      })
      .catch(err => {
        console.log(err);
      })
      .finally(()=>{
        clearInterval(this.timer);
      });
  }

  componentWillUnmount() {
    console.log(`this timer: ${this.timer}`);
    clearInterval(this.timer);
  }

  componentDidMount() {
    this.timer = setInterval(this.progress, 30);
    console.log(this.timer);  
    this.callApi()
      .then(res => {
        this.setState({customers: res});
      })
      .catch(err => {
        console.log(err);
      })
      .finally(()=>{
        clearInterval(this.timer);
      });
  }

  callApi = async () => {
    const response = await fetch('/api/customers');
    const body = await response.json();
    return body;
  }
  
  progress = () => {
    const { completed } = this.state;
    //console.log(completed, this.timer);
    this.setState({completed: completed >= 100 ? 0 : completed + 1});
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
      <Paper className={classes.root} style={{maxHeight: 500, overflow:"auto"}}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>??????</TableCell>
              <TableCell>?????????</TableCell>
              <TableCell>??????</TableCell>
              <TableCell>????????????</TableCell>
              <TableCell>??????</TableCell>
              <TableCell>??????</TableCell>
              <TableCell>??????</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { this.state.customers? this.state.customers.map(c => { 
                return ( <Customer stateRefresh={this.stateRefresh}  key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job} /> ) 
              }) : 
              <TableRow>
                <TableCell colSpan="6" align="center">
                  <CircularProgress className={classes.progress} ></CircularProgress>
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
        
      </Paper>
      <CustomerAdd stateRefresh={this.stateRefresh}/>
      </div>
    );
  }
}

export default withStyles(styles)(App);
