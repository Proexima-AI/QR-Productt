const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'LandingPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// The new color scheme:
// Background: #F5F7F1
// Surface: #FFFFFF
// Text: #16261F
// Primary: #0E6B5C
// Gold/Stars: #F2A93B
// CTA (Coral): #FF6F59

const replacements = {
  // Backgrounds
  'bg-slate-50': 'bg-[#F5F7F1]',
  'bg-slate-100': 'bg-[#F5F7F1]',
  'bg-slate-800': 'bg-[#16261F]/90',
  'bg-slate-900': 'bg-[#16261F]',
  'bg-blue-50': 'bg-[#0E6B5C]/10',
  'bg-blue-100': 'bg-[#0E6B5C]/20',
  'bg-blue-500': 'bg-[#0E6B5C]/80',
  'bg-blue-600': 'bg-[#FF6F59]', // Converting primary buttons to Coral
  'bg-blue-700': 'bg-[#e65c49]', // Coral hover
  'bg-indigo-50': 'bg-[#0E6B5C]/10',
  'bg-indigo-100': 'bg-[#0E6B5C]/20',
  'bg-indigo-500': 'bg-[#0E6B5C]/80',
  'bg-indigo-600': 'bg-[#FF6F59]', // Also CTA coral
  'bg-indigo-700': 'bg-[#0E6B5C]/90',
  'bg-emerald-50': 'bg-[#0E6B5C]/10',
  'bg-emerald-500': 'bg-[#0E6B5C]',

  // Text
  'text-slate-300': 'text-[#F5F7F1]/70',
  'text-slate-400': 'text-[#F5F7F1]/60',
  'text-slate-500': 'text-[#16261F]/60',
  'text-slate-600': 'text-[#16261F]/70',
  'text-slate-700': 'text-[#16261F]/80',
  'text-slate-900': 'text-[#16261F]',
  'text-blue-500': 'text-[#0E6B5C]',
  'text-blue-600': 'text-[#0E6B5C]',
  'text-indigo-100': 'text-[#F5F7F1]',
  'text-indigo-200': 'text-[#F5F7F1]/80',
  'text-indigo-300': 'text-[#F5F7F1]/60',
  'text-indigo-400': 'text-[#F5F7F1]/40',
  'text-indigo-500': 'text-[#0E6B5C]',
  'text-indigo-600': 'text-[#0E6B5C]',
  'text-emerald-600': 'text-[#0E6B5C]',
  'text-amber-400': 'text-[#F2A93B]', // Stars

  // Borders
  'border-slate-100': 'border-[#16261F]/10',
  'border-slate-200': 'border-[#16261F]/15',
  'border-slate-300': 'border-[#16261F]/20',
  'border-slate-700': 'border-[#F5F7F1]/20',
  'border-slate-800': 'border-[#F5F7F1]/10',
  'border-blue-100': 'border-[#0E6B5C]/20',
  'border-blue-200': 'border-[#0E6B5C]/30',
  'border-indigo-100': 'border-[#0E6B5C]/20',
  'border-indigo-400': 'border-[#0E6B5C]/40',
  'border-indigo-500': 'border-[#0E6B5C]/50',

  // Fills & Shadows
  'fill-blue-500': 'fill-[#0E6B5C]',
  'fill-blue-600': 'fill-[#0E6B5C]',
  'fill-emerald-600': 'fill-[#0E6B5C]',
  'shadow-blue-600/20': 'shadow-[#FF6F59]/30',
  'shadow-indigo-600/20': 'shadow-[#FF6F59]/30',
  'shadow-indigo-600/30': 'shadow-[#FF6F59]/30',
};

// Replace exact class names to avoid partial matches
for (const [oldClass, newClass] of Object.entries(replacements)) {
  const regex = new RegExp(`(?<=[\\s"'\\\`])(${oldClass})(?=[\\s"'\\\`/])`, 'g');
  content = content.replace(regex, newClass);
}

// Special cases:
// Let's make sure the logo star and 'Review' text uses gold/teal correctly
content = content.replace(/text-\\[#0E6B5C\\] fill-\\[#0E6B5C\\]/g, 'text-[#F2A93B] fill-[#F2A93B]'); // Star icon
content = content.replace(/<Star className="w-8 h-8 text-\\[#0E6B5C\\] fill-\\[#0E6B5C\\]"/g, '<Star className="w-8 h-8 text-[#F2A93B] fill-[#F2A93B]"');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Colors replaced successfully!');
