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
  if (!persona || !persona.voiceModel) {
    return "I apologize, but I'm having trouble accessing my knowledge base right now.";
  }
  
  const queryLower = query.toLowerCase();
  const exampleResponses = persona.exampleResponses || [];
  
  // 1. Check for specific Keyword Matches first (High Precision)
  const exactMatch = exampleResponses.find(r => 
    r.question?.toLowerCase().includes(queryLower) || 
    queryLower.includes(r.question?.toLowerCase())
  );
  
  if (exactMatch) return exactMatch.response;

  // 2. Intent Detection
  const isComparison = queryLower.includes('vs') || queryLower.includes('better') || queryLower.includes('or') || queryLower.includes('difference') || queryLower.includes('btw') || queryLower.includes('between');
  const isMistake = queryLower.includes('mistake') || queryLower.includes('wrong') || queryLower.includes('error');
  const isPhilosophy = queryLower.includes('why') || queryLower.includes('philosophy') || queryLower.includes('reason') || queryLower.includes('should');
  const isTechnical = queryLower.includes('how') || queryLower.includes('implementation') || queryLower.includes('code') || queryLower.includes('what');

  // 3. Dynamic Phrases Pool
  const commonPhrases = persona.voiceModel?.commonPhrases || ["Let me explain", "The reason is"];
  const catchphrases = persona.voiceModel?.catchphrases || commonPhrases;
  
  // Get randomized phrase to avoid repetition
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const opening = getRandom(commonPhrases);
  const coreIdea = getRandom(persona.profile?.philosophies || ["simplicity over complexity"]);
  
  // 4. Build Contextual Response
  let response = `${opening}. `;

  if (isComparison) {
    response += `When comparing architectures, we must focus on ${coreIdea.toLowerCase()}. In the early days of Flask, we didn't want to prescribe a structure. Django is great for 'batteries included', but we wanted to give developers the primitives to build their own batteries. It's about tradeoffs, not winners.`;
  } else if (isMistake) {
    response += `Looking back, I'd say our biggest mistake was sometimes being too implicit. We wanted "magic" but magic can be hard to debug when it breaks. We fixed some of this in the later refactors, specifically around context safety.`;
  } else if (isPhilosophy) {
    response += `My core philosophy is that ${coreIdea.toLowerCase()}. If the system is too rigid, it breaks. If it's too loose, it's a mess. We aimed for the middle ground where the user is always in control, even if we help them a little.`;
  } else if (isTechnical) {
    const decisions = context && context.length > 0 
      ? `We actually addressed this in ${context[0].title}. ` 
      : `This touches on how we handle state. `;
    response += `${decisions}We used context locals as a safer alternative to thread locals because we wanted to support modern async patterns without compromising on simplicity.`;
  } else {
    // General high-fidelity Armin-ism
    response += `The question of "${query}" is interesting. It always comes back to one thing: ${coreIdea.toLowerCase()}. Don't build for tomorrow's scale until you've solved today's problem. Keeping the core small allows us to evolve without breaking the world.`;
  }

  return response;
}
