import React, { useEffect, useRef, useState } from "react";
import { ColorSwatch, Group } from "@mantine/core";
import { SWATCH } from "../constant";
import axios from "axios";

function Home() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("grey");
  const [dictOfVars, setDictOfVars] = useState({});
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    //pencil
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        ctx.lineCap = "round";
        ctx.lineWidth = 1;
      }
    }
  }, []);

  const reset = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  //page
  const StartDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.background = "black";
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };

  //pencil ink
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const sendData = async()=>{
    const canvas = canvasRef.current
    if(canvas){
        const res = await axios({
          method:'post',
          url: `http://localhost:8080/calculator`,
          data: {
            image: canvas.toDataURL('image/png'),
            dict_of_vars: dictOfVars,
          }
        })
        const responce = await res.data  
    }
  }

  return (
    <>
      <div className="grid grid-cols-12 ">
        <div className="col-span-3 flex justify-end z-20">
          <button onClick={sendData} className="text-white p-2 bg-gray-600 rounded font-bold text-xl">
            calculate
          </button>
        </div>
        <div className="col-span-1 flex justify-end z-20">
          <button onClick={reset} className="text-white p-2 bg-gray-600 rounded font-bold text-xl">
            reset
          </button>
        </div>
        <div className="col-span-3 p-2 z-20">
          <Group>
            {SWATCH.map((elem) => (
              <ColorSwatch
                key={elem}
                color={elem}
                onClick={() => setColor(elem)}
              />
            ))}
          </Group>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute top-0 left-0 h-full w-full"
        onMouseDown={StartDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
    </>
  );
}

export default Home;
