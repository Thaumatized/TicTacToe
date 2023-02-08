# TicTacToe  
  
This is my javascript implementation of Tic Tac Toe with bots. You can play it on my website at https://thaumatek.fi/content/pages/tictactoe/  
When used independently the CSS isn't exactly great, as it is meant to use CSS from my website.  
  
I am proud to say that my version has more difficulties than googles.  
  
Bot settings:  
Player - bot is disabled  
Random - The bot is totally random.  
Easy - The bot tries to not be in your way or accidentally win. If you want a bonus challenge try losing to this one (it is possible)  
Normal - The bot takes any instant wins and blocks yours.  
Hard - The bot understands double traps.  
Impossible - The bot will never lose.  
  
for impossible, I used the Hard difficulty logic, patching in unknown states with hardcoded answers. Unfortunately I lost the python script I used to figure out all possible game states which weren't covered. The possiblities that were left over were reduced further by getting rid of mirrored and rotated versions of eachother, as tic tac toe is symmetric. Total board states with hard coded answers count up to 39.  