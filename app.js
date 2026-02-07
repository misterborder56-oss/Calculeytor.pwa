// VARIABLES GLOBALES
let exp = "";
let history = [];

// CARGAR HISTORIAL DESDE LOCALSTORAGE
(function loadHistory() {
  try {
    const h = localStorage.getItem("calcHistory");
    if(h) {
      const parsed = JSON.parse(h);
      if(Array.isArray(parsed)) history = parsed;
    }
  } catch(e) { history = []; }
})();

// REFERENCIAS
const screenEl = document.getElementById("screen");
const historyEl = document.getElementById("historyList");

// ACTUALIZAR HISTORIAL EN PANTALLA
function updateHistoryUI() {
  if(!Array.isArray(history)) history = [];
  historyEl.innerHTML = "";
  for(let i = history.length - 1; i >= 0; i--) {
    const li = document.createElement("li");
    li.textContent = history[i];
    historyEl.appendChild(li);
  }
}
updateHistoryUI();

// FUNCIÓN PARA AGREGAR CARACTERES
function add(value) {
  exp += value;
  screenEl.value = exp;
}

// BORRAR TODO
function clearAll() {
  exp = "";
  screenEl.value = "";
}

// BORRAR ÚLTIMO
function del() {
  exp = exp.slice(0, -1);
  screenEl.value = exp;
}

// VALIDAR EXPRESIÓN
function isValidExpression(e) {
  if(!e) return false;
  return !/[+\-*/]$/.test(e); // no termina con operador
}

// PARSEAR EXPRESIÓN PARA JS
function parseExpression(e) {
  // Reemplazar símbolos × ÷
  e = e.replace(/×/g,"*").replace(/÷/g,"/");

  // Manejo de porcentaje: "50%10" -> "(50*10/100)"
  e = e.replace(/(\d+(?:\.\d+)?)%(\d+(?:\.\d+)?)/g, "($1*$2/100)");

  // Manejo de porcentaje solo "50%" -> "50/100"
  e = e.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

  return e;
}

// CALCULAR
function calc() {
  if(!isValidExpression(exp)) return;
  try {
    const parsed = parseExpression(exp);

    // Uso de Function() seguro
    const result = Function('"use strict"; return (' + parsed + ')')();

    // Guardar historial
    history.push(`${exp} = ${result}`);
    localStorage.setItem("calcHistory", JSON.stringify(history));
    updateHistoryUI();

    // Mostrar resultado
    exp = String(result);
    screenEl.value = exp;
  } catch(e) {
    screenEl.value = "Error";
    exp = "";
  }
}

// BORRAR HISTORIAL
function clearHistory() {
  history = [];
  localStorage.removeItem("calcHistory");
  updateHistoryUI();
}

// MODO CIENTÍFICO
function toggleSci() {
  document.getElementById("scientific").classList.toggle("hidden");
}

function sci(type) {
  if(!exp) return;
  const v = Number(exp);
  let r;
  switch(type) {
    case "sin": r = Math.sin(v); break;
    case "cos": r = Math.cos(v); break;
    case "tan": r = Math.tan(v); break;
    case "sqrt": r = Math.sqrt(v); break;
    case "pow": r = Math.pow(v,2); break;
    case "pi": r = Math.PI; break;
    default: r = v;
  }
  exp = String(r);
  screenEl.value = exp;
}

// CAMBIO DE TEMAS CON SELECT
function applyTheme() {
  const select = document.getElementById("themeSelect");
  const value = select.value;
  document.body.className = value;
}
