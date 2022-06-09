window.addEventListener("load", eventos);

let d, url, data, val, storage, regist, miJSON, P, Q, preguntas;
let marcador = 1;
let contador = 1;

let home     = document.getElementById("home");
let question = document.getElementById("question");
let results  = document.getElementById("results");
let select   = document.getElementById("option");
let submit   = document.getElementById("submit");
let start    = document.getElementById("start");

function eventos() {
  try {
    submit.addEventListener("click", async (evento) => {
      evento.preventDefault();
      saveStorage(await choose());
    });
  } catch (error) {
    console.log("No estás en HOME.HTML");
  }

  try {
    start.addEventListener("click", async (evento) => {
      evento.preventDefault();
      start.disabled=true;
      let lastRegistry = await recoverStorage();
      Q = await queryThis(lastRegistry.category);
      displayTest(Q);
    });
  } catch (error) {
    console.log("No estás en QUESTION.HTML");
  }
}

function sigPregunta() {
  let currentQuestion = document.getElementById(`p${contador}`);
  currentQuestion.setAttribute("id", "hidden");
  contador++;
  if (contador <= 10) {
    let nextQuestion = document.getElementById(`q${contador}`);
    nextQuestion.setAttribute("id", `p${contador}`);
  } else {
    saveScore();
    displayScore();
    question.setAttribute("class", "width8em solid disabled");
    home.setAttribute("class", "width8em solid active");
  }
}
function sumaPuntos() {
  marcador++;
  sigPregunta();
}
async function saveScore() {
  let datos = await recoverStorage();

  miJSON = {
    id: datos.id,
    category: datos.category,
    score: marcador,
    time: new Date()
  };
  const cosa = JSON.stringify(miJSON);
  localStorage.setItem(datos.id, cosa);
}
function displayScore() {
  let div = document.createElement('div');
  div.innerHTML=""+`Has conseguido ${marcador} puntos de 10!`;
  document.body.append(div);
}
async function displayTest(elem) {
  let form = document.createElement("form");
  document.body.append(form);
  form.setAttribute("id", "test");
  let num = 0;
  let preguntas = [];
  elem.forEach((q) => {
    div = document.createElement("div");
    num++;

    let correcta =
      "" +
      `<label for="${num}">${q.correct_answer}</label>
    <input type="radio" name="${num}" id="q" onclick="sumaPuntos()"></br>`;
    preguntas.push(correcta);

    let incorrectas = [];
    for (let index = 0; index < 3; index++) {
      incorrectas[index] =
        "" +
        `<label for="${num}">${q.incorrect_answers[index]}</label>
      <input type="radio" name="${num}" id="q" onclick="sigPregunta()"></br>`;
      preguntas.push(incorrectas[index]);
    }

    shuffleThis(preguntas);

    div.innerHTML = `<p>${q.question}</p>
                        ${preguntas[0]} 
                        ${preguntas[1]} 
                        ${preguntas[2]} 
                        ${preguntas[3]} 
                    `;
    if (num > 1) {
      div.setAttribute("id", `q${num}`);
    } else {
      div.setAttribute("id", `p1`);
    }
    preguntas = []; //vaciamos el array una vez ha sido usado
    form.append(div);
  });
  start.disabled = true;
}
function shuffleThis(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
async function recoverStorage() {
  regist = localStorage.length;
  return await JSON.parse(localStorage.getItem(regist));
}

async function queryThis(thing) {
  url  = `https://opentdb.com/api.php?amount=10&category=${thing}&type=multiple`;
  data = await fetch(url).then((response) => response.json());
  console.log(data.results);
  return data.results;
}

async function saveStorage(valor) {
  regist = localStorage.length + 1;
  miJSON = {
    id: regist,
    category: valor,
    score: null,
    time: null,
  };
  const datos = JSON.stringify(miJSON);
  localStorage.setItem(regist, datos);
  question.setAttribute("class", "width8em solid active");
  home.setAttribute("class", "width8em solid disabled");
  submit.disabled = true;
}

async function choose() {
  val = await select.options[select.selectedIndex].value;
  return val;
}
