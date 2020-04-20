import React, { Component } from 'react';
import {API_URL} from './config'
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      resObj: null,
      islandName: "",
      sellingprice: "",
      weekday: "",
      morning: "",
      evening: "",
      date: "",
      hideTable: true
      
    }
  }

  componentDidMount() {
    this.updateTurnipTable()
  }

  formatDate(resDate) {
    let formatDate = resDate.substring(0, 10);
    formatDate = formatDate.split('-');

    formatDate.push(formatDate[0])
    formatDate.shift();
    
    switch(formatDate[0]) {
      case "01":
        formatDate[0] = "January";
        break;
      case "02":
        formatDate[0] = "February";
        break;
      case "03":
        formatDate[0] = "March";
        break;
      case "04":
        formatDate[0] = "April";
        break;
      case "05":
        formatDate[0] = "May";
        break;
      case "06":
        formatDate[0] = "June";
        break;
      case "07":
        formatDate[0] = "July";
        break;
      case "08":
        formatDate[0] = "August";
        break;
        case "09":
          formatDate[0] = "September";
          break;
      case "10":
        formatDate[0] = "October";
        break;
      case "11":
        formatDate[0] = "November";
        break;
      case "12":
        formatDate[0] = "December";
        break;
      default:
          
          break;
    }
    
    formatDate = formatDate.join(" ")

    return formatDate;
  }

  handleIslandNameChange(name) {
    this.setState({
      islandName: name
    })
  }

  handlePriceChange(price) {
    this.setState({
      sellingprice: price
    })
  }

  handleDayChange(day) {
    this.setState({
      weekday: day
    })
  }

  handleTimeDayChange(time) {
    if(time === "Morning") {
      this.setState({
        morning: "1",
        evening: "0"
      })
    }
    else if (time === "Evening") {
      this.setState({
        morning: "0",
        evening: "1"
      })
    }
  }

  handleDateChange(date) {
    let formatDate = date.split('-');
    formatDate.unshift(formatDate[2])
    formatDate.pop();
    formatDate = formatDate.join('-')
    this.setState({
      date: formatDate
    })
  }

  submitNewTurnipData(e) {
    e.preventDefault();
    let info = {
      island: this.state.islandName,
      sellbackprice: this.state.sellingprice,
      weekday: this.state.weekday,
      morning: this.state.morning,
      evening: this.state.evening,
      fulldate: this.state.date
    }
    let url = "http://localhost:8000/api/turnips"
    let options = {
      method: 'POST',
      body: JSON.stringify(info),
      headers: {
        "content-type": "application/json"
      }
    }
    console.log("State: " + this.state.islandName)
    console.log("Info: " + info.sellbackprice)
    fetch(API_URL.link, options)
    .then (res => {
      if (!res.ok) {
        throw new Error('Something went wrong')
      }
      return res.json();
    })
    .then(data => {
      this.setState({
        islandName: "",
        sellingprice: "",
        weekday: "",
        morning: "",
        evening: "",
        date: ""
      })
      
    }).catch(err => {
        console.error(err)
      });
  }

  updateTurnipTable = () => {
    fetch(API_URL.link, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(e => Promise.reject(e));
      }
      return res.json()
    })
    .then(resJson => {
      console.log(resJson)
      this.setState({
        resObj: resJson
      })
    })
    .catch(err => {
      console.error(err)
    })
  }

  toggleTurnipTable = () => {
    this.setState({
      hideTable: !this.state.hideTable
    })
  }
  render() {
    return (
      <div className="App">
        <h2>TurnipTracker 3000</h2>
        <div>Give me data</div>
        <form className="inputPricesForm" onSubmit={(e) => this.submitNewTurnipData(e)}>
          <div> 
            <label htmlFor="island-input">Island Name:</label>
            <input type="text" name="island-input" defaultValue={this.state.islandName} onChange={(e) => this.handleIslandNameChange(e.target.value)}/>
          </div>
          <div>
            <label htmlFor="sellingpriceinput">Offer Price:</label>
            <input type="number" name="sellingpriceinput" defaultValue={this.state.sellingprice} onChange={(e) => this.handlePriceChange(e.target.value)}></input>
          </div>
          <div>
            <label htmlFor="weekdayinput">Day of the Week: </label>
            <select id="weekdayinput" onChange={(e) => this.handleDayChange(e.target.value)}>
              <option value=""></option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="timeofdayinput">Time of Day: </label>
            <select id="timeofdayinput" onChange={(e) => this.handleTimeDayChange(e.target.value)}>
              <option value=""></option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
          <div>
            <label htmlFor="dateinput">Date:</label>
            <input name="dateinput" type="text" defaultValue={this.state.date} onChange={(e) => this.handleDateChange(e.target.value)}></input>
          </div>
          <button type="submit">Submit</button>
        </form>
        <table className={`alldata-table ${this.state.hideTable === true ? "hidden-table" : "show-table"}`}>
          <tbody>
        <tr><th>Island</th><th>Selling Price</th><th>Weekday</th><th>Date</th></tr>
          {this.state.resObj === null ? null : this.state.resObj.map((item, index) => {
            return (<tr>
              <td>{item.island}</td>
              <td>{item.sellbackprice}</td>
              <td>{item.weekday} {item.morning = 0 ? <span>Evening</span> : <span>Morning</span>}</td>
              <td>{this.formatDate(item.fulldate)}</td>
            </tr>)
        })}</tbody></table>
        <button onClick={() => this.updateTurnipTable()}>Update</button>
        <button onClick={() => this.toggleTurnipTable()}>{this.state.hideTable === true ? "Show Turnip Data" : "Hide Turnip Data"}</button>
      </div>
    );
  }
}

export default App;
