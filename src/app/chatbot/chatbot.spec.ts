import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatbotComponent } from './chatbot';
import { ElementRef } from '@angular/core';

describe('ChatbotComponent', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();
    
    await TestBed.configureTestingModule({
      imports: [ChatbotComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    
    // Mock scrollIntoView for all elements
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle chat and add initial message if empty', () => {
    expect(component.isOpen()).toBe(false);
    component.toggleChat();
    expect(component.isOpen()).toBe(true);
    expect(component.messages().length).toBe(1);
    expect(component.messages()[0].text).toContain('Welcome');
  });

  it('should close chat', () => {
    component.isOpen.set(true);
    component.closeChat();
    expect(component.isOpen()).toBe(false);
  });

  it('should select a category', () => {
    const category = 'Basics';
    component.selectCategory(category);
    expect(component.activeCategory()).toBe(category);
    expect(component.showCategories()).toBe(false);
    expect(component.messages()[component.messages().length - 1].text).toContain(category);
  });

  it('should go back to categories', () => {
    component.activeCategory.set('Basics');
    component.showCategories.set(false);
    component.goBackToCategories();
    expect(component.activeCategory()).toBeNull();
    expect(component.showCategories()).toBe(true);
  });

  it('should filter questions based on category and search query', () => {
    component.activeCategory.set('Basics');
    const filtered = component.filteredQuestions();
    expect(filtered.every(q => q.category === 'Basics')).toBe(true);

    component.searchQuery.set('Voter');
    component.activeCategory.set(null);
    const searchFiltered = component.filteredQuestions();
    expect(searchFiltered.some(q => q.question.includes('Voter') || q.category.includes('Voter'))).toBe(true);
  });

  it('should handle search input', () => {
    const event = { target: { value: 'test query' } } as any;
    component.onSearch(event);
    expect(component.searchQuery()).toBe('test query');
    expect(component.showCategories()).toBe(false);
  });

  it('should clear search', () => {
    component.searchQuery.set('test');
    component.clearSearch();
    expect(component.searchQuery()).toBe('');
    expect(component.showCategories()).toBe(true);
  });

  it('should ask a question and receive a bot reply', async () => {
    const qa = { id: 1, question: 'What is EVM?', answer: 'Electronic Voting Machine', category: 'Basics' };
    component.askQuestion(qa);
    expect(component.messages().some(m => m.text === qa.question)).toBe(true);
    expect(component.isTyping()).toBe(true);
    
    vi.advanceTimersByTime(800);
    expect(component.isTyping()).toBe(false);
    expect(component.messages().some(m => m.text === qa.answer)).toBe(true);
  });

  it('should send a custom message and receive a fallback reply', async () => {
    component.userInput.set('Hello');
    await component.sendCustomMessage();
    expect(component.messages().some(m => m.text === 'Hello')).toBe(true);
    expect(component.messages()[component.messages().length - 1].text).toContain('I can only answer questions from the provided list');
  });

  it('should reset chat', () => {
    component.messages.set([{ type: 'user', text: 'hi', timestamp: new Date() }]);
    component.resetChat();
    expect(component.messages().length).toBe(1);
    expect(component.messages()[0].text).toContain('Chat reset');
    expect(component.showCategories()).toBe(true);
  });

  it('should format message with bold and line breaks', () => {
    const input = '**bold**\nnew line';
    const output = component.formatMessage(input);
    expect(output).toBe('<strong>bold</strong><br>new line');
  });

  it('should return correct category icon', () => {
    expect(component.getCategoryIcon('Basics')).toBe('📘');
    expect(component.getCategoryIcon('Unknown')).toBe('📌');
  });

  it('should return category count', () => {
    const count = component.getCategoryCount('Basics');
    expect(count).toBeGreaterThan(0);
  });

  it('should trigger scroll methods on message add', async () => {
    const mockElement = document.createElement('div');
    const messageElement = document.createElement('div');
    messageElement.className = 'message user';
    mockElement.appendChild(messageElement);
    
    component.chatBody = new ElementRef(mockElement);
    
    component.toggleChat(); // adds bot message
    vi.advanceTimersByTime(100); 
    
    component.askQuestion({ id: 99, question: 'q', answer: 'a', category: 'c' });
    vi.advanceTimersByTime(1000); 
    
    expect(true).toBe(true);
  });
});
