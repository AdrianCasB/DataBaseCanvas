function iniciar(){
	
  var elemento=document.getElementById('lienzo');
  lienzo=elemento.getContext('2d');
  lienzo.beginPath();
  
  var imagen=new Image();
  imagen.src="fondo.png";
  
  
  
  
 
  
  
  function pinta(){
  
  
 
 
  lienzo.clearRect(0,0,800,200);
  lienzo.drawImage(imagen,0,0);
  x=Math.random()*800;
  y=Math.random()*200;
  grosor=Math.random()*50;
  
  lienzo.beginPath();
  lienzo.lineWidth=4;
  lienzo.moveTo(x+grosor,y);
  lienzo.arc(x,y,grosor,0,Math.PI*2, false);
  lienzo.strokeStyle="#fff";
  lienzo.stroke();
   
  }
  
   setInterval(pinta, 500);
  
}
  
   
 
window.addEventListener('load', iniciar, false);
