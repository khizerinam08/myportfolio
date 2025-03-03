// Toggle chatbot display
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbot = document.getElementById('chatbot');
chatbotToggle.addEventListener('click', () => {
  if (chatbot.style.display === 'none' || chatbot.style.display === '') {
    chatbot.style.display = 'flex';
  } else {
    chatbot.style.display = 'none';
  }
});

// Simple Chatbot logic
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotUserInput = document.getElementById('chatbot-user-input');
const chatbotSendBtn = document.getElementById('chatbot-send-btn');

function addMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message', sender);
  messageDiv.textContent = text;
  chatbotMessages.appendChild(messageDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Replace the getBotResponse function with this:
function getBotResponse(userMessage) {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      resolve(data.reply);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      
      // Fallback response when server is unreachable
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        resolve("The server appears to be offline. Make sure to run 'npm start' in your terminal to start the server.");
      } else {
        resolve("Sorry, I'm having trouble connecting right now. Please try again later.");
      }
    }
  });
}

// Update the chatbot send button event listener
chatbotSendBtn.addEventListener('click', async () => {
  const userInput = chatbotUserInput.value.trim();
  if (userInput !== '') {
    addMessage('user', userInput);
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('chat-message', 'bot', 'typing');
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    chatbotMessages.appendChild(typingIndicator);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    chatbotUserInput.value = '';
    
    try {
      const botResponse = await getBotResponse(userInput);
      
      // Remove typing indicator
      chatbotMessages.removeChild(typingIndicator);
      
      // Add bot response
      addMessage('bot', botResponse);
    } catch (error) {
      // Remove typing indicator
      chatbotMessages.removeChild(typingIndicator);
      
      // Add error message
      addMessage('bot', "Sorry, I couldn't process your request right now.");
      console.error(error);
    }
  }
});

// Update the keypress event for Enter key
chatbotUserInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    chatbotSendBtn.click();
  }
});

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false
  });

  // Initialize particles.js with correct configuration
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" }
        }
      }
    });
  }

  // Home section animations - check if elements exist first
  const homeH1 = document.querySelector('#home h1');
  const homeLead = document.querySelector('#home p.lead');
  const nav = document.querySelector('nav');

  if (homeH1 && homeLead && nav && typeof gsap !== 'undefined') {
    const homeTimeline = gsap.timeline();
    homeTimeline
      .from(nav, { y: -100, opacity: 0, duration: 1 })
      .to(homeH1, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      .to(homeLead, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.5');
  }

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Typing animation
  const typedTextElement = document.querySelector('.typed-text');
  if (typedTextElement) {
    const words = ['Web Developer', 'UI Designer', 'Problem Solver'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const erasingSpeed = 50;

    function typeEffect() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1500); // Wait before deleting
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeEffect, 500); // Wait before typing next word
      } else {
        setTimeout(
          typeEffect,
          isDeleting ? erasingSpeed : typingSpeed
        );
      }
    }

    setTimeout(typeEffect, 1000);
  }

  // Chatbot functionality
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbot = document.getElementById('chatbot');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotUserInput = document.getElementById('chatbot-user-input');
  const chatbotSendBtn = document.getElementById('chatbot-send-btn');

  if (chatbotToggle && chatbot) {
    chatbotToggle.addEventListener('click', () => {
      if (chatbot.classList.contains('show')) {
        chatbot.classList.remove('show');
        setTimeout(() => { chatbot.style.display = 'none'; }, 500);
      } else {
        chatbot.style.display = 'flex';
        setTimeout(() => { chatbot.classList.add('show'); }, 10);
      }
    });
  }

  if (chatbotMessages && chatbotUserInput && chatbotSendBtn) {
    function addMessage(sender, text) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('chat-message', sender);
      messageDiv.textContent = text;
      chatbotMessages.appendChild(messageDiv);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function getBotResponse(userMessage) {
      try {
        const response = await fetch('http://localhost:3000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userMessage }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.reply;
      } catch (error) {
        console.error('Error fetching AI response:', error);
        return "Sorry, I'm having trouble connecting right now. Please try again later.";
      }
    }

    chatbotSendBtn.addEventListener('click', async () => {
      const userInput = chatbotUserInput.value.trim();
      if (userInput !== '') {
        addMessage('user', userInput);
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('chat-message', 'bot', 'typing');
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        chatbotUserInput.value = '';
        
        try {
          const botResponse = await getBotResponse(userInput);
          
          // Remove typing indicator
          if (typingIndicator.parentNode === chatbotMessages) {
            chatbotMessages.removeChild(typingIndicator);
          }
          
          // Add bot response
          addMessage('bot', botResponse);
        } catch (error) {
          // Remove typing indicator
          if (typingIndicator.parentNode === chatbotMessages) {
            chatbotMessages.removeChild(typingIndicator);
          }
          
          // Add error message
          addMessage('bot', "Sorry, I couldn't process your request right now.");
          console.error(error);
        }
      }
    });

    chatbotUserInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        chatbotSendBtn.click();
      }
    });
  }
});
