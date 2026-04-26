import { Component, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ELECTION_QA, CHAT_CATEGORIES, ChatQA } from './chatbot-data';


interface ChatMessage {
  type: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss'
})
export class ChatbotComponent {
  @ViewChild('chatBody') chatBody!: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  activeCategory = signal<string | null>(null);
  messages = signal<ChatMessage[]>([]);
  showCategories = signal(true);
  searchQuery = signal('');
  hasNewMessage = signal(false);
  isTyping = signal(false);
  userInput = signal('');



  categories = CHAT_CATEGORIES;
  allQuestions = ELECTION_QA;

  filteredQuestions = computed(() => {
    const cat = this.activeCategory();
    const query = this.searchQuery().toLowerCase();
    let questions = this.allQuestions;

    if (cat) {
      questions = questions.filter(q => q.category === cat);
    }
    if (query) {
      questions = questions.filter(q =>
        q.question.toLowerCase().includes(query) ||
        q.category.toLowerCase().includes(query)
      );
    }
    return questions;
  });

  toggleChat(): void {
    const opening = !this.isOpen();
    this.isOpen.set(opening);
    this.hasNewMessage.set(false);
    if (opening && this.messages().length === 0) {
      this.addBotMessage('👋 Namaste! Welcome to the **Election Guide Assistant**.\n\nI can help you understand the Indian election process. Choose a category below or tap any question to learn more!');
      this.showCategories.set(true);
      this.activeCategory.set(null);
    }
  }

  closeChat(): void {
    this.isOpen.set(false);
  }

  selectCategory(category: string): void {
    this.activeCategory.set(category);
    this.showCategories.set(false);
    this.searchQuery.set('');
    this.addBotMessage(`📂 Showing questions about **${category}**. Tap any question below to get the answer!`);
  }

  goBackToCategories(): void {
    this.activeCategory.set(null);
    this.showCategories.set(true);
    this.searchQuery.set('');
    this.addBotMessage('📋 Here are the categories. Pick one to explore!');
  }

  askQuestion(qa: ChatQA): void {
    this.addUserMessage(qa.question);
    this.isTyping.set(true);
    setTimeout(() => {
      this.isTyping.set(false);
      this.addBotMessage(qa.answer, 'keep-user-top');
    }, 800);
  }

  async sendCustomMessage(): Promise<void> {
    const text = this.userInput().trim();
    if (!text || this.isTyping()) return;

    this.addUserMessage(text);
    this.userInput.set('');
    this.isTyping.set(true);

    this.isTyping.set(false);
    this.addBotMessage("⚠️ I can only answer questions from the provided list. Please select a category or pick a question from the list.");
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    if (value) {
      this.activeCategory.set(null);
      this.showCategories.set(false);
    }
  }

  clearSearch(): void {
    this.searchQuery.set('');
    if (!this.activeCategory()) {
      this.showCategories.set(true);
    }
  }

  resetChat(): void {
    this.messages.set([]);
    this.activeCategory.set(null);
    this.showCategories.set(true);
    this.searchQuery.set('');
    this.addBotMessage('🔄 Chat reset! Choose a category to start exploring the election process.');
  }

  formatMessage(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Basics': '📘',
      'Voter Eligibility': '🪪',
      'Voting Process': '🗳️',
      'EVM & VVPAT': '🖥️',
      'Candidates & Parties': '🏛️',
      'Election Timeline': '📅',
      'Rights & Rules': '⚖️',
      'Election Security': '🛡️',
      'Special Provisions': '♿',
      'After Elections': '🏆',
      'Digital Initiatives': '📱',
      'Census & Delimitation': '📏'
    };
    return icons[category] || '📌';
  }

  getCategoryCount(category: string): number {
    return this.allQuestions.filter(q => q.category === category).length;
  }

  private addBotMessage(text: string, scrollBehavior: 'bottom' | 'keep-user-top' = 'bottom'): void {
    this.messages.update(msgs => [...msgs, { type: 'bot', text, timestamp: new Date() }]);
    if (scrollBehavior === 'bottom') {
      this.scrollToBottomAfterRender();
    } else {
      this.scrollToLastUserMessageAfterRender();
    }
  }

  private addUserMessage(text: string): void {
    this.messages.update(msgs => [...msgs, { type: 'user', text, timestamp: new Date() }]);
    this.scrollToLastUserMessageAfterRender();
  }

  private scrollToBottomAfterRender(): void {
    this.scheduleScroll(() => {
      const el = this.chatBody?.nativeElement;
      if (el) {
        const messages = el.querySelectorAll('.message');
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          lastMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        }
      }
    });
  }

  private scrollToLastUserMessageAfterRender(): void {
    this.scheduleScroll(() => {
      const el = this.chatBody?.nativeElement;
      if (el) {
        const userMessages = el.querySelectorAll('.message.user');
        if (userMessages.length > 0) {
          const lastUserMsg = userMessages[userMessages.length - 1];
          lastUserMsg.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  private scheduleScroll(scrollFn: () => void): void {
    setTimeout(scrollFn, 0);
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollFn);
    });
    setTimeout(scrollFn, 80);
  }
}
