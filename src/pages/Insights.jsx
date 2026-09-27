import { useEffect, useState } from 'react'
import { ArrowUpRight, Clock, Tag } from '@phosphor-icons/react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Insights.css'

const articles = [
  {
    id: 1,
    category: 'Brand Strategy',
    title: 'Why Most Startups Get Branding Wrong — and How to Fix It',
    excerpt: 'Branding isn\'t just a logo. It\'s the language your business speaks before you say a word. Here\'s what founders miss — and what to do instead.',
    readTime: '5 min read',
    date: 'Dec 2024',
    featured: true,
    color: '#a4be2d',
  },
  {
    id: 2,
    category: 'Investor Decks',
    title: 'The 10-Slide Framework That Got My Clients Funded',
    excerpt: 'After 10+ investor decks across consumer, SaaS, and services — this is the structure that consistently opens rooms and closes rounds.',
    readTime: '7 min read',
    date: 'Nov 2024',
    featured: false,
    color: '#2d8fbe',
  },
  {
    id: 3,
    category: 'Venture Design',
    title: 'Building Moonbliss: From Idea to Market in 90 Days',
    excerpt: 'A behind-the-scenes look at how we took a wellness brand from concept to launch — including what worked, what didn\'t, and what I\'d do differently.',
    readTime: '9 min read',
    date: 'Oct 2024',
    featured: false,
    color: '#be5f2d',
  },
  {
    id: 4,
    category: 'Business Systems',
    title: 'The Ops Layer Every Growing Business Ignores',
    excerpt: 'Most founders focus on revenue. The ones who scale focus on systems. Here\'s the operations layer that separates businesses that grow from those that grind.',
    readTime: '6 min read',
    date: 'Sep 2024',
    featured: false,
    color: '#6c2dbe',
  },
  {
    id: 5,
    category: 'Go-To-Market',
    title: 'GTM Strategy Is Not a Launch Plan — Here\'s the Difference',
    excerpt: 'Confusing a go-to-market strategy with a launch checklist is one of the most expensive mistakes a founder can make. Let\'s fix that.',
    readTime: '5 min read',
    date: 'Aug 2024',
    featured: false,
    color: '#2dbe8f',
  },
  {
    id: 6,
    category: 'Leadership',
    title: 'What I Learned Consulting 30+ Businesses in 5 Years',
    excerpt: 'Five years. 30+ businesses. Countless late nights. Here are the patterns I keep seeing — and the lessons that actually stick.',
    readTime: '8 min read',
    date: 'Jul 2024',
    featured: false,
    color: '#be2d6c',
  },
]

const categories = ['All', 'Brand Strategy', 'Investor Decks', 'Venture Design', 'Business Systems', 'Go-To-Market', 'Leadership']

function ArticleCard({ article, large = false }) {
  return (
    <article className={`insight-card ${large ? 'insight-card--large' : ''}`} data-reveal>
      <div className="insight-card-accent" style={{ background: article.color }} />
      <div className="insight-card-body">
        <div className="insight-card-meta">
          <span className="insight-category">
            <Tag size={11} aria-hidden /> {article.category}
          </span>
          <span className="insight-read-time">
            <Clock size={11} aria-hidden /> {article.readTime}
          </span>
        </div>
        <h2 className="insight-card-title">{article.title}</h2>
        <p className="insight-card-excerpt">{article.excerpt}</p>
        <div className="insight-card-footer">
          <span className="insight-date">{article.date}</span>
          <button className="btn btn-sm insight-read-btn">
            Read More <ArrowUpRight size={13} aria-hidden />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Insights({ onBookCall }) {
  useScrollReveal()
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    document.title = 'Insights | Hashir Usman'
  }, [])

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  const [featured, ...rest] = filtered

  return (
    <main id="main" className="insights-page">

      {/* ── Hero ── */}
      <section className="insights-hero" aria-labelledby="insights-hero-title">
        <div data-reveal>
          <span className="eyebrow">Insights</span>
          <h1 id="insights-hero-title" className="insights-hero-title">
            Ideas worth<br />sharing.
          </h1>
          <p className="insights-hero-desc">
            Strategy, brand, venture design, and the lessons from 5+ years
            working at the intersection of ideas and execution.
          </p>
        </div>
      </section>

      {/* ── Category Filter ── */}
      <div className="insights-filter" data-reveal role="tablist" aria-label="Filter by category">
        {categories.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            className={`filter-pill ${activeCategory === cat ? 'filter-pill--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Featured + Grid ── */}
      <section className="insights-content" aria-label="Articles">
        {featured && <ArticleCard article={featured} large />}
        {rest.length > 0 && (
          <div className="insights-grid">
            {rest.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="insights-newsletter" data-reveal aria-labelledby="newsletter-heading">
        <div className="newsletter-inner">
          <span className="eyebrow">Stay Sharp</span>
          <h2 id="newsletter-heading">Get insights in<br />your inbox.</h2>
          <p>Strategy, brand thinking, and venture lessons — once a month, no fluff.</p>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="newsletter-input"
              aria-label="Email address"
            />
            <button type="submit" className="btn btn-primary">
              Subscribe <ArrowUpRight size={16} aria-hidden />
            </button>
          </form>
        </div>
      </section>

    </main>
  )
}
