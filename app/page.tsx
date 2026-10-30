"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, BookOpen, Brain, Check, CircleHelp, Code2, GraduationCap,
  Github, Library, Linkedin, Menu, MessageCircle, Pause, Play, Search,
  Sparkles, Target, Volume2, VolumeX, X, Zap,
} from "lucide-react";

const features = [
  { icon: Brain, title: "AI Study Engine", body: "Turn a learning topic into structured study guides and clear explanations." },
  { icon: Check, title: "Interactive Quizzes", body: "Check your understanding with quizzes built around what you’re learning." },
  { icon: MessageCircle, title: "AI Study Buddy", body: "Ask follow-up questions and get AI-assisted explanations as you study." },
  { icon: Search, title: "Resource discovery", body: "Explore YouTube videos, Google Books, and web resources in one place." },
  { icon: Library, title: "Personal learning library", body: "Keep saved content, search history, quiz scores, and AI chats together." },
  { icon: Target, title: "A more personal way to learn", body: "A focused space for the way you explore new ideas." },
];

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(121);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);

  const formatTime = (time: number) => `${Math.floor(time / 60).toString().padStart(2, "0")}:${Math.floor(time % 60).toString().padStart(2, "0")}`;
  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      videoRef.current.volume = volume;
    }
  }, [speed, volume]);

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = fraction * duration;
    setCurrent(fraction * duration);
  };

  return (
    <div className="video-shell">
      <div
        className="video-stage"
        tabIndex={0}
        aria-label="StudyHub product walkthrough video player"
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            togglePlayback();
          }
        }}
      >
        <video
          ref={videoRef}
          src="/videos/studyhub-demo.mp4"
          poster="/studyhub-poster.svg"
          playsInline
          preload="metadata"
          onLoadedMetadata={(event) => {
            if (Number.isFinite(event.currentTarget.duration)) setDuration(event.currentTarget.duration);
          }}
          onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          aria-label="StudyHub product walkthrough"
        />
        {!playing && (
          <button className="video-overlay" onClick={togglePlayback} aria-label="Play StudyHub demo">
            <span className="play-button"><Play fill="currentColor" /></span>
          </button>
        )}
      </div>
      <div className="video-controls">
        <button className="control-btn" aria-label={playing ? "Pause" : "Play"} onClick={togglePlayback}>
          {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
        </button>
        <span className="time-text">{formatTime(current)}</span>
        <div
          className="timeline"
          ref={timelineRef}
          onClick={seek}
          role="slider"
          aria-label="Video position"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(current)}
          tabIndex={0}
          onKeyDown={(event) => {
            if (!videoRef.current) return;
            if (event.key === "ArrowRight") videoRef.current.currentTime = Math.min(duration, current + 5);
            if (event.key === "ArrowLeft") videoRef.current.currentTime = Math.max(0, current - 5);
          }}
        >
          <div className="timeline-fill" style={{ width: `${duration ? (current / duration) * 100 : 0}%` }} />
        </div>
        <span className="time-text">{formatTime(duration)}</span>
        <div className="volume-wrap">
          <button
            className="control-btn"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={() => {
              if (!videoRef.current) return;
              videoRef.current.muted = !muted;
              setMuted(!muted);
            }}
          >{muted || volume === 0 ? <VolumeX /> : <Volume2 />}</button>
          <input
            className="volume-slider"
            aria-label="Volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={(event) => {
              const nextVolume = Number(event.target.value);
              setVolume(nextVolume);
              setMuted(nextVolume === 0);
              if (videoRef.current) {
                videoRef.current.volume = nextVolume;
                videoRef.current.muted = nextVolume === 0;
              }
            }}
          />
        </div>
        <select className="speed-select" value={speed} aria-label="Playback speed" onChange={(event) => setSpeed(Number(event.target.value))}>
          <option value="0.75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option>
        </select>
        <button
          className="control-btn"
          aria-label="Fullscreen"
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            if (document.fullscreenElement) void document.exitFullscreen();
            else void video.requestFullscreen();
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16" aria-hidden="true">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function StudySpace() {
  return (
    <div className="study-space" aria-label="StudyHub study guide preview">
      <div className="study-space-bar"><span className="mini-brand"><BookOpen size={15} /> studyhub</span><span>My learning space</span></div>
      <div className="study-space-body">
        <span className="study-space-label">YOUR STUDY GUIDE</span>
        <h3>Introduction to neural networks</h3>
        <p>A clear path through the fundamentals, with resources and a quiz to help you put ideas into practice.</p>
        <div className="study-space-items"><span><BookOpen /> 6 short sections</span><span><CircleHelp /> A quick knowledge check</span><span><Sparkles /> Ask the Study Buddy</span></div>
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const page = document.documentElement;
      setProgress(page.scrollHeight - page.clientHeight ? page.scrollTop / (page.scrollHeight - page.clientHeight) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="progress" style={{ transform: `scaleX(${progress})` }} />
      <nav className="site-nav">
        <div className="nav-inner">
          <a className="brand" href="#top" aria-label="StudyHub home"><span className="brand-mark"><BookOpen /></span>StudyHub</a>
          <button className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#overview" onClick={closeMenu}>Overview</a>
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#technology" onClick={closeMenu}>Technology</a>
            <a href="#about" onClick={closeMenu}>About Sarah</a>
            <a className="nav-cta" href="#demo" onClick={closeMenu}><Play size={12} /> Watch demo</a>
          </div>
        </div>
      </nav>

      <main id="top">
        <section className="video-section" id="demo" aria-label="StudyHub product walkthrough">
          <div className="container">
            <VideoPlayer />
            <div className="video-intro">
              <span className="section-kicker">A two-minute walkthrough · 02:01</span>
              <h1>See StudyHub in action.</h1>
              <p>From a learning question to a study guide, a quiz, and a place to keep it all.</p>
            </div>
          </div>
        </section>

        <section className="hero section" id="overview">
          <div className="container hero-grid">
            <div className="hero-copy-block">
              <span className="section-kicker">An AI-powered learning experience</span>
              <h2>Stop searching.<br /><span>Start learning.</span></h2>
              <p>StudyHub turns a topic search into a structured, interactive learning experience, bringing study material, questions, and useful resources together.</p>
              <a className="button primary" href="#features">Explore the platform <ArrowRight size={15} /></a>
              <div className="creator">Designed &amp; developed by <strong>Sarah Pardeshi</strong></div>
            </div>
            <StudySpace />
          </div>
        </section>

        <section className="section" id="features">
          <div className="container">
            <div className="section-heading"><span className="section-kicker">The learning space</span><h2>Everything in one place.</h2><p>Each part of the experience is designed to help you stay with the subject you came to learn.</p></div>
            <div className="feature-list">
              {features.map(({ icon: Icon, title, body }, index) => (
                <article className="feature-row" key={title}><span className="feature-number">0{index + 1}</span><span className="feature-icon"><Icon /></span><div><h3>{title}</h3><p>{body}</p></div></article>
              ))}
            </div>
          </div>
        </section>

        <section className="section story-section">
          <div className="container story-grid">
            <article className="story-panel"><span className="section-kicker">Before</span><h2>Too many tabs.<br />Too little momentum.</h2><p>Learning something new can mean switching between search results, videos, books, and notes before the learning even begins.</p><div className="tabs-scattered"><span>Search results · neural networks</span><span>Video lecture · 18 min</span><span>Book chapter · AI</span><span>Study notes (draft)</span><span>Quiz questions</span></div></article>
            <article className="story-panel solution-panel"><span className="section-kicker">With StudyHub</span><h2>A place to follow<br />the thread.</h2><p>Study guides, quizzes, helpful resources, and AI-assisted explanations share one connected learning space.</p><div className="organized-ui"><div className="ui-head">Neural networks · Study guide</div><div className="ui-line"><i /> Foundations · 6 sections</div><div className="ui-line"><i /> Knowledge check · 8 questions</div><div className="ui-line"><i /> Study Buddy · follow-up chat</div></div></article>
          </div>
        </section>

        <section className="section" id="technology">
          <div className="container tech-grid">
            <div className="tech-copy"><span className="section-kicker">Under the surface</span><h2>Built with technology.<br />Designed around people.</h2><p>A familiar web stack and generative AI come together to organise a more approachable learning experience.</p><div className="tech-list"><span>MongoDB</span><span>Express.js</span><span>React.js</span><span>Node.js</span><span>Generative AI / LLM API</span></div></div>
            <div className="flow" aria-label="Product architecture flow"><div className="flow-row"><div className="flow-node"><GraduationCap /><span>User input</span></div><i>→</i><div className="flow-node"><Code2 /><span>React frontend</span></div><i>→</i><div className="flow-node"><Zap /><span>Node.js / Express</span></div></div><div className="flow-bottom"><div className="flow-node"><Brain /><span>AI integration</span></div><i>→</i><div className="flow-node"><BookOpen /><span>Structured learning · MongoDB</span></div></div><p className="flow-note">From a learning question to a connected study experience.</p></div>
          </div>
        </section>

        <section className="section dev-section" id="about">
          <div className="container"><div className="section-heading"><span className="section-kicker">The person behind StudyHub</span><h2>Meet Sarah.</h2></div>
            <div className="dev-card"><aside className="dev-aside"><div className="avatar-art">SP</div><h3>Sarah Pardeshi</h3><p>Computer Science undergraduate<br />AI/ML · Python · Machine Learning</p><div className="social-links"><a href="https://linkedin.com/in/sarah-pardeshi" target="_blank" rel="noreferrer" aria-label="Sarah on LinkedIn"><Linkedin /></a><a href="https://github.com/Sarahpardeshi" target="_blank" rel="noreferrer" aria-label="Sarah on GitHub"><Github /></a></div></aside>
              <div className="dev-main"><h3>Curiosity, turned into software.</h3><p>I&apos;m a Computer Science undergraduate interested in building practical AI-powered applications and intelligent software systems. I enjoy exploring how emerging technologies can solve everyday problems through thoughtful engineering and user-focused design.</p><div className="skill-pills"><span>AI/ML &amp; Generative AI</span><span>Python &amp; Machine Learning</span><span>MERN Stack Development</span><span>AI-powered applications</span><span>Problem-solving &amp; experimentation</span></div><div className="academic"><div>Somaiya Vidyavihar University<span>B.Sc. Computer Science Honours</span></div><div>Graduation · 2027<span>CGPA · 9.77</span></div></div></div>
            </div>
          </div>
        </section>

        <section className="section projects-section"><div className="container"><div className="section-heading"><span className="section-kicker">A few more things I’ve built</span><h2>More experiments.<br />More problem-solving.</h2></div><div className="projects-grid"><article className="project-card"><span>Machine learning</span><h3>Online Payment Fraud Prediction</h3><p>Random Forest-based fraud detection, with feature engineering, preprocessing, and evaluation using precision, recall, F1-score, and a confusion matrix.</p></article><article className="project-card"><span>Real-time collaboration</span><h3>Video Conferencing Platform</h3><p>A MERN-based application with WebRTC, Socket.io, video calls, chat, screen sharing, and collaborative features.</p></article></div></div></section>

        <section className="cta-section"><div className="container"><span className="section-kicker">Get in touch</span><h2>Curious about what we could build next?</h2><p>I&apos;m always interested in exploring new ideas, building intelligent systems, and solving meaningful problems with technology.</p><div className="cta-actions"><a className="button primary" href="https://linkedin.com/in/sarah-pardeshi" target="_blank" rel="noreferrer">Connect on LinkedIn <Linkedin size={14} /></a><a className="button" href="https://github.com/Sarahpardeshi" target="_blank" rel="noreferrer">Explore GitHub <Github size={14} /></a><a className="button" href="mailto:sarahpardeshi09@gmail.com">Email Sarah <ArrowRight size={14} /></a></div></div></section>
      </main>
      <footer className="footer"><div className="footer-inner"><span>© 2026 Sarah Pardeshi · StudyHub</span><a href="#top">Back to top ↑</a></div></footer>
    </>
  );
}
