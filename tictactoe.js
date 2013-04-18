var TicTacToe = (function() {
  // ----------------
  // HELPER FUNCTIONS
  // ----------------
  var transpose = function(array) {
    new_array = [];

    for(var i = 0; i < array.length; i++) {
      new_array.push([]);

      for(var j = 0; j < array[i].length; j++) {
        new_array[i][j] = array[j][i];
      }
    }

    return new_array;
  };

  // -------
  // CLASSES
  // -------

  // *** Board ***
  // contains:
  // gameboard
  // placeToken(row, col, token)
  // validateMove(row, col)
  // render()
  // gameOver()
  function Board(element) {
    var that = this;

    that.$canvas = element;

    // build empty board
    that.gameboard = (function() {
      var board = [];
      for(var i = 0; i < 3; i++) {
        var row = [];
        for(var j = 0; j < 3; j++) {
          row.push(" ");
        }

        board.push(row);
      }

      return board;
    })();

    that.placeToken = function(row, col, token) {
      if(that.validateMove(row, col)) {
        that.gameboard[row][col] = token;
        return true;
      } else {
        return false;
      }
    };

    that.validateMove = function(row, col) {
      return that.gameboard[row][col] === ' ';
    };

    that.render = function() {
      that.$canvas.empty();

      for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
          var $square = $("<div>")
                        .addClass("square")
                        .data('row', i)
                        .data('col', j)
                        .text(that.gameboard[i][j]);

          that.$canvas.append($square);
        }
      }
    };

    that.gameOver = function() {
      var horizontalWin = function(board) {
        for(var i = 0; i < board.length; i++) {
          if((board[i].join() === 'X,X,X') || (board[i].join() === "O,O,O")) {
            return true;
          }
        }

        return false;
      };

      var verticalWin = function(board) {
        return horizontalWin(transpose(board));
      };

      var diagonalWin = function(board) {
        if(board[1][1] === ' ') { return false; }

        return (((board[0][0] === board[1][1]) && (board[1][1] === board[2][2])) ||
                ((board[0][2] === board[1][1]) && (board[1][1] === board[2][0])));
      };

      var b = that.gameboard;

      return horizontalWin(b) || verticalWin(b) || diagonalWin(b);
    };
  }

  // *** Computer ***
  // contains:
  // getMove(gameboard)
  function Computer() {
    var that = this;

    that.getMove = function(gameboard) {
      // One approach is to use brute force to calculate all possible moves,
      // then pick the one most likely to give a winning result. However,
      // Tic Tac Toe isn't that complicated, and has been solved. Let's use
      // the solved strategy instead.
      // Reference: http://en.wikipedia.org/wiki/Tic-tac-toe#Strategy

      // Helper Functions
      // ^^^^^^^^^^^^^^^^

      var findFreeSideCenter = function() {
        var midSides = [[0,1],[1,0],[1,2],[2,1]];

        for(var i = 0; i < midSides.length; i++) {
          var pos = midSides[i];

          if(gameboard.gameboard[pos[0]][pos[1]] === " ") {
            return pos;
          }
        }

        return undefined;
      };

      var findFreeCorner = function() {
        var corners = [[0,0],[0,2],[2,0],[2,2]];

        for(var i = 0; i < corners.length; i++) {
          var pos = corners[i];

          if(gameboard.gameboard[pos[0]][pos[1]] === " ") {
            return pos;
          }
        }

        return undefined;
      };

      var twoInRow = function(token) {
        // If two in row, returns third position to complete line

        // check horizontal two-in-rows:
        var possibleMove = twoInRowHelper(gameboard.gameboard, token);
        if(possibleMove) {
          return possibleMove;
        }

        // check vertical two-in-rows:
        possibleMove = twoInRowHelper(transpose(gameboard.gameboard), token);
        if(possibleMove) {
          return [possibleMove[1], possibleMove[0]]; // undo the transpose
        }

        // check diagonal two-in-rows:
        possibleMove = twoInRowDiagonal(gameboard.gameboard, token);
        if(possibleMove) {
          return possibleMove;
        }

        return undefined;
      };

      var twoInRowHelper = function(board, token) {
        for(var i = 0; i < board.length; i++) {
          var tokenCount = 0;
          var blankCount = 0;
          var blankPosition = [];

          for(var j = 0; j < board[i].length; j++) {
            if(board[i][j] === token) {
              tokenCount++;
            } else if(board[i][j] === ' ') {
              blankCount++;
              blankPosition = [i, j];
            }
          }

          if(tokenCount === 2 && blankCount === 1) {
            return blankPosition;
          }
        }

        return undefined;
      };

      var twoInRowDiagonal = function(board, token) {
        var checkInDirection = function(board, token, direction) {
          var tokenCount = 0;
          var blankCount = 0;
          var blankPosition = [];

          for(var i = 0; i < board.length; i++) {
            var j;

            if(direction === 'leftright') {
              j = i;
            } else {
              j = 2 - i;
            }

            if(board[i][j] === token) {
              tokenCount++;
            } else if(board[i][j] === ' ') {
              blankCount++;
              blankPosition = [i, j];
            }
          }
          
          if(tokenCount === 2 && blankCount === 1) {
            return blankPosition;
          } else {
            return undefined;
          }
        };

        var possibleMove = checkInDirection(board, token, 'leftright');
        if(possibleMove) {
          return possibleMove;
        }

        possibleMove = checkInDirection(board, token, 'rightleft');
        if(possibleMove) {
          return possibleMove;
        }

        return undefined;
      };

      // Game Strategy
      // ^^^^^^^^^^^^^

      var move = [];

      // Check to see if there is a winning move:
      move = twoInRow("O");
      if(move) { return move; }

      // Check to see if a block must be made:
      move = twoInRow("X");
      if(move) { return move; }

      // Play the center if possible
      if(gameboard.gameboard[1][1] === ' ') { return [1,1]; }

      // If center is occupied by an opponent, play a corner if possible
      if(gameboard.gameboard[1][1] === 'X') { 
        move = findFreeCorner();
        if(move) { return move; } 
      }

      // Play a side if possible
      move = findFreeSideCenter();
      if(move) { return move; }

      // Pick at random:
      return [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
    };
  }

  // *** Game ***
  // contains:
  // computer
  // gameboard
  // move(row, col)
  // executeComputerMove()
  function Game(element) {
    var that = this;

    that.computer = new Computer();

    that.gameboard = new Board(element);
    that.gameboard.render();

    that.move = function(row, col) {
      if(that.gameboard.placeToken(row, col, 'X')) {
        that.gameboard.render();
        if(that.gameboard.gameOver()) {
          alert("You won!");
          return true;
        }

        that.executeComputerMove();
        that.gameboard.render();
        if(that.gameboard.gameOver()) {
          alert("You lost!");
          return true;
        }
      }

      return false;
    };

    that.executeComputerMove = function() {
      var move = that.computer.getMove(that.gameboard);
      if (!that.gameboard.placeToken(move[0], move[1], 'O')) {
        that.executeComputerMove();
      }
    };
  }

  return {
    Game: Game
  };
})();

$(function() {
  var game = new TicTacToe.Game($('#canvas'));

  $('#canvas').on("click", ".square", function() {
    var row = $(this).data('row');
    var col = $(this).data('col');
    if (game.move(row, col)) {
      $('#canvas').off('click');
    }
  });
});