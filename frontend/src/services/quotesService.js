// Collection of motivational quotes for students
const motivationalQuotes = [
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown",
  },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown",
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown",
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown",
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown",
  },
  {
    text: "Dream bigger. Do bigger.",
    author: "Unknown",
  },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "Unknown",
  },
  {
    text: "Wake up with determination. Go to bed with satisfaction.",
    author: "Unknown",
  },
  {
    text: "Do something today that your future self will thank you for.",
    author: "Sean Patrick Flanery",
  },
  {
    text: "Little progress is still progress.",
    author: "Unknown",
  },
  {
    text: "The key to success is to focus on goals, not obstacles.",
    author: "Unknown",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
  },
]

// Get a random motivational quote
export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
  return motivationalQuotes[randomIndex]
}

// Get quote based on time of day
export const getTimeBasedQuote = () => {
  const hour = new Date().getHours()
  let timeSpecificQuotes = []

  if (hour >= 5 && hour < 12) {
    // Morning quotes
    timeSpecificQuotes = [
      {
        text: "Every morning we are born again. What we do today is what matters most.",
        author: "Buddha",
      },
      {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
      },
      {
        text: "Today is your opportunity to build the tomorrow you want.",
        author: "Ken Poirot",
      },
    ]
  } else if (hour >= 12 && hour < 17) {
    // Afternoon quotes
    timeSpecificQuotes = [
      {
        text: "Don't let yesterday take up too much of today.",
        author: "Will Rogers",
      },
      {
        text: "You are never too old to set another goal or to dream a new dream.",
        author: "C.S. Lewis",
      },
      {
        text: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins",
      },
    ]
  } else {
    // Evening quotes
    timeSpecificQuotes = [
      {
        text: "What we plant in the soil of contemplation, we shall reap in the harvest of action.",
        author: "Meister Eckhart",
      },
      {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain",
      },
      {
        text: "Tomorrow is the first day of the rest of your life.",
        author: "Abbie Hoffman",
      },
    ]
  }

  const randomIndex = Math.floor(Math.random() * timeSpecificQuotes.length)
  return timeSpecificQuotes[randomIndex]
}

// Get quote based on user's progress/mood
export const getMotivationalQuote = (context = "general") => {
  switch (context) {
    case "morning":
    case "afternoon":
    case "evening":
      return getTimeBasedQuote()
    case "encouragement":
      return {
        text: "You're doing great! Keep pushing forward, every small step counts.",
        author: "EduMateAI",
      }
    case "deadline":
      return {
        text: "Deadlines are not meant to stress you, but to help you prioritize and focus.",
        author: "EduMateAI",
      }
    default:
      return getRandomQuote()
  }
}
