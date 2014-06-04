/*!
*  geolocation-simulator.js v0.0.1
*  (c) 2014, Russell Goldenberg
*  MIT License
*/

(function() {
    var _audio = [],
        _progressTimeout = null,
        _progressInterval = 34;

    //auto initialize any audioContainer divs
    function init() {
        //TODO check for audio support first
        if(true) {

            //setup each audio element
            $('.audioContainer').each(function(i) {
                setupAudio({index: i,  el: this});
            });

            //bind events
            bindEvents();

        } else {
            $('.audioContainer').hide();
        }
    }

    //create the button and progress bar for the audio element
    function setupAudio(params) {
        var button = $('<button></button>');
        
        button
            .addClass('audioButton')
            .attr('data-index', params.index)
            .text('loading audio...');

        var progress = $('<div></div>');
        progress.addClass('progress');

        //append new elements to container
        $(params.el).append(button).append(progress);

        //store dom elements to audio object
        _audio[params.index] = {
            container: params.el,
            button: $(params.el).find('.audioButton'),
            progress: $(params.el).find('.progress')
        };

        //setup howl audio player and store it
        _audio[params.index].player = createAudioPlayer(_audio[params.index]);
    }

    function createAudioPlayer(audioObj) {
        var el = $(audioObj.container),
            src = el.attr('data-src'),
            playText = el.attr('data-text');

        var player = new Howl({
            urls: [src + '.mp3', src + '.ogg'],
            autoplay: false,
            loop: false,
            volume: 0.8,
            onload: function() {
                //ready to play
                if(playText && playText.length > 0) {
                    audioObj.playText = playText;
                    audioObj.button.text(playText); 
                } else {
                    audioObj.playText = 'Play audio';
                    audioObj.button.text('Play audio');
                }
            },
            onloaderror: function() {
                //remove audio element from dom if we can't play it
                audioObj.container.hide();
                console.log('error loading audio:', src);
            },
            onend: function() {
                endAudio(audioObj);
            }
        });
         return player;
    }

    //bind audio button click event to trigger audio play / pause
    function bindEvents() {
        $('.audioButton').on('click', function(e) {
            e.preventDefault();
            var index = +$(this).attr('data-index');
            toggleAudio(index);
            return false;
        });
    }

    function toggleAudio(index) {
        //make sure there is an audio obj associated with button
        var currentAudio = _audio[index] ? _audio[index] : false;
        
        if(currentAudio) {  
            //reset timer timeout for progress update
            clearTimeout(_progressTimeout);
            _progressTimeout = null;

            //if play was not playing, start it and stop others
            if(!currentAudio.playing) {
                //pause all others
                pauseAllAudio(index);

                //play this audio
                playAudio(index);

            } else {
                //pause current audio
                pauseAudio(index);
            }
        }
    }

    function pauseAllAudio(except) {
        for(var i = 0; i < _audio.length; i++) {
            if(i !== except) {
                pauseAudio(i);
            }
        }
    }

    function pauseAudio(index) {
        var audioObj = _audio[index];
        if(audioObj.playing) {
            audioObj.playing = false;
            audioObj.player.pause();
            audioObj.button.text(audioObj.playText);
        }
    }

    function playAudio(index) {
        var audioObj = _audio[index];

        audioObj.playing = true;
        audioObj.button.text('Pause audio');

        audioObj.player.play(function() {
            //start/resume progress timer
            updateAudioProgress(audioObj);
        });
    }


    function updateAudioProgress(audioObj) {
        var percent = Math.floor((audioObj.player.pos() / audioObj.player._duration) * 1000) / 10;

        var percentString = Math.min(percent, 100) + '%';

        audioObj.progress.css('width', percentString);

        _progressTimeout = setTimeout(function() {
            updateAudioProgress(audioObj);
        }, _progressInterval);
    }

    function endAudio(audioObj) {
        clearTimeout(_progressTimeout);
        _progressTimeout = null;
        audioObj.player.stop();
        audioObj.playing = false;
        audioObj.button.text(audioObj.playText);
        audioObj.progress.css('width', '100%');
    }

    init(); 
})();