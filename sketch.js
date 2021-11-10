//definicao de variaveis
var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;
var nuvem,imagemnuvem;
var obstaculo1,obstaculo2,obstaculo3;
var obstaculo4,obstaculo5,obstaculo6;
var obstaculo;
var grupo_de_obstaculo,grupo_de_nuvem;
var JOGAR = 1;
var ENCERRAR = 0;
var estado_do_jogo = JOGAR;
var pontuacao = 0;
var gameover, restart;
var fimdejogo,recomecar;
var somSalto,somMorte,somCheckPoint;


// funcao para carregamento de imagem e animacoes
function preload(){
  trex_correndo = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_colidiu = loadImage("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemnuvem = loadImage("cloud.png");
 
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  gameover = loadImage("gameOver.jpeg");
  restart = loadImage("restart.png");
  
  somSalto = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
}

function setup() {

  createCanvas(600,200)
  
  //criar um sprite do trex, imagem e reduzindo o tamanho da imagen
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.scale = 0.5;
  
  trex.addImage("colisao",trex_colidiu);
  //criar um sprite do solo, imagem, posicao do solo na horizontal, e velocidade do solo
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  solo.velocityX = -4;
  
  //criando solo invisível
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
  
  //gerar números aleatórios
  
  grupo_de_obstaculo = createGroup();
  grupo_de_nuvem = createGroup();
//  trex.debug = true;
  trex.setCollider("circle",0,0,45);
  
  fimdejogo = createSprite(300,100);
  fimdejogo.addImage("fimdejogo ",gameover);
  fimdejogo.scale = 0.5;
  recomecar = createSprite(300,140);
  recomecar.addImage("recomecar",restart);
  recomecar.scale = 0.5;
}

function draw() {
  //definir cor de fundo
  background("white");
  
  text("Pontuação: " + pontuacao, 500,50);
  
  // verificacao da variacao da posicao vertical para o salto do trex
  //console.log(trex.y)
  
  //var rand =  Math.round(random(1,100));
 // console.log(rand);
  
  if(estado_do_jogo === JOGAR){
    
     fimdejogo.visible = false;
     recomecar.visible = false;
   pontuacao = pontuacao + Math.round(frameRate()/60);
    
    if(pontuacao>0 && pontuacao%100 === 0){
       somCheckPoint.play() ;
    }
     
    solo.velocityX = -(4 + 3* pontuacao/100);
    
   // pular quando a tecla espaço é acionada
   if(keyDown("space")&& trex.y >= 160) {
    trex.velocityY = -13;
     somSalto.play();
   }
  // adicionanado gravidade ao trex para retornar ao solo
   trex.velocityY = trex.velocityY + 0.8
    
 // condicao para solo infinito
   if (solo.x < 0){
    solo.x = solo.width/2;
   }
   //gerar nuvens
   gerarNuvens();
   console.log(frameCount);
  
   gerarObstaculos();
    
   if(grupo_de_obstaculo.isTouching(trex)){ 
    // trex.velocityY = -12;
     somMorte.play();
     estado_do_jogo = ENCERRAR; 
   }
  }

  
  
  else if(estado_do_jogo === ENCERRAR){
    fimdejogo.visible = true;
    recomecar.visible = true;
    solo.velocityX = 0;
    trex.velocityY = 0;
    grupo_de_obstaculo.setVelocityXEach(0);
    grupo_de_nuvem.setVelocityXEach(0);
    trex.changeAnimation("colisao",trex_colidiu);
    //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
    grupo_de_obstaculo.setLifetimeEach(-1);
    grupo_de_nuvem.setVelocityXEach(-1);
    
    if(mousePressedOver(recomecar)){
       reset();
       
   }
      
  }
 
  //manter trex correndo acima do solo
  trex.collide(soloinvisivel);
 
  drawSprites();
}

function reset(){
   estado_do_jogo = JOGAR;
  
   fimdejogo.visible = false;
   recomecar.visible = false;
  
  grupo_de_obstaculo.destroyEach();
  grupo_de_nuvem.destroyEach();
  
  trex.changeAnimation("running", trex_correndo);
  
  pontuacao = 0;
}


//função para gerar as nuvens
function gerarNuvens() {
 // escreva o seu código aqui
  if (frameCount % 60 === 0) {
   nuvem = createSprite(600,100,40,10);
   nuvem.velocityX = -3;
   nuvem.addImage("nuvem",imagemnuvem);
   nuvem.y = Math.round(random(1,60));
   nuvem.scale = 0.5;
    
   nuvem.lifetime = 200 ;
    
   // ajustando a profundidade 
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    grupo_de_nuvem.add(nuvem);
  }
  
}

function gerarObstaculos() {
 // escreva o seu código aqui
  if (frameCount % 60 === 0) {
   obstaculo = createSprite(600,165,10,10);
   obstaculo.velocityX = -(6 + pontuacao/100);
    
   var rand = Math.round(random(1,6));
   switch(rand) { 
    case 1: obstaculo.addImage(obstaculo1);
    break;
    
    case 2: obstaculo.addImage(obstaculo2);
    break;
    
    case 3: obstaculo.addImage(obstaculo3);
    break;
    
    case 4: obstaculo.addImage(obstaculo4);
    break;
    
    case 5: obstaculo.addImage(obstaculo5);
    break;
    
    case 6: obstaculo.addImage(obstaculo6);
    break;
    
    default: break;
   }
    
   obstaculo.scale = 0.5;
    
   obstaculo.lifetime = 300 ;
    
//adicionar cada obstáculo ao grupo
   grupo_de_obstaculo.add(obstaculo);  
  
  }
  
  
}
