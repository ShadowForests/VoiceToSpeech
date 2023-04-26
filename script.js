const _version = "0.1.0";
document.querySelector("div#_version").textContent = `v${_version}`;

let SpeechRecognition = null;
try {
    SpeechRecognition = SpeechRecognition || webkitSpeechRecognition || mozSpeechRecognition || msSpeechRecognition;
} catch (err) {
    console.error(err);
    $('div#speechRecognitionUnsupportedNag').nag({
        storageMethod: null,
        persist: true
    }).nag('show');
}
// let SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList || mozSpeechGrammarList || msSpeechGrammarList;
// let SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent || mozSpeechGrammarList || msSpeechGrammarList;

// StorageItems

function setStorageItem(cname, cvalue) {
    window.localStorage.setItem(cname, cvalue);
}

function getNumericStorageItem(cname, cdefault) {
    let result = parseFloat(window.localStorage.getItem(cname));
    return result == null || isNaN(result) ? cdefault : result;
}

function getBooleanStorageItem(cname, cdefault) {
    let result = window.localStorage.getItem(cname);
    return result == null ? cdefault : result === "true";
}

function getStringStorageItem(cname, cdefault) {
    let result = window.localStorage.getItem(cname);
    return result == null ? cdefault : result;
}

// Target elements

const outputSpeechStatus = document.querySelector('label#outputSpeechStatus');
// const outputConfidence = document.querySelector('label#outputConfidence');
const outputStatus = document.querySelector('label#outputStatus');
const statusBar = document.querySelector('p#statusBar');
const startButtonInfo = document.querySelector('p#startButtonInfo');
const startButton = document.querySelector('button#startButton');
const outputDeviceText = document.querySelector('p#outputDeviceText');

const tabSettings = document.querySelector('div#tabSettings');
const tabReplacements = document.querySelector('div#tabReplacements');

const $tabSettingsButton = $('a#tabSettingsButton');
const $tabReplacementsButton = $('a#tabReplacementsButton');
const $tabAboutButton = $('a#tabAboutButton');

const $optionsButton = $('button#optionsButton');
const $optionsContainer = $('div#optionsContainer');
const $optionsModal = $('div#optionsModal');
const $uiMenuButton = $('button#uiMenuButton');
const $uiMenuModal = $('div#uiMenuModal');
const $socketMenuButton = $('button#socketMenuButton');
const $socketMenuModal = $('div#socketMenuModal');

const $resetOptionsButton = $('i#resetOptionsButton');
const $resetSettingsModal = $('div#resetSettingsModal');
const $resetSettingsNag = $('div#resetSettingsNag');
const $resetReplacementsModal = $('div#resetReplacementsModal');
const $resetReplacementsNag = $('div#resetReplacementsNag');
const $clearTranscriptModal = $('div#clearTranscriptModal');
const $clearTranscriptNag = $('div#clearTranscriptNag');
const $uploadReplacementsModal = $('div#uploadReplacementsModal');

const $ttsInput = $('input#ttsInput');
const $transcriptButton = $('input#transcriptCheckbox');
const $transcriptDropdown = $('div#transcriptDropdown');
const $transcriptCopy = $('i#transcriptCopy');
const $timestampsButton = $('div#timestampsCheckbox');
const $translationsButton = $('div#translationsCheckbox');
const $clearTranscriptButton = $('div#clearTranscriptButton');
const $extraVoiceOptions = $('#extraVoiceOptions');
const $pitchOption = $('#pitchOption');
const $preservePitchOption = $('#preservePitchOption');
const $socketButton = $('input#socketCheckbox');
const $ttsButton = $('input#ttsCheckbox');
const $statusButton = $('input#statusCheckbox');
const $lowlatencyButton = $('input#lowlatencyCheckbox');
const $latencyContainer = $('div#latencyContainer');
const $translateButton = $('input#translateCheckbox');
const $speakInputButton = $('input#speakInputCheckbox');

const latencyInput = document.querySelector('input#latencyInput');
const socketAddressInput = document.querySelector('input#socketAddressInput');
const socketPortInput = document.querySelector('input#socketPortInput');

const transcriptHeader = document.querySelector('div#transcriptHeader');
const transcript = document.querySelector('div#transcript');
const ttsHeader = document.querySelector('div#ttsHeader');
const ttsArea = document.querySelector('div#ttsArea');

const inputDeviceSelect = document.querySelector('select#inputDevice');
const outputDeviceSelect = document.querySelector('select#outputDevice');

const deviceSelectors = [inputDeviceSelect, outputDeviceSelect];

const inputLangSelect = document.querySelector('select#searchSelectInputLang');
const outputVoiceSelect = document.querySelector('select#searchSelectOutputVoice');
const outputLangSelect = document.querySelector('select#searchSelectOutputLang');

const $syncLanguageButton = $('div#syncLanguageButton');
const $syncLanguageIcon = $('i#syncLanguageIcon');
const $syncLanguageIconOutline = $('i#syncLanguageIconOutline');
const $syncLanguageErrorPopup = $('div#syncLanguageErrorPopup');

const $templates = document.querySelector('div#templates');
const $replacementsTable = document.querySelector('table#replacementsTable');
const $replacementEntries = document.querySelector('tbody#replacementEntries');
const $replacementEntryTemplate = document.querySelector('table#replacementEntryTemplate').firstElementChild.firstElementChild;
const $replacementsTableClone = document.querySelector('table#replacementsTableClone');
const $replacementsTableCloneRowContainer = document.querySelector('table#replacementsTableCloneRowContainer');

const $importReplacementsDropdown = $('div#importReplacementsDropdown');
const $exportReplacementsDropdown = $('div#exportReplacementsDropdown');
const importReplacementsButton = document.querySelector('div#importReplacementsButton');
const replacementsFileInput = document.querySelector('input#replacementsFileInput');

$templates.remove();

const $muteButton = $('#muteButton');
const $volumeSlider = $('#volumeSlider');
const $volumeFill = $('#volumeFill');
const $volumeThumb = $('#volumeThumb');
const $pitchSlider = $('#pitchSlider');
const $pitchThumb = $('#pitchThumb');
const $preservePitchButton = $('#preservePitchButton');
const $rateSlider = $('#rateSlider');
const $rateThumb = $('#rateThumb');
const $pitchSliderSS = $('#pitchSliderSS');
const $pitchThumbSS = $('#pitchThumbSS');
const $rateSliderSS = $('#rateSliderSS');
const $rateThumbSS = $('#rateThumbSS');

const voiceSetMapping = {
    voiceSetA: "a",
    voiceSetB: "b",
    voiceSetC: "c",
    voiceSetD: "d",
    voiceSetE: "e",
    voiceSetS: "s"
}

const storageItemKeys = {
    socketAddress: 'vts-socketAddress',
    socketPort: 'vts-socketPort',

    inputLangSelect: 'vts-inputLangSelect',
    outputVoiceSelect: 'vts-outputVoiceSelect',
    outputLangSelect: 'vts-outputLangSelect',
    outputDeviceSelect: 'vts-outputDeviceSelect',
    latency: 'vts-latency',

    transcriptEnabled: 'vts-transcriptEnabled',
    socketEnabled: 'vts-socketEnabled',
    ttsEnabled: 'vts-ttsEnabled',
    statusEnabled: 'vts-statusEnabled',
    lowlatencyEnabled: 'vts-lowlatencyEnabled',
    syncLanguageEnabled: 'vts-syncLanguageEnabled',
    translateEnabled: 'vts-translateEnabled',
    speakInputEnabled: 'vts-speakInputEnabled',
    timestampsEnabled: 'vts-timestampsEnabled',
    translationsEnabled: 'vts-translationsEnabled',
    muteEnabled: 'vts-muteEnabled',
    preservePitchEnabled: 'vts-preservePitchEnabled',

    volume: 'vts-volume',
    rate: 'vts-rate',
    pitch: 'vts-pitch',

    replacements: 'vts-replacements',
}

function getMuteEnabled() { return $muteButton.hasClass('mute'); }
function getPreservePitchEnabled() { return $preservePitchButton.prop('checked'); }
function getTranscriptEnabled() { return $transcriptButton.prop('checked'); }
function getSocketEnabled() { return $socketButton.prop('checked'); }
function getTtsEnabled() { return $ttsButton.prop('checked'); }
function getStatusEnabled() { return $statusButton.prop('checked'); }
function getLowlatencyEnabled() { return $lowlatencyButton.prop('checked'); }
function getSyncLanguageEnabled() { return $syncLanguageIcon.hasClass('inverted'); }
function getTranslateEnabled() { return $translateButton.prop('checked'); }
function getSpeakInputEnabled() { return $speakInputButton.prop('checked'); }
function getTimestampsEnabled() { return $timestampsButton.checkbox('is checked'); }
function getTranslationsEnabled() { return $translationsButton.checkbox('is checked'); }

const defaultVtsState = {
    socketAddress: "localhost",
    socketPort: 3000,

    inputLangSelect: "en-US",
    outputVoiceSelect: voiceSetMapping.voiceSetA + "en-US",
    outputLangSelect: "en",
    outputDeviceSelect: "default",
    latency: 1000,

    transcriptEnabled: getTranscriptEnabled(),
    socketEnabled: getSocketEnabled(),
    ttsEnabled: getTtsEnabled(),
    statusEnabled: getStatusEnabled(),
    lowlatencyEnabled: getLowlatencyEnabled(),
    syncLanguageEnabled: getSyncLanguageEnabled(),
    translateEnabled: getTranslateEnabled(),
    speakInputEnabled: getSpeakInputEnabled(),
    timestampsEnabled: getTimestampsEnabled(),
    translationsEnabled: getTranslationsEnabled(),
    muteEnabled: getMuteEnabled(),

    volume: 100,
    rate: 1.0,
    pitch: 1.0,
    preservePitchEnabled: getPreservePitchEnabled(),
}

let vtsState = {...defaultVtsState};

let buttonState = 0;
let translateApi = 0;
const inputDeviceSelectionDisabled = true;

let audio = new Audio();
let soundTouch = null;
let audioDestination;

let speechPlaying = false;
let speechBuffer = [];
let timeoutTimes = 0;

let ranGotDevices = false;

let recognition = null;
try {
    recognition = new SpeechRecognition();   
} catch (err) {}

let socket = null;
function setupSocket() {
    if (socket !== null) {
        socket.disconnect();
        socket.close();
    }

    socket = io.connect(`http://${vtsState.socketAddress}:${vtsState.socketPort}`);

    socket.on('connect_error', () => {
        console.info(
            'SOCKET: Restart to reconnect socket if using a personal server.',
        );
        socket.disconnect();
    });

    socket.connect();
}

// Make microphone icon appear in browser
async function triggerMicrophone() {
    await recognition.start();
    await recognition.stop();
}

triggerMicrophone();

// Languages that don't use spaces for dividing words
// chinese, japanaese, indonesian, thai, javanese, khmer,
// lao, burmese, sundanese, vietnamese, tibetan, dzongkha, tai lu
const nonSpacedLangs = [
    ['km-KH', 'Khmer (Cambodia)', 'ភាសាខ្មែរ (កម្ពុជា)'],
    ['lo-LA', 'Lao (Laos)', 'ລາວ (ລາວ)'],
    ['jv-ID', 'Javanese (Indonesia)', 'Jawa (Indonesia)'],
    ['su-ID', 'Sundanese (Indonesia)', 'Urang (Indonesia)'],
    ['th-TH', 'Thai (Thailand)', 'ไทย (ประเทศไทย)'],
    ['vi-VN', 'Vietnamese (Vietnam)', 'Tiếng Việt (Việt Nam)'],
    ['zh-TW', 'Chinese, Mandarin (Traditional, Taiwan)', '國語 (台灣)'],
    ['yue-Hant-HK', 'Chinese, Cantonese (Traditional, Hong Kong)', '廣東話 (香港)'],
    ['ja-JP', 'Japanese (Japan)', '日本語（日本）'],
    ['zh-HK', 'Chinese, Mandarin (Simplified, Hong Kong)', '普通話 (香港)'],
    ['zh-CN', 'Chinese, Mandarin (Simplified, China)', '普通话 (中国大陆)'],
];

// If you modify this array, also update default language / dialect below
const inputLangs = [
    ['af-ZA', 'Afrikaans (South Africa)', 'Afrikaans (Suid-Afrika)'],
    ['am-ET', 'Amharic (Ethiopia)', 'አማርኛ (ኢትዮጵያ)'],
    ['hy-AM', 'Armenian (Armenia)', 'Հայ (Հայաստան)'],
    ['az-AZ', 'Azerbaijani (Azerbaijan)', 'Azərbaycan (Azərbaycan)'],
    ['id-ID', 'Indonesian (Indonesia)', 'Bahasa Indonesia (Indonesia)'],
    ['ms-MY', 'Malay (Malaysia)', 'Bahasa Melayu (Malaysia)'],
    ['bn-BD', 'Bengali (Bangladesh)', 'বাংলা (বাংলাদেশ)'],
    ['bn-IN', 'Bengali (India)', 'বাংলা (ভারত)'],
    ['ca-ES', 'Catalan (Spain)', 'Català (Espanya)'],
    ['cs-CZ', 'Czech (Czech Republic)', 'Čeština (Česká republika)'],
    ['da-DK', 'Danish (Denmark)', 'Dansk (Danmark)'],
    ['de-DE', 'German (Germany)', 'Deutsch (Deutschland)'],
    ['en-AU', 'English (Australia)', 'English (Australia)'],
    ['en-CA', 'English (Canada)', 'English (Canada)'],
    ['en-GH', 'English (Ghana)', 'English (Ghana)'],
    ['en-GB', 'English (United Kingdom)', 'English (Great Britain)'],
    ['en-IN', 'English (India)', 'English (India)'],
    ['en-IE', 'English (Ireland)', 'English (Ireland)'],
    ['en-KE', 'English (Kenya)', 'English (Kenya)'],
    ['en-NZ', 'English (New Zealand)', 'English (New Zealand)'],
    ['en-NG', 'English (Nigeria)', 'English (Nigeria)'],
    ['en-PH', 'English (Philippines)', 'English (Philippines)'],
    ['en-SG', 'English (Singapore)', 'English (Singapore)'],
    ['en-ZA', 'English (South Africa)', 'English (South Africa)'],
    ['en-TZ', 'English (Tanzania)', 'English (Tanzania)'],
    ['en-US', 'English (United States)', 'English (United States)'],
    ['es-AR', 'Spanish (Argentina)', 'Español (Argentina)'],
    ['es-BO', 'Spanish (Bolivia)', 'Español (Bolivia)'],
    ['es-CL', 'Spanish (Chile)', 'Español (Chile)'],
    ['es-CO', 'Spanish (Colombia)', 'Español (Colombia)'],
    ['es-CR', 'Spanish (Costa Rica)', 'Español (Costa Rica)'],
    ['es-EC', 'Spanish (Ecuador)', 'Español (Ecuador)'],
    ['es-SV', 'Spanish (El Salvador)', 'Español (El Salvador)'],
    ['es-ES', 'Spanish (Spain)', 'Español (España)'],
    ['es-US', 'Spanish (United States)', 'Español (Estados Unidos)'],
    ['es-GT', 'Spanish (Guatemala)', 'Español (Guatemala)'],
    ['es-HN', 'Spanish (Honduras)', 'Español (Honduras)'],
    ['es-MX', 'Spanish (Mexico)', 'Español (México)'],
    ['es-NI', 'Spanish (Nicaragua)', 'Español (Nicaragua)'],
    ['es-PA', 'Spanish (Panama)', 'Español (Panamá)'],
    ['es-PY', 'Spanish (Paraguay)', 'Español (Paraguay)'],
    ['es-PE', 'Spanish (Peru)', 'Español (Perú)'],
    ['es-PR', 'Spanish (Puerto Rico)', 'Español (Puerto Rico)'],
    ['es-DO', 'Spanish (Dominican Republic)', 'Español (República Dominicana)'],
    ['es-UY', 'Spanish (Uruguay)', 'Español (Uruguay)'],
    ['es-VE', 'Spanish (Venezuela)', 'Español (Venezuela)'],
    ['eu-ES', 'Basque (Spain)', 'Euskara (Espainia)'],
    ['fil-PH', 'Filipino (Philippines)', 'Filipino (Pilipinas)'],
    ['fr-CA', 'French (Canada)', 'Français (Canada)'],
    ['fr-FR', 'French (France)', 'Français (France)'],
    ['gl-ES', 'Galician (Spain)', 'Galego (España)'],
    ['ka-GE', 'Georgian (Georgia)', 'ქართული (საქართველო)'],
    ['gu-IN', 'Gujarati (India)', 'ગુજરાતી (ભારત)'],
    ['hr-HR', 'Croatian (Croatia)', 'Hrvatski (Hrvatska)'],
    ['zu-ZA', 'Zulu (South Africa)', 'IsiZulu (Ningizimu Afrika)'],
    ['is-IS', 'Icelandic (Iceland)', 'Íslenska (Ísland)'],
    ['it-IT', 'Italian (Italy)', 'Italiano (Italia)'],
    ['it-CH', 'Italian (Switzerland)', 'Italiano (Svizzera)'],
    ['jv-ID', 'Javanese (Indonesia)', 'Jawa (Indonesia)'],
    ['kn-IN', 'Kannada (India)', 'ಕನ್ನಡ (ಭಾರತ)'],
    ['km-KH', 'Khmer (Cambodia)', 'ភាសាខ្មែរ (កម្ពុជា)'],
    ['lo-LA', 'Lao (Laos)', 'ລາວ (ລາວ)'],
    ['lv-LV', 'Latvian (Latvia)', 'Latviešu (latviešu)'],
    ['lt-LT', 'Lithuanian (Lithuania)', 'Lietuvių (Lietuva)'],
    ['hu-HU', 'Hungarian (Hungary)', 'Magyar (Magyarország)'],
    ['ml-IN', 'Malayalam (India)', 'മലയാളം (ഇന്ത്യ)'],
    ['mr-IN', 'Marathi (India)', 'मराठी (भारत)'],
    ['nl-NL', 'Dutch (Netherlands)', 'Nederlands (Nederland)'],
    ['ne-NP', 'Nepali (Nepal)', 'नेपाली (नेपाल)'],
    ['nb-NO', 'Norwegian Bokmål (Norway)', 'Norsk bokmål (Norge)'],
    ['pl-PL', 'Polish (Poland)', 'Polski (Polska)'],
    ['pt-BR', 'Portuguese (Brazil)', 'Português (Brasil)'],
    ['pt-PT', 'Portuguese (Portugal)', 'Português (Portugal)'],
    ['ro-RO', 'Romanian (Romania)', 'Română (România)'],
    ['si-LK', 'Sinhala (Sri Lanka)', 'සිංහල (ශ්රී ලංකාව)'],
    ['sk-SK', 'Slovak (Slovakia)', 'Slovenčina (Slovensko)'],
    ['sl-SI', 'Slovenian (Slovenia)', 'Slovenščina (Slovenija)'],
    ['su-ID', 'Sundanese (Indonesia)', 'Urang (Indonesia)'],
    ['sw-TZ', 'Swahili (Tanzania)', 'Swahili (Tanzania)'],
    ['sw-KE', 'Swahili (Kenya)', 'Swahili (Kenya)'],
    ['fi-FI', 'Finnish (Finland)', 'Suomi (Suomi)'],
    ['sv-SE', 'Swedish (Sweden)', 'Svenska (Sverige)'],
    ['ta-IN', 'Tamil (India)', 'தமிழ் (இந்தியா)'],
    ['ta-SG', 'Tamil (Singapore)', 'தமிழ் (சிங்கப்பூர்)'],
    ['ta-LK', 'Tamil (Sri Lanka)', 'தமிழ் (இலங்கை)'],
    ['ta-MY', 'Tamil (Malaysia)', 'தமிழ் (மலேசியா)'],
    ['te-IN', 'Telugu (India)', 'తెలుగు (భారతదేశం)'],
    ['vi-VN', 'Vietnamese (Vietnam)', 'Tiếng Việt (Việt Nam)'],
    ['tr-TR', 'Turkish (Turkey)', 'Türkçe (Türkiye)'],
    ['ur-PK', 'Urdu (Pakistan)', 'اردو (پاکستان)'],
    ['ur-IN', 'Urdu (India)', 'اردو (بھارت)'],
    ['el-GR', 'Greek (Greece)', 'Ελληνικά (Ελλάδα)'],
    ['bg-BG', 'Bulgarian (Bulgaria)', 'Български (България)'],
    ['ru-RU', 'Russian (Russia)', 'Русский (Россия)'],
    ['sr-RS', 'Serbian (Serbia)', 'Српски (Србија)'],
    ['uk-UA', 'Ukrainian (Ukraine)', 'Українська (Україна)'],
    ['he-IL', 'Hebrew (Israel)', 'עברית (ישראל)'],
    ['ar-IL', 'Arabic (Israel)', 'العربية (إسرائيل)'],
    ['ar-JO', 'Arabic (Jordan)', 'العربية (الأردن)'],
    ['ar-AE', 'Arabic (United Arab Emirates)', 'العربية (الإمارات)'],
    ['ar-BH', 'Arabic (Bahrain)', 'العربية (البحرين)'],
    ['ar-DZ', 'Arabic (Algeria)', 'العربية (الجزائر)'],
    ['ar-SA', 'Arabic (Saudi Arabia)', 'العربية (السعودية)'],
    ['ar-IQ', 'Arabic (Iraq)', 'العربية (العراق)'],
    ['ar-KW', 'Arabic (Kuwait)', 'العربية (الكويت)'],
    ['ar-MA', 'Arabic (Morocco)', 'العربية (المغرب)'],
    ['ar-TN', 'Arabic (Tunisia)', 'العربية (تونس)'],
    ['ar-OM', 'Arabic (Oman)', 'العربية (عُمان)'],
    ['ar-PS', 'Arabic (State of Palestine)', 'العربية (فلسطين)'],
    ['ar-QA', 'Arabic (Qatar)', 'العربية (قطر)'],
    ['ar-LB', 'Arabic (Lebanon)', 'العربية (لبنان)'],
    ['ar-EG', 'Arabic (Egypt)', 'العربية (مصر)'],
    ['fa-IR', 'Persian (Iran)', 'فارسی (ایران)'],
    ['hi-IN', 'Hindi (India)', 'हिन्दी (भारत)'],
    ['th-TH', 'Thai (Thailand)', 'ไทย (ประเทศไทย)'],
    ['ko-KR', 'Korean (South Korea)', '한국어 (대한민국)'],
    ['zh-TW', 'Chinese, Mandarin (Traditional, Taiwan)', '國語 (台灣)'],
    ['yue-Hant-HK', 'Chinese, Cantonese (Traditional, Hong Kong)', '廣東話 (香港)'],
    ['ja-JP', 'Japanese (Japan)', '日本語（日本）'],
    ['zh-HK', 'Chinese, Mandarin (Simplified, Hong Kong)', '普通話 (香港)'],
    ['zh-CN', 'Chinese, Mandarin (Simplified, China)', '普通话 (中国大陆)'],
];

const outputVoices = [
    ['af-ZA', 'Afrikaans (South Africa)', 'Afrikaans (Suid-Afrika)'],
    ['sq-AL', 'Albanian (Albania)', 'Shqip (Shqipëria)'],
    // ['am-ET', 'Amharic (Ethiopia)', 'አማርኛ (ኢትዮጵያ)'],
    // ['ar-XA', 'Arabic', 'العربية'],
    ['ar-SA', 'Arabic (Saudi Arabia)', 'العربية (السعودية)'],
    // ['hy-AM', 'Armenian (Armenia)', 'Հայերեն (Հայաստան)'],
    // ['as-IN', 'Assamese (India)', 'অসমীয়া (ভাৰত)'],
    // ['az-AZ', 'Azerbaijani (Azerbaijan)', 'Azərbaycan (Azərbaycan)'],
    ['id-ID', 'Indonesian (Indonesia)', 'Bahasa Indonesia (Indonesia)'],
    ['ms-MY', 'Malay (Malaysia)', 'Bahasa Melayu (Malaysia)'],
    ['bn-BD', 'Bengali (Bangladesh)', 'বাংলা (বাংলাদেশ)'],
    ['bn-IN', 'Bengali (India)', 'বাংলা (ভারত)'],
    ['bs-Latn-BA', 'Bosnian (Bosnia)', 'bosanski (Bosna)'],
    ['bg-BG', 'Bulgarian (Bulgaria)', 'Български (България)'],
    ['ca-ES', 'Catalan (Spain)', 'Català (Espanya)'],
    ['cs-CZ', 'Czech (Czech Republic)', 'Čeština (Česká republika)'],
    ['da-DK', 'Danish (Denmark)', 'Dansk (Danmark)'],
    ['de-DE', 'German (Germany)', 'Deutsch (Deutschland)'],
    ['en-AU', 'English (Australia)', 'English (Australia)'],
    ['en-GB', 'English (United Kingdom)', 'English (Great Britain)'],
    ['en-IN', 'English (India)', 'English (India)'],
    ['en-NZ', 'English (New Zealand)', 'English (New Zealand)'],
    ['en-US', 'English (United States)', 'English (United States)'],
    ['es-ES', 'Spanish (Spain)', 'Español (España)'],
    ['es-US', 'Spanish (United States)', 'Español (Estados Unidos)'],
    ['et-EE', 'Estonian (Estonia)', 'Eesti (Eesti)'],
    ['fil-PH', 'Filipino (Philippines)', 'Filipino (Pilipinas)'],
    ['fr-CA', 'French (Canada)', 'Français (Canada)'],
    ['fr-FR', 'French (France)', 'Français (France)'],
    // ['gl-ES', 'Galician (Spain)', 'Galego (España)'],
    // ['ka-GE', 'Georgian (Georgia)', 'ქართული (საქართველო)'],
    ['gu-IN', 'Gujarati (India)', 'ગુજરાતી (ભારત)'],
    ['he-IL', 'Hebrew (Israel)', 'עברית (ישראל)'],
    ['hr-HR', 'Croatian (Croatia)', 'Hrvatski (Hrvatska)'],
    // ['zu-ZA', 'Zulu (South Africa)', 'IsiZulu (Ningizimu Afrika)'],
    ['is-IS', 'Icelandic (Iceland)', 'Íslenska (Ísland)'],
    ['it-IT', 'Italian (Italy)', 'Italiano (Italia)'],
    ['jv-ID', 'Javanese (Indonesia)', 'Jawa (Indonesia)'],
    ['kn-IN', 'Kannada (India)', 'ಕನ್ನಡ (ಭಾರತ)'],
    ['km-KH', 'Khmer (Cambodia)', 'ភាសាខ្មែរ (កម្ពុជា)'],
    // ['lo-LA', 'Lao (Laos)', 'ລາວ (ລາວ)'],
    ['la-VA', 'Latin (Vatican City)', 'Latina (Civitas Vaticana)'],
    ['lv-LV', 'Latvian (Latvia)', 'Latviešu (latviešu)'],
    // ['lt-LT', 'Lithuanian (Lithuania)', 'Lietuvių (Lietuva)'],
    ['hu-HU', 'Hungarian (Hungary)', 'Magyar (Magyarország)'],
    ['ml-IN', 'Malayalam (India)', 'മലയാളം (ഇന്ത്യ)'],
    ['mr-IN', 'Marathi (India)', 'मराठी (भारत)'],
    ['my-MM', 'Burmese (Myanmar)', 'မြန်မာ (မြန်မာ)'],
    ['nl-NL', 'Dutch (Netherlands)', 'Nederlands (Nederland)'],
    ['ne-NP', 'Nepali (Nepal)', 'नेपाली (नेपाल)'],
    ['nb-NO', 'Norwegian Bokmål (Norway)', 'Norsk bokmål (Norge)'],
    ['pl-PL', 'Polish (Poland)', 'Polski (Polska)'],
    ['pt-BR', 'Portuguese (Brazil)', 'Português (Brasil)'],
    ['pt-PT', 'Portuguese (Portugal)', 'Português (Portugal)'],
    ['ro-RO', 'Romanian (Romania)', 'Română (România)'],
    ['si-LK', 'Sinhala (Sri Lanka)', 'සිංහල (ශ්රී ලංකාව)'],
    ['sk-SK', 'Slovak (Slovakia)', 'Slovenčina (Slovensko)'],
    // ['sl-SI', 'Slovenian (Slovenia)', 'Slovenščina (Slovenija)'],
    ['su-ID', 'Sundanese (Indonesia)', 'Urang (Indonesia)'],
    ['sw-TZ', 'Swahili (Tanzania)', 'Swahili (Tanzania)'],
    ['fi-FI', 'Finnish (Finland)', 'Suomi (Suomi)'],
    ['sv-SE', 'Swedish (Sweden)', 'Svenska (Sverige)'],
    ['tl-PH', 'Tagalog (Philippines)', 'Tagalog (Pilipinas)'],
    ['ta-IN', 'Tamil (India)', 'தமிழ் (இந்தியா)'],
    ['te-IN', 'Telugu (India)', 'తెలుగు (భారతదేశం)'],
    ['vi-VN', 'Vietnamese (Vietnam)', 'Tiếng Việt (Việt Nam)'],
    ['tr-TR', 'Turkish (Turkey)', 'Türkçe (Türkiye)'],
    ['el-GR', 'Greek (Greece)', 'Ελληνικά (Ελλάδα)'],
    ['bg-BG', 'Bulgarian (Bulgaria)', 'Български (България)'],
    ['ru-RU', 'Russian (Russia)', 'Русский (Россия)'],
    ['sr-RS', 'Serbian (Serbia)', 'Српски (Србија)'],
    ['uk-UA', 'Ukrainian (Ukraine)', 'Українська (Україна)'],
    ['ur-IN', 'Urdu (India)', 'اردو (بھارت)'],
    ['ur-PK', 'Urdu (Pakistan)', 'اردو (پاکستان)'],
    // ['fa-IR', 'Persian (Iran)', 'فارسی (ایران)'],
    ['hi-IN', 'Hindi (India)', 'हिन्दी (भारत)'],
    ['th-TH', 'Thai (Thailand)', 'ไทย (ประเทศไทย)'],
    ['ko-KR', 'Korean (South Korea)', '한국어 (대한민국)'],
    ['zh-TW', 'Chinese, Mandarin (Traditional, Taiwan)', '國語 (台灣)'],
    ['ja-JP', 'Japanese (Japan)', '日本語（日本）'],
    ['zh-HK', 'Chinese, Mandarin (Simplified, Hong Kong)', '普通話 (香港)'],
    ['zh-CN', 'Chinese, Mandarin (Simplified, China)', '普通话 (中国大陆)'],
];

const rvVoicesEnabled = true;
const rvVoices = [
    ['en-GB&gender=female', 'English UK Female'],
    ['en-GB&gender=male', 'English UK Male'],
    ['en-US&gender=female', 'English US Female'],
    ['en-US&gender=male', 'English US Male'],
    ['ar-SA&gender=male', 'Arabic Male'],
    ['ar-SA&gender=female', 'Arabic Female'],
    ['hy-AM&gender=male', 'Armenian Male'],
    ['en-AU&gender=female', 'Australian Female'],
    ['en-AU&gender=male', 'Australian Male'],
    ['bn-BD&gender=female', 'Bangla Bangladesh Female'],
    ['bn-BD&gender=male', 'Bangla Bangladesh Male'],
    ['bn-IN&gender=female', 'Bangla India Female'],
    ['bn-IN&gender=male', 'Bangla India Male'],
    ['pt-BR&gender=female', 'Brazilian Portuguese Female'],
    ['pt-BR&gender=male', 'Brazilian Portuguese Male'],
    ['zh&gender=female', 'Chinese Female'],
    ['zh&gender=male', 'Chinese Male'],
    ['zh-HK&gender=female', 'Chinese (Hong Kong) Female'],
    ['zh-HK&gender=male', 'Chinese (Hong Kong) Male'],
    ['zh-TW&gender=female', 'Chinese Taiwan Female'],
    ['zh-TW&gender=male', 'Chinese Taiwan Male'],
    ['cs-CZ&gender=female', 'Czech Female'],
    ['cs-CZ&gender=male', 'Czech Male'],
    ['da-DK&gender=female', 'Danish Female'],
    ['da-DK&gender=male', 'Danish Male'],
    ['de-DE&gender=female', 'Deutsch Female'],
    ['de-DE&gender=male', 'Deutsch Male'],
    ['nl-NL&gender=female', 'Dutch Female'],
    ['nl-NL&gender=male', 'Dutch Male'],
    ['et&gender=male', 'Estonian Male'],
    ['fil-PH&gender=female', 'Filipino Female'],
    ['fi-FI&gender=female', 'Finnish Female'],
    ['fi-FI&gender=male', 'Finnish Male'],
    ['fr-CA&gender=female', 'French Female'],
    ['fr-CA&gender=male', 'French Male'],
    ['fr-CA&gender=female', 'French Canadian Female'],
    ['fr-CA&gender=male', 'French Canadian Male'],
    ['el-GR&gender=female', 'Greek Female'],
    ['el-GR&gender=male', 'Greek Male'],
    ['hi-IN&gender=female', 'Hindi Female'],
    ['hi-IN&gender=male', 'Hindi Male'],
    ['hu-HU&gender=female', 'Hungarian Female'],
    ['hu-HU&gender=male', 'Hungarian Male'],
    ['id-ID&gender=female', 'Indonesian Female'],
    ['id-ID&gender=male', 'Indonesian Male'],
    ['it-IT&gender=female', 'Italian Female'],
    ['it-IT&gender=male', 'Italian Male'],
    ['ja-JP&gender=female', 'Japanese Female'],
    ['ja-JP&gender=male', 'Japanese Male'],
    ['ko-KR&gender=female', 'Korean Female'],
    ['ko-KR&gender=male', 'Korean Male'],
    ['la&gender=male', 'Latin Male'],
    ['ne-NP&gender=female', 'Nepali'],
    ['nb-NO&gender=female', 'Norwegian Female'],
    ['nb-NO&gender=male', 'Norwegian Male'],
    ['pl-PL&gender=female', 'Polish Female'],
    ['pl-PL&gender=male', 'Polish Male'],
    ['pt-BR&gender=female', 'Portuguese Female'],
    ['pt-BR&gender=male', 'Portuguese Male'],
    ['ro-RO&gender=female', 'Romanian Female'],
    ['ru-RU&gender=female', 'Russian Female'],
    ['ru-RU&gender=male', 'Russian Male'],
    ['si-LK&gender=female', 'Sinhala'],
    ['sk-SK&gender=female', 'Slovak Female'],
    ['sk-SK&gender=male', 'Slovak Male'],
    ['es-ES&gender=female', 'Spanish Female'],
    ['es-ES&gender=male', 'Spanish Male'],
    ['es-US&gender=female', 'Spanish Latin American Female'],
    ['es-US&gender=male', 'Spanish Latin American Male'],
    ['sv-SE&gender=female', 'Swedish Female'],
    ['sv-SE&gender=male', 'Swedish Male'],
    ['ta-IN&gender=female', 'Tamil Female'],
    ['ta-IN&gender=male', 'Tamil Male'],
    ['th-TH&gender=female', 'Thai Female'],
    ['th-TH&gender=male', 'Thai Male'],
    ['tr-TR&gender=female', 'Turkish Female'],
    ['tr-TR&gender=male', 'Turkish Male'],
    ['uk-UA&gender=female', 'Ukrainian Female'],
    ['vi-VN&gender=female', 'Vietnamese Female'],
    ['vi-VN&gender=male', 'Vietnamese Male'],
    ['af-ZA&gender=male', 'Afrikaans Male'],
    ['sq&gender=male', 'Albanian Male'],
    ['sr-BA&gender=male', 'Bosnian Male'],
    ['ca-ES&gender=male', 'Catalan Male'],
    ['hr-HR&gender=male', 'Croatian Male'],
    ['eo&gender=male', 'Esperanto Male'],
    ['is-IS&gender=male', 'Icelandic Male'],
    ['lv-LV&gender=male', 'Latvian Male'],
    ['mk&gender=male', 'Macedonian Male'],
    ['sr-RS&gender=male', 'Serbian Male'],
    ['hr-HR&gender=male', 'Serbo-Croatian Male'],
    ['sw-TZ&gender=male', 'Swahili Male'],
    ['cy&gender=male', 'Welsh Male'],
];

const seVoices = [
    ['tr-TR:Filiz', 'Filiz (Turkish Female)'],
    ['sv-SE:Astrid', 'Astrid (Swedish Female)'],
    ['ru-RU:Tatyana', 'Tatyana (Russian Female)'],
    ['ru-RU:Maxim', 'Maxim (Russian Male)'],
    ['ro-RO:Carmen', 'Carmen (Romanian Female)'],
    ['pt-PT:Ines', 'Ines (Portuguese Female)'],
    ['pt-PT:Cristiano', 'Cristiano (Portuguese Male)'],
    ['pt-BR:Vitoria', 'Vitoria (Brazilian Portuguese Female)'],
    ['pt-BR:Ricardo', 'Ricardo (Brazilian Portuguese Male)'],
    ['pl-PL:Maja', 'Maja (Polish Female)'],
    ['pl-PL:Jan', 'Jan (Polish Male)'],
    ['pl-PL:Jacek', 'Jacek (Polish Male)'],
    ['pl-PL:Ewa', 'Ewa (Polish Female)'],
    ['nl-NL:Ruben', 'Ruben (Dutch Male)'],
    ['nl-NL:Lotte', 'Lotte (Dutch Female)'],
    ['nb-NO:Liv', 'Liv (Norwegian Female)'],
    ['ko-KR:Seoyeon', 'Seoyeon (Korean Female)'],
    ['ja-JP:Takumi', 'Takumi (Japanese Male)'],
    ['ja-JP:Mizuki', 'Mizuki (Japanese Female)'],
    ['it-IT:Giorgio', 'Giorgio (Italian Male)'],
    ['it-IT:Carla', 'Carla (Italian Female)'],
    ['it-IT:Bianca', 'Bianca (Italian Female)'],
    ['is-IS:Karl', 'Karl (Icelandic Male)'],
    ['is-IS:Dora', 'Dora (Icelandic Female)'],
    ['fr-FR:Mathieu', 'Mathieu (French Male)'],
    ['fr-FR:Celine', 'Celine (French Female)'],
    ['fr-CA:Chantal', 'Chantal (Canadian French Female)'],
    ['es-US:Penelope', 'Penelope (US Spanish Female)'],
    ['es-US:Miguel', 'Miguel (US Spanish Male)'],
    ['es-MX:Mia', 'Mia (Mexican Spanish Female)'],
    ['es-ES:Enrique', 'Enrique (Spanish Male)'],
    ['es-ES:Conchita', 'Conchita (Spanish Female)'],
    ['en-GB:Geraint', 'Geraint (Welsh English Male)'],
    ['en-US:Salli', 'Salli (US English Female)'],
    ['en-US:Matthew', 'Matthew (US English Male)'],
    ['en-US:Kimberly', 'Kimberly (US English Female)'],
    ['en-US:Kendra', 'Kendra (US English Female)'],
    ['en-US:Justin', 'Justin (US English Male Child)'],
    ['en-US:Joey', 'Joey (US English Male)'],
    ['en-US:Joanna', 'Joanna (US English Female)'],
    ['en-US:Ivy', 'Ivy (US English Female Child)'],
    ['en-IN:Raveena', 'Raveena (Indian English Female)'],
    ['en-IN:Aditi', 'Aditi (Indian English Male)'],
    ['en-GB:Emma', 'Emma (British English Female)'],
    ['en-GB:Brian', 'Brian (British English Male)'],
    ['en-GB:Amy', 'Amy (British English Female)'],
    ['en-AU:Russell', 'Russell (Australian English Male)'],
    ['en-AU:Nicole', 'Nicole (Australian English Female)'],
    ['de-DE:Vicki', 'Vicki (Deutsch Female)'],
    ['de-DE:Marlene', 'Marlene (Deutsch Female)'],
    ['de-DE:Hans', 'Hans (Deutsch Male)'],
    ['da-DK:Naja', 'Naja (Danish Female)'],
    ['da-DK:Mads', 'Mads (Danish Male)'],
    ['cy-GB:Gwyneth', 'Gwyneth (Welsh Female)'],
    ['zh-CN:Zhiyu', 'Zhiyu (Mandarin Chinese Female)'],
    // ['zh-HK:Tracy', 'Tracy (Hong Kong Chinese Female)'],
    // ['zh-HK:Danny', 'Danny (Hong Kong Chinese Male)'],
    // ['zh-CN:Huihui', 'Huihui (Mandarin Chinese Female)'],
    // ['zh-CN:Yaoyao', 'Yaoyao (Mandarin Chinese Female)'],
    // ['zh-CN:Kangkang', 'Kangkang (Mandarin Chinese Male)'],
    // ['zh-TW:HanHan', 'HanHan (Taiwan Chinese Female)'],
    // ['zh-TW:Zhiwei', 'Zhiwei (Taiwan Chinese Male)'],
    // ['he-IL:Asaf', 'Asaf (Hebrew Male)'],
    // ['vi-VN:An', 'An (Vietnamese Male)'],
    // ['el-GR:Stefanos', 'Stefanos (Greek Male)'],
    // ['sk-SK:Filip', 'Filip (Slovak Male)'],
    // ['bg-BG:Ivan', 'Ivan (Bulgarian Male)'],
    // ['fi-FI:Heidi', 'Heidi (Finnish Female)'],
    // ['ca-ES:Herena', 'Herena (Catalan Female)'],
    // ['hi-IN:Kalpana', 'Kalpana (Hindi Female)'],
    // ['hi-IN:Hemant', 'Hemant (Hindi Male)'],
    // ['hr-HR:Matej', 'Matej (Croatian Male)'],
    // ['id-ID:Andika', 'Andika (Indonesian Male)'],
    // ['ms-MY:Rizwan', 'Rizwan (Malaysian Male)'],
    // ['sl-SI:Lado', 'Lado (Slovenian Male)'],
    // ['ta-IN:Valluvar', 'Valluvar (Tamil Male)'],
    // ['en-CA:Linda', 'Linda (Canadian English Female)'],
    // ['en-CA:Heather', 'Heather (Canadian English Female)'],
    // ['en-IE:Sean', 'Sean (Irish English Male)'],
    // ['de-AT:Michael', 'Michael (Austrian German Male)'],
    // ['de-CH:Karsten', 'Karsten (Swiss German Male)'],
    // ['fr-CH:Guillaume', 'Guillaume (Swiss French Male)'],
    // ['th-TH:Pattara', 'Pattara (Thai Male)'],
    // ['cs-CZ:Jakub', 'Jakub (Czech Male)'],
    // ['hu-HU:Szabolcs', 'Szabolcs (Hungarian Male)'],
    // ['ar-EG:Hoda', 'Hoda (Arabic Female)'],
    // ['ar-SA:Naayf', 'Naayf (Saudi Arabian Arabic Male)'],
];

const seVoices2 = [
    // ['es-LA:es-LA_SofiaVoice', 'es-LA_SofiaVoice (Spanish)'],
    // ['pt-BR:pt-BR_IsabelaVoice', 'pt-BR_IsabelaVoice (Brazilian Portuguese)'],
    // ['en-US:en-US_MichaelVoice', 'en-US_MichaelVoice (US English)'],
    // ['ja-JP:ja-JP_EmiVoice', 'ja-JP_EmiVoice (Japanese)'],
    // ['en-US:en-US_AllisonVoice', 'en-US_AllisonVoice (US English)'],
    // ['fr-FR:fr-FR_ReneeVoice', 'fr-FR_ReneeVoice (French)'],
    // ['it-IT:it-IT_FrancescaVoice', 'it-IT_FrancescaVoice (Italian)'],
    // ['es-ES:es-ES_LauraVoice', 'es-ES_LauraVoice (Spanish)'],
    // ['de-DE:de-DE_BirgitVoice', 'de-DE_BirgitVoice (Deutsch)'],
    // ['es-ES:es-ES_EnriqueVoice', 'es-ES_EnriqueVoice (Spanish)'],
    // ['de-DE:de-DE_DieterVoice', 'de-DE_DieterVoice (Deutsch)'],
    // ['en-US:en-US_LisaVoice', 'en-US_LisaVoice (US English)'],
    // ['en-GB:en-GB_KateVoice', 'en-GB_KateVoice (British English)'],
    // ['es-US:es-US_SofiaVoice', 'es-US_SofiaVoice (US Spanish)'],
    ['es-ES:es-ES-Standard-A', 'es-ES-Standard-A (Spanish)'],
    ['it-IT:it-IT-Standard-A', 'it-IT-Standard-A (Italian)'],
    ['it-IT:it-IT-Wavenet-A', 'it-IT-Wavenet-A (Italian)'],
    ['ja-JP:ja-JP-Standard-A', 'ja-JP-Standard-A (Japanese)'],
    ['ja-JP:ja-JP-Wavenet-A', 'ja-JP-Wavenet-A (Japanese)'],
    ['ko-KR:ko-KR-Standard-A', 'ko-KR-Standard-A (Korean)'],
    ['ko-KR:ko-KR-Wavenet-A', 'ko-KR-Wavenet-A (Korean)'],
    ['pt-BR:pt-BR-Standard-A', 'pt-BR-Standard-A (Brazilian Portuguese)'],
    ['tr-TR:tr-TR-Standard-A', 'tr-TR-Standard-A (Turkish)'],
    ['sv-SE:sv-SE-Standard-A', 'sv-SE-Standard-A (Swedish)'],
    ['nl-NL:nl-NL-Standard-A', 'nl-NL-Standard-A (Dutch)'],
    ['nl-NL:nl-NL-Wavenet-A', 'nl-NL-Wavenet-A (Dutch)'],
    ['en-US:en-US-Wavenet-A', 'en-US-Wavenet-A (US English)'],
    ['en-US:en-US-Wavenet-B', 'en-US-Wavenet-B (US English)'],
    ['en-US:en-US-Wavenet-C', 'en-US-Wavenet-C (US English)'],
    ['en-US:en-US-Wavenet-D', 'en-US-Wavenet-D (US English)'],
    ['en-US:en-US-Wavenet-E', 'en-US-Wavenet-E (US English)'],
    ['en-US:en-US-Wavenet-F', 'en-US-Wavenet-F (US English)'],
    ['en-GB:en-GB-Standard-A', 'en-GB-Standard-A (British English)'],
    ['en-GB:en-GB-Standard-B', 'en-GB-Standard-B (British English)'],
    ['en-GB:en-GB-Standard-C', 'en-GB-Standard-C (British English)'],
    ['en-GB:en-GB-Standard-D', 'en-GB-Standard-D (British English)'],
    ['en-GB:en-GB-Wavenet-A', 'en-GB-Wavenet-A (British English)'],
    ['en-GB:en-GB-Wavenet-B', 'en-GB-Wavenet-B (British English)'],
    ['en-GB:en-GB-Wavenet-C', 'en-GB-Wavenet-C (British English)'],
    ['en-GB:en-GB-Wavenet-D', 'en-GB-Wavenet-D (British English)'],
    ['en-US:en-US-Standard-B', 'en-US-Standard-B (US English)'],
    ['en-US:en-US-Standard-C', 'en-US-Standard-C (US English)'],
    ['en-US:en-US-Standard-D', 'en-US-Standard-D (US English)'],
    ['en-US:en-US-Standard-E', 'en-US-Standard-E (US English)'],
    ['de-DE:de-DE-Standard-A', 'de-DE-Standard-A (Deutsch)'],
    ['de-DE:de-DE-Standard-B', 'de-DE-Standard-B (Deutsch)'],
    ['de-DE:de-DE-Wavenet-A', 'de-DE-Wavenet-A (Deutsch)'],
    ['de-DE:de-DE-Wavenet-B', 'de-DE-Wavenet-B (Deutsch)'],
    ['de-DE:de-DE-Wavenet-C', 'de-DE-Wavenet-C (Deutsch)'],
    ['de-DE:de-DE-Wavenet-D', 'de-DE-Wavenet-D (Deutsch)'],
    ['en-AU:en-AU-Standard-A', 'en-AU-Standard-A (Australian English)'],
    ['en-AU:en-AU-Standard-B', 'en-AU-Standard-B (Australian English)'],
    ['en-AU:en-AU-Wavenet-A', 'en-AU-Wavenet-A (Australian English)'],
    ['en-AU:en-AU-Wavenet-B', 'en-AU-Wavenet-B (Australian English)'],
    ['en-AU:en-AU-Wavenet-C', 'en-AU-Wavenet-C (Australian English)'],
    ['en-AU:en-AU-Wavenet-D', 'en-AU-Wavenet-D (Australian English)'],
    ['en-AU:en-AU-Standard-C', 'en-AU-Standard-C (Australian English)'],
    ['en-AU:en-AU-Standard-D', 'en-AU-Standard-D (Australian English)'],
    ['fr-CA:fr-CA-Standard-A', 'fr-CA-Standard-A (Canadian French)'],
    ['fr-CA:fr-CA-Standard-B', 'fr-CA-Standard-B (Canadian French)'],
    ['fr-CA:fr-CA-Standard-C', 'fr-CA-Standard-C (Canadian French)'],
    ['fr-CA:fr-CA-Standard-D', 'fr-CA-Standard-D (Canadian French)'],
    ['fr-FR:fr-FR-Standard-C', 'fr-FR-Standard-C (French)'],
    ['fr-FR:fr-FR-Standard-D', 'fr-FR-Standard-D (French)'],
    ['fr-FR:fr-FR-Wavenet-A', 'fr-FR-Wavenet-A (French)'],
    ['fr-FR:fr-FR-Wavenet-B', 'fr-FR-Wavenet-B (French)'],
    ['fr-FR:fr-FR-Wavenet-C', 'fr-FR-Wavenet-C (French)'],
    ['fr-FR:fr-FR-Wavenet-D', 'fr-FR-Wavenet-D (French)'],
    ['da-DK:da-DK-Wavenet-A', 'da-DK-Wavenet-A (Danish)'],
    ['pl-PL:pl-PL-Wavenet-A', 'pl-PL-Wavenet-A (Polish)'],
    ['pl-PL:pl-PL-Wavenet-B', 'pl-PL-Wavenet-B (Polish)'],
    ['pl-PL:pl-PL-Wavenet-C', 'pl-PL-Wavenet-C (Polish)'],
    ['pl-PL:pl-PL-Wavenet-D', 'pl-PL-Wavenet-D (Polish)'],
    ['pt-PT:pt-PT-Wavenet-A', 'pt-PT-Wavenet-A (Portuguese)'],
    ['pt-PT:pt-PT-Wavenet-B', 'pt-PT-Wavenet-B (Portuguese)'],
    ['pt-PT:pt-PT-Wavenet-C', 'pt-PT-Wavenet-C (Portuguese)'],
    ['pt-PT:pt-PT-Wavenet-D', 'pt-PT-Wavenet-D (Portuguese)'],
    ['ru-RU:ru-RU-Wavenet-A', 'ru-RU-Wavenet-A (Russian)'],
    ['ru-RU:ru-RU-Wavenet-B', 'ru-RU-Wavenet-B (Russian)'],
    ['ru-RU:ru-RU-Wavenet-C', 'ru-RU-Wavenet-C (Russian)'],
    ['ru-RU:ru-RU-Wavenet-D', 'ru-RU-Wavenet-D (Russian)'],
    ['sk-SK:sk-SK-Wavenet-A', 'sk-SK-Wavenet-A (Slovak)'],
    ['tr-TR:tr-TR-Wavenet-A', 'tr-TR-Wavenet-A (Turkish)'],
    ['tr-TR:tr-TR-Wavenet-B', 'tr-TR-Wavenet-B (Turkish)'],
    ['tr-TR:tr-TR-Wavenet-C', 'tr-TR-Wavenet-C (Turkish)'],
    ['tr-TR:tr-TR-Wavenet-D', 'tr-TR-Wavenet-D (Turkish)'],
    ['tr-TR:tr-TR-Wavenet-E', 'tr-TR-Wavenet-E (Turkish)'],
    ['uk-UA:uk-UA-Wavenet-A', 'uk-UA-Wavenet-A (Ukrainian)'],
    ['ar-XA:ar-XA-Wavenet-A', 'ar-XA-Wavenet-A (Arabic)'],
    ['ar-XA:ar-XA-Wavenet-B', 'ar-XA-Wavenet-B (Arabic)'],
    ['ar-XA:ar-XA-Wavenet-C', 'ar-XA-Wavenet-C (Arabic)'],
    ['cs-CZ:cs-CZ-Wavenet-A', 'cs-CZ-Wavenet-A (Czech)'],
    ['nl-NL:nl-NL-Wavenet-B', 'nl-NL-Wavenet-B (Dutch)'],
    ['nl-NL:nl-NL-Wavenet-C', 'nl-NL-Wavenet-C (Dutch)'],
    ['nl-NL:nl-NL-Wavenet-D', 'nl-NL-Wavenet-D (Dutch)'],
    ['nl-NL:nl-NL-Wavenet-E', 'nl-NL-Wavenet-E (Dutch)'],
    ['en-IN:en-IN-Wavenet-A', 'en-IN-Wavenet-A (Indian English)'],
    ['en-IN:en-IN-Wavenet-B', 'en-IN-Wavenet-B (Indian English)'],
    ['en-IN:en-IN-Wavenet-C', 'en-IN-Wavenet-C (Indian English)'],
    ['fil-PH:fil-PH-Wavenet-A', 'fil-PH-Wavenet-A (Filipino)'],
    ['fi-FI:fi-FI-Wavenet-A', 'fi-FI-Wavenet-A (Finnish)'],
    ['el-GR:el-GR-Wavenet-A', 'el-GR-Wavenet-A (Greek)'],
    ['hi-IN:hi-IN-Wavenet-A', 'hi-IN-Wavenet-A (Hindi)'],
    ['hi-IN:hi-IN-Wavenet-B', 'hi-IN-Wavenet-B (Hindi)'],
    ['hi-IN:hi-IN-Wavenet-C', 'hi-IN-Wavenet-C (Hindi)'],
    ['hu-HU:hu-HU-Wavenet-A', 'hu-HU-Wavenet-A (Hungarian)'],
    ['id-ID:id-ID-Wavenet-A', 'id-ID-Wavenet-A (Indonesian)'],
    ['id-ID:id-ID-Wavenet-B', 'id-ID-Wavenet-B (Indonesian)'],
    ['id-ID:id-ID-Wavenet-C', 'id-ID-Wavenet-C (Indonesian)'],
    ['it-IT:it-IT-Wavenet-B', 'it-IT-Wavenet-B (Italian)'],
    ['it-IT:it-IT-Wavenet-C', 'it-IT-Wavenet-C (Italian)'],
    ['it-IT:it-IT-Wavenet-D', 'it-IT-Wavenet-D (Italian)'],
    ['ja-JP:ja-JP-Wavenet-B', 'ja-JP-Wavenet-B (Japanese)'],
    ['ja-JP:ja-JP-Wavenet-C', 'ja-JP-Wavenet-C (Japanese)'],
    ['ja-JP:ja-JP-Wavenet-D', 'ja-JP-Wavenet-D (Japanese)'],
    ['zh-CN:cmn-CN-Wavenet-A', 'cmn-CN-Wavenet-A (Mandarin Chinese)'],
    ['zh-CN:cmn-CN-Wavenet-B', 'cmn-CN-Wavenet-B (Mandarin Chinese)'],
    ['zh-CN:cmn-CN-Wavenet-C', 'cmn-CN-Wavenet-C (Mandarin Chinese)'],
    ['zh-CN:cmn-CN-Wavenet-D', 'cmn-CN-Wavenet-D (Mandarin Chinese)'],
    ['nb-NO:nb-no-Wavenet-E', 'nb-no-Wavenet-E (Norwegian)'],
    ['nb-NO:nb-no-Wavenet-A', 'nb-no-Wavenet-A (Norwegian)'],
    ['nb-NO:nb-no-Wavenet-B', 'nb-no-Wavenet-B (Norwegian)'],
    ['nb-NO:nb-no-Wavenet-C', 'nb-no-Wavenet-C (Norwegian)'],
    ['nb-NO:nb-no-Wavenet-D', 'nb-no-Wavenet-D (Norwegian)'],
    ['vi-VN:vi-VN-Wavenet-A', 'vi-VN-Wavenet-A (Vietnamese)'],
    ['vi-VN:vi-VN-Wavenet-B', 'vi-VN-Wavenet-B (Vietnamese)'],
    ['vi-VN:vi-VN-Wavenet-C', 'vi-VN-Wavenet-C (Vietnamese)'],
    ['vi-VN:vi-VN-Wavenet-D', 'vi-VN-Wavenet-D (Vietnamese)'],
];

const ttVoices = [
    ["en-US:en_us_001", "US English Female"],
    ["en-US:en_us_002", "Jessie (US English Female)"],
    ["en-US:en_us_006", "Joey (US English Male)"],
    ["en-US:en_us_007", "Professor (US English Male)"],
    ["en-US:en_us_009", "Scientist (US English Male)"],
    ["en-US:en_us_010", "Confident (US English Male)"],
    ["en-GB:en_uk_001", "Narrator (British English Male)"],
    ["en-GB:en_uk_003", "British English Male"],
    ["en-AU:en_au_001", "Metro (Australian English Female)"],
    ["en-AU:en_au_002", "Smooth (Australian English Male)"],
    ["fr-FR:fr_001", "French Male 1"],
    ["fr-FR:fr_002", "French Male 2"],
    ["de-DE:de_001", "German Female"],
    ["de-DE:de_002", "German Male"],
    ["es-ES:es_002", "Spanish Male"],
    ["es-MX:es_mx_002", "Mexican Spanish Male"],
    ["pt-BR:br_001", "Brazilian Portuguese Female 1"],
    ["pt-BR:br_003", "Brazilian Portuguese Female 2"],
    ["pt-BR:br_004", "Brazilian Portuguese Female 3"],
    ["pt-BR:br_005", "Brazilian Portuguese Male"],
    ["id-ID:id_001", "Indonesian Female"],
    ["ja-JP:jp_001", "Japanese Female 1"],
    ["ja-JP:jp_003", "Japanese Female 2"],
    ["ja-JP:jp_005", "Japanese Female 3"],
    ["ja-JP:jp_006", "Japanese Male"],
    ["ko-KR:kr_002", "Korean Male 1"],
    ["ko-KR:kr_003", "Korean Female"],
    ["ko-KR:kr_004", "Korean Male 2"],
    ["en-US:en_us_ghostface", "Ghostface [Scream] (English)"],
    ["en-US:en_us_chewbacca", "Chewbacca [Star Wars] (English)"],
    ["en-US:en_us_c3po", "C3PO [Star Wars] (English)"],
    ["en-US:en_us_stitch", "Stitch [Lilo & Stitch] (English)"],
    ["en-US:en_us_stormtrooper", "Stormtrooper [Star Wars] (English)"],
    ["en-US:en_us_rocket", "Rocket [Guardians of the Galaxy] (English)"],
    ["en-US:en_female_madam_leota", "Madame Leota (English Female)"],
    ["en-US:en_male_ghosthost", "Ghost Host (English Male)"],
    ["en-US:en_male_pirate", "Pirate (English Male)"],
    ["en-US:en_male_wizard", "Wizard (English Male)"],
    ["en-US:en_male_grinch", "Grinch (English Male)"],
    ["en-US:en_male_narration", "Story Teller (English Male)"],
    ["en-US:en_male_funny", "Wacky (English Male)"],
    ["en-US:en_female_emotional", "Peaceful (English Female)"],
    ["en-US:en_female_samc", "Empathetic (English Female)"],
    ["en-US:en_male_cody", "Serious (English Male)"],
    ["en-US:en_female_f08_salut_damour", "Alto (English Female Singing)"],
    ["en-US:en_male_m03_lobby", "Tenor (English Male Singing)"],
    ["en-US:en_male_m03_sunshine_soon", "Sunshine Soon (English Male Singing)"],
    ["en-US:en_female_f08_warmy_breeze", "Warmy Breeze (English Female Singing)"],
    ["en-US:en_female_ht_f08_glorious", "Glorious (English Female Singing)"],
    ["en-US:en_male_sing_funny_it_goes_up", "It Goes Up (English Male Singing)"],
    ["en-US:en_male_m2_xhxs_m03_silly", "Chipmunk (English Male Singing)"],
    ["en-US:en_female_ht_f08_wonderful_world", "Dramatic (English Female Singing)"],
    ["en-US:en_female_ht_f08_halloween", "Halloween (English Female Singing)"],
];

// https://github.com/d4n3436/GTranslate/blob/97dea660453e2fb7ee0fd4f0db32b8efe7b86845/src/GTranslate/LanguageDictionary.cs
const outputLangMapping = {
    "nb-NO": "no",
    "yue-Hant-HK": "zh-TW",
    "zh-TW": "zh-TW",
    "zh-HK": "zh-CN"
}

const outputLangs = [
    ['af', 'Afrikaans (Afrikaans)'],
    ['sq', 'Albanian (Shqip)'],
    ['am', 'Amharic (አማርኛ)'],
    ['ar', 'Arabic (العربية)'],
    ['hy', 'Armenian (Հայերեն)'],
    ['as', 'Assamese (অসমীয়া)'],
    ['ay', 'Aymara (Aymar aru)'],
    ['az', 'Azerbaijani (Azərbaycan)'],
    ['bm', 'Bambara (ߓߊߡߊߣߊ߲ߞߊ߲)'],
    ['eu', 'Basque (Euskara)'],
    ['be', 'Belarusian (беларуская)'],
    ['bn', 'Bengali (বাংলা)'],
    ['bho', 'Bhojpuri (भोजपुरी)'],
    ['bs', 'Bosnian (bosanski)'],
    ['bg', 'Bulgarian (Български)'],
    ['ca', 'Catalan (Català)'],
    ['ceb', 'Cebuano (Binisaya)'],
    ['zh-CN', 'Chinese [Simplified] (简体中文)'],
    ['zh-TW', 'Chinese [Traditional] (繁體中文)'],
    ['co', 'Corsican (Corsu)'],
    ['hr', 'Croatian (Hrvatski)'],
    ['cs', 'Czech (Čeština)'],
    ['da', 'Danish (Dansk)'],
    ['dv', 'Dhivehi (ދިވެހިބަސް)'],
    ['doi', 'Dogri (डोगरी)'],
    ['nl', 'Dutch (Nederlands)'],
    ['en', 'English (English)'],
    ['eo', 'Esperanto (Esperanto)'],
    ['et', 'Estonian (Eesti)'],
    ['ee', 'Ewe (Eʋegbe)'],
    ['fil', 'Filipino [Tagalog] (Filipino)'],
    ['fi', 'Finnish (Suomi)'],
    ['fr', 'French (Français)'],
    ['fy', 'Frisian (Frysk)'],
    ['gl', 'Galician (Galego)'],
    ['ka', 'Georgian (ქართული)'],
    ['de', 'German (Deutsch)'],
    ['el', 'Greek (Ελληνικά)'],
    ['gn', 'Guarani (avañeʼẽ)'],
    ['gu', 'Gujarati (ગુજરાતી)'],
    ['ht', 'Haitian Creole (Kreyòl ayisyen)'],
    ['ha', 'Hausa (Hausa)'],
    ['haw', 'Hawaiian (ʻŌlelo Hawaiʻi)'],
    ['he', 'Hebrew (עברית)'],
    ['hi', 'Hindi (हिन्दी)'],
    ['hmn', 'Hmong (Hmong)'],
    ['hu', 'Hungarian (Magyar)'],
    ['is', 'Icelandic (Íslenska)'],
    ['ig', 'Igbo (Igbo)'],
    ['ilo', 'Ilocano (Iloko)'],
    ['id', 'Indonesian (Indonesia)'],
    ['ga', 'Irish (Gaeilge)'],
    ['it', 'Italian (Italiano)'],
    ['ja', 'Japanese (日本語)'],
    ['jv', 'Javanese (Jawa)'],
    ['kn', 'Kannada (ಕನ್ನಡ)'],
    ['kk', 'Kazakh (Қазақ Тілі)'],
    ['km', 'Khmer (ខ្មែរ)'],
    ['rw', 'Kinyarwanda (Kinyarwanda)'],
    ['gom', 'Konkani (कोंकणी)'],
    ['ko', 'Korean (한국어)'],
    ['kri', 'Krio (Krio)'],
    ['ku', 'Kurdish (Kurdî)'],
    ['ckb', 'Kurdish [Sorani] (کوردیی ناوەندی)'],
    ['ky', 'Kyrgyz (Kyrgyz)'],
    ['lo', 'Lao (ລາວ)'],
    ['la', 'Latin (Latina)'],
    ['lv', 'Latvian (Latviešu)'],
    ['ln', 'Lingala (Lingála)'],
    ['lt', 'Lithuanian (Lietuvių)'],
    ['lg', 'Luganda (Oluganda)'],
    ['lb', 'Luxembourgish (Lëtzebuergesch)'],
    ['mk', 'Macedonian (Македонски)'],
    ['mai', 'Maithili (मैथिली)'],
    ['mg', 'Malagasy (Malagasy)'],
    ['ms', 'Malay (Melayu)'],
    ['ml', 'Malayalam (മലയാളം)'],
    ['mt', 'Maltese (Malti)'],
    ['mi', 'Maori (Te Reo Māori)'],
    ['mr', 'Marathi (मराठी)'],
    ['mni-Mtei', 'Meiteilon [Manipuri] (ꯃꯩꯇꯩꯂꯣꯟ)'],
    ['lus', 'Mizo (Mizo ṭawng)'],
    ['mn', 'Mongolian (Монгол хэл)'],
    ['my', 'Myanmar [Burmese] (မြန်မာ)'],
    ['ne', 'Nepali (नेपाली)'],
    ['no', 'Norwegian (Norsk)'],
    ['ny', 'Nyanja [Chichewa] (Nyanja)'],
    ['or', 'Odia (Oriya) (ଓଡ଼ିଆ)'],
    ['om', 'Oromo (Afaan Oromoo)'],
    ['ps', 'Pashto (پښتو)'],
    ['fa', 'Persian (فارسی)'],
    ['pl', 'Polish (Polski)'],
    ['pt', 'Portuguese [Portugal, Brazil] (Português)'],
    ['pa', 'Punjabi (ਪੰਜਾਬੀ)'],
    ['qu', 'Quechua (Runa simi)'],
    ['ro', 'Romanian (Română)'],
    ['ru', 'Russian (Русский)'],
    ['sm', 'Samoan (Gagana Sāmoa)'],
    ['sa', 'Sanskrit (संस्कृत)'],
    ['gd', 'Scots Gaelic (Gàidhlig)'],
    ['nso', 'Sepedi (Sesotho sa Leboa)'],
    ['sr', 'Serbian (Српски)'],
    ['st', 'Sesotho (Sesotho)'],
    ['sn', 'Shona (chiShona)'],
    ['sd', 'Sindhi (सिन्धी)'],
    ['si', 'Sinhala [Sinhalese] (සිංහල)'],
    ['sk', 'Slovak (Slovenčina)'],
    ['sl', 'Slovenian (Slovenščina)'],
    ['so', 'Somali (Af Soomaali)'],
    ['es', 'Spanish (Español)'],
    ['su', 'Sundanese (Basa Sunda)'],
    ['sw', 'Swahili (Kiswahili)'],
    ['sv', 'Swedish (Svenska)'],
    ['tl', 'Tagalog [Filipino] (Tagalog)'],
    ['tg', 'Tajik (тоҷикӣ)'],
    ['ta', 'Tamil (தமிழ்)'],
    ['tt', 'Tatar (Татар)'],
    ['te', 'Telugu (తెలుగు)'],
    ['th', 'Thai (ไทย)'],
    ['ti', 'Tigrinya (ትግር)'],
    ['ts', 'Tsonga (Xitsonga)'],
    ['tr', 'Turkish (Türkçe)'],
    ['tk', 'Turkmen (Türkmen Dili)'],
    ['ak', 'Twi [Akan] (Ákán)'],
    ['uk', 'Ukrainian (Українська)'],
    ['ur', 'Urdu (اردو)'],
    ['ug', 'Uyghur (ئۇيغۇرچە)'],
    ['uz', 'Uzbek (O\'zbekcha)'],
    ['vi', 'Vietnamese (Tiếng Việt)'],
    ['cy', 'Welsh (Cymraeg)'],
    ['xh', 'Xhosa (isiXhosa)'],
    ['yi', 'Yiddish (ייִדיש)'],
    ['yo', 'Yoruba (Èdè Yorùbá)'],
    ['zu', 'Zulu (Isi-Zulu)'],
];

/*
const builtinLangMapping = {
    'Microsoft David Desktop - English (United States)': [
        'English (United States) [Microsoft David Desktop]',
        'English (United States) [Microsoft David Desktop]',
    ],
    'Microsoft Mark Desktop - English (United States)': [
        'English (United States) [Microsoft Mark Desktop]',
        'English (United States) [Microsoft Mark Desktop]',
    ],
    'Microsoft Zira Desktop - English (United States)': [
        'English (United States) [Microsoft Zira Desktop]',
        'English (United States) [Microsoft Zira Desktop]',
    ],
    'Google Deutsch': [
        'German (Germany) [Google]',
        'Deutsch (Deutschland) [Google]',
    ],
    'Google US English': ['English (US) [Google]', 'English (US) [Google]'],
    'Google UK English Female': [
        'English (UK Female) [Google]',
        'English (UK Female) [Google]',
    ],
    'Google UK English Male': [
        'English (UK Male) [Google]',
        'English (UK Male) [Google]',
    ],
    'Google español': ['Spanish (Spain) [Google]', 'Español (España) [Google]'],
    'Google español de Estados Unidos': [
        'Spanish (United States) [Google]',
        'Español (Estados Unidos) [Google]',
    ],
    'Google français': ['French (France) [Google]', 'Français (France) [Google]'],
    'Google हिन्दी': ['Hindi (India) [Google]', 'हिन्दी (भारत) [Google]'],
    'Google Bahasa Indonesia': [
        'Indonesian (Indonesia) [Google]',
        'Bahasa Indonesia (Indonesia) [Google]',
    ],
    'Google italiano': ['Italian (Italy) [Google]', 'Italiano (Italia) [Google]'],
    'Google 日本語': ['Japanese (Japan) [Google]', '日本語（日本）[Google]'],
    'Google 한국의': [
        'Korean (South Korea) [Google]',
        '한국어 (대한민국) [Google]',
    ],
    'Google Nederlands': [
        'Dutch (Netherlands) [Google]',
        'Nederlands (Nederland) [Google]',
    ],
    'Google polski': ['Polish (Poland) [Google]', 'Polski (Polska) [Google]'],
    'Google português do Brasil': [
        'Portuguese (Brazil) [Google]',
        'Português (Brasil) [Google]',
    ],
    'Google русский': ['Russian (Russia) [Google]', 'Русский (Россия) [Google]'],
    'Google 普通话（中国大陆）': [
        'Chinese, Mandarin (Simplified, China) [Google]',
        '普通话 (中国大陆) [Google]',
    ],
    'Google 粤語（香港）': [
        'Chinese, Cantonese (Traditional, Hong Kong) [Google]',
        '廣東話 (香港) [Google]',
    ],
    'Google 國語（臺灣）': [
        'Chinese, Mandarin (Traditional, Taiwan) [Google]',
        '國語 (台灣) [Google]',
    ],
};
*/

// Sort alphabetical by English name
inputLangs.sort((a, b) => {
    const keyA = a[1];
    const keyB = b[1];
    // Compare the 2 values
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
});

outputVoices.sort((a, b) => {
    const keyA = a[1];
    const keyB = b[1];
    // Compare the 2 values
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
});

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function addVoiceSetDivider() {
    // Divider
    const divider = document.createElement('option');
    divider.value = 'divider';
    divider.text = '';
    outputVoiceSelect.appendChild(divider);
}

function addVoiceSetA() {
    // Header
    const header = document.createElement('option');
    header.value = 'header';
    // header2.text = "🔊 Language Voices"
    header.text = '🔊 Voice Set A [Default]';
    outputVoiceSelect.appendChild(header);

    for (let i = 0; i < outputVoices.length; ++i) {
        const option = document.createElement('option');
        option.value = voiceSetMapping.voiceSetA + outputVoices[i][0];
        option.text = outputVoices[i][1];
        outputVoiceSelect.appendChild(option);
    }
}

function addVoiceSetB() {
    // Header
    const header = document.createElement('option');
    header.value = 'header';
    header.text = '🔊 Voice Set B [Special]';
    outputVoiceSelect.appendChild(header);

    for (let i = 0; i < rvVoices.length; i += 1) {
        const option = document.createElement('option');
        option.value = voiceSetMapping.voiceSetB + rvVoices[i][0];
        option.text = rvVoices[i][1];
        outputVoiceSelect.appendChild(option);
    }
}

function addVoiceSetC() {
    // Header
    const header = document.createElement('option');
    header.value = 'header';
    header.text = '🔊 Voice Set C [StreamElements]';
    outputVoiceSelect.appendChild(header);

    for (let i = 0; i < seVoices.length; i += 1) {
      const option = document.createElement('option');
      option.value = voiceSetMapping.voiceSetC + seVoices[i][0];
      option.text = seVoices[i][1];
      outputVoiceSelect.appendChild(option);
    }
}

function addVoiceSetD() {
    // Header
    const header = document.createElement('option');
    header.value = 'header';
    header.text = '🔊 Voice Set D [WaveNet]';
    outputVoiceSelect.appendChild(header);

    for (let i = 0; i < seVoices2.length; i += 1) {
      const option = document.createElement('option');
      option.value = voiceSetMapping.voiceSetD + seVoices2[i][0];
      option.text = seVoices2[i][1];
      outputVoiceSelect.appendChild(option);
    }
}

function addVoiceSetE() {
    // Header
    const header = document.createElement('option');
    header.value = 'header';
    header.text = '🔊 Voice Set E [TikTok]';
    outputVoiceSelect.appendChild(header);

    for (let i = 0; i < ttVoices.length; i += 1) {
      const option = document.createElement('option');
      option.value = voiceSetMapping.voiceSetE + ttVoices[i][0];
      option.text = ttVoices[i][1];
      outputVoiceSelect.appendChild(option);
    }
}

function addVoiceSetBuiltin() {
    // Header
    const header = document.createElement('option');
    header.value = 'header';
    header.text = "🔊 Built-in Voices"
    outputVoiceSelect.appendChild(header);

    // Speech Synthesis Voices
    const voices = speechSynthesis.getVoices();
    for(i = 0; i < voices.length ; i += 1) {
        const option = document.createElement('option');
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
        option.value = voiceSetMapping.voiceSetS + `${i}:${voices[i].name}`;
        option.text = voices[i].name;
        try {
            // Remap name
            option.text = builtinLangMapping[option.text][0];
        } catch (err) {}
        outputVoiceSelect.appendChild(option);
    }
    speechSynthesis.onvoiceschanged = null;
}

// Fill languages


// Handle mobile touch not always showing dropdown
$('.dropdown-search')
    .dropdown({ fullTextSearch: 'exact', ignoreDiacritics: true, match: 'both' })
    .children(':input.search')
    .on('touchstart', (e) => {
        if (!$(e.target.parentNode).dropdown('is visible')) {
            $(e.target.parentNode).dropdown('show');
            $(e.target).focus();
            $(e.target.parentNode).dropdown({on: 'nothing'});
        }
        e.preventDefault();
    });

let updateLangStorageItems = function() {
    vtsState.inputLangSelect = inputLangSelect.value;
    vtsState.outputVoiceSelect = outputVoiceSelect.value;
    vtsState.outputLangSelect = outputLangSelect.value;

    setStorageItem(storageItemKeys.inputLangSelect, vtsState.inputLangSelect);
    setStorageItem(storageItemKeys.outputVoiceSelect, vtsState.outputVoiceSelect);
    setStorageItem(storageItemKeys.outputLangSelect, vtsState.outputLangSelect);
}

function getLanguageStorageItemsAndUpdate() {
    // Set default lang selections
    inputLangSelect.value = getStringStorageItem(storageItemKeys.inputLangSelect, defaultVtsState.inputLangSelect);
    outputVoiceSelect.value = getStringStorageItem(storageItemKeys.outputVoiceSelect, defaultVtsState.outputVoiceSelect);
    outputLangSelect.value = getStringStorageItem(storageItemKeys.outputLangSelect, defaultVtsState.outputLangSelect);

    if (inputLangSelect.selectedIndex === -1) {
        inputLangSelect.value = defaultVtsState.inputLangSelect;
    }

    if (outputVoiceSelect.selectedIndex === -1) {
        outputVoiceSelect.value = defaultVtsState.outputVoiceSelect;
    }

    if (outputLangSelect.selectedIndex === -1) {
        outputLangSelect.value = defaultVtsState.outputLangSelect;
    }

    updateLangStorageItems();

    setInputLangSelect(inputLangSelect.value);
    setOutputVoiceSelect(outputVoiceSelect.value);
    setOutputLangSelect(outputLangSelect.value);
    checkTranslationDisabled();

    onOutputVoiceChange();
}

function fillLanguages() {
    removeAllChildNodes(inputLangSelect);
    removeAllChildNodes(outputVoiceSelect);
    removeAllChildNodes(outputLangSelect);

    // Input Languages
    for (let i = 0; i < inputLangs.length; i += 1) {
        const option = document.createElement('option');
        option.value = inputLangs[i][0];
        if (inputLangs[i][1] === inputLangs[i][2]) {
            option.text = inputLangs[i][1];
        } else {
            option.text = `${inputLangs[i][1]} [${inputLangs[i][2]}]`;
        }
        inputLangSelect.appendChild(option);
    }

    // Output Languages
    for (let i = 0; i < outputLangs.length; i += 1) {
        const option = document.createElement('option');
        option.value = outputLangs[i][0];
        option.text = outputLangs[i][1];
        outputLangSelect.appendChild(option);
    }

    // Output Voices
    addVoiceSetA();
    addVoiceSetDivider();
    addVoiceSetB();
    addVoiceSetDivider();
    addVoiceSetC();
    addVoiceSetDivider();
    addVoiceSetD();
    addVoiceSetDivider();
    addVoiceSetE();
    
    // Output
    if (speechSynthesis.getVoices()) {
        addVoiceSetDivider();
        addVoiceSetBuiltin();
    }

    getLanguageStorageItemsAndUpdate();
}

const tempOutputVoiceSelect = getStringStorageItem(storageItemKeys.outputVoiceSelect, defaultVtsState.outputVoiceSelect);
fillLanguages();
speechSynthesis.onvoiceschanged = function() {
    // Update in case speech synthesis voices were selected previously
    if (getVoiceSet(tempOutputVoiceSelect) === voiceSetMapping.voiceSetS) {
        setStorageItem(storageItemKeys.outputVoiceSelect, tempOutputVoiceSelect);
    }
    fillLanguages();
};

function getInputLang() {
    return vtsState.inputLangSelect === "" ? defaultVtsState.inputLangSelect : vtsState.inputLangSelect;
}

function getOutputVoice() {
    return vtsState.outputVoiceSelect === "" ? defaultVtsState.outputVoiceSelect : vtsState.outputVoiceSelect;
}

function getOutputLang() {
    return vtsState.outputLangSelect === "" ? defaultVtsState.outputLangSelect : vtsState.outputLangSelect;
}

function getSpeechSynthesisVoice(outputVoice) {
    outputVoice = outputVoice.slice(outputVoice.search(":")+1);
    return speechSynthesis.getVoices().filter(function(voice) { return voice.name == outputVoice; })[0];
}

function isSpacedLang(lang) {
    for (let i = 0; i < nonSpacedLangs.length; i += 1) {
        const nonSpacedLang = nonSpacedLangs[i][0];
        if (lang === nonSpacedLang) {
            return false;
        }
    }
    return true;
}

function matchOutputLang(translationLang, outputLang) {
    let mappedTranslationLang = outputLangMapping[translationLang];
    if (mappedTranslationLang !== undefined) {
        return outputLang === mappedTranslationLang;
    }

    let shortTranslationLang = "";
    if (translationLang.search("-") !== -1) {
        shortTranslationLang = translationLang.slice(0, translationLang.lastIndexOf("-"));
    }

    return outputLang === shortTranslationLang || outputLang === translationLang;
}

function findMatchingOutputLang(translationLang) {
    for (let outputLang of outputLangs) {
        if (matchOutputLang(translationLang, outputLang[0])) {
            return outputLang[0];
        }
    }
    return null;
}

function getSeparateOutputVoice() {
    let outputVoice = getOutputVoice();
    let translationLang = "";
    // const altLang = outputVoice.match(new RegExp(/[a-zA-Z]+-[a-zA-Z]+(?=&)/g));

    let voiceSet = getVoiceSet(outputVoice);
    switch (voiceSet) {
        case voiceSetMapping.voiceSetB:
            outputVoice = outputVoice.slice(1);
            translationLang = outputVoice.slice(0, outputVoice.search("&"));
            break;
        case voiceSetMapping.voiceSetC:
        case voiceSetMapping.voiceSetD:
        case voiceSetMapping.voiceSetE:
            outputVoice = outputVoice.slice(1);
            translationLang = outputVoice.slice(0, outputVoice.search(":"));
            outputVoice = outputVoice.slice(outputVoice.search(":") + 1);
            break;
        case voiceSetMapping.voiceSetS:
            // Device Voices
            outputVoice = outputVoice.slice(outputVoice.search(":") + 1);
            translationLang = outputVoice;
            break;
        default:
            outputVoice = outputVoice.slice(1);
            translationLang = outputVoice;
    }

    return { voiceSet, outputVoice, translationLang };
}

// Set default language / dialect
/*
for (let i = 0; i < langs.length; i++) {
    select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 10;
updateCountry();
select_dialect.selectedIndex = 11;
*/

// Utility helper functions

function roundDecimals(value, decimals) {
    const scale = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * scale) / scale;
}

function wait(timeout) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}

/*
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function reduceSpacing(str) {
    return str.replace(/ +(?= )/g, '');
}
*/

// Init Elements

let volumeSliderActive = false;
let pitchSliderActive = false;
let rateSliderActive = false;

function getSliderStorageItemsAndUpdate() {
    vtsState.volume = getNumericStorageItem(storageItemKeys.volume, defaultVtsState.volume);
    vtsState.rate = getNumericStorageItem(storageItemKeys.rate, defaultVtsState.rate).toFixed(1);
    vtsState.pitch = getNumericStorageItem(storageItemKeys.pitch, defaultVtsState.pitch).toFixed(1);

    initSliders();
}

// Used by mute button
$muteButton.click(() => {
    vtsState.muteEnabled = !getMuteEnabled();
    if (vtsState.muteEnabled) {
        $muteButton.removeClass('up');
        $muteButton.addClass('mute');
        $muteButton.parent().css('margin-left', '0px !important');
        $volumeSlider.css('pointer-events', 'none');
        $volumeThumb.css('background-color', 'lightgray');
        $volumeFill.css('background-color', 'lightgray');
    } else {
        $muteButton.removeClass('mute');
        $muteButton.addClass('up');
        $volumeSlider.css('pointer-events', 'auto');
        $volumeThumb.css('background-color', 'white');
        $volumeFill.css('background-color', 'black');
    }
    setStorageItem(storageItemKeys.muteEnabled, vtsState.muteEnabled);
});

// Used by volume slider on mousedown
function volumeSliderMousedown() {
    volumeSliderActive = true;
    $volumeThumb
        .popup('show')
        .popup('change content', `${vtsState.volume}%`)
        .popup('reposition');
}

$volumeThumb.mouseenter(() => {
    $volumeThumb
        .popup('show')
        .popup('change content', `${vtsState.volume}%`)
        .popup('reposition');
});

$volumeThumb.mouseleave(() => {
    if (!volumeSliderActive) {
        $volumeThumb.popup('hide');
    }
});

// Used by pitch slider on mousedown
function pitchSliderMousedown() {
    pitchSliderActive = true;
    $pitchThumb
        .popup('show')
        .popup('change content', `${vtsState.pitch}`)
        .popup('reposition');
}

$pitchThumb.mouseenter(() => {
    $pitchThumb
        .popup('show')
        .popup('change content', `${vtsState.pitch}`)
        .popup('reposition');
});

$pitchThumb.mouseleave(() => {
    if (!pitchSliderActive) {
        $pitchThumb.popup('hide');
    }
});

$preservePitchButton.click(() => {
    vtsState.preservePitchEnabled = getPreservePitchEnabled();
    setStorageItem(storageItemKeys.preservePitchEnabled, vtsState.preservePitchEnabled);
});

// Used by rate slider on mousedown
function rateSliderMousedown() {
    rateSliderActive = true;
    $rateThumb
        .popup('show')
        .popup('change content', `${vtsState.rate}`)
        .popup('reposition');
}

$rateThumb.mouseenter(() => {
    $rateThumb
        .popup('show')
        .popup('change content', `${vtsState.rate}`)
        .popup('reposition');
});

$rateThumb.mouseleave(() => {
    if (!rateSliderActive) {
        $rateThumb.popup('hide');
    }
});

$(document).on('mouseup', () => {
    volumeSliderActive = false;
    pitchSliderActive = false;
    rateSliderActive = false;
});

function initSliders() {
    $volumeSlider.slider({
        min: 0,
        max: 100,
        start: vtsState.volume,
        step: 0,
        onMove(data) {
            vtsState.volume = data.toFixed();
            setStorageItem(storageItemKeys.volume, vtsState.volume);
            try {
                $volumeThumb.popup('change content', `${vtsState.volume}%`).popup('reposition');
            } catch (err) {
                // Do nothing
            }
        },
    });

    $pitchSlider.slider({
        min: 0,
        max: 2,
        start: vtsState.pitch,
        step: 0.1,
        onMove(data) {
            vtsState.pitch = data.toFixed(1);
            setStorageItem(storageItemKeys.pitch, vtsState.pitch);
            try {
                $pitchThumb.popup('change content', `${vtsState.pitch}`).popup('reposition');
            } catch (err) {
                // Do nothing
            }
        },
    });

    $rateSlider.slider({
        min: 0,
        max: 2,
        start: vtsState.rate,
        step: 0.1,
        onMove(data) {
            vtsState.rate = data.toFixed(1);
            setStorageItem(storageItemKeys.rate, vtsState.rate);
            try {
                $rateThumb.popup('change content', `${vtsState.rate}`).popup('reposition');
            } catch (err) {
                // Do nothing
            }
        },
    });
}

function getVoiceSet(outputVoice) {
    return outputVoice.slice(0, 1);
}

function setInputLangSelect(value) {
    $(inputLangSelect.parentNode).dropdown('set selected', value);
}

function setOutputVoiceSelect(value) {
    $(outputVoiceSelect.parentNode).dropdown('set selected', value);
}

function setOutputLangSelect(value) {
    $(outputLangSelect.parentNode).dropdown('set selected', value);
}

function checkOuputDeviceDisabled() {
    if (!ranGotDevices || initOptions) {
        return;
    }

    // Race condition with dropdown
    setTimeout(() => {
        let { voiceSet, outputVoice, translationLang } = getSeparateOutputVoice();

        if (voiceSet === voiceSetMapping.voiceSetS) {
            outputDeviceSelect.parentNode.classList.add('disabled');
            outputDeviceSelect.parentNode.querySelector('.text').textContent = "Reroute browser audio"
        } else {
            outputDeviceSelect.parentNode.querySelector('.text').textContent = outputDeviceSelect.options[outputDeviceSelect.selectedIndex].textContent;
            outputDeviceSelect.parentNode.classList.remove('disabled');
        }
    }, 0);
}

function onOutputVoiceChange() {
    syncOutputLang();
    let { voiceSet, outputVoice, translationLang } = getSeparateOutputVoice();
    switch (voiceSet) {
        // case false:
        //     $(".options-divider").removeClass('options-divider-condensed');
        //     $(".row.top-padding-media").removeClass('top-padding-media-condensed');
        //     $extraVoiceOptions.css('display', 'none');
        //     break;
        case voiceSetMapping.voiceSetA:
            $(".options-divider").addClass('options-divider-condensed');
            $(".row.top-padding-media").addClass('top-padding-media-condensed');
            $extraVoiceOptions.css('display', '');
            $pitchOption.css('display', 'none');
            $preservePitchOption.css('display', '');
            break;
        default:
            $(".options-divider").addClass('options-divider-condensed');
            $(".row.top-padding-media").addClass('top-padding-media-condensed');
            $extraVoiceOptions.css('display', '');
            $pitchOption.css('display', '');
            $preservePitchOption.css('display', 'none');
    }

    checkOuputDeviceDisabled();
}

function syncOutputLang() {
    if (!vtsState.translateEnabled || !vtsState.syncLanguageEnabled)
    {
        return;
    }

    let { voiceSet, outputVoice, translationLang } = getSeparateOutputVoice();

    let outputLang = findMatchingOutputLang(translationLang);
    if (outputLang !== null) {
        setOutputLangSelect(outputLang);
    } else {
        // No valid language
        $syncLanguageErrorPopup.popup({
            inline: true,
            position: 'bottom center',
            on: 'nothing'
        });
        $syncLanguageErrorPopup.addClass('error-text');
        $syncLanguageErrorPopup.popup('show');
        $syncLanguageButton.click();
    }

    updateLangStorageItems();
}

inputLangSelect.onchange = function() {
    updateLangStorageItems();
    restartSpeech();
}

outputVoiceSelect.onchange = function() {
    updateLangStorageItems();
    onOutputVoiceChange();
}

outputLangSelect.onchange = function() {
    syncOutputLang();
    updateLangStorageItems();
}

// Init Options Menu

let initOptions = true;

function checkTranslationDisabled() {
    if (!vtsState.translateEnabled) {
        outputLangSelect.parentNode.querySelector('.text').textContent = "Translation disabled";
    }
}

$optionsButton.click(() => {
    // ~console.info(getOutputVoice());
    if (initOptions) {
        initOptions = false;

        $importReplacementsDropdown.dropdown({
            action: 'nothing',
            onShow: async function() {
                $importReplacementsDropdown.popup('hide');
            }
        });

        $exportReplacementsDropdown.dropdown({
            action: 'nothing',
            onShow: async function() {
                $exportReplacementsDropdown.popup('hide');
            }
        });

        // Fix broken dropdown
        $('[data-value="divider"]').addClass('divider');
        $('[data-value="divider"]').addClass('disabled');
        $('[data-value="divider"]').removeClass('item');
        $('[data-value="divider"]').removeAttr('data-value');
        $('[data-value="header"]').addClass('header');
        $('[data-value="header"]').addClass('disabled');
        $('[data-value="header"]').removeClass('item');
        $('[data-value="header"]').removeAttr('data-value');

        $('.dropdown-select').dropdown();

        // Handle case where translation is initially disabled
        syncOutputLang();
        checkTranslationDisabled();
        checkOuputDeviceDisabled();

        // Menu setup
        $('.pointing.menu.options-menu .item').tab();
        $('.ui.accordion').accordion();

        $resetOptionsButton.click(() => {
            $resetSettingsModal.modal({
                autofocus: false,
                duration: 300,
                onHide: async function(elem) {
                    $resetSettingsModal.modal({
                        autofocus: false,
                        duration: 300,
                        onHide: async function(elem) {
                            return true;
                        }
                    });
                    $optionsModal.modal('show');
                }
            });

            $resetReplacementsModal.modal({
                autofocus: false,
                duration: 300,
                onHide: async function(elem) {
                    $resetReplacementsModal.modal({
                        autofocus: false,
                        duration: 300,
                        onHide: async function(elem) {
                            return true;
                        }
                    });
                    $optionsModal.modal('show');
                }
            });

            resetOptions();
        });

        // Modal setup
        $clearTranscriptModal.modal({
            autofocus: false,
            duration: 300,
        });

        $clearTranscriptButton.click(() => {
            $clearTranscriptModal.modal('show');
        });

        $uiMenuButton.click(() => {
            $uiMenuModal.modal({
                autofocus: false,
                duration: 300,
                onHide: async function(elem) {
                    $uiMenuModal.modal({
                        autofocus: false,
                        duration: 300,
                        onHide: async function(elem) {
                            return true;
                        }
                    });
                    $optionsModal.modal('show');
                }
            });
            $uiMenuModal.modal('show');
        });

        $socketMenuButton.click(() => {
            $socketMenuModal.modal({
                autofocus: false,
                duration: 300,
                onHide: async function(elem) {
                    $socketMenuModal.modal({
                        autofocus: false,
                        duration: 300,
                        onHide: async function(elem) {
                            return true;
                        }
                    });
                    $optionsModal.modal('show');
                }
            });
            $socketMenuModal.modal('show');
        });
    }

    // Update device names
    setupMediaDevices();

    // Options modal setup
    $optionsModal.modal({
        autofocus: false,
        duration: 300,
    }).modal('show');

    $('.footer-button').popup({
        inline: true,
        position: 'bottom right'
    });

    $syncLanguageButton.popup({
        inline: true,
        position: 'left center'
    });

    // Slider setup
    $volumeThumb.popup({
        position: 'top center',
        content: `${vtsState.volume}%`,
        on: 'manual',
    });

    $pitchThumb.popup({
        position: 'top center',
        content: `${vtsState.pitch}`,
        on: 'manual',
    });

    $rateThumb.popup({
        position: 'top center',
        content: `${vtsState.rate}`,
        on: 'manual',
    });
});

$tabSettingsButton.click(() => {
    $optionsContainer.css('overflow-y', '');
    $resetOptionsButton.removeClass('disabled');
});

$tabReplacementsButton.click(() => {
    $optionsContainer.css('overflow-y', '');
    $resetOptionsButton.removeClass('disabled');
});

$tabAboutButton.click(() => {
    $optionsContainer.css('overflow-y', 'scroll');
    $resetOptionsButton.addClass('disabled');
});

$ttsInput.on('keypress', function(e) {
    const code = e.keyCode || e.which;
    if (code==13) {
        playTTSInput();
    }
});

$syncLanguageButton.click(() => {
    vtsState.syncLanguageEnabled = !getSyncLanguageEnabled();
    setStorageItem(storageItemKeys.syncLanguageEnabled, vtsState.syncLanguageEnabled);

    if (vtsState.syncLanguageEnabled) {
        $syncLanguageIcon.addClass('inverted');
        $syncLanguageIconOutline.css('visibility', '');
        outputLangSelect.parentNode.classList.add('disabled');
    } else {
        $syncLanguageIcon.removeClass('inverted');
        $syncLanguageIconOutline.css('visibility', 'hidden');

        if (vtsState.translateEnabled) {
            outputLangSelect.parentNode.classList.remove('disabled');
        }
    }

    syncOutputLang();
    updateLangStorageItems();
});

$transcriptButton.click(() => {
    vtsState.transcriptEnabled = getTranscriptEnabled();
    setStorageItem(storageItemKeys.transcriptEnabled, vtsState.transcriptEnabled);

    if (vtsState.transcriptEnabled) {
        transcriptHeader.style.display = 'block';
        transcript.style.display = 'block';
        scrollTranscript();
    } else {
        transcriptHeader.style.display = 'none';
        transcript.style.display = 'none';
    }
});

$socketButton.click(() => {
    vtsState.socketEnabled = getSocketEnabled();
    setStorageItem(storageItemKeys.socketEnabled, vtsState.socketEnabled);
});

socketAddressInput.onchange = function() {
    vtsState.socketAddress = this.value;
    setStorageItem(storageItemKeys.socketAddress, vtsState.socketAddress);
    setupSocket();
};

socketPortInput.onchange = function() {
    this.value = Math.max(Math.min(this.value, this.max), this.min);
    vtsState.socketPort = this.value;
    setStorageItem(storageItemKeys.socketPort, vtsState.socketPort);
    setupSocket();
};

$transcriptCopy.popup({
    inline: true,
    position: "top center",
    on: "click",
    onVisible: async function() {
        setTimeout(() => {
            $transcriptCopy.popup('hide');
        }, 1000);
    }
});

$transcriptDropdown.dropdown({
    action: 'nothing'
});

$timestampsButton.checkbox({
    onChange: function() {
        vtsState.timestampsEnabled = getTimestampsEnabled();
        setStorageItem(storageItemKeys.timestampsEnabled, vtsState.timestampsEnabled);
        if (vtsState.timestampsEnabled) {
            document.querySelectorAll('div#transcriptTime').forEach(e => e.style.display = "block");
        } else {
            document.querySelectorAll('div#transcriptTime').forEach(e => e.style.display = "none");
        }
    }
});

$translationsButton.checkbox({
    onChange: function() {
        vtsState.translationsEnabled = getTranslationsEnabled();
        setStorageItem(storageItemKeys.translationsEnabled, vtsState.translationsEnabled);
        if (vtsState.translationsEnabled) {
            document.querySelectorAll('div#transcriptTranslation').forEach(e => e.style.display = "block");
        } else {
            document.querySelectorAll('div#transcriptTranslation').forEach(e => e.style.display = "none");
        }
    }
});

function clearTranscript() {
    $clearTranscriptModal.modal('hide');
    $clearTranscriptNag.nag({
        storageMethod: null,
        persist: true,
        displayTime: 2000
    }).nag('show');

    while (transcript.firstChild) {
        transcript.firstChild.remove();
    }
}

$ttsButton.click(() => {
    vtsState.ttsEnabled = getTtsEnabled();
    setStorageItem(storageItemKeys.ttsEnabled, vtsState.ttsEnabled);

    if (vtsState.ttsEnabled) {
        ttsHeader.style.display = 'block';
        ttsArea.style.display = 'block';
    } else {
        ttsHeader.style.display = 'none';
        ttsArea.style.display = 'none';
    }
});

$statusButton.click(() => {
    vtsState.statusEnabled = getStatusEnabled();
    setStorageItem(storageItemKeys.statusEnabled, vtsState.statusEnabled);

    if (vtsState.statusEnabled) {
        statusBar.style.display = 'block';
    } else {
        statusBar.style.display = 'none';
    }
});

$lowlatencyButton.click(() => {
    vtsState.lowlatencyEnabled = getLowlatencyEnabled();
    setStorageItem(storageItemKeys.lowlatencyEnabled, vtsState.lowlatencyEnabled);

    if (vtsState.lowlatencyEnabled) {
        $latencyContainer.removeClass("disabled");
    } else {
        $latencyContainer.addClass("disabled");
    }

    // if (vtsState.lowlatencyEnabled && vtsState.translateEnabled) {
    //     $translateButton.click();
    // }

    if (buttonState === 1) {
        restartSpeech();
    }
});

latencyInput.onchange = function() {
    this.value = Math.max(Math.min(this.value, this.max), this.min);
    vtsState.latency = this.value;
    setStorageItem(storageItemKeys.latency, vtsState.latency);
};

$translateButton.click(() => {
    vtsState.translateEnabled = getTranslateEnabled();
    setStorageItem(storageItemKeys.translateEnabled, vtsState.translateEnabled);

    if (vtsState.translateEnabled) {
        // if (vtsState.lowlatencyEnabled) {
        //     $lowlatencyButton.click();
        // }
        outputLangSelect.parentNode.querySelector('.text').textContent = outputLangSelect.options[outputLangSelect.selectedIndex].textContent;
        if (!vtsState.syncLanguageEnabled) {
            outputLangSelect.parentNode.classList.remove('disabled');
        } else {
            syncOutputLang();
        }
        $speakInputButton.prop('disabled', false);
    } else {
        outputLangSelect.parentNode.querySelector('.text').textContent = "Translation disabled"
        outputLangSelect.parentNode.classList.add('disabled');
        $speakInputButton.prop('disabled', true);
    }
});

$speakInputButton.click(() => {
    vtsState.speakInputEnabled = getSpeakInputEnabled();
    setStorageItem(storageItemKeys.speakInputEnabled, vtsState.speakInputEnabled);
});

// Replacements Table
// Drag and Drop Reference:
// https://htmldom.dev/drag-and-drop-table-row/
// https://github.com/phuocng/html-dom/blob/master/assets/demo/drag-and-drop-table-row/index.html

let draggingEle;
let draggingRowIndex;
let replacementsPlaceholder;
let replacementsTableClone;
let replacementsBodyClone;
let isDraggingStart = true;
const cellBorderWidth = '1px';

// The current position of mouse relative to the dragging element
let replacementsX = 0;
let replacementsY = 0;

// Move `nodeA` to before the `nodeB`
function moveNodeBefore(nodeA, nodeB) {
    nodeB.parentNode.insertBefore(nodeA, nodeB);
}

// Move `nodeA` to after the `nodeB`
function moveNodeAfter(nodeA, nodeB) {
    nodeB.parentNode.insertBefore(nodeA, nodeB.nextSibling);
}

// Check if `nodeA` is above `nodeB`
function isNodeAbove(nodeA, nodeB) {
    // Get the bounding rectangle of nodes
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();

    return rectA.top < rectB.top + rectB.height * 0.45;
}

function addDraggableRecursive(node) {
    if (node instanceof HTMLInputElement || node instanceof HTMLElement) {
        node.classList.add('draggable');
    }
    for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        addDraggableRecursive(child);
    }
}

function cloneTable() {
    const rect = $replacementsTable.getBoundingClientRect();

    const rowStyles = [];
    for (const refRow of $replacementEntries.querySelectorAll('tr')) {
        const cellStyles = [];
        for (const cell of refRow.children) {
            cellStyles.push(window.getComputedStyle(cell));
        }

        const rowStyle = {
            style: window.getComputedStyle(refRow),
            cellStyles: cellStyles 
        }

        rowStyles.push(rowStyle);
    }

    const scroll = $replacementEntries.scrollTop;

    replacementsTableClone = $replacementsTableClone.cloneNode(true);
    replacementsBodyClone = replacementsTableClone.querySelector('tbody');
    $replacementsTable.parentNode.insertBefore(replacementsTableClone, $replacementsTable);

    replacementsTableClone.style.display = 'none';

    $replacementEntries.querySelectorAll('tr').forEach(function (row, rowIndex) {
        // Create a new table from given row
        const item = document.createElement('div');

        const newTable = $replacementsTableCloneRowContainer.cloneNode(true);

        const rowStyle = rowStyles[rowIndex];
        newTable.style.width = rowStyle.style.width;
        newTable.style.height = rowStyle.style.height;

        const newRow = row.cloneNode(true);
        newTable.appendChild(newRow);

        for (let cellIndex = 0; cellIndex < newRow.children.length; cellIndex++) {
            const cell = newRow.children[cellIndex];
            addDraggableRecursive(cell);

            const cellStyle = rowStyle.cellStyles[cellIndex];
            cell.style.borderColor = 'rgba(34, 36, 38, 0.1)';
            cell.style.borderTopStyle = 'solid';
            cell.style.borderBottomStyle = 'solid';
            cell.style.borderTopWidth = cellStyle.borderTopWidth;
            cell.style.borderBottomWidth = '0px';
            cell.style.maxWidth = cellStyle.width;
            cell.style.maxHeight = cellStyle.height;

            const dropdown = cell.querySelector('.replacement-dropdown');
            if (dropdown !== null) {
                dropdown.querySelector('.menu').remove();
            }
        }

        item.appendChild(newTable);
        replacementsBodyClone.appendChild(newTable);
    });

    // Hide the original table
    $replacementsTable.style.display = 'none';
    replacementsTableClone.style.display = 'table';

    replacementsBodyClone.scroll(0, scroll);
}

const replacementsTableMouseDownHandler = function (e) {
    // Get the original row
    const originalRow = e.target.parentNode.parentNode;
    draggingRowIndex = [].slice.call($replacementEntries.querySelectorAll('tr')).indexOf(originalRow);

    // Determine the mouse position
    replacementsX = e.clientX ? e.clientX : e.pageX;
    replacementsY = e.clientY ? e.clientY : e.pageY;

    $('.replacement-dropdown.active').dropdown({
        duration: 0
    }).dropdown('hide');

    // Attach the listeners
    document.addEventListener('touchmove', replacementsTableMouseMoveHandler);
    document.addEventListener('touchend', replacementsTableMouseUpHandler);
    document.addEventListener('mousemove', replacementsTableMouseMoveHandler);
    document.addEventListener('mouseup', replacementsTableMouseUpHandler);
};

const replacementsTableMouseMoveHandler = async function (e) {
    if (isDraggingStart) {
        isDraggingStart = false;

        cloneTable();

        draggingEle = [].slice.call(replacementsBodyClone.children)[draggingRowIndex];
        draggingEle.classList.add('dragging');
        draggingEle.style.pointerEvents = 'none';
        draggingEle.style.zIndex = '1';

        // Let the placeholder take the height of dragging element
        // So the next element won't move up
        replacementsPlaceholder = document.createElement('div');
        replacementsPlaceholder.classList.add('replacements-placeholder');
        draggingEle.parentNode.insertBefore(replacementsPlaceholder, draggingEle.nextSibling);
        replacementsPlaceholder.style.height = `${parseFloat(window.getComputedStyle(draggingEle).height)}px`;
        replacementsPlaceholder.style.borderColor = 'rgba(34, 36, 38, 0.1)';
        replacementsPlaceholder.style.borderTopStyle = 'solid';
        replacementsPlaceholder.style.borderTopWidth = draggingEle.style.borderTopWidth;
        replacementsPlaceholder.style.borderBottomStyle = 'solid';
        replacementsPlaceholder.style.borderBottomWidth = draggingEle.style.borderTopWidth;
        draggingEle.style.position = 'absolute';
        draggingEle.style.top = `${draggingEle.offsetTop - replacementsPlaceholder.parentNode.scrollTop}px`;
        draggingEle.style.width = `${parseFloat(draggingEle.style.width) + parseFloat(cellBorderWidth) * 2}px`;

        const cells = draggingEle.querySelector('tr').children;
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            cells[i].style.borderBottomWidth = cellBorderWidth;
            cells[i].style.borderTopWidth = cellBorderWidth;
        }

        cells[0].style.borderLeftStyle = 'solid';
        cells[0].style.borderLeftWidth = cellBorderWidth;
        cells[0].style.width = `${parseFloat(cells[0].style.maxWidth) + parseFloat(cellBorderWidth)}px`;

        cells[cells.length - 1].style.borderRightStyle = 'solid';
        cells[cells.length - 1].style.borderRightWidth = cellBorderWidth;
        cells[cells.length - 1].style.width = `${parseFloat(cells[0].style.maxWidth) + parseFloat(cellBorderWidth)}px`;
    }

    // Get position for dragging element
    const draggingOffsetTop = draggingEle.offsetTop;
    const draggingOffsetLeft = draggingEle.offsetLeft;

    const replacementsPlaceholderHeight = replacementsPlaceholder.style.height;

    // Get which row element to move to

    // Current order
    // prevEle
    // ...
    // draggingEle
    // replacementsPlaceholder
    // ...
    // nextEle
    let prevEle = draggingEle.previousElementSibling;
    let abovePrevEle = prevEle ? isNodeAbove(draggingEle, prevEle) : false;
    while (prevEle && abovePrevEle) {
        let tempPrevEle = prevEle;
        prevEle = prevEle.previousElementSibling;
        abovePrevEle = prevEle ? isNodeAbove(draggingEle, prevEle) : false;
        if (!abovePrevEle) {
            prevEle = tempPrevEle;
            abovePrevEle = true;
            break;
        }
    }
    let prevEleHeight = prevEle ? window.getComputedStyle(prevEle).height : undefined;

    let nextEle = replacementsPlaceholder.nextElementSibling;
    let belowNextEle = nextEle ? isNodeAbove(nextEle, draggingEle) : false;
    while (nextEle && belowNextEle) {
        let tempNextEle = nextEle;
        nextEle = nextEle.nextElementSibling;
        belowNextEle = nextEle ? isNodeAbove(nextEle, draggingEle) : false;
        if (!belowNextEle) {
            nextEle = tempNextEle;
            belowNextEle = true;
            break;
        }
    }
    let nextEleHeight = nextEle ? window.getComputedStyle(nextEle).height : undefined;

    // Set position for dragging element
    const mouseX = e.clientX ? e.clientX : e.pageX;
    const mouseY = e.clientY ? e.clientY : e.pageY;
    draggingEle.style.left = `${draggingOffsetLeft + mouseX - replacementsX}px`;
    draggingEle.style.top = `${draggingOffsetTop + mouseY - replacementsY}px`;

    // Reassign the position of mouse
    replacementsX = mouseX;
    replacementsY = mouseY;

    // Reposition row elements
    if (prevEle && abovePrevEle) {
        // The dragging element is above the previous element
        // User moves the dragging element to the top

        // Current order           -> New order
        // prevEle                 -> draggingEle
        // ...                     -> replacementsPlaceholder
        // draggingEle             -> prevEle
        // replacementsPlaceholder -> ...
        moveNodeBefore(replacementsPlaceholder, prevEle);
        moveNodeBefore(draggingEle, replacementsPlaceholder);

        // Adjust height and style if first two row elements changed
        if (Array.prototype.indexOf.call(replacementsPlaceholder.parentNode.children, replacementsPlaceholder) === 1) {
            replacementsPlaceholder.style.height = prevEleHeight;

            prevEle.style.height = replacementsPlaceholderHeight;
            for (let cell of prevEle.querySelector('tr').children) {
                cell.style.borderTopWidth = cellBorderWidth;
                cell.style.height = replacementsPlaceholderHeight;
            }
        }
    } else if (nextEle && belowNextEle) {
        // The dragging element is below the next element
        // User moves the dragging element to the bottom

        // Adjust height and style if first two row elements changed
        if (Array.prototype.indexOf.call(replacementsPlaceholder.parentNode.children, replacementsPlaceholder) === 1) {
            replacementsPlaceholder.style.height = nextEleHeight;

            replacementsPlaceholder.nextElementSibling.style.height = replacementsPlaceholderHeight;
            for (let cell of replacementsPlaceholder.nextElementSibling.querySelector('tr').children) {
                cell.style.borderTopWidth = '0px';
                cell.style.height = replacementsPlaceholderHeight;
            }
        }

        // Current order           -> New order
        // draggingEle             -> ...
        // replacementsPlaceholder -> nextEle
        // ...                     -> draggingEle
        // nextEle                 -> replacementsPlaceholder
        moveNodeAfter(replacementsPlaceholder, nextEle);
        moveNodeBefore(draggingEle, replacementsPlaceholder);
    }
};

const replacementsTableMouseUpHandler = function() {
    if (replacementsBodyClone === undefined ||
        replacementsPlaceholder.parentNode === null ||
        replacementsTableClone.parentNode === null) {
        return;
    }

    // Remove the replacementsPlaceholder
    replacementsPlaceholder && replacementsPlaceholder.parentNode.removeChild(replacementsPlaceholder);

    draggingEle.classList.remove('dragging');
    draggingEle.style.removeProperty('top');
    draggingEle.style.removeProperty('left');
    draggingEle.style.removeProperty('position');

    // Get the end index
    const endRowIndex = [].slice.call(replacementsBodyClone.children).indexOf(draggingEle);

    isDraggingStart = true;

    // Move the dragged row to `endRowIndex`
    let rows = [].slice.call($replacementEntries.querySelectorAll('tr'));
    draggingRowIndex > endRowIndex
        ? rows[endRowIndex].parentNode.insertBefore(rows[draggingRowIndex], rows[endRowIndex])
        : rows[endRowIndex].parentNode.insertBefore(rows[draggingRowIndex], rows[endRowIndex].nextSibling);

    const scroll = replacementsBodyClone.scrollTop;

    // Remove the `list` element
    replacementsTableClone.parentNode.removeChild(replacementsTableClone);

    // Bring back the table
    updateReplacementsList();
    $replacementsTable.style.display = "table";
    $replacementEntries.scroll(0, scroll);

    // Remove event handlers
    document.removeEventListener('touchmove', replacementsTableMouseMoveHandler);
    document.removeEventListener('touchend', replacementsTableMouseUpHandler);
    document.removeEventListener('mousemove', replacementsTableMouseMoveHandler);
    document.removeEventListener('mouseup', replacementsTableMouseUpHandler);
};

$replacementEntries.querySelectorAll('tr').forEach(function (row, index) {
    const firstCell = row.firstElementChild;
    firstCell.querySelector('i').addEventListener('touchstart', replacementsTableMouseDownHandler);
    firstCell.querySelector('i').addEventListener('mousedown', replacementsTableMouseDownHandler);
});

// Replacements Map

const FULL_MATCH = "fullMatch";
const REMOVE_LEADING_SPACE = "removeLeadingSpace";
const REMOVE_TRAILING_SPACE = "removeTrailingSpace";
const replacementEntryScaffold = ["", "", {"fullMatch": true, "removeLeadingSpace": true, "removeTrailingSpace": true}]

const defaultReplacementsList = [
    ["clear", "", {"fullMatch": true}],
    ["period", ".", {"removeLeadingSpace": true}],
    ["comma", ",", {"removeLeadingSpace": true}],
    ["exclamation mark", "!", {"removeLeadingSpace": true}],
    ["question mark", "?", {"removeLeadingSpace": true}],
    ["colon", ":", {"removeLeadingSpace": true}],
    ["semicolon", ";", {"removeLeadingSpace": true}],
    ["quotation mark", "\"", {"removeLeadingSpace": true}],
    ["left parenthesis", "(", {"removeTrailingSpace": true}],
    ["right parenthesis", ")", {"removeLeadingSpace": true}],
    ["heart emoji", "♥"],
    ["thumbs up emoji", "👍"],
    ["thumbs down emoji", "👎"],
    ["clap emoji", "👏"],
    ["eyes emoji", "👀"],
    ["skull emoji", "💀"],
    ["thinking face", "🤔"],
    ["happy face", "😄"],
    ["smiley face", "🙂"],
    ["neutral face", "😐"],
    ["sad face", "🙁"],
    ["angry face", "😠"],
    ["pensive face", "😔"],
    ["surprised face", "😮"],
    ["melting face", "🫠"]
]

let replacementsList = [];

function resetReplacementsList() {
    let replacementsListStorageItem = getStringStorageItem(storageItemKeys.replacements, "");
    if (replacementsListStorageItem === "") {
        replacementsList = JSON.parse(JSON.stringify(defaultReplacementsList));   
    } else {
        replacementsList = JSON.parse(replacementsListStorageItem);
    }
    $replacementEntries.replaceChildren();
    loadReplacementsList();
}
function processing(file) {
    // Do something to the file
    console.log(file);
}

resetReplacementsList();

function loadReplacementsList() {
    for (const entry of replacementsList) {
        addReplacementEntry(...entry);
    }
}

function downloadTextFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

async function copyReplacements() {
    $exportReplacementsDropdown.dropdown('hide');
    try {
        navigator.clipboard.writeText(JSON.stringify(replacementsList));
        $.toast({
            class: 'grey',
            position: 'top center',
            compact: false,
            message: `Copied!`
        });
    } catch (err) {
        $.toast({
            class: 'error',
            position: 'top center',
            compact: false,
            message: `Copy failed!`
        });
    }
}

async function downloadReplacements() {
    $exportReplacementsDropdown.dropdown('hide');
    downloadTextFile("replacements.json", JSON.stringify(replacementsList));
}

function cleanReplacementsList(srcReplacementsList) {
    let dstReplacementsList = [];
    for (let srcEntry of srcReplacementsList) {
        if (!Array.isArray(srcEntry)) {
            continue;
        }

        if (srcEntry.length < 2) {
            continue;
        }

        let dstEntry = [];
        let validEntry = true;
        for (let i = 0; i < replacementEntryScaffold.length; i++) {
            if (i >= srcEntry.length) {
                // Options is optional
                break;
            }

            let srcItem = srcEntry[i];
            scaffoldItem = replacementEntryScaffold[i];
            if (typeof scaffoldItem === 'object') {
                // Validate options
                let dstItem = {};
                let validObject = false;
                for (let [key, value] of Object.entries(scaffoldItem)) {
                    if (srcItem.hasOwnProperty(key) && typeof srcItem[key] === typeof value) {
                        dstItem[key] = srcItem[key];
                        validObject = true;
                    }
                }
                if (validObject) {
                    dstEntry.push(dstItem);
                }
            } else if (typeof srcItem === typeof scaffoldItem) {
                // Validate phrase and replacement
                dstEntry.push(srcItem);
            } else {
                // Incorrect type
                validEntry = false;
                break;
            }
        }

        if (validEntry && dstEntry.length > 0) {
            dstReplacementsList.push(dstEntry);
        }
    }
    return dstReplacementsList;
}

async function importReplacements(content) {
    let srcReplacementsList = {};
    try {
        srcReplacementsList = JSON.parse(content);
    } catch(e) {
        $.toast({
            class: 'error',
            position: 'top center',
            compact: false,
            message: `Import failed!`
        });
        console.error(e);
        return;
    }
    replacementsList = cleanReplacementsList(srcReplacementsList);
    setStorageItem(storageItemKeys.replacements, JSON.stringify(replacementsList));
    resetReplacementsList();
    $replacementEntries.scrollTop = 0;
    $.toast({
        class: 'success',
        position: 'top center',
        compact: false,
        message: `Imported!`
    });
}

async function pasteReplacements() {
    $importReplacementsDropdown.dropdown('hide');
    try {
        let clipboardText = await navigator.clipboard.readText();
        importReplacements(clipboardText);
    } catch (err) {
        $.toast({
            class: 'error',
            position: 'top center',
            compact: false,
            message: `Paste failed!`
        });
    }
}

async function uploadReplacements() {
    $importReplacementsDropdown.dropdown('hide');

    // Clear any existing file
    replacementsFileInput.value = "";
    replacementsFileInput.parentElement.classList.remove("disabled");
    importReplacementsButton.classList.add("disabled");
    importReplacementsButton.firstElementChild.style.display = "none";
    importReplacementsButton.lastChild.textContent = "Import";

    replacementsFileInput.onchange = function() {
        importReplacementsButton.classList.remove("disabled")
    }

    $uploadReplacementsModal.modal({
        autofocus: false,
        duration: 300,
        onHide: async function(elem) {
            $uploadReplacementsModal.modal({
                autofocus: false,
                duration: 300,
                onHide: async function(elem) {
                    return true;
                },
                onHidden: async function() {
                    replacementsFileInput.value = "";
                }
            });
            $optionsModal.modal('show');
        },
    }).modal('show');
}

async function importReplacementsFile() {
    replacementsFileInput.parentElement.classList.add("disabled");
    importReplacementsButton.classList.add("disabled")
    importReplacementsButton.firstElementChild.style.display = "inline-block";
    importReplacementsButton.lastChild.textContent = "Importing...";
    const replacementsFile = replacementsFileInput.files[0];
    const reader = new FileReader();
    reader.readAsText(replacementsFile);
    reader.onload = () => {
        importReplacements(reader.result);
        $uploadReplacementsModal.modal('hide');
    };
}

function applyReplacements(text) {
    for (const [phrase, replacement, options] of replacementsList) {
        let fullMatch = false;
        let removeLeadingSpace = false;
        let removeTrailingSpace = false;
        if (options !== undefined) {
            if (options.hasOwnProperty(FULL_MATCH)) {
                fullMatch = options.fullMatch;
            }

            if (options.hasOwnProperty(REMOVE_LEADING_SPACE)) {
                removeLeadingSpace = options.removeLeadingSpace;
            }

            if (options.hasOwnProperty(REMOVE_TRAILING_SPACE)) {
                removeTrailingSpace = options.removeTrailingSpace;
            }
        }
        if (fullMatch) {
            if (text.toLowerCase() === phrase) {
                text = replacement;
                break;
            }
        } else {
            const leadingSpace = removeLeadingSpace ? ' ?' : '';
            const trailingSpace = removeTrailingSpace ? ' ?' : '';
            const re = new RegExp(`${leadingSpace}${phrase}${trailingSpace}`, 'img');
            text = text.replaceAll(re, replacement);
        }
    }
    return text;
}

function updateFullMatch(element) {
    const replacementDropdown = element.parentNode.parentNode.parentNode;
    const removeLeadingSpaceCheckbox = $(replacementDropdown.querySelector('.remove-leading-space-checkbox'));
    const removeTrailingSpaceCheckbox = $(replacementDropdown.querySelector('.remove-trailing-space-checkbox'));
    if ($(element).checkbox('is checked')) {
        removeLeadingSpaceCheckbox.checkbox('set disabled').checkbox('set unchecked');
        removeTrailingSpaceCheckbox.checkbox('set disabled').checkbox('set unchecked');
    } else {
        removeLeadingSpaceCheckbox.checkbox('set enabled');
        removeTrailingSpaceCheckbox.checkbox('set enabled');
    }
}

function onFullMatchUpdate(element) {
    updateFullMatch(element);
    updateReplacementsList();
}

function onPhraseUpdate(element) {
    element.value = element.value.toLowerCase();
    updateReplacementsList();
}

function updateReplacementsList() {
    replacementsList = [];
    for (let child of $replacementEntries.children) {
        phrase = child.querySelector('.phrase').value;
        replacement = child.querySelector('.replacement').value;

        let options = {};
        if ($(child.querySelector('.full-match-checkbox')).checkbox('is checked')) {
            options.fullMatch = true;
        }

        if ($(child.querySelector('.remove-leading-space-checkbox')).checkbox('is checked')) {
            options.removeLeadingSpace = true;
        }

        if ($(child.querySelector('.remove-trailing-space-checkbox')).checkbox('is checked')) {
            options.removeTrailingSpace = true;
        }

        let entry = [phrase, replacement];
        if (Object.keys(options).length > 0) {
            entry.push(options);
        }

        replacementsList.push(entry);
    }
    setStorageItem(storageItemKeys.replacements, JSON.stringify(replacementsList));
}

function showReplacementDropdownMenuTouch(dropdown) {
    dropdown.onclick = null;
    showReplacementDropdownMenu(dropdown);
}

function showReplacementDropdownMenu(dropdown) {
    if (!$(dropdown).dropdown('is visible')) {
        const entriesRect = $replacementEntries.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();
        const menu = dropdown.querySelector('.menu');

        if (menu === null) {
            return;
        }

        if (entriesRect.bottom - dropdownRect.top < dropdownRect.top - entriesRect.top) {
            menu.classList.remove('pointing-top-right');
            menu.classList.add('pointing-bottom-right');
            $(dropdown).dropdown({
                action: 'nothing',
                direction: 'upward',
                transition: 'slide up'
            }).dropdown('show');
        } else {
            menu.classList.remove('pointing-bottom-right');
            menu.classList.add('pointing-top-right');
            $(dropdown).dropdown({
                action: 'nothing',
                direction: 'auto'
            }).dropdown('show');
        }
    }
}

function addEmptyReplacementEntry() {
    addReplacementEntry(undefined, undefined, undefined);
    updateReplacementsList();
}

function addReplacementEntry(phrase, replacement, options) {
    const newTableEntry = $replacementEntryTemplate.cloneNode(true);

    if (phrase !== undefined && replacement !== undefined) {
        newTableEntry.querySelector('.phrase').value = phrase;
        newTableEntry.querySelector('.replacement').value = replacement;

        if (options !== undefined) {
            if (options.hasOwnProperty('fullMatch')) {
                newTableEntry.querySelector('.full-match-checkbox').querySelector('input').checked = options.fullMatch;
            }

            if (options.hasOwnProperty('removeLeadingSpace')) {
                newTableEntry.querySelector('.remove-leading-space-checkbox').querySelector('input').checked = options.removeLeadingSpace;
            }

            if (options.hasOwnProperty('removeTrailingSpace')) {
                newTableEntry.querySelector('.remove-trailing-space-checkbox').querySelector('input').checked = options.removeTrailingSpace;
            }
        }
    }

    $replacementEntries.appendChild(newTableEntry);
    newTableEntry.firstElementChild.querySelector('i').addEventListener('touchstart', replacementsTableMouseDownHandler);
    newTableEntry.firstElementChild.querySelector('i').addEventListener('mousedown', replacementsTableMouseDownHandler);

    $('.new-replacement-dropdown').dropdown({
        action: 'nothing'
    }).removeClass('new-replacement-dropdown');
    $replacementEntries.scrollTop = $replacementEntries.scrollHeight - $replacementEntries.clientHeight;

    $('.new-replacement-checkbox').checkbox({
        onChange: function() {
            updateReplacementsList();
        }
    }).removeClass('new-replacement-checkbox');

    const fullMatchCheckbox = document.querySelector('.new-full-match-replacement-checkbox');
    updateFullMatch(fullMatchCheckbox);
    $(fullMatchCheckbox).checkbox({
        onChange: function() {
            onFullMatchUpdate(this.parentNode);
        }
    }).removeClass('new-full-match-replacement-checkbox');
}

function deleteNodeRecursive(node) {
  while (node.hasChildNodes()) {
    deleteNodeRecursive(node.firstChild);
  }
  node.parentNode.removeChild(node);
}

function deleteReplacementEntry(element) {
    deleteNodeRecursive(element.parentNode.parentNode.parentNode.parentNode);
    updateReplacementsList();
}

// End Replacements

function scrollTranscript() {
    transcript.scrollTop = transcript.scrollHeight - transcript.clientHeight;
}

function checkTime(i) {
    if (i < 10) {
        i = `0${i}`;
    }
    return i;
}

function getTranscriptTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    // add a zero in front of numbers<10
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    const timestamp = `${h}:${m}:${s}`;
    return timestamp;
}

function appendTranscript(text, untranslatedText, inputLang, outputLang, link) {
    // allow 1px inaccuracy by adding 1
    const isScrolledToBottom = transcript.scrollHeight - transcript.clientHeight <= transcript.scrollTop + 1;

    // Transcript
    const transcriptTime = document.createElement('div');
    transcriptTime.setAttribute('id', 'transcriptTime');
    transcriptTime.setAttribute('class', 'transcript-time');
    transcriptTime.textContent = `${getTranscriptTime()} `;
    if (!vtsState.timestampsEnabled) {
        transcriptTime.style.display = 'none';
    }

    const transcriptText = document.createElement('div');
    if (text === "") {
        transcriptText.setAttribute('class', 'transcript-text transcript-empty-text unselectable');
        transcriptText.setAttribute('unselectable', 'on');
        transcriptText.textContent = "Empty text"
    } else {
        transcriptText.setAttribute('class', 'transcript-text');
        transcriptText.textContent = text
    }

    const transcriptPlay = document.createElement('div');
    transcriptPlay.setAttribute('class', 'transcript-play unselectable');
    transcriptPlay.setAttribute('unselectable', 'on');
    transcriptPlay.setAttribute(
        'onClick',
        `playTranscriptAudio(this, "${link}", true)`,
    );

    const playIcon = document.createElement('i');
    playIcon.setAttribute('class', 'play circle outline icon');
    transcriptPlay.appendChild(playIcon);

    const transcriptContainer = document.createElement('div');
    transcriptContainer.setAttribute('class', 'transcript-container');
    transcriptContainer.appendChild(transcriptTime);
    transcriptContainer.appendChild(transcriptText);
    transcriptContainer.appendChild(transcriptPlay);

    // Translation
    inputLang = findMatchingOutputLang(inputLang);
    const translated = inputLang !== outputLang && vtsState.translateEnabled;
    const transcriptTranslation = document.createElement('div');
    if (translated && untranslatedText !== "") {
        const transcriptTranslationInfo = document.createElement('div');
        transcriptTranslationInfo.setAttribute('class', 'transcript-translation-info');
        transcriptTranslationInfo.textContent = `${inputLang}|${outputLang} `;

        const transcriptUntranslatedText = document.createElement('div');
        transcriptUntranslatedText.setAttribute('class', 'transcript-untranslated-text');
        transcriptUntranslatedText.textContent = `${untranslatedText}`;

        transcriptTranslation.setAttribute('id', 'transcriptTranslation');
        transcriptTranslation.appendChild(transcriptTranslationInfo);
        transcriptTranslation.appendChild(transcriptUntranslatedText);
        if (!vtsState.translationsEnabled) {
            transcriptTranslation.style.display = 'none';
        }
    }

    // Body
    const transcriptBody = document.createElement('div');
    transcriptBody.setAttribute('class', 'transcript-body');
    if (translated) {
        transcriptBody.appendChild(transcriptTranslation);
    }
    transcriptBody.appendChild(transcriptContainer);

    transcript.appendChild(transcriptBody);

    // scroll to bottom if isScrolledToBottom is true
    if (isScrolledToBottom) {
        scrollTranscript();
    }

    // Add hover effects
    $(transcriptBody)
        .mouseenter(function mouseenter() {
            const activeHover = $('.active-hover');
            hideTranscriptHover(activeHover);
            activeHover.removeClass('active-hover');
            const thisElement = $(this);
            showTranscriptHover(thisElement);
            thisElement.addClass('active-hover');
        })
        .mouseleave(function mouseleave() {
            const thisElement = $(this);
            hideTranscriptHover(thisElement);
            thisElement.removeClass('active-hover');
        });
}

function hideTranscriptHover(element) {
    if (
        !element.children('.transcript-container').children('.transcript-play').hasClass('active-audio')
        || !element.hasClass('active-hover')
    ) {
        element.css('background-color', 'white');
        element.children('.transcript-container').children('.transcript-play').css('display', 'none');
    }
}

function showTranscriptHover(element) {
    element.css('background-color', 'whitesmoke');
    element.children('.transcript-container').children('.transcript-play').css('display', 'block');
}

function copyTranscript() {
    node = document.getElementById("transcript");

    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
    
    document.execCommand("copy");

    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
}

function speechButton() {
    socket.connect();
    if (buttonState < 1) {
        // Initialize speech
        speechPlaying = false;
        audio = new Audio();
        speechBuffer = [];

        buttonState = 1;
        startButtonInfo.textContent = 'Press stop to end speech recognition';
        startButton.textContent = 'Stop';
        testSpeech();
    } else {
        // Stop speech
        speechPlaying = false;
        audio.load();

        // Hide transcript audio display
        const activeAudioElement = $('.active-audio');
        try {
            activeAudioElement
                .children('i')[0]
                .setAttribute('class', 'play circle outline icon');
            activeAudioElement.removeClass('active-audio');
        } catch (err) {
            // Do nothing
        }
        hideTranscriptHover($('.transcript-body'));

        buttonState = -1;
        startButton.disabled = true;
        startButton.textContent = 'Stopping...';
        recognition.onend();
    }
}

// Translation

async function getTranslation(sourceLang, targetLang, sourceText) {
    let translation = '';
    try {
        translation = await window.gtranslate(sourceText, { from: sourceLang, to: targetLang });
    } catch (err) {
        console.error(err);
        console.info('Trying different api...');
        // Switch translation api on error
        translateApi = 1 - translateApi;
        try {
            translation = await window.ytranslate(sourceText, { from: sourceLang, to: targetLang });
        } catch (err) {
            console.error(err);
            throw 'Could not translate due to api error';
        }
    }
    return translation;
}

/*
const sourceLang = "en-us";
const targetLang = "ja";
const sourceText = "translation test";
async function test() {
    let testoutput = await getTranslation(sourceLang, targetLang, sourceText);
    console.info(testoutput);
}
test();
*/

// Fill devices

function getOuputDeviceStorageItemAndUpdate() {
    if (!ranGotDevices) {
        return;
    }

    let found = false;
    vtsState.outputDeviceSelect = getStringStorageItem(storageItemKeys.outputDeviceSelect, defaultVtsState.outputDeviceSelect);
    for (let option of outputDeviceSelect.options) {
        if (option.value == vtsState.outputDeviceSelect) {
            outputDeviceSelect.value = vtsState.outputDeviceSelect;
            found = true;
            break;
        }
    }

    if (!found) {
        vtsState.outputDeviceSelect = 'default';
        outputDeviceSelect.value = vtsState.outputDeviceSelect;
    }

    changeAudioDestination();
}

function gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    const values = deviceSelectors.map(deviceSelector => deviceSelector.value);
    deviceSelectors.forEach((deviceSelector) => {
        while (deviceSelector.firstChild) {
            deviceSelector.removeChild(deviceSelector.firstChild);
        }
    });

    if (inputDeviceSelectionDisabled) {
        const option = document.createElement('option');
        option.text = 'Set in browser';
        inputDeviceSelect.appendChild(option);
    }

    for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'audioinput') {
            if (!inputDeviceSelectionDisabled) {
                option.text = deviceInfo.label || `microphone ${inputDeviceSelect.length + 1}`;
                inputDeviceSelect.appendChild(option);
            }
        } else if (deviceInfo.kind === 'audiooutput') {
            option.text = deviceInfo.label || `speaker ${outputDeviceSelect.length + 1}`;
            outputDeviceSelect.appendChild(option);
        } else {
            // console.info('Some other kind of source/device: ', deviceInfo);
        }
    }

    deviceSelectors.forEach((select, selectorIndex) => {
        if (
            Array.prototype.slice
                .call(select.childNodes)
                .some(n => n.value === values[selectorIndex])
        ) {
            select.value = values[selectorIndex];
        }
    });

    ranGotDevices = true;
    getOuputDeviceStorageItemAndUpdate();
}

function changeAudioDestination() {
    vtsState.outputDeviceSelect = outputDeviceSelect.value;
    audioDestination = vtsState.outputDeviceSelect;
    setStorageItem(storageItemKeys.outputDeviceSelect, vtsState.outputDeviceSelect);
    checkOuputDeviceDisabled();
}

outputDeviceSelect.onchange = function() {
    changeAudioDestination();
}

/*
function gotStream(stream) {
    window.stream = stream; // make stream available to console
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
}
*/

function handleError(error) {
    console.info(
        'navigator.mediaDevices.getUserMedia error: ',
        error.message,
        error.name,
    );
    gotDevices([]);
}

/*
function startInputDevice() {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    const inputDevice = inputDeviceSelect.value;
    const constraints = {
        audio: {deviceId: inputDevice ? {exact: inputDevice} : undefined}
    };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .then(gotDevices)
        .catch(handleError);
}

//inputDeviceSelect.onchange = startInputDevice;
inputDeviceSelect.onchange = function() {
    if (buttonState === 1) {
        testSpeech();
    }
}
*/

async function setupMediaDevices() {
    if (navigator.mediaDevices === undefined) {
        gotDevices([]);
        return;
    }

    try {
        navigator.mediaDevices
            .enumerateDevices()
            .then(gotDevices)
            .catch(handleError);  
    } catch (err) {}
}

setupMediaDevices();

let restartSpeech = function() {
    // TODO: Figure out looping error on Safari
    // setTimeout(() => {
    //     if (buttonState === 1) {
    //         recognition.stop();
    //         testSpeech();
    //     }
    // }, 3000);

    if (buttonState === 1) {
        recognition = new SpeechRecognition();
        testSpeech();
    }
}

// Used by transcript play button
async function playTranscriptAudio(elem, audioURL, stop = false) {
    if (audioURL === "") {
        return;
    }

    if (!vtsState.muteEnabled) {
        const element = $(elem);
        if (element.children('i').hasClass('play')) {
            speechPlaying = false;
            const activeAudioElement = $('.active-audio');
            try {
                activeAudioElement
                    .children('i')[0]
                    .setAttribute('class', 'play circle outline icon');
                activeAudioElement.removeClass('active-audio');
            } catch (err) {
                // Do nothing
            }
            hideTranscriptHover(activeAudioElement.parent().parent());
            element.addClass('active-audio');
            element.children('i')[0].setAttribute('class', 'stop circle outline icon');
            playAudio(audioURL, stop, true);
        } else {
            speechPlaying = false;
            audio.load();
            element.removeClass('active-audio');
            element.children('i')[0].setAttribute('class', 'play circle outline icon');
        }
    }
}

function sendJsonRequest(method, url, jsonPayload) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function() {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    // The request has been completed successfully
                } else {
                    console.error(`Response: ${xhr.responseText}`);
                    const errorMsg = "Failed to get audio. Try another output voice or language.";
                    console.error(errorMsg);
                    updateOutputStatus(errorMsg);
                }
            }
        }
        xhr.send(JSON.stringify(jsonPayload));
    });
}

function splitArgsFromEnd(text, match, count) {
    let args = text.split(match);
    let finalArgs = [];
    for (let i = 1; i <= count; i++) {
        if (i < count) {
            finalArgs.unshift(args[args.length - i]);   
        } else {
            finalArgs.unshift(args.slice(0, args.length - i + 1).join(match))
        }
    }
    return finalArgs;
}

async function onPlaybackError(err, audioURL) {
    speechPlaying = false;
    // ~console.info("error playTTS");
    console.error(err);
    timeoutTimes += 1;
    if (timeoutTimes > 3) {
        const errorMsg = "Voice may not be available. Try another output voice.";
        console.error(errorMsg);
        updateOutputStatus(errorMsg);
        timeoutTimes = 0;
    } else {
        const errorMsg = `Failed to play audio, trying again. Current attempt: ${timeoutTimes}`;
        console.error(errorMsg);
        updateOutputStatus(errorMsg);
        setTimeout(() => {
            playAudio(audioURL, false, false);
        }, 500);
    }
}

async function onPlaybackEnded() {
    speechPlaying = false;
    const activeAudioElement = $('.active-audio');
    hideTranscriptHover(activeAudioElement.parent().parent());
    try {
        activeAudioElement.children('i')[0].setAttribute('class', 'play circle outline icon');
        activeAudioElement.removeClass('active-audio');
    } catch (err) {
        // Do nothing
    }
}

async function playAudio(audioURL, stop, fromTranscript) {
    if (audioURL === "" || vtsState.muteEnabled) {
        return;
    }

    let preservePitch = true;
    let pitch = 1.0;
    let rate = 1.0;
    let voiceSet = getVoiceSet(audioURL);
    let useSoundTouch = false;
    switch (voiceSet) {
        case voiceSetMapping.voiceSetA: {
            const args = splitArgsFromEnd(audioURL.slice(audioURL.search(":") + 1), "|", 3);
            audioURL = args[0];
            rate = parseFloat(args[1]);
            preservePitch = args[2] === "true";
            break;
        }
        case voiceSetMapping.voiceSetB: {
            audioURL = audioURL.slice(audioURL.search(":") + 1);
            break;
        }
        case voiceSetMapping.voiceSetC: 
        case voiceSetMapping.voiceSetD: {
            const args = splitArgsFromEnd(audioURL.slice(audioURL.search(":") + 1), "|", 3);
            audioURL = args[0];
            rate = parseFloat(args[1]);
            pitch = parseFloat(args[2]);
            if (rate !== 1.0 || pitch !== 1.0) {
                useSoundTouch = true;
            }
            break;
        }
        case voiceSetMapping.voiceSetE: {
            const args = splitArgsFromEnd(audioURL.slice(audioURL.search(":") + 1), "|", 4);
            const jsonPayload = {
                text: args[0],
                voice: args[1]
            }
            rate = parseFloat(args[2]);
            pitch = parseFloat(args[3]);
            const response = await sendJsonRequest('POST', `https://tiktok-tts.weilnet.workers.dev/api/generation`, jsonPayload);
            audioURL = "data:audio/wav;base64," + JSON.parse(response).data;
            if (rate !== 1.0 || pitch !== 1.0) {
                useSoundTouch = true;
            }
            break;
        }
        case voiceSetMapping.voiceSetS: {
            // Let SpeechSynthesis handle audio queue and ignore usual transcript play stop logic
            const activeAudioElement = $('.active-audio');
            hideTranscriptHover(activeAudioElement.parent().parent());
            try {
                activeAudioElement
                    .children('i')[0]
                    .setAttribute('class', 'play circle outline icon');
                activeAudioElement.removeClass('active-audio');
            } catch (err) {
                // Do nothing
            }

            if (fromTranscript) {
                speechSynthesis.cancel();
            }

            let msg = new SpeechSynthesisUtterance();
            const args = splitArgsFromEnd(audioURL.slice(audioURL.search(":") + 1), "|", 4);
            msg.text = args[0];
            msg.volume = vtsState.volume / 100;
            msg.rate = Math.pow(10, parseFloat(args[1]) - 1); // Rate from 0.1 to 10
            msg.pitch = parseFloat(args[2]);
            msg.voice = getSpeechSynthesisVoice(args[3]);
            speechSynthesis.speak(msg);
            return;
        }
    }

    if (useSoundTouch) {
        // For additional consideration: https://github.com/danigb/timestretch
        // Used: https://github.com/cutterbl/soundTouchjs-audio-worklet
        speechPlaying = true;
        let audioCtx = new AudioContext();
        await audioCtx.audioWorklet.addModule(window.soundTouchWorklet);
    
        const audioBuffer = await fetch(audioURL, { mode: 'cors' })
            .then(response => {
                // ~console.info("response");
                timeoutTimes = 0;
                return response.arrayBuffer();
            })
            .catch(err => onPlaybackError(err, audioURL));

        if (audioBuffer === undefined) {
            // Error was hit and already caught
            return;
        }

        if (stop || soundTouch !== null) {
            soundTouch.stop();
        }
        try {
            audioCtx.setSinkId(audioDestination);
        } catch(err) {}

        soundTouch = window.createSoundTouchNode(audioCtx, AudioWorkletNode, audioBuffer);
        soundTouch.on('initialized', function() {
            soundTouch.connectToBuffer(); // AudioBuffer goes to SoundTouchNode
            let gainNode = new GainNode(audioCtx, { gain: vtsState.volume / 100.0 });
            soundTouch.connect(gainNode); // SoundTouch goes to the GainNode
            gainNode.connect(audioCtx.destination); // GainNode goes to the AudioDestinationNode
            soundTouch.tempo = Math.pow(4, rate - 1); // Rate from 0.25 to 4.0
            soundTouch.pitchSemitones = (pitch - 1) * 24; // Four octaves of pitch

            soundTouch.play().catch((err) => {
                speechPlaying = false;
                // ~console.info("error playTTS");
                console.error(err);
                const errorMsg = "Voice may not be available. Try another output voice.";
                console.error(errorMsg);
                updateOutputStatus(errorMsg);
            });
        });

        soundTouch.on('end', onPlaybackEnded);
    } else {
        audio.setAttribute('src', audioURL);
        if (stop) {
            audio.load();
        }
        try {
            audio.setSinkId(audioDestination);
        } catch(err) {}
        audio.volume = vtsState.volume / 100.0;
        speechPlaying = true;
        audio.onended = onPlaybackEnded;

        audio.preservesPitch = preservePitch;
        audio.playbackRate = rate;
        audio.play().then(() => {
            // ~console.info("response");
            timeoutTimes = 0;
        })
        .catch(err => onPlaybackError(err, audioURL));
    }
}

async function playTTSInput() {
    const speech = $ttsInput.val();
    if (speech !== "") {
        $ttsInput.val("");
        playTTS([speech], true, false, true);
    }
}

async function playTTS(speech, useTts, interimAddition = false, padSpacing = true) {
    // Update device names
    await setupMediaDevices();

    if (speech.length === 0 || (buttonState !== 1 && useTts == false)) {
        return;
    }

    try {
        const inputLang = getInputLang();
        let outputLang = getOutputLang();

        let { voiceSet, outputVoice, translationLang } = getSeparateOutputVoice();

        // Remove empty strings
        let speechRaw = speech.filter(el => el).join(' ');

        // Do not apply replacements if tts is enabled
        let speechText = useTts ? speechRaw : applyReplacements(speechRaw);
        
        let untranslatedSpeechText = speechText;
        let translatedSpeechText = "";
        let translateSuccess = false;
        if (vtsState.translateEnabled) {
            if (outputLang !== null && !matchOutputLang(inputLang, outputLang)) {
                // Don't translate if same language
                try {
                    translatedSpeechText = await getTranslation(
                        findMatchingOutputLang(inputLang),
                        outputLang,
                        speechText,
                    );
                    translateSuccess = true;
                } catch (err) {
                    const errorMsg = "Failed to get translation";
                    console.error(errorMsg);
                    updateOutputStatus(errorMsg);
                    throw err;
                }
            }

            if (translateSuccess && !vtsState.speakInputEnabled) {
                speechText = translatedSpeechText;
            }
        }

        const speechEncoded = encodeURI(speechText);

        const noSpeech = speechText.trim() === "";
        const noSpeechEncoded = speechEncoded.trim() === "";
        const noSpeechIntentional = noSpeech && speechRaw.trim() !== "";

        if (useTts || !noSpeech || noSpeechIntentional) {
            console.info(`Speech: ${speechText}`);
            if (vtsState.socketEnabled) {
                let socketInputLang = findMatchingOutputLang(inputLang);
                let socketOutputLang = outputLang;
                if (socketOutputLang === null) {
                    socketOutputLang = findMatchingOutputLang(outputVoice);
                }
                socket.emit('speech', speechText, untranslatedSpeechText, translatedSpeechText, socketInputLang, socketOutputLang, vtsState.translateEnabled, vtsState.lowlatencyEnabled, useTts, interimAddition, padSpacing);
            }
        }

        if ((useTts && noSpeech) || (!useTts && noSpeechIntentional) || (!useTts && noSpeechEncoded && !noSpeech)) {
            appendTranscript(speechText, untranslatedSpeechText, inputLang, outputLang, "");
        } else if (!noSpeech && !noSpeechEncoded) {
            let audioURL = "";
            switch (voiceSet) {
                case voiceSetMapping.voiceSetA:
                    // Example: https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en-US&q=hello
                    audioURL = `a:https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${outputVoice}&q=${speechEncoded}|${vtsState.rate}|${vtsState.preservePitchEnabled}`;
                    break;
                case voiceSetMapping.voiceSetB:
                    // Example: https://texttospeech.responsivevoice.org/v1/text:synthesize?text=hello&lang=en-US&gender=male&engine=g3&name=&pitch=0.5&rate=0.5&volume=1&key=kvfbSITh
                    audioURL = `b:https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${speechEncoded}&lang=${outputVoice}&engine=g3&name=&pitch=${vtsState.pitch / 2.0}&rate=${vtsState.rate / 2.0}&volume=1&key=kvfbSITh`
                    break;
                case voiceSetMapping.voiceSetC:
                    // Example: https://api.streamelements.com/kappa/v2/speech?voice=Justin&text=hello
                    audioURL = `c:https://api.streamelements.com/kappa/v2/speech?voice=${outputVoice}&text=${speechEncoded}|${vtsState.rate}|${vtsState.pitch}`;
                    break;
                case voiceSetMapping.voiceSetD:
                    // Example: https://api.streamelements.com/kappa/v2/speech?voice=en-US-Wavenet-A&text=hello
                    audioURL = `d:https://api.streamelements.com/kappa/v2/speech?voice=${outputVoice}&text=${speechEncoded}|${vtsState.rate}|${vtsState.pitch}`;
                    break;
                case voiceSetMapping.voiceSetE:
                    // Using TikTok voice set
                    audioURL = `e:${speechText}|${outputVoice}|${vtsState.rate}|${vtsState.pitch}`;
                    break;
                case voiceSetMapping.voiceSetS:
                    // Using native speech synthesis
                    if (outputVoice.toLowerCase().includes('google')) {
                        let rateAdjusted = vtsState.rate;
                        if (rateAdjusted > 1) {
                            // Adjust to strech 1 to 1.3 into 1 to 2
                            rateAdjusted = 1 + Math.log10(vtsState.rate);
                        }
                        audioURL = `s:${speechText}|${rateAdjusted}|${Math.max(vtsState.pitch, 0.1)}|${outputVoice}`;
                    } else {
                        audioURL = `s:${speechText}|${vtsState.rate}|${vtsState.pitch}|${outputVoice}`;
                    }
                    break;
            }

            if (vtsState.translateEnabled && translateSuccess) {
                appendTranscript(translatedSpeechText, untranslatedSpeechText, inputLang, outputLang, audioURL);
            } else {
                appendTranscript(speechText, untranslatedSpeechText, inputLang, outputLang, audioURL);
            }
            playAudio(audioURL, false, false);
        }
    } catch (err) {
        // ~console.info("error playTTS");
        console.error(err);
        speechPlaying = false;
    }
}

async function playBufferedTTS(speech, interimAddition = false, split = true) {
    if (split) {
        speech = speech.split(' ');
    }
    // ~console.info("buffered tts");
    speechBuffer.push(speech);
    while (speechPlaying) {
        // Repeatedly delay 100ms if speech continues playing
        await wait(100);
    }
    padSpacing = false;
    if (interimAddition) {
        padSpacing = !split;
    }
    playTTS(speechBuffer.shift(), false, interimAddition, padSpacing);
}

// // intspeech = interim_speech
// let lastIntspeechList = [];
// let intspeechIndex = 0;
// let lastIntspeech = '';
// let intspeechLength = 0;

// async function playSpacedLangTTS(intspeech) {
//     let intspeechList = intspeech.split(' ');
//     // Remove empty strings
//     intspeechList = intspeechList.filter(el => el);

//     // Reset if intspeech was cleared out
//     if (intspeechList.length === 0) {
//         intspeechIndex = 0;
//     }

//     // Validate based on spacing
//     // Store the index of new appended speech in the list
//     const currIntspeechIndex = intspeechIndex;
//     lastIntspeechList = intspeechList;

//     // Wait a predefined time to check for silence before speaking interim speech
//     await wait(vtsState.latency);

//     // If the interim speech did not change after the wait, there was enough silence to begin speaking
//     if (intspeechList === lastIntspeechList || (currIntspeechIndex > 0 &&)) {
//         intspeechIndex = intspeechList.length;
//         const interimAddition = currIntspeechIndex > 0;
//         playBufferedTTS(intspeechList.splice(currIntspeechIndex), interimAddition, false);
//     }
// }

// async function playNonSpacedLangTTS(intspeech) {
//     // Reset if intspeech was cleared out
//     if (intspeech.length === 0) {
//         intspeechLength = 0;
//     }

//     // Validate based on length
//     // Store the length of new appended speech in the string
//     const currIntspeechLength = intspeechLength;
//     lastIntspeech = intspeech;

//     // Wait a predefined time to check for silence before speaking interim speech
//     await wait(vtsState.latency);

//     // If the interim speech did not change after the wait, there was enough silence to begin speaking
//     if (lastIntspeech === intspeech && intspeechLength < intspeech.length) {
//         intspeechLength = intspeech.length;
//         const interimAddition = currIntspeechLength > 0;
//         playBufferedTTS(intspeech.slice(currIntspeechLength), interimAddition, true);
//     }
// }

let latestIntspeechIndex = 0;
let latestIntspeechList = [];
let intspeechTimeoutList = [];

function resetIntspeechState() {
    latestIntspeechList = [];
    latestIntspeechIndex = 0;
    intspeechTimeoutList.forEach(intspeechTimeout => clearTimeout(intspeechTimeout));
    intspeechTimeoutList = [];
}

async function playSpacedLangTTS(intspeech) {
    // Validate interim speech based on language with spacing
    let intspeechList = intspeech.split(' ').filter(el => el);
    playInterimTTSHelper(intspeechList, false);
}

async function playNonSpacedLangTTS(intspeech) {
    // Validate interim speech based on language with no spacing
    playInterimTTSHelper(intspeech, true);
}

async function playInterimTTSHelper(intspeechList, nonSpacedLang = false) {
    if (intspeechList.length === 0) {
        if (latestIntspeechList.length > 0) {
            // If intspeech was cleared out and latest intspeech exists, reset state and read the latest intspeech immediately
            let intspeechList = latestIntspeechList;
            let intspeechIndex = latestIntspeechIndex;

            resetIntspeechState();

            const interimAddition = intspeechIndex > 0;
            playBufferedTTS(intspeechList.slice(intspeechIndex), interimAddition, nonSpacedLang);
        } else {
            // If intspeech was cleared out and there is nothing to say, reset state
            resetIntspeechState();
        }
    } else if (intspeechList.length > 0) {
        // Store the index of new appended speech in the list
        latestIntspeechList = intspeechList;

        // Wait a predefined time to check for silence before speaking interim speech
        const intspeechTimeout = setTimeout(() => {
            // If the interim speech did not change after the wait, there was enough silence to begin speaking
            if (intspeechList === latestIntspeechList) {
                let intspeechIndex = latestIntspeechIndex;
                latestIntspeechIndex = intspeechList.length;

                const interimAddition = intspeechIndex > 0;
                playBufferedTTS(intspeechList.slice(intspeechIndex), interimAddition, nonSpacedLang);
            }
        }, vtsState.latency);

        intspeechTimeoutList.push(intspeechTimeout);
    }
}

async function playInterimTTS(intspeech) {
    intspeech = intspeech.trim();
    // ~console.info(intspeech);

    // Check for validation type
    if (isSpacedLang(getInputLang())) {
        playSpacedLangTTS(intspeech);
    } else {
        playNonSpacedLangTTS(intspeech);
    }
}

/*
const twoLine = /\n\n/g;
const oneLine = /\n/g;
function linebreak(s) {
    return s.replace(twoLine, '<p></p>').replace(oneLine, '<br>');
}

const first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, m => m.toUpperCase());
}
*/

let outputStatusTimeout = null;
async function updateOutputStatus(text) {
    outputStatus.textContent = `Status: ${text}`;
    clearTimeout(outputStatusTimeout);
    outputStatusTimeout = setTimeout(() => {
        outputStatus.textContent = 'Status: —';
    }, 3000);
}

let lastInterimTranscript = '';

function testSpeech() {
    // startButton.disabled = true;
    // startButton.textContent = 'In progress';

    // To ensure case consistency while checking with the returned output text
    // outputSpeechStatus.textContent = '...diagnostic messages';

    recognition.lang = getInputLang();
    if (vtsState.lowlatencyEnabled) {
        recognition.continuous = true;
        recognition.interimResults = true;
    } else {
        recognition.continuous = false;
        recognition.interimResults = false;
    }
    recognition.maxAlternatives = 1;

    try {
        recognition.start();
    } catch (err) {
        // Do nothing
    }

    // Reset intspeech state on start to avoid reading old intspeech
    // intspeechIndex = 0;
    // intspeechLength = 0;
    resetIntspeechState();

    recognition.onresult = function onresult(event) {
        console.info('SpeechRecognition.onresult');
        updateOutputStatus('speech result');
        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
        // It has a getter so it can be accessed like an array
        // The first [0] returns the SpeechRecognitionResult at position 0.
        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative
        // objects that contain individual results.
        // These also have getters so they can be accessed like arrays.
        // The second [0] returns the SpeechRecognitionAlternative at position 0.
        // We then return the transcript property of the SpeechRecognitionAlternative object

        /* if (typeof(event.results) === 'undefined') {
            recognition.onend = null;
            recognition.stop();
            upgrade();
            return;
        } */

        if (vtsState.lowlatencyEnabled) {
            let interimTranscript = '';

            // Initially intspeechIndex is set to 0 on start
            // interimTranscript is reset to length 0 during silence, which resets intspeechIndex to 0
            // Any words will increase the index to 1 and above
            // This ensures words will not be missed when being read
            for (let i = event.resultIndex; i < event.results.length; i += 1) {
                if (event.results[i].isFinal) {
                    // ~final_transcript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // ~final_transcript = capitalize(final_transcript);
            // ~final_span.innerHTML = linebreak(final_transcript);
            // ~interim_span.innerHTML = linebreak(interimTranscript);
            /* if (final_transcript || interimTranscript) {
                showButtons('inline-block');
            } */
            // ~console.info(interimTranscript);

            if (buttonState === 1) {
                // let speechResult = event.results[0][0].transcript;
                let speechResult = interimTranscript;
                // let confidenceResult = event.results[event.results.length - 1][0].confidence;
                if (speechResult === '') {
                    // if (lastInterimTranscript !== '') {
                    //     speechResult = lastInterimTranscript;
                    //     lastInterimTranscript = '';
                    //     console.info('last');
                    //     console.info(speechResult);
                    //     playInterimTTS(speechResult);
                    // } else {
                    //     console.info('wtf');
                    //     lastInterimTranscript = '';
                    //     speechResult = '—';
                    //     // confidenceResult = '—';
                    // }
                    // playInterimTTS('');

                    speechResult = '—';
                    playInterimTTS('');
                } else {
                    // lastInterimTranscript = speechResult;
                    playInterimTTS(speechResult);
                }
                outputSpeechStatus.textContent = `Speech received: ${speechResult}`;
                // outputConfidence.textContent = `Confidence: ${confidenceResult}`;
            }
        } else if (buttonState === 1) {
            let speechResult = event.results[event.results.length - 1][0].transcript;
            // let confidenceResult = event.results[0][0].confidence;
            if (speechResult === '') {
                speechResult = '—';
                // confidenceResult = '—';
            } else {
                playBufferedTTS(speechResult, false, true);
            }
            outputSpeechStatus.textContent = `Speech received: ${speechResult}`;
            // outputConfidence.textContent = `Confidence: ${confidenceResult}`;
        }
    };

    recognition.onspeechend = function onspeechend() {
        // recognition.stop();
        console.info('SpeechRecognition.speechend');
        updateOutputStatus('speech ended');
        // startButton.disabled = false;
        // startButton.textContent = 'Start';
        if (buttonState === 1) {
            restartSpeech();
        }
    };

    recognition.onerror = function onerror(event) {
        // startButton.disabled = false;
        // startButton.textContent = 'Start';
        console.info('SpeechRecognition.error');
        console.info(`Error: ${event.error}`);
        updateOutputStatus('recognition error');
        if (buttonState === 1) {
            outputSpeechStatus.textContent = `Error occurred in recognition: ${event.error}`;
            if (event.error === 'audio-capture') {
                startButton.click();
            } else {
                restartSpeech();
            }
        }
    };

    recognition.onaudiostart = function onaudiostart() {
        // Fired when the user agent has started to capture audio.
        console.info('SpeechRecognition.audiostart');
        updateOutputStatus('audio capture started');
    };

    recognition.onaudioend = function onaudioend() {
        // Fired when the user agent has finished capturing audio.
        console.info('SpeechRecognition.audioend');
        updateOutputStatus('audio capture ended');
        if (buttonState === 1) {
            restartSpeech();
        }
    };

    recognition.onend = function onend() {
        // Fired when the speech recognition service has disconnected.
        console.info('SpeechRecognition.end');
        updateOutputStatus('recognition ended');

        if (buttonState === -1) {
            console.info('SpeechRecognition.stopped');
            updateOutputStatus('recognition stopped');
            if (vtsState.socketEnabled) {
                socket.emit('status', 'stopped');
            }
            buttonState = 0;
            outputSpeechStatus.textContent = 'Speech received: —';
            startButtonInfo.textContent = 'Press start to begin speech recognition';
            startButton.textContent = 'Start';
            startButton.disabled = false;
            recognition.stop();
        }
    };

    recognition.onnomatch = function onnomatch() {
        // Fired when the speech recognition service returns a final result
        // with no significant recognition. This may involve some degree of
        // recognition, which doesn't meet or exceed the confidence threshold.
        console.info('SpeechRecognition.nomatch');
        updateOutputStatus('recognition failed');
    };

    recognition.onsoundstart = function onsoundstart() {
        // Fired when any sound — recognisable speech or not — has been detected.
        if (buttonState === 1) {
            console.info('SpeechRecognition.soundstart');
            updateOutputStatus('sound detected');
        }
    };

    recognition.onsoundend = function onsoundend() {
        // Fired when any sound — recognisable speech or not — has stopped being detected.
        if (buttonState === 1) {
            console.info('SpeechRecognition.soundend');
            updateOutputStatus('sound ended');
            if (vtsState.socketEnabled) {
                socket.emit('status', 'soundend');
            }
        }
    };

    recognition.onspeechstart = function onspeechstart() {
        // Fired when sound that is recognised by the speech
        // recognition service as speech has been detected.
        if (buttonState === 1) {
            console.info('SpeechRecognition.speechstart');
            updateOutputStatus('speech detected');
            if (vtsState.socketEnabled) {
                socket.emit('status', 'speechstart');
            }
        }
    };

    recognition.onstart = function onstart() {
        // Fired when the speech recognition service has begun
        // listening to incoming audio with intent to recognize
        // grammars associated with the current SpeechRecognition.
        console.info('SpeechRecognition.start');
        updateOutputStatus('recognition started');
    };
}

function resetOptions() {
    if (tabSettings.classList.contains('active')) {
        $resetSettingsModal.modal('show');
    } else if (tabReplacements.classList.contains('active')) {
        $resetReplacementsModal.modal('show');
    }
}

function resetSettings() {
    $resetSettingsModal.modal('hide');
    $resetSettingsNag.nag({
        storageMethod: null,
        persist: true,
        displayTime: 2000
    }).nag('show');

    for (const key of Object.keys({...window.localStorage})) {
        if (key.startsWith('vts-') && key !== storageItemKeys.replacements) {
            window.localStorage.removeItem(key);
        }
    }

    getStorageItemsAndUpdate();
}

function resetReplacements() {
    $resetReplacementsModal.modal('hide');
    $resetReplacementsNag.nag({
        storageMethod: null,
        persist: true,
        displayTime: 2000
    }).nag('show');

    window.localStorage.removeItem(storageItemKeys.replacements);

    getStorageItemsAndUpdate();
    resetReplacementsList();
}

function cleanStorageItems() {
    for (const key of Object.keys({...window.localStorage})) {
        if (key.startsWith('vts-') && !Object.values(storageItemKeys).includes(key)) {
            window.localStorage.removeItem(key);
        }
    }
}

function getStorageItemsAndUpdate() {
    getLanguageStorageItemsAndUpdate();
    getOuputDeviceStorageItemAndUpdate();
    getSliderStorageItemsAndUpdate();

    if (getBooleanStorageItem(storageItemKeys.muteEnabled, false) !== vtsState.muteEnabled) {
        $muteButton.click();
    }

    if (getBooleanStorageItem(storageItemKeys.preservePitchEnabled, true) !== vtsState.preservePitchEnabled) {
        $preservePitchButton.click();
    }

    if (getBooleanStorageItem(storageItemKeys.transcriptEnabled, true) !== vtsState.transcriptEnabled) {
        $transcriptButton.click();
    }

    if (getBooleanStorageItem(storageItemKeys.socketEnabled, true) !== vtsState.socketEnabled) {
        $socketButton.click();
    }

    if (getBooleanStorageItem(storageItemKeys.ttsEnabled, true) !== vtsState.ttsEnabled) {
        $ttsButton.click();
    }

    if (getBooleanStorageItem(storageItemKeys.statusEnabled, true) !== vtsState.statusEnabled) {
        $statusButton.click();
    }

    if (getBooleanStorageItem(storageItemKeys.lowlatencyEnabled, true) !== vtsState.lowlatencyEnabled) {
        $lowlatencyButton.click();
    }

    if (getBooleanStorageItem(storageItemKeys.syncLanguageEnabled, true) !== vtsState.syncLanguageEnabled) {
        $syncLanguageButton.click();
    }

    if (getBooleanStorageItem(storageItemKeys.translateEnabled, false) !== vtsState.translateEnabled) {
        $translateButton.click();
    }

    if (getBooleanStorageItem(storageItemKeys.speakInputEnabled, false) !== vtsState.speakInputEnabled) {
        if ($speakInputButton.prop('disabled')) {
            $speakInputButton.prop('disabled', false);
            $speakInputButton.click();
            $speakInputButton.prop('disabled', true);
        } else {
            $speakInputButton.click();
        }
    }

    if (getBooleanStorageItem(storageItemKeys.timestampsEnabled, true) !== vtsState.timestampsEnabled) {
        $timestampsButton.click();
    }

    if (getBooleanStorageItem(storageItemKeys.translationsEnabled, true) !== vtsState.translationsEnabled) {
        $translationsButton.click();
    }

    vtsState.latency = getNumericStorageItem(storageItemKeys.latency, defaultVtsState.latency);
    latencyInput.value = vtsState.latency;

    vtsState.socketAddress = getStringStorageItem(storageItemKeys.socketAddress, defaultVtsState.socketAddress);
    socketAddressInput.value = vtsState.socketAddress;

    vtsState.socketPort = getNumericStorageItem(storageItemKeys.socketPort, defaultVtsState.socketPort);
    socketPortInput.value = vtsState.socketPort;

    setupSocket();
}

cleanStorageItems();
getStorageItemsAndUpdate();
