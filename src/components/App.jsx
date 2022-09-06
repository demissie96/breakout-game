import React, { useState, useEffect } from "react";
import { fabric } from "fabric";

var ball;
var paddle;

function App() {
  // Define a state variable to store and access the fabric.Canvas object
  const [canvas, setCanvas] = useState("");

  // Create a function that returns a fabric.Canvas object
  const initCanvas = () =>
    new fabric.Canvas("canvas", {
      height: 600,
      width: 800,
      backgroundColor: "grey",
      borderScaleFactor: 3,
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
  }, []);

  // ********************** GAME LOGIC **************************

  function InitialBallAndPaddle() {
    ball = new fabric.Circle({
      radius: 10,
      fill: "red",
      left: 400,
      top: 500,
    });
    paddle = new fabric.Rect({
      height: 20,
      width: 150,
      fill: "blue",
      left: 400,
      top: 550,
    });
    canvas.add(ball, paddle);
  }

  function StartBall() {
    var pixelMove = 3;
    var direction = true;
    setInterval(() => {
      if (ball.top > 200 && direction === true) {
        ball.top -= pixelMove;
        ball.left -= pixelMove;
        canvas.renderAll();
        console.log(ball.top);
      } else if (ball.top < 500 && direction === false) {
        direction = false;
        console.log(direction);
        ball.top += pixelMove;
        ball.left += pixelMove;
        canvas.renderAll();
        console.log(ball.top);
      } else {
        direction = !direction;
      }
    }, 20);
  }

  return (
    <>
      <div>
        <button onClick={() => InitialBallAndPaddle()}>Start Game</button>
        <button onClick={() => StartBall()}>Start Ball</button>
        <canvas id="canvas" width="200px" height="200px"></canvas>
      </div>
    </>
  );
}

export default App;
