export interface ChatQA {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export const ELECTION_QA: ChatQA[] = [
  // --- Basics ---
  {
    id: 1,
    category: 'Basics',
    question: 'What is the Election Commission of India (ECI)?',
    answer: 'The Election Commission of India (ECI) is an autonomous constitutional body established under Article 324 of the Indian Constitution. It is responsible for administering election processes in India at both the national and state levels. The ECI ensures free, fair, and transparent elections across the country.'
  },
  {
    id: 2,
    category: 'Basics',
    question: 'What are the different types of elections in India?',
    answer: 'India conducts several types of elections:\n\n• **Lok Sabha Elections** – General elections to elect Members of Parliament to the lower house (543 seats).\n• **Rajya Sabha Elections** – Elections to the upper house, conducted by elected MLAs.\n• **State Assembly (Vidhan Sabha) Elections** – To elect MLAs for state legislatures.\n• **Local Body Elections** – Panchayat and Municipal elections conducted by State Election Commissions.\n• **By-elections** – Held to fill vacancies that arise between general elections.'
  },
  {
    id: 3,
    category: 'Basics',
    question: 'How often are general elections held in India?',
    answer: 'General elections (Lok Sabha) are held every **5 years** unless the Lok Sabha is dissolved earlier. State Assembly elections also follow a 5-year cycle but are held on different schedules depending on the state. The Election Commission announces the exact dates through an official notification.'
  },
  {
    id: 4,
    category: 'Basics',
    question: 'What is the Model Code of Conduct (MCC)?',
    answer: 'The Model Code of Conduct (MCC) is a set of guidelines issued by the ECI that comes into effect the moment elections are announced. Key rules include:\n\n• No party can use government machinery for campaigning.\n• Ministers cannot announce new schemes or projects.\n• No appeals to caste or communal feelings.\n• Campaign silence must be observed 48 hours before polling.\n• No distribution of liquor, money, or gifts to voters.\n\nViolation of MCC can result in strict action by the ECI.'
  },
  // --- Voter Eligibility ---
  {
    id: 5,
    category: 'Voter Eligibility',
    question: 'Who is eligible to vote in Indian elections?',
    answer: 'To be eligible to vote in India, a citizen must:\n\n• Be an **Indian citizen**.\n• Be at least **18 years of age** on the qualifying date (1st January of the year of revision of the electoral roll).\n• Be a **resident** of the constituency where they wish to vote.\n• Be registered in the **Electoral Roll** of that constituency.\n• Not be disqualified under any law (e.g., unsoundness of mind, convicted of certain offences).'
  },
  {
    id: 6,
    category: 'Voter Eligibility',
    question: 'How can I register as a voter?',
    answer: 'You can register as a voter through these methods:\n\n1. **Online** – Visit the National Voters\' Service Portal (voters.eci.gov.in) and fill Form 6.\n2. **Voter Helpline App** – Download the app and submit Form 6 digitally.\n3. **Offline** – Visit your nearest Electoral Registration Office (ERO) and submit a physical Form 6 along with proof of age and address.\n\nYou will receive an **EPIC (Voter ID Card)** after successful verification.'
  },
  {
    id: 7,
    category: 'Voter Eligibility',
    question: 'What documents are needed for voter registration?',
    answer: 'For voter registration (Form 6), you need:\n\n• **Proof of Age** – Birth certificate, Class 10 marksheet, passport, or Aadhaar card.\n• **Proof of Address** – Aadhaar card, utility bill, ration card, bank passbook, or rent agreement.\n• **Passport-size photograph** (recent).\n\nIf applying online, scanned copies of these documents must be uploaded.'
  },
  {
    id: 8,
    category: 'Voter Eligibility',
    question: 'Can NRIs vote in Indian elections?',
    answer: 'Yes! NRIs (Non-Resident Indians) can vote in Indian elections. Since 2011, NRIs holding valid Indian passports can register as overseas electors under Section 20A of the Representation of the People Act, 1950. However, they must be **physically present** at their registered polling station on election day to cast their vote. Postal ballot facility for NRIs has also been proposed.'
  },
  // --- Voting Process ---
  {
    id: 9,
    category: 'Voting Process',
    question: 'What is the step-by-step voting process on election day?',
    answer: 'Here is the step-by-step voting process:\n\n1. **Visit your polling station** during polling hours (typically 7 AM – 6 PM).\n2. **Stand in queue** and wait for your turn.\n3. **Show your Voter ID** or any approved identity document to the polling officer.\n4. **Get verified** – Your name is checked in the electoral roll and indelible ink is applied to your left index finger.\n5. **Receive a slip** and proceed to the EVM booth.\n6. **Cast your vote** by pressing the button next to your preferred candidate on the EVM.\n7. **Collect VVPAT slip** – Verify your vote on the VVPAT paper trail (visible for 7 seconds).\n8. **Exit the booth** quietly.'
  },
  {
    id: 10,
    category: 'Voting Process',
    question: 'What is NOTA and how does it work?',
    answer: 'NOTA stands for **"None of the Above."** It was introduced by the Supreme Court of India in 2013 to give voters the right to reject all candidates. NOTA is the **last option** on the EVM. If a voter does not find any candidate suitable, they can press the NOTA button.\n\nHowever, even if NOTA receives the highest votes, the candidate with the most votes among the contesting candidates still wins. NOTA is a way to formally register dissatisfaction.'
  },
  {
    id: 11,
    category: 'Voting Process',
    question: 'What ID documents are accepted at the polling station?',
    answer: 'The following documents are accepted for voter identification:\n\n• **EPIC** (Voter ID Card) – Primary document.\n• Aadhaar Card\n• MGNREGA Job Card\n• Passbook with photo (issued by bank/post office)\n• Health Insurance Smart Card (CGHS/RSBY)\n• Driving License\n• PAN Card\n• Indian Passport\n• Pension document with photograph\n• Service ID card (for government employees)\n• Student ID card (issued by university/college)\n• MPs/MLAs/MLCs identity cards'
  },
  // --- EVM & VVPAT ---
  {
    id: 12,
    category: 'EVM & VVPAT',
    question: 'What is an EVM (Electronic Voting Machine)?',
    answer: 'An EVM (Electronic Voting Machine) is an electronic device used to record votes in Indian elections. Key features:\n\n• **Two units** – Control Unit (with the presiding officer) and Ballot Unit (in the voting booth).\n• Can record a **maximum of 2,000 votes**.\n• Runs on a **battery** – does not need electricity.\n• **Standalone device** – not connected to any network or internet.\n• **One-time programmable chip** – software cannot be altered after manufacturing.\n• Manufactured only by **Bharat Electronics Limited (BEL)** and **Electronics Corporation of India (ECIL)**.'
  },
  {
    id: 13,
    category: 'EVM & VVPAT',
    question: 'What is VVPAT and why is it important?',
    answer: 'VVPAT stands for **Voter Verifiable Paper Audit Trail**. It is a device attached to the EVM that prints a paper slip showing the candidate\'s name, serial number, and party symbol after a vote is cast.\n\n• The slip is visible for **7 seconds** through a transparent window.\n• It then drops into a **sealed box**.\n• Purpose: Allows voters to **verify** that their vote was recorded correctly.\n• Used for **audit** – In case of disputes, VVPAT slips can be counted to verify EVM results.\n\nSince 2019, VVPAT slips from 5 random booths per constituency are mandatorily matched with EVM results.'
  },
  // --- Candidates & Parties ---
  {
    id: 14,
    category: 'Candidates & Parties',
    question: 'How does a candidate file a nomination?',
    answer: 'To file a nomination, a candidate must:\n\n1. **Obtain Form 2A/2B** from the Returning Officer.\n2. Fill in personal details, constituency, party affiliation, and submit an **affidavit** disclosing criminal cases, assets, liabilities, and educational qualifications.\n3. Pay the **security deposit**: ₹25,000 for general candidates (₹12,500 for SC/ST candidates).\n4. Submit the nomination **in person** to the Returning Officer before the deadline.\n5. **Scrutiny** of nominations happens on the designated date.\n6. Candidates can **withdraw** nominations before the withdrawal deadline.'
  },
  {
    id: 15,
    category: 'Candidates & Parties',
    question: 'What are national and state political parties?',
    answer: 'The ECI classifies parties based on their performance:\n\n**National Parties** (must meet at least one criterion):\n• Win 2% of total Lok Sabha seats from at least 3 states.\n• Secure 6% votes in 4+ states AND win 4 Lok Sabha seats.\n• Recognized as a state party in 4+ states.\n\n**State Parties** (must meet at least one criterion):\n• Win 3% of total seats in the state assembly.\n• Win 1 Lok Sabha seat per 25 allotted to the state.\n• Secure 6% of votes in state elections AND win 2 assembly seats.\n\nNational parties get a **common election symbol** across all states.'
  },
  // --- Election Timeline ---
  {
    id: 16,
    category: 'Election Timeline',
    question: 'What are the key stages of the election process?',
    answer: 'The election process follows these stages:\n\n1. **Announcement** – ECI announces election dates and MCC comes into effect.\n2. **Notification** – Formal gazette notification is issued.\n3. **Nomination Filing** – Candidates file nominations (within 7 days of notification).\n4. **Scrutiny** – Returning Officer verifies nominations (1 day after last nomination date).\n5. **Withdrawal** – Candidates can withdraw (2 days after scrutiny).\n6. **Campaigning** – Parties campaign until 48 hours before polling.\n7. **Polling Day** – Voters cast votes using EVMs.\n8. **Counting Day** – Votes are counted under strict supervision.\n9. **Results** – Winners are declared and results are published.'
  },
  {
    id: 17,
    category: 'Election Timeline',
    question: 'What happens during the counting of votes?',
    answer: 'The counting process is rigorous:\n\n1. **Counting centers** are set up at designated locations under heavy security.\n2. **Postal ballots** are counted first.\n3. **EVM counting** begins round by round – each round covers a set of EVMs.\n4. **Candidates/agents** are allowed to be present during counting.\n5. **VVPAT verification** – Slips from 5 randomly selected booths per constituency are counted and matched.\n6. **Results are declared** progressively on ECI\'s website and through media.\n7. The candidate with the **highest votes wins** (First Past the Post system).\n8. **Certificate of Election** is issued to the winner by the Returning Officer.'
  },
  // --- Rights & Rules ---
  {
    id: 18,
    category: 'Rights & Rules',
    question: 'Is voting compulsory in India?',
    answer: 'No, voting is **not compulsory** at the national level in India. It is a **right**, not a legal obligation. However, some states like **Gujarat** have enacted laws making voting mandatory in local body elections.\n\nThe ECI actively encourages voter participation through its **SVEEP (Systematic Voters\' Education and Electoral Participation)** program to increase voter turnout.'
  },
  {
    id: 19,
    category: 'Rights & Rules',
    question: 'What is the right to reject and recall?',
    answer: '• **Right to Reject (NOTA)** – Voters can choose "None of the Above" on the EVM if they don\'t support any candidate. This was introduced in 2013 following a Supreme Court verdict.\n\n• **Right to Recall** – This allows voters to remove an elected representative before their term ends. However, the **Right to Recall does not exist** at the national level in India. Some states have provisions for it in local body elections, but it is not widely implemented.'
  },
  {
    id: 20,
    category: 'Rights & Rules',
    question: 'Can I vote if my name is not on the voter list?',
    answer: 'Unfortunately, **no**. You must be registered in the Electoral Roll to cast your vote. If your name is missing:\n\n1. Check your name on the **NVSP portal** (voters.eci.gov.in) or **Voter Helpline App**.\n2. If not found, file **Form 6** for new registration immediately.\n3. Contact your **Booth Level Officer (BLO)** for assistance.\n4. On election day, a **Tendered Vote** facility exists in rare cases where disputes arise, but it is not a substitute for registration.\n\n**Tip:** Always verify your name in the voter list well before elections!'
  },
  // --- Election Security ---
  {
    id: 21,
    category: 'Election Security',
    question: 'How does ECI ensure free and fair elections?',
    answer: 'The ECI uses multiple measures:\n\n• **Model Code of Conduct** – Strict guidelines for parties and candidates.\n• **Election Observers** – General, expenditure, and police observers are deployed.\n• **CCTV & Webcasting** – Polling stations are monitored live.\n• **CAPF Deployment** – Central Armed Police Forces ensure security.\n• **Expenditure Monitoring** – Each candidate\'s spending is tracked (limit: ₹95 lakh for Lok Sabha, ₹40 lakh for Assembly).\n• **cVIGIL App** – Citizens can report MCC violations with photo/video evidence.\n• **Flying Squads & Static Surveillance Teams** – Monitor cash, liquor, and freebies distribution.'
  },
  {
    id: 22,
    category: 'Election Security',
    question: 'What is the cVIGIL app?',
    answer: 'cVIGIL is a **citizen vigilance app** developed by ECI that allows voters to report election-related violations in real time.\n\n**How it works:**\n1. Download the **cVIGIL app** from Google Play Store / App Store.\n2. Capture **photo or video** evidence of violations (like cash distribution, hate speech, illegal banners).\n3. The app **auto-tags** the location and time.\n4. The complaint reaches the **District Control Room** within minutes.\n5. A **Flying Squad** is dispatched to the location.\n6. Action is taken within **100 minutes**.\n\nThe identity of the complainant is kept **completely confidential**.'
  },
  // --- Special Provisions ---
  {
    id: 23,
    category: 'Special Provisions',
    question: 'What facilities are available for persons with disabilities (PwD)?',
    answer: 'The ECI provides several facilities for PwD voters:\n\n• **Accessible polling stations** – Ramps, wheelchairs, and ground-floor booths.\n• **Braille-enabled EVMs** – For visually impaired voters.\n• **Companion voting** – A PwD voter can bring a companion to assist in voting.\n• **Priority entry** – PwD voters get priority in the queue.\n• **Postal ballot** – Available for voters with 40%+ disability.\n• **Volunteer assistance** – Trained volunteers help at polling stations.\n• **Sign language interpreters** – Available at select booths.\n\nThe ECI\'s goal is to make elections **100% accessible**.'
  },
  {
    id: 24,
    category: 'Special Provisions',
    question: 'How do senior citizens and pregnant women vote?',
    answer: 'Special provisions for senior citizens and pregnant women:\n\n• **Priority queue** – Voters above 80 years, pregnant women, and PwD voters get priority.\n• **Postal ballot for 80+** – Senior citizens above 80 years can opt for **postal ballot** (Absentee Voter facility).\n• **Home voting** – In some states, election officials visit the homes of very elderly or bedridden voters.\n• **Volunteer assistance** – Trained helpers assist senior citizens at polling booths.\n• **Seating arrangements** – Chairs and shade are provided in queue areas.'
  },
  // --- After Elections ---
  {
    id: 25,
    category: 'After Elections',
    question: 'How is the government formed after elections?',
    answer: 'After election results are declared:\n\n1. The party (or coalition) with a **majority of seats** (272+ in Lok Sabha) is invited to form the government.\n2. The **President** invites the leader of the majority party to be the **Prime Minister**.\n3. The PM selects the **Council of Ministers** (Cabinet).\n4. If no single party gets a majority, a **coalition government** is formed.\n5. The new government must prove its majority through a **floor test** in Parliament.\n6. At the state level, the **Governor** invites the majority party leader to be the **Chief Minister**.\n\nThe entire process is completed within weeks of results.'
  },
  {
    id: 26,
    category: 'After Elections',
    question: 'What happens if there is a tie between candidates?',
    answer: 'If two candidates receive **exactly the same number of votes**, the winner is decided by a **draw of lots** conducted by the Returning Officer. This is specified under the Representation of the People Act, 1951.\n\nThis is extremely rare but has happened in Indian elections. The Returning Officer draws a lot in the presence of candidates or their agents, and the result is final and binding.'
  },
  {
    id: 27,
    category: 'After Elections',
    question: 'Can election results be challenged?',
    answer: 'Yes, election results can be challenged through an **Election Petition**:\n\n• Must be filed in the **High Court** of the respective state within **45 days** of the result.\n• Can be filed by a **candidate** or an **elector** of that constituency.\n• Grounds include: **corrupt practices**, improper acceptance/rejection of nominations, non-compliance with provisions of the Constitution.\n• The High Court can **set aside** the election if the petition is upheld.\n• Appeals can be made to the **Supreme Court** against the High Court\'s decision.\n\nThe court must decide the petition within **6 months**.'
  },
  // --- Digital Initiatives ---
  {
    id: 28,
    category: 'Digital Initiatives',
    question: 'What digital tools does ECI provide for voters?',
    answer: 'The ECI has launched several digital initiatives:\n\n• **Voter Helpline App** – Register, check voter list status, find polling station.\n• **NVSP Portal** (voters.eci.gov.in) – Online voter registration and services.\n• **cVIGIL App** – Report election violations with evidence.\n• **Voter Turnout App** – Real-time turnout data during elections.\n• **KYC (Know Your Candidate)** – View candidate affidavits, criminal records, and assets.\n• **Suvidha Portal** – Online permissions for rallies, meetings, and campaigns.\n• **PwD App** – Special app for persons with disabilities to request assistance.\n• **ECI website** (eci.gov.in) – Comprehensive election data and results.'
  },
  {
    id: 29,
    category: 'Basics',
    question: 'What is the First Past the Post (FPTP) system?',
    answer: 'India follows the **First Past the Post (FPTP)** electoral system. Under this system:\n\n• Each constituency elects **one representative**.\n• The candidate with the **highest number of votes** wins, even without an absolute majority.\n• It is simple and easy to understand.\n• Critics argue it can lead to a candidate winning with a **low vote share** (e.g., 30%) in multi-cornered contests.\n• An alternative system proposed is **Proportional Representation**, which is used for Rajya Sabha and Presidential elections.'
  },
  {
    id: 30,
    category: 'Voter Eligibility',
    question: 'What is the Electoral Roll and how is it updated?',
    answer: 'The Electoral Roll (Voter List) is the official list of all eligible voters in a constituency. It is updated through:\n\n• **Annual Revision** – ECI conducts a summary revision every year with **1st January** as the qualifying date.\n• **Continuous Updates** – New registrations, deletions (deceased/shifted voters), and corrections can be done throughout the year.\n• **Special Revision** – Done before major elections with intensive door-to-door verification by BLOs (Booth Level Officers).\n\nYou can check your name at **voters.eci.gov.in** or through the **Voter Helpline App** using your EPIC number.'
  },
  // --- Census & Delimitation ---
  {
    id: 31,
    category: 'Census & Delimitation',
    question: 'What is the Census and how does it relate to elections?',
    answer: 'The Census is a decennial process of collecting demographic data of the entire population. It forms the basis for **Delimitation**, which is the process of redrawing boundaries of Lok Sabha and State Assembly constituencies to ensure that each seat represents roughly the same number of people.'
  },
  {
    id: 32,
    category: 'Census & Delimitation',
    question: 'When was the last Census conducted and when is the next one?',
    answer: 'The last Census in India was conducted in **2011**. The 2021 Census was delayed due to the COVID-19 pandemic. The upcoming Census is expected to be conducted in the near future (likely **2025-26**), and it will be India\'s first **Digital Census**.'
  },
  {
    id: 33,
    category: 'Census & Delimitation',
    question: 'What is Delimitation and why is it done?',
    answer: 'Delimitation is the act of redrawing boundaries of Lok Sabha and State Assembly seats to represent changes in population. It is done to ensure **"One Vote, One Value"**—meaning each elected representative should represent a similar number of voters. The process is carried out by an independent **Delimitation Commission**.'
  },
  {
    id: 34,
    category: 'Census & Delimitation',
    question: 'What is the Delimitation Commission and how does it work?',
    answer: 'The Delimitation Commission is a high-power body appointed by the President of India. It consists of a retired Supreme Court judge, the Chief Election Commissioner, and State Election Commissioners. Its orders have the force of law and cannot be challenged in any court. The next major nationwide delimitation is scheduled to happen after the first Census taken after **2026**.'
  },
  {
    id: 35,
    category: 'Census & Delimitation',
    question: 'What is SIR (Special Intensive Revision) in the election process?',
    answer: '**SIR (Special Intensive Revision)** is a rigorous, large-scale exercise conducted by the ECI to "purify" the electoral rolls. Unlike the annual **Summary Revision (SSR)**, SIR involves **house-to-house enumeration** where Booth Level Officers (BLOs) visit every home to verify voters, remove deceased or shifted entries, and register new eligible citizens to ensure an error-free voter list.'
  }
];

export const CHAT_CATEGORIES = [
  'Basics',
  'Voter Eligibility',
  'Voting Process',
  'EVM & VVPAT',
  'Candidates & Parties',
  'Election Timeline',
  'Rights & Rules',
  'Election Security',
  'Special Provisions',
  'After Elections',
  'Digital Initiatives',
  'Census & Delimitation'
];
