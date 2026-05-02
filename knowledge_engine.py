#!/usr/bin/env python3
"""
Heirloom Knowledge Engine - Hybrid Extraction Strategy
Extracts decision knowledge from GitHub repositories using pattern matching and LLM analysis.
"""

import json
import re
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
import uuid
import random


# ============================================================================
# PATTERN MATCHING CONFIGURATION
# ============================================================================

DECISION_KEYWORDS = [
    "decided to", "chose", "opted for", "went with", "selected",
    "because", "since", "due to", "in order to", "to avoid", "instead of"
]

REASONING_PHRASES = [
    "the reason is", "this is because", "we need this for",
    "this solves", "this addresses", "the problem was", "the issue is"
]

TRADEOFF_INDICATORS = [
    "trade-off", "tradeoff", "pros and cons", "downside",
    "sacrifice", "at the cost of", "however", "but"
]

ALTERNATIVE_INDICATORS = [
    "considered", "evaluated", "tried", "rejected",
    "dismissed", "alternative", "option", "instead", "reverted"
]

LANDMINE_INDICATORS = [
    "careful", "watch out", "be aware", "gotcha",
    "pitfall", "don't", "avoid", "known issue", "landmine"
]


# ============================================================================
# DATA MODELS
# ============================================================================

@dataclass
class Decision:
    id: str
    type: str
    timestamp: str
    title: str
    what: Dict[str, Any]
    why: Dict[str, Any]
    evidence: Dict[str, Any]
    metadata: Dict[str, Any]


@dataclass
class Landmine:
    id: str
    severity: str
    status: str
    location: Dict[str, str]
    warning: Dict[str, Any]
    history: List[Dict[str, str]]
    prevention: Dict[str, Any]


@dataclass
class Person:
    id: str
    name: str
    role: str
    email: str
    contributions: Dict[str, Any]
    expertise: List[str]


@dataclass
class FileNode:
    path: str
    language: str
    lastModified: str
    complexity: str
    owners: List[str]


# ============================================================================
# PATTERN MATCHING ENGINE
# ============================================================================

class PatternMatcher:
    """Fast pattern-based extraction of decision indicators"""
    
    @staticmethod
    def find_keywords(text: str, keywords: List[str]) -> List[Dict[str, Any]]:
        """Find keyword matches with context"""
        matches = []
        text_lower = text.lower()
        
        for keyword in keywords:
            pattern = re.compile(r'(.{0,50})\b' + re.escape(keyword) + r'\b(.{0,100})', re.IGNORECASE)
            for match in pattern.finditer(text):
                matches.append({
                    'keyword': keyword,
                    'context': match.group(0).strip(),
                    'position': match.start()
                })
        
        return matches
    
    @staticmethod
    def extract_reasoning(text: str) -> Optional[str]:
        """Extract reasoning context from text"""
        for phrase in REASONING_PHRASES:
            pattern = re.compile(r'' + re.escape(phrase) + r'(.{0,200})', re.IGNORECASE)
            match = pattern.search(text)
            if match:
                return match.group(0).strip()
        return None
    
    @staticmethod
    def has_decision_indicators(text: str) -> Dict[str, Any]:
        """Check if text contains decision indicators"""
        decision_matches = PatternMatcher.find_keywords(text, DECISION_KEYWORDS)
        tradeoff_matches = PatternMatcher.find_keywords(text, TRADEOFF_INDICATORS)
        alternative_matches = PatternMatcher.find_keywords(text, ALTERNATIVE_INDICATORS)
        
        confidence = 0.0
        if decision_matches:
            confidence += 0.3
        if tradeoff_matches:
            confidence += 0.3
        if alternative_matches:
            confidence += 0.4
        
        return {
            'has_decision': len(decision_matches) > 0,
            'confidence': min(confidence, 1.0),
            'decision_matches': len(decision_matches),
            'tradeoff_matches': len(tradeoff_matches),
            'alternative_matches': len(alternative_matches)
        }


# ============================================================================
# LLM SUMMARIZATION (Simulated for MVP)
# ============================================================================

class LLMSummarizer:
    """Simulates LLM-based summarization for demo purposes"""
    
    @staticmethod
    def summarize_decision(pr_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a summary of the decision reasoning"""
        title = pr_data.get('title', '')
        body = pr_data.get('body', '')
        
        # Simulate LLM analysis based on patterns
        summary = {
            'primaryReason': LLMSummarizer._extract_primary_reason(title, body),
            'context': LLMSummarizer._extract_context(body),
            'problemStatement': LLMSummarizer._extract_problem(body),
            'alternativesConsidered': LLMSummarizer._extract_alternatives(body),
            'tradeoffs': LLMSummarizer._extract_tradeoffs(body),
            'constraints': LLMSummarizer._extract_constraints(body),
            'futureImplications': LLMSummarizer._extract_implications(body)
        }
        
        return summary
    
    @staticmethod
    def _extract_primary_reason(title: str, body: str) -> str:
        """Extract the primary reason for the decision"""
        reasoning = PatternMatcher.extract_reasoning(body)
        if reasoning:
            return reasoning[:200]
        return f"Implemented changes related to: {title}"
    
    @staticmethod
    def _extract_context(body: str) -> str:
        """Extract contextual information"""
        lines = body.split('\n')[:3]
        return ' '.join(lines)[:300]
    
    @staticmethod
    def _extract_problem(body: str) -> str:
        """Extract problem statement"""
        problem_keywords = ['problem', 'issue', 'bug', 'error']
        for line in body.split('\n'):
            if any(kw in line.lower() for kw in problem_keywords):
                return line.strip()[:200]
        return "Addressing technical requirements"
    
    @staticmethod
    def _extract_alternatives(body: str) -> List[Dict[str, str]]:
        """Extract alternatives considered"""
        alternatives = []
        alt_matches = PatternMatcher.find_keywords(body, ALTERNATIVE_INDICATORS)
        
        for match in alt_matches[:2]:
            alternatives.append({
                'option': match['context'][:100],
                'rejectedBecause': 'Did not meet requirements'
            })
        
        return alternatives
    
    @staticmethod
    def _extract_tradeoffs(body: str) -> List[Dict[str, str]]:
        """Extract tradeoffs"""
        tradeoffs = []
        tradeoff_matches = PatternMatcher.find_keywords(body, TRADEOFF_INDICATORS)
        
        for match in tradeoff_matches[:2]:
            tradeoffs.append({
                'gained': 'Improved functionality',
                'sacrificed': match['context'][:100]
            })
        
        return tradeoffs
    
    @staticmethod
    def _extract_constraints(body: str) -> List[str]:
        """Extract constraints"""
        constraints = []
        constraint_keywords = ['must', 'required', 'cannot', 'limitation']
        
        for line in body.split('\n'):
            if any(kw in line.lower() for kw in constraint_keywords):
                constraints.append(line.strip()[:150])
        
        return constraints[:3]
    
    @staticmethod
    def _extract_implications(body: str) -> str:
        """Extract future implications"""
        future_keywords = ['future', 'will', 'plan', 'next', 'eventually']
        for line in body.split('\n'):
            if any(kw in line.lower() for kw in future_keywords):
                return line.strip()[:200]
        return "May require future refinement"


# ============================================================================
# MOCK DATA GENERATOR FOR PALLETS/FLASK
# ============================================================================

class FlaskMockDataGenerator:
    """Generate realistic mock data for Flask repository"""
    
    FLASK_CONTRIBUTORS = [
        {'name': 'David Lord', 'role': 'Maintainer', 'email': 'davidism@gmail.com', 'expertise': ['Python', 'Web Frameworks', 'API Design']},
        {'name': 'Armin Ronacher', 'role': 'Creator', 'email': 'armin@ronacher.eu', 'expertise': ['Python', 'Architecture', 'Performance']},
        {'name': 'Phil Jones', 'role': 'Core Developer', 'email': 'phil@example.com', 'expertise': ['Async', 'Testing', 'Documentation']},
        {'name': 'Grey Li', 'role': 'Contributor', 'email': 'grey@example.com', 'expertise': ['CLI', 'Extensions', 'Tutorials']},
    ]
    
    FLASK_FILES = [
        'src/flask/app.py',
        'src/flask/blueprints.py',
        'src/flask/cli.py',
        'src/flask/config.py',
        'src/flask/ctx.py',
        'src/flask/globals.py',
        'src/flask/helpers.py',
        'src/flask/json/__init__.py',
        'src/flask/sessions.py',
        'src/flask/templating.py',
        'src/flask/testing.py',
        'src/flask/views.py',
        'src/flask/wrappers.py',
    ]
    
    DECISION_SCENARIOS = [
        {
            'title': 'Refactor application context to use context locals',
            'type': 'architectural',
            'body': """We decided to refactor the application context to use context locals instead of thread locals. 
            
The reason is that thread locals don't work well with async frameworks and greenlets. This addresses the growing need for async support in Flask.

We considered keeping thread locals but rejected this because it would limit Flask's future compatibility with async/await patterns.

Trade-off: We gain better async compatibility but sacrifice some backwards compatibility with very old extensions.

This is a breaking change that will require extensions to update their context handling.""",
            'files': ['src/flask/ctx.py', 'src/flask/globals.py'],
            'alternatives': ['Keep thread locals', 'Use a hybrid approach'],
            'landmine': True,
            'landmine_warning': 'Extensions that directly access thread locals will break. Must update to use context locals API.'
        },
        {
            'title': 'Add type hints to core Flask APIs',
            'type': 'technical',
            'body': """Opted for adding comprehensive type hints to improve developer experience and catch errors early.

This solves the problem of unclear API contracts and helps IDEs provide better autocomplete.

We evaluated using stub files instead but went with inline type hints for better maintainability.

The downside is increased complexity in some generic types, but the benefits for users outweigh this cost.""",
            'files': ['src/flask/app.py', 'src/flask/blueprints.py', 'src/flask/views.py'],
            'alternatives': ['Stub files only', 'Gradual typing'],
            'landmine': False
        },
        {
            'title': 'Deprecate JSONEncoder in favor of json.dumps',
            'type': 'refactor',
            'body': """Decided to deprecate the custom JSONEncoder class because Python's json module now supports most use cases.

The problem was maintaining a parallel JSON encoding system that duplicated standard library functionality.

We considered keeping both but rejected this to reduce maintenance burden.

Trade-off: Simpler codebase at the cost of requiring users to migrate their custom encoders.

Watch out: Extensions that override JSONEncoder will need updates. This is a known gotcha.""",
            'files': ['src/flask/json/__init__.py'],
            'alternatives': ['Keep JSONEncoder', 'Provide compatibility shim'],
            'landmine': True,
            'landmine_warning': 'Custom JSONEncoder subclasses will stop working. Users must migrate to provider pattern.'
        },
        {
            'title': 'Implement async view support',
            'type': 'architectural',
            'body': """Chose to add native async/await support for view functions to modernize Flask for async workloads.

This addresses the issue of Flask being perceived as sync-only in an increasingly async Python ecosystem.

We considered using a separate async-flask package but decided to integrate it into core for better user experience.

Trade-off: Added complexity to the routing system, but enables modern async patterns without third-party dependencies.""",
            'files': ['src/flask/app.py', 'src/flask/views.py'],
            'alternatives': ['Separate async-flask package', 'Plugin-based approach'],
            'landmine': False
        },
        {
            'title': 'Reverted: Auto-escape all template variables by default',
            'type': 'refactor',
            'body': """We reverted the auto-escape change because it broke too many existing applications.

The problem was that while auto-escaping improves security, the migration path was too disruptive for the ecosystem.

We considered a gradual migration with warnings but rejected this due to the complexity of detecting all edge cases.

Trade-off: We sacrifice some security-by-default for backwards compatibility and ecosystem stability.

Be aware: This means developers must still manually escape variables in templates. Known pitfall for new users.""",
            'files': ['src/flask/templating.py'],
            'alternatives': ['Gradual migration with warnings', 'Opt-in auto-escape mode'],
            'landmine': True,
            'landmine_warning': 'Template variables are NOT auto-escaped by default. Must use |e filter or Markup() explicitly.'
        }
    ]
    
    @staticmethod
    def generate_mock_data() -> Dict[str, Any]:
        """Generate complete mock dataset for Flask repository"""
        
        # Generate persons
        persons = []
        for i, contributor in enumerate(FlaskMockDataGenerator.FLASK_CONTRIBUTORS):
            person = Person(
                id=f"person-{i+1}",
                name=contributor['name'],
                role=contributor['role'],
                email=contributor['email'],
                contributions={
                    'decisionsAuthored': [],
                    'filesOwned': [],
                    'prCount': random.randint(10, 200),
                    'impactScore': round(random.uniform(0.6, 1.0), 2)
                },
                expertise=contributor['expertise']
            )
            persons.append(asdict(person))
        
        # Generate files
        files = []
        for file_path in FlaskMockDataGenerator.FLASK_FILES:
            file_node = FileNode(
                path=file_path,
                language='Python',
                lastModified=(datetime.now() - timedelta(days=random.randint(1, 365))).isoformat(),
                complexity='medium' if 'app.py' in file_path or 'ctx.py' in file_path else 'low',
                owners=[random.choice(FlaskMockDataGenerator.FLASK_CONTRIBUTORS)['name']]
            )
            files.append(asdict(file_node))
        
        # Generate decisions and landmines
        decisions = []
        landmines = []
        
        for i, scenario in enumerate(FlaskMockDataGenerator.DECISION_SCENARIOS):
            decision_id = f"decision-{i+1}"
            timestamp = (datetime.now() - timedelta(days=random.randint(30, 730))).isoformat()
            author = random.choice(FlaskMockDataGenerator.FLASK_CONTRIBUTORS)
            
            # Use pattern matching to analyze the scenario
            indicators = PatternMatcher.has_decision_indicators(scenario['body'])
            
            # Use LLM summarizer to extract reasoning
            llm_summary = LLMSummarizer.summarize_decision({
                'title': scenario['title'],
                'body': scenario['body']
            })
            
            decision = Decision(
                id=decision_id,
                type=scenario['type'],
                timestamp=timestamp,
                title=scenario['title'],
                what={
                    'changes': [
                        {
                            'file': file_path,
                            'linesAdded': random.randint(10, 200),
                            'linesRemoved': random.randint(5, 100),
                            'diffSummary': f"Modified {file_path.split('/')[-1]}"
                        }
                        for file_path in scenario['files']
                    ],
                    'summary': scenario['title']
                },
                why=llm_summary,
                evidence={
                    'sourceType': 'pr',
                    'sourceId': f"PR#{1000 + i}",
                    'sourceUrl': f"https://github.com/pallets/flask/pull/{1000 + i}",
                    'extractionMethod': 'hybrid',
                    'confidenceScore': indicators['confidence'],
                    'keyQuotes': [
                        {
                            'text': scenario['body'].split('\n')[0][:150],
                            'author': author['name'],
                            'context': 'PR description'
                        }
                    ]
                },
                metadata={
                    'repository': 'pallets/flask',
                    'branch': 'main',
                    'prNumber': 1000 + i,
                    'commitSha': f"abc{i}def{i}123",
                    'authors': [author['name']],
                    'reviewers': [c['name'] for c in random.sample(FlaskMockDataGenerator.FLASK_CONTRIBUTORS, 2)],
                    'labels': [scenario['type'], 'enhancement'] if scenario['type'] != 'bugfix' else [scenario['type']],
                    'linkedIssues': [f"#{900 + i}"]
                }
            )
            decisions.append(asdict(decision))
            
            # Update person contributions
            for person in persons:
                if person['name'] == author['name']:
                    person['contributions']['decisionsAuthored'].append(decision_id)
                    person['contributions']['filesOwned'].extend(scenario['files'][:1])
            
            # Create landmine if applicable
            if scenario.get('landmine'):
                landmine_id = f"landmine-{len(landmines) + 1}"
                landmine = Landmine(
                    id=landmine_id,
                    severity='high' if 'breaking' in scenario['body'].lower() else 'medium',
                    status='active',
                    location={
                        'file': scenario['files'][0],
                        'function': 'N/A',
                        'lineRange': '1-100'
                    },
                    warning={
                        'title': f"⚠️ {scenario['title']}",
                        'description': scenario.get('landmine_warning', 'Potential compatibility issue'),
                        'symptoms': ['Unexpected behavior', 'Breaking changes'],
                        'rootCause': llm_summary['problemStatement']
                    },
                    history=[
                        {
                            'timestamp': timestamp,
                            'incident': scenario['title'],
                            'impact': 'Breaking change for some users',
                            'resolution': 'Documented in migration guide'
                        }
                    ],
                    prevention={
                        'recommendations': [
                            'Review migration guide',
                            'Test thoroughly before upgrading',
                            'Check extension compatibility'
                        ],
                        'relatedDecisions': [decision_id],
                        'documentation': f"https://flask.palletsprojects.com/changes/#{1000 + i}"
                    }
                )
                landmines.append(asdict(landmine))
        
        # Build relationships
        relationships = []
        for decision in decisions:
            decision_id = decision['id']
            author_name = decision['metadata']['authors'][0]
            
            # Decision MADE_BY Person
            relationships.append({
                'from': decision_id,
                'to': next(p['id'] for p in persons if p['name'] == author_name),
                'type': 'MADE_BY',
                'timestamp': decision['timestamp'],
                'strength': 1.0
            })
            
            # Decision AFFECTS File
            for change in decision['what']['changes']:
                file_path = change['file']
                file_node = next((f for f in files if f['path'] == file_path), None)
                if file_node:
                    relationships.append({
                        'from': decision_id,
                        'to': file_path,
                        'type': 'AFFECTS',
                        'timestamp': decision['timestamp'],
                        'strength': 0.8
                    })
            
            # Decision CREATES Landmine
            related_landmines = [l for l in landmines if decision_id in l['prevention']['relatedDecisions']]
            for landmine in related_landmines:
                relationships.append({
                    'from': decision_id,
                    'to': landmine['id'],
                    'type': 'CREATES',
                    'timestamp': decision['timestamp'],
                    'strength': 0.9
                })
        
        return {
            'repository': {
                'name': 'pallets/flask',
                'description': 'The Python micro framework for building web applications',
                'url': 'https://github.com/pallets/flask',
                'stars': 67000,
                'language': 'Python'
            },
            'metadata': {
                'generatedAt': datetime.now().isoformat(),
                'extractionMethod': 'hybrid',
                'totalDecisions': len(decisions),
                'totalLandmines': len(landmines),
                'totalPersons': len(persons),
                'totalFiles': len(files)
            },
            'nodes': {
                'decisions': decisions,
                'persons': persons,
                'files': files,
                'landmines': landmines
            },
            'relationships': relationships
        }


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main execution function"""
    print(">> Heirloom Knowledge Engine - Starting extraction...")
    print("=" * 60)
    
    # Generate mock data for Flask
    print("\n>> Generating mock data for pallets/flask...")
    mock_data = FlaskMockDataGenerator.generate_mock_data()
    
    print(f"[OK] Generated {mock_data['metadata']['totalDecisions']} decisions")
    print(f"[OK] Generated {mock_data['metadata']['totalLandmines']} landmines")
    print(f"[OK] Generated {mock_data['metadata']['totalPersons']} persons")
    print(f"[OK] Generated {mock_data['metadata']['totalFiles']} files")
    print(f"[OK] Generated {len(mock_data['relationships'])} relationships")
    
    # Save to file
    output_path = 'src/data/repo_story.json'
    print(f"\n>> Saving to {output_path}...")
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(mock_data, f, indent=2, ensure_ascii=False)
    
    print(f"[OK] Successfully saved to {output_path}")
    print("\n" + "=" * 60)
    print("[SUCCESS] Knowledge extraction complete!")
    print("\nYou can now use this data in your UI to demo:")
    print("  - Decision history with 'why' reasoning")
    print("  - Landmine warnings")
    print("  - Ghost mentor personas")
    print("  - Knowledge graph relationships")


if __name__ == '__main__':
    main()
