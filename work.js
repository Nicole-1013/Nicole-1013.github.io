$(function(){
    const images = [
        "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
        "https://www.princeton.edu/sites/default/files/styles/1x_full_2x_half_crop/public/images/2022/02/KOA_Nassau_2697x1517.jpg?itok=Bg2K7j7J",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvssaSOvzMoStZaY8YL5boN6Cz3pPz_sbF5w&s",
    ];

    const revolvingImage = $("#revolving-image");
    
    if (!revolvingImage) {
        console.error("Could not find the #revolving-image element.");
        return; // Exit if element isn't found
    }

    let currentImageIndex = 0;

    function changeImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        console.log(`Changing image to: ${images[currentImageIndex]}`); // Debugging
        revolvingImage.attr("src", images[currentImageIndex]);
    }

    setInterval(changeImage, 5000);
    
    $('.cert').click(function(){
            let docpath= $(this).data('doc');
            window.open(docpath,'_blank');
        });

    // HANGMAN GAME LOGIC WITH PYODIDE
    let pyodideHangman = null;
    let hangmanState = null;
    let hangmanLoaded = false;

    async function loadHangmanPyodide() {
        $("#hangman-loading").show();
        $("#hangman-game-container").hide();
        if (!pyodideHangman) {
            pyodideHangman = await loadPyodide();
            await pyodideHangman.runPythonAsync(`
import random
word_list = ["garden", "elephant", "dinosaur", "jewelry", "purple", "pencil", "mountain", "computer", "lightning", "castle", "warrior", "basket", "plane", "travel", "house"]
def new_game():
    word = list(random.choice(word_list))
    return {
        "word": word,
        "guesses": ["_"] * len(word),
        "letters_guessed": [],
        "turns": 0,
        "max_turns": 12,
        "correct_word": word.copy()
    }
def process_guess(state, char):
    char = char.lower()
    if char in state["letters_guessed"] or char in state["guesses"]:
        return "repeat"
    if char in state["word"]:
        for i in range(len(state["word"])):
            if state["word"][i] == char:
                state["guesses"][i] = char
                state["word"][i] = "_"
        return "correct"
    else:
        state["letters_guessed"].append(char)
        return "wrong"
def check_win(state):
    return "_" not in state["guesses"]
def update_display(state):
    output = []
    output.append(f"🎯 Turns left: {state['max_turns'] - state['turns']}")
    output.append(f"❓ Guessed letters: {' '.join(state['letters_guessed'])}")
    output.append("🔤 Word: " + " ".join(state['guesses']))
    return '<br>'.join(output)
            `);
        }
        hangmanState = pyodideHangman.globals.get('new_game')();
        updateHangmanDisplay();
        $("#hangman-loading").hide();
        $("#hangman-game-container").show();
        hangmanLoaded = true;
        $("#hangman-guess-btn").prop("disabled", false);
        $("#hangman-input").prop("disabled", false).val("").focus();
    }

    function updateHangmanDisplay(message = "") {
        let display = pyodideHangman.globals.get('update_display')(hangmanState);
        if (message) display += `<br><strong>${message}</strong>`;
        $("#hangman-output").html(display);
    }

    function hangmanGuess() {
        let input = $("#hangman-input");
        let char = input.val().trim();
        if (!char.match(/^[a-zA-Z]$/)) {
            updateHangmanDisplay("Please enter a single letter A-Z.");
            input.val("");
            return;
        }
        let result = pyodideHangman.globals.get('process_guess')(hangmanState, char);
        if (result === "repeat") {
            updateHangmanDisplay(`You've already guessed '${char}'.`);
            input.val("");
            return;
        }
        if(result === "wrong"){
            hangmanState.set('turns', hangmanState.get('turns') +1);
        }
        if (hangmanState.get('turns') >= hangmanState.get('max_turns')) {
            updateHangmanDisplay("💀 Game over! The word was: " + hangmanState.get('correct_word').join(''));
            $("#hangman-guess-btn").prop("disabled", true);
            input.prop("disabled", true);
            $("#hangman-playAgain-btn").show();
            return;
        }
        if (pyodideHangman.globals.get('check_win')(hangmanState)) {
            updateHangmanDisplay("🎉 Hooray! You won!");
            $("#hangman-guess-btn").prop("disabled", true);
            input.prop("disabled", true);
            return;
        } 
        updateHangmanDisplay();
        input.val("");
    }

    function resetHangman() {
        if (!pyodideHangman) return;
        hangmanState = pyodideHangman.globals.get('new_game')();
        $("#hangman-playAgain-btn").hide();
        updateHangmanDisplay();
        $("#hangman-guess-btn").prop("disabled", false);
        $("#hangman-input").prop("disabled", false).val("").focus();
    }

    $("#hangman-playAgain-btn").on("click", resetHangman);
    // When modal opens, load Pyodide and start game
    $('#hangmanModal').on('show.bs.modal', function () {
        if (!hangmanLoaded) {
            loadHangmanPyodide();
        } else {
            resetHangman();
        }
    });

    // Guess button and input handlers
    $("#hangman-guess-btn").on("click", hangmanGuess);
    $("#hangman-input").on("keypress", function(e) {
        if (e.key === "Enter") hangmanGuess();
    });
    $("#hangman-close-btn").on("click", resetHangman);
});