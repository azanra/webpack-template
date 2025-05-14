import "./style.css";
import img from "./asset/resource/img.png";

console.log("Hello world!");
const paraElement = document.querySelector("p");
const imgElement = document.createElement("img");
imgElement.src = img;
paraElement.appendChild(imgElement);
