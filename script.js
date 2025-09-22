// Project Charter Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initSmoothScrolling();
    initTableInteractions();
    initResponsiveFeatures();
    initAccessibilityFeatures();
    initAnimations();
    initPdfDisplay(); // Add PDF handling
    
    // Initialize other features
    setTimeout(initInteractiveActivity, 1000);
    addPrintSupport();
    trackPerformance();
    
    console.log('Project Charter loaded successfully');
});

// Smooth scrolling for internal navigation
function initSmoothScrolling() {
    // Add click handlers for any navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Enhanced table interactions
function initTableInteractions() {
    const tables = document.querySelectorAll('.stakeholder-table');
    
    tables.forEach(table => {
        // Add row highlighting
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#e8f5e8';
                this.style.transform = 'scale(1.01)';
                this.style.transition = 'all 0.2s ease';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
                this.style.transform = '';
            });
        });

        // Add sorting functionality for budget table
        if (table.querySelector('th') && table.querySelector('th').textContent.includes('Subtotal')) {
            addTableSorting(table);
        }
    });
}

// Add sorting functionality to tables
function addTableSorting(table) {
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
        if (header.textContent.includes('Subtotal') || header.textContent.includes('Hours')) {
            header.style.cursor = 'pointer';
            header.title = 'Click to sort';
            
            header.addEventListener('click', function() {
                sortTable(table, index);
            });
        }
    });
}

// Simple table sorting function
function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Skip header rows and total rows
    const dataRows = rows.filter(row => 
        !row.style.backgroundColor && 
        !row.innerHTML.includes('TOTAL') &&
        !row.innerHTML.includes('SUBTOTAL')
    );
    
    dataRows.sort((a, b) => {
        const aText = a.cells[columnIndex]?.textContent.trim() || '';
        const bText = b.cells[columnIndex]?.textContent.trim() || '';
        
        // Try to parse as numbers
        const aNum = parseFloat(aText.replace(/[$,]/g, ''));
        const bNum = parseFloat(bText.replace(/[$,]/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
        }
        
        return aText.localeCompare(bText);
    });
    
    // Re-append sorted rows
    dataRows.forEach(row => tbody.appendChild(row));
}

// Responsive features and mobile optimization
function initResponsiveFeatures() {
    // Handle window resize
    window.addEventListener('resize', function() {
        adjustTableLayout();
        adjustStakeholderMap();
    });
    
    // Initial layout adjustment
    adjustTableLayout();
    adjustStakeholderMap();
}

// Adjust table layout for mobile
function adjustTableLayout() {
    const tables = document.querySelectorAll('.stakeholder-table');
    const isMobile = window.innerWidth < 768;
    
    tables.forEach(table => {
        if (isMobile) {
            table.style.fontSize = '12px';
            const cells = table.querySelectorAll('td, th');
            cells.forEach(cell => {
                cell.style.padding = '6px';
            });
        } else {
            table.style.fontSize = '';
            const cells = table.querySelectorAll('td, th');
            cells.forEach(cell => {
                cell.style.padding = '';
            });
        }
    });
}

// Adjust stakeholder map for different screen sizes
function adjustStakeholderMap() {
    const map = document.querySelector('.stakeholder-map-container');
    if (!map) return;
    
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        map.style.fontSize = '11px';
        const quadrants = map.querySelectorAll('.map-quadrant');
        quadrants.forEach(quad => {
            quad.style.padding = '8px';
        });
    } else {
        map.style.fontSize = '';
        const quadrants = map.querySelectorAll('.map-quadrant');
        quadrants.forEach(quad => {
            quad.style.padding = '';
        });
    }
}

// Accessibility features
function initAccessibilityFeatures() {
    // Add keyboard navigation
    addKeyboardNavigation();
    
    // Add aria labels
    addAriaLabels();
    
    // Add focus management
    addFocusManagement();
}

// Keyboard navigation for interactive elements
function addKeyboardNavigation() {
    const interactiveElements = document.querySelectorAll('.scope-card, .section, .stakeholder-table tr');
    
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Add appropriate aria labels
function addAriaLabels() {
    const tables = document.querySelectorAll('.stakeholder-table');
    tables.forEach((table, index) => {
        table.setAttribute('aria-label', `Project data table ${index + 1}`);
    });
    
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const title = section.querySelector('.section-title');
        if (title) {
            const titleText = title.textContent.trim();
            section.setAttribute('aria-labelledby', titleText);
        }
    });
}

// Focus management for better accessibility
function addFocusManagement() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        section.addEventListener('click', function() {
            this.focus();
        });
    });
}

// Animation and visual enhancements
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Add CSS for animations
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .section.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .scope-card {
            transition: all 0.3s ease;
        }
        
        .scope-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
        
        .stakeholder-table tr {
            transition: background-color 0.2s ease, transform 0.2s ease;
        }
        
        .map-stakeholder-box {
            transition: transform 0.2s ease;
        }
        
        .map-stakeholder-box:hover {
            transform: scale(1.02);
        }
    `;
    document.head.appendChild(animationStyle);
}

// Interactive quiz/activity functionality
function initInteractiveActivity() {
    const activitySection = document.createElement('div');
    activitySection.className = 'section';
    activitySection.innerHTML = `
        <div class="section-header">
            <h2 class="section-title">🎮 Interactive Knowledge Check</h2>
        </div>
        <div class="section-content">
            <div id="quiz-container">
                <div class="quiz-question">
                    <h4>Test your project management knowledge:</h4>
                    <p id="question-text">What methodology was chosen for this project?</p>
                    <div class="quiz-options">
                        <button class="quiz-btn" data-answer="correct">Predictive</button>
                        <button class="quiz-btn" data-answer="incorrect">Agile</button>
                        <button class="quiz-btn" data-answer="incorrect">Hybrid</button>
                        <button class="quiz-btn" data-answer="incorrect">Adaptive</button>
                    </div>
                    <div id="quiz-feedback" class="quiz-feedback"></div>
                </div>
            </div>
        </div>
    `;
    
    // Add quiz styles
    const quizStyle = document.createElement('style');
    quizStyle.textContent = `
        .quiz-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin: 15px 0;
        }
        
        .quiz-btn {
            background: #f8f9fa;
            border: 2px solid #dee2e6;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .quiz-btn:hover {
            background: #e9ecef;
            border-color: #2d5d3b;
        }
        
        .quiz-btn.correct {
            background: #d4edda;
            border-color: #28a745;
            color: #155724;
        }
        
        .quiz-btn.incorrect {
            background: #f8d7da;
            border-color: #dc3545;
            color: #721c24;
        }
        
        .quiz-feedback {
            margin-top: 15px;
            padding: 10px;
            border-radius: 5px;
            font-weight: 500;
        }
        
        .quiz-feedback.show {
            background: #e8f5e8;
            border: 1px solid #28a745;
            color: #155724;
        }
    `;
    document.head.appendChild(quizStyle);
    
    // Add to the end of content
    const content = document.querySelector('.content');
    const lastSection = content.querySelector('.section:last-child');
    content.insertBefore(activitySection, lastSection);
    
    // Add quiz functionality
    const quizButtons = activitySection.querySelectorAll('.quiz-btn');
    quizButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const isCorrect = this.dataset.answer === 'correct';
            const feedback = activitySection.querySelector('#quiz-feedback');
            
            // Reset all buttons
            quizButtons.forEach(b => {
                b.classList.remove('correct', 'incorrect');
            });
            
            // Show results
            if (isCorrect) {
                this.classList.add('correct');
                feedback.textContent = 'Correct! Predictive methodology was chosen because requirements are well-defined and unlikely to change.';
                feedback.className = 'quiz-feedback show';
            } else {
                this.classList.add('incorrect');
                quizButtons.forEach(b => {
                    if (b.dataset.answer === 'correct') {
                        b.classList.add('correct');
                    }
                });
                feedback.textContent = 'Not quite right. The correct answer is Predictive methodology.';
                feedback.className = 'quiz-feedback show';
            }
        });
    });
}

// PDF Display Functionality
function initPdfDisplay() {
    const pdfImages = document.querySelectorAll('.methodology-image[src$=".pdf"]');
    
    pdfImages.forEach(img => {
        // Create a clickable container
        const container = document.createElement('div');
        container.className = 'pdf-placeholder';
        container.innerHTML = `
            <div class="pdf-icon">📄</div>
            <p><strong>Click to view diagram</strong></p>
            <p>${img.alt}</p>
        `;
        
        container.addEventListener('click', function() {
            window.open(img.src, '_blank');
        });
        
        // Replace the img with the container
        img.parentNode.replaceChild(container, img);
    });
}

// Initialize the interactive activity
setTimeout(initInteractiveActivity, 1000);

// Print functionality
function addPrintSupport() {
    const printBtn = document.createElement('button');
    printBtn.textContent = 'Print Charter';
    printBtn.className = 'print-btn';
    printBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2d5d3b;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
        font-size: 14px;
    `;
    
    printBtn.addEventListener('click', () => {
        window.print();
    });
    
    document.body.appendChild(printBtn);
}

// Initialize print support
addPrintSupport();

// Performance monitoring
function trackPerformance() {
    window.addEventListener('load', function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        // Log if load time is concerning
        if (loadTime > 3000) {
            console.warn('Page load time is slower than optimal');
        }
    });
}

trackPerformance();