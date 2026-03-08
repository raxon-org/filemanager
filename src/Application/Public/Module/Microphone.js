import { getSection } from "/Module/Section.js";
import { file } from "/Application/Filemanager/Module/File.js";
// import { pipeline, env } from '/Xenova/transformers@2.14.0.js';
import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers";

let microphone = {};

microphone.init = () => {

    env.allowRemoteModels = true;
    env.localModelPath = '/Xenova/Models/';
    const section = getSection(file.data.get('section.id'));
    if(!section){
        return;
    }
    const options = section.select('.microphone-options');
    if(!options){
        return;
    }
    const record = options.select('.microphone-record');
    const stop = options.select('.microphone-stop');
    const sound_clips = options.select(".sound-clips");
    const canvas = options.select(".visualizer");
    const start = microtime(true);
    console.log(record);
    console.log(stop);
    if(!record){
        return;
    }
    if(!stop){
        return;
    }
    stop.disabled = true;
    console.log('yes');

    let audio_context;
    let data_array;
    let buffer_length;
    let analyser;
    let draw_time;
    let fps = 0;
    const canvas_context = canvas.getContext("2d");

// Main block for doing the audio recording
    if (navigator.mediaDevices.getUserMedia) {
        console.log("The mediaDevices.getUserMedia() method is supported.");

        const constraints = { audio: true };
        let chunks = [];

        let onSuccess = (stream) => {
            const media_recorder = new MediaRecorder(stream);

            visualize(stream);

            record.onclick = function () {
                media_recorder.start();
                console.log(media_recorder.state);
                console.log("Recorder started.");
                record.style.background = "red";

                stop.disabled = false;
                record.disabled = true;
            };

            stop.onclick = function () {
                media_recorder.stop();
                console.log(media_recorder.state);
                console.log("Recorder stopped.");
                record.style.background = "";
                record.style.color = "";

                stop.disabled = true;
                record.disabled = false;
            };

            media_recorder.onstop = async function (event) {
                console.log("Last data to read (after MediaRecorder.stop() called).");
                /*
                const clip_name = prompt(
                    "Enter a name for your sound clip?",
                    "My unnamed clip"
                );
                 */

                const clip_container = document.createElement("article");
                const clip_label = document.createElement("p");
                const audio = document.createElement("audio");
                const delete_button = document.createElement("button");

                clip_container.classList.add("clip");
                audio.setAttribute("controls", "");
                delete_button.textContent = "Delete";
                delete_button.className = "delete";

                const clip_name = "Transcribing...";
                clip_label.textContent = clip_name;
                clip_container.appendChild(audio);
                clip_container.appendChild(clip_label);
                clip_container.appendChild(delete_button);
                sound_clips.appendChild(clip_container);

                audio.controls = true;
                // const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
                const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
                // const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
                chunks = [];
                audio.src = window.URL.createObjectURL(blob);
                //voice to txt
                let start = microtime(true);

                let transcriber = await pipeline(
                    'automatic-speech-recognition',
                    'Xenova/whisper-small.en',
                    {
                        quantized: true
                    }
                );

                /*
                  const output = await transcriber(blob, {
                              language: 'en',
                              task: "transcribe",
                              chunk_length_s: 30,
                              stride_length_s: 5,
                              callback_function: callback_function, // after each generation step
                              chunk_callback: chunk_callback, // after each chunk is processed
                          });
                 */

                let {text} = await transcriber(audio.src);
                console.log(text);
                let duration = (microtime(true) - start) * 1000;
                clip_label.textContent = text;
                console.log(duration + ' msec');
                console.log("recorder stopped");
                delete_button.onclick = (event) => {
                    event.target.closest(".clip").remove();
                };
                clip_label.onclick = () => {
                    const existing_name = clip_label.textContent;
                    const new_clip_name = prompt("Enter a new name for your sound clip?");
                    if (is.empty(new_clip_name)) {
                        clip_label.textContent = existing_name;
                    } else {
                        clip_label.textContent = new_clip_name;
                    }
                };
            };
            media_recorder.ondataavailable = (event)=>  {
                chunks.push(event.data);
            };
        };

        let onError = (error) => {
            console.log("The following error occured: " + error);
        };
        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    } else {
        console.log("MediaDevices.getUserMedia() not supported on your browser!");
    }

    const visualize = (stream) => {
        if (is.empty(audio_context)) {
            audio_context = new AudioContext();
        }

        const source = audio_context.createMediaStreamSource(stream);

        analyser = audio_context.createAnalyser();
        analyser.fftSize = 2048;
        buffer_length = analyser.frequencyBinCount;
        data_array = new Uint8Array(buffer_length);
        source.connect(analyser);
        file.data.microphone = {
            "draw": 0
        }
        draw();
    }

    const draw = () => {
        const width = canvas.width;
        const height = canvas.height;
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(data_array);
        canvas_context.fillStyle = "rgba(255, 255, 255, 0.1)";
        // canvas_context.fillStyle = "rgba(75, 150, 245, 0.1)";
        canvas_context.fillRect(0, 0, width, height);
        canvas_context.lineWidth = 1;
        canvas_context.strokeStyle = "rgba(75, 150, 245, 0.7)";
        // canvas_context.strokeStyle = "rgba(255, 255, 255, 0.7)";
        canvas_context.beginPath();
        let slice_width = (width * 1.0) / buffer_length;
        let x = 0;
        for (let i = 0; i < buffer_length; i++) {
            let v = data_array[i] / 128.0;
            let y = (v * height) / 2;

            if (i === 0) {
                canvas_context.moveTo(x, y);
            } else {
                canvas_context.lineTo(x, y);
            }
            x += slice_width;
        }
        canvas_context.lineTo(canvas.width, canvas.height / 2);
        canvas_context.stroke();
        file.data.microphone.draw++;

        if(is.empty(draw_time)){
            draw_time = microtime(true);
        }
        if(microtime(true) - draw_time > 1){
            draw_time = microtime(true);
            fps = file.data.microphone.draw;
            file.data.microphone.draw = 0;
        }
        canvas_context.font = "10px Source Sans Pro";
        canvas_context.fillStyle = "rgba(75, 150, 245, 0.7)";
        canvas_context.fillText("FPS: " + fps,280,110);
    }

    window.onresize = function () {
        canvas.width = options.offsetWidth;
    };
    window.onresize();
}

export { microphone }