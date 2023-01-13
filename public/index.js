const formElement = document.querySelector('form');
const errorElement = document.querySelector('#error-msg');
const listElement = document.querySelector('#file-listing');
const filenameElement = document.querySelector('input[type="file"]');

async function getFiles() {
  try {
    let files = await fetch('/api/files');
    if (files.status === 204) {
      const textElement = document.createElement('p');
      textElement.textContent = 'Directory is empty.';
      listElement.appendChild(textElement);
    } else {
      files = await files.json();
      files.forEach((file) => {
        let liElement = document.createElement('li');
        liElement.textContent = file;
        listElement.appendChild(liElement);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// getFiles();

formElement.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (event.target.filename.files[0].type.split('/')[0] === 'image') {
    const formData = new FormData();
    formData.append('width', event.target.width.value);
    formData.append('height', event.target.height.value);
    formData.append('ext', event.target.ext.value);
    formData.append('img', filenameElement.files[0]);

    Object.entries(formData).forEach((k, v) => console.log(k, v));

    let res = await fetch('/api/upload', {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      body: formData
    });

    // if (res.status === 200) {
    //   window.location.href =
    //     `/api/images/?filename=${event.target.filename.value}` +
    //     `&width=${event.target.width.value}` +
    //     `&height=${event.target.height.value}` +
    //     `&ext=${event.target.ext.value}`;
    // } else {
    //   errorElement.textContent = `Error: ${res.statusText}`;
    // }
  } else {
    errorElement.textContent = `Error: accepts only image type of`;
  }
});
