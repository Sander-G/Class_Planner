/*  run the fetch to add admin creds to user account from netlify admin serverless function*/

fetch('https://ly-firebase-cfg.netlify.app/.netlify/functions/admin', {
    method: 'POST',
})
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));