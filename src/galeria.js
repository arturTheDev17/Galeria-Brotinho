const draggable = document.querySelectorAll('.draggable');
const dropzone = document.querySelectorAll('.dropzone');

var draggingElement = null;

// window.onload = () => {
//   var contador = Number(localStorage.getItem('contador'));
//   for (let i = 0; i < contador; i++) {
//       adicionar();
//   }
// } tá dando ruim


updateFotos();


function localStorageContador() {
  localStorage.contador = contador;
}

function adicionar() {

  const galeriaElements = document.getElementById('galeria');

  const div = document.createElement('div');
  div.className = 'w-full h-64 cursor-move draggable font-bold text-xl text-center text-white rounded-md bg-red-500 bg-center bg-cover';
  div.draggable = true;
  
  div.style.backgroundImage = `url( ./images/img${Math.floor(Math.random() * 10) + 1}.jpg )`;

  galeriaElements.appendChild(div);

  eventListeners(div);

  updateFotos();

  contador++
  localStorageContador();
}

function remover(){
  const galeriaElements = document.getElementById('galeria');
  galeriaElements.removeChild(galeriaElements.lastChild);

  contador = ( contador - 1 < 0 ) ? 0 : contador - 1;
  localStorageContador();

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

        } else if ( targetItem.classList.contains('dropzone') ) {
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
          
          if (event.clientY > targetItem.getBoundingClientRect().top + (targetItem.offsetHeight / 2)) {
            targetItem.parentNode.insertBefore(draggingElement, targetItem.nextSibling);
          } else {
            targetItem.parentNode.insertBefore(draggingElement, targetItem);
          }

        } else if ( targetItem.classList.contains('dropzone') ) {

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
}