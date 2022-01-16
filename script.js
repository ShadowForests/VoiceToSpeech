var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

console.log = function disableLog() {};

const socket = io.connect('http://localhost:3000');

socket.on('connect_error', () => {
  console.info(
    'SOCKET: Restart to reconnect socket if using a personal server.',
  );
  socket.disconnect();
});

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
const $timestampsButton = $('input#timestampsCheckbox');
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
  ['zh', 'Chinese, Mandarin (Simplified, China)', '普通话 (中国大陆)'],
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
  [
    'yue-Hant-HK',
    'Chinese, Cantonese (Traditional, Hong Kong)',
    '廣東話 (香港)',
  ],
  ['ja-JP', 'Japanese (Japan)', '日本語（日本）'],
  ['zh-HK', 'Chinese, Mandarin (Simplified, Hong Kong)', '普通話 (香港)'],
  ['zh', 'Chinese, Mandarin (Simplified, China)', '普通话 (中国大陆)'],
];

const outputLangs = [
  ['af-ZA', 'Afrikaans (South Africa)', 'Afrikaans (Suid-Afrika)'],
  // ~["am-ET", "Amharic (Ethiopia)", "አማርኛ (ኢትዮጵያ)"],
  ['hy-AM', 'Armenian (Armenia)', 'Հայ (Հայաստան)'],
  // ~["az-AZ", "Azerbaijani (Azerbaijan)", "Azərbaycan (Azərbaycan)"],
  ['id-ID', 'Indonesian (Indonesia)', 'Bahasa Indonesia (Indonesia)'],
  // ~["ms-MY", "Malay (Malaysia)", "Bahasa Melayu (Malaysia)"],
  ['bn-BD', 'Bengali (Bangladesh)', 'বাংলা (বাংলাদেশ)'],
  ['bn-IN', 'Bengali (India)', 'বাংলা (ভারত)'],
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
  ['fil-PH', 'Filipino (Philippines)', 'Filipino (Pilipinas)'],
  ['fr-CA', 'French (Canada)', 'Français (Canada)'],
  ['fr-FR', 'French (France)', 'Français (France)'],
  // ~["gl-ES", "Galician (Spain)", "Galego (España)"],
  // ~["ka-GE", "Georgian (Georgia)", "ქართული (საქართველო)"],
  // ~["gu-IN", "Gujarati (India)", "ગુજરાતી (ભારત)"],
  ['hr-HR', 'Croatian (Croatia)', 'Hrvatski (Hrvatska)'],
  // ~["zu-ZA", "Zulu (South Africa)", "IsiZulu (Ningizimu Afrika)"],
  ['is-IS', 'Icelandic (Iceland)', 'Íslenska (Ísland)'],
  ['it-IT', 'Italian (Italy)', 'Italiano (Italia)'],
  ['jv-ID', 'Javanese (Indonesia)', 'Jawa (Indonesia)'],
  // ~["kn-IN", "Kannada (India)", "ಕನ್ನಡ (ಭಾರತ)"],
  ['km-KH', 'Khmer (Cambodia)', 'ភាសាខ្មែរ (កម្ពុជា)'],
  // ~["lo-LA", "Lao (Laos)", "ລາວ (ລາວ)"],
  ['lv-LV', 'Latvian (Latvia)', 'Latviešu (latviešu)'],
  // ~["lt-LT", "Lithuanian (Lithuania)", "Lietuvių (Lietuva)"],
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
  // ~["sl-SI", "Slovenian (Slovenia)", "Slovenščina (Slovenija)"],
  ['su-ID', 'Sundanese (Indonesia)', 'Urang (Indonesia)'],
  ['sw-TZ', 'Swahili (Tanzania)', 'Swahili (Tanzania)'],
  ['fi-FI', 'Finnish (Finland)', 'Suomi (Suomi)'],
  ['sv-SE', 'Swedish (Sweden)', 'Svenska (Sverige)'],
  ['ta-IN', 'Tamil (India)', 'தமிழ் (இந்தியா)'],
  ['te-IN', 'Telugu (India)', 'తెలుగు (భారతదేశం)'],
  ['vi-VN', 'Vietnamese (Vietnam)', 'Tiếng Việt (Việt Nam)'],
  ['tr-TR', 'Turkish (Turkey)', 'Türkçe (Türkiye)'],
  ['el-GR', 'Greek (Greece)', 'Ελληνικά (Ελλάδα)'],
  // ~["bg-BG", "Bulgarian (Bulgaria)", "Български (България)"],
  ['ru-RU', 'Russian (Russia)', 'Русский (Россия)'],
  ['sr-RS', 'Serbian (Serbia)', 'Српски (Србија)'],
  ['uk-UA', 'Ukrainian (Ukraine)', 'Українська (Україна)'],
  ['ar-SA', 'Arabic (Saudi Arabia)', 'العربية (السعودية)'],
  // ~["fa-IR", "Persian (Iran)", "فارسی (ایران)"],
  ['hi-IN', 'Hindi (India)', 'हिन्दी (भारत)'],
  ['th-TH', 'Thai (Thailand)', 'ไทย (ประเทศไทย)'],
  ['ko-KR', 'Korean (South Korea)', '한국어 (대한민국)'],
  ['zh-TW', 'Chinese, Mandarin (Traditional, Taiwan)', '國語 (台灣)'],
  ['ja-JP', 'Japanese (Japan)', '日本語（日本）'],
  ['zh-HK', 'Chinese, Mandarin (Simplified, Hong Kong)', '普通話 (香港)'],
  ['zh', 'Chinese, Mandarin (Simplified, China)', '普通话 (中国大陆)'],
];

const rvLangsEnabled = true;
const rvLangs = [
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

outputLangs.sort((a, b) => {
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

// Fill languages
function gotLanguages() {
  removeAllChildNodes(langInputSelect);
  removeAllChildNodes(langOutputSelect);

  // Input Languages
  for (let i = 0; i < inputLangs.length; i += 1) {
    const option = document.createElement('option');
    option.value = inputLangs[i][0];
    option.text = inputLangs[i][1];
    langInputSelect.appendChild(option);
  }

  const voices = speechSynthesis.getVoices();
  if (rvLangsEnabled || voices.length > 0) {
    // Output
    // Header
    const header1 = document.createElement('option');
    header1.value = 'header';
    header1.text = '🔊 Voice Set A [Special]';
    langOutputSelect.appendChild(header1);

    // Voice Set A
    for (let i = 0; i < rvLangs.length; i += 1) {
      const option = document.createElement('option');
      option.value = rvLangs[i][0];
      option.text = rvLangs[i][1];
      langOutputSelect.appendChild(option);
    }

    // Divider
    const divider = document.createElement('option');
    divider.value = 'divider';
    divider.text = '';
    langOutputSelect.appendChild(divider);

    // Header
    const header2 = document.createElement('option');
    header2.value = 'header';
    // header2.text = "🔊 Language Voices"
    header2.text = '🔊 Voice Set B [Normal]';
    langOutputSelect.appendChild(header2);

    // Output Languages
    for (let i = 0; i < outputLangs.length; ++i) {
      const option = document.createElement('option');
      option.value = outputLangs[i][0];
      option.text = outputLangs[i][1];
      langOutputSelect.appendChild(option);
    }
    
    if (voices) {
      // Divider
      const divider2 = document.createElement('option');
      divider2.value = 'divider';
      divider2.text = '';
      langOutputSelect.appendChild(divider2);
  
      // Header
      const header3 = document.createElement('option');
      header3.value = 'header';
      // header2.text = "🔊 Language Voices"
      header3.text = "🔊 Built-in Voices"
      langOutputSelect.appendChild(header3);
  
      // Speech Synthesis Voices
      for(i = 0; i < voices.length ; i += 1) {
        const option = document.createElement('option');
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
        option.value = `ss-${i}:${voices[i].name}`;
        option.text = voices[i].name;
        try {
          // Remap name
          option.text = builtinLangMapping[option.text][0];
        } catch (err) {}
        langOutputSelect.appendChild(option);
      }
      speechSynthesis.onvoiceschanged = null;
  
      // Set default lang selections
      langInputSelect.selectedIndex = 45;
      // langOutputSelect.selectedIndex = voices.length + 3 + 17; // 3 = divider + headers
      langOutputSelect.selectedIndex = rvLangs.length + 3 + 17; // 3 = divider + headers
    }
  } else {
    // Output Languages
    for (let i = 0; i < outputLangs.length; ++i) {
      const option = document.createElement('option');
      option.value = outputLangs[i][0];
      option.text = outputLangs[i][1];
      langOutputSelect.appendChild(option);
    }

    // Set default lang selections
    langInputSelect.selectedIndex = 45;
    // langOutputSelect.selectedIndex = voices.length + 3 + 17; // 3 = divider + headers
    langOutputSelect.selectedIndex = 17;
  }
}

function fillLanguages() {
  gotLanguages(inputLangs, outputLangs);
}

fillLanguages();
speechSynthesis.onvoiceschanged = fillLanguages;

// gotLanguages(inputLangs, outputLangs);

function getInputLang() {
  return langInputSelect.options[langInputSelect.selectedIndex].value;
}

function getOutputLang() {
  /*
  let outputLang = langOutputSelect.options[langOutputSelect.selectedIndex].value;
  if (outputLang.slice(0,2) === "ss") {
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

// Used by mute button
function toggleMute(elem) {
  const element = $(elem);
  if (element.hasClass('up')) {
    mute = true;
    element.removeClass('up');
    element.addClass('mute');
    element.parent().css('margin-left', '0px !important');
    $volumeSlider.css('pointer-events', 'none');
    $volumeThumb.css('background-color', 'lightgray');
    $volumeFill.css('background-color', 'lightgray');
  } else {
    mute = false;
    element.removeClass('mute');
    element.addClass('up');
    $volumeSlider.css('pointer-events', 'auto');
    $volumeThumb.css('background-color', 'white');
    $volumeFill.css('background-color', 'black');
  }
}

$volumeSlider.slider({
  min: 0,
  max: 100,
  start: 100,
  step: 0,
  onMove(data) {
    volume = data.toFixed();
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
  start: 1,
  step: 0.1,
  onMove(data) {
    pitch = data.toFixed(1);
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
  start: 1,
  step: 0.1,
  onMove(data) {
    rate = data.toFixed(1);
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

$('select#searchSelectOutput').change(() => {
  const outputLang = getOutputLang();
  const altLang = outputLang.match(new RegExp(/[a-zA-Z]+-[a-zA-Z]+(?=&)/g));
  let ssLang = null;
  if (outputLang.slice(0,2) === "ss") {
    // Device Voices
    ssLang = outputLang.slice(outputLang.search(":") + 1);
  }
  if (altLang !== null || ssLang !== null) {
    $('#extraVoiceOptions').removeAttr('style');
    audioOutputText.textContent = 'Output Device'
  } else {
    $('#extraVoiceOptions').attr('style', 'display: none !important');
    audioOutputText.textContent = 'Output Device'
  }
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
  } else {
    transcriptHeader.style.display = 'none';
    transcript.style.display = 'none';
  }
});

$timestampsButton.click(() => {
  if ($timestampsButton.prop('checked')) {
    for (let transcriptTime of document.querySelectorAll('div#transcriptTime')) {
      transcriptTime.style.display = 'block';
    }
  } else {
    for (let transcriptTime of document.querySelectorAll('div#transcriptTime')) {
      transcriptTime.style.display = 'none';
    }
  }
});

$ttsButton.click(() => {
  if ($ttsButton.prop('checked')) {
    ttsHeader.style.display = 'block';
    ttsArea.style.display = 'block';
  } else {
    ttsHeader.style.display = 'none';
    ttsArea.style.display = 'none';
  }
});

$diagnosticsButton.click(() => {
  if ($diagnosticsButton.prop('checked')) {
    diagnostics.style.display = 'block';
  } else {
    diagnostics.style.display = 'none';
  }
});

$lowlatencyButton.click(() => {
  lowlatencyEnabled = $lowlatencyButton.prop('checked');
  if (lowlatencyEnabled && $translateButton.prop('checked')) {
    $translateButton.click();
  }
  if (buttonState === 1) {
    restartSpeech();
  }
});

$translateButton.click(() => {
  translateEnabled = $translateButton.prop('checked');
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
  const h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  // add a zero in front of numbers<10
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

// const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';
const corsApiUrl = '';
function getTranslationPromise(sourceLang, targetLang, sourceText) {
  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 200) {
        // console.info('SUCCESS', xhr.responseText);
        try {
          if (translateApi === 0) {
            resolve(JSON.parse(xhr.responseText)[0][0][0]);
          } else {
            resolve(JSON.parse(xhr.responseText).text[0]);
          }
        } catch (err) {
          reject(err);
        }
      } else {
        console.warn('request_error');
        reject('request_error');
      }
    };

    let url = '';
    if (translateApi === 0) {
      // Example: https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=en-US&tl=ja-JP&q=hello
      url = `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=${sourceLang}&tl=${targetLang}&q=${encodeURI(sourceText)}`;
    } else {
      // Example: https://dictionary.yandex.net/dicservice.json/queryCorpus?ui=en&srv=tr-text&sid=a0cd5513.5d2820d8.49d0adca&dst=&flags=39&maxlen=200&lang=en-ru&src=this%20is%20a%20test
      url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190713T000625Z.d2c1eb1a0a0fc57b.a63c0da34996c0eeb5bee8a727b064ed53fa8424&lang=${sourceLang.split("-")[0]}-${targetLang.split("-")[0]}&text=${encodeURI(sourceText)}`;
    }

    xhr.open('GET', corsApiUrl + url);
    xhr.send();
  });
}

async function getTranslation(sourceLang, targetLang, sourceText) {
  let translation = '';
  try {
    translation = await getTranslationPromise(sourceLang, targetLang, sourceText);
  } catch (err) {
    console.error(err);
    console.info('Trying different api...');
    // Switch translation api on error
    translateApi = 1 - translateApi;
    try {
      translation = await getTranslationPromise(sourceLang, targetLang, sourceText);
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
}

let audioDestination;
function changeAudioDestination() {
  audioDestination = audioOutputSelect.value;
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

function restartSpeech() {
  if (buttonState === 1) {
    recognition = new SpeechRecognition();
    testSpeech();
  }
}

audioOutputSelect.onchange = changeAudioDestination;
langInputSelect.onchange = restartSpeech;

//

let speechPlaying = false;
let speechBuffer = [];
let timeoutTimes = 0;

// Used by transcript play button
async function playTranscriptAudio(elem, audioURL, stop = false) {
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
    const options = audioURL.slice(audioURL.search(":") + 1).split("|");
    msg.text = options[0];
    msg.volume = volume / 100;
    msg.rate = Math.pow(10, options[1] - 1);
    msg.pitch = options[2];
    msg.voice = getSpeechSynthesisVoice(options[3]);
    speechSynthesis.speak(msg);
    return;
  }

  audio.setAttribute('src', audioURL);
  if (stop) {
    audio.load();
  }
  audio.setSinkId(audioDestination).catch((err) => {
    // Do nothing
  });
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
    playTTS([speech], true);
  }
}

async function playTTS(speech, direct) {
  // ~console.info("playTTS");
  if (speech.length === 0 || (buttonState !== 1 && direct == false)) {
    return;
  }
  try {
    // ~console.info("try playTTS");
    const inputLang = getInputLang();
    const outputLang = getOutputLang();
    const altLang = outputLang.match(new RegExp(/[a-zA-Z]+-[a-zA-Z]+(?=&)/g));
    let ssLang = null;
    if (outputLang.slice(0,2) === "ss") {
      // Device Voices
      ssLang = outputLang.slice(outputLang.search(":") + 1);
    }
    
    if (translateEnabled) {
      let translateSuccess = false;
      if (altLang !== null) {
        // Don't translate if same language
        if (inputLang !== altLang[0]) {
          speech = await getTranslation(
            inputLang,
            altLang[0],
            speech.join(' '),
          );
          translateSuccess = true;
        }
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

    speech = speech.join('-');
    if (speech === '') {
      return;
    }

    let audioURL = '';
    if (ssLang !== null) {
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
    } else if (altLang !== null) {
      // Example: https://texttospeech.responsivevoice.org/v1/text:synthesize?text=hello&lang=en-US&engine=g3&name=&pitch=0.5&rate=0.5&volume=1&key=0POmS5Y2&gender=male
      audioURL = `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${speech}&lang=${outputLang}&engine=g3&name=&pitch=${pitch / 2.0}&rate=${rate / 2.0}&volume=1&key=0POmS5Y2`
    } else {
      // Example: https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en-US&q=hello
      audioURL = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${outputLang}&q=${speech}`;
    }
    appendTranscript(speechText, audioURL);
    playAudio(audioURL, false, false);
  } catch (err) {
    // ~console.info("error playTTS");
    console.error(err);
    speechPlaying = false;
  }
}

async function playBufferedTTS(speech, split = true) {
  if (split) {
    speech = speech.split(' ');
  }
  // ~console.info("buffered tts");
  speechBuffer.push(speech);
  while (speechPlaying) {
    // Repeatedly delay 100ms if speech continues playing
    await wait(100);
  }
  playTTS(speechBuffer.shift());
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
    playBufferedTTS(intspeechList.splice(currIntspeechIndex), false);
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
    playBufferedTTS(intspeech.slice(currIntspeechLength), true);
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
          socket.emit('speech', speechResult);
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
        socket.emit('speech', speechResult);
        playBufferedTTS(speechResult, true);
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
    console.info('SpeechRecognition.onaudiostart');
  };

  recognition.onaudioend = function onaudioend() {
    // Fired when the user agent has finished capturing audio.
    console.info('SpeechRecognition.onaudioend');
    if (buttonState === 1) {
      restartSpeech();
    }
  };

  recognition.onend = function onend() {
    // Fired when the speech recognition service has disconnected.
    console.info('SpeechRecognition.onend');

    if (buttonState === -1) {
      console.info('SpeechRecognition.onstopped');
      socket.emit('status', 'onstopped');
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
    console.info('SpeechRecognition.onnomatch');
  };

  recognition.onsoundstart = function onsoundstart() {
    // Fired when any sound — recognisable speech or not — has been detected.
    if (buttonState === 1) {
      console.info('SpeechRecognition.onsoundstart');
    }
  };

  recognition.onsoundend = function onsoundend() {
    // Fired when any sound — recognisable speech or not — has stopped being detected.
    if (buttonState === 1) {
      console.info('SpeechRecognition.onsoundend');
      socket.emit('status', 'onsoundend');
    }
  };

  recognition.onspeechstart = function onspeechstart() {
    // Fired when sound that is recognised by the speech
    // recognition service as speech has been detected.
    if (buttonState === 1) {
      console.info('SpeechRecognition.onspeechstart');
      socket.emit('status', 'onspeechstart');
    }
  };
  recognition.onstart = function onstart() {
    // Fired when the speech recognition service has begun
    // listening to incoming audio with intent to recognize
    // grammars associated with the current SpeechRecognition.
    console.info('SpeechRecognition.onstart');
  };
}

testButton.addEventListener('click', speechButton);
// optionsButton.addEventListener('click', toggleOptions);
// transcriptButton.addEventListener('click', toggleTranscript);
