/**
 * CSXL OpenAI Study Buddy Interactive Simulation
 * Simulates the FastAPI + Red Hat Pods + OpenAI academic assistant workflow
 */

class AIStudyBuddySimulator {
  constructor() {
    this.currentCourse = 'COMP 423';
    this.knowledgeBase = {
      'COMP 423': {
        name: 'Foundations of Software Engineering',
        topics: ['Microservices', 'REST APIs', 'FastAPI & Pydantic', 'Git Workflow', 'CI/CD Pipelines'],
        sampleQueries: [
          'How does FastAPI handle dependency injection for auth tokens?',
          'What is the difference between unit tests and integration tests with PyTest?',
          'Explain why we use Red Hat Pod containers for multi-tenant microservices.'
        ],
        responses: {
          'fastapi': 'In FastAPI, dependency injection is handled via `Depends()`. When a route declares `token: str = Depends(oauth2_scheme)`, FastAPI resolves the dependency before executing your endpoint handler. This keeps authentication logic modular and testable across your CSXL microservices.',
          'test': 'Unit tests isolate individual functions with mock dependencies, while integration tests verify the end-to-end communication between FastAPI routes, SQL models, and external APIs (like OpenAI). PyTest fixtures make managing database sessions seamless.',
          'pod': 'Red Hat Pods group related containers that share storage and network namespaces. In CSXL, this allows the Study Buddy AI service and the database cache to communicate over `localhost` with minimal latency and high tenant isolation.'
        }
      },
      'COMP 550': {
        name: 'Algorithms and Analysis',
        topics: ['Dynamic Programming', 'Dijkstra & A*', 'Amortized Analysis', 'NP-Completeness'],
        sampleQueries: [
          'Explain how the Master Theorem applies to merge sort divide-and-conquer.',
          'Why is Dijkstra algorithm greedy while Bellman-Ford uses dynamic programming?'
        ],
        responses: {
          'master': 'For Merge Sort, the recurrence is T(n) = 2T(n/2) + O(n). Here a=2, b=2, and f(n)=O(n). Since log_b(a) = log_2(2) = 1, we are in Case 2 of the Master Theorem: T(n) = Θ(n log n).',
          'dijkstra': 'Dijkstra greedily chooses the unvisited node with minimum tentative distance because non-negative edge weights ensure this distance is final. Bellman-Ford relaxes all edges |V|-1 times to handle negative weights.'
        }
      },
      'MATH 381': {
        name: 'Discrete Mathematics',
        topics: ['Graph Theory', 'Modular Arithmetic', 'Combinatorics', 'Proof by Induction'],
        sampleQueries: [
          'How do Euler’s Totient Theorem and modular inverses relate to RSA encryption?',
          'Walk me through the inductive step for proving trees with n vertices have n-1 edges.'
        ],
        responses: {
          'rsa': 'Euler’s Totient Theorem states that if gcd(a, n) = 1, then a^(φ(n)) ≡ 1 (mod n). In RSA, we choose e and d such that e·d ≡ 1 (mod φ(n)), meaning (m^e)^d ≡ m (mod n), which allows asymmetric encryption and decryption.',
          'tree': 'Inductive step: Assume true for k vertices. For a tree T with k+1 vertices, remove a leaf v (degree 1) and its incident edge. The remaining graph T\' is a tree with k vertices, having k-1 edges by inductive hypothesis. Adding back the leaf and edge gives (k-1) + 1 = k edges.'
        }
      }
    };

    this.initDOM();
  }

  initDOM() {
    this.chatContainer = document.getElementById('ai-chat-box');
    this.inputField = document.getElementById('ai-query-input');
    this.sendBtn = document.getElementById('ai-send-btn');
    this.coursePills = document.querySelectorAll('.course-pill');

    if (this.coursePills) {
      this.coursePills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          this.coursePills.forEach(p => p.classList.remove('active'));
          e.target.classList.add('active');
          this.currentCourse = e.target.getAttribute('data-course');
          this.handleCourseSwitch();
        });
      });
    }

    if (this.sendBtn && this.inputField) {
      this.sendBtn.addEventListener('click', () => this.handleSendQuery());
      this.inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleSendQuery();
      });
    }
  }

  handleCourseSwitch() {
    const courseData = this.knowledgeBase[this.currentCourse];
    if (!courseData) return;
    
    // Add system message
    this.addMessage('ai', `Switched active context to **${this.currentCourse}: ${courseData.name}**. Study guides and topic vectors indexed! Ask a question or try one of the course topics.`);
    
    // Suggest a random sample query in input placeholder
    const sample = courseData.sampleQueries[Math.floor(Math.random() * courseData.sampleQueries.length)];
    if (this.inputField) {
      this.inputField.placeholder = `e.g., "${sample}"`;
    }
  }

  addMessage(role, text) {
    if (!this.chatContainer) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role === 'student' ? 'student' : 'ai'}`;
    bubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code>$1</code>');
    this.chatContainer.appendChild(bubble);
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }

  handleSendQuery() {
    const query = this.inputField ? this.inputField.value.trim() : '';
    if (!query) return;

    this.addMessage('student', query);
    if (this.inputField) this.inputField.value = '';

    // Simulate backend response
    setTimeout(() => {
      let response = "That's a great question on this topic. Based on the instructor's uploaded study guide for " + this.currentCourse + ", let's break this down step-by-step: ";
      
      const qLower = query.toLowerCase();
      const courseData = this.knowledgeBase[this.currentCourse];

      if (courseData) {
        for (const [key, val] of Object.entries(courseData.responses)) {
          if (qLower.includes(key) || qLower.includes(key.substring(0, 4))) {
            response = val;
            break;
          }
        }
      }

      this.addMessage('ai', response);
    }, 600);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.aiStudySim = new AIStudyBuddySimulator();
});
