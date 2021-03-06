import * as d3 from "https://cdn.skypack.dev/d3@7";
import { scaleBand, scaleLinear } from "https://cdn.skypack.dev/d3-scale@3";

const textarea = document.querySelector("textarea");
let textdata = "";
let countArray = [];
textarea.addEventListener("keyup", (e) => onChange(e));
textarea.addEventListener("keydown", (e) => onChange(e));

const onChange = (e) => {
  textdata = e.target.value.split("");
  const set = new Set(textdata);
  const uniqueArray = [...set];
  countArray = uniqueArray.map((o) => {
    return { letter: o, count: count(textdata, o) };
  });
  redraw(countArray);
};
const scaleX = (data) => {
  return scaleBand()
    .domain(data.map((dp) => dp.letter))
    .range([0, 600])
    .padding(0.2);
};

const scaleY = scaleLinear().domain([0, 100]).range([0, 400]);

const count = (textArray, character) => {
  let count = 0;
  for (let i = 0; i < textArray.length; i++) {
    if (character === textArray[i]) {
      count++;
    }
  }
  return count;
};

const redraw = (receivedData) => {
  const svg = d3.select("svg").classed("container", true);

  const rects = svg.selectAll("rect").data(receivedData);

  rects
    .enter()
    .append("rect")
    .merge(rects)
    .classed("bar", true)
    .attr("width", scaleX(receivedData).bandwidth())
    .attr("height", (dta) => scaleY(dta.count))
    .attr("x", (dta) => scaleX(receivedData)(dta.letter))
    .attr("y", (dta) => 400 - scaleY(dta.count))
    .attr("rx", 2);

  const labels = d3.select("svg").selectAll("text").data(receivedData);

  labels
    .enter()
    .append("text")
    .merge(labels)
    .classed("label", true)
    .attr("x", function (dta) {
      return (
        scaleX(receivedData)(dta.letter) +
        scaleX(receivedData).bandwidth() * 0.5
      );
    })
    .attr("y", (dta) => 400 - scaleY(dta.count) - 10)
    .text((dta) => dta.letter);

  rects.exit().transition().duration(200).attr("opacity", 0).remove();

  labels.exit().remove();
};

redraw([]);
