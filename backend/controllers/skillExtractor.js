import fs from 'fs';

const skillsList = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'SQL',
  'Java', 'C++', 'AWS', 'Docker', 'Kubernetes', 'HTML', 'CSS', 'Next.js'
];

export const extractSkills = async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const data = await pdfParse(pdfBuffer);
    const text = data.text.toLowerCase();

    const extracted = skillsList.filter(skill =>
      text.includes(skill.toLowerCase())
    );

    res.json({ extractedSkills: [...new Set(extracted)] });
  } catch (err) {
    res.status(500).json({ error: 'Skill extraction failed', details: err });
  }
};
