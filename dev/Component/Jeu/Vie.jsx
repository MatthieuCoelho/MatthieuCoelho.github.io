import './Vie.scss'
import React from 'react'
import ProgressBar from './ProgressBar.jsx'
import { connect } from 'react-redux';


class Vie extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    renderProgress() {
        if(this.props.valeur==0){
            return (
                <ProgressBar orientation="vertical" R="0" G="0" B="0" size={100}/>
            );
        }else{
            return (
                <ProgressBar orientation="vertical" R="255" G="0" B="0" size={this.props.valeur}/>
            );
        }      
    }
    render() {
        var visibility = this.props.select ? {} : {visibility: "hidden"};
        return (
            <div className="Vie" onTouchStart={() => this.props.selectVie(this.props.id)}>
                {this.renderProgress()}
                <div className="select" style={visibility}></div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectVie: function (id) {
            dispatch({type:"SELECT_VIE",id:id})
        }
    }
}

export default connect(null,mapDispatchToProps)(Vie);