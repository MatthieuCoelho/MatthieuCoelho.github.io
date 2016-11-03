import React from 'react'
import "./CircularProgressBar.scss"

class CircularProgressbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            strokeWidth:20
        };
    }

    render() {
        const radius = (50 - this.state.strokeWidth / 2);

        const pathDescription = `
          M 50,50 m 0,-${radius}
          a ${radius},${radius} 0 1 1 0,${2 * radius}
          a ${radius},${radius} 0 1 1 0,-${2 * radius}
        `;

        const diameter = Math.PI * 2 * radius;
        const progressStyle = {
            strokeDasharray: `${diameter}px ${diameter}px`,
            strokeDashoffset: `${((100 - this.props.percentage) / 100 * diameter)}px`,
        };

        return (
            <svg className={`CircularProgressbar ${this.props.classForPercentage ? this.props.classForPercentage(this.props.percentage) : ''}`} viewBox="0 0 100 100">
                <path className="CircularProgressbar-trail" d={pathDescription} strokeWidth={this.state.strokeWidth} fillOpacity={0} />
                <path className="CircularProgressbar-path" d={pathDescription} strokeWidth={this.state.strokeWidth} fillOpacity={0} style={progressStyle}/>
                <text className="CircularProgressbar-text" x={50} y={50}>
                   {this.props.text}
                </text>
            </svg>
    );
}
}


export default CircularProgressbar;