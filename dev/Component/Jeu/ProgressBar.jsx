import './ProgressBar.scss'
import CircularProgressbar from './CircularProgressbar.jsx'
import React from 'react'


class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.orientation=="horizontal"){
            this.style={
                width: this.props.size+"%",
                backgroundColor : "rgb("+this.props.R+","+this.props.G+","+this.props.B+")",
                height: "100%"
            }
        }else if(this.props.orientation=="vertical"){
            this.style={
                width: '100%',
                backgroundColor : "rgb("+this.props.R+","+this.props.G+","+this.props.B+")",
                height: this.props.size+"%",
                top:(100-this.props.size)+"%",
            }
        }else if(this.props.orientation=="circle"){
            return (<CircularProgressbar percentage={this.props.size} text={this.props.niveau}/>);
        }
        this.styleProgress={
            backgroundColor : "rgba("+this.props.R+","+this.props.G+","+this.props.B+",0.2)",
        }
        return (
            <div style={this.styleProgress} className="ProgressBar">
                <div style={this.style}>

                </div>
            </div>
        );
    }
}

export default ProgressBar;