import {createStore, combineReducers, applyMiddleware} from 'redux'
import {routerReducer, routerMiddleware}  from 'react-router-redux'
import TaskTimer from '../Utils/TaskTimer.jsx';


function getDefaultVies(nbBarre){
    var vies = [];
    for(var i=0;i<nbBarre;i++){
        if(i==0){
            vies.push( {id:i,valeur : 100, select:true})
        }else{
            vies.push( {id:i,valeur : 100, select:false})
        }
    }
    return vies;
}

function heal(vie, valeur){
    vie.valeur+=valeur;
    if(vie.valeur > 100){
        vie.valeur = 100;
    }
}

function damage(vie, valeur){
    vie.valeur-=valeur;
    if(vie.valeur < 0){
        vie.valeur = 0;
        return false;
    }
    return true;
}

var reducer = (state, action) => {
    if (!state) {
        state = []
    }
    
    console.log("reducer : action recue : " + action.type);
    console.log(action);
    console.log(state);
     
    var isPause = state.isPause;
    
    var newState = null;
    var vies = Object.assign([],state.vies);

    

    switch (action.type) {
        case "INITIALISER_MODE_INFINI":
            newState = {
                vies : getDefaultVies(5),
                niveau : state.niveauRecommencerPossible,
                timer : new TaskTimer(10),
                isPause : false
            };
            break;
        case "SELECT_VIE":
            vies.forEach((vie) =>{
                if(vie.id == action.id){
                    vie.select = true;
                }else{
                    vie.select = false;
                }
            });
            newState = {
                vies : vies
            };
            break;
        case "AFFICHER_TUTORIEL":
            state.timer.pause();
            break;
        case "TUTORIEL_OK":
            newState = {
                idTutorielCourant : state.idTutorielCourant+1
            };
            state.timer.resume();
            break;
        case "NIVEAU_SUIVANT":
            var niveau = state.niveau+1;
            newState = {
                niveau : niveau,
            };
            if(niveau-5 > 1){
                Object.assign(newState,{
                    niveauRecommencerPossible : niveau-5
                });
            }
            break;
        case "START":
            newState = {
                isPause : false
            };
            state.timer.start();
            break;
        case "PAUSE":
            newState = {
                isPause : true
            };
            state.timer.pause();
            break;
        case "RESUME":
            newState = {
                isPause : false
            };
            state.timer.resume();
            break;
        case "RESTART":
            state.timer.removeAllTask();
            state.timer.resume();
            newState = {
                vies : getDefaultVies(5),
                niveau : action.niveau,
                isPause : false,
                gameNumber : state.gameNumber+1
            };
            break;
        case "HEAL_ALL":
            vies.forEach((vie) =>{
                heal(vie,action.valeur);
            });
            newState = {
                vies : vies
            };
            break;
        case "HEAL_SELECT":
            vies.forEach((vie) =>{
                if(vie.select){
                    heal(vie,action.valeur);
                }
            });
            newState = {
                vies : vies
            };
            break;
        case "DAMAGE_BOLT":
            var rand = Math.floor((Math.random() * vies.length) + 1);
            vies.forEach((vie) =>{
                if(vie.id == rand){
                    if(!damage(vie,action.valeur)){
                        isPause = true;
                        state.timer.pause();
                    }
                }
            });
            newState = {
                vies : vies,
                isPause : isPause
            };
            break;
        case "DAMAGE_AOE":
            vies.forEach((vie) =>{
                if(!damage(vie,action.valeur)){
                    isPause = true;
                    state.timer.pause();
                }
            });
            newState = {
                vies : vies,
                isPause : isPause
            };
            break;
    }
    
    if(newState){
        return Object.assign({},state, newState);
    }

    return state;
};

var nomSessionStorage = "HealMe";
var saveToLocalStorageMiddleWare = (store) => {
    return (next) => {
        return (action) => {
            next(action);
            sessionStorage.setItem(nomSessionStorage, JSON.stringify(store.getState()));
        };
    };
};
var storedState = JSON.parse(sessionStorage.getItem(nomSessionStorage));
if(!storedState) {
    storedState = {
        core: {
            vies : getDefaultVies(5),
            niveauRecommencerPossible : 1,
            gameNumber : 1,
            isPause: false,
            idTutorielCourant : 1,
            timer :  new TaskTimer(10)
        }
    }
}else{
    storedState.core.vies =  getDefaultVies(5);
    storedState.core.timer =  new TaskTimer(10);
}

export default createStore(combineReducers({
        core : reducer,
        routing: routerReducer
}),
{
    core: storedState.core
},
applyMiddleware(saveToLocalStorageMiddleWare)
)
