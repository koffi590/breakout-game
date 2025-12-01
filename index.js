/******* MES VARIABLES *******/
const grille = document.querySelector('.grille')
const resultat = document.getElementById('score')
let vie = document.getElementById('vies')

const briqueW = 100
const briqueH = 20

const diametre = 20
const grilleW = 560
const grilleH = 300

let xDirection = -2
let yDirection = 2
let vies = 3

const posRaquette = [230, 10]
let posActuRaquette = posRaquette

const posBalle = [270, 30]
let posActuBalle = posBalle


let timerId
let timeId
let score = 0
let enJeu = false;

const msgFinJeu = document.getElementById('fin-jeu-message');
msgFinJeu.style.display = 'none';

const temps = document.getElementById('timer');
let seconds = 0;
let minutes = 0;

/******* GESTION DE PAUSE, CONTINUER ET REPRENDRE *******/
window.addEventListener('keydown', (event) => {
  if (event.key === ' ') { // La touche Espace a été enfoncée
    enJeu = !enJeu; // Inverser l'état du jeu
    // Affiche ou masque le menu de pause en fonction de l'état du jeu
    const pauseMenu = document.querySelector('.pause-menu');
    if (enJeu) {
      pauseMenu.style.display = 'block';
    } else {
      pauseMenu.style.display = 'none';
    }
  } else if ((event.key === 'C')||(event.key === 'C')) {
    ajoutBalle()
    ajoutRaquette()
    JeuCom()
    
  } else if ((event.key === 'R')||(event.key === 'r')) {
    clearInterval(timeId)
    compteur()
    timeId = setInterval(compteur, 1000)
    reprendre()
    collisions()
  }
  
  window.addEventListener('keydown', mvmntraquette)
});

/******* GESTION DU COMPTEUR *******/
function compteur() {
  if (!enJeu) { // Vérifiez si le jeu n'est pas en pause
    seconds++;
    if (seconds == 60) {
      seconds = 0;
      minutes++;
    }
    temps.innerHTML = "TEMPS:"+ " "+`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`+ "s";
  }
}
timeId = setInterval(compteur, 1000)

/******* CONSTRUCTEUR DE MA BRIQUE*******/
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis]
    this.bottomRight = [xAxis + briqueW, yAxis]
    this.topRight = [xAxis + briqueW, yAxis + briqueH]
    this.topLeft = [xAxis, yAxis + briqueH]
  }
}

/******* TOUTES MES BRIQUES (3lignes, 5colonnes)*******/
let briques = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),

  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),

  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
]

/******* FONCTION QUI PERMET DE DESSINER LES BRIQUES *******/
function ajoutBrique() {
  for (let i = 0; i < briques.length; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.style.left = briques[i].bottomLeft[0] + 'px'  
    block.style.bottom = briques[i].bottomLeft[1] + 'px'  
    grille.appendChild(block)
  }
}
ajoutBrique()

//AJOUT DE LA RAQUETTE
const raquette = document.createElement('div')
raquette.classList.add('raquette')
grille.appendChild(raquette)
ajoutRaquette()

//DESSINE LA RAQUETTE
function ajoutRaquette() {
  raquette.style.left = posActuRaquette[0] + 'px'
  raquette.style.bottom = posActuRaquette[1] + 'px'
}

//AJOUT DE LA BALLE
const balle = document.createElement('div')
balle.classList.add('balle')
grille.appendChild(balle)
ajoutBalle()

//DESSINE LA BALLE
function ajoutBalle() {
  balle.style.left = posActuBalle[0] + 'px'
  balle.style.bottom = posActuBalle[1] + 'px'
}

/******* FONCTION QUI PERMET DE GERER LES MOUVEMENTS DE LA RAQUETTE *******/
function mvmntraquette(event) {
  switch (event.key) {
    case 'ArrowLeft':
      if (posActuRaquette[0] > 0) {
        posActuRaquette[0] -= 10
        ajoutRaquette()   
      }
      break
    case 'ArrowRight':
      if (posActuRaquette[0] < (grilleW - briqueW)) {
        posActuRaquette[0] += 10
        ajoutRaquette()   
      }
      break
  }
}
window.addEventListener('keydown', mvmntraquette)

/******* FONCTION QUI PERMET DE LANCER LE JEU *******/
function JeuCom() {
  if (!enJeu){
    posActuBalle[0] += xDirection
    posActuBalle[1] += yDirection
    ajoutBalle()
    collisions()
  }
  timerId = requestAnimationFrame(JeuCom)
}
JeuCom()

/******* FONCTION QUI VERIFIE LES COLLISIONS *******/
function collisions() {
  for (let i = 0; i < briques.length; i++){
    if
    (
      (posActuBalle[0] > briques[i].bottomLeft[0] && posActuBalle[0] < briques[i].bottomRight[0]) &&
      ((posActuBalle[1] + diametre) > briques[i].bottomLeft[1] && posActuBalle[1] < briques[i].topLeft[1]) 
    )
      {
      const tBriques = Array.from(document.querySelectorAll('.block'))
      tBriques[i].classList.remove('block')
      briques.splice(i,1)
      changeDirection()   
      score++
      resultat.innerHTML = `SCORE: ${score}`
      if (briques.length === 0){
        msgFinJeu.style.display = 'block'
        resultat.innerHTML = "YOUPIII, vous avez gagnez😀😀😀!!!";
        balle.classList.remove('balle')
        raquette.classList.remove('raquette')
        window.removeEventListener('keydown', mvmntraquette)
        clearInterval(timeId)
        cancelAnimationFrame(JeuCom);
        msgFinJeu.style.display = 'block';
      }
    }

  }
  if (posActuBalle[0] >= (grilleW - diametre) || posActuBalle[1] >= (grilleH - diametre) || posActuBalle[0] <= 0 )
  {
    changeDirection()
  }
  if
  (
    (posActuBalle[0] > posActuRaquette[0] && posActuBalle[0] < posActuRaquette[0] + briqueW) &&
    (posActuBalle[1] > posActuRaquette[1] && posActuBalle[1] < posActuRaquette[1] + briqueH ) 
  )
  {
    changeDirection()
  }
  if (briques.length > 0) {
    if ((posActuBalle[1] <= 0)&& vies > 0) {
      vies--
      vie.innerHTML = "VIES: " + `${vies}`
      posActuBalle = posBalle
      enJeu = true
      setTimeout(() => {
        boucleJeu()
      }, 1000);
    } else if (vies === 0){
      msgFinJeu.style.display = 'block'
      vie.innerHTML = "Désolée, vous n'avez plus assez de vies😭😭😭!!!"
      resultat.innerHTML = "SCORE: " + `${score}`
      msgFinJeu.style.display = 'block';
      detruireBlock()
      raquette.classList.remove('raquette')
      balle.classList.remove('balle')
      clearInterval(timeId)
      window.removeEventListener('keydown', mvmntraquette)
    }
  }
  
}

/******* BOUCLE DE JEU *******/
function boucleJeu(){
  enJeu = false

  xDirection = -2
  yDirection = 2

  posActuRaquette = [230, 10]
  posActuBalle = [270, 30]

  balle.classList.remove('balle')
  balle.classList.add('balle')
  ajoutBalle()
  grille.appendChild(balle)

  raquette.classList.remove('raquette')
  raquette.classList.add('raquette')
  ajoutRaquette()
  grille.appendChild(raquette)

  resultat.innerHTML = "SCORE: " + `${score}`

  briques.forEach((block, ind )=> {
    const brique = document.querySelector('.block:nth-child(' + (ind + 1)+ ')')
    brique.classList.add('block')
    console.log(block)
  });

  JeuCom()
}

/******* FONCTION QUI PERMET DE SUPPRIMER TOUTES LES BRIQUES *******/
function detruireBlock() {
  const briques = document.querySelectorAll('.block');
  briques.forEach(block => block.remove());
}

/******* FONCTION QUI S'EXECUTE QUAND ON REPREND LE JEU *******/
function reprendre() {
  enJeu = false;

  const msgFinJeu = document.getElementById('fin-jeu-message');
  msgFinJeu.style.display = 'none';
  
  const pauseMenu = document.querySelector('.pause-menu');
  pauseMenu.style.display = 'none';
  score = 0
  resultat.innerHTML = "SCORE: " + score
  vies = 3
  vie.innerHTML = "VIES: " + vies
  seconds = 0;
  minutes = 0;
  // Réinitialise la direction de la balle
  xDirection = -2;
  yDirection = 2;

  // Réinitialise les positions de la balle et de la raquette
  posActuBalle = [270, 30];
  posActuRaquette = [230, 10];

  // Réinitialise les blocs
  detruireBlock();
  briques = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
  ];
  ajoutBrique();
  boucleJeu()
  
  
  // Réinitialise la position de la balle
  balle.style.left = posActuBalle[0] + 'px';
  balle.style.bottom = posActuBalle[1] + 'px';

  // Réinitialise la position de la raquette
  raquette.style.left = posActuRaquette[0] + 'px';
  raquette.style.bottom = posActuRaquette[1] + 'px';

  JeuCom(); // Redémarre le mouvement de la balle
  resultat.innerHTML = "SCORE: " + score;
  vie.innerHTML = "VIES: " + vies;
}

/******* FONCTION QUI GERE LES DIRECTIONS DE LA BALLE *******/
function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2
    return
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2
    return
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2
    return
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2
    return
  }
}