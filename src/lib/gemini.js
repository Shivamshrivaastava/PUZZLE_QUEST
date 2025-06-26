const GEMINI_API_KEY = "AIzaSyD3mH_-je5neGdFu-EcZkYIzl6BwEJy3-Y";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

const puzzlePrompts = {
  logic: [
    "Create a logic puzzle with 3 statements where exactly 2 are true and 1 is false. Include multiple choice answers.",
    "Generate a number sequence puzzle where the user needs to find the next number in the pattern.",
    "Create a riddle that requires logical thinking to solve. Provide 4 multiple choice answers.",
  ],
  math: [
    "Create a math word problem that requires multiple steps to solve. Suitable for brain training.",
    "Generate a mathematical pattern recognition puzzle with numbers.",
    "Create a geometry-based brain teaser with visual elements described in text.",
  ],
  word: [
    "Create a word puzzle where letters need to be rearranged to form a valid word. Provide hints.",
    "Generate an anagram puzzle with a theme. Provide the scrambled letters and a hint about the category.",
    "Create a vocabulary puzzle that tests knowledge of synonyms or antonyms.",
  ],
  pattern: [
    "Create a visual pattern puzzle described in text where the user needs to identify the next element.",
    "Generate a color/shape pattern sequence puzzle that can be described textually.",
    "Create a pattern recognition puzzle with symbols or letters.",
  ],
};

export const generateDailyPuzzles = async (
  difficulty = "medium",
  userId,
  useAI = false,
  puzzleMode = "daily",
) => {
  try {
    console.log("Generating puzzles...", {
      difficulty,
      userId,
      useAI,
      puzzleMode,
    });

    // If not using AI or if it's likely to fail due to quota, use fallback puzzles
    if (!useAI) {
      console.log("Using fallback puzzles (AI disabled)");
      return getFallbackPuzzles(difficulty, userId, puzzleMode);
    }

    // Create unique seed based on puzzle mode
    const today = new Date().toDateString();
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);

    let seed;
    if (puzzleMode === "daily") {
      // Daily puzzles: same seed per day (consistent daily challenge)
      seed = `${userId}-${today}`;
    } else {
      // Practice puzzles: unique seed every time
      seed = `${userId}-practice-${timestamp}-${random}`;
    }

    // Randomly select puzzle types for variety
    const puzzleTypes = Object.keys(puzzlePrompts);
    const selectedTypes = [];

    // Ensure we get 3 different types
    while (selectedTypes.length < 3) {
      const randomType =
        puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
      if (!selectedTypes.includes(randomType)) {
        selectedTypes.push(randomType);
      }
    }

    const puzzles = [];

    for (let i = 0; i < selectedTypes.length; i++) {
      const type = selectedTypes[i];
      const prompts = puzzlePrompts[type];
      const selectedPrompt =
        prompts[Math.floor(Math.random() * prompts.length)];

      const difficultyModifier = {
        easy: "Keep this simple and accessible for beginners.",
        medium: "Make this moderately challenging.",
        hard: "Make this quite difficult and complex.",
        expert: "Make this extremely challenging for puzzle experts.",
      };

      // Add randomization to make each puzzle unique
      const randomElements = [
        "Use different numbers or values than typical examples.",
        "Create an original scenario not commonly found in textbooks.",
        "Include unique names, places, or contexts.",
        "Vary the specific details while maintaining the puzzle logic.",
        "Use creative examples that are memorable and engaging.",
      ];
      const randomElement =
        randomElements[Math.floor(Math.random() * randomElements.length)];

      const fullPrompt = `${selectedPrompt} ${difficultyModifier[difficulty]}

IMPORTANT: ${randomElement} Make this puzzle unique and different from standard examples.

Generate a completely original puzzle. Seed for uniqueness: ${seed}-${i}

Format your response as a JSON object with these exact fields:
{
  "question": "The main puzzle question or challenge",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Brief explanation of why this is correct",
  "type": "${type}",
  "difficulty": "${difficulty}",
  "points": ${getPointsForDifficulty(difficulty)}
}

Make sure the JSON is valid and parseable. Do not include any text before or after the JSON.`;

      try {
        const puzzle = await callGeminiAPI(fullPrompt);
        if (
          puzzle &&
          puzzle.question &&
          puzzle.options &&
          Array.isArray(puzzle.options)
        ) {
          puzzles.push({ ...puzzle, id: `${seed}-${i}` });
          console.log("Generated AI puzzle:", puzzle);
        } else {
          console.warn("Invalid puzzle generated, using fallback");
          // Add a fallback puzzle if generation fails
          const fallback = getFallbackPuzzles(difficulty, userId, puzzleMode)[
            i % 3
          ];
          puzzles.push({ ...fallback, id: `${seed}-${i}` });
        }
      } catch (error) {
        console.error("Error generating individual puzzle:", error);
        // Check if it's a quota error
        if (error.message.includes("429") || error.message.includes("quota")) {
          console.log("API quota exceeded, falling back to local puzzles");
          // Return all fallback puzzles immediately
          return getFallbackPuzzles(difficulty, userId, puzzleMode);
        }
        // Add a fallback puzzle if generation fails
        const fallback = getFallbackPuzzles(difficulty, userId, puzzleMode)[
          i % 3
        ];
        puzzles.push({ ...fallback, id: `${seed}-${i}` });
      }
    }

    console.log("Final puzzles:", puzzles);
    return puzzles.length > 0
      ? puzzles
      : getFallbackPuzzles(difficulty, userId, puzzleMode);
  } catch (error) {
    console.error("Error generating puzzles:", error);
    return getFallbackPuzzles(difficulty, userId, puzzleMode);
  }
};

export const getChatbotResponse = async (message, context = "") => {
  try {
    const prompt = `You are a helpful AI assistant for a puzzle game called "Puzzle Quest".
    ${context ? `Context: ${context}` : ""}

    User message: ${message}

    Respond helpfully and encouragingly. If they're stuck on a puzzle, give hints without directly revealing the answer.
    Keep responses concise and engaging. If they ask about their progress, be supportive and motivating.

    Response:`;

    const response = await callGeminiAPI(prompt);
    return (
      response ||
      "I'm here to help! Feel free to ask me about puzzles, hints, or your progress!"
    );
  } catch (error) {
    console.error("Error getting chatbot response:", error);

    // Check if it's a quota error
    if (error.message.includes("429") || error.message.includes("quota")) {
      return "I've reached my daily chat limit, but I can still help! Try these tips: For logic puzzles, work through each option systematically. For math, break down complex problems into smaller steps. For word puzzles, think about common patterns and letter combinations. Keep practicing - you're doing great! 🧠✨";
    }

    return "Sorry, I'm having trouble right now. But remember: take your time, think step by step, and trust your instincts! 💭";
  }
};

const callGeminiAPI = async (prompt) => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No text in response");
    }

    // Try to parse as JSON for puzzles
    try {
      return JSON.parse(text);
    } catch {
      // Return as string for chatbot responses
      return text.trim();
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw error;
  }
};

const getPointsForDifficulty = (difficulty) => {
  const points = {
    easy: 10,
    medium: 25,
    hard: 50,
    expert: 100,
  };
  return points[difficulty] || 25;
};

const getFallbackPuzzles = (
  difficulty,
  userId = "guest",
  puzzleMode = "daily",
) => {
  const basePoints = getPointsForDifficulty(difficulty);
  const today = new Date().toDateString();

  // Create different puzzles based on mode and time
  let puzzleSet;
  if (puzzleMode === "practice") {
    // For practice mode, use timestamp to ensure different puzzles each time
    const timestamp = Date.now();
    puzzleSet = timestamp % 10; // 10 different sets for practice mode
  } else {
    // For daily mode, use day of year for consistent daily challenges
    const dayOfYear = Math.floor(
      (new Date() - new Date(new Date().getFullYear(), 0, 0)) /
        (1000 * 60 * 60 * 24),
    );
    puzzleSet = dayOfYear % 6; // 6 different sets for daily rotation
  }

  const puzzleSets = [
    // Set 1 - Classic Logic & Math
    [
      {
        id: `fallback-logic-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question:
          "If all roses are flowers and some flowers fade quickly, which statement must be true?",
        options: [
          "All roses fade quickly",
          "Some roses might fade quickly",
          "No roses fade quickly",
          "All flowers are roses",
        ],
        correctAnswer: 1,
        explanation:
          "Since some flowers fade quickly and all roses are flowers, some roses might be among those flowers that fade quickly.",
        type: "logic",
        difficulty: difficulty,
        points: basePoints,
      },
      {
        id: `fallback-math-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question: "What is the next number in this sequence: 2, 6, 18, 54, ?",
        options: ["108", "162", "216", "324"],
        correctAnswer: 1,
        explanation:
          "Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162",
        type: "math",
        difficulty: difficulty,
        points: basePoints,
      },
      {
        id: `fallback-word-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question: "Rearrange these letters to form a word: TNEPAL",
        options: ["PLANET", "PANTIE", "APLENT", "TALENT"],
        correctAnswer: 0,
        explanation: "TNEPAL rearranged spells PLANET",
        type: "word",
        difficulty: difficulty,
        points: basePoints,
      },
    ],
    // Set 2
    [
      {
        id: `fallback-logic2-${today}-${userId}`,
        question:
          "A clock shows 3:15. What is the angle between the hour and minute hands?",
        options: ["7.5 degrees", "15 degrees", "22.5 degrees", "30 degrees"],
        correctAnswer: 0,
        explanation:
          "At 3:15, the minute hand is at 90° and hour hand is at 97.5°, so the difference is 7.5°",
        type: "logic",
        difficulty: difficulty,
        points: basePoints,
      },
      {
        id: `fallback-math2-${today}-${userId}`,
        question:
          "If you buy 3 apples for $2 and 2 oranges for $3, what's the cost of 1 apple and 1 orange?",
        options: ["$1.50", "$2.17", "$2.50", "$3.00"],
        correctAnswer: 1,
        explanation:
          "1 apple = $2/3 = $0.67, 1 orange = $3/2 = $1.50, total = $2.17",
        type: "math",
        difficulty: difficulty,
        points: basePoints,
      },
      {
        id: `fallback-pattern2-${today}-${userId}`,
        question: "What comes next in the pattern: O, T, T, F, F, S, S, ?",
        options: ["E", "N", "T", "O"],
        correctAnswer: 0,
        explanation:
          "These are the first letters of numbers: One, Two, Three, Four, Five, Six, Seven, Eight",
        type: "pattern",
        difficulty: difficulty,
        points: basePoints,
      },
    ],
    // Set 3 - Logic Puzzles
    [
      {
        id: `fallback-logic3-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question:
          "You have two coins that add up to 30 cents. One is not a nickel. What are the two coins?",
        options: [
          "Two dimes and a nickel",
          "A quarter and a nickel",
          "Three dimes",
          "A quarter and a penny",
        ],
        correctAnswer: 1,
        explanation:
          "A quarter (25¢) and a nickel (5¢). One coin (the quarter) is not a nickel.",
        type: "logic",
        difficulty: difficulty,
        points: basePoints,
      },
      {
        id: `fallback-math3-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question: "What's 15% of 80?",
        options: ["10", "12", "15", "20"],
        correctAnswer: 1,
        explanation: "15% of 80 = 0.15 × 80 = 12",
        type: "math",
        difficulty: difficulty,
        points: basePoints,
      },
      {
        id: `fallback-word3-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question: "Which word is the odd one out?",
        options: ["LISTEN", "SILENT", "ENLIST", "TRIANGLE"],
        correctAnswer: 3,
        explanation:
          "LISTEN, SILENT, and ENLIST are all anagrams of each other, but TRIANGLE is not.",
        type: "word",
        difficulty: difficulty,
        points: basePoints,
      },
    ],
    // Set 4 - Brain Teasers
    [
      {
        id: `fallback-logic4-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question:
          "A man lives on the 20th floor. Every day he takes the elevator down to the ground floor. When he comes home, he takes the elevator to the 10th floor and walks the rest of the way... except on rainy days. Why?",
        options: [
          "He's afraid of heights",
          "He's short and can't reach button 20",
          "He likes exercise",
          "The elevator is broken",
        ],
        correctAnswer: 1,
        explanation:
          "He's too short to reach the button for the 20th floor, except when he has an umbrella on rainy days.",
        type: "logic",
        difficulty: difficulty,
        points: basePoints,
      },
      {
        id: `fallback-math4-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question:
          "If 5 cats catch 5 mice in 5 minutes, how many cats are needed to catch 100 mice in 100 minutes?",
        options: ["5 cats", "20 cats", "100 cats", "25 cats"],
        correctAnswer: 0,
        explanation:
          "Each cat catches 1 mouse in 5 minutes, so in 100 minutes each cat catches 20 mice. 5 cats catch 100 mice.",
        type: "math",
        difficulty: difficulty,
        points: basePoints,
      },
      {
        id: `fallback-pattern4-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question: "Complete the pattern: 1, 4, 9, 16, 25, ?",
        options: ["30", "36", "35", "49"],
        correctAnswer: 1,
        explanation: "These are perfect squares: 1², 2², 3², 4², 5², 6² = 36",
        type: "pattern",
        difficulty: difficulty,
        points: basePoints,
      },
    ],
    // Set 5 - Word & Number Games
    [
      {
        id: `fallback-word5-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question:
          "What 7-letter word becomes longer when the third letter is removed?",
        options: ["JOURNEY", "LOUNGER", "NUMBERS", "FRIENDS"],
        correctAnswer: 1,
        explanation:
          "LOUNGER becomes LONGER when you remove the third letter 'U'.",
        type: "word",
        difficulty: difficulty,
        points: basePoints,
      },
      {
        id: `fallback-math5-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question:
          "A store has a 25% off sale. If an item costs $60 after the discount, what was the original price?",
        options: ["$75", "$80", "$85", "$90"],
        correctAnswer: 1,
        explanation:
          "If $60 is 75% of the original price, then original price = $60 ÷ 0.75 = $80",
        type: "math",
        difficulty: difficulty,
        points: basePoints,
      },
      {
        id: `fallback-logic5-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question:
          "In a race, you passed the person in 2nd place. What place are you in now?",
        options: ["1st place", "2nd place", "3rd place", "4th place"],
        correctAnswer: 1,
        explanation:
          "If you passed the person in 2nd place, you are now in 2nd place (they're in 3rd).",
        type: "logic",
        difficulty: difficulty,
        points: basePoints,
      },
    ],
    // Set 6 - Advanced Thinking
    [
      {
        id: `fallback-pattern6-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question: "What comes next: A, E, I, M, Q, ?",
        options: ["S", "T", "U", "V"],
        correctAnswer: 2,
        explanation:
          "Each letter moves forward by 4 positions: A(+4)→E(+4)→I(+4)→M(+4)→Q(+4)→U",
        type: "pattern",
        difficulty: difficulty,
        points: basePoints,
      },
      {
        id: `fallback-math6-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question:
          "A pizza is cut into 8 equal slices. If you eat 3 slices, what fraction of the pizza remains?",
        options: ["3/8", "5/8", "1/2", "2/3"],
        correctAnswer: 1,
        explanation:
          "8 slices total - 3 eaten = 5 remaining. So 5/8 of the pizza remains.",
        type: "math",
        difficulty: difficulty,
        points: basePoints,
      },
      {
        id: `fallback-word6-${puzzleMode}-${today}-${userId}-${puzzleSet}`,
        question: "Unscramble: DWARFE → What word is this?",
        options: ["WARDEN", "WARMED", "DRAWER", "TOWARD"],
        correctAnswer: 2,
        explanation: "DWARFE unscrambled spells DRAWER",
        type: "word",
        difficulty: difficulty,
        points: basePoints,
      },
    ],
  ];

  const selectedPuzzles = puzzleSets[puzzleSet % puzzleSets.length];
  console.log(
    `Using fallback puzzle set ${puzzleSet + 1} (mode: ${puzzleMode}):`,
    selectedPuzzles,
  );
  return selectedPuzzles;
};
