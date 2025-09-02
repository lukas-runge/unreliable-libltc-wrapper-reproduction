import { getDevices, AudioIO, SampleFormat16Bit } from "naudiodon-neo";

import { LTCDecoder } from "libltc-wrapper";

import { createWriteStream } from "fs";

const sampleRate = 48000;
const frameRate = 30;

const ltcDecoder = new LTCDecoder(sampleRate, frameRate, "s16");

const pcmFile = createWriteStream("./output.pcm");

const device = getDevices().find((d) => d.name.includes("USB Audio"));

if (!device) {
  console.error("No suitable audio device found.");
  process.exit(1);
}

console.log(device);

const audioInput = new AudioIO({
  inOptions: {
    channelCount: 1,
    sampleFormat: SampleFormat16Bit,
    sampleRate: sampleRate,
    deviceId: device?.id,
    closeOnError: true,
    highwaterMark: 32,
  }
});

audioInput.on("data", (pcm) => {
  ltcDecoder.write(pcm);
    pcmFile.write(pcm);

    while (true) { 
      const frame = ltcDecoder.read();
      if (frame) console.log(frame);
      else break;
    }
});

audioInput.start();

console.log(`${device?.name}`);
