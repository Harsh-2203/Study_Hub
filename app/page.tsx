"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, BookOpen, Brain, Check, CircleHelp, Github, Library, Linkedin,
  Menu, MessageCircle, Pause, Play, Search, Sparkles, Target, Volume2, VolumeX, X,
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

function FraudPreview() {
  return (
    <div className="project-visual fraud-visual" aria-label="Illustration of the fraud prediction workflow">
      <div className="preview-heading"><span>PAYMENT REVIEW</span><span>RANDOM FOREST</span></div>
      <div className="fraud-content"><div className="scatter"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><b/></div><div className="model-notes"><strong>Model evaluation</strong><span>Precision</span><span>Recall</span><span>F1-score</span><span>Confusion matrix</span></div></div>
      <div className="preview-foot"><span>Feature engineering</span><span>→</span><span>Preprocessing</span><span>→</span><span>Evaluation</span></div>
    </div>
  );
}

function CallPreview() {
  return (
    <div className="project-visual call-visual" aria-label="Illustration of a video call interface">
      <div className="call-top"><span>Room · study group</span><span>•••</span></div>
      <div className="call-body"><div className="call-screen"><div className="call-person"><i/><b/></div><div className="call-person warm"><i/><b/></div><div className="call-person lilac"><i/><b/></div><div className="call-person muted"><i/><b/></div></div><div className="call-chat"><strong>Messages</strong><i/><i/><i/><span>Write a message…</span></div></div>
      <div className="call-controls"><i/><i/><i/><i/><b>Leave</b></div>
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
          <a className="brand" href="#top" aria-label="Sarah Pardeshi home"><span className="brand-mark">SP</span><span>Sarah Pardeshi <small>PORTFOLIO · 2026</small></span></a>
          <button className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#work" onClick={closeMenu}>Work</a>
            <a href="#resume" onClick={closeMenu}>Resume</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a className="nav-cta" href="mailto:sarahpardeshi09@gmail.com" onClick={closeMenu}>Contact Sarah <ArrowRight size={13} /></a>
          </div>
        </div>
      </nav>

      <main id="top">
        <section className="portfolio-hero">
          <div className="container portfolio-grid">
            <div className="featured-video" id="demo">
              <VideoPlayer />
              <div className="video-caption"><span>FEATURED PROJECT · STUDYHUB</span><span>PRODUCT WALKTHROUGH&nbsp; 02:01</span></div>
            </div>
            <div className="profile-intro" id="overview">
              <span className="section-kicker">Computer science · AI / ML</span>
              <h1>Sarah<br /><span className="name-accent">Pardeshi</span><span className="period">.</span></h1>
              <h2>Thoughtful software.<br />Useful applications of AI.</h2>
              <p>I’m a Computer Science undergraduate who enjoys building practical software and exploring how AI can make everyday tasks a little easier.</p>
              <div className="profile-actions"><a className="button primary" href="mailto:sarahpardeshi09@gmail.com">Get in touch <ArrowRight size={14} /></a><a className="text-link" href="https://linkedin.com/in/sarah-pardeshi" target="_blank" rel="noreferrer">LinkedIn <ArrowRight size={13} /></a></div>
              <div className="profile-credit">Currently studying at <strong>Somaiya Vidyavihar University</strong></div>
            </div>
          </div>
          <div className="container quick-facts"><div><span>EDUCATION</span><strong>B.Sc. Computer Science Honours</strong></div><div><span>UNIVERSITY</span><strong>Somaiya Vidyavihar University</strong></div><div><span>GRADUATION</span><strong>2027</strong></div><div><span>CGPA</span><strong>9.77</strong></div></div>
        </section>

        <section className="section work-section" id="work">
          <div className="container">
            <div className="section-heading"><span className="section-kicker">Selected work · 01</span><h2>StudyHub</h2><p>An AI-powered learning platform that brings study guides, quizzes, helpful resources, and AI-assisted explanations into one connected experience.</p></div>
            <div className="study-project-grid">
              <div className="study-project-copy"><h3>From a topic to a place to learn.</h3><p>StudyHub is a learning product I developed to make the first steps into a new subject feel more organised and engaging.</p><div className="capability-list">{features.map(({ icon: Icon, title, body }) => <div className="capability" key={title}><Icon /><div><strong>{title}</strong><span>{body}</span></div></div>)}</div><a className="text-link" href="https://github.com/Harsh-2203/Study_Hub" target="_blank" rel="noreferrer">View project repository <ArrowRight size={13} /></a></div>
              <StudySpace />
            </div>
          </div>
        </section>

        <section className="section resume-section" id="resume">
          <div className="container resume-grid"><div><span className="section-kicker">Resume snapshot</span><h2>What I bring<br />to a team.</h2><p className="resume-summary">I enjoy learning by building—working across AI, machine learning, and full-stack applications, and turning early ideas into useful software.</p></div><div className="resume-details"><div className="resume-row"><span>01</span><div><strong>AI &amp; machine learning</strong><p>Generative AI, Python, machine learning, and practical experimentation.</p></div></div><div className="resume-row"><span>02</span><div><strong>Full-stack development</strong><p>MERN stack applications, real-time collaboration, and product-focused interfaces.</p></div></div><div className="resume-row"><span>03</span><div><strong>Education</strong><p>B.Sc. Computer Science Honours · Somaiya Vidyavihar University · 2027</p></div></div></div></div>
        </section>

        <section className="section projects-section"><div className="container"><div className="section-heading"><span className="section-kicker">Selected work · 02–03</span><h2>Other things I’ve built.</h2></div><div className="projects-grid"><article className="project-card"><FraudPreview /><div className="project-copy"><span>Machine learning</span><h3>Online Payment Fraud Prediction</h3><p>Random Forest-based fraud detection, with feature engineering, preprocessing, and evaluation using precision, recall, F1-score, and a confusion matrix.</p></div></article><article className="project-card"><CallPreview /><div className="project-copy"><span>Real-time collaboration</span><h3>Video Conferencing Platform</h3><p>A MERN-based application with WebRTC, Socket.io, video calls, chat, screen sharing, and collaborative features.</p></div></article></div></div></section>

        <section className="about-section" id="about"><div className="container about-inner"><div><span className="section-kicker">A little about me</span><h2>Curious by nature.<br />Practical by design.</h2></div><div><p>I’m a Computer Science undergraduate interested in building practical AI-powered applications and intelligent software systems. I enjoy exploring how emerging technologies can solve everyday problems through thoughtful engineering and user-focused design.</p><div className="about-tags"><span>Python</span><span>Machine learning</span><span>Generative AI</span><span>MERN stack</span><span>Problem-solving</span></div></div></div></section>

        <section className="cta-section"><div className="container"><span className="section-kicker">Contact</span><h2>Let’s make something useful.</h2><p>Interested in AI, automation, or thoughtful software? I’d be glad to connect.</p><div className="cta-actions"><a className="button primary" href="mailto:sarahpardeshi09@gmail.com">sarahpardeshi09@gmail.com <ArrowRight size={14} /></a><a className="button" href="https://github.com/Sarahpardeshi" target="_blank" rel="noreferrer">GitHub <Github size={14} /></a><a className="button" href="https://linkedin.com/in/sarah-pardeshi" target="_blank" rel="noreferrer">LinkedIn <Linkedin size={14} /></a></div></div></section>
      </main>
      <footer className="footer"><div className="footer-inner"><span>Sarah Pardeshi · Portfolio</span><a href="#top">Back to top ↑</a></div></footer>
    </>
  );
}
