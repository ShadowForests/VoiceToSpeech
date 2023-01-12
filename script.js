var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition || mozSpeechRecognition || msSpeechRecognition;
// var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList || mozSpeechGrammarList || msSpeechGrammarList;
// var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent || mozSpeechGrammarList || msSpeechGrammarList;

console.log = function disableLog() {};

const socket = io.connect('http://localhost:3000');

socket.on('connect_error', () => {
    console.info(
        'SOCKET: Restart to reconnect socket if using a personal server.',
    );
    socket.disconnect();
});

function setCookie(cname, cvalue) {
    Cookies.set(cname, cvalue, { expires: 365 });
}

function getNumericCookie(cname, cdefault) {
    let result = parseFloat(Cookies.get(cname));
    return isNaN(result) || result === undefined ? cdefault : result;
}

function getBooleanCookie(cname, cdefault) {
    let result = Cookies.get(cname);
    return result === undefined ? cdefault : result === "true";
}

function getStringCookie(cname, cdefault) {
    let result = Cookies.get(cname);
    return result === undefined ? cdefault : result;
}

const diagnosticPara = document.querySelector('label#outputDiag');
const outputConfidence = document.querySelector('label#outputConfidence');
const diagnostics = document.querySelector('p#diagnostics');
const testButtonInfo = document.querySelector('p#testButtonInfo');
const testButton = document.querySelector('button#testButton');
const outputVoiceText = document.querySelector('p#outputVoiceText');
const audioOutputText = document.querySelector('p#audioOutputText');
const $optionsButton = $('button#optionsButton');
const $ttsInput = $('input#ttsInput');
const $transcriptButton = $('input#transcriptCheckbox');
const $toggleTimestampsButton = $('div#toggleTimestampsButton');
const $clearTranscriptButton = $('div#clearTranscriptButton');
const $socketButton = $('input#socketCheckbox')
const $ttsButton = $('input#ttsCheckbox');
const $diagnosticsButton = $('input#diagnosticsCheckbox');
const $lowlatencyButton = $('input#lowlatencyCheckbox');
const $translateButton = $('input#translateCheckbox');
const transcriptHeader = document.querySelector('div#transcriptHeader');
const transcript = document.querySelector('div#transcript');
const ttsHeader = document.querySelector('div#ttsHeader');
const ttsArea = document.querySelector('div#ttsArea');
const audioInputSelect = document.querySelector('select#audioSource');
const audioOutputSelect = document.querySelector('select#audioOutput');
const selectors = [audioInputSelect, audioOutputSelect];
const langInputSelect = document.querySelector('select#searchSelectInput');
const langOutputSelect = document.querySelector('select#searchSelectOutput');

const $volumeSlider = $('#volumeSlider');
const $volumeMute = $('#volumeMute');
const $volumeFill = $('#volumeFill');
const $volumeThumb = $('#volumeThumb');
const $pitchSlider = $('#pitchSlider');
const $pitchThumb = $('#pitchThumb');
const $rateSlider = $('#rateSlider');
const $rateThumb = $('#rateThumb');
const $pitchSliderSS = $('#pitchSliderSS');
const $pitchThumbSS = $('#pitchThumbSS');
const $rateSliderSS = $('#rateSliderSS');
const $rateThumbSS = $('#rateThumbSS');

let socketEnabled = true;
let timestampsEnabled = true;
let speakOriginalText = true;
let buttonState = 0;
let translateApi = 0;
const interimWait = 300;
const audioInputSelectionDisabled = true;
let lowlatencyEnabled = $lowlatencyButton.prop('checked');
let translateEnabled = $translateButton.prop('checked');
let audio = new Audio();

let recognition = new SpeechRecognition();

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
    [
        'yue-Hant-HK',
        'Chinese, Cantonese (Traditional, Hong Kong)',
        '廣東話 (香港)',
    ],
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
    ['ar-XA', 'Arabic', 'العربية'],
    ['hy-AM', 'Armenian (Armenia)', 'Հայերեն (Հայաստան)'],
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
    ['ar-SA', 'Arabic (Saudi Arabia)', 'العربية (السعودية)'],
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
    ['es-LA:es-LA_SofiaVoice', 'es-LA_SofiaVoice (Spanish)'],
    ['pt-BR:pt-BR_IsabelaVoice', 'pt-BR_IsabelaVoice (Brazilian Portuguese)'],
    ['en-US:en-US_MichaelVoice', 'en-US_MichaelVoice (US English)'],
    ['ja-JP:ja-JP_EmiVoice', 'ja-JP_EmiVoice (Japanese)'],
    ['en-US:en-US_AllisonVoice', 'en-US_AllisonVoice (US English)'],
    ['fr-FR:fr-FR_ReneeVoice', 'fr-FR_ReneeVoice (French)'],
    ['it-IT:it-IT_FrancescaVoice', 'it-IT_FrancescaVoice (Italian)'],
    ['es-ES:es-ES_LauraVoice', 'es-ES_LauraVoice (Spanish)'],
    ['de-DE:de-DE_BirgitVoice', 'de-DE_BirgitVoice (Deutsch)'],
    ['es-ES:es-ES_EnriqueVoice', 'es-ES_EnriqueVoice (Spanish)'],
    ['de-DE:de-DE_DieterVoice', 'de-DE_DieterVoice (Deutsch)'],
    ['en-US:en-US_LisaVoice', 'en-US_LisaVoice (US English)'],
    ['en-GB:en-GB_KateVoice', 'en-GB_KateVoice (British English)'],
    ['es-US:es-US_SofiaVoice', 'es-US_SofiaVoice (US Spanish)'],
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
const translationLanguages = [
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
    langOutputSelect.appendChild(divider);
}

function addVoiceSetA() {
    // Header
    const header = document.createElement('option');
    header.value = 'header';
    // header2.text = "🔊 Language Voices"
    header.text = '🔊 Voice Set A [Default]';
    langOutputSelect.appendChild(header);

    for (let i = 0; i < outputVoices.length; ++i) {
        const option = document.createElement('option');
        option.value = "a" + outputVoices[i][0];
        option.text = outputVoices[i][1];
        langOutputSelect.appendChild(option);
    }
}

function addVoiceSetB() {
    // Header
    const header = document.createElement('option');
    header.value = 'header';
    header.text = '🔊 Voice Set B [Special]';
    langOutputSelect.appendChild(header);

    for (let i = 0; i < rvVoices.length; i += 1) {
        const option = document.createElement('option');
        option.value = "b" + rvVoices[i][0];
        option.text = rvVoices[i][1];
        langOutputSelect.appendChild(option);
    }
}

function addVoiceSetC() {
    // Header
    const header = document.createElement('option');
    header.value = 'header';
    header.text = '🔊 Voice Set C [StreamElements]';
    langOutputSelect.appendChild(header);

    for (let i = 0; i < seVoices.length; i += 1) {
      const option = document.createElement('option');
      option.value = "c" + seVoices[i][0];
      option.text = seVoices[i][1];
      langOutputSelect.appendChild(option);
    }
}

function addVoiceSetD() {
    // Header
    const header = document.createElement('option');
    header.value = 'header';
    header.text = '🔊 Voice Set D [WaveNet]';
    langOutputSelect.appendChild(header);

    for (let i = 0; i < seVoices2.length; i += 1) {
      const option = document.createElement('option');
      option.value = "d" + seVoices2[i][0];
      option.text = seVoices2[i][1];
      langOutputSelect.appendChild(option);
    }
}

function addVoiceSetE() {
    // Header
    const header = document.createElement('option');
    header.value = 'header';
    header.text = '🔊 Voice Set E [TikTok]';
    langOutputSelect.appendChild(header);

    for (let i = 0; i < ttVoices.length; i += 1) {
      const option = document.createElement('option');
      option.value = "e" + ttVoices[i][0];
      option.text = ttVoices[i][1];
      langOutputSelect.appendChild(option);
    }
}

function addVoiceSetBuiltin() {
        // Header
        const header = document.createElement('option');
        header.value = 'header';
        header.text = "🔊 Built-in Voices"
        langOutputSelect.appendChild(header);

        // Speech Synthesis Voices
        const voices = speechSynthesis.getVoices();
        for(i = 0; i < voices.length ; i += 1) {
            const option = document.createElement('option');
            option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
            option.value = "s" + `${i}:${voices[i].name}`;
            option.text = voices[i].name;
            try {
                // Remap name
                option.text = builtinLangMapping[option.text][0];
            } catch (err) {}
            langOutputSelect.appendChild(option);
        }
        speechSynthesis.onvoiceschanged = null;
}

// Fill languages
function gotLanguages() {
    removeAllChildNodes(langInputSelect);
    removeAllChildNodes(langOutputSelect);

    // Input Languages
    for (let i = 0; i < inputLangs.length; i += 1) {
        const option = document.createElement('option');
        option.value = inputLangs[i][0];
        if (inputLangs[i][1] === inputLangs[i][2]) {
            option.text = `${inputLangs[i][1]}`;
        } else {
            option.text = `${inputLangs[i][1]} [${inputLangs[i][2]}]`;
        }
        langInputSelect.appendChild(option);
    }

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

    // Set default lang selections
    langInputSelect.selectedIndex = getNumericCookie('vts-langInputSelect', 45);
    langOutputSelect.selectedIndex = getNumericCookie('vts-langOutputSelect', 24);
    updateOutputLangOptions();
}

function fillLanguages() {
    gotLanguages(inputLangs, outputVoices);
}

fillLanguages();
speechSynthesis.onvoiceschanged = fillLanguages;

// gotLanguages(inputLangs, outputVoices);

function getInputLang() {
    return langInputSelect.options[langInputSelect.selectedIndex].value;
}

function getOutputLang() {
    /*
    let outputLang = langOutputSelect.options[langOutputSelect.selectedIndex].value;
    if (outputLang.slice(0,1) === "s") {
        // Device Voices
        outputLang = outputLang.slice(outputLang.search(":")+1);
    }
    return outputLang;
    */
    return langOutputSelect.options[langOutputSelect.selectedIndex].value;
}

function getSpeechSynthesisVoice(outputLang) {
    outputLang = outputLang.slice(outputLang.search(":")+1);
    return speechSynthesis.getVoices().filter(function(voice) { return voice.name == outputLang; })[0];
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

// Set default language / dialect
/*
for (let i = 0; i < langs.length; i++) {
    select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 10;
updateCountry();
select_dialect.selectedIndex = 11;
*/

// Utility

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

$('.dropdown').dropdown({ fullTextSearch: 'exact' });
// .dropdown()

let mute = false;

let volume = 100;
let pitch = 1.0;
let rate = 1.0;

let volumeSliderActive = false;
let pitchSliderActive = false;
let rateSliderActive = false;

function getSliderCookiesAndUpdate() {
    volume = getNumericCookie('volume', volume);
    $volumeSlider.slider.value = volume;

    rate = getNumericCookie('rate', rate);
    $rateSlider.slider.value = rate;

    pitch = getNumericCookie('pitch', pitch);
    $pitchSlider.slider.value = pitch;
}

getSliderCookiesAndUpdate();

// Used by mute button
function toggleMute() {
    if ($volumeMute.hasClass('up')) {
        mute = true;
        $volumeMute.removeClass('up');
        $volumeMute.addClass('mute');
        $volumeMute.parent().css('margin-left', '0px !important');
        $volumeSlider.css('pointer-events', 'none');
        $volumeThumb.css('background-color', 'lightgray');
        $volumeFill.css('background-color', 'lightgray');
    } else {
        mute = false;
        $volumeMute.removeClass('mute');
        $volumeMute.addClass('up');
        $volumeSlider.css('pointer-events', 'auto');
        $volumeThumb.css('background-color', 'white');
        $volumeFill.css('background-color', 'black');
    }
    setCookie('vts-mute', mute);
}

$volumeSlider.slider({
    min: 0,
    max: 100,
    start: volume,
    step: 0,
    onMove(data) {
        volume = data.toFixed();
        setCookie('vts-volume', volume);
        try {
            $volumeThumb.popup('change content', `${volume}%`).popup('reposition');
        } catch (err) {
            // Do nothing
        }
    },
});

// Used by volume slider on mousedown
function volumeSliderMousedown() {
    volumeSliderActive = true;
    $volumeThumb
        .popup('show')
        .popup('change content', `${volume}%`)
        .popup('reposition');
}

$volumeThumb.mouseenter(() => {
    $volumeThumb
        .popup('show')
        .popup('change content', `${volume}%`)
        .popup('reposition');
});

$volumeThumb.mouseleave(() => {
    if (!volumeSliderActive) {
        $volumeThumb.popup('hide');
    }
});

$pitchSlider.slider({
    min: 0,
    max: 2,
    start: pitch,
    step: 0.1,
    onMove(data) {
        pitch = data.toFixed(1);
        setCookie('vts-pitch', pitch);
        try {
            $pitchThumb.popup('change content', `${pitch}`).popup('reposition');
        } catch (err) {
            // Do nothing
        }
    },
});

// Used by pitch slider on mousedown
function pitchSliderMousedown() {
    pitchSliderActive = true;
    $pitchThumb
        .popup('show')
        .popup('change content', `${pitch}`)
        .popup('reposition');
}

$pitchThumb.mouseenter(() => {
    $pitchThumb
        .popup('show')
        .popup('change content', `${pitch}`)
        .popup('reposition');
});

$pitchThumb.mouseleave(() => {
    if (!pitchSliderActive) {
        $pitchThumb.popup('hide');
    }
});

$rateSlider.slider({
    min: 0,
    max: 2,
    start: rate,
    step: 0.1,
    onMove(data) {
        rate = data.toFixed(1);
        setCookie('vts-rate', rate);
        try {
            $rateThumb.popup('change content', `${rate}`).popup('reposition');
        } catch (err) {
            // Do nothing
        }
    },
});

// Used by rate slider on mousedown
function rateSliderMousedown() {
    rateSliderActive = true;
    $rateThumb
        .popup('show')
        .popup('change content', `${rate}`)
        .popup('reposition');
}

$rateThumb.mouseenter(() => {
    $rateThumb
        .popup('show')
        .popup('change content', `${rate}`)
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

// Used by invalid dropdown options onclick
function resetDropdownInput(element) {
    const dropdownParent = $(element)
        .parent()
        .parent();
    dropdownParent.find('.search').val('');
    dropdownParent.dropdown(
        'set selected',
        $('select#searchSelectOutput').dropdown('get value'),
    );
}

function updateOutputLangOptions() {
    const outputLang = getOutputLang();
    const altLang = outputLang.match(new RegExp(/[a-zA-Z]+-[a-zA-Z]+(?=&)/g));
    let sLang = null;
    if (outputLang.slice(0,1) === "s") {
        // Device Voices
        sLang = outputLang.slice(outputLang.search(":") + 1);
    }
    if (altLang !== null || sLang !== null) {
        $('#extraVoiceOptions').removeAttr('style');
        audioOutputText.textContent = 'Output Device'
    } else {
        $('#extraVoiceOptions').attr('style', 'display: none !important');
        audioOutputText.textContent = 'Output Device'
    }
}

$('select#searchSelectOutput').change(() => {
    updateOutputLangOptions();
});

let initOptions = true;

$optionsButton.click(() => {
    // ~console.info(getOutputLang());
    if (initOptions) {
        // Fix broken dropdown
        $('[data-value="divider"]').addClass('divider');
        $('[data-value="divider"]').removeClass('item');
        $('[data-value="divider"]').attr('onclick', 'resetDropdownInput(this)');
        $('[data-value="divider"]').removeAttr('data-value');
        $('[data-value="header"]').addClass('header');
        $('[data-value="header"]').removeClass('item');
        $('[data-value="header"]').attr('onclick', 'resetDropdownInput(this)');
        $('[data-value="header"]').removeAttr('data-value');
        $('.search').attr(
            'onchange',
            "$('.message').attr('onclick', 'resetDropdownInput(this)');",
        );

        initOptions = false;
    }

    // Update device names
    navigator.mediaDevices
        .enumerateDevices()
        .then(gotDevices)
        .catch(handleError);

    // Modal setup
    $('.ui.modal.options-modal')
        .modal({
            autofocus: false,
            duration: 300,
        })
        .modal('show');

    // Slider setup
    $volumeThumb.popup({
        position: 'top center',
        content: `${volume}%`,
        on: 'manual',
    });

    $pitchThumb.popup({
        position: 'top center',
        content: `${pitch}`,
        on: 'manual',
    });

    $rateThumb.popup({
        position: 'top center',
        content: `${rate}`,
        on: 'manual',
    });
});

/*
function transcriptDropdown() {
    if ($transcriptButton.prop("checked")) {
        transcriptHeader.style.display = "block";
        transcript.style.display = "block";
        scrollTranscript();
    } else {
        transcriptHeader.style.display = "none";
        transcript.style.display = "none";
    }
}
*/

$ttsInput.on('keypress', function(e) {
    const code = e.keyCode || e.which;
    if (code==13) {
        playTTSInput();
    }
});

$transcriptButton.click(() => {
    if ($transcriptButton.prop('checked')) {
        transcriptHeader.style.display = 'block';
        transcript.style.display = 'block';
        scrollTranscript();
        setCookie('vts-transcriptEnabled', true);
    } else {
        transcriptHeader.style.display = 'none';
        transcript.style.display = 'none';
        setCookie('vts-transcriptEnabled', false);
    }
});

$socketButton.click(() => {
    if ($socketButton.prop('checked')) {
        socketEnabled = true;
    } else {
        socketEnabled = false;
    }
    setCookie('vts-socketEnabled', socketEnabled);
});

$toggleTimestampsButton.click(() => {
    timestampsEnabled = !timestampsEnabled;
    setCookie('vts-timestampsEnabled', timestampsEnabled);
    if (timestampsEnabled) {
        document.querySelectorAll('div#transcriptTime').forEach(e => e.style.display = "block");
    } else {
        document.querySelectorAll('div#transcriptTime').forEach(e => e.style.display = "none");
    }
});

$clearTranscriptButton.click(() => {
    while (transcript.firstChild) {
        transcript.firstChild.remove();
    }
});

$ttsButton.click(() => {
    if ($ttsButton.prop('checked')) {
        ttsHeader.style.display = 'block';
        ttsArea.style.display = 'block';
        setCookie('vts-ttsEnabled', true);
    } else {
        ttsHeader.style.display = 'none';
        ttsArea.style.display = 'none';
        setCookie('vts-ttsEnabled', false);
    }
});

$diagnosticsButton.click(() => {
    if ($diagnosticsButton.prop('checked')) {
        diagnostics.style.display = 'block';
        setCookie('vts-diagnosticsEnabled', true);
    } else {
        diagnostics.style.display = 'none';
        setCookie('vts-diagnosticsEnabled', false);
    }
});

$lowlatencyButton.click(() => {
    lowlatencyEnabled = $lowlatencyButton.prop('checked');
    setCookie('vts-lowlatencyEnabled', lowlatencyEnabled);
    if (lowlatencyEnabled && $translateButton.prop('checked')) {
        $translateButton.click();
    }
    if (buttonState === 1) {
        restartSpeech();
    }
});

$translateButton.click(() => {
    translateEnabled = $translateButton.prop('checked');
    setCookie('vts-translateEnabled', translateEnabled);
    if ($translateButton.prop('checked')) {
        if ($lowlatencyButton.prop('checked')) {
            $lowlatencyButton.click();
        }
        outputVoiceText.textContent = 'Output Language';
    } else {
        outputVoiceText.textContent = 'Output Voice';
    }
});

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

function appendTranscript(text, link) {
    // allow 1px inaccuracy by adding 1
    const isScrolledToBottom = transcript.scrollHeight - transcript.clientHeight
        <= transcript.scrollTop + 1;

    const transcriptTime = document.createElement('div');
    transcriptTime.setAttribute('id', 'transcriptTime');
    transcriptTime.setAttribute('class', 'transcript-time unselectable');
    transcriptTime.setAttribute('unselectable', 'on');
    transcriptTime.textContent = getTranscriptTime();
    if (!timestampsEnabled) {
        transcriptTime.style.display = 'none';
    }

    const transcriptText = document.createElement('div');
    transcriptText.setAttribute('class', 'transcript-text');
    transcriptText.textContent = text;

    const transcriptPlay = document.createElement('div');
    transcriptPlay.setAttribute('class', 'transcript-play unselectable');
    transcriptPlay.setAttribute('unselectable', 'on');
    transcriptPlay.setAttribute(
        'onClick',
        `playTranscriptAudio(this, "${link}", stop=true)`,
    );

    const playIcon = document.createElement('i');
    playIcon.setAttribute('class', 'play circle outline icon');
    transcriptPlay.appendChild(playIcon);

    const transcriptBody = document.createElement('div');
    transcriptBody.setAttribute('class', 'transcript-body');
    transcriptBody.appendChild(transcriptTime);
    transcriptBody.appendChild(transcriptText);
    transcriptBody.appendChild(transcriptPlay);

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
        !element.children('.transcript-play').hasClass('active-audio')
        || !element.hasClass('active-hover')
    ) {
        element.css('background-color', 'white');
        element.children('.transcript-play').css('display', 'none');
    }
}

function showTranscriptHover(element) {
    element.css('background-color', 'whitesmoke');
    element.children('.transcript-play').css('display', 'block');
}

function speechButton() {
    socket.connect();
    if (buttonState < 1) {
        // Initialize speech
        speechPlaying = false;
        audio = new Audio();
        speechBuffer = [];

        buttonState = 1;
        testButtonInfo.textContent = 'Press stop to end speech recognition';
        testButton.textContent = 'Stop';
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
        testButton.disabled = true;
        testButton.textContent = 'Stopping...';
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

function gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    const values = selectors.map(select => select.value);
    selectors.forEach((select) => {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    });
    if (audioInputSelectionDisabled) {
        const option = document.createElement('option');
        option.text = 'Set in browser';
        audioInputSelect.appendChild(option);
    }
    for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'audioinput') {
            if (!audioInputSelectionDisabled) {
                option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
                audioInputSelect.appendChild(option);
            }
        } else if (deviceInfo.kind === 'audiooutput') {
            option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
            audioOutputSelect.appendChild(option);
        } else {
            console.log('Some other kind of source/device: ', deviceInfo);
        }
    }
    selectors.forEach((select, selectorIndex) => {
        if (
            Array.prototype.slice
                .call(select.childNodes)
                .some(n => n.value === values[selectorIndex])
        ) {
            select.value = values[selectorIndex];
        }
    });

    let found = false;
    let audioOutputSelectValue = getStringCookie('vts-audioOutputSelect', audioOutputSelect.value);
    for (let option of audioOutputSelect.options) {
        if (option.value == audioOutputSelectValue) {
            audioOutputSelect.value = audioOutputSelectValue;
            found = true;
            break;
        }
    }

    if (!found) {
        audioOutputSelect.value = 'default';
    }

    changeAudioDestination();
}

let audioDestination;
function changeAudioDestination() {
    audioDestination = audioOutputSelect.value;
    setCookie('vts-audioOutputSelect', audioOutputSelect.value);
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
}

/*
function startAudioInput() {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    const audioSource = audioInputSelect.value;
    const constraints = {
        audio: {deviceId: audioSource ? {exact: audioSource} : undefined}
    };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .then(gotDevices)
        .catch(handleError);
}

//audioInputSelect.onchange = startAudioInput;
audioInputSelect.onchange = function() {
    if (buttonState === 1) {
        testSpeech();
    }
}
*/

navigator.mediaDevices
    .enumerateDevices()
    .then(gotDevices)
    .catch(handleError);

function updateLangCookies() {
    setCookie('vts-langInputSelect', langInputSelect.selectedIndex);
    setCookie('vts-langOutputSelect', langOutputSelect.selectedIndex);
}

function restartSpeech() {
    updateLangCookies();
    if (buttonState === 1) {
        recognition = new SpeechRecognition();
        testSpeech();
    }
}

audioOutputSelect.onchange = changeAudioDestination;
langInputSelect.onchange = restartSpeech;
langOutputSelect.onchange = updateLangCookies;

//

let speechPlaying = false;
let speechBuffer = [];
let timeoutTimes = 0;

// Used by transcript play button
async function playTranscriptAudio(elem, audioURL, stop = false) {
    if (!mute) {
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
            hideTranscriptHover(activeAudioElement.parent());
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
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(JSON.stringify(jsonPayload));
    });
}

async function playAudio(audioURL, stop, fromTranscript) {
    if (mute) {
        return;
    }

    if (audioURL.startsWith('ss:')) {
        // Let SpeechSynthesis handle audio queue and ignore usual transcript play stop logic
        const activeAudioElement = $('.active-audio');
        hideTranscriptHover(activeAudioElement.parent());
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
        const args = audioURL.slice(audioURL.search(":") + 1).split("|");
        msg.text = args[0];
        msg.volume = volume / 100;
        msg.rate = Math.pow(10, args[1] - 1);
        msg.pitch = args[2];
        msg.voice = getSpeechSynthesisVoice(args[3]);
        speechSynthesis.speak(msg);
        return;
    }

    if (audioURL.startsWith('tt:')) {
        const args = audioURL.slice(audioURL.search(":") + 1).split("|");
        const jsonPayload = {
            text: args[0],
            voice: args[1]
        }
        const response = await sendJsonRequest('POST', `https://tiktok-tts.weilnet.workers.dev/api/generation`, jsonPayload);
        audioURL = "data:audio/wav;base64," + JSON.parse(response).data;
    }

    audio.setAttribute('src', audioURL);
    if (stop) {
        audio.load();
    }
    try {
        audio.setSinkId(audioDestination);
    } catch(err) {}
    audio.volume = volume / 100.0;
    speechPlaying = true;
    audio.onended = function onended() {
        speechPlaying = false;
        const activeAudioElement = $('.active-audio');
        hideTranscriptHover(activeAudioElement.parent());
        try {
            activeAudioElement
                .children('i')[0]
                .setAttribute('class', 'play circle outline icon');
            activeAudioElement.removeClass('active-audio');
        } catch (err) {
            // Do nothing
        }
    };
    audio
        .play()
        .then(() => {
            // ~console.info("response");
            timeoutTimes = 0;
        })
        .catch((err) => {
            speechPlaying = false;
            // ~console.info("error playTTS");
            console.error(err);
            timeoutTimes += 1;
            if (timeoutTimes > 5) {
                timeoutTimes = 0;
            } else {
                console.info(`Trying again ${timeoutTimes}`);
                playAudio(audioURL, false, false);
            }
        });
}

async function playTTSInput() {
    const speech = $ttsInput.val();
    if (speech !== "") {
        $ttsInput.val("");
        playTTS([speech], true, false);
    }
}

async function playTTS(speech, direct, interimAddition = false, padSpacing = true) {
    // Update device names
    await navigator.mediaDevices
        .enumerateDevices()
        .then(gotDevices)
        .catch(handleError);

    // ~console.info("playTTS");
    if (speech.length === 0 || (buttonState !== 1 && direct == false)) {
        return;
    }
    try {
        // ~console.info("try playTTS");
        const inputLang = getInputLang();
        let outputLang = getOutputLang();
        let translationLang = null;
        // const altLang = outputLang.match(new RegExp(/[a-zA-Z]+-[a-zA-Z]+(?=&)/g));

        let voiceSet = outputLang.slice(0,1);
        if (voiceSet === "s") {
            // Device Voices
            outputLang = outputLang.slice(outputLang.search(":") + 1);
            translationLang = outputLang;
        } else if (voiceSet === "b") {
            outputLang = outputLang.slice(1);
            translationLang = outputLang.slice(0, outputLang.search("&"));
        } else if (voiceSet === "c" || voiceSet === "d" || voiceSet === "e") {
            outputLang = outputLang.slice(1);
            translationLang = outputLang.slice(0, outputLang.search(":"));
            outputLang = outputLang.slice(outputLang.search(":") + 1);
        } else {
            outputLang = outputLang.slice(1);
            translationLang = outputLang;
        }
        
        let untranslatedSpeechText = speech.filter(el => el).join(' ');
        if (translateEnabled) {
            let translateSuccess = false;
            // if (altLang !== null) {
            //     // Don't translate if same language
            //     if (inputLang !== altLang[0]) {
            //         speech = await getTranslation(
            //             inputLang,
            //             altLang[0],
            //             speech.join(' '),
            //         );
            //         translateSuccess = true;
            //     }
            // }
            if (translationLang !== null && inputLang !== translationLang) {
                // Don't translate if same language
                speech = await getTranslation(
                    inputLang,
                    translationLang,
                    speech.join(' '),
                );
                translateSuccess = true;
            } else if (inputLang !== outputLang) {
                // Don't translate if same language
                speech = await getTranslation(
                    inputLang,
                    outputLang,
                    speech.join(' '),
                );
                translateSuccess = true;
            }
            if (translateSuccess) {
                speech = speech.split(' ');
            }
        }
        // Remove empty strings
        speech = speech.filter(el => el);

        const speechText = speech.join(' ');
        console.info(`Speech: ${speechText}`);
        if (socketEnabled) {
            if (translationLang !== null) {
                socket.emit('speech', speechText, untranslatedSpeechText, inputLang, translationLang, translateEnabled, lowlatencyEnabled, direct, interimAddition, padSpacing);
            } else {
                socket.emit('speech', speechText, untranslatedSpeechText, inputLang, outputLang, translateEnabled, lowlatencyEnabled, direct, interimAddition, padSpacing);
            }
        }

        // speech = speech.join("-");
        speech = encodeURI(speechText);
        if (speech === "") {
            return;
        }

        let audioURL = "";
        if (voiceSet === "s") {
            // Using native speech synthesis
            if (speechText === '') {
                return;
            }
            if (outputLang.toLowerCase().includes('google')) {
                let rateAdjusted = rate;
                if (rateAdjusted > 1) {
                    // Adjust to strech 1 to 1.3 into 1 to 2
                    rateAdjusted = 1 + Math.log10(rate);
                }
                audioURL = `ss:${speechText}|${rateAdjusted}|${Math.max(pitch, 0.1)}|${outputLang}`;
            } else {
                audioURL = `ss:${speechText}|${rate}|${pitch}|${outputLang}`;
            }
        } else if (voiceSet === "a") {
            // Example: https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en-US&q=hello
            audioURL = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${outputLang}&q=${speech}`;
        } else if (voiceSet === "b") {
            // Example: https://texttospeech.responsivevoice.org/v1/text:synthesize?text=hello&lang=en-US&gender=male&engine=g3&name=&pitch=0.5&rate=0.5&volume=1&key=kvfbSITh
            audioURL = `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${speech}&lang=${outputLang}&engine=g3&name=&pitch=${pitch / 2.0}&rate=${rate / 2.0}&volume=1&key=kvfbSITh`
        } else if (voiceSet === "c") {
            // Example: https://api.streamelements.com/kappa/v2/speech?voice=Justin&text=hello
            audioURL = `https://api.streamelements.com/kappa/v2/speech?voice=${outputLang}&text=${speech}`;
        } else if (voiceSet === "d") {
            // Example: https://api.streamelements.com/kappa/v2/speech?voice=en-US-Wavenet-A&text=hello
            audioURL = `https://api.streamelements.com/kappa/v2/speech?voice=${outputLang}&text=${speech}`;
        } else if (voiceSet === "e") {
            // Using TikTok voice set
            audioURL = `tt:${speechText}|${outputLang}`;
        }

        appendTranscript(speechText, audioURL);
        playAudio(audioURL, false, false);   
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

// intspeech = interim_speech
let lastIntspeechList = [];
let intspeechIndex = 0;
let lastIntspeech = '';
let intspeechLength = 0;

async function playSpacedLangTTS(intspeech) {
    let intspeechList = intspeech.split(' ');
    // Remove empty strings
    intspeechList = intspeechList.filter(el => el);

    // Reset if intspeech was cleared out
    if (intspeechList.length === 0) {
        intspeechIndex = 0;
    }

    // Validate based on spacing
    // Store the index of new appended speech in the list
    const currIntspeechIndex = intspeechIndex;
    lastIntspeechList = intspeechList;

    // Wait a predefined time to check for silence before speaking interim speech
    await wait(interimWait);

    // If the interim speech did not change after the wait, there was enough silence to begin speaking
    if (lastIntspeechList === intspeechList) {
        intspeechIndex = intspeechList.length;
        interimAddition = currIntspeechIndex > 0;
        playBufferedTTS(intspeechList.splice(currIntspeechIndex), interimAddition, false);
    }
}

async function playNonSpacedLangTTS(intspeech) {
    // Reset if intspeech was cleared out
    if (intspeech.length === 0) {
        intspeechLength = 0;
    }

    // Validate based on length
    // Store the length of new appended speech in the string
    const currIntspeechLength = intspeechLength;
    lastIntspeech = intspeech;

    // Wait a predefined time to check for silence before speaking interim speech
    await wait(interimWait);

    // If the interim speech did not change after the wait, there was enough silence to begin speaking
    if (lastIntspeech === intspeech && intspeechLength < intspeech.length) {
        intspeechLength = intspeech.length;
        interimAddition = currIntspeechLength > 0;
        playBufferedTTS(intspeech.slice(currIntspeechLength), interimAddition, true);
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

function testSpeech() {
    // testButton.disabled = true;
    // testButton.textContent = 'In progress';

    // To ensure case consistency while checking with the returned output text
    // diagnosticPara.textContent = '...diagnostic messages';

    recognition.lang = getInputLang();
    if (lowlatencyEnabled) {
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

    // Reset intspeechIndex and intspeechLength on start
    intspeechIndex = 0;
    intspeechLength = 0;

    recognition.onresult = function onresult(event) {
        console.info('SpeechRecognition.onresult');
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

        if (lowlatencyEnabled) {
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
                let confidenceResult = event.results[event.results.length - 1][0].confidence;
                if (speechResult === '') {
                    speechResult = '—';
                    confidenceResult = '—';
                    playInterimTTS('');
                } else {
                    playInterimTTS(speechResult);
                }
                diagnosticPara.textContent = `Speech received: ${speechResult}`;
                outputConfidence.textContent = `Confidence: ${confidenceResult}`;
            }
        } else if (buttonState === 1) {
            let speechResult = event.results[0][0].transcript;
            let confidenceResult = event.results[0][0].confidence;
            if (speechResult === '') {
                speechResult = '—';
                confidenceResult = '—';
            } else {
                playBufferedTTS(speechResult, false, true);
            }
            diagnosticPara.textContent = `Speech received: ${speechResult}`;
            outputConfidence.textContent = `Confidence: ${confidenceResult}`;
        }
    };

    recognition.onspeechend = function onspeechend() {
        recognition.stop();
        // testButton.disabled = false;
        // testButton.textContent = 'Start';
        if (buttonState === 1) {
            restartSpeech();
        }
    };

    recognition.onerror = function onerror(event) {
        // testButton.disabled = false;
        // testButton.textContent = 'Start';
        console.info('SpeechRecognition.onerror');
        console.info(event);
        if (buttonState === 1) {
            diagnosticPara.textContent = `Error occurred in recognition: ${event.error}`;
            if (event.error === 'audio-capture') {
                testButton.click();
            } else {
                restartSpeech();
            }
        }
    };

    recognition.onaudiostart = function onaudiostart() {
        // Fired when the user agent has started to capture audio.
        console.info('SpeechRecognition.audiostart');
    };

    recognition.onaudioend = function onaudioend() {
        // Fired when the user agent has finished capturing audio.
        console.info('SpeechRecognition.audioend');
        if (buttonState === 1) {
            restartSpeech();
        }
    };

    recognition.onend = function onend() {
        // Fired when the speech recognition service has disconnected.
        console.info('SpeechRecognition.end');

        if (buttonState === -1) {
            console.info('SpeechRecognition.stopped');
            if (socketEnabled) {
                socket.emit('status', 'stopped');
            }
            buttonState = 0;
            testButtonInfo.textContent = 'Press start to begin speech recognition';
            testButton.textContent = 'Start';
            testButton.disabled = false;
            recognition.stop();
        }
    };

    recognition.onnomatch = function onnomatch() {
        // Fired when the speech recognition service returns a final result
        // with no significant recognition. This may involve some degree of
        // recognition, which doesn't meet or exceed the confidence threshold.
        console.info('SpeechRecognition.nomatch');
    };

    recognition.onsoundstart = function onsoundstart() {
        // Fired when any sound — recognisable speech or not — has been detected.
        if (buttonState === 1) {
            console.info('SpeechRecognition.soundstart');
        }
    };

    recognition.onsoundend = function onsoundend() {
        // Fired when any sound — recognisable speech or not — has stopped being detected.
        if (buttonState === 1) {
            console.info('SpeechRecognition.soundend');
            if (socketEnabled) {
                socket.emit('status', 'soundend');
            }
        }
    };

    recognition.onspeechstart = function onspeechstart() {
        // Fired when sound that is recognised by the speech
        // recognition service as speech has been detected.
        if (buttonState === 1) {
            console.info('SpeechRecognition.speechstart');
            if (socketEnabled) {
                socket.emit('status', 'speechstart');
            }
        }
    };

    recognition.onstart = function onstart() {
        // Fired when the speech recognition service has begun
        // listening to incoming audio with intent to recognize
        // grammars associated with the current SpeechRecognition.
        console.info('SpeechRecognition.start');
    };
}

testButton.addEventListener('click', speechButton);
// optionsButton.addEventListener('click', toggleOptions);
// transcriptButton.addEventListener('click', toggleTranscript);

function resetOptions() {
    for (const key of Object.keys(Cookies.get())) {
        if (key.startsWith('vts-')) {
            Cookies.remove(key);
        }
    }

    getCookiesAndUpdate();
}

async function getCookiesAndUpdate() {
    if (getBooleanCookie('vts-mute', true) && !mute) {
        toggleMute();
    }

    if (!getBooleanCookie('vts-transcriptEnabled', true)) {
        $transcriptButton.click();
    }

    if (!getBooleanCookie('vts-socketEnabled', true) && socketEnabled) {
        $socketButton.click();
    }

    if (!getBooleanCookie('vts-ttsEnabled', true)) {
        $ttsButton.click();
    }

    if (!getBooleanCookie('vts-diagnosticsEnabled', true)) {
        $diagnosticsButton.click();
    }

    if (!getBooleanCookie('vts-lowlatencyEnabled', true) && lowlatencyEnabled) {
        $lowlatencyButton.click();
    }

    if (getBooleanCookie('vts-translateEnabled', false) && !translateEnabled) {
        $translateButton.click();
    }

    if (!getBooleanCookie('vts-timestampsEnabled', true) && timestampsEnabled) {
        $toggleTimestampsButton.click();
    }
}

getCookiesAndUpdate();
