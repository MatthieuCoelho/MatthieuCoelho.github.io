import './Vie.scss'
import React from 'react'
import ProgressBar from './ProgressBar.jsx'
import { connect } from 'react-redux';


class Vie extends React.Component {
    constructor(props) {
        super(props);
    }
    renderProgress(vie){
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
    renderSelect(vie){
        if(vie.select){
            return ( <div className="select">
                </div>);
        }
    }
    render() {
        var vie = this.props.vies[this.props.id]
        return (
            <div className={vie.select?"Vie select":"Vie"} onClick={()=>this.props.selectVie(vie.id)}>
                {this.renderProgress(vie)}
                {this.renderSelect(vie)}
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