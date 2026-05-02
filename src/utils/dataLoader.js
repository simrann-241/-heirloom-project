import repoData from '../data/repo_story.json';

export const getRepoMetadata = () => repoData.metadata;
export const getRepository = () => repoData.repository;
export const getDecisions = () => repoData.nodes.decisions;
export const getLandmines = () => repoData.nodes.landmines;
export const getPersons = () => repoData.nodes.persons;
export const getFiles = () => repoData.nodes.files;
export const getRelationships = () => repoData.relationships;

export const getDecisionById = (id) => 
  repoData.nodes.decisions.find(d => d.id === id);

export const getPersonById = (id) => 
  repoData.nodes.persons.find(p => p.id === id);
