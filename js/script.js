/****************************************************************************************************** */
//1. Cuando tenga 3 vidas aumento velocidad enemigos
//2. Cuando tenga 4 vidas dos enemigos mas
//3. Con 5 vidas --> posicionar el avatar en otra posicion del tablero cerca de la puerta
//4. Cada vez que juega los caminos sean distintos --> Generar aleatoriamente el tablero
/********************************************************************************************************** */


//variables globales

let canvas;
let ctx;
const FPS = 50;

let anchoPosicion=50;
let altoPosicion=50;

let tamai=10;
let tamaj=10;

let miavatar;
let tileMap;

let anchoCanvas = 500;
let altoCanvas = 500;

let posllavei;
let posllavej;

let arrayenemigos=[];

let posx;
let posy;

//fila 10 --> j (fila*alto= 10*50=500 alto html)
//columna 10 --> i (columna*ancho= 10*50=500 ancho html)

let tablero = [  
    [2,2,2,0,0,0,2,2,2,2],  
    [0,2,0,0,0,0,0,0,0,2],  
    [0,2,2,2,2,2,2,2,0,2],
    [2,2,0,2,0,0,2,2,0,2],
    [2,0,0,2,0,0,2,2,0,2],
    [2,2,2,2,0,0,2,2,0,2],
    [0,2,0,2,0,0,2,0,1,2],
    [0,2,0,2,2,2,2,0,2,2],
    [0,2,0,3,0,0,2,0,2,0], 
    [2,2,2,2,2,2,2,2,2,0]
]


const tableroaleatorio=()=>{
  let aleatorio;
for(i=0; i<tamai; i++){
    for(j=0; j<tamaj; j++){
        aleatorio = Math.floor(Math.random()*4);
        tablero[i][j]=aleatorio;
    }
}  
}


 //i-->filas
 //j-->columnas
const dibujaEscenario=()=>{   
    for(i=0; i<tamai; i++){
        for(j=0; j<tamaj; j++){
            //¡¡¡¡¡como estoy en la primera fila, de la imagen voy cogiendo las porciones por posiciones!!!!!!!!
            ctx.drawImage(tileMap, tablero[i][j]*32,0,32,32, //parte de la imagen-->solo cojo la primera fila
                anchoPosicion*j, altoPosicion*i, anchoPosicion, altoPosicion); //parte de canvas
        }
    }
} //fin dibuja escenario

//Clase Enemigo
class Enemigo{
    constructor(x,y){
    //Propiedades
    this.x=x;
    this.y=y;
    this.retraso=50; //Propiedad para que los enemigos se muevan mas lento--> A MAYOR NUMERO MAS LENTO SE MUEVEN !!!!
    }

    //Metodos
    dibujaEnemigo(){
        ctx.drawImage(tileMap, 0,32,32,32, //Parte de la imagen, cojo la porcion del avatar
            anchoPosicion*this.x, altoPosicion*this.y, anchoPosicion, altoPosicion); //parte del canvas
    }

    //Comprobar si una casilla es bloque
    esbloque(j,i){
        let bloque=false;
        if(tablero[i][j]==0){
            bloque=true;
        }
        return bloque;
    }

    //metodos para mover los enemigos
    mover(){
        //comprobacion en el enemigo-->llamo a colision  
        miavatar.colision(this.x, this.y);//Le paso las posiciones del enemigo

        //Hago que el movimiento de los enemigos sea independiente del FPS del bucle principal
        if(this.contador<this.retraso){
            this.contador++;
        }
        else{
            this.contador=0;
        
        //Genero un numero aleatorio del 0 al 3, cada numero va a ser una direccion (derecha, izquierda, arriba, abajo)
        let direccion = Math.floor(Math.random()*4);

        //derecha--0
        if(direccion==0){
            if(this.x+1<tamaj && !this.esbloque(this.x+1, this.y)){
                this.x++;
            }
        }
       
        //izquierda--1
        if(direccion==1){
            if(this.x-1>=0 && !this.esbloque(this.x-1, this.y)){
                this.x--;
            }  
        }
       
        //abajo--2
        if(direccion==2){
            if(this.y+1<tamai && !this.esbloque(this.x, this.y+1)){
                this.y++;
            }  
        }
       
        //arriba--3
        if(direccion==3){
            if(this.y-1>=0 && !this.esbloque(this.x, this.y-1)){
                this.y--;
            }
        }
        }//fin else
    }

    //Aumenta la velocidad de movimiento de los enemigos
    aumentovelocidad(){
        this.retraso=10;
    }

   
}

//Clase Avatar
class Avatar{
    constructor(){
    //Propiedades
    this.x=0;
    this.y=0;
    this.llave=false;
    this.vida=0;
    }

    //Metodos
    dibujaAvatar(){
        ctx.drawImage(tileMap, 32,32,32,32, //Parte de la imagen, cojo la porcion del avatar
            anchoPosicion*this.x, altoPosicion*this.y, anchoPosicion, altoPosicion); //parte del canvas
    }

    //Metodo que posiciona el avatar
    esmagia(){
        this.x=9;
        this.y=7;
    }

    //Comprobar si una casilla es bloque
    esbloque(j,i){
        let bloque=false;
        if(tablero[i][j]==0){
            bloque=true;
        }
        return bloque;
    }

    //metodos para mover el avatar
    //Limito el avatar para que se mueva en todas las casillas excepto las que son bloque
    moverderecha(){
        if(this.x+1<tamaj && !this.esbloque(this.x+1, this.y)){
            this.x++;
            //Compruebo la casilla donde se encuentra el avatar cada vez que lo muevo
            this.comprobarcasilla();
        }
    }

    moverizquierda(){
        if(this.x-1>=0 && !this.esbloque(this.x-1, this.y)){
            this.x--;
            //Compruebo la casilla donde se encuentra el avatar cada vez que lo muevo
            this.comprobarcasilla();
        }
    }

    moverabajo(){
        if(this.y+1<tamai && !this.esbloque(this.x, this.y+1)){
            this.y++;
            //Compruebo la casilla donde se encuentra el avatar cada vez que lo muevo
            this.comprobarcasilla();
        }
    }

    moverarriba(){
        if(this.y-1>=0 && !this.esbloque(this.x, this.y-1)){
            this.y--;
            //Compruebo la casilla donde se encuentra el avatar cada vez que lo muevo
            this.comprobarcasilla();
        }
    }

    //metodos para llave y puerta
    ganarcomenzar(){
        console.log("Vuelves al inicio");
        //Coloco el avatar en la posicion inicial
        this.x=0;
        this.y=0;
        //Le quito la llave
        this.llave=false;
        //Coloco la llave en el tablero
        tablero[8][3]=3; 
        //doy una vida al avatar
        this.vida++;

        if(this.vida==3){
            console.log("Los enemigos se mueven mas rapido");
            for(let i=0; i<arrayenemigos.length; i++){
                arrayenemigos[i].aumentovelocidad();
            }
        }else if(this.vida==4){
            console.log("Añado 2 enemigos mas");           
            añadirenemigo(2); 
        }else if(this.vida==5){
            console.log("Posiciono el avatar en un lugar cercano a la puerta");
            miavatar.esmagia();

        }
    }
    comprobarcasilla(){
        //Primero las filas, luego las columnas --> ¡¡SIGO EL ORDEN DE LOS FORS!!
        if(tablero[this.y][this.x]==3){ //Si el avatar se encuentra en la posicion 3 -- En la llave
            console.log("Tienes la llave");
            this.llave=true;
            //Sustituyo la llave por suelo
            tablero[this.y][this.x]=2;
        }
        if(tablero[this.y][this.x]==1){ //Si el avatar se encuentra en la posicion 1 -- En la puerta
            if(this.llave){
                this.ganarcomenzar();
            }else{
                console.log("No tienes la llave. Sigue buscando");
            }
        }
    }

    //Metodos si el avatar choca con el enemigo
    estasmuerto(){
        console.log("Estas muerto. Empieza de nuevo");
        //Pongo el avatar en la posicion inicial
        this.x=0;
        this.y=0;
        //Coloco la llave en el tablero
        tablero[8][3]=3;
        //Si el avatar tiene la llave se la quito, no hace falta hacer un if
        this.llave=false;
    }

    colision(x,y){//posiciones del enemigo
        if(this.x==x && this.y==y){ //igualo la posicion del avatar con la de los enemigos
            this.estasmuerto();          
        }
    }
}


const borrarCanvas = () =>{   
    canvas.width = anchoCanvas;
    canvas.height = altoCanvas;
}


const controlTeclado = (event) =>{
    switch(event.keyCode){
        case 37:
            miavatar.moverizquierda(); 
            break;          
        case 38:
            miavatar.moverarriba();
            break;  
        case 39:
            miavatar.moverderecha();             
            break; 
        case 40 : 
            miavatar.moverabajo();
            break;
    } 
}

//IMPORTANTE!! En el bucle principal llamo a los metodos
const bucleprincipal = () =>{    
    borrarCanvas(); 
    dibujaEscenario();
    //Dibujo el avatar
    miavatar.dibujaAvatar();
    //Dibujo los enemigos, recorro el array donde los tengo guardados y llamo al metodo dibujar
    for(let i=0; i<arrayenemigos.length; i++){
        arrayenemigos[i].dibujaEnemigo();
        //Muevo los enemigos a la vez
        arrayenemigos[i].mover();
    }

}


//Funcion que me genera posiciones aleatorias
const generoposaleatoria=()=>{
    posx=Math.floor(Math.random()*tamaj); //horizontal--las columnas
    posy=Math.floor(Math.random()*tamai); //vertical--las filas
}

const añadirenemigo=(numero)=>{ //posicion enemigo
    
    //añado los enemigos al array
    while(numero>0){    
        //Genero una posicion aleatoria para cada enemigo añadido
        generoposaleatoria();     
        arrayenemigos.push(new Enemigo(posx,posy));    
        numero--;
    }         
}


const inicializa = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d'); 
    // tableroaleatorio();
    //Inicializo el avatar --> Creo un nuevo objeto avatar
    miavatar=new Avatar();

    //Inicializo los enemigos --> Como son varios objetos los voy guardando en un array
    //Voy guardando tantos como quiera
    arrayenemigos.push(new Enemigo(3,6));
    arrayenemigos.push(new Enemigo(8,8));
    arrayenemigos.push(new Enemigo(1,3));
    arrayenemigos.push(new Enemigo(4,7));

    //Inicializo la imagen!!-->Creo un elemento imagen y le asigno su src
    tileMap= document.createElement("IMG");
    tileMap.src = "image/tilemap.png"; 
     
    //Llamo al bucle principal
    setInterval(bucleprincipal, 1000 / FPS); 
   
}  

document.addEventListener("DOMContentLoaded", inicializa);
document.addEventListener("keydown", controlTeclado);
