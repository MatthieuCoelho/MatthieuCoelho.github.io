import './Vie.scss'
import React from 'react'
import ProgressBar from './ProgressBar.jsx'
import { connect } from 'react-redux';


class Vie extends React.Component {
    constructor(props) {
        super(props);
    }
    renderProgress(vie) {
        if(vie.valeur==0){
            return (
                <ProgressBar orientation="vertical" R="0" G="0" B="0" size={100}/>
            );
        }else{
            return (
                <ProgressBar orientation="vertical" R="255" G="0" B="0" size={vie.valeur}/>
            );
        }      
    }
    render() {
        var vie = this.props.vies[this.props.id]
        var display = vie.select ? displayNone : "";
        return (
            <div className="Vie" onClick={()=>this.props.selectVie(vie.id)}>
                {this.renderProgress(vie)}
                <div class="select" style={display}></div>
            </div>
        );
    }
}

const mapStateToProps = function (state) {
    return {
        vies: state.core.vies
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectVie: function (id) {
            dispatch({type:"SELECT_VIE",id:id})
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Vie);