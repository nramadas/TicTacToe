var TicTacToe = (function() {
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

  function Computer() {
    var that = this;

    that.getMove = function(gameboard) {
      // One approach is to use brute force to calculate all possible moves,
      // then pick the one most likely to give a winning result. However,
      // Tic Tac Toe isn't that complicated, and has been solved. Let's use
      // the solved strategy instead.
      // Reference: http://en.wikipedia.org/wiki/Tic-tac-toe#Strategy

      // Set up some helper functions:
      var twoInRow = function(token) {
        // If two in row, returns third position to complete line


      };

      var twoInRowHelper = function(token) {
        
      };

      // Check to see if there is a winning move:


      return [row, col];
    };
  }

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