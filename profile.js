window.onload = function () {
  // Fetch the user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData'));

  // Redirect to signup page if no user data found
  if (!userData) {
    window.location.href = "signup.html";
    return;
  }

  // Display user information
  const userProfileDiv = document.getElementById("userProfile");
  userProfileDiv.innerHTML = `
    <p><strong>Username:</strong> ${userData.username}</p>
    <p><strong>Email:</strong> ${userData.email}</p>
    <p><strong>Age:</strong> ${userData.age || 'Not Set'}</p>
    <p><strong>Location:</strong> ${userData.location || 'Not Set'}</p>
    <p><strong>Registration Date:</strong> ${userData.registrationDate}</p>
    <p><strong>Quiz Score:</strong> ${userData.score !== undefined ? userData.score : 'Not Taken'}</p>
  `;

  // Attach event listeners
  const showFormBtn = document.getElementById('showUpdateFormBtn');
  const updateBtn = document.getElementById('updateProfileBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (showFormBtn) showFormBtn.addEventListener('click', showUpdateForm);
  if (updateBtn) updateBtn.addEventListener('click', updateProfile);
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
};

// Show the update profile form
function showUpdateForm() {
  const updateForm = document.getElementById('updateForm');
  if (updateForm) updateForm.style.display = 'block';
}

// Handle the update profile form submission
function updateProfile(event) {
  event.preventDefault();

  const updatedName = document.getElementById('updateName').value;
  const updatedAge = document.getElementById('updateAge').value;
  const updatedLocation = document.getElementById('updateLocation').value;

  let userData = JSON.parse(localStorage.getItem('userData'));

  if (!userData) return;

  userData.username = updatedName || userData.username;
  userData.age = updatedAge || userData.age;
  userData.location = updatedLocation || userData.location;

  localStorage.setItem('userData', JSON.stringify(userData));

  window.location.reload();
}

// Logout function
function logout() {
  localStorage.removeItem('userData');
  window.location.href = "signup.html";
}
