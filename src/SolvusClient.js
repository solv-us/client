// CSS and HTMl for the Standby Screen
import './standbyTemplate/main.css';
import standbyTemplate from './standbyTemplate/index.html';

import * as io from 'socket.io-client';
import EventEmitter from './EventEmitter.js'

export default class SolvusClient extends EventEmitter {
    constructor(_stageId, _serverURI, standby = true) {
        super();
        //To-Do: use object for settings 
        //   this.settings = Object.assign({}, Defaults, settings);
        
        // If no stage ID is passed, look for ?stageId=x in url, otherwise default to main.
        let urlConfig = new URLSearchParams(document.location.search.substring(1));
        this.stageId = _stageId || urlConfig.get("stageId") || 'main';

        // If no Server URI is passed, look for ?serverURI=x in url, otherwise default
        let serverURI =  _serverURI || urlConfig.get('serverURI') || 'https://localhost:8843';
        
        this.socket = io(serverURI + '/client', {path:'/sockets/'});

        // Inject standby screen into body
        let template = document.createRange().createContextualFragment(standbyTemplate);
        document.body.appendChild(template);
        
        // The state object that is shared with the server
        this.state = {
            isFullScreen:false,
            standbyVisible:true,
            width:0,
            height:0,
            stageId:undefined
        };

        this.subscribeToStage(this.stageId);
        this.onSizeChange();
        this.registerEventListeners();
        this.setStandbyVisibility(standby);
    }

    /**
     * Listen for socket events and document changes
     */
    registerEventListeners(){
        window.onresize = () => { this.onSizeChange() };
        document.onfullscreenchange = () =>{ this.onFullScreenChange() };
        document.querySelector("body").onclick = () => { this.toggleFullscreen() };

        this.socket.on('connect', ()=>{this.handleConnection()});
        this.socket.on('disconnect', (e)=>{this.handleDisconnection()});

        this.socket.on('forceToStage', (stage)=>{ this.subscribeToStage(stage)})
        this.socket.on('stageEvent', (event) => { this.handleStageEvent(event) });
        this.socket.on('tempoChanged', (bpm) => { this.$emit('tempoChanged', bpm); });
        this.socket.on('beat', (time) => { this.$emit('beat', time); });
        this.socket.on('division', (time) => { this.$emit('division', time); });
    }

    /**
     * Called when socket receives a stageEvent
     */
    handleStageEvent(event){
        this.$emit('stageEvent', event);
        this.$emitStageEvent(event.id, event);

        if(event.id === 'setStandby'){
            this.setStandbyVisibility(event.value);
        }else if(event.id === 'toggleStandby'){
            this.setStandbyVisibility();
        }
    }

    /**
     * Sets or toggles the visibility of the standby screen
     */
    setStandbyVisibility(state = !this.state.standbyVisible){
        this.state.standbyVisible = state;

        if(state){
            document.querySelector('.solvus-standby').classList.remove('hidden');
        }else{
            document.querySelector('.solvus-standby').classList.add('hidden');
        }

        this.socket.emit('clientUpdate', this.state);
    }

    /**
     * Called on socket connection
     */
    handleConnection(){
        document.querySelector(".solvus-standby  .display").classList.add('connected');
        this.socket.emit('clientUpdate', this.state);
    }

    /**
     * Called on socket disconnection
     */
    handleDisconnection(){
        document.querySelector('.solvus-standby  .display').classList.remove('connected');
    }

    /**
     * Set up the timesync library
     */
    setupTimesync(){
        // To - Do
    }
    
    /**
     * Let the server know which stage events we want to listen to
     * @param {string} stageId The ID of the stage to subscribe to
     */
    subscribeToStage(stageId){
        this.state.stageId = stageId;
        document.querySelector('.stageId').innerHTML = stageId;

        this.socket.emit('clientUpdate', this.state);
        console.log('subscribe')
    }

    /**
     * Called when the browser window changes size. Notifies server and updates dom
     */
    onSizeChange(){
        
        this.state.width = document.body.clientWidth;
        this.state.height = document.body.clientHeight;
        document.querySelector(".screenSize").innerHTML = this.state.width + 'x' + this.state.height;
        
        this.socket.emit('clientUpdate', this.state);
    }

    /**
     * Toggle between FullScreen mode for the body element
     */
    toggleFullscreen() {
        let elem = document.querySelector("body");

        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Called when browser enters or exits fullscreen > update client
     */
    onFullScreenChange(){
        if (document.fullscreenElement) {
            this.state.isFullScreen = true;
        } else {
            this.state.isFullScreen = false;
        }
        this.socket.emit('clientUpdate', this.state);
    }
}