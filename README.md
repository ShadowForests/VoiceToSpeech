# Voice to Speech

Voice to Speech is an in-browser client-side service that converts a user's voice into synthesized speech live via speech recognition, with optional language translation.

The Chrome browser is required due to lack of speech recognition support in other browsers.

Visit https://shadowforests.github.io/VoiceToSpeech/ to use Voice to Speech.

## Features

- Live speech recognition via Web Speech API (only on Chrome).
- Low latency voice-to-speech by using interim speech recognition results.
- Auto translation from input voice language to output speech language.
- Large selection of languages and dialects for speech recognition and text-to-speech.
- Customize audio input and output devices.
- Customize output volume, as well as pitch and rate for select voices.
- Live speech output transcript with playback support for all transcript entries.
- Selecting all text on the page will only select transcript text, allowing easy copy-paste.
- Live diagnostics for speech recognition output, confidence, and errors.
- Use a [web socket](#Web-Socket) to send speech output text directly to your PC.
- Use two instances to allow [bi-directional translation](#Bi-directional-Translation) between you and someone else.

## Options

- **Input Device**: Select the audio input device by setting it in your browser (changing in options menu is currently not supported).
- **Output Device**: Select the speech audio output device.
- **Input Language**: Select the language you are speaking in.
- **Output Voice/Language**: Select the voice/language/dialect you wish for speech synthesis output. Translation between languages only occurs if translation is enabled, otherwise the output will use the non-translated input. This can be useful to speak with a certain language dialect. Voices under Voice Set A also supports pitch and rate adjustment.
- **Output Volume**: Change the speech synthesis output volume. You can also press mute so that only the transcript is recorded without speech synthesis.
- **Pitch/Rate**: Change the speech synthesis pitch and rate (only supported with Voice Set A).
- **Show Transcript**: Toggles a live speech output transcript with timestamps and playback for any past speech synthesis result.
- **Show Diagnostics**: Toggles live diagnostics for speech recognition output, confidence, and errors.
- **Low-Latency**: Toggles responding to interim speech recognition results for less delay between voice input and speech output. This may result in less accurate results.
- **Translation**: Toggles auto translation between the input and output languages. Low-Latency is not supported with Translation enabled.

## Web Socket

You can set up a web socket server on your PC to send speech output text directly to your PC. You can find an example in this repository. Start the server by running `socket/run_server.bat` and speech will be sent into `socket/vts_speech.txt` whenever you use the Voice To Speech site.

## Bi-directional Translation

This is a walkthrough to setup a custom system allows bi-directional translation between you and someone else.

1. You will need two Chrome browsers installed separately. I recommend [Chrome](https://www.google.com/chrome/) and [Chrome Beta](https://www.google.com/chrome/beta/). This is because a single Chrome browser can only handle one voice input at a time.
1. You will also need at least two audio routers from [VB-Cable](https://www.vb-audio.com/Cable/). You should get the default **VB-Cable Driver** as well as an additional **VB-Cable A Driver** (donationware). This is so that we can route audio through separate channels to avoid collision in speech recognition results. After setup, you can open your computer's sound options and enable listening to the cables from your main speakers. This helps to hear what is happening during conversation.
1. Open the Voice To Speech site on both browsers. Open the options menu and enable **Translation** in both browsers.
1. In Chrome, set the input to your personal microphone, and the output to **CABLE OUTPUT**. Then, set your language as the input, and the language the other person speaks in as the output.
1. In your communication program, set your input microphone to **CABLE OUTPUT**. Now, when you speak, the speech synthesis will output to your communication program instead of your voice.
1. In Chrome Beta, set the input to **CABLE-A OUTPUT**, and the output to your default speaker. Then, set the language the other person speaks in as the input, and your language as the output.
1. If your communication program supports redirecting audio output, set the output to **CABLE-A OUTPUT**. Otherwise, if you are using Windows, you can go to **Sound playback options** in the Settings app, click **App volume and device properties**, and change the output device for your communication program. This may require you to restart your program. Now, when the other person speaks, their voice will be redirected through Voice To Speech and output as translated speech through your speaker.
1. Now the other person's voice will be auto translated and spoken to your speaker, and your voice will be auto translated and spoken through your communication program!

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
