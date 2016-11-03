import './Boss.scss'
import React from 'react'
import {connect} from 'react-redux'
import ProgressBar from './ProgressBar.jsx'
import Niveaux from '../../Data/Niveaux.jsx'

class Boss extends React.Component {
    constructor(props) {
        super(props);
        this.getNiveau = this.getNiveau.bind(this);
        this.state = this.getNiveau();
        this.addTask = this.addTask.bind(this);
    }
    getNiveau(){
        var boss = Niveaux[this.props.niveau-1]
        return  {
            degatBossBolt : boss.degatBossBolt,
            degatBossAOE : boss.degatBossAOE,
            vie : boss.vie,
            vieCourante : boss.vie
        }
    }
    addTask(){
        this.props.timer.removeTask("BossBolt");
        this.props.timer.removeTask("BossAOE");

        this.props.timer.addTask({
            name: "BossBolt",
            totalRuns: 0,
            callback: function (task) {
                this.props.damageBolt(this.state.degatBossBolt);
            }.bind(this)
        });
        this.props.timer.addTask({
            name: "BossAOE",
            totalRuns: 0,
            callback: function (task) {
                this.props.damageAoe(this.state.degatBossAOE);
            }.bind(this)
        });
    }
    componentWillUnmount() {
        if (this.props.timer) {
            this.props.timer.removeTask("Boss");
            this.props.timer.removeTask("BossBolt");
            this.props.timer.removeTask("BossAOE");
        }
    }
    componentDidMount(){
        var orientation;
        if(this.props.mode=="infini"){
            orientation="circle";
        }else{
            orientation="horizontal";
        }
        this.props.timer.addTask({
            name: "Boss",
            totalRuns: 0,
            callback: function (task) {
                this.setState({
                    vieCourante: this.state.vieCourante - 1
                });
            }.bind(this)
        });
        this.addTask();
        
    }
    componentDidUpdate(prevProps, prevState)
    {
        if(this.state.vieCourante == prevState.vieCourante){
            return;
        }
        var vie = this.state.vieCourante*100/this.state.vie;
        if(vie==0){
            if(this.props.mode=="infini"){
                this.props.niveauSuivant();
                this.setState(this.getNiveau());
                this.addTask();
            }else{
                this.props.pause();
            }
        }
    }
    renderProgressBar()
    {
        var orientation, size;
        if(this.props.mode=="infini"){
            orientation="circle";
            size = 100-(this.state.vieCourante*100/this.state.vie);
        }else{
            orientation="horizontal";
            size = this.state.vieCourante*100/this.state.vie;
        }
        return (<ProgressBar orientation={orientation} niveau={this.props.niveau} R="249" G="105" B="14" size={size}/>);
    }
    render() {
       return (
            <div className={"Boss "+this.props.mode}>
                {this.renderProgressBar()}
            </div>
        );
    }
}
const mapStateToProps = function (state) {
    return {
        niveau: state.core.niveau,
        timer : state.core.timer
    };
}


const mapDispatchToProps = (dispatch) => {
    return {
        damageBolt: function (valeur) {
            dispatch({type:"DAMAGE_BOLT",valeur:valeur})
        },
        damageAoe: function (valeur) {
            dispatch({type:"DAMAGE_AOE",valeur:valeur})
        },
        pause:function(){
            dispatch({type:"PAUSE"})
        },
        niveauSuivant:function(){
            dispatch({type:"NIVEAU_SUIVANT"})
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Boss);

