const appContainer = document.getElementById('app-container');
const messageBox = document.createElement('p');
messageBox.id = 'global-message-box';
messageBox.className = 'hidden mt-4 text-sm text-center font-medium';

function showMessage(message, type = 'error') {
  messageBox.textContent = message;
  messageBox.classList.remove('hidden', 'text-red-400', 'text-green-400');
  if (type === 'error') {
    messageBox.classList.add('text-red-400');
  } else {
    messageBox.classList.add('text-green-400');
  }
  setTimeout(() => {
    messageBox.classList.add('hidden');
  }, 3000);
  if (!appContainer.contains(messageBox)) {
    document.querySelector('.card-area')?.appendChild(messageBox);
  }
}

const tools = [
  { id: 'unit-converter', title: 'UNIT CONVERTER', description: 'Convert between common units of length, weight, and temperature.', render: renderUnitConverter },
  { id: 'text-case-converter', title: 'TEXT CASE CONVERTER', description: 'Convert text between different casing styles (lower, UPPER, Title, kebab-case).', render: renderTextCaseConverter },
  { id: 'base64-converter', title: 'BASE64 ENCODER / DECODER', description: 'Convert text to Base64 and vice versa.', render: renderBase64Converter },
  { id: 'url-encoder', title: 'URL ENCODER / DECODER', description: 'Encode or decode URL characters for web development.', render: renderURLEncoder },
  { id: 'json-xml-formatter', title: 'JSON/XML VIEWER & FORMATTER', description: 'Validate and beautifully format JSON and XML data.', render: renderJsonXmlFormatter },
  { id: 'color-palette', title: 'COLOR PALETTE GENERATOR', description: 'Generate complementary, analogous, and triadic color schemes from a base color.', render: renderColorPalette },
  { id: 'image-compressor', title: 'IMAGE RESIZER & COMPRESSOR', description: 'Resize and compress JPG/PNG images in the browser.', render: renderImageCompressor },
  { id: 'password-tester', title: 'PASSWORD STRENGTH TESTER', description: 'Check password security in real-time with visual feedback.', render: renderPasswordTester },
  { id: 'code-formatter', title: 'CODE FORMATTER / BEAUTIFIER', description: 'Format and beautify HTML, CSS, and JavaScript code.', render: renderCodeFormatter },
  { id: 'password-generator', title: 'RANDOM PASSWORD GENERATOR', description: 'Generate secure random passwords with custom length and character sets.', render: renderPasswordGenerator },
  { id: 'qr-generator', title: 'QR CODE GENERATOR', description: 'Generate QR codes for URLs, text, or upload images/PDFs to create QR codes.', render: renderQRGenerator },
  { id: 'vcard-generator', title: 'VCARD QR GENERATOR', description: 'Create contact QR codes that can be scanned to save information to phone contacts.', render: renderVCardGenerator },
  { id: 'comment-remover',title:'COMMENT REMOVER', description: 'Remove comments from JavaScript, CSS, and HTML code. ', render: renderCommentRemover},
];

function renderCommentRemover(){
    const tool = tools.find(t => t.id === 'comment-remover');
    renderToolLayout(tool.title, tool.description, `
        <div>
            <label for="comment-input" class="label-text">Input Code:</label>
            <textarea id="comment-input" class="input-style w-full p-3 rounded-lg resize-y" rows="12" placeholder="Paste your JavaScript, CSS, or HTML code here..." data-code="true"></textarea>
        </div>
        <div class="flex flex-col sm:flex-row gap-4 items-end">
            <div class="flex-1 w-full">
                <label for="language-select" class="label-text">Select Language:</label>
                <select id="language-select" class="select-style w-full p-3 rounded-lg text-base">
                    <option value="js">JavaScript / TypeScript</option>
                    <option value="css">CSS / SCSS</option>
                    <option value="html">HTML</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="c_cpp">C / C++</option>
                    <option value="php">PHP</option>
                    <option value="go">Go</option>
                    <option value="sql">SQL</option>
                </select>
            </div>
            <div class="w-full sm:w-auto">
                <button id="remove-button" class="primary-button text-white font-bold py-3 px-6 rounded-lg w-full text-lg uppercase shadow-lg shadow-[#00A389]/30">
                    REMOVE COMMENTS
                </button>
            </div>
        </div>
        <div class="pt-4 border-t border-slate-700/50">
            <label for="comment-output" class="label-text">Output (Without Comments):</label>
            <textarea id="comment-output" class="input-style w-full p-3 rounded-lg resize-y bg-slate-700/50" rows="12" readonly placeholder="Code without comments will appear here." data-code="true"></textarea>
        </div>
    `);
    const input = document.getElementById('comment-input');
    const output = document.getElementById('comment-output');
    const select = document.getElementById('language-select');
    const button = document.getElementById('remove-button');

    function removeJSComments(code){
        return code.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
    }

    function removeCSSComments(code){
        return code.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    function removeHTMLComments(code){
        return code.replace(/<!--[\s\S]*?-->/g, '');
    }

    function removePythonComments(code){
        return code.replace(/#.*$/gm, '').replace(/\n\s*\n/g, '\n');
    }
    
    function removeJavaComments(code){
        return code.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
    }
    
    function removeCSharpComments(code){
        return code.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
    }

    function removeCppComments(code) {
        return code.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
    }
    
    function removePhpComments(code) {
        return code.replace(/\/\*[\s\S]*?\*\/|\/\/.*$|#.*$/gm, '');
    }
    
    function removeGoComments(code) {
        return code.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
    }
    
    function removeSqlComments(code) {
        return code.replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '');
    }

    button.addEventListener('click', () => {
        const code = input.value.trim();
        if (!code) {
            showMessage('Please enter code to process.', 'error');
            output.value = '';
            return;
        }
        let result = '';
        const lang = select.value;
        try {
            switch (lang) {
                case 'js':
                    result = removeJSComments(code);
                    break;
                case 'css':
                    result = removeCSSComments(code);
                    break;
                case 'html':
                    result = removeHTMLComments(code);
                    break;
                case 'python':
                    result = removePythonComments(code);
                    break;
                case 'java':
                    result = removeJavaComments(code);
                    break;
                case 'csharp':
                    result = removeCSharpComments(code);
                    break;
                case 'c_cpp':
                    result = removeCppComments(code);
                    break;
                case 'php':
                    result = removePhpComments(code);
                    break;
                case 'go':
                    result = removeGoComments(code);
                    break;
                case 'sql':
                    result = removeSqlComments(code);
                    break;
                default:
                    result = 'Error: Unsupported language selection.';
                    break;
            }
            output.value = result;
            showMessage('Comments removed successfully.', 'success');
        } catch (e) {
            output.value = 'Error during comment removal.';
            showMessage('An error occurred while processing the code.', 'error');
        }
    });

    input.value = `// This is a sample comment
function hello() {
    /* Another comment */
    console.log('Hello world');
}`;
}

function renderPasswordGenerator() {
  const tool = tools.find(t => t.id === 'password-generator');
  renderToolLayout(tool.title, tool.description, `
    <div class="space-y-6">
        <div class="row">
            <div class="col-md-12 text-center">
                <label for="passwordLength" class="label-text">Password Length: <span id="passwordLengthLabel">13</span></label>
                <input type="range" class="form-range w-full" min="6" max="32" value="13" id="passwordLength">
            </div>
        </div>
        <div class="space-y-3">
            <div class="flex items-center">
                <input class="form-check-input mr-3" type="checkbox" id="numbers" checked>
                <label class="form-check-label" for="numbers">Numbers (0-9)</label>
            </div>
            <div class="flex items-center">
                <input class="form-check-input mr-3" type="checkbox" id="symbols" checked>
                <label class="form-check-label" for="symbols">Symbols (!@#$%^&*)</label>
            </div>
            <div class="flex items-center">
                <input class="form-check-input mr-3" type="checkbox" id="uppercase" checked>
                <label class="form-check-label" for="uppercase">Uppercase Letters (A-Z)</label>
            </div>
            <div class="flex items-center">
                <input class="form-check-input mr-3" type="checkbox" id="lowercase" checked>
                <label class="form-check-label" for="lowercase">Lowercase Letters (a-z)</label>
            </div>
        </div>
        <button id="generateButton" class="primary-button text-white font-bold py-3 px-6 rounded-lg w-full text-lg uppercase shadow-lg shadow-[#00A389]/30">
            GENERATE PASSWORD
        </button>
        <div class="pt-4 border-t border-slate-700/50">
            <label for="generatedPassword" class="label-text">Generated Password:</label>
            <div id="generatedPassword" class="input-style w-full p-4 rounded-lg text-center text-lg font-mono bg-slate-700/50 min-h-[60px] flex items-center justify-center">
                Your password will appear here
            </div>
            <button id="copyButton" class="mt-3 primary-button text-white font-bold py-2 px-4 rounded-lg w-full text-base" disabled>
                Copy to Clipboard
            </button>
        </div>
    </div>
  `);
  const passwordLengthInput = document.getElementById('passwordLength');
  const passwordLengthLabel = document.getElementById('passwordLengthLabel');
  const generateButton = document.getElementById('generateButton');
  const copyButton = document.getElementById('copyButton');
  const generatedPasswordElement = document.getElementById('generatedPassword');
  passwordLengthInput.addEventListener('input', function () {
    passwordLengthLabel.textContent = passwordLengthInput.value;
  });
  generateButton.addEventListener('click', function () {
    const length = parseInt(passwordLengthInput.value);
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSymbols = document.getElementById('symbols').checked;
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeLowercase = document.getElementById('lowercase').checked;
    let charset = "";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()-_+=<>?/[]{}|";
    if (charset === "") {
      showMessage('Please select at least one character set.', 'error');
      return;
    }
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
    generatedPasswordElement.textContent = password;
    copyButton.disabled = false;
    showMessage('Password generated successfully!', 'success');
  });
  copyButton.addEventListener('click', function () {
    const password = generatedPasswordElement.textContent;
    if (password && password !== 'Your password will appear here') {
      navigator.clipboard.writeText(password).then(() => {
        showMessage('Password copied to clipboard!', 'success');
      }).catch(err => {
        showMessage('Failed to copy password.', 'error');
      });
    }
  });
}

function renderQRGenerator() {
  const tool = tools.find(t => t.id === 'qr-generator');
  renderToolLayout(tool.title, tool.description, `
    <div class="space-y-6">
        <div>
            <label for="qr-data" class="label-text">Data Input (Text, URL, etc.):</label>
            <textarea id="qr-data" class="input-style w-full p-3 rounded-lg resize-y" rows="3" placeholder="Enter text, URL, or any data for QR code..."></textarea>
        </div>
        <div class="pt-2">
            <label class="label-text">Or Upload File (Image/PDF - Optional):</label>
            <div id="file-upload-box" class="file-upload-box flex flex-col justify-center items-center h-32 rounded-lg cursor-pointer">
                <p id="file-status" class="text-slate-400 text-center">
                    <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    Drag & drop or click to upload file (Image/PDF)
                </p>
            </div>
            <input type="file" id="file-input" accept="image/*,.pdf" class="hidden">
            <p id="file-info" class="text-slate-400 text-sm mt-2 hidden"></p>
        </div>
        <button id="generate-button" class="primary-button text-white font-bold py-3 px-6 rounded-lg w-full text-lg uppercase shadow-lg shadow-[#00A389]/30">
            GENERATE QR CODE
        </button>
        <div class="pt-4 border-t border-slate-700/50">
            <h3 class="text-lg font-semibold text-white mb-3">QR Code Preview:</h3>
            <div id="qrcode-container" class="min-h-[200px] flex justify-center items-center bg-slate-800/50 rounded-lg p-4">
                <p id="placeholder-text" class="text-slate-400">QR code will appear here</p>
            </div>
            <div class="mt-4 flex gap-3">
                <button id="download-button" class="primary-button text-white font-bold py-2 px-4 rounded-lg flex-1" disabled>
                    Download PNG
                </button>
                <button id="clear-button" class="bg-slate-700 text-white font-bold py-2 px-4 rounded-lg flex-1 hover:bg-slate-600">
                    Clear
                </button>
            </div>
        </div>
    </div>
  `);
  const qrDataInput = document.getElementById('qr-data');
  const fileInput = document.getElementById('file-input');
  const fileUploadBox = document.getElementById('file-upload-box');
  const fileStatus = document.getElementById('file-status');
  const fileInfo = document.getElementById('file-info');
  const generateButton = document.getElementById('generate-button');
  const downloadButton = document.getElementById('download-button');
  const clearButton = document.getElementById('clear-button');
  const qrcodeContainer = document.getElementById('qrcode-container');
  const placeholderText = document.getElementById('placeholder-text');
  let qrCanvas = null;
  let currentFile = null;
  fileUploadBox.addEventListener('click', () => fileInput.click());
  fileUploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadBox.classList.add('border-[#00A389]');
  });
  fileUploadBox.addEventListener('dragleave', () => {
    fileUploadBox.classList.remove('border-[#00A389]');
  });
  fileUploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadBox.classList.remove('border-[#00A389]');
    if (e.dataTransfer.files.length) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  });
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleFileSelect(e.target.files[0]);
    }
  });
  function handleFileSelect(file) {
    currentFile = file;
    fileInfo.textContent = `Selected file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    fileInfo.classList.remove('hidden');
    showMessage('File selected. Enter text/URL and generate QR code.', 'success');
  }
  function generateQRCode() {
    const textData = qrDataInput.value.trim();
    let dataToEncode = textData;
    if (!textData && !currentFile) {
      showMessage('Please enter text/URL or upload a file.', 'error');
      return;
    }
    if (currentFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        dataToEncode = textData || `File: ${currentFile.name}`;
        createQRCanvas(dataToEncode);
      };
      reader.readAsDataURL(currentFile);
    } else {
      createQRCanvas(dataToEncode);
    }
  }
  function createQRCanvas(data) {
    qrcodeContainer.innerHTML = '';
    if (!qrCanvas) {
      qrCanvas = document.createElement('canvas');
    }
    qrCanvas.classList.add('qr-canvas-fade');
    qrcodeContainer.appendChild(qrCanvas);
    const options = {
      errorCorrectionLevel: 'H',
      margin: 2,
      scale: 6,
      color: {
        dark: "#ffffff",
        light: "#1E293B"
      }
    };
    QRCode.toCanvas(qrCanvas, data, options, (error) => {
      if (error) {
        showMessage('Error generating QR code.', 'error');
        downloadButton.disabled = true;
      } else {
        qrcodeContainer.classList.add("qrcode-ready");
        downloadButton.disabled = false;
        showMessage('QR code generated successfully!', 'success');
      }
    });
  }
  function downloadQRCode() {
    if (qrCanvas && !downloadButton.disabled) {
      try {
        const imageURL = qrCanvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = `qr-code-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showMessage('Download started!', 'success');
      } catch (e) {
        showMessage('Download failed.', 'error');
      }
    }
  }
  function clearAll() {
    qrDataInput.value = '';
    fileInput.value = '';
    currentFile = null;
    fileInfo.classList.add('hidden');
    fileInfo.textContent = '';
    qrcodeContainer.innerHTML = '<p id="placeholder-text" class="text-slate-400">QR code will appear here</p>';
    downloadButton.disabled = true;
    showMessage('Cleared all inputs.', 'success');
  }
  generateButton.addEventListener('click', generateQRCode);
  downloadButton.addEventListener('click', downloadQRCode);
  clearButton.addEventListener('click', clearAll);
}

function renderVCardGenerator() {
  const tool = tools.find(t => t.id === 'vcard-generator');
  renderToolLayout(tool.title, tool.description, `
    <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="name-input" class="label-text">First Name:</label>
                <input type="text" id="name-input" class="input-style w-full p-3 rounded-lg" placeholder="John">
            </div>
            <div>
                <label for="surname-input" class="label-text">Last Name:</label>
                <input type="text" id="surname-input" class="input-style w-full p-3 rounded-lg" placeholder="Doe">
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="title-input" class="label-text">Title/Job:</label>
                <input type="text" id="title-input" class="input-style w-full p-3 rounded-lg" placeholder="Software Developer">
            </div>
            <div>
                <label for="company-input" class="label-text">Company:</label>
                <input type="text" id="company-input" class="input-style w-full p-3 rounded-lg" placeholder="Tech Corp">
            </div>
        </div>
        <div>
            <label for="phone-input" class="label-text">Phone Number:</label>
            <input type="tel" id="phone-input" class="input-style w-full p-3 rounded-lg" placeholder="+15551234567">
        </div>
        <div>
            <label for="email-input" class="label-text">Email Address:</label>
            <input type="email" id="email-input" class="input-style w-full p-3 rounded-lg" placeholder="john@example.com">
        </div>
        <div>
            <label for="url-input" class="label-text">Website/Social URL:</label>
            <input type="url" id="url-input" class="input-style w-full p-3 rounded-lg" placeholder="https://linkedin.com/in/johndoe">
        </div>
        <button id="generate-button" class="primary-button text-white font-bold py-3 px-6 rounded-lg w-full text-lg uppercase shadow-lg shadow-[#00A389]/30">
            GENERATE VCARD QR
        </button>
        <div class="pt-4 border-t border-slate-700/50">
            <h3 class="text-lg font-semibold text-white mb-3">VCard QR Code:</h3>
            <div id="qrcode-container" class="min-h-[200px] flex justify-center items-center bg-slate-800/50 rounded-lg p-4">
                <p id="placeholder-text" class="text-slate-400">VCard QR will appear here</p>
            </div>
            <div class="mt-4">
                <button id="download-button" class="primary-button text-white font-bold py-2 px-4 rounded-lg w-full" disabled>
                    Download VCard QR
                </button>
            </div>
            <div class="mt-4 p-3 bg-slate-800/30 rounded-lg">
                <p class="text-sm text-slate-300">
                    <strong>Note:</strong> This QR code contains VCard (v3.0) format. When scanned, it will prompt to save the contact information to phone contacts.
                </p>
            </div>
        </div>
    </div>
  `);
  const nameInput = document.getElementById('name-input');
  const surnameInput = document.getElementById('surname-input');
  const titleInput = document.getElementById('title-input');
  const companyInput = document.getElementById('company-input');
  const phoneInput = document.getElementById('phone-input');
  const emailInput = document.getElementById('email-input');
  const urlInput = document.getElementById('url-input');
  const generateButton = document.getElementById('generate-button');
  const downloadButton = document.getElementById('download-button');
  const qrcodeContainer = document.getElementById('qrcode-container');
  const placeholderText = document.getElementById('placeholder-text');
  let qrCanvas = null;
  function createVCardData(data) {
    let vCard = 'BEGIN:VCARD\nVERSION:3.0\n';
    if (data.name || data.surname) {
      vCard += `N:${data.surname || ''};${data.name || ''};;;\n`;
      vCard += `FN:${data.name || ''} ${data.surname || ''}\n`;
    }
    if (data.title) vCard += `TITLE:${data.title}\n`;
    if (data.company) vCard += `ORG:${data.company}\n`;
    if (data.phone) vCard += `TEL;TYPE=WORK,CELL:${data.phone}\n`;
    if (data.email) vCard += `EMAIL:${data.email}\n`;
    if (data.url) vCard += `URL:${data.url}\n`;
    vCard += 'END:VCARD';
    return vCard;
  }
  function generateVCardQR() {
    const data = {
      name: nameInput.value.trim(),
      surname: surnameInput.value.trim(),
      title: titleInput.value.trim(),
      company: companyInput.value.trim(),
      phone: phoneInput.value.trim().replace(/[^0-9+]/g, ''),
      email: emailInput.value.trim(),
      url: urlInput.value.trim()
    };
    const isAnyFieldFilled = Object.values(data).some(val => val.length > 0);
    if (!isAnyFieldFilled) {
      showMessage('Please fill in at least one field.', 'error');
      return;
    }
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }
    const vCardData = createVCardData(data);
    qrcodeContainer.innerHTML = '';
    if (!qrCanvas) {
      qrCanvas = document.createElement('canvas');
    }
    qrCanvas.classList.add('qr-canvas-fade');
    qrcodeContainer.appendChild(qrCanvas);
    const options = {
      errorCorrectionLevel: 'H',
      margin: 2,
      scale: 6,
      color: {
        dark: "#ffffff",
        light: "#1E293B"
      }
    };
    try {
      QRCode.toCanvas(qrCanvas, vCardData, options, (error) => {
        if (error) {
          showMessage('Error generating VCard QR code.', 'error');
          downloadButton.disabled = true;
        } else {
          qrcodeContainer.classList.add("qrcode-ready");
          downloadButton.disabled = false;
          showMessage('VCard QR code generated! Scan to save contact.', 'success');
        }
      });
    } catch (e) {
      showMessage('Error generating QR code.', 'error');
      downloadButton.disabled = true;
    }
  }
  function downloadVCardQR() {
    if (qrCanvas && !downloadButton.disabled) {
      try {
        const imageURL = qrCanvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = `vcard-qr-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showMessage('VCard QR downloaded!', 'success');
      } catch (e) {
        showMessage('Download failed.', 'error');
      }
    }
  }
  generateButton.addEventListener('click', generateVCardQR);
  downloadButton.addEventListener('click', downloadVCardQR);
}

function navigate(toolId) {
  if (toolId) {
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      tool.render();
      history.pushState({ toolId: toolId }, '', `#${toolId}`);
    }
  } else {
    renderHomePage();
    history.pushState({ toolId: null }, '', './');
  }
}

function renderToolLayout(title, description, content) {
  appContainer.innerHTML = `
    <div class="main-container">
        <header class="text-center">
            <h1 class="text-4xl font-extrabold text-white tracking-wide">${title}</h1>
            <p class="text-slate-400 mt-2">${description}</p>
            <button onclick="navigate(null)" class="text-[#00A389] hover:text-[#008775] mt-4 block text-sm mx-auto">← Back to All Tools</button>
        </header>
        <div class="card-area">
            ${content}
        </div>
        <div class="footer-attribution">
            CREATED BY <a href="https://www.github.com/ismailoksuz" target="_blank">ISMAILOKSUZ</a>
        </div>
    </div>
  `;
  const cardArea = appContainer.querySelector('.card-area');
  if (cardArea && !cardArea.contains(messageBox)) {
    cardArea.appendChild(messageBox);
  }
}

function renderHomePage() {
  let content = `
    <header class="text-center mb-10">
    <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-wide">DEVELOPER TOOLKIT</h1>
    <h3 class="text-lg md:text-xl text-slate-300 mt-2">by <a href="https://www.github.com/ismailoksuz" style="color: #00A389" target="_blank">İsmail ÖKSÜZ</a></h3>
    <p class="text-slate-400 mt-4 max-w-2xl mx-auto">A collection of essential web development tools for everyday use. Click on any tool to get started.</p>
    </header>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  `;
  tools.forEach(tool => {
    content += `
        <div onclick="navigate('${tool.id}')" class="card-area cursor-pointer hover:border-[#00A389] hover:shadow-lg hover:shadow-[#00A389]/20 transition-all duration-300 transform hover:-translate-y-1 h-full">
            <h3 class="text-xl font-bold text-white mb-3">${tool.title}</h3>
            <p class="text-slate-400 text-sm">${tool.description}</p>
            <div class="mt-4 pt-3 border-t border-slate-700/50">
                <span class="text-[#00A389] text-sm font-medium">Click to use →</span>
            </div>
        </div>
    `;
  });
  content += `</div>`;
  appContainer.innerHTML = `
    <div class="main-container">
        ${content}
        <div class="footer-attribution">
            CREATED BY <a href="https://www.github.com/ismailoksuz" target="_blank">ISMAILOKSUZ</a>
        </div>
    </div>
  `;
}

const Units = {
  length: {
    m: { name: 'Meter', factor: 1 },
    km: { name: 'Kilometer', factor: 1000 },
    mi: { name: 'Mile', factor: 1609.34 },
    ft: { name: 'Foot', factor: 0.3048 },
    in: { name: 'Inch', factor: 0.0254 }
  },
  weight: {
    kg: { name: 'Kilogram', factor: 1 },
    g: { name: 'Gram', factor: 0.001 },
    lb: { name: 'Pound', factor: 0.453592 },
    oz: { name: 'Ounce', factor: 0.0283495 }
  },
  temperature: {
    C: { name: 'Celsius', factor: 1 },
    F: { name: 'Fahrenheit', factor: 1 },
    K: { name: 'Kelvin', factor: 1 }
  }
};

function updateUnitOptions(category, inputSelect, outputSelect) {
  inputSelect.innerHTML = '';
  outputSelect.innerHTML = '';
  const units = Units[category];
  for (const key in units) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = `${units[key].name} (${key})`;
    inputSelect.appendChild(option.cloneNode(true));
    outputSelect.appendChild(option);
  }
  if (inputSelect.options.length > 1) {
    outputSelect.selectedIndex = 1;
  }
}

function convertUnits(category, inputValue, inputUnitKey, outputUnitKey, outputValueElement) {
  const value = parseFloat(inputValue);
  if (isNaN(value)) {
    outputValueElement.value = '';
    return showMessage('Please enter a valid number.', 'error');
  }
  let result;
  if (category === 'temperature') {
    let baseValue;
    if (inputUnitKey === 'F') {
      baseValue = (value - 32) * (5 / 9);
    } else if (inputUnitKey === 'K') {
      baseValue = value - 273.15;
    } else {
      baseValue = value;
    }
    if (outputUnitKey === 'F') {
      result = baseValue * (9 / 5) + 32;
    } else if (outputUnitKey === 'K') {
      result = baseValue + 273.15;
    } else {
      result = baseValue;
    }
  } else {
    const units = Units[category];
    const inputFactor = units[inputUnitKey].factor;
    const outputFactor = units[outputUnitKey].factor;
    const baseValue = value * inputFactor;
    result = baseValue / outputFactor;
  }
  outputValueElement.value = result.toFixed(4);
}

function renderUnitConverter() {
  const tool = tools.find(t => t.id === 'unit-converter');
  renderToolLayout(tool.title, tool.description, `
    <div>
        <label for="category-select" class="label-text">Select Category:</label>
        <select id="category-select" class="select-style w-full p-3 rounded-lg text-base">
            <option value="length">Length</option>
            <option value="weight">Weight / Mass</option>
            <option value="temperature">Temperature</option>
        </select>
    </div>
    <div id="conversion-fields" class="space-y-4">
        <div class="conversion-field">
            <input type="number" id="input-value" class="input-style p-3 rounded-lg" value="1" placeholder="Enter value">
            <select id="input-unit" class="select-style p-3 rounded-lg"></select>
        </div>
        <div class="conversion-field">
            <input type="number" id="output-value" class="input-style p-3 rounded-lg bg-slate-700/50" readonly placeholder="Result">
            <select id="output-unit" class="select-style p-3 rounded-lg"></select>
        </div>
    </div>
  `);
  const categorySelect = document.getElementById('category-select');
  const inputValue = document.getElementById('input-value');
  const outputValue = document.getElementById('output-value');
  const inputUnitSelect = document.getElementById('input-unit');
  const outputUnitSelect = document.getElementById('output-unit');
  const convert = () => {
    convertUnits(categorySelect.value, inputValue.value, inputUnitSelect.value, outputUnitSelect.value, outputValue);
  };
  categorySelect.addEventListener('change', () => {
    updateUnitOptions(categorySelect.value, inputUnitSelect, outputUnitSelect);
    convert();
  });
  inputValue.addEventListener('input', convert);
  inputUnitSelect.addEventListener('change', convert);
  outputUnitSelect.addEventListener('change', convert);
  updateUnitOptions(categorySelect.value, inputUnitSelect, outputUnitSelect);
  convert();
}

function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function toSentenceCase(str) {
  if (!str) return "";
  str = str.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toSlugCase(str, separator = '-') {
  return str.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, separator).replace(new RegExp(`[${separator}]{2,}`, 'g'), separator);
}

function processTextConversion(text, action) {
  switch (action) {
    case 'lower': return text.toLowerCase();
    case 'upper': return text.toUpperCase();
    case 'title': return toTitleCase(text);
    case 'sentence': return toSentenceCase(text);
    case 'kebab': return toSlugCase(text, '-');
    case 'snake': return toSlugCase(text, '_');
    case 'camel': let result = toTitleCase(text).replace(/\s/g, ''); return result.charAt(0).toLowerCase() + result.slice(1);
    default: return text;
  }
}

function renderTextCaseConverter() {
  const tool = tools.find(t => t.id === 'text-case-converter');
  renderToolLayout(tool.title, tool.description, `
    <div>
        <label for="input-text" class="label-text">Input Text:</label>
        <textarea id="input-text" class="input-style w-full p-3 rounded-lg resize-y" rows="8" placeholder="Enter the text you want to convert..."></textarea>
    </div>
    <div class="flex flex-col sm:flex-row gap-4 items-end">
        <div class="flex-1 w-full">
            <label for="action-select" class="label-text">Conversion Type:</label>
            <select id="action-select" class="select-style w-full p-3 rounded-lg text-base">
                <option value="lower">lowercase</option>
                <option value="upper">UPPERCASE</option>
                <option value="title">Title Case</option>
                <option value="sentence">Sentence case</option>
                <option value="kebab">kebab-case</option>
                <option value="snake">snake_case</option>
                <option value="camel">camelCase</option>
            </select>
        </div>
        <div class="w-full sm:w-auto">
            <button id="process-button" class="primary-button text-white font-bold py-3 px-6 rounded-lg w-full text-lg uppercase shadow-lg shadow-[#00A389]/30">CONVERT</button>
        </div>
    </div>
    <div class="pt-4 border-t border-slate-700/50">
        <label for="output-text" class="label-text">Output:</label>
        <textarea id="output-text" class="input-style w-full p-3 rounded-lg resize-y bg-slate-700/50" rows="8" readonly placeholder="Converted text will appear here."></textarea>
    </div>
  `);
  const inputTextarea = document.getElementById('input-text');
  const outputTextarea = document.getElementById('output-text');
  const actionSelect = document.getElementById('action-select');
  const processButton = document.getElementById('process-button');
  processButton.addEventListener('click', () => {
    const text = inputTextarea.value.trim();
    const action = actionSelect.value;
    if (text === '') {
      outputTextarea.value = '';
      return showMessage('Please enter text to convert.', 'error');
    }
    try {
      const result = processTextConversion(text, action);
      outputTextarea.value = result;
      showMessage(`Text successfully converted to ${action} case.`, 'success');
    } catch (e) {
      outputTextarea.value = `Error during conversion.`;
      showMessage('An error occurred during processing.', 'error');
    }
  });
  inputTextarea.value = `This is a sample text for case conversion.`;
}

function renderBase64Converter() {
  const tool = tools.find(t => t.id === 'base64-converter');
  renderToolLayout(tool.title, tool.description, `
    <div>
        <label for="input-text" class="label-text">Input Text / Base64 Data:</label>
        <textarea id="input-text" class="input-style w-full p-3 rounded-lg resize-y" rows="8" placeholder="Paste your text or Base64 string here..."></textarea>
    </div>
    <div class="flex flex-col sm:flex-row gap-4 items-end">
        <div class="flex-1 w-full">
            <label for="action-select" class="label-text">Operation:</label>
            <select id="action-select" class="select-style w-full p-3 rounded-lg text-base">
                <option value="encode">Encode (Text to Base64)</option>
                <option value="decode">Decode (Base64 to Text)</option>
            </select>
        </div>
        <div class="w-full sm:w-auto">
            <button id="process-button" class="primary-button text-white font-bold py-3 px-6 rounded-lg w-full text-lg uppercase shadow-lg shadow-[#00A389]/30">PROCESS</button>
        </div>
    </div>
    <div class="pt-4 border-t border-slate-700/50">
        <label for="output-text" class="label-text">Output:</label>
        <textarea id="output-text" class="input-style w-full p-3 rounded-lg resize-y bg-slate-700/50" rows="8" readonly placeholder="Result will appear here."></textarea>
    </div>
  `);
  const inputTextarea = document.getElementById('input-text');
  const outputTextarea = document.getElementById('output-text');
  const actionSelect = document.getElementById('action-select');
  const processButton = document.getElementById('process-button');
  processButton.addEventListener('click', () => {
    const text = inputTextarea.value.trim();
    const action = actionSelect.value;
    if (text === '') {
      outputTextarea.value = '';
      return showMessage('Please enter text or Base64 string to process.', 'error');
    }
    try {
      let result = '';
      if (action === 'encode') {
        result = btoa(text);
        showMessage('Text successfully encoded.', 'success');
      } else if (action === 'decode') {
        result = atob(text);
        showMessage('Text successfully decoded.', 'success');
      }
      outputTextarea.value = result;
    } catch (e) {
      outputTextarea.value = `Error processing data. Check if the Base64 string is valid or contains non-ASCII characters.`;
      showMessage('An error occurred during processing.', 'error');
    }
  });
  inputTextarea.value = `This text will be encoded with Base64.`;
}

function renderURLEncoder() {
  const tool = tools.find(t => t.id === 'url-encoder');
  renderToolLayout(tool.title, tool.description, `
    <div>
        <label for="input-text" class="label-text">Input Text / URL:</label>
        <textarea id="input-text" class="input-style w-full p-3 rounded-lg resize-y" rows="8" placeholder="Paste your text or URL here..."></textarea>
    </div>
    <div class="flex flex-col sm:flex-row gap-4 items-end">
        <div class="flex-1 w-full">
            <label for="action-select" class="label-text">Operation:</label>
            <select id="action-select" class="select-style w-full p-3 rounded-lg text-base">
                <option value="encode">Encode (Text to %-escape)</option>
                <option value="decode">Decode (%-escape to Text)</option>
            </select>
        </div>
        <div class="w-full sm:w-auto">
            <button id="process-button" class="primary-button text-white font-bold py-3 px-6 rounded-lg w-full text-lg uppercase shadow-lg shadow-[#00A389]/30">PROCESS</button>
        </div>
    </div>
    <div class="pt-4 border-t border-slate-700/50">
        <label for="output-text" class="label-text">Output:</label>
        <textarea id="output-text" class="input-style w-full p-3 rounded-lg resize-y bg-slate-700/50" rows="8" readonly placeholder="Result will appear here."></textarea>
    </div>
  `);
  const inputTextarea = document.getElementById('input-text');
  const outputTextarea = document.getElementById('output-text');
  const actionSelect = document.getElementById('action-select');
  const processButton = document.getElementById('process-button');
  processButton.addEventListener('click', () => {
    const text = inputTextarea.value.trim();
    const action = actionSelect.value;
    if (text === '') {
      outputTextarea.value = '';
      return showMessage('Please enter text or URL to process.', 'error');
    }
    try {
      let result = '';
      if (action === 'encode') {
        result = encodeURIComponent(text);
        showMessage('Text successfully encoded.', 'success');
      } else if (action === 'decode') {
        result = decodeURIComponent(text);
        showMessage('Text successfully decoded.', 'success');
      }
      outputTextarea.value = result;
    } catch (e) {
      outputTextarea.value = `Error processing data. Check if you are trying to decode an invalid URL string.`;
      showMessage('An error occurred during processing.', 'error');
    }
  });
  inputTextarea.value = `https://example.com/search?q=hello world & user=İsmail Öksüz`;
}

function renderJsonXmlFormatter() {
  const tool = tools.find(t => t.id === 'json-xml-formatter');
  renderToolLayout(tool.title, tool.description, `
    <div>
        <label for="data-input" class="label-text">Input Data:</label>
        <textarea id="data-input" class="input-style w-full p-3 rounded-lg resize-y" rows="12" placeholder="Paste your JSON or XML data here..."></textarea>
    </div>
    <div class="flex flex-col sm:flex-row gap-4 items-end">
        <div class="flex-1 w-full">
            <label for="type-select" class="label-text">Select Data Type:</label>
            <select id="type-select" class="select-style w-full p-3 rounded-lg text-base">
                <option value="json">JSON</option>
                <option value="xml">XML</option>
            </select>
        </div>
        <div class="w-full sm:w-auto">
            <button id="format-button" class="primary-button text-white font-bold py-3 px-6 rounded-lg w-full text-lg uppercase shadow-lg shadow-[#00A389]/30">FORMAT & VALIDATE</button>
        </div>
    </div>
    <div class="pt-4 border-t border-slate-700/50">
        <label for="data-output" class="label-text">Formatted Output:</label>
        <textarea id="data-output" class="input-style w-full p-3 rounded-lg resize-y bg-slate-700/50" rows="12" readonly placeholder="Formatted and validated data will appear here."></textarea>
    </div>
  `);
  const dataInput = document.getElementById('data-input');
  const dataOutput = document.getElementById('data-output');
  const typeSelect = document.getElementById('type-select');
  const formatButton = document.getElementById('format-button');
  formatButton.addEventListener('click', () => {
    const data = dataInput.value.trim();
    const dataType = typeSelect.value;
    let formattedData = '';
    if (data === '') {
      dataOutput.value = '';
      return showMessage('Please enter data to format.', 'error');
    }
    try {
      if (dataType === 'json') {
        const parsedJson = JSON.parse(data);
        formattedData = JSON.stringify(parsedJson, null, 4);
        showMessage('JSON successfully validated and formatted.', 'success');
      } else if (dataType === 'xml') {
        const options = { indent_size: 4, space_in_empty_paren: true };
        formattedData = window.html_beautify(data, options);
        showMessage('XML successfully formatted.', 'success');
      }
      dataOutput.value = formattedData;
    } catch (e) {
      let errorMessage = `Validation Error: Invalid ${dataType.toUpperCase()} syntax.`;
      if (dataType === 'json') {
        errorMessage += ` Check commas, braces, or invalid JSON structures.`;
      } else if (dataType === 'xml') {
        errorMessage += ` Check tag nesting or malformed XML.`;
      }
      dataOutput.value = errorMessage;
      showMessage(errorMessage, 'error');
    }
  });
  dataInput.value = `{"name":"ProductX","price":19.99,"features":["durable","portable","stylish"],"inStock":true}`;
}

function renderImageCompressor() {
  const tool = tools.find(t => t.id === 'image-compressor');
  renderToolLayout(tool.title, tool.description, `
    <div>
        <label for="image-upload" class="label-text">Upload Image:</label>
        <div id="image-upload" class="file-upload-box flex justify-center items-center h-24 rounded-lg">
            <p id="file-status" class="text-slate-400">Drag & drop or click to upload (JPG/PNG)</p>
        </div>
        <input type="file" id="file-input" accept="image/jpeg,image/png" class="hidden">
    </div>
    <div id="image-controls" class="space-y-4 hidden">
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="width-input" class="label-text">New Width (px):</label>
                <input type="number" id="width-input" class="input-style w-full p-3 rounded-lg" value="800">
            </div>
            <div>
                <label for="height-input" class="label-text">New Height (px):</label>
                <input type="number" id="height-input" class="input-style w-full p-3 rounded-lg" value="600">
            </div>
        </div>
        <div>
            <label for="quality-input" class="label-text">Quality (Compression, 0.1 - 1.0): <span id="quality-value">0.8</span></label>
            <input type="range" id="quality-input" min="0.1" max="1.0" step="0.05" value="0.8" class="slider-thumb w-full">
        </div>
        <button id="process-image-button" class="primary-button text-white font-bold py-3 px-6 rounded-lg w-full text-lg uppercase shadow-lg shadow-[#00A389]/30">RESIZE & COMPRESS</button>
    </div>
    <div id="image-output" class="pt-4 border-t border-slate-700/50 hidden">
        <p class="preview-title">Preview and Download:</p>
        <img id="output-preview" class="image-preview" alt="Processed Image">
        <p id="output-info" class="text-slate-400 mt-2 text-sm"></p>
        <a id="download-link" href="#" download="compressed_image.jpg" class="primary-button inline-block text-white font-bold py-2 px-4 rounded-lg mt-4 w-full text-center">Download</a>
    </div>
  `);
  const fileInput = document.getElementById('file-input');
  const imageUpload = document.getElementById('image-upload');
  const fileStatus = document.getElementById('file-status');
  const imageControls = document.getElementById('image-controls');
  const widthInput = document.getElementById('width-input');
  const heightInput = document.getElementById('height-input');
  const qualityInput = document.getElementById('quality-input');
  const qualityValueSpan = document.getElementById('quality-value');
  const processImageButton = document.getElementById('process-image-button');
  const imageOutput = document.getElementById('image-output');
  const outputPreview = document.getElementById('output-preview');
  const outputInfo = document.getElementById('output-info');
  const downloadLink = document.getElementById('download-link');
  let originalFile = null;
  let originalWidth = 0;
  let originalHeight = 0;
  imageUpload.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileSelect);
  imageUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageUpload.classList.add('border-[#00A389]');
  });
  imageUpload.addEventListener('dragleave', () => {
    imageUpload.classList.remove('border-[#00A389]');
  });
  imageUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    imageUpload.classList.remove('border-[#00A389]');
    if (e.dataTransfer.files.length) handleFileSelect({ target: { files: e.dataTransfer.files } });
  });
  qualityInput.addEventListener('input', () => {
    qualityValueSpan.textContent = qualityInput.value;
  });
  processImageButton.addEventListener('click', processImage);
  widthInput.addEventListener('input', maintainAspectRatio);
  heightInput.addEventListener('input', maintainAspectRatio);
  function handleFileSelect(event) {
    originalFile = event.target.files[0];
    if (!originalFile || !originalFile.type.match('image.*')) {
      showMessage('Please select a valid image file (JPG/PNG).', 'error');
      return;
    }
    fileStatus.textContent = `Selected file: ${originalFile.name}`;
    imageControls.classList.remove('hidden');
    imageOutput.classList.add('hidden');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        originalWidth = img.width;
        originalHeight = img.height;
        widthInput.value = originalWidth > 800 ? 800 : originalWidth;
        heightInput.value = Math.round((widthInput.value / originalWidth) * originalHeight);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(originalFile);
  }
  function maintainAspectRatio(event) {
    const target = event.target.id === 'width-input' ? 'width' : 'height';
    const newWidth = parseInt(widthInput.value);
    const newHeight = parseInt(heightInput.value);
    if (isNaN(newWidth) || isNaN(newHeight)) return;
    if (target === 'width') {
      heightInput.value = Math.round((newWidth / originalWidth) * originalHeight);
    } else {
      widthInput.value = Math.round((newHeight / originalHeight) * originalWidth);
    }
  }
  function processImage() {
    if (!originalFile) {
      showMessage('Please upload an image file first.', 'error');
      return;
    }
    const newWidth = parseInt(widthInput.value);
    const newHeight = parseInt(heightInput.value);
    const quality = parseFloat(qualityInput.value);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        const outputType = originalFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob((blob) => {
          outputPreview.src = URL.createObjectURL(blob);
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = `compressed_${newWidth}x${newHeight}.${outputType.split('/')[1]}`;
          outputInfo.textContent = `New size: ${newWidth}x${newHeight} px. File size: ${(blob.size / 1024).toFixed(2)} KB.`;
          imageOutput.classList.remove('hidden');
          showMessage('Image processed successfully.', 'success');
        }, outputType, quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(originalFile);
  }
}

function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function adjustHue(h, s, l, deg) {
  let newH = (h * 360 + deg) % 360;
  if (newH < 0) newH += 360;
  return hslToRgb(newH / 360, s, l);
}

function generatePalette(baseHex) {
  const rgb = hexToRgb(baseHex);
  if (!rgb) return null;
  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const palette = {
    complementary: [adjustHue(h, s, l, 180)],
    analogous: [adjustHue(h, s, l, -30), adjustHue(h, s, l, 30)],
    triadic: [adjustHue(h, s, l, -120), adjustHue(h, s, l, 120)]
  };
  const formatColor = (rgbArr) => {
    const hex = rgbToHex(...rgbArr);
    const rgbStr = `rgb(${rgbArr.join(',')})`;
    return { hex, rgb: rgbStr };
  };
  return {
    base: formatColor([rgb.r, rgb.g, rgb.b]),
    complementary: palette.complementary.map(formatColor),
    analogous: palette.analogous.map(formatColor),
    triadic: palette.triadic.map(formatColor)
  };
}

function renderColorPalette() {
  const tool = tools.find(t => t.id === 'color-palette');
  renderToolLayout(tool.title, tool.description, `
    <div>
        <label for="base-color-input" class="label-text">Base Color (HEX):</label>
        <div class="flex gap-4">
            <input type="color" id="color-picker" value="#00A389" class="w-12 h-12 rounded-lg cursor-pointer">
            <input type="text" id="base-color-input" class="input-style flex-1 p-3 rounded-lg uppercase" maxlength="7" value="#00A389" placeholder="#RRGGBB">
        </div>
    </div>
    <div id="palette-output" class="pt-4 border-t border-slate-700/50">
        <p class="preview-title">Generated Palette:</p>
        <div id="base-color-area" class="mb-4"></div>
        <div id="complementary-area" class="mb-4"></div>
        <div id="analogous-area" class="mb-4"></div>
        <div id="triadic-area" class="mb-4"></div>
    </div>
  `);
  const colorPicker = document.getElementById('color-picker');
  const baseColorInput = document.getElementById('base-color-input');
  const updateUI = (hex) => {
    const palette = generatePalette(hex);
    if (!palette) {
      showMessage('Please enter a valid HEX code.', 'error');
      return;
    }
    baseColorInput.value = palette.base.hex;
    colorPicker.value = palette.base.hex;
    const renderSwatch = (title, colors, id) => {
      let html = `<h4 class="text-sm font-medium text-slate-300 mt-4 mb-2">${title}:</h4><div class="grid grid-cols-1 md:grid-cols-3 gap-2">`;
      colors.forEach(color => {
        html += `
          <div class="info-box p-2">
            <div class="color-swatch mb-2" style="background-color: ${color.hex};"></div>
            <p class="text-xs text-center">${color.hex}</p>
            <p class="text-xs text-center text-slate-400">${color.rgb}</p>
          </div>
        `;
      });
      html += `</div>`;
      document.getElementById(id).innerHTML = html;
    };
    document.getElementById('base-color-area').innerHTML = `
      <h4 class="text-sm font-medium text-slate-300 mb-2">Base Color:</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div class="info-box p-2 col-span-1">
          <div class="color-swatch mb-2" style="background-color: ${palette.base.hex};"></div>
          <p class="text-xs text-center">${palette.base.hex}</p>
          <p class="text-xs text-center text-slate-400">${palette.base.rgb}</p>
        </div>
      </div>
    `;
    renderSwatch('Complementary', palette.complementary, 'complementary-area');
    renderSwatch('Analogous', palette.analogous, 'analogous-area');
    renderSwatch('Triadic', palette.triadic, 'triadic-area');
  };
  colorPicker.addEventListener('input', (e) => updateUI(e.target.value));
  baseColorInput.addEventListener('input', (e) => {
    let hex = e.target.value.toUpperCase().replace(/[^0-9A-F#]/g, '');
    if (hex.length === 7 && hex.startsWith('#')) {
      updateUI(hex);
    }
    baseColorInput.value = hex;
  });
  updateUI(baseColorInput.value);
}

function renderPasswordTester() {
  const tool = tools.find(t => t.id === 'password-tester');
  renderToolLayout(tool.title, tool.description, `
    <div>
        <label for="password-input" class="label-text">Enter Password:</label>
        <div class="relative">
            <input type="password" id="password-input" class="input-style w-full p-3 rounded-lg" placeholder="Type your password here..." autocomplete="off">
            <button id="toggle-visibility" class="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-white" title="Toggle Visibility">
                <svg id="eye-open" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg id="eye-closed" class="h-6 w-6 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 1.274-4.057 5.065-7 9.542-7 1.258 0 2.483.21 3.637.616M17.5 12a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 12h.01M16 12h.01"/>
                </svg>
            </button>
        </div>
    </div>
    <div class="space-y-4 pt-2">
        <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Strength:</span>
            <span id="strength-status" class="text-xl font-bold text-slate-400">---</span>
        </div>
        <div id="strength-bar-container" class="w-full bg-slate-700 rounded-full">
            <div id="strength-bar"></div>
        </div>
        <div class="pt-4 border-t border-slate-700/50">
            <h3 class="text-lg font-semibold text-white mb-2">Security Criteria:</h3>
            <ul id="criteria-list" class="space-y-1 text-sm text-slate-400">
                <li><span id="len-check" class="text-red-400">✗</span> Minimum 8 characters long</li>
                <li><span id="lower-check" class="text-red-400">✗</span> Contains lowercase letters (a-z)</li>
                <li><span id="upper-check" class="text-red-400">✗</span> Contains uppercase letters (A-Z)</li>
                <li><span id="num-check" class="text-red-400">✗</span> Contains numbers (0-9)</li>
                <li><span id="sym-check" class="text-red-400">✗</span> Contains symbols (!@#$...)</li>
            </ul>
        </div>
    </div>
  `);
  const passwordInput = document.getElementById('password-input');
  const strengthBar = document.getElementById('strength-bar');
  const strengthStatus = document.getElementById('strength-status');
  const toggleButton = document.getElementById('toggle-visibility');
  const eyeOpen = document.getElementById('eye-open');
  const eyeClosed = document.getElementById('eye-closed');
  const checks = {
    len: document.getElementById('len-check'),
    lower: document.getElementById('lower-check'),
    upper: document.getElementById('upper-check'),
    num: document.getElementById('num-check'),
    sym: document.getElementById('sym-check')
  };
  function updateCheck(element, isValid) {
    element.textContent = isValid ? '✓' : '✗';
    element.classList.toggle('text-green-400', isValid);
    element.classList.toggle('text-red-400', !isValid);
  }
  function checkStrength(password) {
    const minLength = 8;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[$&+,:;=?@#|'<>.^*()%!-]/.test(password);
    const isLongEnough = password.length >= minLength;
    updateCheck(checks.len, isLongEnough);
    updateCheck(checks.lower, hasLower);
    updateCheck(checks.upper, hasUpper);
    updateCheck(checks.num, hasNumber);
    updateCheck(checks.sym, hasSymbol);
    let score = 0;
    if (isLongEnough) score += 1;
    if (hasLower) score += 1;
    if (hasUpper) score += 1;
    if (hasNumber) score += 1;
    if (hasSymbol) score += 1;
    if (password.length > 12) score += 0.5;
    if (password.length > 16) score += 0.5;
    let percent = Math.min(100, Math.round((score / 6) * 100));
    let statusText = 'Too Weak';
    let statusColor = 'bg-red-500';
    let statusTextColor = 'text-red-400';
    if (score >= 2 && score < 3) {
      statusText = 'Weak';
      statusColor = 'bg-yellow-500';
      statusTextColor = 'text-yellow-400';
    } else if (score >= 3 && score < 4) {
      statusText = 'Moderate';
      statusColor = 'bg-blue-500';
      statusTextColor = 'text-blue-400';
    } else if (score >= 4) {
      statusText = 'Strong';
      statusColor = 'bg-green-500';
      statusTextColor = 'text-green-400';
    }
    strengthBar.style.width = `${percent}%`;
    strengthBar.className = statusColor;
    strengthStatus.textContent = statusText;
    strengthStatus.className = `text-xl font-bold ${statusTextColor}`;
    if (password.length === 0) {
      strengthBar.style.width = '0%';
      strengthStatus.textContent = '---';
      strengthStatus.className = 'text-xl font-bold text-slate-400';
      Object.values(checks).forEach(c => updateCheck(c, false));
    }
  }
  passwordInput.addEventListener('input', (e) => {
    checkStrength(e.target.value);
  });
  toggleButton.addEventListener('click', () => {
    const isVisible = passwordInput.type === 'text';
    passwordInput.type = isVisible ? 'password' : 'text';
    eyeOpen.classList.toggle('hidden', !isVisible);
    eyeClosed.classList.toggle('hidden', isVisible);
  });
  checkStrength('');
}

function renderCodeFormatter() {
  const tool = tools.find(t => t.id === 'code-formatter');
  renderToolLayout(tool.title, tool.description, `
    <div>
        <label for="code-input" class="label-text">Input Code:</label>
        <textarea id="code-input" class="input-style w-full p-3 rounded-lg resize-y" rows="12" placeholder="Paste your code here... (e.g., HTML, CSS, JS)" data-code="true"></textarea>
    </div>
    <div class="flex flex-col sm:flex-row gap-4 items-end">
        <div class="flex-1 w-full">
            <label for="language-select" class="label-text">Select Language:</label>
            <select id="language-select" class="select-style w-full p-3 rounded-lg text-base">
                <option value="js">JavaScript / TypeScript</option>
                <option value="css">CSS / SCSS / LESS</option>
                <option value="html">HTML / XML</option>
            </select>
        </div>
        <div class="w-full sm:w-auto">
            <button id="format-button" class="primary-button text-white font-bold py-3 px-6 rounded-lg w-full text-lg uppercase shadow-lg shadow-[#00A389]/30">
                FORMAT CODE
            </button>
        </div>
    </div>
    <div class="pt-4 border-t border-slate-700/50">
        <label for="code-output" class="label-text">Formatted Code:</label>
        <textarea id="code-output" class="input-style w-full p-3 rounded-lg resize-y bg-slate-700/50" rows="12" readonly placeholder="Formatted code will appear here." data-code="true"></textarea>
    </div>
  `);
  const codeInput = document.getElementById('code-input');
  const codeOutput = document.getElementById('code-output');
  const languageSelect = document.getElementById('language-select');
  const formatButton = document.getElementById('format-button');
  formatButton.addEventListener('click', () => {
    const code = codeInput.value.trim();
    const language = languageSelect.value;
    let formattedCode = '';
    if (code === '') {
      showMessage('Please enter a code to be formatted.', 'error');
      codeOutput.value = '';
      return;
    }
    try {
      const options = {
        indent_size: 4,
        space_in_empty_paren: true,
      };
      switch (language) {
        case 'js':
          formattedCode = window.js_beautify(code, options);
          break;
        case 'css':
          formattedCode = window.css_beautify(code, options);
          break;
        case 'html':
          formattedCode = window.html_beautify(code, options);
          break;
        default:
          formattedCode = 'Error: Unsupported language selection.';
          break;
      }
      codeOutput.value = formattedCode;
      showMessage('Code was successfully formatted.', 'success');
    } catch (e) {
      console.error('Formatting error:', e);
      codeOutput.value = 'An error occurred during formatting. Please check your code syntax.';
      showMessage('Code could not be formatted.', 'error');
    }
  });
  codeInput.value = `function (x) {if(x>0){console.log('Positive');}else{console.log('Negative');}}`;
}

window.addEventListener('popstate', (event) => {
  const toolId = event.state?.toolId;
  if (toolId) {
    tools.find(t => t.id === toolId)?.render();
  } else {
    renderHomePage();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const initialToolId = window.location.hash.substring(1);
  if (initialToolId && tools.some(t => t.id === initialToolId)) {
    tools.find(t => t.id === initialToolId).render();
  } else {
    renderHomePage();
  }
});