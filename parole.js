// Mescola un array in modo casuale (algoritmo Fisher-Yates)
function mescolaArray(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

// Prepara e mescola domande e risposte per un nuovo tentativo
function preparaQuizMescolato() {
    const form = document.getElementById("form-quiz");
    const pulsanteVerifica = form.querySelector('button[onclick="calcolaPunteggio()"]');
    const domande = Array.from(form.querySelectorAll(".domanda"));

    // Mescola l'ordine delle domande
    const domandeMescolate = mescolaArray(domande);

    domandeMescolate.forEach((domanda, indice) => {
        // Mescola l'ordine delle etichette (risposte) dentro ciascuna domanda
        const etichette = Array.from(domanda.querySelectorAll("label"));
        const etichetteMescolate = mescolaArray(etichette);

        // Aggiorna il numero progressivo della domanda (1, 2, 3, 4)
        const testoDomanda = domanda.querySelector("p strong");
        if (testoDomanda) {
            testoDomanda.textContent = testoDomanda.textContent.replace(/^\d+\./, `${indice + 1}.`);
        }

        // Reinserisce le risposte nell'ordine casuale
        etichetteMescolate.forEach(label => {
            const input = label.querySelector('input[type="radio"]');
            if (input) {
                input.checked = false;
            }
            domanda.appendChild(label);
        });

        // Sposta la domanda nella nuova posizione prima del pulsante "Verifica risposte"
        form.insertBefore(domanda, pulsanteVerifica);
    });

    // Chiede a MathJax di ri-renderizzare le formule spostate nel DOM
    if (window.MathJax && typeof MathJax.typesetPromise === "function") {
        MathJax.typesetPromise([form]);
    }
}

// Azzera il quiz e mescola domande e risposte per un nuovo tentativo pulito
function resettaQuiz() {
    const boxRisultato = document.getElementById("risultato-quiz");
    const btnRiprova = document.getElementById("btn-riprova");

    // Nasconde e svuota il riquadro del risultato precedente
    boxRisultato.innerHTML = "";
    boxRisultato.className = "nascosto";

    // Nasconde il pulsante "Riprova il quiz" fino alla prossima verifica
    btnRiprova.classList.add("nascosto");

    // Mescola di nuovo domande e opzioni
    preparaQuizMescolato();
}

// Funzione per calcolare il punteggio del quiz
function calcolaPunteggio() {
    const domande = document.querySelectorAll("#form-quiz .domanda");
    let punteggio = 0;
    let risposteDate = 0;

    // Controlla ogni domanda in base al suo attributo data-qid o al nome del gruppo radio
    domande.forEach(domanda => {
        const primoInput = domanda.querySelector('input[type="radio"]');
        if (!primoInput) return;

        const nomeGruppo = primoInput.name;
        const selezionata = domanda.querySelector(`input[name="${nomeGruppo}"]:checked`);
        if (selezionata) {
            risposteDate++;
            punteggio += parseInt(selezionata.value, 10);
        }
    });

    const boxRisultato = document.getElementById("risultato-quiz");
    const btnRiprova = document.getElementById("btn-riprova");
    boxRisultato.classList.remove("nascosto");

    // Verifica che lo studente abbia risposto a tutte le domande
    if (risposteDate < domande.length) {
        boxRisultato.innerHTML = `⚠️ <strong>Attenzione:</strong> rispondi a tutte e ${domande.length} le domande prima di verificare!`;
        boxRisultato.className = "avviso";
        return;
    }

    // Mostra il messaggio in base al punteggio ottenuto
    let messaggio = `Hai totalizzato <strong>${punteggio} su ${domande.length}</strong>! `;
    if (punteggio === domande.length) {
        messaggio += "Ottimo lavoro, hai capito tutto alla perfezione! 🌟";
        boxRisultato.className = "successo";
    } else if (punteggio >= Math.ceil(domande.length / 2)) {
        messaggio += "Buon risultato, ma rileggi bene le regole per non fare errori. 👍";
        boxRisultato.className = "medio";
    } else {
        messaggio += "Rileggi con calma la lezione e riprova! 💪";
        boxRisultato.className = "avviso";
    }

    boxRisultato.innerHTML = messaggio;

    // Mostra il pulsante per fare un nuovo tentativo
    btnRiprova.classList.remove("nascosto");
}

// Se lo studente inizia a cambiare risposta dopo aver già verificato,
// nasconde il vecchio punteggio così non resta in vista
document.getElementById("form-quiz").addEventListener("change", () => {
    const boxRisultato = document.getElementById("risultato-quiz");
    if (!boxRisultato.classList.contains("nascosto")) {
        boxRisultato.innerHTML = "";
        boxRisultato.className = "nascosto";
    }
});

// Mescola domande e risposte all'apertura della pagina
window.addEventListener("DOMContentLoaded", preparaQuizMescolato);

// Piccola verifica in console per confermare che parole.js sia collegato
console.log("Parole chiave caricate per i giochi:", paroleChiave.length);