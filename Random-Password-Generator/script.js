document.addEventListener('DOMContentLoaded', function() {
    var generateButton = document.getElementById('generateButton');
    var passwordLengthInput = document.getElementById('passwordLength');
    var passwordLengthLabel = document.getElementById('passwordLengthLabel');

    passwordLengthInput.addEventListener('input', function() {
        passwordLengthLabel.textContent = passwordLengthInput.value;
    });

    generateButton.addEventListener('click', generatePassword);

    function generatePassword() {
        var length = document.getElementById('passwordLength').value;
        var charset = "";
        if (document.getElementById('numbers').checked) {
            charset += "0123456789";
        }
        if (document.getElementById('symbols').checked) {
            charset += "!@#$%^&*()-_+=<>?/[]{}|";
        }
        if (document.getElementById('uppercase').checked) {
            charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }
        charset += "abcdefghijklmnopqrstuvwxyz";

        var password = "";
        for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
        }

        var generatedPasswordElement = document.getElementById('generatedPassword');
        generatedPasswordElement.innerHTML =password;
        generatedPasswordElement.style.display = 'block';
        generatedPasswordElement.style.textAlign = 'center';
    }
});
