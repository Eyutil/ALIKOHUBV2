import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, BookOpen, CheckSquare, Download, PenTool, CheckCircle2, ExternalLink, Globe, GraduationCap, Calendar, Info, Mail, Languages, DollarSign, Award } from "lucide-react";
import resourcesThumb from "@/assets/resources-thumb.jpg";
import resBizPlan from "@/assets/res-biz-plan.jpg";
import resCareerGuide from "@/assets/res-career-guide.jpg";
import resTravelChecklist from "@/assets/res-travel-checklist.jpg";
import resInterview from "@/assets/res-interview.jpg";
import resMarketResearch from "@/assets/res-market-research.jpg";
import resStudyGuide from "@/assets/res-study-guide.jpg";

const fallbackThumbs = [resBizPlan, resCareerGuide, resTravelChecklist, resInterview, resMarketResearch, resStudyGuide];

const typeIcons: Record<string, typeof FileText> = {
  template: FileText,
  guide: BookOpen,
  checklist: CheckSquare,
  article: FileText,
};

const categoryColors: Record<string, string> = {
  business: "bg-accent/10 text-accent",
  career: "bg-secondary/10 text-secondary",
  travel: "bg-primary/10 text-primary",
};

const writingGuide = [
  { name: "Professional CV / Resume", desc: "A well-structured document highlighting your education, skills, work experience, and achievements. Essential for every application — whether for High School, Undergraduate, Graduate, or PhD level.", tips: ["Tailor it to each position or program", "Use action verbs and quantify achievements", "Keep it to 1–2 pages maximum", "Include relevant extracurricular activities"] },
  { name: "Personal Statement", desc: "A critical 1-page essay outlining your life journey, character, academic interests, relevant skills, and motivation for a specific course or role.", tips: ["Use a story-driven tone", "Mention soft skills naturally", "Stay within 500–750 words", "Show genuine motivation"] },
  { name: "Statement of Purpose (SOP)", desc: "A 1–2 page essay defining your academic/professional journey, career goals, and motivation. Ideal for graduate applications and career pivots.", tips: ["Maintain a professional tone", "Connect past experience to future goals", "Stay within 500–1,000 words", "Be specific about why this program/company"] },
  { name: "Motivational Letter", desc: "A one-page document explaining why you are applying, why you are a perfect fit, and your future goals.", tips: ["Keep it concise and professional", "Highlight unique value you bring", "Show awareness of the organization", "Stay within 500–750 words"] },
];

const essayTypes = [
  { name: "Common App Essay", desc: "Personal statement submitted to multiple US colleges. Showcases character, background, and unique voice.", tone: "Personal, emotional, reflective", wordLimit: "450–650 words", audience: "US Undergrad" },
  { name: "Personal Statement", desc: "A critical 1-page essay outlining your life journey, character, academic interests, and motivation.", tone: "Story-driven", wordLimit: "500–750 words", audience: "General" },
  { name: "Statement of Purpose (SOP)", desc: "A 1–2 page essay defining your academic/professional journey and career goals.", tone: "Professional", wordLimit: "500–1,000 words", audience: "Master's & PhD" },
  { name: "Motivational Letter", desc: "Explains why you're applying, why you're a perfect fit, and your future goals.", tone: "Professional", wordLimit: "500–750 words", audience: "General" },
  { name: "Supplemental Essay", desc: "Short, school-specific prompts required in addition to the main essay. Common in US & Canada.", tone: "Semi-professional", wordLimit: "250–450 words", audience: "US & Canada" },
];

const essayDos = [
  "Be specific: name programs, professors, clubs, and campus values",
  "Show alignment: connect their offerings to your goals",
  "Make it personal: reference your experiences, not just their brochure",
  "Stick to the word limit",
];

const essayDonts = [
  "Don't copy-paste between schools",
  "Don't focus on prestige alone",
  "Don't list facts without tying them to your own journey",
];

const applicationDeadlines = [
  { region: "USA (Undergrad)", details: ["Early Decision: Nov 1–15", "Regular Decision: Jan 1–15", "Rolling Admission: After January (applying after July not recommended for internationals)"] },
  { region: "USA (Master's)", details: ["Fall Intake: August – February", "Spring Intake: Starts from January"] },
  { region: "Canada (Master's)", details: ["Fall Intake: January – February"] },
  { region: "UK (Undergrad)", details: ["October 15 is usually the deadline"] },
  { region: "Europe", details: ["January – April"] },
  { region: "China", details: ["September Intake: December – April"] },
];

const professorOutreach = [
  { step: "1", title: "Prepare Your Profile", desc: "Ensure your email name is professional and your CV is polished before reaching out." },
  { step: "2", title: "Research the University & Department", desc: "Understand the professor's research interests and recent publications." },
  { step: "3", title: "Find the Right Professor", desc: "Identify professors whose research aligns with your interests using university faculty pages." },
  { step: "4", title: "Craft a Compelling Email", desc: "Write a concise, personalized email expressing genuine interest in their work and how your skills align." },
];

const ieltsResources = [
  { name: "IELTS Official Sample Tests", url: "https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test", desc: "Free official IELTS academic sample test questions." },
  { name: "British Council Practice Tests", url: "https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests", desc: "Free IELTS practice tests from the British Council." },
  { name: "IDP IELTS Academic Writing", url: "https://ielts.idp.com/about/academic-writing", desc: "Official guidance on IELTS academic writing tasks." },
  { name: "TED IELTS Resources", url: "https://ted-ielts.com/free-ielts-resources/", desc: "Free IELTS preparation resources and tips." },
  { name: "IELTS Resources.org", url: "https://ieltsresources.org/", desc: "Comprehensive free IELTS study materials." },
  { name: "IELTS Liz", url: "https://ieltsliz.com/", desc: "Popular free IELTS preparation lessons and tips." },
  { name: "IELTS Up", url: "https://ielts-up.com/", desc: "Free IELTS practice tests and preparation materials." },
  { name: "ETS Grad School Test Guide", url: "https://www.ets.org/grad-school-journey/test-guide.html", desc: "Guide to graduate school standardized tests (GRE, TOEFL)." },
];

const duolingoResources = [
  { name: "Duolingo English Test – Institutions", url: "https://englishtest.duolingo.com/institutions", desc: "See which institutions accept the Duolingo English Test." },
  { name: "English Proficiency Exams Guide", url: "https://englishtest.duolingo.com/applicants", desc: "Overview of the Duolingo English Test for applicants." },
  { name: "Comparison of Proficiency Tests", url: "https://englishtest.duolingo.com/scores", desc: "Compare Duolingo scores with IELTS and TOEFL equivalents." },
  { name: "Duolingo Test Resources", url: "https://englishtest.duolingo.com/preparation", desc: "Official preparation resources for the Duolingo English Test." },
];

const financialAidLinks = [
  { name: "NAFSA Financial Aid Guide", url: "https://www.nafsa.org/about/about-international-education/financial-aid-undergraduate-international-students", desc: "Comprehensive guide to financial aid for international undergrad students." },
  { name: "UC Berkeley International Aid", url: "https://financialaid.berkeley.edu/apply-now/international-students/", desc: "Financial aid information for international students at UC Berkeley." },
  { name: "EduPass Financial Aid", url: "https://www.edupass.org/paying-for-college/financial-aid/undergraduate/", desc: "Guide to paying for college as an international student." },
];

const recommendationTips = [
  "Choose a recommender who knows you well academically or professionally",
  "Provide your recommender with your CV, goals, and key achievements",
  "Give at least 3–4 weeks notice before the deadline",
  "A strong letter highlights specific examples, not generic praise",
  "Request letters from different perspectives (academic, professional, extracurricular)",
  "Follow up politely and always send a thank-you note",
];

const usefulPlatforms = [
  { name: "Corsava", url: "https://www.corsava.com", desc: "Discover your ideal college fit through a gamified card-sorting activity that prioritizes campus culture, academic, and residential preferences." },
  { name: "Scholarships.com", url: "https://www.scholarships.com", desc: "Comprehensive scholarship search database with thousands of opportunities." },
  { name: "IEFA.org", url: "https://www.iefa.org", desc: "International Financial Aid & College Scholarship Search for international students." },
  { name: "ScholarshipPortal", url: "https://www.scholarshipportal.com", desc: "EU-focused scholarships and funding opportunities across Europe." },
  { name: "Fulbright Program", url: "https://www.fulbright.org", desc: "U.S. Government-funded international educational exchange program." },
  { name: "DAAD Scholarship Database", url: "https://www.daad.de", desc: "Germany's main scholarship database for international students." },
];

const universityRankings = [
  { name: "QS World University Rankings", url: "https://www.topuniversities.com" },
  { name: "Times Higher Education (THE)", url: "https://www.timeshighereducation.com" },
  { name: "US News Global Rankings", url: "https://www.usnews.com/education/best-global-universities" },
];

type Resource = {
  id: string;
  title: string;
  description: string | null;
  resourceType: string;
  consultationType: string | null;
  thumbnailUrl: string | null;
  fileUrl: string | null;
};

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/consultancy/cms/resources");
        setResources(data || []);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${resourcesThumb})` }} />
        <div className="absolute inset-0 bg-navy/85" />
        <div className="relative container-wide px-4 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-4 block">Resources</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Knowledge Hub</h1>
            <p className="text-primary-foreground/70 text-lg">Guides, templates, tools, and curated links to support your journey — applicable to all academic levels.</p>
          </div>
        </div>
      </section>

      {/* CV & Application Writing Guide */}
      <section className="section-padding bg-off-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">
              <PenTool className="w-7 h-7 inline-block mr-2 text-accent -mt-1" />
              CV & Application Writing Guide
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Master the art of writing compelling professional documents — general guidance for High School, Undergraduate, Graduate, and PhD applicants.</p>
          </div>

          <Accordion type="single" collapsible>
            {writingGuide.map((item) => (
              <AccordionItem key={item.name} value={item.name} className="bg-card border border-border rounded-xl mb-3 px-6">
                <AccordionTrigger className="font-serif text-base font-semibold text-primary hover:no-underline">
                  {item.name}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground text-sm mb-4">{item.desc}</p>
                  <ul className="space-y-2">
                    {item.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Essay Writing Guide */}
      <section className="section-padding bg-gradient-cool">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">
              <PenTool className="w-7 h-7 inline-block mr-2 text-accent -mt-1" />
              Essay Writing Guide
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Understanding the different types of application essays and how to craft them effectively.</p>
          </div>

          <Accordion type="single" collapsible className="mb-10">
            {essayTypes.map((essay) => (
              <AccordionItem key={essay.name} value={essay.name} className="bg-card border border-border rounded-xl mb-3 px-6">
                <AccordionTrigger className="font-serif text-base font-semibold text-primary hover:no-underline">
                  <span className="flex items-center gap-3">
                    {essay.name}
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{essay.audience}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground text-sm mb-3">{essay.desc}</p>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <span className="bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">Tone: {essay.tone}</span>
                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">{essay.wordLimit}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-forest-subtle rounded-xl p-8">
              <h3 className="font-serif text-xl font-semibold text-primary mb-4">✓ Do's</h3>
              <ul className="space-y-3">
                {essayDos.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-navy-subtle rounded-xl p-8">
              <h3 className="font-serif text-xl font-semibold text-primary mb-4">✗ Don'ts</h3>
              <ul className="space-y-3">
                {essayDonts.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm text-foreground">
                    <Info className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Application Deadlines by Region */}
      <section className="section-padding bg-warm-beige">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">
              <Calendar className="w-7 h-7 inline-block mr-2 text-accent -mt-1" />
              Application Deadlines by Region
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Plan ahead with key deadlines for universities worldwide — applicable to all academic levels.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {applicationDeadlines.map((d) => (
              <div key={d.region} className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-serif text-lg font-semibold text-primary mb-4">{d.region}</h3>
                <ul className="space-y-2">
                  {d.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Reach Out to Professors */}
      <section className="section-padding bg-off-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">
              <Mail className="w-7 h-7 inline-block mr-2 text-accent -mt-1" />
              How to Reach Out to Professors
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A step-by-step guide for contacting professors for research and graduate opportunities.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {professorOutreach.map((s, i) => {
              const cardStyles = ["card-navy-subtle", "card-gold-subtle", "card-teal-subtle", "card-forest-subtle"];
              return (
                <div key={s.step} className={`${cardStyles[i]} rounded-xl p-6 text-center card-hover`}>
                  <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center mx-auto mb-4">
                    <span className="text-accent font-bold text-lg">{s.step}</span>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-primary mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* English Proficiency & Exam Resources */}
      <section className="section-padding bg-gradient-warm">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">
              <Languages className="w-7 h-7 inline-block mr-2 text-accent -mt-1" />
              English Proficiency & Exam Resources
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Free tests, study materials, and official guides for IELTS, Duolingo, TOEFL, and GRE.</p>
          </div>

          <div className="mb-10">
            <h3 className="font-serif text-xl font-semibold text-primary mb-6">IELTS & Standardized Tests</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ieltsResources.map((r) => (
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="bg-card border border-border rounded-xl p-5 card-hover group">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-serif text-sm font-semibold text-primary">{r.name}</h4>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{r.desc}</p>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl font-semibold text-primary mb-6">Duolingo English Test</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {duolingoResources.map((r) => (
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="bg-card border border-border rounded-xl p-5 card-hover group">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-serif text-sm font-semibold text-primary">{r.name}</h4>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{r.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Financial Aid */}
      <section className="section-padding bg-off-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">
              <DollarSign className="w-7 h-7 inline-block mr-2 text-accent -mt-1" />
              Financial Aid Resources
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Guides and tools to help international students find and apply for financial aid.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {financialAidLinks.map((r) => (
              <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="card-navy rounded-xl p-6 card-hover group">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-base font-semibold text-primary-foreground">{r.name}</h4>
                  <ExternalLink className="w-4 h-4 text-accent flex-shrink-0" />
                </div>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">{r.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendation Letter Guide */}
      <section className="section-padding bg-gradient-cool">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">
              <Award className="w-7 h-7 inline-block mr-2 text-accent -mt-1" />
              Writing a Strong Recommendation Letter
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Tips for requesting and securing impactful recommendation letters for your applications.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendationTips.map((tip, i) => {
              const cardStyles = ["card-navy-subtle", "card-gold-subtle", "card-teal-subtle", "card-forest-subtle", "card-navy-subtle", "card-gold-subtle"];
              return (
                <div key={i} className={`${cardStyles[i]} rounded-xl p-5 flex items-start gap-3`}>
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{tip}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <section className="section-padding bg-warm-beige">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">
              <Globe className="w-7 h-7 inline-block mr-2 text-accent -mt-1" />
              Useful Links & Platforms
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Curated scholarship databases, university search tools, and resources shared with our clients.</p>
          </div>

          <div className="mb-10">
            <h3 className="font-serif text-xl font-semibold text-primary mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-accent" />
              Scholarship & University Search
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {usefulPlatforms.map((p) => (
                <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="bg-card border border-border rounded-xl p-6 card-hover group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-serif text-base font-semibold text-primary">{p.name}</h4>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl font-semibold text-primary mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              World University Rankings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {universityRankings.map((r) => (
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="card-navy rounded-xl p-6 card-hover group flex items-center justify-between">
                  <h4 className="font-serif text-base font-semibold text-primary-foreground">{r.name}</h4>
                  <ExternalLink className="w-4 h-4 text-accent" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Downloadable Resources Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">Downloadable Resources</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Guides, templates, and checklists to help you at every stage.</p>
          </div>
          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading resources…</p>
          ) : resources.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No resources available yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {resources.map((r, index) => {
                const Icon = typeIcons[r.resourceType] || FileText;
                return (
                  <div key={r.id} className="group bg-card rounded-xl overflow-hidden border border-border card-hover">
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={r.thumbnailUrl || ""}
                        alt={r.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6 lg:p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-accent" />
                        </div>
                        {r.consultationType && (
                          <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${categoryColors[r.consultationType] || "bg-muted text-muted-foreground"}`}>{r.consultationType}</span>
                        )}
                        <span className="text-xs text-muted-foreground capitalize">{r.resourceType}</span>
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-primary mb-3">{r.title}</h3>
                      {r.description && <p className="text-muted-foreground text-sm leading-relaxed mb-5">{r.description}</p>}
                      {r.fileUrl ? (
                        <a href={r.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Button className="bg-gold text-navy hover:bg-gold/90 font-semibold px-6 py-5 w-full">
                            <Download className="w-4 h-4 mr-2" /> Access Material
                          </Button>
                        </a>
                      ) : (
                        <Button variant="outline" className="w-full py-5 cursor-default opacity-60" disabled>
                          <FileText className="w-4 h-4 mr-2" /> Coming Soon
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--gold)) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="relative container-narrow text-center section-padding">
          <h2 className="font-serif text-3xl font-bold text-primary-foreground mb-4">Need Personalized Guidance?</h2>
          <p className="text-primary-foreground/70 mb-8">Our consultants can help you apply these resources to your unique situation.</p>
          <Link to="/book"><Button className="bg-gold text-navy hover:bg-gold/90 font-semibold px-8 py-6">Book Consultation</Button></Link>
        </div>
      </section>
    </div>
  );
};

export default Resources;
