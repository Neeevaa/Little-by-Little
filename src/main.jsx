import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, ArrowDownRight, ArrowRight, BookOpen, Brain, Check, CheckCircle2,
  ChevronLeft, ChevronRight, Circle, Clock3, Coffee, Droplets, Dumbbell,
  Flame, Flower2, Footprints, Heart, Leaf, Moon, NotebookPen, Pill, Plus,
  Sparkles, Sun, Sunrise, Target, Utensils, Waves, X, Zap
} from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "little-by-little-reset-v1";
const START_DATE = new Date(2026, 9, 21); // Day 1 start date; change if starting another day.

const dayPlans = [
  { focus: "Python refresh", task: "Functions, lists, dictionaries and loops", output: "Complete 3 short Python exercises", type: "learn" },
  { focus: "NumPy + Pandas", task: "Load, inspect and manipulate a CSV", output: "Explore one dataset", type: "learn" },
  { focus: "ML foundations", task: "Features, labels, training and test sets", output: "Explain the ML workflow in your own words", type: "learn" },
  { focus: "Data preparation", task: "Missing values, encoding and scaling", output: "Clean a small dataset", type: "learn" },
  { focus: "Linear regression", task: "Fit a model and inspect its errors", output: "Train your first regression model", type: "build" },
  { focus: "Classification", task: "Logistic regression and prediction labels", output: "Train a simple classifier", type: "build" },
  { focus: "Model evaluation", task: "Accuracy, precision, recall, F1 and overfitting", output: "Write a week-one summary", type: "review" },
  { focus: "Decision trees", task: "Compare a tree with a random forest", output: "Record the comparison", type: "build" },
  { focus: "Validation", task: "Cross-validation and data leakage", output: "Improve your evaluation approach", type: "learn" },
  { focus: "Feature engineering", task: "Test useful transformations and features", output: "Compare before and after", type: "build" },
  { focus: "ML pipeline", task: "Combine preprocessing and model training", output: "Create a repeatable pipeline", type: "build" },
  { focus: "Project setup", task: "Choose a small dataset and define a question", output: "Create your notebook and project structure", type: "project" },
  { focus: "Error analysis", task: "Visualize results and note limitations", output: "Add metrics, charts and limitations", type: "project" },
  { focus: "Ship it", task: "Review, README and interview practice", output: "Publish or update your GitHub project", type: "project" }
];

const habits = [
  { id: "skincare-am", label: "Morning skincare + sunscreen", icon: Sun, group: "Care" },
  { id: "breakfast", label: "Eat a proper breakfast", icon: Coffee, group: "Health" },
  { id: "water", label: "Drink water regularly", icon: Droplets, group: "Health" },
  { id: "movement-am", label: "Morning movement or recovery", icon: Activity, group: "Move" },
  { id: "balanced-meals", label: "Balanced meals + nourishing snack", icon: Utensils, group: "Health" },
  { id: "walk", label: "Evening walk, jog or dance", icon: Footprints, group: "Move" },
  { id: "learning", label: "AI/ML focus session", icon: Brain, group: "Learn" },
  { id: "movement-pm", label: "Gentle night stretch / workout", icon: Dumbbell, group: "Move" },
  { id: "skincare-pm", label: "Evening cleanse + moisturizer", icon: Moon, group: "Care" },
  { id: "prep", label: "Prepare bag and plan tomorrow", icon: NotebookPen, group: "Reset" },
  { id: "sleep", label: "Protect bedtime", icon: Heart, group: "Reset" }
];

const schedule = [
  { time: "5:40 AM", title: "Wake up + morning skincare", detail: "Water, cleanse, niacinamide, moisturizer and SPF", icon: Sunrise, tag: "CARE", color: "sage" },
  { time: "6:00 AM", title: "Morning movement", detail: "10–15 minutes of comfortable movement", icon: Activity, tag: "MOVE", color: "peach" },
  { time: "6:20 AM", title: "Breakfast + get ready", detail: "Eat, pack lunch and fill your water bottle", icon: Coffee, tag: "NOURISH", color: "butter" },
  { time: "7:30–6:00", title: "College", detail: "Classes, lunch, snack and small movement breaks", icon: BookOpen, tag: "COLLEGE", color: "blue" },
  { time: "6:00 PM", title: "Reset + evening walk", detail: "Freshen up, then 15–20 minutes walking or dancing", icon: Footprints, tag: "MOVE", color: "rose" },
  { time: "7:00 PM", title: "AI/ML deep work", detail: "40 min learn · 15 min code · 5 min notes", icon: Brain, tag: "GROW", color: "lilac" },
  { time: "8:00 PM", title: "Dinner", detail: "Protein, vegetables and carbohydrates", icon: Utensils, tag: "NOURISH", color: "butter" },
  { time: "8:30 PM", title: "Gentle night movement", detail: "Glute bridges, bird dogs or easy stretching", icon: Waves, tag: "UNWIND", color: "sage" },
  { time: "9:00 PM", title: "Evening skincare + prep", detail: "Salicylic acid on planned nights, then moisturizer", icon: Moon, tag: "CARE", color: "blue" },
  { time: "9:40 PM", title: "Sleep", detail: "Wind down and aim for around 8 hours", icon: Heart, tag: "REST", color: "rose" }
];

const acidDays = [3, 6, 10, 13];
const initialState = { checks: {}, mlDone: {}, notes: {}, water: {}, startDate: START_DATE.toISOString() };

function loadState() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  } catch {
    return initialState;
  }
}
function dateForDay(day, startDate) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + day - 1);
  return date;
}
function dateLabel(date, options = { month: "short", day: "numeric" }) {
  return date.toLocaleDateString("en-US", options);
}
function dayKey(day) { return String(day); }

function App() {
  const [data, setData] = useState(loadState);
  const [activeDay, setActiveDay] = useState(1);
  const [section, setSection] = useState("Today");
  const [showNote, setShowNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const currentDate = dateForDay(activeDay, data.startDate || START_DATE.toISOString());
  const todayHabits = habits.filter(h => data.checks[dayKey(activeDay)]?.[h.id]).length;
  const habitPercent = Math.round((todayHabits / habits.length) * 100);
  const mlDone = !!data.mlDone[dayKey(activeDay)];
  const completedDays = Array.from({ length: 14 }, (_, i) => i + 1).filter(d =>
    habits.every(h => data.checks[dayKey(d)]?.[h.id])
  ).length;
  const allTicks = Object.values(data.checks).reduce((sum, day) => sum + Object.values(day || {}).filter(Boolean).length, 0);
  const overallPercent = Math.round((allTicks / (14 * habits.length)) * 100);
  const isAcidDay = acidDays.includes(activeDay);

  function toggleHabit(id) {
    setData(prev => {
      const key = dayKey(activeDay);
      const day = { ...(prev.checks[key] || {}) };
      day[id] = !day[id];
      return { ...prev, checks: { ...prev.checks, [key]: day } };
    });
  }
  function toggleMl() {
    setData(prev => ({ ...prev, mlDone: { ...prev.mlDone, [dayKey(activeDay)]: !prev.mlDone[dayKey(activeDay)] } }));
  }
  function setWater(count) {
    setData(prev => ({ ...prev, water: { ...prev.water, [dayKey(activeDay)]: count } }));
  }
  function saveNote() {
    setData(prev => ({ ...prev, notes: { ...prev.notes, [dayKey(activeDay)]: noteDraft } }));
    setShowNote(false);
  }
  function resetData() {
    sessionStorage.removeItem(STORAGE_KEY);
    setData({ ...initialState, startDate: START_DATE.toISOString() });
    setActiveDay(1);
    setShowReset(false);
  }

  const navItems = [
    { name: "Today", icon: Sun },
    { name: "14-day plan", icon: Target },
    { name: "AI / ML path", icon: Brain },
    { name: "My routines", icon: Flower2 }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={e => { e.preventDefault(); setSection("Today"); }}>
          <span className="brand-mark"><Flower2 size={21} strokeWidth={1.8}/></span>
          <span><strong>little by little</strong><small>YOUR 14-DAY RESET</small></span>
        </a>
        <div className="side-label">YOUR SPACE</div>
        <nav>
          {navItems.map(item => {
            const Icon = item.icon;
            return <button key={item.name} className={`nav-item ${section === item.name ? "active" : ""}`} onClick={() => setSection(item.name)}>
              <Icon size={17}/><span>{item.name}</span>{section === item.name && <span className="nav-dot"/>}
            </button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="tiny-quote"><Sparkles size={17}/><p>Small steps still move you forward.</p><span>— a note to self</span></div>
          <div className="storage-note"><span className="online-dot"/> Saved in this tab's session</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="breadcrumb">My space <ChevronRight size={14}/> <span>{section}</span></div>
          <div className="top-actions"><span className="date-chip"><Sun size={15}/>{dateLabel(currentDate, { weekday: "short", month: "short", day: "numeric" })}</span><div className="avatar">N</div></div>
        </header>

        {section === "Today" && <Dashboard {...{activeDay,setActiveDay,currentDate,todayHabits,habitPercent,completedDays,overallPercent,allTicks,isAcidDay,mlDone,data,toggleHabit,toggleMl,setWater,showNote,setShowNote,noteDraft,setNoteDraft,saveNote,setSection,showReset,setShowReset}} />}
        {section === "14-day plan" && <PlanPage {...{activeDay,setActiveDay,data,setSection}} />}
        {section === "AI / ML path" && <LearningPage {...{activeDay,setActiveDay,data,toggleMl}} />}
        {section === "My routines" && <RoutinePage {...{activeDay,setActiveDay,isAcidDay}} />}

        <footer className="footer"><span>Made for your real life, not a perfect one.</span><span><Leaf size={13}/> Little by little © 2026</span></footer>
      </main>

      {showNote && <div className="modal-backdrop" onClick={() => setShowNote(false)}><div className="modal" onClick={e => e.stopPropagation()}>
        <button className="icon-button modal-close" onClick={() => setShowNote(false)} aria-label="Close"><X size={18}/></button>
        <div className="eyebrow">DAY {activeDay} REFLECTION</div><h2>A little note to self</h2>
        <p className="muted">What did you learn, enjoy, or want to try tomorrow?</p>
        <textarea value={noteDraft} onChange={e => setNoteDraft(e.target.value)} placeholder="Today I showed up by..." rows={5}/>
        <button className="primary-button full" onClick={saveNote}>Save reflection <ArrowRight size={16}/></button>
      </div></div>}
      {showReset && <div className="modal-backdrop" onClick={() => setShowReset(false)}><div className="modal small-modal" onClick={e => e.stopPropagation()}>
        <h2>Start fresh?</h2><p className="muted">This clears all checklists, notes and progress saved for this tab.</p>
        <div className="modal-actions"><button className="secondary-button" onClick={() => setShowReset(false)}>Keep progress</button><button className="danger-button" onClick={resetData}>Reset everything</button></div>
      </div></div>}
    </div>
  );
}

function Dashboard(props) {
  const { activeDay, setActiveDay, currentDate, todayHabits, habitPercent, completedDays, overallPercent, allTicks, isAcidDay, mlDone, data, toggleHabit, toggleMl, setWater, setSection, setShowNote, setNoteDraft, showReset, setShowReset } = props;
  const water = data.water[dayKey(activeDay)] || 0;
  const plan = dayPlans[activeDay - 1];
  const note = data.notes[dayKey(activeDay)] || "";
  return <div className="page-content">
    <section className="welcome-row">
      <div><div className="eyebrow"><Sparkles size={13}/> YOUR SOFTER, STRONGER ROUTINE</div><h1>Hey, you. <em>You're growing.</em></h1><p className="welcome-sub">One day at a time. Let's make today count in ways that feel good.</p></div>
      <div className="day-switcher"><button className="round-button" onClick={() => setActiveDay(Math.max(1, activeDay - 1))} disabled={activeDay === 1}><ChevronLeft size={17}/></button><div><small>YOUR JOURNEY</small><strong>Day {String(activeDay).padStart(2, "0")} <span>of 14</span></strong></div><button className="round-button" onClick={() => setActiveDay(Math.min(14, activeDay + 1))} disabled={activeDay === 14}><ChevronRight size={17}/></button></div>
    </section>

    <section className="hero-card">
      <div className="hero-copy"><span className="hero-pill"><span className="hero-spark">✳</span> TODAY'S LITTLE PROMISE</span><h2>Progress, not<br/><em>perfection.</em></h2><p>You've got a full day ahead. Take care of your body, make a little space to learn, and remember to breathe.</p><div className="hero-bottom"><span><Sunrise size={16}/> {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span><span className="hero-separator"/> <span><Clock3 size={16}/> Your day, at your pace</span></div></div>
      <div className="hero-art" aria-hidden="true"><div className="sun-disc"/><div className="art-blob blob-one"/><div className="art-blob blob-two"/><div className="art-leaf leaf-one">✳</div><div className="art-leaf leaf-two">✿</div><div className="art-label">grow gently<br/>every day</div><div className="art-stem"/></div>
    </section>

    <section className="stats-grid">
      <StatCard label="Today's habits" value={`${todayHabits}/${habits.length}`} sub="little wins collected" icon={CheckCircle2} color="sage" progress={habitPercent}/>
      <StatCard label="14-day progress" value={`${overallPercent}%`} sub={`${allTicks} habits checked so far`} icon={Flame} color="peach" progress={overallPercent}/>
      <StatCard label="Full days" value={completedDays} sub="all habits checked off" icon={Sparkles} color="lilac" progress={Math.round(completedDays/14*100)}/>
    </section>

    <div className="content-grid">
      <section className="panel habits-panel">
        <div className="panel-heading"><div><div className="eyebrow">YOUR DAILY RHYTHM</div><h2>Little wins checklist <span className="heading-count">{todayHabits}/{habits.length}</span></h2></div><button className="text-button" onClick={() => setSection("My routines")}>View routine <ArrowRight size={14}/></button></div>
        <div className="habit-progress"><div style={{width: `${habitPercent}%`}}/></div>
        <div className="habit-list">
          {habits.map(h => { const Icon = h.icon; const checked = !!data.checks[dayKey(activeDay)]?.[h.id]; return <button key={h.id} className={`habit-row ${checked ? "checked" : ""}`} onClick={() => toggleHabit(h.id)}>
            <span className={`habit-icon ${h.group.toLowerCase()}`}><Icon size={17}/></span><span className="habit-label">{h.label}</span><span className={`check-circle ${checked ? "on" : ""}`}>{checked && <Check size={13}/>}</span>
          </button>; })}
        </div>
        <div className="panel-bottom-note"><Heart size={15}/> It's okay to do the gentle version on hard days.</div>
      </section>

      <div className="right-column">
        <section className="panel focus-panel">
          <div className="panel-heading"><div><div className="eyebrow">YOUR CAREER, ONE STEP AT A TIME</div><h2>AI / ML focus</h2></div><span className="icon-tile lilac"><Brain size={20}/></span></div>
          <div className="focus-day">DAY {String(activeDay).padStart(2, "0")} <span>· {plan.type.toUpperCase()}</span></div>
          <h3>{plan.focus}</h3><p>{plan.task}</p>
          <div className="output-box"><Target size={16}/><span><small>TODAY'S OUTPUT</small>{plan.output}</span></div>
          <button className={`primary-button full ${mlDone ? "done-button" : ""}`} onClick={toggleMl}>{mlDone ? <><CheckCircle2 size={16}/> Session complete</> : <><Zap size={16}/> Mark session complete</>}</button>
          <button className="text-button centered" onClick={() => setSection("AI / ML path")}>Explore your 14-day learning path <ArrowRight size={14}/></button>
        </section>

        <section className="panel water-panel">
          <div className="panel-heading"><div><div className="eyebrow">A GENTLE REMINDER</div><h2>Hydration check</h2></div><span className="icon-tile blue"><Droplets size={20}/></span></div>
          <p className="muted small">Keep sipping through the day, especially in warm weather.</p>
          <div className="water-cups">{Array.from({length:8},(_,i)=><button key={i} aria-label={`Water glass ${i+1}`} className={`water-cup ${water > i ? "filled" : ""}`} onClick={() => setWater(water === i+1 ? i : i+1)}><Droplets size={16}/></button>)}</div>
          <div className="water-foot"><strong>{water} <span>/ 8 glasses</span></strong><button className="tiny-add" onClick={() => setWater(Math.min(8, water+1))}><Plus size={14}/> Add</button></div>
          <p className="water-disclaimer">A visual reminder, not a strict target. Drink to thirst and adjust to your needs.</p>
        </section>
      </div>
    </div>

    <div className="bottom-grid">
      <section className="panel schedule-panel">
        <div className="panel-heading"><div><div className="eyebrow">BUILT AROUND COLLEGE</div><h2>Your daily flow</h2></div><span className="soft-badge">7:30 AM – 6 PM classes</span></div>
        <div className="timeline">{schedule.map((item,i)=>{ const Icon=item.icon; return <div className="timeline-row" key={item.title}><div className={`timeline-icon ${item.color}`}><Icon size={16}/></div><div className="timeline-content"><div className="timeline-title">{item.title}<span className={`tag ${item.color}`}>{item.tag}</span></div><p>{item.detail}</p></div><span className="timeline-time">{item.time}</span></div>; })}</div>
      </section>
      <section className="panel skincare-panel">
        <div className="panel-heading"><div><div className="eyebrow">CARE, NOT COMPLICATION</div><h2>Skincare notes</h2></div><span className="icon-tile rose"><Flower2 size={20}/></span></div>
        <div className="skin-routine"><span className="skin-symbol morning"><Sun size={18}/></span><div><strong>Morning ritual</strong><p>Cleanse → Niacinamide → Moisturizer → SPF 30–50</p></div><span className="everyday">DAILY</span></div>
        <div className="skin-routine"><span className="skin-symbol evening"><Moon size={18}/></span><div><strong>Evening ritual</strong><p>Cleanse → {isAcidDay ? "Salicylic acid → " : ""}Moisturizer</p></div><span className={`everyday ${isAcidDay ? "planned" : ""}`}>{isAcidDay ? "ACID NIGHT" : "GENTLE"}</span></div>
        <div className="acid-note"><Sparkles size={15}/><span>{isAcidDay ? "Salicylic acid is planned tonight. Skip it if your skin feels irritated." : "A gentle night tonight. Your next planned salicylic acid night is " + (acidDays.find(d => d > activeDay) ? `Day ${acidDays.find(d => d > activeDay)}` : "after this 14-day plan") + "."}</span></div>
        <button className="text-button" onClick={() => setSection("My routines")}>See all routine details <ArrowRight size={14}/></button>
      </section>
    </div>

    <section className="reflection-strip"><div className="reflection-icon"><NotebookPen size={20}/></div><div><strong>{note ? "Your note for today is saved" : "Leave a little note for yourself"}</strong><p>{note ? note : "A tiny reflection can help you notice how far you've come."}</p></div><button className="secondary-button" onClick={() => { setNoteDraft(note); setShowNote(true); }}>{note ? "Edit note" : "Write a note"} <ArrowRight size={15}/></button></section>
    <div className="last-actions"><button className="subtle-button" onClick={() => setShowReset(true)}>Reset all progress</button></div>
  </div>;
}

function StatCard({ label, value, sub, icon: Icon, color, progress }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon ${color}`}><Icon size={17}/></span></div><div className="stat-value">{value}</div><div className="stat-sub">{sub}</div><div className="mini-progress"><span style={{width: `${progress}%`}}/></div></div>;
}

function PlanPage({ activeDay, setActiveDay, data, setSection }) {
  return <div className="page-content">
    <PageTitle eyebrow="YOUR TWO-WEEK MAP" title={<>A plan that fits <em>real life.</em></>} sub="Fourteen days of small, repeatable habits — with room for imperfect days."/>
    <div className="plan-summary"><div><span className="stat-icon sage"><CalendarIcon/></span><div><strong>14 days</strong><small>One day at a time</small></div></div><div><span className="stat-icon lilac"><Brain size={18}/></span><div><strong>14 learning steps</strong><small>Build as you learn</small></div></div><div><span className="stat-icon peach"><Heart size={18}/></span><div><strong>No perfection needed</strong><small>Consistency over intensity</small></div></div></div>
    <div className="day-grid">{dayPlans.map((p,i)=>{const day=i+1; const done=habits.every(h=>data.checks[dayKey(day)]?.[h.id]); return <button key={day} className={`day-card ${activeDay===day?"selected":""}`} onClick={()=>{setActiveDay(day);setSection("Today");}}><div className="day-card-top"><span className="day-number">DAY {String(day).padStart(2,"0")}</span>{done?<CheckCircle2 size={17} className="done-icon"/>:<span className={`type-dot ${p.type}`}/>}</div><h3>{p.focus}</h3><p>{p.task}</p><div className="day-card-bottom"><span>{p.type}</span><ArrowRight size={15}/></div></button>;})}</div>
    <div className="gentle-callout"><Sparkles size={19}/><div><strong>Your only job is to return.</strong><p>If a day gets busy, do the 20-minute version. Missing one habit doesn't erase the habits you've already built.</p></div></div>
  </div>;
}
function CalendarIcon(){return <Clock3 size={18}/>}

function LearningPage({ activeDay, setActiveDay, data, toggleMl }) {
  const doneCount = Object.values(data.mlDone).filter(Boolean).length;
  return <div className="page-content">
    <PageTitle eyebrow="BUILD YOUR ENGINEERING MUSCLE" title={<>Learn AI/ML by <em>building.</em></>} sub="A practical two-week path: one focused session, one tangible output, every day."/>
    <div className="learning-hero"><div className="learning-orb"><Brain size={34}/><span>AI</span></div><div className="learning-hero-copy"><div className="eyebrow">YOUR 14-DAY CHALLENGE</div><h2>From concepts to a small ML project.</h2><p>Spend 40 minutes learning, 15 minutes coding, and 5 minutes writing what you understood. Keep working in one notebook or repo.</p><div className="learning-progress"><div><span style={{width:`${doneCount/14*100}%`}}/></div><small>{doneCount} of 14 sessions completed</small></div></div></div>
    <div className="section-heading"><h2>Your learning roadmap</h2><span className="soft-badge">~60 min / day</span></div>
    <div className="learning-list">{dayPlans.map((p,i)=>{const d=i+1;const done=!!data.mlDone[dayKey(d)];return <div className={`learning-row ${activeDay===d?"current":""}`} key={d}><div className={`learning-check ${done?"done":""}`}>{done?<Check size={15}/>:String(d).padStart(2,"0")}</div><div className="learning-info"><div className="learning-title">{p.focus}<span className={`learning-type ${p.type}`}>{p.type}</span></div><p>{p.task}</p><small><Target size={13}/>{p.output}</small></div><button className={done?"secondary-button compact":"outline-button compact"} onClick={()=>{setActiveDay(d);if(activeDay===d)toggleMl();}}>{done?"Completed":activeDay===d?"Selected":"Select day"}</button></div>;})}</div>
    <div className="resource-note"><BookOpen size={19}/><div><strong>Free resources to keep close</strong><p><a href="https://www.kaggle.com/learn" target="_blank" rel="noreferrer">Kaggle Learn</a> for bite-sized practice · <a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noreferrer">scikit-learn user guide</a> for model workflows · <a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noreferrer">Python tutorial</a> for refreshers.</p></div></div>
  </div>;
}

function RoutinePage({ activeDay, setActiveDay, isAcidDay }) {
  return <div className="page-content">
    <PageTitle eyebrow="YOUR REPEATABLE RHYTHMS" title={<>Make room for <em>yourself.</em></>} sub="A simple reference for your morning, college day, evening, movement and skincare."/>
    <div className="routine-columns">
      <div className="panel routine-card"><div className="routine-card-title"><span className="routine-emoji sage"><Sunrise size={20}/></span><div><h2>Morning ritual</h2><p>5:40–7:15 AM</p></div></div><RoutineStep n="01" title="Wake + hydrate" text="Brush your teeth and have a glass of water. Lemon is optional."/><RoutineStep n="02" title="Skincare" text="Niacinamide, moisturizer and broad-spectrum SPF 30–50."/><RoutineStep n="03" title="Gentle movement" text="10–15 minutes of warm-up and comfortable bodyweight exercises."/><RoutineStep n="04" title="Fuel up" text="Eat breakfast and pack a lunch and snack for college."/></div>
      <div className="panel routine-card"><div className="routine-card-title"><span className="routine-emoji lilac"><Moon size={20}/></span><div><h2>Evening ritual</h2><p>6:00–10:00 PM</p></div></div><RoutineStep n="01" title="Walk or dance" text="15–20 minutes at a comfortable pace after college."/><RoutineStep n="02" title="AI/ML focus" text="40 minutes learning, 15 minutes coding and 5 minutes notes."/><RoutineStep n="03" title="Skincare" text={`Cleanse, ${isAcidDay?"salicylic acid if skin feels comfortable, then ":""}moisturizer.`}/><RoutineStep n="04" title="Wind down" text="Prepare tomorrow's bag, stretch gently and protect sleep."/></div>
    </div>
    <div className="panel acid-calendar"><div className="panel-heading"><div><div className="eyebrow">SKINCARE PLANNER</div><h2>Salicylic acid nights</h2></div><span className="icon-tile rose"><Flower2 size={19}/></span></div><p className="muted">Suggested starter schedule if you're new to salicylic acid. Follow your product's directions and skip it if your skin is irritated.</p><div className="acid-day-grid">{Array.from({length:14},(_,i)=>{const d=i+1;const acid=acidDays.includes(d);return <button key={d} className={`acid-day ${acid?"acid":"gentle"} ${activeDay===d?"chosen":""}`} onClick={()=>setActiveDay(d)}><span>DAY {d}</span><strong>{acid?"Active night":"Gentle night"}</strong><small>{acid?"Salicylic acid*":"Cleanse + moisturize"}</small></button>;})}</div><p className="disclaimer">*Only use as directed on the label. Don't layer with other exfoliating actives while establishing tolerance. Use sunscreen every morning.</p></div>
    <div className="meal-note"><Utensils size={20}/><div><strong>Food rule: nourishment, not punishment.</strong><p>Build meals around vegetables and fruit, protein, and rice, roti or another carbohydrate. Eat enough to feel satisfied. No crash diets or fat-burning drinks required.</p></div></div>
  </div>;
}
function RoutineStep({n,title,text}){return <div className="routine-step"><span>{n}</span><div><strong>{title}</strong><p>{text}</p></div><CheckCircle2 size={17}/></div>}
function PageTitle({eyebrow,title,sub}){return <div className="page-title"><div className="eyebrow"><Sparkles size={13}/>{eyebrow}</div><h1>{title}</h1><p>{sub}</p></div>}

createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
