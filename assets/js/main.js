const PRODUCTS={
  josy:{"id": "josy", "name": "Josy", "category": "Vestidos", "descriptor": "Vestido largo con escote cuadrado, mangas cortas y abertura en la falda. Un diseño con cintura definida y lazo posterior.", "price": 90, "priceLabel": "S/ 90.00", "image": "assets/images/productos/vestidos/josy/frente.jpeg", "images": [{"label": "Frontal", "src": "assets/images/productos/vestidos/josy/frente.jpeg", "alt": "Vestido Josy verde petróleo visto de frente"}, {"label": "Espalda", "src": "assets/images/productos/vestidos/josy/espalda.jpeg", "alt": "Vestido Josy verde petróleo visto de espalda, con lazo en la cintura"}], "colors": [{"name": "Beis", "hex": "#d8c7ad"}, {"name": "Verde petróleo", "hex": "#086164"}, {"name": "Verde oliva", "hex": "#657338"}], "sizes": [{"name": "Estándar (S–M)", "available": true}], "details": "Vestido largo con mangas cortas, escote cuadrado, abertura en la falda y lazo posterior. Talla estándar (S–M). Colores: beis, verde petróleo y verde oliva. Las fotografías muestran el verde petróleo. Consulta las medidas para confirmar el ajuste."},
  yismi:{id:'yismi',name:'Yismi',category:'Enterizos',descriptor:'Enterizo largo de líneas fluidas, pensado para acompañarte con elegancia y ligereza.',price:120,priceLabel:'S/ 120.00',image:'assets/images/productos/enterizos/yismi/frente.jpeg',images:[{label:'Frontal',src:'assets/images/productos/enterizos/yismi/frente.jpeg',alt:'Enterizo Yismi visto de frente'},{label:'Espalda',src:'assets/images/productos/enterizos/yismi/espalda.png',alt:'Enterizo Yismi visto de espalda'},{label:'Frontal con cinturón',badge:'Con cinturón',src:'assets/images/productos/enterizos/yismi/frente-con-cinturon.png',alt:'Enterizo Yismi con cinturón visto de frente'},{label:'Espalda con cinturón',badge:'Con cinturón',src:'assets/images/productos/enterizos/yismi/espalda-con-cinturon.png',alt:'Enterizo Yismi con cinturón visto de espalda'}],colors:[{name:'Nude',hex:'#cba98f'},{name:'Terracota',hex:'#a96349'},{name:'Cacao',hex:'#49352c'}],sizes:[{name:'M',available:true},{name:'L',available:true}],details:'Tela: Excuba. Enterizo largo de caída elegante. Incluye cinturón para definir la silueta o llevarlo con un estilo más fluido. Tallas M y L. Consulta el fit y la disponibilidad del color elegido antes de comprar.'},
  lorena:{id:'lorena',name:'Lorena',category:'Enterizos',descriptor:'Enterizo largo de silueta amplia y elegante, con escote en V y un delicado detalle posterior.',price:120,priceLabel:'S/ 120.00',image:'assets/images/productos/enterizos/lorena/frente.png',images:[{label:'Frontal',src:'assets/images/productos/enterizos/lorena/frente.png',alt:'Enterizo Lorena azul marino visto de frente'},{label:'Espalda',src:'assets/images/productos/enterizos/lorena/espalda.png',alt:'Enterizo Lorena azul marino visto de espalda'}],colors:[],sizes:[],details:'Tela: Excuba. Enterizo largo azul marino. Colores y tallas pendientes de confirmación.'},
  priscila:{"id": "priscila", "name": "Priscila", "category": "Enterizos", "descriptor": "Enterizo largo de hombros descubiertos y escote cruzado, con cintura definida, pantalón amplio y lazo posterior.", "price": 120, "priceLabel": "S/ 120.00", "image": "assets/images/productos/enterizos/priscila/frente-rojo.png", "images": [{"label": "Frontal", "src": "assets/images/productos/enterizos/priscila/frente-rojo.png", "alt": "Enterizo Priscila rojo visto de frente"}, {"label": "Espalda", "src": "assets/images/productos/enterizos/priscila/espalda-rojo.png", "alt": "Enterizo Priscila rojo visto de espalda con lazo posterior"}], "colors": [{"name": "Guinda", "hex": "#891438"}, {"name": "Verde lima", "hex": "#a9c976"}, {"name": "Azul noche", "hex": "#132e51"}, {"name": "Beige", "hex": "#d8c9ba"}, {"name": "Celeste", "hex": "#9fc4ec"}, {"name": "Vino", "hex": "#8f1233"}, {"name": "Amarillo bajito", "hex": "#f2df8a"}, {"name": "Verde petróleo", "hex": "#0a5961"}, {"name": "Palo rosa", "hex": "#d99ca6"}, {"name": "Rojo", "hex": "#d90721"}, {"name": "Blanco", "hex": "#f1f1f1"}, {"name": "Negro", "hex": "#191919"}, {"name": "Fucsia", "hex": "#ed168c"}], "sizes": [{"name": "Estándar (referencial M/L)", "available": true}], "details": "Enterizo largo con escote cruzado, hombros descubiertos, tirantes, pantalón amplio y lazo posterior. Talla estándar, referencial M/L. Consulta disponibilidad y asesoría de talla. Colores: guinda, verde lima, azul noche, beige, celeste, vino, amarillo bajito, verde petróleo, palo rosa, rojo, blanco, negro, fucsia. Las fotografías muestran el color rojo."}
};
function item(p){return{item_id:p.id,item_name:p.name,item_brand:'Narantha',item_category:p.category,price:p.price||0,currency:'PEN',quantity:1}}
function track(event,data={}){window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,...data})}
function ecommerce(event,p,list){track(event,{ecommerce:{currency:'PEN',value:p.price||0,...(list?{item_list_id:list,item_list_name:'Los favoritos de Narantha'}:{}),items:[item(p)]}})}

if(document.body.dataset.page==='home'){
  const cards=[...document.querySelectorAll('[data-item-id]')];
  track('view_item_list',{ecommerce:{item_list_id:'favorites',item_list_name:'Los favoritos de Narantha',items:cards.map((card,index)=>({...item(PRODUCTS[card.dataset.itemId]),index,item_list_id:'favorites',item_list_name:'Los favoritos de Narantha'}))}});
  cards.forEach(card=>card.querySelectorAll('a[href*="producto.html"]').forEach(link=>link.addEventListener('click',()=>ecommerce('select_item',PRODUCTS[card.dataset.itemId],'favorites'),{once:true})));
}

if(document.body.dataset.page==='product'){
  const key=document.body.dataset.productId||new URLSearchParams(location.search).get('producto');
  const p=Object.hasOwn(PRODUCTS,key)?PRODUCTS[key]:null;
  if(!p){document.title='Producto no encontrado — Narantha';document.getElementById('contenido').innerHTML='<section class="purchase-panel"><h1>Producto no encontrado</h1><p>Revisa el enlace o elige una prenda de nuestra colección.</p><a class="button button-dark" href="index.html#favoritos">Ver la colección</a></section>';const robots=document.createElement('meta');robots.name='robots';robots.content='noindex';document.head.append(robots)}else{
  document.title=`${p.name} — Narantha`;
  document.getElementById('productName').textContent=p.name;
  document.getElementById('productPrice').textContent=p.priceLabel;
  document.getElementById('productDescription').textContent=p.descriptor;
  document.getElementById('productDetails').textContent=p.details;
  document.getElementById('mobileProduct').textContent=p.name;
  document.getElementById('mobilePrice').textContent=p.priceLabel;
  const gallery=document.getElementById('galleryMain');
  const galleryImages=p.images||(p.image?[{label:'Frente',src:p.image,alt:p.name}]:[]);
  if(galleryImages.length){gallery.classList.add('has-product-images');gallery.innerHTML=`<div class="gallery-viewport" tabindex="0" aria-label="Vista ampliada del producto"><img src="${galleryImages[0].src}" alt="${galleryImages[0].alt}"></div><button class="gallery-nav gallery-prev" type="button" aria-label="Ver imagen anterior">←</button><button class="gallery-nav gallery-next" type="button" aria-label="Ver imagen siguiente">→</button>`}
  else{gallery.classList.add('photo-pending',key==='priscila'?'tone-priscila':'tone-lorena');gallery.innerHTML=`<span class="pending-copy"><small>Imagen en preparación</small>${p.name}</span>`}
  const galleryLabels=galleryImages.length?galleryImages.map(image=>image.label):['Frente','Espalda','Detalle de tela','En modelo'];
  document.getElementById('gallerySlots').innerHTML=galleryLabels.map((label,index)=>{
    const image=galleryImages.find(entry=>entry.label===label);
    return image
      ? `<button type="button" class="gallery-slot gallery-thumb" data-gallery-src="${image.src}" data-gallery-alt="${image.alt}" aria-label="Ver ${label.toLowerCase()} de ${p.name}" aria-current="${index===0}"><img src="${image.src}" alt="">${image.badge?`<span>${image.badge}</span>`:''}</button>`
      : `<div class="gallery-slot">${label}<br>próximamente</div>`;
  }).join('');
  const thumbnails=[...document.querySelectorAll('.gallery-thumb')];
  let activeImage=0;
  function showImage(index){
    activeImage=(index+galleryImages.length)%galleryImages.length;
    const mainImage=gallery.querySelector('.gallery-viewport img');
    const thumb=thumbnails[activeImage];
    if(!mainImage)return;
    mainImage.src=thumb.dataset.gallerySrc;
    mainImage.alt=thumb.dataset.galleryAlt;
    gallery.querySelector('.gallery-viewport').scrollTop=0;
    gallery.querySelector('.gallery-viewport').classList.remove('is-zooming');
    thumbnails.forEach(item=>item.setAttribute('aria-current','false'));
    thumb.setAttribute('aria-current','true');
  }
  thumbnails.forEach((thumb,index)=>thumb.addEventListener('click',()=>showImage(index)));
  gallery.querySelector('.gallery-prev')?.addEventListener('click',()=>showImage(activeImage-1));
  gallery.querySelector('.gallery-next')?.addEventListener('click',()=>showImage(activeImage+1));
  gallery.querySelector('.gallery-viewport')?.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();showImage(activeImage-1)}
    if(event.key==='ArrowRight'){event.preventDefault();showImage(activeImage+1)}
  });
  if(galleryImages.length&&matchMedia('(hover: hover) and (pointer: fine)').matches){
    const viewport=gallery.querySelector('.gallery-viewport');
    viewport.addEventListener('pointermove',event=>{
      const mainImage=viewport.querySelector('img');
      const rect=viewport.getBoundingClientRect();
      const x=Math.max(0,Math.min(event.clientX-rect.left,mainImage.clientWidth));
      const y=Math.max(0,Math.min(event.clientY-rect.top+viewport.scrollTop,mainImage.scrollHeight));
      mainImage.style.transformOrigin=`${x/mainImage.clientWidth*100}% ${y/mainImage.scrollHeight*100}%`;
      viewport.classList.add('is-zooming');
    });
    viewport.addEventListener('pointerleave',()=>viewport.classList.remove('is-zooming'));
  }
  ecommerce('view_item',p);
  let selectedColor='',selectedSize='';
  const colorField=document.getElementById('colorField'),sizeField=document.getElementById('sizeField');
  if(!p.colors.length){colorField.innerHTML='<legend>Color</legend><p class="option-row selection-help">Colores por confirmar.</p>'}
  else document.getElementById('colorOptions').innerHTML=p.colors.map(c=>`<button type="button" class="option color-option" data-value="${c.name}" aria-pressed="false"><i style="background:${c.hex}"></i>${c.name}</button>`).join('');
  if(!p.sizes.length){sizeField.innerHTML='<legend>Talla</legend><div class="legend-line"><button class="size-guide-link" type="button" data-open-guide>Guía de tallas</button></div><p class="option-row selection-help">Tallas por confirmar.</p>'}
  else document.getElementById('sizeOptions').innerHTML=p.sizes.map(s=>`<button type="button" class="option" data-value="${s.name}" aria-pressed="false" ${s.available?'':'disabled'}>${s.name}</button>`).join('');
  const mainButton=document.getElementById('whatsappButton'),mobileButton=document.getElementById('mobileWhatsapp'),help=document.getElementById('selectionHelp');
  function sync(){
    const ready=(!p.colors.length||Boolean(selectedColor))&&(!p.sizes.length||Boolean(selectedSize));
    [mainButton,mobileButton].forEach(b=>{b.classList.toggle('is-disabled',!ready);b.setAttribute('aria-disabled',String(!ready));b.removeAttribute('target');b.href='#';b.textContent='Añadir al carrito'});
    help.textContent=ready?(!p.colors.length||!p.sizes.length?'Puedes añadirla como solicitud. Confirmaremos talla y color antes del pago.':'Tu elección está lista para añadir al carrito.'):'Elige color y talla para continuar.';
  }
  document.querySelectorAll('#colorOptions .option').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('#colorOptions .option').forEach(b=>b.setAttribute('aria-pressed','false'));btn.setAttribute('aria-pressed','true');selectedColor=btn.dataset.value;document.getElementById('selectedColor').textContent=`— ${selectedColor}`;sync()}));
  document.querySelectorAll('#sizeOptions .option').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('#sizeOptions .option').forEach(b=>b.setAttribute('aria-pressed','false'));btn.setAttribute('aria-pressed','true');selectedSize=btn.dataset.value;document.getElementById('selectedSize').textContent=`— ${selectedSize}`;sync()}));
  [mainButton,mobileButton].forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();if(btn.getAttribute('aria-disabled')==='true')return;addToCart(p.id,selectedColor,selectedSize);document.getElementById('cartDialog').showModal()}));
  const dialog=document.getElementById('sizeDialog');document.querySelectorAll('.size-guide-link,[data-open-guide]').forEach(b=>b.addEventListener('click',()=>dialog.showModal()));dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.querySelector('a').addEventListener('click',()=>dialog.close());sync();
}
}
