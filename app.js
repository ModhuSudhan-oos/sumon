import { db } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Typed.js
    const typed = new Typed('#typed-text', {
        strings: ['AI Tools', 'ML Platforms', 'Data Science', 'Automation', 'Generative AI'],
        typeSpeed: 60,
        backSpeed: 30,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });

    // Initialize Lottie animation
    const animationContainer = document.getElementById('lottie-animation');
    lottie.loadAnimation({
        container: animationContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets6.lottiefiles.com/packages/lf20_gn0tojcq.json'
    });

    // Create particle effect
    createParticles();

    // Set up event listeners
    document.getElementById('searchInput').addEventListener('input', filterTools);
    document.getElementById('categoryFilter').addEventListener('change', filterTools);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Subscription buttons
    document.getElementById('subscribeBtn').addEventListener('click', openModal);
    document.getElementById('heroSubscribe').addEventListener('click', openModal);
    document.getElementById('footerSubscribe').addEventListener('click', subscribe);
    
    // Set initial theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    }

    // Load data from Firebase
    loadCategories();
    loadTools();
});

function createParticles() {
    const container = document.getElementById('particles');
    const count = 30;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 10;
        const animationDelay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;
        
        container.appendChild(particle);
    }
}

async function loadCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    categoriesGrid.innerHTML = '';
    
    try {
        const querySnapshot = await db.collection('categories').get();
        let index = 0;
        
        querySnapshot.forEach((doc) => {
            const category = doc.data();
            const categoryCard = document.createElement('div');
            categoryCard.className = `category-card fade-in delay-${index % 4}`;
            categoryCard.innerHTML = `
                <div class="category-icon"><i class="${category.icon}"></i></div>
                <h3 class="category-name">${category.name}</h3>
                <div class="category-count">${category.count}+ Tools</div>
            `;
            categoriesGrid.appendChild(categoryCard);
            index++;
        });
    } catch (error) {
        console.error("Error loading categories: ", error);
        categoriesGrid.innerHTML = '<p class="error">Failed to load categories. Please try again later.</p>';
    }
}

async function loadTools() {
    const toolGrid = document.getElementById('toolGrid');
    toolGrid.innerHTML = '<div class="loader"></div>';
    
    try {
        const querySnapshot = await db.collection('tools').get();
        toolGrid.innerHTML = '';
        
        querySnapshot.forEach((doc, index) => {
            const tool = doc.data();
            const toolCard = document.createElement('a');
            toolCard.href = tool.link;
            toolCard.target = "_blank";
            toolCard.rel = "noopener noreferrer";
            toolCard.className = `tool-card fade-in delay-${index % 3}`;
            toolCard.innerHTML = `
                <div class="tool-icon">
                    <img src="${tool.icon}" alt="${tool.name}">
                    <div class="tool-badge">AI</div>
                </div>
                <div class="tool-info">
                    <h3>${tool.name}</h3>
                    <p class="tool-category">${tool.category}</p>
                    <p class="tool-description">${tool.description}</p>
                    <div class="tool-meta">
                        <span class="tool-rating">${'★'.repeat(tool.rating)}${'☆'.repeat(5 - tool.rating)}</span>
                        <span class="tool-reviews">${tool.reviews} reviews</span>
                    </div>
                </div>
                <div class="tool-link">
                    <span>Explore</span>
                    <i class="fas fa-arrow-right"></i>
                </div>
            `;
            toolGrid.appendChild(toolCard);
        });
        
        // Populate category filter
        const categoryFilter = document.getElementById('categoryFilter');
        const categories = [...new Set(Array.from(querySnapshot.docs).map(doc => doc.data().category))];
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading tools: ", error);
        toolGrid.innerHTML = '<p class="error">Failed to load tools. Please try again later.</p>';
    }
}

function filterTools() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('.tool-description').textContent.toLowerCase();
        const toolCategory = card.querySelector('.tool-category').textContent;
        
        const matchesSearch = name.includes(searchTerm) || desc.includes(searchTerm);
        const matchesCategory = category === 'all' || toolCategory === category;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

function openModal() {
    alert('Subscribe to our newsletter for the latest AI tools and updates!');
}

function subscribe() {
    const email = document.getElementById('subscribeEmail').value;
    if (email && validateEmail(email)) {
        alert(`Thank you for subscribing with ${email}! You'll receive our updates soon.`);
        document.getElementById('subscribeEmail').value = '';
    } else {
        alert('Please enter a valid email address');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
          }
