import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import "./App.css";

const leftBorder = 0;
const rightBorder = 780;
const topBorder = 0;
const bottomBorder = 580;

var ball;
var paddle;
var message;
var brick = [];
var gradient;
var moveTheBall;
var refreshRate = 15;
var score = 0;
var life = 3;
var remainingBrick = 16;
var brickHitted = [];

function Restart() {
  console.log("Restart");
  window.location.reload();
}

function App() {
  // Restart button visibility
  const [restartButton, setRestartButton] = useState(false);

  // Define a state variable to store and access the fabric.Canvas object
  const [canvas, setCanvas] = useState("");

  // Create a function that returns a fabric.Canvas object
  const initCanvas = () =>
    new fabric.Canvas("canvas", {
      height: 600,
      width: 800,
      backgroundColor: "#16213E",
      centeredScaling: true,
    });

  // Create canvas object
  useEffect(() => {
    setCanvas(initCanvas());
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" && paddle.left > 0) {
        paddle.left -= 10;
      } else if (event.key === "ArrowRight" && paddle.left < 650) {
        paddle.left += 10;
      }
    });

    setTimeout(() => {
      document.getElementById("setup-game").click();
      setTimeout(() => {
        document.getElementById("start-game").click();
      }, 2000);
    }, 1000);
  }, []);

  // ********************** GAME LOGIC **************************

  const [scoreSum, setScoreSum] = useState(score);
  const [lifeSum, setLifeSum] = useState(life);

  // Create paddle and ball
  function InitialBallAndPaddle() {
    ball = new fabric.Circle({
      radius: 10,
      fill: "white",
      left: 390,
      top: 530,
      selectable: false,
    });
    paddle = new fabric.Rect({
      height: 10,
      width: 150,
      fill: "#EB1D36",
      left: 325,
      top: 550,
      selectable: false,
    });
    canvas.add(ball, paddle);
  }

  // Create a brick
  function Bricks() {
    for (let index = 0; index < 16; index++) {
      brick[index] = new fabric.Rect({
        height: 50,
        width: 100,
        left: index < 8 ? index * 100 : index * 100 - 800,
        top: index < 8 ? 100 : 150,
        selectable: false,
        stroke: "black",
        strokeWidth: 1,
      });
      // Add gradient color to the brick
      gradient = new fabric.Gradient({
        type: "linear",
        gradientUnits: "pixels", // or 'percentage'
        coords: { x1: 0, y1: 0, x2: 0, y2: brick[index].height },
        colorStops: [
          { offset: 0, color: "#C98474" },
          { offset: 1, color: "#F2D388" },
        ],
      });
      brickHitted[index] = false;
      brick[index].set("fill", gradient);
      canvas.add(brick[index]);
    }
  }

  // Ball behaviour ******************************************
  function StartBall() {
    // Starting values
    const pixelMove = 3;
    var directionUp = true;
    var directionDown = false;
    var directionLeft = true;
    var directionRight = false;

    // Move the ball with interval
    moveTheBall = setInterval(() => {
      let oneBrickWasHit = false; // Prevent to hit 2 bricks at the same time

      // ############################## BRICK LOGIC START ########################################
      // Check if the ball hit the brick
      for (let index = 0; index < 16; index++) {
        if (
          oneBrickWasHit === false &&
          brickHitted[index] === false &&
          ball.top + 20 >= brick[index].top &&
          ball.top <= brick[index].top + 50 &&
          ball.left + 20 >= brick[index].left &&
          ball.left <= brick[index].left + 100
        ) {
          brickHitted[index] = true;
          canvas.remove(brick[index]);
          score++;
          remainingBrick--;
          setScoreSum(score);
          if (remainingBrick < 1) {
            clearInterval(moveTheBall);
            message = new fabric.Text("You Win!", {
              fill: "#59CE8F",
              fontFamily: "arial",
              fontWeight: "bold",
              selectable: false,
              textBackgroundColor: null,
              fontSize: 80,
              top: 260,
              left: 240,
            });
            canvas.add(message);
            setRestartButton(true);
          }
          if (
            // When the ball hit the right side of the brick
            directionLeft === true &&
            ball.top < brick[index].top + 48 &&
            ball.top + 20 > brick[index].top + 2
          ) {
            directionLeft = !directionLeft;
            directionRight = !directionRight;
          } else if (
            // When the ball hit the left side of the brick
            directionRight === true &&
            ball.top < brick[index].top + 48 &&
            ball.top + 20 > brick[index].top + 2
          ) {
            directionLeft = !directionLeft;
            directionRight = !directionRight;
          } else {
            // When the ball hit the top or bottom part of the brick
            directionDown = !directionDown;
            directionUp = !directionUp;
          }
          canvas.renderAll();
          oneBrickWasHit = true;
          // ############################## BRICK LOGIC END ########################################
        }
      }
      if (
        // When ball hit the paddle, change vertical direction
        directionDown === true &&
        ball.top + 22 > paddle.top &&
        ball.top + 18 < paddle.top &&
        ball.left + 20 > paddle.left &&
        ball.left < paddle.left + 150
      ) {
        directionDown = false;
        directionUp = true;
        canvas.renderAll();
      } else if (
        // Check if the ball is within the borders of the game and if so, then move
        directionUp === true &&
        directionLeft === true &&
        ball.left > leftBorder &&
        ball.top > topBorder
      ) {
        ball.top -= pixelMove;
        ball.left -= pixelMove;
        canvas.renderAll();
      } else if (
        directionDown === true &&
        directionRight === true &&
        ball.left < rightBorder &&
        ball.top < bottomBorder
      ) {
        ball.top += pixelMove;
        ball.left += pixelMove;
        canvas.renderAll();
      } else if (
        directionDown === true &&
        directionLeft === true &&
        ball.left > leftBorder &&
        ball.top < bottomBorder
      ) {
        ball.top += pixelMove;
        ball.left -= pixelMove;
        canvas.renderAll();
      } else if (
        directionUp === true &&
        directionRight === true &&
        ball.left < rightBorder &&
        ball.top > topBorder
      ) {
        ball.top -= pixelMove;
        ball.left += pixelMove;
        canvas.renderAll();
      } else {
        // If the ball hit the borders of the game, change direction
        if (ball.left <= leftBorder) {
          directionLeft = false;
          directionRight = true;
        } else if (ball.left >= rightBorder) {
          directionLeft = true;
          directionRight = false;
        } else if (ball.top <= topBorder) {
          directionUp = false;
          directionDown = true;
        } else if (ball.top >= bottomBorder) {
          // When the ball fall down, stop the ball, and send a message
          clearInterval(moveTheBall);
          message = new fabric.Text("Oops!", {
            fill: "#EB1D36",
            fontFamily: "arial",
            fontWeight: "bold",
            selectable: false,
            textBackgroundColor: null,
            fontSize: 80,
            top: 260,
            left: 300,
          });
          canvas.add(message);
          // Update remaining life
          life--;
          setLifeSum(life);
          // Reset the ball and paddle and remove the warning message
          setTimeout(() => {
            canvas.remove(ball, paddle, message);
            if (life > 0) {
              InitialBallAndPaddle();
              // Continue the game after 2 sec
              setTimeout(() => {
                StartBall();
              }, 2000);
            } else {
              // Send Game Over message when life runs out
              message = new fabric.Text("Game Over!", {
                fill: "#EB1D36",
                fontFamily: "arial",
                fontWeight: "bold",
                selectable: false,
                textBackgroundColor: null,
                fontSize: 80,
                top: 260,
                left: 200,
              });
              canvas.add(message);
              setRestartButton(true);
            }
          }, 2000);
        }
      }
    }, refreshRate); // This defines the ball speed
  }

  return (
    <>
      <div
        style={{ padding: "10px", backgroundColor: "#003865", color: "white" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-end",
          }}
        >
          <h2>Life: {lifeSum}</h2>
          <button
            style={{
              visibility: restartButton ? "visible" : "hidden",
              fontSize: "30px",
            }}
            id="restart"
            onClick={() => Restart()}
            type="button"
            className="btn btn-success"
          >
            Restart the Game
          </button>
          <h2>Score: {scoreSum}</h2>
        </div>
        <button
          style={{ visibility: "hidden", position: "absolute" }}
          id="setup-game"
          onClick={() => {
            InitialBallAndPaddle();
            Bricks();
          }}
        >
          Start Game
        </button>
        <button
          style={{ visibility: "hidden", position: "absolute" }}
          id="start-game"
          onClick={() => StartBall()}
        >
          Start Ball
        </button>

        <canvas style={{ border: "5px solid grey"}} id="canvas" width="800px" height="600px"></canvas>
      </div>
    </>
  );
}

export default App;
