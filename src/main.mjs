import audify from "audify";
const { RtAudio } = audify;

import { LTCDecoder } from "libltc-wrapper";

import { usePlattformSpecific } from "./use-plattform-specific.mjs";

const sampleRate = 48000;
const frameRate = 30;

const ltcDecoder = new LTCDecoder(sampleRate, frameRate, "s16");

const audioInput = new RtAudio(
  usePlattformSpecific({
    linux: 2,
    mac: 1,
    windows: 7,
    default: undefined,
  })
);

const device = audioInput
  .getDevices()
  .find((d) => d.name.includes("USB Audio"));

audioInput.openStream(
  null,
  {
    deviceId: device?.id,
    nChannels: 1,
    firstChannel: 0,
  },
  2,
  sampleRate,
  120,
  "MyStream 2",
  (pcm) => {
    ltcDecoder.write(pcm);

    while (true) {
      const frame = ltcDecoder.read();
      if (frame) console.log(frame);
      else break;
    }
  },
  null,
  0x2,
  (error, message) => {
    console.log(`${error}: ${message}`);
  }
);

audioInput.start();

setTimeout(() => {
  try {
    audioInput.write(null);
  } catch {
    console.log("RTAudio fixed, enjoy your stream.");
  }
});

console.log(`${device?.name}`);
