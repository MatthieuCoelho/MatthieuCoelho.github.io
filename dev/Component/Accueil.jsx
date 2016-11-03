import React from 'react';
import { Link, withRouter } from 'react-router'
import { connect } from 'react-redux'
class Accueil extends React.Component{
    render() {
        return (
            <ul className="Accueil">
               <li><button onClick={()=>{this.props.jouer();this.props.router.push("Jeu")}}>Mode infini</button></li>
               <li><Link to={'Aventure'}>Mode aventure</Link></li>
               <li><Link to={'Aide'}>Aide</Link></li>
            </ul>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        jouer: () => {
            dispatch({ type: "INITIALISER_MODE_INFINI"});
        }
    }
};

export default withRouter(connect(null, mapDispatchToProps)(Accueil));