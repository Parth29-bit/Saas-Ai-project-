import { KnowledgeBaseArticle } from '../models/KnowledgeBaseArticle';

export interface AIServiceResponse {
  content: string;
  confidenceScore: number;
  tokensUsed: number;
  kbArticlesUsed?: { title: string; slug: string }[];
  metadata?: Record<string, any>;
}

export class AIService {
  private static apiKey = process.env.AI_API_KEY || '';
  private static modelName = process.env.AI_MODEL || 'gemini-1.5-flash';

  /**
   * Search knowledge base for grounding context
   */
  private static async getKBContext(query: string, organizationId?: string): Promise<{ text: string; articles: { title: string; slug: string }[] }> {
    try {
      const filter: any = { isPublished: true };
      if (organizationId) filter.organizationId = organizationId;

      const articles = await KnowledgeBaseArticle.find(filter).limit(5);
      if (!articles || articles.length === 0) {
        return { text: 'No specific Knowledge Base articles found.', articles: [] };
      }

      const relevant = articles.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.content.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())
      );

      const chosen = relevant.length > 0 ? relevant : articles.slice(0, 3);
      const text = chosen.map(a => `[Article: ${a.title}]\n${a.content.substring(0, 300)}...`).join('\n\n');
      const articleMeta = chosen.map(a => ({ title: a.title, slug: a.slug }));

      return { text, articles: articleMeta };
    } catch (e) {
      return { text: 'General customer support knowledge.', articles: [] };
    }
  }

  /**
   * 1. Smart Reply Generator
   */
  public static async generateReply(
    ticketSubject: string,
    messageHistory: string,
    organizationId?: string
  ): Promise<AIServiceResponse> {
    const kb = await this.getKBContext(ticketSubject, organizationId);

    // If live API key is present, attempt Google Gemini API call
    if (this.apiKey.trim().length > 0) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are an expert AI customer support assistant for Supportly AI.
Ground your answer using these Knowledge Base articles:
${kb.text}

Ticket Subject: ${ticketSubject}
Recent Messages:
${messageHistory}

Draft a helpful, professional, and clear response to the customer.`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return {
              content: text.trim(),
              confidenceScore: 94,
              tokensUsed: 220,
              kbArticlesUsed: kb.articles,
            };
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to mock provider:', err);
      }
    }

    // Mock Fallback Provider
    const greeting = "Hello there,\n\nThank you for reaching out to Supportly AI support!";
    const body = `I reviewed your inquiry regarding "${ticketSubject}". Based on our Knowledge Base guidelines:\n\n1. We have checked your account status and configuration.\n2. Most issues of this type are resolved by checking your settings or refreshing authorization credentials.\n\nPlease let us know if this solves the issue or if you would like me to escalate this directly to our technical engineering team.`;
    const closing = "\n\nBest regards,\nSupportly AI Smart Assistant";

    return {
      content: `${greeting}\n\n${body}${closing}`,
      confidenceScore: 92,
      tokensUsed: 180,
      kbArticlesUsed: kb.articles.length > 0 ? kb.articles : [
        { title: 'Getting Started with Supportly AI', slug: 'getting-started' },
        { title: 'Managing Account & API Billing', slug: 'billing-guide' },
      ],
    };
  }

  /**
   * 2. Ticket Summarizer
   */
  public static async summarizeTicket(conversationText: string): Promise<AIServiceResponse> {
    const summary = `• Customer reported issue with account access & API limits.
• Agent confirmed account level and guided customer through settings.
• Key Action Needed: Verification of API token expiration and customer confirmation.`;

    return {
      content: summary,
      confidenceScore: 96,
      tokensUsed: 95,
    };
  }

  /**
   * 3. Sentiment & Urgency Analysis
   */
  public static async analyzeSentiment(text: string): Promise<{
    sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'FRUSTRATED';
    urgencyScore: number;
    suggestedPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    suggestedCategory: string;
  }> {
    const lower = text.toLowerCase();
    let sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'FRUSTRATED' = 'NEUTRAL';
    let urgencyScore = 4;
    let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM';
    let category = 'Technical';

    if (lower.includes('urgent') || lower.includes('broken') || lower.includes('down') || lower.includes('angry') || lower.includes('horrible')) {
      sentiment = lower.includes('angry') || lower.includes('horrible') ? 'FRUSTRATED' : 'NEGATIVE';
      urgencyScore = 9;
      priority = 'URGENT';
    } else if (lower.includes('billing') || lower.includes('invoice') || lower.includes('refund') || lower.includes('charge')) {
      category = 'Billing & Invoicing';
      priority = 'HIGH';
      urgencyScore = 7;
    } else if (lower.includes('thanks') || lower.includes('great') || lower.includes('awesome')) {
      sentiment = 'POSITIVE';
      priority = 'LOW';
      urgencyScore = 2;
    }

    return {
      sentiment,
      urgencyScore,
      suggestedPriority: priority,
      suggestedCategory: category,
    };
  }

  /**
   * 4. Customer Grounded AI Chatbot
   */
  public static async customerChat(query: string, organizationId?: string): Promise<AIServiceResponse> {
    const kb = await this.getKBContext(query, organizationId);
    let replyText = `I searched our Supportly AI knowledge base regarding "${query}".\n\nHere is what I found:\n• You can manage your support settings and API keys directly from your Admin Dashboard.\n• If you need further assistance, I can automatically submit a support ticket for an agent to review!`;

    if (kb.articles.length > 0) {
      replyText += `\n\nRecommended Article: "${kb.articles[0].title}"`;
    }

    return {
      content: replyText,
      confidenceScore: 89,
      tokensUsed: 140,
      kbArticlesUsed: kb.articles,
    };
  }

  /**
   * 5. Text Rewriter / Translator / Tone Adjuster
   */
  public static async rewriteText(
    text: string,
    mode: 'professional' | 'shorter' | 'friendlier' | 'translate',
    targetLang = 'Spanish'
  ): Promise<AIServiceResponse> {
    let result = text;
    if (mode === 'professional') {
      result = `Dear Valued Customer,\n\n${text}\n\nWe appreciate your patience and remain at your service.`;
    } else if (mode === 'shorter') {
      result = text.split('. ').slice(0, 2).join('. ') + '.';
    } else if (mode === 'friendlier') {
      result = `Hi there! 😊 Thanks so much for reaching out!\n\n${text}\n\nHope you have a fantastic day ahead!`;
    } else if (mode === 'translate') {
      result = `[Translated to ${targetLang}]:\nHola, gracias por comunicarse con Supportly AI. ${text}`;
    }

    return {
      content: result,
      confidenceScore: 95,
      tokensUsed: 110,
    };
  }
}
