import { paginator } from "/paginator/paginate-bootstrap.js";
import { sanitizeStringWithTableRows } from "./utils.js";

const API = "http://localhost:8080/api/car/sorted";
let SIZE = 10;
let cars = [];

let sortField = "brand";
let sortOrder = "asc";

let initialized = false;

function handleSort(pageNo) {
  sortOrder = sortOrder == "asc" ? "desc" : "asc";
  sortField = "brand";
  load(pageNo);
}

const dropdown = document.querySelector(".dropdown-menu");
dropdown.addEventListener("click", (event) => {
  event.preventDefault();
  const size = event.target.getAttribute("data-size");
  if (size !== null) {
    SIZE = parseInt(size);
    load(1);
  }
});


async function load(pageNo) {
  if (!initialized) {
    document.getElementById("header-brand").onclick = function (evt) {
      evt.preventDefault();
      handleSort(pageNo);
    };
    initialized = true;
  }

  pageNo = Number(pageNo);

  let queryString = `sort=${sortField},${sortOrder}&size=${SIZE}&page=${pageNo - 1}`;
  let data = null;
  try {
    const response = await fetch(`${API}?${queryString}`);
    console.log('Response status:', response.status);
    data = await response.json();
    console.log('Response data:', data);
    cars = data.content;
  } catch (e) {
    console.error(e);
  }

  const rows = cars
    .map(
      (car) => `
      <tr>
        <td>${car.id}</td>
        <td>${car.brand}</td>
        <td>${car.model}</td>
        <td>${car.color}</td>
        <td>${car.kilometers}</td>
      </tr>
    `
    )
    .join("");

  // DON'T forget to sanitize the string before inserting it into the DOM
  document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(rows);

  let total = null;
  if (data !== null) {
    total = Math.ceil(data.totalElements / SIZE);
  }

  paginator({
    target: document.getElementById("car-paginator"),
    total: total,
    current: pageNo,
    click: load,
  });
}

// Load the first page initially
load(1);
