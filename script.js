var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

console.log = function() {};

var socket = io.connect('http://localhost:3000');

socket.on('connect_error', () => {
  console.info("SOCKET: Restart to reconnect socket if using a personal server.");
  socket.disconnect();
});

const diagnosticPara = document.querySelector('label#outputDiag');
const diagnostics = document.querySelector('p#diagnostics');
const testButtonInfo = document.querySelector('p#testButtonInfo');
const testButton = document.querySelector('button#testButton');
const outputVoiceText = document.querySelector('p#outputVoiceText');
const optionsButton = $('button#optionsButton');
const transcriptButton = $('input#transcript-checkbox');
const diagnosticsButton = $('input#diagnostics-checkbox');
const lowlatencyButton = $('input#lowlatency-checkbox');
const translateButton = $('input#translate-checkbox');
const options = document.querySelector('div#options');
const transcriptFrame = document.querySelector('div#transcript-frame');
const transcript = document.querySelector('div#transcript');
const audioInputSelect = document.querySelector('select#audioSource');
const audioOutputSelect = document.querySelector('select#audioOutput');
const selectors = [audioInputSelect, audioOutputSelect];
const langInputSelect = document.querySelector('select#searchSelectInput');
const langOutputSelect = document.querySelector('select#searchSelectOutput');
const langSelectors = [audioInputSelect, audioOutputSelect];

const volumeSlider = $('#volume-slider');
const volumeFill = $('#volume-fill');
const volumeThumb = $('#volume-thumb');
const pitchSlider = $('#pitch-slider');
const pitchThumb = $('#pitch-thumb');
const rateSlider = $('#rate-slider');
const rateThumb = $('#rate-thumb');

var buttonState = 0;
const interim_wait = 300;
const audio_input_selection_disabled = true;
var lowlatency = lowlatencyButton.prop("checked");
var translate = translateButton.prop("checked");
var audio = new Audio();

var recognition = new SpeechRecognition();

// Make microphone icon appear in browser
triggerMicrophone();
async function triggerMicrophone() {
  await recognition.start();
  await recognition.stop();
}

// Languages that don't use spaces for dividing words
// chinese, japanaese, indonesian, thai, javanese, khmer, lao, burmese, sundanese, vietnamese, tibetan, dzongkha, tai lu
var non_spaced_langs = [
  ["km-KH", "Khmer (Cambodia)", "ភាសាខ្មែរ (កម្ពុជា)"],
  ["lo-LA", "Lao (Laos)", "ລາວ (ລາວ)"],
  ["jv-ID", "Javanese (Indonesia)", "Jawa (Indonesia)"],
  ["su-ID", "Sundanese (Indonesia)", "Urang (Indonesia)"],
  ["th-TH", "Thai (Thailand)", "ไทย (ประเทศไทย)"],
  ["vi-VN", "Vietnamese (Vietnam)", "Tiếng Việt (Việt Nam)"],
  ["zh-TW", "Chinese, Mandarin (Traditional, Taiwan)", "國語 (台灣)"],
  ["yue-Hant-HK", "Chinese, Cantonese (Traditional, Hong Kong)", "廣東話 (香港)"],
  ["ja-JP", "Japanese (Japan)", "日本語（日本）"],
  ["zh-HK", "Chinese, Mandarin (Simplified, Hong Kong)", "普通話 (香港)"],
  ["zh", "Chinese, Mandarin (Simplified, China)", "普通话 (中国大陆)"],
]

// If you modify this array, also update default language / dialect below
var input_langs = [
  ["af-ZA", "Afrikaans (South Africa)", "Afrikaans (Suid-Afrika)"],
  ["am-ET", "Amharic (Ethiopia)", "አማርኛ (ኢትዮጵያ)"],
  ["hy-AM", "Armenian (Armenia)", "Հայ (Հայաստան)"],
  ["az-AZ", "Azerbaijani (Azerbaijan)", "Azərbaycan (Azərbaycan)"],
  ["id-ID", "Indonesian (Indonesia)", "Bahasa Indonesia (Indonesia)"],
  ["ms-MY", "Malay (Malaysia)", "Bahasa Melayu (Malaysia)"],
  ["bn-BD", "Bengali (Bangladesh)", "বাংলা (বাংলাদেশ)"],
  ["bn-IN", "Bengali (India)", "বাংলা (ভারত)"],
  ["ca-ES", "Catalan (Spain)", "Català (Espanya)"],
  ["cs-CZ", "Czech (Czech Republic)", "Čeština (Česká republika)"],
  ["da-DK", "Danish (Denmark)", "Dansk (Danmark)"],
  ["de-DE", "German (Germany)", "Deutsch (Deutschland)"],
  ["en-AU", "English (Australia)", "English (Australia)"],
  ["en-CA", "English (Canada)", "English (Canada)"],
  ["en-GH", "English (Ghana)", "English (Ghana)"],
  ["en-GB", "English (United Kingdom)", "English (Great Britain)"],
  ["en-IN", "English (India)", "English (India)"],
  ["en-IE", "English (Ireland)", "English (Ireland)"],
  ["en-KE", "English (Kenya)", "English (Kenya)"],
  ["en-NZ", "English (New Zealand)", "English (New Zealand)"],
  ["en-NG", "English (Nigeria)", "English (Nigeria)"],
  ["en-PH", "English (Philippines)", "English (Philippines)"],
  ["en-SG", "English (Singapore)", "English (Singapore)"],
  ["en-ZA", "English (South Africa)", "English (South Africa)"],
  ["en-TZ", "English (Tanzania)", "English (Tanzania)"],
  ["en-US", "English (United States)", "English (United States)"],
  ["es-AR", "Spanish (Argentina)", "Español (Argentina)"],
  ["es-BO", "Spanish (Bolivia)", "Español (Bolivia)"],
  ["es-CL", "Spanish (Chile)", "Español (Chile)"],
  ["es-CO", "Spanish (Colombia)", "Español (Colombia)"],
  ["es-CR", "Spanish (Costa Rica)", "Español (Costa Rica)"],
  ["es-EC", "Spanish (Ecuador)", "Español (Ecuador)"],
  ["es-SV", "Spanish (El Salvador)", "Español (El Salvador)"],
  ["es-ES", "Spanish (Spain)", "Español (España)"],
  ["es-US", "Spanish (United States)", "Español (Estados Unidos)"],
  ["es-GT", "Spanish (Guatemala)", "Español (Guatemala)"],
  ["es-HN", "Spanish (Honduras)", "Español (Honduras)"],
  ["es-MX", "Spanish (Mexico)", "Español (México)"],
  ["es-NI", "Spanish (Nicaragua)", "Español (Nicaragua)"],
  ["es-PA", "Spanish (Panama)", "Español (Panamá)"],
  ["es-PY", "Spanish (Paraguay)", "Español (Paraguay)"],
  ["es-PE", "Spanish (Peru)", "Español (Perú)"],
  ["es-PR", "Spanish (Puerto Rico)", "Español (Puerto Rico)"],
  ["es-DO", "Spanish (Dominican Republic)", "Español (República Dominicana)"],
  ["es-UY", "Spanish (Uruguay)", "Español (Uruguay)"],
  ["es-VE", "Spanish (Venezuela)", "Español (Venezuela)"],
  ["eu-ES", "Basque (Spain)", "Euskara (Espainia)"],
  ["fil-PH", "Filipino (Philippines)", "Filipino (Pilipinas)"],
  ["fr-CA", "French (Canada)", "Français (Canada)"],
  ["fr-FR", "French (France)", "Français (France)"],
  ["gl-ES", "Galician (Spain)", "Galego (España)"],
  ["ka-GE", "Georgian (Georgia)", "ქართული (საქართველო)"],
  ["gu-IN", "Gujarati (India)", "ગુજરાતી (ભારત)"],
  ["hr-HR", "Croatian (Croatia)", "Hrvatski (Hrvatska)"],
  ["zu-ZA", "Zulu (South Africa)", "IsiZulu (Ningizimu Afrika)"],
  ["is-IS", "Icelandic (Iceland)", "Íslenska (Ísland)"],
  ["it-IT", "Italian (Italy)", "Italiano (Italia)"],
  ["jv-ID", "Javanese (Indonesia)", "Jawa (Indonesia)"],
  ["kn-IN", "Kannada (India)", "ಕನ್ನಡ (ಭಾರತ)"],
  ["km-KH", "Khmer (Cambodia)", "ភាសាខ្មែរ (កម្ពុជា)"],
  ["lo-LA", "Lao (Laos)", "ລາວ (ລາວ)"],
  ["lv-LV", "Latvian (Latvia)", "Latviešu (latviešu)"],
  ["lt-LT", "Lithuanian (Lithuania)", "Lietuvių (Lietuva)"],
  ["hu-HU", "Hungarian (Hungary)", "Magyar (Magyarország)"],
  ["ml-IN", "Malayalam (India)", "മലയാളം (ഇന്ത്യ)"],
  ["mr-IN", "Marathi (India)", "मराठी (भारत)"],
  ["nl-NL", "Dutch (Netherlands)", "Nederlands (Nederland)"],
  ["ne-NP", "Nepali (Nepal)", "नेपाली (नेपाल)"],
  ["nb-NO", "Norwegian Bokmål (Norway)", "Norsk bokmål (Norge)"],
  ["pl-PL", "Polish (Poland)", "Polski (Polska)"],
  ["pt-BR", "Portuguese (Brazil)", "Português (Brasil)"],
  ["pt-PT", "Portuguese (Portugal)", "Português (Portugal)"],
  ["ro-RO", "Romanian (Romania)", "Română (România)"],
  ["si-LK", "Sinhala (Sri Lanka)", "සිංහල (ශ්රී ලංකාව)"],
  ["sk-SK", "Slovak (Slovakia)", "Slovenčina (Slovensko)"],
  ["sl-SI", "Slovenian (Slovenia)", "Slovenščina (Slovenija)"],
  ["su-ID", "Sundanese (Indonesia)", "Urang (Indonesia)"],
  ["sw-TZ", "Swahili (Tanzania)", "Swahili (Tanzania)"],
  ["sw-KE", "Swahili (Kenya)", "Swahili (Kenya)"],
  ["fi-FI", "Finnish (Finland)", "Suomi (Suomi)"],
  ["sv-SE", "Swedish (Sweden)", "Svenska (Sverige)"],
  ["ta-IN", "Tamil (India)", "தமிழ் (இந்தியா)"],
  ["ta-SG", "Tamil (Singapore)", "தமிழ் (சிங்கப்பூர்)"],
  ["ta-LK", "Tamil (Sri Lanka)", "தமிழ் (இலங்கை)"],
  ["ta-MY", "Tamil (Malaysia)", "தமிழ் (மலேசியா)"],
  ["te-IN", "Telugu (India)", "తెలుగు (భారతదేశం)"],
  ["vi-VN", "Vietnamese (Vietnam)", "Tiếng Việt (Việt Nam)"],
  ["tr-TR", "Turkish (Turkey)", "Türkçe (Türkiye)"],
  ["ur-PK", "Urdu (Pakistan)", "اردو (پاکستان)"],
  ["ur-IN", "Urdu (India)", "اردو (بھارت)"],
  ["el-GR", "Greek (Greece)", "Ελληνικά (Ελλάδα)"],
  ["bg-BG", "Bulgarian (Bulgaria)", "Български (България)"],
  ["ru-RU", "Russian (Russia)", "Русский (Россия)"],
  ["sr-RS", "Serbian (Serbia)", "Српски (Србија)"],
  ["uk-UA", "Ukrainian (Ukraine)", "Українська (Україна)"],
  ["he-IL", "Hebrew (Israel)", "עברית (ישראל)"],
  ["ar-IL", "Arabic (Israel)", "العربية (إسرائيل)"],
  ["ar-JO", "Arabic (Jordan)", "العربية (الأردن)"],
  ["ar-AE", "Arabic (United Arab Emirates)", "العربية (الإمارات)"],
  ["ar-BH", "Arabic (Bahrain)", "العربية (البحرين)"],
  ["ar-DZ", "Arabic (Algeria)", "العربية (الجزائر)"],
  ["ar-SA", "Arabic (Saudi Arabia)", "العربية (السعودية)"],
  ["ar-IQ", "Arabic (Iraq)", "العربية (العراق)"],
  ["ar-KW", "Arabic (Kuwait)", "العربية (الكويت)"],
  ["ar-MA", "Arabic (Morocco)", "العربية (المغرب)"],
  ["ar-TN", "Arabic (Tunisia)", "العربية (تونس)"],
  ["ar-OM", "Arabic (Oman)", "العربية (عُمان)"],
  ["ar-PS", "Arabic (State of Palestine)", "العربية (فلسطين)"],
  ["ar-QA", "Arabic (Qatar)", "العربية (قطر)"],
  ["ar-LB", "Arabic (Lebanon)", "العربية (لبنان)"],
  ["ar-EG", "Arabic (Egypt)", "العربية (مصر)"],
  ["fa-IR", "Persian (Iran)", "فارسی (ایران)"],
  ["hi-IN", "Hindi (India)", "हिन्दी (भारत)"],
  ["th-TH", "Thai (Thailand)", "ไทย (ประเทศไทย)"],
  ["ko-KR", "Korean (South Korea)", "한국어 (대한민국)"],
  ["zh-TW", "Chinese, Mandarin (Traditional, Taiwan)", "國語 (台灣)"],
  ["yue-Hant-HK", "Chinese, Cantonese (Traditional, Hong Kong)", "廣東話 (香港)"],
  ["ja-JP", "Japanese (Japan)", "日本語（日本）"],
  ["zh-HK", "Chinese, Mandarin (Simplified, Hong Kong)", "普通話 (香港)"],
  ["zh", "Chinese, Mandarin (Simplified, China)", "普通话 (中国大陆)"],
]

var output_langs = [
  ["af-ZA", "Afrikaans (South Africa)", "Afrikaans (Suid-Afrika)"],
  //~["am-ET", "Amharic (Ethiopia)", "አማርኛ (ኢትዮጵያ)"],
  ["hy-AM", "Armenian (Armenia)", "Հայ (Հայաստան)"],
  //~["az-AZ", "Azerbaijani (Azerbaijan)", "Azərbaycan (Azərbaycan)"],
  ["id-ID", "Indonesian (Indonesia)", "Bahasa Indonesia (Indonesia)"],
  //~["ms-MY", "Malay (Malaysia)", "Bahasa Melayu (Malaysia)"],
  ["bn-BD", "Bengali (Bangladesh)", "বাংলা (বাংলাদেশ)"],
  ["bn-IN", "Bengali (India)", "বাংলা (ভারত)"],
  ["ca-ES", "Catalan (Spain)", "Català (Espanya)"],
  ["cs-CZ", "Czech (Czech Republic)", "Čeština (Česká republika)"],
  ["da-DK", "Danish (Denmark)", "Dansk (Danmark)"],
  ["de-DE", "German (Germany)", "Deutsch (Deutschland)"],
  ["en-AU", "English (Australia)", "English (Australia)"],
  ["en-GB", "English (United Kingdom)", "English (Great Britain)"],
  ["en-IN", "English (India)", "English (India)"],
  ["en-NZ", "English (New Zealand)", "English (New Zealand)"],
  ["en-US", "English (United States)", "English (United States)"],
  ["es-ES", "Spanish (Spain)", "Español (España)"],
  ["es-US", "Spanish (United States)", "Español (Estados Unidos)"],
  ["fil-PH", "Filipino (Philippines)", "Filipino (Pilipinas)"],
  ["fr-CA", "French (Canada)", "Français (Canada)"],
  ["fr-FR", "French (France)", "Français (France)"],
  //~["gl-ES", "Galician (Spain)", "Galego (España)"],
  //~["ka-GE", "Georgian (Georgia)", "ქართული (საქართველო)"],
  //~["gu-IN", "Gujarati (India)", "ગુજરાતી (ભારત)"],
  ["hr-HR", "Croatian (Croatia)", "Hrvatski (Hrvatska)"],
  //~["zu-ZA", "Zulu (South Africa)", "IsiZulu (Ningizimu Afrika)"],
  ["is-IS", "Icelandic (Iceland)", "Íslenska (Ísland)"],
  ["it-IT", "Italian (Italy)", "Italiano (Italia)"],
  ["jv-ID", "Javanese (Indonesia)", "Jawa (Indonesia)"],
  //~["kn-IN", "Kannada (India)", "ಕನ್ನಡ (ಭಾರತ)"],
  ["km-KH", "Khmer (Cambodia)", "ភាសាខ្មែរ (កម្ពុជា)"],
  //~["lo-LA", "Lao (Laos)", "ລາວ (ລາວ)"],
  ["lv-LV", "Latvian (Latvia)", "Latviešu (latviešu)"],
  //~["lt-LT", "Lithuanian (Lithuania)", "Lietuvių (Lietuva)"],
  ["hu-HU", "Hungarian (Hungary)", "Magyar (Magyarország)"],
  ["ml-IN", "Malayalam (India)", "മലയാളം (ഇന്ത്യ)"],
  ["mr-IN", "Marathi (India)", "मराठी (भारत)"],
  ["nl-NL", "Dutch (Netherlands)", "Nederlands (Nederland)"],
  ["ne-NP", "Nepali (Nepal)", "नेपाली (नेपाल)"],
  ["nb-NO", "Norwegian Bokmål (Norway)", "Norsk bokmål (Norge)"],
  ["pl-PL", "Polish (Poland)", "Polski (Polska)"],
  ["pt-BR", "Portuguese (Brazil)", "Português (Brasil)"],
  ["pt-PT", "Portuguese (Portugal)", "Português (Portugal)"],
  ["ro-RO", "Romanian (Romania)", "Română (România)"],
  ["si-LK", "Sinhala (Sri Lanka)", "සිංහල (ශ්රී ලංකාව)"],
  ["sk-SK", "Slovak (Slovakia)", "Slovenčina (Slovensko)"],
  //~["sl-SI", "Slovenian (Slovenia)", "Slovenščina (Slovenija)"],
  ["su-ID", "Sundanese (Indonesia)", "Urang (Indonesia)"],
  ["sw-TZ", "Swahili (Tanzania)", "Swahili (Tanzania)"],
  ["fi-FI", "Finnish (Finland)", "Suomi (Suomi)"],
  ["sv-SE", "Swedish (Sweden)", "Svenska (Sverige)"],
  ["ta-IN", "Tamil (India)", "தமிழ் (இந்தியா)"],
  ["te-IN", "Telugu (India)", "తెలుగు (భారతదేశం)"],
  ["vi-VN", "Vietnamese (Vietnam)", "Tiếng Việt (Việt Nam)"],
  ["tr-TR", "Turkish (Turkey)", "Türkçe (Türkiye)"],
  ["el-GR", "Greek (Greece)", "Ελληνικά (Ελλάδα)"],
  //~["bg-BG", "Bulgarian (Bulgaria)", "Български (България)"],
  ["ru-RU", "Russian (Russia)", "Русский (Россия)"],
  ["sr-RS", "Serbian (Serbia)", "Српски (Србија)"],
  ["uk-UA", "Ukrainian (Ukraine)", "Українська (Україна)"],
  ["ar-SA", "Arabic (Saudi Arabia)", "العربية (السعودية)"],
  //~["fa-IR", "Persian (Iran)", "فارسی (ایران)"],
  ["hi-IN", "Hindi (India)", "हिन्दी (भारत)"],
  ["th-TH", "Thai (Thailand)", "ไทย (ประเทศไทย)"],
  ["ko-KR", "Korean (South Korea)", "한국어 (대한민국)"],
  ["zh-TW", "Chinese, Mandarin (Traditional, Taiwan)", "國語 (台灣)"],
  ["ja-JP", "Japanese (Japan)", "日本語（日本）"],
  ["zh-HK", "Chinese, Mandarin (Simplified, Hong Kong)", "普通話 (香港)"],
  ["zh", "Chinese, Mandarin (Simplified, China)", "普通话 (中国大陆)"],
]

var rv_langs = [
  ["en-GB&gender=female", "English UK Female"],
  ["en-GB&gender=male", "English UK Male"],
  ["en-US&gender=female", "English US Female"],
  ["en-US&gender=male", "English US Male"],
  ["ar-SA&gender=male", "Arabic Male"],
  ["ar-SA&gender=female", "Arabic Female"],
  ["hy-AM&gender=male", "Armenian Male"],
  ["en-AU&gender=female", "Australian Female"],
  ["en-AU&gender=male", "Australian Male"],
  ["bn-BD&gender=female", "Bangla Bangladesh Female"],
  ["bn-BD&gender=male", "Bangla Bangladesh Male"],
  ["bn-IN&gender=female", "Bangla India Female"],
  ["bn-IN&gender=male", "Bangla India Male"],
  ["pt-BR&gender=female", "Brazilian Portuguese Female"],
  ["pt-BR&gender=male", "Brazilian Portuguese Male"],
  ["zh&gender=female", "Chinese Female"],
  ["zh&gender=male", "Chinese Male"],
  ["zh-HK&gender=female", "Chinese (Hong Kong) Female"],
  ["zh-HK&gender=male", "Chinese (Hong Kong) Male"],
  ["zh-TW&gender=female", "Chinese Taiwan Female"],
  ["zh-TW&gender=male", "Chinese Taiwan Male"],
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
]

var builtin_lang_mapping = { 
  "Microsoft David Desktop - English (United States)": ["English (United States) [Microsoft David Desktop]", "English (United States) [Microsoft David Desktop]"],
  "Microsoft Mark Desktop - English (United States)": ["English (United States) [Microsoft Mark Desktop]", "English (United States) [Microsoft Mark Desktop]"],
  "Microsoft Zira Desktop - English (United States)": ["English (United States) [Microsoft Zira Desktop]", "English (United States) [Microsoft Zira Desktop]"],
  "Google Deutsch": ["German (Germany) [Google]", "Deutsch (Deutschland) [Google]"],
  "Google US English": ["English (US) [Google]", "English (US) [Google]"],
  "Google UK English Female": ["English (UK Female) [Google]", "English (UK Female) [Google]"],
  "Google UK English Male": ["English (UK Male) [Google]", "English (UK Male) [Google]"],
  "Google español": ["Spanish (Spain) [Google]", "Español (España) [Google]"],
  "Google español de Estados Unidos": ["Spanish (United States) [Google]", "Español (Estados Unidos) [Google]"],
  "Google français": ["French (France) [Google]", "Français (France) [Google]"],
  "Google हिन्दी": ["Hindi (India) [Google]", "हिन्दी (भारत) [Google]"],
  "Google Bahasa Indonesia": ["Indonesian (Indonesia) [Google]", "Bahasa Indonesia (Indonesia) [Google]"],
  "Google italiano": ["Italian (Italy) [Google]", "Italiano (Italia) [Google]"],
  "Google 日本語": ["Japanese (Japan) [Google]", "日本語（日本）[Google]"],
  "Google 한국의": ["Korean (South Korea) [Google]", "한국어 (대한민국) [Google]"],
  "Google Nederlands": ["Dutch (Netherlands) [Google]", "Nederlands (Nederland) [Google]"],
  "Google polski": ["Polish (Poland) [Google]", "Polski (Polska) [Google]"],
  "Google português do Brasil": ["Portuguese (Brazil) [Google]", "Português (Brasil) [Google]"],
  "Google русский": ["Russian (Russia) [Google]", "Русский (Россия) [Google]"],
  "Google 普通话（中国大陆）": ["Chinese, Mandarin (Simplified, China) [Google]", "普通话 (中国大陆) [Google]"],
  "Google 粤語（香港）": ["Chinese, Cantonese (Traditional, Hong Kong) [Google]", "廣東話 (香港) [Google]"],
  "Google 國語（臺灣）": ["Chinese, Mandarin (Traditional, Taiwan) [Google]", "國語 (台灣) [Google]"],
}

// Sort alphabetical by English name
input_langs.sort(function(a, b) {
    var keyA = a[1],
        keyB = b[1];
    // Compare the 2 values
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
});

output_langs.sort(function(a, b) {
    var keyA = a[1],
        keyB = b[1];
    // Compare the 2 values
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
});

// Fill languages
function gotLanguages(input_langs, output_langs) {
  // Input Languages
  for (let i = 0; i < input_langs.length; ++i) {
    const option = document.createElement('option');
    option.value = input_langs[i][0];
    option.text = input_langs[i][1];
    langInputSelect.appendChild(option);
  }

  // Output
  // Header
  var header1 = document.createElement('option');
  header1.value = 'header';
  //header1.text = "🔊 Built-in Voices"
  header1.text = "🔊 Voice Set A [Special]"
  langOutputSelect.appendChild(header1);

  /*
  // Speech Synthesis Voices
  var voices = speechSynthesis.getVoices();
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    option.value = `ss-${i}:${voices[i].lang}`;
    option.text = voices[i].name;
    try {
      // Remap name
      option.text = builtin_lang_mapping[option.text][0];
    } catch (err) {}
    langOutputSelect.appendChild(option);
  }
  delete speechSynthesis.onvoiceschanged;
  */

  // Voice Set A
  for(let i = 0; i < rv_langs.length; i++) {
    var option = document.createElement('option');
    option.value = rv_langs[i][0];
    option.text = rv_langs[i][1];
    langOutputSelect.appendChild(option);
  }

  // Divider
  var divider = document.createElement('option');
  divider.value = 'divider';
  divider.text = ""
  langOutputSelect.appendChild(divider);

  // Header
  var header2 = document.createElement('option');
  header2.value = 'header';
  //header2.text = "🔊 Language Voices"
  header2.text = "🔊 Voice Set B [Normal]"
  langOutputSelect.appendChild(header2);

  // Output Languages
  for (let i = 0; i < output_langs.length; ++i) {
    var option = document.createElement('option');
    option.value = output_langs[i][0];
    option.text = output_langs[i][1];
    langOutputSelect.appendChild(option);
  }

  // Set default lang selections
  langInputSelect.selectedIndex = 45;
  //langOutputSelect.selectedIndex = voices.length + 3 + 17; // 3 = divider + headers
  langOutputSelect.selectedIndex = rv_langs.length + 3 + 17; // 3 = divider + headers
}

function fillLanguages() {
  gotLanguages(input_langs, output_langs);
}

fillLanguages();
/*
speechSynthesis.onvoiceschanged = fillLanguages;
*/

//gotLanguages(input_langs, output_langs);

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

function isSpacedLang(lang) {
  for (let non_spaced_lang in non_spaced_langs) {
    non_spaced_lang = non_spaced_langs[non_spaced_lang][0];
    if (lang === non_spaced_lang) {
      return false;
    }
  }
  return true;
}

// Set default language / dialect
/*
for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 10;
updateCountry();
select_dialect.selectedIndex = 11;
*/

// Utility

function wait(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function reduceSpacing(str) {
  return str.replace(/ +(?= )/g,'');
}

// Init Elements

$('.dropdown')
  .dropdown({ fullTextSearch: 'exact' })
  //.dropdown()
;

var mute = false;

var volume = 100;
var pitch = 0.5;
var rate = 0.5;

var volumeSliderActive = false;
var pitchSliderActive = false;
var rateSliderActive = false;

function toggleMute(element) {
  element = $(element);
  if (element.hasClass('up')) {
    mute = true;
    element.removeClass('up');
    element.addClass('mute');
    element.parent().css('margin-left', '0px !important');
    volumeSlider.css('pointer-events', 'none');
    volumeThumb.css('background-color', 'lightgray');
    volumeFill.css('background-color', 'lightgray');
  } else {
    mute = false;
    element.removeClass('mute');
    element.addClass('up');
    volumeSlider.css('pointer-events', 'auto');
    volumeThumb.css('background-color', 'white');
    volumeFill.css('background-color', 'black');
  }
}

volumeSlider
  .slider({
    min: 0,
    max: 100,
    start: 100,
    step: 0,
    onMove: function (data) {
      volume = data.toFixed();
      try {
        volumeThumb
          .popup('change content', `${volume}%`)
          .popup('reposition');
      } catch (err) {}
    },
  })
;

function volume_slider_mousedown() {
  volumeSliderActive = true;
  volumeThumb
    .popup('show')
    .popup('change content', `${volume}%`)
    .popup('reposition');
};

volumeThumb.mouseenter(function() {
  volumeThumb
    .popup('show')
    .popup('change content', `${volume}%`)
    .popup('reposition');
});

volumeThumb.mouseleave(function() {
  if (!volumeSliderActive) {
    volumeThumb.popup('hide');
  }
});

pitchSlider
  .slider({
    min: 0,
    max: 100,
    start: 50,
    step: 5,
    onMove: function (data) {
      pitch = data.toFixed() / 100.0;
      try {
        pitchThumb
          .popup('change content', `${pitch * 2.0}`)
          .popup('reposition');
      } catch (err) {}
    },
  })
;

function pitch_slider_mousedown() {
  pitchSliderActive = true;
  pitchThumb
    .popup('show')
    .popup('change content', `${pitch * 2.0}`)
    .popup('reposition');
};

pitchThumb.mouseenter(function() {
  pitchThumb
    .popup('show')
    .popup('change content', `${pitch * 2.0}`)
    .popup('reposition');
});

pitchThumb.mouseleave(function() {
  if (!pitchSliderActive) {
    pitchThumb.popup('hide');
  }
});

rateSlider
  .slider({
    min: 0,
    max: 100,
    start: 50,
    step: 5,
    onMove: function (data) {
      rate = data.toFixed() / 100.0;
      try {
        rateThumb
          .popup('change content', `${rate * 2.0}`)
          .popup('reposition');
      } catch (err) {}
    },
  })
;

function rate_slider_mousedown() {
  rateSliderActive = true;
  rateThumb
    .popup('show')
    .popup('change content', `${rate * 2.0}`)
    .popup('reposition');
};

rateThumb.mouseenter(function() {
  rateThumb
    .popup('show')
    .popup('change content', `${rate * 2.0}`)
    .popup('reposition');
});

rateThumb.mouseleave(function() {
  if (!rateSliderActive) {
    rateThumb.popup('hide');
  }
});

$(document).on('mouseup', function() {
  volumeSliderActive = false;
  pitchSliderActive = false;
  rateSliderActive = false;
});

function resetDropdownInput(element) {
  let dropdownParent = $(element).parent().parent();
  dropdownParent.find('.search').val("");
  dropdownParent.dropdown('set selected', $('select#searchSelectOutput').dropdown('get value'));
}

$('select#searchSelectOutput').change(function() {
    let output_lang = getOutputLang();
    let alt_lang = output_lang.match(new RegExp(/[a-zA-Z]+-[a-zA-Z]+(?=&)/g));
    if (alt_lang !== null) {
      $('#extra-voice-options').removeAttr("style");
    } else {
      $('#extra-voice-options').attr("style", "display: none !important");
    }
});

var initOptions = true;

optionsButton.click(function() {
  //~console.info(getOutputLang());
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
    $('.search').attr('onchange', "$('.message').attr('onclick', 'resetDropdownInput(this)');");

    initOptions = false;
  }

  // Update device names
  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

  // Modal setup
  $('.ui.modal.options-modal')
    .modal({
      autofocus: false,
      duration: 300
    })
    .modal('show')
  ;

  // Slider setup
  volumeThumb
    .popup({
      position: 'top center',
      content: `${volume}%`,
      on: 'manual',
    })
  ;

  pitchThumb
    .popup({
      position: 'top center',
      content: `${pitch * 2.0}`,
      on: 'manual',
    })
  ;

  rateThumb
    .popup({
      position: 'top center',
      content: `${rate * 2.0}`,
      on: 'manual',
    })
  ;
});

/*
function transcriptDropdown() {
  if (transcriptButton.prop("checked")) {
    transcriptFrame.style.display = "block";
    transcript.style.display = "block";
    scrollTranscript();
  } else {
    transcriptFrame.style.display = "none";
    transcript.style.display = "none";
  }
}
*/

transcriptButton.click(function() {
  if (transcriptButton.prop("checked")) {
    transcriptFrame.style.display = "block";
    transcript.style.display = "block";
    scrollTranscript();
  } else {
    transcriptFrame.style.display = "none";
    transcript.style.display = "none";
  }
});

diagnosticsButton.click(function() {
  if (diagnosticsButton.prop("checked")) {
    diagnostics.style.display = "block";
  } else {
    diagnostics.style.display = "none";
  }
});

lowlatencyButton.click(function() {
  lowlatency = lowlatencyButton.prop("checked");
  if (lowlatency && translateButton.prop("checked")) {
    translateButton.click();
  }
  if (buttonState == 1) {
    restartSpeech();
  }
});

translateButton.click(function() {
  translate = translateButton.prop("checked");
  if (translateButton.prop("checked")) {
    if (lowlatencyButton.prop("checked")) {
      lowlatencyButton.click();
    }
    outputVoiceText.textContent = "Output Language";
  } else {
    outputVoiceText.textContent = "Output Voice";
  }
});

function scrollTranscript() {
  transcript.scrollTop = transcript.scrollHeight - transcript.clientHeight;
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function getTranscriptTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  // add a zero in front of numbers<10
  m = checkTime(m);
  s = checkTime(s);
  timestamp = h + ":" + m + ":" + s;
  return timestamp;
}

function appendTranscript(text, link) {
  // allow 1px inaccuracy by adding 1
  const isScrolledToBottom = transcript.scrollHeight - transcript.clientHeight <= transcript.scrollTop + 1

  const transcriptTime = document.createElement("div")
  transcriptTime.setAttribute("class", "transcript-time unselectable");
  transcriptTime.setAttribute("unselectable", "on");
  transcriptTime.textContent = getTranscriptTime();

  const transcriptText = document.createElement("div")
  transcriptText.setAttribute("class", "transcript-text");
  transcriptText.textContent = text;

  const transcriptPlay = document.createElement("div")
  transcriptPlay.setAttribute("class", "transcript-play unselectable");
  transcriptPlay.setAttribute("unselectable", "on");
  transcriptPlay.setAttribute("onClick", `playTranscriptAudio(this, "${link}", stop=true)`);

  const playIcon = document.createElement("i")
  playIcon.setAttribute("class", "play circle outline icon");
  transcriptPlay.appendChild(playIcon);

  const transcriptBody = document.createElement("div")
  transcriptBody.setAttribute("class", "transcript-body");
  transcriptBody.appendChild(transcriptTime);
  transcriptBody.appendChild(transcriptText);
  transcriptBody.appendChild(transcriptPlay);

  transcript.appendChild(transcriptBody);

  // scroll to bottom if isScrolledToBottom is true
  if (isScrolledToBottom) {
    scrollTranscript();
  }

  // Add hover effects
  $(transcriptBody).mouseenter(function() {
    let activeHover = $('.active-hover');
    hideTranscriptHover(activeHover);
    activeHover.removeClass("active-hover");
    let transcriptBody = $(this);
    showTranscriptHover(transcriptBody);
    transcriptBody.addClass("active-hover")
  }).mouseleave(function() {
    let transcriptBody = $(this);
    hideTranscriptHover(transcriptBody);
    transcriptBody.removeClass("active-hover")
  });
}

function hideTranscriptHover(element) {
  if (!element.children(".transcript-play").hasClass('active-audio') || !element.hasClass("active-hover")) {
    element.css("background-color", "white")
    element.children(".transcript-play").css("display", "none");
  }
}

function showTranscriptHover(element) {
  element.css("background-color", "whitesmoke")
  element.children(".transcript-play").css("display", "block");
}

function speechButton() {
  socket.connect();
  if (buttonState < 1) {
    // Initialize speech
    speech_playing = false;
    audio = new Audio();
    speech_buffer = [];

    buttonState = 1;
    testButtonInfo.textContent = 'Press stop to end speech recognition';
    testButton.textContent = 'Stop';
    testSpeech();
  } else {
    // Stop speech
    speech_playing = false;
    audio.load();

    // Hide transcript audio display
    let activeAudioElement = $('.active-audio');
    try {
      activeAudioElement.children('i')[0].setAttribute('class', 'play circle outline icon');
      activeAudioElement.removeClass('active-audio');
    } catch (err) {}
    hideTranscriptHover($('.transcript-body'));

    buttonState = -1;
    testButton.disabled = true;
    testButton.textContent = 'Stopping...';
    recognition.onend();
  }
}

// Translation

//const cors_api_url = 'https://cors-anywhere.herokuapp.com/';
const cors_api_url = '';
function getTranslation(sourceLang, targetLang, sourceText) {
  var xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 200) {
        //console.info('SUCCESS', xhr.responseText);
        try {
          resolve(JSON.parse(xhr.responseText)[0][0][0]);
        } catch (err) {
          resolve("user_error")
        }
      } else {
        console.warn('request_error');
      }
    };

    // Example: https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=en-US&tl=ja-JP&q=hello
    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=" 
              + sourceLang + "&tl=" + targetLang + "&q=" + encodeURI(sourceText);

    xhr.open('GET', cors_api_url + url);
    xhr.send();
  });
}

/*
var sourceLang = "en-us";
var targetLang = "ja";
var sourceText = "translation test";
async function test() {
  var test = await getTranslation(sourceLang, targetLang, sourceText);
  console.info(test);
}
test();
*/

// Fill devices

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  if (audio_input_selection_disabled) {
    const option = document.createElement('option');
    option.text = "Set in browser";
    audioInputSelect.appendChild(option);
  }
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      if (!audio_input_selection_disabled) {
        option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
        audioInputSelect.appendChild(option);
      }
    } else if (deviceInfo.kind === 'audiooutput') {
      option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
      audioOutputSelect.appendChild(option);
    } else {
      console.info('Some other kind of source/device: ', deviceInfo);
    }
  }
  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex];
    }
  });
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

var audioDestination;
function changeAudioDestination() {
  audioDestination = audioOutputSelect.value;
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

function handleError(error) {
  console.info('navigator.mediaDevices.getUserMedia error: ', error.message, error.name);
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
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
}

//audioInputSelect.onchange = startAudioInput;
audioInputSelect.onchange = function() {
  if (buttonState == 1) {
    testSpeech();
  }
}
*/

function restartSpeech() {
  if (buttonState == 1) {
    recognition = new SpeechRecognition();
    testSpeech();
  }
}

audioOutputSelect.onchange = changeAudioDestination;
langInputSelect.onchange = restartSpeech;

//

var speech_playing = false;
var speech_buffer = [];
var timeout_times = 0;

async function playTranscriptAudio(element, audio_url, stop=false) {
  element = $(element);
  if (element.children('i').hasClass('play')) {
    speech_playing = false;
    let activeAudioElement = $('.active-audio');
    try {
      activeAudioElement.children('i')[0].setAttribute('class', 'play circle outline icon');
      activeAudioElement.removeClass('active-audio');
    } catch (err) {}
    hideTranscriptHover(activeAudioElement.parent());
    element.addClass('active-audio');
    element.children('i')[0].setAttribute('class', 'stop circle outline icon');
    playAudio(audio_url, stop);
  } else {
    speech_playing = false;
    audio.load();
    element.removeClass('active-audio');
    element.children('i')[0].setAttribute('class', 'play circle outline icon');
  }
}

async function playAudio(audio_url, stop=false) {
  if (mute) {
    return;
  }
  audio.setAttribute('src', audio_url);
  if (stop) {
    audio.load();
  }
  audio.setSinkId(audioDestination).catch((err) => {});
  audio.volume = volume / 100.0;
  speech_playing = true;
  audio.onended = function() {
    speech_playing = false;
    let activeAudioElement = $('.active-audio');
    hideTranscriptHover(activeAudioElement.parent());
    try {
      activeAudioElement.children('i')[0].setAttribute('class', 'play circle outline icon');
      activeAudioElement.removeClass('active-audio');
    } catch (err) {}
  };
  audio.play()
    .then((res) => {
      //~console.info("response");
      timeout_times = 0;
      return;
    })
    .catch((err) => {
      speech_playing = false;
      //~console.info("error playTTS");
      console.error(err);
      timeout_times += 1;
      if (timeout_times > 5) {
        timeout_times = 0;
        return;
      } else {
        console.info(`Trying again ${timeout_times}`);
        playAudio(audio_url);
        return;
      }
    });
}

async function playTTS(speech) {
  //~console.info("playTTS");
  if (speech.length == 0 || buttonState !== 1) {
    return;
  }
  try {
    //~console.info("try playTTS");
    let input_lang = getInputLang();
    let output_lang = getOutputLang();
    let alt_lang = output_lang.match(new RegExp(/[a-zA-Z]+-[a-zA-Z]+(?=&)/g));
    /* Using native speech synthesis
    speechSynthesis.speak(new SpeechSynthesisUtterance(speech.join(" ")));
    return;
    */
    if (translate) {
      let translate_success = false;
      if (alt_lang !== null) {
        // Don't translate if same language
        if (input_lang !== alt_lang[0]) {
          speech = await getTranslation(input_lang, alt_lang[0], speech.join(" "));
          translate_success = true;
        }
      } else {
        // Don't translate if same language
        if (input_lang !== output_lang) {
          speech = await getTranslation(input_lang, output_lang, speech.join(" "));
          translate_success = true;
        }
      }
      if (translate_success) {
        speech = speech.split(" ");
      }
    }
    // Remove empty strings
    speech = speech.filter(function(el) { return el; });

    speech_text = speech.join(" ");
    console.info("Speech: " + speech_text);

    speech = speech.join("-");
    if (speech === "") {
      return;
    }

    let audio_url = "";
    if (alt_lang !== null) {
      // Example: https://code.responsivevoice.org/getvoice.php?t=hello&client=tw-ob&sv=g1&vn=&pitch=0.5&rate=0.5&vol=1&tl=en-US&gender=male
      audio_url = `https://code.responsivevoice.org/getvoice.php?t=${speech}&client=tw-ob&sv=g1&vn=&pitch=${pitch}&rate=${rate}&vol=1&tl=${output_lang}`
    } else {
      // Example: https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en-US&q=hello
      audio_url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${output_lang}&q=${speech}`;
    }
    appendTranscript(speech_text, audio_url);
    playAudio(audio_url);
  } catch (err) {
    //~console.info("error playTTS");
    console.error(err);
    speech_playing = false;
  }
}

async function playBufferedTTS(speech, split=true) {
  if (split) {
    speech = speech.split(" ");
  }
  //~console.info("buffered tts");
  speech_buffer.push(speech);
  while (speech_playing) {
    await wait(100);
  }
  playTTS(speech_buffer.shift());
}

// intspeech = interim_speech
var last_intspeech_list = [];
var intspeech_index = 0;
var last_intspeech = "";
var intspeech_length = 0;

async function playSpacedLangTTS(intspeech) {
  let intspeech_list = intspeech.split(" ");
  // Remove empty strings
  intspeech_list = intspeech_list.filter(function(el) { return el; });

  // Reset if intspeech was cleared out
  if (intspeech_list.length === 0) {
    intspeech_index = 0;
  }

  // Validate based on spacing
  // Store the index of new appended speech in the list
  let curr_intspeech_index = intspeech_index;
  last_intspeech_list = intspeech_list;

  // Wait a predefined time to check for silence before speaking interim speech
  await wait(interim_wait);

  // If the interim speech did not change after the wait, there was enough silence to begin speaking
  if (last_intspeech_list === intspeech_list) {
    intspeech_index = intspeech_list.length;
    playBufferedTTS(intspeech_list.splice(curr_intspeech_index), split=false);
  }
}

async function playNonSpacedLangTTS(intspeech) {
  // Reset if intspeech was cleared out
  if (intspeech.length === 0) {
    intspeech_length = 0;
  }

  // Validate based on length
  // Store the length of new appended speech in the string
  let curr_intspeech_length = intspeech_length;
  last_intspeech = intspeech;

  // Wait a predefined time to check for silence before speaking interim speech
  await wait(interim_wait);

  // If the interim speech did not change after the wait, there was enough silence to begin speaking
  if (last_intspeech === intspeech && intspeech_length < intspeech.length) {
    intspeech_length = intspeech.length;
    playBufferedTTS(intspeech.slice(curr_intspeech_length), split=true);
  }

}

async function playInterimTTS(intspeech) {
  intspeech = intspeech.trim();
  //~console.info(intspeech);

  // Check for validation type
  if (isSpacedLang(getInputLang())) {
    playSpacedLangTTS(intspeech);
  } else {
    playNonSpacedLangTTS(intspeech);
  }
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function testSpeech() {
  //testButton.disabled = true;
  //testButton.textContent = 'In progress';

  // To ensure case consistency while checking with the returned output text
  // diagnosticPara.textContent = '...diagnostic messages';

  recognition.lang = getInputLang();
  if (lowlatency) {
    recognition.continuous = true;
    recognition.interimResults = true;
  } else {
    recognition.continuous = false;
    recognition.interimResults = false;    
  }
  recognition.maxAlternatives = 1;

  try {
    recognition.start();
  } catch (err) {}

  // Reset intspeech_index and intspeech_length on start
  intspeech_index = 0;
  intspeech_length = 0;

  recognition.onresult = function(event) {
    console.info('SpeechRecognition.onresult');
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object 

    /*if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      upgrade();
      return;
    }*/

    if (lowlatency) {
      var interim_transcript = '';

      // Initially intspeech_index is set to 0 on start
      // interim_transcript is reset to length 0 during silence, which resets intspeech_index to 0
      // Any words will increase the index to 1 and above
      // This ensures words will not be missed when being read
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          //~final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }

      //~final_transcript = capitalize(final_transcript);
      //~final_span.innerHTML = linebreak(final_transcript);
      //~interim_span.innerHTML = linebreak(interim_transcript);
      /*if (final_transcript || interim_transcript) {
        showButtons('inline-block');
      }*/
      //~console.info(interim_transcript);

      if (buttonState == 1) {
        //var speechResult = event.results[0][0].transcript;
        let speechResult = interim_transcript;
        let confidenceResult = event.results[event.results.length-1][0].confidence;
        if (speechResult === "") {
          speechResult = "—";
          confidenceResult = "—";
          playInterimTTS("");
        } else {
          socket.emit('speech', speechResult);
          playInterimTTS(speechResult);
        }
        diagnosticPara.textContent = 'Speech received: ' + speechResult;
        outputConfidence.textContent = 'Confidence: ' + confidenceResult;
      }
    } else {
      if (buttonState == 1) {
        let speechResult = event.results[0][0].transcript;
        let confidenceResult = event.results[0][0].confidence;
        if (speechResult === "") {
          speechResult = "—";
          confidenceResult = "—";
        } else {
          socket.emit('speech', speechResult);
          playBufferedTTS(speechResult, split=true);
        }
        diagnosticPara.textContent = 'Speech received: ' + speechResult;
        outputConfidence.textContent = 'Confidence: ' + confidenceResult;
      }
    }
  }

  recognition.onspeechend = function() {
    recognition.stop();
    //testButton.disabled = false;
    //testButton.textContent = 'Start';
    if (buttonState == 1) {
      restartSpeech();
    }
  }

  recognition.onerror = function(event) {
    //testButton.disabled = false;
    //testButton.textContent = 'Start';
    if (buttonState == 1) {
      diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
      restartSpeech();
    }
  }
  
  recognition.onaudiostart = function(event) {
    //Fired when the user agent has started to capture audio.
    console.info('SpeechRecognition.onaudiostart');
  }
  
  recognition.onaudioend = function(event) {
    //Fired when the user agent has finished capturing audio.
    console.info('SpeechRecognition.onaudioend');
    if (buttonState == 1) {
      restartSpeech();
    }
  }
  
  recognition.onend = function(event) {
    //Fired when the speech recognition service has disconnected.
    console.info('SpeechRecognition.onend');

    if (buttonState == -1) {
      console.info('SpeechRecognition.onstopped');
      socket.emit('status', 'onstopped');
      buttonState = 0;
      testButtonInfo.textContent = 'Press start to begin speech recognition';
      testButton.textContent = 'Start';
      testButton.disabled = false;
      recognition.stop();
    }
  }
  
  recognition.onnomatch = function(event) {
    //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
    console.info('SpeechRecognition.onnomatch');
  }
  
  recognition.onsoundstart = function(event) {
    //Fired when any sound — recognisable speech or not — has been detected.
    if (buttonState == 1) {
      console.info('SpeechRecognition.onsoundstart');
    }
  }
  
  recognition.onsoundend = function(event) {
    //Fired when any sound — recognisable speech or not — has stopped being detected.
    if (buttonState == 1) {
      console.info('SpeechRecognition.onsoundend');
      socket.emit('status', 'onsoundend');
    }
  }
  
  recognition.onspeechstart = function (event) {
    //Fired when sound that is recognised by the speech recognition service as speech has been detected.
    if (buttonState == 1) {
      console.info('SpeechRecognition.onspeechstart');
      socket.emit('status', 'onspeechstart');
    }
  }
  recognition.onstart = function(event) {
    //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.info('SpeechRecognition.onstart');
  }
}

testButton.addEventListener('click', speechButton);
//optionsButton.addEventListener('click', toggleOptions);
//transcriptButton.addEventListener('click', toggleTranscript);
