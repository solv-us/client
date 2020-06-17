socket.on('beat', ({ beat, bpm }) => {
    document.querySelector('.beat').innerHTML = bpm + ' (' + beat + ')';
})

let tempoEvent;
let beata = 0;
socket.on('bpm', ({ bpma, timestamp }) => {
    if (tempoEvent) {
        clearRequestInterval(tempoEvent);
    }
    beata = 0;
    let startDelay = timestamp - new Date(ts.now());
    console.log(startDelay, timestamp)
    requestTimeout(() => {
        tempoEvent = requestInterval(() => {
            //console.log('beat '+tempo);
            beata++;

            document.querySelector('.beat2').innerHTML = ' (' + beata + ')';

            if (beata > 3) {
                beata = 0;
            }

        }, 60000 / bpma)
    }, startDelay);

});