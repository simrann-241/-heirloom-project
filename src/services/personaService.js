import repoStory from '../data/repo_story.json';
import arminPersona from '../data/personas/armin-ronacher.json';

const PERSONAS = {
  'person-2': arminPersona.persona
};

export function loadPersona(personaId) {
  const baseData = repoStory.nodes.persons.find(p => p.id === personaId);
  const enhancedData = PERSONAS[personaId];
  
  if (!enhancedData) {
    // Create default persona profiles for contributors without enhanced data
    const defaultProfiles = {
      'person-1': {
        avatar: '👨🏻‍💻',
        philosophies: ['Maintain backwards compatibility while modernizing the codebase', 'Focus on developer experience and clear documentation'],
        commonPhrases: ['Let me explain', 'The key consideration is', 'We need to balance']
      },
      'person-3': {
        avatar: '👨🏻‍💻',
        philosophies: ['Ensure security without breaking existing functionality', 'Pragmatic solutions over theoretical perfection'],
        commonPhrases: ['From my experience', 'The important thing is', 'We should consider']
      },
      'person-4': {
        avatar: '👩🏻‍💻',
        philosophies: ['Clean code and maintainability', 'Reduce technical debt incrementally'],
        commonPhrases: ['In my view', 'The challenge here is', 'We need to think about']
      }
    };
    
    const profile = defaultProfiles[personaId] || {
      avatar: '👤',
      philosophies: ['Quality and stability in open source'],
      commonPhrases: ['Let me explain', 'The reason is']
    };
    
    // Return base data with proper structure if no enhanced data
    return {
      id: personaId,
      name: baseData.name,
      role: baseData.role,
      avatar: profile.avatar,
      prCount: baseData.contributions?.prCount || 0,
      impactScore: baseData.contributions?.impactScore || 0,
      expertise: baseData.expertise || [],
      profile: {
        philosophies: profile.philosophies
      },
      voiceModel: {
        commonPhrases: profile.commonPhrases
      },
      technicalPhilosophy: {
        corePrinciple: profile.philosophies[0]
      }
    };
  }

  // Merge base data with enhanced persona data
  return {
    id: personaId,
    name: enhancedData.name || baseData.name,
    role: enhancedData.role || baseData.role,
    avatar: enhancedData.avatar || '👤',
    prCount: baseData.contributions?.prCount || 0,
    impactScore: baseData.contributions?.impactScore || 0,
    expertise: baseData.expertise || enhancedData.profile?.expertise || [],
    profile: enhancedData.profile,
    voiceModel: enhancedData.voiceModel,
    hiddenKnowledge: enhancedData.hiddenKnowledge,
    exampleResponses: enhancedData.exampleResponses,
    conversationGuidelines: enhancedData.conversationGuidelines,
    technicalPhilosophy: {
      corePrinciple: enhancedData.profile?.philosophies?.[0] || "maintaining quality and stability"
    }
  };
}

export function getRelevantDecisions(persona, query) {
  const decisions = repoStory.nodes.decisions;
  const queryLower = query.toLowerCase();

  // Filter decisions where this person was involved
  const relevant = decisions.filter(d => 
    d.metadata.authors.includes(persona.name) ||
    d.metadata.reviewers.includes(persona.name)
  );
  
  // Score based on keywords
  const scored = relevant.map(d => {
    let score = 0;
    if (d.title.toLowerCase().includes(queryLower)) score += 5;
    if (d.why.primaryReason.toLowerCase().includes(queryLower)) score += 3;
    if (d.why.context.toLowerCase().includes(queryLower)) score += 2;
    return { ...d, relevance: score };
  });
  
  return scored
    .filter(d => d.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3);
}

export async function generatePersonaResponse(persona, query, context) {
  // In a real app, this would call watsonx.ai or Bob's API
  // For the demo, we use the simulated persona logic
  
  if (!persona || !persona.voiceModel) {
    return "I apologize, but I'm having trouble accessing my knowledge base right now.";
  }
  
  const queryLower = query.toLowerCase();
  
  // Try to find a matching scenario from example responses
  const exampleResponses = persona.exampleResponses || [];
  
  // Check for keyword matches - prioritize specific matches first
  const keywordMatches = [
    { keywords: ['authentication', 'auth', 'login'], response: exampleResponses.find(r => r.question?.toLowerCase().includes('authentication')) },
    { keywords: ['flask', 'django', 'better', 'choose', 'vs'], response: exampleResponses.find(r => r.question?.toLowerCase().includes('flask') && r.question?.toLowerCase().includes('django')) },
    { keywords: ['async', 'await', 'asynchronous'], response: exampleResponses.find(r => r.question?.toLowerCase().includes('async')) },
    { keywords: ['context local', 'thread local', 'context', 'thread'], response: exampleResponses.find(r => r.question?.toLowerCase().includes('context local')) },
    { keywords: ['escape', 'revert', 'auto-escape'], response: exampleResponses.find(r => r.question?.toLowerCase().includes('escape')) },
    { keywords: ['mistake', 'wrong', 'error', 'biggest'], response: exampleResponses.find(r => r.question?.toLowerCase().includes('mistake')) },
    { keywords: ['philosophy', 'principle', 'approach'], response: exampleResponses.find(r => r.context === 'philosophy-advice') },
    { keywords: ['why flask', 'why not'], response: exampleResponses.find(r => r.context === 'philosophy') }
  ];
  
  // Find best match
  for (const match of keywordMatches) {
    if (match.response && match.keywords.some(kw => queryLower.includes(kw))) {
      return match.response.response;
    }
  }

  // Fallback to a persona-styled response using their voice
  const commonPhrases = persona.voiceModel?.commonPhrases || ["Let me explain", "The reason is"];
  const philosophies = persona.profile?.philosophies || [];
  const corePrinciple = persona.technicalPhilosophy?.corePrinciple ||
                       philosophies[0] ||
                       "maintaining simplicity and composability";
  
  // Build a response in Armin's style
  const decisionLinks = context && context.length > 0
    ? ` Looking at ${context.map(d => `[${d.title || d.id}]`).join(', ')}, `
    : '';
  
  return `${commonPhrases[0]}.${decisionLinks}${commonPhrases[1]} ${corePrinciple}. Flask is a micro-framework for a reason - we give you primitives, not prescriptions. The question isn't about which tool is "better" - it's about which tool fits YOUR constraints. Trade-off: every choice sacrifices something. Choose based on your actual requirements, not internet arguments. Watch out: don't pick a framework because it's trendy. Pick it because it solves your problem.`;
}
