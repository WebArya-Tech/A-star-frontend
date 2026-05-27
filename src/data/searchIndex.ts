type SearchEntry = {
  path: string;
  name: string;
  description: string;
  keywords: string[];
};

const searchIndex: SearchEntry[] = [
  {
    path: "/",
    name: "Home",
    description: "Landing page for A Star Classes — IGCSE & AS/A Level online coaching",
    keywords: ["home", "landing", "igcse", "as a level", "alevel", "subjects", "demo", "online coaching", "tutoring"]
  },
  {
    path: "/demoform",
    name: "Demo Form",
    description: "Book a free demo class — schedule your trial session",
    keywords: ["demo", "free demo", "book class", "trial", "schedule", "enrollment", "registration"]
  },
  {
    path: "/login",
    name: "Login",
    description: "Student login with email/password or OTP",
    keywords: ["login", "sign in", "authentication", "otp", "password", "student login", "account"]
  },
  {
    path: "/signup",
    name: "Sign Up",
    description: "Create a new student account",
    keywords: ["signup", "register", "create account", "student registration"]
  },
  {
    path: "/reset-password",
    name: "Reset Password",
    description: "Reset your password via email OTP",
    keywords: ["reset password", "forgot password", "password recovery", "change password"]
  },
  {
    path: "/tutors",
    name: "All Tutors",
    description: "Browse all expert educators and instructors",
    keywords: ["tutors", "teachers", "faculty", "educators", "instructors", "experts", "profiles"]
  },
  {
    path: "/tutors/igcse",
    name: "IGCSE Tutors",
    description: "IGCSE subject specialist tutors",
    keywords: ["igcse tutors", "igcse teachers", "igcse faculty", "subject specialists"]
  },
  {
    path: "/tutors/as-level",
    name: "AS Level Tutors",
    description: "AS Level subject specialist tutors",
    keywords: ["as level tutors", "as level teachers", "as faculty"]
  },
  {
    path: "/tutors/a-level",
    name: "A Level Tutors",
    description: "A Level subject specialist tutors",
    keywords: ["a level tutors", "a level teachers", "a level faculty", "university prep"]
  },
  {
    path: "/tutors/sat",
    name: "SAT Tutors",
    description: "SAT preparation specialist tutors",
    keywords: ["sat tutors", "sat prep", "sat teachers", "test prep", "sat faculty"]
  },
  {
    path: "/igcse",
    name: "IGCSE Hub",
    description: "IGCSE program overview — Grades 9-10, Cambridge curriculum",
    keywords: ["igcse", "igcse hub", "cambridge igcse", "grade 9", "grade 10", "igcse subjects"]
  },
  {
    path: "/as-a-level",
    name: "AS/A Level Hub",
    description: "AS/A Level program overview — Grades 11-12, advanced curriculum",
    keywords: ["as level", "a level", "as a level", "grade 11", "grade 12", "advanced level", "cambridge", "university"]
  },
  {
    path: "/counselling",
    name: "University Counselling",
    description: "College and university counselling services — UK, US, Singapore, India",
    keywords: ["counselling", "university counselling", "college counselling", "study abroad", "admissions"]
  },
  {
    path: "/sat-prep",
    name: "Test Prep Hub",
    description: "SAT, ACT, AP, TMUA, AMC test preparation",
    keywords: ["sat", "act", "ap", "tmua", "amc", "test prep", "standardized tests", "score improvement"]
  },
  {
    path: "/testimonials",
    name: "Testimonials",
    description: "Student and parent testimonials with real results",
    keywords: ["testimonials", "reviews", "student feedback", "success stories", "results"]
  },
  {
    path: "/blog",
    name: "Blog Home",
    description: "Educational articles, study tips and exam preparation blogs",
    keywords: ["blog", "articles", "education blog", "study tips", "exam preparation"]
  },
  {
    path: "/blog/all",
    name: "All Blogs",
    description: "Browse all blog articles with search and filter",
    keywords: ["all blogs", "blog archive", "search blogs", "articles list"]
  },
  {
    path: "/blog/submit",
    name: "Submit Blog",
    description: "Write and submit a guest blog article",
    keywords: ["submit blog", "write article", "guest post", "content submission"]
  },
  {
    path: "/blog/subscribe",
    name: "Subscribe to Blog",
    description: "Get email notifications for new blog posts",
    keywords: ["subscribe", "newsletter", "email subscription", "blog updates"]
  },
  {
    path: "/ask",
    name: "Ask a Question",
    description: "Q&A platform — ask academic questions with LaTeX support",
    keywords: ["ask", "questions", "answers", "q&a", "doubt solving", "academic help", "latex", "math"]
  },
  {
    path: "/contact",
    name: "Contact Us",
    description: "Get in touch — phone, email, WhatsApp, map, and contact form",
    keywords: ["contact", "support", "phone", "email", "address", "faq", "social media"]
  },
  {
    path: "/running-classes",
    name: "Running Classes",
    description: "Currently active online classes — enroll in live sessions",
    keywords: ["running classes", "live classes", "online classes", "active courses", "enroll"]
  },
  {
    path: "/reviews",
    name: "Reviews",
    description: "Student reviews with detailed ratings and feedback",
    keywords: ["reviews", "student reviews", "ratings", "feedback", "student experience"]
  },
  {
    path: "/write-review",
    name: "Write a Review",
    description: "Submit your detailed review and rating",
    keywords: ["write review", "submit review", "rate", "feedback form", "rating"]
  },
  {
    path: "/admin-dashboard",
    name: "Admin Dashboard",
    description: "Admin control panel for managing the platform",
    keywords: ["admin", "dashboard", "admin panel", "management", "administration"]
  },
];

export { searchIndex };
export type { SearchEntry };
