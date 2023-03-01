const update = document.querySelector('#update-button');
const deleteButton = document.querySelector('#delete-button');
const messageDiv = document.querySelector('#message')

update.addEventListener('click', (_) => {
  // fetch(endpoint, options)
  fetch('/quotes', {
    method: 'put',
    // Telling the server were sending JSON data
    headers: { 'Content-Type': 'application/json' },
    // Convert data to JSON
    body: JSON.stringify({
      name: 'Darth Vader',
      quote: 'I find your lack of faith disturbing',
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((response) => {
      window.location.reload(true);
    });
});

deleteButton.addEventListener('click', (_) => {
  fetch('/quotes', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    // Convert data to JSON
    body: JSON.stringify({
      name: 'Darth Vader',
    }),
  })
  .then((res) => {
    if (res === 'No quote to delete') {
        messageDiv.textContent = 'No DV quote to delete'
    } else {
        window.location.reload(true);
    }
  })
  .catch(err => console.error(err))
});
