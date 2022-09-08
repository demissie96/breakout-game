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
var brick;
var gradient;
var moveTheBall;
var refreshRate = 10;
var score = 0;
var life = 3;
var brickHitted = false;

function App() {
  // Define a state variable to store and access the fabric.Canvas object
  const [canvas, setCanvas] = useState("");

  // Create a function that returns a fabric.Canvas object
  const initCanvas = () =>
    new fabric.Canvas("canvas", {
      height: 600,
      width: 800,
      backgroundColor: "#16213E",
      borderScaleFactor: 3,
      centeredScaling: true,
    });
  // Set global border styles on select
  fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: "red",
    borderScaleFactor: 3,
    cornerStyle: "circle",
    cornerSize: 10,
    cornerStrokeColor: "red",
    cornerColor: "white",
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
    brick = new fabric.Rect({
      height: 50,
      width: 100,
      left: 700,
      top: 100,
      selectable: false,
      stroke: "black",
      strokeWidth: 1,
    });
    // Add gradient color to the brick
    gradient = new fabric.Gradient({
      type: "linear",
      gradientUnits: "pixels", // or 'percentage'
      coords: { x1: 0, y1: 0, x2: 0, y2: brick.height },
      colorStops: [
        { offset: 0, color: "#C98474" },
        { offset: 1, color: "#F2D388" },
      ],
    });
    brick.set("fill", gradient);
    canvas.add(brick);
  }

  // Ball behaviour
  function StartBall() {
    // Starting values
    const pixelMove = 3;
    var directionUp = true;
    var directionDown = false;
    var directionLeft = true;
    var directionRight = false;

    // Move the ball with interval
    moveTheBall = setInterval(() => {
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
        // Check if the ball hit the brick
        brickHitted === false &&
        ball.top + 20 >= brick.top &&
        ball.top <= brick.top + 50 &&
        ball.left + 20 >= brick.left &&
        ball.left <= brick.left + 100
      ) {
        brickHitted = true;
        if (
          // When the ball hit the right side of the brick
          directionLeft === true &&
          ball.top < brick.top + 48 &&
          ball.top + 20 > brick.top + 2
        ) {
          directionLeft = !directionLeft;
          directionRight = !directionRight;
        } else if (
          // When the ball hit the left side of the brick
          directionRight === true &&
          ball.top < brick.top + 48 &&
          ball.top + 20 > brick.top + 2
        ) {
          directionLeft = !directionLeft;
          directionRight = !directionRight;
        } else {
          // When the ball hit the top or bottom part of the brick
          directionDown = !directionDown;
          directionUp = !directionUp;
        }
        canvas.renderAll();
        console.log("Hit the brick");
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
          console.log("Lost one life.");
          message = new fabric.Text("Oops!", {
            fill: "#EB1D36",
            fontFamily: "serif",
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
                fontFamily: "serif",
                fontWeight: "bold",
                selectable: false,
                textBackgroundColor: null,
                fontSize: 80,
                top: 260,
                left: 200,
              });
              canvas.add(message);
            }
          }, 2000);
        }
      }
    }, refreshRate); // This defines the ball speed
  }

  return (
    <>
      <div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <h2>Life: {lifeSum}</h2>
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

        <canvas id="canvas" width="800px" height="600px"></canvas>

        <button
          style={{ visibility: "visible", position: "absolute" }}
          id="start-game"
          onClick={() => clearInterval(moveTheBall)}
        >
          Stop
        </button>
      </div>
    </>
  );
}

export default App;
