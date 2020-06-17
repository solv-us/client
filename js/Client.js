// Class for front-end Client management
class Client {
    constructor(socket, stageId) {
        this.socket = socket; 

        this.state = {};
        this.state.isFullScreen = false;
        this.state.media = '';
        this.clock = new Clock(false);

        if (stageId)
            this.subscribeToStage(stageId);

        this.onSizeChange();
        this.registerEventListeners();
    }

    subscribeToStage(stageId){
        this.state.stageId = stageId;
        document.querySelector('.stageId').innerHTML = stageId;
        this.socket.emit('clientUpdate', this.state);
    }

    registerEventListeners(){
        window.onresize = () => { this.onSizeChange() };
        document.onfullscreenchange = () =>{ this.onFullScreenChange() };
        document.querySelector("body").onclick = () => { this.toggleFullscreen() };

        this.socket.on('setStage', (stage)=>{ this.subscribeToStage(stage)})
        this.socket.on('setMedia', (fileName) => { this.setMedia(fileName) });
        this.socket.on('start', (timestamp) => { this.start(timestamp) });
    }

    setMedia(fileName){

        if(fileName === this.state.media)
        return;
        
        this.state.media = fileName;
        this.state.loaded = false;
        document.querySelector('.screen-disabled').style.display = '';
        document.querySelector("#screen").pause();
        document.getElementById('screen').currentTime = 0;
        this.clock.stop();


        this.loadContent(fileName);
        document.querySelector(".loaded").innerHTML = 'Loading: ' + this.state.media;
        this.socket.emit('clientUpdate', this.state);
    }

    onFullScreenChange(){
        if (document.fullscreenElement) {
            this.state.isFullScreen = true;
        } else {
            this.state.isFullScreen = false;
        }
    }

    onSizeChange(){
        this.state.width = document.body.clientWidth;
        this.state.height = document.body.clientHeight;
        document.querySelector(".screenSize").innerHTML = this.state.width + 'x' + this.state.height;
        
        this.socket.emit('clientUpdate', this.state);
    }

    loadContent(fileName) {
        let req = new XMLHttpRequest();
        req.open('GET', '/content/' + fileName + '?_=' + new Date().getTime(), true);
        req.setRequestHeader('Cache-Control', 'no-cache');
        req.responseType = 'blob';

        req.onload = (event) => {
            console.log(event)
            // Onload is triggered even on 404
            // so we need to check the status code
            if (event.srcElement.status === 200) {
                var videoBlob = event.srcElement.response;
                var vid = URL.createObjectURL(videoBlob);
                document.querySelector("#screen").src = vid;
                document.querySelector(".loaded").innerHTML = 'Loaded: '+this.state.media;
                this.state.loaded = true;
              
                this.socket.emit('clientUpdate', this.state);
            }
        }
        req.onerror = (error) => {
            // Error
            console.log(error);
        }

        req.send();
    }

    start(timestamp){
      //  let startDelay = timestamp - (typeof performance === 'undefined' ? Date : performance).now();
        let startDelay = timestamp - new Date(ts.now());
        console.log(startDelay, timestamp, new Date(ts.now()), timestamp - ts.now())
     //  
        document.getElementById('screen').pause(); 
        document.getElementById('screen').currentTime = 0;
        let smpte = document.querySelector('.smpte');
        requestInterval(() => {
            let tc = SMPTE.fromSeconds(this.clock.getElapsedTime(), 60, false);
            smpte.innerHTML = tc;
        }, 1); 

        requestTimeout(() => {
            this.clock.start();
            requestTimeout(() => {
                document.getElementById('screen').play();
                document.querySelector('.screen-disabled').style.display = 'none';
            },2000);
        }, startDelay); 
    }

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
}