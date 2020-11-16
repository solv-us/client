// CSS and HTMl for the Standby Screen
import './standbyTemplate/main.css';
import standbyTemplate from './standbyTemplate/index.html';

import * as io from 'socket.io-client';
import EventEmitter from './EventEmitter.js'
import screenfull from "screenfull"

export default class SolvusClient extends EventEmitter {
    constructor(_settings = {}) {
        super();

        // Look for configuration parameters in the url
        let urlConfig = new URLSearchParams(document.location.search.substring(1));

        let defaults = {
          stageId: urlConfig.get("stageId") || 'main',
          serverURI: urlConfig.get('serverURI') || 'https://'+location.hostname+':8843',
          injectStandbyScreen:true,
          standbyVisible:true,
          bodyClickTogglesFullScreen:true
        };

        this.settings = Object.assign({}, defaults, _settings);
        
        this.socket = io(this.settings.serverURI + '/client', {path:'/sockets/'});

        // Inject standby screen into body
        if(this.settings.injectStandbyScreen){
            let template = document.createRange().createContextualFragment(standbyTemplate);
            document.body.appendChild(template);
        }
        
        // The state object that is shared with the server
        this.state = {
            isFullScreen:false,
            standbyVisible:this.settings.standbyVisible,
            width:0,
            height:0,
            stageId:undefined
        };
        
        if(this.settings.stageId){
            this.subscribeToStage(this.settings.stageId);
        }

        this.onSizeChange();
        this.registerEventListeners();
        this.setStandbyVisibility(this.settings.standbyVisible);
    }

    /**
     * Listen for socket events and document changes
     */
    registerEventListeners(){
        window.onresize = () => { this.onSizeChange() };
        document.onfullscreenchange = () =>{ this.onFullScreenChange() };

        if(this.settings.bodyClickTogglesFullScreen){
            document.querySelector("body").onclick = () => { this.toggleFullscreen() };
        }

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
        let standbyElement = document.querySelector('.solvus-standby');

        if(standbyElement){

            this.state.standbyVisible = state;

            if(state){
                standbyElement.classList.remove('hidden');
            }else{
                standbyElement.classList.add('hidden');
            }

            this.socket.emit('clientUpdate', this.state);
        }
    }

    /**
     * Called on socket connection
     */
    handleConnection(){
        if(this.settings.injectStandbyScreen){
            document.querySelector(".solvus-standby  .display").classList.add('connected');
        }
        this.socket.emit('clientUpdate', this.state);
    }

    /**
     * Called on socket disconnection
     */
    handleDisconnection(){
        if(this.settings.injectStandbyScreen){
            document.querySelector('.solvus-standby  .display').classList.remove('connected');
        }
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

        if(this.settings.injectStandbyScreen){
            document.querySelector('.stageId').innerHTML = stageId;
        }

        this.socket.emit('clientUpdate', this.state);
        
    }

    /**
     * Called when the browser window changes size. Notifies server and updates dom
     */
    onSizeChange(){
        
        this.state.width = document.body.clientWidth;
        this.state.height = document.body.clientHeight;

        if(this.settings.injectStandbyScreen){
            document.querySelector(".screenSize").innerHTML = this.state.width + 'x' + this.state.height;
        }

        this.socket.emit('clientUpdate', this.state);
    }

    /**
     * Toggle between FullScreen mode for the body element
     */
    toggleFullscreen() {
        let element = document.querySelector("body");

        if (screenfull.isEnabled) {
            screenfull.toggle(element);
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