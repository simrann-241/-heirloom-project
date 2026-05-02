import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WhyChat from '../../src/components/WhyChat';

// Mock the dataLoader utility
vi.mock('../../src/utils/dataLoader', () => ({
  getDecisions: vi.fn(() => [
    {
      id: 1,
      title: 'Async Refactor',
      description: 'Refactored context handling to support async operations',
    },
  ]),
}));

describe('WhyChat Component', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn();
  });

  it('renders the component with initial greeting message', () => {
    render(<WhyChat />);
    
    expect(screen.getByText(/Hello! I am Heirloom/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask why a decision was made/i)).toBeInTheDocument();
  });

  it('displays the Why-Chat header', () => {
    render(<WhyChat />);
    
    expect(screen.getByText('Why-Chat')).toBeInTheDocument();
    expect(screen.getByText('Contextual Intelligence')).toBeInTheDocument();
  });

  it('allows user to type in the input field', async () => {
    const user = userEvent.setup();
    render(<WhyChat />);
    
    const input = screen.getByPlaceholderText(/Ask why a decision was made/i);
    await user.type(input, 'Why did we refactor async?');
    
    expect(input).toHaveValue('Why did we refactor async?');
  });

  it('sends message when send button is clicked', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ reply: 'Test response from backend' }),
    });

    render(<WhyChat />);
    
    const input = screen.getByPlaceholderText(/Ask why a decision was made/i);
    const sendButton = screen.getByRole('button');
    
    await user.type(input, 'Test message');
    await user.click(sendButton);
    
    // Check that user message appears
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('sends message when Enter key is pressed', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ reply: 'Test response' }),
    });

    render(<WhyChat />);
    
    const input = screen.getByPlaceholderText(/Ask why a decision was made/i);
    
    await user.type(input, 'Test message{Enter}');
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('shows typing indicator while waiting for response', async () => {
    const user = userEvent.setup();
    
    // Mock a delayed response
    global.fetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        json: async () => ({ reply: 'Delayed response' }),
      }), 100))
    );

    render(<WhyChat />);
    
    const input = screen.getByPlaceholderText(/Ask why a decision was made/i);
    await user.type(input, 'Test{Enter}');
    
    // Typing indicator should appear
    const typingIndicator = screen.getByText('Test').closest('.messages-area').querySelector('.typing');
    expect(typingIndicator).toBeInTheDocument();
  });

  it('displays AI response from backend', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ reply: 'Backend AI response' }),
    });

    render(<WhyChat />);
    
    const input = screen.getByPlaceholderText(/Ask why a decision was made/i);
    await user.type(input, 'Test question{Enter}');
    
    await waitFor(() => {
      expect(screen.getByText('Backend AI response')).toBeInTheDocument();
    });
  });

  it('falls back to local context when backend is unavailable', async () => {
    const user = userEvent.setup();
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<WhyChat />);
    
    const input = screen.getByPlaceholderText(/Ask why a decision was made/i);
    await user.type(input, 'async{Enter}');
    
    await waitFor(() => {
      expect(screen.getByText(/async refactor/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('displays citations for async-related queries', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ reply: 'Async refactor explanation' }),
    });

    render(<WhyChat />);
    
    const input = screen.getByPlaceholderText(/Ask why a decision was made/i);
    await user.type(input, 'Why async refactor?{Enter}');
    
    await waitFor(() => {
      const citation = screen.getByText('PR #3928');
      expect(citation).toBeInTheDocument();
    });
  });

  it('displays landmine warning with citations', async () => {
    const user = userEvent.setup();
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<WhyChat />);
    
    const input = screen.getByPlaceholderText(/Ask why a decision was made/i);
    await user.type(input, 'landmine{Enter}');
    
    await waitFor(() => {
      expect(screen.getByText(/Warning/i)).toBeInTheDocument();
      expect(screen.getAllByText(/ctx\.py/i).length).toBeGreaterThan(0);
    }, { timeout: 2000 });
  });

  it('does not send empty messages', async () => {
    const user = userEvent.setup();
    render(<WhyChat />);
    
    const sendButton = screen.getByRole('button');
    const initialMessages = screen.getAllByText(/./i, { selector: '.message p' });
    const initialMessageCount = initialMessages.length;
    
    await user.click(sendButton);
    
    const finalMessages = screen.getAllByText(/./i, { selector: '.message p' });
    const finalMessageCount = finalMessages.length;
    expect(finalMessageCount).toBe(initialMessageCount);
  });

  it('clears input field after sending message', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ reply: 'Response' }),
    });

    render(<WhyChat />);
    
    const input = screen.getByPlaceholderText(/Ask why a decision was made/i);
    await user.type(input, 'Test message');
    
    const sendButton = screen.getByRole('button');
    await user.click(sendButton);
    
    expect(input).toHaveValue('');
  });

  it('makes correct API call to backend', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ reply: 'Response' }),
    });

    render(<WhyChat />);
    
    const input = screen.getByPlaceholderText(/Ask why a decision was made/i);
    await user.type(input, 'Test query{Enter}');
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:5000/api/chat',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Test query' }),
        })
      );
    });
  });
});

// Made with Bob
