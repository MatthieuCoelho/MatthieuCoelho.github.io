import './Sort.scss'
import React from 'react'
import { connect } from 'react-redux';
import Sorts from '../../Data/Sorts.jsx';
import Tooltip from 'rc-tooltip';
import Tappable from 'react-tappable';

class Sort extends React.Component {
    constructor(props) {
        super(props);

        var sortCourant = Sorts[this.props.id-1];

        this.state = {
            type : sortCourant.type,
            nom : sortCourant.nom,
            cd : sortCourant.cd,
            mana : sortCourant.mana,
            tooltip : sortCourant.tooltip,
            soin : sortCourant.soin,
            dureeSoin :  sortCourant.dureeSoin,
            cdCourant: 0,
            tooltipActif:false
        };
    }
    componentWillUnmount() {
        if (this.state.nomTache && this.props.timer) {
            this.props.timer.removeTask(this.state.nomTache);
        }
    }
    handleClick() {
        switch(this.state.type){
            case "hot":
                if(!this.props.timer.resetTask('Sort ' + this.state.nom)){
                    this.props.timer.addTask({
                        name: 'Sort ' + this.state.nom,
                        totalRuns: this.state.dureeSoin,
                        callback: function (task) {
                            this.props.healSelect(this.state.soin);
                        }.bind(this)
                    });
                }
                break;
            case "mono":
                this.props.healSelect(this.state.soin);
                break;
            case "multi":
                this.props.healAll(this.state.soin);
                break;
        }
        this.setState({
            cdCourant: this.state.cd
        });
        if (!this.props.timer.resetTask("SortCD "+this.state.nom)) {
            this.props.timer.addTask({
                name: "SortCD "+this.state.nom,
                totalRuns: this.state.cd,
                callback: function (task) {
                    this.setState({
                        cdCourant: this.state.cdCourant - 1
                    });
                }.bind(this)
            });
        }
    }
    startTouch(e) {
        this.touchTimeout = window.setTimeout(function() {
            this.props.timer.pause();
            this.setState({
                tooltipActif: true
            });
        }.bind(this), 500);
    }
    endTouch() {
        window.clearTimeout(this.touchTimeout);
        this.props.timer.resume();
      
        this.setState({
            tooltipActif: false
        });
    }
    render() {
        var displayNone = {display:"none"}
        var styleSort={};
        var styleCd={};
        
        if(this.state.cdCourant == 0){
            styleCd = displayNone;
        }else{
            styleSort = displayNone;
        }
        return(
             <Tooltip className={"TooltipSort"} placement="topRight" visible={this.state.tooltipActif} overlay={<div>{this.state.tooltip}</div>}>
                <div onTouchStart={this.startTouch.bind(this)} onTouchEnd ={this.endTouch.bind(this)}>
                    <div style={styleSort} className={"Sort " + this.state.nom} onClick={this.handleClick.bind(this)}/>
                    <div style={styleCd} className={"Sort cd "+ this.state.nom}>
                        <span>{this.state.cdCourant}</span>
                    </div> 
                </div>
            </Tooltip>
        );
    }
};


const mapStateToProps = function (state) {
    return {
        timer : state.core.timer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        healSelect: function (valeur) {
            dispatch({type:"HEAL_SELECT",valeur:valeur})
        },
        healAll: function (valeur) {
            dispatch({type:"HEAL_ALL",valeur:valeur})
        }
    }
}



export default connect(mapStateToProps,mapDispatchToProps)(Sort);