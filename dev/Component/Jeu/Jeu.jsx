import './Jeu.scss'
import React from 'react'
import Sort from './Sort.jsx'
import Boss from './Boss.jsx'
import Vie from './Vie.jsx'
import PauseMenu from './PauseMenu.jsx'
import Modal from 'react-modal'
import Tutoriel from './Tutoriel.jsx'
import { connect } from 'react-redux';


class Jeu extends React.Component {
    constructor(props) {
        super(props);
        this.renderPauseMenu = this.renderPauseMenu.bind(this);
    }
    componentDidMount() {
        this.props.start();
    }
    renderPauseMenu(){
        if(this.props.isPause){
            return(<PauseMenu></PauseMenu>);
        }else{
            return("");
        }
    }
    renderVies() {
        var vies = this.props.vies.map(function (vie) {
            return (<Vie key={vie.id} id={vie.id} valeur={vie.valeur} select={vie.select}/>)
        })
        return (<div className="gridVie">
                    {vies}
                </div>)
    }
    renderSorts(){
        return (
            <div className="gridSort">
                <Sort key={this.props.gameNumber+"1"} id="1"/>
                <Sort key={this.props.gameNumber+"2"} id="2"/>
                <Sort key={this.props.gameNumber+"3"} id="3"/>
                <Sort key={this.props.gameNumber+"4"} id="4"/>
                <Sort key={this.props.gameNumber+"5"} id="5"/>
            </div>
            )
     }
    render(){
        return (
            <div className="Jeu">
                <div className="Top">
                    <Tutoriel id="1" placement="bottomLeft">
                        <Boss mode="infini" key={this.props.gameNumber+"Boss"}/>
                    </Tutoriel>
                    <div className="boutonPause" onClick={()=>this.props.pause()}></div>
                </div>
                <Tutoriel id="2" placement="top">
                    {this.renderVies()}
                </Tutoriel>
                <Tutoriel id="3" placement="top">
                    {this.renderSorts()}
                </Tutoriel>
                <Modal isOpen={this.props.isPause} className="fondPauseMenu" overlayClassName="overlayPauseMenu">
                    {this.renderPauseMenu()}
                </Modal>
            </div>
        );
    }
};

const mapStateToProps = function (state) {
    return {
        vies: state.core.vies,
        isPause : state.core.isPause,
        gameNumber : state.core.gameNumber,
        tutorielEnCoursDaffichage : state.core.tutorielEnCoursDaffichage
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        pause: function () {
            dispatch({type:"PAUSE"})
        },
        start: function () {
            dispatch({type:"START"})
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Jeu);