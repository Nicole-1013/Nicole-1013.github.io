#Description: This program will be a hangman game where the user will have to guess a word in 12 turns
#Author: Nicole Galvan
#Date: 8/22/24
import random
import os

#this is the hangman game code 
def clear_console():
    if os.name == 'nt':
        os.system('cls')
def game():
    
    #initialized variables
    word_list = ["garden", "elephant", "dinosaur", "jewelry", "purple", "pencil", "mountain", "computer", "lightning", "castle", "warrior", "basket", "plane", "travel", "house"]#possible words
    word = [x.lower() for x in random.choice(word_list)]#chooses a word from the word list and converts each letter into an element in a list
    guesses = ["_" for x in word]#makes a list with the same amount of elements as word, but with "_" instead of letters, this is how the user will see their guesses and what remains to be uncovered
    letters_guessed = [] #empty list of letters the user will guess that are not in the original word
    turns = 0 #starting amount of turns
    max_turns = 12#maximum amount of turns
    correct_word = tuple(word)#tuple of original word to use incase they do not guess the word in the 12 turns

    while turns <= max_turns:
        turns_left = max_turns - turns #calculates remaining turns

        print(f"🎯You have '{turns_left}' turns left🎯") 
        print(f"❓ Guessed letters: {' '.join(letters_guessed)} ❓")#prints what letters they have guessed that are NOT in the original word
        print("🔤 Word: " + " ".join(guesses) + ' 🔤') #number of dashes joined together, this will update when a correct letter is guesse

        char = input("What guess would you like to make?").lower()#user input of letter guesses

        if char in letters_guessed or char in guesses:#string appears if user has already guessed the letter, does not penalize the user
            clear_console()
            print(f"You've already guessed '{char}'. Try a different letter.")
            continue
        
        if char in word: #checks if letter is in the word, and if it is, it switches the "_" from guesses to word, and vice versa
            for index, letter in enumerate(word):
                if letter == char:
                    guesses[index] = char
                    word[index] = "_"
    
        else:
            letters_guessed.append(char)#if letter not in word, it will appear in the "Guessed Letters" text in the next iteration
    
        if "_" not in guesses: #if statement for when the user guesses the word without running out of turns
            print("Hooray! You discovered the word " + "".join(guesses) + "!")
            break

        clear_console()
        turns += 1
    if "_" in guesses:#text appears if the user has run out of turns
        print(f"Out of turns! The word was {"".join(correct_word)}. Better luck next time!")
    

game()#first call for when run first starts
game_on = True

#the while loop is if user wants to play again, if not, run ends
while game_on:
    user_input = input("Play Again? (y: yes, q: quit) ").lower()  # Convert input to lowercase for consistency
    
    if user_input == "y":
        clear_console()
        game()
    elif user_input == "q":
        game_on = False
    else:
        print("Invalid input, please enter 'y' to play again or 'q' to quit.")
