"use client";

import { useEffect, useState, useCallback } from "react";
import { FiPlus, FiTrash2, FiSave } from "react-icons/fi";
import Toast from "@/components/Toast";

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  order: number;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
  order: number;
}

interface Skill {
  id: string;
  name: string;
  level: string;
  order: number;
}

interface ResumeData {
  id: string;
  templateId: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  showOnPortfolio: boolean;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
}

const templates = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
];

export default function ResumePage() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch("/api/resume");
    if (r.ok) setResume(await r.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveInfo = async () => {
    if (!resume) return;
    setSaving(true);
    await fetch("/api/resume", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: resume.templateId,
        fullName: resume.fullName,
        jobTitle: resume.jobTitle,
        email: resume.email,
        phone: resume.phone,
        location: resume.location,
        website: resume.website,
        summary: resume.summary,
        showOnPortfolio: resume.showOnPortfolio,
      }),
    });
    setSaving(false);
    setToast(true);
  };

  const addExperience = async () => {
    const r = await fetch("/api/resume/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (r.ok) load();
  };

  const updateExperience = async (id: string, data: Partial<Experience>) => {
    await fetch(`/api/resume/experience/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const deleteExperience = async (id: string) => {
    await fetch(`/api/resume/experience/${id}`, { method: "DELETE" });
    load();
  };

  const addEducation = async () => {
    const r = await fetch("/api/resume/education", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (r.ok) load();
  };

  const updateEducation = async (id: string, data: Partial<Education>) => {
    await fetch(`/api/resume/education/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const deleteEducation = async (id: string) => {
    await fetch(`/api/resume/education/${id}`, { method: "DELETE" });
    load();
  };

  const addSkill = async () => {
    const r = await fetch("/api/resume/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (r.ok) load();
  };

  const updateSkill = async (id: string, data: Partial<Skill>) => {
    await fetch(`/api/resume/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const deleteSkill = async (id: string) => {
    await fetch(`/api/resume/skills/${id}`, { method: "DELETE" });
    load();
  };

  const update = (key: keyof ResumeData, value: string | boolean) => {
    setResume((r) => r ? { ...r, [key]: value } : r);
  };

  if (loading) return <div className="text-[#888] text-sm">Loading...</div>;
  if (!resume) return <div className="text-[#888] text-sm">Could not load resume.</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-[#fafafa]">Resume Builder</h1>
        <button
          onClick={saveInfo}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#70E844] text-[#131313] hover:bg-[#5ed636] disabled:opacity-50"
        >
          <FiSave size={14} />
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Template & Settings */}
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5">
          <h2 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-4">Template & Settings</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => update("templateId", t.id)}
                className={`px-4 py-3 rounded-lg text-sm font-medium border transition-colors ${
                  resume.templateId === t.id
                    ? "border-[#70E844] bg-[#70E844]/10 text-[#70E844]"
                    : "border-[#2a2a2a] text-[#888] hover:text-[#fafafa] hover:border-[#555]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-[#ccc] cursor-pointer">
            <input
              type="checkbox"
              checked={resume.showOnPortfolio}
              onChange={(e) => update("showOnPortfolio", e.target.checked)}
              className="w-4 h-4 rounded border-[#2a2a2a] accent-[#70E844]"
            />
            Show resume on public portfolio
          </label>
        </div>

        {/* Personal Info */}
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5">
          <h2 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#888] mb-1 block">Full Name</label>
              <input className="dash-input" value={resume.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label className="text-xs text-[#888] mb-1 block">Job Title</label>
              <input className="dash-input" value={resume.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} placeholder="Full Stack Developer" />
            </div>
            <div>
              <label className="text-xs text-[#888] mb-1 block">Email</label>
              <input className="dash-input" value={resume.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" />
            </div>
            <div>
              <label className="text-xs text-[#888] mb-1 block">Phone</label>
              <input className="dash-input" value={resume.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 555 123 4567" />
            </div>
            <div>
              <label className="text-xs text-[#888] mb-1 block">Location</label>
              <input className="dash-input" value={resume.location} onChange={(e) => update("location", e.target.value)} placeholder="New York, NY" />
            </div>
            <div>
              <label className="text-xs text-[#888] mb-1 block">Website</label>
              <input className="dash-input" value={resume.website} onChange={(e) => update("website", e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="mt-3">
            <label className="text-xs text-[#888] mb-1 block">Professional Summary</label>
            <textarea className="dash-input min-h-[100px]" value={resume.summary} onChange={(e) => update("summary", e.target.value)} placeholder="Brief professional summary..." />
          </div>
        </div>

        {/* Experience */}
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-[#888] uppercase tracking-wider">Experience</h2>
            <button onClick={addExperience} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#70E844] text-[#131313] hover:bg-[#5ed636]">
              <FiPlus size={12} /> Add
            </button>
          </div>
          {resume.experiences.length === 0 && (
            <p className="text-[#555] text-sm text-center py-4">No experience entries yet.</p>
          )}
          <div className="space-y-4">
            {resume.experiences.map((exp) => (
              <div key={exp.id} className="border border-[#2a2a2a] rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                    <input className="dash-input" defaultValue={exp.position} onBlur={(e) => updateExperience(exp.id, { position: e.target.value })} placeholder="Position" />
                    <input className="dash-input" defaultValue={exp.company} onBlur={(e) => updateExperience(exp.id, { company: e.target.value })} placeholder="Company" />
                  </div>
                  <button onClick={() => deleteExperience(exp.id)} className="ml-2 p-1.5 text-[#888] hover:text-[#FE454E] transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input className="dash-input" defaultValue={exp.location} onBlur={(e) => updateExperience(exp.id, { location: e.target.value })} placeholder="Location" />
                  <input className="dash-input" defaultValue={exp.startDate} onBlur={(e) => updateExperience(exp.id, { startDate: e.target.value })} placeholder="Start (e.g. Jan 2022)" />
                  <input className="dash-input" defaultValue={exp.endDate} onBlur={(e) => updateExperience(exp.id, { endDate: e.target.value })} placeholder="End (or Present)" />
                </div>
                <textarea className="dash-input min-h-[60px] text-xs" defaultValue={exp.description} onBlur={(e) => updateExperience(exp.id, { description: e.target.value })} placeholder="Description of responsibilities and achievements..." />
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-[#888] uppercase tracking-wider">Education</h2>
            <button onClick={addEducation} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#70E844] text-[#131313] hover:bg-[#5ed636]">
              <FiPlus size={12} /> Add
            </button>
          </div>
          {resume.educations.length === 0 && (
            <p className="text-[#555] text-sm text-center py-4">No education entries yet.</p>
          )}
          <div className="space-y-4">
            {resume.educations.map((edu) => (
              <div key={edu.id} className="border border-[#2a2a2a] rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                    <input className="dash-input" defaultValue={edu.school} onBlur={(e) => updateEducation(edu.id, { school: e.target.value })} placeholder="School / University" />
                    <input className="dash-input" defaultValue={edu.degree} onBlur={(e) => updateEducation(edu.id, { degree: e.target.value })} placeholder="Degree" />
                  </div>
                  <button onClick={() => deleteEducation(edu.id)} className="ml-2 p-1.5 text-[#888] hover:text-[#FE454E] transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input className="dash-input" defaultValue={edu.field} onBlur={(e) => updateEducation(edu.id, { field: e.target.value })} placeholder="Field of Study" />
                  <input className="dash-input" defaultValue={edu.startDate} onBlur={(e) => updateEducation(edu.id, { startDate: e.target.value })} placeholder="Start" />
                  <input className="dash-input" defaultValue={edu.endDate} onBlur={(e) => updateEducation(edu.id, { endDate: e.target.value })} placeholder="End" />
                </div>
                <textarea className="dash-input min-h-[60px] text-xs" defaultValue={edu.description} onBlur={(e) => updateEducation(edu.id, { description: e.target.value })} placeholder="Additional details..." />
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-[#888] uppercase tracking-wider">Skills</h2>
            <button onClick={addSkill} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#70E844] text-[#131313] hover:bg-[#5ed636]">
              <FiPlus size={12} /> Add
            </button>
          </div>
          {resume.skills.length === 0 && (
            <p className="text-[#555] text-sm text-center py-4">No skills added yet.</p>
          )}
          <div className="space-y-2">
            {resume.skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2">
                <input className="dash-input flex-1" defaultValue={skill.name} onBlur={(e) => updateSkill(skill.id, { name: e.target.value })} placeholder="Skill name" />
                <select className="dash-input w-32" defaultValue={skill.level} onChange={(e) => updateSkill(skill.id, { level: e.target.value })}>
                  <option value="">Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button onClick={() => deleteSkill(skill.id)} className="p-1.5 text-[#888] hover:text-[#FE454E] transition-colors">
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Toast message="Resume saved!" show={toast} onClose={() => setToast(false)} />
    </div>
  );
}
