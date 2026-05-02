import repoStory from '../data/repo_story.json';
import arminPersona from '../data/personas/armin-ronacher.json';

const PERSONAS = {
  'person-2': arminPersona
};

export function loadPersona(personaId) {
  const baseData = repoStory.nodes.persons.find(p => p.id === personaId);
  const enhancedData = PERSONAS[personaId];
  
  if (!enhancedData) return baseData;

  return {
    ...baseData,
    ...enhancedData,
    profile: {
      ...baseData,
      ...enhancedData.profile
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
  
  const queryLower = query.toLowerCase();
  
  // Try to find a matching scenario from Bob's example responses
  const scenario = persona.voiceModel.exampleResponses?.find(s => 
    s.scenario.toLowerCase().includes(queryLower) || 
    queryLower.includes(s.topic?.toLowerCase())
  );

  if (scenario) {
    return scenario.response;
  }

  // Fallback to a general persona-style response
  const decisionLinks = context.map(d => `[${d.evidence.sourceId}]`).join(', ');
  
  return `${persona.voiceModel.commonPhrases[0]} I've reviewed your question. ${persona.voiceModel.commonPhrases[1]} we should look at ${decisionLinks || 'the core architecture'}. My philosophy is ${persona.technicalPhilosophy.corePrinciple}. We considered other options but rejected them because stability is our feature.`;
}
