import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import "./App.css";

var ball;
var paddle;
var message;
const leftBorder = 0;
const rightBorder = 780;
const topBorder = 0;
const bottomBorder = 580;

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
  }, []);

  // ********************** GAME LOGIC **************************

  function InitialBallAndPaddle() {
    ball = new fabric.Circle({
      radius: 10,
      fill: "white",
      left: 390,
      top: 530,
      selectable: false,
    });
    paddle = new fabric.Rect({
      height: 20,
      width: 150,
      fill: "#EB1D36",
      left: 325,
      top: 550,
      selectable: false,
    });
    canvas.add(ball, paddle);
  }

  function StartBall() {
    var pixelMove = 3;
    var directionUp = true;
    var directionDown = false;
    var directionLeft = true;
    var directionRight = false;
    var moveTheBall = setInterval(() => {
      if (
        directionDown === true &&
        ball.top + 22 > paddle.top &&
        ball.top + 18 < paddle.top &&
        ball.left - 10 > paddle.left &&
        ball.left - 10 < paddle.left + 150
      ) {
        directionDown = false;
        directionUp = true;
        canvas.renderAll();
      } else if (
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
        if (ball.left <= leftBorder) {
          directionLeft = false;
          directionRight = true;
          console.log("direction right activated");
        } else if (ball.left >= rightBorder) {
          directionLeft = true;
          directionRight = false;
          console.log("direction left activated");
        } else if (ball.top <= topBorder) {
          directionUp = false;
          directionDown = true;
          console.log("direction down activated");
        } else if (ball.top >= bottomBorder) {
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
        }
      }
    }, 20);
  }

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <button onClick={() => InitialBallAndPaddle()}>Start Game</button>
        <button onClick={() => StartBall()}>Start Ball</button>

        <canvas id="canvas" width="800px" height="600px"></canvas>
      </div>
    </>
  );
}

export default App;
