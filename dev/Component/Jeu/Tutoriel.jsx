import './Tutoriel.scss'
import 'rc-tooltip/assets/bootstrap.css';
import React from 'react'
import ProgressBar from './ProgressBar.jsx'
import { connect } from 'react-redux';
import Tutoriels from '../../Data/Tutoriels.jsx';
import Tooltip from 'rc-tooltip';

class Tutoriel extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(event,actif){
        if(actif){
           event.preventDefault();
           this.props.tutorielOk(this.props.id);
        }
    }
    render(){
        var actif = this.props.idTutorielCourant == this.props.id;
        var messageTutoCourant = "";
        var classOverlay=""

        if(actif){
            this.props.afficherTutoriel();
            messageTutoCourant = Tutoriels[this.props.idTutorielCourant-1].message;
            classOverlay="overlay"
        }
        return (
            <div className={classOverlay} onTouchStart={(event)=>this.handleClick(event,actif)}>
                <Tooltip placement={this.props.placement} visible={actif} overlay={<div onTouchStart={(event)=>this.handleClick(event,actif)}>{messageTutoCourant}</div>}>
                    {this.props.children}
                </Tooltip> 
            </div>
        );
    }
}


const mapStateToProps = function (state) {
    return {
        idTutorielCourant: state.core.idTutorielCourant
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        tutorielOk: function (id) {
            dispatch({type:"TUTORIEL_OK", id:id})
        },
        afficherTutoriel : function(){
            dispatch({type:"AFFICHER_TUTORIEL"})
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Tutoriel);