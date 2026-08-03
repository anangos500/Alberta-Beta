const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('@media print')) {
  css += `\n\n@media print {
  body * {
    visibility: hidden;
  }
  #pdf-content, #pdf-content * {
    visibility: visible;
  }
  #pdf-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
  }
}`;
  fs.writeFileSync('src/index.css', css);
}
