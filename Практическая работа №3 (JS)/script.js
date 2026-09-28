const box = [
  { width: 50, height: 40 },
  { width: 150, height: 80 },
  { width: 300, height: 50 },
  { width: 100, height: 100 },
  { width: 250, height: 30 }
];

const rootElement = document.createElement('div');
rootElement.id = 'root-container'; 

for (let i = 0; i < box.length; i++) {
  const box = document.createElement('div');

  box.classList.add('dynamic-box');
  
  box.style.width = box[i].width + 'px';
  box.style.height = box[i].height + 'px';

  rootElement.appendChild(box);
}

document.body.appendChild(rootElement);