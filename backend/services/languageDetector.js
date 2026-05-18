// Regex-based language detector (fast, no file system needed)
const languagePatterns = {
  python: {
    patterns: [
      /def\s+\w+\s*\(/,
      /import\s+\w+/,
      /from\s+\w+\s+import/,
      /print\s*\(/,
      /if\s+__name__\s*==\s*['"]__main__['"]/,
      /:\s*$/m,
      /^\s*#.*$/m
    ],
    name: 'Python',
    badge: '🐍'
  },
  javascript: {
    patterns: [
      /const\s+\w+\s*=/,
      /let\s+\w+\s*=/,
      /var\s+\w+\s*=/,
      /function\s+\w+\s*\(/,
      /=>\s*{/,
      /console\.log\s*\(/,
      /require\s*\(/,
      /module\.exports/
    ],
    name: 'JavaScript',
    badge: '🟨'
  },
  typescript: {
    patterns: [
      /:\s*string/,
      /:\s*number/,
      /:\s*boolean/,
      /interface\s+\w+/,
      /type\s+\w+\s*=/,
      /:\s*\w+\[\]/,
      /<\w+>/,
      /as\s+\w+/
    ],
    name: 'TypeScript',
    badge: '🔷'
  },
  sql: {
    patterns: [
      /SELECT\s+.+\s+FROM/i,
      /INSERT\s+INTO/i,
      /UPDATE\s+\w+\s+SET/i,
      /DELETE\s+FROM/i,
      /CREATE\s+TABLE/i,
      /DROP\s+TABLE/i,
      /WHERE\s+/i,
      /JOIN\s+/i
    ],
    name: 'SQL',
    badge: '🗄️'
  },
  java: {
    patterns: [
      /public\s+class\s+\w+/,
      /public\s+static\s+void\s+main/,
      /System\.out\.println/,
      /private\s+\w+\s+\w+/,
      /import\s+java\./,
      /@Override/,
      /new\s+\w+\s*\(/
    ],
    name: 'Java',
    badge: '☕'
  },
  go: {
    patterns: [
      /func\s+\w+\s*\(/,
      /package\s+\w+/,
      /import\s+\(/,
      /fmt\.Print/,
      /:=\s*/,
      /var\s+\w+\s+\w+/,
      /go\s+func/
    ],
    name: 'Go',
    badge: '🐹'
  },
  bash: {
    patterns: [
      /^#!\/bin\/(bash|sh)/,
      /\$\w+/,
      /echo\s+/,
      /if\s+\[/,
      /for\s+\w+\s+in/,
      /chmod\s+/,
      /grep\s+/
    ],
    name: 'Bash',
    badge: '💻'
  },
  cpp: {
    patterns: [
      /#include\s*</,
      /std::/,
      /cout\s*<</,
      /int\s+main\s*\(/,
      /nullptr/,
      /template\s*</
    ],
    name: 'C++',
    badge: '⚡'
  }
};

// Detect language from code snippet
const detectLanguage = (code) => {
  if (!code || typeof code !== 'string') {
    return { language: 'unknown', name: 'Unknown', badge: '❓', confidence: 0 };
  }

  const scores = {};

  // Score each language
  for (const [lang, config] of Object.entries(languagePatterns)) {
    let score = 0;
    for (const pattern of config.patterns) {
      if (pattern.test(code)) {
        score++;
      }
    }
    if (score > 0) {
      scores[lang] = score;
    }
  }

  // Find highest scoring language
  if (Object.keys(scores).length === 0) {
    return { language: 'unknown', name: 'Unknown', badge: '❓', confidence: 0 };
  }

  const detected = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  );

  const lang = detected[0];
  const confidence = Math.min(100, Math.round((detected[1] / languagePatterns[lang].patterns.length) * 100));

  return {
    language: lang,
    name: languagePatterns[lang].name,
    badge: languagePatterns[lang].badge,
    confidence
  };
};

// Get list of supported languages
const getSupportedLanguages = () => {
  return Object.entries(languagePatterns).map(([key, config]) => ({
    key,
    name: config.name,
    badge: config.badge
  }));
};

module.exports = { detectLanguage, getSupportedLanguages };