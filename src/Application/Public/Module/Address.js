import { directory } from "/Application/Filemanager/Module/Directory.js";
import { microphone } from "/Application/Filemanager/Module/Microphone.js";
import { exception } from "/Module/Exception.js";
import { file } from "/Application/Filemanager/Module/File.js";
import { getSection } from "/Module/Section.js";
import { taskbar } from "/Application/Desktop/Module/Taskbar.js";
import user from "/Module/User.js";
import create from "/Module/Create.js";
import { pipeline } from '/Xenova/transformers@2.14.0.js';
import { AutoModelForSeq2SeqLM, AutoTokenizer } from '/Xenova/transformers@2.14.0.js';
import { AutoProcessor, read_audio } from '/Xenova/transformers@2.14.0.js';

let address = {};

address.title = (directory) => {
    const section = getSection(file.data.get('section.id'));
    if(!section){
        return;
    }
    const head = section.select('.head');
    if(!head){
        return;
    }
    let title = head.data('title');
    let split = title?.split(' | ') ?? [];
    while(split?.length > 1){
        split.pop();
    }
    split.push(directory);
    title = split.join(' | ');
    head.data('title', title);
    taskbar.update(file.data.get('section.id'));
}

/*
microphone.show_some_data = (given_typed_array, num_row_to_display, label) => {
    let size_buffer = given_typed_array.length;
    let index = 0;
    let max_index = num_row_to_display;

    console.log("__________ " + label);

    for (; index < max_index && index < size_buffer; index += 1) {

        console.log(given_typed_array[index]);
    }
}

microphone.process_buffer = (event) => { // invoked by event loop

    let i, N, inp, microphone_output_buffer;

    microphone_output_buffer = event.inputBuffer.getChannelData(0); // just mono - 1 channel for now

    // microphone_output_buffer  <-- this buffer contains current gulp of data size BUFF_SIZE

    microphone.show_some_data(microphone_output_buffer, 5, "from getChannelData");
}

microphone.start = (audioContext, stream) => {
    let gain_node = audioContext.createGain();
    gain_node.connect( audioContext.destination );

    let microphone_stream = audioContext.createMediaStreamSource(stream);
    microphone_stream.connect(gain_node);

    let script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
    script_processor_node.onaudioprocess = microphone.process_buffer();

    microphone_stream.connect(script_processor_node);

    // --- enable volume control for output speakers

    document.getElementById('volume.microphone').addEventListener('change', function() {

        let curr_volume = this.value;
        gain_node.gain.value = curr_volume;

        console.log("curr_volume ", curr_volume);
    });

    // --- setup FFT

    let script_processor_fft_node = audioContext.createScriptProcessor(2048, 1, 1);
    script_processor_fft_node.connect(gain_node);

    let analyserNode = audioContext.createAnalyser();
    analyserNode.smoothingTimeConstant = 0;
    analyserNode.fftSize = 2048;

    microphone_stream.connect(analyserNode);

    analyserNode.connect(script_processor_fft_node);

    script_processor_fft_node.onaudioprocess = function() {

        // get the average for the first channel
        let array = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(array);

        // draw the spectrogram
        if (microphone_stream.playbackState == microphone_stream.PLAYING_STATE) {

            microphone.show_some_data(array, 5, "from fft");
        }
    };
}

microphone.init = () => {
    let audioContext = new AudioContext();

    console.log("audio is starting up ...");

    let BUFF_SIZE = 16384;

    let audioInput = null,
        microphone_stream = null,
        gain_node = null,
        script_processor_node = null,
        script_processor_fft_node = null,
        analyserNode = null
    ;

    if (!navigator.getUserMedia) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;
    }
    if (navigator.getUserMedia){
        navigator.getUserMedia({audio:true},
            function(stream) {
                microphone.start(audioContext, stream);
            },
            function(e) {
                alert('Error capturing audio.');
            }
        );

    } else {
        alert('getUserMedia not supported in this browser.');
    }
}
 */

/*
microphone.stream = () => {
    const section = getSection(file.data.get('section.id'));
    if(!section){
        return;
    }
    navigator.mediaDevices.getUserMedia(({audio: true, video: false})).then((stream) => {
        window.localStream = stream;
        let elem = create('audio');
        elem.className = 'microphone';
        elem.srcObject = stream;
        elem.autoplay = true;
        section.appendChild(elem);
    }).catch((error) => {
        console.log('navigator.getUserMedia error: ', error);
    });
}
 */

address.search = () => {
    const section = getSection(file.data.get('section.id'));
    if(!section){
        return;
    }
    const input = section.select('input[name="search"]');
    console.log(input);
    if(!input){
        return;
    }
    input.on('change', async (event) => {
        let div = create('div');
        div.className = 'search';
        const body = section.select('.body');
        const list = body.select('.list');
        if (list) {
            list.removeClass('has-upload');
            const upload = body.select('.upload');
            if (upload) {
                body.removeChild(upload);
            }
            if (!list.hasClass('has-search')) {
                list.addClass('has-search');
            }
            /*
            const extractor = await pipeline('feature-extraction', 'Xenova/bert-base-uncased', {revision: 'default'});
            const output = await extractor('This is a simple test.');
             */
            /*
            const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            const output = await extractor('This is a simple test.', { pooling: 'mean', normalize: true });
            console.log(output);
             */

            /*
            let tokenizer = await AutoTokenizer.from_pretrained('Xenova/t5-small');
            let model = await AutoModelForSeq2SeqLM.from_pretrained('Xenova/t5-small');

            let { input_ids } = await tokenizer('what are transformers?');
            let outputs = await model.generate(input_ids);
            */



            // const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            // const output = await extractor('app info all.', { pooling: 'mean', normalize: true });
            //
            // console.log(output);

            // Allocate a pipeline for Automatic Speech Recognition
            let start = microtime(true);
            let transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');

            let audio = section.select('.clip audio')
            if(is.nodeList(audio)){
                let index = audio.length - 1;
                let { text } = await transcriber(audio[index].src);
                console.log(text);
                let duration = (microtime(true) - start) * 1000;
                console.log(duration + ' msec');
            } else {
                let { text } = await transcriber(audio.src);
                console.log(text);
                let duration = (microtime(true) - start) * 1000;
                console.log(duration + ' msec');
            }

        // Transcribe an audio file, loaded from a URL.
        //     let result = await transcriber('/Application/Filemanager/Module/Mp3/remco.01.mp3');
            // console.log(result);

            /*
            let processor = await AutoProcessor.from_pretrained('openai/whisper-tiny.en');
            let audio = await read_audio('https://huggingface.co/datasets/Narsil/asr_dummy/resolve/main/mlk.flac', 16000);

            let { input_features } = await processor(audio);
            console.log(input_features);
            */


            // let decoded = tokenizer.decode(outputs[0], { skip_special_tokens: true });

            /*
            const unmasker = await pipeline('fill-mask', 'Xenova/bert-base-cased');
            const output = await unmasker('Do you wan\'t to think? : [MASK].');
            */
            // console.log(output);

        }
        if (body) {
            body.appendChild(div);
        }
        console.log(div);
    });
}

address.bar = (config) => {
    console.log('address bar');
    const section = getSection(file.data.get('section.id'));
    if(!section){
        return;
    }
    const input = section.select('input[name="address"]');
    if(!input){
        return;
    }
    input.on('change', (event) => {
        const route = {
            backend : file.data.get('route.backend.file.list'),
            frontend : file.data.get('route.frontend.file.list')
        };
        let node = {
            "directory" : input.val()
        };
        input.data('dir', input.val());
        address.title(input.val());
        let token = user.token();
        header("Authorization", 'Bearer ' + token);
        const object_header = file.data.get('header');
        let attr;
        for(attr in object_header){
            header(attr, object_header[attr]);
        }
        request(route.backend, node, (url, data) => {
            console.log(data);
            if(exception.authorization(data)){
                user.authorization((url, response) => {
                    console.log(response);
                    if (!is.empty(response.node)) {
                        if (response.node?.token) {
                            user.token(response.node.token);
                        }
                        if (response.node?.refreshToken) {
                            user.refreshToken(response.node.refreshToken);
                        }
                        let node = response.node;
                        delete node?.token;
                        delete node?.refreshToken;
                        user.data(node);
                        token = user.token();
                        header("Authorization", 'Bearer ' + token);
                        request(route.backend, node, (url, data) => {
                            console.log('file list after authorization failure');
                            file.list(data);
                        });
                    } else {
                        //redirect user login
                        redirect("{{route.get(route.prefix() + '-user-login')}}");
                    }
                });
            } else {
                console.log('file list');
                file.list(config, data);
            }
        });
    });
}

address.up = () => {
    const section = getSection(file.data.get('section.id'));
    if(!section){
        return;
    }
    const button = section.select('.button-up');
    if(!button){
        return;
    }
    button.on('click', (event) => {
        const button = event.target.closest('button');
        if(!button){
            return;
        }
        const div = button.closest('div');
        if(!div){
            return;
        }
        const address = div.select('input[name="address"]');
        if(!address){
            return;
        }
        let dir = address.data('dir');
        if(!dir){
            return;
        }
        let split = dir.split('/');
        let slash = split.pop();
        if(is.empty(slash)){
            split.pop();
            split.push(slash);
        }
        if(split.length <= 1){
            return;
        }
        dir = split.join('/');
        address.data('dir', dir);
        address.value = dir;
        address.trigger('change');

        const section = getSection(file.data.get('section.id'));
        if(!section){
            return;
        }
        const li = section.select('ul.tree li[data-dir="' + dir + '"]');
        if(!li){
            return;
        }
        directory.active(li);
    });
}

/*
microphone.init = () => {
    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame)
        navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
        navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, function(e) {
            alert('Error getting audio');
            console.log(e);
        });
}
 */

address.microphone = () => {
    const section = getSection(file.data.get('section.id'));
    if(!section){
        return;
    }
    const button = section.select('.microphone');
    if(!button){
        return;
    }
    button.on('click', async (event) => {
        const body = section.select('.body');
        if(!body){
            return;
        }
        const list = body.select('.list');
        if(!list){
            return;
        }
        if (button.data('on')){
            button.html('mic');
            button.data('delete', 'on');
            list.removeClass('has-microphone');
            let div = body.select('.microphone-options');
            if(is.nodeList(div)){
                for(let index = 0; index < div.length; index++){
                    body.removeChild(div[index]);
                }
            } else {
                body.removeChild(div);
            }
            console.log('off');
        } else {
            button.data('on', true);
            button.html('mic on');
            list.addClass('has-microphone');
            let div = body.select('.microphone-options');
            if(is.empty(div)){
                div = create('div');
                div.className = 'microphone-options';
                div.html(
                    '<canvas class="visualizer" height="120px" width="290px"></canvas>' +
                    '<div id="buttons">' +
                    '<button class="microphone-record">Record</button>' +
                    '<button class="microphone-stop">Stop</button>' +
                    '</div>' +
                    '<div class="sound-clips"></div>'
                );
                body.appendChild(div);
            }
            microphone.init();
            console.log('on');
        }
    });
}

/*
address.microphone = () => {
    const section = getSection(file.data.get('section.id'));
    if(!section){
        return;
    }
    const button = section.select('.microphone');
    if(!button){
        return;
    }
    let randomNoiseNode = null;
    button.on('click', async (event) => {
        if (
            button.hasClass('recording')
        ) {
            button.html('mic');
            const audioContext = file.data.audioContext;
            const randomNoiseNode = file.data.randomNoiseNode;
            const mediaRecorder = file.data.mediaRecorder;
            randomNoiseNode.disconnect(audioContext.destination);
            audioContext.close();
            file.data.delete('audioContext');
            file.data.delete('randomNoiseNode');

            mediaRecorder.requestData();
            mediaRecorder.stop();

            const data = file.data.get('microphone');
            address.export_wav(data);

            // audioRecorder.stop();
        } else {
            // microphone.stream();
            button.html('mic on');
            let chunks = [];
            // audioRecorder.clear();
            // audioRecorder.record();
            const audioContext = new AudioContext();
            await audioContext.audioWorklet.addModule("/Audio/Recorder/random-noise-processor.js");
            await audioContext.audioWorklet.addModule('/Audio/Recorder/AudioProcessor.js').then(() => {
                let node = new AudioProcessorNode(audioContext);
                node.port.onmessage = (event) => {
                    // Handling data from the processor.
                    console.log(event.data);
                };
                node.port.postMessage('Hello!');
            });
            const randomNoiseNode = new AudioWorkletNode(
                audioContext,
                "random-noise-processor"
            );
            const destination = new MediaStreamAudioDestinationNode(audioContext);
            const mediaRecorder = new MediaRecorder(destination.stream);

            mediaRecorder.ondataavailable = (evt) => {
                // push each chunk (blobs) in an array
                chunks.push(evt.data);
            };

            mediaRecorder.onstop = (evt) => {
                alert('yes');
                // Make blob out of our blobs, and open it.
                const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
                const audioURL = window.URL.createObjectURL(blob);
                const audio = new Audio(audioURL);
                audio.play();
            }
            randomNoiseNode.connect(destination);
            randomNoiseNode.connect(audioContext.destination);
            file.data.audioContext =  audioContext;
            file.data.randomNoiseNode =  randomNoiseNode;
            file.data.mediaRecorder =  mediaRecorder;
            mediaRecorder.start();
        }
        button.toggleClass('recording');
    });
}

address.export_wav = (data) => {
    if(is.empty(data)){
        return;
    }
    let interleaved = undefined;
    if (data.length  >= 2) {
        interleaved = address.interleave(data[0], data[1]);
    } else {
        interleaved = data[0];
    }
    let dataview = address.encode_wav(interleaved);
    let audioBlob = new Blob([dataview], { type: 'audio/wav' });
// /
        console.log(audioBlob);
}

address.write_string = (view, offset, string) =>{
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
*/

address.encode_wav = (samples) => {
    let buffer = new ArrayBuffer(44 + samples.length * 2);
    let view = new DataView(buffer);
    /* RIFF identifier */
    address.write_string(view, 0, 'RIFF');
    /* RIFF chunk length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    address.write_string(view, 8, 'WAVE');
    /* format chunk identifier */
    address.write_string(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, samples.length, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 4, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, samples.length * 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    address.write_string(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);
    address.floatTo16BitPCM(view, 44, samples);
    return view;
}

address.interleave = (inputL, inputR) => {
    let length = inputL.length + inputR.length;
    let result = new Float32Array(length);

    let index = 0,
        inputIndex = 0;

    while (index < length) {
        result[index++] = inputL[inputIndex];
        result[index++] = inputR[inputIndex];
        inputIndex++;
    }
    return result;
}

address.read = (config) => {
    const route = {
        frontend : file.data.get('route.frontend.address.bar')
    };
    const data = {
        section : {
            id : file.data.get('section.id')
        }
    };
    request(route.frontend, data, (url, response) => {
        address.bar(config);
        address.search();
        address.microphone();
        // address.microphone();
        address.up();
    });
}

export { address }