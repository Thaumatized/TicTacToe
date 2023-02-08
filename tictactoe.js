//It is tic tac toe time!
var turn = "X";
//These two get the value at start because firefox remebers it if you refresh the page.
var bot_difficulty_X = document.getElementById("bot_x").value;
var bot_difficulty_0 = document.getElementById("bot_0").value;
var ChosenMoves = [];

//Debug variables
var AutoReset = false;
var StopOnX = false;
var StopOn0 = false;
var StopOnTie = false;
var MaxTries = 0;
var CurrentTries = 0;

var WinsX = 0;
var Wins0 = 0

//We call Bot at start in case it has already been set to a difficulty and firefox remembers that.
Bot();

function ChangeDifficulty(bot, select)
{
    if(bot == "X")
    {
        bot_difficulty_X = select.options[select.selectedIndex].value;
    }
    else if(bot == "0")
    {
        bot_difficulty_0 = select.options[select.selectedIndex].value;
    }

    if(turn == bot)
    {
        Bot();
    }

    console.log("Bot " + bot + " difficulty set to " + select.options[select.selectedIndex].value + ".");
}

function Loop()
{
    if(bot_difficulty_X != "none" && bot_difficulty_0 != "none" && AutoReset == true && MaxTries > 0)
    {
        while(AutoReset == true && CurrentTries < MaxTries)
        {
            if(CheckWin)
            {
                Reset();
                CurrentTries++;
                console.log("Loop " + CurrentTries.toString() + "/" + MaxTries.toString());
            }
            else
            {
                Bot();
            }
        }
        AutoReset = false;
        document.getElementById("AutoReset").checked = false;
    }
    else
    {
        AutoReset = false;
        document.getElementById("AutoReset").checked = false;
    }
}

function Clicked(id)
{
    if(document.getElementById(id + "_text").innerHTML == "")
    {
        //Valid move
        document.getElementById(id + "_text").innerHTML = turn;
        turn = ReverseChar(turn);

        ChosenMoves.push(id);

        if(!CheckWin())
        {
            Bot();
        }
    }
}

function CheckWin()
{
    var Winner = "";
    var WinCond = GetWinConditions();
    var Board = GetBoard();
    for(var i = 0; i < 8; i++)
    {
        if(Board[WinCond[i][0]] == Board[WinCond[i][1]] && Board[WinCond[i][1]] == Board[WinCond[i][2]] && Board[WinCond[i][0]])
        {
            Winner = Board[WinCond[i][0]];
            document.getElementById(WinCond[i][0]).style.backgroundColor = "#663399";
            document.getElementById(WinCond[i][1]).style.backgroundColor = "#663399";
            document.getElementById(WinCond[i][2]).style.backgroundColor = "#663399";
        }
    }

    if(Winner != "")
    {
        if(Winner=="X")
        {
            WinsX++;
            document.getElementById("XWins").innerHTML = "X Wins: " + WinsX.toString();
        }
        else if(Winner=="0")
        {
            Wins0++;
            document.getElementById("0Wins").innerHTML = "0 Wins: " + Wins0.toString();
        }

        console.log(Winner + " won! Moves: " + ChosenMoves.toString());

        for(var i = 0; i < 9; i++)
        {
            if(document.getElementById(i + "_text").innerHTML == "")
            {
                    document.getElementById(i + "_text").innerHTML = " ";
            }
        }

        if((Winner == "X" && StopOnX) ||(Winner == "0" && StopOn0))
        {
            AutoReset = false;
            document.getElementById("AutoReset").checked = false;
        }

        return true;
    }
    else if(Board.indexOf("") == -1)
    {
        
        console.log("Stalemate! Moves: " + ChosenMoves.toString());
        if(StopOnTie)
        {
            AutoReset = false;
            document.getElementById("AutoReset").checked = false;
        }
        return true;
    }
    else
    {
        return false;
    }
}


function GetWinConditions()
{
    var Conditions = [];
    for(var i = 0; i < 8; i++)
    {
        if(i < 3)
        {
            //Horizontal checks
            var j = (i * 3);
            Conditions.push([j, j + 1, j + 2]);	
        }
        else if (i < 6)
        {
            //Vertical checks
            var j = (i - 3);
            Conditions.push([j, j + 3, j + 6]);	
        }
        else if(i == 6)
        {
            // diagonal "\"
            var j = 0;
            Conditions.push([j, j + 4, j + 8]);
        }
        else //7
        {
            //diagonal "/"
            var j = 2;
            Conditions.push([j, j + 2, j + 4]);
        }
    }
    return Conditions;
}

function ReverseChar(Character)
{
    if(Character == "X")
    {
        return "0";
    }
    else
    {
        return "X";
    }
}

function Bot()
{
    var bot_difficulty = "none";
    if(turn == "X")
    {
        bot_difficulty = bot_difficulty_X;
    }
    else if(turn == "0")
    {
        bot_difficulty = bot_difficulty_0;
    }

    if(bot_difficulty == "none")
    {
        console.log("Bot " + turn + " is disabled");
    }
    else // Bot is enabled
    {
        var ValidMoves = []; // All valid moves
        var Board = GetBoard();

        // Get all valid moves, because all difficulties use valid moves as a backup if they dont find a better move.
        for(var i = 0; i < 9; i++)
        {
            if(Board[i] == "")
            {
                ValidMoves.push(i);
            }
        }

        if(ValidMoves.length == 0)
        {
                console.log("No moves, game is over");
        }
        else
        {
            //Get all instant wins/losses, because all difficulties except random use them for logic.
            //And possibly double traps if hard/impossible
            if(bot_difficulty == "random")
            {
                if(ValidMoves.length > 0)
                {
                    //console.log("Bot " + turn + " chose a random move.");
                    Clicked(ValidMoves[Math.floor(Math.random() * ValidMoves.length)]);
                }
            }
            else // easy, normal, hard and impossible
            {
                var WinConditions = GetWinConditions();
                var InstantWins = []; // Every instantly winning move
                var InstantLosses = []; // Every move that leave an instant win for the enemy

                for (var i = 0; i < WinConditions.length; i++)
                {
                    var BotChars = 0;
                    var PlayerChars = 0;
                    var Empties = 0;
                    var Empty = 0;
                    for(var j = 0; j < WinConditions[i].length; j++)
                    {
                        var char = Board[WinConditions[i][j]]
                        if(char == turn)
                        {
                            BotChars++;
                        }
                        else if(char == ReverseChar(turn))
                        {
                            PlayerChars++;
                        }
                        else
                        {
                            Empties++;
                            Empty = WinConditions[i][j];
                        }
                    }

                    if(PlayerChars == 2 && Empties == 1)
                    {
                        InstantLosses.push(Empty);
                    } 
                    else if(BotChars == 2 && Empties == 1)
                    {
                        InstantWins.push(Empty);
                    } 
                }

                if(bot_difficulty == "easy")
                {
                    var BadMoves = [];
                    for(var i = 0; i < ValidMoves.length; i++)
                    {
                        if(InstantWins.indexOf(ValidMoves[i]) == -1 && InstantLosses.indexOf(ValidMoves[i]) == -1)
                        {
                            BadMoves.push(ValidMoves[i]);
                        }
                    }

                    for(var i = 0; i < InstantWins.length; i++)
                    {
                        if(InstantLosses.indexOf(InstantWins[i]) != -1)
                        {
                            InstantLosses.splice(InstantLosses.indexOf(InstantWins[i]), 1);
                        }
                    }

                    if(BadMoves.length > 0)
                    {
                        //console.log("Bot " + turn + " chose a bad move on purpose")
                        Clicked(BadMoves[Math.floor(Math.random() * BadMoves.length)]);
                    }
                    else if(InstantLosses.length > 0)
                    {
                        //console.log("Bot " + turn + " bocked your move by accident")
                        Clicked(InstantLosses[Math.floor(Math.random() * InstantLosses.length)]);
                    }
                    else if(InstantWins.length > 0)
                    {
                        //console.log("Bot " + turn + " won by accident")
                        Clicked(InstantWins[Math.floor(Math.random() * InstantWins.length)]);
                    }
                    else if(ValidMoves.length > 0)
                    {
                        //console.log("Bot " + turn + " chose randomly as backup (a mistake in code!)")
                        Clicked(ValidMoves[Math.floor(Math.random() * ValidMoves.length)]);
                    }
                }
                else if(bot_difficulty == "normal")
                {
                    if(InstantWins.length > 0)
                    {
                        //console.log("Bot " + turn + " won")
                        Clicked(InstantWins[Math.floor(Math.random() * InstantWins.length)]);
                    }
                    else if(InstantLosses.length > 0)
                    {
                        //console.log("Bot " + turn + " blocked you from winning")
                        Clicked(InstantLosses[Math.floor(Math.random() * InstantLosses.length)]);
                    }
                    else if(ValidMoves.length > 0)
                    {
                        //console.log("Bot " + turn + " chose randomly, since it didn't know better")
                        Clicked(ValidMoves[Math.floor(Math.random() * ValidMoves.length)]);
                    }
                }
                else // Hard and impossible
                {
                    //Easy choices
                    if(InstantWins.length > 0)
                    {
                        //console.log("Bot " + turn + " won")
                        Clicked(InstantWins[Math.floor(Math.random() * InstantWins.length)]);
                    }
                    else if(InstantLosses.length > 0)
                    {
                        //console.log("Bot " + turn + " blocked you from winning")
                        Clicked(InstantLosses[Math.floor(Math.random() * InstantLosses.length)]);
                    }
                    else // Not so easy choices
                    {
                        var SetDoubleTraps = []; // Every move that leaves a double trap for the enemy
                        var EnemyDoubleTraps = []; //Every move that allows the enemy to set a double trap

                        for(var i = 0; i < ValidMoves.length; i++)
                        {
                            var AlteredBoard = Array.from(Board);
                            AlteredBoard[ValidMoves[i]] = turn;

                            var Traps = 0;
                            for (var j = 0; j < WinConditions.length; j++)
                            {
                                var BotChars = 0;
                                var Empties = 0;
                                var Empty = 0;
                                for(var k = 0; k < WinConditions[j].length; k++)
                                {
                                    var char = AlteredBoard[WinConditions[j][k]]
                                    if(char == turn)
                                    {
                                        BotChars++;
                                    }
                                    else if(char == "")
                                    {
                                        Empties++;
                                    }
                                }
            
                                if(BotChars == 2 && Empties == 1)
                                {
                                    Traps++;
                                } 
                            }

                            if(Traps >= 2)
                            {
                                SetDoubleTraps.push(ValidMoves[i]);
                            }
                            else if (Traps == 1)// We only need to check for double traps if we cant set a double trap. Here we will be checking if countering a "single trap" causes a double trap, since should it not other option wont matter because we would win.
                            {
                                Traps = 0;
                                for (var j = 0; j < WinConditions.length; j++)
                                {
                                    var BotChars = 0;
                                    var Empties = 0;
                                    var Empty = 0;
                                    for(var k = 0; k < WinConditions[j].length; k++)
                                    {
                                        var char = AlteredBoard[WinConditions[j][k]];
                                        if(char == turn)
                                        {
                                            BotChars++;
                                        }
                                        else if(char == "")
                                        {
                                            Empties++;
                                            Empty = WinConditions[j][k];
                                        }
                                    }
                
                                    if(BotChars == 2 && Empties == 1)
                                    {
                                        AlteredBoard[Empty] = ReverseChar(turn);
                                    }
                                }

                                Traps = 0;
                                for (var o = 0; o < WinConditions.length; o++)
                                {
                                    var EnemyChars = 0;
                                    Empties = 0;
                                    for(var p = 0; p < WinConditions[o].length; p++)
                                    {
                                        var char = AlteredBoard[WinConditions[o][p]];
                                        if(char == ReverseChar(turn))
                                        {
                                            EnemyChars++;
                                        }
                                        else if(char != turn)
                                        {
                                            Empties++;
                                        }
                                    }
                
                                    if(EnemyChars == 2 && Empties == 1)
                                    {
                                        Traps++;
                                    } 
                                }
                                if(Traps >= 2)
                                {
                                    EnemyDoubleTraps.push(ValidMoves[i]);
                                }
                            }
                            else if (Traps == 0)//And if the move we are looking at doesn't set a "single trap", we will have to check *all* the options the enemy has.
                            {
                                Traps = 0;		
                                var ValidMoves2 = [];
                                var AlteredBoard2 = Array.from(AlteredBoard);
                                for(var u = 0; u < 9; u++)
                                {
                                    if(AlteredBoard2[u] == "")
                                    {
                                        ValidMoves2.push(u);
                                    }
                                }

                                for(var l = 0; l < ValidMoves2.length; l++)
                                {
                                    AlteredBoard2 = Array.from(AlteredBoard);
                                    AlteredBoard2[ValidMoves2[l]] = ReverseChar(turn);

                                    Traps = 0;
                                    for (var o = 0; o < WinConditions.length; o++)
                                    {
                                        var EnemyChars = 0;
                                        Empties = 0;
                                        for(var p = 0; p < WinConditions[o].length; p++)
                                        {
                                            var char = AlteredBoard2[WinConditions[o][p]]
                                            if(char == ReverseChar(turn))
                                            {
                                                EnemyChars++;
                                            }
                                            else if(char != turn)
                                            {
                                                Empties++;
                                            }
                                        }
                    
                                        if(EnemyChars == 2 && Empties == 1)
                                        {
                                            Traps++;
                                        } 
                                    }
                                    
                                    if(Traps >= 2)
                                    {
                                        EnemyDoubleTraps.push(ValidMoves[i]);
                                        break;
                                    }
                                }
                            }
                        }

                        var AvoidDoubleTraps = []; //Moves that pervent double traps
                        if(EnemyDoubleTraps.length > 0)
                        {
                            for(var i = 0; i < ValidMoves.length; i++)
                            {
                                if(EnemyDoubleTraps.indexOf(ValidMoves[i]) == -1)
                                {
                                    AvoidDoubleTraps.push(ValidMoves[i]);
                                }
                            }
                        }

                        if(SetDoubleTraps.length > 0)
                        {
                            //console.log("Bot " + turn + " set a double trap");
                            Clicked(SetDoubleTraps[Math.floor(Math.random() * SetDoubleTraps.length)]);
                        }
                        else if(AvoidDoubleTraps.length > 0)
                        {
                            //console.log("Bot " + turn + " blocked setting a double trap");
                            Clicked(AvoidDoubleTraps[Math.floor(Math.random() * AvoidDoubleTraps.length)]);
                        }
                        else
                        {
                            if(bot_difficulty == "impossible")
                            {
                                var move = HardcodedSolutionsForImpossible(Board);
                                if(move != -1)
                                {
                                    //console.log("Bot " + turn + " chose prederminitely.");
                                    Clicked(move);
                                }
                                else
                                {
                                    console.log("Bot " + turn + " chose randomly (Mistake in code).");
                                    Clicked(ValidMoves[Math.floor(Math.random() * ValidMoves.length)]);
                                }
                            }
                            else
                            {
                                //console.log("Bot " + turn + " chose randomly.");
                                Clicked(ValidMoves[Math.floor(Math.random() * ValidMoves.length)]);
                            }
                        }
                    }
                }
            }
        }
    }
}

function Reset()
{
    ChosenMoves = [];
    for(var i = 0; i < 9; i++)
    {
        document.getElementById(i).style.backgroundColor = "#252525";
        document.getElementById(i + "_text").innerHTML = "";
    }
    turn = "X";
    Bot();
}

function GetBoard()
{
    var arr = []
    for(var i = 0; i < 9; i++)
    {
        arr.push(document.getElementById(i + "_text").innerHTML);
    }
    return arr;
}

function Rotated(arr, rot)
{
    arr2 = Array.from(arr);
    if(rot > 0)
    {
        for(var i = 0; i < rot; i++)
        {
            arr2 = [arr2[6], arr2[3], arr2[0], arr2[7], arr2[4], arr2[1], arr2[8], arr2[5], arr2[2]];
        }
    }
    else if(rot < 0)
    {
        for(var i = 0; i > rot; i--)
        {
            arr22 = [arr2[2], arr2[5], arr2[8], arr2[1], arr2[4], arr2[7], arr2[0], arr2[3], arr2[6]];
        }
    }
    return arr2;
}

function Mirrored(arr)
{
    arr2 = Array.from(arr);
    return [arr2[2], arr2[1], arr2[0], arr2[5], arr2[4], arr2[3], arr2[8], arr2[7], arr2[6]];
}

function NormalizeSolution(solution, rot, mir)
{
    NormalBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    NormalBoard = Rotated(NormalBoard, rot);
    if(mir)
    {
        NormalBoard = Mirrored(NormalBoard);
    }
    //console.log(NormalBoard.toString() + " " + solution + " " + NormalBoard[solution])
    return NormalBoard[solution];
}

function HardcodedSolutionsForImpossible(board)
{
    var WeirdConfigs = [['','','','','','','','',''],['X','','','','','','','',''],['','X','','','','','','',''],['0','X','','','','','','',''],['X','0','','','','','','',''],['0','','X','','','','','',''],['','0','','X','','','','',''],['','','0','X','','','','',''],['','','X','0','','','','',''],['','','','','X','','','',''],['0','','','','X','','','',''],['','0','','','X','','','',''],['X','','','','0','','','',''],['','X','','','0','','','',''],['','','','0','','X','','',''],['X','','0','0','','X','','',''],['','','','X','0','X','','',''],['','','0','','','','X','',''],['','','0','0','','X','X','',''],['','','0','0','X','X','X','',''],['','X','0','','0','X','X','',''],['X','','','0','0','X','X','',''],['X','','0','0','0','X','X','',''],['','X','0','0','0','X','X','',''],['X','X','0','0','0','X','X','',''],['0','X','X','X','','0','0','',''],['X','0','X','X','','0','0','',''],['0','','X','X','X','0','0','',''],['','0','X','X','X','0','0','',''],['X','0','X','','','0','0','X',''],['X','0','','X','','0','0','X',''],['0','','X','X','','0','0','X',''],['','0','X','X','','0','0','X',''],['X','0','X','X','','0','0','X',''],['','0','','X','X','0','0','X',''],['','0','X','X','X','0','0','X',''],['0','','X','X','','0','0','','X'],['0','X','X','X','','0','0','','X'],['0','','X','X','X','0','0','','X']];
    var Solutions = [0,4,4,4,6,8,4,0,8,0,8,8,8,7,0,7,0,0,4,0,0,2,8,8,8,7,8,7,8,4,8,4,8,4,0,0,1,4,1];

    for(var i = 0; i < 4; i++)
    {
        //Rotated
        //console.log("rotated one is " + Rotated(board, i).toString());
        if(TwoDimensionalIndexOf(WeirdConfigs, Rotated(board, i)) != -1)
        {
            //console.log("Predetermined index = " + TwoDimensionalIndexOf(WeirdConfigs, Rotated(board, i)).toString() + " with rot " + i + " and mir false, Solution " + NormalizeSolution(Solutions[TwoDimensionalIndexOf(WeirdConfigs, Rotated(board, i))], i, false).toString());
            return NormalizeSolution(Solutions[TwoDimensionalIndexOf(WeirdConfigs, Rotated(board, i))], i, false);
        }
        //Mirrored
        //console.log("rotated and mirrored one is " + Mirrored(Rotated(board, i)).toString());
        if(TwoDimensionalIndexOf(WeirdConfigs, Mirrored(Rotated(board, i))) != -1)
        {
            //console.log("Predetermined index = " + TwoDimensionalIndexOf(WeirdConfigs, Mirrored(Rotated(board, i))).toString() + " with rot " + i + " and mir true, Solution " + NormalizeSolution(Solutions[TwoDimensionalIndexOf(WeirdConfigs, Mirrored(Rotated(board, i)))], i, true).toString() + "pre normalisation: " + Solutions[TwoDimensionalIndexOf(WeirdConfigs, Mirrored(Rotated(board, i)))].toString());
            return NormalizeSolution(Solutions[TwoDimensionalIndexOf(WeirdConfigs, Mirrored(Rotated(board, i)))], i, true);
        }
    }
    return -1;
}

function TwoDimensionalIndexOf(arr, target)
{
    for(var i = 0; i < arr.length; i++)
    {
        var Match = true;
        for(var j = 0; j < arr[i].length; j++)
        {
            if(arr[i][j] != target[j])
            {
                Match = false;
                break;
            }
        }

        if(Match)
        {
            return i;
        }
    }

    return -1;
}

//Debug stuff
function FirstWeird()
{
    Reset()
    var WeirdConfigs = [['','','','','','','','',''],['X','','','','','','','',''],['','X','','','','','','',''],['0','X','','','','','','',''],['X','0','','','','','','',''],['0','','X','','','','','',''],['','0','','X','','','','',''],['','','0','X','','','','',''],['','','X','0','','','','',''],['','','','','X','','','',''],['0','','','','X','','','',''],['','0','','','X','','','',''],['X','','','','0','','','',''],['','X','','','0','','','',''],['','','','0','','X','','',''],['X','','0','0','','X','','',''],['','','','X','0','X','','',''],['','','0','','','','X','',''],['','','0','0','','X','X','',''],['','','0','0','X','X','X','',''],['','X','0','','0','X','X','',''],['X','','','0','0','X','X','',''],['X','','0','0','0','X','X','',''],['','X','0','0','0','X','X','',''],['X','X','0','0','0','X','X','',''],['0','X','X','X','','0','0','',''],['X','0','X','X','','0','0','',''],['0','','X','X','X','0','0','',''],['','0','X','X','X','0','0','',''],['X','0','X','','','0','0','X',''],['X','0','','X','','0','0','X',''],['0','','X','X','','0','0','X',''],['','0','X','X','','0','0','X',''],['X','0','X','X','','0','0','X',''],['','0','','X','X','0','0','X',''],['','0','X','X','X','0','0','X',''],['0','','X','X','','0','0','','X'],['0','X','X','X','','0','0','','X'],['0','','X','X','X','0','0','','X']];
    var Solutions = [0,4,4,4,6,8,4,0,8,0,8,8,8,7,0,7,0,0,4,0,0,2,8,8,8,7,8,7,8,4,8,4,8,4,0,0,1,4,1];
    for(var i = 0; i < WeirdConfigs.length; i++)
    {
        if(Solutions[i] == -1)
        {
            LoadPredetermined(i)
            break;
        }
    }
}

function LoadPredetermined(index)
{
    Reset()
    var WeirdConfigs = [['','','','','','','','',''],['X','','','','','','','',''],['','X','','','','','','',''],['0','X','','','','','','',''],['X','0','','','','','','',''],['0','','X','','','','','',''],['','0','','X','','','','',''],['','','0','X','','','','',''],['','','X','0','','','','',''],['','','','','X','','','',''],['0','','','','X','','','',''],['','0','','','X','','','',''],['X','','','','0','','','',''],['','X','','','0','','','',''],['','','','0','','X','','',''],['X','','0','0','','X','','',''],['','','','X','0','X','','',''],['','','0','','','','X','',''],['','','0','0','','X','X','',''],['','','0','0','X','X','X','',''],['','X','0','','0','X','X','',''],['X','','','0','0','X','X','',''],['X','','0','0','0','X','X','',''],['','X','0','0','0','X','X','',''],['X','X','0','0','0','X','X','',''],['0','X','X','X','','0','0','',''],['X','0','X','X','','0','0','',''],['0','','X','X','X','0','0','',''],['','0','X','X','X','0','0','',''],['X','0','X','','','0','0','X',''],['X','0','','X','','0','0','X',''],['0','','X','X','','0','0','X',''],['','0','X','X','','0','0','X',''],['X','0','X','X','','0','0','X',''],['','0','','X','X','0','0','X',''],['','0','X','X','X','0','0','X',''],['0','','X','X','','0','0','','X'],['0','X','X','X','','0','0','','X'],['0','','X','X','X','0','0','','X']];
    var Solutions = [0,4,4,4,6,8,4,0,8,0,8,8,8,7,0,7,0,0,4,0,0,2,8,8,8,7,8,7,8,4,8,4,8,4,0,0,1,4,1];
    var CountX = 0;
    var Count0 = 0;
    for(var j = 0; j < WeirdConfigs[index].length; j++)
    {
        document.getElementById(j + "_text").innerHTML = WeirdConfigs[index][j];
        if(WeirdConfigs[index][j] == "X")
        {
            CountX++;
        }
        else if(WeirdConfigs[index][j] == "0")
        {
            Count0++;
        }
    }

    if(CountX == Count0)
    {
        turn = "X";
    }
    else
    {
        turn = "0";
    }
    return(Solutions[index])
}

function EvaluateDebug()
{
    console.log("Evaluating debug");
    AutoReset = document.getElementById("AutoReset").checked;
    StopOnX = document.getElementById("StopOnX").checked;
    StopOn0 = document.getElementById("StopOn0").checked;
    StopOnTie = document.getElementById("StopOnTie").checked;
    MaxTries = parseInt(document.getElementById("MaxTries").value);
    CurrentTries = 0;

    if(AutoReset)
    {
        Loop();
    }
}

function Dev() // Enables dev controls
{
    document.getElementById("DevControls").style.display="block";
}
