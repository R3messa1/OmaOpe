// Liitetään lähetyspainikkeeseen tapahtuman kuuntelija, joka kutsuu sendMessage-funktiota
document.getElementById('send-button').addEventListener('click', sendMessage);

// Liitetään myös Enter-näppäimeen sama toiminto
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter'){
        sendMessage();
    }
});

// Asynkroninen funktio, joka lähettää käyttäjän syöttämän kysymyksen palvelimelle
async function sendMessage(){
    
    const userInput = document.getElementById('user-input').value;
    
    // Jos syöte on tyhjä (vain välilyöntejä), ei tehdä mitään
    if (userInput.trim() === '') return;

    // Tulostetaan käyttäjän syöte konsoliin (testausta varten)
    console.log(userInput);

    // Näytetään käyttäjän kysymys chatboxissa
    addMessageToChatbox('Sinä: ' + userInput, 'user-message');

    try {
        // Lähetetään kysymys palvelimelle POST-pyynnöllä
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Muodostetaan JSON-objekti lähetettäväksi palvelimelle
            body: JSON.stringify({ message: userInput })  // käytetään "message"-avainta
        });

        // Luetaan palvelimelta saatu vastaus JSON-muodossa
        const data = await response.json();
        console.log(data.reply);  // Tulostetaan palvelimen vastaus (reply) konsoliin

        // Näytetään ChatGPT:n vastaus chatboxissa
        addMessageToChatbox('ChatGPT: ' + data.reply, 'bot-message');

    } catch (error) {
        // Jos virhe tapahtuu, tulostetaan virhe konsoliin ja näytetään virheviesti chatboxissa
        console.error('Error:', error);
        addMessageToChatbox('ChatGPT: Jotain meni pieleen. Yritä uudelleen myöhemmin.', 'bot-message');
    }

    // Tyhjennetään syötekenttä uuden kysymyksen esittämistä varten
    document.getElementById('user-input').value = '';
}

// Funktio, joka lisää uuden viestin chatboxiin
function addMessageToChatbox(message, className) {
    // Luodaan uusi div-elementti viestiä varten
    const messageElement = document.createElement('div');
    
    // Lisätään CSS-luokat viestille
    messageElement.classList.add('message', className);
    
    // Asetetaan viestin tekstisisältö
    messageElement.textContent = message;
    
    // Tulostetaan viesti (testausta varten)
    console.log(messageElement);
    
    // Lisätään viesti chatboxiin
    document.getElementById('chatbox').appendChild(messageElement);
    
    // Tulostetaan chatboxin sisältö (testausta varten)
    console.log(document.getElementById('chatbox'));
}

// Kuuntelija, joka kutsuu sendImages-funktiota, kun painetaan "Lähetä tiedostot"
document.getElementById('send-images-button').addEventListener('click', sendImages);

// Funktio, joka käsittelee kuvien lataamisen ja lähettämisen palvelimelle
async function sendImages() {
    const imageInput = document.getElementById('image-input');  // Haetaan tiedostokenttä
    const files = imageInput.files;  // Haetaan käyttäjän valitsemat tiedostot

    // Jos tiedostoja ei ole valittu, näytetään ilmoitus
    if (files.length === 0) {
        alert('Valitse kuvia ensin.');
        return;
    }

    // FormData-objekti, johon tiedostot tallennetaan lähetystä varten
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }

    // Logataan tiedostot konsoliin, jotta nähdään, että ne on oikein lisätty
    console.log(formData.getAll('images'));  // Tarkistetaan tiedostot

    try {
        // Lähetetään kuvat palvelimelle POST-pyynnöllä
        //Muuta upload-images uploadiksi 28.10
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        // Luetaan palvelimen vastaus ja näytetään se chatboxissa
        const data = await response.json();
        addMessageToChatbox('ChatGPT: ' + data.reply, 'bot-message');  // Näytetään palvelimen vastaus chatboxissa

    } catch (error) {
        console.error('Error:', error);
        // Jos virhe tapahtuu, näytetään virheviesti chatboxissa
        addMessageToChatbox('ChatGPT: Jotain meni pieleen. Yritä uudelleen myöhemmin.', 'bot-message');
    }
}
