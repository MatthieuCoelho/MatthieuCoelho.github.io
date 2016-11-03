import './PauseMenu.scss'
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import React from 'react'

class PauseMenu extends React.Component {
    constructor(props) {
        super(props);
        this.renderReprendre = this.renderReprendre.bind(this);
        this.renderRecommencer = this.renderRecommencer.bind(this);
    }
    renderReprendre(){
        var joueurMort = false;
        this.props.vies.forEach((vie) =>{
            if(vie.valeur==0){
                joueurMort = true;
            }
        });
        if(!joueurMort)
        {
            return (<div className="bouton" onClick={()=>this.props.resume()}>Reprendre</div>)
        }
        return "";
    }
    renderRecommencer(){
        if(this.props.niveauRecommencerPossible > 1){
            return (<div className="bouton" onClick={()=>this.props.restart(this.props.niveauRecommencerPossible)}>{"Recommencer au niveau "+this.props.niveauRecommencerPossible}</div>)
        }
        return "";
    }
    render() 
    {
        return(
           <div className="PauseMenu">
               {this.renderReprendre()}
               {this.renderRecommencer()}
               <div className="bouton" onClick={()=>this.props.restart(1)}>Recommencer</div>
               <div className="bouton" onClick={()=>this.props.router.push("")}>Menu principal</div>
           </div>
        );
    }
}


const mapStateToProps = function (state) {
    return {
        vies: state.core.vies,
        niveauRecommencerPossible : state.core.niveauRecommencerPossible
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        resume: function() {
            dispatch({type:"RESUME"})
        },
        restart:function(niveau){
            dispatch({type:"RESTART", niveau:niveau})
        }
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(PauseMenu));

