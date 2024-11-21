const draggable = document.querySelectorAll('.draggable');
const dropzone = document.querySelectorAll('.dropzone');

var draggingElement = null;
var modoTema = localStorage.getItem('modo');
setModo( modoTema );

var contadorFavoritos = Number(localStorage.getItem('contadorFavoritos'));

  for (let i = 0; i < contadorFavoritos; i++) {
    document.getElementById('favoritos').appendChild( imagem() );
  }

var contadorVisitas = localStorage.getItem('contadorVisitas');
contadorVisitas = ( contadorVisitas === null ) ? 0 : Number( contadorVisitas ) + 1;
localStorage.setItem('contadorVisitas', contadorVisitas);
document.getElementById('contadorVisitas').innerHTML = contadorVisitas;

updateFotos();


function setModo( modoTema ) {
  const modo = document.getElementById('modo');

  if ( modoTema === 'dark' ) {
    document.body.classList.add('dark');
    document.body.classList.remove('white');

    modo.classList.add('fa-moon');
    modo.classList.remove('fa-sun');
    modo.classList.add('text-white');
    modo.classList.remove('text-black');
    modo.parentElement.classList.add('bg-black');
    modo.parentElement.classList.remove('bg-white');
  } else {
    document.body.classList.remove('dark');
    document.body.classList.add('white');

    modo.classList.add('fa-sun');
    modo.classList.remove('fa-moon');
    modo.classList.add('text-black');
    modo.classList.remove('text-white');
    modo.parentElement.classList.add('bg-white');
    modo.parentElement.classList.remove('bg-black');
  }
}

function trocarModo() {
  modoTema = ( modoTema === 'dark' ) ? 'white' : 'dark';

  setModo( modoTema );

  localStorage.setItem('modo', modoTema);
}

function imagem() {
  const div = document.createElement('div');
  div.className = 'w-full h-64 cursor-move draggable font-bold text-xl text-center text-white rounded-md bg-red-500 bg-center bg-cover';
  div.draggable = true;
  
  div.style.backgroundImage = `url( ./images/img${Math.floor(Math.random() * 10) + 1}.jpg )`;
  eventListeners(div);

  return div;
}

function adicionar() {

  const galeriaElements = document.getElementById('galeria');

  const div = imagem();
  galeriaElements.appendChild(div);

  updateFotos();

}

function localStorageContador() {
  localStorage.setItem('contadorFavoritos', contadorFavoritos);
}

function remover(){
  
  const galeriaElements = document.getElementById('galeria');
  if ( galeriaElements.hasChildNodes) {
    galeriaElements.removeChild(galeriaElements.lastChild);
  }
  

}

function eventListeners( element ) {
  element.addEventListener('dragstart', (event) => {

    draggingElement = event.target;

    event.dataTransfer.effectAllowed = 'move';
    // draggingElement.style.opacity = '0.5';
    event.dataTransfer.setData('text/plain', draggingElement);
    element.classList.add('dragging');
    
  })
  // Evento dragend - finaliza o arrasto
  element.addEventListener('dragend', () => {
      
  element.classList.remove('dragging');

  });

  element.addEventListener("dblclick", (event) => { 
    const galeriaElements = document.getElementById('galeria');  
    const favoritosElements = document.getElementById('favoritos');

    var contem = false;

    favoritosElements.childNodes.forEach(element => {
      if (contem) {
        return;
      }
      contem = (element === event.target);
    })
    if (contem) {
      favoritosElements.removeChild(event.target);
      galeriaElements.appendChild(event.target);
    }

    updateFotos();

    });

    
}

draggable.forEach(element => {
    eventListeners(element);
})

dropzone.forEach (zone => {

    zone.addEventListener('dragenter', (event) => {
        event.preventDefault();
        zone.classList.add('over');
    });
    
    // Evento dragover - elemento está sobre a área de drop
    zone.addEventListener('dragover', (event) => { 
      event.preventDefault(); 
      
      event.dataTransfer.dropEffect = 'move';
      const targetItem = event.target;

      if (targetItem !== draggingElement ) {

        if (targetItem.classList.contains('draggable')) {

          const boundingRect = targetItem.getBoundingClientRect();
          const offset = boundingRect.y + (boundingRect.height / 2);
          
          if (event.clientY - offset > 0) {
            targetItem.style.borderBottom = 'solid 2px #000';
            targetItem.style.borderTop = '';
          } else {
            targetItem.style.borderTop = 'solid 2px #000';
            targetItem.style.borderBottom = '';
          }

        } else if ( targetItem.classList.contains('dropzone') || targetItem.id != '' ) {
          draggable.forEach(element => {

          element.style.borderTop = '';
          element.style.borderBottom = '';
        
          });

        }
      }
      
    });
    
    // Evento dragleave - elemento deixa a área de drop
    zone.addEventListener('dragleave', () => { zone.classList.remove('over'); });
    
    // Evento drop - elemento é solto na área de drop
    zone.addEventListener('drop', (event) => {

      const targetItem = event.target;
      event.preventDefault();
      zone.classList.remove('over'); 

      if (targetItem !== draggingElement) {
        
        if (targetItem.classList.contains('draggable')) {
          //COLOCAR PRA ADICIONAR NOS LADOS TAMBÉM
          if (event.clientY > targetItem.getBoundingClientRect().top + (targetItem.offsetHeight / 2)) {
            targetItem.parentNode.insertBefore(draggingElement, targetItem.nextSibling);
          } else {
            targetItem.parentNode.insertBefore(draggingElement, targetItem);
          }

        } else if ( targetItem.classList.contains('dropzone') || targetItem.id != '' ) {
          
          if ( targetItem.classList.contains('bg-red-200') || targetItem.id === 'galeria' ) {
            zone = document.getElementById('galeria');
          } 
          
          if ( targetItem.classList.contains('bg-blue-200') || targetItem.id === 'favoritos' ) {
            zone = document.getElementById('favoritos');
          }

          zone.appendChild( draggingElement );

        }
      }
      
      targetItem.style.borderTop = '';
      targetItem.style.borderBottom = '';
      updateFotos();

    });
    

});

function updateFotos() {

    const galeriaElements = document.getElementById('galeria').querySelectorAll( 'div' );
    const favoritosElements = document.getElementById('favoritos').querySelectorAll( 'div' );

    galeriaElements.forEach(element => {
      element.style.borderTop = '';
      element.style.borderBottom = '';
        element.classList.remove( 'border-blue-600' );
        element.classList.remove( 'border-[3px]' );
    })

    favoritosElements.forEach(element => {
      element.style.borderTop = '';
      element.style.borderBottom = '';
        element.classList.add( 'border-blue-600' );
        element.classList.add( 'border-[3px]' );
    })

    document.getElementById('contagem').innerHTML = favoritosElements.length + ( favoritosElements.length > 1 ? ' favoritos' : ' favorito' );
    contadorFavoritos = favoritosElements.length;
    localStorageContador();

}