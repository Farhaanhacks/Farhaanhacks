// Site-wide content for the SkillUp SA website.
// All copy below is taken word-for-word from the current skillupsa.com.au site.
import { readFileSync } from 'node:fs';

export const courses = JSON.parse(readFileSync(new URL('./courses.json', import.meta.url), 'utf8'));
// Meta descriptions, copied from the current site (keyed by page slug).
export const descriptions = JSON.parse(readFileSync(new URL('./descriptions.json', import.meta.url), 'utf8'));

// Where the CRM's public enquiry form lives. Leave empty to show the placeholder.
// Example: 'https://crm.skillupsa.com.au/enquire'
export const CRM_ENQUIRE_URL = process.env.CRM_ENQUIRE_URL || '';

export const contact = {
  street: '39 - 44 Patterson Street,',
  suburb: 'Whyalla SA 5600',
  phone: '0405 124 211',
  phoneHref: 'tel:+61405124211',
  email: 'enquiry@skillupsa.com.au',
  postal: ['PO Box 399', 'Walkerville, Adelaide SA 5081'],
  hours: [
    ['Monday - Friday', '9:00 - 17:00'],
  ],
  mapQuery: '40-44 Patterson Street, Whyalla SA 5600',
  social: [
    ['Facebook', 'https://www.facebook.com/skillupsa'],
    ['Instagram', 'https://www.instagram.com/skillup_sa'],
    ['LinkedIn', 'https://www.linkedin.com/company/skillupsa/'],
  ],
};

// Where the award banner and the Government of SA logo link to.
export const AWARD_URL = 'https://skillscommission.sa.gov.au/2026-sata-winners/ace-provider-of-the-year';
export const GOV_SUPPORT_URL = AWARD_URL; // the Government of SA logo opens the same page; swap in another link here if needed

// SA Training Awards 2026 highlights video (SA Skills Commission, on Vimeo)
export const awardVideo = {
  vimeoId: '1248526977',
  title: '2026 SA Training Awards Highlights',
  length: '1:59',
  poster: 'sa-training-awards-2026',
  posterAlt: 'Winners on stage at the 2026 SA Training Awards',
};

export const award = 'Proud Winner of the 2026 SA Training Award for Adult Community Education Provider of the Year!';
export const slogan = 'Be future-proof and future-ready';

// Course categories, grouped exactly as on the current "Our Courses" page.
export const categories = [
  { id: 'digital', name: 'Digital Skills Courses', image: 'cat-digital', alt: 'Adult learners working at computers in a training room' },
  { id: 'business', name: 'Business Courses', image: 'cat-business', alt: 'a woman sitting at a table using a laptop' },
  { id: 'project', name: 'Project Management', image: 'cat-project', alt: 'man in black crew neck t-shirt sitting on brown wooden chair' },
  { id: 'leadership', name: 'Leadership and Management', image: 'cat-leadership', alt: 'three men sitting while using laptops and watching man beside whiteboard' },
  { id: 'foundation', name: 'Foundation Skills Courses', image: 'cat-foundation', alt: 'A trainer leading a small group discussion' },
  { id: 'numeracy', name: 'Numeracy Skills Courses', image: 'cat-numeracy', alt: 'Hands measuring timber with a ruler and pencil' },
].map((c) => ({ ...c, courses: courses.filter((x) => x.category === c.id) }));

// ACE programmes (copy from the "ACE Programs Whyalla" page).
export const acePrograms = [
  {
    slug: 'skillup-for-service-roles',
    name: 'SkillUp for Service Roles',
    blurb: 'Build confidence and upskill your language, literacy, numeracy, and digital skills for success in hospitality, retail and tourism jobs.',
    image: 'ace-service-roles',
    alt: 'A smiling barista serving a customer at a café counter',
    flyers: [
      ['flyer-service-roles-1', 'SkillUp for Service Roles flyer, page 1: gain skills for jobs in the retail and hospitality sectors with accredited training. Subsidised training in Whyalla. Call 0405 124 211 or email enquiry@skillupsa.com.au.'],
      ['flyer-service-roles-2', 'SkillUp for Service Roles flyer, page 2: the essential skills employers expect in the retail and hospitality sectors, with pathways to Certificate III qualifications and the accredited units of competency covered.'],
    ],
  },
  {
    slug: 'skillup-get-work-ready',
    name: 'SkillUp: Get Work Ready',
    blurb: 'Build the “skills that matter” to enter or re-enter the workforce, while strengthening your LLND (Language, Literacy, Numeracy and Digital) foundation skills.',
    image: 'ace-get-work-ready',
    alt: 'Three workers, one in high-visibility gear, smiling together',
    flyers: [
      ['flyer-get-work-ready-1', 'Foundations to Workforce Success flyer, page 1: build the skills that matter to enter or re-enter the workforce while strengthening your LLND foundation skills. Subsidised training in Whyalla. Call 0405 124 211 or email enquiry@skillupsa.com.au.'],
      ['flyer-get-work-ready-2', 'Foundations to Workforce Success flyer, page 2: the essential skills employers expect in any workplace, with a pathway to BSB30120 Certificate III in Business and the accredited units of competency covered.'],
    ],
  },
  {
    slug: 'kickstart-your-career-in-childcare',
    name: 'Kickstart Your Career in Childcare',
    blurb: 'Gain skills for jobs in the Early Childhood Education and Care sector, while strengthening your LLND (Language, Literacy, Numeracy, and Digital) foundation skills.',
    image: 'ace-childcare',
    alt: 'Two adults and a young child building with colourful blocks',
    flyers: [
      ['flyer-childcare-1', 'Kickstart Your Career in the Childcare Industry flyer, page 1: gain skills for jobs in the Early Childhood Education and Care sector while strengthening your LLND foundation skills. Subsidised training in Whyalla. Call 0405 124 211 or email enquiry@skillupsa.com.au.'],
      ['flyer-childcare-2', 'Kickstart Your Career in the Childcare Industry flyer, page 2: the essential skills employers expect in the childcare industry, with a pathway to CHC30121 Certificate III in Early Childhood Education and Care and the accredited units of competency covered.'],
    ],
  },
  {
    slug: 'computer-basics-for-life-and-work',
    name: 'Computer Basics for Life and Work',
    blurb: 'Build confidence using a computer, even if you have barely used one before, while strengthening your LLND (Language, Literacy, Numeracy and Digital) foundation skills.',
    image: 'ace-computer-basics',
    alt: 'Four adults of different ages smiling around a laptop',
    flyers: [
      ['flyer-computer-basics', 'Computer Basics for Life and Work flyer: subsidised by the Government of South Australia. Build confidence using a computer and develop your language, literacy and numeracy skills, including computer operation, Microsoft Word, Excel, internet and emails, file management and resume creation. Whyalla. Limited spots available. Call 0405 124 211 or email enquiry@skillupsa.com.au.'],
    ],
  },
];

// Page copy ------------------------------------------------------------------

export const home = {
  heroEyebrow: 'Comprehensive Training Courses',
  heroTitle: 'Acquire the Skills You Need to Succeed',
  aceTitle: 'Adult Community Education Programs',
  ace: {
    title: 'Adult Community Education (ACE)',
    quote: 'It is a mission that drives us every day.',
    lede: 'At SkillUp SA, Adult Community Education is more than just training. It is a mission that drives us every day.',
    paras: [
      'We deliver our ACE programs across regional South Australia with dedication, heart, and a deep commitment to making a meaningful difference. For us, it is not only about skills. It is about helping people grow in confidence, reconnect with learning, and take the next steps toward a brighter future.',
      'Whether we are supporting foundation skills like reading, writing, numeracy, digital literacy, or communication, or focusing on employability skills, confidence, and workplace readiness, we give it our all. We believe in meeting our participants where they are and walking alongside them on their journey.',
      'Founded on the belief that education should be accessible, relevant, and inspiring, SkillUp SA fosters emotional safety and trust in adults who face complex barriers, including low literacy, disability, long-term unemployment, regional isolation, cultural diversity, and recovery from overwhelming setbacks.',
      'Our programs are shaped by real community needs, informed by our partnerships with local organisations, and delivered with care. We are proud to walk alongside our participants as they build confidence, strengthen their skills, and move towards meaningful pathways in life, learning, and work.',
    ],
  },
  // Home "About" section (client copy, Nov 2026)
  why: {
    title: 'Building Workforce Capability for Regional South Australia',
    paras: [
      'SkillUp SA is a Whyalla based South Australian workforce development organisation committed to strengthening regional communities through foundation skills, workforce capability and employment pathways.',
      'We partner with government, employers, Registered Training Organisations and community organisations to design and deliver practical workforce solutions that respond to regional skills shortages, emerging industries and local economic priorities. Our work focuses on preparing people for sustainable employment while helping employers develop capable, confident and job-ready workforces.',
      "Rather than simply delivering training, SkillUp SA integrates foundation skills, vocational education and industry engagement to create meaningful pathways into employment. Through collaborative partnerships and innovative program design, we contribute to stronger regional economies and Australia's future workforce.",
    ],
  },
  // Home "Capability Statement" band (client copy, Nov 2026)
  capability: {
    eyebrow: 'Capability Statement',
    title: 'Developing People. Strengthening Workforces. Growing Communities.',
    intro: 'SkillUp SA specialises in the design and delivery of contextualised workforce development programs that align education with real industry needs. We work across metropolitan and regional South Australia, supporting individuals, employers and communities through practical, industry-connected learning.',
    listTitle: 'Our capability includes:',
    list: [
      'Workforce Development and Employment Pathway programs',
      'Work Readiness and Employability Skills',
      'Language, Literacy, Numeracy and Digital Capability (Foundation Skills)',
      'Accredited and Non-Accredited Vocational Education',
      'Leadership and Supervisory Development Programs',
      'Instructional Design and Learning Resource Development',
      'Industry Engagement and Employer Partnerships',
      'Community Capacity Building and Regional Workforce Projects',
      'Workforce Capability Consulting and Program Design',
    ],
    paras: [
      'Our programs are contextualised to meet the needs of priority industries including energy, mining, civil construction, infrastructure, manufacturing, care and community services, hospitality, business services and local government.',
      'SkillUp SA has particular expertise in supporting people who face barriers to workforce participation, including individuals with low foundation skills, culturally and linguistically diverse (CALD) communities, First Nations learners and those experiencing long-term unemployment. By embedding foundation skills within authentic vocational contexts, we help learners build the confidence, capability and resilience needed to succeed in further training, employment and lifelong learning.',
    ],
  },
  skilled: {
    title: 'Become a Skilled Professional',
    paras: [
      'Join our training programs and become a skilled professional in leadership and management, project management, business, customer service, and more. Our training curriculum is specifically designed to equip you with the necessary knowledge and tools to succeed in your chosen field.',
      "Our experienced instructors provide hands-on training and guidance to ensure that you gain practical skills that can be applied in real-world situations. With our training, you will be able to enhance your career prospects and stand out in a competitive job market. Don't miss out on this opportunity to invest in your future and join us to become a leader in your industry.",
    ],
  },
  computer: {
    title: "Boost your Computer Skills: A Beginner's Guide to Expertise",
    paras: [
      'This is the perfect course for individuals looking to improve their computer skills. This guide is tailored to those who are not particularly adept at computers, making it easy to follow and understand.',
      'With basic computer topics like MS Word, MS Excel, Powerpoint, Internet and Email etc. this guide covers everything you need to become a computer expert. With step-by-step instructions, helpful tips, and practical examples, you\'ll build confidence in your ability to use computers effectively. Whether you\'re looking to improve your job prospects or simply keep up with the ever-changing technological landscape, "Boost Your Computer Skills" is the perfect resource for beginners looking to become experts.',
    ],
  },
  corporate: {
    title: 'Customised Corporate Programs',
    paras: [
      'We provide tailored corporate training programs designed to address the skill gaps within your organization.',
      'Our experienced trainers ensure that your employees receive the specific skills and knowledge that your business needs to succeed. We work closely with you to identify areas that require development and create a program that is tailored to your specific requirements.',
      'Our training programs can cover a range of topics, from technical skills to leadership and management development. We pride ourselves on delivering high-quality training that is engaging, interactive, and practical.',
      'With our customised corporate programs, you can be confident that your employees are receiving the training they need to excel in their roles and drive your business forward.',
    ],
  },
};

export const about = {
  paras: [
    "SkillUp SA is a leading training provider offering comprehensive and practical courses in Digital and Business skills. Our team of expert trainers are passionate about helping individuals and businesses grow and succeed in today's fast-paced competitive world.",
    "At SkillUp SA, we understand that everyone's learning journey is unique. That's why we offer flexible scheduling and personalised attention to ensure that each client gets the most out of their experience with us. Whether you're looking to start a new career or enhance your existing skills, we have a course that's right for you.",
    "We also offer customised training solutions tailored to meet the specific requirements of our corporate clients. Our training courses are designed to improve the skills and productivity of your employees and ensure that your business stays competitive in today's market.",
    'Whether you are an individual looking to enhance your skills or a corporation seeking to improve the knowledge and productivity of your workforce, SkillUp SA has the right training program for you. Our face-to-face classes are conducted on weekdays and weekends, making it easy for you to learn at your own pace and schedule.',
    'Join us today and take the first step towards achieving your professional and business goals!',
  ],
};

export const team = {
  intro: [
    'At SkillUp SA, we have a dedicated team of professionals who bring together a wealth of experience, expertise, and industry knowledge to deliver exceptional training programs.',
    'Let us showcase the invaluable expertise and extensive experience of our esteemed team members, exemplifying their profound impact on the training industry.',
  ],
  strengths: [
    ['Certificate IV Training and Assessment TAE40116', 'Our team members have obtained the Certificate IV Training and Assessment (TAE40116), demonstrating their commitment to acquiring the necessary skills and knowledge to design and deliver high-quality training programs. This qualification directly aligns with our focus on delivering foundation skills training and support to our participants.'],
    ['Assessment Expertise', "Our team members are experienced in assessing against nationally accredited units of competency. They possess the knowledge and skills to accurately evaluate participants' skills and knowledge, ensuring that our assessment processes align with industry standards and provide reliable outcomes."],
    ['Flexible Availability', "Our team members are committed to providing accessible training opportunities for our participants. They are available to work on weekends, expanding the options for participants to attend training sessions at their convenience. Additionally, their possession of a valid driver's license enables them to travel and deliver training in various locations, reaching a wider range of participants."],
    ['Experience in Training Management', 'With experience as Training Managers at reputable organisations, our team members have successfully overseen the learning and development of diverse groups. This valuable experience in managing and delivering training programs in real-world work environments allows our team to tailor the foundation skills training to meet the specific needs and challenges faced by our participants.'],
    ['Vocational Education and Training (VET) Sector Expertise', 'Our team possesses in-depth knowledge and experience in the vocational education and training (VET) sector. With several years of experience working in Registered Training Organisations (RTOs), they have a deep understanding of industry best practices and national accreditation standards. This expertise enables us to align our training programs with industry requirements and deliver high-quality education.'],
    ['Diverse Educational Background', 'Our team members bring a diverse educational background to our training company. With qualifications such as engineering degrees, science graduates, and MBAs, they possess a broad range of knowledge and skills that contribute to the development and delivery of comprehensive training programs'],
    ['Experience Training Different Cohorts', 'Our team members have extensive experience in training and facilitating various cohorts, including individuals from different backgrounds, skill levels, and learning styles. This experience allows us to adapt our training approaches and methodologies to create engaging and effective learning experiences for all participants.'],
    ['Digital Skills and Technology Integration', 'Our team members have hands-on experience in creating quality digital assets and courseware for Learning Management Systems (LMS). Their expertise in leveraging technology enhances the delivery of our training programs, providing participants with flexible learning options and effective digital learning experiences.'],
    ['Adaptable Facilitation Skills', 'With experience in both online and classroom training, our team members are skilled in adapting their facilitation style to different learning environments. This adaptability ensures that our training programs can be delivered effectively and confidently, catering to the diverse needs of our participants.'],
    ['Active Pursuit of Further Qualifications', 'Our team members are dedicated to continuous professional development and staying up to date with the latest industry standards and practices. They are actively pursuing further qualifications in the field of training and assessment, ensuring that our training programs remain at the forefront of excellence.'],
    ['Leadership and Mentoring', 'Our team members have a proven track record of effective leadership and mentorship. They provide oversight, inspiration, motivation, and support to both our project team and the participants. Their leadership skills create a supportive environment that fosters growth and development for all involved.'],
  ],
  closing: "By leveraging their skills, expertise, and industry knowledge, our team plays a crucial role in delivering high-quality training programs and ensuring the success of our projects. Their dedication to professional development, experience in the VET sector, and commitment to supporting participants' growth make them invaluable assets to our training company",
};

export const ourCourses = {
  lede: "We offer a variety of Computer and Business programs to help you build the skills necessary to succeed in today's business world.",
  paras: [
    'Our experienced instructors will guide you through the course material, providing personalised feedback and support along the way.',
    'You will benefit from their practical insights and real-world experience, and you will have the opportunity to apply your learning to real-life scenarios.',
    "You'll have access to updated learning resources and in-class experience where you can connect with other students and share your experiences.",
  ],
};

export const contactPage = {
  intro: 'Feel free to contact us with any questions or concerns. You can use the form on our website or email us directly. We appreciate your interest and look forward to hearing from you.',
};
