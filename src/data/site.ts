// All site copy lives here so it can be edited without touching layout code.
// Copy is taken from the existing lockforce.com.au pages.

export const site = {
  name: 'Lockforce International',
  legalName: 'Lockforce International Inc.',
  tagline: 'Delivering exceptional solutions through strategic innovations',
  description:
    'Lockforce provides security, compliance, training and risk management solutions for business and government clients across Australia and Southeast Asia.',
  email: 'info@lockforce.com.au',
  linkedin: 'https://www.linkedin.com/company/lockforce-international-inc/',
  offices: [
    {
      id: 'au',
      name: 'Landsborough',
      region: 'Queensland, Australia',
      label: 'Postal address',
      lines: ['PO Box 285', 'Landsborough QLD 4550'],
      phones: [] as string[],
    },
    {
      id: 'ph',
      name: 'Makati City',
      region: 'Manila, Philippines',
      label: 'Office',
      lines: ['Unit 16A BDO Tower', '8741 Paseo de Roxas', 'Makati City 1227'],
      phones: ['+63 (0) 2 8845 0355', '+63 (0) 2 8845 0341'],
    },
  ],
};

export const nav = [
  { label: 'Security', href: '/security-services/' },
  { label: 'Training', href: '/training-services/' },
  { label: 'Compliance', href: '/compliance-services/' },
  { label: 'Products', href: '/products/' },
  { label: 'About', href: '/profile/' },
  { label: 'News', href: '/news/' },
];

// Sites the hero globe locks on to.
export const globeSites = [
  { name: 'Landsborough, Queensland', role: 'Australian office', lat: -26.81, lon: 152.97 },
  { name: 'Makati City, Manila', role: 'Philippines office, since 2011', lat: 14.55, lon: 121.02 },
  { name: 'Perth, Western Australia', role: 'Where Lockforce began in 2006', lat: -31.95, lon: 115.86 },
];

export const practices = [
  {
    slug: 'security',
    name: 'Security',
    href: '/security-services/',
    image: 'security-site.jpg',
    summary:
      'Risk-based security built on a detailed assessment: guarding, crisis management, counter-surveillance sweeps and executive protection.',
    items: ['Security risk assessments', 'Guarding services', 'Crisis management', 'TSCM bug sweeps', 'Executive protection'],
  },
  {
    slug: 'training',
    name: 'Training',
    href: '/training-services/',
    image: 'training-heat.jpg',
    summary:
      'Training shaped around your working environment, from hostile environment awareness and driver competency to online ISO auditing courses.',
    items: ['Hostile environment awareness', 'Driver training', 'Risk workshops', 'Online fire training', 'ISO auditing courses'],
  },
  {
    slug: 'compliance',
    name: 'Compliance',
    href: '/compliance-services/',
    image: 'qms.jpg',
    summary:
      'Gap analysis, internal audits and ISO management systems, plus the ongoing upkeep that keeps you audit-ready all year.',
    items: ['Gap analysis', 'Internal audits', 'ISO system development', 'System maintenance', 'Business process outsourcing'],
  },
  {
    slug: 'products',
    name: 'Products',
    href: '/products/',
    image: 'crib.jpg',
    summary:
      'Training support equipment for Defence, Police and Government: simulators, deployable live-fire ranges, targetry and ballistic protection.',
    items: ['Simulation systems', 'Deployable ranges', 'Targetry', 'Ballistic concrete', 'Non-ballistic props'],
  },
];

// Sectors named on the profile and services pages.
export const sectors = [
  { name: 'Mining', image: 'security-site.jpg', body: 'Guarding, risk assessments and issue motivated group management on resource projects.' },
  { name: 'Oil and gas', image: 'sector-oil-gas.jpg', body: 'Security experience across LNG and coal seam gas projects.' },
  { name: 'Construction', image: 'sector-construction.jpg', body: 'Security design before the build, and a licensed guard force during it.' },
  { name: 'Shipping', image: 'sector-shipping.jpg', body: 'Maritime and supply chain security services.' },
  { name: 'Transport', image: 'sector-transport.jpg', body: 'Supply chain security and driver competency training.' },
  { name: 'Defence, Police and Government', image: 'crib.jpg', body: 'Training support equipment for realistic rehearsal.' },
];

export const capabilities = [
  'Security risk assessments', 'Crisis management', 'Hostile environment training', 'ISO audits',
  'Deployable live-fire ranges', 'Executive protection', 'TSCM sweeps', 'Driver training', 'Business continuity',
];

export const whyLockforce = [
  { title: 'ISO 9001 certified', body: 'Certified to the ISO 9001 Quality Management System.', key: true },
  { title: 'ISO 27001 aligned', body: 'Complies with the requirements of the ISO 27001 Information Security Management System.', key: true },
  { title: 'Fully licensed', body: 'Compliant with every legislative requirement to operate as a business and to employ staff and contractors.' },
  { title: 'Privately owned', body: 'A privately owned, registered entity.' },
  { title: 'Right-sized', body: 'A small-to-medium enterprise, so you deal with the people doing the work.' },
  { title: 'Local, with reach', body: 'A local company with international expertise.' },
  { title: 'Experienced people', body: 'Personnel with extensive experience and qualifications across multiple industries.' },
  { title: 'Tailored to you', body: 'Services shaped to meet each client’s requirements.' },
];

/* ---------------------------------------------------------------- Security */

export const securityTerms = [
  {
    term: 'Security policy',
    def: 'A statement written and implemented by an organisation indicating that it will comply with recognised national or international standards and legislative requirements.',
  },
  {
    term: 'Security plan',
    def: 'Describes the security measures in place to manage threat scenarios identified by the security assessment.',
  },
  {
    term: 'Security assessment',
    def: 'Cites the vulnerabilities of the supply chain to define security threat scenarios.',
  },
  {
    term: 'Security penetration test',
    def: 'The physical breach of an organisation’s premises to ascertain its level of security and employee security awareness, which helps identify potential weaknesses in an operation.',
  },
];

export type Service = { id: string; name: string; image?: string; alt?: string; paras: string[]; listIntro?: string; list?: string[] };

export const securityServices: Service[] = [
  {
    id: 'risk-assessments',
    image: 'svc-risk.jpg',
    alt: 'An industrial processing plant lit up at night',
    name: 'Security risk assessments',
    paras: [
      'Lockforce provides a full security risk assessment service to clients concerned that a compromise to their organisation’s operation may be financially crippling.',
      'We conduct a full security risk assessment of an operation, and the penetration test exposes exploitable vulnerabilities. We then provide recommendations to address what we find and, where required, train employees to improve their security awareness. The complete process helps clients understand these vulnerabilities and helps their staff understand, identify and report potential security issues.',
    ],
  },
  {
    id: 'guarding',
    image: 'svc-guarding.jpg',
    alt: 'A Lockforce guard force in hard hats and high-visibility vests lined up for briefing',
    name: 'Security guarding services',
    paras: [
      'Lockforce can provide security guards to assist the client as required. Our guard force personnel are licensed and appropriately qualified, bringing the experience needed to safeguard the client’s people, property and project equipment.',
      'We have experience in the mining, oil and gas, coal seam gas and construction industries. All security personnel are properly insured and all government statutory requirements are met.',
    ],
  },
  {
    id: 'img-management',
    image: 'svc-img.jpg',
    alt: 'Silhouettes of a crowd carrying placards',
    name: 'Issue motivated group management',
    paras: [
      'Our specialised strategic services extend beyond conventional rigid security arrangements. Lockforce gained comprehensive experience over four years of managing the actions of Issue Motivated Groups (IMGs) domestically, resulting in an intimate understanding of the intent, capabilities and resources activists employ to disrupt major LNG/CSG and resource projects. Our level of expertise is unique and continues to deliver measurable success.',
    ],
    listIntro: 'We deliver the following capabilities to clients:',
    list: [
      'Business security risk, threat and vulnerability assessments to develop specific mitigation strategies, so strategic and operational objectives are maintained.',
      'Complete assessment and strategic implementation of perception management measures to mitigate negative reputational impact.',
      'Extensive experience in strategic and tactical contingency-based planning.',
    ],
  },
  {
    id: 'crisis-management',
    image: 'svc-crisis.jpg',
    alt: 'A flooded street with a road closed sign',
    name: 'Crisis management',
    paras: [
      'Lockforce provides a fast, effective and efficient reaction to a crisis or emergency management event through accurate analysis of the situation combined with a coordinated, planned response. The ultimate aim is to avoid a crisis or emergency; by engaging Lockforce early, the risk to your business is minimised.',
      'We can validate your plan through staff training and a graduated testing and exercise plan, moving your staff through discussion activities, desktop, counter-player and full simulation exercises.',
    ],
  },
  {
    id: 'tscm',
    image: 'svc-tscm.jpg',
    alt: 'A dome surveillance camera above a busy concourse',
    name: 'Technical surveillance counter measures',
    paras: [
      'Lockforce provides specialist Technical Surveillance Counter Measure (TSCM) sweeps, commonly referred to as bug sweeps, and associated services to clients who operate in a competitive and challenging business environment and need peace of mind that confidential meetings, plans and strategy workshops remain confidential.',
    ],
  },
  {
    id: 'land-based',
    image: 'svc-land.jpg',
    alt: 'Razor wire and a security camera on a perimeter fence',
    name: 'Land based security',
    paras: [
      'Lockforce is very familiar with the complex and challenging environments clients are faced with at times. Through detailed assessment of a client’s requirements, we offer workable solutions based on our expertise and experience within industry.',
    ],
    listIntro: 'Our land based security services include, but are not limited to:',
    list: [
      'Project management',
      'Security and emergency management',
      'Issue Motivated Group (IMG) management',
      'Security advisory services',
      'Corporate travel solutions',
      'Static guard force management and mentoring',
      'Security gap analysis, vulnerability assessments and surveys',
      'Security risk and threat assessments',
      'Security management system implementation',
      'Security and emergency management plans and procedures',
      'Security management system review and auditing',
      'Supply chain security services',
    ],
  },
  {
    id: 'security-design',
    image: 'svc-design.jpg',
    alt: 'A design team reviewing building plans on a screen',
    name: 'Security design',
    paras: [
      'Lockforce can provide qualified and experienced personnel to become an integral team member during the design phase, prior to construction, to ensure all security and access control aspects have been considered. Our proven methodology saves the costs associated with securing your real estate development and provides an accurate platform to protect your investment.',
    ],
  },
  {
    id: 'executive-protection',
    image: 'svc-executive.jpg',
    alt: 'A close protection officer in a dark suit',
    name: 'Executive protection services',
    paras: [
      'Lockforce specialises in top-tier executive protection for high-value individuals. Our discreet and highly effective close protection solutions are designed to mitigate risk while delivering security and peace of mind. Backed by a team of expertly trained professionals, we ensure your safety in every situation, so you can focus on what truly matters.',
    ],
  },
];

/* ---------------------------------------------------------------- Training */

export const workshops = [
  'Corporate risk',
  'Risk management',
  'Business continuity and resilience',
  'Security risk',
  'OH&S risk',
  'Driver training',
  'Hostile environment awareness',
  'High risk training',
];

export const trainingServices: Service[] = [
  {
    id: 'heat',
    image: 'svc-heat.jpg',
    alt: 'A Lockforce instructor presenting a hostile environment scenario to a class',
    name: 'Hostile Environment Awareness Training (HEAT)',
    paras: [
      'An intensive one to four-day program that helps participants safeguard their personal safety and security in unpredictable and life-threatening situations and locations.',
      'HEAT was developed for executives, employees and business travellers who work abroad and may travel to regions that, due to global societal changes, have the potential to become a hostile environment, often very quickly.',
      'The program mixes theory and practical training to give attendees the survival skill sets to supplement a safe environment when working overseas. Training can be tailored to individual needs and specifically identifies country threats, in addition to the general security knowledge outlined in the Lockforce Travel Security Handbook.',
      'It includes live scenarios in which participants apply lessons learned in a safe yet challenging environment at our facility in the Philippines.',
      'Lockforce conducts this training for organisations operating with an elevated risk profile overseas: medium and large international companies, non-government organisations and overseas embassy posts.',
    ],
  },
  {
    id: 'driver-training',
    image: 'svc-driver.jpg',
    alt: 'A car rounding a marker cone on a driver training course',
    name: 'Driver training',
    paras: [
      'Lockforce provides a number of driving packages covering not only security-oriented driving but a wide range of corporate defensive driving skills. These courses are specific to client needs, not the off-the-shelf courses generally supplied by other training providers.',
      'We conduct four-wheel drive and two-wheel drive training packages and, for some clients, Armoured Vehicle (AV) sessions, so companies can ensure drivers maintain their skills, knowledge and attitude through sound driver technique and driver Verification of Competency (VoC). Assessment is delivered by qualified personnel using the explain, demonstrate and practise methodology.',
      'Verification of Driver Competency assesses your currently employed drivers’ defensive driving capabilities. It encompasses vehicle safety checks, use of recovery equipment where required, and vehicle maintenance. Assessments are conducted in the environment your drivers may confront, so you can be sure they are operating at the safest and most competent level.',
    ],
  },
  {
    id: 'fire-training',
    image: 'svc-fire.jpg',
    alt: 'A firefighter working in front of a blaze',
    name: 'Online fire training (AS 3745-2010)',
    paras: [
      'Lockforce’s online fire training has been produced in line with Australian Standard 3745-2010, Planning for Emergencies in Facilities.',
    ],
  },
  {
    id: 'auditing-courses',
    image: 'compliance-audit.jpg',
    alt: 'Hands working through a checklist on a laptop',
    name: 'Online auditing courses',
    paras: [
      'Lockforce provides online auditing courses that help professionals and organisations show commitment and competence, with valuable training from the comfort of home. Lockforce partners with PECB to provide these courses.',
    ],
    listIntro: 'Online courses offered:',
    list: [
      'ISO 9001 (Quality Management System)',
      'ISO 45001 (Occupational Health and Safety Management System)',
      'ISO 27001 (Information Security Management System)',
    ],
  },
];

/* -------------------------------------------------------------- Compliance */

export const auditServices = [
  {
    name: 'Gap analysis',
    body: 'Identify compliance gaps and improvement opportunities by benchmarking your current practices against applicable ISO standards.',
  },
  {
    name: 'Internal audits',
    body: 'Independent, ISO-guided audits to verify compliance, strengthen system effectiveness and prepare for external certification.',
  },
  {
    name: 'ISO management system development',
    body: 'Practical, scalable ISO-compliant management systems designed and implemented in line with your business objectives.',
  },
];

export const maintenanceTasks = [
  'Update and maintain your Document Management System',
  'Monitor document review dates and schedule updates',
  'Initiate and track corrective actions, including review of supporting evidence',
  'Develop new procedures and manage document control processes',
  'Schedule and coordinate internal audits',
  'Respond to compliance-related queries and audit findings',
  'Monitor regulatory and legislative changes and update procedures as required',
  'Track equipment inspection and calibration schedules',
  'Maintain the training matrix and monitor qualification expiry dates',
  'Coordinate and schedule personnel training when required',
  'Schedule ISO certification and surveillance audits',
  'Develop training materials and presentations',
  'Prepare and issue internal conformance and compliance reports',
  'Maintain accurate, up-to-date records for easy retrieval and audit readiness',
];

export const bpoServices = [
  {
    name: 'Document development',
    body: 'Professional creation, review and maintenance of business and compliance documentation.',
  },
  {
    name: 'Human resource assistance and management',
    body: 'Support for HR administration, employee records and workforce coordination.',
  },
  { name: 'Accounting services', body: 'Payroll processing, timekeeping and basic accounting support.' },
  { name: 'Virtual assistant services', body: 'Administrative, scheduling, reporting and operational support.' },
  {
    name: 'Regulatory and statutory reporting',
    body: 'Assistance with relevant compliance and statutory documentation requirements.',
  },
];

/* ---------------------------------------------------------------- Products */

const flyer = (path: string) => `https://lockforce.com.au/wp-content/uploads/${path}`;

export const productGroups = [
  { id: 'systems', name: 'Simulation and range systems' },
  { id: 'protection', name: 'Ballistic protection' },
  { id: 'targets', name: 'Targets and props' },
];

export type Product = {
  id: string;
  name: string;
  short?: string;
  group: string;
  image: string;
  body: string;
  flyers: { label: string; href: string }[];
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: 'milo',
    name: 'Military Integrated Learning Objectives',
    short: 'MILO',
    group: 'systems',
    image: 'milo.jpg',
    body: 'A cutting-edge video target system that immerses combatants in realistic virtual scenarios, enhancing training in mission-specific interactive judgment, decision support and critical incident de-escalation.',
    flyers: [{ label: 'MILO flyer', href: flyer('2025/02/LF_MILO-Flyer.pdf') }],
    featured: true,
  },
  {
    id: 'ise',
    name: 'Immersive Shooting Environment',
    short: 'ISE',
    group: 'systems',
    image: 'ise.jpg',
    body: 'Combining cutting-edge technology and realistic scenarios, ISE takes combatant training to the next level.',
    flyers: [{ label: 'ISE flyer', href: flyer('2025/02/LF_ISE-2.0-Flyer.pdf') }],
    featured: true,
  },
  {
    id: 'aros',
    name: 'Advanced Range Operating System',
    short: 'AROS',
    group: 'systems',
    image: 'aros.jpg',
    body: 'The world’s leading advanced range operating system. Control and supervise complex live-fire practices with maximum speed and efficiency.',
    flyers: [{ label: 'AROS flyer', href: flyer('2025/02/LF_AROS-Flyer.pdf') }],
    featured: true,
  },
  {
    id: 'lfrib',
    name: 'Live Fire Range in a Box',
    short: 'LFRiB',
    group: 'systems',
    image: 'lfrib.jpg',
    body: 'A deployable, ballistically contained indoor range that takes live-fire training anywhere, with interactive video targets and scenario-based training.',
    flyers: [{ label: 'LFRiB flyer', href: flyer('2025/09/LF_LFRiB-Flyer.pdf') }],
    featured: true,
  },
  {
    id: 'crib',
    name: 'Combat Range in a Box',
    short: 'CRiB',
    group: 'systems',
    image: 'crib.jpg',
    body: 'The world’s most advanced deployable electronic range system. Transform any range into a dynamic combat marksmanship training environment.',
    flyers: [{ label: 'CRiB flyer', href: flyer('2025/02/LF_CRiB-Flyer.pdf') }],
    featured: true,
  },
  {
    id: 'amidon',
    name: 'Amidon Ballistic Concrete',
    group: 'protection',
    image: 'amidon.png',
    body: 'Proven to absorb thousands of bullets without fragmenting or ricocheting, making it the safest choice for live-fire training.',
    flyers: [{ label: 'Ballistic concrete flyer', href: flyer('2025/02/LF_Amidon-Ballistic-Concrete.pdf') }],
    featured: true,
  },
  {
    id: 'wall-pack',
    name: 'Non-Ballistic Wall Pack',
    group: 'targets',
    image: 'wall-pack.jpg',
    body: 'Training support equipment that builds reactive, cognitive and instinctive shooting skills. The Wall Pack scenario features 12 panels, 8 walls, 2 doors and 2 windows.',
    flyers: [
      { label: 'Wall Pack flyer', href: flyer('2025/02/LF_Non-Ballistic-Wall-Pack-Flyer.pdf') },
      { label: 'Configurations', href: flyer('2025/02/LF_Wall-Pack-Configurations.pdf') },
    ],
  },
  {
    id: 'sedan',
    name: 'Non-Ballistic Plastic Vehicle, Sedan',
    group: 'targets',
    image: 'sedan.png',
    body: 'A full-scale vehicle façade designed for live-fire scenarios. It conceals targets and allows for specialist shooting applications.',
    flyers: [{ label: 'Sedan flyer', href: flyer('2025/02/LF_Sedan-Flyer.pdf') }],
  },
  {
    id: 'suv',
    name: 'Non-Ballistic Plastic Vehicle, SUV',
    group: 'targets',
    image: 'suv.jpg',
    body: 'A full-scale SUV façade designed for live-fire scenarios. It conceals targets and allows for specialist shooting applications.',
    flyers: [{ label: 'SUV flyer', href: flyer('2025/02/LF_SUV_Flyer.pdf') }],
  },
  {
    id: 'murray',
    name: 'Murray Mannequin',
    group: 'targets',
    image: 'murray.jpg',
    body: 'A versatile mannequin built to withstand tough training scenarios, with a robust outer shell, customisable design and a skeletal system that gives realistic feedback in live-fire training.',
    flyers: [{ label: 'Murray flyer', href: flyer('2025/02/LF_Murray-Mannequin.pdf') }],
  },
  {
    id: 'mannequin-target',
    name: 'Mannequin Target',
    group: 'targets',
    image: 'mannequin-target.jpg',
    body: 'A versatile, three-dimensional human target for varied training scenarios. Its robust outer shell is made from resilient, self-healing polyethylene plastic.',
    flyers: [{ label: 'Mannequin Target flyer', href: flyer('2025/02/LF_Mannequin-Target-Flyer.pdf') }],
  },
  {
    id: 'targetry',
    name: 'Targetry',
    group: 'targets',
    image: 'targetry.jpg',
    body: 'Target boards extensively tested for reliability, durability and safety. Shapes and images are customised to end-user requirements in self-healing plastic, core flute and aluminium.',
    flyers: [{ label: 'Targetry flyer', href: flyer('2025/02/LF_Targetry-Flyer.pdf') }],
  },
  {
    id: 'furniture',
    name: 'Non-Ballistic Plastic Furniture',
    group: 'targets',
    image: 'furniture.jpg',
    body: 'Durable, realistic furniture items designed for specialist shooting applications, making realistic operations training safer.',
    flyers: [{ label: 'Furniture flyer', href: flyer('2025/02/LF_Furniture-Flyer.pdf') }],
  },
];

/* -------------------------------------------------------------------- News */

export const news = [
  {
    title: 'Political tension highlights the need for crisis preparedness',
    date: '2025-10-08',
    image: 'news-crisis.jpg',
    excerpt: 'Why periods of political tension are a prompt to review how ready your organisation is for a crisis.',
    href: 'https://lockforce.com.au/political-tension-highlights-the-need-for-crisis-preparedness/',
  },
  {
    title: 'Why business continuity planning is important for every business',
    date: '2022-10-31',
    image: 'news-continuity.jpg',
    excerpt: 'How security management consultants can help you prepare for the unexpected.',
    href: 'https://lockforce.com.au/guide-business-continuity-planning/',
  },
  {
    title: 'Are you ready for “The Big One”?',
    date: '2022-09-27',
    image: 'news-big-one.webp',
    excerpt: 'Disaster risk and earthquake vulnerability assessment in the Philippines, one of the world’s most vulnerable countries.',
    href: 'https://lockforce.com.au/are-you-ready-for-the-big-one/',
  },
  {
    title: 'Crisis management training',
    date: '2022-09-20',
    image: 'news-training.webp',
    excerpt: 'Preparing teams in the Philippines for natural disasters such as earthquake and fire.',
    href: 'https://lockforce.com.au/crisis-management-training/',
  },
  {
    title: 'Emergency preparedness: challenges for businesses',
    date: '2022-08-31',
    image: 'news-emergency.webp',
    excerpt: 'Business resilience and crisis management, and why every organisation needs to prepare.',
    href: 'https://lockforce.com.au/emergency-management-challenges-businesses/',
  },
  {
    title: 'Lockforce South America operations',
    date: '2022-08-22',
    image: 'news-south-america.webp',
    excerpt: 'Lockforce security consultants complete the initial phase of continuing work in South America.',
    href: 'https://lockforce.com.au/lockforce-south-america-operations/',
  },
];

/* -------------------------------------------------------------------- FAQs */

export const faqs = [
  {
    q: 'Why should I choose Lockforce?',
    paras: [
      'Lockforce is staffed by experienced and qualified professionals who aim to meet and exceed the client’s expectations and requirements through sound consultation. We continue to deliver successful work outcomes for some of the world’s largest companies, and we also work for small to medium companies who wish to expand and succeed in a competitive marketplace.',
    ],
    list: [
      'Successful business model',
      'Trusted reputation',
      'Operating to national and international standards',
      'Specialist knowledge and skills',
      'Global experience',
      'Innovative, offering new products and services',
      'Committed to providing the scope of services offered in compliance with legislation, regulations and international standards, with a high level of accountability, integrity and professionalism',
    ],
    after: [
      'Lockforce provides a full range of capabilities such as Document Management Systems, audit and compliance, implementation of management systems, land and maritime based security, and security risk, threat and vulnerability assessment and management.',
    ],
  },
  {
    q: 'What products and services does Lockforce offer?',
    paras: [
      'Lockforce provides a range of services to complement and enhance business function and, ultimately, business performance. Lockforce Document Management Systems provide a structured and user-friendly management system approach.',
      'Other services Lockforce provides are:',
    ],
    list: [
      'Occupational health and safety solutions',
      'Document Management System implementation and training',
      'Security audits, assessment and analysis, including security provider, supply chain, security systems and maritime security services',
      'Land based and facility security surveys and assessments',
      'Maritime security options',
      'Training services specific to client needs and the risk environment',
    ],
  },
  {
    q: 'How do I ensure the security of confidential company documents?',
    paras: [
      'Lockforce offers a Document Management System: an electronic system tailored to your organisation’s specific needs and budget, designed to grow as your company grows. It is designed and implemented by experienced Lockforce staff, who bring a wealth of knowledge and capability to your organisation. Lockforce will assess and minimise your exposure to risk to ensure business continuity in an ever-changing, dynamic environment. The process involves:',
    ],
    list: [
      'Client consultation throughout the process',
      'Review of the current Document Management System',
      'A Document Management System gap analysis',
      'Establishing company risk exposures in accordance with ISO 31000 Risk Management',
      'Developing the Document Management System in line with the gap analysis',
      'Implementing the Document Management System',
      'Staff training on the Document Management System',
      'Reviewing the Document Management System as per the client’s requirements',
    ],
  },
  {
    q: 'Can Lockforce provide security risk management and business resilience solutions?',
    paras: [
      'Lockforce conducts security risk management for land, maritime and critical infrastructure, using a risk-based methodology established from ISO 31000 Risk Management.',
      'As part of security risk management we also conduct criticality and vulnerability assessments. This lets organisations focus security effort on vital areas of concern, saving money and ensuring the security posture mitigates the threat and minimises risk to the organisation.',
      'Lockforce can complete the security management system for your facility in line with the current threat environment and the risks that confront your organisation, and develop the system so your organisation can mitigate business impacts and enhance resilience through the development, implementation and testing of crisis management and business continuity systems.',
    ],
  },
  {
    q: 'Does Lockforce offer occupational health and safety services?',
    paras: [
      'The Lockforce Occupational Health and Safety department is a valuable part of our integrated team. With the development of a Safety Management System comes practical guidance in providing the right occupational health and safety solutions for your organisation. Lockforce conducts a safety gap analysis to identify areas that require attention, which ensures time and cost efficiency.',
      'The ability to identify risks is an integral part of any occupational health and safety system. Lockforce will facilitate and conduct risk management as part of the Safety Management System.',
      'Lockforce ensures the solution is compatible with your organisation and reflects the requirements of current occupational health and safety legislation.',
    ],
  },
];
