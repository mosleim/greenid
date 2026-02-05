const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'next.txt');

let message = `
review apa yg telah kamu lakukan. pastikan tidak ada error dan fatal warning satupun. buat dokumentasi, testing, update todolist dan commit(jangan dipush) jika diperlukan. lalu lakukan apa yg seharusnya dan yg bisa kamu lakukan.
`;

if (fs.existsSync(filePath)) {
  const fileContent = fs.readFileSync(filePath, 'utf8').trim();

  if (fileContent) {
    message = fileContent;
  }
}

console.log(message);
