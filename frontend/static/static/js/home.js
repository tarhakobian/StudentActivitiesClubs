const searchInput = document.getElementById('search-input');
const clubItems = document.querySelectorAll('.club-item');

// searchInput.addEventListener('input', function() {
//     const searchQuery = searchInput.value.toLowerCase();
//     clubItems.forEach(item => {
//         const clubName = item.querySelector('p').textContent.toLowerCase();
//         if (clubName.includes(searchQuery)) {
//             item.style.display = 'block';
//         } else {
//             item.style.display = 'none';
//         }
//     });
// });


function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}