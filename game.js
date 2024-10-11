//runs the game once the program starts
game();

//list of possible slots for the apple to spawn
var slots = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440];

//list of the alphabet to cycle through
var abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

//variable that dictates the direction the snake moves
var direction = "down";

//variable that is used to keep track of players score and length (length = score + 3)
var score = 0;

//variables used to keep track of the selected letters when saving a score
var letterOneIndex = 0;
var letterTwoIndex = 0;
var letterThreeIndex = 0;

//onEvent used to take the players input, check if the input is valid, and then change direction of the snake
onEvent("gameScreen", "keydown", function(event){
  if (event.key == "Up" || event.key == "w" && direction != "down" && getYPosition("snake1") != (getYPosition("snake0") - 10)){
    direction = "up";
  }else if (event.key == "Right" || event.key == "d" && direction != "left" && getXPosition("snake1") != (getXPosition("snake0") + 10)){
    direction = "right";
  }else if (event.key == "Down" || event.key == "s" && direction != "up" && getYPosition("snake1") != (getYPosition("snake0") + 10)){
    direction = "down";
  }else if (event.key == "Left" || event.key == "a" && direction != "right" && getXPosition("snake1") != (getXPosition("snake0") - 10)){
    direction = "left";
  }
});

//onEvent to replay the game after it has ended
onEvent("retryButton", "click", function(){
  restart();
});

//onEvent to bring the player to the leaderboard
onEvent("leaderboardButton", "click", function(){
  leaderboard();
});

//onEvent to bring the player to the screen that allows for saving a score
onEvent("saveScreenButton", "click", function(){
  setText("saveScoreLabel", score);
  setScreen("saveScreen");
});

//onEvents for calling the function that changes the letters the player decides to save
onEvent("letterOneUp", "click", function(){
  letterChange("up", "letterOne");
});
onEvent("letterOneDown", "click", function(){
  letterChange("down", "letterOne");
});
onEvent("letterTwoUp", "click", function(){
  letterChange("up", "letterTwo");
});
onEvent("letterTwoDown", "click", function(){
  letterChange("down", "letterTwo");
});
onEvent("letterThreeUp", "click", function(){
  letterChange("up", "letterThree");
});
onEvent("letterThreeDown", "click", function(){
  letterChange("down", "letterThree");
});

//onEvent to bring the player back when on the saving screen
onEvent("cancelButton", "click", function(){
  setScreen("loseScreen");
});

//onEvent to add the players data to the leaderboard and calls the function to display the leaderboard
onEvent("submitSaveButton", "click", function(){
  createRecord("leaderboard", {player:(getText("letterOne") + getText("letterTwo") + getText("letterThree")), score:score}, function() {
    leaderboard();
  });
});

//onEvent to restart the game from the leaderboard screen
onEvent("leaderboardRetryButton", "click", function(){
  restart();
});

//function to run the game by moving the snake forward, eating the apple, adding blocks to the snake, checking if the player has lost, and updating the score
function game(){
  
  //runs the following code every 66 miliseconds
  var int = setInterval(function(){
    
    //checks if the player has lost
    if (getXPosition("snake0") == 320 || getXPosition("snake0") == -10 || getYPosition("snake0") == 450 || getYPosition("snake0") == -10 || loseCheck() == true){
      clearInterval(int);
      setText("endScoreLabel", score);
      setScreen("loseScreen");
    }else {
      
      //changes the position of the snake
      for (var i = (score + 2); i >= 0; i--){
        if (i > 0){
          setPosition(("snake" + i), getXPosition("snake" + (i - 1)), getYPosition("snake" + (i - 1)));
        }else{
          if (direction == "up"){
            setPosition("snake0", (getXPosition("snake0") + 0), (getYPosition("snake0") - 10));
          }else if (direction == "right"){
            setPosition("snake0", (getXPosition("snake0") + 10), (getYPosition("snake0") + 0));
          }else if (direction == "down"){
            setPosition("snake0", (getXPosition("snake0") + 0), (getYPosition("snake0") + 10));
          }else if (direction == "left"){
            setPosition("snake0", (getXPosition("snake0") - 10), (getYPosition("snake0") + 0));
          }
        }
      }
      
      //sets the apple to a new position after being eaten
      if (getXPosition("snake0") == getXPosition("apple") && getYPosition("snake0") == getYPosition("apple")){
        var randX = randomNumber (0, 31);
        var randY = randomNumber (0, 44);
        for (var j = 0; j <= (score + 2); j++){
          if (randX != 10 * (getXPosition("snake" + j)) && randY != 10 * (getYPosition("snake" + j))){
            setPosition("apple", slots[randX], slots[randY]);
          }else {
            randX = randomNumber (0, 31);
            randY = randomNumber (0, 44);
          }
        }
        
        //updates the score
        score++;
        setText("scoreLabel", score);
        
        //adds a new block to the snake
        image("snake" + (score + 2), "icon://fa-square");
        setSize("snake" + (score + 2), 10, 10);
        setProperty("snake" + (score + 2), "icon-color", "#7fde85");
        setProperty("snake" + (score + 2), "fit", "none");
      }
    }
  }, 66);
}

//function to check if the snake intersects itself
function loseCheck(){
  for (var i = 1; i < (score + 3); i++){
    if (getXPosition("snake0") == getXPosition("snake" + i) && getYPosition("snake0") == getYPosition("snake" + i)){
      return true;
    }
  }
}

//function to change the letters the player decides to save
function letterChange(direction, letter){
  if(direction == "up"){
    if (letter == "letterOne"){
      if (letterOneIndex == 25){
        letterOneIndex = 0;
      }
        letterOneIndex++;
        setText(letter, abc[letterOneIndex]);
    }else if(letter == "letterTwo"){
      if (letterTwoIndex == 25){
        letterTwoIndex = 0;
      }
        letterTwoIndex++;
        setText(letter, abc[letterTwoIndex]);
    }else {
      if (letterThreeIndex == 25){
        letterThreeIndex = 0;
      }
        letterThreeIndex++;
        setText(letter, abc[letterThreeIndex]);
    }
  }else {
    if (letter == "letterOne"){
      if (letterOneIndex == 0){
        letterOneIndex = 25;
      }
        letterOneIndex--;
        setText(letter, abc[letterOneIndex]);
    }else if(letter == "letterTwo"){
      if (letterTwoIndex == 0){
        letterTwoIndex = 25;
      }
        letterTwoIndex--;
        setText(letter, abc[letterTwoIndex]);
    }else {
      if (letterThreeIndex == 0){
        letterThreeIndex = 25;
      }
        letterThreeIndex--;
        setText(letter, abc[letterThreeIndex]);
    }
  }
}

//function to restart the game by setting everything back to the begining
function restart(){
  
  //deletes any extra snake parts
  for (var i = 3; i < score + 3; i++){
    deleteElement("snake" + i);
  }
  
  //puts the snake back into starting position
  setPosition("snake0", 80, 100);
  setPosition("snake1", 80, 90);
  setPosition("snake2", 80, 80);
  setPosition("apple", 240, 350);
  direction = "down";
  
  //resets the score
  score = 0;
  setText("scoreLabel", score);
  
  //resets the players letters
  letterOneIndex = 0;
  letterTwoIndex = 0;
  letterThreeIndex = 0;
  setText("letterOne", abc[letterOneIndex]);
  setText("letterTwo", abc[letterTwoIndex]);
  setText("letterThree", abc[letterThreeIndex]);
  
  //makes the game run once again
  setScreen("gameScreen");
  game();
}

//function to sort scores and display the leaderboard
function leaderboard(){
  var scoreList = getColumn("leaderboard", "score");
  var playerList = getColumn("leaderboard", "player");
  
  //sorts the scores from the data while keeping the players synced
  for (var i = 0; i < scoreList.length; i++){
    for (var j = 0; j < (scoreList.length - i - 1); j++){
      if (scoreList[j] > scoreList[j + 1]){
        var temp1 = scoreList[j];
        scoreList[j] = scoreList[j + 1];
        scoreList[j + 1] = temp1;
        var temp2 = playerList[j];
        playerList[j] = playerList[j + 1];
        playerList[j + 1] = temp2;
      }
    }
  }
  
  //reverses the lists from smaller to larger into larger to smaller
  scoreList = scoreList.reverse();
  playerList = playerList.reverse();
  
  //sets the text of the leaderboard
  for (var l = 1; l <= 9; l++){
    if (scoreList[l - 1] > 0){
      setText(l + "Leader", playerList[l - 1] + " - " + scoreList[l - 1]);
    }
  }
  
  //changes the screen to the leaderboard
  setScreen("leaderboardScreen");
}
