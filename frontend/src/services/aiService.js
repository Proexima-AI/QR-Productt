import { GoogleGenAI } from '@google/genai';

// Offline Smart Review Templates for fallback or API key absence
const FALLBACK_TEMPLATES = {
  restaurant: {
    5: [
      "Had an absolutely incredible experience at {business}! The food was fresh and delicious, and the service was warm and attentive. You can really tell they care about quality. Highly recommend to anyone looking for a top-tier meal!",
      "Hands down one of the best places in town! We tried {business} and everything from the atmosphere to the meal was 10/10. {chips} made the visit extra special. Will definitely be coming back often!",
      "Super impressed with {business}! Outstanding quality, super clean environment, and wonderful staff. If you're looking for great food and amazing service, this is the spot!"
    ],
    4: [
      "Really enjoyed our visit to {business}! Great food quality and friendly service. {chips}. Overall a wonderful spot that I'd happily recommend!",
      "Solid 4-star experience at {business}. Tasty dishes, prompt service, and nice ambiance. Will definitely return with friends!"
    ],
    3: [
      "Feedback for {business}: The overall visit was decent, but there's room for improvement regarding {chips}. Hope to see things polished up next time.",
      "An average experience at {business}. The team was polite, but service speed and food temperature could be better."
    ],
    2: [
      "Private Manager Feedback for {business}: I was somewhat disappointed during my visit today. Issues around {chips} affected our experience. Please address this with your team.",
      "Feedback: My visit to {business} did not meet expectations. The staff were polite, but we encountered delay and quality issues with {chips}."
    ],
    1: [
      "Urgent Manager Feedback for {business}: Unfortunately, my experience today was far below expected standards. Key issues involved {chips}. I hope management reviews this promptly.",
      "Direct Feedback: Had a frustrating visit to {business}. Problems with service speed and attention to detail need immediate management focus."
    ]
  },
  salon: {
    5: [
      "I am so thrilled with my visit to {business}! The team is exceptionally skilled, professional, and attentive. The atmosphere is relaxing and spotless. {chips}. Definitely my go-to salon from now on!",
      "Best salon experience ever at {business}! They listened closely to what I wanted and delivered beyond expectations. Highly professional and friendly service!"
    ],
    4: [
      "Great experience at {business}! Professional stylists, nice ambiance, and great attention to detail. {chips}. Highly recommended!",
      "Very happy with my service at {business}. Polite staff and clean facility. Will book again!"
    ],
    3: [
      "Feedback for {business}: Stylist was courteous, but appointment wait time and overall service details ({chips}) could be improved.",
      "Fair service at {business}, but felt a bit rushed during the session."
    ],
    2: [
      "Private Feedback for {business}: Was not entirely satisfied with my appointment. Noticed concerns regarding {chips}. Hope management takes steps to improve.",
      "Feedback: Expecting better results at {business}. Communication and timing fell short today."
    ],
    1: [
      "Direct Manager Feedback: Very disappointed with my visit to {business} today. Serious issues with {chips}. Please reach out to resolve this."
    ]
  },
  medical: {
    5: [
      "Dr. and the entire staff at {business} are truly top-notch! From the moment you walk in, you're treated with care, compassion, and high professionalism. {chips}. Highly recommend them for anyone seeking trustworthy care!",
      "Outstanding care at {business}! Extremely clean facility, zero wait time, and a super comforting team. 5 stars all the way!"
    ],
    4: [
      "Very positive experience at {business}. Courteous front desk, knowledgeable practitioners, and very clean clinic. {chips}."
    ],
    3: [
      "Feedback for {business}: Good medical care, but front office wait times and scheduling ({chips}) need improvement."
    ],
    2: [
      "Private Feedback for {business}: Care was fine, but administrative delays and communication issues ({chips}) made the visit stressful."
    ],
    1: [
      "Direct Manager Feedback: Unhappy with the service experience at {business} today due to {chips}. Requesting management review."
    ]
  },
  default: {
    5: [
      "I had a fantastic experience with {business}! Outstanding quality, extremely friendly team, and quick, dependable service. {chips}. Couldn't ask for better service, will definitely return!",
      "5 stars for {business}! They exceeded all expectations with their professionalism and care. Highly recommended to everyone!"
    ],
    4: [
      "Great experience working with {business}. Professional, timely, and high quality overall. {chips}. Will use their service again!"
    ],
    3: [
      "Feedback for {business}: Service was acceptable, though attention to detail regarding {chips} could make it much better."
    ],
    2: [
      "Private Manager Note for {business}: Visited today and encountered notable issues with {chips}. Hope management addresses this soon."
    ],
    1: [
      "Direct Feedback for {business}: Disappointed with the service today regarding {chips}. Please review internal handling."
    ]
  }
};

/**
 * Generate Review text using Gemini API or Smart Fallback
 */
export async function generateAIReview({
  businessName = "Our Business",
  category = "restaurant",
  rating = 5,
  selectedChips = [],
  tone = "Enthusiastic",
  apiKey = "",
  customKeywords = ""
}) {
  const chipsText = selectedChips.length > 0
    ? selectedChips.join(", ")
    : "overall quality and hospitality";

  const effectiveApiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (effectiveApiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: effectiveApiKey });
      const prompt = rating >= 4
        ? `Write a natural, authentic, human-sounding ${rating}-star Google review for a business named "${businessName}" (Category: ${category}).
           Highlights to include: ${chipsText}.
           Tone: ${tone}.
           Keywords to naturally mix in if fitting: ${customKeywords}.
           Rules: Keep it between 2 to 4 sentences. Do NOT use cheesy fake buzzwords. Make it sound like a real happy local customer writing on their mobile phone. Output ONLY the raw review text, nothing else.`
        : `Write constructive, respectful private feedback for the owner of "${businessName}" (Category: ${category}) explaining a ${rating}-star customer visit experience.
           Mention customer concerns regarding: ${chipsText}.
           Keep it professional and concise (2-3 sentences). Output ONLY the feedback text.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn("Gemini API call fell back to local template generator:", err);
    }
  }

  // Fallback Template Generator
  const catTemplates = FALLBACK_TEMPLATES[category] || FALLBACK_TEMPLATES.default;
  const ratingTemplates = catTemplates[rating] || catTemplates[5];
  const template = ratingTemplates[Math.floor(Math.random() * ratingTemplates.length)];

  let generated = template
    .replaceAll("{business}", businessName)
    .replaceAll("{chips}", chipsText ? `especially the ${chipsText.toLowerCase()}` : "their great work");

  if (tone === "Short & Sweet") {
    const firstSentence = generated.split(". ")[0] + ".";
    return firstSentence;
  } else if (tone === "Detailed & Comprehensive" && rating >= 4) {
    generated += ` If you are in the area, definitely give ${businessName} a try!`;
  }

  return generated;
}
