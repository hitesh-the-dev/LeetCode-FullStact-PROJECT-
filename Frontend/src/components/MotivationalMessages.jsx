const motivationalMessages = [
  "Great job! 🎉",
  "Excellent work! ⭐",
  "You're on fire! 🔥",
  "Keep it up! 💪",
  "Amazing! 🌟",
  "Outstanding! 🏆",
  "Fantastic! 🚀",
  "Well done! 👏",
  "Brilliant! ✨",
  "Keep moving! 🏃‍♂️",
  "Let's go to the next question! 🎯",
  "You're crushing it! 💯",
  "Incredible! 🤩",
  "Perfect! 🎯",
  "You're unstoppable! ⚡",
  "Awesome! 🎊",
  "Keep pushing forward! 🚀",
  "You're doing great! 🌈",
  "Excellent progress! 📈",
  "Way to go! 🎉"
];

const getRandomMessage = () => {
  return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
};

export { getRandomMessage };
