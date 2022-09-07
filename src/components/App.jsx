import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import "./App.css";

var ball;
var paddle;
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
      backgroundColor: "grey",
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
  }, []);

  // ********************** GAME LOGIC **************************

  function InitialBallAndPaddle() {
    ball = new fabric.Circle({
      radius: 10,
      fill: "red",
      left: 390,
      top: 530,
      selectable: false,
    });
    paddle = new fabric.Rect({
      height: 20,
      width: 150,
      fill: "blue",
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
    setInterval(() => {
      if (directionUp === true && directionLeft === true && ball.left > leftBorder && ball.top > topBorder) {
        ball.top -= pixelMove;
        ball.left -= pixelMove;
        canvas.renderAll();
        console.log(ball.top);
      } else if (directionDown === true && directionRight === true && ball.left < rightBorder && ball.top < bottomBorder ) {
        ball.top += pixelMove;
        ball.left += pixelMove;
        canvas.renderAll();
        console.log(ball.top);
      } else if (directionDown === true && directionLeft === true && ball.left > leftBorder && ball.top < bottomBorder ) {
        ball.top += pixelMove;
        ball.left -= pixelMove;
        canvas.renderAll();
        console.log(ball.top);
      }  else if (directionUp === true && directionRight === true && ball.left < rightBorder && ball.top > topBorder ) {
        ball.top -= pixelMove;
        ball.left += pixelMove;
        canvas.renderAll();
        console.log(ball.top);
      }  else {
        if(ball.left <= leftBorder) {
          directionLeft = false;
          directionRight = true;
          console.log("direction right activated");
        } else if (ball.left >= rightBorder){
          directionLeft = true;
          directionRight = false;
          console.log("direction left activated");
        } else if (ball.top <= topBorder){
          directionUp = false;
          directionDown = true;
          console.log("direction down activated");
        } else if (ball.top >= bottomBorder){
          directionUp = true;
          directionDown = false;
          console.log("direction up activated");
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
